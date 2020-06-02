import React, { Component } from 'react'
import echarts from 'echarts'
import styles from './EchartsPage.scss'

class EchartsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    const { option } = this.props
    const cavs = this.refs.brokens
    const myChart = echarts.init(cavs)
    myChart.setOption(option)
  }
  render() {
    return (
      <div className={styles.echartsbox}>
        <div ref="brokens" style={{ width: '100%', height: '100%' }} />
      </div>
    )
  }
}

export default EchartsPage
