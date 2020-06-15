import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './CommunicationFault.scss'

class CommunicationFault extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.CommunicationFault}>
        <Header {...this.props} />
        <div className={styles.InterworkingList}>
          <InterworkingList />
        </div>
      </div>
    )
  }
}

export default CommunicationFault
