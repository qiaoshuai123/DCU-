import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getPicListsType, getInfoListsType, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class DetectorConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      detectorLists: null,
      clickFlag: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { detectorLists } = this.props.data
    if (prevState.data.detectorLists !== detectorLists) {
      this.setState({ detectorLists })
    }
  }
  componentDidMount = () => {
    console.log(this.props.isMoveFlag, '状态')
    console.log(this.props, 'look look')
    this.props.getInfoListsType(this.props.roadInterId, 'DETECTOR')
  }
  popLayerShowHide = (name, flag, event, stepType) => {
    this.props.popLayerShowHide(name, flag, event, stepType)
  }
  handleClickFind = (e) => {
    this.props.tagToPicMark(e)
  }
  delListItem = (e, id) => {
    e.stopPropagation();
    const _this = this;
    Modal.confirm({
      title: '确认要删除该数据？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'DETECTOR'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadId, _this.props.roadNodeNo)
          _this.props.getPicListsType(_this.props.roadInterId, _this.props.roadNodeNo, 'DETECTOR')
          _this.props.getInfoListsType(_this.props.roadInterId, 'DETECTOR')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }

  render() {
    const { detectorLists, clickFlag } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>检测器配置列表<em onClick={() => { this.popLayerShowHide("stepFourAddEdit", true, null, 'DETECTOR') }}>添加</em></div>

        <div className={styles.rList}>
          {  detectorLists === null || detectorLists.length === 0 ? <div className={styles.noData}>暂无数据</div> : <div className={styles.listItem}>
            <em>检测器编号</em>
            <em>检测器类型</em>
            <em>流量采集周期</em>
            <em>占有率采集周期</em>
            <em>操作</em>
          </div> }
          {
            detectorLists && detectorLists.map((item) => {
              return <div onClick={this.handleClickFind} key={'detector'+item.detectorId} tag-mark={'detector'+item.detectorId} className={classNames(styles.listItem, clickFlag ? styles.current : null)}>
                        <span>{!item.detectorId ? '无' : item.detectorId}</span>
                        <span>{!item.detectorTypeName ? '无' : item.detectorTypeName}</span>
                        <span>{!item.flowCollectionCycle ? '无' : item.flowCollectionCycle}</span>
                        <span>{!item.occupancyCollectionCycle ? '无' : item.occupancyCollectionCycle}</span>
                        <span className={styles.del}><b>修改</b><b onClick={(e) => this.delListItem(e, item.id)}>删除</b></span>
                      </div>
            })
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
    getStepStatus: bindActionCreators(getStepStatus, dispatch),
    getPicListsType: bindActionCreators(getPicListsType, dispatch),
    getInfoListsType: bindActionCreators(getInfoListsType, dispatch),
    getDelInfoType: bindActionCreators(getDelInfoType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(DetectorConfigRight)