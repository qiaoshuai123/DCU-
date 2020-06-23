import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class PlanConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidUpdate = () => {

  }
  componentDidMount = () => {

  }
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
  }

  render() {
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>阶段配置列表<em onClick={() => { this.popLayerShowHide("stepSixAddEdit", true) }}>添加</em></div>

        <div className={styles.rList}>
          <div className={styles.listItem}>
            <em>阶段编号</em>
            <em>放行相位</em>
            <em>阶段图示</em>
            <em>操作</em>
          </div>
          <div className={classNames(styles.listItem)}>
            <span>1</span>
            <span>东</span>
            <span>圆灯</span>
            <span>删除</span>
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
export default connect(mapStateToProps, mapDisPatchToProps)(PlanConfigRight)
