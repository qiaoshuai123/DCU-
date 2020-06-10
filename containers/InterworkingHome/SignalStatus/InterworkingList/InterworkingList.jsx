import React, { Component } from 'react'
import { Input, Pagination } from 'antd'
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
  backPage = () => {
    this.props.showInterworkingList(false)
  }
  render() {
    const { systemList } = this.state
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>信号状态监视</div>
          <div className={styles.syetem_titleRight} onClick={this.backPage} />
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input onChange={this.handleInputChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>行政区:</span>
            <div className={styles.inSle}><Input onChange={this.handleInputChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>点位名称:</span>
            <div className={styles.inSle}><Input onChange={this.handleInputChange} /></div>
          </div>
          <span className={styles.searchBtn} onClick={() => { this.handlePagination('1') }} limitid="13">查询</span>
        </div>
        <div className={styles.equipmentList}>
          设备列表
        </div>
        <div className={styles.syetem_buttom}>
          <div className={styles.listBox}>
            <div className={styles.listItems}>
              <div className={styles.listTd} >点位名称</div>
              <div className={styles.listTd} >信号机编号</div>
              <div className={styles.listTd} >信号品牌</div>
              <div className={styles.listTd} >设备IP</div>
              <div className={styles.listTd} >经纬度</div>
              <div className={styles.listTd} >维护电话</div>
              <div className={styles.listTd} >设备状态</div>
              <div className={styles.listTd} >信号控制状态</div>
              <div className={styles.listTd} >运行阶段</div>
              <div className={styles.listTd} >操作</div>
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
                  <div className={styles.listTd} >7</div>
                  <div className={styles.listTd} >8</div>
                  <div className={styles.listTd} >9</div>
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
