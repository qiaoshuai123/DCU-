import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getPicListsType, getInfoListsType, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class LaneConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      laneLists: null,
      clickFlag: null,
      userLimit: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { laneLists } = this.props.data
    if (prevState.data.laneLists !== laneLists) {
      this.setState({ laneLists })
    }
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    limitArr.forEach((item) => {
      if (item.id === 201){
        this.setState({ userLimit: true })
      }
    })
    this.props.getInfoListsType(this.props.roadInterId, 'DETECTOR')
    this.props.getInfoListsType(this.props.roadInterId, 'LANE')
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
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'LANE'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadInterId, _this.props.roadNodeNo)
          _this.props.getPicListsType(_this.props.roadInterId, _this.props.roadNodeNo, 'LANE')
          _this.props.getInfoListsType(_this.props.roadInterId, 'LANE')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }
  updateListItem = (itemDetailData, stepType, e) => {
    console.log(itemDetailData, '修改的数据')
    e.stopPropagation();
    this.props.getUpdateAllTypes(itemDetailData.interId, this.props.roadNodeNo, itemDetailData.laneId, stepType, true)
  }
  render() {
    const { laneLists, clickFlag, itemDetailData, userLimit } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>车道配置列表{ userLimit ? <em onClick={() => { this.popLayerShowHide("stepRoadAddEdit", true, null, 'LANE') }}>添加</em> : null }</div>
        <div className={styles.rList}>
          { laneLists === null || laneLists.length === 0 ? <div className={styles.noData}>暂无数据</div> : <div className={styles.listItem}>
            <em>车道ID</em>
            <em>车道号</em>
            <em>道路编号</em>
            <em>进出口方向</em>
            <em>转向</em>
            <em>方向描述</em>
            <em>外部车道号</em>
            { userLimit ? <em style={{ flex: 1.3 }}>操作</em> : null }
          </div> }
          {
            laneLists && laneLists.map((item) => {
              return <div onClick={this.handleClickFind} key={'lane'+item.laneId} tag-mark={'lane'+item.laneId} className={classNames(styles.listItem, clickFlag ? styles.current : null)}>
                        <span>{!item.laneId ? '无' : item.laneId}</span>
                        <span>{!item.laneNo ? '无' : item.laneNo}</span>
                        <span>{!item.fRid ? '无' : item.fRid}</span>
                        <span>{!item.laneSdtypeNo ? '无' : item.laneSdtypeNo}</span>
                        <span>{!item.turnDirNoName ? '无' : item.turnDirNoName}</span>
                        <span>{!item.dirName ? '无' : item.dirName}</span>
                        <span>{!item.laneIdCust ? '无' : item.laneIdCust}</span>
                        { userLimit ? <span style={{ flex: 1.3 }} className={styles.del}><b onClick={(e) => this.updateListItem(item, 'LANE', e)}>修改</b> <b onClick={(e) => this.delListItem(e, item.id)}>删除</b></span> : null }
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
export default connect(mapStateToProps, mapDisPatchToProps)(LaneConfigRight)