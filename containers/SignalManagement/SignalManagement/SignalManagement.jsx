import React, { PureComponent } from 'react'
import { Input, Icon, Radio, Upload, Modal, message, Select } from 'antd'
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
import { getMapUnitInfoList, getUnitPop, checkUnitTree } from '../../../reactRedux/actions/publicActions'
import { getStepStatus, postBgBySelect, postBgByUpload } from '../../../reactRedux/actions/signalmanagementActions'
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
      popParam1: null,
      popParam2: null,
      popParam3: null,
      popParam4: null,
      treeFlag: true,
      searchInterList: null,
      treeListBackups: null,
      treeList: null,
      interListHeight: 0,
    }
    this.map = null
    this.moveFlag = false // 是否是移动状态
    this.bgIpUrl = 'http://192.168.1.213:20203/DCU/dcuImage/background/'
    this.socketPointStatusUrl = 'ws://192.168.1.213:20203/DCU/websocket/dcuState/0/0/0' // 实时请求地图点的状态
    this.socketPointPopUrl = 'ws://192.168.1.213:20203/DCU/websocket/interRunState/' // 点击显示实时弹层
    this.statePointPopUrl = 'ws://192.168.1.213:20203/DCU/websocket/allInterRunState/0/0/0' // 点击显示实时弹层
    this.searchInterList = []
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuPopData, stepStatusData, basicBgLists, basicUplSuccess, dcuTreeData } = this.props.data
    if (prevState.data !== this.props.data) {
      // console.log(this.props,this.props.data, "data中所有的数据")
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
  }
  componentDidMount = () => {
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        if ( e.target !== this.searchBtn ) {
          this.setState({ interListHeight: 0 })
        }
      }
      this.visibleShowLeft('', '', false)
    })
    // 初始化地图
    this.loadingMap()
    window.showHidePop = this.showHidePop
    window.setGetParams = this.setGetParams
    this.props.getMapUnitInfoList()
  }
  checkUnitTree = () => {
    this.searchInterList = this.props.data.dcuTreeData
    this.setState({
      treeList: this.props.data.dcuTreeData,
      treeListBackups: this.props.data.dcuTreeData,
      treeFlag: false,
    })
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
  popLayerShowHide = (name, flag, eventType) => {
    debugger
    this.setState({
      [name]: flag,
      popAddEditText: eventType ? '编辑' : '添加',
    })
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
    console.log(this.state.imageUrl)
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
  // step road 车道添加
  stepRoadAddForList = () => {
    message.info("车道添加成功！")
    this.popLayerShowHide("stepRoadAddEdit", null)
  }
  // step 3 灯组添加
  stepThreeAddForList = () => {
    const obj = {name: 'new', left: '50%', top: '50%', width: '32px', height: '32px', src: markerIcon}
    const lights = JSON.parse(JSON.stringify(this.props.data.lightPicLists))
    lights.push(obj)
    this.setState({ lights })
    message.info("灯组添加成功！")
    this.popLayerShowHide("stepThreeAddEdit", null)
  }
  // step 4 检测器添加
  stepFourAddForList = () => {
    message.info("检测器添加成功！")
    this.popLayerShowHide("stepFourAddEdit", null)
  }
  // step 5 相位添加
  stepFiveAddForList = () => {
    message.info("相位添加成功！")
    this.popLayerShowHide("stepFiveAddEdit", null)
  }
  // step 6 阶段添加
  stepSixAddForList = () => {
    message.info("阶段添加成功！")
    this.popLayerShowHide("stepSixAddEdit", null)
  }
  // step 7 配时方案添加
  stepSevenAddForList = () => {
    message.info("配时方案添加成功！")
    this.popLayerShowHide("stepSevenAddEdit", null)
  }
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
  handleLookData(data) {
    let result = JSON.parse(data);
    console.log(result,'实时监控socket 数据')
    
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
    $('#phasestageName').text(result.phasestageName).attr("tag-src",'http://192.168.1.213:20203/DCU/dcuImage/phasestage/' + result.phasestageImage)
    $('#schemeName').text(result.schemeName)
    $('#nodeModelName').text(result.nodeModelName)
    $('#phasestageImage').prop('src', 'http://192.168.1.213:20203/DCU/dcuImage/phasestage/' + result.phasestageImage).attr('style','width:30px;height:30px;margin-left:8px;')
    this.setState({
      roadUnitId: false,
    })
  }
  render() {
    const { interListHeight, searchInterList, stepStatusData, popAddEditText, moveFlag, stepOneFlag, stepTwoFlag, 
      stepRoadFlag, stepRoadAddEdit,
      stepThreeFlag, stepThreeAddEdit,
      stepFourFlag, stepFourAddEdit, 
      stepFiveFlag, stepFiveAddEdit,
      stepSixFlag, stepSixAddEdit,
      stepSevenFlag, stepSevenAddEdit,
      stepEightFlag, stepEightAddEdit,
      stepNineFlag, stepNineAddEdit,
      turnTab, baseMapFlag, stepOneText, imageUrl, interRoadBg, baseLoading, roadId, roadUnitId, roadInterId, roadNodeNo,
      onlineNum, offlineNum, popParam1, popParam2, popParam3, popParam4 } = this.state
    const { Search } = Input
    return (
      <div className={styles.SignalManagement}>
      <Websocket url={this.socketPointStatusUrl} onMessage={this.handleData.bind(this)}/>
      {/* <Websocket url={this.statePointPopUrl} onMessage={this.handleLookData.bind(this)}/> */}
      { !!roadUnitId && !!roadInterId && !!roadNodeNo ? <Websocket url={`${this.socketPointPopUrl}${roadUnitId}/${roadInterId}/${roadNodeNo}`} onMessage={ this.handlePopData.bind(this)} /> : null }
        <Header {...this.props} />
        {/* 弹层 > 添加编辑 */}
        { stepRoadAddEdit ?  // 车道配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}车道<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepRoadAddEdit", null)} } /></div>
              <div className={styles.popCon}> 
              {
                popAddEditText === '编辑' ? '车道内容回显' : '车道的新增'
              }
              </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepRoadAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepRoadAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        { stepThreeAddEdit ?  // 灯组配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}灯组<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepThreeAddEdit", null)} } /></div>
              <div className={styles.popCon}> 灯组的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepThreeAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepThreeAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        { stepFourAddEdit ?  // 检测器配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}检测器<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepFourAddEdit", null)} } /></div>
              <div className={styles.popCon}> 检测器的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepFourAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepFourAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        { stepFiveAddEdit ?  // 相位配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}相位<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepFiveAddEdit", null)} } /></div>
              <div className={styles.popCon}> 相位的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepFiveAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepFiveAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        { stepSixAddEdit ?  // 阶段配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}阶段<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepSixAddEdit", null)} } /></div>
              <div className={styles.popCon}> 阶段的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepSixAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepSixAddEdit", null)} }>取 消</em>
              </div>
            </div>
          </div> : null
        }
        { stepSevenAddEdit ?  // 配时方案配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}配时方案<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepSevenAddEdit", null)} } /></div>
              <div className={styles.popCon}> 配时方案的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={ () => {this.stepSevenAddForList()}}>确 定</em>
                <em onClick={ () => {this.popLayerShowHide("stepSevenAddEdit", null)} }>取 消</em>
              </div>
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
                      isClick={stepFiveFlag}
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
                    popLayerShowHide={this.popLayerShowHide} /> : 
                  stepThreeFlag ?
                    <LightConfigRight
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    tagToPicMark={this.tagToPicMark}
                    popLayerShowHide={this.popLayerShowHide} /> : 
                  stepFourFlag ? 
                    <DetectorConfigRight
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    tagToPicMark={this.tagToPicMark}
                    popLayerShowHide={this.popLayerShowHide} /> : 
                  stepFiveFlag ?  
                    <PhaseConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide} /> :
                  stepSixFlag ?
                    <StageConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide} /> : 
                  stepSevenFlag ?
                    <PlanConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide} /> : 
                  stepEightFlag ?
                    <DayPlanConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide} /> : 
                  stepNineFlag ?
                    <DispatchConfigRight 
                    roadId={roadId}
                    roadInterId={roadInterId}
                    roadNodeNo={roadNodeNo}
                    popLayerShowHide={this.popLayerShowHide} /> : null}
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
    getStepStatus: bindActionCreators(getStepStatus, dispatch),
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
    checkUnitTree: bindActionCreators(checkUnitTree, dispatch),
    postBgBySelect: bindActionCreators(postBgBySelect, dispatch),
    postBgByUpload: bindActionCreators(postBgByUpload, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignalManagement)