import React from 'react'
import { Menu, Dropdown, Icon, message } from 'antd'
import styles from './Header.scss'
import Websocket from 'react-websocket'
import getResponseDatas from '../../utils/getResponseDatas'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNum: 1,
      navItem: [],
      showSysMsg: false,
      userName: null,
      showChangePwd: false,
      userLimit: null,
      systemState: null,
    }
    this.paths = this.props.match.url
    this.navItems = [
      {
        id: 1,
        name: '实时监控',
        role: 1,
        path: '/interworkinghome',
        child: [
          {
            id: '1_1',
            name: 'DCU状态',
            role: 1,
            path: '/interworkinghome',
            limitId: 11,
          },
          {
            id: '1_2',
            name: '信号机实时状态',
            role: 1,
            path: '/signalstatus',
            limitId: 12,
          },
          {
            id: '1_3',
            name: '数据实时状态',
            role: 1,
            path: '/datastatus',
            limitId: 13,
          },
          {
            id: '1_4',
            name: '检测器数据',
            role: 1,
            path: '/detectordata',
            limitId: 14,
          },
        ],
      },
      {
        id: 2, name: '信号参数管理', role: 2, path: '/signalmanagement', limitId: 2,
      },
      {
        id: 3, name: '设备参数管理', role: 3, path: '/equipmentManagement', limitId: 3,
      },
      {
        id: 4,
        name: '日志管理',
        role: 4,
        path: '/dcufault',
        child: [
          {
            id: '4_1',
            name: 'DCU设备故障',
            role: 4,
            path: '/dcufault',
            limitId: 41,
          },
          {
            id: '4_2',
            name: '信号机故障',
            role: 4,
            path: '/signalfault',
            limitId: 42,
          },
          {
            id: '4_3',
            name: '通讯故障',
            role: 4,
            path: '/communicationfault',
            limitId: 43,
          },
          {
            id: '4_4',
            name: '操作日志',
            role: 4,
            path: '/logfault',
            limitId: 44,
          },
          {
            id: '4_5',
            name: '运行日志',
            role: 4,
            path: '/functionfault',
            limitId: 45,
          },
        ],
      },
      {
        id: 5,
        name: '系统管理',
        role: 5,
        path: '/usermanagement',
        child: [
          {
            id: '5_1',
            name: '用户管理',
            role: 5,
            path: '/usermanagement',
            limitId: 51,
          },
          {
            id: '5_2',
            name: '权限角色管理',
            role: 5,
            path: '/jurmanagement',
            limitId: 52,
          },
          {
            id: '5_3',
            name: '菜单管理',
            role: 5,
            path: '/menumanage',
            limitId: 54,
          },
          {
            id: '5_4',
            name: '部门管理',
            role: 5,
            path: '/usergroup',
            limitId: 53,
          },
        ],
      },
      {
        id: 6, name: '关于系统', role: 6,
      },
    ]
    this.menu = (
      <Menu onClick={this.handleUserMenu}>
        <Menu.Item key="1">
          <span>
            修改密码
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>
            退出登录
          </span>
        </Menu.Item>
      </Menu >
    )
    this.loginKeys = {
      password: '',
      oldPassword: '',
      id: '',
    }
    this.updatePassUrl = '/DCU/sys/user/updatePassword'
    this.logoutUrl = '/DCU/sys/user/logout'
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
  }
  componentDidMount = () => {
    const userMsg = JSON.parse(localStorage.getItem('userInfo'))
    const userLimit = (JSON.parse(localStorage.getItem('userLimit'))).map(item => item.id)
    this.setState({ userName: userMsg.userName, userLimit })
    this.loginKeys.id = userMsg.id
    this.pageRouter()
  }
  getupdatePwd = () => {
    const { password, oldPassword } = this.loginKeys
    if (password === '') {
      message.error('请填写新密码！')
      return
    }
    if (oldPassword === '') {
      message.error('请再次填写新密码！')
      return
    }
    if (oldPassword !== password) {
      message.error('密码输入不一致！')
      return
    }
    getResponseDatas('post', this.updatePassUrl, this.getFormData(this.loginKeys)).then((res) => {
      const result = res.data
      if (result.code === 0) {
        // console.log(result.data)
        this.handleHideMsg()
        message.error('密码修改成功,3秒后返回登陆页面！')
        setTimeout(() => {
          this.handleLogout()
        }, 3000)
      } else {
        message.error('网络异常，请稍后再试!')
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
  pageRouter = () => {
    this.pageRouters(this.paths, this.navItems)
    this.setState({
      selectNum: this.num,
      navItem: this.navItems,
    })
  }
  filterMenu = (menuList, menuCode) => {
    return menuList.filter((item) => {
      return item.role.includes(menuCode)
    }).map((item) => {
      item = Object.assign({}, item)
      if (item.children) {
        item.children = this.filterMenu(item.children, menuCode)
      }
      return item
    })
  }
  pageRouters = (paths, nav) => {
    for (let i = 0; i < nav.length; i++) {
      if (nav[i].path === paths) {
        this.num = nav[i].role
      }
      if (nav[i].child) {
        if (nav[i].path === paths) {
          this.num = nav[i].role
        }
        this.pageRouters(this.paths, nav[i].child)
      }
    }
  }
  SelectButton = (navItem) => {
    if (navItem.limitId && this.state.userLimit.indexOf(navItem.limitId) < 0) {
      message.warning('暂无此权限')
    } else {
      if (navItem.path && !navItem.child) {
        this.props.history.push(navItem.path)
      } else if (!navItem.path) {
        this.setState({ showSysMsg: true })
      }
    }
  }
  SelectButtonChild = (e, item) => {
    e.stopPropagation()
    // console.log(this.state.userLimit, item.limitId, 'sv')
    if (this.state.userLimit.indexOf(item.limitId) < 0) {
      message.warning('暂无此权限')
    } else {
      this.props.history.push(item.path)
    }
  }
  handleHideMsg = () => {
    this.setState({
      showSysMsg: false,
      showChangePwd: false,
    })
  }
  handleUserMenu = ({ key }, e) => {
    if (key === '1') {
      this.setState({ showChangePwd: true })
    } else if (key === '2') {
      this.handleLogout()
    }
  }
  handleLogout = () => {
    getResponseDatas('post', this.logoutUrl).then((res) => {
      const { code, msg } = res.data
      if (code === 0) {
        localStorage.clear()
        this.props.history.push('/login')
      } else {
        message.warning(msg)
      }
    })
  }
  handlePwdChange = (e) => {
    const pname = e.target.getAttribute('pname')
    this.loginKeys[pname] = e.target.value
  }
  handleData = (e) => {
    let result = JSON.parse(e);
    console.log(result,'header 数据')
    const { aliserverState } = result
    this.setState({ systemState: aliserverState })
  }
  render() {
    const {
      selectNum, navItem, showSysMsg, userName, showChangePwd, userLimit, systemState,
    } = this.state
    return (
      <div className={styles.headerWrapper}>
        <Websocket
          url={`ws://192.168.1.213:20203/DCU/websocket/aliserverState/0/0/0?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        />
        {/* <Websocket
          url={`ws://53.101.224.151:20203/DCU/websocket/aliserverState/0/0/0?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        /> */}
        {/* <Websocket
          url={`ws://39.100.128.220:20203/DCU/websocket/aliserverState/0/0/0?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        /> */}
        {
          showSysMsg &&
          <div className={styles.aboutSystem}>
            <div className={styles.aboutTitle}>
              <h2>双向互通管控系统</h2>
              <span className={styles.closeIcon} onClick={this.handleHideMsg}><Icon type="close" /></span>
            </div>
            <div className={styles.sysMsg}>版本：v1.0</div>
            <div className={styles.copyRight}>版权信息：北京博研智通科技有限公司</div>
          </div>
        }
        {
          showChangePwd &&
          <div className={styles.changePwd}>
            <div className={styles.pwdTitle}>修改密码 <span className={styles.closeIcon} onClick={this.handleHideMsg}><Icon type="close" /></span></div>
            <div className={styles.pwdInput}>
              <input type="passWord" placeholder="请输入新密码" pname="password" onChange={this.handlePwdChange} />
              <input type="passWord" placeholder="请再次输入新密码" pname="oldPassword" onChange={this.handlePwdChange} />
            </div>
            <div className={styles.pwdBtnBox}>
              <div className={styles.btn} onClick={this.getupdatePwd}>确认</div>
              <div className={styles.btn} onClick={this.handleHideMsg}>取消</div>
            </div>
          </div>
        }
        <div className={styles.header_left}>
          <span />
          双向互通管控系统
        </div>
        <div className={styles.header_center}>
          {
            userLimit &&
            navItem.map(item =>
              (
                <div className={selectNum === item.id ? styles.active : ''} onClick={() => this.SelectButton(item)} key={item.id}>
                  {item.name}
                  <div className={styles.child}>
                    {
                      item.child && item.child.map((items) => {
                        if (userLimit.indexOf(items.limitId) >= 0) {
                          return (
                            <div key={items.id} onClick={e => this.SelectButtonChild(e, items)}>{items.name}</div>
                          )
                        }
                      })
                    }
                  </div>
                </div>
              ))
          }
        </div>
        <div className={styles.header_right} style={{position: 'relative'}}>
          <em style={systemState === '1' ? {color: 'green'} : {color: 'red'}}>{systemState === '1' ? '在线' : '离线'}</em>
          <span />
          <Dropdown overlay={this.menu}>
            <b onClick={e => e.preventDefault()}>
              hello,{userName} <Icon type="down" />
            </b>
          </Dropdown>
        </div>
      </div>
    )
  }
}

export default Header
