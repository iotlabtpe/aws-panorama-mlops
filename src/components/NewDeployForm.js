
import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';
import Select from 'aws-northstar/components/Select';
import Multiselect from 'aws-northstar/components/Multiselect';
import Modal from 'aws-northstar/components/Modal';

import { API } from 'aws-amplify';

import React from 'react';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { LoadingIndicator } from 'aws-northstar';

const mapStateToProps = state => {
  return { session: state.session, language: state.lang.language, languageList: state.lang.languageList }
}

const MapDispatchTpProps = (dispatch) => {
  return {
    changeLang: (key) => dispatch({ type: 'change_language', data: key })
  }
}


class NewDeployForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,

      //Camera Data
      Cameras: [], // All the camera data
      All_Cameras_Options: [], // label camera data 
      Chose_Camera: {}, // choose camera data
      Chose_Camera_Name: "", // choose camera name

      //Device Data
      Devices: [],
      All_Devices_Options: [],
      Chose_Device: {},
      Chose_Device_UUID: "device-ylaq25peslngbrowu2bmlqxp24",

      targetArn: 's3://app-graph-4c1bb430-172b-11ed-b380-0647bab7fb5a/graph/ppa-2022-08-08-16-00-25/graph.json',
      deploymentName: 'Deployment-APP',

      errorDeploymentName: false,
      errorS3Uri: false,
      visible: false,
      post_result: '',
    }
  }


  componentDidMount() {
    this.load_data();
  }

  componentWillUnmount() {

  }

  async load_data() {
    await API.get('backend', '/camera').then(res => {
      console.log(res)
      if (res) {
        console.log(res)
        var _tmp_data = []
        let option_data = []
        res.forEach((item) => {
          let camera_info = {}
          let camera_option = {}
          camera_info['NodeId'] = item['NodeId']
          camera_option['label'] = item['NodeId']
          camera_option['value'] = item['NodeId']
          camera_info['Name'] = item['Name']
          // _tmp['address'] = item['address']
          // _tmp['description'] = item['description']
          // _tmp['location'] = item['location']
          // _tmp['network'] = item['network']
          // _tmp['image_size'] = item['image_size'] 
          _tmp_data.push(camera_info)
          option_data.push(camera_option)

        });
        this.setState({ All_Cameras_Options: option_data });
        this.setState({ Cameras: _tmp_data }, () => {
          this.setState({ loading: false })
        })
      }
      // console.log(this.state.model_list)
      return res
    })
    await API.get('backend', '/device').then(res => {
      // await axios.get('/test_cors', {dataType: 'json'}).then(res => {
      console.log(res)
      if (res) {
        console.log(res)
        let _tmp_data = []
        let option_data = []
        res.forEach((item) => {
          let _tmp = {}
          let device_option = {}
          _tmp['Name'] = item['Name']
          _tmp['DeviceId'] = item['DeviceId']
          device_option['label'] = item['Name']
          device_option['value'] = item['Name']

          _tmp['device_core_name'] = item['device_core_name']
          _tmp['core_arn'] = item['core_arn']
          _tmp['type'] = item['type']
          _tmp['use_gpu'] = item['use_gpu']
          _tmp['storage'] = item['storage']


          _tmp_data.push(_tmp)
          option_data.push(device_option)
        });
        this.setState({ All_Devices_Options: option_data });
        this.setState({ Devices: _tmp_data }, () => {
          this.setState({ loading: false })
        })
      }
      // console.log(this.state.model_list)
      return res
    })
  }

  submit() {
    // console.log(e)
    const payload = {
      "deviceId": this.state.Chose_Device_UUID,
      "cameraNames": this.state.Chose_Camera_Name,
      "targetArn": this.state.targetArn,
      "deploymentName": this.state.deploymentName,
    };

    // const HEADERS = {'Content-Type': 'application/json'};
    // const apiUrl = '/deployment';
    // // var result = "=> call"  + apiUrl + "\n";
    let result = "";

    console.log(payload);
    API.post('backend', '/createDeployment', { body: payload }).then(response => {
      console.log(response);
      if (response) { 
        this.setState({ post_result: response }, () => {
          this.setState({ visible: true })
        })
      }
      // console.log(result)
    }).catch((e)=>{
      console.log(e) 
      this.setState({ post_result: "Something wrong with the input" }, () => {
        this.setState({ visible: true })
      })
    })
  }

  closeModel() {
    this.setState({ visible: false })
    this.props.history.push("/DeployConfig")
  }

  handelInputChange(e, key) {
  
    if(key === 'targetArn'){
      console.log('true')
      if(/\s/g.test(e) === true || e === ""){
        console.log('have space')
        this.setState({ errorS3Uri : true})
      }
      else{
        this.setState({ errorS3Uri : false})
      }
    }
    if(key === 'deploymentName'){
      console.log('true')
      if(/\s/g.test(e) === true || e === "" ){
        console.log('have space')
        this.setState({ errorDeploymentName : true})
      }
      else{
        this.setState({ errorDeploymentName : false})
      }
    }
    this.setState({ [key]: e })
  }

  handleTextChange(e, key) {
    this.setState({ [key]: e.target.value })
  }

  handleCameraSelectedChange(e) {
    console.log(e);
    let nameArray = []
    e.forEach((camera) => {
      nameArray.push(this.state.Cameras.find((o) => o.NodeId === camera.value).Name);
    })
    const name = nameArray.join();
    console.log(name);
    this.setState({ Chose_Camera_Name: name });

  }

  handleDeviceSelectedChange(e) {
    console.log(e.target.value);
    const selected = this.state.All_Devices_Options.find((o) => o.value === e.target.value);
    const uuid = this.state.Devices.find((o) => o.Name === e.target.value).DeviceId;
    this.setState({ Chose_Device_UUID: uuid });
    this.setState({ Chose_Device: selected })

  }


  render() {
    const {
      props: { t }
    } = this;

    return (

      <div>
        {this.state.loading === true ? <LoadingIndicator size="big" /> : <><Form
          actions={
            <div>
              {/* <Button variant="link">Cancel</Button> */}
              <Button variant="primary" onClick={() => this.submit()} disabled={this.state.errorDeploymentName || this.state.errorS3Uri ? true : false }  >Submit</Button>
            </div>
          }
          onSubmit={(e) => this.handleDeploy(e)}
        >
          <FormSection header={t("New Deployment")}>

            <FormField label="APP Name" controlId="formFieldId6" errorText={ this.state.errorDeploymentName ? 'Your input is not correct' : undefined  } >
              <Input type="text" controlId="input_dn" value={this.state.deploymentName} onChange={(e) => this.handelInputChange(e, 'deploymentName')} />
            </FormField>

            <FormField label="Device Name" controlId="formFieldId1">
              <Select
                options={this.state.All_Devices_Options}
                onChange={(e) => this.handleDeviceSelectedChange(e)}
                selectedOption={this.state.Chose_Device}
              />
            </FormField>

            <FormField label="Device UUID" controlId="formFieldId3">
              <Input type="text" controlId="input_mv_id" value={this.state.Chose_Device_UUID} placeholder={t("Device Choose Placeholder")} disabled />
              {/* <Text>{this.state.Chose_Device_UUID}</Text> */}
            </FormField>

            <FormField label="Camera Name" controlId="formFieldId2">
              <Multiselect
                options={this.state.All_Cameras_Options}
                onChange={(e) => this.handleCameraSelectedChange(e)}
                selectedOption={this.state.Chose_Camera}
              />
            </FormField>

            <FormField label="Camera ID" controlId="formFieldId4">
              <Input type="text" controlId="input_mv_id" value={this.state.Chose_Camera_Name} placeholder={t("Camera Choose Placeholder")} disabled />
              {/* <Text>{this.state.Chose_Camera_Name}</Text> */}
            </FormField>

            <FormField label="Graph.json Target S3 Position" controlId="formFieldId5" errorText={ this.state.errorS3Uri ? 'Your input is not correct' : undefined  } >
              <Input type="text" controlId="input_targetArn" value={this.state.targetArn} onChange={(e) => this.handelInputChange(e, 'targetArn')} />
            </FormField>

          </FormSection>
        </Form>
          <Modal title="Deploy" visible={this.state.visible} onClose={() => this.closeModel()}>
            {this.state.post_result}
          </Modal></>}

      </div>
    )
  }
}


export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(NewDeployForm));


// Deployment_ID
// Device_ID
// NodeId
// Component_Version_ID
// Model_Version_ID
// targetArn
// deploymentName
// components
// deploymentPolicies
// iotJobConfigurations

