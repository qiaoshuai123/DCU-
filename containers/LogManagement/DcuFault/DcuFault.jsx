import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './DcuFault.scss'

class DcuFault extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.DcuFault}>
        <Header {...this.props} />
        <div className={styles.InterworkingList}>
          <InterworkingList />
        </div>
      </div>
    )
  }
}

export default DcuFault
