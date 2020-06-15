import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './LogFault.scss'

class LogFault extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.LogFault}>
        <Header {...this.props} />
        <div className={styles.InterworkingList}>
          <InterworkingList />
        </div>
      </div>
    )
  }
}

export default LogFault
