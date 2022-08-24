import React from 'react'
import {
  // Router,
  Route
} from 'react-router-dom'

import { Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

// import Callback from './routes/Callback'
// import Home from './routes/Home'
// import MainLayout from './routes/MainLayout'

import CameraMonitoring from './routes/CameraMonitoring'
import Helmet_Local from './routes/Helmet_Local'
import Helmet_Local2 from './routes/Helmet_Local2'
import NewTrainingTask from './routes/NewTrainingTask'
import TrainingList from './routes/TrainingList'
import TrainingResult from './routes/TrainingResult'
import InferenceList from './routes/InferenceList'
import NewInferenceTask from './routes/NewInferenceTask'
import JobDetail from './routes/JobDetail'
import BBoxDisplay from './routes/BBoxDisplay'
import ExportDataSet from './routes/ExportDataSet'
import Verify from './routes/Verify'


import EventPage from './routes/EventPage'
import EventVerify from './routes/EventVerify'
import ExportEventDataSet from './routes/ExportEventDataSet'

import Summary from './routes/Summary'
import Summary2 from './routes/Summary2'


import NewDeployConfig from './routes/NewDeployConfig'
import CloneModelConfig from './routes/CloneModelConfig';
import DeploymentCfgList from './routes/DeploymentCfgList'
import NewComponentConfig from './routes/NewComponentConfig'
import ComponentCfgList from './routes/ComponentCfgList'
import ComponentVersionCfgList from './routes/ComponentVersionCfgList'
import NewComponentVersionConfig from './routes/NewComponentVersionConfig'

import NewModelConfig from './routes/NewModelConfig'
import ModelCfgList from './routes/ModelCfgList'
import ModelVersionCfgList from './routes/ModelVersionCfgList'
import NewModelVersionConfig from './routes/NewModelVersionConfig'


import NewDeviceConfig from './routes/NewDeviceConfig'
import DeviceCfgList from './routes/DeviceCfgList'
import NewCameraConfig from './routes/NewCameraConfig'
import CameraCfgList from './routes/CameraCfgList'
import ModelManage from './routes/ModelManage';
import NewApplicationConfig from './routes/NewApplicationConfig';


// import QRCode from './routes/QRCode'
// import SignOut from './routes/SignOut'
// import { createBrowserHistory } from 'history'
// const history = createBrowserHistory()

// import { withTranslation } from 'react-i18next';
// const myMain = withTranslation()(MainLayout)

const App = () => (
    <BrowserRouter>
    {/* <Router history={history}> */}
      <Switch>
        {/* <Route exact path="/" component={Home}/> */}
        <Route exact path="/" component={CameraMonitoring}/> 

        <Route  exact path="/local_helmet" component={Helmet_Local}  />
        <Route  exact path="/local_helmet2" component={Helmet_Local2}  />

        <Route  exact path="/NewTrainingTask" component={NewTrainingTask}  />
        <Route  exact path="/TrainingList" component={TrainingList}  />
        <Route  exact path="/TrainingResult/:id" component={TrainingResult}  />

        <Route  exact path="/InferenceList" component={InferenceList}  />
        <Route  exact path="/NewInferenceTask" component={NewInferenceTask}  />
        <Route  exact path="/job/:id" component={JobDetail}  />
        <Route  exact path="/doc/:job/:id" component={BBoxDisplay}  />
        <Route  exact path="/ExportDataSet" component={ExportDataSet}  />
        <Route  exact path="/Verify" component={Verify}  />

        <Route  exact path="/event" component={EventPage}  />
        <Route  exact path="/event_verify" component={EventVerify}  />
        <Route  exact path="/ExportEventDataSet" component={ExportEventDataSet}  />


        <Route  exact path="/Summary" component={Summary}  />
        <Route  exact path="/Summary2" component={Summary2}  />

        <Route  exact path="/DeployConfig" component={DeploymentCfgList}  />
        <Route  exact path="/NewDeployConfig" component={NewDeployConfig}  />

        <Route  exact path="/ComponentConfig" component={ComponentCfgList}  />
        <Route  exact path="/NewComponentConfig" component={NewComponentConfig}  />
        
        <Route  exact path="/ComponentVersionConfig/:id" component={ComponentVersionCfgList}  />
        <Route  path="/NewComponentVersionConfig/:id" component={NewComponentVersionConfig}  />

        <Route  exact path="/ModelConfig" component={ModelCfgList}  />
        <Route  exact path="/NewModelConfig" component={NewModelConfig}  />
        <Route  exact path="/CloneModelConfig/:id" component={CloneModelConfig}  />
        <Route  exact path="/NewApplicationConfig" component={NewApplicationConfig}  />
        <Route  exact path="/ModelManageTable/:id" component={ModelManage} />
        <Route  path="/ModelVersionConfig/:id" component={ModelVersionCfgList}  />
        <Route  path="/NewModelVersionConfig/:id" component={NewModelVersionConfig}  />

        <Route  exact path="/CameraConfig" component={CameraCfgList}  />
        <Route  exact path="/NewCameraConfig" component={NewCameraConfig}  />

        <Route  exact path="/DeviceConfig" component={DeviceCfgList}  />
        <Route  exact path="/NewDeviceConfig" component={NewDeviceConfig}  />



        {/* 
        <Route exact path="/callback" component={Callback}/>
        <Route exact path="/Main" component={MainLayout}/>
        <Route exact path="/SignOut" component={SignOut}/>
         <Route  exact path="/QRCode" component={QRCode}  />
        */}

       
        

        
        
        
        
      </Switch>
    {/* </Router> */}
     </BrowserRouter>

)

export default App
