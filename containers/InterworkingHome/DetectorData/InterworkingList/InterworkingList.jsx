import React, { Component } from 'react'
import { Input, Pagination, DatePicker, Select } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { unitInfoList, detectorDataListByPage, exportDetectorDataList } from '../../../../reactRedux/actions/equipmentManagement'
import styles from './InterworkingList.scss'

class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: [],
      namesList: [],
      current: 1,
      currnum: '',
    }
    this.objs = {
      names: '',
      keyword: '',
      startDate: '',
      endDate: '',
      pageNo: 1,
    }
    this.exportUrl = '/DCU/detectorData/exportDetectorDataList'
    this.userLimit = (JSON.parse(localStorage.getItem('userLimit'))).map(item => item.id)
    this.token = JSON.parse(localStorage.getItem('userInfo')).token
  }
  componentDidMount = () => {
    this.props.detectorDataListByPage('pageNo=1')
    this.props.unitInfoList()
  }
  componentDidUpdate = (prevState) => {
    const { unitInfoLists, detectorDataListByPages, } = this.props.data
    if (prevState.data.unitInfoLists !== unitInfoLists) {
      this.getunitInfoLists(unitInfoLists)
    }
    if (prevState.data.detectorDataListByPages !== detectorDataListByPages) {
      this.getdetectorDataListByPages(detectorDataListByPages)
    }
  }
  onChangDateStart = (date, dateString) => { // 上报时间
    this.objs.startDate = new Date(dateString) * 1
  }
  onChangDateEnd = (date, dateString) => { // 结束上报时间
    this.objs.endDate = new Date(dateString) * 1
  }
  getunitInfoLists = (unitInfoLists) => {
    this.setState({
      namesList: unitInfoLists,
    })
  }
  getdetectorDataListByPages = (detectorDataListByPages) => {
    const { pageNum, data, total } = detectorDataListByPages
    this.setState({
      currnum: total,
      current: pageNum,
      systemList: data,
    })
  }
  getresetPwd = (id) => {
    window.open(`#roaddetail/${id}`)
  }
  getTimingInfoByExcels = (getTimingInfoByExcel) => {
    const blob = new Blob([getTimingInfoByExcel], { type: 'application/vnd.ms-excel,charset=utf-8' })
    const a = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    a.href = href
    document.body.appendChild(a)
    // a.click()
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
    document.body.removeChild(a)
    window.URL.revokeObjectURL(href)
  }
  // key value 参数拼接
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
  exportTable = () => {
    window.location.href = `${this.exportUrl}${this.getResetParams(this.objs)}&Authorization=${this.token}`
  }
  handleChange = (e, optios) => {
    if (optios) {
      const { pname } = optios.props
      this.objs[pname] = e
    } else {
      const names = e.target.getAttribute('pname')
      const { value } = e.target
      this.objs[names] = value
    }
  }
  handlePagination = () => {
    const { keyword, startDate, endDate, pageNo, names } = this.objs
    const objs = `endTime=${endDate}&keyword=${keyword}&pageNo=${pageNo}&startTime=${startDate}&unitId=${names}`
    this.props.detectorDataListByPage(objs)
  }
  // 更改底部分页器
  pageChange = (page, pageSize) => {
    this.objs.pageNo = page
    const { keyword, startDate, endDate, pageNo, names } = this.objs
    const objs = `endTime=${endDate}&keyword=${keyword}&pageNo=${pageNo}&startTime=${startDate}&unitId=${names}`
    this.props.detectorDataListByPage(objs)
  }
  formatDate = (value) => { // 时间戳转换日期格式方法
    if (value == null) {
      return ''
    }
    const date = new Date(value)
    const y = date.getFullYear()// 年
    let MM = date.getMonth() + 1// 月
    MM = MM < 10 ? (`0${MM}`) : MM
    let d = date.getDate()// 日
    d = d < 10 ? (`0${d}`) : d
    let h = date.getHours()// 时
    h = h < 10 ? (`0${h}`) : h
    let m = date.getMinutes()// 分
    m = m < 10 ? (`0${m}`) : m
    let s = date.getSeconds()// 秒
    s = s < 10 ? (`0${s}`) : s
    return `${y}-${MM}-${d} ${h}:${m}:${s}`
  }
  render() {
    const { systemList, namesList, current, currnum, } = this.state
    const { Option } = Select
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>检测器数据</div>
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input pname="keyword" onChange={this.handleChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>点位名称:</span>
            <div className={styles.inSle}>
              <Select
                showSearch
                defaultValue="全部"
                style={{ width: 200, margin: 0 }}
                onChange={this.handleChange}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option pname="names" value="">全部</Option>
                {
                  namesList && namesList.map((item, ind) => <Option key={item + ind} pname="names" value={item.id}>{item.interName}</Option>)
                }
              </Select>
            </div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>上报时间:</span>
            <div className={styles.inSle}><DatePicker style={{ width: 200, margin: 0 }} onChange={this.onChangDateStart} /></div><span style={{ margin: '0 10px' }}>至</span><div className={styles.inSle}><DatePicker style={{ width: 200, margin: 0 }} onChange={this.onChangDateEnd} /></div>
          </div>
          <span className={styles.searchBtn} onClick={this.handlePagination}>查询</span>
        </div>
        <div className={styles.equipmentList}>
          设备列表
          {
            this.userLimit && this.userLimit.indexOf(141) !== -1 ?
              <span onClick={this.exportTable}>
                导出数据表
              </span> : ''
          }

        </div>
        <div className={styles.syetem_buttom}>
          <div className={styles.listBox}>
            <div className={styles.listItems}>
              <div className={styles.listTd} >路口名称</div>
              <div className={styles.listTd} >监测方向</div>
              <div className={styles.listTd} >统计时间</div>
              <div className={styles.listTd} >车道</div>
              <div className={styles.listTd} >流量</div>
              <div className={styles.listTd} >占有率</div>
              <div className={styles.listTd} >平均车速</div>
            </div>
            {systemList && systemList.map((item, index) => {
              return (
                <div className={styles.listItems} key={item.id + index}>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.dirName}</div>
                  <div className={styles.listTd} >{item.reportTimeForStr}</div>
                  <div className={styles.listTd} >{item.laneId}</div>
                  <div className={styles.listTd} >{item.flow}</div>
                  <div className={styles.listTd} >{item.occupancy}</div>
                  <div className={styles.listTd} >{item.speed}</div>
                </div>)
            })}
            {
              !!systemList && systemList.length === 0 ? <div className={styles.noData}>当前查询无数据</div> : null
            }
          </div>
          <div className={styles.paginations}>
            {currnum ? <Pagination showQuickJumper onChange={this.pageChange} pageSize={10} current={current} total={currnum} /> : ''}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.equipmentManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    unitInfoList: bindActionCreators(unitInfoList, dispatch),
    detectorDataListByPage: bindActionCreators(detectorDataListByPage, dispatch),
    exportDetectorDataList: bindActionCreators(exportDetectorDataList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(InterworkingList)
