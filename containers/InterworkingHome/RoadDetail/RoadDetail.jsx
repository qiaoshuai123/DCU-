import React, { Component } from 'react'
import { Icon } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './RoadDetail.scss'
import { laneInfoAndDetail, lampgroupDetailList, detectorDetailList, nowPhasestageInfo, lockStateList, schemeInfoList } from '../../../reactRedux/actions/equipmentManagement'
import { getUnitPop } from '../../../reactRedux/actions/publicActions'
// import Equipment from './Equipment/Equipment'

class RoadDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dcuPopData: '',
      IsspanMessage: false,
      RoadImg: '',
      isMeessage: false,
      laneInfoAndDetailinfo: '', // 车道图片接口
      lampgroupDetailListinfo: [], // 灯组图片
      detectorDetailListinfo: [], // 检测器图片
      schemeInfoListinfo: [], // 当前方案全部阶段F
      lockStateListinfo: [], // 控制模式
      nowPhasestageInfos: [], // 当前路口全部方案
    }
    this.imgshref = 'http://192.168.1.213:20203/DCU/dcuImage/background/'
  }
  componentWillMount = () => {
    this.getInter()
  }
  componentDidMount = () => {
    // 接收传递来的路口id
    this.props.laneInfoAndDetail(this.objs)
    this.props.lampgroupDetailList(this.objs)
    this.props.detectorDetailList(this.objs)
    this.setState({
      RoadImg: this.bac,
    })
  }
  componentDidUpdate = (prevState) => {
    const { dcuPopData, laneInfoAndDetailinfo, lampgroupDetailListinfo, detectorDetailListinfo, nowPhasestageInfos, lockStateListinfo, schemeInfoListinfo } = this.props.data
    if (prevState.data.dcuPopData !== dcuPopData) {
      this.getdcuPopData(dcuPopData)
    }
    if (prevState.data.laneInfoAndDetailinfo !== laneInfoAndDetailinfo) {
      this.getlaneInfoAndDetailinfo(laneInfoAndDetailinfo)
    }
    if (prevState.data.lampgroupDetailListinfo !== lampgroupDetailListinfo) {
      this.getlampgroupDetailListinfo(lampgroupDetailListinfo)
    }
    if (prevState.data.detectorDetailListinfo !== detectorDetailListinfo) {
      this.getdetectorDetailListinfo(detectorDetailListinfo)
    }
    if (prevState.data.nowPhasestageInfos !== nowPhasestageInfos) {
      this.getnowPhasestageInfos(nowPhasestageInfos)
    }
    if (prevState.data.lockStateListinfo !== lockStateListinfo) {
      this.getlockStateListinfo(lockStateListinfo)
    }
    if (prevState.data.schemeInfoListinfo !== schemeInfoListinfo) {
      this.getschemeInfoListinfo(schemeInfoListinfo)
    }
  }
  getschemeInfoListinfo = (schemeInfoListinfo) => {
    console.log(schemeInfoListinfo, '当前方案全部阶段')
    this.setState({
      schemeInfoListinfo,
    })
  }
  getlockStateListinfo = (lockStateListinfo) => {
    console.log(lockStateListinfo, '控制模式')
    this.setState({
      lockStateListinfo,
    })
  }
  getnowPhasestageInfos = (nowPhasestageInfos) => {
    console.log(nowPhasestageInfos, '当前路口全部方案')
    this.setState({
      nowPhasestageInfos,
    })
  }
  getdcuPopData = (dcuPopData) => {
    console.log(dcuPopData, '详情')
    this.setState({ dcuPopData })
  }
  getlaneInfoAndDetailinfo = (laneInfoAndDetailinfo) => {
    console.log(laneInfoAndDetailinfo, '车道图片接口')
    this.setState({
      laneInfoAndDetailinfo,
    })
  }
  getlampgroupDetailListinfo = (lampgroupDetailListinfo) => {
    console.log(lampgroupDetailListinfo, '灯组图片接口')
    this.setState({
      lampgroupDetailListinfo,
    })
  }
  getdetectorDetailListinfo = (detectorDetailListinfo) => {
    console.log(detectorDetailListinfo, '检测器接口')
    this.setState({
      detectorDetailListinfo,
    })
  }
  getInter = () => {
    const { search } = this.props.location
    const nums = search.indexOf('&')
    const lastNums = search.lastIndexOf('&')
    this.interId = search.substring(4, nums)
    this.nodeId = search.substring(lastNums + 5)
    this.bac = JSON.parse(localStorage.getItem('bac'))
    this.objs = `interId=${this.interId}&nodeNo=${this.nodeId}`
  }
  // 关闭控制窗口
  closeStage = () => {
    this.setState({
      IsspanMessage: false,
    })
  }
  // 打开控制窗口
  showStage = () => {
    this.props.schemeInfoList(this.objs)
    this.props.nowPhasestageInfo(this.objs)
    this.props.lockStateList()
    this.setState({
      IsspanMessage: true,
    })
  }
  showImgMessage = (e) => {
    e.preventDefault()
    this.props.getUnitPop(this.interId)
    this.setState({
      isMeessage: true,
    })
  }
  btnCloseMessage = (e) => {
    e.stopPropagation()
    this.setState({
      isMeessage: false,
    })
  }
  render() {
    const {
      IsspanMessage, RoadImg, laneInfoAndDetailinfo, lampgroupDetailListinfo, detectorDetailListinfo,
      isMeessage, dcuPopData, schemeInfoListinfo, lockStateListinfo, nowPhasestageInfos,

    } = this.state
    return (
      <div className={styles.RoadDetail}>
        <div className={styles.dcuStyles} onClick={this.showImgMessage}>
          DCU
          {
            isMeessage &&
            <div className={styles.messageBox}>
              <span onClick={this.btnCloseMessage} className={styles.IconClose}><Icon type="close" /></span>
              <div>设备编号:{dcuPopData.deviceId}</div>
              <div>设备型号:{dcuPopData.brand}</div>
              <div>设备IP:{dcuPopData.ip}</div>
              <div>生产厂商:{dcuPopData.deviceVersion}</div>
              <div>维护电话:{dcuPopData.maintainPhone}</div>
              <div>设备状态:<span>正常状态</span></div>
              <div>信号接入状态:<span>正常</span></div>
              <div>发布服务状态:<span>正常</span></div>
            </div>
          }
        </div>
        <img src={`${this.imgshref}${RoadImg}`} alt="" />
        <div>
          {laneInfoAndDetailinfo && <img src={`${this.imgshref}${laneInfoAndDetailinfo.imageUrl}`} style={{ left: `${laneInfoAndDetailinfo.x}px`, top: `${laneInfoAndDetailinfo.y}px` }} className={styles.laneInfoAndDetailinfo} alt="" />}
        </div>
        {
          lampgroupDetailListinfo && lampgroupDetailListinfo.map((item, ind) => {
            return (<div key={ind}><img src={`${this.imgshref}${item.imageUrl}`} style={{ left: `${item.x}px`, top: `${item.y}px` }} className={styles.laneInfoAndDetailinfo} alt="" /></div>)
          })
        }
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
                {
                  nowPhasestageInfos && nowPhasestageInfos.map(item => <li key={item.id}>{item.phasestageName}</li>)
                }
              </ul>
            </div>
            <div className={styles.control}>
              <div className={styles.controlLeft}>锁定控制模式:</div>
              <ul className={styles.controlRight}>
                {
                  lockStateListinfo && lockStateListinfo.map(item => <li key={item.id}>{item.codeName}</li>)
                }
              </ul>
            </div>
            <div className={styles.programme}>
              <div className={styles.programmeLeft}>锁定方案:</div>
              <ul className={styles.programmeRight}>
                {
                  schemeInfoListinfo && schemeInfoListinfo.map(item => <li key={item.id}>{item.schemeName}</li>)
                }
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

const mapStateToProps = (state) => {
  return {
    data: { ...state.equipmentManagement, ...state.publicData },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
    laneInfoAndDetail: bindActionCreators(laneInfoAndDetail, dispatch),
    lampgroupDetailList: bindActionCreators(lampgroupDetailList, dispatch),
    detectorDetailList: bindActionCreators(detectorDetailList, dispatch),
    nowPhasestageInfo: bindActionCreators(nowPhasestageInfo, dispatch),
    lockStateList: bindActionCreators(lockStateList, dispatch),
    schemeInfoList: bindActionCreators(schemeInfoList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(RoadDetail)
