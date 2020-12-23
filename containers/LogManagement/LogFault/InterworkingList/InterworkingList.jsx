import React, { Component } from 'react'
import { Input, Pagination, DatePicker, message } from 'antd'
import moment from 'moment'
import styles from './InterworkingList.scss'

import getResponseDatas from '../../../../utils/getResponseDatas'
import resetTimeStep from '../../../../utils/resetTimeStep'
import getRequestBaseUrl from '../../../../utils/getRequestBaseUrl'


class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: null,
      totalPage: 0,
      currentPage: 1,
      startTime: '',
      endTime: '',
    }
    this.logList = '/DCU/log/list'
    this.listParams = {
      pageNo: 1,
      keyword: '',
      startTime: '',
      endTime: '',
    }
    this.exportUrl = '/DCU/log/exportDcuFaultList'
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
  }
  componentDidMount = () => {
    this.getLogFaultLists()
    this.userLimit = (JSON.parse(localStorage.getItem('userLimit'))).map(item => item.id)
  }
  // 转格式
  getFormData = (obj) => {
    const formData = new FormData()
    Object.keys(obj).forEach((item) => {
      formData.append(item, obj[item])
    })
    return formData
  }
  getLogFaultLists = () => {
    getResponseDatas('post', this.logList, this.getFormData(this.listParams)).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        this.setState({
          systemList: data.list,
          totalPage: data.totalCount,
        })
      }
    })
  }
  getResetParams = (params) => {
    if (JSON.stringify(params) !== '{}') {
      let newParams = '?'
      const resetParams = Object.keys(params)
      const lengths = resetParams.length
      Object.keys(params).forEach((item, index) => {
        newParams += `${item}=${params[item]}${index !== lengths - 1 ? '&' : ''}`
      })
      return newParams
    }
    return params
  }
  getresetPwd = (id) => {
    window.open(`#roaddetail/${id}`)
  }
  handleChangePage = (page) => {
    this.listParams.pageNo = page
    this.setState({ currentPage: page })
    this.getLogFaultLists()
  }
  handleSearchList = () => {
    this.getLogFaultLists()
  }

  handleStartTimeChange = (moments, dateString) => {
    const timeStep = moments._d.getTime()
    this.listParams.startTime = timeStep
    this.setState({
      startTime: moment(dateString)
    })
  }
  handleEndTimeChange = (moments, dateString) => {
    if (this.listParams.startTime > moments._d.getTime()) {
      message.error('结束时间不能小于开始时间')
    } else {
      const timeStep = moments._d.getTime()
      this.listParams.endTime = timeStep
      this.setState({
        endTime: moment(dateString)
      })
    }
  }
  handleKeyWordChange = (e) => {
    this.listParams.keyword = e.target.value
  }
  // 导出excel表格
  exportTable = () => {
    window.location.href = `${getRequestBaseUrl()}${this.exportUrl}${this.getResetParams(this.listParams)}&Authorization=${this.token}`
  }
  render() {
    const { systemList, totalPage, currentPage, startTime, endTime } = this.state
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>操作日志</div>
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input onChange={this.handleKeyWordChange} /></div>
          </div>
          <div className={styles.syetem_item} style={{ flex: 1.2 }}>
            <span className={styles.item}>日志时间:</span>
            <div className={styles.inSle}><DatePicker showTime value={startTime} onChange={this.handleStartTimeChange} style={{ minWidth: '100px' }} /></div>
            <span style={{ margin: '0 10px' }}>至</span>
            <div className={styles.inSle}><DatePicker showTime value={endTime} onChange={this.handleEndTimeChange} style={{ minWidth: '100px' }} /></div>
          </div>
          <span className={styles.searchBtn} onClick={this.handleSearchList} limitid="13">查询</span>
        </div>
        <div className={styles.equipmentList}>
          {
            this.userLimit && this.userLimit.indexOf(441) !== -1 ?
              <span onClick={this.exportTable}>导出设备表</span> : ''
          }
        </div>
        <div className={styles.syetem_buttom}>
          <div className={styles.listBox}>
            <div className={styles.listItems}>
              <div className={styles.listTd} >日志编号</div>
              <div className={styles.listTd} >登录名称</div>
              <div className={styles.listTd} >操作内容</div>
              <div className={styles.listTd} >网络地址</div>
              <div className={styles.listTd} >操作时间</div>
            </div>
            {systemList && systemList.map((item) => {
              return (
                <div className={styles.listItems} key={item.id}>
                  <div className={styles.listTd} >{item.id}</div>
                  <div className={styles.listTd} >{item.username}</div>
                  <div className={styles.listTd} >{item.operation}</div>
                  <div className={styles.listTd} >{item.ip}</div>
                  <div className={styles.listTd} >{resetTimeStep(item.createDate)}</div>
                </div>)
            })}
            {
              !!systemList && systemList.length === 0 ? <div className={styles.noData}>当前查询无数据</div> : null
            }
          </div>
          <div className={styles.paginations}>
            <Pagination showQuickJumper current={currentPage} total={totalPage} onChange={this.handleChangePage} />
          </div>
        </div>
      </div>
    )
  }
}

export default InterworkingList
