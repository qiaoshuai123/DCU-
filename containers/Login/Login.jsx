import React from 'react'
import { Icon, message } from 'antd'

import styles from './Login.scss'
import getResponseDatas from '../../utils/getResponseDatas'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.loginUrl = '/DCU/sys/user/login'
    this.limitUrl = '/DCU/sys/menu/getUserMentList?userId='
    this.loginParams = {
      loginName: '',
      password: '',
    }
  }
  componentDidMount = () => {
    if(window.location.href.indexOf('userName') > -1){
      this.loginParams.loginName = window.location.href.split("?")[1].split("&")[0].split("=")[1]
      this.loginParams.password = window.location.href.split("?")[1].split("&")[1].split("=")[1]
      this.handleLogin()
    }
    this.loginBox.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        console.log(e, e.keCode)
        this.handleLogin()
      }
    })
  }
   // 转格式
   getFormData = (obj) => {
     const formData = new FormData()
     Object.keys(obj).forEach((item) => {
       formData.append(item, obj[item])
     })
     return formData
   }
   getUserLimit = (id) => {
     getResponseDatas('post', `${this.limitUrl}${id}`).then((res) => {
       const { code, data } = res.data
       if (code === 0) {
         localStorage.setItem('userLimit', JSON.stringify(data))
         this.props.history.push(data[0].path) //'/interworkinghome'
       }
     })
   }
  handleLogin = () => {
    // debugger
    const { loginName, passWord } = this.loginParams
    if (loginName !== '' && passWord !== '') {
      getResponseDatas('post', this.loginUrl, this.getFormData(this.loginParams)).then((res) => {
        const { code, data, msg } = res.data
        if (code === 0) {
          this.getUserLimit(data.id)
          localStorage.setItem('userInfo', JSON.stringify(data))
          this.loginParams = {
            loginName: '',
            passWord: '',
          }
        } else {
          message.warning(msg)
          if (window.location.href.indexOf('userName') > -1) { this.props.history.goBack() }
        }
      })
    } else {
      message.info('请输入用户名和密码')
    }
  }
  handleUserInput = (e) => {
    const pname = e.target.getAttribute('pname')
    this.loginParams[pname] = e.target.value
  }
  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginContent}>
          <div className={styles.leftContent}>
            <div className={styles.welcome}>欢迎来到<span className={styles.commingIcon} /></div>
            <div className={styles.systext}>双向互通管控系统</div>
          </div>
          <div className={styles.rightContent} ref={(input) => { this.loginBox = input }}>
            <div className={styles.loginMsg}>
              <h3 className={styles.loginTit}>用户登录</h3>
              <div className={styles.inputBox}>
                <input type="text" placeholder="请输入用户名称" pname="loginName" onChange={this.handleUserInput} />
                <span className={styles.userIcon}><Icon type="user" /></span>
              </div>
              <div className={styles.inputBox}>
                <input type="password" placeholder="请输入登录密码" pname="password" onChange={this.handleUserInput} />
                <span className={styles.pwdICon}><Icon type="unlock" /></span>
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
