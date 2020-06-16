import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import MessagePage from './MessagePage/MessagePage'
import styles from './EquipmentManagement.scss'

class InterworkingHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMessagePage: true,
    }
  }
  componentDidMount = () => {

  }
  addPoint = () => {
    this.roadId = ''
    this.setState({
      isMessagePage: true,
    })
  }
  closePoint = () => {
    this.setState({
      isMessagePage: false,
    })
  }
  render() {
    const { Search } = Input
    const { isMessagePage } = this.state
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
          <div onClick={this.addPoint} className={styles.addPoint}>
            添加点位
          </div>
        </div>
        {
          isMessagePage && <MessagePage closePoint={this.closePoint} roadId={this.roadId} />
        }
      </div>
    )
  }
}

export default InterworkingHome
