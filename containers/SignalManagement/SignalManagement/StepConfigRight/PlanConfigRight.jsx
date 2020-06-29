import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getInfoListsTypeMore, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import ListForAntd from '../../ListForAntd/ListForAntd'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'

class PlanConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      planLists: null,
      listNames: null,
    }
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
    console.log(this.props, '状态')
    this.props.getInfoListsTypeMore(this.props.roadInterId, this.props.roadNodeNo, 'PLAN')
  }
  getListData = (data) => {
    const listNames = []
    for (let p in data) {
      let newObj;
      switch(p){     
        case 'schemeNodeNo':
          newObj = {key: p, label: '方案序号'}
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
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
  }
  handleClickFind = (e, itemData) => {
    if ($(e.currentTarget).hasClass(Liststyles.hover)){
      $(e.currentTarget).removeClass(Liststyles.hover)
      if (itemData.phaseLampgroupId.indexOf(',') === -1) {
        $('div[pic-mark]').map(( i, item ) => {
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phaseLampgroupId)) {
            $(item).removeClass(styles.imgCurrent)
          }
        })
      } else {
        const leftSelArr = itemData.phaseLampgroupId.split(',')
        leftSelArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('lampgroup'+items)) {
              $(item).removeClass(styles.imgCurrent)
            }
          })
        })
      }
    } else {
      $(e.currentTarget).addClass(Liststyles.hover).siblings().removeClass(Liststyles.hover)
      if (itemData.phaseLampgroupId.indexOf(',') === -1) {
        $('div').map(( i, item ) => {
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phaseLampgroupId)) {
            $(item).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
          }
        })
      } else {
        const leftSelArr = itemData.phaseLampgroupId.split(',')
        leftSelArr.map((items) => {
          $('div').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('lampgroup'+items)) {
              $(item).addClass(styles.imgCurrent)
            }
          })
        })
      }
    }
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
  render() {
    const { planLists, listNames } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>配时方案配置列表<em onClick={() => { this.popLayerShowHide("stepSevenAddEdit", true) }}>添加</em></div>
        { !!planLists && !!listNames ? <ListForAntd {...this.props} dataSourse={planLists} listNames={listNames} showIndex={3} handleClickFind={this.handleClickFind} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
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
    getInfoListsTypeMore: bindActionCreators(getInfoListsTypeMore, dispatch),
    getDelInfoType: bindActionCreators(getDelInfoType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(PlanConfigRight)
