import React from 'react'
import $ from 'jquery'

import './GreenWaveCharts.css'

class RealTimeDetection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xAxisArr: null,
    }
    this.W = 950 // 容器width
    this.H = 345 // 容器height
    this.xAxis = this.props.totleDistance // x轴的总距离（后期表示数据中各个路口距离之和）
    this.yAxis = 160 // y轴的总时间s
    this.Hs = this.H / this.yAxis // 每秒所占px值
    this.Ws = this.W / this.xAxis // 每千米所占px值
    this.ySplit = 10 // y轴分10份
    this.ySplitS = this.yAxis / this.ySplit // y轴每份的秒数
    this.yScaleH = this.Hs * this.ySplitS // y轴每个刻度的高度
    this.xSplit = 5 // x轴分5份
    this.xSplitD = this.xAxis / this.xSplit // x轴每份的距离
    this.xScaleW = this.Ws * this.xSplitD // x轴每个刻度的宽度
    this.cycleTime = 196 // 路口周期时长（后期获取各路口中的phaseList中的cycle_time）
    this.greenTime = 40 // 路口绿灯时长 （后期获取各个路口中的phaseList中的spliteTIme）
    this.redTime = this.cycleTime - this.greenTime // 红灯时长
    this.xAxisArr = [] // new Array(this.xSplit).fill(0)
    this.yAxisArr = new Array(this.ySplit).fill(0)
    this.repeatBox = new Array(3).fill(0)
    this.len = 0 // 路口到0点的距离
    this.unitMsg = []
    this.greenPositions = []
    this.reversePositions = []
    this.svgs = []
    this.reverseSvgs = []
    this.cycleNumArr = []
    this.reverseCycleNumArr = []
    this.reverseWave = []
    this.wrapperStyle = {
      position: 'absolute',
      top: '-1px',
      left: 0,
      width: '100%',
      height: '345px',
      backgroundColor: '#1f2c3d',
      zIndex: 2,
    }
  }
  UNSAFE_componentWillMount = () => {
    console.log(this.props)
  }
  componentDidMount = () => {
    const chartsData = this.props.chartsData
    chartsData.forEach((item, index) => {
      this.xAxisArr.push(item.lenAll)
    })
    this.setState({ xAxisArr: this.xAxisArr })
    this.props.getCalculateHs(this.Hs)
  }
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const chartsData = nextProps.chartsData
    chartsData.forEach((item, index) => {
      this.xAxisArr.push(item.lenAll)
    })
    nextProps.getCalculateHs(this.Hs)
  }
  render() {
    return (
      <div className="greenWaveBox">
        {/* <div className="greenWrapper" id="greenWrapper" style={this.wrapperStyle}></div> */}
        <div style={{ zIndex: 3, position: 'absolute', top: 0, left: 0, width: '100%', height: this.props.coverH + 'px', backgroundColor: '#1f2c3d' }} />
        <div id="lineBox" className="lineWrapper" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%' }}>
          <svg id="svgBox" width="1000px" height="350px" viewBox="0 0 1000 350">
            {
              this.props.linePositions &&
              this.props.linePositions.map((item, index) => {
                return (
                  <g key={index}>
                    <line x1={item[0]} y1={item[1]} x2={item[2]} y2={item[3]} stroke="green" strokeWidth="2" />
                  </g>
                )
              })
            }
            {
              this.props.endLinePositions &&
              this.props.endLinePositions.map((item, index) => {
                return (
                  <g key={index}>
                    <line x1={item[0]} y1={item[1]} x2={item[2]} y2={item[3]} stroke="#c1ffc1" strokeWidth="2" />
                  </g>
                )
              })
            }
            {
              this.props.linePositions2 &&
              this.props.linePositions2.map((item, index) => {
                return (
                  <g key={index}>
                    <line x1={item[0]} y1={item[1]} x2={item[2]} y2={item[3]} stroke="green" strokeWidth="2" />
                  </g>
                )
              })
            }
            {
              this.props.endLinePositions2 &&
              this.props.endLinePositions2.map((item, index) => {
                return (
                  <g key={index}>
                    <line x1={item[0]} y1={item[1]} x2={item[2]} y2={item[3]} stroke="#c1ffc1" strokeWidth="2" />
                  </g>
                )
              })
            }
          </svg>
        </div>
        <div className="begainBox">0</div>
        <div className="xCoordinate"><div className="xarrows"></div></div>
        <div className="yCoordinate"><div className="yarrows"></div></div>
        {
          this.yAxisArr.map((item, index) => {
            return (
              <div className="yAxisBox" style={{ height: this.yScaleH + 'px', bottom: index * this.yScaleH + 'px' }} key={'y' + index}>
                <div style={{ position: 'relative' }}>
                  <span className="yScaleText">{this.ySplitS * (index +1)}</span>
                </div>
              </div>
            )
          })
        }
        {
          this.state.xAxisArr &&
          this.xAxisArr.map((item, index) => {
            const interMsg = this.props.chartsData[index]
            if (!!interMsg) {
              return (
                <div className="xAxisBox" style={{ width: this.Ws * item + 'px', left: '0px' }} key={'x' + index}>
                  <div style={{ position: 'relative' }}>
                    <span className="xScalText">{item}</span>
                    <div className="realTimeDetectionBox" style={{ display: 'flex', position: 'absolute', top: '-345px', right: '-13px', height: '345px', width: '13px', overflow: 'hidden'}}>
                      <div id={'detection' + index} className="detectionBoxs" style={{ position: 'absolute', bottom: '0', width: '100%', fontSize: '12px', transform: 'rotate(180deg)', transition: 'all ease 0s' }}>
                        
                      </div>
                    </div>
                    <div className="realTimeDetectionBox2" style={{ display: 'flex', position: 'absolute', top: '-345px', right: '-35px', height: '345px', width: '13px', overflow: 'hidden'}}>
                      <div id={'detection2' + index} className="detectionBoxs2" style={{ position: 'absolute', bottom: '0', width: '100%', fontSize: '12px', transform: 'rotate(180deg)', transition: 'all ease 0s' }}>
                        
                      </div>
                    </div>
                  </div>
                  <div className="xAxisInterMsg" style={{ left: this.Ws * item - 20 + 'px' }} key={interMsg.inter_name + interMsg.forwordSpeed + interMsg.reverseSpeed + index}>
                    <div>{interMsg.inter_name}</div>
                    <div>周期：{interMsg.phaseList.length > 0 ? interMsg.phaseList[0].cycle_time : 0}秒</div>
                    <div>速度(正)：{interMsg.forwordSpeed}km/h</div>
                    <div>速度(反)：{interMsg.reverseSpeed}km/h</div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }
}

export default RealTimeDetection
