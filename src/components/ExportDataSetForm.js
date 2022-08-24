
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

class  ExportDataSetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      S3IN:"s3://aws-innovation-center-outofbox-demo/exp-inference",
      IMGPREFIX:"images",
      LABELPREFIX:"labels",
      visible:false,
      post_result:'',

      inputJobOption:[],
      selectedJobOption:{value:''},
      curr_job:null,


      inputTypeOption:[
        {label:'all',value:'default'},
        {label:'acknowledged',value:'true'},
        {label:'waiting',value:'false'}
      ],
      selectedTypeOption:{label:'acknowledged',value:'true'},
      curr_type:"true",

      tagOptions:[
        {value:'1',label:'口罩'},
        {value:'2',label:'安全帽'}
      ],
      tagSelectedOption:{name:'口罩',value:'1'}

    }
    this.handel_changeType = this.handel_changeType.bind(this)


  }


  componentDidMount(){
    this.setState({loading:true})
    axios.get('/listinference', {dataType: 'json'}).then(res => {
      // console.log(res)
      if (res.data){
          // console.log(res.data)
          var _tmp_data = []
          var _tmp_job_option = []
          res.data.forEach((item)=>{
              var _tmp = {}
              _tmp['job_id'] = item['job_id']
              _tmp_data.push(_tmp)
              _tmp_job_option.push({
                  label: item['job_id'],
                  value: item['job_id']
              })
          });

          var _curr_job
          var _tmp_job_select
          // console.log(_tmp_data)
          if(_tmp_data.length > 0){
              _curr_job = _tmp_data[_tmp_data.length-1].job_id
              _tmp_job_select = {
                  name:_tmp_data[_tmp_data.length-1].job_id,
                  value:_tmp_data[_tmp_data.length-1].job_id
              }
          }

          this.setState({
              // job_list: _tmp_data,
              curr_job: _curr_job,
              inputJobOption: _tmp_job_option,
              job_loading: 'finished',
              selectedJobOption:_tmp_job_select
          })
      }
      // console.log(this.state.model_list)
      return res.data
    })
  }

  componentWillUnmount(){

  }

  submit(){
    // console.log(e)
    const HEADERS = {'Content-Type': 'application/json'};

    var _type
    if(this.state.tagSelectedOption.value === '1'){
      _type='mask'
    }else if (this.state.tagSelectedOption.value === '2'){
      _type='helmat'
    }    

    const apiUrl = '/save_inference_result?job_id='+this.state.curr_job+'&&s3uri='+this.state.S3IN+'&&images_prefix='+this.state.IMGPREFIX+'&&labels_prefix='+this.state.LABELPREFIX+'&&type='+_type;

    // console.log(apiUrl)
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    axios({ method: 'GET', url: `${apiUrl}`, headers: HEADERS}).then(response => {
        console.log(response);
        if (response.status === 200) {
            result = "Export the training dataset successfully !"
        } else {
            result = "Export the training dataset job error !"
        }
        this.setState({post_result:result},()=>{
          this.setState({visible:true})
        })
        // console.log(result)
    })

    this.setState({post_result:"Export the training dataset successfully !"},()=>{
      this.setState({visible:true})
    })

    // this.setState({visible:true})
    // this.props.history.push("/")
  }


  handelS3IN(e){
    this.setState({S3IN:e})
  }

  handelS3OUT(e){
    this.setState({S3OUT:e})
  }

  handelIMAGEPREFIX(e){
    this.setState({IMGPREFIX:e})
  }

  handelLABELPREFIX(e){
    this.setState({LABELPREFIX:e})
  }


  handel_changeJob(e){
    // console.log(e)
    this.setState({
      curr_job:e.target.value,
      selectedJobOption:{value: e.target.value}
    },()=>{
      // this.reload()
    })
  }


  handel_changeType(e){
    // console.log(e)
    this.setState({
      curr_type:e.target.value,
      selectedTypeOption:{value: e.target.value}
    },()=>{
      // this.reload()
    })
  }

  closeModel(){
    
  }


  render(){
    return(
      <div>
        <Form
            actions={
                <div>
                    {/* <Button variant="link">Cancel</Button> */}
                    <Button variant="primary" onClick={() => this.submit()}  >Submit</Button>
                </div>
            }
        >
            <FormSection header="Export Training Dataset">
                <FormField label="Select Type Tag " controlId="formFieldId1">
                    <Select placeholder={'Choose job'} 
                        // statusType={this.state.job_loading} 
                        options={this.state.tagOptions}
                        selectedOption={this.state.tagSelectedOption}
                        onChange={this.handel_changeType}
                    />

                </FormField>
                <FormField label="Select Job " controlId="formFieldId1">
                    <Select placeholder={'Choose job'} 
                        statusType={this.state.job_loading} 
                        loadingText="Loading job list" 
                        options={this.state.inputJobOption}
                        selectedOption={this.state.selectedJobOption}
                        onChange={this.handel_changeJob}
                    />

                </FormField>
                {/* <FormField label="Select Data Filter " controlId="formFieldId2">
                    <Select
                            onChange={(e)=> this.handel_changeType(e)}
                            options={this.state.inputTypeOption}
                            selectedOption={this.state.selectedTypeOption}
                        />
                </FormField> */}
                <FormField label="Input S3 bucket saving exported dataset" hintText="e.g. s3://[bucket name]/[prefix]" controlId="formFieldId3">
                    <Input type="text" controlId="input_bucket" value={this.state.S3IN} onChange={(e)=> this.handelS3IN(e)}  />
                </FormField>
                <FormField label="Input images prefix" hintText="e.g. images" controlId="formFieldId4">
                    <Input type="text" controlId="images_prefix" value={this.state.IMGPREFIX} onChange={(e)=> this.handelIMAGEPREFIX(e)}   />
                </FormField>
                <FormField label="Input labels prefix" hintText="e.g. labels" controlId="formFieldId5">
                    <Input type="text" controlId="labels_prefix" value={this.state.LABELPREFIX} onChange={(e)=> this.handelLABELPREFIX(e)}  />
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

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ExportDataSetForm));



