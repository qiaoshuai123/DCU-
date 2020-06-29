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
    }
  }
  componentDidUpdate = (prevState) => {
    const { laneLists } = this.props.data
    if (prevState.data.laneLists !== laneLists) {
      this.setState({ laneLists })
    }
  }
  componentDidMount = () => {
    console.log(this.props, '状态')
    this.props.getInfoListsType(this.props.roadInterId, 'LANE')
  }
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
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
          _this.props.getStepStatus(_this.props.roadId, _this.props.roadNodeNo)
          _this.props.getPicListsType(_this.props.roadInterId, _this.props.roadNodeNo, 'LANE')
          _this.props.getInfoListsType(_this.props.roadInterId, 'LANE')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }
  render() {
    const { laneLists, clickFlag } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>车道配置列表<em onClick={() => { this.popLayerShowHide("stepRoadAddEdit", true) }}>添加</em></div>
        <div className={styles.rList}>
          { laneLists === null || laneLists.length === 0 ? <div className={styles.noData}>暂无数据</div> : <div className={styles.listItem}>
            <em>车道号</em>
            <em>道路编号</em>
            <em>转向</em>
            <em>通行方向描述</em>
            <em>外部车道号</em>
            <em>操作</em>
          </div> }
          {
            laneLists && laneLists.map((item) => {
              return <div onClick={this.handleClickFind} key={'lane'+item.laneId} tag-mark={'lane'+item.laneId} className={classNames(styles.listItem, clickFlag ? styles.current : null)}>
                        <span>{item.laneId}</span>
                        <span>{item.fRid}</span>
                        <span>{item.turnDirNoName}</span>
                        <span>{item.dirName}</span>
                        <span>{item.laneIdCust}</span>
                        <span className={styles.del} onClick={(e) => this.delListItem(e, item.id)}>删除</span>
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