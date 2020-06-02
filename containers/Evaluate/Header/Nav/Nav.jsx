import React from 'react'
import classNames from 'classnames'

import styles from './Nav.scss'

class EvaNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.navItems = [
      { name: '路口评价', path: '/inter' },
      { name: '主干道评价' },
      { name: '所在区域评价' },
    ]
  }
  componentDidMount = () => {}
  render() {
    return (
      <div className={styles.navWrapper}>
        {
          this.navItems.map((item) => {
            return (
              <div className={styles.navItem} key={item.name}>
                <p className={classNames({ [styles.navName]: true, [styles.navActive]: this.props.location.pathname === item.path })}>{item.name}</p>
                <p className={styles.navBg} />
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default EvaNav
