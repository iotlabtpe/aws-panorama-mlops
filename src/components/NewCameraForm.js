
/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';

import Modal from 'aws-northstar/components/Modal';
import axios from 'axios';
import Amplify, { API } from 'aws-amplify';
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

class  NewCameraForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera_id:uuidv4(),
      address:'rtsp://1.1.1.1/',
      description:'lobby camera1',
      location:'Nanchang_F_1',
      brand:'Hikvision',
      network:'5G',
      image_size:'1280*720',
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
      "camera_id":this.state.camera_id,
      "address": this.state.address,
      "description": this.state.description,
      "location": this.state.location,
      "brand":this.state.brand,
      "network": this.state.network,
      "image_size": this.state.image_size
    };
    console.log(payload);
    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = '/camera';
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    API.post('backend','/camera',{ body: payload }).then(response => {
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
                 <FormField label="Camera ID" controlId="formFieldId0">
                    <Input type="text" controlId="camera_id" value={this.state.camera_id} readonly />
                </FormField>

                <FormField label="Address" controlId="formFieldId1">
                    <Input type="text" controlId="address" value={this.state.address} onChange={(e)=> this.handelInputChange(e,'address')}  />
                </FormField>

                <FormField label="Description" controlId="formFieldId6">
                  <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.description} onChange={(e)=>this.handleTextChange(e,'description')}> </Textarea> 
                </FormField>

                <FormField label="Name" controlId="formFieldId3">
                    <Input type="text" controlId="brand" value={this.state.brand} onChange={(e)=> this.handelInputChange(e,'brand')}  />
                </FormField>

                <FormField label="Account" controlId="formFieldId2">
                    <Input type="text" controlId="location" value={this.state.location} onChange={(e)=> this.handelInputChange(e,'location')}  />
                </FormField>

                <FormField label="Password" controlId="formFieldId4">
                    <Input type="text" controlId="network" value={this.state.network} onChange={(e)=> this.handelInputChange(e,'network')}  />
                </FormField>

                <FormField label="Image Size" controlId="formFieldId5">
                    <Input type="text" controlId="image_size" value={this.state.image_size} onChange={(e)=> this.handelInputChange(e,'image_size')}  />
                </FormField>
            </FormSection>
        </Form>
        <Modal title="Add Camera" visible={this.state.visible} onClose={() => this.closeModel()}>
            {/* {this.state.post_result} */}
            The Camera is successfully added !!!
        </Modal>
      </div>
    )
  }
}


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewCameraForm));


// camera_id
// address
// description
// location
// brand
// network
// image_size

