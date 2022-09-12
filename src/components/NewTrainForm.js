
import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';
import Select from 'aws-northstar/components/Select';


import Modal from 'aws-northstar/components/Modal';
import { API } from 'aws-amplify';

import React from 'react';
import { connect } from 'react-redux'

import { withTranslation } from 'react-i18next'

// import mockData from '../mock/mockData'

const mapStateToProps = state => {
  return { session: state.session }
}
const MapDispatchTpProps = (dispatch) => {
  return {
    changeLang: (key) => dispatch({ type: 'change_language', data: key })
  }
}

class NewTrainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      S3IN: "s3://",
      S3OUT: "s3://",
      // S3IN:"s3://spot-bot-assets-ap-east-1/mtr/s3/data",
      // S3OUT:"s3://spot-bot-assets-ap-east-1/mtr/s3/data",
      IMGPREFIX: "images",
      LABELPREFIX: "labels",
      StoredApplicationOption:[],
      StoredApplication: "",
      visible: false,
      post_result: '',
    }
  }


  componentDidMount() {
    this.load_data();
  }

  componentWillUnmount() {

  }
  async load_data(){
    await API.get('backend', '/storedApplication').then(res => {
      console.log(res)
      if (res) {
        let option_data = []
        res.forEach((item) => {
          let option = {}
          option['label'] = item['appName']
          option['value'] = item['appName']
         
          option_data.push(option)

        });
        this.setState({ StoredApplicationOption: option_data },() => {
          this.setState({ loading: false })
        });
      }
    })
  }
  submit() {
    // console.log(e)
    const payload = {
      "input_s3uri": this.state.S3IN,
      "images_prefix": this.state.IMGPREFIX,
      "labels_prefix": this.state.LABELPREFIX,
      "output_s3uri": this.state.S3OUT,
      "storedApplication": this.state.StoredApplication.value,
    };
    // var result = "=> call"  + apiUrl + "\n";
    var result = "";

    API.post('backend', '/training', { body: payload }).then(response => {
      console.log(response);
      if (response.status === 200) {
        result = "Create training job successfully !"
      } else {
        result = "Create training job error !"
      }
      this.setState({ post_result: result }, () => {
        this.setState({ visible: true })
      })
      // console.log(result)
    })

    this.setState({ visible: true })
    // this.props.history.push("/")
  }

  closeModel() {
    // this.setState({visible:false})
    this.props.history.push("/TrainingList")
  }

  handelS3IN(e) {
    this.setState({ S3IN: e })
  }

  handelS3OUT(e) {
    this.setState({ S3OUT: e })
  }

  handelIMAGEPREFIX(e) {
    this.setState({ IMGPREFIX: e })
  }

  handelLABELPREFIX(e) {
    this.setState({ LABELPREFIX: e })
  }


  render() {
    const {
      props: { t }
    } = this;

    return <div>
      <Form
        actions={
          <div>
            {/* <Button variant="link">Cancel</Button> */}
            <Button variant="primary" onClick={() => this.submit()}  >Submit</Button>
          </div>
        }
        onSubmit={console.log}
      >
        <FormSection header={t('Create new Training Job')} >
          {/* <FormField label="Input S3 URI" hintText="e.g. [bucket name]/[prefix]" controlId="formFieldId1">
            <Input type="text" controlId="input_s3uri" value={this.state.S3IN} onChange={(e) => this.handelS3IN(e)} />
          </FormField>
          <FormField label="Input images prefix" hintText="e.g. images" controlId="formFieldId2">
            <Input type="text" controlId="images_prefix" value={this.state.IMGPREFIX} onChange={(e) => this.handelIMAGEPREFIX(e)} />
          </FormField>
          <FormField label="Input labels prefix" hintText="e.g. labels" controlId="formFieldId3">
            <Input type="text" controlId="labels_prefix" value={this.state.LABELPREFIX} onChange={(e) => this.handelLABELPREFIX(e)} />
          </FormField>
          <FormField label="Output S3 URI" hintText="e.g. [bucket name]/[prefix]" controlId="formFieldId4">
            <Input type="text" controlId="output_s3uri" value={this.state.S3OUT} onChange={(e) => this.handelS3OUT(e)} />
          </FormField> */}
          <FormField label="Stored Application" controlId="formFieldId5">
            <Select 
              options={this.state.StoredApplicationOption}
              onChange={(e) => this.setState({StoredApplication: this.state.StoredApplicationOption.find(o => o.value === e.target.value)})}
              // onChange={(e) => console.log(e.target.value)}
              selectedOption={this.state.StoredApplication}
            />
          </FormField>
        </FormSection>
      </Form>
      <Modal title="Packaged Application" visible={this.state.visible} onClose={() => this.closeModel()}>
        Training Job will begin soon !!!
      </Modal>
    </div>
  }
}

export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(NewTrainForm));



