/* eslint-disable no-alert */

import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';
import Select from 'aws-northstar/components/Select';
import Modal from 'aws-northstar/components/Modal';
import React  from 'react';
import { connect } from 'react-redux' 
import { API } from 'aws-amplify' 
import {withTranslation} from 'react-i18next'
import { LoadingIndicator } from 'aws-northstar';

const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}


class  ExportEventDataSetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      S3IN:"",
      IMGPREFIX:"images",
      LABELPREFIX:"labels",
      visible:false,
      post_result:'',

      inputJobOption:[],
      selectedJobOption:{value:''},
      curr_job:null,

      tagOptions:[
        {value:'1',label:'Mask'},
        {value:'2',label:'Helmet'},
        {value:'3',label:'People'}

      ],
      tagSelectedOption:{name:'People',value:'3'},
      // curr_type:"true"



      // inputTypeOption:[
      //   {label:'all',value:'default'},
      //   {label:'acknowledged',value:'true'},
      //   {label:'waiting',value:'false'}
      // ],
      // selectedTypeOption:{label:'acknowledged',value:'true'},
      // curr_type:"true"

    }
    this.handel_changeType = this.handel_changeType.bind(this)

  }


  componentDidMount(){
    this.loadData()
    this.setState({loading:true})
  }

  componentWillUnmount(){

  }

  async loadData(){
    await API.get('backend', '/listExportBucket').then(response => {
      if(response){
        console.log(response)
        this.setState({S3IN: 's3://export-event-' + response})
      }

    })

  }

  async submit(){
    // console.log(e)
    this.setState({visible:true})


    this.setState({post_result: "loading" })   
    var _type
    if(this.state.tagSelectedOption.value === '1'){
      _type='mask'
    }else if (this.state.tagSelectedOption.value === '2'){
      _type='helmat'
    }
    else if(this.state.tagSelectedOption.value === '3'){
      _type='person'
    }
    const apiUrl = '/save_event_result?type='+_type+'&&s3uri='+this.state.S3IN;
    // const apiUrl = '/export?type='+_type+'&&s3uri='+this.state.S3IN+'&&images_prefix='+this.state.IMGPREFIX+'&&labels_prefix='+this.state.LABELPREFIX;

    console.log(apiUrl)
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    const payload = {
      type: _type,
      s3uri: this.state.S3IN
    }
    await API.post('backend','/exportEvent',{ body: payload}).then(response => {
        // console.log(response);
        if (response) {
            result = "Export the training dataset successfully !"
            // alert(result)
        } else {
            result = "Export the training dataset successfully !"
            // alert(result)
        }
        this.setState({post_result:result})   
        // console.log(result)
    }).catch((e)=>{
      console.log(e) 
      this.setState({ post_result: "Fail to export the data"})
    })
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
    console.log(e)
    this.setState({
      tagSelectedOption:{value: e.target.value}
    },()=>{
      // this.reload()
    })
  }

  closeModel(){
    this.setState({ visible: false })
    window.location.reload();
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
        >
            <FormSection header={t("Export Verified Event Dataset")}>
                {/*<FormField label="Select Type Tag " controlId="formFieldId1">
                    <Select placeholder={'Choose job'} 
                        // statusType={this.state.job_loading} 
                        options={this.state.tagOptions}
                        selectedOption={this.state.tagSelectedOption}
                        onChange={this.handel_changeType}
                    />

          </FormField>*/}
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
                {/* <FormField label="Input images prefix" hintText="e.g. images" controlId="formFieldId4">
                    <Input type="text" controlId="images_prefix" value={this.state.IMGPREFIX} onChange={(e)=> this.handelIMAGEPREFIX(e)}   />
                </FormField>
                <FormField label="Input labels prefix" hintText="e.g. labels" controlId="formFieldId5">
                    <Input type="text" controlId="labels_prefix" value={this.state.LABELPREFIX} onChange={(e)=> this.handelLABELPREFIX(e)}  />
                </FormField> */}
            </FormSection>
        </Form>
        <Modal title="Export Dataset" visible={this.state.visible} onClose={() => this.closeModel()}>
            {this.state.post_result === 'loading' ? <LoadingIndicator label="Uploading"/> : this.state.post_result }
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ExportEventDataSetForm));


