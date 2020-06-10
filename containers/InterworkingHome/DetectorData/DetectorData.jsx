import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../..//components/Header/Header'
import styles from './DetectorData.scss'

class DetectorData extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.DetectorData}>
        <Header {...this.props} />
      </div>
    )
  }
}

export default DetectorData
