import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getInfoListsType, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import ListForAntd from '../../ListForAntd/ListForAntd'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'

class PhaseConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      phaseLists: null,
      listNames: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { phaseLists } = this.props.data
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
  render() {
    const { phaseLists, listNames } = this.state
    return (
      <div className={styles.conBox} >
        <div className={styles.rTit}>相位配置列表<em onClick={() => { this.popLayerShowHide("stepFiveAddEdit", true) }}>添加</em></div>
        { !!phaseLists && !!listNames ? <ListForAntd {...this.props} dataSourse={phaseLists} listNames={listNames} showIndex={3} handleClickFind={this.handleClickFind} delListItem={this.delListItem} /> : <div className={styles.noData}>暂无数据</div> }
        {/* <div className={styles.rList}>
          <div className={styles.listItem}>
            <em>相位序号</em>
            <em>相位名称</em>
            <em>相位包含灯组</em>
            <em>失去路权过渡灯色1类型</em>
            <em>失去路权过渡灯色1时间</em>
            <em>失去路权过渡灯色2类型</em>
            <em>失去路权过渡灯色2时间</em>
            <em>失去路权过渡灯色3类型</em>
            <em>失去路权过渡灯色3时间</em>
            <em>获得路权过渡灯色1类型</em>
            <em>获得路权过渡灯色1时间</em>
            <em>获得路权过渡灯色2类型</em>
            <em>获得路权过渡灯色2时间</em>
            <em>获得路权过渡灯色3类型</em>
            <em>获得路权过渡灯色3时间</em>
            <em>开机失去路权灯色1类型</em>
            <em>开机失去路权灯色1时间</em>
            <em>开机失去路权灯色2类型</em>
            <em>开机失去路权灯色2时间</em>
            <em>开机失去路权灯色3类型</em>
            <em>开机失去路权灯色3时间</em>
            <em>开机获得路权灯色1类型</em>
            <em>开机获得路权灯色1时间</em>
            <em>开机获得路权灯色2类型</em>
            <em>开机获得路权灯色2时间</em>
            <em>开机获得路权灯色3类型</em>
            <em>开机获得路权灯色3时间</em>
            <em>相位最小绿时间</em>
            <em>相位最大绿时间1</em>
            <em>相位最大绿时间2</em>
            <em>相位延迟绿时间</em>
            <em>相位的需求</em>
            <em>相位屏蔽</em>
            <em>相位禁止</em>
            <em>操作</em>
          </div>
          {
            phaseLists && phaseLists.map((item) => {
              return <div onClick={this.handleClickFind} key={'phase'+item.phaseNo} tag-mark={'phase'+item.phaseNo} className={classNames(styles.listItem, clickFlag ? styles.current : null)}>
                        <em>{item.phaseNo}</em>
                        <em>{item.phaseName}</em>
                        <em>{item.phaseLampgroupId}</em>
                        <em>{item.rightofwayLoseLamp1TypeName}</em>
                        <em>{item.rightofwayLoseLamp1Time}</em>
                        <em>{item.rightofwayLoseLamp2TypeName}</em>
                        <em>{item.rightofwayLoseLamp2Time}</em>
                        <em>{item.rightofwayLoseLamp3TypeName}</em>
                        <em>{item.rightofwayLoseLamp3Time}</em>
                        <em>{item.rightofwayAccessLamp1TypeName}</em>
                        <em>{item.rightofwayAccessLamp1Time}</em>
                        <em>{item.rightofwayAccessLamp2TypeName}</em>
                        <em>{item.rightofwayAccessLamp2Time}</em>
                        <em>{item.rightofwayAccessLamp3TypeName}</em>
                        <em>{item.rightofwayAccessLamp3Time}</em>
                        <em>{item.rightofwayStartingupLoseLamp1TypeName}</em>
                        <em>{item.rightofwayStartingupLoseLamp1Time}</em>
                        <em>{item.rightofwayStartingupLoseLamp2TypeName}</em>
                        <em>{item.rightofwayStartingupLoseLamp2Time}</em>
                        <em>{item.rightofwayStartingupLoseLamp3TypeName}</em>
                        <em>{item.rightofwayStartingupLoseLamp3Time}</em>
                        <em>{item.rightofwayStartingupAccessLamp1TypeName}</em>
                        <em>{item.rightofwayStartingupAccessLamp1Time}</em>
                        <em>{item.rightofwayStartingupAccessLamp2TypeName}</em>
                        <em>{item.rightofwayStartingupAccessLamp2Time}</em>
                        <em>{item.rightofwayStartingupAccessLamp3TypeName}</em>
                        <em>{item.rightofwayStartingupAccessLamp3Time}</em>
                        <em>{item.phaseMingreenTime}</em>
                        <em>{item.phaseMaxgreen1Time}</em>
                        <em>{item.phaseMaxgreen2Time}</em>
                        <em>{item.phaseDelaygreenTime}</em>
                        <em>{item.phaseDemand}</em>
                        <em>{item.phaseShield}</em>
                        <em>{item.phaseForbiden}</em>
                        <span className={styles.del} onClick={(e) => this.delListItem(e, item.id)}>删除</span>
                      </div>
            })
          }
        </div> */}
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
export default connect(mapStateToProps, mapDisPatchToProps)(PhaseConfigRight)