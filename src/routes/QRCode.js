
import AppLayout from 'aws-northstar/layouts/AppLayout';
// import Header from 'aws-northstar/components/Header';
// import SideNavigation from 'aws-northstar/components/SideNavigation';
// import BreadcrumbGroup from 'aws-northstar/components/BreadcrumbGroup';
import React  from 'react';
import { connect } from 'react-redux' 

// import menuUtils from '../lib/menuUtils'
import cognitoUtils from '../lib/cognitoUtils'

// import ReactDOM from 'react-dom'
// import axios from 'axios'

import Grid from 'aws-northstar/layouts/Grid';
import Container from 'aws-northstar/layouts/Container';
// import { Translation } from 'react-i18next';


const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}


class  QRCode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url: null
    }
  }

  componentWillMount(){
    if (! this.props.session.isLoggedIn && (process.env.NODE_ENV !=='development') ) {
      window.location.href = cognitoUtils.getCognitoSignInUri()
    }

    // document.documentElement.style.overflow = "auto";
    // document.documentElement.style.height = "auto";
    // document.body.style.overflow = "auto";
    // document.body.style.height = "auto";
    // document.getElementById("root").style.height = "auto";
    // // console.log(document.getElementById("root"))
    // // console.log(document.getElementsByClassName("MuiBox-root"))
  }

  componentDidMount(){
    // document.documentElement.style.overflow = "hidden";
    // document.documentElement.style.height = "70%";
    // document.body.style.overflow = "hidden";
    // document.body.style.height = "70%";
    // document.getElementById("root").style.height = "70%";
    // console.log(document.getElementById("root"))
    // console.log(document.getElementsByClassName("MuiBox-root"))

  }

  
  componentWillUnmount(){
  }

  render(){
    // const menuItems = [
    //   { text: 'English', onClick: () => this.props.changeLang('en') },
    //   { text: '简体中文', onClick: () => this.props.changeLang('zh') },
    //   { text: '繁體中文', onClick: () => this.props.changeLang('zh_tw')}
    // ];
    
    // const header = <dev>
    //   {
    //     // t => <Header title={menuUtils.headText()} rightContent={menuUtils.langSelect(menuItems)} />
    //     <Header title={menuUtils.headText()} rightContent={menuUtils.langSelect(menuItems)} />
    //   }
    //   </dev> ;

    // const navigationItems = menuUtils.navigationItems()
    // const navigation = (
    //   <SideNavigation header={menuUtils.navigationHead()} items={navigationItems} />
    // );
    // const breadcrumbGroup = (
    //   <BreadcrumbGroup
    //     items={menuUtils.breadcrumbItems('Summary')}
    //   />
    // );

    // const kibana_url = this.state.url+'/app/kibana#/dashboard/722b74f0-b882-11e8-a6d9-e546fe2bba5f?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-1y%2Cto%3Anow))'
    // const kibana_url = this.state.url
    // const kibana_url = '/image-test.png'

    // https://iot.spot-bot.examples.pro/ 和 https://st.spot-bot.examples.pro/ 

    // const kibana_url = 'https://iot.spot-bot.examples.pro/'
    
    return(
        <AppLayout
            // header={header}
            // navigation={navigation}
            // breadcrumbs={breadcrumbGroup}
            id="layout"
        >
        <Container headingVariant="h4">
          <Grid container>
            <Grid item xs={6}>
              <img style={{width:"40%", height:"40%" , "objectfit": "fill"}}  src="/QR.jpg"  alt="" />
            </Grid>

          </Grid>
          </Container>
        <div id="father">
            

        </div>


        </AppLayout>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(QRCode);
