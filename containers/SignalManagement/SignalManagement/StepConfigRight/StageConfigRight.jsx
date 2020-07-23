import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getInfoListsType, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import ListForAntd from '../../ListForAntd/ListForAntd'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'

class StageConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      stageLists: null,
      listNames: null,
      userLimit: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { stageLists } = this.props.data
    if (prevState.data.stageLists !== stageLists) {
      this.setState({ stageLists: null, listNames: null, },()=>{
        this.setState({
          stageLists
        },() => {
          if (this.state.stageLists.length > 0) {
            this.getListData(this.state.stageLists[0])
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
  }
  getListData = (data) => {
    const listNames = []
    for (let p in data) {
      let newObj;
      switch(p){     
        case 'phasestageNo':
          newObj = {key: p, label: '阶段编号'}
          break;
        case 'phasestageName':
          newObj = {key: p, label: '阶段名称'}
          break;
        case 'phasestagePhase':
          newObj = {key: p, label: '阶段中包含相位'}
          break;
        case 'lateStartTime':
          newObj = {key: p, label: '阶段中相位晚启动的时间'}
          break;
        case 'leftingEndTime':
          newObj = {key: p, label: '阶段中相位早结束的时间'}
          break;
        case 'softwareRequirement':
          newObj = {key: p, label: '相位阶段软件需求'}
          break;
        case 'phasestageLane':
          newObj = {key: p, label: '阶段中包含车道'}
          break;
        case 'phaseNames':
          newObj = {key: p, label: '阶段中包含相位名称'}
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
      if (itemData.phasestageLampgroup.indexOf(',') === -1) {
        $('div[pic-mark]').map(( i, item ) => {
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phasestageLampgroup) || item.getAttribute('pic-mark') === ('lane'+itemData.phasestageLane)) {
            $(item).removeClass(styles.imgCurrent)
          }
        })
      } else {
        const leftSelArr = itemData.phasestageLampgroup.split(',')
        leftSelArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('lampgroup'+items)) {
              $(item).removeClass(styles.imgCurrent)
            }
          })
        })
        const leftLaneArr = itemData.phasestageLane.split(',')
        leftLaneArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('lane'+items)) {
              $(item).removeClass(styles.imgCurrent)
            }
          })
        })
      }
    } else {
      $(e.currentTarget).addClass(Liststyles.hover).siblings().removeClass(Liststyles.hover)
      if (itemData.phasestageLampgroup.indexOf(',') === -1) {
        $('div[pic-mark]').map(( i, item ) => {
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phasestageLampgroup) || item.getAttribute('pic-mark') === ('lane'+itemData.phasestageLane)) {
            $(item).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
          }
        })
      } else {
        $('div[pic-mark]').map(( i, item ) => {
          if (item.getAttribute('pic-mark').indexOf('lampgroup') > -1 || item.getAttribute('pic-mark').indexOf('lane') > -1) {
            $(item).removeClass(styles.imgCurrent)
          }
        })
        const leftSelArr = itemData.phasestageLampgroup.split(',')
        leftSelArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('lampgroup'+items)) {
              $(item).addClass(styles.imgCurrent)
            }
          })
        })
        const leftLaneArr = itemData.phasestageLane.split(',')
        leftLaneArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('lane'+items)) {
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
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'STAGE'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadInterId, _this.props.roadNodeNo)
          _this.props.getInfoListsType(_this.props.roadInterId, 'STAGE')
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
    const { stageLists, listNames, userLimit } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>阶段配置列表{ userLimit ? <em onClick={() => { this.popLayerShowHide("stepSixAddEdit", true, null, 'STAGE') }}>添加</em> : null }</div>
        { !!stageLists && !!listNames ? <ListForAntd {...this.props} dataSourse={stageLists} listNames={listNames} showIndex={3} listType={'STAGE'} handleClickFind={this.handleClickFind} updateListItem={this.updateListItem} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
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
    getDelInfoType: bindActionCreators(getDelInfoType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(StageConfigRight)
