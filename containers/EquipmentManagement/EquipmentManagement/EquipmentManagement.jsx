import React, { Component } from 'react'
import { Input, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMapUnitInfoList, getUnitTree, getUnitPop } from '../../../reactRedux/actions/publicActions'
import { postdeleteUnit } from '../../../reactRedux/actions/equipmentManagement'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import MessagePage from './MessagePage/MessagePage'
import styles from './EquipmentManagement.scss'

class EquipmentManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      dcuPopData: null,
      visibleTop: 0,
      isAddPoint: false,
      isMessagePage: false,
      // isInformation: true,
      mapPointsData: null, // 地图中所有的点
      lng: '',
      lat: '',
    }
  }
  componentDidMount = () => {
    this.loadingMap()
    window.showHidePop = this.showHidePop
    window.setGetParams = this.setGetParams
    this.props.getMapUnitInfoList()
    // document.addEventListener('click', (e) => {
    //   this.visibleShowLeft('', '', false)
    // })
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, getObjNum, dcuPopData } = this.props.data
    if (prevState.data !== this.props.data) {
      // console.log(this.props.data, "data中所有的数据")
    }
    if (prevState.data.mapPointsData !== mapPointsData) {
      this.getmapPointsData(mapPointsData)
    }
    if (prevState.data.getObjNum !== getObjNum) {
      this.getObjNums(getObjNum)
    }
    if (prevState.data.dcuPopData !== dcuPopData) {
      // console.log(dcuPopData, '弹层数据')
      this.getdcuPopData(dcuPopData)
    }
  }
  getdcuPopData = (dcuPopData) => {
    this.setState({ dcuPopData })
  }
  getObjNums = (getObjNum) => {
    if (getObjNum.codeName) {
      this.setState({
        isAddPoint: true,
      })
    } else {
      this.setState({
        isAddPoint: false,
      })
    }
  }
  // 从子集获取区域id和index 请求路口
  getSelectTreeId = (id) => {
    this.props.getVipRouteChild(id)
  }
  // 获取子id, 路口id
  getSelectChildId = (childId) => {
    const _this = this
    let marker, lng, lat
    const childrenArr = this.props.data.dcuTreeData
    childrenArr.map((data) => {
      data.units && data.units.map((item) => {
        if (childId === item.id) {
          lng = item.lng
          lat = item.lat
          marker = new AMap.Marker({
            position: new AMap.LngLat(item.lng, item.lat),
            offset: new AMap.Pixel(-16, -16),
            content: "<div id='roadKey" + item.id + "'></div>",
          })
          marker.on('click', function () {
            _this.setState({
              roadUnitId: item.id,
              roadInterId: item.interId,
              roadNodeNo: item.nodeId,
            })
            const resultP = Promise.resolve(_this.props.getUnitPop(item.interId))
            resultP.then(() => {
              _this.openInfoWin(_this.map, item, marker, item.interName)
            })
          })
        }
      })
    })
    console.log(marker, this.map, 'sdfdfdfd')
    if (marker && this.map) {
      this.map.setCenter([lng, lat])
      marker.emit('click', {
        lnglat: this.map.getCenter()
      })
    } else {
      message.info('该路口尚未接入')
    }
  }
  getmapPointsData = (mapPointsData) => {
    this.setState({
      mapPointsData,
    }, () => {
      this.loadingMap()
    })
  }
  setGetParams = (dataItem) => {
    console.log(dataItem, 'sdsdsd')
    localStorage.setItem('bac', JSON.stringify(dataItem.background))
    window.open(`#/information?id=${dataItem.interId}&ids=${dataItem.id}`)
  }
  btnClick = (e) => {
    this.visibleShowLeft('', '', false)
  }
  visibleShowLeft = (top, id, show, objs) => { // 框的跳转与位置
    if (objs) {
      this.roadId = id
      this.AllList = objs
      if (top || id) {
        this.setState({
          visible: show,
          visibleTop: top,
        }, () => {
          // console.log(id, '显示右键信息')
        })
      } else {
        this.setState({
          visible: show,
        })
      }
    } else {
      this.setState({
        visible: show,
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
    try {
      map.on('click', (e) => {
        if (this.state.isMessagePage) {
          this.setState({
            lng: e.lnglat.getLng(),
            lat: e.lnglat.getLat(),
          })
        }
        // console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
      })
    } catch (error) {
      console.log(error)
    }
    this.createLayerGroup('pointLayers') // map中显示点的图层
    if (this.state.mapPointsData !== null) {
      this.drawMarkers(this.state.mapPointsData, 'pointLayers') // 初始化点
    }
  }
  // 创建地图层 > 对应元素层
  createLayerGroup = (name) => {
    window[name] = new AMap.LayerGroup({
      'autoRefresh': true,  // 是否自动刷新，默认为false
      'interval': 180,// 刷新间隔，默认180s
    });
  }
  // 批量添加点
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
          content: "<div id='roadKey" + positions[i].id + "' class='marker-online'></div>",
        })
        // marker.id =
        marker.on('click', () => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div id='roadKey" + positions[i].id + "' class='marker-online'></div></div>");
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
    console.log(dataItem, 'ssss')
    var info = [];
    let itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    info.push(`<div class='content_box'>`);
    info.push(`<div class='content_box_title'><h4>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + name + `</span></p>`);
    info.push(`<p class='input-item'>设备编号：<span>` + itemData.deviceId + `</span></p>`);
    info.push(`<p class='input-item'>设备型号：<span>` + itemData.brand + `</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>` + itemData.ip + `</span></p>`);
    info.push(`<p class='input-item'>生产厂商：<span>` + itemData.deviceVersion + `</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>` + itemData.maintainPhone + `</span></p>`);
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams(` + JSON.stringify(dataItem) + `) '>设备配置</span></p>`);
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
  // 禁止默认右键菜单
  noShow = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }
  // 查看回显
  seeGo = () => {
    // this.props.getsubeditDistrictInfoThing(this.roadId)
    this.setState({
      visible: false,
      isMessagePage: true,
    })
  }
  delectRoad = () => { // 删除路段
    this.setState({
      visible: false,
    })
    this.props.postdeleteUnit(this.roadId).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          visible: false,
        })
        this.props.getUnitTree()
        this.props.getMapUnitInfoList()
      }
    })
  }
  addPoint = () => {
    this.setState({
      isMessagePage: true,
    })
    this.AllList = ''
  }
  showConfirm = () => {
    const { confirm } = Modal
    const that = this
    confirm({
      title: '确定要删除此点位?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        that.delectRoad()
      },
      onCancel() {
        this.setState({
          visible: false,
        })
      },
    })
  }
  closePoint = () => {
    this.setState({
      isMessagePage: false,
    })
  }
  render() {
    const { Search } = Input
    const { isAddPoint, isMessagePage, lng, lat, visible, visibleTop } = this.state
    return (
      <div className={styles.EquipmentManagementBox}>
        <Header {...this.props} />
        <div onClick={this.btnClick} className={styles.Interwork_left}>
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
          {
            isAddPoint &&
            <div onClick={this.addPoint} className={styles.addPoint}>
              添加点位
            </div>
          }
        </div>
        {
          isMessagePage && <MessagePage closePoint={this.closePoint} AllList={this.AllList} lng={lng} lat={lat} />
        }
        <div className={styles.mapContent} id="mapContent" />
        {
          visible &&
          <ul style={{ top: `${visibleTop}px` }} onContextMenu={this.noShow} className={styles.contextMenu}>
            <li onClick={this.seeGo}>查看</li>
            <li onClick={this.showConfirm}>删除</li>
          </ul>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.publicData, ...state.equipmentManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
    getUnitTree: bindActionCreators(getUnitTree, dispatch),
    postdeleteUnit: bindActionCreators(postdeleteUnit, dispatch),
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(EquipmentManagement)
