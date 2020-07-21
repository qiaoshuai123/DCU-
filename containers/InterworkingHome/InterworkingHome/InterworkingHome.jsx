import React, { Component } from 'react'
import { Input, message, Select, Icon } from 'antd'
import Websocket from 'react-websocket'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMapUnitInfoList, getUnitPop, } from '../../../reactRedux/actions/publicActions'
import { unitInfoList } from '../../../reactRedux/actions/equipmentManagement'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './InterworkingHome.scss'

class InterworkingHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dcuPopData: null,
      interListHeight: 0,
      isInterworkingList: false,
      mapPointsData: null, // 地图中所有的点
      offlineNum: '',
      onlineNum: '',
      searchInterList: [],
    }
    this.searchInterList = []
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
  }

  componentDidMount = () => {
    this.loadingMap()
    document.addEventListener('click', (e) => {
      if (e.target !== this.searchInputBox) {
        if (e.target !== this.searchBtn) {
          this.setState({ interListHeight: 0 })
        }
      }
    })
    window.showHidePop = this.showHidePop
    window.setGetParams = this.setGetParams
    this.props.getMapUnitInfoList()
    this.userLimit = (JSON.parse(localStorage.getItem('userLimit'))).map(item => item.id)
    document.addEventListener('click', (e) => {
      this.visibleShowLeft('', '', false)
    })
    this.props.unitInfoList()
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuPopData, unitInfoLists } = this.props.data
    if (prevState.data.mapPointsData !== mapPointsData) {
      console.log(mapPointsData, '点数据')
      this.getmapPointsData(mapPointsData)
    }
    if (prevState.data.dcuPopData !== dcuPopData) {
      // console.log(dcuPopData, '弹层数据')
      this.getdcuPopData(dcuPopData)
    }
    if (prevState.data.unitInfoLists !== unitInfoLists) {
      this.getunitInfoLists(unitInfoLists)
    }
  }
  getunitInfoLists = (unitInfoLists) => {
    this.searchInterList = unitInfoLists
  }
  getdcuPopData = (dcuPopData) => {
    this.setState({ dcuPopData })
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
    // console.log(dataItem, 'sdsdsd')
    localStorage.setItem('bac', JSON.stringify(dataItem.background))
    window.open(`#/roaddetail?id=${dataItem.interId}&ids=${dataItem.nodeId}&ider=${dataItem.id}`)
    // window.open(`#roaddetail/1`)
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
  showInterworkingList = (isShow) => {
    if (isShow) {
      this.setState({
        isInterworkingList: true,
      })
    } else {
      this.setState({
        isInterworkingList: false,
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
      autoRefresh: true, // 是否自动刷新，默认为false
      interval: 180, // 刷新间隔，默认180s
    });
  }
  //批量添加点
  drawMarkers = (positions, layer, updatePoint = []) => {
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
          content: "<div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='marker-online'></div>",
        })
        marker.on('click', () => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='marker-online'></div></div>");
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
    console.log(dataItem, 'qiaoshuaisss')
    var info = [];
    let itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    // this.dataItem = JSON.parse(JSON.stringify(dataItem))
    info.push(`<div class='content_box'>`);
    info.push(`<div class='content_box_title'><h4>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + name + `</span></p>`);
    info.push(`<p class='input-item'>设备编号：<span>` + itemData.deviceId + `</span></p>`);
    info.push(`<p class='input-item'>设备型号：<span>` + itemData.brand + `</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>` + itemData.ip + `</span></p>`);
    info.push(`<p class='input-item'>生产厂商：<span>` + itemData.deviceVersion + `</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>` + itemData.maintainPhone + `</span></p>`);
    info.push(`<p class='input-item'>设备状态：<span id='phasestageName'></span></p>`);
    info.push(`<p class='input-item'>信号接入状态：<span>` + '暂不设置' + `</span></p>`);
    info.push(`<p class='input-item'>发布服务状态：<span>` + '暂不设置' + `</span></p>`);
    this.userLimit.indexOf(301) !== -1 ? info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams(` + JSON.stringify(dataItem) + `)'>路口监视</span></p>`) : '';
    const infoWindow = new AMap.InfoWindow({
      content: info.join("")  //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map, [dataItem.lng, dataItem.lat]);
    this.infoWindow = infoWindow
    window.infoWindowClose = infoWindow
    map.on('click', (e) => {
      marker.setContent("<div inter-id='" + dataItem.interId + "' class='marker-online'></div>");
      infoWindow.close()
    })
  }
  handleData = (e) => {
    const { offlineNum, onlineNum, dcuStateList } = JSON.parse(e)
    // this.drawMarkers(this.state.mapPointsData, 'pointLayers', dcuStateList)
    this.setState({
      offlineNum,
      onlineNum,
    })
    this.updateMapPonitsColor(dcuStateList)
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
  updateMapPonitsColor = (data) => {
    for (let i = 0; i < $('div[inter-id]').length; i++) {
      const timeDiv = $($('div[inter-id]')[i])
      data.map((item) => {
        if (item.interId === timeDiv.attr('inter-id') && !!item.state) {
          timeDiv.removeClass('marker-offline')
        } else {
          timeDiv.addClass('marker-offline')
        }
      })
    }
  }
  handlePopData(data) {
    // debugger
    const { isOnline } = JSON.parse(data);
    // console.log(result,this,'socket POP数据')
    isOnline === '1' ? $('#phasestageName').text('正常在线') : $('#phasestageName').text('离线状态')
    // $('#schemeName').text(result.schemeName)
    // $('#nodeModelName').text(result.nodeModelName)
    // result !== -1 ? $('#phasestageImage').prop('src', `${this.phaseBgUrl}${result.phasestageImage}`).attr('style', 'width:30px;height:30px;margin-left:8px;') : null
    this.setState({
      roadUnitId: false,
    })
  }
  searchBtnSelect = (event) => {
    this.searchBtn = event.target
    this.handleSearchInterFocus()
  }

  handleSearchInterFocus = (e) => {
    const { value } = e.target
    const searchInterList = this.searchInterList.filter(item => item.interName.includes(value))
    this.setState({
      searchInterList,
    })
  }
  btnClicks = () => {
    this.setState({
      interListHeight: 300,
      searchInterList: this.searchInterList,
    })
  }
  render() {
    const { Search } = Input
    const { Option } = Select
    const { isInterworkingList, offlineNum, onlineNum, searchInterList, interListHeight, roadUnitId, roadInterId, roadNodeNo } = this.state
    console.log(`${this.props.data.devSockets}/DCU/websocket/dcuState/0/0/0?Authorization=${this.token}`)
    return (
      <div className={styles.InterworkingHomeBox}>
        <Websocket
          url={`${this.props.data.devSockets}/DCU/websocket/dcuState/0/0/0?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        // onClose={() => this.handleClose()}
        />
        {!!roadUnitId && !!roadInterId && !!roadNodeNo && <Websocket url={`${this.props.data.devSockets}/DCU/websocket/dcuRunState/${roadUnitId}/${roadInterId}/${roadNodeNo}?Authorization=${this.token}`} onMessage={this.handlePopData.bind(this)} />}
        <Header {...this.props} />
        <div className={styles.Interwork_left}>
          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              onChange={this.handleSearchInterFocus}
              onClick={this.btnClicks}
              type="text"
              placeholder="关键词搜索"
              autoComplete="off"
              ref={(input) => { this.searchInputBox = input }}
              style={{ width: '100%' }}
              id="searchBox"
            />
            <Icon className={styles.searchIcon} type="search" onClick={this.searchBtnSelect} />
          </div>
          <div className={styles.interList} style={{ maxHeight: `${interListHeight}px`, overflowY: 'auto' }}>
            <div>
              {
                searchInterList &&
                searchInterList.map(item => (
                  <div
                    className={styles.interItem}
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
        <div className={styles.tagMarker}>
          <div className={styles.statusBox}>
            <span className={styles.tagOnLine}>在线设备{onlineNum}处</span>
            <span className={styles.tagOffLine}>离线设备{offlineNum}处</span>
          </div>
          <div className={styles.turnBtn} onClick={() => this.showInterworkingList(true)} />
        </div>
        {
          isInterworkingList &&
          <div className={styles.InterworkingList}>
            <InterworkingList showInterworkingList={this.showInterworkingList} />
          </div>
        }
        <div className={styles.mapContent} id="mapContent" />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.publicData, ...state.SignalManagement, ...state.equipmentManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
    unitInfoList: bindActionCreators(unitInfoList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(InterworkingHome)
