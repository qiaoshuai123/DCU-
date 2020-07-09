import React, { PureComponent } from 'react'
import { Input, Icon, Radio, Upload, Modal, message, Select, Checkbox, Row, Col } from 'antd'
import classNames from 'classnames'
import Header from '../../../components/Header/Header'
import markerIcon from '../../../images/markerGreen.png'
import markerRedIcon from '../../../images/markerRed.png'
import CustomTree from '../../../components/CustomTree/CustomTree'
import ListForAntd from '../ListForAntd/ListForAntd'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './SignalManagement.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getSystemCodeType, getMapUnitInfoList, getUnitPop, checkUnitTree } from '../../../reactRedux/actions/publicActions'
import { getStepStatus, getPicListsType, getInfoListsType, getInfoListsTypeMore, postBgBySelect, postBgByUpload, postAddOthersType, postUpdateOthersType, postAddAllType, postUpdateAllType, getIconImageList, getUpdateAllType, getSelectLists } from '../../../reactRedux/actions/signalmanagementActions'
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
import Websocket from 'react-websocket';
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
      baseMapFlag: null, //是否显示
      baseLoading: false,
      imageUrl: '',
      imageFile: null,
      imageName: '',
      interRoadBg: '',
      mapPointsData: null, // 地图中所有的点
      dcuPopData: null, // 弹层数据
      stepStatusData: null, // step数据
      roadId: null, // 路的ID
      roadInterId: null, // 路的interId
      roadNodeNo: null,
      onlineNum: 0, //实时在线数
      offlineNum: 0, //实时离线数
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
    }
    this.map = null
    this.moveFlag = false // 是否是移动状态
    this.bgIpUrl = 'http://192.168.1.213:20203/DCU/dcuImage/background/'
    this.laneBgUrl = 'http://192.168.1.213:20203/DCU/dcuImage/lane/'
    this.lightBgUrl = 'http://192.168.1.213:20203/DCU/dcuImage/lampgroup/'
    this.detectorBgUrl = 'http://192.168.1.213:20203/DCU/dcuImage/detector/'
    this.phaseBgUrl = 'http://192.168.1.213:20203/DCU/dcuImage/phasestage/'
    this.socketPointStatusUrl = 'ws://192.168.1.213:20203/DCU/websocket/dcuState/0/0/0' // 实时请求地图点的状态
    this.socketPointPopUrl = 'ws://192.168.1.213:20203/DCU/websocket/interRunState/' // 点击显示实时弹层
    this.searchInterList = []
    this.itemDetailData = null
    this.selImage = null
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuPopData, stepStatusData, basicBgLists, basicUplSuccess, dcuTreeData, codeTypeData, phaseLists,
    laneShowDetail, laneIconLists, lightShowDetail, lightIconLists, detectorShowDetail, detectorIconLists, laneSelectLists, lightSelectLists, detectorSelectLists, phaseIconLists } = this.props.data
    if (prevState.data !== this.props.data) {
      console.log(this.props,this.props.data, "data中所有的数据")
    }
    if (prevState.data.codeTypeData !== codeTypeData) {
      console.log(codeTypeData, 'codeType 数据')
    }
    if (prevState.data.dcuTreeData !== dcuTreeData) {
      if (this.state.treeFlag) {
        this.checkUnitTree()
      }
    }
    if (prevState.data.mapPointsData !== mapPointsData) {
      console.log(mapPointsData, '点数据')
      this.setState({ mapPointsData },()=>{
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
      this.setState({ lightShowDetail, showFlag: true, },()=>{
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
      this.setState({ detectorShowDetail, showFlag: true, },()=>{
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
      console.log(laneSelectLists, '车')
      this.setState({ laneSelectLists })
    }
    if (prevState.data.lightSelectLists !== lightSelectLists) {
      console.log(lightSelectLists, '灯组')
      this.setState({ lightSelectLists })
    }
    if (prevState.data.detectorSelectLists !== detectorSelectLists) {
      console.log(detectorSelectLists, '检测器')
      this.setState({ detectorSelectLists })
    }
    if (prevState.data.phaseLists !== phaseLists) {
      this.setState({ phaseSelectLists: phaseLists })
    }
  }
  componentDidMount = () => {
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        if ( e.target !== this.searchBtn ) {
          this.setState({ interListHeight: 0 })
        }
      }
      if ( this.selImage !== null && e.target !== this.selImage) {
        this.setState({ showFlag: true })
      }
      this.visibleShowLeft('', '', false)
    })
    // 初始化地图
    this.loadingMap()
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
                label: item.codeName+item.codeDes,
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
      }
    })
  }
  // 循环ID转Name
  // flag: 为true 时 Name 转ID
  cyclicComparison = (dataRes, keyName, id, resData, flag) => {
    dataRes.map((item) =>{
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
  handleChangeInput = (event, type, name, key) => {
    if (key) {
      this[type][name][key] = event.target.value
      const newObj = JSON.parse(JSON.stringify(this[type][name]))
      this.setState({ [name]: newObj })
    } else {
      this[type][name] = event.target.value
    }
  }
  // 单选按钮选择
  handleChangeRadio = (event) => {
    this.setState({ strStagePlanID: event.target.value })
  }
  // 点击单选按钮
  handleClickRadio = (item) => {
    item.phaseTimeIndex = 0
    this.setState({ strStagePlanItem: item})
  }
  // 确认单选按钮 弹层
  stageIdRight = (event, type, name, key) => {
    this[type][name].schemePhasestageChainsTime ? this[type][name].schemePhasestageChainsTime = this[type][name].schemePhasestageChainsTime + ',' + '0' : this[type][name].schemePhasestageChainsTime = '0'
    this[type][name][key] ? this[type][name][key] = this[type][name][key] + ',' + this.state.strStagePlanID :  this[type][name][key] = this.state.strStagePlanID
    const newArr = this.state.planStageLists ? JSON.parse(JSON.stringify(this.state.planStageLists)) : []
    newArr.push(this.state.strStagePlanItem)
    this.setState({ showFlag: true, planStageLists: newArr })
  }
  // 取消单选按钮 弹层
  stageIdCancel = () => {
    this.setState({ showFlag: true })
  }
  // 下拉选择值
  handleChangeSel = (value, type, name, key) => {
    if (key) {
      this[type][name][key] = value
      const newObj = JSON.parse(JSON.stringify(this[type][name]))
      this.setState({ [name]: newObj })
    } else {
      this[type][name] = value
    }
  }
  // 复选框
  handleChangeCheck = (checkValues, type, name, key) => {
    if (key) {
      this[type][name][key] = checkValues.join()
      const newObj = JSON.parse(JSON.stringify(this[type][name]))
      this.setState({ [name]: newObj })
    } else {
      this[type][name] = checkValues
    }
  }
  hanleSelectInter = (e, item) => {
    let marker
    const _this = this;
    marker = new AMap.Marker({
      position: new AMap.LngLat(item.lng, item.lat),
      offset: new AMap.Pixel(-16, -16),
      content: "<div id='roadKey" + item.interId + "'></div>",
    })
    marker.on('click', function () {
      _this.setState({
        roadUnitId: item.id,
        roadInterId: item.interId,
        roadNodeNo: item.nodeId,
      })
      const resultP = Promise.resolve(_this.props.getUnitPop(item.id))
      resultP.then(() => {
        _this.openInfoWin(_this.map, item, marker, item.interName)
      })
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
  // 获取子id, 路口id
  getSelectChildId = (childInterId) => {
    const _this = this;
    var marker, lng, lat;
    const childrenArr = this.state.treeListBackups
    childrenArr.map((data) => {
      data.units && data.units.map((item) => {
        if (childInterId === item.id) {
          lng = item.lng
          lat = item.lat
          marker = new AMap.Marker({
            position: new AMap.LngLat(item.lng, item.lat),
            offset: new AMap.Pixel(-16, -16),
            content: "<div id='roadKey"+item.id+"'></div>",
          })
          marker.on('click',function(){
            _this.setState({
              roadUnitId: item.id,
              roadInterId: item.interId,
              roadNodeNo: item.nodeId,
            })
            const resultP = Promise.resolve(_this.props.getUnitPop(childInterId))
            resultP.then(()=>{
              _this.openInfoWin(_this.map, item, marker, item.interName)
            })
          })
        }
      })
    })
    if (marker && this.map) {
      this.map.setCenter([lng, lat])
      marker.emit('click', {
        lnglat : this.map.getCenter()
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
    if ($(e.currentTarget).hasClass(styles.hover)){
      $(e.currentTarget).removeClass(styles.hover)
      $('div[pic-mark]').map(( i, item ) => {
        if (item.getAttribute('pic-mark') === idStr) {
          $(item).removeClass(styles.imgCurrent)
        }
      })
    } else {
      $(e.currentTarget).addClass(styles.hover).siblings().removeClass(styles.hover)
      $('div[pic-mark]').map(( i, item ) => {
        if (item.getAttribute('pic-mark') === idStr) {
          $(item).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
        }
      })
    }
  }
  // 更新参数
  setGetParams = params => {
    // debugger
    console.log(params, '更新名称')
    this.setState({
      stepOneText: params.interName,
      roadId: params.id,
      roadInterId: params.interId,
      roadNodeNo: params.nodeId,
      interRoadBg: !params.background ? null : this.bgIpUrl + params.background,
    }, () => {
      this.props.getStepStatus(params.id, params.nodeId)
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
          })
        }
      }
    } else {
      message.info("请选择路口！");
    }
  }
  // 显示隐藏弹层
  popLayerShowHide = (name, flag, eventType, stepType) => {
    this.setState({
      [name]: flag,
      popAddEditText: eventType ? '编辑' : '添加',
    })
    if(flag){
      debugger
      switch(stepType){
        case "LANE":
          // this.itemDetailData
           const laneShowDetail = {
            "angle": 0, //角度
            "fDir8No": 0,//方向
            "fRid": '', //道路ID
            "imageUrl": "", // 图片
            "interId": this.state.roadInterId, //当前路口interId  隐藏项
            "laneId": '',//车道ID
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
            "lampgroupNo": 0, //灯组序号
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
            "detectorId": 1, //检测器序号
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
            "phaseNo": 0, //相位序号手写
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
              "phasestageNo": 0,  //阶段编号
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
              "schemeNo": 0,   //方案号
              "schemePhaseDiferenceTime": 0,   //方案相位差时间
              "schemePhasestageChains": "",  //方案相位阶段链
              "schemePhasestageChainsTime": "",  //方案相位阶段链时间
              "schemePhasestageType": ""   //方案相位阶段出现类型
            }
          this.setState({ planShowDetail, planStageLists: null })
          break;
          case "DAYPLAN":
            const dayplanShowDetail = {
              
            }
          this.setState({ dayplanShowDetail })
          break;
          case "DISPATCH":
            const dispatchShowDetail = {
              
            }
            this.setState({ dispatchShowDetail })
          break;
      }
    }
  }
  // 编辑时回显内容 相位、阶段、配时方案、日计划、调度
  updateListItem = (itemDetailData, stepType) => {
    switch(stepType){
      case "PHASE":
        this.setState({ phaseShowDetail: itemDetailData, stepFiveAddEdit: true, popAddEditText: '编辑' }, ()=>{
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
        this.setState({ stageShowDetail: itemDetailData, stepSixAddEdit: true, showFlag: true, popAddEditText: '编辑' }, () =>{
        // this.cyclicComparison(this.state.phaseShieldData, 'phasestageShield', itemDetailData.phasestageShield, 'stageShowDetail') // 屏蔽
        // this.cyclicComparison(this.state.phaseForbidenData, 'phasestageForbiden', itemDetailData.phasestageForbiden, 'stageShowDetail') // 禁止
        itemDetailData = JSON.parse(JSON.stringify(this.state.stageShowDetail))
        this.setState({ stageShowDetail: itemDetailData })
        })
      break;
      case "PLAN":
        this.setState({ planShowDetail: JSON.parse(JSON.stringify(itemDetailData)), stepSevenAddEdit: true, showFlag: true, popAddEditText: '编辑', planStageLists: null },() => {
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
          this.setState({ planShowDetail: itemDetailData, planStageLists: newIdNameArr }, ()=>{
            console.log(this.state.showFlag, '？状成是？')
          })
        })
      break;
      case "DAYPLAN":
        this.setState({ dayplanShowDetail: JSON.parse(JSON.stringify(itemDetailData)), stepEightAddEdit: true, popAddEditText: '编辑' })
      break;
      case "DISPATCH":
        this.setState({ dispatchShowDetail: JSON.parse(JSON.stringify(itemDetailData)), stepNineAddEdit: true, popAddEditText: '编辑' })
      break;
    }
  }
  // (新增或更新) 插件相位、阶段、配时方案、日计划、调度
  postAddUpdateItem = (itemDetailData, stepType, eventType) => {
    let typeStr = '', showStr = '', detailStr = '',  _this = this
    switch(stepType){
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
        itemDetailData = JSON.parse(JSON.stringify(this.state.phaseShowDetail))
        break;
      case 'STAGE':
        typeStr = '阶段'
        showStr = 'stepSixAddEdit'
        detailStr = 'stageShowDetail'
        break;
      case 'PLAN':
        typeStr = '配时方案'
        showStr = 'stepSevenAddEdit'
        detailStr = 'planShowDetail'
        break;
      case 'DAYPLAN':
        typeStr = '日计划'
        showStr = 'stepEightAddEdit'
        detailStr = 'dayplanShowDetail'
        break;
      case 'DISPATCH':
        typeStr = '调度'
        showStr = 'stepNineAddEdit'
        detailStr = 'dispatchShowDetail'
        break;
    }
    debugger
    if (eventType) {
      this.props.postAddOthersType(itemDetailData, stepType).then(() => {
        this.popLayerShowHide(showStr, null)
        message.info(typeStr+"操作成功！")
        _this.setState({ [detailStr]: null })
        // _this.props.getStepStatus(_this.state.roadInterId, _this.state.roadNodeNo)
        if (stepType === 'PLAN' || stepType === 'DAYPLAN' || stepType === 'DISPATCH') {
          _this.props.getInfoListsTypeMore(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
        }else {
          _this.props.getInfoListsType(_this.state.roadInterId, stepType)

        }
      })
    } else {
      this.props.postUpdateOthersType(itemDetailData, stepType).then(() => {
        this.popLayerShowHide(showStr, null)
        message.info(typeStr+"操作成功！")
        _this.setState({ [detailStr]: null })
        // _this.props.getStepStatus(_this.state.roadInterId, _this.state.roadNodeNo)
        if (stepType === 'PLAN' || stepType === 'DAYPLAN' || stepType === 'DISPATCH') {
          _this.props.getInfoListsTypeMore(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
        }else {
          _this.props.getInfoListsType(_this.state.roadInterId, stepType)
        }
      })
    }
  }
// 编辑弹层列表用于多选 车道、灯组、检测器
getSelectLists = (interId, nodeNo, stepType, name, key) => {
  let typeStr = '', showStr = '', detailStr = '',  _this = this
  debugger
  switch(stepType){
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
      },()=>{
        this.props.getInfoListsType(this.state.roadInterId, 'PHASE') // 加载相位列表
      })
      break;
    }
    this.props.getSelectLists(interId, nodeNo, stepType)
}
selectItemList = (defaultSelectLists, stepType) => {
  console.log(defaultSelectLists, '选中的数据')
  switch(stepType){
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
  debugger
  if (flag) {
    if (this.state.laneSelectLists) {
      this.state.stageShowDetail.phasestageLane = defaultSelectLists
    } else if (this.state.lightSelectLists) {
      this.state.phaseShowDetail.phaseLampgroupId = defaultSelectLists
    } else if (this.state.detectorSelectLists) {
      if (this.state.phaseShowDetail && this.state.phaseShowDetail.phaseDemand !== undefined) {
        this.state.phaseShowDetail.phaseDemand = defaultSelectLists
      } else if (this.state.stageShowDetail && this.state.stageShowDetail.softwareRequirement !== undefined) {
        this.state.stageShowDetail.softwareRequirement = defaultSelectLists
      }
    } else if(this.state.phaseSelectLists){
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
  // 创建地图层
  loadingMap = () => {
    const map = new AMap.Map('mapContent', {
      resizeEnable: true, //是否监控地图容器尺寸变化
      center: [120.202633, 30.266603], //初始化地图中心点
      mapStyle: "amap://styles/f9281194c6119ea4669f1dd2e75af292",
      zoom: 11,
    })
    this.map = map
    map.on("click", function (e) {
      console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
    })
    this.createLayerGroup('pointLayers') // map中显示点的图层
    if (this.state.mapPointsData !== null) {
      this.drawMarkers(this.state.mapPointsData, 'pointLayers') // 初始化点
    }
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
        // const latlng = positions[i]
        // const latlng = positions[i].latlng
        const marker = new AMap.Marker({
          position: new AMap.LngLat(positions[i].lng, positions[i].lat),
          offset: new AMap.Pixel(-16, -16),
          content: "<div inter-id='"+positions[i].interId+"' id='roadKey"+positions[i].id+"' class='marker-online'></div>",
        })
        // marker.id =
        marker.on('click', (e) => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          
          // console.log(marker,'aaaaaaaaaaaaaaaaaaaaaaaaaa')
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='"+positions[i].interId+"' id='roadKey"+positions[i].id+"' class='marker-online'></div></div>");
          const nowZoom = map.getZoom()
          map.setZoomAndCenter(nowZoom, [positions[i].lng, positions[i].lat]); //同时设置地图层级与中心点
          this.setState({
            roadUnitId: positions[i].id,
            roadInterId: positions[i].interId,
            roadNodeNo: positions[i].nodeId,
          }, ()=>{
            const resultP = Promise.resolve(this.props.getUnitPop(positions[i].interId))
            resultP.then(()=>{
              this.openInfoWin(map, positions[i], marker, positions[i].interName)
            })
          })
          // console.log(marker.getContent(), 'ppppppppppppppppppppp')
        })
        this[layer].push(marker)
      }
      window[layer].addLayers(this[layer]) // 把点添加到层组中
      window[layer].setMap(map) // 层组渲染到地图中
    }
  }
  //在指定位置打开信息窗体
  openInfoWin = (map, dataItem, marker, name) => {
    // debugger
    console.log(this.props.data.dcuPopData, '弹层所需数据')
    var info = [];
    let itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    info.push(`<div class='content_box'>`);
    info.push(`<div class='content_box_title'><h4>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + name + `</span></p>`);
    info.push(`<p class='input-item'>信号机编号：<span>` + itemData.deviceId + `</span></p>`);
    info.push(`<p class='input-item'>信号机品牌：<span>` + itemData.brand + `</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>` + itemData.ip + `</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>` + itemData.maintainPhone + `</span></p>`);
    info.push(`<p class='input-item'>信号运行阶段：<span class='greenFont'><span id='phasestageName'>暂无</span><img id='phasestageImage' style='display:none' src='' /></span></p>`);
    info.push(`<p class='input-item'>信号运行方案：<span class='greenFont' id='schemeName'>暂无</span></p>`);
    info.push(`<p class='input-item'>信号控制方式：<span class='greenFont' id='nodeModelName'>暂无</span></p>`);
    info.push(`<p class='input-item' style='height:15px;'></p>`);
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams(`+JSON.stringify(dataItem)+`)'>参数配置</span></p>`);
    const infoWindow = new AMap.InfoWindow({
      content: info.join("")  //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map, [dataItem.lng, dataItem.lat]);
    this.infoWindow = infoWindow
    window.infoWindowClose = infoWindow
    map.on('click', (e) => {
      marker.setContent("<div inter-id='"+dataItem.interId+"' class='marker-online'></div>");
      infoWindow.close()
    })
  }
  handleChangeBaseMap = (info) => {
    // debugger
    if (info.file.status === "uploading") {
      this.setState({ baseLoading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, imageUrl =>{
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
    debugger
    if (this.state.imageFile !== null) {
      debugger
      message.info("底图设置成功！");
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide("baseMapFlag", null)
        this.props.postBgByUpload(this.state.roadId, this.state.imageFile)
      })
    } else if(!!this.state.imageUrl){
      message.info("底图设置成功！");
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide("baseMapFlag", null)
        this.props.postBgBySelect({id: this.state.roadId, background: this.state.imageName})
      })
    } else if(this.state.imageFile === null || !this.state.imageUrl) {
      message.info("请上传或选择底图!");
    }
  }
  // step 车道列表和图标添加、灯组列表和图标添加、检测器列表和图标添加
  // stepType:类型，itemDetailData:实时调用的数据
  postAddAllType = (itemDetailData, stepType) => {
    let typeStr = '', showStr = '', detailStr = '',  _this = this
    switch(stepType){
      case 'LANE':
        typeStr = '车道'
        showStr = 'stepRoadAddEdit'
        detailStr = 'laneShowDetail'
        break;
      case 'LIGHT':
        typeStr = '灯组'
        showStr = 'stepThreeAddEdit'
        detailStr = 'lightShowDetail'
        this.cyclicComparison(this.state.controlDir, 'controlDir', itemDetailData.controlDir, 'lightShowDetail', true)
        this.cyclicComparison(this.state.controlTurn, 'controlTurn', itemDetailData.controlTurn, 'lightShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.lightShowDetail))
        break;
      case 'DETECTOR':
        typeStr = '检测器'
        showStr = 'stepFourAddEdit'
        detailStr = 'detectorShowDetail'
        this.cyclicComparison(this.state.detectorType, 'detectorType', itemDetailData.detectorType, 'detectorShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.detectorShowDetail))
        break;
    }
    this.props.postAddAllType(itemDetailData, stepType).then(() => {
      this.popLayerShowHide(showStr, null)
      message.info(typeStr+"添加成功！")
      _this.setState({ [detailStr]: null })
      _this.props.getPicListsType(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
      _this.props.getInfoListsType(_this.state.roadInterId, stepType)
    })
    // console.log(itemDetailData, '添加时：看下数据是最新的不？')
  }
  // step 车道列表和图标修改、灯组列表和图标修改、检测器列表和图标修改
  // stepType:类型，itemDetailData:实时调用的数据
  postUpdateAllType = (itemDetailData, stepType) => {
    let typeStr = '', showStr = '', detailStr = '',  _this = this
    switch(stepType){
      case 'LANE':
        typeStr = '车道'
        showStr = 'stepRoadAddEdit'
        detailStr = 'laneShowDetail'
        break;
      case 'LIGHT':
        typeStr = '灯组'
        showStr = 'stepThreeAddEdit'
        detailStr = 'lightShowDetail'
        this.cyclicComparison(this.state.controlDir, 'controlDir', itemDetailData.controlDir, 'lightShowDetail', true)
        this.cyclicComparison(this.state.controlTurn, 'controlTurn', itemDetailData.controlTurn, 'lightShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.lightShowDetail))
        break;
      case 'DETECTOR':
        typeStr = '检测器'
        showStr = 'stepFourAddEdit'
        detailStr = 'detectorShowDetail'
        this.cyclicComparison(this.state.detectorType, 'detectorType', itemDetailData.detectorType, 'detectorShowDetail', true)
        itemDetailData = JSON.parse(JSON.stringify(this.state.detectorShowDetail))
        break;
    }
    this.props.postUpdateAllType(itemDetailData, stepType).then(() => {
    this.popLayerShowHide(showStr, null)
    message.info(typeStr+"修改成功！")
    _this.setState({ [detailStr]: null })
    _this.props.getPicListsType(_this.state.roadInterId, _this.state.roadNodeNo, stepType)
    _this.props.getInfoListsType(_this.state.roadInterId, stepType)
  })

  }
  // 修改 > 车道列表、灯组列表、检测器列表
  getUpdateAllTypes = (interId, roadNodeNo, Id, stepType, flag) => {
    let typeName = ''
    switch(stepType) {
      case 'LANE':
        typeName = 'stepRoadAddEdit';
        break;
      case 'LIGHT':
        typeName = 'stepThreeAddEdit';
        break;
      case 'DETECTOR':
        typeName = 'stepFourAddEdit';
        break;
    }
    if(flag){
      this.setState({
        showFlag: true,
        popAddEditText: '编辑',
        [typeName]: flag,
      },()=>{
        this.props.getUpdateAllType(interId, roadNodeNo, Id, stepType)
      })
    }
  }
  // 获取全部图标、车道、灯组
  getIconImageList = (e, stepType) => {
    debugger
    this.selImage = e.target
    this.props.getIconImageList(stepType)
    this.setState({showFlag: null})
  }
  // 图标点击
  handleSelImage = (imageList, name, imgName) => {
    this.state[name].imagePath !== undefined ? this.state[name].imagePath = imgName : this.state[name].imageUrl = imgName
    this.setState({showFlag: true, [imageList]: null})
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
      planStageLists.splice(planStageLists.length-1, 1)
      this.setState({ planStageLists })
    } else {
      message.info('请至少保留一条数据！')
    }
  }
  // stepRoadAddForList = () => {
  //   message.info("车道添加成功！")
  //   this.popLayerShowHide("stepRoadAddEdit", null)
  // }
  // step 3 灯组添加
  // stepThreeAddForList = () => {
  //   const obj = {name: 'new', left: '50%', top: '50%', width: '32px', height: '32px', src: markerIcon}
  //   const lights = JSON.parse(JSON.stringify(this.props.data.lightPicLists))
  //   lights.push(obj)
  //   this.setState({ lights })
  //   message.info("灯组添加成功！")
  //   this.popLayerShowHide("stepThreeAddEdit", null)
  // }
  // step 4 检测器添加
  // stepFourAddForList = () => {
  //   message.info("检测器添加成功！")
  //   this.popLayerShowHide("stepFourAddEdit", null)
  // }
  // step 5 相位添加
  // stepFiveAddForList = () => {
  //   message.info("相位添加成功！")
  //   this.popLayerShowHide("stepFiveAddEdit", null)
  // }
  // // step 6 阶段添加
  // stepSixAddForList = () => {
  //   message.info("阶段添加成功！")
  //   this.popLayerShowHide("stepSixAddEdit", null)
  // }
  // // step 7 配时方案添加
  // stepSevenAddForList = () => {
  //   message.info("配时方案添加成功！")
  //   this.popLayerShowHide("stepSevenAddEdit", null)
  // }
  // step 8 日计划添加
  stepEightAddForList = () => {
    message.info("日计划添加成功！")
    this.popLayerShowHide("stepEightAddEdit", null)
  }
  // step 9 调度添加
  stepNineAddForList = () => {
    message.info("调度添加成功！")
    this.popLayerShowHide("stepNineAddEdit", null)
  }
  updateMapPonitsColor = (data) => {
    for (let i = 0; i < $('div[inter-id]').length; i++){
      const timeDiv = $($('div[inter-id]')[i])
      data.map((item) => {
        if (item.interId === timeDiv.attr('inter-id') && !!item.state){
          timeDiv.removeClass('marker-offline')
        }else{
          timeDiv.addClass('marker-offline')
        }
      })
    }
  }
  handleData(data) {
    let result = JSON.parse(data);
    // console.log(result,'socket 数据')
    this.setState({
      onlineNum: result.onlineNum,
      offlineNum: result.offlineNum,
    });
    this.updateMapPonitsColor(result.dcuStateList)
  }
  handlePopData(data) {
    debugger
    let result = JSON.parse(data);
    console.log(result,this,'socket POP数据')
    $('#phasestageName').text(result.phasestageName).attr("tag-src",`${this.phaseBgUrl}${result.phasestageImage}`)
    $('#schemeName').text(result.schemeName)
    $('#nodeModelName').text(result.nodeModelName)
    $('#phasestageImage').prop('src', `${this.phaseBgUrl}${result.phasestageImage}`).attr('style','width:30px;height:30px;margin-left:8px;')
    this.setState({
      roadUnitId: false,
    })
  }
  render() {
    const { interListHeight, searchInterList, stepStatusData, popAddEditText, popAddEditName, moveFlag, stepOneFlag, stepTwoFlag, 
      stepRoadFlag, stepRoadAddEdit,
      stepThreeFlag, stepThreeAddEdit,
      stepFourFlag, stepFourAddEdit, 
      stepFiveFlag, stepFiveAddEdit,
      stepSixFlag, stepSixAddEdit,
      stepSevenFlag, stepSevenAddEdit,
      stepEightFlag, stepEightAddEdit,
      stepNineFlag, stepNineAddEdit,
      turnTab, baseMapFlag, stepOneText, imageUrl, interRoadBg, baseLoading, roadId, roadUnitId, roadInterId, roadNodeNo,
      onlineNum, offlineNum, 
      laneShowDetail, laneIconLists, fDir8NoData, turnDirNoListData, 
      lightShowDetail, lightIconLists, detectorShowDetail, detectorIconLists, showFlag,
      lampgroupType, controlDir, controlTurn, detectorType, phaseForbidenData, phaseShieldData, typeData, planStageLists,
      phaseShowDetail, stageShowDetail, planShowDetail, dayplanShowDetail, dispatchShowDetail, laneSelectLists, lightSelectLists, detectorSelectLists, selectFlag, phaseDefaultSelectLists, laneDefaultSelectLists, lightDefaultSelectLists, detectorDefaultSelectLists,  phaseIconLists, phaseSelectLists, phaseFlag, schemePhasestageTypeData
    } = this.state
    const { Search } = Input
    return (
      <div className={styles.SignalManagement}>
      <Websocket url={this.socketPointStatusUrl} onMessage={this.handleData.bind(this)}/>
      { !!roadUnitId && !!roadInterId && !!roadNodeNo ? <Websocket url={`${this.socketPointPopUrl}${roadUnitId}/${roadInterId}/${roadNodeNo}`} onMessage={ this.handlePopData.bind(this)} /> : null }
        <Header {...this.props} />
        {/* 编辑弹层列表用于多选 车道、灯组、检测器 */}
        { laneSelectLists && !selectFlag || lightSelectLists && !selectFlag || detectorSelectLists && !selectFlag  || phaseSelectLists && !selectFlag ?
          <div className={styles.maskBg}> 
            <div className={styles.popBox} style={{width: '600px'}}>
              <div className={styles.popTit}>{popAddEditText}{popAddEditName}</div>
              <div className={styles.popCon} style={{padding:'0'}}>
              { phaseFlag && phaseSelectLists &&
                <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'PHASE')} value={phaseDefaultSelectLists.split(",").map(Number)}>
                  <Row>
                    <Col span={4}>相位序号</Col>
                    <Col span={10}>相位名称</Col>
                    <Col span={10}>相位延迟绿时间</Col>
                  </Row>
                  { phaseSelectLists.map((item) =>{
                      return <Row key={'phase'+ item.phaseNo}>
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
              { laneSelectLists &&
                <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'LANE')} value={laneDefaultSelectLists.split(",").map(Number)}>
                  <Row>
                    <Col span={4}>车道号</Col>
                    <Col span={5}>道路编号</Col>
                    <Col span={5}>转向</Col>
                    <Col span={5}>通行方向描述</Col>
                    <Col span={5}>外部车道号</Col>
                  </Row>
                  { laneSelectLists.map((item) =>{
                      return <Row key={'lane'+ item.laneId}>
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
              { lightSelectLists &&
                <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'LIGHT')} value={lightDefaultSelectLists.split(",").map(Number)}>
                  <Row>
                    <Col span={6}>灯组序号</Col>
                    <Col span={6}>灯组类型</Col>
                    <Col span={6}>控制转向</Col>
                    <Col span={6}>控制方向</Col>
                  </Row>
                  { lightSelectLists.map((item) =>{
                      return <Row key={'lampgroup'+ item.lampgroupNo}>
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
              { detectorSelectLists &&
                <Checkbox.Group style={{ width: '100%' }} onChange={v => this.selectItemList(v, 'DETECTOR')} value={detectorDefaultSelectLists.split(",").map(Number)}>
                  <Row>
                    <Col span={6}>检测器编号</Col>
                    <Col span={6}>检测器类型</Col>
                    <Col span={6}>流量采集周期</Col>
                    <Col span={6}>占有率采集周期</Col>
                  </Row>
                  { detectorSelectLists.map((item) =>{
                      return <Row key={'detector'+ item.detectorId}>
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
              { !selectFlag  ? 
                <div className={styles.popBottom}>
                { laneSelectLists ? 
                  <em onClick={()=> this.btnSelectOver(true, laneDefaultSelectLists)}>确 定</em> : 
                  lightSelectLists ? 
                  <em onClick={()=> this.btnSelectOver(true, lightDefaultSelectLists)}>确 定</em> :
                  detectorSelectLists ? 
                  <em onClick={()=> this.btnSelectOver(true, detectorDefaultSelectLists)}>确 定</em> :
                  phaseSelectLists ?
                  <em onClick={()=> this.btnSelectOver(true, phaseDefaultSelectLists)}>确 定</em> : null
                }
                <em onClick={()=> this.btnSelectOver(false)}>返 回</em>
              </div> : null
              }
              
            </div>
        </div> : null
        }              
        {/* 弹层 > 添加编辑 */}
        { stepRoadAddEdit ?  // 车道配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox} style={{width: '600px'}}>
              <div className={styles.popTit}>{popAddEditText}车道{ !showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null }{ !showFlag ? null : <Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepRoadAddEdit", null)} } />}</div>
              {/* 车道图标层 */}
              { !showFlag && laneIconLists &&
                <div className={styles.popCon}>
                  {laneIconLists.length > 0 && laneIconLists.map((item, i) => {
                    return <img key={'icon'+ i} onClick={ () => this.handleSelImage('laneIconLists', 'laneShowDetail', item) } style={{border: '1px #27343b solid', cursor: 'pointer', display: 'inline-block',margin: '8px'}} src={`${this.laneBgUrl}${item}`} />
                  })
                  }
                </div>
              }
              { showFlag && laneShowDetail && 
                <div className={styles.popCon}>
                  <div className={styles.itemInputBox}>
                    <span>道路ID：</span><Input value={laneShowDetail.fRid} onChange={e => this.handleChangeInput(e,'state','laneShowDetail','fRid')} placeholder="请输入道路ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>车道ID：</span><Input type='number' value={laneShowDetail.laneId} onChange={e => this.handleChangeInput(e,'state','laneShowDetail','laneId')} placeholder="请输入车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>外部车道ID：</span><Input value={laneShowDetail.laneIdCust} onChange={e => this.handleChangeInput(e,'state','laneShowDetail','laneIdCust')} placeholder="请输入外部车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>方 向：</span>
                    <Select
                      value={laneShowDetail.fDir8No ? laneShowDetail.fDir8No : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'laneShowDetail', 'fDir8No') }>
                      <Option value={0}>请选择方向</Option>
                      {
                        fDir8NoData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>角 度：</span>
                    <Select value={laneShowDetail.angle ? laneShowDetail.angle : 0}
                    onChange={ v =>  this.handleChangeSel(v, 'state', 'laneShowDetail', 'angle') }>
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
                    <span>转 向：</span>
                    <Checkbox.Group options={turnDirNoListData} value={laneShowDetail.turnDirNoList.split(",").map(Number)} 
                    onChange={ v =>  this.handleChangeCheck(v, 'state', 'laneShowDetail', 'turnDirNoList')} />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span style={{alignSelf: 'flex-start'}}>图 片：</span>
                    <div style={{flex:4.4}}>
                      { !!laneShowDetail.imageUrl ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'LANE')}><img src={`${this.laneBgUrl}${laneShowDetail.imageUrl}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'LANE')} className={styles.noImage}>点击选图</div> }
                    </div>
                  </div>
                </div>
              }
              { showFlag ?
                <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={ () => {this.postUpdateAllType(laneShowDetail, 'LANE')}}>编辑确定</em> : <em onClick={ () => {this.postAddAllType(laneShowDetail, 'LANE')}}>新增确定</em>
                }
                  <em onClick={ () => {this.popLayerShowHide("stepRoadAddEdit", null)} }>取 消</em>
                </div> : null
              }
              
            </div>
          </div> : null
        }
        { stepThreeAddEdit ?  // 灯组配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox} style={{width: '600px'}}>
              <div className={styles.popTit}>{popAddEditText}灯组{ !showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null }{ !showFlag ? null : <Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepThreeAddEdit", null)} } />}</div>
              {/* 灯组图标层 */}
              { !showFlag && lightIconLists &&
                  <div className={styles.popCon}>
                    {lightIconLists.length > 0 && lightIconLists.map((item, i) => {
                      return <img key={'icon'+ i} onClick={ () => this.handleSelImage('lightIconLists', 'lightShowDetail', item) } style={{border: '1px #27343b solid', cursor: 'pointer', display: 'inline-block',margin: '8px'}} src={`${this.lightBgUrl}${item}`} />
                    })
                    }
                  </div>
              }
              { showFlag && lightShowDetail && 
                <div className={styles.popCon}>
                  <div className={styles.itemInputBox}>
                    <span>灯组序号：</span><Input type='number' value={lightShowDetail.lampgroupNo} onChange={e => this.handleChangeInput(e,'state','lightShowDetail','lampgroupNo')} placeholder="请输入车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>灯组类型：</span>
                    <Select
                      value={lightShowDetail.lampgroupType ? lightShowDetail.lampgroupType : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'lightShowDetail', 'lampgroupType') }>
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
                      value={lightShowDetail.controlDir ? lightShowDetail.controlDir : '0' }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'lightShowDetail', 'controlDir') }>
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
                    onChange={ v =>  this.handleChangeSel(v, 'state', 'lightShowDetail', 'angle') }>
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
                  <div className={styles.itemInputBox} style={{alignSelf: 'flex-start'}}>
                    <span>转 向：</span>
                    <Select
                      value={lightShowDetail.controlTurn ? lightShowDetail.controlTurn : '0' }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'lightShowDetail', 'controlTurn') }>
                      <Option value={'0'}>请选择转向</Option>
                      {
                        controlTurn.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span style={{alignSelf: 'flex-start'}}>图 片：</span>
                    <div style={{flex:4.4}}>
                      { !!lightShowDetail.imageUrl ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'LIGHT')}><img src={`${this.lightBgUrl}${lightShowDetail.imageUrl}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'LIGHT')} className={styles.noImage}>点击选图</div> }
                    </div>
                  </div>
                </div>
              }
              { showFlag ?
                <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={ () => {this.postUpdateAllType(lightShowDetail, 'LIGHT')}}>编辑确定</em> : <em onClick={ () => {this.postAddAllType(lightShowDetail, 'LIGHT')}}>新增确定</em>
                }
                  <em onClick={ () => {this.popLayerShowHide("stepThreeAddEdit", null)} }>取 消</em>
                </div> : null
              }
              
            </div>
          </div> : null
        }
        { stepFourAddEdit ?  // 检测器配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox} style={{width: '700px'}}>
              <div className={styles.popTit}>{popAddEditText}检测器{ !showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null }{ !showFlag ? null : <Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepFourAddEdit", null)} } />}</div>
              {/* 检测器图标层 */}
              { !showFlag && detectorIconLists &&
                  <div className={styles.popCon}>
                    {detectorIconLists.length > 0 && detectorIconLists.map((item, i) => {
                      return <img key={'icon'+ i} onClick={ () => this.handleSelImage('detectorIconLists', 'detectorShowDetail', item) } style={{border: '1px #27343b solid', cursor: 'pointer', display: 'inline-block',margin: '8px'}} src={`${this.detectorBgUrl}${item}`} />
                    })
                    }
                  </div>
              }
              { showFlag && detectorShowDetail && 
                <div className={styles.popCon}>
                  <div className={styles.itemInputBox}>
                    <span>检测器序号：</span><Input type='number' value={detectorShowDetail.detectorId} onChange={e => this.handleChangeInput(e,'state','detectorShowDetail','detectorId')} placeholder="请输入车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>流量周期：</span><Input type='number' value={detectorShowDetail.flowCollectionCycle} onChange={e => this.handleChangeInput(e,'state','detectorShowDetail','flowCollectionCycle')} placeholder="请输入车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>占有率周期：</span><Input type='number' value={detectorShowDetail.occupancyCollectionCycle} onChange={e => this.handleChangeInput(e,'state','detectorShowDetail','occupancyCollectionCycle')} placeholder="请输入车道ID" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>检测器类型：</span>
                    <Select
                      value={detectorShowDetail.detectorType ? detectorShowDetail.detectorType : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'detectorShowDetail', 'detectorType') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        detectorType.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span style={{alignSelf: 'flex-start'}}>图 片：</span>
                    <div style={{flex:4.4}}>
                      { !!detectorShowDetail.imageUrl ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'DETECTOR')}><img src={`${this.detectorBgUrl}${detectorShowDetail.imageUrl}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'DETECTOR')} className={styles.noImage}>点击选图</div> }
                    </div>
                  </div>
                </div>
              }
              { showFlag ?
                <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={ () => {this.postUpdateAllType(detectorShowDetail, 'DETECTOR')}}>编辑确定</em> : <em onClick={ () => {this.postAddAllType(detectorShowDetail, 'DETECTOR')}}>新增确定</em>
                }
                  <em onClick={ () => {this.popLayerShowHide("stepFourAddEdit", null)} }>取 消</em>
                </div> : null
              }
            </div>
          </div> : null
        }
        { selectFlag && stepFiveAddEdit ?  // 相位配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}相位<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepFiveAddEdit", null)} } /></div>
              { phaseShowDetail && 
                <div className={classNames(styles.popCon, styles.popConTurn)}>
                  <div className={styles.itemInputBox}>
                    <span>相位序号：</span><Input type='number' value={phaseShowDetail.phaseNo} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','phaseNo')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位名称：</span><Input value={phaseShowDetail.phaseName} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','phaseName')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位禁止：</span>
                    <Select
                      value={phaseShowDetail.phaseForbiden ? phaseShowDetail.phaseForbiden : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'phaseForbiden') }>
                      <Option value={0}>请选择类型</Option>
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
                      value={phaseShowDetail.phaseShield ? phaseShowDetail.phaseShield : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'phaseShield') }>
                      <Option value={0}>请选择类型</Option>
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
                  <div className={styles.itemInputBox}>
                    <span>相位延迟绿时间：</span><Input type='number' value={phaseShowDetail.phaseDelaygreenTime} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','phaseDelaygreenTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位最大绿时间1：</span><Input type='number' value={phaseShowDetail.phaseMaxgreen1Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','phaseMaxgreen1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位最大绿时间2：</span><Input type='number' value={phaseShowDetail.phaseMaxgreen2Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','phaseMaxgreen2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>相位最小绿时间：</span><Input type='number' value={phaseShowDetail.phaseMingreenTime} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','phaseMingreenTime')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色1时间：</span><Input type='number' value={phaseShowDetail.rightofwayAccessLamp1Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayAccessLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayAccessLamp1Type ? phaseShowDetail.rightofwayAccessLamp1Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayAccessLamp1Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色2时间：</span><Input type='number' value={phaseShowDetail.rightofwayAccessLamp2Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayAccessLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayAccessLamp2Type ? phaseShowDetail.rightofwayAccessLamp2Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayAccessLamp2Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色3时间：</span><Input type='number' value={phaseShowDetail.rightofwayAccessLamp3Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayAccessLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>获得路权过渡灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayAccessLamp3Type ? phaseShowDetail.rightofwayAccessLamp3Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayAccessLamp3Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色1时间：</span><Input type='number' value={phaseShowDetail.rightofwayLoseLamp1Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayLoseLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayLoseLamp1Type ? phaseShowDetail.rightofwayLoseLamp1Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayLoseLamp1Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色2时间：</span><Input type='number' value={phaseShowDetail.rightofwayLoseLamp2Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayLoseLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayLoseLamp2Type ? phaseShowDetail.rightofwayLoseLamp2Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayLoseLamp2Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色3时间：</span><Input type='number' value={phaseShowDetail.rightofwayLoseLamp3Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayLoseLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>失去路权过渡灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayLoseLamp3Type ? phaseShowDetail.rightofwayLoseLamp3Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayLoseLamp3Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色1时间：</span><Input type='number' value={phaseShowDetail.rightofwayStartingupAccessLamp1Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayStartingupAccessLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupAccessLamp1Type ? phaseShowDetail.rightofwayStartingupAccessLamp1Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp1Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色2时间：</span><Input type='number' value={phaseShowDetail.rightofwayStartingupAccessLamp2Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayStartingupAccessLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupAccessLamp2Type ? phaseShowDetail.rightofwayStartingupAccessLamp2Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp2Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色3时间：</span><Input type='number' value={phaseShowDetail.rightofwayStartingupAccessLamp3Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayStartingupAccessLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机获得路权灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupAccessLamp3Type ? phaseShowDetail.rightofwayStartingupAccessLamp3Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupAccessLamp3Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色1时间：</span><Input type='number' value={phaseShowDetail.rightofwayStartingupLoseLamp1Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayStartingupLoseLamp1Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色1类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupLoseLamp1Type ? phaseShowDetail.rightofwayStartingupLoseLamp1Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp1Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色2时间：</span><Input type='number' value={phaseShowDetail.rightofwayStartingupLoseLamp2Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayStartingupLoseLamp2Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色2类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupLoseLamp2Type ? phaseShowDetail.rightofwayStartingupLoseLamp2Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp2Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色3时间：</span><Input type='number' value={phaseShowDetail.rightofwayStartingupLoseLamp3Time} onChange={e => this.handleChangeInput(e,'state','phaseShowDetail','rightofwayStartingupLoseLamp3Time')} placeholder="请输入" />
                  </div>
                  <div className={styles.itemInputBox}>
                    <span>开机失去路权灯色3类型：</span>
                    <Select
                      value={phaseShowDetail.rightofwayStartingupLoseLamp3Type ? phaseShowDetail.rightofwayStartingupLoseLamp3Type : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'phaseShowDetail', 'rightofwayStartingupLoseLamp3Type') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        typeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                  </div>

                </div>
              }
              <div className={styles.popBottom}>
                {
                  popAddEditText === '编辑' ? <em onClick={ () => {this.postAddUpdateItem(phaseShowDetail, 'PHASE')}}>编辑确定</em> : <em onClick={ () => {this.postAddUpdateItem(phaseShowDetail, 'PHASE', true)}}>新增确定</em>
                }
                  <em onClick={ () => {this.popLayerShowHide("stepFiveAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {  selectFlag && stepSixAddEdit ?  // 阶段配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
            <div className={styles.popTit}>{popAddEditText}阶段的相位{ !showFlag ? ' > 点击图标选中 (若不想改变图标则占空白处)' : null }{ !showFlag ? null : <Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepSixAddEdit", null)} } />}</div>
              {/* 阶段相位图标层 */}
              { !showFlag && phaseIconLists &&
                  <div className={styles.popCon}>
                    {phaseIconLists.length > 0 && phaseIconLists.map((item, i) => {
                      return <img key={'icon'+ i} onClick={ () => this.handleSelImage('phaseIconLists', 'stageShowDetail', item) } style={{border: '1px #27343b solid', cursor: 'pointer', width: '60px', height: '60px', display: 'inline-block',margin: '8px'}} src={`${this.phaseBgUrl}${item}`} />
                    })
                    }
                  </div>
              }
              { showFlag && stageShowDetail && 
              <div className={classNames(styles.popCon, styles.popConTurn)}>
                <div className={styles.itemInputBox}>
                  <span>阶段编号：</span><Input type='number' value={stageShowDetail.phasestageNo} onChange={e => this.handleChangeInput(e,'state','stageShowDetail','phasestageNo')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>阶段名称：</span><Input value={stageShowDetail.phasestageName} onChange={e => this.handleChangeInput(e,'state','stageShowDetail','phasestageName')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>阶段中相位晚启动的时间：</span><Input type='number' value={stageShowDetail.lateStartTime} onChange={e => this.handleChangeInput(e,'state','stageShowDetail','lateStartTime')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>阶段中相位早结束的时间：</span><Input type='number' value={stageShowDetail.leftingEndTime} onChange={e => this.handleChangeInput(e,'state','stageShowDetail','leftingEndTime')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>阶段中包含相位：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'PHASE', 'stageShowDetail','phasestagePhase' )} className={styles.editItem}><b>{!stageShowDetail.phasestagePhase ? "请点击进行编辑" : stageShowDetail.phasestagePhase}</b><em>编辑</em></div>
                  {/* <Input value={stageShowDetail.phasestagePhase} onChange={e => this.handleChangeInput(e,'state','stageShowDetail','phasestagePhase')} placeholder="请输入" /> */}
                </div>
                <div className={styles.itemInputBox}>
                  <span>相位阶段软件需求：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'DETECTOR', 'stageShowDetail','softwareRequirement' )} className={styles.editItem}><b>{!stageShowDetail.softwareRequirement ? "请点击进行编辑" : stageShowDetail.softwareRequirement}</b><em>编辑</em></div>
                </div>
                <div className={styles.itemInputBox} style={{alignSelf: 'flex-start'}}>
                  <span>阶段中包含车道：</span><div onClick={() => this.getSelectLists(roadInterId, roadNodeNo, 'LANE', 'stageShowDetail','phasestageLane')} className={styles.editItem}><b>{!stageShowDetail.phasestageLane ? "请点击进行编辑" : stageShowDetail.phasestageLane}</b><em>编辑</em></div>
                </div>
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
                    <span style={{alignSelf: 'flex-start'}}>图 片：</span>
                    <div style={{flex:2.25}}>
                      { !!stageShowDetail.imagePath ? <div className={styles.yesImage} onClick={(e) => this.getIconImageList(e, 'PHASE')}><img src={`${this.phaseBgUrl}${stageShowDetail.imagePath}`} /></div> : <div onClick={(e) => this.getIconImageList(e, 'PHASE')} className={styles.noImage}>点击选图</div> }
                    </div>
                  </div>
              </div>
              }
              { showFlag ? 
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={ () => {this.postAddUpdateItem(stageShowDetail, 'STAGE')}}>编辑确定</em> : <em onClick={ () => {this.postAddUpdateItem(stageShowDetail, 'STAGE', true)}}>新增确定</em>
                  }
                    <em onClick={ () => {this.popLayerShowHide("stepSixAddEdit", null)} }>取 消</em>
                </div> : null
              }
            </div>
          </div> : null
        }
        { stepSevenAddEdit ?  // 配时方案配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox} style={{ width: '720px' }}>
              <div className={styles.popTit}>{popAddEditText}配时方案{ !showFlag ? "- 选择阶段" : null}{ !showFlag ? <Icon className={styles.Close} type="close"  onClick={this.stageIdCancel} /> : <Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepSevenAddEdit", null)} } />}</div>
              {/* 选择阶段层 */}
              { !showFlag && this.props.data.stageLists &&
                  <div className={styles.popCon}>
                    <Radio.Group  onChange={e => this.handleChangeRadio(e)}>
                      { this.props.data.stageLists.length > 0 && this.props.data.stageLists.map((item, i) => {
                        return <Radio key={'radio'+i} value={item.phasestageNo} onClick={e => this.handleClickRadio(item)}>{item.phasestageName} <img style={{width:'30px', height: '30px'}} src={`${this.phaseBgUrl}${item.imagePath}`} /></Radio>
                        })
                      }
                    </Radio.Group>
                  </div>
              }
              { showFlag && planShowDetail && 
              <div className={classNames(styles.popCon, styles.popConTurn)} style={{padding: '15px 50px 15px 0'}}>
                <div className={styles.itemInputBox}>
                  <span>方案编号：</span><Input type='number' value={planShowDetail.schemeNo} onChange={e => this.handleChangeInput(e,'state','planShowDetail','schemeNo')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>方案名称：</span><Input value={planShowDetail.schemeName} onChange={e => this.handleChangeInput(e,'state','planShowDetail','schemeName')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>方案协调序号：</span><Input type='number' value={planShowDetail.schemeCoordinationNo} onChange={e => this.handleChangeInput(e,'state','planShowDetail','schemeCoordinationNo')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>方案周期：</span><Input type='number' value={planShowDetail.schemeCycle} onChange={e => this.handleChangeInput(e,'state','planShowDetail','schemeCycle')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>方案相位差时间：</span><Input type='number' value={planShowDetail.schemePhaseDiferenceTime} onChange={e => this.handleChangeInput(e,'state','planShowDetail','schemePhaseDiferenceTime')} placeholder="请输入" />
                </div>
                <div className={styles.itemInputBox}>
                  <span>方案相位阶段出现类型：</span>
                  <Select
                      value={planShowDetail.schemePhasestageType ? planShowDetail.schemePhasestageType : 0 }
                      onChange={ v =>  this.handleChangeSel(v, 'state', 'planShowDetail', 'schemePhasestageType') }>
                      <Option value={0}>请选择类型</Option>
                      {
                        schemePhasestageTypeData.map((items, key) => {
                          return <Option key={"optionList" + items.dictCode} value={items.dictCode}>{items.codeName}</Option>
                        })
                      }
                    </Select>
                </div>
                <div className={styles.itemInputBox} style={{width: '100%', alignSelf: 'flex-start'}}>
                  <span style={{alignSelf: 'flex-start'}}>方案相位阶段链：</span>
                  <div className={styles.phaseStageBox}>
                    <div className={styles.phaseStageIdBox}>
                      { planStageLists && 
                        planStageLists.map((item, i) =>{
                          return <div key={'phaseStage'+i}  className={styles.imageName}>
                          <span title={`${item.phasestageNo} - ${item.phasestageName}`} className={styles.IdName}><em/>{`${item.phasestageNo} - ${item.phasestageName}`}：</span> 
                          <Input type='number' value={item.phaseTimeIndex} onChange={e => this.handleChangeInput(e,'state','planStageLists','phaseTimeIndex')} placeholder="请输入" />
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
              { showFlag ? 
                <div className={styles.popBottom}>
                  {
                    popAddEditText === '编辑' ? <em onClick={ () => {this.postAddUpdateItem(planShowDetail, 'PLAN')}}>编辑确定</em> : <em onClick={ () => {this.postAddUpdateItem(planShowDetail, 'PLAN', true)}}>新增确定</em>
                  }
                    <em onClick={ () => {this.popLayerShowHide("stepSevenAddEdit", null)} }>取 消</em>
                </div> : 
                <div className={styles.popBottom}>
                  <em onClick={ e => {this.stageIdRight(e,'state','planShowDetail','schemePhasestageChains')} }>确 定</em>
                  <em onClick={this.stageIdCancel}>取 消</em>
                </div>
              }
            </div>
          </div> : null
        }
        { stepEightAddEdit ?  // 日计划配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}日计划<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepEightAddEdit", null)} } /></div>
              <div className={styles.popCon}> 日计划的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepEightAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepEightAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        { stepNineAddEdit ?  // 调度配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}调度<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepNineAddEdit", null)} } /></div>
              <div className={styles.popCon}> 调度的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepNineAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepNineAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {/* step 步骤 content 显示层 */}
        { stepTwoFlag || stepRoadFlag || stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              {/* <div className={styles.leftItemCon}> */}
              <div className={styles.leftItemCon} style={interRoadBg !== '' ? { background: `url(${interRoadBg}) center center / 100% 100% no-repeat` } : {}}>
                {/* 左侧基础信息回显 */}
                {stepTwoFlag ? <div className={styles.turnBgBtn} onClick={ () => {this.popLayerShowHide("baseMapFlag", true)} }>路口底图</div> : null }
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
                { stepThreeFlag ?
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
                    />
                  </div> : null
                }
                {/* 左侧检测器回显 */}
                { stepFourFlag ?
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
                { stepFiveFlag ?
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
                { stepSixFlag ?
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
                { stepSevenFlag ?
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
                { stepEightFlag ?
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
                { stepNineFlag ?
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
                     /> : 
                  stepEightFlag ?
                    <DayPlanConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide}
                    updateListItem={this.updateListItem}
                     /> : 
                  stepNineFlag ?
                    <DispatchConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide}
                    updateListItem={this.updateListItem}
                     /> : null}
            </div>
          </div> : null
        }
        {turnTab ?
          <InterworkingList showInterworkingList={this.showInterworkingList} /> : null
        }
        {/* step 导示 */}
        <StepNavMenu {...this.props }
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
        showHidePop={this.showHidePop} stepStatusData={stepStatusData} />
        <div className={styles.Interwork_left}>
          {/* <div className={styles.InterworkLeft_search}>
            <Search
              placeholder="关键词搜索"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </div> */}
          <div className={styles.searchBox}>
          <input
                className={styles.searchInput}
                onClick={this.handleSearchInterFocus}
                // onChange={this.handleSearchInputChange}
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
            <span />DCU点位列表
          </div>
          <CustomTree
            {...this.props}
            getSelectTreeId={this.getSelectTreeId}
            getSelectChildId={this.getSelectChildId}
            visibleShowLeft={this.visibleShowLeft}
          />
        </div>
        <div className={styles.mapContent}>
          <div className={styles.tagMarker}>
            <div className={styles.statusBox}>
              <span className={styles.tagOnLine}>在线设备{onlineNum}处</span>
              <span className={styles.tagOffLine}>离线设备{offlineNum}处</span>
            </div>
            <div title="切换视图" className={styles.turnBtn} onClick={() => this.showInterworkingList(true)} />
          </div>
          <div style={{position:'absolute', top:'0', right:'0', bottom:'0', left: '0'}} id='mapContent' />
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
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignalManagement)