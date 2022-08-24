
import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';
import Select from 'aws-northstar/components/Select';
import Multiselect from 'aws-northstar/components/Multiselect';

import Modal from 'aws-northstar/components/Modal';
import axios from 'axios';
import { API } from 'aws-amplify';

import React from 'react';
import { connect } from 'react-redux'
import Textarea from 'aws-northstar/components/Textarea';

import { v4 as uuidv4 } from 'uuid';

// import mockData from '../mock/mockData'

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

      Deployment_ID: uuidv4(),
      Device_ID: '111',
      Component_Version_ID: '333',
      targetArn: 's3://app-graph-4c1bb430-172b-11ed-b380-0647bab7fb5a/graph/ppa-2022-08-08-16-00-25/graph.json',
      deploymentName: 'Cam_1 Deployment',
      components: JSON.stringify({ "componentVersion": "1.0.0", "configurationUpdate": { "reset": ["/network/useHttps", "/tags"], "merge": { "tags": ["/boiler/1/temperature", "/boiler/1/pressure", "/boiler/2/temperature", "/boiler/2/pressure"] } } }),
      deploymentPolicies: JSON.stringify({ "componentUpdatePolicy": { "action": "NOTIFY_COMPONENTS", "timeoutInSeconds": 30 }, "configurationValidationPolicy": { "timeoutInSeconds": 60 }, "failureHandlingPolicy": "ROLLBACK" }),
      iotJobConfigurations: JSON.stringify({ "abortConfig": { "criteriaList": [{ "action": "CANCEL", "failureType": "ALL", "minNumberOfExecutedThings": 100, "thresholdPercentage": 5 }] }, "jobExecutionsRolloutConfig": { "exponentialRate": { "baseRatePerMinute": 5, "incrementFactor": 2, "rateIncreaseCriteria": { "numberOfNotifiedThings": 10, "numberOfSucceededThings": 5 } }, "maximumPerMinute": 50 }, "timeoutConfig": { "inProgressTimeoutInMinutes": 5 } }),
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
      "Deployment_ID": this.state.Deployment_ID,
      "Device_ID": this.state.Chose_Device_UUID,
      "Camera_ID": this.state.Chose_Camera.value,
      "Component_Version_ID": this.state.Chose_Device_UUID,
      "Model_Version_ID": this.state.Chose_Camera_Name,
      "targetArn": this.state.targetArn,
      "deploymentName": this.state.deploymentName,
      "components": this.state.components,
      "deploymentPolicies": this.state.deploymentPolicies,
      "iotJobConfigurations": this.state.iotJobConfigurations,

    };

    // const HEADERS = {'Content-Type': 'application/json'};
    // const apiUrl = '/deployment';
    // // var result = "=> call"  + apiUrl + "\n";
    let result = "";

    console.log(payload);
    API.post('backend', '/deployment', { body: payload }).then(response => {
      console.log(response);
      if (response.status === 200) {
        result = "Post Deployment request successfully !"
      } else {
        result = "Post Deployment request successfully !"
      }
      this.setState({ post_result: result }, () => {
        this.setState({ visible: true })
      })
      // console.log(result)
    })
    // axios({ method: 'POST', url: `${apiUrl}`, data: payload ,headers: HEADERS}).then(response => {
    //     console.log(response);
    //     if (response.status === 200) {
    //         result = "Post Deployment request successfully !"
    //     } else {
    //         result = "Post Deployment request  error !"
    //     }
    //     this.setState({post_result:result},()=>{
    //       this.setState({visible:true})
    //     })
    //     // console.log(result)
    // })

    // this.setState({visible:true})
    // this.props.history.push("/")
  }

  closeModel() {
    this.setState({ visible: false })
    this.props.history.push("/DeployConfig")
  }

  handelInputChange(e, key) {
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
    // const selected = this.state.All_Cameras_Options.find((o) => o.value === e.target.value);
    // const name = this.state.Cameras.find((o) => o.NodeId === e.target.value).Name;
    this.setState({ Chose_Camera_Name: name });
    // this.setState({ Chose_Camera: selected })

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
              <Button variant="primary" onClick={() => this.submit()}  >Submit</Button>
            </div>
          }
          onSubmit={(e) => this.handleDeploy(e)}
        >
          <FormSection header={t("New Deployment")}>
            <FormField label="Deployment ID" controlId="formFieldId0">
              <Input type="text" controlId="input_dep_id" value={this.state.Deployment_ID} readonly />
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


            <FormField label="APP Name" controlId="formFieldId6">
              <Input type="text" controlId="input_dn" value={this.state.deploymentName} onChange={(e) => this.handelInputChange(e, 'deploymentName')} />
            </FormField>

            <FormField label="Graph.json Target S3 Position" controlId="formFieldId5">
              <Input type="text" controlId="input_targetArn" value={this.state.targetArn} onChange={(e) => this.handelInputChange(e, 'targetArn')} />
            </FormField>

            {/* <FormField label="Components" controlId="formFieldId7">
                  <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.components} onChange={(e)=>this.handleTextChange(e,'components')}> </Textarea> 
                </FormField> */}

            {/* <FormField label="Deployment Policies" controlId="formFieldId7">
                  <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.deploymentPolicies} onChange={(e)=>this.handleTextChange(e,'deploymentPolicies')}> </Textarea> 
                </FormField> */}

            {/* <FormField label="IoT Job Configurations" controlId="formFieldId7">
                  <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.iotJobConfigurations} onChange={(e)=>this.handleTextChange(e,'iotJobConfigurations')}> </Textarea> 
                </FormField> */}

          </FormSection>
        </Form>
          <Modal title="Deploy" visible={this.state.visible} onClose={() => this.closeModel()}>
            {/* {this.state.post_result} */}
            Successfully Deploy the application!!!
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

