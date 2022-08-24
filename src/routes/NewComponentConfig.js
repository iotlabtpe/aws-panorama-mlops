import FrameLayout from '../components/FrameLayout'

import React  from 'react';
import { connect } from 'react-redux' 

// import cognitoUtils from '../lib/cognitoUtils'
import NewComponentForm from '../components/NewComponentForm'
import {withTranslation} from 'react-i18next'


const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewComponentConfig extends React.Component {

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
    const c = (<NewComponentForm history={this.props.history} />)
    return  <FrameLayout breadcrumb="NewComponentConfig" component={c} />
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewComponentConfig));


