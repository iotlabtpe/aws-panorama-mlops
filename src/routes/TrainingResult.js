import FrameLayout from '../components/FrameLayout'

import Tabs from 'aws-northstar/components/Tabs';
import React  from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'

// import '../components/TrainResult.css';

import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
  return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
}

const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}

class  TrainingResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PR_curve:null,
      confusion_matrix:null,
      R_curve:null,
      F1_curve:null,
      results:null,
      P_curve:null,
    }
  }

  // componentWillMount(){
  //   if (! this.props.session.isLoggedIn && (process.env.NODE_ENV !=='development') ) {
  //     window.location.href = cognitoUtils.getCognitoSignInUri()
  //   }
  // }

  
  componentDidMount(){

      const id = this.props.match.params.id
      // console.log(id)
      
      axios.get('/listmodel/'+id, {dataType: 'json'}).then(res => {
          console.log(res)
          var _PR_curve = null;
          var _confusion_matrix = null;
          var _R_curve = null;
          var _F1_curve = null;
          var _results = null;
          var _P_curve = null;
          res.data.files.forEach((item,index)=>{
            console.log(item)
            switch(item) {
                case 'tutorial/PR_curve.png':
                  _PR_curve = res.data.presigned_urls[index];
                  break;
                case 'tutorial/confusion_matrix.png':
                  _confusion_matrix = res.data.presigned_urls[index];       
                  break;           
                case 'tutorial/R_curve.png':
                  _R_curve = res.data.presigned_urls[index];      
                  break;
                case 'tutorial/F1_curve.png':
                  _F1_curve = res.data.presigned_urls[index];
                  break;
                case 'tutorial/results.png':
                  _results = res.data.presigned_urls[index];    
                  break;              
                case 'tutorial/P_curve.png':
                  _P_curve = res.data.presigned_urls[index];  
                  break;
                default:
                  break;
            } 
          });
          this.setState({
            PR_curve:_PR_curve,
            confusion_matrix:_confusion_matrix,
            R_curve:_R_curve,
            F1_curve:_F1_curve,
            results:_results,
            P_curve:_P_curve
          })

      })

  }

  componentWillUnmount(){
  }

  renderComponent(){
    const tabs = [
        {
            label: 'PR_curve',
            id: 'PR_curve',
            content:  <div id="PR_curve"><img src={this.state.PR_curve} alt="" /></div>

        },
        {
          label: 'confusion_matrix',
          id: 'confusion_matrix',
          content:  <div id="confusion_matrix"><img src={this.state.confusion_matrix}  alt="" /></div>

      },
      {
        label: 'R_curve',
        id: 'R_curve',
        content:  <div id="R_curve"><img src={this.state.R_curve}  alt=""  /></div>

      },
      {
        label: 'F1_curve',
        id: 'F1_curve',
        content:  <div id="F1_curve"><img src={this.state.F1_curve}  alt=""  /></div>

      },
      {
        label: 'results',
        id: 'results',
        content:  <div id="results"><img src={this.state.results}  alt=""  /></div>

      },
      {
      label: 'P_curve',
      id: 'P_curve',
      content:  <div id="P_curve"><img src={this.state.P_curve}  alt=""  /></div>
      },
    ];
    return <Tabs tabs={tabs} variant="container" history={this.props.history} />
  }

//   render(){

//     const menuItems = [
//       { text: 'English', onClick: () => this.props.changeLang('en') },
//       { text: '简体中文', onClick: () => this.props.changeLang('zh') },
//       { text: '繁體中文', onClick: () => this.props.changeLang('zh_tw')}
//     ];
    
//     const header = <Translation>
//       {
//         t => <Header title={menuUtils.headText()} rightContent={menuUtils.langSelect(menuItems)} />
//       }
//       </Translation> ;

//     const navigationItems = menuUtils.navigationItems()
//     const navigation = (
//       <SideNavigation header={menuUtils.navigationHead()} items={navigationItems} />
//     );
//     const breadcrumbGroup = (
//       <BreadcrumbGroup
//         items={menuUtils.breadcrumbItems('TrainingResult','/TrainingResult/'+this.props.match.params.id)}
//       />
//     );

//     const tabs = [
//       {
//           label: 'PR_curve',
//           id: 'PR_curve',
//           content:  <div id="PR_curve"><img src={this.state.PR_curve} alt="" /></div>

//       },
//       {
//         label: 'confusion_matrix',
//         id: 'confusion_matrix',
//         content:  <div id="confusion_matrix"><img src={this.state.confusion_matrix}  alt="" /></div>

//     },
//     {
//       label: 'R_curve',
//       id: 'R_curve',
//       content:  <div id="R_curve"><img src={this.state.R_curve}  alt=""  /></div>

//     },
//     {
//       label: 'F1_curve',
//       id: 'F1_curve',
//       content:  <div id="F1_curve"><img src={this.state.F1_curve}  alt=""  /></div>

//     },
//     {
//       label: 'results',
//       id: 'results',
//       content:  <div id="results"><img src={this.state.results}  alt=""  /></div>

//     },
//     {
//     label: 'P_curve',
//     id: 'P_curve',
//     content:  <div id="P_curve"><img src={this.state.P_curve}  alt=""  /></div>

//     },
//   ];

//     return(
//         <AppLayout
//             header={header}
//             navigation={navigation}
//             breadcrumbs={breadcrumbGroup}
//         >
//         <Tabs tabs={tabs} variant="container" />
//         </AppLayout>
//     )
//   }
// }

// export default connect(mapStateToProps,MapDispatchTpProps)(TrainingResult);

  render(){
    const c = this.renderComponent()
    const url = "/TrainingResult/" + this.props.match.params.id
    return  <FrameLayout breadcrumb="TrainingResult" url1={url} url2="" component={c} />
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(TrainingResult));
