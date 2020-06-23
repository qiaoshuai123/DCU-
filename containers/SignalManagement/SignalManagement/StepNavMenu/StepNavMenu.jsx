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

    }
  }
  componentDidUpdate = () => {

  }
  componentDidMount = () => {

  }
  showHidePop = (name, flag) => {
    this.props.showHidePop(name, flag)
  }

  render() {
    return (
      <div className={styles.navContent}>
        <div className={styles.navBoxMenu}>
          <span className={classNames(this.props.stepOneFlag ? styles.hover : null, this.props.stepOneText !== '请选择路口' ? styles.link : null)} onClick={() => { this.showHidePop("stepOneFlag", true) }} title={this.props.stepOneText}>{this.props.stepOneText}</span>
          <s className={this.props.stepTwoFlag || this.props.stepRoadFlag || this.props.stepThreeFlag || this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepTwoFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepTwoFlag", true) }}>基础信息配置</span>
          <s className={this.props.stepRoadFlag || this.props.stepThreeFlag || this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepRoadFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepRoadFlag", true) }}>车道配置</span>
          <s className={this.props.stepThreeFlag || this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepThreeFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepThreeFlag", true) }}>灯组配置</span>
          <s className={this.props.stepFourFlag || this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={classNames(this.props.stepFourFlag ? styles.hover : null, styles.link)} onClick={() => { this.showHidePop("stepFourFlag", true) }}>检测器配置</span>
          <s className={this.props.stepFiveFlag || this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepFiveFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepFiveFlag", true) }}>相位配置</span>
          <s className={this.props.stepSixFlag || this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepSixFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepSixFlag", true) }}>阶段配置</span>
          <s className={this.props.stepSevenFlag || this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepSevenFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepSevenFlag", true) }}>配时方案配置</span>
          <s className={this.props.stepEightFlag || this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepEightFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepEightFlag", true) }}>日计划配置</span>
          <s className={this.props.stepNineFlag ? styles.hover : ""}></s>
          <span className={this.props.stepNineFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepNineFlag", true) }}>调度配置</span>
          <div className={styles.controlBtnBox}>
            <em>上传配置</em>
            <em>下发配置</em>
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
export default connect(mapStateToProps, mapDisPatchToProps)(StepNavMenu)