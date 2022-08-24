
import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';

import Modal from 'aws-northstar/components/Modal';
import { API } from 'aws-amplify';
import React  from 'react';
import { connect } from 'react-redux' 

import {v4 as uuidv4} from 'uuid';

// import mockData from '../mock/mockData'

import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
  return { session: state.session }
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewDeviceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      device_id:uuidv4(),
      device_name:'Qingpu_d1',
      device_core_name:'qingpu_core',
      core_arn:'arn:aws:iot:region:account-id:thing/thingName',
      type:'Jetson TX2',
      use_gpu:'TRUE',
      storage:'128G',

      visible:false,
      post_result:'',
    }
  }


  componentDidMount(){
  }

  componentWillUnmount(){

  }

  submit(){
    // console.log(e)
    const payload = {
      "device_id":this.state.device_id,
      "device_name": this.state.device_name,
      "device_core_name": this.state.device_core_name,
      "core_arn": this.state.core_arn,
      "type":this.state.type,
      "use_gpu": this.state.use_gpu,
      "storage": this.state.storage
    };
    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = '/device';
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    API.post('backend','/device',{ body: payload }).then(response => {
        console.log(response);
        if (response.status === 200) {
            result = "Post Component request successfully !"
        } else {
            result = "Post Component request  error !"
        }
        this.setState({post_result:result},()=>{
          this.setState({visible:true})
        })
        // console.log(result)
    })

    this.setState({visible:true})
    // this.props.history.push("/")
  }

  closeModel(){
    this.setState({visible:false})
    this.props.history.push("/DeviceConfig")
  }

  handelInputChange(e,key){
    this.setState({[key]:e})
  }

  handleTextChange(e,key){
    this.setState({[key]:e.target.value})
  }

  render(){
    const {
      props: {t}
    } = this;

    return(
      <div>
        <Form
            actions={
                <div>
                    {/* <Button variant="link">Cancel</Button> */}
                    <Button variant="primary" onClick={() => this.submit()}  >Submit</Button>
                </div>
            }
            onSubmit={console.log}
        >
            <FormSection header={t("New Device Config")}>
                 <FormField label="Device ID" controlId="formFieldId0">
                    <Input type="text" controlId="device_id" value={this.state.device_id} readonly />
                </FormField>

                <FormField label="Name" controlId="formFieldId1">
                    <Input type="text" controlId="device_name" value={this.state.device_name} onChange={(e)=> this.handelInputChange(e,'device_name')}  />
                </FormField>

                <FormField label="UUID" controlId="formFieldId2">
                    <Input type="text" controlId="device_core_name" value={this.state.device_core_name} onChange={(e)=> this.handelInputChange(e,'device_core_name')}  />
                </FormField>

                {/* <FormField label="Core ARN" controlId="formFieldId3">
                    <Input type="text" controlId="core_arn" value={this.state.core_arn} onChange={(e)=> this.handelInputChange(e,'core_arn')}  />
                </FormField>

                <FormField label="Type" controlId="formFieldId4">
                    <Input type="text" controlId="type" value={this.state.type} onChange={(e)=> this.handelInputChange(e,'type')}  />
                </FormField>

                <FormField label="Use GPU" controlId="formFieldId5">
                    <Input type="text" controlId="use_gpu" value={this.state.use_gpu} onChange={(e)=> this.handelInputChange(e,'use_gpu')}  />
                </FormField>

                <FormField label="storage" controlId="formFieldId6">
                    <Input type="text" controlId="storage" value={this.state.storage} onChange={(e)=> this.handelInputChange(e,'storage')}  />
                </FormField> */}

            </FormSection>
        </Form>
        <Modal title="Add Device" visible={this.state.visible} onClose={() => this.closeModel()}>
            {/* {this.state.post_result} */}
            The device is already successfully added !!! 
        </Modal>
      </div>
    )
  }
}


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewDeviceForm));


// device_id
// device_name
// device_core_name
// core_arn
// type
// use_gpu
// storage


