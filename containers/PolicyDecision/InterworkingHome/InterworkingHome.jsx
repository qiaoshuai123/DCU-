import React, { Component } from 'react'
import Header from '../Header/Header'
import echarts from 'echarts'
import From from './form/Form'
import EchartsPage from '../../../components/ecahrtsPage/EchartsPage'
import styles from './InterworkingHome.scss'

class SignalHome extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.fromlist = {
      form1: {
        name: '最新手控路口',
        headOne: '区域',
        headTwo: '路口名称',
        headTre: '最新控制时间',
      },
      form2: {
        name: '本月手控路口次数TOP15',
        headOne: '路口名称',
        headTwo: '当月控制次数',
        headTre: '最新控制时间',
      },
      form3: {
        name: '最新方案配时变更路数TOP15',
        headOne: '区域名称',
        headTwo: '路口名称',
        headTre: '配时变更时间',
      },
    }
    this.echarts = {
      echarts1: {
        option: {
          color: ['#3398DB'],
          title: {
            text: '实时信号控制状态',
            textStyle: {
              fontWeight: 'normal',
              color: '#FFFFFF',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: [''],
            textStyle: { // ----图例内容样式
              color: '#FFFFFF', // ---所有图例的字体颜色
              // backgroundColor:'black',  //---所有图例的字体背景色
            },
          },
          grid: {
            show: false, // ---是否显示直角坐标系网格
            top: '13%', // 等价于 y: '16%'
            left: '13%',
            bottom: '58', // ---相对位置，top\bottom\left\right
            containLabel: false, // ---grid 区域是否包含坐标轴的刻度标签
          },
          xAxis: {
            type: 'category',
            data: ['离点断线', '关灯控制', '全红控制', '黄闪控制', '本地多时段', '本地感应', '中心多时段', '勤务控制'],
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF', // 更改坐标轴文字颜色
                fontSize: 14, // 更改坐标轴文字大小
              },
              interval: 0,
              formatter(value) {
                let ret = ''
                const maxLength = 2 // 每项显示文字个数
                const valLength = value.length // X轴类目项的文字个数
                const rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                if (rowN > 1) { // 如果类目项的文字大于3
                  for (let i = 0; i < rowN; i++) {
                    let temp = '' // 每次截取的字符串
                    const start = i * maxLength // 开始截取的位置
                    const end = start + maxLength // 结束截取的位置
                    temp = `${value.substring(start, end)}\n`
                    ret += temp // 凭借最终的字符串
                  }
                  return ret
                }
                return value
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              // show: true,
              lineStyle: {
                color: '#1C385F', // 轴的颜色
              },
            },
          },
          yAxis: {
            type: 'value',
            splitLine: { // ---grid 区域中的分隔线
              show: true, // ---是否显示，'category'类目轴不显示，此时我的X轴为类目轴，splitLine属性是无意义的
              lineStyle: {
                color: ['#143058'],
                width: 1,
                type: 'solid',
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF', // 更改坐标轴文字颜色
                fontSize: 14, // 更改坐标轴文字大小
              },
            },
            axisLine: {
              lineStyle: {
                color: '#1C385F', // 轴的颜色
              },
            },
          },
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: [60, 80, 120, 160, 120, 100, 60, 40],
              itemStyle: {// 柱状图圆角
                // emphasis: {
                //   barBorderRadius: 7,
                // },
                normal: {
                  barBorderRadius: [5, 5, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: '#05427B', // 0% 处的颜色
                  }, {
                    offset: 0.6,
                    color: '#2099B4', // 60% 处的颜色
                  }, {
                    offset: 1,
                    color: ' #39E8DB ', // 100% 处的颜色
                  }], false),
                },
              },
            },
          ],
        },
      },
      echarts2: {
        option: {
          color: ['#00cf4d', '#d3692f', '#0f85ff'],
          title: {
            text: '信号机实时状态统计',
            textStyle: {
              fontWeight: 'normal',
              color: '#FFFFFF',
            },
          },
          graphic: {
            type: 'text',
            left: 'center',
            bottom: '35%',
            style: {
              text: ` ${'215处'}  \n  ${'信号机总数'}  \n\n`,
              textAlign: 'center',
              fontSize: 16,
              // font: 'italic bolder 30px cursive',
              fill: '#fff',
              width: 30,
              height: 30,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          // legend: {
          //   orient: 'vertical',
          //   left: 10,
          //   data: ['离线设备', '在线设备', '异常设备'],
          // },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center',
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold',
                  },
                },
              },
              itemStyle: {
                normal: {
                  color(params) {
                    // 自定义颜色
                    const colorList = [
                      '#0f85ff', '#d3692f', '#00cf4d',
                    ]
                    return colorList[params.dataIndex]
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: [
                { value: 332, name: '离线设备' },
                { value: 55, name: '异常设备' },
                { value: 88, name: '在线设备' },
              ],
            },
          ],
        },
      },
      echarts3: {
        option: {
          color: ['#FBD106', '#2FF4F1'],
          title: {
            text: '折线图堆叠',
            textStyle: {
              fontWeight: 'normal',
              color: '#FFFFFF',
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false, // 设为false首个在y轴
            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
            axisLine: {
              lineStyle: {
                color: '#1C385F', // 轴的颜色
              },
            },
            splitLine: { // ---grid 区域中的分隔线
              show: true, // ---是否显示，'category'类目轴不显示，此时我的X轴为类目轴，splitLine属性是无意义的
              lineStyle: {
                color: ['#143058'],
                width: 1,
                type: 'solid',
              },
            },
            axisLabel: {
              rotate: 45, // 旋转角度
              textStyle: {
                color: '#FFFFFF', // 更改坐标轴文字颜色
                fontSize: 12, // 更改坐标轴文字大小
              },
              interval: 0, // 设置X轴数据间隔几个显示一个，为0表示都显示
            },
          },
          yAxis: {
            type: 'value',
            splitLine: { // ---grid 区域中的分隔线
              show: true, // ---是否显示，'category'类目轴不显示，此时我的X轴为类目轴，splitLine属性是无意义的
              lineStyle: {
                color: ['#143058'],
                width: 1,
                type: 'solid',
              },
            },

            axisLabel: {
              show: true,
              textStyle: {
                color: '#FFFFFF', // 更改坐标轴文字颜色
                fontSize: 14, // 更改坐标轴文字大小
              },
            },
            axisLine: {
              // show: true,
              lineStyle: {
                color: '#1C385F', // 轴的颜色
              },
            },

          },
          series: [
            {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              symbol: 'none', // 设置折线弧度，取值：0-1之间
              smooth: 0.5,
              data: [120, 132, 101, 134, 90, 230, 210],
            },
            {
              name: '联盟广告',
              type: 'line',
              stack: '总量',
              symbol: 'none', // 设置折线弧度，取值：0-1之间
              smooth: 0.5,
              data: [220, 182, 191, 234, 290, 330, 310],
            },
          ],
        },
      },
    }
  }

  render() {
    return (
      <div className={styles.signalHomeBox}>
        <Header {...this.props} />
        <div className={styles.signaContainer}>
          <div className={styles.signaContainer_left}>
            <div className={styles.signaContainer_left_box}><From {...this.fromlist.form1} /></div>
            <div className={styles.signaContainer_left_box}><EchartsPage {...this.echarts.echarts1} /></div>
            <div className={`${styles.signaContainer_left_box} ${styles.signaContainer_left_boxer}`}>
              <div className={styles.signaContainerLB_left}>
                <EchartsPage {...this.echarts.echarts2} />
              </div>
              <div className={styles.signaContainerLB_right}>
                <dl>
                  <dt><b className={styles.bone}></b><li>ATC</li><li className={styles.lione}>在线2处</li></dt>
                  <dd><b></b><li className={styles.nums}>25%</li><li className={styles.lione}>离线0处</li></dd>
                </dl>
                <dl>
                  <dt><b className={styles.btwo}></b><li>ATC</li><li className={styles.litwo}>在线2处</li></dt>
                  <dd><b></b><li className={styles.nums}>25%</li><li className={styles.litwo}>离线0处</li></dd>
                </dl>
                <dl>
                  <dt><b className={styles.bthr}></b><li>ATC</li><li className={styles.lithr}>在线2处</li></dt>
                  <dd><b></b><li className={styles.nums}>25%</li><li className={styles.lithr}>离线0处</li></dd>
                </dl>
              </div>
            </div>
          </div>
          <div className={styles.signaContainer_center}>
            <div className={`${styles.road_show_item} ${styles.buling}`}>
              <div><span>全市</span><span>信号点位</span></div>
              <div>
                <span>2</span>
                <span>3</span>
                <span>0</span>
              </div><div>处</div>
            </div>
            <div className={`${styles.road_show_item} ${styles.buling}`}>
              <div><span>全市</span><span>信号点位</span></div>
              <div>
                <span>2</span>
                <span>3</span>
                <span>0</span>
              </div><div>处</div>
            </div>
            <div className={`${styles.road_show_item} ${styles.buling}`}>
              <div><span>海信</span><span>接入</span></div>
              <div>
                <span>2</span>
                <span>9</span>
                <span>0</span>
              </div><div>处</div>
            </div>
            <div className={`${styles.road_show_item} ${styles.buling}`}>
              <div><span>ATC</span><span>接入</span></div>
              <div>
                <span>2</span>
                <span>9</span>
                <span>0</span>
              </div><div>处</div>
            </div>
          </div>
          <div className={styles.signaContainer_right}>
            <div className={styles.signaContainer_left_box}><From {...this.fromlist.form2} /></div>
            <div className={styles.signaContainer_left_box}><From {...this.fromlist.form3} /></div>
            <div className={styles.signaContainer_left_box}><EchartsPage {...this.echarts.echarts3} /></div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignalHome
