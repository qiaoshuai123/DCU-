import React, { Component } from 'react'
import styles from './optimizeList.scss'


class OptimizeList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className={styles.mountingTable}>
        <div className={styles.mountingThead}>
          <div className={styles.mountingTh}>交叉口饱和度</div>
          <div className={styles.mountingTh}>交叉口服务水平</div>
          <div className={styles.mountingTh}>交叉口通行流量</div>
          <div className={styles.mountingTh}>实际通行能力</div>
        </div>
        <div className={styles.mountingTbody}>
          <div className={styles.mountingTr}>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
          </div>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>交叉口饱和度</div>
            <div className={styles.mountingTh}>交叉口服务水平</div>
            <div className={styles.mountingTh}>交叉口通行流量</div>
          </div>
          <div className={styles.mountingTr}>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
          </div>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>交叉口饱和度</div>
            <div className={styles.mountingTh}>交叉口服务水平</div>
            <div className={styles.mountingTh}>交叉口通行流量</div>
          </div>
          <div className={styles.mountingTr}>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
            <div className={styles.mountingTd}>*************</div>
          </div>
        </div>
      </div>
    )
  }
}

export default OptimizeList
