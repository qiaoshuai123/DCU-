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
import { getUnitInfoList, getUnitTree } from '../../../reactRedux/actions/publicActions'
// import {  } from '../../../actions/SignalManagement'
const { Option } = Select
const pointArr = [
  [120.113369, 30.234277],
  [120.421673, 30.271644],
  [120.251385, 30.405574],
  [120.208126, 30.106052],
]
// 图片转64位
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
// 上传图片的格式及大小
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.info("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.info("图片大小不能大于2MB!");
  }
  return isJpgOrPng && isLt2M;
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
      stepOneText: '我的路口',
      baseMapFlag: null, //是否显示
      baseMapValue: 1, //选择底图
      baseLoading: false,
      imageUrl: '',
      interRoadBg: '',
      mapPointsData: null, // 地图中所有的点
      dcuTreeData: null, // 地图中所有的点
      lights: [
        { name: '红', left: '200px', top: '200px', width: '32px', height: '32px', src: require('../../../images/markerRed.png') },
        { name: '绿', left: '100px', top: '100px', width: '32px', height: '32px', src: markerIcon },
        { name: '黄', left: '300px', top: '300px', width: '32px', height: '32px', src: markerIcon }
      ], // 灯组排列
    }
    this.map = null
    this.moveFlag = false // 是否是移动状态
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuTreeData } = this.props.data
    if (prevState.data !== this.props.data) {
      console.log(this.props.data, "data中所有的数据")
    }
    if (prevState.data.mapPointsData !== mapPointsData) {
      console.log(mapPointsData, '点数据')
      this.setState({
        mapPointsData: mapPointsData,
      }, () => {
        this.loadingMap()
      })
    }
    if (prevState.data.dcuTreeData !== dcuTreeData) {
      console.log(dcuTreeData, '点数据')
      this.setState({
        dcuTreeData: dcuTreeData,
      })
    }
  }
  componentDidMount = () => {
    document.addEventListener('click', (e) => {
      this.visibleShowLeft('', '', false)
    })
    // 移动事件
    // document.addEventListener('mousemove', (e) => {
    //   if (this.moveFlag) {
    //     const movePageX = e.pageX
    //     const movePageY = e.pageY
    //     this.ImgLeft = `${this.defaultLeft + (movePageX - this.defaultX)}`
    //     this.ImgTop = `${this.defaultTop + (movePageY - this.defaultY)}`
    //     const PrimitWidth = 1000 - this.imgBox.offsetWidth
    //     const PrimitHeight = 800 - this.imgBox.offsetHeight
    //     if (this.ImgLeft < 0) {
    //       this.ImgLeft = 0
    //     }
    //     if (this.ImgTop < 0) {
    //       this.ImgTop = 0
    //     }
    //     if (this.ImgLeft > PrimitWidth) {
    //       this.ImgLeft = PrimitWidth
    //     }
    //     if (this.ImgTop > PrimitHeight) {
    //       this.ImgTop = PrimitHeight
    //     }
    //     this.imgBox.style.left = `${this.ImgLeft}px`
    //     this.imgBox.style.top = `${this.ImgTop}px`
    //   }
    // })
    // document.addEventListener('mouseup', () => {
    //   this.moveFlag = false
    // })
    // 初始化地图
    this.loadingMap()
    window.showHidePop = this.showHidePop
    window.setGetParams = this.setGetParams
    this.props.getUnitInfoList()
    this.props.getUnitTree()
    // setTimeout(()=>{
    //   console.log(this.props, '看看吧')
    // },2000)
  }
  // 从子集获取区域id和index 请求路口
  getSelectTreeId = (id) => {
    this.props.getVipRouteChild(id)
  }
  // 获取子id, 路口id
  getSelectChildId = (childId, index) => {
    const _this = this;
    let marker, lng, lat;
    const childrenArr = this.props.data.dcuTreeData
    childrenArr[index].units && childrenArr[index].units.map((item) => {
      if (childId === item.id) {
        lng = item.lng
        lat = item.lat
        marker = new AMap.Marker({
          position: new AMap.LngLat(item.lng, item.lat),
          offset: new AMap.Pixel(-16, -16),
          content: "<div id='roadKey" + item.id + "'></div>",
        })
        marker.on('click', function () {
          _this.openInfoWin(_this.map, { lng: lng, lat: lat }, marker)
        })
      }
    })

    if (marker && this.map) {
      this.map.setCenter([lng, lat])
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
  // 鼠标释放
  // mouseUpEvent = (event) => {
  //   this.moveFlag = false
  //   this.imgBox.style.cursor = 'default'
  //   console.log(event, '弹起方法')
  //   const {
  //     ID,
  //     DEVICE_ID,
  //     DETAIL,
  //     UI_WIDTH,
  //     UI_HIGHT,
  //   } = this.props.imgMsg
  // }
  // 更新参数
  setGetParams = params => {
    console.log(params, '更新名称')
    this.setState({
      stepOneText: params,
    }, () => {
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
    this.drawMarkers(pointArr, markerIcon, 'pointLayers') // 初始化点
  }
  // 创建地图层 > 对应元素层
  createLayerGroup = (name) => {
    window[name] = new AMap.LayerGroup({
      'autoRefresh': true,     //是否自动刷新，默认为false
      'interval': 180,         //刷新间隔，默认180s
    });
  }
  //批量添加点
  drawMarkers = (positions, imgIcon, layer) => {
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
        const latlng = positions[i]
        // const latlng = positions[i].latlng
        const marker = new AMap.Marker({
          position: new AMap.LngLat(latlng[0], latlng[1]),
          offset: new AMap.Pixel(-16, -16),
          content: "<div id='roadKey" + positions[i].id + "' class='marker-online'></div>",
        })
        // marker.id =
        marker.on('click', () => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div id='roadKey" + positions[i].id + "' class='marker-online'></div></div>");
          const nowZoom = map.getZoom()
          map.setZoomAndCenter(nowZoom, positions[i]); //同时设置地图层级与中心点
          this.openInfoWin(map, positions[i], marker)
        })
        this[layer].push(marker)
      }
      window[layer].addLayers(this[layer]) // 把点添加到层组中
      window[layer].setMap(map) // 层组渲染到地图中
    }
  }
  //在指定位置打开信息窗体
  openInfoWin = (map, dataItem, marker) => {
    debugger
    var info = [];
    // this.dataItem = JSON.parse(JSON.stringify(dataItem))
    info.push(`<div class='content_box'>`);
    info.push(`<div class='content_box_title'><h4>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + '路口1' + `</span></p>`);
    info.push(`<p class='input-item'>信号机编号：<span>` + '1000010' + `</span></p>`);
    info.push(`<p class='input-item'>信号机品牌：<span>` + '海信' + `</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>` + '192.168.1.88' + `</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>` + '01086861234' + `</span></p>`);
    info.push(`<p class='input-item'>信号运行阶段：<span class='greenFont'>` + '东西直行' + `<b class='icon_phase'></b></span></p>`);
    info.push(`<p class='input-item'>信号运行方案：<span class='greenFont'>` + '早高峰' + `</span></p>`);
    info.push(`<p class='input-item'>信号控制方式：<span class='greenFont'>` + '实时优化控制' + `</span></p>`);
    info.push(`<p class='input-item' style='height:15px;'></p>`);
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams("我是路口")'>参数配置</span></p>`);
    const infoWindow = new AMap.InfoWindow({
      content: info.join("")  //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map, dataItem);
    this.infoWindow = infoWindow
    window.infoWindowClose = infoWindow
    map.on('click', (e) => {
      marker.setContent("<div class='marker-online'></div>");
      infoWindow.close()
    })
  }
  // step2 底图选择
  onChangeBaseMap = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      baseMapValue: e.target.value,
    })
  }
  handleChangeBaseMap = info => {
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
  // step 2 基础信息配置保存
  stepTwoAddForList = () => {
    message.info("信号机基础信息保存成功！")
  }
  // step road 车道添加
  stepRoadAddForList = () => {
    message.info("车道添加成功！")
    this.popLayerShowHide("stepRoadAddEdit", null)
  }
  // step 3 灯组添加
  stepThreeAddForList = () => {
    const obj = { name: 'new', left: '50%', top: '50%', width: '32px', height: '32px', src: markerIcon }
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
    const { popAddEditText, moveFlag, stepOneFlag, stepTwoFlag, stepRoadFlag, stepRoadAddEdit,
      stepThreeFlag, stepThreeAddEdit,
      stepFourFlag, stepFourAddEdit, lights,
      stepFiveFlag, stepFiveAddEdit,
      stepSixFlag, stepSixAddEdit,
      stepSevenFlag, stepSevenAddEdit,
      stepEightFlag, stepEightAddEdit,
      stepNineFlag, stepNineAddEdit,
      turnTab, baseMapFlag, stepOneText, imageUrl, interRoadBg } = this.state
    const { Search } = Input
    const uploadButton = (
      <em>{this.state.baseLoading ? <span><Icon type="loading" /> loading</span> : '上 传'}</em>
    );
    return (
      <div className={styles.SignalManagement}>
        <Header {...this.props} />
        {/* 弹层 > 添加编辑 */}
        {stepRoadAddEdit ?  // 车道配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}车道<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepRoadAddEdit", null) }} /></div>
              <div className={styles.popCon}> 车道的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepRoadAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepRoadAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepThreeAddEdit ?  // 灯组配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}灯组<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepThreeAddEdit", null) }} /></div>
              <div className={styles.popCon}> 灯组的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepThreeAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepThreeAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepFourAddEdit ?  // 检测器配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}检测器<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepFourAddEdit", null) }} /></div>
              <div className={styles.popCon}> 检测器的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepFourAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepFourAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepFiveAddEdit ?  // 相位配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}相位<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepFiveAddEdit", null) }} /></div>
              <div className={styles.popCon}> 相位的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepFiveAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepFiveAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepSixAddEdit ?  // 阶段配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}阶段<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepSixAddEdit", null) }} /></div>
              <div className={styles.popCon}> 阶段的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepSixAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepSixAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepSevenAddEdit ?  // 配时方案配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}配时方案<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepSevenAddEdit", null) }} /></div>
              <div className={styles.popCon}> 配时方案的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepSevenAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepSevenAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepEightAddEdit ?  // 日计划配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}日计划<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepEightAddEdit", null) }} /></div>
              <div className={styles.popCon}> 日计划的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepEightAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepEightAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {stepNineAddEdit ?  // 调度配置添加编辑弹层
          <div className={styles.maskBg}>
            <div className={styles.popBox}>
              <div className={styles.popTit}>{popAddEditText}调度<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("stepNineAddEdit", null) }} /></div>
              <div className={styles.popCon}> 调度的内容 </div>
              <div className={styles.popBottom}>
                <em onClick={() => { this.stepNineAddForList() }}>确 定</em>
                <em onClick={() => { this.popLayerShowHide("stepNineAddEdit", null) }}>取 消</em>
              </div>
            </div>
          </div> : null
        }
        {/* step 步骤 content 显示层 */}
        {stepTwoFlag || stepRoadFlag || stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              {/* <div className={styles.leftItemCon}> */}
              <div className={styles.leftItemCon} style={interRoadBg !== '' ? {
                background: 'url(' + interRoadBg + ') no-repeat', backgroundPosition: 'center center',
                backgroundSize: 'contain'
              } : {}}>
                {/* 内部变化内容 之 路口底图弹层*/}
                {baseMapFlag ?
                  <div className={styles.maskBg}><div className={styles.popBox} style={{ top: '75%' }} >
                    <div className={styles.popTit}>选择底图<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("baseMapFlag", null) }} /></div>
                    <div className={styles.popCon}>
                      <div className={styles.typePic}>
                        <Radio.Group name="radiogroup" onChange={this.onChangeBaseMap} value={this.state.baseMapValue}>
                          <Radio value={1}>选择底图</Radio>
                          <Radio value={2}>上传底图</Radio>
                        </Radio.Group>
                      </div>
                      <div className={styles.typePic} style={{ width: '220px' }}>
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          beforeUpload={beforeUpload}
                          onChange={this.handleChangeBaseMap}
                        >
                          {imageUrl ?
                            <img src={imageUrl} alt="底图" style={{ width: "100%" }} /> : <s>图片预览</s>
                          }
                          {this.state.baseMapValue === 2 ? uploadButton : null}
                        </Upload>
                        {this.state.baseMapValue === 2 ? null : <em>选 择</em>}

                      </div>
                    </div>
                    <div className={styles.popBottom}>
                      <em onClick={() => { this.handleClickBaseMap() }}>确 定</em>
                      <em onClick={() => { this.popLayerShowHide("baseMapFlag", null) }}>取 消</em>
                    </div>
                  </div></div> : null
                }
                {/* 灯组回显 */}
                {stepThreeFlag && lights && lights.map((item, i) => {
                  return <div className={moveFlag ? styles.mouseStatus : null} onDoubleClick={() => { this.popLayerShowHide("stepThreeAddEdit", true, true) }} onMouseDown={this.mouseDownEvent} key={'light' + i} style={{ cursor: 'pointer', position: 'absolute', display: 'block', background: 'url(' + item.src + ') no-repeat', left: item.left, top: item.top, width: item.width, height: item.height, border: '1px border yellow' }} title={item.name}>{item.name}</div>
                })
                }
                {stepTwoFlag ? <div className={styles.turnBgBtn} onClick={() => { this.popLayerShowHide("baseMapFlag", true) }}>路口底图</div> : null}
              </div>
            </div>
            <div className={styles.stepRightCon}>
              {stepTwoFlag ?
                <div className={styles.conBox}>
                  <div className={styles.rTit}>信号机基础信息<em onClick={() => { this.stepTwoAddForList() }}>保存</em></div>
                  {/* 表单 */}
                  <div className={styles.rCon}>
                    <div className={styles.itemInputBox}>
                      <span>信号机编号：</span><Input placeholder="请输入编号" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>信号机IP：</span><Input placeholder="请输入IP" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>子网掩码：</span><Input placeholder="请输入掩码" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>网 关：</span><Input placeholder="请输入网关" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>上位机IP：</span><Input placeholder="请输入IP" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>通讯端口：</span><Input placeholder="请输入端口" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>信号机时区：</span><Input placeholder="请输入时区" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>控制路口数：</span><Input type="number" placeholder="请输入数量" />
                    </div>
                    <div className={styles.itemInputBox}>
                      <span>GPS时钟标志：</span><Input placeholder="请输入标志" />
                    </div>
                  </div>
                </div> : stepRoadFlag ?
                  <div className={styles.conBox}>
                    <div className={styles.rTit}>车道配置列表<em onClick={() => { this.popLayerShowHide("stepRoadAddEdit", true) }}>添加</em></div>

                    <div className={styles.rList}>
                      <div className={styles.listItem}>
                        <em>车道号</em>
                        <em>外部车道号</em>
                        <em>通行方向描述</em>
                        <em>进口道路编号</em>
                        <em>进口方向编码</em>
                        <em>转向</em>
                        <em>操作</em>
                      </div>
                      <div className={classNames(styles.listItem)}>
                        <span>1</span>
                        <span>东</span>
                        <span>圆灯</span>
                        <span>1</span>
                        <span>东</span>
                        <span>圆灯</span>
                        <span>删除</span>
                      </div>
                    </div>
                  </div> : stepThreeFlag ?
                    <div className={styles.conBox}>
                      <div className={styles.rTit}>灯组配置列表<em onClick={() => { this.popLayerShowHide("stepThreeAddEdit", true) }}>添加</em></div>

                      <div className={styles.rList}>
                        <div className={styles.listItem}>
                          <em>灯组序号</em>
                          <em>方向</em>
                          <em>灯组类型</em>
                          <em>操作</em>
                        </div>
                        <div className={classNames(styles.listItem)}>
                          <span>1</span>
                          <span>东</span>
                          <span>圆灯</span>
                          <span>删除</span>
                        </div>
                      </div>
                    </div> : stepFourFlag ?
                      <div className={styles.conBox}>
                        <div className={styles.rTit}>检测器配置列表<em onClick={() => { this.popLayerShowHide("stepFourAddEdit", true) }}>添加</em></div>

                        <div className={styles.rList}>
                          <div className={styles.listItem}>
                            <em>检测器编号</em>
                            <em>检测器类型</em>
                            <em>流量采集周期</em>
                            <em>占有率采集周期</em>
                            <em>操作</em>
                          </div>
                          <div className={classNames(styles.listItem)}>
                            <span>1</span>
                            <span>东</span>
                            <span>东</span>
                            <span>圆灯</span>
                            <span>删除</span>
                          </div>
                        </div>
                      </div> : stepFiveFlag ?
                        <div className={styles.conBox}>
                          <div className={styles.rTit}>相位配置列表<em onClick={() => { this.popLayerShowHide("stepFiveAddEdit", true) }}>添加</em></div>

                          <div className={styles.rList}>
                            <div className={styles.listItem}>
                              <em>相位编号</em>
                              <em>相位名称</em>
                              <em>相位包含灯组</em>
                              <em>失去路权过渡参数</em>
                              <em>获得路权过渡参数</em>
                              <em>开机失去路权过渡参数</em>
                              <em>开机获得路权过渡参数</em>
                              <em>最小绿时间</em>
                              <em>延迟绿时间</em>
                              <em>需求检测器</em>
                              <em>相位屏蔽</em>
                              <em>相位禁止</em>
                              <em>操作</em>
                            </div>
                            <div className={classNames(styles.listItem)}>
                              <span>1</span>
                              <span>东</span>
                              <span>圆灯</span>
                              <span>2</span>
                              <span>1</span>
                              <span>东</span>
                              <span>圆灯</span>
                              <span>23</span>
                              <span>1</span>
                              <span>东</span>
                              <span>圆灯</span>
                              <span>圆灯</span>
                              <span>删除</span>
                            </div>
                          </div>
                        </div> : stepSixFlag ?
                          <div className={styles.conBox}>
                            <div className={styles.rTit}>阶段配置列表<em onClick={() => { this.popLayerShowHide("stepSixAddEdit", true) }}>添加</em></div>

                            <div className={styles.rList}>
                              <div className={styles.listItem}>
                                <em>阶段编号</em>
                                <em>放行相位</em>
                                <em>阶段图示</em>
                                <em>操作</em>
                              </div>
                              <div className={classNames(styles.listItem)}>
                                <span>1</span>
                                <span>东</span>
                                <span>圆灯</span>
                                <span>删除</span>
                              </div>
                            </div>
                          </div> : stepSevenFlag ?
                            <div className={styles.conBox}>
                              <div className={styles.rTit}>配时方案配置列表<em onClick={() => { this.popLayerShowHide("stepSevenAddEdit", true) }}>添加</em></div>

                              <div className={styles.rList}>
                                <div className={styles.listItem}>
                                  <em>方案编号</em>
                                  <em>放行阶段列表</em>
                                  <em>方案周期</em>
                                  <em>协调阶段</em>
                                  <em>协调时间</em>
                                  <em>操作</em>
                                </div>
                                <div className={classNames(styles.listItem)}>
                                  <span>1</span>
                                  <span>东</span>
                                  <span>圆灯</span>
                                  <span>东</span>
                                  <span>圆灯</span>
                                  <span>删除</span>
                                </div>
                              </div>
                            </div> : stepEightFlag ?
                              <div className={styles.conBox}>
                                <div className={styles.rTit}>日计划配置列表<em onClick={() => { this.popLayerShowHide("stepEightAddEdit", true) }}>添加</em></div>

                                <div className={styles.rList}>
                                  <div className={styles.listItem}>
                                    <em>计划编号</em>
                                    <em>时段开始时间</em>
                                    <em>时段执行方案</em>
                                    <em>时段运行模式</em>
                                    <em>操作</em>
                                  </div>
                                  <div className={classNames(styles.listItem)}>
                                    <span>1</span>
                                    <span>东</span>
                                    <span>圆灯</span>
                                    <span>1灯</span>
                                    <span>删除</span>
                                  </div>
                                </div>
                              </div> : stepNineFlag ?
                                <div className={styles.conBox}>
                                  <div className={styles.rTit}>调度配置列表<em onClick={() => { this.popLayerShowHide("stepNineAddEdit", true) }}>添加</em></div>

                                  <div className={styles.rList}>
                                    <div className={styles.listItem}>
                                      <em>调度方案编号</em>
                                      <em>调度类型</em>
                                      <em>优先级</em>
                                      <em>调度类型值</em>
                                      <em>日计划编号</em>
                                      <em>操作</em>
                                    </div>
                                    <div className={classNames(styles.listItem)}>
                                      <span>1</span>
                                      <span>东</span>
                                      <span>圆灯</span>
                                      <span>东</span>
                                      <span>灯</span>
                                      <span>删除</span>
                                    </div>
                                  </div>
                                </div> : null}
            </div>
          </div> : null
        }
        {turnTab ?
          <InterworkingList showInterworkingList={this.showInterworkingList} /> : null
        }
        <div className={styles.navContent}>
          <div className={styles.navBoxMenu}>
            <span className={classNames(stepOneFlag ? styles.hover : null, stepOneText !== '请选择路口' ? styles.link : null)} onClick={() => { this.showHidePop("stepOneFlag", true) }} title={stepOneText}>{stepOneText}</span>
            <s className={stepTwoFlag || stepRoadFlag || stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepTwoFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepTwoFlag", true) }}>基础信息配置</span>
            <s className={stepRoadFlag || stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepRoadFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepRoadFlag", true) }}>车道配置</span>
            <s className={stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepThreeFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepThreeFlag", true) }}>灯组配置</span>
            <s className={stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={classNames(stepFourFlag ? styles.hover : null, styles.link)} onClick={() => { this.showHidePop("stepFourFlag", true) }}>检测器配置</span>
            <s className={stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepFiveFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepFiveFlag", true) }}>相位配置</span>
            <s className={stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepSixFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepSixFlag", true) }}>阶段配置</span>
            <s className={stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepSevenFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepSevenFlag", true) }}>配时方案配置</span>
            <s className={stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepEightFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepEightFlag", true) }}>日计划配置</span>
            <s className={stepNineFlag ? styles.hover : ""}></s>
            <span className={stepNineFlag ? styles.hover : null} onClick={() => { this.showHidePop("stepNineFlag", true) }}>调度配置</span>
            <div className={styles.controlBtnBox}>
              <em>上传配置</em>
              <em>下发配置</em>
            </div>
          </div>
        </div>
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
        <div className={styles.mapContent} id='mapContent'>
          <div className={styles.tagMarker}>
            <div className={styles.statusBox}>
              <span className={styles.tagOnLine}>在线设备9处</span>
              <span className={styles.tagOffLine}>离线设备3处</span>
            </div>
            <div title="切换视图" className={styles.turnBtn} onClick={() => this.showInterworkingList(true)} />
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
    getUnitInfoList: bindActionCreators(getUnitInfoList, dispatch),
    getUnitTree: bindActionCreators(getUnitTree, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(SignalManagement)
