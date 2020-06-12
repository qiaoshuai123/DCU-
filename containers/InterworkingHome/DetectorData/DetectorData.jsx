import React, { Component } from 'react'
import Header from '../../..//components/Header/Header'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './DetectorData.scss'

class DetectorData extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className={styles.DetectorData}>
        <Header {...this.props} />
        <div className={styles.InterworkingList}>
          <InterworkingList />
        </div>
      </div>
    )
  }
}

export default DetectorData
