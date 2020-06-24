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
      navItem: [],
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
          },
          {
            id: '1_2',
            name: '信号机实时状态',
            role: 1,
            path: '/signalstatus',
          },
          {
            id: '1_3',
            name: '数据实时状态',
            role: 1,
            path: '/datastatus',
          },
          {
            id: '1_4',
            name: '检测器数据',
            role: 1,
            path: '/detectordata',
          },
        ],
      },
      { id: 2, name: '信号参数管理', role: 2, path: '/signalmanagement' },
      { id: 3, name: '设备参数管理', role: 3, path: '/equipmentManagement' },
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
          },
          {
            id: '4_2',
            name: '信号机故障',
            role: 4,
            path: '/signalfault',
          },
          {
            id: '4_3',
            name: '通讯故障',
            role: 4,
            path: '/communicationfault',
          },
          {
            id: '4_4',
            name: '操作日志',
            role: 4,
            path: '/logfault',
          },
          {
            id: '4_5',
            name: '运行日志',
            role: 4,
            path: '/functionfault',
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
          },
          {
            id: '5_2',
            name: '权限管理',
            role: 5,
            path: '/jurmanagement',
          },
          {
            id: '5_3',
            name: '角色管理',
            role: 5,
            path: '/rolemanagement',
          },
        ],
      },
      { id: 6, name: '关于系统', role: 6, path: '/aboutSystemt' },
    ]
    // 获取用户权限
    // this.getUser = localStorage.getItem('')
  }
  componentDidMount = () => {
    // 筛选符合条件数据
    // const myMenu = this.filterMenu(this.navItems, this.getUser)
    this.pageRouter()
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
  SelectButton = (e) => {
    this.props.history.push(e.path)
  }
  SelectButtonChild = (e, item) => {
    e.stopPropagation()
    this.props.history.push(item.path)
  }
  render() {
    const { selectNum, navItem } = this.state
    return (
      <div className={styles.headerWrapper}>
        <div className={styles.header_left}>
          <span />
          双向互通管控系统
        </div>
        <div className={styles.header_center}>
          {
            navItem.map(item =>
              (
                <div className={selectNum === item.id ? styles.active : ''} onClick={() => this.SelectButton(item)} key={item.id}>
                  {item.name}
                  <div className={styles.child}>
                    {
                      item.child && item.child.map(items => <div key={items.id} onClick={e => this.SelectButtonChild(e, items)}>{items.name}</div>)
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
