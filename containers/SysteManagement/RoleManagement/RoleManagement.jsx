import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import styles from './RoleManagement.scss'

class RoleManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.RoleManagement}>
        <Header {...this.props} />
      </div>
    )
  }
}

export default RoleManagement
