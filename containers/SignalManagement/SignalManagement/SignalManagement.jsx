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
import { getMapUnitInfoList, getUnitPop } from '../../../reactRedux/actions/publicActions'
import { getStepStatus, getBgLists, postBgBySelect, postBgByUpload } from '../../../reactRedux/actions/signalmanagementActions'
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
      interRoadBg: '',
      mapPointsData: null, // 地图中所有的点
      dcuPopData: null, // 弹层数据
      stepStatusData: null, // step数据
      lanes: [
        {
          UI_WIDTH: 66,
          DEVICE_NAME: "车道",
          P_TOP: 343,
          UI_HIGHT: 20,
          UI_IMAGE_NAME: "westleft_23.gif",
          DETAIL: "无",
          DEVICE_CODE: 1,
          P_LEFT: 485,
          DEVICE_ID: 9370224,
          UI_TYPE_ID: 3
        },
      ],// 车道
      lights: [
        {
          UI_WIDTH: 85,
          DEVICE_NAME: "灯",
          P_TOP: 343,
          UI_HIGHT: 31,
          UI_IMAGE_NAME: "arrow42_21.gif",
          DETAIL: "无",
          DEVICE_CODE: 1,
          P_LEFT: 485,
          DEVICE_ID: 9370224,
          UI_TYPE_ID: 4
        },
      ],// 灯组排列
      detectors: [
        {
          UI_WIDTH: 24,
          DEVICE_NAME: "检测器",
          P_TOP: 343,
          UI_HIGHT: 23,
          UI_IMAGE_NAME: "detector_1.png",
          DETAIL: "无",
          DEVICE_CODE: 1,
          P_LEFT: 485,
          DEVICE_ID: 9370224,
          UI_TYPE_ID: 2
        },
      ], // 检测器
    }
    this.map = null
    this.moveFlag = false // 是否是移动状态
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuPopData, stepStatusData } = this.props.data
    if (prevState.data !== this.props.data) {
      console.log(this.props,this.props.data, "data中所有的数据")
    }
    if (prevState.data.mapPointsData !== mapPointsData) {
      // console.log(mapPointsData, '点数据')
      this.setState({
        mapPointsData: mapPointsData,
      },()=>{
        this.loadingMap()
      })
    }
    if (prevState.data.dcuPopData !== dcuPopData) {
      // console.log(dcuPopData, '弹层数据')
      this.setState({
        dcuPopData: dcuPopData,
      })
    }
    if (prevState.data.stepStatusData !== stepStatusData) {
      console.log(stepStatusData, 'step数据')
      this.setState({
        stepStatusData: stepStatusData,
      })
    }
  }
  componentDidMount = () => {
    document.addEventListener('click', (e) => {
      this.visibleShowLeft('', '', false)
    })
    // 初始化地图
    this.loadingMap()
    window.showHidePop = this.showHidePop
    window.setGetParams = this.setGetParams
    this.props.getMapUnitInfoList()
    this.props.getStepStatus(1,)

  }
  // 从子集获取区域id和index 请求路口
  getSelectTreeId = (id) => {
    this.props.getVipRouteChild(id)
  }
  // 获取子id, 路口id
  getSelectChildId = (childInterId, index) => {
    const _this = this;
    let marker, lng, lat;
    const childrenArr = this.props.data.dcuTreeData
    childrenArr[index].units && childrenArr[index].units.map((item) => {
      if (childInterId === item.interId) {
        lng = item.lng
        lat = item.lat
        marker = new AMap.Marker({
          position: new AMap.LngLat(item.lng, item.lat),
          offset: new AMap.Pixel(-16, -16),
          content: "<div id='roadKey"+item.id+"'></div>",
        })
        marker.on('click',function(){
          const resultP = Promise.resolve(_this.props.getUnitPop(childInterId))
          resultP.then(()=>{
            _this.openInfoWin(_this.map, item, marker, item.interName)
          })
        })
      }
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
  // 鼠标按下
  mouseDownEvent = (event) => {
    const _this = this
    this.moveFlag = true
    this.setState({
      moveFlag: true,
    })
    this.defaultX = event.pageX
    this.defaultY = event.pageY
    document.addEventListener('mousemove', (e) => {
      const movePageX = e.pageX
      const movePageY = e.pageY
      this.DomLeft = this.defaultX + Number(movePageX - this.defaultX)
      this.DomTop = this.defaultY + Number(movePageY - this.defaultY)
    })
    document.addEventListener('mouseup', () => {
      console.log(`${this.DomLeft}px`, `${this.DomTop}px`)
      const leftVal = `${this.DomLeft}px`
      const topVal = `${this.DomTop}px`
      _this.setState({
        moveFlag: null,
      })
    })
  }

  // 更新参数
  setGetParams = params => {
    // debugger
    console.log(params, '更新名称')
    this.setState({
      stepOneText: params.interName,
    }, () => {
      this.props.getStepStatus(params.id)
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
          content: "<div id='roadKey"+positions[i].id+"' class='marker-online'></div>",
        })
        // marker.id =
        marker.on('click', () => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div id='roadKey"+positions[i].id+"' class='marker-online'></div></div>");
          const nowZoom = map.getZoom()
          map.setZoomAndCenter(nowZoom, [positions[i].lng, positions[i].lat]); //同时设置地图层级与中心点
          const resultP = Promise.resolve(this.props.getUnitPop(positions[i].interId))
          resultP.then(()=>{
            this.openInfoWin(map, positions[i], marker, positions[i].interName)
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
    info.push(`<p class='input-item'>信号运行阶段：<span class='greenFont'>` + '东西直行' + `<b class='icon_phase'></b></span></p>`);
    info.push(`<p class='input-item'>信号运行方案：<span class='greenFont'>` + '早高峰' + `</span></p>`);
    info.push(`<p class='input-item'>信号控制方式：<span class='greenFont'>` + '实时优化控制' + `</span></p>`);
    info.push(`<p class='input-item' style='height:15px;'></p>`);
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams(`+JSON.stringify(dataItem)+`)'>参数配置</span></p>`);
    const infoWindow = new AMap.InfoWindow({
      content: info.join("")  //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map, [dataItem.lng, dataItem.lat]);
    this.infoWindow = infoWindow
    window.infoWindowClose = infoWindow
    map.on('click', (e) => {
      marker.setContent("<div class='marker-online'></div>");
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
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          baseLoading: false
        })
      )
    }
  }
  handleClickBaseMap = () => {
    console.log(this.state.imageUrl)
    if (this.state.imageUrl === '' && this.state.baseMapValue === 2) {
      message.info("请选择底图！");
    } else {
      message.info("底图设置成功！");
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide("baseMapFlag", null)
      })
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
    const lights = JSON.parse(JSON.stringify(this.state.lights))
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
  
  render() {
    const { popAddEditText, moveFlag, stepOneFlag, stepTwoFlag, 
      stepRoadFlag, stepRoadAddEdit, lanes,
      stepThreeFlag, stepThreeAddEdit, lights,
      stepFourFlag, stepFourAddEdit, detectors,
      stepFiveFlag, stepFiveAddEdit,
      stepSixFlag, stepSixAddEdit,
      stepSevenFlag, stepSevenAddEdit,
      stepEightFlag, stepEightAddEdit,
      stepNineFlag, stepNineAddEdit,
      turnTab, baseMapFlag, stepOneText, imageUrl, interRoadBg, baseLoading } = this.state
    const { Search } = Input
    return (
      <div className={styles.SignalManagement}>
        <Header {...this.props} />
        {/* 弹层 > 添加编辑 */}
        { stepRoadAddEdit ?  // 车道配置添加编辑弹层
          <div className={styles.maskBg}> 
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}车道<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("stepRoadAddEdit", null)} } /></div>
              <div className={styles.popCon}> 车道的内容 </div>
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
              <div className={styles.leftItemCon} style={interRoadBg !== '' ? {
                background: 'url(' + interRoadBg + ') no-repeat', backgroundPosition: 'center center',
                backgroundSize: 'contain'
              } : {}}>
                {/* 左侧基础信息回显 */}
                {stepTwoFlag ? <div className={styles.turnBgBtn} onClick={ () => {this.popLayerShowHide("baseMapFlag", true)} }>路口底图</div> : null }
                {baseMapFlag ?
                  <BasicInfoLeft {...this.props} 
                    popLayerShowHide={this.popLayerShowHide} 
                    handleClickBaseMap={this.handleClickBaseMap} 
                    handleChangeBaseMap={this.handleChangeBaseMap}
                    imageUrl={imageUrl}
                    baseLoading={baseLoading}
                  /> : null
                }
                {/* 左侧车道回显 */}
                {stepRoadFlag ? 
                  <LaneConfigLeft  {...this.props} 
                    popLayerShowHide={this.popLayerShowHide} 
                    lanes={lanes}
                    isMoveFlag={stepRoadFlag} /> : null
                }
                {/* 左侧灯组回显 */}
                { stepThreeFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props} 
                      popLayerShowHide={this.popLayerShowHide} 
                      lanes={lanes}
                      isMoveFlag={stepRoadFlag} />
                    <LightConfigLeft {...this.props} 
                      popLayerShowHide={this.popLayerShowHide} 
                      lights={lights}
                      isMoveFlag={stepThreeFlag}
                    />
                  </div> : null
                }
                {/* 左侧检测器回显 */}
                { stepFourFlag ?
                  <div>
                    <LaneConfigLeft  {...this.props} 
                      popLayerShowHide={this.popLayerShowHide} 
                      lanes={lanes}
                      isMoveFlag={stepRoadFlag} />
                    <LightConfigLeft {...this.props} 
                      popLayerShowHide={this.popLayerShowHide} 
                      lights={lights}
                      isMoveFlag={stepThreeFlag}
                    />
                    <DetectorConfigLeft {...this.props} 
                      popLayerShowHide={this.popLayerShowHide} 
                      detectors={detectors}
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
                    <LaneConfigRight popLayerShowHide={this.popLayerShowHide} /> : 
                  stepThreeFlag ?
                    <LightConfigRight popLayerShowHide={this.popLayerShowHide} /> : 
                  stepFourFlag ? 
                    <DetectorConfigRight popLayerShowHide={this.popLayerShowHide} /> : 
                  stepFiveFlag ?  
                    <PhaseConfigRight popLayerShowHide={this.popLayerShowHide} /> :
                  stepSixFlag ?
                    <StageConfigRight popLayerShowHide={this.popLayerShowHide} /> : 
                  stepSevenFlag ?
                    <PlanConfigRight popLayerShowHide={this.popLayerShowHide} /> : 
                  stepEightFlag ?
                    <DayPlanConfigRight popLayerShowHide={this.popLayerShowHide} /> : 
                  stepNineFlag ?
                    <DispatchConfigRight popLayerShowHide={this.popLayerShowHide} /> : null}
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
        showHidePop={this.showHidePop} />
        <div className={styles.Interwork_left}>
          <div className={styles.InterworkLeft_search}>
            <Search
              placeholder="关键词搜索"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
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
              <span className={styles.tagOnLine}>在线设备9处</span>
              <span className={styles.tagOffLine}>离线设备3处</span>
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
    getBgLists: bindActionCreators(getBgLists, dispatch),
    postBgBySelect: bindActionCreators(postBgBySelect, dispatch),
    postBgByUpload: bindActionCreators(postBgByUpload, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignalManagement)