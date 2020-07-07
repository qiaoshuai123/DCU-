import React, { Component } from 'react'
import { Input, Pagination, DatePicker } from 'antd'
import styles from './InterworkingList.scss'

import getResponseDatas from '../../../../utils/getResponseDatas'
import resetTimeStep from '../../../../utils/resetTimeStep'

class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: null,
      totalPage: 0,
      currentPage: 1,
    }
    this.logList = '/DCU/log/list'
    this.listParams = {
      pageNo: 1,
      keyword: '',
    }
  }
  componentDidMount = () => {
    this.getLogFaultLists()
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
  handleKeyWordChange = (e) => {
    this.listParams.keyword = e.target.value
  }
  render() {
    const { systemList, totalPage, currentPage } = this.state
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
          <span className={styles.searchBtn} onClick={this.handleSearchList} limitid="13">查询</span>
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
