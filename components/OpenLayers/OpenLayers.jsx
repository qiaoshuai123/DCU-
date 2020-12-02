import React from 'react'
import { Map, Feature, View, Overlay } from 'ol'
import { toStringHDMS } from 'ol/coordinate'
import { Tile } from 'ol/layer'
import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'
import { defaults } from 'ol/control'
import { OSM, XYZ, Vector } from 'ol/source'
import { Style, Icon } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import iconMark from '../../images/markerGreen.png'
import './mapOl.css'
import 'ol/ol.css';

class OpenLayers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      centerPoint: this.props.centerPoint ? this.props.centerPoint : [108.3582,22.8268],
      urlXYZ: this.props.urlXYZ ? this.props.urlXYZ : 'http://192.168.1.123:30001/GuangXi/NanNing',
      pointDatas: this.props.pointDatas ? this.props.pointDatas : [
        {
          "id":9,
          "interId":"80",
          "interName":"青年路-人民中路",
          "lng":102.820999,
          "lat":24.894869,
          "interType":1,
          "ownInterId":"",
          "areaCode":1,
          "nodeId":1,
          "background":"0c8a622a-0cd6-4bba-8306-9c75d9eaae81_intersectionBg.png",
          "areaName":null
        },
        {
          "id":9,
          "interId":"80",
          "interName":"测试路",
          "lng":102.827099,
          "lat":24.892869,
          "interType":1,
          "ownInterId":"",
          "areaCode":1,
          "nodeId":1,
          "background":"0c8a622a-0cd6-4bba-8306-9c75d9eaae81_intersectionBg.png",
          "areaName":null
        }
      ],
      pointStyles: this.props.pointStyles ? this.props.pointStyles : [
        {
          anchor: [16, 32],              //锚点(相对于图标进行偏移 px X:图标宽的一半, Y:图标的高)
          anchorOrigin: 'bottom-center',       //锚点源
          anchorXUnits: 'pixels',       //锚点X值单位
          anchorYUnits: 'pixels',         //锚点Y值单位
          offsetOrigin: 'bottom',      //偏移原点
          opacity: 1,
          scale: 1,
          src: `${iconMark}`  //图标的URL
        },
        {
          anchor: [0.5, 60],              //锚点
          anchorOrigin: 'top-right',       //锚点源
          anchorXUnits: 'fraction',       //锚点X值单位
          anchorYUnits: 'pixels',         //锚点Y值单位
          offsetOrigin: 'top-right',      //偏移原点
          opacity: 0.75,
          scale: 0.05,
          src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594359193211&di=1d6bb819a5daa724ff65cc4d011d4d42&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_pic%2F17%2F10%2F27%2F05dc60e54e3aa5d093cdc32611303643.jpg'  //图标的URL
        }
      ]
    }
    this.mapOL = null
    window.OperlayerMarkers = []
  }
  componentDidMount = () => {
    this.renderMap()
  }

  renderMap = () => {
    const _this = this
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    //    创建一个叠加层，将弹出式窗口定位到地图。
    var overlay = new Overlay(({
      id: 'oLMarker',
      element: container,
      autoPan: true,
      offset: [0, -30],
      positioning: 'bottom-center',
      autoPanAnimation: {
        duration: 500
      }
    }));
    //    点击关闭按钮  关闭弹窗
    closer.onclick = function () {
      //不显示弹出框
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    window.mapOL = this.mapOL = new Map({
      // 设置挂载点为oLmap
      target: 'oLmap',
      // 设置图层
      layers: [
        new Tile({
          source: new OSM(),
        })
      ],
      overlays: [overlay],
      // 设置地图的可视区域，center为中心点，zoom为缩放的层级
      view: new View({
        center: fromLonLat(_this.state.centerPoint),
        zoom: 15,
        maxZoom: 17,
        minZoom: 1
      }),
      // 设置地图控件，默认的三个控件都不显示
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false
      })
    });
    // 添加一个使用离线瓦片地图的层
    let offlineMapLayer = new Tile({
      // 设置本地离线瓦片所在路径，由于例子里面只有一张瓦片，页面显示时就只看得到一张瓦片。
      source: new XYZ({
        url: _this.state.urlXYZ + "/{z}/{y}/{x}.png",
      })
    });
    mapOL.addLayer(offlineMapLayer);
    this.renderMarkers(overlay, this.state.pointDatas)
  }

  createLabelStyle = (feature) => {
    return new Style({
      image: new Icon(feature),
    });
  }
  // 图标下面显示interName
  setPointName = (interName, lnglat) => {
    const element = document.createElement("div");
    element.className = "point_name";
    element.innerHTML = interName
    const point_overlay = new Overlay({
    element: element,
    positioning: 'top-center',
    });
    mapOL.addOverlay(point_overlay);
    point_overlay.setPosition(lnglat);
  }
  // layerMarker
  addMarkers = (itemData) => {
    const element = document.createElement("div")
    element.setAttribute("inter-id", itemData.interId)
    element.className = "marker-online"
    const point_overlay = new Overlay({
      element: element,
      positioning: 'center-center',
      name: itemData.interName,                         //名称属性
      // id: "OpenMark"+itemData.id
    });
    mapOL.addOverlay(point_overlay)
    point_overlay.setPosition(fromLonLat([itemData.lng, itemData.lat]))
    mapOL.on('click', function (evt) {
      // console.log('能看到我几次？')
      var pixel = mapOL.getEventPixel(evt.originalEvent);
      var elementName = document.getElementById('popup-name"');
      var feature = mapOL.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        return feature;
      });
      if (feature) {
        let iconName = feature.get('name');
        _this.props.getSelectChildId(pointDatas[i].id, iconName, pointDatas[i])
        var coordinates = feature.getGeometry().getCoordinates();
        // $(element).html("<div>"+coordinates+"<div style='width:100px;height:30px;border:1px yellow solid;' onclick='setGetParams(" + JSON.stringify(pointDatas[i]) + ")'>点我</div></div>")
        popLayer.setPosition(coordinates);
        mapOL.getView().setCenter(coordinates) // 设置中心点
      } else {
        $("#message").html("")
        popLayer.setPosition(undefined);
      }
    })
    }
  // 图标动画
  setFlashPoint = (lnglat) => {
    //第一种样式
    const element = document.createElement("div");
    element.className = "point_animation";
    const p = document.createElement("p");
    const span = document.createElement("span");
    element.appendChild(p);
    element.appendChild(span);
    const point_overlay = new Overlay({
    element: element,
    positioning: 'center-center',
    });
    mapOL.addOverlay(point_overlay);
    point_overlay.setPosition(lnglat);

    //第二种样式
    const ele = document.createElement("div");
    ele.className = "css_animation";
    const point_overlay2 = new Overlay({
    element: ele,
    positioning: 'center-center',
    });
    mapOL.addOverlay(point_overlay2);
    point_overlay2.setPosition(lnglat);
   }
  renderMarkers = (popLayer, pointDatas) => {
    const _this = this
    this.featuresAll = []
    if (this.mapOL) {
      // 点样式一
      const pointStyleOne = this.state.pointStyles[0]
      // 点样式二
      const pointStyleTwo = this.state.pointStyles[1]
      for (let i = 0; i < pointDatas.length; i++) {
        console.log(pointDatas[i])
        const pointItem = fromLonLat([pointDatas[i].lng, pointDatas[i].lat])  // 坐标点
        _this.addMarkers(pointDatas[i])// 添加点
        // _this.setPointName(pointDatas[i].interName, pointItem)
        // _this.setFlashPoint(pointItem)
        // //创建Marker 点
        // const iconFeature = new Feature({
        //   geometry: new Point(pointItem),          // 设置坐标
        //   name: pointDatas[i].interName,                         //名称属性
        //   id: "OpenMark"+pointDatas[i].id
        //   // population: 2115                       //人口数（万）
        // });
        // //设置点图标样式
        // iconFeature.setStyle(_this.createLabelStyle(pointStyleOne));
        // this.featuresAll.push(iconFeature)
        // //设置点的数据源
        // const vectorSource = new Vector({
        //   features: _this.featuresAll
        // });
        // //用于显示在客户端渲染的矢量数据
        // // popLayer.setSource(vectorSource)
        // const vectorLayer = new VectorLayer({
        //   source: vectorSource
        // });
        // window.OperlayerMarkers.push(iconFeature)
        // mapOL.addLayer(vectorLayer);

        // mapOL.on('click', function (evt) {
        //   // console.log('能看到我几次？')
        //   var pixel = mapOL.getEventPixel(evt.originalEvent);
        //   var elementName = document.getElementById('popup-name"');
        //   var feature = mapOL.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        //     return feature;
        //   });
        //   if (feature) {
        //     let iconName = feature.get('name');
        //     _this.props.getSelectChildId(pointDatas[i].id, iconName, pointDatas[i])
        //     var coordinates = feature.getGeometry().getCoordinates();
        //     // $(element).html("<div>"+coordinates+"<div style='width:100px;height:30px;border:1px yellow solid;' onclick='setGetParams(" + JSON.stringify(pointDatas[i]) + ")'>点我</div></div>")
        //     popLayer.setPosition(coordinates);
        //     mapOL.getView().setCenter(coordinates) // 设置中心点
        //   } else {
        //     $("#message").html("")
        //     popLayer.setPosition(undefined);
        //   }
        // });
      }



    }
  }
  render() {
    return (
      // 地图的挂载点，可以设置大小，控制地图的大小
      <div style={{ width: '100%', height: '100%' }}>
        <div id="oLmap" style={{ width: '100%', height: '100%', position: 'relative' }} />
        <div id="popup" className='ol-popup'>
          <a href="#" id="popup-closer" className="ol-popup-closer"></a>
            <div id="message">
              hello world
            </div>
        </div>
        <div id="popup-name">1212</div>
      </div>
    )
  }
}
export default OpenLayers