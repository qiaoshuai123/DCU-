import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../../components/Header/Header'
import styles from './UserManagement.scss'

class UserManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.UserManagement}>
        <Header {...this.props} />
      </div>
    )
  }
}

export default UserManagement
