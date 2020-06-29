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
    console.log(this.props, '状态')
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
          newObj = {key: p, label: '阶段中包含相位'}
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
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'STAGE'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadId, _this.props.roadNodeNo)
          _this.props.getInfoListsType(_this.props.roadInterId, 'STAGE')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }

  render() {
    const { stageLists, listNames } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>阶段配置列表<em onClick={() => { this.popLayerShowHide("stepSixAddEdit", true) }}>添加</em></div>
        { !!stageLists && !!listNames ? <ListForAntd {...this.props} dataSourse={stageLists} listNames={listNames} showIndex={3} handleClickFind={this.handleClickFind} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
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
