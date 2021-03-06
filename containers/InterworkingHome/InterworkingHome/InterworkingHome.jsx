import React, { Component } from 'react'
import { Input, message, Select, Icon } from 'antd'
import Websocket from 'react-websocket'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fromLonLat } from 'ol/proj'
import { getMapUnitInfoList, getUnitPop, checkUnitTree, getReboot, getSetOffLine, getProofreadTime } from '../../../reactRedux/actions/publicActions'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import OLMapLayers from '../../../components/OpenLayers/OpenLayers'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './InterworkingHome.scss'

class InterworkingHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oLMapFlag: true,
      dcuPopData: null,
      interListHeight: 0,
      isInterworkingList: false,
      mapPointsData: null, // 地图中所有的点
      offlineNum: 0,
      onlineNum: 0,
      handOffline: 0,
      allOffline: 0,
      allOnline: 0,
      dcuOnline: 0,
      handOffAndTneuroOff: 0,
      handOffAndTneuroOn: 0,
      tneuroOnline: 0,
      treeFlag: true,
      searchInterList: [],
      treeListBackups: null,
      dcuStateList: [], // socket实时推送数据
      IswarningBox: false,
      IsWarningBoxLister: false,
      warningBoxList: []
    }
    this.searchInterList = []
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
    let countAllTime = setTimeout(() => {
      this.countOnNum = JSON.parse(localStorage.getItem('countOnNum'))
      this.countAllNum = JSON.parse(localStorage.getItem('countAllNum'))
      countAllTime = null
    }, 300)
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
    window.getReboot = this.getReboot
    window.getSetOffLine = this.getSetOffLine
    window.getProofreadTime = this.getProofreadTime
    this.props.getMapUnitInfoList()
    this.userLimit = (JSON.parse(localStorage.getItem('userLimit'))).map(item => item.id)
    document.addEventListener('click', (e) => {
      this.visibleShowLeft('', '', false)
    })
  }
  componentDidUpdate = (prevState) => {
    const { mapPointsData, dcuPopData, dcuTreeData, rebootData, offLineData, proofreadTimeData } = this.props.data
    if (prevState.data.mapPointsData !== mapPointsData) {
      this.getmapPointsData(mapPointsData)
    }
    if (prevState.data.dcuTreeData !== dcuTreeData) {
      if (this.state.treeFlag) {
        this.checkUnitTree()
      }
    }
    if (prevState.data.dcuPopData !== dcuPopData) {
      this.getdcuPopData(dcuPopData)
    }
    // if (prevState.data.rebootData !== rebootData) {
    //   console.log(rebootData, 'AAAA')
    //   this.setState({ rebootData: null }, () => {
    //     this.setState({ rebootData })
    //   })
    // }
    // if (prevState.data.offLineData !== offLineData) {
    //   console.log(offLineData, 'BBBB')
    //   this.setState({ offLineData: null }, () => {
    //     this.setState({ offLineData })
    //   })
    // }
    // if (prevState.data.proofreadTimeData !== proofreadTimeData) {
    //   console.log(proofreadTimeData, 'CCCC')
    //   this.setState({ proofreadTimeData: null }, () => {
    //     debugger
    //     this.setState({ proofreadTimeData })
    //   })
    // }
  }
  componentWillUnmount = () => {
    this.classNs = null
    this.searchTimer = null
  }
  getSetOffLine = (item) => {
    console.log(item, '离线')
    this.props.getSetOffLine(item.interId).then(() => {
      message.info(this.props.data.offLineData)
    })
  }
  getProofreadTime = (item, proofreadType) => {
    console.log(item, '校时')
    this.props.getProofreadTime(item.interId, proofreadType).then(() => {
      message.info(this.props.data.proofreadTimeData)
    })
  }
  getReboot = (item, rebootDeviceType) => {
    console.log(item, '重启')
    this.props.getReboot(item.interId, rebootDeviceType).then(() => {
      message.info(this.props.data.rebootData)
    })
  }
  getdcuPopData = (dcuPopData) => {
    this.setState({ dcuPopData })
  }
  // 从子集获取区域id和index 请求路口
  getSelectTreeId = (id) => {
    this.props.getVipRouteChild(id)
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
            point.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + item.id + "' id='roadKey" + item.id + "' class='marker-online'></div></div>");
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
  getmapPointsData = (mapPointsData) => {
    this.setState({
      mapPointsData,
    }, () => {
      this.loadingMap()
    })
  }

  setGetParams = (dataItem) => {
    localStorage.setItem('bac', JSON.stringify(dataItem.background))
    window.open(`#/roaddetail?interId=${dataItem.interId}&nodeId=${dataItem.nodeId}&id=${dataItem.id}&interName=${encodeURI(dataItem.interName)}`)
  }
  visibleShowLeft = (top, id, show) => { // 框的跳转与位置
    if (top || id) {
      this.setState({
        visible: show,
        visibleTop: top,
        vipId: id,
      }, () => {
      })
    } else {
      this.setState({
        visible: show,
      })
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
    // const map = new AMap.Map('mapContent', {
    //   resizeEnable: true, //是否监控地图容器尺寸变化
    //   center: [102.71566093,25.04232215], //初始化地图中心点 昆明
    //   // center: [120.202633, 30.266603], //初始化地图中心点
    //   mapStyle: "amap://styles/f9281194c6119ea4669f1dd2e75af292",
    //   zoom: 11,
    // })
    // this.map = map
    // map.on("click", function (e) {
    //   // console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat())
    // })
    // this.createLayerGroup('pointLayers') // map中显示点的图层
    // if (this.state.mapPointsData !== null) {
    //   this.drawMarkers(this.state.mapPointsData, 'pointLayers') // 初始化点
    // }
  }
  // 创建地图层 > 对应元素层
  createLayerGroup = (name) => {
    window[name] = new AMap.LayerGroup({
      autoRefresh: true, // 是否自动刷新，默认为false
      interval: 180, // 刷新间隔，默认180s
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
        })
        marker.on('click', (e) => {
          map.emit('click', {
            lnglat: map.getCenter(),
          })
          this.classNs = $(marker.getContent()).attr('class')
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div inter-id='" + positions[i].interId + "' id='roadKey" + positions[i].id + "' class='" + this.classNs + "'></div></div>");
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
    console.log(dataItem, '看下数据')
    var info = [];
    let itemData = JSON.parse(JSON.stringify(this.props.data.dcuPopData))
    // this.dataItem = JSON.parse(JSON.stringify(dataItem))
    info.push(`<div class='content_box' style='background:none!important'>`);
    info.push(`<div class='content_box_title' style='background:none!important;color:#343434'><h4 style='color:#343434;'>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>${name}</span></p>`);
    info.push(`<p class='input-item'>设备编号：<span>${itemData.deviceId || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>设备型号：<span>${itemData.brand || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>${itemData.ip || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>生产厂商：<span>${itemData.deviceVersion || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>${itemData.maintainPhone || '暂无'}</span></p>`);
    info.push(`<p class='input-item'>设备状态：<span id='phasestageName'></span></p>`);
    info.push(`<p class='input-item'>信号机状态：<span id='signalStatusText'></span></p>`);
    info.push(`<p class='input-item'>信号接入状态：<span>${'暂无'}</span></p>`);
    info.push(`<p class='input-item'>发布服务状态：<span>${'暂无'}</span></p>`);
    this.userLimit.indexOf(301) !== -1 ? info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;padding:0;' class='input-items'><span class='paramsBtn' onclick='setGetParams(` + JSON.stringify(dataItem) + `)'>路口监视</span><span title='DCU手动离线' class='paramsBtn' onclick='getSetOffLine(` + JSON.stringify(dataItem) + `)'>手动离线</span><span title='DCU校时' class='paramsBtn' onclick='getProofreadTime(` + JSON.stringify(dataItem) + `,1 )'>校时</span><span title='DCU重启' class='paramsBtn' onclick='getReboot(` + JSON.stringify(dataItem) + `,1)'>重启</span></p>`) : '';
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
  handleData = (e) => {
    let result = JSON.parse(e);
    console.log(result, 'socket 343ssssssssss数据')
    const { allOffline, allOnline, dcuOnline, tneuroOnline, dcuStateList } = JSON.parse(e)
    this.setState({
      allOffline, allOnline, dcuOnline, tneuroOnline,
      dcuStateList,
    })
    // if (offlineNum > 0) {
    //   this.setState({
    //     IswarningBox: true,
    //   })
    // } else {
    //   this.setState({
    //     IswarningBox: false,
    //     IsWarningBoxLister: false,
    //   })
    // }
    this.updateMapPonitsColor(dcuStateList)
  }
  hanleSelectInter = (e, items) => {
    const _this = this;
    let marker, lng, lat;
    if (this.state.oLMapFlag) { this.pointLayers = this.state.treeListBackups }
    if (this.state.oLMapFlag) {
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
  updateMapPonitsColor = (data) => {
    if (data.length) {
      data.map((item) => {
        for (let i = 0; i < $('div[inter-id]').length; i++) {
          if (item.interId === $($('div[inter-id]')[i]).attr('inter-id')) {
            if (item.state === 0) {
              $($('div[inter-id]')[i]).removeClass()
              $($('div[inter-id]')[i]).addClass('allOffLine')
            } else if (item.state === 1) {
              $($('div[inter-id]')[i]).removeClass().addClass('dcuOnLine')
            } else if (item.state === 2) {
              $($('div[inter-id]')[i]).removeClass().addClass('borderOnLine')
            } else if (item.state === 3) {
              $($('div[inter-id]')[i]).removeClass().addClass('allOnLine')
            }
          }
        }
      })
    }
  }
  handlePopData(data) {
    const { isOnline, signalIsOnline } = JSON.parse(data);
    isOnline === '1' ? $('#phasestageName').text('正常在线') : $('#phasestageName').text('离线状态')
    signalIsOnline === '1' ? $('#signalStatusText').text('在线') : $('#signalStatusText').text('离线')
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

  handleSearchInterFocus = () => {
    this.setState({ interListHeight: 300 })
    const searchInters = []
    this.searchInterList.forEach((item) => {
      item.units.forEach((items) => {
        searchInters.push(items)
      })
    })
    this.setState({ searchInterList: searchInters })
    console.log(123456789)
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
        !value ? this.props.checkUnitTree(this.state.treeListBackups) : this.props.checkUnitTree(this.state.treeList)
      })
    }, 200)
  }
  warningBox = () => {
    const { IsWarningBoxLister, mapPointsData, dcuStateList } = this.state
    this.setState({
      IsWarningBoxLister: !IsWarningBoxLister,
    })
    let arrs = []
    mapPointsData.forEach((item) => {
      if (dcuStateList.length) {
        dcuStateList.forEach((items) => {
          if (item.interId !== items.interId) {
            arrs.push(item)
          }
        })
      } else {
        arrs = mapPointsData
      }
    })
    this.setState({
      warningBoxList: arrs,
    })
  }
  render() {
    const { Search } = Input
    const { Option } = Select
    const { oLMapFlag, isInterworkingList, offlineNum, onlineNum, searchInterList, interListHeight, roadUnitId, roadInterId, roadNodeNo, handOffline, IswarningBox, IsWarningBoxLister, warningBoxList, allOffline, allOnline, dcuOnline, handOffAndTneuroOff, handOffAndTneuroOn, tneuroOnline, } = this.state
    return (
      <div className={styles.InterworkingHomeBox}>
        <Websocket
          url={`${this.props.data.devSockets}/DCU/websocket/dcuAndTneuroState/0/0/0?Authorization=${this.token}`}
          onMessage={this.handleData.bind(this)}
        />
        {!!roadUnitId && !!roadInterId && !!roadNodeNo && <Websocket url={`${this.props.data.devSockets}/DCU/websocket/dcuRunState/${roadUnitId}/${roadInterId}/${roadNodeNo}?Authorization=${this.token}`} onMessage={this.handlePopData.bind(this)} />}
        <Header {...this.props} />
        <div className={styles.Interwork_left}>
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
            <span />DCU点位列表（ <em style={{ fontSize: '20px', color: 'orange' }}>{this.countOnNum && this.countOnNum}</em> <b style={{ margin: '0 3px' }}>/</b> <em>{this.countAllNum && this.countAllNum}</em> ）
          </div>
          <CustomTree
            {...this.props}
            oLMapFlag={oLMapFlag}
            getSelectTreeId={this.getSelectTreeId}
            getSelectChildId={!oLMapFlag ? this.getSelectChildId : this.getSelectChildIdOlMap}
            visibleShowLeft={this.visibleShowLeft}
          />
        </div>
        <div className={styles.tagMarker}>
          <div className={styles.statusBox}>
            <span className={styles.allOnLine}>全部在线：{allOnline}处</span>
            <span className={styles.allOffLine}>全部离线：{allOffline}处</span>
            <span className={styles.dcuOnLine}>DCU在线：{dcuOnline}处</span>
            <span className={styles.borderOnLine}>边缘设备在线：{tneuroOnline}处</span>
            {/* <span className={styles.borderOffLine}>边缘手动离线：{handOffAndTneuroOff}处</span>
            <span className={styles.borderHandLine}>边缘手动在线：{handOffAndTneuroOn}处</span> */}
            {/* <span className={styles.tagOnLine}>在线设备{onlineNum}处</span>
            <span className={styles.tagOffLine}>离线设备{offlineNum}处</span>
            <span className={styles.tagYellLine}>手动离线{handOffline}处</span> */}
          </div>
          <div className={styles.turnBtn} onClick={() => this.showInterworkingList(true)} />
        </div>
        {
          IsWarningBoxLister &&
          <div className={styles.warningBoxList}>
            {
              warningBoxList && warningBoxList.map(item => <div title={item.interName} key={item.id}>点位名称:<span>{item.interName}</span></div>)
            }
          </div>
        }
        {
          IswarningBox && <div onClick={this.warningBox} className={styles.warningBox} />
        }
        {
          isInterworkingList &&
          <div className={styles.InterworkingList}>
            <InterworkingList showInterworkingList={this.showInterworkingList} />
          </div>
        }
        <div className={styles.mapContent} style={{ display: 'none' }} id="mapContent" />
        <div style={{ width: '100%', height: '100%' }}>
          {this.state.mapPointsData && <OLMapLayers pointDatas={this.state.mapPointsData} oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildIdOlMap} centerPoint={[102.829999, 24.894869]} urlXYZ="http://39.100.128.220:8080/YunNan/KunMing" />}
          {/* { this.state.mapPointsData && <OLMapLayers pointDatas={this.state.mapPointsData} oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildIdOlMap} centerPoint={[102.829999, 24.894869]} urlXYZ="http://192.168.1.123:30001/YunNan/KunMing" /> } */}
          {/* {this.state.mapPointsData && <OLMapLayers pointDatas={this.state.mapPointsData} oLMapFlag={oLMapFlag} getSelectChildId={this.getSelectChildIdOlMap} centerPoint={[102.708543, 25.044168187863253]} urlXYZ="http://53.101.224.151/YunNan/KunMing" />} */}
        </div>
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
    checkUnitTree: bindActionCreators(checkUnitTree, dispatch),
    getMapUnitInfoList: bindActionCreators(getMapUnitInfoList, dispatch),
    getUnitPop: bindActionCreators(getUnitPop, dispatch),
    getReboot: bindActionCreators(getReboot, dispatch),
    getSetOffLine: bindActionCreators(getSetOffLine, dispatch),
    getProofreadTime: bindActionCreators(getProofreadTime, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(InterworkingHome)
