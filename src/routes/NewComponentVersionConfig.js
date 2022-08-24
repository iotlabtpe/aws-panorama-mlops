import FrameLayout from '../components/FrameLayout'
import React  from 'react';
import { connect } from 'react-redux' 

// import cognitoUtils from '../lib/cognitoUtils'
import NewComponentVersionForm from '../components/NewComponentVersionForm'
import {withTranslation} from 'react-i18next'


const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  NewComponentVersionConfig extends React.Component {

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
    const c = (<NewComponentVersionForm history={this.props.history} id={this.props.match.params.id}  />)
    return  <FrameLayout breadcrumb="NewComponentVersionConfig" component={c} />
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewComponentVersionConfig));

