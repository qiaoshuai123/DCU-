import React, { Component } from 'react'
import { Input, message, Modal, Icon } from 'antd'
import Websocket from 'react-websocket'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMapUnitInfoList, getUnitTree, getUnitPop, checkUnitTree } from '../../../reactRedux/actions/publicActions'
import { postdeleteUnit, unitInfoList } from '../../../reactRedux/actions/equipmentManagement'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import OLMapLayers from '../../../components/OpenLayers/OpenLayers'
import MessagePage from './MessagePage/MessagePage'
import styles from './EquipmentManagement.scss'

class EquipmentManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oLMapFlag: true,
      visible: false,
      dcuPopData: null,
      visibleTop: 0,
      isAddPoint: false,
      isMessagePage: false,
      // isInformation: true,
      mapPointsData: null, // 地图中所有的点
      lng: '',
      lat: '',
      interListHeight: 0,
      searchInterList: [],
      treeFlag: true,
      treeListBackups: null,
    }
    this.searchInterList = []
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
    window.myFunc = () => {
      this.props.getMapUnitInfoList()
    }
    this.userLimit = (JSON.parse(localStorage.getItem('userLimit'))).map(item => item.id)
  }
  componentDidMount = () => {
    this.loadingMap() // old 高德地图
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
    document.addEventListener('click', (e) => {
      this.visibleShowLeft('', '', false)
    })
    // document.addEventListener('click', (e) => {
    //   this.visibleShowLeft('', '', false)
    // })
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, getObjNum, dcuPopData, dcuTreeData } = this.props.data
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
    if (prevState.data.dcuTreeData !== dcuTreeData) {
      if (this.state.treeFlag) {
        this.checkUnitTree()
      }
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
    localStorage.setItem('bac', JSON.stringify(dataItem.background))
    // console.log(JSON.stringify(dataItem.background), '123132132132')
    // window.open(`#/information?id=${dataItem.interId}&ids=${dataItem.id}`)
    window.open(encodeURI(`#/information?interId=${dataItem.interId}&id=${dataItem.id}&nodeId=${dataItem.nodeId}&interName=${encodeURI(dataItem.interName)}`))
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
      center: [102.71566093,25.04232215], //初始化地图中心点 昆明
      // center: [120.202633, 30.266603], //初始化地图中心点
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
  // 筛选左侧树型结构
  checkUnitTree = () => {
    this.searchInterList = this.props.data.dcuTreeData
    this.setState({
      treeList: this.props.data.dcuTreeData,
      treeListBackups: this.props.data.dcuTreeData,
      treeFlag: false,
    })
  }
  // 创建地图层 > 对应元素层
  createLayerGroup = (name) => {
    window[name] = new AMap.LayerGroup({
      'autoRefresh': true,  // 是否自动刷新，默认为false
      'interval': 180,// 刷新间隔，默认180s
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
          content: "<div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='marker-online'></div>",
          extData: { id: positions[i].id },
          // content: "<div class='inner'></div><div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='marker-online'></div>",
        })
        marker.on('click', (e) => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          const classNs = $(marker.getContent()).attr('class')
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='" + classNs + "'></div></div>");
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
    var info = [];
    let itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    info.push(`<div class='content_box' style='background:none!important'>`);
    info.push(`<div class='content_box_title' style='background:none!important;color:#343434'><h4 style='color:#343434;'>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>${name}</span></p>`);
    info.push(`<p class='input-item'>设备编号：<span>${itemData.deviceId || '暂无'}</span></p>`)
    info.push(`<p class='input-item'>设备型号：<span>${itemData.deviceVersion || '暂无'}</span></p>`)
    info.push(`<p class='input-item'>设备IP：<span>${itemData.ip || '暂无'}</span></p>`)
    info.push(`<p class='input-item'>生产厂商：<span>${itemData.brand || '暂无'}</span></p>`)
    info.push(`<p class='input-item'>维护电话：<span>${itemData.maintainPhone || '暂无'}</span></p>`)
    this.userLimit.indexOf(301) !== -1 ? info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams(` + JSON.stringify(dataItem) + `) '>设备配置</span></p>`) : '';
    if (this.state.oLMapFlag){
      $("#message").html(info.join(""))
    } else {
    const infoWindow = new AMap.InfoWindow({
      content: info.join("")  //使用默认信息窗体框样式，显示信息内容
    });
    infoWindow.open(map, [dataItem.lng, dataItem.lat]);
    this.infoWindow = infoWindow
    window.infoWindowClose = infoWindow
    map.on('click', (e) => {
      if ($("#roadKey" + dataItem.id).parent().hasClass('drawCircle')) {
        if ($("#roadKey" + dataItem.id).hasClass('marker-offline')) {
          marker.setContent("<div inter-id='" + dataItem.interId + "' class='marker-online marker-offline'></div>");
        } else {
          marker.setContent("<div inter-id='" + dataItem.interId + "' class='marker-online'></div>");
        }
      }
      infoWindow.close()
    })
    }
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
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk() {
        that.delectRoad()
      },
      onCancel() {
        that.setState({
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
  handleData = (e) => {
    let result = JSON.parse(e);
    console.log(result, 'socket 数据')
    const { dcuStateList } = JSON.parse(e)
    // this.drawMarkers(this.state.mapPointsData, 'pointLayers', dcuStateList)
    this.updateMapPonitsColor(dcuStateList)
  }
  updateMapPonitsColor = (data) => {
    data && data.map((item) => {
      for (let i = 0; i < $('div[inter-id]').length; i++) {
        if (item.interId === $($('div[inter-id]')[i]).attr('inter-id')) {
          if (item.state === 1) {
            $($('div[inter-id]')[i]).removeClass()
            $($('div[inter-id]')[i]).addClass('marker-offline')
          } else if (item.state === 2) {
            $($('div[inter-id]')[i]).removeClass().addClass('marker-tagYellLine')
          } else {
            $($('div[inter-id]')[i]).removeClass().addClass('marker-online')
          }
        }
      }
    })
    // for (let i = 0; i < $('div[inter-id]').length; i++) {
    //   const timeDiv = $($('div[inter-id]')[i])
    //   data.map((item) => {
    //     if (item.interId === timeDiv.attr('inter-id') && !!item.state) {
    //       if (item.state === 1) {
    //         timeDiv.removeClass('marker-online')
    //         timeDiv.addClass('marker-offline')
    //       } else if (item.state === 2) {
    //         timeDiv.removeClass('marker-online')
    //         timeDiv.addClass('marker-tagYellLine')
    //       }
    //     } else {
    //       timeDiv.addClass('marker-online')
    //     }
    //   })
    // }
  }
  searchBtnSelect = (event) => {
    this.searchBtn = event.target
    this.handleSearchInterFocus()
  }

  handleSearchInterFocus = (e) => {
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
  hanleSelectInter = (e, item) => {
    let marker
    const _this = this;
    this.pointLayers.map((point) => {
      if (point.w.extData.id === item.id) {
        point.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + item.id + "' id='roadKey" + item.id + "' class='marker-online'></div></div>");
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
  render() {
    const { Search } = Input
    const { oLMapFlag, isAddPoint, isMessagePage, lng, lat, visible, visibleTop, searchInterList, interListHeight } = this.state
    return (
      <div className={styles.EquipmentManagementBox}>
        <Websocket
          url={`${this.props.data.devSockets}/DCU/websocket/dcuState/0/0/0?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        // onClose={() => this.handleClose()}
        />
        <Header {...this.props} />
        <div onClick={this.btnClick} className={styles.Interwork_left}>
          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              onChange={this.handleSearchInputChange}
              onClick={this.handleSearchInterFocus}
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
            oLMapFlag={oLMapFlag}
            getSelectTreeId={this.getSelectTreeId}
            getSelectChildId={this.getSelectChildId}
            visibleShowLeft={this.visibleShowLeft}
          />
          {
            // isAddPoint &&
             this.userLimit.indexOf(301) !== -1 ?
              <div onClick={this.addPoint} className={styles.addPoint}>
                添加点位
              </div> : ''
          }
        </div>
        {
          isMessagePage && <MessagePage closePoint={this.closePoint} AllList={this.AllList} lng={lng} lat={lat} />
        }
        <div className={styles.mapContent} style={{display:'none'}} id="mapContent" />
        <div style={{width:'100%', height: '100%'}}>
          { this.state.mapPointsData && <OLMapLayers oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildId} centerPoint={[102.829999, 24.894869]} urlXYZ="http://192.168.1.123:30001/YunNan/KunMing" /> }
        </div>
        {
          visible &&
          <ul style={{ top: `${visibleTop}px` }} onContextMenu={this.noShow} className={styles.contextMenu}>
            <li onClick={this.seeGo}>查看</li>
            <li onClick={this.showConfirm}>删除</li>
          </ul>
        }
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.publicData, ...state.equipmentManagement, ...state.SignalManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
    getUnitTree: bindActionCreators(getUnitTree, dispatch),
    postdeleteUnit: bindActionCreators(postdeleteUnit, dispatch),
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
    unitInfoList: bindActionCreators(unitInfoList, dispatch),
    checkUnitTree: bindActionCreators(checkUnitTree, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(EquipmentManagement)
