import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import styles from './JurManagement.scss'

class JurManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.JurManagement}>
        <Header {...this.props} />
      </div>
    )
  }
}

export default JurManagement
