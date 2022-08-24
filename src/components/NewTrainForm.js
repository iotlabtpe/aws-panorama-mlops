
import Form from 'aws-northstar/components/Form';
import Button from 'aws-northstar/components/Button';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';
import Input from 'aws-northstar/components/Input';


import Modal from 'aws-northstar/components/Modal';
import axios from 'axios';
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
      visible: false,
      post_result: '',
    }
  }


  componentDidMount() {
  }

  componentWillUnmount() {

  }

  submit() {
    // console.log(e)
    const payload = {
      "input_s3uri": this.state.S3IN,
      "images_prefix": this.state.IMGPREFIX,
      "labels_prefix": this.state.LABELPREFIX,
      "output_s3uri": this.state.S3OUT,
    };
    const HEADERS = { 'Content-Type': 'application/json' };
    const apiUrl = '/create_trainjob';
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
          <FormField label="Input S3 URI" hintText="e.g. [bucket name]/[prefix]" controlId="formFieldId1">
            <Input type="text" controlId="input_s3uri" value={this.state.S3IN} onChange={(e) => this.handelS3IN(e)} />
          </FormField>
          <FormField label="Input images prefix" hintText="e.g. images" controlId="formFieldId2">
            <Input type="text" controlId="images_prefix" value={this.state.IMGPREFIX} onChange={(e) => this.handelIMAGEPREFIX(e)} />
          </FormField>
          <FormField label="Input labels prefix" hintText="e.g. labels" controlId="formFieldId3">
            <Input type="text" controlId="labels_prefix" value={this.state.LABELPREFIX} onChange={(e) => this.handelLABELPREFIX(e)} />
          </FormField>
          <FormField label="Output S3 URI" hintText="e.g. [bucket name]/[prefix]" controlId="formFieldId42">
            <Input type="text" controlId="output_s3uri" value={this.state.S3OUT} onChange={(e) => this.handelS3OUT(e)} />
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



