import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getInfoListsType, getDelInfoType, postAddOthersType, postUpdateOthersType } from '../../../../reactRedux/actions/signalmanagementActions'
import ListForAntd from '../../ListForAntd/ListForAntd'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'

class PhaseConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      phaseLists: null,
      listNames: null,
      detailData: null, // 详细信息
      phaseForbidenData: null,
      phaseShieldData: null,
      typeData: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { phaseLists, codeTypeData } = this.props.data
    if (prevState.data.phaseLists !== phaseLists) {
      this.setState({ phaseLists: null, listNames: null, },()=>{
        this.setState({
          phaseLists
        },() => {
          if (this.state.phaseLists.length > 0) {
            this.getListData(this.state.phaseLists[0])
          }
        })
      })
    }
    if (prevState.data.codeTypeData !== codeTypeData) {
      console.log(codeTypeData, 'codeType 数据')
    }
  }
  componentDidMount = () => {
    console.log(this.props, '状态')
    this.props.getInfoListsType(this.props.roadInterId, 'PHASE')
  }
  getListData = (data) => {
    const listNames = []
    for (let p in data) {
      let newObj;
      switch(p){     
        case 'phaseNo':
          newObj = {key: p, label: '相位序号'}
          break;
        case 'phaseName':
          newObj = {key: p, label: '相位名称'}
          break;
        case 'phaseLampgroupId':
          newObj = {key: p, label: '相位包含灯组'}
          break;
        case 'rightofwayLoseLamp1TypeName':
          newObj = {key: p, label: '失去路权过渡灯色1类型'}
          break;
        case 'rightofwayLoseLamp1Time':
          newObj = {key: p, label: '失去路权过渡灯色1时间'}
          break;
        case 'rightofwayLoseLamp2TypeName':
          newObj = {key: p, label: '失去路权过渡灯色2类型'}
          break;
        case 'rightofwayLoseLamp2Time':
          newObj = {key: p, label: '失去路权过渡灯色2时间'}
          break;
        case 'rightofwayLoseLamp3TypeName':
          newObj = {key: p, label: '失去路权过渡灯色3类型'}
          break;     
        case 'rightofwayLoseLamp3Time':
          newObj = {key: p, label: '失去路权过渡灯色3时间'}
          break;
        case 'rightofwayAccessLamp1TypeName':
          newObj = {key: p, label: '获得路权过渡灯色1类型'}
          break;
        case 'rightofwayAccessLamp1Time':
          newObj = {key: p, label: '获得路权过渡灯色1时间'}
          break;
        case 'rightofwayAccessLamp2TypeName':
          newObj = {key: p, label: '获得路权过渡灯色2类型'}
          break;
        case 'rightofwayAccessLamp2Time':
          newObj = {key: p, label: '获得路权过渡灯色2时间'}
          break;
        case 'rightofwayAccessLamp3TypeName':
          newObj = {key: p, label: '获得路权过渡灯色3类型'}
          break;
        case 'rightofwayAccessLamp3Time':
          newObj = {key: p, label: '获得路权过渡灯色3时间'}
          break;
        case 'rightofwayStartingupLoseLamp1TypeName':
          newObj = {key: p, label: '开机失去路权灯色1类型'}
          break;
        case 'rightofwayStartingupLoseLamp1Time':
          newObj = {key: p, label: '开机失去路权灯色1时间'}
          break;
        case 'rightofwayStartingupLoseLamp2TypeName':
          newObj = {key: p, label: '开机失去路权灯色2类型'}
          break;
        case 'rightofwayStartingupLoseLamp2Time':
          newObj = {key: p, label: '开机失去路权灯色2时间'}
          break;
        case 'rightofwayStartingupLoseLamp3TypeName':
          newObj = {key: p, label: '开机失去路权灯色3类型'}
          break;
        case 'rightofwayStartingupLoseLamp3Time':
          newObj = {key: p, label: '开机失去路权灯色3时间'}
          break;
        case 'rightofwayStartingupAccessLamp1TypeName':
          newObj = {key: p, label: '开机获得路权灯色1类型'}
          break;
        case 'rightofwayStartingupAccessLamp1Time':
          newObj = {key: p, label: '开机获得路权灯色1时间'}
          break;
        case 'rightofwayStartingupAccessLamp2TypeName':
          newObj = {key: p, label: '开机获得路权灯色2类型'}
          break;
        case 'rightofwayStartingupAccessLamp2Time':
          newObj = {key: p, label: '开机获得路权灯色2时间'}
          break;
        case 'rightofwayStartingupAccessLamp3TypeName':
          newObj = {key: p, label: '开机获得路权灯色3类型'}
          break;
        case 'rightofwayStartingupAccessLamp3Time':
          newObj = {key: p, label: '开机获得路权灯色3时间'}
          break;
        case 'phaseMingreenTime':
          newObj = {key: p, label: '相位最小绿时间'}
          break;
        case 'phaseMaxgreen1Time':
          newObj = {key: p, label: '相位最大绿时间1'}
          break;
        case 'phaseMaxgreen2Time':
          newObj = {key: p, label: '相位最大绿时间2'}
          break;
        case 'phaseDelaygreenTime':
          newObj = {key: p, label: '相位延迟绿时间'}
          break;
        case 'phaseDemand':
          newObj = {key: p, label: '相位的需求'}
          break;
        case 'phaseShield':
          newObj = {key: p, label: '相位屏蔽'}
          break;
        case 'phaseForbiden':
          newObj = {key: p, label: '相位禁止'}
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
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phaseLampgroupId) || item.getAttribute('pic-mark') === ('lane'+itemData.phasestageLane)) {
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
        const leftdetectorArr = itemData.phaseDemand.split(',')
        leftdetectorArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('detector'+items)) {
              $(item).removeClass(styles.imgCurrent)
            }
          })
        })
      }
    } else {
      $(e.currentTarget).addClass(Liststyles.hover).siblings().removeClass(Liststyles.hover)
      if (itemData.phaseLampgroupId.indexOf(',') === -1) {
        $('div[pic-mark]').map(( i, item ) => {
          if (item.getAttribute('pic-mark') === ('lampgroup'+itemData.phaseLampgroupId) || item.getAttribute('pic-mark') === ('lane'+itemData.phasestageLane)) {
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
        const leftdetectorArr = itemData.phaseDemand.split(',')
        leftdetectorArr.map((items) => {
          $('div[pic-mark]').map(( i, item ) => {
            if (item.getAttribute('pic-mark') === ('detector'+items)) {
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
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'PHASE'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadId, _this.props.roadNodeNo)
          _this.props.getInfoListsType(_this.props.roadInterId, 'PHASE')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }
  // 字典code
  getSystemCodeType = (num) => {
    this.props.getSystemCodeType(num).then(() => {
      switch (num) {
        case 11:
          this.setState({ phaseForbidenData: this.props.data.codeTypeData }) // 相位禁止
          break;
        case 28:
          this.setState({ phaseShieldData: this.props.data.codeTypeData }) // 相位屏蔽
          break;
        case 29:
          this.setState({ typeData: this.props.data.codeTypeData }) // 灯组Type
          break;
      }
    })
  }
  
  updateListItem = (itemDetailData, stepType) => {
    this.props.updateListItem(itemDetailData, stepType)
  }
  render() {
    const { phaseLists, listNames, detailData, phaseForbidenData, phaseShieldData, typeData } = this.state
    return (
      <div className={styles.conBox} >
        <div className={styles.rTit}>相位配置列表<em onClick={() => { this.popLayerShowHide("stepFiveAddEdit", true, null, 'PHASE') }}>添加</em></div>
        { !!phaseLists && !!listNames ? <ListForAntd {...this.props} dataSourse={phaseLists} listNames={listNames} showIndex={3} listType={'PHASE'} handleClickFind={this.handleClickFind} updateListItem={this.updateListItem} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
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
    postAddOthersType: bindActionCreators(postAddOthersType, dispatch),
    postUpdateOthersType: bindActionCreators(postUpdateOthersType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(PhaseConfigRight)