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
import TrainingResult from './routes/TrainingResult'
import EventPage from './routes/EventPage'
import EventVerify from './routes/EventVerify'
import ExportEventDataSet from './routes/ExportEventDataSet'


import NewDeployConfig from './routes/NewDeployConfig'
import CloneModelConfig from './routes/CloneModelConfig';
import DeploymentCfgList from './routes/DeploymentCfgList'

import NewModelConfig from './routes/NewModelConfig'
import ModelCfgList from './routes/ModelCfgList'
import ModelVersionCfgList from './routes/ModelVersionCfgList'
import NewModelVersionConfig from './routes/NewModelVersionConfig'

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
        <Route exact path="/" component={CameraMonitoring}/> 

        <Route  exact path="/NewTrainingTask" component={NewTrainingTask}  />
        <Route  exact path="/TrainingList" component={TrainingList}  />
        <Route  exact path="/TrainingResult/:id" component={TrainingResult}  />

        <Route  exact path="/event" component={EventPage}  />
        <Route  exact path="/event_verify" component={EventVerify}  />
        <Route  exact path="/ExportEventDataSet" component={ExportEventDataSet}  />

        <Route  exact path="/DeployConfig" component={DeploymentCfgList}  />
        <Route  exact path="/NewDeployConfig" component={NewDeployConfig}  />

        

        <Route  exact path="/ModelConfig" component={ModelCfgList}  />
        <Route  exact path="/NewModelConfig" component={NewModelConfig}  />
        <Route  exact path="/CloneModelConfig/:id" component={CloneModelConfig}  />
        <Route  exact path="/NewApplicationConfig" component={NewApplicationConfig}  />
        <Route  exact path="/ModelManageTable/:id" component={ModelManage} />
        <Route  exact path="/StoredApplicationConfig" component={StoredApplicationCfgList}  /> 
        <Route  exact path="/NewStoredApplicationConfig" component={NewStoredApplicationConfig} />

        <Route  path="/ModelVersionConfig/:id" component={ModelVersionCfgList}  />
        <Route  path="/NewModelVersionConfig/:id" component={NewModelVersionConfig}  />

        <Route  exact path="/CameraConfig" component={CameraCfgList}  />
        <Route  exact path="/NewCameraConfig" component={NewCameraConfig}  />

        <Route  exact path="/DeviceConfig" component={DeviceCfgList}  />

      </Switch>
    {/* </Router> */}
     </BrowserRouter>

)

export default App
