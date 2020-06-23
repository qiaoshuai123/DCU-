import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class BasicInfoRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  componentDidUpdate = () => {

  }
  componentDidMount = () => {

  }
  // step 2 基础信息配置保存
  stepTwoAddForList = () => {
    message.info("信号机基础信息保存成功！")
  }
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
  }

  render() {
    return (
      <div className={styles.conBox}>
      <div className={styles.rTit}>信号机基础信息<em onClick={ () =>{this.stepTwoAddForList()} }>保存</em></div>
      {/* 表单 */}
      <div className={styles.rCon}>
        <div className={styles.itemInputBox}>
          <span>信号机编号：</span><Input placeholder="请输入编号" />
        </div>
        <div className={styles.itemInputBox}>
          <span>信号机IP：</span><Input placeholder="请输入IP" />
        </div>
        <div className={styles.itemInputBox}>
          <span>子网掩码：</span><Input placeholder="请输入掩码" />
        </div>
        <div className={styles.itemInputBox}>
          <span>网 关：</span><Input placeholder="请输入网关" />
        </div>
        <div className={styles.itemInputBox}>
          <span>上位机IP：</span><Input placeholder="请输入IP" />
        </div>
        <div className={styles.itemInputBox}>
          <span>通讯端口：</span><Input placeholder="请输入端口" />
        </div>
        <div className={styles.itemInputBox}>
          <span>信号机时区：</span><Input placeholder="请输入时区" />
        </div>
        <div className={styles.itemInputBox}>
          <span>控制路口数：</span><Input type="number" placeholder="请输入数量" />
        </div>
        <div className={styles.itemInputBox}>
          <span>GPS时钟标志：</span><Input placeholder="请输入标志" />
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
    
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(BasicInfoRight)