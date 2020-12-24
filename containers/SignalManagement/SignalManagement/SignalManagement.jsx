import React, { PureComponent } from 'react'
import { Input, Icon, Radio, Upload, Modal, message, Select, Checkbox, Row, Col, TimePicker, Spin } from 'antd'
import moment from 'moment';
import classNames from 'classnames'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import OLMapLayers from '../../../components/OpenLayers/OpenLayers'
import ListForAntd from '../ListForAntd/ListForAntd'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './SignalManagement.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fromLonLat } from 'ol/proj'
import { getSystemCodeType, getMapUnitInfoList, getUnitPop, checkUnitTree, getDcuState } from '../../../reactRedux/actions/publicActions'
import { getStepStatus, getPicListsType, getInfoListsType, getInfoListsTypeMore, postBgBySelect, postBgByUpload, postAddOthersType, postUpdateOthersType, postAddAllType, postUpdateAllType, getIconImageList, getUpdateAllType, getSelectLists, getCheckPhaseTime, getEditCheckData } from '../../../reactRedux/actions/signalmanagementActions'
import StepNavMenu from './StepNavMenu/StepNavMenu'
import BasicInfoLeft from './StepConfigLeft/BasicInfoLeft'
import LaneConfigLeft from './StepConfigLeft/LaneConfigLeft'
import LightConfigLeft from './StepConfigLeft/LightConfigLeft'
import DetectorConfigLeft from './StepConfigLeft/DetectorConfigLeft'
import BasicInfoRight from './StepConfigRight/BasicInfoRight'
import LaneConfigRight from './StepConfigRight/LaneConfigRight'
import LightConfigRight from './StepConfigRight/LightConfigRight'
import DetectorConfigRight from './StepConfigRight/DetectorConfigRight'
import PhaseConfigRight from './StepConfigRight/PhaseConfigRight'
import StageConfigRight from './StepConfigRight/StageConfigRight'
import PlanConfigRight from './StepConfigRight/PlanConfigRight'
import DayPlanConfigRight from './StepConfigRight/DayPlanConfigRight'
import DispatchConfigRight from './StepConfigRight/DispatchConfigRight'
import '../../../utils/scrollTime/scrollTime.jquery.min.js' // 引用时间轴插件
import Websocket from 'react-websocket';
const format = 'HH:mm';
const { Option } = Select
// 图片转64位
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
class SignalManagement extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      popAddEditText: '添加', // 添加或编辑状态
      oLMapFlag: true,
      popAddEditName: '',
      moveFlag: null,
      stepOneFlag: true,
      stepTwoFlag: null,
      stepRoadFlag: null,
      stepRoadAddEdit: null,
      stepThreeFlag: null,
      stepThreeAddEdit: null,
      stepFourFlag: null,
      stepFourAddEdit: null,
      stepFiveFlag: null,
      stepFiveAddEdit: null,
      stepSixFlag: null,
      stepSixAddEdit: null,
      stepSevenFlag: null,
      stepSevenAddEdit: null,
      stepEightFlag: null,
      stepEightAddEdit: null,
      stepNineFlag: null,
      stepNineAddEdit: null,
      stepOneText: '请选择路口',
      interName: null,
      baseMapFlag: null, //是否显示
      baseLoading: false,
      imageUrl: '',
      imageFile: null,
      imageName: '',
      interRoadBg: '',
      interRoadPic: '',
      mapPointsData: null, // 地图中所有的点
      dcuPopData: null, // 弹层数据
      stepStatusData: null, // step数据
      roadId: null, // 路的ID
      roadInterId: null, // 路的interId
      roadNodeNo: null,
      onlineNum: 0, //实时在线数
      offlineNum: 0, //实时离线数
      handOffline: 0,
      dcuStateList: [], // socket实时推送数据
      treeFlag: true,
      searchInterList: null,
      treeListBackups: null,
      treeList: null,
      interListHeight: 0,
      laneShowDetail: null,
      laneIconLists: null,
      lightShowDetail: null,
      lightIconLists: null,
      detectorShowDetail: null,
      detectorIconLists: null,
      fDir8NoData: null, // 车道方向
      turnDirNoListData: null, // 车道转向
      showFlag: null, // 是否显示
      lampgroupType: null, // 灯组类型
      controlDir: null, // 灯组方向
      controlTurn: null, // 灯组转向
      detectorType: null, // 检测器类型
      phaseForbidenData: null,
      phaseShieldData: null,
      schemePhasestageTypeData: null,
      timeintervalModelChainData: null,
      laneSdtypeNoData: null,
      typeData: null,
      phaseShowDetail: null,
      stageShowDetail: null,
      planShowDetail: null,
      dayplanShowDetail: null,
      dispatchShowDetail: null,
      laneSelectLists: null,
      lightSelectLists: null,
      detectorSelectLists: null,
      selectFlag: true,
      defaultSelectLists: '',
      phaseSelectLists: null, // 
      phaseFlag: null,
      planStageLists: null, //方案相位阶段链数据
      strStagePlanID: null, // 方案相位阶段链
      strStagePlanItem: null, //方案相位阶段一组对象数据
      planChainsLists: null, // 阶段链时间轴数据
      thisIndex: null,
      lightStatus: 2,
      lightSelectIds: null, // 选中的ID集合
      cycleLength: 0, // 周期
      nowCycleLength: 0, // 当前时间周期
      timePlanFlag: null, // 是否显示
      priorityData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //优先级
      weekData: null, //星期
      monthData: null, //月
      dayData: null, //日
      Dcu_Io_Ids: null,
      dayPlanClickInfo: null, // 日计划点击后的数据 
      dispatchClickInfo: null, // 调度点击后的数据
      dispatchClickInfoCopy: null, // 调度点击后的数据备份
      popItemFlag: true,
      phaseIndex: null,
      listNames: null,
      loadFlag: null,
      editFlag: null,
      userLimit: null, // 权限标识
      oneFlag: null,
      oneText: '传输中~~~',
      twoFlag: null,
      twoText: '等待中...',
      threeFlag: null,
      threeText: '等待中...',
      fourFlag: null,
      fourText: '等待中...',
      fiveFlag: null,
      fiveText: '等待中...',
      sixFlag: null,
      sixText: '等待中...',
      sevenFlag: null,
      sevenText: '等待中...',
      eightFlag: null,
      eightText: '等待中...',
      nineFlag: null,
      nineText: '等待中...',
      tenFlag: null,
      nowText: '基础信息配置',
      editData: null,
      editCheckData: null,
      blurFlag: null,
    }
    this.map = null
    this.moveFlag = false // 是否是移动状态
    this.bgIpUrl = `${this.props.data.devImage}/DCU/dcuImage/background/`
    this.laneBgUrl = `${this.props.data.devImage}/DCU/dcuImage/lane/`
    this.lightBgUrl = `${this.props.data.devImage}/DCU/dcuImage/lampgroup2/` // 红色
    this.detectorBgUrl = `${this.props.data.devImage}/DCU/dcuImage/detector/`
    this.phaseBgUrl = `${this.props.data.devImage}/DCU/dcuImage/phasestage/`
    this.socketPointStatusUrl = '/DCU/websocket/dcuState/0/0/0' // 实时请求地图点的状态
    this.socketPointPopUrl = '/DCU/websocket/interRunState/' // 点击显示实时弹层
    this.socketLoadDataUrl = '/DCU/websocket/loadData/' // 上传配置
    this.socketEditDataUrl = '/DCU/websocket/editData/' // 下发配置
    this.searchInterList = []
    this.itemDetailData = null
    this.selImage = null
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
    this.countOnNum = JSON.parse(localStorage.getItem('countOnNum'))
    this.countAllNum = JSON.parse(localStorage.getItem('countAllNum'))
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuPopData, stepStatusData, basicBgLists, basicUplSuccess, dcuTreeData, codeTypeData, phaseLists,
      laneShowDetail, laneIconLists, lightShowDetail, lightIconLists, detectorShowDetail, detectorIconLists, laneSelectLists, lightSelectLists, detectorSelectLists, phaseIconLists, planChainsLists, dayPlanClickInfo, dispatchClickInfo, planCheckTimeRes, editCheckData } = this.props.data
    if (prevState.data !== this.props.data) {
      // console.log(this.props, this.props.data, "data中所有的数据")
    }
    if (prevState.data.codeTypeData !== codeTypeData) {
      // console.log(codeTypeData, 'codeType 数据')
    }
    if (prevState.data.dcuTreeData !== dcuTreeData) {
      if (this.state.treeFlag) {
        this.checkUnitTree()
      }
    }
    if (prevState.data.mapPointsData !== mapPointsData) {
      // console.log(mapPointsData, '点数据')
      this.setState({ mapPointsData }, () => {
        this.loadingMap()
      })
    }
    if (prevState.data.dcuPopData !== dcuPopData) {
      // console.log(dcuPopData, '弹层数据')
      this.setState({ dcuPopData })
    }
    if (prevState.data.stepStatusData !== stepStatusData) {
      // console.log(stepStatusData, 'step数据')
      this.setState({ stepStatusData })
    }
    if (prevState.data.basicBgLists !== basicBgLists) {
      // console.log(basicBgLists, '子弹层')
      this.setState({ basicBgLists })
    }
    if (prevState.data.laneShowDetail !== laneShowDetail) {
      // console.log(laneShowDetail, '车道回显详情')
      this.setState({ laneShowDetail, showFlag: true, })
    }
    if (prevState.data.laneIconLists !== laneIconLists) {
      // console.log(laneIconLists, '车道全部图标')
      this.setState({ laneIconLists })
    }
    if (prevState.data.lightShowDetail !== lightShowDetail) {
      // console.log(lightShowDetail,  '灯组回显详情')
      this.setState({ lightShowDetail, showFlag: true, }, () => {
        this.cyclicComparison(this.state.controlDir, 'controlDir', lightShowDetail.controlDir, 'lightShowDetail')
        this.cyclicComparison(this.state.controlTurn, 'controlTurn', lightShowDetail.controlTurn, 'lightShowDetail')
      })
    }
    if (prevState.data.lightIconLists !== lightIconLists) {
      // console.log(lightIconLists, '灯组全部图标')
      this.setState({ lightIconLists })
    }
    if (prevState.data.detectorShowDetail !== detectorShowDetail) {
      // console.log(detectorShowDetail, '检测器回显详情')
      this.setState({ detectorShowDetail, showFlag: true, }, () => {
        this.cyclicComparison(this.state.detectorType, 'detectorType', detectorShowDetail.detectorType, 'detectorShowDetail')
      })
    }
    if (prevState.data.detectorIconLists !== detectorIconLists) {
      // console.log(detectorIconLists, '检测器图标')
      this.setState({ detectorIconLists })
    }
    if (prevState.data.phaseIconLists !== phaseIconLists) {
      // console.log(phaseIconLists, '相位图标')
      this.setState({ phaseIconLists })
    }
    if (prevState.data.laneSelectLists !== laneSelectLists) {
      // console.log(laneSelectLists, '车')
      this.setState({ laneSelectLists })
    }
    if (prevState.data.lightSelectLists !== lightSelectLists) {
      // console.log(lightSelectLists, '灯组')
      this.setState({ lightSelectLists })
    }
    if (prevState.data.detectorSelectLists !== detectorSelectLists) {
      // console.log(detectorSelectLists, '检测器')
      this.setState({ detectorSelectLists })
    }
    if (prevState.data.phaseLists !== phaseLists) {
      this.setState({ phaseSelectLists: phaseLists })
    }

    if (prevState.data.planChainsLists !== planChainsLists) {
      this.setState({ planChainsLists: null, cycleLength: planChainsLists.allTime }, () => {
        this.setState({ planChainsLists: planChainsLists.phasestageList }, () => {
          this.getScrollTime(this.state.planChainsLists)
        })
      })
    }
    if (prevState.data.dayPlanClickInfo !== dayPlanClickInfo) {
      this.getListData(dayPlanClickInfo)
    }
    if (prevState.data.dispatchClickInfo !== dispatchClickInfo) {
      this.getListDayData(dispatchClickInfo)
    }

    if (prevState.data.planCheckTimeRes !== planCheckTimeRes) {
      if (planCheckTimeRes === 0) {
        message.info('时间不合法,请重新输入！')
        const planStageLists = JSON.parse(JSON.stringify(this.state.planStageLists))
        planStageLists[this.state.phaseIndex].phaseTimeIndex = 0
        this.setState({ planStageLists, blurFlag: null })
        this.props.data.planCheckTimeRes = null
      } else {
        this.calcNum()
        this.setState({ blurFlag: null })
        this.props.data.planCheckTimeRes = null
      }
    }
    if (prevState.data.editCheckData !== editCheckData) {
      this.setState({ editCheckData })
    }
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    limitArr.forEach((item) => {
      if (item.id === 201) {
        this.setState({ userLimit: true })
      }
    })
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        if (e.target !== this.searchBtn) {
          this.setState({ interListHeight: 0 })
        }
      }
      if (this.selImage !== null && e.target !== this.selImage) {
        this.setState({ showFlag: true })
      }
      this.visibleShowLeft('', '', false)
    })
    // 加载DCU IO接口号
    const Dcu_Io_Ids = []
    for (let m = 1; m < 33; m++) {
      const ioId = {
        dcuIoId: m
      }
      Dcu_Io_Ids.push(ioId)
    }
    // 加载日
    const dayData = [], monthData = [], weekData = []
    for (let num = 0; num < 31; num++) {
      if (num < 7) {
        let weekStr = ''
        switch (num) {
          case 0:
            weekStr = '日'
            break;
          case 1:
            weekStr = '一'
            break;
          case 2:
            weekStr = '二'
            break;
          case 3:
            weekStr = '三'
            break;
          case 4:
            weekStr = '四'
            break;
          case 5:
            weekStr = '五'
            break;
          case 6:
            weekStr = '六'
            break;
        }
        const newWeek = {
          value: num,
          label: weekStr,
        }
        weekData.push(newWeek)
      }
      if (num < 12) {
        const newMonth = {
          value: num + 1,
          label: num + 1,
        }
        monthData.push(newMonth)
      }
      const newObj = {
        value: num + 1,
        label: num + 1,
      }
      dayData.push(newObj)

    }
    this.setState({ dayData, monthData, weekData, Dcu_Io_Ids })
    // 初始化地图
    this.loadingMap() // old 高德地图
    window.showHidePop = this.showHidePop
    window.setGetParams = this.setGetParams
    this.props.getMapUnitInfoList() // 地图中的点
    this.getSystemCodeType(2) // 转向
    this.getSystemCodeType(8) // 灯组类型 
    this.getSystemCodeType(9) // 灯组方向
    this.getSystemCodeType(10) // 灯组转向
    this.getSystemCodeType(12) // 检测器类型
    this.getSystemCodeType(27) // 方向
    this.getSystemCodeType(11) // 灯组Type
    this.getSystemCodeType(28) // 相位屏蔽 
    this.getSystemCodeType(29) // 相位禁止
    this.getSystemCodeType(32) // 方案相位阶段出现类型
    this.getSystemCodeType(33) // 方案相位阶段出现类型
    this.getSystemCodeType(35) // 进出口方向
  }
  componentWillUnmount = () => {
    this.classNs = null
  }
  // 非空验证
  // itemDetailData.rightofwayAccessLamp3Time, '获得路权过渡灯色3时间不能为空！
  isNotEmpty = (keyVal, msg, flag) => {
    if (flag) {
      console.log(keyVal, msg, 'xxxxxx')
      if (keyVal === '' || keyVal === null || keyVal < 0) {
        message.info(msg);
        return true
      }
    } else {
      if (keyVal === '' || keyVal === 0 || keyVal === "0" || keyVal === null || keyVal < 0) {
        message.info(msg);
        return true
      }
    }
  }
  // 编辑时返回数据验证
  editReturnData = (resDatas, id, keyVal) => {
    const resData = JSON.parse(JSON.stringify(resDatas))
    for (let i = 0; i < resData.length; i++) {
      if (Number(resData[i][id]) === Number(keyVal)) {
        resData.splice(i, 1);
        this.setState({ editData: resData })
      }
    }
  }
  // 各种ID重复验证
  verificationID = (resData, id, keyVal, msg) => {
    for (let i = 0; i < resData.length; i++) {
      if (Number(resData[i][id]) === Number(keyVal)) {
        message.error(msg)
        $("#" + id).focus()
        return true
      }
    }
  }
  // toPlan
  getListData = (data) => {
    const listNames = [], dayPlanClickInfo = []
    dayPlanClickInfo.push(data)
    for (let p in data) {
      let newObj;
      switch (p) {
        case 'schemeNo':
          newObj = { key: p, label: '方案序号' }
          break;
        case 'schemeName':
          newObj = { key: p, label: '方案名称' }
          break;
        case 'schemeCycle':
          newObj = { key: p, label: '方案周期' }
          break;
        case 'schemeCoordinationNo':
          newObj = { key: p, label: '方案协调序号' }
          break;
        case 'schemePhaseDiferenceTime':
          newObj = { key: p, label: '方案相位差时间' }
          break;
        case 'phaseStageInfoList':
          newObj = { key: p, label: '放行阶段列表' }
          break;
        case 'coordinationImagePath':
          newObj = { key: p, label: '协调阶段' }
          break;
      }
      if (newObj) listNames.push(newObj)
    }
    this.setState({ listNames, dayPlanClickInfo, popItemFlag: false })
  }
  // toDayPlan
  getListDayData = (data) => {
    const listNames = [], dispatchClickInfo = []
    dispatchClickInfo.push(data)
    for (let p in data) {
      let newObj;
      switch (p) {
        case 'dailyplanNo':
          newObj = { key: p, label: '计划编号' }
          break;
        case 'timeintervalList':
          newObj = { key: p, label: '计划列表' }
          break;
      }
      if (newObj) listNames.push(newObj)
    }
    this.setState({ listNames, dispatchClickInfo, popItemFlag: true })
  }
  // 字典code
  getSystemCodeType = (num) => {
    this.props.getSystemCodeType(num).then(() => {
      switch (num) {
        case 2:
          this.setState({ fDir8NoData: this.props.data.codeTypeData }) // 方向
          break;
        case 8:
          this.setState({ lampgroupType: this.props.data.codeTypeData })  //灯组类型  
          break;
        case 9:
          this.setState({ controlDir: this.props.data.codeTypeData }) //方向
          break;
        case 10:
          this.setState({ controlTurn: this.props.data.codeTypeData }) // 转向
          break;
        case 11:
          this.setState({ typeData: this.props.data.codeTypeData }) // 灯组Type
          break;
        case 12:
          this.setState({ detectorType: this.props.data.codeTypeData }) // 检测器类型
          break;
        case 27:
          this.setState({ turnDirNoListData: this.props.data.codeTypeData }, () => {
            const turnDirNoListData = []
            this.state.turnDirNoListData.map((item) => {
              const newObj = {
                value: item.dictCode,
                label: item.codeName + item.codeDes,
              }
              turnDirNoListData.push(newObj)
            })
            this.setState({ turnDirNoListData })
          }) // 转向
          break;
        case 28:
          this.setState({ phaseShieldData: this.props.data.codeTypeData }) // 相位屏蔽
          break;
        case 29:
          this.setState({ phaseForbidenData: this.props.data.codeTypeData }) // 相位禁止
          break;
        case 32:
          this.setState({ schemePhasestageTypeData: this.props.data.codeTypeData }) // schemePhasestageTypeData
          break;
        case 33:
          this.setState({ timeintervalModelChainData: this.props.data.codeTypeData }) // 时段运行模式链
          break;
        case 35:
          this.setState({ laneSdtypeNoData: this.props.data.codeTypeData }) // 进出口方向
          break;
      }
    })
  }
  // 循环ID转Name
  // flag: 为true 时 Name 转ID
  cyclicComparison = (dataRes, keyName, id, resData, flag) => {
    dataRes.map((item) => {
      if (flag) {
        if (item.codeName === id) {
          this.state[resData][keyName] = item.dictCode
        }
      } else {
        if (item.dictCode === +id) {
          this.state[resData][keyName] = item.codeName
        }
      }
    })
    const obj = JSON.parse(JSON.stringify(this.state[resData]))
    this.setState({
      [resData]: obj,
    })
  }
  // 筛选左侧树型结构
  checkUnitTree = () => {
    this.searchInterList = this.props.data.dcuTreeData
    this.setState({
      treeList: this.props.data.dcuTreeData,
      treeListBackups: this.props.data.dcuTreeData,
      treeFlag: false,
    })
  }
  // 文本输入改变值
  handleChangeInput = (event, type, name, key, index) => {
    if (key) {
      key === 'phaseTimeIndex' ? this.setState({ blurFlag: true }) : this.setState({ blurFlag: null })
      if (index !== undefined) {
        this[type][name][index][key] = event.target.value
        const newObj = JSON.parse(JSON.stringify(this[type][name]))
        const newArrTime = this.state.planShowDetail.schemePhasestageChainsTime.split(",")
        newArrTime[index] = event.target.value
        this.state.planShowDetail.schemePhasestageChainsTime = newArrTime.join()
        this.setState({ [name]: newObj })
      } else {
        // key === 'dailyplanNo' ? this[type][name][key] = Number(event.target.value) : this[type][name][key] = event.target.value
        debugger
        this[type][name][key] = (key === "laneNo" ? Number(event.target.value) : event.target.value)
        const newObj = JSON.parse(JSON.stringify(this[type][name]))
        this.setState({ [name]: newObj })
      }
    } else {
      this[type][name] = event.target.value
    }
  }
  calcNum = () => {
    const newObj = JSON.parse(JSON.stringify(this.state.planStageLists))
    const planShowDetail = JSON.parse(JSON.stringify(this.state.planShowDetail))
    let times = 0
    newObj && newObj.map((item) => {
      times += Number(item.phaseTimeIndex)
    })
    if (planShowDetail) {
      planShowDetail.schemeCycle = times
      this.setState({ planShowDetail })
    }
  }
  getCheckPhaseTime = (e, interId, phasestageNo, i) => {
    this.setState({
      phaseIndex: i,
    })
    if (this.state.blurFlag) {
      this.props.getCheckPhaseTime(interId, phasestageNo, e.target.value)
    }
  }
  // 单选按钮选择
  handleChangeRadio = (event) => {
    this.setState({ strStagePlanID: event.target.value })
  }
  // 点击单选按钮
  handleClickRadio = (item) => {
    item.phaseTimeIndex = 0
    this.setState({ strStagePlanItem: item })
  }
  // 确认单选按钮 弹层
  stageIdRight = (event, type, name, key) => {
    this[type][name].schemePhasestageChainsTime ? this[type][name].schemePhasestageChainsTime = this[type][name].schemePhasestageChainsTime + ',' + '0' : this[type][name].schemePhasestageChainsTime = '0'
    this[type][name][key] ? this[type][name][key] = this[type][name][key] + ',' + this.state.strStagePlanID : this[type][name][key] = this.state.strStagePlanID
    const newArr = this.state.planStageLists ? JSON.parse(JSON.stringify(this.state.planStageLists)) : []
    newArr.push(this.state.strStagePlanItem)
    this.setState({ showFlag: true, planStageLists: newArr })
    this.calcNum()
  }
  // 取消单选按钮 弹层
  stageIdCancel = () => {
    this.setState({ showFlag: true })
  }
  // 时间
  handleChangeTime = (v, time, type, name, key, index, keyValue) => {
    this[type][name][key][index][keyValue] = time
    const newObj = JSON.parse(JSON.stringify(this[type][name]))
    this.setState({ [name]: newObj })
  }
  // 下拉选择值
  handleChangeSel = (value, type, name, key, index, keyValue) => {
    if (index !== undefined) {
      this[type][name][key][index][keyValue] = value
      const newObj = JSON.parse(JSON.stringify(this[type][name]))
      this.setState({ [name]: newObj })
    } else {
      if (key) {
        this[type][name][key] = value
        const newObj = JSON.parse(JSON.stringify(this[type][name]))
        this.setState({ [name]: newObj })
      } else {
        this[type][name] = value
      }
    }

  }
  // 复选框
  handleChangeCheck = (checkValues, type, name, key, index, keyValue) => {
    debugger
    if (index !== undefined) {
      this[type][name][key][index][keyValue] = checkValues.join()
      const newObj = JSON.parse(JSON.stringify(this[type][name]))
      this.setState({ [name]: newObj })
    } else {
      if (key) {
        this[type][name][key] = checkValues.join()
        const newObj = JSON.parse(JSON.stringify(this[type][name]))
        this.setState({ [name]: newObj })
      } else {
        this[type][name] = checkValues
      }
    }
  }
  hanleSelectInter = (e, items) => {
    const _this = this;
    let marker, lng, lat;
    if ( this.state.oLMapFlag ){ this.pointLayers = this.state.treeListBackups }
    if ( this.state.oLMapFlag ) {
      this.pointLayers && this.pointLayers.map((data) => {
        data.units && data.units.map((item) => {
          if (item.id === items.id) {
            lng = item.lng
            lat = item.lat
            _this.setState({
              roadUnitId: item.id,
              roadInterId: item.interId,
              roadNodeNo: item.nodeId,
              interListHeight: 0
            })
            this.searchInputBox.value = item.interName
            // 查找坐标弹层
            const overLayer = mapOL.getOverlayById("oLMarker")
            // 坐标转换
            const resultLngLat = fromLonLat([lng, lat])
            // 把浮层显示出来
            overLayer.setPosition(resultLngLat)
            mapOL.getView().setCenter(resultLngLat) // 设置中心点
            const resultP = Promise.resolve(_this.props.getUnitPop(item.id))
            resultP.then(() => {
              _this.openInfoWin('', item, '', item.interName)
            })
          }
        })
      })
    } else {
      this.pointLayers.map((point) => {
        if (point.w.extData.id === item.id) {
          point.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + item.interId + "' id='roadKey" + item.id + "' class='marker-online'></div></div>");
          _this.setState({
            roadUnitId: item.id,
            roadInterId: item.interId,
            roadNodeNo: item.nodeId,
          })
          const resultP = Promise.resolve(_this.props.getUnitPop(item.id))
          resultP.then(() => {
            _this.openInfoWin(_this.map, item, point, item.interName)
          })
          marker = point
        }
      })

      if (marker && this.map) {
        this.map.setCenter([item.lng, item.lat])
        this.searchInputBox.value = item.interName
        this.setState({ interListHeight: 0 })
        marker.emit('click', {
          lnglat: this.map.getCenter()
        })
      } else {
        message.info('该路口尚未接入')
      }
    }
  }
  searchBtnSelect = (event) => {
    this.searchBtn = event.target
    this.handleSearchInterFocus()
  }
  handleSearchInterFocus = () => {
    this.setState({ interListHeight: 300 })
    const searchInters = []
    this.searchInterList.forEach((item) => {
      item.units.forEach((items) => {
        searchInters.push(items)
      })
    })
    this.setState({ searchInterList: searchInters })
  }
  handleSearchInputChange = (e) => {
    const { value } = e.target
    const searchInters = []
    const searchLists = []
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
      this.searchTimer = null
    }
    this.searchTimer = setTimeout(() => {
      this.searchInterList.forEach((item) => {
        item.units.forEach((items) => {
          if (items.interName.indexOf(value) >= 0) {
            searchInters.push(item)
            searchLists.push(items)
          }
        })
      })
      this.setState({ treeList: searchInters, searchInterList: searchLists }, () => {
        // console.log(searchInters, value, '结构')
        !value ? this.props.checkUnitTree(this.state.treeListBackups) : this.props.checkUnitTree(this.state.treeList)
      })
    }, 200)

  }
  // 获取子id, 路口id olMap
  getSelectChildIdOlMap = (childId, interName, dataItem) => {
    const _this = this;
    var marker, lng, lat;
    const childrenArr = this.state.treeListBackups
    childrenArr.map((data) => {
      data.units && data.units.map((item) => {
        if (childId === item.id) {
          lng = item.lng
          lat = item.lat
          _this.setState({
            roadUnitId: item.id,
            roadInterId: item.interId,
            roadNodeNo: item.nodeId,
          })
          const resultP = Promise.resolve(_this.props.getUnitPop(childId))
          resultP.then(() => {
            _this.openInfoWin('', dataItem, '', interName)
          })
        }
      })
    })
  }
  // 获取子id, 路口id
  getSelectChildId = (childId) => {
    const _this = this;
    var marker, lng, lat;
    const childrenArr = this.state.treeListBackups
    childrenArr.map((data) => {
      data.units && data.units.map((item) => {
        this.pointLayers.map((point) => {
          if (childId === point.w.extData.id && childId === item.id) {
            lng = item.lng
            lat = item.lat
            point.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + item.interId + "' id='roadKey" + item.id + "' class='marker-online'></div></div>");
            _this.setState({
              roadUnitId: item.id,
              roadInterId: item.interId,
              roadNodeNo: item.nodeId,
            })
            const resultP = Promise.resolve(_this.props.getUnitPop(childId))
            resultP.then(() => {
              _this.openInfoWin(_this.map, item, point, item.interName)
            })
            marker = point
          }
        })
      })
    })
    if (marker && this.map) {
      this.map.setCenter([lng, lat])
      this.map.emit('click', {
        lnglat: this.map.getCenter()
      })
      marker.emit('click', {
        lnglat: this.map.getCenter()
      })
    } else {
      message.info('该路口尚未接入')
    }
  }
  visibleShowLeft = (top, id, show) => { // 框的跳转与位置
    if (top || id) {
      this.setState({
        visible: show,
        visibleTop: top,
        vipId: id,
      }, () => {
        console.log(id, '显示右键信息')
      })
    } else {
      this.setState({
        visible: show,
      })
    }
  }
  noShow = (e) => { // 禁止默认右键菜单
    e.stopPropagation()
    e.preventDefault()
  }
  tagToPicMark = (e) => {
    const idStr = e.currentTarget.getAttribute("tag-mark");
    if ($(e.currentTarget).hasClass(styles.hover)) {
      $(e.currentTarget).removeClass(styles.hover)
      $('div[pic-mark]').map((i, item) => {
        if (item.getAttribute('pic-mark') === idStr) {
          $(item).removeClass(styles.imgCurrent)
        }
      })
    } else {
      $(e.currentTarget).addClass(styles.hover).siblings().removeClass(styles.hover)
      $('div[pic-mark]').map((i, item) => {
        if (item.getAttribute('pic-mark') === idStr) {
          $(item).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
        }
      })
    }
  }
  // 更新参数
  setGetParams = params => {
    debugger
    // console.log(params, '更新名称')
    this.setState({
      stepOneText: params.interName,
      interName: params.interName,
      roadId: params.id,
      roadInterId: params.interId,
      roadNodeNo: params.nodeId,
      interRoadBg: !params.background ? null : this.bgIpUrl + params.background,
      interRoadPic: params.background,
    }, () => {
      this.props.getStepStatus(params.interId, params.nodeId)
      this.showHidePop("stepTwoFlag", true);
    })

  }
  // 显示与隐藏step
  showHidePop = (name, flag) => {
    const stepArr = ['stepOneFlag', 'stepTwoFlag', 'stepRoadFlag', 'stepThreeFlag', 'stepFourFlag', 'stepFiveFlag', 'stepSixFlag', 'stepSevenFlag', 'stepEightFlag', 'stepNineFlag', 'turnTab']
    if (this.state.stepOneText !== '请选择路口') {
      for (let i in stepArr) {
        if (stepArr[i] === name) {
          this.setState({
            [name]: flag,
          })
        } else {
          this.setState({
            [stepArr[i]]: null,
            timePlanFlag: null,
          })
        }
      }
    } else {
      message.info("请选择路口！");
    }
  }
  // 显示隐藏弹层
  popLayerShowHide = (name, flag, eventType, stepType) => {
    if (name === 'dayPlanClickInfo' && this.state.dispatchClickInfo) this.getListDayData(this.state.dispatchClickInfo[0])
    if (name === 'loadFlag') {
      if (this.state.loadFlag) {
        this.setState({ loadFlag: flag, editFlag: flag }, () => {
          this.showHidePop('stepTwoFlag', true)
          const resultP = Promise.resolve(this.props.getUnitPop(this.state.roadInterId))
          resultP.then(() => {
            const itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
            itemData.interName = this.state.interName
            itemData.background = this.state.interRoadPic
            itemData.nodeId = this.state.roadNodeNo
            this.setGetParams(itemData)
          })
          this.props.getStepStatus(this.state.roadInterId, this.state.roadNodeNo)
        })
      } else {
        this.setState({ loadFlag: flag, editFlag: flag })
      }
    }
    this.setState({
      [name]: flag,
      popAddEditText: eventType ? '编辑' : '添加',
      popItemFlag: true,
      // dispatchClickInfo: name === 'dayPlanClickInfo' ? this.state.dispatchClickInfoCopy : null
    })
    if (flag) {
      switch (stepType) {
        case "LANE":
          // this.itemDetailData
          const laneShowDetail = {
            "angle": 0, //角度
            "fDir8No": 0,//方向
            "fRid": '', //道路ID
            "detectorId": 0, //检测器编号
            "detectorDeviceId": "", //检测器设备编号
            "dcuIoId": 0, //DCU IO接口号
            "imageUrl": "", // 图片
            "interId": this.state.roadInterId, //当前路口interId  隐藏项
            "laneId": '',//车道ID
            "laneNo": '',//车道号
            "laneSdtypeNo": 0,//进出口方向
            "laneIdCust": '', //外部车道ID
            "nodeNo": this.state.roadNodeNo,//当前路口nodeNo  隐藏项
            "turnDirNoList": '', //转向 复选框
            "x": 489, //坐标x  
            "y": 390 //坐标y
          }
          this.setState({ laneShowDetail, showFlag: true })
          break;
        case "LIGHT":
          const lightShowDetail = {
            "angle": 0,  //角度
            "controlDir": "0",  //方向  字典  9
            "controlTurn": "0", //转向  字典  10
            "imageUrl": "", //图片地址
            "lampgroupNo": '', //灯组序号
            "lampgroupType": 0, //灯组类型   字典 8 
            "interId": this.state.roadInterId, //当前路口interId  隐藏项
            "nodeNo": this.state.roadNodeNo,//当前路口nodeNo  隐藏项
            "x": 489, //坐标x  
            "y": 390 //坐标y
          }
          this.setState({ lightShowDetail, showFlag: true })
          break;
        case "DETECTOR":
          const detectorShowDetail = {
            "interId": this.state.roadInterId, //当前路口interId  隐藏项
            "detectorId": '', //检测器序号
            "flowCollectionCycle": 300, //流量采集周期 
            "occupancyCollectionCycle": 300, //占有率采集周期
            "detectorType": 0, //检测器类型 字典 12
            "imageUrl": "", //图片地址
            "nodeNo": this.state.roadNodeNo,//当前路口nodeNo  隐藏项
            "x": 489, //坐标x  
            "y": 390 //坐标y
          }
          this.setState({ detectorShowDetail, showFlag: true })
          break;
        case "PHASE":
          const phaseShowDetail = {
            "interId": this.state.roadInterId, //路口编号 不用显示，带着就行
            "phaseDelaygreenTime": 0, //相位延迟绿时间
            "phaseDemand": "请点击进行编辑", //相位的需求 1 检测器编号
            "phaseForbiden": 0, //相位禁止 0 正常，1 关闭灯组输出，优先级高屏蔽
            "phaseLampgroupId": "请点击进行编辑", //相位包含灯组 逗号分隔
            "phaseMaxgreen1Time": 0, //相位最大绿时间1
            "phaseMaxgreen2Time": 0, //相位最大绿时间2
            "phaseMingreenTime": 0, //相位最小绿时间
            "phaseName": "", //相位名称
            "laneIds": null,
            "phaseNo": '', //相位序号手写
            "phaseShield": 0, //相位屏蔽 0 正常，1 屏蔽输出（强红），
            "rightofwayAccessLamp1Time": 0,
            "rightofwayAccessLamp1Type": "",
            "rightofwayAccessLamp2Time": 0,
            "rightofwayAccessLamp2Type": "",
            "rightofwayAccessLamp3Time": 0,
            "rightofwayAccessLamp3Type": "",
            "rightofwayLoseLamp1Time": 0,
            "rightofwayLoseLamp1Type": "",
            "rightofwayLoseLamp2Time": 0,
            "rightofwayLoseLamp2Type": "",
            "rightofwayLoseLamp3Time": 0,
            "rightofwayLoseLamp3Type": "",
            "rightofwayStartingupAccessLamp1Time": 0,
            "rightofwayStartingupAccessLamp1Type": "",
            "rightofwayStartingupAccessLamp2Time": 0,
            "rightofwayStartingupAccessLamp2Type": "",
            "rightofwayStartingupAccessLamp3Time": 0,
            "rightofwayStartingupAccessLamp3Type": "",
            "rightofwayStartingupLoseLamp1Time": 0,
            "rightofwayStartingupLoseLamp1Type": "",
            "rightofwayStartingupLoseLamp2Time": 0,
            "rightofwayStartingupLoseLamp2Type": "",
            "rightofwayStartingupLoseLamp3Time": 0,
            "rightofwayStartingupLoseLamp3Type": ""
          }
          this.setState({ phaseShowDetail })
          break;
        case "STAGE":
          const stageShowDetail = {
            "interId": this.state.roadInterId,  //路口ID
            "imagePath": "",  //图片
            "lateStartTime": 0,  //阶段中相位晚启动的时间
            "leftingEndTime": 0,  //阶段中相位早结束的时间
            "phasestageForbiden": 0,  //相位阶段禁止标志
            "phasestageLampgroup": "",
            "phasestageLane": "",  //相位阶段包含的车道
            "phasestageName": "",  //阶段名称
            "phasestageNo": '',  //阶段编号
            "phasestagePhase": "", //相位阶段包含的相位
            "phasestageShield": 0,   //相位阶段屏蔽标志
            "schemePhaseTime": "",
            "softwareRequirement": "" //相位阶段软件需求
          }
          this.setState({ stageShowDetail, showFlag: true })
          break;
        case "PLAN":
          const planShowDetail = {
            "interId": this.state.roadInterId,  //
            "nodeNo": this.state.roadNodeNo, //
            "schemeCoordinationNo": 0,  //方案协调序号
            "schemeCycle": 0,   //方案周期
            "schemeName": "",  //方案名称
            "schemeNo": '',   //方案号
            "schemePhaseDiferenceTime": 0,   //方案相位差时间
            "schemePhasestageChains": "",  //方案相位阶段链
            "schemePhasestageChainsTime": "",  //方案相位阶段链时间
            "schemePhasestageType": ""   //方案相位阶段出现类型
          }
          this.setState({ planShowDetail, planStageLists: null, showFlag: true })
          break;
        case "DAYPLAN":
          const dayplanShowDetail = {
            "dailyplanNo": "", //日计划编号
            "interId": this.state.roadInterId,  //
            "nodeNo": this.state.roadNodeNo, //
            "timeintervalList": [{ timeintervalModel: 0, timeintervalStarttime: "00:00", timeintervalScheme: 0 }],
            "timeintervalModelChain": "",    //时段运行模式链
            "timeintervalSchemeChain": "",   //时段执行方案链
            "timeintervalStarttimeChain": ""  //时段开始时间链
          }
          this.setState({ dayplanShowDetail, showFlag: true })
          break;
        case "DISPATCH":
          const dispatchShowDetail = {
            "interId": this.state.roadInterId,  //
            "nodeNo": this.state.roadNodeNo, //
            "scheduleNo": '',    //调度号
            "scheduleDetailList": [
              {
                "interId": this.state.roadInterId,  //
                "nodeNo": this.state.roadNodeNo, //
                "scheduleNo": '',   //调度号
                "dailyPlanId": 0,   //日计划编号
                "dataValueCodes": "0",  //日期值code，逗号拼接
                "dateType": 0,  //日期类型                    
                "monthValueCodes": "", //月份
                "priority": 0,  //优先级
              }
            ]
          }
          this.setState({ dispatchShowDetail, showFlag: true })
          break;
      }
    }
  }
  // 点击列表中某一条时
  handleLineClick = (id, stepType) => {
    // console.log(id, stepType)
    this.props.getInfoListsTypeMore(this.state.roadInterId, this.state.roadNodeNo, stepType, id)
  }
  // 编辑时回显内容 相位、阶段、配时方案、日计划、调度
  updateListItem = (itemDetailData, stepType) => {
    switch (stepType) {
      case "PHASE":
        this.editReturnData(this.props.data.phaseLists, 'phaseNo', itemDetailData.phaseNo)
        this.setState({ phaseShowDetail: itemDetailData, stepFiveAddEdit: true, popAddEditText: '编辑' }, () => {
          this.cyclicComparison(this.state.phaseForbidenData, 'phaseForbiden', itemDetailData.phaseForbiden, 'phaseShowDetail')
          this.cyclicComparison(this.state.phaseShieldData, 'phaseShield', itemDetailData.phaseShield, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayAccessLamp1Type', itemDetailData.rightofwayAccessLamp1Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayAccessLamp2Type', itemDetailData.rightofwayAccessLamp2Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayAccessLamp3Type', itemDetailData.rightofwayAccessLamp3Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayLoseLamp1Type', itemDetailData.rightofwayLoseLamp1Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayLoseLamp2Type', itemDetailData.rightofwayLoseLamp2Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayLoseLamp3Type', itemDetailData.rightofwayLoseLamp3Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayStartingupAccessLamp1Type', itemDetailData.rightofwayStartingupAccessLamp1Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayStartingupAccessLamp2Type', itemDetailData.rightofwayStartingupAccessLamp2Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayStartingupAccessLamp3Type', itemDetailData.rightofwayStartingupAccessLamp3Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayStartingupLoseLamp1Type', itemDetailData.rightofwayStartingupLoseLamp1Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayStartingupLoseLamp2Type', itemDetailData.rightofwayStartingupLoseLamp2Type, 'phaseShowDetail')
          this.cyclicComparison(this.state.typeData, 'rightofwayStartingupLoseLamp3Type', itemDetailData.rightofwayStartingupLoseLamp3Type, 'phaseShowDetail')
          itemDetailData = JSON.parse(JSON.stringify(this.state.phaseShowDetail))
          this.setState({ phaseShowDetail: itemDetailData })
        })
        break;
      case "STAGE":
        this.editReturnData(this.props.data.stageLists, 'phasestageNo', itemDetailData.phasestageNo)
        this.setState({ stageShowDetail: itemDetailData, stepSixAddEdit: true, showFlag: true, popAddEditText: '编辑' }, () => {
          // this.cyclicComparison(this.state.phaseShieldData, 'phasestageShield', itemDetailData.phasestageShield, 'stageShowDetail') // 屏蔽
          // this.cyclicComparison(this.state.phaseForbidenData, 'phasestageForbiden', itemDetailData.phasestageForbiden, 'stageShowDetail') // 禁止
          itemDetailData = JSON.parse(JSON.stringify(this.state.stageShowDetail))
          this.setState({ stageShowDetail: itemDetailData })
        })
        break;
      case "PLAN":
        this.editReturnData(this.props.data.planLists, 'schemeNo', itemDetailData.schemeNo)
        this.setState({ planShowDetail: JSON.parse(JSON.stringify(itemDetailData)), stepSevenAddEdit: true, showFlag: true, popAddEditText: '编辑', planStageLists: null }, () => {
          this.cyclicComparison(this.state.schemePhasestageTypeData, 'schemePhasestageType', itemDetailData.schemePhasestageType, 'planShowDetail')
          itemDetailData = JSON.parse(JSON.stringify(this.state.planShowDetail))
          const idArr = JSON.parse(JSON.stringify(itemDetailData.schemePhasestageChains.split(','))).map(Number) // id转数组
          const timeArr = JSON.parse(JSON.stringify(itemDetailData.schemePhasestageChainsTime.split(','))).map(Number) // time 转数组
          const newIdNameArr = [] // 新的数据集合
          this.props.data.stageLists.map((item) => {
            idArr.map((itemId, idIndex) => {
              if (item.phasestageNo === itemId) {
                timeArr.map((itemTime, timeIndex) => {
                  if (idIndex === timeIndex) {
                    const itemNew = JSON.parse(JSON.stringify(item))
                    itemNew.phaseTimeIndex = itemTime
                    newIdNameArr.push(itemNew)
                  }
                })
              }

            })
          })
          this.setState({ planShowDetail: itemDetailData, planStageLists: newIdNameArr })
        })
        break;
      case "DAYPLAN":
        this.editReturnData(this.props.data.dayPlanLists, 'dailyplanNo', itemDetailData.dailyplanNo)
        this.setState({ dayplanShowDetail: JSON.parse(JSON.stringify(itemDetailData)), stepEightAddEdit: true, popAddEditText: '编辑' }, () => {
          this.state.dayplanShowDetail.timeintervalList.map((item) => {
            this.cyclicComparison(this.state.timeintervalModelChainData, 'timeintervalScheme', Number(item.timeintervalScheme), 'dayplanShowDetail')
          })
        })
        break;
      case "DISPATCH":
        this.editReturnData(this.props.data.dispatchLists, 'scheduleNo', itemDetailData.scheduleNo)
        this.setState({ dispatchShowDetail: JSON.parse(JSON.stringify(itemDetailData)), stepNineAddEdit: true, popAddEditText: '编辑' })
        break;
    }
  }
  // 点击组件列表中的一条时反馈的数据
  handleClickFind = (e, itemData, clazz) => {
    this.setState({ nowCycleLength: 0, timePlanFlag: $(e.currentTarget).hasClass(clazz) }, () => {
      if (this.state.timePlanFlag) {
        this.props.getInfoListsTypeMore(this.state.roadInterId, this.state.roadNodeNo, 'PLAN', itemData.schemeNo)
      }
    })
  }
  // 时间轴开始停止 触发
  triggerClick = () => {
    if ($($('#timeBox').find('mark')[0]).attr('class')) {
      $($('#timeBox').find('mark')[0]).trigger('click')
      $($('#timeBox').parent().find('em')).attr('style', 'left:15px')
    } else {
      $($('#timeBox').parent().find('em')).attr('style', 'left:15px')
    }
  }
  // 时间轴
  getScrollTime = (bgData) => {
    this.triggerClick()
    const _this = this
    if (bgData) {
      this.setState({
        thisIndex: bgData.length,
      })
      $('#timeBox').getScrollTime({
        bgColor: true, // 是否有颜色
        bgData: bgData, // 背景数据
        paddingBoth: 15, //左右padding 值
        plugStyle: styles, //样式传入
        thisDom: _this, // this根指向
      })
    }

  }
  // (新增或更新) 插件相位、阶段、配时方案、日计划、调度
  postAddUpdateItem = (itemDetailData, stepType, eventType) => {
    let typeStr = '', showStr = '', detailStr = '', _this = this, dayPlanParam1 = '', dayPlanParam2 = '', dayPlanParam3 = '', resData = []
    switch (stepType) {
      case 'PHASE':
        typeStr = '相位'
        showStr = 'stepFiveAddEdit'
        detailStr = 'phaseShowDetail'
        this.cyclicComparison(this.state.phaseForbidenData, 'phaseForbiden', itemDetailData.phaseForbiden, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.phaseShieldData, 'phaseShield', itemDetailData.phaseShield, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayAccessLamp1Type', itemDetailData.rightofwayAccessLamp1Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayAccessLamp2Type', itemDetailData.rightofwayAccessLamp2Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayAccessLamp3Type', itemDetailData.rightofwayAccessLamp3Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayLoseLamp1Type', itemDetailData.rightofwayLoseLamp1Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayLoseLamp2Type', itemDetailData.rightofwayLoseLamp2Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayLoseLamp3Type', itemDetailData.rightofwayLoseLamp3Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayStartingupAccessLamp1Type', itemDetailData.rightofwayStartingupAccessLamp1Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayStartingupAccessLamp2Type', itemDetailData.rightofwayStartingupAccessLamp2Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayStartingupAccessLamp3Type', itemDetailData.rightofwayStartingupAccessLamp3Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayStartingupLoseLamp1Type', itemDetailData.rightofwayStartingupLoseLamp1Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayStartingupLoseLamp2Type', itemDetailData.rightofwayStartingupLoseLamp2Type, 'phaseShowDetail', true)
        this.cyclicComparison(this.state.typeData, 'rightofwayStartingupLoseLamp3Type', itemDetailData.rightofwayStartingupLoseLamp3Type, 'phaseShowDetail', true)
        itemDetailData.phaseLampgroupId === '请点击进行编辑' ? itemDetailData.phaseLampgroupId = null : ''
        itemDetailData.phaseDemand === '请点击进行编辑' ? itemDetailData.phaseDemand = null : ''
        itemDetailData.laneIds === '请点击进行编辑' ? itemDetailData.laneIds = null : ''
        itemDetailData = JSON.parse(JSON.stringify(this.state.phaseShowDetail))
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.phaseLists
        if (this.isNotEmpty(itemDetailData.phaseNo, '相位序号不能为空！')) return
        if (this.verificationID(resData, 'phaseNo', itemDetailData.phaseNo, '相位序号已存在')) return
        if (this.isNotEmpty(itemDetailData.phaseName, '相位名称不能为空！')) return
        if (this.isNotEmpty(itemDetailData.phaseDelaygreenTime, '相位延迟绿时间不能为空！', true)) return

        if (this.isNotEmpty(itemDetailData.phaseMingreenTime, '相位最小绿时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.phaseMaxgreen1Time, '相位最大绿时间1不能为空且大于0！')) return
        if (this.isNotEmpty(itemDetailData.phaseMaxgreen2Time, '相位最大绿时间2不能为空且大于0！')) return
        if (Number(itemDetailData.phaseMingreenTime) > Number(itemDetailData.phaseMaxgreen1Time) || Number(itemDetailData.phaseMingreenTime) > Number(itemDetailData.phaseMaxgreen2Time)) {
          message.info('相位最小绿时间不能大于相位最大绿时间！')
          $("#phaseMingreenTime").focus();
          return false;
        }
        if (this.isNotEmpty(itemDetailData.rightofwayAccessLamp1Type, '请选择获得路权过渡灯色1类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayAccessLamp1Time, '获得路权过渡灯色1时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayAccessLamp2Type, '请选择获得路权过渡灯色2类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayAccessLamp2Time, '获得路权过渡灯色2时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayAccessLamp3Type, '请选择获得路权过渡灯色3类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayAccessLamp3Time, '获得路权过渡灯色3时间不能为空！', true)) return

        if (this.isNotEmpty(itemDetailData.rightofwayLoseLamp1Type, '请选择失去路权过渡灯色1类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayLoseLamp1Time, '失去路权过渡灯色1时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayLoseLamp2Type, '请选择失去路权过渡灯色2类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayLoseLamp2Time, '失去路权过渡灯色2时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayLoseLamp3Type, '请选择失去路权过渡灯色3类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayLoseLamp3Time, '失去路权过渡灯色3时间不能为空！', true)) return

        if (this.isNotEmpty(itemDetailData.rightofwayStartingupAccessLamp1Type, '请选择开机获得路权灯色1类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupAccessLamp1Time, '开机获得路权灯色1时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupAccessLamp2Type, '请选择开机获得路权灯色2类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupAccessLamp2Time, '开机获得路权灯色2时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupAccessLamp3Type, '请选择开机获得路权灯色3类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupAccessLamp3Time, '开机获得路权灯色3时间不能为空！', true)) return

        if (this.isNotEmpty(itemDetailData.rightofwayStartingupLoseLamp1Type, '请选择开机失去路权灯色1类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupLoseLamp1Time, '开机失去路权灯色1时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupLoseLamp2Type, '请选择开机失去路权灯色2类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupLoseLamp2Time, '开机失去路权灯色2时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupLoseLamp3Type, '请选择开机失去路权灯色3类型！')) return
        if (this.isNotEmpty(itemDetailData.rightofwayStartingupLoseLamp3Time, '开机失去路权灯色3时间不能为空！', true)) return

        break;
      case 'STAGE':
        typeStr = '阶段'
        showStr = 'stepSixAddEdit'
        detailStr = 'stageShowDetail'
        itemDetailData.phasestagePhase === '请点击进行编辑' ? itemDetailData.phasestagePhase = null : ''
        itemDetailData.softwareRequirement === '请点击进行编辑' ? itemDetailData.softwareRequirement = null : ''
        itemDetailData.phasestageLane === '请点击进行编辑' ? itemDetailData.phasestageLane = null : ''
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.stageLists
        if (this.isNotEmpty(itemDetailData.phasestageNo, '阶段编号不能为空！')) return
        if (this.verificationID(resData, 'phasestageNo', itemDetailData.phasestageNo, '阶段编号已存在')) return
        if (this.isNotEmpty(itemDetailData.phasestageName, '阶段名称不能为空！')) return
        if (this.isNotEmpty(itemDetailData.lateStartTime, '阶段中相位晚启动的时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.leftingEndTime, '阶段中相位早结束的时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.phasestagePhase, '阶段中包含相位不能为空！')) return
        break;
      case 'PLAN':
        typeStr = '配时方案'
        showStr = 'stepSevenAddEdit'
        detailStr = 'planShowDetail'
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.planLists
        if (this.isNotEmpty(itemDetailData.schemeNo, '方案编号不能为空！')) return
        if (this.verificationID(resData, 'schemeNo', itemDetailData.schemeNo, '方案编号已存在')) return
        if (this.isNotEmpty(itemDetailData.schemeName, '方案名称不能为空！')) return
        if (this.isNotEmpty(itemDetailData.schemePhaseDiferenceTime, '方案相位差时间不能为空！', true)) return
        if (this.isNotEmpty(itemDetailData.schemePhasestageType, '请选择方案相位阶段出现类型！')) return
        break;
      case 'DAYPLAN':
        itemDetailData.timeintervalList.map((dayPlanitem) => {
          dayPlanParam1 += dayPlanitem.timeintervalScheme + ','
          dayPlanParam2 += dayPlanitem.timeintervalModel + ','
          dayPlanParam3 += dayPlanitem.timeintervalStarttime + ','
        })
        itemDetailData.timeintervalSchemeChain = dayPlanParam1.slice(0, -1)
        itemDetailData.timeintervalModelChain = dayPlanParam2.slice(0, -1)
        itemDetailData.timeintervalStarttimeChain = dayPlanParam3.slice(0, -1)
        typeStr = '日计划'
        showStr = 'stepEightAddEdit'
        detailStr = 'dayplanShowDetail'
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.dayPlanLists
        if (this.isNotEmpty(itemDetailData.dailyplanNo, '日计划编号不能为空！')) return
        if (this.verificationID(resData, 'dailyplanNo', itemDetailData.dailyplanNo, '日计划编号已存在')) return
        const itemDayData = itemDetailData.timeintervalList
        for (let d = 0; d < itemDayData.length; d++) {
          if (itemDayData[d + 1]) {
            let dTime = new Date("2020-01-01 " + itemDayData[d].timeintervalStarttime + ":00").getTime() / 1000
            let dTime1 = new Date("2020-01-01 " + itemDayData[d + 1].timeintervalStarttime + ":00").getTime() / 1000
            if (dTime === dTime1) {
              message.info('开始时间不能相同！');
              return false
            }
            if (dTime > dTime1) {
              message.info('开始时间必须递增,不能少于以前的时间！');
              return false
            }
          }
          if (this.isNotEmpty(itemDayData[d].timeintervalScheme, '请选择运行方案！')) return false
          if (this.isNotEmpty(itemDayData[d].timeintervalModel, '请选择运行模式！')) return false
        }
        break;
      case 'DISPATCH':
        typeStr = '调度'
        showStr = 'stepNineAddEdit'
        detailStr = 'dispatchShowDetail'
        itemDetailData.scheduleDetailList.map((item) => {
          item.scheduleNo = itemDetailData.scheduleNo
        })
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.dispatchLists
        if (this.isNotEmpty(itemDetailData.scheduleNo, '调度方案编号不能为空！')) return
        if (this.verificationID(resData, 'scheduleNo', itemDetailData.scheduleNo, '调度编号已存在')) return
        const itemData = itemDetailData.scheduleDetailList
        for (let d = 0; d < itemData.length; d++) {
          if (this.isNotEmpty(itemData[d].dailyPlanId, '请选择日计划！')) return false
          if (this.isNotEmpty(itemData[d].priority, '请选择优选级！')) return false
          if (this.isNotEmpty(itemData[d].dateType, '请选择调度类型！')) return false
          if (itemData[d].dateType === 1) {
            if (this.isNotEmpty(itemData[d].monthValueCodes, '请选择月份！')) return false
            if (this.isNotEmpty(itemData[d].dataValueCodes, '请选择日期！')) return false
          } else {
            if (this.isNotEmpty(itemData[d].dataValueCodes, '请选择星期！')) return false
          }
        }
        break;
    }
    if (eventType) {
      this.props.postAddOthersType(itemDetailData, stepType).then(() => {
        this.popLayerShowHide(showStr, null)
        message.info(typeStr + "操作成功！")
        _this.setState({ [detailStr]: null })
        // _this.props.getStepStatus(_this.state.roadInterId, _this.state.roadNodeNo)
        if (stepType === 'PLAN' || stepType === 'DAYPLAN' || stepType === 'DISPATCH') {
          _this.props.getInfoListsTypeMore(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
        } else {
          _this.props.getInfoListsType(_this.state.roadInterId, stepType)

        }
      })
    } else {
      this.props.postUpdateOthersType(itemDetailData, stepType).then(() => {
        this.popLayerShowHide(showStr, null)
        message.info(typeStr + "操作成功！")
        _this.setState({ [detailStr]: null })
        // _this.props.getStepStatus(_this.state.roadInterId, _this.state.roadNodeNo)
        if (stepType === 'PLAN' || stepType === 'DAYPLAN' || stepType === 'DISPATCH') {
          _this.props.getInfoListsTypeMore(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
        } else {
          _this.props.getInfoListsType(_this.state.roadInterId, stepType)
        }
      })
    }
  }
  // 编辑弹层列表用于多选 车道、灯组、检测器
  getSelectLists = (interId, nodeNo, stepType, name, key) => {
    let typeStr = '', showStr = '', detailStr = '', _this = this
    switch (stepType) {
      case 'LANE':
        this.setState({
          popAddEditName: '车道',
          selectFlag: false,
          laneDefaultSelectLists: this.state[name][key],
        })
        break;
      case 'LIGHT':
        this.setState({
          popAddEditName: '灯组',
          selectFlag: false,
          lightDefaultSelectLists: this.state[name][key],
        })
        break;
      case 'DETECTOR':
        this.setState({
          popAddEditName: '检测器需求',
          selectFlag: false,
          detectorDefaultSelectLists: this.state[name][key],
        })
        break;
      case 'PHASE':
        this.setState({
          popAddEditName: '相位',
          selectFlag: false,
          phaseDefaultSelectLists: this.state[name][key],
          phaseFlag: true,
        }, () => {
          this.props.getInfoListsType(this.state.roadInterId, 'PHASE') // 加载相位列表
        })
        break;
    }
    this.props.getSelectLists(interId, nodeNo, stepType)
  }
  selectItemList = (defaultSelectLists, stepType) => {
    // console.log(defaultSelectLists, '选中的数据')
    switch (stepType) {
      case 'PHASE':
        this.setState({ phaseDefaultSelectLists: defaultSelectLists.join() })
        break;
      case 'LANE':
        this.setState({ laneDefaultSelectLists: defaultSelectLists.join() })
        break;
      case 'LIGHT':
        this.setState({ lightDefaultSelectLists: defaultSelectLists.join() })
        break;
      case 'DETECTOR':
        this.setState({ detectorDefaultSelectLists: defaultSelectLists.join() })
        break;
    }
  }
  // 确定和取消选中
  btnSelectOver = (flag, defaultSelectLists) => {
    if (flag) {
      if (this.state.laneSelectLists) {
        this.state.phaseShowDetail.laneIds = defaultSelectLists
      } else if (this.state.lightSelectLists) {
        this.state.phaseShowDetail.phaseLampgroupId = defaultSelectLists
      } else if (this.state.detectorSelectLists) {
        if (this.state.phaseShowDetail && this.state.phaseShowDetail.phaseDemand !== undefined) {
          this.state.phaseShowDetail.phaseDemand = defaultSelectLists
        } else if (this.state.stageShowDetail && this.state.stageShowDetail.softwareRequirement !== undefined) {
          this.state.stageShowDetail.softwareRequirement = defaultSelectLists
        }
      } else if (this.state.phaseSelectLists) {
        this.state.stageShowDetail.phasestagePhase = defaultSelectLists
      }
      this.setState({
        laneSelectLists: null,
        lightSelectLists: null,
        detectorSelectLists: null,
        phaseSelectLists: null,
        phaseFlag: null,
        selectFlag: true,
      })
    } else {
      this.setState({
        laneSelectLists: null,
        lightSelectLists: null,
        detectorSelectLists: null,
        phaseSelectLists: null,
        phaseFlag: null,
        selectFlag: true,
      })
    }
  }
  showInterworkingList = (isShow) => {
    if (isShow) {
      this.setState({
        turnTab: true,
      })
    } else {
      this.setState({
        turnTab: null,
      })
    }
  }
  getresetPwd = (item) => {
    this.showInterworkingList(null)
    const resultP = Promise.resolve(this.props.getUnitPop(item.interId))
    resultP.then(() => {
      this.setGetParams(item)
    })
  }
  // 创建地图层
  loadingMap = () => {
    // const map = new AMap.Map('mapContent', {
    //   resizeEnable: true, //是否监控地图容器尺寸变化
    //   center: [102.71566093,25.04232215], //初始化地图中心点 昆明
    //   // center: [120.202633, 30.266603], //初始化地图中心点
    //   mapStyle: "amap://styles/f9281194c6119ea4669f1dd2e75af292",
    //   zoom: 11,
    // })
    // this.map = map
    // map.on("click", function (e) {
    //   console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
    // })
    // this.createLayerGroup('pointLayers') // map中显示点的图层
    // if (this.state.mapPointsData !== null) {
    //   this.drawMarkers(this.state.mapPointsData, 'pointLayers') // 初始化点
    // }
  }
  // 创建地图层 > 对应元素层
  createLayerGroup = (name) => {
    window[name] = new AMap.LayerGroup({
      'autoRefresh': true,     //是否自动刷新，默认为false
      'interval': 180,         //刷新间隔，默认180s
    });
  }
  //批量添加点
  drawMarkers = (positions, layer) => {
    const map = this.map
    if (window[layer]) {
      window[layer].removeLayers(this[layer])
    }
    this[layer] = []
    if (this.infoWindow) {
      this.infoWindow.close()
    }
    if (map) {
      for (let i = 0; i < positions.length; i++) {
        const marker = new AMap.Marker({
          position: new AMap.LngLat(positions[i].lng, positions[i].lat),
          offset: new AMap.Pixel(-16, -16),
          content: "<div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].interId + "' class='marker-offline'></div>",
          extData: { id: positions[i].id },
          // content: "<div class='inner'></div><div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='marker-offline'></div>",
        })
        marker.on('click', (e) => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          this.classNs = $(marker.getContent()).attr('class')
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].interId + "' class='" + this.classNs + "'></div></div>");
          const nowZoom = map.getZoom()
          map.setZoomAndCenter(nowZoom, [positions[i].lng, positions[i].lat]); //同时设置地图层级与中心点
          this.setState({
            roadUnitId: positions[i].id,
            roadInterId: positions[i].interId,
            roadNodeNo: positions[i].nodeId,
          }, () => {
            const resultP = Promise.resolve(this.props.getUnitPop(positions[i].interId))
            resultP.then(() => {
              this.openInfoWin(map, positions[i], marker, positions[i].interName)
            })
          })
        })
        this[layer].push(marker)
      }
      window[layer].addLayers(this[layer]) // 把点添加到层组中
      window[layer].setMap(map) // 层组渲染到地图中
    }
  }
  //在指定位置打开信息窗体
  openInfoWin = (map, dataItem, marker, name) => {
    debugger
    // console.log(this.props.data.dcuPopData, '弹层所需数据')
    var info = [];
    let itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    info.push(`<div class='content_box' style='background:none!important'>`);
    info.push(`<div class='content_box_title' style='background:none!important;color:#343434'><h4 style='color:#343434;'>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + name + `</span></p>`);
    info.push(`<p class='input-item'>信号机编号：<span>${itemData.deviceId || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>信号机品牌：<span>${itemData.brand || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>${itemData.ip || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>${itemData.maintainPhone || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>信号运行阶段：<span class='greenFont'><span id='phasestageName'>暂无</span><img id='phasestageImage' style='display:none' src='' /></span></p>`);
    info.push(`<p class='input-item'>信号运行方案：<span class='greenFont' id='schemeName'>暂无</span></p>`);
    info.push(`<p class='input-item'>信号控制方式：<span class='greenFont' id='nodeModelName'>暂无</span></p>`);
    info.push(`<p class='input-item' style='height:15px;'></p>`);
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams(` + JSON.stringify(dataItem) + `)'>参数配置</span></p>`);
    if (this.state.oLMapFlag) {
      $("#message").html(info.join(""))
    } else {
      const infoWindow = new AMap.InfoWindow({
        content: info.join("")  //使用默认信息窗体框样式，显示信息内容
      });
      infoWindow.open(map, [dataItem.lng, dataItem.lat]);
      this.infoWindow = infoWindow
      window.infoWindowClose = infoWindow
      map.on('click', (e) => {
        if ($("#roadKey" + dataItem.interId).parent().hasClass('drawCircle')) {
          if ($("#roadKey" + dataItem.interId).hasClass('marker-offline')) {
            marker.setContent("<div inter-id='" + dataItem.interId + "' class='marker-online marker-offline'></div>");
          } else {
            marker.setContent("<div inter-id='" + dataItem.interId + "' class='marker-online'></div>");
          }
        }
        infoWindow.close()
      })
    }
  }
  handleChangeBaseMap = (info) => {
    // debugger
    if (info.file.status === "uploading") {
      this.setState({ baseLoading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, imageUrl => {
        const formData = new FormData()
        formData.append('file', info.file.originFileObj)
        this.setState({
          imageUrl,
          imageFile: formData,
          baseLoading: false
        })
      }
      )
    }
  }
  handleUpdateImageUrl = (imageUrl) => {
    this.setState({
      imageUrl: this.bgIpUrl + imageUrl,
      imageName: imageUrl,
    })
  }
  handleClickBaseMap = () => {
    if (this.state.imageFile !== null) {
      message.info("底图设置成功！");
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide("baseMapFlag", null)
        this.props.postBgByUpload(this.state.roadId, this.state.imageFile)
      })
    } else if (!!this.state.imageUrl) {
      message.info("底图设置成功！");
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide("baseMapFlag", null)
        this.props.postBgBySelect({ id: this.state.roadId, interId: this.state.roadInterId, nodeId: this.state.roadNodeNo, background: this.state.imageName })
      })
    } else if (this.state.imageFile === null || !this.state.imageUrl) {
      message.info("请上传或选择底图!");
    }
  }
  // step 车道列表和图标添加、灯组列表和图标添加、检测器列表和图标添加
  // stepType:类型，itemDetailData:实时调用的数据
  postAddAllType = (itemDetailData, stepType) => {
    let typeStr = '', showStr = '', detailStr = '', _this = this
    switch (stepType) {
      case 'LANE':
        typeStr = '车道'
        showStr = 'stepRoadAddEdit'
        detailStr = 'laneShowDetail'
        this.cyclicComparison(this.state.laneSdtypeNoData, 'laneSdtypeNo', itemDetailData.laneSdtypeNo, 'laneShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.laneShowDetail))
        if (this.isNotEmpty(itemDetailData.laneId, '车道ID不能为空！')) return
        if (this.isNotEmpty(itemDetailData.laneNo, '车道号不能为空或为0！')) return
        if (this.isNotEmpty(itemDetailData.laneSdtypeNo, '请选择进出口方向！')) return
        if (this.isNotEmpty(itemDetailData.fDir8No, '请选择方向！')) return
        if (this.isNotEmpty(itemDetailData.turnDirNoList, '请选择转向！')) return
        if (this.verificationID(this.props.data.laneLists, 'laneId', itemDetailData.laneId, '车道ID已存在')) return
        break;
      case 'LIGHT':
        typeStr = '灯组'
        showStr = 'stepThreeAddEdit'
        detailStr = 'lightShowDetail'
        this.cyclicComparison(this.state.controlDir, 'controlDir', itemDetailData.controlDir, 'lightShowDetail', true)
        this.cyclicComparison(this.state.controlTurn, 'controlTurn', itemDetailData.controlTurn, 'lightShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.lightShowDetail))
        if (this.isNotEmpty(itemDetailData.lampgroupNo, '灯组序号不能为空！')) return
        if (this.verificationID(this.props.data.lightLists, 'lampgroupNo', itemDetailData.lampgroupNo, '灯组ID已存在')) return
        break;
      case 'DETECTOR':
        typeStr = '检测器'
        showStr = 'stepFourAddEdit'
        detailStr = 'detectorShowDetail'
        this.cyclicComparison(this.state.detectorType, 'detectorType', itemDetailData.detectorType, 'detectorShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.detectorShowDetail))
        if (this.isNotEmpty(itemDetailData.detectorId, '检测器序号不能为空！')) return
        if (this.isNotEmpty(itemDetailData.flowCollectionCycle, '流量周期不符合规则！')) return
        if (this.isNotEmpty(itemDetailData.occupancyCollectionCycle, '占有率周期不符合规则！')) return
        if (this.isNotEmpty(itemDetailData.detectorType, '请选择检测器类型！')) return
        if (this.verificationID(this.props.data.detectorLists, 'detectorId', itemDetailData.detectorId, '检测器ID已存在')) return
        break;
    }
    this.props.postAddAllType(itemDetailData, stepType).then(() => {
      this.popLayerShowHide(showStr, null)
      message.info(typeStr + "添加成功！")
      _this.setState({ [detailStr]: null })
      _this.props.getPicListsType(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
      _this.props.getInfoListsType(_this.state.roadInterId, stepType)
    })
    // console.log(itemDetailData, '添加时：看下数据是最新的不？')
  }
  // step 车道列表和图标修改、灯组列表和图标修改、检测器列表和图标修改
  // stepType:类型，itemDetailData:实时调用的数据
  postUpdateAllType = (itemDetailData, stepType) => {
    let typeStr = '', showStr = '', detailStr = '', resData = [], _this = this
    itemDetailData.nodeNo = this.state.roadNodeNo
    itemDetailData.x ? itemDetailData.x : itemDetailData.x = 489
    itemDetailData.y ? itemDetailData.y : itemDetailData.y = 390

    switch (stepType) {
      case 'LANE':
        typeStr = '车道'
        showStr = 'stepRoadAddEdit'
        detailStr = 'laneShowDetail'
        this.cyclicComparison(this.state.laneSdtypeNoData, 'laneSdtypeNo', itemDetailData.laneSdtypeNo, 'laneShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.laneShowDetail))
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.laneLists
        if (this.isNotEmpty(itemDetailData.laneId, '车道ID不能为空！')) return
        if (this.isNotEmpty(itemDetailData.laneNo, '车道号不能为空！')) return
        if (this.isNotEmpty(itemDetailData.laneSdtypeNo, '请选择进出口方向！')) return
        if (this.isNotEmpty(itemDetailData.fDir8No, '请选择方向！')) return
        if (this.isNotEmpty(itemDetailData.turnDirNoList, '请选择转向！')) return
        if (this.verificationID(resData, 'laneId', itemDetailData.laneId, '车道ID已存在')) return
        break;
      case 'LIGHT':
        typeStr = '灯组'
        showStr = 'stepThreeAddEdit'
        detailStr = 'lightShowDetail'
        this.cyclicComparison(this.state.controlDir, 'controlDir', itemDetailData.controlDir, 'lightShowDetail', true)
        this.cyclicComparison(this.state.controlTurn, 'controlTurn', itemDetailData.controlTurn, 'lightShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.lightShowDetail))
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.lightLists
        if (this.isNotEmpty(itemDetailData.lampgroupNo, '灯组序号不能为空！')) return
        if (this.verificationID(resData, 'lampgroupNo', itemDetailData.lampgroupNo, '灯组序号已存在')) return
        break;
      case 'DETECTOR':
        typeStr = '检测器'
        showStr = 'stepFourAddEdit'
        detailStr = 'detectorShowDetail'
        this.cyclicComparison(this.state.detectorType, 'detectorType', itemDetailData.detectorType, 'detectorShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.detectorShowDetail))
        this.state.popAddEditText === '编辑' ? resData = this.state.editData : resData = this.props.data.detectorLists
        if (this.isNotEmpty(itemDetailData.detectorId, '检测器序号不能为空！')) return
        if (this.isNotEmpty(itemDetailData.flowCollectionCycle, '流量周期不符合规则！')) return
        if (this.isNotEmpty(itemDetailData.occupancyCollectionCycle, '占有率周期不符合规则！')) return
        if (this.isNotEmpty(itemDetailData.detectorType, '请选择检测器类型！')) return
        if (this.verificationID(resData, 'detectorId', itemDetailData.detectorId, '检测器序号已存在')) return
        break;
    }
    this.props.postUpdateAllType(itemDetailData, stepType).then(() => {
      console.log(itemDetailData, stepType, 'xxxxxvvv')
      this.popLayerShowHide(showStr, null)
      message.info(typeStr + "修改成功！")
      _this.setState({ [detailStr]: null })
      _this.props.getPicListsType(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
      _this.props.getInfoListsType(_this.state.roadInterId, stepType)
    })

  }
  // 修改 > 车道列表、灯组列表、检测器列表
  getUpdateAllTypes = (interId, roadNodeNo, Id, stepType, flag) => {
    let typeName = ''
    switch (stepType) {
      case 'LANE':
        typeName = 'stepRoadAddEdit';
        this.editReturnData(this.props.data.laneLists, 'laneId', Id)
        break;
      case 'LIGHT':
        typeName = 'stepThreeAddEdit';
        this.editReturnData(this.props.data.lightLists, 'lampgroupNo', Id)
        break;
      case 'DETECTOR':
        typeName = 'stepFourAddEdit';
        this.editReturnData(this.props.data.detectorLists, 'detectorId', Id)
        break;
    }
    if (flag) {
      this.setState({
        showFlag: true,
        popAddEditText: '编辑',
        [typeName]: flag,
      }, () => {
        this.props.getUpdateAllType(interId, roadNodeNo, Id, stepType)
      })
    }
  }
  // 获取全部图标、车道、灯组
  getIconImageList = (e, stepType) => {
    // debugger
    this.selImage = e.target
    this.props.getIconImageList(stepType)
    this.setState({ showFlag: null })
  }
  // 图标点击
  handleSelImage = (imageList, name, imgName) => {
    this.state[name].imagePath !== undefined ? this.state[name].imagePath = imgName : this.state[name].imageUrl = imgName
    this.setState({ showFlag: true, [imageList]: null })
  }
  // 方案阶段链添加
  addStagePlan = () => {
    this.setState({
      popAddEditName: '选择阶段',
      showFlag: false,
    })
  }
  // 方案阶段链删除
  reduceStagePlan = () => {
    const planStageLists = JSON.parse(JSON.stringify(this.state.planStageLists))
    if (planStageLists.length > 1) {
      planStageLists.splice(planStageLists.length - 1, 1)
      this.setState({ planStageLists }, () => {
        this.calcNum()
      })
    } else {
      message.info('请至少保留一条数据！')
    }
  }
  // 日计划开始时间方案模式链添加
  addDayPlan = () => {
    const dayplanShowDetail = JSON.parse(JSON.stringify(this.state.dayplanShowDetail))
    dayplanShowDetail.timeintervalList.push({ timeintervalModel: 0, timeintervalStarttime: "00:00", timeintervalScheme: 0 })
    this.setState({ dayplanShowDetail })
  }
  // 日计划开始时间方案模式链删除
  reduceDayPlan = () => {
    const dayplanShowDetail = JSON.parse(JSON.stringify(this.state.dayplanShowDetail))
    if (dayplanShowDetail.timeintervalList.length > 1) {
      dayplanShowDetail.timeintervalList.splice(dayplanShowDetail.timeintervalList.length - 1, 1)
      this.setState({ dayplanShowDetail })
    } else {
      message.info('请至少保留一条数据！')
    }
  }
  // 调度计划添加
  addDispatch = () => {
    const dispatchShowDetail = JSON.parse(JSON.stringify(this.state.dispatchShowDetail))
    dispatchShowDetail.scheduleDetailList.push({
      "interId": this.state.roadInterId,  //
      "nodeNo": this.state.roadNodeNo, //
      "scheduleNo": '',   //调度号
      "dailyPlanId": 0,   //日计划编号
      "dataValueCodes": "0",  //日期值code，逗号拼接
      "dateType": 0,  //日期类型                    
      "monthValueCodes": "", //月份
      "priority": 0,  //优先级
    })
    this.setState({ dispatchShowDetail })
  }
  // 调度计划删除
  reduceDispatch = () => {
    const dispatchShowDetail = JSON.parse(JSON.stringify(this.state.dispatchShowDetail))
    if (dispatchShowDetail.scheduleDetailList.length > 1) {
      dispatchShowDetail.scheduleDetailList.splice(dispatchShowDetail.scheduleDetailList.length - 1, 1)
      this.setState({ dispatchShowDetail })
    } else {
      message.info('请至少保留一条数据！')
    }
  }
  updateMapPonitsColor = (data) => {
    data && data.map((item) => {
      for (let i = 0; i < $('div[inter-id]').length; i++) {
        if (item.interId === $($('div[inter-id]')[i]).attr('inter-id')) {
          if (item.state === 1) {
            $($('div[inter-id]')[i]).removeClass()
            $($('div[inter-id]')[i]).addClass('marker-online')
          } else if (item.state === 2) {
            $($('div[inter-id]')[i]).removeClass().addClass('marker-tagYellLine')
          } else {
            $($('div[inter-id]')[i]).removeClass().addClass('marker-offline')
          }
        }
      }
    })
  }
  returnStep = (result) => {
    switch (result.step) {
      case 1:
        this.setState({
          oneFlag: Boolean(result.code),
          oneText: result.msg,
          twoText: '传输中~~~',
          nowText: '车道配置',
        })
        break;
      case 2:
        this.setState({
          twoFlag: Boolean(result.code),
          twoText: result.msg,
          threeText: '传输中~~~',
          nowText: '灯组配置',
        })
        break;
      case 3:
        this.setState({
          threeFlag: Boolean(result.code),
          threeText: result.msg,
          fourText: '传输中~~~',
          nowText: '检测器配置',
        })
        break;
      case 4:
        this.setState({
          fourFlag: Boolean(result.code),
          fourText: result.msg,
          fiveText: '传输中~~~',
          nowText: '相位配置',
        })
        break;
      case 5:
        this.setState({
          fiveFlag: Boolean(result.code),
          fiveText: result.msg,
          sixText: '传输中~~~',
          nowText: '阶段配置',
        })
        break;
      case 6:
        this.setState({
          sixFlag: Boolean(result.code),
          sixText: result.msg,
          sevenText: '传输中~~~',
          nowText: '配时方案',
        })
        break;
      case 7:
        this.setState({
          sevenFlag: Boolean(result.code),
          sevenText: result.msg,
          eightText: '传输中~~~',
          nowText: '日计划配置',
        })
        break;
      case 8:
        this.setState({
          eightFlag: Boolean(result.code),
          eightText: result.msg,
          nineText: '传输中~~~',
          nowText: '调度配置',
        })
        break;
      case 9:
        this.setState({
          nineFlag: Boolean(result.code),
          nineText: result.msg,
          nowText: result.msg,
          // nowText: '全部内容结束！',
        })
        break;
      case 10:
        this.setState({
          tenFlag: result.step,
        })
        break;
    }
  }
  loadDataType = (flag) => {
    this.props.getDcuState(this.state.roadInterId).then(() => {
      if (this.props.data.dcuStateData !== 0) {
        this.setState({
          loadFlag: flag,
          oneFlag: null,
          oneText: '传输中~~~',
          twoFlag: null,
          twoText: '等待中...',
          threeFlag: null,
          threeText: '等待中...',
          fourFlag: null,
          fourText: '等待中...',
          fiveFlag: null,
          fiveText: '等待中...',
          sixFlag: null,
          sixText: '等待中...',
          sevenFlag: null,
          sevenText: '等待中...',
          eightFlag: null,
          eightText: '等待中...',
          nineFlag: null,
          nineText: '等待中...',
          tenFlag: null,
          nowText: '基础信息配置',
        })
      } else {
        message.info('设备离线状态, 上传失败!')
      }
    })
  }
  loadData(data) {
    let result = JSON.parse(data);
    this.returnStep(result)
    console.log(result, 'socket 上传数据')
  }
  editDataType = (flag) => {
    this.props.getDcuState(this.state.roadInterId).then(() => {
      if (this.props.data.dcuStateData !== 0) {
        this.props.getEditCheckData(this.state.roadInterId).then(() => {
          if (this.state.editCheckData.length > 0) {
            this.setState({ editCheckDataFlag: true })
          } else {
            this.setState({
              editFlag: flag,
              oneFlag: null,
              oneText: '传输中~~~',
              twoFlag: null,
              twoText: '等待中...',
              threeFlag: null,
              threeText: '等待中...',
              fourFlag: null,
              fourText: '等待中...',
              fiveFlag: null,
              fiveText: '等待中...',
              sixFlag: null,
              sixText: '等待中...',
              sevenFlag: null,
              sevenText: '等待中...',
              eightFlag: null,
              eightText: '等待中...',
              nineFlag: null,
              nineText: '等待中...',
              tenFlag: null,
              nowText: '基础信息配置',
            })
          }
        })
      } else {
        message.info('设备离线状态, 下发失败!')
      }
    })
  }
  editData(data) {
    let result = JSON.parse(data);
    this.returnStep(result)
    console.log(result, 'socket 下发数据')
  }
  handleData(data) {
    let result = JSON.parse(data);
    console.log(result, 'socket 数据 点状态')
    this.setState({
      onlineNum: result.onlineNum,
      offlineNum: result.offlineNum,
      handOffline: result.handOffline,
      dcuStateList: result.dcuStateList,
    });
    this.updateMapPonitsColor(result.dcuStateList)
  }
  handlePopData(data) {
    // debugger
    let result = JSON.parse(data);
    // console.log(result,this,'socket POP数据')
    $('#phasestageName').text(result.phasestageName).attr("tag-src", `${this.phaseBgUrl}${result.phasestageImage}`)
    $('#schemeName').text(result.schemeName)
    $('#nodeModelName').text(result.nodeModelName)
    result !== -1 ? $('#phasestageImage').prop('src', `${this.phaseBgUrl}${result.phasestageImage}`).attr('style', 'width:30px;height:30px;margin-left:8px;') : null
    this.setState({
      roadUnitId: false,
    })
  }

  render() {
    const { oLMapFlag, interListHeight, searchInterList, stepStatusData, popAddEditText, popAddEditName, moveFlag, stepOneFlag, stepTwoFlag,
      stepRoadFlag, stepRoadAddEdit,
      stepThreeFlag, stepThreeAddEdit,
      stepFourFlag, stepFourAddEdit, lightStatus, lightSelectIds,
      stepFiveFlag, stepFiveAddEdit, timePlanFlag,
      stepSixFlag, stepSixAddEdit,
      stepSevenFlag, stepSevenAddEdit,
      stepEightFlag, stepEightAddEdit,
      stepNineFlag, stepNineAddEdit,
      turnTab, baseMapFlag, stepOneText, imageUrl, interRoadBg, baseLoading, roadId, roadUnitId, roadInterId, roadNodeNo,
      onlineNum, offlineNum,
      laneShowDetail, laneIconLists, fDir8NoData, turnDirNoListData,
      lightShowDetail, lightIconLists, detectorShowDetail, detectorIconLists, showFlag, nowCycleLength, cycleLength,
      lampgroupType, controlDir, controlTurn, detectorType, phaseForbidenData, phaseShieldData, typeData, planStageLists, planChainsLists,
      phaseShowDetail, stageShowDetail, planShowDetail, dayplanShowDetail, dispatchShowDetail, laneSelectLists, lightSelectLists, detectorSelectLists, selectFlag, phaseDefaultSelectLists, laneDefaultSelectLists, lightDefaultSelectLists, detectorDefaultSelectLists, phaseIconLists, phaseSelectLists, phaseFlag, schemePhasestageTypeData, timeintervalModelChainData, laneSdtypeNoData,
      priorityData, monthData, dayData, weekData, Dcu_Io_Ids, dayPlanClickInfo, dispatchClickInfo, popItemFlag, listNames, loadFlag, editFlag, userLimit,
      oneFlag, twoFlag, threeFlag, fourFlag, fiveFlag, sixFlag, sevenFlag, eightFlag, nineFlag, tenFlag,
      oneText, twoText, threeText, fourText, fiveText, sixText, sevenText, eightText, nineText, nowText, editCheckDataFlag, editCheckData, handOffline
    } = this.state
    const symbolsArr = ["e", "E", "+", "-", "."]
    const { Search } = Input
    return (
      <div className={styles.SignalManagement}>
        { editCheckDataFlag ?
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '600px' }}>
              <div className={styles.popTit}>下发配置问题 <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("editCheckDataFlag", null) }} /></div>
              <div className={styles.popCon} style={{ width: '380px', margin: '0 auto', maxHeight: '500px' }}>
                {editCheckData && editCheckData.map((item) => {
                  return <div className={styles.loadItemBox}><Icon type="issues-close" /> <em>{item}</em></div>
                })
                }
              </div>
              <div className={styles.popBottom} style={{ padding: '15px 0' }}>
                <em onClick={() => { this.popLayerShowHide("editCheckDataFlag", null) }}>关 闭</em>
              </div>
            </div>
          </div> : null
        }
        {loadFlag || editFlag ?
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '600px' }}>
              <div className={styles.popTit}>
                {loadFlag ? '上传配置' : editFlag ? '下发配置' : null}
                {tenFlag === 10 ? <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("loadFlag", null) }} /> : null}
              </div>
              <div className={styles.popCon} style={{ width: '380px', margin: '0 auto' }}>
                <div className={styles.loadItemBox}><span>基础信息配置：</span>{oneFlag === null ? <Spin size="small" /> : (oneFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{oneText}</em></div>
                <div className={styles.loadItemBox}><span>车道配置：</span>{twoFlag === null ? <Spin size="small" /> : (twoFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{twoText}</em></div>
                <div className={styles.loadItemBox}><span>灯组配置：</span>{threeFlag === null ? <Spin size="small" /> : (threeFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{threeText}</em></div>
                <div className={styles.loadItemBox}><span>检测器配置：</span>{fourFlag === null ? <Spin size="small" /> : (fourFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{fourText}</em></div>
                <div className={styles.loadItemBox}><span>相位配置：</span>{fiveFlag === null ? <Spin size="small" /> : (fiveFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{fiveText}</em></div>
                <div className={styles.loadItemBox}><span>阶段配置：</span>{sixFlag === null ? <Spin size="small" /> : (sixFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{sixText}</em></div>
                <div className={styles.loadItemBox}><span>配时方案配置：</span>{sevenFlag === null ? <Spin size="small" /> : (sevenFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{sevenText}</em></div>
                <div className={styles.loadItemBox}><span>日计划配置：</span>{eightFlag === null ? <Spin size="small" /> : (eightFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{eightText}</em></div>
                <div className={styles.loadItemBox}><span>调度配置：</span>{nineFlag === null ? <Spin size="small" /> : (nineFlag ? <Icon type="check-circle" /> : <Icon type="close-circle" />)}<em>{nineText}</em></div>
                <div className={styles.loadItemBox} style={{ padding: '35px 0 15px', justifyContent: 'center' }}>
                  {tenFlag ? null : <Spin size="large" />}<div style={{ marginLeft: '20px' }}>{nowText}{tenFlag ? null : (loadFlag ? '上传中...' : editFlag ? '下发中...' : null)}</div>
                </div>
              </div>
              <div className={styles.popBottom} style={{ padding: '15px 0' }}>
                {tenFlag === 10 ? <em onClick={() => { this.popLayerShowHide("loadFlag", null) }}>关 闭</em> : null}
              </div>
            </div>
          </div> : null
        }
        {loadFlag ? <Websocket url={`${this.props.data.devSockets}${this.socketLoadDataUrl}${0}/${roadInterId}/${0}?Authorization=${this.token}`} onMessage={this.loadData.bind(this)} /> : null}
        {editFlag ? <Websocket url={`${this.props.data.devSockets}${this.socketEditDataUrl}${0}/${roadInterId}/${0}?Authorization=${this.token}`} onMessage={this.editData.bind(this)} /> : null}
        <Websocket url={`${this.props.data.devSockets}${this.socketPointStatusUrl}?Authorization=${this.token}`} onMessage={this.handleData.bind(this)} />
        {!!roadUnitId && !!roadInterId && !!roadNodeNo ? <Websocket url={`${this.props.data.devSockets}${this.socketPointPopUrl}${roadUnitId}/${roadInterId}/${roadNodeNo}?Authorization=${this.token}`} onMessage={this.handlePopData.bind(this)} /> : null}
        <Header {...this.props} />
        {/* 调度点击行弹层 */}
        {dispatchClickInfo || dayPlanClickInfo ?
          <div className={styles.maskBg}>
            {/* 日计划点击行弹层 */}
            {dayPlanClickInfo && !popItemFlag ?
              <div className={styles.popBox} style={{ width: '600px', zIndex: '101' }}>
                <div className={styles.rTit} style={{ lineHeight: '35px' }}>配时方案配置</div>
                <ListForAntd {...this.props} dataSourse={dayPlanClickInfo} listNames={listNames} listType={'PLAN'} imgIconUrl={this.phaseBgUrl} showIndex={3} nothing={false} />
                <div className={styles.popBottom}>
                  <em onClick={() => { this.popLayerShowHide("dayPlanClickInfo", null) }}>返 回</em>
                </div>
              </div> : null
            }
            {dispatchClickInfo && popItemFlag ?
              <div className={styles.popBox} style={{ width: '600px' }}>
                <div className={styles.rTit} style={{ lineHeight: '35px' }}>日计划配置</div>
                <ListForAntd {...this.props} handleLineClick={this.handleLineClick} dataSourse={dispatchClickInfo} listNames={listNames} listType={'DAYPLAN'} imgIconUrl={this.phaseBgUrl} showIndex={2} nothing={false} />
                <div className={styles.popBottom}>
                  <em onClick={() => { this.popLayerShowHide("dispatchClickInfo", null) }}>返 回</em>
                </div>
              </div> : null
            }
          </div> : null
        }
        {/* 编辑弹层列表用于多选 车道、灯组、检测器 */}
        {laneSelectLists && !selectFlag || lightSelectLists && !selectFlag || detectorSelectLists && !selectFlag || phaseSelectLists && !selectFlag ?
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '600px' }}>
              <div className={styles.popTit}>{popAddEditText}{popAddEditName}</div>
              <div className={styles.popCon} style={{ padding: '0' }}>
                {phaseFlag && phaseSelectLists &&
                  <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'PHASE')} value={phaseDefaultSelectLists && phaseDefaultSelectLists.split(",").map(Number)}>
                    <Row>
                      <Col span={4}>相位序号</Col>
                      <Col span={10}>相位名称</Col>
                      <Col span={10}>相位延迟绿时间</Col>
                    </Row>
                    {phaseSelectLists.map((item) => {
                      return <Row key={'phase' + item.phaseNo}>
                        <Col span={4}>
                          <Checkbox value={item.phaseNo}>{item.phaseNo}</Checkbox>
                        </Col>
                        <Col span={10}>{!item.phaseName ? '无' : item.phaseName}</Col>
                        <Col span={10}>{!item.phaseDelaygreenTime ? '无' : item.phaseDelaygreenTime}</Col>
                      </Row>
                    })
                    }
                  </Checkbox.Group>
                }
                {laneSelectLists &&
                  <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'LANE')} value={laneDefaultSelectLists && laneDefaultSelectLists.split(",").map(Number)}>
                    <Row>
                      <Col span={4}>车道号</Col>
                      <Col span={5}>道路编号</Col>
                      <Col span={5}>转向</Col>
                      <Col span={5}>通行方向描述</Col>
                      <Col span={5}>外部车道号</Col>
                    </Row>
                    {laneSelectLists.map((item) => {
                      return <Row key={'lane' + item.laneId}>
                        <Col span={4}>
                          <Checkbox value={item.laneId}>{item.laneId}</Checkbox>
                        </Col>
                        <Col span={5}>{!item.fRid ? '无' : item.fRid}</Col>
                        <Col span={5}>{!item.turnDirNoListName ? '无' : item.turnDirNoListName}</Col>
                        <Col span={5}>{!item.dirName ? '无' : item.dirName}</Col>
                        <Col span={5}>{!item.laneIdCust ? '无' : item.laneIdCust}</Col>
                      </Row>
                    })
                    }
                  </Checkbox.Group>
                }
                {lightSelectLists &&
                  <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'LIGHT')} value={lightDefaultSelectLists && lightDefaultSelectLists.split(",").map(Number)}>
                    <Row>
                      <Col span={6}>灯组序号</Col>
                      <Col span={6}>灯组类型</Col>
                      <Col span={6}>控制转向</Col>
                      <Col span={6}>控制方向</Col>
                    </Row>
                    {lightSelectLists.map((item) => {
                      return <Row key={'lampgroup' + item.lampgroupNo}>
                        <Col span={6}>
                          <Checkbox value={item.lampgroupNo}>{item.lampgroupNo}</Checkbox>
                        </Col>
                        <Col span={6}>{!item.lampgroupTypeName ? '无' : item.lampgroupTypeName}</Col>
                        <Col span={6}>{!item.controlTurnName ? '无' : item.controlTurnName}</Col>
                        <Col span={6}>{!item.controlDirName ? '无' : item.controlDirName}</Col>
                      </Row>
                    })
                    }
                  </Checkbox.Group>
                }
                {detectorSelectLists &&
                  <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'DETECTOR')} value={detectorDefaultSelectLists && detectorDefaultSelectLists.split(",").map(Number)}>
                    <Row>
                      <Col span={6}>检测器编号</Col>
                      <Col span={6}>检测器类型</Col>
                      <Col span={6}>流量采集周期</Col>
                      <Col span={6}>占有率采集周期</Col>
                    </Row>
                    {detectorSelectLists.map((item) => {
                      return <Row key={'detector' + item.detectorId}>
                        <Col span={6}>
                          <Checkbox value={item.detectorId}>{item.detectorId}</Checkbox>
                        </Col>
                        <Col span={6}>{!item.detectorTypeName ? '无' : item.detectorTypeName}</Col>
                        <Col span={6}>{!item.flowCollectionCycle ? '无' : item.flowCollectionCycle}</Col>
                        <Col span={6}>{!item.occupancyCollectionCycle ? '无' : item.occupancyCollectionCycle}</Col>
                      </Row>
                    })
                    }
                  </Checkbox.Group>
                }
              </div>
              {!selectFlag ?
                <div className={styles.popBottom}>
                  {laneSelectLists ?
                    <em onClick={() => this.btnSelectOver(true, laneDefaultSelectLists)}>确 定</em> :
                    lightSelectLists ?
                      <em onClick={() => this.btnSelectOver(true, lightDefaultSelectLists)}>确 定</em> :
                      detectorSelectLists ?
                        <em onClick={() => this.btnSelectOver(true, detectorDefaultSelectLists)}>确 定</em> :
                        phaseSelectLists ?
                          <em onClick={() => this.btnSelectOver(true, phaseDefaultSelectLists)}>确 定</em> : null
                  }
                  <em onClick={() => this.btnSelectOver(false)}>返 回</em>
                </div> : null
              }

            </div>
          </div> : null
        }
        {/* 弹层 > 添加编辑 */}
        {stepRoadAddEdit ?  // 车道配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '660px' }}>
              <div className={styles.popTit}>{popAddEditText}车道{!showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null}{!showFlag ? null : <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepRoadAddEdit", null) }} />}</div>
              {/* 车道图标层 */}
              {!showFlag && laneIconLists &&
                <div className={styles.popCon}>
                  {laneIconLists.length > 0 && laneIconLists.map((item, i) => {
                    return <img key={'icon' + i} onClick={() => this.handleSelImage('laneIconLists', 'laneShowDetail', item)} style={{ border: '1px #27343b solid', cursor: 'pointer', display: 'inline-block', margin: '8px' }} src={`${this.laneBgUrl}${item}`} />
                  })
                  }
                </div>
              }
              {showFlag && laneShowDetail &&
                <div className={classNames(styles.popCon)}>
                  <div className={styles.itemInputBox}>
                    <span>车道ID：</span><Input type='number' readOnly={popAddEditText === '编辑' ? 'readOnly' : ''} onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} id='laneId' value={laneShowDetail.laneId} onChange={e => this.handleChangeInput(e, 'state', 'laneShowDetail', 'laneId')} placeholder="请输入车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>道路ID：</span><Input value={laneShowDetail.fRid} onChange={e => this.handleChangeInput(e, 'state', 'laneShowDetail', 'fRid')} placeholder="请输入道路ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>车道号：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={laneShowDetail.laneNo} onChange={e => this.handleChangeInput(e, 'state', 'laneShowDetail', 'laneNo')} placeholder="请输入车道号" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>进出口方向：</span>
                    <Select
                      value={laneShowDetail.laneSdtypeNo ? laneShowDetail.laneSdtypeNo : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'laneShowDetail', 'laneSdtypeNo')}>
                      <Option value={0}>请选择进出口方向</Option>
                      {
                        laneSdtypeNoData.map((items, key) => {
                          return <Option key={"laneTypeNo" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>外部车道ID：</span><Input value={laneShowDetail.laneIdCust} onChange={e => this.handleChangeInput(e, 'state', 'laneShowDetail', 'laneIdCust')} placeholder="请输入外部车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>IO接口号：</span>
                    <Select
                      value={laneShowDetail.dcuIoId ? laneShowDetail.dcuIoId : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'laneShowDetail', 'dcuIoId')}>
                      <Option value={0}>请选择接口号</Option>
                      {
                        Dcu_Io_Ids.map((items, key) => {
                          return <Option key={"IoId" + items.dcuIoId} value={items.dcuIoId}>{items.dcuIoId}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>检测器编号：</span>
                    <Select
                      value={laneShowDetail.detectorId ? laneShowDetail.detectorId : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'laneShowDetail', 'detectorId')}>
                      <Option value={0}>请选择编号</Option>
                      {
                        this.props.data.detectorLists.map((items, key) => {
                          return <Option key={"detectorId" + items.detectorId} value={items.detectorId}>{items.detectorId}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>设备编号：</span><Input value={laneShowDetail.detectorDeviceId} onChange={e => this.handleChangeInput(e, 'state', 'laneShowDetail', 'detectorDeviceId')} placeholder="请输入检测器设备编号" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>角 度：</span>
                    <Select value={laneShowDetail.angle ? laneShowDetail.angle : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'laneShowDetail', 'angle')}>
                      <Option value={0}>0度</Option>
                      <Option value={45}>45度</Option>
                      <Option value={90}>90度</Option>
                      <Option value={135}>135度</Option>
                      <Option value={180}>180度</Option>
                      <Option value={225}>225度</Option>
                      <Option value={270}>270度</Option>
                      <Option value={315}>315度</Option>
                      <Option value={360}>360度</Option>
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方 向：</span>
                    <Select
                      value={laneShowDetail.fDir8No ? laneShowDetail.fDir8No : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'laneShowDetail', 'fDir8No')}>
                      <Option value={0}>请选择方向</Option>
                      {
                        fDir8NoData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span style={{ alignSelf: 'flex-start' }}>图 片：</span>
                    <div style={{ flex: 4.4 }}>
                      {!!laneShowDetail.imageUrl ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'LANE')}><img src={`${this.laneBgUrl}${laneShowDetail.imageUrl}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'LANE')} className={styles.noImage}>点击选图</div>}
                    </div>
                  </div>
                  <div className={styles.itemInputBox} style={{ alignSelf: 'flex-start' }}>
                    <span>转 向：</span>
                    <Checkbox.Group options={turnDirNoListData} value={laneShowDetail.turnDirNoList.split(",").map(Number)}
                      onChange={v => this.handleChangeCheck(v, 'state', 'laneShowDetail', 'turnDirNoList')} />
                  </div>

                </div>
              }
              {showFlag ?
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={() => { this.postUpdateAllType(laneShowDetail, 'LANE') }}>编辑确定</em> : <em onClick={() => { this.postAddAllType(laneShowDetail, 'LANE') }}>新增确定</em>
                  }
                  <em onClick={() => { this.popLayerShowHide("stepRoadAddEdit", null) }}>取 消</em>
                </div> : null
              }

            </div>
          </div> : null
        }
        {stepThreeAddEdit ?  // 灯组配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '600px' }}>
              <div className={styles.popTit}>{popAddEditText}灯组{!showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null}{!showFlag ? null : <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepThreeAddEdit", null) }} />}</div>
              {/* 灯组图标层 */}
              {!showFlag && lightIconLists &&
                <div className={styles.popCon}>
                  {lightIconLists.length > 0 && lightIconLists.map((item, i) => {
                    return <img key={'icon' + i} onClick={() => this.handleSelImage('lightIconLists', 'lightShowDetail', item)} style={{ border: '1px #27343b solid', cursor: 'pointer', display: 'inline-block', margin: '8px' }} src={`${this.lightBgUrl}${item}`} />
                  })
                  }
                </div>
              }
              {showFlag && lightShowDetail &&
                <div className={styles.popCon}>
                  <div className={styles.itemInputBox}>
                    <span>灯组序号：</span><Input id='lampgroupNo' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} readOnly={popAddEditText === '编辑' ? 'readOnly' : ''} type='number' value={lightShowDetail.lampgroupNo} onChange={e => this.handleChangeInput(e, 'state', 'lightShowDetail', 'lampgroupNo')} placeholder="请输入灯组序号" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>灯组类型：</span>
                    <Select
                      value={lightShowDetail.lampgroupType ? lightShowDetail.lampgroupType : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'lightShowDetail', 'lampgroupType')}>
                      <Option value={0}>请选择方向</Option>
                      {
                        lampgroupType.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方 向：</span>
                    <Select
                      value={lightShowDetail.controlDir ? lightShowDetail.controlDir : '0'}
                      onChange={v => this.handleChangeSel(v, 'state', 'lightShowDetail', 'controlDir')}>
                      <Option value={'0'}>请选择方向</Option>
                      {
                        controlDir.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>角 度：</span>
                    <Select value={lightShowDetail.angle ? lightShowDetail.angle : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'lightShowDetail', 'angle')}>
                      <Option value={0}>0度</Option>
                      <Option value={45}>45度</Option>
                      <Option value={90}>90度</Option>
                      <Option value={135}>135度</Option>
                      <Option value={180}>180度</Option>
                      <Option value={225}>225度</Option>
                      <Option value={270}>270度</Option>
                      <Option value={315}>315度</Option>
                      <Option value={360}>360度</Option>
                    </Select>
                  </div>
                  <div className={styles.itemInputBox} style={{ alignSelf: 'flex-start' }}>
                    <span>转 向：</span>
                    <Select
                      value={lightShowDetail.controlTurn ? lightShowDetail.controlTurn : '0'}
                      onChange={v => this.handleChangeSel(v, 'state', 'lightShowDetail', 'controlTurn')}>
                      <Option value={'0'}>请选择转向</Option>
                      {
                        controlTurn.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span style={{ alignSelf: 'flex-start' }}>图 片：</span>
                    <div style={{ flex: 4.4 }}>
                      {!!lightShowDetail.imageUrl ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'LIGHT')}><img src={`${this.lightBgUrl}${lightShowDetail.imageUrl}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'LIGHT')} className={styles.noImage}>点击选图</div>}
                    </div>
                  </div>
                </div>
              }
              {showFlag ?
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={() => { this.postUpdateAllType(lightShowDetail, 'LIGHT') }}>编辑确定</em> : <em onClick={() => { this.postAddAllType(lightShowDetail, 'LIGHT') }}>新增确定</em>
                  }
                  <em onClick={() => { this.popLayerShowHide("stepThreeAddEdit", null) }}>取 消</em>
                </div> : null
              }

            </div>
          </div> : null
        }
        {stepFourAddEdit ?  // 检测器配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '700px' }}>
              <div className={styles.popTit}>{popAddEditText}检测器{!showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null}{!showFlag ? null : <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepFourAddEdit", null) }} />}</div>
              {/* 检测器图标层 */}
              {!showFlag && detectorIconLists &&
                <div className={styles.popCon}>
                  {detectorIconLists.length > 0 && detectorIconLists.map((item, i) => {
                    return <img key={'icon' + i} onClick={() => this.handleSelImage('detectorIconLists', 'detectorShowDetail', item)} style={{ border: '1px #27343b solid', cursor: 'pointer', display: 'inline-block', margin: '8px' }} src={`${this.detectorBgUrl}${item}`} />
                  })
                  }
                </div>
              }
              {showFlag && detectorShowDetail &&
                <div className={styles.popCon}>
                  <div className={styles.itemInputBox}>
                    <span>检测器序号：</span><Input id='detectorId' type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={detectorShowDetail.detectorId} onChange={e => this.handleChangeInput(e, 'state', 'detectorShowDetail', 'detectorId')} placeholder="请输入检测器序号" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>流量周期：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={detectorShowDetail.flowCollectionCycle} onChange={e => this.handleChangeInput(e, 'state', 'detectorShowDetail', 'flowCollectionCycle')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>占有率周期：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={detectorShowDetail.occupancyCollectionCycle} onChange={e => this.handleChangeInput(e, 'state', 'detectorShowDetail', 'occupancyCollectionCycle')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>检测器类型：</span>
                    <Select
                      value={detectorShowDetail.detectorType ? detectorShowDetail.detectorType : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'detectorShowDetail', 'detectorType')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        detectorType.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span style={{ alignSelf: 'flex-start' }}>图 片：</span>
                    <div style={{ flex: 4.4 }}>
                      {!!detectorShowDetail.imageUrl ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'DETECTOR')}><img src={`${this.detectorBgUrl}${detectorShowDetail.imageUrl}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'DETECTOR')} className={styles.noImage}>点击选图</div>}
                    </div>
                  </div>
                </div>
              }
              {showFlag ?
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={() => { this.postUpdateAllType(detectorShowDetail, 'DETECTOR') }}>编辑确定</em> : <em onClick={() => { this.postAddAllType(detectorShowDetail, 'DETECTOR') }}>新增确定</em>
                  }
                  <em onClick={() => { this.popLayerShowHide("stepFourAddEdit", null) }}>取 消</em>
                </div> : null
              }
            </div>
          </div> : null
        }
        {selectFlag && stepFiveAddEdit ?  // 相位配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}相位<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepFiveAddEdit", null) }} /></div>
              {phaseShowDetail &&
                <div className={classNames(styles.popCon, styles.popConTurn)}>
                  <div className={styles.itemInputBox}>
                    <span>相位序号：</span><Input id='phaseNo' type='number' value={phaseShowDetail.phaseNo} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'phaseNo')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位名称：</span><Input value={phaseShowDetail.phaseName} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'phaseName')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位禁止：</span>
                    <Select
                      value={phaseShowDetail.phaseForbiden ? phaseShowDetail.phaseForbiden : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'phaseForbiden')}>
                      {
                        phaseForbidenData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位屏蔽：</span>
                    <Select
                      value={phaseShowDetail.phaseShield ? phaseShowDetail.phaseShield : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'phaseShield')}>
                      {
                        phaseShieldData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位的需求：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'DETECTOR', 'phaseShowDetail', 'phaseDemand',)} className={styles.editItem}><b>{!phaseShowDetail.phaseDemand ? "请点击进行编辑" : phaseShowDetail.phaseDemand}</b><em>编辑</em></div>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位包含灯组：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'LIGHT', 'phaseShowDetail', 'phaseLampgroupId')} className={styles.editItem}><b>{!phaseShowDetail.phaseLampgroupId ? "请点击进行编辑" : phaseShowDetail.phaseLampgroupId}</b><em>编辑</em></div>
                  </div>
                  <div className={styles.itemInputBox} style={{ alignSelf: 'flex-start' }}>
                    <span>相位中包含车道：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'LANE', 'phaseShowDetail', 'laneIds')} className={styles.editItem}><b>{!phaseShowDetail.laneIds ? "请点击进行编辑" : phaseShowDetail.laneIds}</b><em>编辑</em></div>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位延迟绿时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.phaseDelaygreenTime} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'phaseDelaygreenTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位最小绿时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} id="phaseMingreenTime" value={phaseShowDetail.phaseMingreenTime} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'phaseMingreenTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位最大绿时间1：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.phaseMaxgreen1Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'phaseMaxgreen1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位最大绿时间2：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.phaseMaxgreen2Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'phaseMaxgreen2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayAccessLamp1Type ? phaseShowDetail.rightofwayAccessLamp1Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayAccessLamp1Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色1时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayAccessLamp1Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayAccessLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayAccessLamp2Type ? phaseShowDetail.rightofwayAccessLamp2Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayAccessLamp2Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色2时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayAccessLamp2Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayAccessLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayAccessLamp3Type ? phaseShowDetail.rightofwayAccessLamp3Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayAccessLamp3Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色3时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayAccessLamp3Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayAccessLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayLoseLamp1Type ? phaseShowDetail.rightofwayLoseLamp1Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayLoseLamp1Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色1时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayLoseLamp1Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayLoseLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayLoseLamp2Type ? phaseShowDetail.rightofwayLoseLamp2Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayLoseLamp2Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色2时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayLoseLamp2Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayLoseLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayLoseLamp3Type ? phaseShowDetail.rightofwayLoseLamp3Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayLoseLamp3Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色3时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayLoseLamp3Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayLoseLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupAccessLamp1Type ? phaseShowDetail.rightofwayStartingupAccessLamp1Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp1Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色1时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayStartingupAccessLamp1Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupAccessLamp2Type ? phaseShowDetail.rightofwayStartingupAccessLamp2Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp2Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色2时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayStartingupAccessLamp2Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupAccessLamp3Type ? phaseShowDetail.rightofwayStartingupAccessLamp3Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp3Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色3时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayStartingupAccessLamp3Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupLoseLamp1Type ? phaseShowDetail.rightofwayStartingupLoseLamp1Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp1Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色1时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayStartingupLoseLamp1Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupLoseLamp2Type ? phaseShowDetail.rightofwayStartingupLoseLamp2Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp2Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色2时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayStartingupLoseLamp2Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupLoseLamp3Type ? phaseShowDetail.rightofwayStartingupLoseLamp3Type : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp3Type')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色3时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={phaseShowDetail.rightofwayStartingupLoseLamp3Time} onChange={e => this.handleChangeInput(e, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp3Time')} placeholder="请输入" />
                  </div>
                </div>
              }
              <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={() => { this.postAddUpdateItem(phaseShowDetail, 'PHASE') }}>编辑确定</em> : <em onClick={() => { this.postAddUpdateItem(phaseShowDetail, 'PHASE', true) }}>新增确定</em>
                }
                <em onClick={() => { this.popLayerShowHide("stepFiveAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {selectFlag && stepSixAddEdit ?  // 阶段配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}阶段的相位{!showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null}{!showFlag ? null : <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepSixAddEdit", null) }} />}</div>
              {/* 阶段相位图标层 */}
              {!showFlag && phaseIconLists &&
                <div className={styles.popCon}>
                  {phaseIconLists.length > 0 && phaseIconLists.map((item, i) => {
                    return <img key={'icon' + i} onClick={() => this.handleSelImage('phaseIconLists', 'stageShowDetail', item)} style={{ border: '1px #27343b solid', cursor: 'pointer', width: '60px', height: '60px', display: 'inline-block', margin: '8px' }} src={`${this.phaseBgUrl}${item}`} />
                  })
                  }
                </div>
              }
              {showFlag && stageShowDetail &&
                <div className={classNames(styles.popCon, styles.popConTurn)}>
                  <div className={styles.itemInputBox}>
                    <span>阶段编号：</span><Input id='phasestageNo' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} type='number' value={stageShowDetail.phasestageNo} onChange={e => this.handleChangeInput(e, 'state', 'stageShowDetail', 'phasestageNo')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>阶段名称：</span><Input value={stageShowDetail.phasestageName} onChange={e => this.handleChangeInput(e, 'state', 'stageShowDetail', 'phasestageName')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>阶段中相位晚启动的时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={stageShowDetail.lateStartTime} onChange={e => this.handleChangeInput(e, 'state', 'stageShowDetail', 'lateStartTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>阶段中相位早结束的时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={stageShowDetail.leftingEndTime} onChange={e => this.handleChangeInput(e, 'state', 'stageShowDetail', 'leftingEndTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>阶段中包含相位：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'PHASE', 'stageShowDetail', 'phasestagePhase')} className={styles.editItem}><b>{!stageShowDetail.phasestagePhase ? "请点击进行编辑" : stageShowDetail.phasestagePhase}</b><em>编辑</em></div>
                    {/* <Input value={stageShowDetail.phasestagePhase} onChange={e => this.handleChangeInput(e,'state','stageShowDetail','phasestagePhase')} placeholder="请输入" /> */}
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位阶段软件需求：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'DETECTOR', 'stageShowDetail', 'softwareRequirement')} className={styles.editItem}><b>{!stageShowDetail.softwareRequirement ? "请点击进行编辑" : stageShowDetail.softwareRequirement}</b><em>编辑</em></div>
                  </div>
                  {/* <div className={styles.itemInputBox} style={{ alignSelf: 'flex-start' }}>
                    <span>阶段中包含车道：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'LANE', 'stageShowDetail', 'phasestageLane')} className={styles.editItem}><b>{!stageShowDetail.phasestageLane ? "请点击进行编辑" : stageShowDetail.phasestageLane}</b><em>编辑</em></div>
                  </div> */}
                  {/* <div className={styles.itemInputBox}>
                  <span>相位阶段禁止标志：</span>
                    <Select
                      value={stageShowDetail.phasestageForbiden ? stageShowDetail.phasestageForbiden : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'stageShowDetail', 'phasestageForbiden') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        phaseForbidenData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                </div>
                <div className={styles.itemInputBox} style={{alignSelf: 'flex-start'}}>
                  <span>相位阶段屏蔽标志：</span>
                  <Select
                      value={stageShowDetail.phasestageShield ? phaseShowDetail.phasestageShield : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'phasestageShield') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        phaseShieldData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                </div> */}
                  <div className={styles.itemInputBox}>
                    <span style={{ alignSelf: 'flex-start' }}>图 片：</span>
                    <div style={{ flex: 2.25 }}>
                      {!!stageShowDetail.imagePath ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'PHASE')}><img src={`${this.phaseBgUrl}${stageShowDetail.imagePath}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'PHASE')} className={styles.noImage}>点击选图</div>}
                    </div>
                  </div>
                </div>
              }
              {showFlag ?
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={() => { this.postAddUpdateItem(stageShowDetail, 'STAGE') }}>编辑确定</em> : <em onClick={() => { this.postAddUpdateItem(stageShowDetail, 'STAGE', true) }}>新增确定</em>
                  }
                  <em onClick={() => { this.popLayerShowHide("stepSixAddEdit", null) }}>取 消</em>
                </div> : null
              }
            </div>
          </div> : null
        }
        {stepSevenAddEdit ?  // 配时方案配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '720px' }}>
              <div className={styles.popTit}>{popAddEditText}配时方案{!showFlag ? "- 选择阶段" : null}{!showFlag ? <Icon className={styles.Close} type="close" onClick={this.stageIdCancel} /> : <Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepSevenAddEdit", null) }} />}</div>
              {/* 选择阶段层 */}
              {!showFlag && this.props.data.stageLists &&
                <div className={styles.popCon}>
                  <Radio.Group onChange={e => this.handleChangeRadio(e)}>
                    {this.props.data.stageLists.length > 0 && this.props.data.stageLists.map((item, i) => {
                      return <Radio key={'radio' + i} value={item.phasestageNo} onClick={e => this.handleClickRadio(item)}>{item.phasestageName} <img style={{ width: '30px', height: '30px' }} src={`${this.phaseBgUrl}${item.imagePath}`} /></Radio>
                    })
                    }
                  </Radio.Group>
                </div>
              }
              {showFlag && planShowDetail &&
                <div className={classNames(styles.popCon, styles.popConTurn)} style={{ padding: '15px 50px 15px 0' }}>
                  <div className={styles.itemInputBox}>
                    <span>方案编号：</span><Input id='schemeNo' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} type='number' value={planShowDetail.schemeNo} onChange={e => this.handleChangeInput(e, 'state', 'planShowDetail', 'schemeNo')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方案名称：</span><Input value={planShowDetail.schemeName} onChange={e => this.handleChangeInput(e, 'state', 'planShowDetail', 'schemeName')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方案协调序号：</span>
                    <Select
                      value={planShowDetail.schemeCoordinationNo ? planShowDetail.schemeCoordinationNo : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'planShowDetail', 'schemeCoordinationNo')}>
                      <Option value={0}>请选择阶段</Option>
                      {
                        this.props.data.stageLists.map((items, key) => {
                          return <Option key={"IdList" + items.phasestageNo} value={items.phasestageNo}>{items.phasestageName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方案周期：</span><Input readOnly='readOnly' style={{ cursor: 'no-drop' }} type='number' value={planShowDetail.schemeCycle} onChange={e => this.handleChangeInput(e, 'state', 'planShowDetail', 'schemeCycle')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方案相位差时间：</span><Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={planShowDetail.schemePhaseDiferenceTime} onChange={e => this.handleChangeInput(e, 'state', 'planShowDetail', 'schemePhaseDiferenceTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方案相位阶段出现类型：</span>
                    <Select
                      value={planShowDetail.schemePhasestageType ? planShowDetail.schemePhasestageType : 0}
                      onChange={v => this.handleChangeSel(v, 'state', 'planShowDetail', 'schemePhasestageType')}>
                      <Option value={0}>请选择类型</Option>
                      {
                        schemePhasestageTypeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox} style={{ width: '100%', alignSelf: 'flex-start' }}>
                    <span style={{ alignSelf: 'flex-start' }}>方案相位阶段链：</span>
                    <div className={styles.phaseStageBox}>
                      <div className={styles.phaseStageIdBox}>
                        {planStageLists &&
                          planStageLists.map((item, i) => {
                            return <div key={'phaseStage' + i} className={styles.imageName}>
                              <span title={`${item.phasestageNo} - ${item.phasestageName}`} className={styles.IdName}><em />{`${item.phasestageNo} - ${item.phasestageName}`}：</span>
                              <Input type='number' onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()} value={Number(item.phaseTimeIndex)} onChange={e => this.handleChangeInput(e, 'state', 'planStageLists', 'phaseTimeIndex', i)} onBlur={e => this.getCheckPhaseTime(e, roadInterId, item.phasestageNo, i)} placeholder="请输入" />
                              <img src={`${this.phaseBgUrl}${item.imagePath}`} />
                            </div>
                          })
                        }
                      </div>
                      <div className={styles.addReduceBtn}>
                        <s>
                          <Icon type="plus" onClick={this.addStagePlan} />
                          <Icon type="minus" onClick={this.reduceStagePlan} />
                        </s>
                      </div>
                    </div>

                  </div>
                </div>
              }
              {showFlag ?
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={() => { this.postAddUpdateItem(planShowDetail, 'PLAN') }}>编辑确定</em> : <em onClick={() => { this.postAddUpdateItem(planShowDetail, 'PLAN', true) }}>新增确定</em>
                  }
                  <em onClick={() => { this.popLayerShowHide("stepSevenAddEdit", null) }}>取 消</em>
                </div> :
                <div className={styles.popBottom}>
                  <em onClick={e => { this.stageIdRight(e, 'state', 'planShowDetail', 'schemePhasestageChains') }}>确 定</em>
                  <em onClick={this.stageIdCancel}>取 消</em>
                </div>
              }
            </div>
          </div> : null
        }
        {stepEightAddEdit ?  // 日计划配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '910px' }}>
              <div className={styles.popTit}>{popAddEditText}日计划<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepEightAddEdit", null) }} /></div>
              {dayplanShowDetail &&
                <div className={classNames(styles.popCon, styles.popConTurn)} style={{ padding: '15px 50px 15px 0' }}>
                  <div className={styles.itemInputBox}>
                    <span>日计划编号：</span><Input id='dailyplanNo' type='number' value={dayplanShowDetail.dailyplanNo} onChange={e => this.handleChangeInput(e, 'state', 'dayplanShowDetail', 'dailyplanNo')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox} style={{ width: '100%', alignSelf: 'flex-start' }}>
                    <span style={{ alignSelf: 'flex-start' }}>开始时间方案模式链：</span>
                    <div className={styles.phaseStageBox}>
                      <div className={styles.phaseStageIdBox}>
                        {dayplanShowDetail.timeintervalList &&
                          dayplanShowDetail.timeintervalList.map((item, i) => {
                            return <div key={'dayPlan' + i} className={styles.timeThreeBox}>

                              <span>开始时间：</span>
                              <TimePicker disabled={i === 0 ? 'disabled' : ''} key={item.timeintervalStarttime} defaultValue={moment(item.timeintervalStarttime, format)} format={format} allowClear={false} onChange={(v, time) => this.handleChangeTime(v, time, 'state', 'dayplanShowDetail', 'timeintervalList', i, 'timeintervalStarttime')} />
                              <span>运行方案：</span><Select
                                value={Number(item.timeintervalScheme) ? Number(item.timeintervalScheme) : 0}
                                onChange={v => this.handleChangeSel(v, 'state', 'dayplanShowDetail', 'timeintervalList', i, 'timeintervalScheme')}>
                                <Option value={0}>请选择方案号</Option>
                                {
                                  this.props.data.planLists.map((items, key) => {
                                    return <Option key={"planList" + items.schemeNo} value={items.schemeNo}>{items.schemeName}</Option>
                                  })
                                }
                              </Select>
                              <span>运行模式：</span><Select
                                value={Number(item.timeintervalModel) ? Number(item.timeintervalModel) : 0}
                                onChange={v => this.handleChangeSel(v, 'state', 'dayplanShowDetail', 'timeintervalList', i, 'timeintervalModel')}>
                                <Option value={0}>请选择模式</Option>
                                {
                                  timeintervalModelChainData.map((items, key) => {
                                    return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                                  })
                                }
                              </Select>
                            </div>
                          })
                        }
                      </div>
                      <div className={styles.addReduceBtn}>
                        <s>
                          <Icon type="plus" onClick={this.addDayPlan} />
                          <Icon type="minus" onClick={this.reduceDayPlan} />
                        </s>
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={() => { this.postAddUpdateItem(dayplanShowDetail, 'DAYPLAN') }}>编辑确定</em> : <em onClick={() => { this.postAddUpdateItem(dayplanShowDetail, 'DAYPLAN', true) }}>新增确定</em>
                }
                <em onClick={() => { this.popLayerShowHide("stepEightAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepNineAddEdit ?  // 调度配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox} style={{ width: '810px' }}>
              <div className={styles.popTit}>{popAddEditText}调度<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepNineAddEdit", null) }} /></div>
              {dispatchShowDetail &&
                <div className={classNames(styles.popCon, styles.popConTurn)} style={{ padding: '15px 50px 15px 0' }}>
                  <div className={styles.itemInputBox}>
                    <span>调度方案编号：</span><Input id='scheduleNo' type='number' value={dispatchShowDetail.scheduleNo} onChange={e => this.handleChangeInput(e, 'state', 'dispatchShowDetail', 'scheduleNo')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox} style={{ width: '100%', alignSelf: 'flex-start' }}>
                    <span style={{ alignSelf: 'flex-start' }}>调度方案项：</span>
                    <div className={styles.phaseStageBox}>
                      <div className={styles.phaseStageIdBox} style={{ maxHeight: '220px' }}>
                        {dispatchShowDetail.scheduleDetailList &&
                          dispatchShowDetail.scheduleDetailList.map((item, i) => {
                            return <div key={'dispatch' + i} className={styles.dispatchBox} style={item.dateType === 0 ? { height: '40px' } : item.dateType === 2 ? { height: '80px' } : null}>
                              <span>日计划：</span>
                              <Select
                                value={Number(item.dailyPlanId) ? Number(item.dailyPlanId) : 0}
                                onChange={v => this.handleChangeSel(v, 'state', 'dispatchShowDetail', 'scheduleDetailList', i, 'dailyPlanId')}>
                                <Option value={0}>请选择编号</Option>
                                {
                                  this.props.data.dayPlanLists.map((items, key) => {
                                    return <Option key={"dailyplan" + items.dailyplanNo} value={items.dailyplanNo}>{items.dailyplanNo}</Option>
                                  })
                                }
                              </Select>
                              <span>优先级：</span>
                              <Select
                                value={Number(item.priority) ? Number(item.priority) : 0}
                                onChange={v => this.handleChangeSel(v, 'state', 'dispatchShowDetail', 'scheduleDetailList', i, 'priority')}>
                                <Option value={0}>请选择优先级</Option>
                                {
                                  priorityData.map((items) => {
                                    return <Option key={"priority" + items} value={items}>{items}</Option>
                                  })
                                }
                              </Select>
                              <span>调度类型：</span>
                              <Select
                                value={Number(item.dateType) ? Number(item.dateType) : 0}
                                onChange={v => this.handleChangeSel(v, 'state', 'dispatchShowDetail', 'scheduleDetailList', i, 'dateType')}>
                                <Option value={0}>请选择类型</Option>
                                {
                                  [1, 2].map((items, key) => {
                                    return <Option key={"dailyType" + items} value={items}>{items === 1 ? "日期" : items === 2 ? "星期" : "请选择类型"}</Option>
                                  })
                                }
                              </Select>
                              {item.dateType === 1 ?
                                <div>
                                  <div className={styles.dateDisBox} style={{ height: '40px' }}>
                                    <span className={styles.spanWidth} style={{ alignSelf: 'flex-start' }}>月：</span>
                                    <Checkbox.Group options={monthData} value={item.monthValueCodes.split(",").map(Number)}
                                      onChange={v => this.handleChangeCheck(v, 'state', 'dispatchShowDetail', 'scheduleDetailList', i, 'monthValueCodes')} />
                                  </div>
                                  <div className={styles.dateDisBox}>
                                    <span className={styles.spanWidth} style={{ alignSelf: 'flex-start' }}>日：</span>
                                    <Checkbox.Group options={dayData} value={item.dataValueCodes.split(",").map(Number)}
                                      onChange={v => this.handleChangeCheck(v, 'state', 'dispatchShowDetail', 'scheduleDetailList', i, 'dataValueCodes')} />
                                  </div>
                                </div> :
                                item.dateType === 2 ?
                                  <div className={styles.dateDisBox}>
                                    <span className={styles.spanWidth} style={{ alignSelf: 'flex-start' }}>星期：</span>
                                    <Checkbox.Group options={weekData} value={item.dataValueCodes.split(",").map(Number)}
                                      onChange={v => this.handleChangeCheck(v, 'state', 'dispatchShowDetail', 'scheduleDetailList', i, 'dataValueCodes')} />
                                  </div> : null
                              }

                            </div>
                          })
                        }
                      </div>
                      {/* <div className={styles.addReduceBtn}>
                        <s>
                          <Icon type="plus" onClick={this.addDispatch} />
                          <Icon type="minus" onClick={this.reduceDispatch} />
                        </s>
                      </div> */}
                    </div>
                  </div>
                </div>
              }
              <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={() => { this.postAddUpdateItem(dispatchShowDetail, 'DISPATCH') }}>编辑确定</em> : <em onClick={() => { this.postAddUpdateItem(dispatchShowDetail, 'DISPATCH', true) }}>新增确定</em>
                }
                <em onClick={() => { this.popLayerShowHide("stepNineAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {/* step 步骤 content 显示层 */}
        {stepTwoFlag || stepRoadFlag || stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              {/* 时间轴 */}
              {stepSevenFlag && timePlanFlag ?
                <div className={styles.timeWarpper}>
                  <div id="timeBox" className={styles.timeBox}>
                    <div style={{ color: '#1890ff', fontSize: '18px' }}>暂无信号灯</div>
                  </div>
                  <div className={styles.cycleLengthBox}>{'周期：' + nowCycleLength + ' / ' + cycleLength + ' s'}</div>
                </div> : null
              }
              <div className={styles.leftItemCon} style={interRoadBg !== '' ? { background: `url(${interRoadBg}) center center / 100% 100% no-repeat` } : {}}>
                {/* 左侧基础信息回显 */}
                {stepTwoFlag && userLimit ? <div className={styles.turnBgBtn} onClick={() => { this.popLayerShowHide("baseMapFlag", true) }}>路口底图</div> : null}
                {baseMapFlag ?
                  <BasicInfoLeft {...this.props}
                    popLayerShowHide={this.popLayerShowHide}
                    handleClickBaseMap={this.handleClickBaseMap}
                    handleChangeBaseMap={this.handleChangeBaseMap}
                    handleUpdateImageUrl={this.handleUpdateImageUrl}
                    imageUrl={imageUrl}
                    baseLoading={baseLoading}
                    roadId={roadId}
                    bgIpUrl={this.bgIpUrl}
                  /> : null
                }
                {/* 左侧车道回显 */}
                {stepRoadFlag ?
                  <LaneConfigLeft  {...this.props}
                    popLayerShowHide={this.popLayerShowHide}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    isClick={stepRoadFlag}
                    isMoveFlag={stepRoadFlag}
                  /> : null
                }
                {/* 左侧灯组回显 */}
                {stepThreeFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                  </div> : null
                }
                {/* 左侧检测器回显 */}
                {stepFourFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                    <DetectorConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepFourFlag}
                      isMoveFlag={stepFourFlag}
                    />
                  </div> : null
                }
                {/* 左侧相位回显 */}
                {stepFiveFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                    <DetectorConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepFourFlag}
                      isMoveFlag={stepFourFlag}
                    />
                  </div> : null
                }
                {/* 左侧阶段回显 */}
                {stepSixFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                    <DetectorConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepFourFlag}
                      isMoveFlag={stepFourFlag}
                    />
                  </div> : null
                }
                {/* 左侧配时方案回显 */}
                {stepSevenFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                    <DetectorConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepFourFlag}
                      isMoveFlag={stepFourFlag}
                    />
                  </div> : null
                }
                {/* 左侧日计划回显 */}
                {stepEightFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                    <DetectorConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepFourFlag}
                      isMoveFlag={stepFourFlag}
                    />
                  </div> : null
                }
                {/* 左侧调度回显 */}
                {stepNineFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepRoadFlag}
                      isMoveFlag={stepRoadFlag}
                    />
                    <LightConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepThreeFlag}
                      isMoveFlag={stepThreeFlag}
                      lightSelectIds={lightSelectIds}
                      typeUrl={lightStatus === 5 ? "lampgroup5" : lightStatus === 8 ? "lampgroup8" : "lampgroup2"}
                    />
                    <DetectorConfigLeft {...this.props}
                      popLayerShowHide={this.popLayerShowHide}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      isClick={stepFourFlag}
                      isMoveFlag={stepFourFlag}
                    />
                  </div> : null
                }
              </div>
            </div>
            <div className={styles.stepRightCon}>
              {
                stepTwoFlag ?
                  <BasicInfoRight popLayerShowHide={this.popLayerShowHide} /> :
                  stepRoadFlag ?
                    <LaneConfigRight
                      roadId={roadId}
                      roadInterId={roadInterId}
                      roadNodeNo={roadNodeNo}
                      tagToPicMark={this.tagToPicMark}
                      popLayerShowHide={this.popLayerShowHide}
                      getUpdateAllTypes={this.getUpdateAllTypes}
                    /> :
                    stepThreeFlag ?
                      <LightConfigRight
                        roadId={roadId}
                        roadInterId={roadInterId}
                        roadNodeNo={roadNodeNo}
                        tagToPicMark={this.tagToPicMark}
                        popLayerShowHide={this.popLayerShowHide}
                        getUpdateAllTypes={this.getUpdateAllTypes}
                      /> :
                      stepFourFlag ?
                        <DetectorConfigRight
                          roadId={roadId}
                          roadInterId={roadInterId}
                          roadNodeNo={roadNodeNo}
                          tagToPicMark={this.tagToPicMark}
                          popLayerShowHide={this.popLayerShowHide}
                          getUpdateAllTypes={this.getUpdateAllTypes}
                        /> :
                        stepFiveFlag ?
                          <PhaseConfigRight
                            roadId={roadId}
                            roadInterId={roadInterId}
                            roadNodeNo={roadNodeNo}
                            popLayerShowHide={this.popLayerShowHide}
                            updateListItem={this.updateListItem}
                          /> :
                          stepSixFlag ?
                            <StageConfigRight
                              roadId={roadId}
                              roadInterId={roadInterId}
                              roadNodeNo={roadNodeNo}
                              popLayerShowHide={this.popLayerShowHide}
                              updateListItem={this.updateListItem}
                            /> :
                            stepSevenFlag ?
                              <PlanConfigRight
                                roadId={roadId}
                                roadInterId={roadInterId}
                                roadNodeNo={roadNodeNo}
                                popLayerShowHide={this.popLayerShowHide}
                                updateListItem={this.updateListItem}
                                handleClickFind={this.handleClickFind}
                              /> :
                              stepEightFlag ?
                                <DayPlanConfigRight
                                  roadId={roadId}
                                  roadInterId={roadInterId}
                                  roadNodeNo={roadNodeNo}
                                  popLayerShowHide={this.popLayerShowHide}
                                  updateListItem={this.updateListItem}
                                  handleLineClick={this.handleLineClick}
                                /> :
                                stepNineFlag ?
                                  <DispatchConfigRight
                                    roadId={roadId}
                                    roadInterId={roadInterId}
                                    roadNodeNo={roadNodeNo}
                                    popLayerShowHide={this.popLayerShowHide}
                                    updateListItem={this.updateListItem}
                                    handleLineClick={this.handleLineClick}
                                  /> : null}
            </div>
          </div> : null
        }
        {turnTab ?
          <InterworkingList showInterworkingList={this.showInterworkingList} getresetPwd={this.getresetPwd} /> : null
        }
        {/* step 导示 */}
        <StepNavMenu {...this.props}
          stepOneText={stepOneText}
          stepOneFlag={stepOneFlag}
          stepRoadFlag={stepRoadFlag}
          stepTwoFlag={stepTwoFlag}
          stepThreeFlag={stepThreeFlag}
          stepFourFlag={stepFourFlag}
          stepFiveFlag={stepFiveFlag}
          stepSixFlag={stepSixFlag}
          stepSevenFlag={stepSevenFlag}
          stepEightFlag={stepEightFlag}
          stepNineFlag={stepNineFlag}
          loadDataType={this.loadDataType}
          editDataType={this.editDataType}
          showHidePop={this.showHidePop} stepStatusData={stepStatusData} />
        <div className={styles.Interwork_left}>
          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              onClick={this.handleSearchInterFocus}
              onChange={this.handleSearchInputChange}
              type="text"
              placeholder="关键词搜索"
              ref={(input) => { this.searchInputBox = input }}
              style={{ width: '100%' }}
              id='searchBox'
            />
            <Icon className={styles.searchIcon} type="search" onClick={this.searchBtnSelect} />
          </div>
          <div className={styles.interList} style={{ maxHeight: `${interListHeight}px`, overflowY: 'auto' }}>
            <div>
              {
                searchInterList &&
                searchInterList.map(item => (
                  <div className={styles.interItem}
                    key={item.id}
                    onClick={e => this.hanleSelectInter(e, item)}
                  >{item.interName}
                  </div>
                ))
              }
            </div>
          </div>
          <div className={styles.InterworkLeft_Title}>
            <span />DCU点位列表（ <em style={{ fontSize: '20px', color: 'orange' }}>{this.countOnNum}</em> <b style={{ margin: '0 3px' }}>/</b> <em>{this.countAllNum}</em> ）
          </div>
          <CustomTree
            {...this.props}
            oLMapFlag={oLMapFlag}
            getSelectTreeId={this.getSelectTreeId}
            getSelectChildId={!oLMapFlag ? this.getSelectChildId : this.getSelectChildIdOlMap}
            visibleShowLeft={this.visibleShowLeft}
          />
        </div>
        <div className={styles.mapContent}>
          <div className={styles.tagMarker}>
            <div className={styles.statusBox}>
              <span className={styles.tagOnLine}>在线设备{onlineNum}处</span>
              <span className={styles.tagOffLine}>离线设备{offlineNum}处</span>
              <span className={styles.tagYellLine}>手动离线{handOffline}处</span>
            </div>
            <div title="切换视图" className={styles.turnBtn} onClick={() => this.showInterworkingList(true)} />
          </div>
          <div style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', display: 'none' }} id='mapContent' />
          <div style={{ width: '100%', height: '100%' }}>
            {this.state.mapPointsData && <OLMapLayers pointDatas={this.state.mapPointsData} oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildIdOlMap} centerPoint={[102.829999, 24.894869]} urlXYZ="39.100.128.220:8080/YunNan/KunMing" />}
            {/* // { this.state.mapPointsData && <OLMapLayers pointDatas={this.state.mapPointsData} oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildIdOlMap} centerPoint={[102.829999, 24.894869]} urlXYZ="http://192.168.1.123:30001/YunNan/KunMing" /> } */}
            {/* { this.state.mapPointsData && <OLMapLayers pointDatas={this.state.mapPointsData} oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildIdOlMap} centerPoint={[102.708543, 25.044168187863253]} urlXYZ="http://53.101.224.151/YunNan/KunMing" /> } */}
          </div>
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
    getSystemCodeType: bindActionCreators(getSystemCodeType, dispatch),
    getStepStatus: bindActionCreators(getStepStatus, dispatch),
    getPicListsType: bindActionCreators(getPicListsType, dispatch),
    getInfoListsType: bindActionCreators(getInfoListsType, dispatch),
    getInfoListsTypeMore: bindActionCreators(getInfoListsTypeMore, dispatch),
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
    checkUnitTree: bindActionCreators(checkUnitTree, dispatch),
    postBgBySelect: bindActionCreators(postBgBySelect, dispatch),
    postBgByUpload: bindActionCreators(postBgByUpload, dispatch),
    postAddAllType: bindActionCreators(postAddAllType, dispatch), // 添加图标和列表
    postUpdateAllType: bindActionCreators(postUpdateAllType, dispatch),// 双击图标  修改图标和列表一条
    postAddOthersType: bindActionCreators(postAddOthersType, dispatch), // 添加
    postUpdateOthersType: bindActionCreators(postUpdateOthersType, dispatch), // 修改列表中的某一条用于list插件
    getIconImageList: bindActionCreators(getIconImageList, dispatch), // 回显图标
    getUpdateAllType: bindActionCreators(getUpdateAllType, dispatch), // 修改列表中的某一条 
    getSelectLists: bindActionCreators(getSelectLists, dispatch), // 编辑车道、灯组、检测器的列表
    getCheckPhaseTime: bindActionCreators(getCheckPhaseTime, dispatch), // 方案相位阶段链时间的合法不
    getEditCheckData: bindActionCreators(getEditCheckData, dispatch), // 下发配置验证
    getDcuState: bindActionCreators(getDcuState, dispatch), // 验证设备是否在线
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignalManagement)