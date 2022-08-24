import FrameLayout from '../components/FrameLayout'

import React  from 'react';
import { connect } from 'react-redux' 
import ComponentCfgTable from '../components/ComponentCfgTable'

// import cognitoUtils from '../lib/cognitoUtils'

import {withTranslation} from 'react-i18next'


const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}


class  ComponentCfgList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  componentDidMount(){
    
  }

  componentWillUnmount(){
  }

  render(){
    const c = (<ComponentCfgTable history={this.props.history} />)
    return  <FrameLayout breadcrumb="ComponentCfgList" component={c} />
  }

}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ComponentCfgList));

