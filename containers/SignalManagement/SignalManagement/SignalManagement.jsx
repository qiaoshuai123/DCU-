import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import styles from './SignalManagement.scss'

class SignalManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.SignalManagement}>
        <Header {...this.props} />
      </div>
    )
  }
}

export default SignalManagement
