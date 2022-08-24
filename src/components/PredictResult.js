
import React  from 'react';
import { connect } from 'react-redux' 
import Select from 'aws-northstar/components/Select';
// import { createHashHistory } from 'history';
import axios from 'axios';

// const hashHistory = createHashHistory();


import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
    return { session: state.session }
}
const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
}

class  PredictResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        options : [],
        current:{value:''},
        selectedOption:{value:''},
        showSave: false
    }
  }

  componentDidMount(){
      var input_option = []
      this.props.options.forEach((item,index)=>{
          var _tmp = {}
          _tmp['label'] = item
          _tmp['value'] = index
          input_option.push(_tmp)
      })

    this.setState({
        options:input_option,
        selectedOption:this.props.selectedOption,
        current:this.props.selectedOption
    })
  }

  onChange(event){
      if (event.target.value !== this.state.current.value ){
        this.setState({
          selectedOption:event.target,
          showSave:true
        })
      }
  }

  save(){
    // const docid = this.props.docid
    var predict = this.props.predict
    predict[0] = Number(this.state.selectedOption.value)


    const payload = {
      "verified_result":predict
    };

    const HEADERS = {'Content-Type': 'application/json'};
    // const apiUrl = '/save_verified_result'+'/'+this.props.docid;
    const apiUrl = `/save_verified_result/${this.props.docid}`;
    var result = "";

    // console.log(payload)
    axios({ method: 'POST', url: `${apiUrl}`, data: payload ,headers: HEADERS}).then(response => {
        // console.log(response);
        if (response.status === 200) {
            result = "Save result successfully !"
            this.setState({
              current:this.state.selectedOption,
              showSave:false
            })
        } else {
            result = "Save result error !"
        }
        console.log(result)
    })

  }

  render(){
    return(
        <div>
        <Select
            placeholder=""
            options={this.state.options}
            selectedOption={this.state.selectedOption}
            onChange={(e) => this.onChange(e)}
            disabled
        />
        {/* <Button onClick={(e) => this.save(e)} disabled={!this.state.showSave}>Save</Button> */}

        </div>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(PredictResult));

