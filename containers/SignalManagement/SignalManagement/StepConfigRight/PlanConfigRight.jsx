import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getInfoListsType, getInfoListsTypeMore, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import ListForAntd from '../../ListForAntd/ListForAntd'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'

class PlanConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      planLists: null,
      listNames: null,
      userLimit: null,
    }
    this.imgIconUrl = `${this.props.data.devImage}/DCU/dcuImage/phasestage/`
  }
  componentDidUpdate = (prevState) => {
    const { planLists } = this.props.data
    if (prevState.data.planLists !== planLists) {
      this.setState({ planLists: null, listNames: null, },()=>{
        this.setState({
          planLists
        },() => {
          if (this.state.planLists.length > 0) {
            this.getListData(this.state.planLists[0])
          }
        })
      })
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
    this.props.getInfoListsType(this.props.roadInterId, 'STAGE')
    this.props.getInfoListsTypeMore(this.props.roadInterId, this.props.roadNodeNo, 'PLAN')
  }
  getListData = (data) => {
    const listNames = []
    for (let p in data) {
      let newObj;
      switch(p){     
        case 'schemeNo':
          newObj = {key: p, label: '方案序号'}
          break;
        case 'schemeName':
          newObj = {key: p, label: '方案名称'}
          break;
        case 'schemeCycle':
          newObj = {key: p, label: '方案周期'}
          break;
        case 'schemeCoordinationNo':
          newObj = {key: p, label: '方案协调序号'}
          break;
        case 'schemePhaseDiferenceTime':
          newObj = {key: p, label: '方案相位差时间'}
          break;
        case 'phaseStageInfoList':
          newObj = {key: p, label: '放行阶段列表'}
          break;
        case 'coordinationImagePath':
          newObj = {key: p, label: '协调阶段'}
          break; 
      }
      if (newObj) listNames.push(newObj) 
    }
    this.setState({ listNames })
  }
  popLayerShowHide = (name, flag, event, stepType) => {
    this.props.popLayerShowHide(name, flag, event, stepType)
  }
  handleClickFind = (e, itemData) => {
    e.stopPropagation()
    if ($(e.currentTarget).hasClass(Liststyles.hover)){
      $(e.currentTarget).removeClass(Liststyles.hover)
    } else {
      $(e.currentTarget).addClass(Liststyles.hover).siblings().removeClass(Liststyles.hover)
    }
    this.props.handleClickFind(e, itemData, Liststyles.hover)
  }
  delListItem = (e, id) => {
    e.stopPropagation();
    const _this = this;
    Modal.confirm({
      title: '确认要删除该数据？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'PLAN'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadId, _this.props.roadNodeNo)
          _this.props.getInfoListsTypeMore(_this.props.roadInterId, _this.props.roadNodeNo, 'PLAN')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }
  updateListItem = (itemDetailData, stepType) => {
    this.props.updateListItem(itemDetailData, stepType)
  }
  render() {
    const { planLists, listNames, userLimit } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>配时方案配置列表{ userLimit ? <em onClick={() => { this.popLayerShowHide("stepSevenAddEdit", true, null, 'PLAN') }}>添加</em> : null }</div>
        { !!planLists && !!listNames ? <ListForAntd {...this.props} dataSourse={planLists} listNames={listNames} listType={'PLAN'} imgIconUrl={this.imgIconUrl} showIndex={3} handleClickFind={this.handleClickFind} updateListItem={this.updateListItem} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
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
    getInfoListsType: bindActionCreators(getInfoListsType, dispatch),
    getInfoListsTypeMore: bindActionCreators(getInfoListsTypeMore, dispatch),
    getDelInfoType: bindActionCreators(getDelInfoType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(PlanConfigRight)
