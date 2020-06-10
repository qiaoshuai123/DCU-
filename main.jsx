import React from 'react'
import reactDom from 'react-dom'
import Loadable from 'react-loadable'
import { HashRouter, Route, BrowserHistory, Redirect, Switch } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-intl-redux'
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
const SignalManagement = Loadable({
  loader: () => import('./containers/SignalManagement/SignalManagement'),
  loading: Loading,
  delay: 0,
})

const Parent = () => (
  <React.Fragment>
    {/* <Route path="*" component={SystemMenu} /> */}
    {/* <Route path="/realtime" component={RealTime} />
 /> */}
    <Route path="/interworkingHome" component={InterworkingHome} />
    <Route path="/signalStatus" component={SignalStatus} />
    <Route path="/DetectorData" component={DetectorData} />
    <Route path="/Datastatus" component={Datastatus} />
    <Route path="/signalManagement" component={SignalManagement} />
  </React.Fragment>
)
reactDom.render(
  <AppContainer>
    <ConfigProvider locale={zhCN}>
      {/* //<Provider> */}
      <HashRouter basename="" history={BrowserHistory}>
        <Switch>
          <Redirect exact from="/" to="/interworkingHome" />
          <Route exact path="/interworkingHome" component={InterworkingHome} />
          <Route path="/" component={Parent} />
        </Switch>
      </HashRouter>
      {/* //</Provider> */}
    </ConfigProvider>
  </AppContainer>
  , document.getElementById('content'),
)
