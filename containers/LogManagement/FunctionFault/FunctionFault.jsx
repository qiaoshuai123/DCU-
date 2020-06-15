import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import InterworkingList from './InterworkingList/InterworkingList'
import styles from './FunctionFault.scss'

class FunctionFault extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.FunctionFault}>
        <Header {...this.props} />
        <div className={styles.InterworkingList}>
          <InterworkingList />
        </div>
      </div>
    )
  }
}

export default FunctionFault
