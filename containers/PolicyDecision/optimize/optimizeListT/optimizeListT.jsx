import React, { Component } from 'react'
import styles from './optimizeListT.scss'


class OptimizeListT extends Component {
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
          <div className={styles.mountingTh}>A</div>
          <div className={styles.mountingTh}>B</div>
          <div className={styles.mountingTh}>C</div>
          <div className={styles.mountingTh}>D</div>
          <div className={styles.mountingTh}>E</div>
        </div>
        <div className={styles.mountingTbody}>
          <div className={styles.mountingTr}>
            <div className={styles.mountingTd}>相位时间(s)</div>
            <div className={styles.mountingTd}>28</div>
            <div className={styles.mountingTd}>105</div>
            <div className={styles.mountingTd}>31</div>
            <div className={styles.mountingTd}>31</div>
            <div className={styles.mountingTd}>31</div>
          </div>
          <div className={styles.mountingThead}>
            <div className={styles.mountingTh}>绿信比(%)</div>
            <div className={styles.mountingTh}>19</div>
            <div className={styles.mountingTh}>49</div>
            <div className={styles.mountingTh}>49</div>
            <div className={styles.mountingTh}>49</div>
            <div className={styles.mountingTh}>49</div>
          </div>
          <div className={styles.mountingTr}>
            <div className={styles.mountingTd}>周期</div>
            <div className={styles.mountingTd}>213</div>
          </div>
        </div>
      </div>
    )
  }
}

export default OptimizeListT
