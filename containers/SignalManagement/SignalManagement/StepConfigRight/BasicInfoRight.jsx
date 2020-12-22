import React, { PureComponent } from 'react'
import { Input, DatePicker, message, Radio } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { postSignalSave } from '../../../../reactRedux/actions/publicActions'
import moment from 'moment'
import styles from '../SignalManagement.scss'
// 正则校验
const regUtil = {
  isEmpty: function (e, idType) {
    if (e === "") {
      message.info('设备ID不能为空！')
      $('#' + idType).focus()
      return false;
    } else if (e < 0) {
      message.info('设备ID不能为负数')
      $('#' + idType).focus()
      return false;
    } else {
      return true;
    }
  },
  isValidIp: function (e, idType, errorName) { // IP
    if (!/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(e)) {
      message.info(`${errorName}`)
      $('#' + idType).focus()
      return false
    } else {
      return true;
    }
  },
  isValidSubnetMask: function (e, idType) { //subnetMask
    if (!/^((128|192)|2(24|4[08]|5[245]))(\.(0|(128|192)|2((24)|(4[08])|(5[245])))){3}$/.test(e)) {
      message.info('子网不符合规则')
      $('#' + idType).focus()
      return false
    } else {
      return true;
    }
  },
  isValidGateway: function (e, idType) { //网关
    if (!/^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/.test(e)) {
      message.info('网关不符合规则')
      $('#' + idType).focus()
      return false
    } else {
      return true;
    }
  },
  isValidPort: function (e, idType) { //端口
    if (!(/^[1-9]\d*$/.test(e) && 1 <= 1 * e && 1 * e <= 65535)) {
      message.info('端口不符合规则')
      $('#' + idType).focus()
      return false
    } else {
      return true;
    }
  }
}
class BasicInfoRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showPopData: null,
      userLimit: null,
    }
    this.showPopData = null
  }
  componentDidUpdate = (prevState) => {
    const { savePopData } = this.props.data
    if (prevState.data.savePopData !== savePopData) {
      message.info("信号机基础信息保存成功！")
    }
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    limitArr.forEach((item) => {
      if (item.id === 201) {
        this.setState({ userLimit: true })
      }
    })
    this.showPopData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    this.setState({
      showPopData: this.showPopData,
    })
  }
  // step 2 基础信息配置保存
  stepTwoAddForList = () => {
    const deviceIdFlag = regUtil.isEmpty(this.showPopData.deviceId, 'deviceId')
    const iPFlag = regUtil.isValidIp(this.showPopData.ip, 'ip', '信号机ip不符合规则')
    const serverIpFlag = regUtil.isValidIp(this.showPopData.serverIp, 'serverIp', '上位机ip不符合规则')
    const subnetMaskFlag = regUtil.isValidSubnetMask(this.showPopData.subnetMask, 'subnetMask')
    const gatewayFlag = regUtil.isValidGateway(this.showPopData.gateway, 'gateway')
    const serverPortFlag = regUtil.isValidPort(this.showPopData.serverPort, 'serverPort')
    const portFlag = regUtil.isValidPort(this.showPopData.port, 'port')
    if (deviceIdFlag && iPFlag && serverIpFlag && subnetMaskFlag && gatewayFlag && serverPortFlag && portFlag) {
      this.props.postSignalSave(this.showPopData)
    }
  }
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
  }
  handleChangeInput = (event, type, name) => {
    if (name === 'maintainPhone') {
      const reg = /^[0-9]*$/.test(event.target.value)
      if (reg) {
        this[type][name] = event.target.value
        this.setState({
          showPopData: null,
        }, () => {
          this.setState({
            showPopData: this.showPopData,
          })
        })
      }
    } else {
      this[type][name] = event.target.value
      this.setState({
        showPopData: null,
      }, () => {
        this.setState({
          showPopData: this.showPopData,
        })
      })
    }
  }
  getDate = (time, num = 0) => {
    let today = ''
    today = new Date()
    if (time) {
      today = new Date(time)
    }
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    const day = ('0' + (today.getDate())).slice(-2)
    const hour = ('0' + (today.getHours() + num)).slice(-2)
    const minutes = ('0' + (today.getMinutes())).slice(-2)
    const seconds = ('0' + (today.getSeconds())).slice(-2)
    const navtime = year + '-' + month + '-' + day + ' '
    const navmse = hour + ':' + minutes + ':' + seconds
    return navtime + navmse
  }
  onEndChangeTime = (value, name) => {
    this.showPopData[name] = value ? this.getDate(value._d) : ''
    this.setState({
      showPopData: null,
    }, () => {
      this.setState({
        showPopData: this.showPopData,
      })
    })
  }
  render() {
    const { dcuPopData } = this.props.data
    const { showPopData, userLimit } = this.state
    const productionDateTime = !!dcuPopData && !!dcuPopData.productionDate ? moment(dcuPopData.productionDate, 'YYYY-MM-DD HH:mm:ss') : null
    const configurationDateTime = !!dcuPopData && !!dcuPopData.configurationDate ? moment(dcuPopData.configurationDate, 'YYYY-MM-DD HH:mm:ss') : null
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>信号机基础信息{userLimit ? <em onClick={() => { this.stepTwoAddForList() }}>保存</em> : null}</div>
        {/* 表单 */}
        <div className={styles.rCon}>
          <div className={styles.itemInputBox}>
            <span>设备ID：</span><Input type="number" disabled={!userLimit} id="deviceId" onChange={e => this.handleChangeInput(e, 'showPopData', 'deviceId')} placeholder="请输入设备ID" value={!!showPopData && !!showPopData.deviceId ? showPopData.deviceId : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>信号机IP：</span><Input disabled={!userLimit} id="ip" onChange={e => this.handleChangeInput(e, 'showPopData', 'ip')} placeholder="请输入信号机IP" value={!!showPopData && !!showPopData.ip ? showPopData.ip : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>上位机IP：</span><Input disabled={!userLimit} id="serverIp" onChange={e => this.handleChangeInput(e, 'showPopData', 'serverIp')} placeholder="请输入上位机IP" value={!!showPopData && !!showPopData.serverIp ? showPopData.serverIp : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>子网掩码：</span><Input disabled={!userLimit} id="subnetMask" onChange={e => this.handleChangeInput(e, 'showPopData', 'subnetMask')} placeholder="请输入子网掩码" value={!!showPopData && !!showPopData.subnetMask ? showPopData.subnetMask : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>网 关：</span><Input disabled={!userLimit} id="gateway" onChange={e => this.handleChangeInput(e, 'showPopData', 'gateway')} placeholder="请输入网关" value={!!showPopData && !!showPopData.gateway ? showPopData.gateway : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>通讯端口：</span><Input disabled={!userLimit} id="serverPort" onChange={e => this.handleChangeInput(e, 'showPopData', 'serverPort')} placeholder="请输入通讯端口" value={!!showPopData && !!showPopData.serverPort ? showPopData.serverPort : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>端口号：</span><Input disabled={!userLimit} id="port" onChange={e => this.handleChangeInput(e, 'showPopData', 'port')} placeholder="请输入端口号" value={!!showPopData && !!showPopData.port ? showPopData.port : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>信号机时区：</span><Input disabled={!userLimit} onChange={e => this.handleChangeInput(e, 'showPopData', 'timeZone')} placeholder="请输入信号机时区" value={!!showPopData && !!showPopData.timeZone ? showPopData.timeZone : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>生产厂家：</span><Input disabled={!userLimit} onChange={e => this.handleChangeInput(e, 'showPopData', 'brand')} placeholder="请输入生产厂家" value={!!showPopData && !!showPopData.brand ? showPopData.brand : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>设备版本：</span><Input disabled={!userLimit} onChange={e => this.handleChangeInput(e, 'showPopData', 'deviceVersion')} placeholder="请输入设备版本" value={!!showPopData && !!showPopData.deviceVersion ? showPopData.deviceVersion : ''} />
          </div>
          <div className={styles.itemInputBox}>
            {/* <span>出厂日期：</span><Input onChange={e => handleChangeInput(e, 'showPopData', 'productionDate')} placeholder="请选择出厂日期" value={!!showPopData && !!showPopData.productionDate ? showPopData.productionDate : ''} /> */}
            <span>出厂日期：</span>
            <DatePicker
              showTime
              format="YYYY-MM-DD"
              defaultValue={productionDateTime}
              placeholder="-出厂日期-"
              disabled={!userLimit}
              onChange={productionDateTime => this.onEndChangeTime(productionDateTime, 'productionDate')}
            />
          </div>
          <div className={styles.itemInputBox}>
            {/* <span>配置日期：</span><Input onChange={e => handleChangeInput(e, 'showPopData', 'configurationDate')} placeholder="请选择配置日期" value={!!showPopData && !!showPopData.configurationDate ? showPopData.configurationDate : ''} /> */}
            <span>配置日期：</span>
            <DatePicker
              showTime
              format="YYYY-MM-DD"
              defaultValue={configurationDateTime}
              placeholder="-配置日期-"
              disabled={!userLimit}
              onChange={configurationDateTime => this.onEndChangeTime(configurationDateTime, 'configurationDate')}
            />
          </div>
          {/* <div className={styles.itemInputBox}>
            <span>运行阶段：</span><Input disabled={!userLimit} onChange={e => this.handleChangeInput(e, 'showPopData', 'runPhase')} placeholder="请输入运行阶段" value={!!showPopData && !!showPopData.runPhase ? showPopData.runPhase : ''} />
          </div> */}
          <div className={styles.itemInputBox}>
            <span>维护电话：</span><Input disabled={!userLimit} onChange={e => this.handleChangeInput(e, 'showPopData', 'maintainPhone')} placeholder="请输入维护电话" value={!!showPopData && !!showPopData.maintainPhone ? showPopData.maintainPhone : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>GPS时钟标志：</span>
            <div style={{ flex: '4.2' }}>
              <Radio.Group disabled={!userLimit} onChange={e => this.handleChangeInput(e, 'showPopData', 'gpsClockSign')} value={!!showPopData && !!showPopData.gpsClockSign ? showPopData.gpsClockSign : "0"}>
                <Radio value="0">无</Radio>
                <Radio value="1">有</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.publicData, ...state.SignalManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    postSignalSave: bindActionCreators(postSignalSave, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(BasicInfoRight)