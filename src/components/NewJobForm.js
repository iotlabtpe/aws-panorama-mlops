/* eslint-disable no-alert */

import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';
import Select from 'aws-northstar/components/Select';
import Modal from 'aws-northstar/components/Modal';
import axios from 'axios';
import React  from 'react';
import { connect } from 'react-redux' 

import {withTranslation} from 'react-i18next'
const mapStateToProps = state => {
  return { session: state.session }
}
const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewJobForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bot_name:'mtr_bot',
      number_of_bots:1,
      bulk_size:500,
      // s3_bucket:'sagemaker-us-west-2-034068151705',
      // s3_path:'DEMO-pytorch-yolov5-MTR/images/test',
      // output_s3_bucket:'sagemaker-us-west-2-034068151705',
      // output_s3_prefix:'DEMO-pytorch-yolov5-MTR/output5',

      s3_bucket:'aws-innovation-center-outofbox-demo',
      s3_path:'mask',
      output_s3_bucket:'aws-innovation-center-outofbox-demo',
      output_s3_prefix:'mask-output',

      visible:false,
      post_result:'',

      input_option:[],
      selectedOption:{value:''}
    }
  }

  componentDidMount(){
      axios.get('/byob', {dataType: 'json'}).then(res => {
        console.log(res)
        if (res.data){
            if (res.status === 200){
              var _option = []

              if (res.data.Items) {
                res.data.Items.forEach((item)=>{
                    var _tmpitem = {}
                    _tmpitem['label'] = item.bot_name
                    _tmpitem['value'] = item.bot_name
                    _option.push(_tmpitem)
                })
              }
                this.setState({
                  input_option:_option,
                },()=>{
                })
            }else{
              alert('request get byob error')
            }
        }
    })

  }

  componentWillUnmount(){

  }

  submit(){
    const payload = {
      "s3_bucket":this.state.s3_bucket,
      "s3_path":this.state.s3_path,
      "bot_name":this.state.bot_name,
      "number_of_bots":this.state.number_of_bots,
      "bulk_size":this.state.bulk_size,
      "output_s3_bucket":this.state.output_s3_bucket,
      "output_s3_prefix":this.state.output_s3_prefix,
    };

    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = '/create_inference_job';
    var result = "";

    // console.log(payload)
    axios({ method: 'POST', url: `${apiUrl}`, data: payload ,headers: HEADERS}).then(response => {
        console.log(response);
        if (response.status === 200) {
            result = "Create inference job successfully !"
        } else {
            result = "Create inference job error !"
        }
        this.setState({post_result:result},()=>{
          this.setState({visible:true})
        })
        // console.log(result)
    })

    this.setState({visible:true})
  }

  closeModel(){
    // this.setState({visible:false})
    this.props.history.push("/NewInferenceTask")
  }


  handel_changeBot(e){
    console.log(e)
    this.setState({
      bot_name:e.target.value,
      selectedOption:{value: e.target.value}
    },()=>{
      // this.reload()
    })
  }

  handel_number_of_bots(e){
    this.setState({number_of_bots:e})
  }

  handel_bulk_size(e){
    this.setState({bulk_size:e})
  }

  handel_s3_bucket(e){
    this.setState({s3_bucket:e})
  }

  handel_s3_path(e){
    this.setState({s3_path:e})
  }
  
  handel_output_s3_bucket(e){
    this.setState({output_s3_bucket:e})
  }

  handel_output_s3_prefix(e){
    this.setState({output_s3_prefix:e})
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
            <FormSection header={t("New Inference")}>
                <FormField label="Select Bot " controlId="formFieldId1">
                    <Select
                            onChange={(e)=> this.handel_changeBot(e)}
                            options={this.state.input_option}
                            selectedOption={this.state.selectedOption}
                            // options={[
                            //    { label: "mtr_bot", value: 'mtr_bot'}
                            // ]}
                            // selectedOption={{value: 'mtr_bot'}}
                    />
                </FormField>
                <FormField label="Input number of bots " hintText="e.g. 1" controlId="formFieldId2">
                    <Input type="text" controlId="number_of_bots" value={this.state.number_of_bots} onChange={(e)=> this.handel_number_of_bots(e)}   />
                </FormField>

                <FormField label="Input number bulk size " hintText="e.g. 500" controlId="formFieldId3">
                    <Input type="text" controlId="bulk_size" value={this.state.bulk_size} onChange={(e)=> this.handel_bulk_size(e)}   />
                </FormField>

                <FormField label="Input  s3 bucket" hintText="e.g. XXXX--us-west-2-XXXX" controlId="formFieldId4">
                    <Input type="text" controlId="s3_bucket" value={this.state.s3_bucket} onChange={(e)=> this.handel_s3_bucket(e)}  />
                </FormField>
                <FormField label="Input  s3 prefix" hintText="e.g. XXXX/XXXXX" controlId="formFieldId5">
                    <Input type="text" controlId="s3_path" value={this.state.s3_path} onChange={(e)=> this.handel_s3_path(e)}  />
                </FormField>

                <FormField label="Output s3 bucket" hintText="e.g. XXXX--us-west-2-XXXX" controlId="formFieldId6">
                    <Input type="text" controlId="output_s3_bucket" value={this.state.output_s3_bucket} onChange={(e)=> this.handel_output_s3_bucket(e)}  />
                </FormField>
                <FormField label="Output s3 prefix" hintText="e.g. XXXX/XXXXX" controlId="formFieldId7">
                    <Input type="text" controlId="output_s3_prefix" value={this.state.output_s3_prefix} onChange={(e)=> this.handel_output_s3_prefix(e)}  />
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


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewJobForm));



