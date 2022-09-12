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
import Select from 'aws-northstar/components/Select';

import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
  return { session: state.session }
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewStoredApplicationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        uploadMethod: "",
        s3Uri: "",
        options:[
            {label: "uri", value:"uri" },
            {label:"file",value:"file"}
        ]
    }
  }


  componentDidMount(){
  }

  componentWillUnmount(){

  }

  submit(){
    // console.log(e)
    const payload = {
      "copyUri": this.state.s3Uri,
      "uploadMethod": this.state.uploadMethod.value
    };
    console.log(payload);

    API.post('backend','/storedApplication',{ body: payload }).then(response => {
        console.log(response);
        if(response){
            this.setState({post_result: response},()=>{
            this.setState({visible:true})
            })
        }
    }).catch(()=>{
        this.setState({post_result: 'There are something wrong with the input !!!'})
        this.setState({visible:true})
    })
  }

  closeModel(){
    this.setState({visible:false})
    this.props.history.push("/StoredApplicationConfig")
  }

  handelInputChange(e,key){
    this.setState({[key]:e})
  }

  handleTextChange(e,key){
    this.setState({[key]:e.target.value})
  }
  handle

  render(){
    const {
      props: {t}
    } = this;
    return(
      <div>
        <Form
            actions={
                <div>
                    <Button variant="primary" onClick={() => this.submit()}  >Submit</Button>
                </div>
            }
            onSubmit={console.log}
        >
            <FormSection header={t("Stored Application")}>
                 <FormField label="Upload Method" controlId="formFieldId0">
                    <Select 
                        options={this.state.options}
                        onChange={(e) => this.setState({uploadMethod: this.state.options.find(o => o.value === e.target.value)})}
                        // onChange={(e) => console.log(e.target.value)}
                        selectedOption={this.state.uploadMethod}
                    />
                </FormField>

                <FormField label="S3 Uri" controlId="formFieldId1">
                    <Input type="text" controlId="address" value={this.state.s3Uri} onChange={(e)=> this.handelInputChange(e,'s3Uri')}  />
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


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewStoredApplicationForm));


