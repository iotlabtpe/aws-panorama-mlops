
/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';

import Modal from 'aws-northstar/components/Modal';
import axios from 'axios';

import React  from 'react';
import { connect } from 'react-redux' 
import Textarea from 'aws-northstar/components/Textarea';

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

class  NewModelVersionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Version_ID:uuidv4(),
      Model_ID:this.props.id,
      Version:'1.1',
      Asset_Location:'S3://xxxx/mask/mask-1.zip',
      Parameter:JSON.stringify({
        in_topic: "yolov5/out",   
        out_topic: "yolov5/in",   
        source_stream: "/dev/video1",   
        target_stream: "rtmp://71.131.207.183/hls/opencv"
     }),
     Lifecycle:JSON.stringify({
       "Run": "python3 {artifacts:path}/event_notification.py \"{configuration:/in_topic}\" \"{configuration:/iot_core_topic}\" \"{configuration:/bucket}\" \"{configuration:/prefix}\" \"{configuration:/device_id}\" \"{configuration:/region}\" \"{configuration:/location}\""
     }),
      visible:false,
      post_result:'',
    }
  }

  componentWillMount(){
  }

  componentDidMount(){
  }

  componentWillUnmount(){

  }

  submit(){
    // console.log(e)
    const payload = {
      "Model_ID":this.state.Model_ID,
      "Version_ID": this.state.Version_ID,
      "Version": this.state.Version,
      "Asset_Location": this.state.Asset_Location,
      "Parameter": this.state.Parameter,
      "Lifecycle": this.state.Lifecycle
    };
    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = '/cfg_model/version/'+this.props.id;
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    axios({ method: 'POST', url: `${apiUrl}`, data: payload ,headers: HEADERS}).then(response => {
        console.log(response);
        if (response.status === 200) {
            result = "Post Component Version request successfully !"
        } else {
            result = "Post Component Version request  error !"
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
    this.props.history.push("/ModelVersionConfig/"+this.props.id)
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
            <FormSection header={t("New Model Version Config")}>
                 <FormField label="Version ID" controlId="formFieldId0">
                    <Input type="text" controlId="Version_ID" value={this.state.Version_ID} />
                </FormField>

                <FormField label="Model ID" controlId="formFieldId1">
                    <Input type="text" controlId="Model_ID" value={this.state.Model_ID} onChange={(e)=> this.handelInputChange(e,'Model_ID')}  />
                </FormField>

                <FormField label="Version" controlId="formFieldId2">
                    <Input type="text" controlId="Version" value={this.state.Version} onChange={(e)=> this.handelInputChange(e,'Version')}  />
                </FormField>

                <FormField label="Asset Location" controlId="formFieldId3">
                    <Input type="text" controlId="Asset_Location" value={this.state.Asset_Location} onChange={(e)=> this.handelInputChange(e,'Asset_Location')}  />
                </FormField>

                <FormField label="Parameter" controlId="formFieldId4">
                    <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.Parameter} onChange={(e)=>this.handleTextChange(e,'Parameter')}> </Textarea> 
                </FormField>

                <FormField label="Lifecycle" controlId="formFieldId5">
                    <Textarea classname="Lifecycle" rows="10"  readonly={false} value={this.state.Lifecycle} onChange={(e)=>this.handleTextChange(e,'Lifecycle')}> </Textarea> 
                </FormField>

            </FormSection>
        </Form>
        <Modal title="Model Version" visible={this.state.visible} onClose={() => this.closeModel()}>
            {this.state.post_result}
        </Modal>
      </div>
    )
  }
}


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewModelVersionForm));


