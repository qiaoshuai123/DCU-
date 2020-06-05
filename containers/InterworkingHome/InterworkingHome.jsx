import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import CustomTree from './CustomTree/CustomTree'
import { Input } from 'antd'
import styles from './InterworkingHome.scss'

class InterworkingHome extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.InterworkingHomeBox}>
        <Header {...this.props} />
        <div className={styles.Interwork_left}>
          <div className={styles.InterworkLeft_search}>
            <Search
              placeholder="关键词搜索"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </div>
          <div className={styles.InterworkLeft_Title}>
            <span />DCU点位列表
          </div>
          <CustomTree />
        </div>
        <div className={styles.promptBox}>
          <div><span className={styles.spanTop} />在线设备9处</div>
          <div><span className={styles.spanBom} />在线设备3处</div>
        </div>
      </div>
    )
  }
}

export default InterworkingHome
