import React from 'react'
import { Icon } from 'antd'

import styles from './Login.scss'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount = () => {

  }
  handleLogin = () => {
    this.props.history.push('/entrance')
  }
  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>道路运行管控系统</h1>
          <div className={styles.usermsgBox}>
            <div className={styles.welcome} />
            <div className={styles.userInput}>
              <div className={styles.userMsg}>
                <span><Icon type="user" /></span>
                <input placeholder="请输入用户名" type="text"/>
              </div>
              <div className={styles.userMsg}>
                <span><Icon type="lock" theme="filled" /></span>
                <input placeholder="请输入密码" type="text"/>
              </div>
              <div className={styles.loginBtn} onClick={this.handleLogin}>登录</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
