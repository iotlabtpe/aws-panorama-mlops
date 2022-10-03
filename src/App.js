import React from 'react'
import {
  // Router,
  Route
} from 'react-router-dom'

import { Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import CameraMonitoring from './routes/CameraMonitoring'
import NewTrainingTask from './routes/NewTrainingTask'
import TrainingList from './routes/TrainingList'
import EventPage from './routes/EventPage'
import EventVerify from './routes/EventVerify'
import ExportEventDataSet from './routes/ExportEventDataSet'


import NewDeployConfig from './routes/NewDeployConfig'
import CloneModelConfig from './routes/CloneModelConfig';
import DeploymentCfgList from './routes/DeploymentCfgList'


import DeviceCfgList from './routes/DeviceCfgList'
import NewCameraConfig from './routes/NewCameraConfig'
import CameraCfgList from './routes/CameraCfgList'
import ModelManage from './routes/ModelManage';
import NewApplicationConfig from './routes/NewApplicationConfig';


import StoredApplicationCfgList from './routes/StoredApplicationCfgList'
import NewStoredApplicationConfig from './routes/NewStoredApplicationConfig';



const App = () => (
    <BrowserRouter>
      <Switch>

        {/* Monitoring */}
        <Route exact path="/" component={CameraMonitoring}/> 


        {/* Application 
        Stored Application  */}
        <Route  exact path="/StoredApplicationConfig" component={StoredApplicationCfgList}  /> 
        <Route  exact path="/NewStoredApplicationConfig" component={NewStoredApplicationConfig} />

        {/* Packaged Application  */}
        <Route  exact path="/TrainingList" component={TrainingList}  />
        <Route  exact path="/NewTrainingTask" component={NewTrainingTask}  />
        <Route  exact path="/NewApplicationConfig" component={NewApplicationConfig}  />

        {/* Incremental Training  */}
        <Route  exact path="/CloneModelConfig/:id" component={CloneModelConfig}  />
        <Route  exact path="/ModelManageTable/:id" component={ModelManage} />

        {/* Deployed Application */}
        <Route  exact path="/DeployConfig" component={DeploymentCfgList}  />
        <Route  exact path="/NewDeployConfig" component={NewDeployConfig}  />

        {/* Alert
        List Alert */}
        <Route  exact path="/event" component={EventPage}  />

        {/* Verify Alert  */}
        <Route  exact path="/event_verify" component={EventVerify}  />

        {/* Export Alert  */}
        <Route  exact path="/ExportEventDataSet" component={ExportEventDataSet}  />


        {/* Config 
        Device Config  */}
        <Route  exact path="/DeviceConfig" component={DeviceCfgList}  />

        {/* Camera Config  */}
        <Route  exact path="/CameraConfig" component={CameraCfgList}  />
        <Route  exact path="/NewCameraConfig" component={NewCameraConfig}  />


      </Switch>
     </BrowserRouter>

)

export default App
