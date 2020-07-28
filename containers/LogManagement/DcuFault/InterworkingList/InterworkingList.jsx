import React, { Component } from 'react'
import { Input, Pagination, DatePicker, Select } from 'antd'
import styles from './InterworkingList.scss'

import getResponseDatas from '../../../../utils/getResponseDatas'
import resetTimeStep from '../../../../utils/resetTimeStep'

const { Option } = Select
class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: null,
      logTypes: null,
      currentPage: 1,
      totalPage: 0,
    }
    this.logTypeUrl = '/DCU/sys/code/systemCodeListByCodeType?dictType=3'
    this.logList = '/DCU/dcuFault/dcuFaultListByPage'
    this.exportUrl = '/DCU/dcuFault/exportDcuFaultList'
    this.logListParams = {
      endTime: '',
      faultType: null,
      keyword: '',
      pageNo: 1,
      startTime: '',
    }
  }
  componentDidMount = () => {
    this.getLogTypes()
    this.getLogList()
    this.getResetParams(this.logListParams)
  }
  getResetParams = (params) => {
    if (JSON.stringify(params) !== '{}') {
      let newParams = '?'
      const resetParams = Object.keys(params)
      const lengths = resetParams.length
      Object.keys(params).forEach((item, index) => {
        if (params[item] !== null && params[item] !== 'null') {
          newParams += `${item}=${params[item]}${index !== lengths - 1 ? '&' : ''}`
        }
      })
      return newParams
      
    }
    return params
  }
  getLogList = () => {
    getResponseDatas('get', this.logList, this.logListParams).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        this.setState({
          systemList: data.data,
          currentPage: data.pageNum,
          totalPage: data.total,
        })
      }
    })
  }
  getLogTypes = () => {
    getResponseDatas('get', this.logTypeUrl).then((res) => {
      const { code, data } = res.data
      if (code === 0 && data.length) {
        this.setState({ logTypes: data })
      } else {
        this.setState({ logTypes: [] })
      }
    })
  }
  // 导出excel表格
  exportTable = () => {
    window.location.href = `${this.exportUrl}${this.getResetParams(this.logListParams)}`
  }
  handleChangeType = (value, options) => {
    this.logListParams.faultType = options.key
  }
  handleStartTimeChange = (moments) => {
    if (moments) {
      const timeStep = moments._d.getTime()
      this.logListParams.startTime = timeStep
    } else {
      this.logListParams.startTime = ''
    }
  }
  handleEndTimeChange = (moments) => {
    if (moments) {
      const timeStep = moments._d.getTime()
      this.logListParams.endTime = timeStep
    } else {
      this.logListParams.endTime = ''
    }
  }
  handleSearchLogList = () => {
    this.getLogList()
  }
  handleChangePage = (page) => {
    this.setState({ currentPage: page })
    this.logListParams.pageNo = page
    this.getLogList()
  }
  handleKeyWordChange = (e) => {
    this.logListParams.keyword = e.target.value
  }
  render() {
    const { systemList, logTypes, totalPage, currentPage } = this.state
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>DCU设备故障</div>
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input onChange={this.handleKeyWordChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>故障类型:</span>
            <div className={styles.inSle}>
              <Select defaultValue="全部" onChange={this.handleChangeType}>
                <Option value="全部" key={null}>全部</Option>
                {
                  logTypes &&
                  logTypes.map(item => <Option value={item.codeName} key={item.dictCode}>{item.codeName}</Option>)
                }
              </Select>
            </div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>故障时间:</span>
            <div className={styles.inSle}><DatePicker showTime onChange={this.handleStartTimeChange} /></div>
            <span style={{ margin: '0 10px' }}>至</span>
            <div className={styles.inSle}><DatePicker showTime onChange={this.handleEndTimeChange} /></div>
          </div>
          <span className={styles.searchBtn} onClick={this.handleSearchLogList} limitid="13">查询</span>
        </div>
        <div className={styles.equipmentList}>
          <span onClick={this.exportTable}>导出设备表</span>
        </div>
        <div className={styles.syetem_buttom}>
          <div className={styles.listBox}>
            <div className={styles.listItems}>
              <div className={styles.listTd} >点位编号</div>
              <div className={styles.listTd} >点位名称</div>
              <div className={styles.listTd} >设备IP</div>
              <div className={styles.listTd} >故障类型</div>
              <div className={styles.listTd} >故障时间</div>
              <div className={styles.listTd} >故障恢复时间</div>
              <div className={styles.listTd} >故障描述</div>
            </div>
            {systemList && systemList.map((item, index) => {
              return (
                <div className={styles.listItems} key={item.id + index}>
                  <div className={styles.listTd} >{item.dcuId}</div>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.ip}</div>
                  <div className={styles.listTd} >{item.faultTypeName}</div>
                  <div className={styles.listTd} >{resetTimeStep(item.faultTime)}</div>
                  <div className={styles.listTd} >{resetTimeStep(item.recoverTime)}</div>
                  <div className={styles.listTd} >{item.faultDetail}</div>
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
