import React, { Component } from 'react'
import Websocket from 'react-websocket'
import { Icon, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './RoadDetail.scss'
import {
  laneInfoAndDetail, lampgroupDetailList, detectorDetailList,
  nowPhasestageInfo, lockStateList, schemeInfoList,
  proofreadTime, centerControl,
} from '../../../reactRedux/actions/equipmentManagement'
import { getUnitPop } from '../../../reactRedux/actions/publicActions'
// import Equipment from './Equipment/Equipment

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
      arrs: [],
      detectorDetailListinfo: [], // 检测器图片
      schemeInfoListinfo: [], // 当前方案全部阶段F
      lockStateListinfo: [], // 控制模式
      nowPhasestageInfos: [], // 当前路口全部方案
      schemeDcu: {},// 点击dcu弹出详细信息
      planRunStage: [],
      remainingTime: null,
      schemeName: '',
      phasestageNo: '',
      imgPaths: '',
      phasestageNames: '',
      isOnline: '',
      detectorState: [], // 动态更改检测器汽车显示
      signalTime: '', // 信号机时间
      dcuTime: '', // dcu时间
      datas: '', // 显示时间
      colors: '',
    }
    this.imgshref = '/DCU/dcuImage/background/'
    this.laneBgUrl = '/DCU/dcuImage/lane/' // 车道
    this.lightBgUrl = '/DCU/dcuImage/lampgroup/' // 灯组
    this.detectorBgUrl = '/DCU/dcuImage/detector/' // 检测器
    this.phaseBgUrl = '/DCU/dcuImage/phasestage/' // 相位图标
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
  }
  componentWillMount = () => {
    this.getInter()
  }
  componentDidMount = () => {
    // 接收传递来的路口id
    this.props.laneInfoAndDetail(this.objs)
    this.props.lampgroupDetailList(this.objs)
    this.props.detectorDetailList(this.objs)
    this.timer = setInterval(this.newdate, 1000)
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
  componentWillUnmount = () => {
    // this.handleClose()
    // this.handleCloseSc()
    // window.open('#777')
    clearInterval(this.timer)
  }
  getschemeInfoListinfo = (schemeInfoListinfo) => {
    // console.log(schemeInfoListinfo, '当前方案全部阶段')
    this.setState({
      schemeInfoListinfo,
    })
  }
  getlockStateListinfo = (lockStateListinfo) => {
    // console.log(lockStateListinfo, '控制模式')
    this.setState({
      lockStateListinfo,
    })
  }
  getnowPhasestageInfos = (nowPhasestageInfos) => {
    // console.log(nowPhasestageInfos, '当前路口全部方案')
    this.setState({
      nowPhasestageInfos,
    })
  }
  getdcuPopData = (dcuPopData) => {
    // console.log(dcuPopData, '详情')
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
    this.nodeId = search.substring(nums + 5, lastNums)
    this.unitId = search.substring(lastNums + 6)
    this.bac = JSON.parse(localStorage.getItem('bac'))
    this.objs = `interId=${this.interId}&nodeNo=${this.nodeId}`
  }
  add0 = (m) => { return m < 10 ? `0${m}` : m }
  format(shijianchuo) {
    // shijianchuo是整数，否则要parseInt转换
    let time = new Date(shijianchuo)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let mm = time.getMinutes()
    let s = time.getSeconds()
    return `${y}-${this.add0(m)}-${this.add0(d)} ${this.add0(h)}:${this.add0(mm)}:${this.add0(s)}`
  }
  newdate = () => {
    const date = new Date() * 1
    this.setState({
      datas: this.format(date),
    })
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
  proofread = (num, name) => {
    const str = `interId=${this.interId}&proofreadType=${num}`
    this.props.proofreadTime(str).then((res) => {
      const { code, msg } = res.data
      if (code === 0) {
        message.success(`${name}锁定成功`)
      } else {
        message.error(msg)
      }
    })
  }
  centerControls = (ids, name, nums) => {
    const str = `controlType=${nums}&controlVal=${ids}&interId=${this.interId}&nodeNo=${this.nodeId}`
    this.props.centerControl(str).then((res) => {
      const { code, msg } = res.data
      if (code === 0) {
        message.success(`${name}成功`)
      } else {
        message.error(msg)
      }
    })
  }
  handleData = (e) => {
    let result = JSON.parse(e);
    console.log(result, 'socket 数据')
    const { lampgroupState, phasestageState, running, isOnline, detectorState } = JSON.parse(e)
    const { remainingTime, phasestageNo, runningTime } = phasestageState
    const { localTime } = running
    this.setState({
      arrs: lampgroupState,
      remainingTime,
      phasestageNo,
      isOnline,
      detectorState,
    })
    this.startWidth(runningTime, phasestageNo)
    this.phasestageNos(phasestageNo)
  }

  handleDataSc = (e) => {
    let result = JSON.parse(e);
    console.log(result, 'socketsc 数据')
    const { phasestageList, allTime, schemeName } = JSON.parse(e)
    this.insWidth = 960 / allTime
    this.setState({
      planRunStage: phasestageList,
      schemeName,
    })
  }
  handleDcu = (e) => {
    let result = JSON.parse(e);
    console.log(result, 'socket 数据')
    const schemeDcu = JSON.parse(e)
    this.setState({
      schemeDcu,
    })
  }
  handleTime = (e) => {
    let result = JSON.parse(e);
    console.log(result, 'socket 数据')
    const { signalTime, dcuTime } = JSON.parse(e)
    this.setState({
      signalTime,
      dcuTime,
    })
  }
  startWidth = (time, no) => {
    const { planRunStage } = this.state
    if (planRunStage) {
      const nos = planRunStage[no - 1]
      let colors = ''
      let nums = 0
      for (let index = 0; index < no - 1; index++) {
        nums += planRunStage[index].phasetageTime
      }
      console.log(time, nos.phasetageTime, '时间')
      if (time <= nos.green) {
        colors = 'green'
      } else if (nos.green < time && time <= (nos.green + nos.yellow)) {
        colors = 'yellow'
      } else if ((nos.green + nos.yellow) < time && time <= nos.phasetageTime) {
        colors = 'red'
      }
      console.log(colors, '颜色')
      this.setState({
        widths: (nums + time) * this.insWidth,
        colors,
      })
    }
  }
  phasestageNos = (phasestageNo) => {
    const { planRunStage } = this.state
    if (planRunStage) {
      const { phasestageName, imagePath } = planRunStage.find(item => item.phasestageNo == phasestageNo)
      this.setState({
        phasestageNames: phasestageName,
        imgPaths: imagePath,
      })
    }
  }
  render() {
    const {
      IsspanMessage, RoadImg, laneInfoAndDetailinfo, lampgroupDetailListinfo, detectorDetailListinfo,
      isMeessage, dcuPopData, schemeInfoListinfo, lockStateListinfo, nowPhasestageInfos, planRunStage,
      arrs, remainingTime, schemeName, imgPaths, phasestageNames, widths, isOnline, phasestageNo,
      schemeDcu, detectorState, signalTime, dcuTime, datas, colors,
    } = this.state
    return (
      <div className={styles.RoadDetail}>
        <div className={styles.AnimationTime}>
          <div className={styles.palnRunBox}>
            <div className={styles.runStage} style={{ width: `${widths}px` }}><span className={styles.stageInner} /></div>
            {
              planRunStage &&
              planRunStage.map((item, ind) => {
                const greenWid = this.insWidth * item.green
                const yellowWid = this.insWidth * item.yellow
                const redWid = this.insWidth * item.red
                return (
                  <div className={styles.planRunStage} key={`${item.phasestageName}${ind}`}>
                    <span className={styles.stageMsg}>{item.phasestageName} &nbsp;{item.phasetageTime}秒</span>
                    <div className={styles.greenStage} style={{ width: `${greenWid}px` }} />
                    <div className={styles.yellowStage} style={{ width: `${yellowWid}px` }} />
                    <div className={styles.redStage} style={{ width: `${redWid}px` }} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <Websocket
          url={`${this.props.data.devSockets}/DCU/websocket/interMonitorRealTime/${this.unitId}/${this.interId}/${this.nodeId}?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        // onClose={() => this.handleClose()}
        />
        <Websocket
          url={`${this.props.data.devSockets}/DCU/websocket/interMonitorScheme/${this.unitId}/${this.interId}/${this.nodeId}?Authorization=${this.token}`}
          onMessage={this.handleDataSc.bind(this)}
        // onClose={() => this.handleCloseSc()}
        />
        {
          isMeessage && <Websocket
            url={`${this.props.data.devSockets}/DCU/websocket/dcuRunState/${this.unitId}/${this.interId}/${this.nodeId}?Authorization=${this.token}`}
            onMessage={this.handleDcu.bind(this)}
          />
        }
        {
          IsspanMessage && <Websocket
            url={`${this.props.data.devSockets}/DCU/websocket/deviceTime/0/${this.interId}/0?Authorization=${this.token}`}
            onMessage={this.handleTime.bind(this)}
          />
        }
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
              <div>设备状态:<span>{schemeDcu.isOnline == 1 ? '正常在线' : '离线状态'}</span></div>
              <div>信号接入状态:<span></span></div>
              <div>发布服务状态:<span></span></div>
            </div>
          }
        </div>
        <div style={{ backgroundImage: `url(${this.props.data.devImage}${this.imgshref}${RoadImg})` }} className={styles.imgBox} >
          <div style={{ backgroundColor: `${colors}` }} className={styles.centralBox}>
            {remainingTime}
          </div>
          {
            lampgroupDetailListinfo && lampgroupDetailListinfo.map((item, ind) => {
              const imgStyleL = {
                position: 'absolute', display: 'inline-block', top: `${item.y}px`, left: `${item.x}px`, paddingTop: '14px', transform: `translate(-50%,-50%) rotate(${item.angle}deg)`,
              }
              let as = ''
              let str = `${this.props.data.devImage}/DCU/dcuImage/lampgroup`
              arrs && arrs.map((items) => {
                if (item.lampgroupNo === items.lampgroupNo) {
                  as = items.lamogroupStatus
                }
              })
              str = `${str + as}/`
              return (
                <div key={`${str}${ind}`} style={imgStyleL} className={styles.laneInfoAndDetailinfo}>
                  <img style={{ userSelect: 'none' }} src={`${str}${item.imageUrl}`} alt="" />
                </div>

              )
            })
          }
          {
            detectorDetailListinfo && detectorDetailListinfo.map((item, ind) => {
              const imgStyleL = {
                position: 'absolute', display: 'inline-block', top: `${item.y}px`, left: `${item.x}px`, userSelect: 'none', paddingTop: '14px', transform: `translate(-50%,-50%) rotate(${item.angle}deg)`,
              }
              let as = ''
              let str = `${this.props.data.devImage}/DCU/dcuImage/detector`
              detectorState && detectorState.map((items) => {
                if (item.detectorId === items.detectorId) {
                  if (items.isOnline === '1') {
                    if (items.detectorVehicleIsexist === '1') {
                      as = 2
                    } else {
                      as = 1
                    }
                  }
                }
              })
              str = `${str + as}/`
              return (
                <div key={`${item}${ind}`} style={imgStyleL} className={styles.laneInfoAndDetailinfo}>
                  <img style={{ userSelect: 'none' }} src={`${str}${item.imageUrl}`} alt="" />
                </div>)
            })
          }
          {
            laneInfoAndDetailinfo && laneInfoAndDetailinfo.map((item, ind) => {
              const imgStyleL = {
                position: 'absolute', display: 'inline-block', top: `${item.y}px`, left: `${item.x}px`, userSelect: 'none', paddingTop: '14px', transform: `translate(-50%,-50%) rotate(${item.angle}deg)`,
              }
              return (
                <div key={`${item}${ind}`} style={imgStyleL} className={styles.laneInfoAndDetailinfo}><img style={{ userSelect: 'none' }} src={`${this.props.data.devImage}${this.laneBgUrl}${item.imageUrl}`} alt="" /></div>
              )
            })
          }
        </div>
        <div className={styles.roadName}>
          <div className={styles.roadNameTitle}>路口1</div>
          <div>所属区域:海淀区</div>
          <div>信号机品牌:海信</div>
          <span onClick={this.showStage}>控制窗口</span>
        </div>
        <div className={styles.DeviceStatus}>
          <ul className={styles.DeviceStatus_left}>
            <li>设备状态:<span className={styles.fontColor}>&nbsp;{isOnline === 1 ? '正常在线' : '离线'}</span></li>
            <li>控制状态:<span className={styles.fontColor}></span>本地多时段</li>
            <li>
              当前阶段:<span className={styles.fontColor}>{phasestageNames}</span>
              <span className={styles.stageImgBox}>
                <img width="30px" height="30px" src={`${this.props.data.devImage}/DCU/dcuImage/phasestage1/${imgPaths}`} alt="" />
              </span>
            </li>
            <li>当前方案:<span className={styles.fontColor} />{schemeName}</li>
            <li>{datas}</li>
          </ul>
          <div className={styles.DeviceStatus_right}>
            {
              planRunStage && planRunStage.map((item, index) => {
                let num = ''
                if (item.phasestageNo == phasestageNo) { num = 1 }
                return (
                  <dl key={item + index} className={styles.deviceControlBtn}>
                    <dt><span className={styles.stageImgBox}><img src={`${this.props.data.devImage}/DCU/dcuImage/phasestage${num}/` + item.imagePath} alt="" /></span></dt>
                    <dd>{item.phasestageName}</dd>
                  </dl>
                )
              })
            }
          </div>
        </div>
        {IsspanMessage &&
          <div className={styles.spanMessage}>
            <span onClick={this.closeStage} className={styles.closeStage}><Icon type="close" /></span>
            <div className={styles.stage}>
              <div className={styles.stageLeft}>锁定阶段控制:</div>
              <ul className={styles.stageRight}>
                {
                  nowPhasestageInfos && nowPhasestageInfos.map(item => <li key={item.id} onDoubleClick={() => this.centerControls(item.phasestageNo, '锁定阶段控制', 1)} style={{ backgroundImage: `url(${this.props.data.devImage}${this.phaseBgUrl}${item.imagePath})` }} />)
                }
              </ul>
            </div>
            <div className={styles.control}>
              <div className={styles.controlLeft}>锁定控制模式:</div>
              <ul className={styles.controlRight}>
                {
                  lockStateListinfo && lockStateListinfo.map(item => <li key={item.id} onDoubleClick={() => this.centerControls(item.dictCode, '锁定阶段控制', 2)}>{item.codeName}</li>)
                }
              </ul>
            </div>
            <div className={styles.programme}>
              <div className={styles.programmeLeft}>锁定方案:</div>
              <ul className={styles.programmeRight}>
                {
                  schemeInfoListinfo && schemeInfoListinfo.map(item => <li key={item.id} onDoubleClick={() => this.centerControls(item.schemeNodeNo, '锁定方案', 3)}>{item.schemeName}</li>)
                }
              </ul>
            </div>
            <div className={styles.times}>
              <span>
                {
                  dcuTime
                }
              </span>
              <span>
                {
                  signalTime
                }
              </span>
            </div>
            <div className={styles.Timing}>
              <div className={styles.timingRight}>
                <span onClick={() => this.proofread(1, 'DCU')}>DCU校时</span>
                <span onClick={() => this.proofread(2, '信号机')}>信号机校时</span>
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
    data: { ...state.equipmentManagement, ...state.publicData, ...state.SignalManagement },
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
    proofreadTime: bindActionCreators(proofreadTime, dispatch),
    centerControl: bindActionCreators(centerControl, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(RoadDetail)
