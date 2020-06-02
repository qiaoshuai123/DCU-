import React from 'react'
import reactDom from 'react-dom'
import Loadable from 'react-loadable'
import { HashRouter, Route, BrowserHistory, Redirect, Switch } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-intl-redux'
import './app.css'
import LoadingPage from './components/LoadingPage/LoadingPage'
import RealTime from './TestRealTimeGreenWave'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

const Loading = () => <LoadingPage />
const Login = Loadable({
  loader: () => import('./containers/Login/Login'),
  loading: Loading,
  delay: 0,
})
const Entrance = Loadable({
  loader: () => import('./containers/Entrance/Entrance'),
  loading: Loading,
  delay: 0,
})
const Inter = Loadable({
  loader: () => import('./containers/Evaluate/Inter/Inter'),
  loading: Loading,
  delay: 0,
})
const Optimize = Loadable({
  loader: () => import('./containers/PolicyDecision/optimize/optimize'),
  loading: Loading,
  delay: 0,
})
const Monitoring = Loadable({
  loader: () => import('./containers/PolicyDecision/Monitoring/Monitoring'),
  loading: Loading,
  delay: 0,
})
const InterworkingHome = Loadable({
  loader: () => import('./containers/PolicyDecision/InterworkingHome/InterworkingHome'),
  loading: Loading,
  delay: 0,
})

const Parent = () => (
  <React.Fragment>
    {/* <Route path="*" component={SystemMenu} /> */}
    {/* <Route path="/realtime" component={RealTime} />
    <Route path="/entrance" component={Entrance} />
    <Route path="/inter" component={Inter} />
    <Route path="/optimize" component={Optimize} />
    <Route path="/monitoring" component={Monitoring} /> */}
    <Route path="/interworkingHome" component={InterworkingHome} />
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
