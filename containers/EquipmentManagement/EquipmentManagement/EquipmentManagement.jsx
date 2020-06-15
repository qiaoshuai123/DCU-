import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import styles from './EquipmentManagement.scss'

class InterworkingHome extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount = () => {

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
          <div className={styles.addPoint}>
            添加点位
          </div>
        </div>
      </div>
    )
  }
}

export default InterworkingHome
