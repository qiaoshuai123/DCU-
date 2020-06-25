import React, { Component } from 'react'
import { Input, Icon, message, Select } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { postaddDcu, postupdateDcu, getintercheck } from '../../../../reactRedux/actions/equipmentManagement'
import styles from './MessagePage.scss'

class MessagePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interId: '',
      interName: '',
      interType: '',
      nodeId: '',
      lng: this.props.lng || '',
      lat: this.props.lat || '',
    }
    this.formsVerification = {
      interId: '路口ID',
      interName: '路口名称',
      interType: '是不是主控路口',
      nodeId: '路口序号',
      lng: '经度',
      lat: '纬度',
    }
  }
  componentDidMount = () => {
    // 判断父级传递下来id，回显使用
    const { roadId } = this.props
    if (roadId) {
      this.echoData(roadId)
    }
  }

  componentDidUpdate = (nextProps) => {
    if (nextProps.lng !== this.props.lng || nextProps.lat !== this.props.lat) {
      this.getLngLat(this.props.lng, this.props.lat)
    }
  }
  getLngLat = (lng, lat) => {
    this.setState({
      lng,
      lat,
    })
  }
  echoData = () => {

    // 请求之后为变量赋值
  }
  // 更改input框内容
  changeNumber = (e, optios) => {
    if (optios) {
      const { pname } = optios.props
      console.log([pname], e)
      this.setState({
        [pname]: e,
      })
    } else {
      const interName = e.target.getAttribute('paths')
      const values = e.target.value
      this.setState({
        [interName]: values,
      })
    }
  }
  // 路口序号验证
  changBlur = () => {
    const { interId, nodeId } = this.state
    if (interId && nodeId) {
      const strMsgv = `interId=${interId}&nodeNo=${nodeId}`
      this.props.getintercheck(strMsgv).then((res) => {
        if (res.data.data === 0) {
          this.addMsg = false
          message.info('当前路口序号已存在')
        } else {
          this.addMsg = true
        }
      })
    }
  }
  // 点击提交
  addForm = async () => {
    // 验证是否为空
    const as = await this.Verification()
    // as不为真做提交请求
    if (!as && this.addMsg) {
      const strMsg = {
        areaCode: 0,
        interId: "string",
        interName: "string",
        interType: 0,
        lat: 0,
        lng: 0,
        nodeId: 0,
      }
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
    if (!this.addMsg) {
      message.info('当前路口序号已存在')
    }
  }
  // 关闭弹窗
  closeMessage = () => {
    this.props.closePoint()
  }
  render() {
    const { Option } = Select
    const {
      interId,
      interName,
      lng,
      nodeId,
      interType,
      lat,
    } = this.state
    return (
      <div className={styles.MessagePageBox}>
        <div className={styles.topTitle}>DCU点位信息<span onClick={this.closeMessage}><Icon type="close" /></span></div>
        <div className={styles.items}><span>路口ID:</span><Input paths="interId" style={{ width: 300 }} value={interId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>路口名称:</span><Input paths="interName" style={{ width: 300 }} value={interName} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>是不是主控路口:</span>
          <Select value={interType} style={{ width: 300, margin: 0 }} onChange={this.changeNumber}>
            <Option pname="interType" value="">请选择</Option>
            <Option pname="interType" value="0">是</Option>
            <Option pname="interType" value="1">否</Option>
          </Select>
        </div>
        <div className={styles.items}><span>路口序号:</span><Input paths="nodeId" style={{ width: 300 }} value={nodeId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>经度:</span><Input paths="lng" style={{ width: 300 }} value={lng} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>纬度:</span><Input paths="lat" style={{ width: 300 }} value={lat} onChange={this.changeNumber} /></div>
        <div className={styles.bombtn}><span onClick={this.addForm}>保存</span></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: {}
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    postaddDcu: bindActionCreators(postaddDcu, dispatch),
    postupdateDcu: bindActionCreators(postupdateDcu, dispatch),
    getintercheck: bindActionCreators(getintercheck, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(MessagePage)
