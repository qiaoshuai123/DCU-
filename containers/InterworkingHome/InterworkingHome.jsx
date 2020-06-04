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
            <span>1</span>DCU点位列表
          </div>
          <CustomTree />
        </div>
        <div className={styles.promptBox}>
          <div><span>1</span>在线设备9处</div>
          <div><span>1</span>在线设备3处</div>
        </div>
      </div>
    )
  }
}

export default InterworkingHome
