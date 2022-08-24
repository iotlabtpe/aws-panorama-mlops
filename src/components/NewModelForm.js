
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

class  NewModelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Model_ID:uuidv4(),
      Model_Name:'Mask',
      in_topic:'yolov5/in',
      out_topic:'yolov5/out',

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
      "Model_ID":this.state.Model_ID,
      "Model_Name": this.state.Model_Name,
      "in_topic": this.state.in_topic,
      "out_topic": this.state.out_topic,
    };
    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = '/cfg_model';
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    axios({ method: 'POST', url: `${apiUrl}`, data: payload ,headers: HEADERS}).then(response => {
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
    this.props.history.push("/ModelConfig")
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
            <FormSection header={t("New Model")}>
                 <FormField label="Model ID" controlId="formFieldId0">
                    <Input type="text" controlId="Model_ID" value={this.state.Model_ID} readonly />
                </FormField>

                <FormField label="Model Name" controlId="formFieldId1">
                    <Input type="text" controlId="Model_Name" value={this.state.Model_Name} onChange={(e)=> this.handelInputChange(e,'Model_Name')}  />
                </FormField>

                <FormField label="In Topic" controlId="formFieldId2">
                    <Input type="text" controlId="in_topic" value={this.state.in_topic} onChange={(e)=> this.handelInputChange(e,'in_topic')}  />
                </FormField>

                <FormField label="Out Topic" controlId="formFieldId3">
                    <Input type="text" controlId="out_topic" value={this.state.out_topic} onChange={(e)=> this.handelInputChange(e,'out_topic')}  />
                </FormField>

            </FormSection>
        </Form>
        <Modal title="Model" visible={this.state.visible} onClose={() => this.closeModel()}>
            {this.state.post_result}
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewModelForm));


// Model_ID
// Model_Name
// in_topic
// out_topic


