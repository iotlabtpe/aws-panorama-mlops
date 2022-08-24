/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Button from 'aws-northstar/components/Button';
import React  from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'
// import { createHashHistory } from 'history';
import Cloud from '@material-ui/icons/Cloud';
import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
  return { session: state.session }
}


const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  DeployEndpoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        bot_image:null
    }
  }

  componentDidMount(){
    axios.get('/byob', {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            if (res.status === 200){
            //   var _option = []
              if (res.data.Items) {
                res.data.Items.forEach((item)=>{
                    if (item.bot_name === 'mtr_bot'){
                        // console.log(item.bot_image)
                        this.setState({
                            bot_image:item.bot_image
                        })
                    }
                })
              }
            }else{
              console.log('request get byob error')
            }
        }
    })
  }

  deploy(){
      const payload = {
        "bot_image_cmd": "",
        "bot_mem": "6114",
        "model_s3_path": "",
        "bot_vcpu": "6",
        "endpoint_name": this.props.ep_name,
        "endpoint_ecr_image_path": "",
        "bot_image": this.state.bot_image,
        "create_date": "2021-08-24 07:08:01.33",
        "bot_name": this.props.ep_name,
        "file_types": [
          ".jpg",
          ".jpeg",
          ".png"
        ],
        "instance_type": "ml.g4dn.2xlarge",
        "update_date": "2021-08-24 07:08:01.33"
     }

      const HEADERS = {'Content-Type': 'application/json'};
      const apiUrl = '/byob';
      // console.log(apiUrl)
      var result = "";
  
      axios({ method: 'POST', url: apiUrl , data: payload ,headers: HEADERS}).then(response => {
          console.log(response);
          if (response.status === 201) {
              result = "Deploy successfully !"
            alert(result)
          } else {
              result = "Deploy error !"
              alert(result)
          }
          // console.log(result)
      })

  }

  render(){
    const {
      props: {t}
  } = this;

    return(
        <Button  disabled={this.props.disabled} onClick={() => this.deploy()}  icon={Cloud} >{t("Deploy")}</Button>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(DeployEndpoint));

