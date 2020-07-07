import React, { Component } from 'react'
import { Input, Pagination, Select } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { dcuLists, dcuListByPages } from '../../../../reactRedux/actions/equipmentManagement'
import styles from './InterworkingList.scss'

class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: [],
    }
    this.objs = {
      keyword: '',
      regions: '',
      names: '',
    }
  }
  componentDidMount = () => {
    this.props.dcuLists()
  }
  componentDidUpdate = (prevState) => {
    const { dcuList, dcuListByPage } = this.props.data
    if (prevState.data.dcuList !== dcuList) {
      this.getdcuList(dcuList)
    }
    if (prevState.data.dcuListByPage !== dcuListByPage) {
      this.getdcuListByPage(dcuListByPage)
    }
  }
  getdcuList = (dcuList) => {
    this.setState({
      systemList: dcuList,
    })
  }
  getdcuListByPage = (dcuListByPage) => {
    console.log(dcuListByPage)
  }
  getresetPwd = (dataItem) => {
    console.log(dataItem, 'dddss')
    // localStorage.setItem('bac', JSON.stringify(dataItem.background))
    // window.open(`#/roaddetail?id=${dataItem.interId}&ids=${dataItem.nodeId}`)
  }
  // 更改查询关键字
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
  // 点击查询
  handlePaginatiosn = () => {
    console.log(this.objs, '内容')
  }
  backPage = () => {
    this.props.showInterworkingList(false)
  }
  // 更改底部分页器
  pageChange = (page, pageSize) => {
    console.log(page, pageSize)
  }
  render() {
    const { systemList, } = this.state
    const { Option } = Select
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <div className={styles.syetem_title}>
          <div className={styles.syetem_titleLeft}>DCU设备状态监视</div>
          <div className={styles.syetem_titleRight} onClick={this.backPage} />
        </div>
        <div className={styles.syetem_top}>
          <div className={styles.syetem_item}>
            <span className={styles.item}>关键词:</span>
            <div className={styles.inSle}><Input pname="keyword" onChange={this.handleChange} /></div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>行政区:</span>
            <div className={styles.inSle}>
              <Select defaultValue="行政一" style={{ width: 200, margin: 0 }} onChange={this.handleChange}>
                <Option pname="regions" value="行政一">行政一</Option>
                <Option pname="regions" value="行政二">行政二</Option>
              </Select>
            </div>
          </div>
          <div className={styles.syetem_item}>
            <span className={styles.item}>点位名称:</span>
            <div className={styles.inSle}>
              <Select defaultValue="点位一" style={{ width: 200, margin: 0 }} onChange={this.handleChange}>
                <Option pname="names" value="点位一">点位一</Option>
                <Option pname="names" value="点位二">点位二</Option>
              </Select>
            </div>
          </div>
          <span className={styles.searchBtn} onClick={this.handlePaginatiosn}>查询</span>
        </div>
        <div className={styles.equipmentList}>
          设备列表
        </div>
        <div className={styles.syetem_buttom}>
          <div className={styles.listBox}>
            <div className={styles.listItems}>
              <div className={styles.listTd} >点位名称</div>
              <div className={styles.listTd} >设备编号</div>
              <div className={styles.listTd} >设备型号</div>
              <div className={styles.listTd} >设备IP</div>
              <div className={styles.listTd} >生产厂商</div>
              <div className={styles.listTd} >经度</div>
              <div className={styles.listTd} >纬度</div>
              <div className={styles.listTd} >维护电话</div>
              <div className={styles.listTd} >设备状态</div>
              <div className={styles.listTd} >信号接入状态</div>
              <div className={styles.listTd} >数据接入状态</div>
              <div className={styles.listTd} >发布服务状态</div>
              <div className={styles.listTd} >操作</div>
            </div>
            {systemList && systemList.map((item, index) => {
              return (
                <div className={styles.listItems} key={item + index}>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.deviceId}</div>
                  <div className={styles.listTd} >{item.deviceModel}</div>
                  <div className={styles.listTd} >{item.signalConnectIp}</div>
                  <div className={styles.listTd} >{item.manufactor}</div>
                  <div className={styles.listTd} >{item.lat}</div>
                  <div className={styles.listTd} >{item.lng}</div>
                  <div className={styles.listTd} >{item.maintainPhone}</div>
                  <div className={styles.listTd} >{item.detectorType}</div>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >
                    <span className={styles.delectName} onClick={() => { this.getresetPwd(item) }}>
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
            <Pagination showQuickJumper onChange={this.pageChange} defaultCurrent={2} total={500} />
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
    dcuLists: bindActionCreators(dcuLists, dispatch),
    dcuListByPages: bindActionCreators(dcuListByPages, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(InterworkingList)
