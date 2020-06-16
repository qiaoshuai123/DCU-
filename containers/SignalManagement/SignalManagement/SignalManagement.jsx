import React, { Component } from 'react'
import { Input, Icon, Radio } from 'antd'
import classNames from 'classnames'
import Header from '../../../components/Header/Header'
import markerIcon from '../../../images/markerGreen.png'
import markerRedIcon from '../../../images/markerRed.png'
import CustomTree from '../../../components/CustomTree/CustomTree'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './SignalManagement.scss'

const pointArr = [
  [120.113369,30.234277],
  [120.421673,30.271644],
  [120.251385,30.405574],
  [120.208126,30.106052]
]
class SignalManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stepOneFlag: null,
      stepTwoFlag: null,
      stepThreeFlag: null,
      stepFourFlag: null,
      stepFiveFlag: null,
      stepSixFlag: null,
      stepSevenFlag: null,
      stepEightFlag: null,
      stepNineFlag: null,
      baseMapFlag: null, //是否显示
      baseMapValue: 1, //选择底图
    }
    this.map = null
  }
  componentDidMount = () => {
    // 初始化地图
    this.loadingMap()
  }
  // 显示与隐藏step
  showHidePop = (name, flag) => {
    const stepArr = ['stepTwoFlag', 'stepThreeFlag', 'stepFourFlag', 'stepFiveFlag', 'stepSixFlag', 'stepSevenFlag', 'stepEightFlag', 'stepNineFlag', 'turnTab']
    for (let i in stepArr) {
      if (stepArr[i] === name) {
        this.setState({
          [name]: flag,
        })
      } else {
        console.log(typeof(stepArr[i]))
        this.setState({
          [stepArr[i]]: null,
        })
      }
    }
  }
  // 显示隐藏弹层
  popLayerShowHide = (name, flag) => {
    this.setState({
      [name]: flag,
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
    map.on("click",function(e){
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
          content: "<div class='marker-online'></div>",
        })
        marker.on('click', () => {
          map.emit('click', {
            lnglat : map.getCenter()
          })
          marker.setContent("<div class='drawCircle'><div class='inner'></div><div class='marker-online'></div></div>");
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
    var info = [];
    // this.dataItem = JSON.parse(JSON.stringify(dataItem))
    info.push(`<div class='content_box'>`);
    info.push(`<div class='content_box_title'><h4>点位详情</h4>`);  
    info.push(`<p class='input-item' style='border-top: 1px #838a9a solid;margin-top:-10px;padding-top:15px;'>点位名称：<span>` + '路口1' + `</span></p>`);    
    info.push(`<p class='input-item'>信号机编号：<span>` + '1000010' + `</span></p>`);
    info.push(`<p class='input-item'>信号机品牌：<span>` + '海信' + `</span></p>`);
    info.push(`<p class='input-item'>设备IP：<span>` + '192.168.1.88' + `</span></p>`);
    info.push(`<p class='input-item'>维护电话：<span>` + '01086861234' + `</span></p>`);
    info.push(`<p class='input-item'>信号运行阶段：<span>` + '东西直行' +`<b class='icon_phase'></b></span></p>`);
    info.push(`<p class='input-item'>信号运行方案：<span>` + '早高峰' + `</span></p>`);
    info.push(`<p class='input-item'>信号控制方式：<span>` + '实时优化控制' + `</span></p>`);
    info.push(`<p class='input-item' style='height:15px;'></p>`);  
    info.push(`<p style='border-top: 1px #838a9a solid;margin-top:10px;' class='input-item'><span class="paramsBtn">参数配置</span></p>`);
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
  // 底图选择
  onChangeBaseMap = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      baseMapValue: e.target.value,
    });
  };
  render() {
    const {stepTwoFlag, stepThreeFlag, stepFourFlag, stepFiveFlag, stepSixFlag, stepSevenFlag, stepEightFlag, stepNineFlag, turnTab } = this.state
    const { Search } = Input
    return (
      <div className={styles.SignalManagement}>
        <Header {...this.props} />
        {/* 弹层 > 切换底图 */}
        {/* <div className={styles.maskBg}> </div> 遮罩底层*/}
        
        {/* step 2 基础信息配置 */}
        { stepTwoFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
                {  baseMapFlag ?
                  <div className={styles.popBox} style={{top: 'unset', left: 'unset', right: '0', bottom: '28px' }} >
                    <div className={styles.popTit}>选择底图<Icon className={styles.Close} type="close"  onClick={ () => {this.popLayerShowHide("baseMapFlag", null)} } /></div>
                    <div className={styles.popCon}>
                      <div className={styles.typePic}>
                        <Radio.Group name="radiogroup" onChange={this.onChangeBaseMap} value={this.state.baseMapValue}>
                          <Radio value={1}>选择底图</Radio>
                          <Radio value={2}>上次底图</Radio>
                        </Radio.Group>
                      </div>
                      <div className={styles.typePic}>
                        {/* <img src="" /> */}
                        <s>图片预览</s>
                      </div>
                      <div className={styles.typePic}><em>选 择</em></div>
                    </div>
                    <div className={styles.popBottom}>
                      <em>确 定</em>
                      <em onClick={ () => {this.popLayerShowHide("baseMapFlag", null)} }>取 消</em>
                    </div>
                  </div> : null
                  }
                <div className={styles.turnBgBtn} onClick={ () => {this.popLayerShowHide("baseMapFlag", true)} }>路口底图</div>
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>信号机基础信息<em>添加</em></div>
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
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 3 灯组配置 */}
        { stepThreeFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
                
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>灯组列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 4 检测器配置 */}
        { stepFourFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
                
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>检测器列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 5 相位配置 */}
        { stepFiveFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>相位列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 6 阶段配置 */}
        { stepSixFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>阶段列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 7 配时方案配置 */}
        { stepSevenFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>配时方案列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 8 日计划配置 */}
        { stepEightFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>日计划列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        {/* step 9 调度配置 */}
        { stepNineFlag ?
          <div className={styles.stepBoxContent}>
            <div className={styles.stepLeftCon}>
              <div className={styles.leftItemCon}>
                {/* 内部变化内容 */}
              </div>
            </div>
            <div className={styles.stepRightCon}>
              <div className={styles.conBox}>
                <div className={styles.rTit}>调度配置列表<em>添加</em></div>
                {/* 列表 */}
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
              </div>
            </div>
          </div> : null
        }
        { turnTab ?
            <InterworkingList showInterworkingList={this.showInterworkingList} /> : null
          }
        <div className={styles.navContent}>
          <div className={styles.navBoxMenu}>
            <span className={styles.hover} onClick={ ()=>{ this.showHidePop("", true) } }>请选择路口</span>
            <s className={stepTwoFlag || stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepTwoFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepTwoFlag", true) } }>基础信息配置</span>
            <s className={stepThreeFlag || stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag  ? styles.hover : ""}></s>
            <span className={stepThreeFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepThreeFlag", true) } }>灯组配置</span>
            <s className={stepFourFlag || stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag  ? styles.hover : ""}></s>
            <span className={classNames(stepFourFlag ? styles.hover : null, styles.link)} onClick={ ()=>{ this.showHidePop("stepFourFlag", true) } }>检测器配置</span>
            <s className={stepFiveFlag || stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag  ? styles.hover : ""}></s>
            <span className={stepFiveFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepFiveFlag", true) } }>相位配置</span>
            <s className={stepSixFlag || stepSevenFlag || stepEightFlag || stepNineFlag  ? styles.hover : ""}></s>
            <span className={stepSixFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepSixFlag", true) } }>阶段配置</span>
            <s className={stepSevenFlag || stepEightFlag || stepNineFlag  ? styles.hover : ""}></s>
            <span className={stepSevenFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepSevenFlag", true) } }>配时方案配置</span>
            <s className={stepEightFlag || stepNineFlag ? styles.hover : ""}></s>
            <span className={stepEightFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepEightFlag", true) } }>日计划配置</span>
            <s className={stepNineFlag ? styles.hover : ""}></s>
            <span className={stepNineFlag ? styles.hover : null} onClick={ ()=>{ this.showHidePop("stepNineFlag", true) } }>调度配置</span>
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
          <CustomTree />
        </div>
        <div className={styles.mapContent} id='mapContent'>
          <div className={styles.tagMarker}>
            <div className={styles.statusBox}>
              <span className={styles.tagOnLine}>在线设备9处</span>
              <span className={styles.tagOffLine}>离线设备3处</span>
            </div>
            <div className={styles.turnBtn} onClick={() => this.showInterworkingList(true)}></div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignalManagement
