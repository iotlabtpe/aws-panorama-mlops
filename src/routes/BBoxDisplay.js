import FrameLayout from '../components/FrameLayout'

import React  from 'react';
import { connect } from 'react-redux' 
import BBox from '../components/BBox'
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

class  BBoxDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  // componentWillMount(){
  //   if (! this.props.session.isLoggedIn && (process.env.NODE_ENV !=='development') ) {
  //     window.location.href = cognitoUtils.getCognitoSignInUri()
  //   }
  // }

  componentDidMount(){
    
  }

  componentWillUnmount(){
  }

  render(){
    const c = (<BBox history={this.props.history} />)
    return  <FrameLayout breadcrumb="doc" url1={'/job/'+this.props.match.params.job} url2={'/doc/'+this.props.match.params.job+'/'+this.props.match.params.id} component={c} />
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(BBoxDisplay));

