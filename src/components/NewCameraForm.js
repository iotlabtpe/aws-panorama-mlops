
/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';

import Modal from 'aws-northstar/components/Modal';
import { API } from 'aws-amplify';
import React  from 'react';
import { connect } from 'react-redux' 
import Textarea from 'aws-northstar/components/Textarea';
import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
  return { session: state.session }
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewCameraForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streamUrl:'rtsp://1.1.1.1/',
      description:'lobby camera1',
      username:'',
      cameraName:'',
      password:'',
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
      "streamUrl": this.state.streamUrl,
      "description": this.state.description,
      "username": this.state.username,
      "cameraName":this.state.cameraName,
      "password": this.state.password,
    };
    console.log(payload);
    var result = "";

    API.post('backend','/camera',{ body: payload }).then(response => {
        console.log(response);
        if (response) {
            result = "Post Component request successfully !"
        }
        this.setState({post_result:result},()=>{
          this.setState({visible:true})
        })
        // console.log(result)
    }).catch(()=>{
      this.setState({post_result:"There are something wrong with the request"},()=>{
        this.setState({visible:true})
      })
    })
  }

  closeModel(){
    this.setState({visible:false})
    this.props.history.push("/CameraConfig")
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
            <FormSection header={t("New Camera Config")}>

                <FormField label="Camera Name" controlId="formFieldId1">
                    <Input type="text" controlId="cameraName" value={this.state.cameraName} onChange={(e)=> this.handelInputChange(e,'cameraName')}  />
                </FormField>

                <FormField label="Stream Url" controlId="formFieldId2">
                    <Input type="text" controlId="streamUrl" value={this.state.streamUrl} onChange={(e)=> this.handelInputChange(e,'streamUrl')}  />
                </FormField>

                <FormField label="Description" controlId="formFieldId3">
                  <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.description} onChange={(e)=>this.handleTextChange(e,'description')}> </Textarea> 
                </FormField>

                <FormField label="Username" controlId="formFieldId4">
                    <Input type="text" controlId="username" value={this.state.username} onChange={(e)=> this.handelInputChange(e,'username')}  />
                </FormField>

                <FormField label="Password" controlId="formFieldId5">
                    <Input type="text" controlId="password" value={this.state.password} onChange={(e)=> this.handelInputChange(e,'password')}  />
                </FormField>
            </FormSection>
        </Form>
        <Modal title="Add Camera" visible={this.state.visible} onClose={() => this.closeModel()}>
            {this.state.post_result}
        </Modal>
      </div>
    )
  }
}


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewCameraForm));



