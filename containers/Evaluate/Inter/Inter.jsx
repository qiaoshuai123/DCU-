import React from 'react'
import { Select, Icon } from 'antd'

import Header from '../Header/Header'
import InterMsg from './InterMsg/InterMsg'
import CustomTree from '../../../components/CustomTree/CustomTree'

import styles from './Inter.scss'

class Inter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount = () => {

  }
  render() {
    const { Option } = Select
    return (
      <div className={styles.InterWrapper}>
        <Header {...this.props} />
        <div className={styles.interContainer}>
          <div className={styles.interTreeBox}>
            <div className={styles.interSearch}>
              <Select defaultValue="1">
                <Option key="1">贵阳市</Option>
                <Option key="2">南阳市</Option>
              </Select>
              <span className={styles.searchBox}>
                <input className={styles.searchInput} type="text" placeholder="请输入你要搜索的内容" />
                <Icon className={styles.searchIcon} type="search" />
              </span>
            </div>
            <div className={styles.interTree}>
              <CustomTree />
            </div>
          </div>
          <div className={styles.interChartsMsg}>
            <h3 className={styles.interName}>当前路口 : 世纪大道与海淀五西路</h3>
            <InterMsg msgName="路口流量" />
            <InterMsg msgName="路口延误时间" />
          </div>
        </div>
      </div>
    )
  }
}

export default Inter
