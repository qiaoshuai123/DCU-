import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import CustomTree from '../../../components/CustomTree/CustomTree'
import InterworkingList from './InterworkingList/InterworkingList'
import markerIcon from '../../../images/markerGreen.png'
import styles from './InterworkingHome.scss'

const pointArr = [
  [120.113369, 30.234277],
  [120.421673, 30.271644],
  [120.251385, 30.405574],
  [120.208126, 30.106052],
]

class InterworkingHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInterworkingList: false,
    }
  }
  componentDidMount = () => {
    this.loadingMap()
    window.setGetParams = this.setGetParams
  }
  setGetParams = (params) => {
    console.log(params, 'sffsfsf')
    window.open(`#roaddetail/1`)
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
    this.drawMarkers(pointArr, 'pointLayers') // 初始化点
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
        const latlng = positions[i]
        // const latlng = positions[i].latlng
        const marker = new AMap.Marker({
          position: new AMap.LngLat(latlng[0], latlng[1]),
          offset: new AMap.Pixel(-16, -16),
          content: "<div class='marker-online'></div>",
        })
        marker.on('click', () => {
          map.emit('click', {
            lnglat: map.getCenter()
          })
          marker.setContent('<div class=\'drawCircle\'><div class=\'inner\'></div><div class=\'marker-online\'></div></div>')
          const nowZoom = map.getZoom()
          map.setZoomAndCenter(nowZoom, positions[i]) // 同时设置地图层级与中心点
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
    var info = [];
    // this.dataItem = JSON.parse(JSON.stringify(dataItem))
    info.push(`<div class='content_box'>`);
    info.push(`<div class='content_box_title'><h4>点位详情</h4>`);
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + '路口1' + `</span></p>`);
    info.push(`<p class='input-item'>设备编号：<span>` + '1000010' + `</span></p>`);
    info.push(`<p class='input-item'>设备型号：<span>` + '海信' + `</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>` + '192.168.1.88' + `</span></p>`);
    info.push(`<p class='input-item'>生产厂商：<span>` + '01086861234' + `</span></p>`);
    info.push(`<p class='input-item'>维护电话<span class='greenFont'>` + '东西直行' + `</span></p>`);
    info.push(`<p class='input-item'>设备状态：<span class='greenFont'>` + '早高峰' + `</span></p>`);
    info.push(`<p class='input-item'>信号接入状态：<span class='greenFont'>` + '实时优化控制' + `</span></p>`);
    info.push(`<p class='input-item'>发布服务状态：<span class='greenFont'>` + '实时优化控制' + `</span></p>`);
    info.push(`<p class='input-item' style='height:15px;'></p>`);
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class='paramsBtn' onclick='setGetParams("我是路口")'>路口监视</span></p>`);
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
  // step3 添加灯
  addLight = () => {
    const obj = { name: 'new', left: '50%', top: '50%', width: '32px', height: '32px', src: markerIcon }
    const lights = JSON.parse(JSON.stringify(this.state.lights))
    lights.push(obj)
    this.setState({ lights })
    message.info("添加成功！")
  }
  render() {
    const { Search } = Input
    const { isInterworkingList } = this.state
    return (
      <div className={styles.InterworkingHomeBox} id="mapContent">
        <Header {...this.props} />
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
          <CustomTree />
        </div>
        <div className={styles.promptBox}>
          <div><span className={styles.spanTop} />在线设备9处</div>
          <div><span className={styles.spanBom} />在线设备3处</div>
        </div>
        <div onClick={() => this.showInterworkingList(true)} className={styles.switch} />
        {
          isInterworkingList &&
          <div className={styles.InterworkingList}>
            <InterworkingList showInterworkingList={this.showInterworkingList} />
          </div>
        }
      </div>
    )
  }
}

export default InterworkingHome
