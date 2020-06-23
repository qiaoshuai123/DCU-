import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class PhaseConfigRight extends PureComponent {
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
      <div className={styles.conBox} >
        <div className={styles.rTit}>相位配置列表<em onClick={() => { this.popLayerShowHide("stepFiveAddEdit", true) }}>添加</em></div>

        <div className={styles.rList}>
          <div className={styles.listItem}>
            <em>相位编号</em>
            <em>相位名称</em>
            <em>相位包含灯组</em>
            <em>失去路权过渡参数</em>
            <em>获得路权过渡参数</em>
            <em>开机失去路权过渡参数</em>
            <em>开机获得路权过渡参数</em>
            <em>最小绿时间</em>
            <em>延迟绿时间</em>
            <em>需求检测器</em>
            <em>相位屏蔽</em>
            <em>相位禁止</em>
            <em>操作</em>
          </div>
          <div className={classNames(styles.listItem)}>
            <span>1</span>
            <span>东</span>
            <span>圆灯</span>
            <span>2</span>
            <span>1</span>
            <span>东</span>
            <span>圆灯</span>
            <span>23</span>
            <span>1</span>
            <span>东</span>
            <span>圆灯</span>
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
export default connect(mapStateToProps, mapDisPatchToProps)(PhaseConfigRight)