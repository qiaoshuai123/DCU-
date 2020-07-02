import React, { Component } from 'react'
import { Input, Icon, Radio, message, Upload, DatePicker } from 'antd'
import moment from 'moment'
{/* <DatePicker style={{ width: '177px' }} value={moment(this.formatDate(DateProduction), this.dateFormat)} format={this.dateFormat} onChange={this.onChangDateStart} /> */ }
// onChangDateStart = (date) => { // 出厂日期
//   console.log(this.formatDate(new Date(date._d) * 1), '出厂日期')
//   this.setState({
//     DateProduction: this.formatDate(new Date(date._d) * 1),
//   })
// }
// import Websocket from 'react-websocket';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getdcuByInterId, getsignalByInterId, postupdateDcuinfo } from '../../../reactRedux/actions/equipmentManagement'
import styles from './Information.scss'

// 图片转64位
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img)
}
// 上传图片的格式及大小
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === "image/png"
  if (!isJpgOrPng) {
    message.info('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.info('图片大小不能大于2MB!')
  }
  return isJpgOrPng && isLt2M
}
class Information extends Component {
  constructor(props) {
    super(props)
    this.state = {
      idDcu: '', // DCU的id
      deviceIdDCU: '', // DCU设备编号
      maintainPhoneDCU: '', // DCU维护电话
      serverTimeZone: '', // DCU时区
      interIdDCU: ' ', // 点位ID
      manufactor: '', // DCU生产厂家  可能后端提供名称错误
      deviceModel: '', // DCU设备型号
      signalConnectIp: '', // DCU的IP1设置（信号机通讯）
      signalConnectPort: '', // DCU的IP1端口号设置（信号机通讯）
      signalContentMask: '', // DCU的ip1子网掩码（信号机通讯）
      applicationConnectIp: '', //  DCU的IP2设置（平台系统通讯)
      applicationConnectPort: '', // DCU的IP2端口号设置（平台系统通讯）
      applicationConnectMask: '', // DCU的ip2子网掩码（平台系统通讯)
      applicationIp: '', // 平台系统IP
      applicationPort: '', // 平台系统端口号
      signalIp: '', // 信号机IP
      signalPort: '', // 信号机端口号
      signalType: '', // 信号机类型
      detectorType: '', // 检测器类型
      interIdsignal: '', // 点位ID
      brand: '', // 生产厂家
      idSignal: '', // 信号机的id
      deviceVersion: '', // 设备版本
      deviceIdsignal: '', // 设备ID
      productionDate: '', // 出厂日期,
      configurationDate: '', // 配置日期
      serverIp: '', // 上位机IP
      timeZone: '', // 时区
      ip: '', // IP
      port: '', // 端口号
      gpsClockSign: '', // GPS时钟标志
      subnetMask: '', // 子网掩码
      gateway: '', // 网关
      serverPort: '', // 通信端口
      maintainPhonesignal: '', // 维护电话
    }
    this.formDcu = {
      deviceIdDCU: '设备编号', // DCU设备编号
      signalIp: '信号机IP', // 信号机IP
      deviceModel: '设备型号', // DCU设备型号
      serverTimeZone: '时区', // DCU时区
      signalConnectIp: 'IP1设置', // DCU的IP1设置（信号机通讯
      signalConnectPort: 'IP1端口号设置', // DCU的IP1端口号设置（信号机通讯）
      signalContentMask: 'ip1子网掩码', // DCU的ip1子网掩码（信号机通讯）
      applicationConnectIp: 'IP2设置', //  DCU的IP2设置（平台系统通讯)
      applicationConnectPort: 'IP2端口号设置', // DCU的IP2端口号设置（平台系统通讯）
      applicationConnectMask: 'ip2子网掩码', // DCU的ip2子网掩码（平台系统通讯)
      applicationIp: '平台系统IP', // 平台系统IP
      applicationPort: '平台系统端口号', // 平台系统端口号
      signalPort: '信号机端口号', // 信号机端口号
      signalType: '信号机类型', // 信号机类型
      detectorType: '检测器类型', // 检测器类型
      manufactor: '生产厂家', // DCU生产厂家
      maintainPhoneDCU: '维护电话', // DCU维护电话
    }
    this.formsignal = {
      brand: '生产厂家 ', // 生产厂家
      deviceVersion: '设备版本', // 设备版本
      deviceId: 'deviceId', // 设备ID
      productionDate: 'productionDate', // 出厂日期,
      configurationDate: 'configurationDate', // 配置日期
      serverIp: '上位机IP', // 上位机IP
      timeZone: '时区 ', // 时区
      ip: 'IP', // IP
      port: '端口号', // 端口号
      gpsClockSign: 'GPS时钟标志', // GPS时钟标志
      subnetMask: '子网掩码 ', // 子网掩码
      gateway: '网关', // 网关
      serverPort: '通信端口', // 通信端口
      maintainPhonesignal: '维护电话', // 维护电话
    }
  }
  componentWillMount = () => {
    this.getInter()
  }
  componentDidMount = () => {
    // 接收传递来的路口interId
    this.props.getdcuByInterId(this.interId)
    this.props.getsignalByInterId(this.interId)
  }
  componentDidUpdate = (prevState) => {
    const { getInterId, signalByInterId } = this.props.data
    if (prevState.data.getInterId !== getInterId) {
      this.getgetInterId(getInterId)
    }
    if (prevState.data.signalByInterId !== signalByInterId) {
      this.getsignalByInterId(signalByInterId)
    }
  }
  // step2 底图选择
  onChangeBaseMap = (e) => {
    console.log('radio checked', e.target.value)
    this.setState({
      baseMapValue: e.target.value,
    })
  }
  getgetInterId = (getInterId) => {
    console.log(getInterId, 'qiaos')
    if (getInterId) {
      this.dcuIds = true
      const {
        id, deviceId, interId, serverTimeZone, manufactor,
        maintainPhone, deviceModel, signalConnectIp, signalConnectPort,
        signalContentMask, applicationConnectIp, applicationConnectPort, applicationConnectMask,
        applicationIp, applicationPort, signalIp, signalPort, signalType,
        detectorType,
      } = getInterId
      this.setState({
        idDcu: id,
        interIdDCU: this.interId,
        deviceIdDCU: deviceId,
        serverTimeZone,
        manufactor,
        maintainPhoneDCU: maintainPhone,
        deviceModel,
        signalConnectIp,
        signalConnectPort,
        signalContentMask,
        applicationConnectIp,
        applicationConnectPort,
        applicationConnectMask,
        applicationIp,
        applicationPort,
        signalIp,
        signalPort,
        signalType,
        detectorType,
      })
    } else {
      this.dcuIds = false
    }
  }
  getsignalByInterId = (signalByInterId) => {
    console.log(signalByInterId, 'qiao')
    if (signalByInterId) {
      this.signalIds = true
      const {
        id, interId, brand, deviceVersion, deviceId, productionDate,
        configurationDate, serverIp, timeZone, ip, port,
        gpsClockSign, subnetMask, gateway, serverPort, maintainPhone,
      } = signalByInterId
      this.setState({
        idSignal: id,
        interIdsignal: interId,
        brand,
        deviceVersion,
        deviceIdsignal: deviceId,
        productionDate,
        configurationDate,
        ip,
        serverIp,
        timeZone,
        port,
        gpsClockSign,
        subnetMask,
        gateway,
        serverPort,
        maintainPhonesignal: maintainPhone,
      })
    } else {
      this.signalIds = false
    }
  }
  getInter = () => {
    const { search } = this.props.location
    const nums = search.indexOf('&')
    this.interId = search.substring(4, nums)
    this.bac = search.substr(nums + 5)
  }
  // 添加信号机基础信息
  addSigna = async () => {
    const as = await this.VerificationSignal()
    if (!as) {
      const { } = this.state
      const objs = {
        brand: '', // 生产厂家
        deviceVersion: '', // 设备版本
        deviceIdsignal: '', // 设备ID
        productionDate: '', // 出厂日期,
        configurationDate: '', // 配置日期
        serverIp: '', // 上位机IP
        timeZone: '', // 时区
        ip: '', // IP
        port: '', // 端口号
        gpsClockSign: '', // GPS时钟标志
        subnetMask: '', // 子网掩码
        gateway: '', // 网关
        serverPort: '', // 通信端口
        maintainPhonesignal: '', // 维护电话
      }
    }
  }
  // 添加Dcu基础信息
  addDcu = async () => {
    const as = await this.VerificationDcu()
    if (!as && this.dcuIds) {
      const {
        idDcu,
        deviceIdDCU, // DCU设备编号
        maintainPhoneDCU, // DCU维护电话
        serverTimeZone, // DCU时区
        interIdDCU, // 点位ID
        manufactor, // DCU生产厂家  可能后端提供名称错误
        deviceModel, // DCU设备型号
        signalConnectIp, // DCU的IP1设置（信号机通讯）
        signalConnectPort, // DCU的IP1端口号设置（信号机通讯）
        signalContentMask, // DCU的ip1子网掩码（信号机通讯）
        applicationConnectIp, //  DCU的IP2设置（平台系统通讯)
        applicationConnectPort, // DCU的IP2端口号设置（平台系统通讯）
        applicationConnectMask, // DCU的ip2子网掩码（平台系统通讯)
        applicationIp, // 平台系统IP
        applicationPort, // 平台系统端口号
        signalIp, // 信号机IP
        signalPort, // 信号机端口号
        signalType, // 信号机类型
        detectorType, // 检测器类型
      } = this.state
      const objs = {
        id: idDcu,
        applicationConnectIp,
        applicationConnectMask,
        applicationConnectPort,
        applicationIp,
        applicationPort,
        areaName: '',
        dataSource: '',
        detectorType,
        deviceId: deviceIdDCU,
        deviceModel,
        interId: this.interId,
        interName: '',
        lat: '',
        lng: '',
        maintainPhone: maintainPhoneDCU,
        manufactor,
        serverTimeZone,
        signalConnectIp,
        signalConnectPort,
        signalContentMask,
        signalIp,
        signalPort,
        signalType,
      }
      this.props.postupdateDcuinfo(objs).then((res) => {
        if (res.data.code === 0) {
          message.success('添加成功')
        }
      })
    }
  }
  formatDate = (value) => { // 时间戳转换日期格式方法
    if (value == null) {
      return ''
    }
    const date = new Date(value)
    const y = date.getFullYear()// 年
    let MM = date.getMonth() + 1// 月
    MM = MM < 10 ? (`0${MM}`) : MM
    let d = date.getDate()// 日
    d = d < 10 ? (`0${d}`) : d
    let h = date.getHours()// 时
    h = h < 10 ? (`0${h}`) : h
    let m = date.getMinutes()// 分
    m = m < 10 ? (`0${m}`) : m
    let s = date.getSeconds()// 秒
    s = s < 10 ? (`0${s}`) : s
    return `${y}-${MM}-${d} ${h}:${m}:${s}`
  }
  // 更改input框内容
  handleChangeValue = (e) => {
    const interName = e.target.getAttribute('path')
    const values = e.target.value
    this.setState({
      [interName]: values,
    })
    // if (optios) {
    //   const { pname } = optios.props
    //   this.setState({
    //     [pname]: e,
    //   })
    //   this.interTypeNum = e
    // } else {
    //   const interName = e.target.getAttribute('paths')
    //   const values = e.target.value
    //   this.setState({
    //     [interName]: values,
    //   })
    // }
  }
  handleChangeBaseMap = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ baseLoading: true })
      return
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          baseLoading: false,
        }))
    }
  }
  handleClickBaseMap = () => {
    console.log(this.state.imageUrl)
    if (this.state.imageUrl === '' && this.state.baseMapValue === 2) {
      message.info('请选择底图')
    } else {
      message.info('底图设置成功')
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide('baseMapFlag', null)
      })
    }
  }
  VerificationDcu = () => {
    for (const i in this.formDcu) {
      if (!this.state[i]) {
        return message.warning(`请填写${this.formDcu[i]}`)
      }
    }
  }
  VerificationSignal = () => {
    for (const i in this.formsignal) {
      if (!this.state[i]) {
        return message.warning(`请填写${this.formsignal[i]}`)
      }
    }
  }
  // 显示隐藏弹层
  popLayerShowHide = (name, flag) => {
    this.setState({
      [name]: flag,
    })
  }
  // handleData = (a) => {
  //   console.log(a, '1122')
  // }
  render() {
    const {
      interRoadBg, baseMapFlag, imageUrl, deviceIdDCU, serverTimeZone,
      manufactor, maintainPhoneDCU, deviceModel, signalConnectIp,
      signalConnectPort, signalContentMask, applicationConnectIp, applicationConnectPort,
      applicationConnectMask, applicationIp, applicationPort, signalIp, signalPort,
      signalType, detectorType, brand, deviceVersion, deviceIdsignal,
      productionDate, configurationDate, serverIp, timeZone, ip,
      port, gpsClockSign, subnetMask, gateway, serverPort, maintainPhonesignal,
    } = this.state
    const uploadButton = (
      <em>{this.state.baseLoading ? <span><Icon type="loading" /> loading</span> : '上 传'}</em>
    )
    return (
      <div className={styles.Information}>
        {/* <Websocket
          url="ws://192.168.1.213:20203/DCU/websocket/interRunState/1/1/1"
          onMessage={this.handleData.bind(this)} /> */}
        <div className={styles.stepLeftCon}>
          {/* <div className={styles.leftItemCon}> */}
          <div
            className={styles.leftItemCon}
            style={interRoadBg !== '' ? {
              background: `url(${interRoadBg}) no-repeat`, backgroundPosition: 'center center',
              backgroundSize: 'contain',
            } : {}}
          >
            {/* 内部变化内容 */}
            {baseMapFlag ?
              <div className={styles.maskBg}>
                <div className={styles.popBox} style={{ top: '75%' }} >
                  <div className={styles.popTit}>选择底图<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("baseMapFlag", null) }} /></div>
                  <div className={styles.popCon}>
                    <div className={styles.typePic}>
                      <Radio.Group name="radiogroup" onChange={this.onChangeBaseMap} value={this.state.baseMapValue}>
                        <Radio value={1}>选择底图</Radio>
                        <Radio value={2}>上传底图</Radio>
                      </Radio.Group>
                    </div>
                    <div className={styles.typePic} style={{ width: '220px' }}>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handleChangeBaseMap}
                      >
                        {imageUrl ?
                          <img src={imageUrl} alt="底图" style={{ width: "100%" }} /> : <s>图片预览</s>
                        }
                        {this.state.baseMapValue === 2 ? uploadButton : null}
                      </Upload>
                      {this.state.baseMapValue === 2 ? null : <em>选 择</em>}

                    </div>
                  </div>
                  <div className={styles.popBottom}>
                    <em onClick={() => { this.handleClickBaseMap() }}>确 定</em>
                    <em onClick={() => { this.popLayerShowHide('baseMapFlag', null) }}>取 消</em>
                  </div>
                </div>
              </div> : null
            }
            <div className={styles.turnBgBtn} onClick={() => { this.popLayerShowHide("baseMapFlag", true) }}>路口底图</div>
          </div>
        </div>
        <div className={styles.stepRightCon}>
          <div className={styles.conBox}>
            <div className={styles.rTit}><span>DCU基础信息</span><em onClick={this.addDcu}>保存</em><em>设置重启</em><em>下发配置</em><em>上传配置</em></div>
            {/* 表单 */}
            <div className={styles.rCon}>
              <div className={styles.itemInputBox}>
                <span>设备编号：</span><Input path="deviceIdDCU" onChange={this.handleChangeValue} value={deviceIdDCU} placeholder="请输入设备编号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>信号机IP：</span><Input path="signalIp" onChange={this.handleChangeValue} value={signalIp} placeholder="请输入IP" />
              </div>
              <div className={styles.itemInputBox}>
                <span>设备型号：</span><Input path="deviceModel" onChange={this.handleChangeValue} value={deviceModel} placeholder="请输入设备型号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>时区：</span><Input path="serverTimeZone" onChange={this.handleChangeValue} value={serverTimeZone} placeholder="请输入时区" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP1设置：</span><Input path="signalConnectIp" onChange={this.handleChangeValue} value={signalConnectIp} placeholder="请输入IP1设置" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP1端口号设置：</span><Input path="signalConnectPort" onChange={this.handleChangeValue} value={signalConnectPort} placeholder="请输入IP1设置" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP1子网掩码：</span><Input path="signalContentMask" onChange={this.handleChangeValue} value={signalContentMask} placeholder="请输入IP子网掩码" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP2设置：</span><Input path="applicationConnectIp" onChange={this.handleChangeValue} value={applicationConnectIp} placeholder="请输入IP2" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP2端口号设置：</span><Input path="applicationConnectPort" onChange={this.handleChangeValue} value={applicationConnectPort} placeholder="请输入IP2端口号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP2子网掩码：</span><Input path="applicationConnectMask" onChange={this.handleChangeValue} value={applicationConnectMask} placeholder="请输入IP2子网掩码" />
              </div>
              <div className={styles.itemInputBox}>
                <span>平台系统IP：</span><Input path="applicationIp" onChange={this.handleChangeValue} value={applicationIp} placeholder="请输入端口平台系统IP" />
              </div>
              <div className={styles.itemInputBox}>
                <span>平台系统端口号：</span><Input path="applicationPort" onChange={this.handleChangeValue} value={applicationPort} placeholder="请输入平台系统端口号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>信号机端口号：</span><Input path="signalPort" onChange={this.handleChangeValue} value={signalPort} placeholder="请输入信号机端口号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>信号机类型：</span><Input path="signalType" onChange={this.handleChangeValue} value={signalType} placeholder="请输入信号机类型" />
              </div>
              <div className={styles.itemInputBox}>
                <span>检测器类型：</span><Input path="detectorType" onChange={this.handleChangeValue} value={detectorType} placeholder="请输入检测器类型" />
              </div>
              <div className={styles.itemInputBox}>
                <span>生产厂家：</span><Input path="manufactor" onChange={this.handleChangeValue} value={manufactor} placeholder="请输入生产厂家" />
              </div>
              <div className={styles.itemInputBox}>
                <span>维护电话：</span><Input path="maintainPhoneDCU" onChange={this.handleChangeValue} value={maintainPhoneDCU} type="number" placeholder="请输入维护电话" />
              </div>
            </div>
            {/* 列表 */}
            <div className={styles.rTit}><span>信号机基础信息</span><em onClick={this.addSigna}>保存</em><em>设置重启</em></div>
            <div className={styles.rCon}>
              <div className={styles.itemInputBox}>
                <span>生产厂家：</span><Input path="brand" onChange={this.handleChangeValue} value={brand} placeholder="请输入生产厂家" />
              </div>
              <div className={styles.itemInputBox}>
                <span>设备版本</span><Input path="deviceVersion" onChange={this.handleChangeValue} value={deviceVersion} placeholder="请输入设备版本" />
              </div>
              <div className={styles.itemInputBox}>
                <span>设备ID：</span><Input path="deviceIdsignal" onChange={this.handleChangeValue} value={deviceIdsignal} placeholder="请输入设备ID" />
              </div>
              <div className={styles.itemInputBox}>
                <span>上位机IP：</span><Input path="serverIp" onChange={this.handleChangeValue} value={serverIp} placeholder="请输入上位机IP" />
              </div>
              <div className={styles.itemInputBox}>
                <span>时区：</span><Input path="timeZone" onChange={this.handleChangeValue} value={timeZone} placeholder="请输入时区" />
              </div>
              <div className={styles.itemInputBox}>
                <span>端口号：</span><Input path="port" onChange={this.handleChangeValue} value={port} placeholder="请输入端口号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>IP：</span><Input path="ip" onChange={this.handleChangeValue} value={ip} placeholder="请输入IP" />
              </div>
              <div className={styles.itemInputBox}>
                <span>GPS时钟标志：</span><Input path="gpsClockSign" onChange={this.handleChangeValue} value={gpsClockSign} placeholder="请输入GPS时钟标志" />
              </div>
              <div className={styles.itemInputBox}>
                <span>出厂日期：</span><Input path="productionDate" onChange={this.handleChangeValue} value={productionDate} placeholder="请输入出厂日期" />
              </div>
              <div className={styles.itemInputBox}>
                <span>配置日期：</span><Input path="configurationDate" onChange={this.handleChangeValue} value={configurationDate} placeholder="请输入配置日期" />
              </div>
              <div className={styles.itemInputBox}>
                <span>子网掩码</span><Input path="subnetMask" onChange={this.handleChangeValue} value={subnetMask} placeholder="请输入子网掩码" />
              </div>
              <div className={styles.itemInputBox}>
                <span>网关：</span><Input path="gateway" onChange={this.handleChangeValue} value={gateway} placeholder="请输入网关" />
              </div>
              <div className={styles.itemInputBox}>
                <span>通信端口：</span><Input path="serverPort" onChange={this.handleChangeValue} value={serverPort} placeholder="请输入通信端口" />
              </div>
              <div className={styles.itemInputBox}>
                <span>维护电话：</span><Input path="maintainPhonesignal" onChange={this.handleChangeValue} value={maintainPhonesignal} placeholder="请输入维护电话" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.equipmentManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getdcuByInterId: bindActionCreators(getdcuByInterId, dispatch),
    getsignalByInterId: bindActionCreators(getsignalByInterId, dispatch),
    postupdateDcuinfo: bindActionCreators(postupdateDcuinfo, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(Information)
