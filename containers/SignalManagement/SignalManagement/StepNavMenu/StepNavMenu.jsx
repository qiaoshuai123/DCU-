import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class StepNavMenu extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      // stepStatusData: null,
      userLimit: null,
    }
  }
  componentDidUpdate = (prevState) => {
    // const { stepStatusData } = this.props.data
    // if (prevState.data.stepStatusData !== stepStatusData) {
    //   this.setState({ stepStatusData })
    // }
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    limitArr.forEach((item) => {
      if (item.id === 201){
        this.setState({ userLimit: true })
      }
    })
  }
  showHidePop = (name, flag) => {
    this.props.showHidePop(name, flag)
  }
  loadDataType = () => {
    this.props.loadDataType(true)
  }
  editDataType = () => {
    this.props.editDataType(true)
  }

  render() {
    const { userLimit } = this.state
    return (
      <div className={styles.navContent}>
        <div className={styles.navBoxMenu}>
          <span className={classNames(this.props.stepOneFlag ? styles.hover : null, this.props.stepOneText !== '请选择路口' ? styles.link : null)} onClick={() => { this.showHidePop("stepOneFlag", true) }} title={this.props.stepOneText}>{this.props.stepOneText}</span>
          <s className={this.props.stepTwoFlag || this.props.stepRoadFlag || this.props.stepThreeFlag || this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepTwoFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[0] ? styles.link : null)} onClick={() => { this.showHidePop("stepTwoFlag", true) }}>基础信息配置</span>
          <s className={this.props.stepRoadFlag || this.props.stepThreeFlag || this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepRoadFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[1] ? styles.link : null)} onClick={() => { this.showHidePop("stepRoadFlag", true) }}>车道配置</span>
          <s className={this.props.stepThreeFlag || this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepThreeFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[2] ? styles.link : null)} onClick={() => { this.showHidePop("stepThreeFlag", true) }}>灯组配置</span>
          <s className={this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepFourFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[3] ? styles.link : null)} onClick={() => { this.showHidePop("stepFourFlag", true) }}>检测器配置</span>
          <s className={this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepFiveFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[4] ? styles.link : null)} onClick={() => { this.showHidePop("stepFiveFlag", true) }}>相位配置</span>
          <s className={this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepSixFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[5] ? styles.link : null)} onClick={() => { this.showHidePop("stepSixFlag", true) }}>阶段配置</span>
          <s className={this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepSevenFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[6] ? styles.link : null)} onClick={() => { this.showHidePop("stepSevenFlag", true) }}>配时方案配置</span>
          <s className={this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepEightFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[7] ? styles.link : null)} onClick={() => { this.showHidePop("stepEightFlag", true) }}>日计划配置</span>
          <s className={this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepNineFlag ? styles.hover : null, !!this.props.stepStatusData && !!this.props.stepStatusData[8] ? styles.link : null)} onClick={() => { this.showHidePop("stepNineFlag", true) }}>调度配置</span>
          { this.props.stepOneText !== '请选择路口' && userLimit ? 
            <div className={styles.controlBtnBox}>
              <em onClick={this.loadDataType}>上传配置</em>
              <em onClick={this.editDataType}>下发配置</em>
            </div> : null
          }
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
export default connect(mapStateToProps, mapDisPatchToProps)(StepNavMenu)