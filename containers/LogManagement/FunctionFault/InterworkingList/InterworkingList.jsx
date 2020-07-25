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
    this.logTypeUrl = '/DCU/sys/code/systemCodeListByCodeType?dictType=6'
    this.logsource = '/DCU/sys/code/systemCodeListByCodeType?dictType=34'
    this.logList = '/DCU/runLog/runLogListByPage'
    this.exportUrl = '/DCU/runLog/exportRunLogList'
    this.logListParams = {
      endTime: '',
      keyword: '',
      pageNo: 1,
      startTime: '',
      dircetion: null,
      logSource: null,
      logType: null,
    }
  }
  componentDidMount = () => {
    this.getLogTypes()
    this.getLogList()
    this.getLogSource()
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
  getLogSource = () => {
    getResponseDatas('get', this.logsource).then((res) => {
      const { code, data } = res.data
      if (code === 0 && data.length) {
        this.setState({ logSource: data })
      } else {
        this.setState({ logSource: [] })
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
  getresetPwd = (id) => {
    window.open(`#roaddetail/${id}`)
  }
  // 导出excel表格
  exportTable = () => {
    // 后端返回数据流
    // this.sigexportExcelThing(str)
  }
  handleChangeType = (value, options) => {
    const { pname } = options.props
    console.log(options.key === 'null', options.key)
    const types = options.key === 'null' ? null : options.key
    this.logListParams[pname] = types
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
    this.logListParams.keyword = e.target.vlaue
  }
  render() {
    const { systemList, logTypes, totalPage, currentPage, logSource } = this.state
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>运行日志</div>
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input onChange={this.handleKeyWordChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>日志类型:</span>
            <div className={styles.inSle}>
              <Select defaultValue="全部" onChange={this.handleChangeType}>
                <Option value="全部" key={null} pname="logType">全部</Option>
                {
                  logTypes &&
                  logTypes.map(item => <Option value={item.codeName} key={item.dictCode} pname="logType">{item.codeName}</Option>)
                }
              </Select>
            </div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>日志来源:</span>
            <div className={styles.inSle}>
              <Select defaultValue="全部" onChange={this.handleChangeType}>
                <Option value="全部" key={null} pname="logSource">全部</Option>
                {
                  logSource &&
                  logSource.map(item => <Option value={item.codeName} key={item.dictCode} pname="logSource">{item.codeName}</Option>)
                }
              </Select>
            </div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>请求响应:</span>
            <div className={styles.inSle}>
              <Select defaultValue="全部" onChange={this.handleChangeType}>
                <Option value="全部" key={null} pname="dircetion">全部</Option>
                <Option value="request" key="request" pname="dircetion">request</Option>
                <Option value="response" key="response" pname="dircetion">response</Option>
              </Select>
            </div>
          </div>
          <div className={styles.syetem_item} style={{ flex: 1.2 }}>
            <span className={styles.item}>故障时间:</span>
            <div className={styles.inSle}><DatePicker showTime onChange={this.handleStartTimeChange} style={{ minWidth: '100px' }} /></div>
            <span style={{ margin: '0 10px' }}>至</span>
            <div className={styles.inSle}><DatePicker showTime onChange={this.handleEndTimeChange} style={{ minWidth: '100px' }} /></div>
          </div>
          <span className={styles.searchBtn} onClick={this.handleSearchLogList} limitid="13">查询</span>
        </div>
        <div className={styles.equipmentList}>
          <span onClick={this.exportTable}>导出设备表</span>
        </div>
        <div className={styles.syetem_buttom}>
          <div className={styles.listBox}>
            <div className={styles.listItems}>
              <div className={styles.listTd} >日志来源</div>
              <div className={styles.listTd} >日志类型</div>
              <div className={styles.listTd} >请求响应</div>
              <div className={styles.listTd} >操作人</div>
              <div className={styles.listTd} >IP</div>
              <div className={styles.listTd} >日志内容</div>
              <div className={styles.listTd} >日志时间</div>
            </div>
            {systemList && systemList.map((item, index) => {
              return (
                <div className={styles.listItems} key={item.id + index}>
                  <div className={styles.listTd} >{item.logSourceName}</div>
                  <div className={styles.listTd} >{item.logTypeName}</div>
                  <div className={styles.listTd} >{item.direction}</div>
                  <div className={styles.listTd} >{item.loginName}</div>
                  <div className={styles.listTd} >{item.ip}</div>
                  <div className={styles.listTd} >{item.data}</div>
                  <div className={styles.listTd} >{item.timeStr}</div>
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
