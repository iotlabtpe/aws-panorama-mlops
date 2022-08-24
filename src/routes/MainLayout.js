
import React  from 'react';
import { connect } from 'react-redux' 

import {withTranslation} from 'react-i18next'


import FrameLayout from '../components/FrameLayout'

const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}


class  MainLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  // componentWillMount(){
  //   console.log(process.env)
  //   if (! this.props.session.isLoggedIn && (process.env.NODE_ENV !=='development') ) {
  //     window.location.href = cognitoUtils.getCognitoSignInUri()
  //   }
  // }

  componentDidMount(){
    
  }

  componentWillUnmount(){
  }

  render(){
    // const menuItems = [
    //   { text: 'English', onClick: () => this.props.changeLang('en') },
    //   { text: '简体中文', onClick: () => this.props.changeLang('zh') },
    //   { text: '繁體中文', onClick: () => this.props.changeLang('zh_tw')}
    // ];

    // const content = this.props.t('lang')
    // // const content = this.props.t('Local Inference')

    // console.log(content)

    // const rText = this.props.t('Welcome to React')
    // const rightBox = <Box alignItems = "center" display="flex" >
    //           <ButtonDropdown content={ content } items={ menuItems }  darkTheme />
    //         </Box>    


    // const header = <Header title={rText} rightContent={rightBox} />


    // const navigationItems = menuUtils.navigationItems()

    // const navigation = (
    //   <SideNavigation header={menuUtils.navigationHead()} items={navigationItems} />
    // );
    // const breadcrumbGroup = (
    //   <BreadcrumbGroup
    //     items={menuUtils.breadcrumbItems('Main')}
    //   />
    // );

    return(
      <FrameLayout breadcrumb="Main" />
      // <AppLayout
      //   header={header}
      //   navigation={navigation}
      //   breadcrumbs={breadcrumbGroup}
      // >
      // </AppLayout>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(MainLayout));
