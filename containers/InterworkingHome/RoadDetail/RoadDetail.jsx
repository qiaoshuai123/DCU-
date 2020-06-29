import React, { Component } from 'react'
import { Icon } from 'antd'
import styles from './RoadDetail.scss'
import RoadImg from './img/road.jpg'
import Equipment from './Equipment/Equipment'

class RoadDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      IsspanMessage: false,
    }
  }
  componentWillMount = () => {
    this.getInter()
  }
  componentDidMount = () => {
    // 接收传递来的路口id
    this.getdcuByInterId()
  }
  getInter = () => {
    const { search } = this.props.location
    const nums = search.indexOf('&')
    this.interId = search.substring(4, nums)
    this.bac = search.substr(nums + 5)
  }
  getdcuByInterId = () => {

  }
  // 关闭控制窗口
  closeStage = () => {
    this.setState({
      IsspanMessage: false,
    })
  }
  // 打开控制窗口
  showStage = () => {
    this.setState({
      IsspanMessage: true,
    })
  }
  render() {
    const { IsspanMessage } = this.state
    return (
      <div className={styles.RoadDetail}>
        <img src={RoadImg} alt="" />
        <Equipment />
        <div className={styles.roadName}>
          <div className={styles.roadNameTitle}>路口1</div>
          <div>所属区域:海淀区</div>
          <div>信号机品牌:海信</div>
          <span onClick={this.showStage}>控制窗口</span>
        </div>
        <div className={styles.DeviceStatus}>
          <ul className={styles.DeviceStatus_left}>
            <li>设备状态:<span className={styles.fontColor}>&nbsp;正常在线</span></li>
            <li>控制状态:<span className={styles.fontColor}></span>本地多时段</li>
            <li>
              当前时段:<span className={styles.fontColor}></span>
              东西左转
              {/* {
                sinaglInfo &&
                <span className={styles.stageImgBox}>
                  <img width="30px" height="30px" src={`${this.processUrl}/atms/comm/images/anniu/${sinaglInfo.STAGE_IMAGE}`} alt="" />
                </span>
              }&nbsp;
              {sinaglInfo ? sinaglInfo.STAGE_CODE : '--'} */}
            </li>
            <li>当前方案:<span className={styles.fontColor}></span>方案10</li>
            <li>2019/12/02 22:43:20</li>
          </ul>
          <div className={styles.DeviceStatus_right}>
            <dl className={styles.deviceControlBtn}>
              <dt><span className={styles.stageImgBox}>锁定</span></dt>
              <dd>锁定</dd>
            </dl>
            <dl className={styles.deviceControlBtn}>
              <dt><span className={styles.stageImgBox}>自动</span></dt>
              <dd>取消步进</dd>
            </dl>
          </div>
        </div>
        {IsspanMessage &&
          <div className={styles.spanMessage}>
            <span onClick={this.closeStage} className={styles.closeStage}><Icon type="close" /></span>
            <div className={styles.stage}>
              <div className={styles.stageLeft}>锁定阶段控制:</div>
              <ul className={styles.stageRight}>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
              </ul>
            </div>
            <div className={styles.control}>
              <div className={styles.controlLeft}>锁定控制模式:</div>
              <ul className={styles.controlRight}>
                <li>全红控制</li>
                <li>黄闪控制</li>
                <li>关灯控制</li>
              </ul>
            </div>
            <div className={styles.programme}>
              <div className={styles.programmeLeft}>锁定方案:</div>
              <ul className={styles.programmeRight}>
                <li>方案一</li>
                <li>方案二</li>
                <li>方案三</li>
              </ul>
            </div>
            <div className={styles.Timing}>
              <div className={styles.timingLeft}>
                校时:
              </div>
              <div className={styles.timingRight}>
                <span>DCU校时</span>
                <span>信号机校时</span>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default RoadDetail
