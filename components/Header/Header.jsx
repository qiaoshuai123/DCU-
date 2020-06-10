import React from 'react'
import styles from './Header.scss'
import { Menu, Dropdown, Icon } from 'antd'

const menu = (
  <Menu>
    <Menu.Item>
      <span>
        返回主页
      </span>
    </Menu.Item>
    <Menu.Item>
      <span>
        修改密码
      </span>
    </Menu.Item>
  </Menu >
)
class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectNum: 1,
    }
    this.navItems = [
      {
        id: 1,
        name: '实时监控',
        path: '/interworkingHome',
        child: [
          {
            id: '1_1',
            name: 'DCU状态',
            path: '/interworkingHome',
          },
          {
            id: '1_2',
            name: '信号机实时状态',
            path: '/signalStatus',
          },
          {
            id: '1_3',
            name: '数据实时状态',
            path: '/Datastatus',
          },
          {
            id: '1_4',
            name: '检测器数据',
            path: '/DetectorData',
          },
        ],
      },
      { id: 2, name: '信号参数管理', path: '/signalManagement' },
      { id: 3, name: '设备参数管理' },
      {
        id: 4,
        name: '日志管理',
        path: '/dcuFault',
        child: [
          {
            id: '4_1',
            name: 'DCU设备故障',
            path: '/dcuFault',
          },
          {
            id: '4_2',
            name: '信号机故障',
            path: '/signalFault',
          },
          {
            id: '4_3',
            name: '通信故障',
            path: '/communicationFault',
          },
          {
            id: '4_4',
            name: '操作日志',
            path: '/logFault',
          },
          {
            id: '4_5',
            name: '运行日志',
            path: '/functionFault',
          },
        ],
      },
      {
        id: 5,
        name: '系统管理',
        path: '/userManagement',
        child: [
          {
            id: '5_1',
            name: '用户管理',
            path: '/userManagement',
          },
          {
            id: '5_2',
            name: '权限管理',
            path: '/jurManagement',
          },
          {
            id: '5_3',
            name: '角色管理',
            path: '/roleManagement',
          },
        ],
      },
      { id: 6, name: '关于系统' },
    ]
  }
  componentDidMount = () => {
    console.log(2)
  }
  SelectButton = (e) => {
    console.log(e, 'ss34')
    this.setState({
      selectNum: e.id,
    }, () => {
      this.props.history.push(e.path)
    })
  }
  SelectButtonChild = (e, item) => {
    e.stopPropagation()
    console.log(e.target.getAttribute('path'), item, 'ss')
    // console.log(e.target.parentNode.parentNode)
    const ids = e.target.getAttribute('path')
    if (this.props.location.pathname === item.path) return
    this.setState({
      selectNum: ids,
    }, () => {
      this.props.history.push(item.path)
    })
  }
  render() {
    const { selectNum } = this.state
    return (
      <div className={styles.headerWrapper}>
        <div className={styles.header_left}>
          <span />
          双向互通管控系统
        </div>
        <div className={styles.header_center}>
          {
            this.navItems.map(item =>
              (
                <div className={selectNum === item.id ? styles.active : ''} onClick={() => this.SelectButton(item)} key={item.id}>
                  {item.name}
                  <div className={styles.child}>
                    {
                      item.child && item.child.map(items => <div key={items.id} path={item.id} onClick={e => this.SelectButtonChild(e, items)}>{items.name}</div>)
                    }
                  </div>
                </div>
              ))
          }
        </div>
        <div className={styles.header_right}>
          <span />
          <Dropdown overlay={menu}>
            <b onClick={e => e.preventDefault()}>
              hello,admin <Icon type="down" />
            </b>
          </Dropdown>
        </div>
      </div >
    )
  }
}

export default Header
