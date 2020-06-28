import React, { Component } from 'react'
import { Input, Icon, message, Select } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { postaddDcu, postupdateDcu, getintercheck } from '../../../../reactRedux/actions/equipmentManagement'
import { getUnitTree, getMapUnitInfoList } from '../../../../reactRedux/actions/publicActions'
import styles from './MessagePage.scss'

class MessagePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roadName: '',
      interId: '',
      interName: '',
      interType: '',
      nodeId: '',
      lng: '',
      lat: '',
      btnShows: true,
    }
    this.interTypeNum = ''
    this.formsVerification = {
      interId: '路口ID',
      interName: '路口名称',
      interType: '是不是主控路口',
      nodeId: '路口序号',
      lng: '经度',
      lat: '纬度',
    }
    this.objArr = [
      {
        num: 0,
        name: '是',
      },
      {
        num: 1,
        name: '否',
      }
    ]
  }
  componentDidMount = () => {
    this.roadNames()
    this.AllList()
  }

  componentDidUpdate = (nextProps) => {
    const { getObjNum } = this.props.data
    if (nextProps.lng !== this.props.lng || nextProps.lat !== this.props.lat) {
      this.getLngLat(this.props.lng, this.props.lat)
    }
    if (nextProps.data.getObjNum !== getObjNum) {
      console.log(getObjNum)
      this.getObjNums(getObjNum)
    }
  }
  getObjNums = (getObjNum) => {
    if (getObjNum.codeName) {
      this.setState({
        roadName: getObjNum.codeName,
      }, () => {
        this.areaCode = this.props.data.getObjNum.dictCode
      })
    }
  }
  getLngLat = (lng, lat) => {
    this.setState({
      lng,
      lat,
    })
  }
  // 获取点位名称区域编号
  roadNames = () => {
    this.setState({
      roadName: this.props.data.getObjNum.codeName
    })
    this.areaCode = this.props.data.getObjNum.dictCode
  }
  // 判断是否回显数据
  AllList = () => {
    const { AllList } = this.props
    if (AllList) {
      const { areaCode, interId, interName, interType, nodeId, lng, lat, id } = AllList
      const interTypes = this.objArr.find(item => item.num === interType).name
      this.interTypeNum = interType
      this.areaCode = areaCode
      this.addMsg = true
      this.id = id
      this.setState({
        interId,
        interName,
        interType: interTypes,
        nodeId,
        lng,
        lat,
        btnShows: false,
      })
    } else {
      this.setState({
        lng: '',
        lat: '',
      })
    }
  }
  // 更改input框内容
  changeNumber = (e, optios) => {
    if (optios) {
      const { pname } = optios.props
      this.setState({
        [pname]: e,
      })
      this.interTypeNum = e
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
  addForm = async (bos) => {
    // 验证是否为空
    const as = await this.Verification(bos)
    // as不为真做提交请求
    console.log(as, this.addMsg, '2333')
    if (!as && this.addMsg) {
      const { interId, interName, lat, lng, nodeId } = this.state
      const strMsg = {
        areaCode: this.areaCode,
        interId,
        interName,
        interType: this.interTypeNum,
        lat,
        lng,
        nodeId,
        areaName: '',
        background: '',
        ownInterId: '',
      }
      if (!bos) {
        console.log(this.props.AllList)
        strMsg.id = this.id
        this.props.postupdateDcu(strMsg).then((res) => {
          if (res.data.msg === '请求成功') {
            this.props.getUnitTree()
            this.closeMessage()
            message.success('修改成功')
            this.props.getMapUnitInfoList()
          }
        })
      } else {
        this.props.postaddDcu(strMsg).then((res) => {
          if (res.data.msg === '请求成功') {
            this.props.getUnitTree()
            this.closeMessage()
            message.success('添加成功')
            this.props.getMapUnitInfoList()
          }
        })
      }
    }
  }
  Verification = (isTrue) => {
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
    if (isTrue && !this.addMsg) {
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
      roadName,
      btnShows,
    } = this.state
    return (
      <div className={styles.MessagePageBox}>
        <div className={styles.topTitle}><b style={{ color: '#15AEE5', margin: '0 3px' }}>{roadName}</b>点位信息<span onClick={this.closeMessage}><Icon type="close" /></span></div>
        <div className={styles.items}><span>路口ID:</span><Input disabled={!btnShows} paths="interId" style={{ width: 300 }} value={interId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>路口名称:</span><Input paths="interName" style={{ width: 300 }} value={interName} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>是不是主控路口:</span>
          <Select value={interType} style={{ width: 300, margin: 0 }} onChange={this.changeNumber}>
            <Option pname="interType" value="">请选择</Option>
            <Option pname="interType" value="0">是</Option>
            <Option pname="interType" value="1">否</Option>
          </Select>
        </div>
        <div className={styles.items}><span>路口序号:</span><Input disabled={!btnShows} paths="nodeId" style={{ width: 300 }} value={nodeId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>经度:</span><Input paths="lng" style={{ width: 300 }} value={lng} onChange={this.changeNumber} /></div>
        <div className={styles.items}><span>纬度:</span><Input paths="lat" style={{ width: 300 }} value={lat} onChange={this.changeNumber} /></div>
        <div className={styles.bombtn}>
          {
            btnShows ? <span onClick={() => this.addForm(true)}>保存</span> : <span onClick={() => this.addForm(false)}>修改</span>
          }
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.equipmentManagement }
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    postaddDcu: bindActionCreators(postaddDcu, dispatch),
    postupdateDcu: bindActionCreators(postupdateDcu, dispatch),
    getintercheck: bindActionCreators(getintercheck, dispatch),
    getUnitTree: bindActionCreators(getUnitTree, dispatch),
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(MessagePage)
