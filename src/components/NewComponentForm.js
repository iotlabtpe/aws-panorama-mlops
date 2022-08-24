
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

import {withTranslation} from 'react-i18next'
const mapStateToProps = state => {
  return { session: state.session }
}


const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewComponentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Component_ID:uuidv4(),
      ComponentName:'com.example.event-process',
      ComponentType:'aws.greengrass.generic',
      ComponentPublisher:'chenxj@amazon.com',
      ComponentDescription:'This is a simple stream component written in Python.',
      
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
      "Component_ID":this.state.Component_ID,
      "ComponentName": this.state.ComponentName,
      "ComponentType": this.state.ComponentType,
      "ComponentPublisher": this.state.ComponentPublisher,
      "ComponentDescription": this.state.ComponentDescription,
    };
    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = '/component';
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
    this.props.history.push("/ComponentConfig")
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
                    <Button variant="primary" onClick={(e) => this.submit(e)}  >Submit</Button>
                </div>
            }
            onSubmit={console.log}
        >
            <FormSection header={t("New Component Config")}>
                 <FormField label="Component ID" controlId="formFieldId0">
                    <Input type="text" controlId="Component_ID" value={this.state.Component_ID} readonly />
                </FormField>

                <FormField label="Component Name" controlId="formFieldId1">
                    <Input type="text" controlId="ComponentName" value={this.state.ComponentName} onChange={(e)=> this.handelInputChange(e,'ComponentName')}  />
                </FormField>

                <FormField label="Component Type" controlId="formFieldId2">
                    <Input type="text" controlId="ComponentType" value={this.state.ComponentType} onChange={(e)=> this.handelInputChange(e,'ComponentType')}  />
                </FormField>

                <FormField label="Component Publisher" controlId="formFieldId3">
                    <Input type="text" controlId="ComponentPublisher" value={this.state.ComponentPublisher} onChange={(e)=> this.handelInputChange(e,'ComponentPublisher')}  />
                </FormField>

                <FormField label="Component Description" controlId="formFieldId4">
                    <Textarea classname="LabelText" rows="10"  readonly={false} value={this.state.ComponentDescription} onChange={(e)=>this.handleTextChange(e,'ComponentDescription')}> </Textarea> 
                </FormField>
            </FormSection>
        </Form>
        <Modal title="Modal" visible={this.state.visible} onClose={() => this.closeModel()}>
            {this.state.post_result}
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewComponentForm));


// Component_ID
// ComponentName
// Description
// ComponentType
// ComponentDescription
// ComponentPublisher

