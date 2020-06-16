import React, { Component } from 'react'
import { Input, Icon, message } from 'antd'
import styles from './MessagePage.scss'

class MessagePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numbers: '',
      names: '',
      longitude: '',
      dimension: '',
    }
    this.formsVerification = {
      numbers: '点位编号',
      names: '点位名称',
      longitude: '经度',
      dimension: '点位编号',
    }
  }
  componentDidMount = () => {
    // 判断父级传递下来id，回显使用
    const { roadId } = this.props
    if (roadId) {
      this.echoData(roadId)
    }
  }
  echoData = () => {

    // 请求之后为变量赋值
  }
  // 更改input框内容
  changeNumber = (e) => {
    const names = e.target.getAttribute('paths')
    const values = e.target.value
    this.setState({
      [names]: values,
    })
  }
  // 点击提交
  addForm = async () => {
    // 验证是否为空
    const as = await this.Verification()
    // as不为真做提交请求
    if (!as) {

    }
  }
  Verification = () => {
    // const keys = Object.keys(this.formsVerification)
    // keys.forEach((item) => {
    //   if (!this.state[item]) {
    //     return message.warning(`请填写${this.formsVerification[item]}`)
    //   }
    // })
    for (const i in this.formsVerification) {
      if (!this.state[i]) {
        return message.warning(`请填写${this.formsVerification[i]}`)
      }
    }
  }
  // 关闭弹窗
  closeMessage = () => {
    this.props.closePoint()
  }
  render() {
    const { numbers, names, longitude, dimension } = this.state
    return (
      <div className={styles.MessagePageBox}>
        <div className={styles.topTitle}>DCU点位信息<span onClick={this.closeMessage}><Icon type="close" /></span></div>
        <div className={styles.items}><span>点位编号:</span><Input paths="numbers" style={{ width: 300 }} value={numbers} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>点位名称:</span><Input paths="names" style={{ width: 300 }} value={names} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>经度:</span><Input paths="longitude" style={{ width: 300 }} value={longitude} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>点位编号:</span><Input paths="dimension" style={{ width: 300 }} value={dimension} onChange={this.changeNumber} /></div>
        <div className={styles.bombtn}><span onClick={this.addForm}>保存</span></div>
      </div>
    )
  }
}

export default MessagePage
