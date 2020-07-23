import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getInfoListsTypeMore, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import ListForAntd from '../../ListForAntd/ListForAntd'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'

class DayPlanConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dayPlanLists: null,
      listNames: null,
      userLimit: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { dayPlanLists } = this.props.data
    if (prevState.data.dayPlanLists !== dayPlanLists) {
      this.setState({ dayPlanLists: null, listNames: null, },()=>{
        this.setState({
          dayPlanLists
        },() => {
          if (this.state.dayPlanLists.length > 0) {
            this.getListData(this.state.dayPlanLists[0])
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
    this.props.getInfoListsTypeMore(this.props.roadInterId, this.props.roadNodeNo, 'PLAN')
    this.props.getInfoListsTypeMore(this.props.roadInterId, this.props.roadNodeNo, 'DAYPLAN')
  }
  getListData = (data) => {
    const listNames = []
    for (let p in data) {
      let newObj;
      switch(p){     
        case 'dailyplanNo':
          newObj = {key: p, label: '计划编号'}
          break;
        case 'timeintervalList':
          newObj = {key: p, label: '计划列表'}
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
        $('div[pic-mark]').map(( i, item ) => {
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phaseLampgroupId)) {
            $(item).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
          }
        })
      } else {
        const leftSelArr = itemData.phaseLampgroupId.split(',')
        leftSelArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
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
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'DAYPLAN'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadInterId, _this.props.roadNodeNo)
          _this.props.getInfoListsTypeMore(_this.props.roadInterId, _this.props.roadNodeNo, 'DAYPLAN')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }
  updateListItem = (itemDetailData, stepType) => {
    this.props.updateListItem(itemDetailData, stepType)
  }
  handleLineClick = (id, stepType) => {
    this.props.handleLineClick(id, stepType)
  }
  render() {
    const { dayPlanLists, listNames, userLimit } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>日计划配置列表{ userLimit ? <em onClick={() => { this.popLayerShowHide("stepEightAddEdit", true, null, 'DAYPLAN') }}>添加</em> : null }</div>
        { !!dayPlanLists && !!listNames ? <ListForAntd {...this.props}  handleLineClick={this.handleLineClick} dataSourse={dayPlanLists} listNames={listNames} showIndex={2} listType={'DAYPLAN'} handleClickFind={this.handleClickFind} updateListItem={this.updateListItem} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
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
export default connect(mapStateToProps, mapDisPatchToProps)(DayPlanConfigRight)