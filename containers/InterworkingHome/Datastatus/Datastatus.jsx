import React, { Component } from 'react'
import { Input } from 'antd'
import Header from '../../..//components/Header/Header'
import styles from './Datastatus.scss'

class Datastatus extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { Search } = Input
    return (
      <div className={styles.Datastatus}>
        <Header {...this.props} />
      </div>
    )
  }
}

export default Datastatus
