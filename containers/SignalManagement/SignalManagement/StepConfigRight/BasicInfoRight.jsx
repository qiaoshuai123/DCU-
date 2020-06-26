import React, { PureComponent } from 'react'
import { Input, DatePicker, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { postSignalSave } from '../../../../reactRedux/actions/publicActions'
import moment from 'moment'
import styles from '../SignalManagement.scss'

class BasicInfoRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showPopData: null,
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
    this.showPopData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    this.setState({
      showPopData: this.showPopData,
    })
  }
  // step 2 基础信息配置保存
  stepTwoAddForList = () => {
    if ( this.showPopData.deviceId !== '') {
      this.props.postSignalSave(this.showPopData)
    } else {
      message.info('设备ID不能为空！')
      $('#deviceId').focus()
    }
  }
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
  }
  handleChangeInput = (event, type, name) => {
    this[type][name] = event.target.value
    this.setState({
      showPopData: null,
    }, ()=>{
      this.setState({
        showPopData: this.showPopData,
      })
    })
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
    }, ()=>{
      this.setState({
        showPopData: this.showPopData,
      })
    })
  }
  render() {
    const { dcuPopData } = this.props.data
    const { showPopData } = this.state
    debugger
    const productionDateTime = !!dcuPopData && !!dcuPopData.productionDate ? moment(dcuPopData.productionDate, 'YYYY-MM-DD HH:mm:ss') : null
    const configurationDateTime = !!dcuPopData && !!dcuPopData.configurationDate ? moment(dcuPopData.configurationDate, 'YYYY-MM-DD HH:mm:ss') : null
    return (
      <div className={styles.conBox}>
      <div className={styles.rTit}>信号机基础信息<em onClick={ () =>{this.stepTwoAddForList()} }>保存</em></div>
      {/* 表单 */}
      <div className={styles.rCon}>
          <div className={styles.itemInputBox}>
            <span>设备ID：</span><Input id="deviceId" onChange={e => this.handleChangeInput(e, 'showPopData', 'deviceId')} placeholder="请输入设备ID" value={!!showPopData && !!showPopData.deviceId ? showPopData.deviceId : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>信号机IP：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'ip')} placeholder="请输入信号机IP" value={!!showPopData && !!showPopData.ip ? showPopData.ip : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>上位机IP：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'serverIp')} placeholder="请输入上位机IP" value={!!showPopData && !!showPopData.serverIp ? showPopData.serverIp : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>子网掩码：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'subnetMask')} placeholder="请输入子网掩码" value={!!showPopData && !!showPopData.subnetMask ? showPopData.subnetMask : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>网 关：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'gateway')} placeholder="请输入网关" value={!!showPopData && !!showPopData.gateway ? showPopData.gateway : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>通讯端口：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'serverPort')} placeholder="请输入通讯端口" value={!!showPopData && !!showPopData.serverPort ? showPopData.serverPort : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>端口号：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'port')} placeholder="请输入端口号" value={!!showPopData && !!showPopData.port ? showPopData.port : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>信号机时区：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'timeZone')} placeholder="请输入信号机时区" value={!!showPopData && !!showPopData.timeZone ? showPopData.timeZone : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>生产厂家：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'brand')} placeholder="请输入生产厂家" value={!!showPopData && !!showPopData.brand ? showPopData.brand : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>设备版本：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'deviceVersion')} placeholder="请输入设备版本" value={!!showPopData && !!showPopData.deviceVersion ? showPopData.deviceVersion : ''} />
          </div>
          <div className={styles.itemInputBox}>
            {/* <span>出厂日期：</span><Input onChange={e => handleChangeInput(e, 'showPopData', 'productionDate')} placeholder="请选择出厂日期" value={!!showPopData && !!showPopData.productionDate ? showPopData.productionDate : ''} /> */}
            <span>出厂日期：</span>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              defaultValue={productionDateTime}
              placeholder="-出厂日期-"
              onChange={productionDateTime => this.onEndChangeTime(productionDateTime, 'productionDate')}
            />
          </div>
          <div className={styles.itemInputBox}>
            {/* <span>配置日期：</span><Input onChange={e => handleChangeInput(e, 'showPopData', 'configurationDate')} placeholder="请选择配置日期" value={!!showPopData && !!showPopData.configurationDate ? showPopData.configurationDate : ''} /> */}
            <span>配置日期：</span>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              defaultValue={configurationDateTime}
              placeholder="-配置日期-"
              onChange={configurationDateTime => this.onEndChangeTime(configurationDateTime, 'configurationDate') }
            />
          </div>
          <div className={styles.itemInputBox}>
            <span>运行阶段：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'runPhase')} placeholder="请输入运行阶段" value={!!showPopData && !!showPopData.runPhase ? showPopData.runPhase : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>维护电话：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'maintainPhone')} placeholder="请输入维护电话" value={!!showPopData && !!showPopData.maintainPhone ? showPopData.maintainPhone : ''} />
          </div>
          <div className={styles.itemInputBox}>
            <span>GPS时钟标志：</span><Input onChange={e => this.handleChangeInput(e, 'showPopData', 'gpsClockSign')} placeholder="请输入标志" value={!!showPopData && !!showPopData.gpsClockSign ? showPopData.gpsClockSign : ''} />
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