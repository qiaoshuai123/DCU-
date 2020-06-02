import React from 'react'
import echarts from 'echarts'

class LineCharts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      legend: null,
      series: null,
      nodata: true,
    }
    this.keyNum = Math.random()
  }
  componentDidMount = () => {
    const chartsBox = echarts.init(this.chartsBox)
    this.renderCharts(chartsBox)
  }
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    // // if (this.props.chartsData !== nextProps.chartsData) {
    // const datas = nextProps.chartsData

    // // chartsBox.showLoading({
    // //   text: 'Please Waitting...',
    // //   color: '#c23531',
    // //   textColor: '#fff',
    // //   maskColor: '#263246',
    // //   zlevel: 0
    // // })
    // if (!!datas && datas.time.length > 0) {
    //   // chartsBox.hideLoading()
    //   this.setState({ nodata: false }, () => {
    //     const chartsBox = echarts.init(this.chartsBox)
    //     this.renderCharts(chartsBox, datas.legend, datas.time, datas.series)
    //   })
    // } else {
    //   // chartsBox.showLoading({
    //   //   text: '暂无数据',
    //   //   color: '#c23531',
    //   //   textColor: '#fff',
    //   //   maskColor: '#263246',
    //   //   zlevel: 0
    //   // })
    //   this.setState({ nodata: true })
    // }
    // }
  }
  renderCharts = (menuChart2, legend, time, series) => {
    console.log(legend, time, series)
    // 绘制图表
    const options = {
      title: {
        // subtext: '单位：次/车',
        textStyle: {
          fontSize: 16,
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      toolbox: {
        show: true,
        top: 20,
        right: 10,
        feature: {
          magicType: { show: true, type: ['line', 'bar'] },
        },
        iconStyle: {
          normal: {
            color: 'white', // 设置颜色
          },
        },
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '5%',
        top: '20%',
        containLabel: true,
      },
      legend: {
        data: ['东进口左转', '东进口直行', '东南进口左转', '东南进口直行', '西南进口左转', '西南进口直行', '西北进口左转', '西北进口直行', '西北进口左转1', '西北进口直行1'],
        // data: legend,
        top: 10,
        textStyle: {
          color: '#fff',
        },
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['10:50', '10:55', '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50'],
          // data: time,
          axisLabel: { // X轴文字
            textStyle: {
              fontSize: 12,
              color: '#fff',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#f1f1fb',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: { // Y轴刻度值
            formatter: '{value}',
            textStyle: {
              fontSize: 12,
              color: '#fff',
            },
          },
        },
      ],
      series: [
        {
          name: '东进口左转',
          type: 'line',
          data: [2.0, 4.9, 1.0, 33.2, 25.6, 75.7, 25.6, 162.2, 32.6, 20.0, 6.4, 3.3, 33],
        },
      ],
      // series,
    }
    menuChart2.setOption(options, true)
  }
  render() {
    // if (!this.state.nodata) {
    //   return (
    //     <div ref={(input) => { this.chartsBox = input }} style={{ height: '300px' }} key={this.keyNum + this.state.nodata} />
    //   )
    // }
    // return (
    //   <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    //     <div className="nodataBox" />
    //   </div>
    // )
    return (
      <div ref={(input) => { this.chartsBox = input }} style={{ height: '300px' }} key={this.keyNum + this.state.nodata} />
    )
  }
}

export default LineCharts
