import FrameLayout from '../components/FrameLayout'

import React  from 'react';
import { connect } from 'react-redux' 
import ComponentVersionCfgTable from '../components/ComponentVersionCfgTable'

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


class  ComponentVersionCfgList extends React.Component {

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
    const c = (<ComponentVersionCfgTable history={this.props.history} id={this.props.match.params.id} />)
    return  <FrameLayout breadcrumb="ComponentVersionCfgList" url1={'/ComponentVersionConfig/'+this.props.match.params.id} component={c} />
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ComponentVersionCfgList));

