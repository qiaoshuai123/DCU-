import React, { Component } from 'react'
import Header from '../Header/Header'
import { Select, Input } from 'antd'
import OptimizeList from './optimizeList/optimizeList'
import EchartsPage from '../../../components/ecahrtsPage/EchartsPage'
import OptimizeListT from './optimizeListT/optimizeListT'
import styles from './optimize.scss'


class Optimize extends Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1,
    }
    this.echartsprogramme = {
      option: {
        legend: {
          right: '5%', // 图列相对容器的位置 top\bottom\left\right
          selected: {
            // '销量': true  // 图列选择，图形加载出来会显示选择的图列，默认为true
          },
          textStyle: { // 图列内容样式
            color: '#fff', // 字体颜色
            // backgroundColor: 'black', // 字体背景色
          },
        },
        tooltip: {},
        dataset: {
          source: [
            ['product', '2015', '2016'],
            ['Matcha Latte', 43.3, 85.8],
            ['Milk Tea', 83.1, 73.4],
            ['Cheese Cocoa', 86.4, 65.2],
            ['Walnut Brownie', 72.4, 53.9],
          ],
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#1C385F', // 轴的颜色1E385D
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#FFFFFF', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: '#1C385F', // 轴的颜色1E385D
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
            show: true,
            textStyle: {
              color: '#FFFFFF', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
        ],
      },
    }
    this.echarts = {
      echarts1: {
        option: {
          color: ['#0189FF', '#FF8C3C', '#F10282'],
          graphic: {
            type: 'text',
            left: 'center',
            bottom: '40%',
            style: {
              text: `10`,
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
            showDelay: 20,
            hideDelay: 20,
            backgroundColor: 'rgba(255,0,0,0.7)',
            textStyle: {
              fontSize: '16px',
              color: '#000',
            },
            formatter: '{b} : {c}个 ({d}%)',
          },
          series: [
            {
              name: '未完成',
              type: 'pie',
              selectedMode: 'single',
              radius: [20, '30%'],

              label: {
                normal: {
                  position: 'inner',
                },
              },
              // labelLine: {
              //   normal: {
              //     show: false,
              //   },
              // },
            },
            {
              name: '已完成',
              type: 'pie',
              radius: ['40%', '55%'],
              data: [
                { value: 332, name: '离线设备' },
                { value: 55, name: '异常设备' },
                { value: 88, name: '在线设备' },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        },
      },
      echarts2: {
        option: {
          color: ['#0189FF', '#FF8C3C', '#F10282'],
          graphic: {
            type: 'text',
            left: 'center',
            bottom: '40%',
            style: {
              text: `20`,
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
            showDelay: 20,
            hideDelay: 20,
            backgroundColor: 'rgba(255,0,0,0.7)',
            textStyle: {
              fontSize: '16px',
              color: '#000',
            },
            formatter: '{b} : {c}个 ({d}%)',
          },
          series: [
            {
              name: '未完成',
              type: 'pie',
              selectedMode: 'single',
              radius: [20, '30%'],

              label: {
                normal: {
                  position: 'inner',
                },
              },
              // labelLine: {
              //   normal: {
              //     show: false,
              //   },
              // },
            },
            {
              name: '已完成',
              type: 'pie',
              radius: ['40%', '55%'],
              data: [
                { value: 332, name: '离线设备' },
                { value: 55, name: '异常设备' },
                { value: 88, name: '在线设备' },
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        },
      },
    }
    this.dataList = [//模拟数据
      1, 2, 3, 4, 5, 6,
    ]
    this.num = 4
    this.nums = 0
    this.assessmentList = [
      {
        id: 1,
        name: '排队长度',
      },
      {
        id: 2,
        name: '停车次数',
      },
      {
        id: 3,
        name: '延迟时间',
      },
    ]
  }
  componentDidMount() {
    // eslint-disable-next-line react/no-string-refs
    this.uls = this.refs.uls
    // eslint-disable-next-line prefer-destructuring
    const length = this.dataList.length
    this.uls.style.width = `${length * 317} px`
  }
  handleChange = (value) => {
    // console.log(`selected ${value}`)
  }
  next = () => {
    if (this.num >= this.dataList.length) {
      return
    }
    this.nums++
    this.num++
    this.uls.style.left = `${-317 * this.nums}px`
  }
  prev = () => {
    if (this.num <= 4) {
      return
    }
    this.nums--
    this.num--
    this.uls.style.left = `${-317 * this.nums}px`
  }
  btnclick(id) {
    this.setState({
      num: id,
    })
  }
  onChange = (a, b, c) => {
    console.log(a, b, c)
  }

  render() {
    const { Option } = Select
    const { Search } = Input
    const { num } = this.state
    return (
      <div className={styles.speciaTaskBox}>
        <Header {...this.props} />
        <div className={styles.speciaContainer}>
          <div className={styles.speciaContainer_left}>
            <div className={styles.speciaContainer_left_top}>
              <Select defaultValue="lucy" style={{ width: '30%', marginRight: '5px' }} onChange={this.handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled">Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
              <Search
                placeholder="input search text"
                onSearch={value => console.log(value)}
                style={{ width: '60%' }}
              />
            </div>
            <div className={styles.speciaContainer_left_bom}>
              11
            </div>
          </div>
          <div className={styles.speciaContainer_center}>
            <div className={styles.speciaContainer_center_top}>
              世纪大道与海甸五西路路口
            </div>
            <ul className={styles.speciaContainer_center_bom}>
              <li>11LAU063T70-SS102098</li>
              <li>通讯状态 : <span>在线</span></li>
              <li>信号灯状态 : <span>开灯</span></li>
              <li>运行状态 : <span>信号系统自主控制</span></li>
            </ul>
          </div>
          <div className={styles.speciaContainer_right}>
            <div className={styles.speciaContainer_right_one}>
              <OptimizeList />
            </div>
            <div className={styles.speciaContainer_right_two}>
              <p>实时优化方案控制 <span>方案编号:2020202022202-1</span></p>
              <p>实时优化方案产出时间:2019年05月25日 08:35,超出30分钟失效</p>
              <div className={styles.speciaContainerLB_canvas}>
                <div> <EchartsPage {...this.echarts.echarts1} /></div>
                <div> <EchartsPage {...this.echarts.echarts2} /></div>
              </div>
              <div className={styles.speciaContainerLB_list}>
                <OptimizeListT />
              </div>
              <div className={styles.speciaContainerLB_bom}>
                <span>优化控制操作:</span>
                <Select defaultValue="lucy" style={{ width: '30%' }} onChange={this.handleChange}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled">Disabled</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <div><span className={styles.spans}>执行</span></div>
                <div><span className={styles.spans}>优化控制管理</span></div>
              </div>
            </div>
            <div className={styles.speciaContainer_right_tre}>
              <p>方案预评估</p>
              <ul>
                {
                  this.assessmentList.map(item => <li key={item.id} onClick={() => this.btnclick(item.id)}>{item.name}<span className={num === item.id ? styles.active : ''}> </span></li>)
                }
              </ul>
              <div>
                <EchartsPage {...this.echartsprogramme} />
              </div>

            </div>
          </div>
          <div className={styles.swipers}>
            <ul className={styles.uls}>
              <li>流量</li>
              <li>延误</li>
              <li>停车</li>
              <li>排队</li>
            </ul>
            <div className={styles.swiperRig}>
              <div className={styles.swiperRig_left}>
                <div onClick={this.prev}>
                  <span></span>
                </div>
              </div>
              <div className={styles.swiperRig_center}>
                <ul ref="uls">
                  {
                    this.dataList.map((item, ind) =>
                      (<li key={ind}>
                        <p>设备编号:1000227$1$041</p>
                        <p>位置:世纪大道-********</p>
                        <div>
                          {item}
                        </div>
                      </li>)
                    )
                  }

                </ul>
              </div>
              <div className={styles.swiperRig_right}>
                <div onClick={this.next}>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Optimize
