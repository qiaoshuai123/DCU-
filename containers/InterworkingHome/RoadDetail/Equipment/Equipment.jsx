import React, { Component } from 'react'
import { Icon } from 'antd'
import styles from './Equipment.scss'
import imgs from '../../../../images/03.png'

class Equipment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMeessage: true,
    }
  }
  btnCloseMessage = () => {
    this.setState({
      isMeessage: false,
    })
  }
  showImg = () => {
    this.setState({
      isMeessage: true,
    })
  }
  render() {
    const { isMeessage } = this.state
    return (
      <div className={styles.Equipment}>
        <img src={imgs} alt="" onClick={this.showImg} />
        {
          isMeessage &&
          <div className={styles.messageBox}>
            <span onClick={this.btnCloseMessage} className={styles.IconClose}><Icon type="close" /></span>
            <div>设备编号:10000001</div>
            <div>设备型号:DCU100</div>
            <div>设备IP:192.168.100.40</div>
            <div>生产厂商:北京博研智通科技有限公司</div>
            <div>维护电话:62672272</div>
            <div>设备状态:<span>正常状态</span></div>
            <div>信号接入状态:<span>正常</span></div>
            <div>发布服务状态:<span>正常</span></div>
          </div>
        }
      </div>
    )
  }
}

export default Equipment
