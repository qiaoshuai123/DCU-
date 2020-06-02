import React from 'react'
import classNames from 'classnames'

import styles from './Nav.scss'

class EvaNav extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.navItems = [
      {
        name: '首页',
        path: '/signalhome',
        children: [
          { name: '首页', path: '/signalhome' },
          { name: '全局监控', path: '/globalmonitor' },
          { name: '路口优化', path: '/optimize' },
        ],
      },
      { name: '特勤任务', path: '/secretTask' },
      { name: '协调监控', path: '/monitoring' },
    ]
    this.navItemsRight = [
      { name: '统计分析' },
      { name: '综合管理' },
      { name: '系统维护' },
    ]
    this.childItems = [
      { name: '首页', path: '/signalhome' },
      { name: '全局监控', path: '/globalmonitor' },
      { name: '路口优化', path: '/optimize' },
    ]
  }
  componentDidMount = () => { }
  handGosystem = (e) => {
    const paths = e.target.getAttribute('path')
    this.props.history.push(paths)
  }
  handleShowDefaultNav = (item) => {
    if (item.children) {
      const child = item.children.filter(items => items.path === this.props.location.pathname)
      if (child.length > 0) {
        return child[0]
      }
      return null
    }
    return null
  }
  handleNavMouseEnter = (e, item) => {
    if (item.children) {
      const innerBox = e.currentTarget.lastElementChild
      innerBox.style.height = item.children.length * 28 + 'px'
    }
  }
  handleNavMouseLeave = (e) => {
    const innerBox = e.currentTarget.lastElementChild
    innerBox.style.height = 0
  }
  render() {
    return (
      <div className={styles.navWrapper}>
        <div className={styles.navLeft}>
          {
            this.navItems.map((item) => {
              const child = this.handleShowDefaultNav(item)
              const { pathname } = this.props.location
              return (
                <div
                  className={styles.navItem}
                  key={item.name}
                  onMouseEnter={(e) => { this.handleNavMouseEnter(e, item) }}
                  onMouseLeave={this.handleNavMouseLeave}
                >
                  <p className={styles.navBg} />
                  <p
                    className={classNames({ [styles.navName]: true, [styles.navActive]: child ? pathname === child.path : pathname === item.path })}
                    path={child ? child.path : item.path}
                    onClick={this.handGosystem}
                  >
                    {child ? child.name : item.name}
                  </p>
                  <div className={styles.innerItemBox}>
                    {
                      item.children &&
                      item.children.map(items => <div className={styles.innerItem} onClick={this.handGosystem} key={items.name + items.path} path={items.path}>{items.name}</div>)
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={styles.navCenter} />
        <div className={styles.navRight}>
          {
            this.navItemsRight.map((item) => {
              return (
                <div
                  className={styles.navItem}
                  key={item.name}
                  onMouseEnter={(e) => { this.handleNavMouseEnter(e, item) }}
                  onMouseLeave={this.handleNavMouseLeave}
                >
                  <p className={styles.navBg} />
                  <p className={classNames({ [styles.navName]: true, [styles.navActive]: this.props.location.pathname === item.path })}>{item.name}</p>
                </div>
              )
            })
          }
        </div>

      </div>
    )
  }
}

export default EvaNav
