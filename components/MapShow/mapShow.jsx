import React, { Component } from 'react'
import styles from './mapShow.scss'
import markerIcon from '../../images/markerGreen.png'
class mapShow extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.pointArr = [
      [120.113369, 30.234277],
      [120.421673, 30.271644],
      [120.251385, 30.405574],
      [120.208126, 30.106052],
    ]
  }
  componentDidMount = () => {
    this.mapRender()
  }
  mapRender = () => {
    // 点击平移
    // map.panBy(50, 100)
    this.map = new AMap.Map('mapContent', {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      zoom: 11, // 初始化地图层级
      center: [120.202633, 30.266603], // 初始化地图中心点
      mapStyle: 'amap://styles/f9281194c6119ea4669f1dd2e75af292',
    })
    this.map.on('complete', () => {
      console.log('地图加载完毕', '安装点位')
      this.pointArr.forEach((marker, i) => {
        const markers = new AMap.Marker({
          map: this.map,
          icon: markerIcon,
          position: [marker[0], marker[1]],
          offset: new AMap.Pixel(-13, -30),
        })
        markers.on('click', showInfoM);
        function showInfoM() {
          
        }
      })
    })
  }

  render() {
    return (
      <div className={styles.mapShow} id='mapContent' />
    )
  }
}

export default mapShow
