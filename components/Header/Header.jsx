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
      { id: 1, name: '实时监控', path: '/interworkingHome' },
      { id: 2, name: '信号参数管理' },
      { id: 3, name: '设备参数管理' },
      { id: 4, name: '日志管理' },
      { id: 5, name: '系统管理' },
      { id: 6, name: '关于系统' },
    ]
  }
  componentDidMount = () => {

  }
  SelectButton = (e) => {
    this.setState({
      selectNum: e.id,
    }, () => {
      this.props.history.push(e.path)
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
            this.navItems.map(item => <div className={selectNum === item.id ? styles.active : ''} onClick={() => this.SelectButton(item)} key={item.id}>{item.name}</div>)
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
