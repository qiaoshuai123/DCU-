import React, { Component } from 'react'
import { Input, Pagination, DatePicker } from 'antd'
import styles from './InterworkingList.scss'

class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        }
      ],
    }
  }
  componentDidMount = () => {

  }
  getresetPwd = (id) => {
    window.open(`#roaddetail/${id}`)
  }
  // 导出excel表格
  exportTable = () => {
    // 后端返回数据流
    // this.sigexportExcelThing(str)
  }
  // sigexportExcelThings = (sigexportExcelThing) => {
  //   const blob = new Blob([sigexportExcelThing], { type: 'application/vnd.ms-excel,charset=utf-8' })
  //   const a = document.createElement('a')
  //   const href = window.URL.createObjectURL(blob)
  //   a.href = href
  //   document.body.appendChild(a)
  //   // a.click()
  //   a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
  //   document.body.removeChild(a)
  //   window.URL.revokeObjectURL(href)
  // }
  render() {
    const { systemList } = this.state
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>DCU设备故障</div>
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input onChange={this.handleInputChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>故障类型:</span>
            <div className={styles.inSle}><Input onChange={this.handleInputChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>故障时间:</span>
            <div className={styles.inSle}><DatePicker /></div><span style={{ margin: '0 10px' }}>至</span><div className={styles.inSle}><DatePicker /></div>
          </div>
          <span className={styles.searchBtn} onClick={() => { this.handlePagination('1') }} limitid="13">查询</span>
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
                  <div className={styles.listTd} >11213213212222222222222222222222</div>
                  <div className={styles.listTd} >2</div>
                  <div className={styles.listTd} >3</div>
                  <div className={styles.listTd} >4</div>
                  <div className={styles.listTd} >5</div>
                  <div className={styles.listTd} >6</div>
                  <div className={styles.listTd} >
                    <span className={styles.delectName} onClick={() => { this.getresetPwd(item.id) }}>
                      路口监视
                    </span>
                  </div>
                </div>)
            })}
            {
              !!systemList && systemList.length === 0 ? <div className={styles.noData}>当前查询无数据</div> : null
            }
          </div>
          <div className={styles.paginations}>
            <Pagination showQuickJumper defaultCurrent={2} total={500} />
          </div>
        </div>
      </div>
    )
  }
}

export default InterworkingList
