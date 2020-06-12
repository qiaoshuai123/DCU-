import React from 'react'
import reactDom from 'react-dom'
import Loadable from 'react-loadable'
import { HashRouter, Route, BrowserHistory, Redirect, Switch } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import './app.css'
import LoadingPage from './components/LoadingPage/LoadingPage'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

const Loading = () => <LoadingPage />
const Login = Loadable({
  loader: () => import('./containers/Login/Login'),
  loading: Loading,
  delay: 0,
})
const InterworkingHome = Loadable({
  loader: () => import('./containers/InterworkingHome/InterworkingHome/InterworkingHome'),
  loading: Loading,
  delay: 0,
})
const SignalStatus = Loadable({
  loader: () => import('./containers/InterworkingHome/SignalStatus/SignalStatus'),
  loading: Loading,
  delay: 0,
})
const DetectorData = Loadable({
  loader: () => import('./containers/InterworkingHome/DetectorData/DetectorData'),
  loading: Loading,
  delay: 0,
})
const Datastatus = Loadable({
  loader: () => import('./containers/InterworkingHome/Datastatus/Datastatus'),
  loading: Loading,
  delay: 0,
})
const RoadDetail = Loadable({
  loader: () => import('./containers/InterworkingHome/RoadDetail/RoadDetail'),
  loading: Loading,
  delay: 0,
})
const SignalManagement = Loadable({
  loader: () => import('./containers/SignalManagement/SignalManagement'),
  loading: Loading,
  delay: 0,
})
const JurManagement = Loadable({
  loader: () => import('./containers/SysteManagement/JurManagement/JurManagement'),
  loading: Loading,
  delay: 0,
})
const RoleManagement = Loadable({
  loader: () => import('./containers/SysteManagement/RoleManagement/RoleManagement'),
  loading: Loading,
  delay: 0,
})
const UserManagement = Loadable({
  loader: () => import('./containers/SysteManagement/UserManagement/UserManagement'),
  loading: Loading,
  delay: 0,
})

const Parent = () => (
  <React.Fragment>
    {/* <Route path="*" component={SystemMenu} /> */}
    {/* <Route path="/realtime" component={RealTime} />
 /> */}
    {/* 实时监控模块 */}
    <Route path="/interworkinghome" component={InterworkingHome} />
    <Route path="/signalstatus" component={SignalStatus} />
    <Route path="/detectordata" component={DetectorData} />
    <Route path="/datastatus" component={Datastatus} />
    <Route path="/roaddetail" component={RoadDetail} />
    {/* 信号参数管理模块 */}
    <Route path="/signalmanagement" component={SignalManagement} />
    {/* 系统管理 */}
    <Route path="/usermanagement" component={UserManagement} />
    <Route path="/jurmanagement" component={JurManagement} />
    <Route path="/rolemanagement" component={RoleManagement} />
  </React.Fragment>
)
reactDom.render(
  <AppContainer>
    <ConfigProvider locale={zhCN}>
      <HashRouter basename="" history={BrowserHistory}>
        <Switch>
          <Redirect exact from="/" to="/interworkingHome" />
          <Route exact path="/interworkingHome" component={InterworkingHome} />
          <Route path="/" component={Parent} />
        </Switch>
      </HashRouter>
    </ConfigProvider>
  </AppContainer>
  , document.getElementById('content'),
)
