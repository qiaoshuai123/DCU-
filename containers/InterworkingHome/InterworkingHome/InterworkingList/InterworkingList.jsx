import React, { Component } from 'react'
import { Input, Pagination, Select } from 'antd'
import Websocket from 'react-websocket'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { dcuLists, dcuListByPages, systemCodeListByCodeType, unitInfoList } from '../../../../reactRedux/actions/equipmentManagement'
import styles from './InterworkingList.scss'

class InterworkingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      systemList: [],
      optionSelect: [],
      namesList: [],
      current: 1,
      currnum: '',
      stylesList: [], // 设备状态
    }
    this.objs = {
      names: '',
      keyword: '',
      regions: '',
      pageNo: 1,
    }
  }
  componentDidMount = () => {
    this.props.dcuLists()
    this.props.systemCodeListByCodeType(1)
    this.props.unitInfoList()
  }
  componentDidUpdate = (prevState) => {
    const { dcuList, dcuListByPage, systemCodeListByCodeTypes, unitInfoLists } = this.props.data
    if (prevState.data.dcuList !== dcuList) {
      this.getdcuList(dcuList)
    }
    if (prevState.data.dcuListByPage !== dcuListByPage) {
      this.getdcuListByPage(dcuListByPage)
    }
    if (prevState.data.systemCodeListByCodeTypes !== systemCodeListByCodeTypes) {
      this.getsystemCodeListByCodeTypes(systemCodeListByCodeTypes)
    }
    if (prevState.data.unitInfoLists !== unitInfoLists) {
      this.getunitInfoLists(unitInfoLists)
    }
  }
  componentWillUnmount = () => {
    // this.handleClose()
  }
  getunitInfoLists = (unitInfoLists) => {
    this.setState({
      namesList: unitInfoLists,
    })
  }
  getsystemCodeListByCodeTypes = (systemCodeListByCodeTypes) => {
    this.setState({
      optionSelect: systemCodeListByCodeTypes,
    })
  }
  getdcuList = (dcuList) => {
    this.setState({
      systemList: dcuList,
      currnum: dcuList.length,
    })
  }
  getdcuListByPage = (dcuListByPage) => {
    // console.log(dcuListByPage, 'fenye')
    this.setState({
      currnum: dcuListByPage.pageSize,
      current: dcuListByPage.pages,
      systemList: dcuListByPage.data,
    })
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
    const { keyword, regions, pageNo, names } = this.objs
    const objs = `areaCode=${regions}&keyword=${keyword}&pageNo=${pageNo}&unitId=${names}`
    this.props.dcuListByPages(objs)
  }
  backPage = () => {
    this.props.showInterworkingList(false)
  }
  // 更改底部分页器
  pageChange = (page, pageSize) => {
    this.objs.pageNo = page
    const { keyword, regions, names } = this.objs
    const objs = `areaCode=${regions}&keyword=${keyword}&pageNo=${page}&unitId=${names}`
    this.props.dcuListByPages(objs)
  }
  handleData = (e) => {
    console.log(JSON.parse(e))
    const { dcuStateList } = JSON.parse(e)
    this.setState(
      {
        stylesList: dcuStateList,
      }
    )
  }
  render() {
    const { systemList, optionSelect, current, currnum, namesList, stylesList } = this.state
    const { Option } = Select
    return (
      <div className={styles.syetem_bg} ref={(input) => { this.userLimitBox = input }}>
        <Websocket
          url="ws://192.168.1.213:20203/DCU/websocket/dcuState/0/0/0"
          onMessage={this.handleData.bind(this)}
        // onClose={() => this.handleClose()}
        />
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
              <Select defaultValue="全部" style={{ width: 200, margin: 0 }} onChange={this.handleChange}>
                <Option pname="regions" value="">全部</Option>
                {
                  optionSelect && optionSelect.map((item, ind) => <Option key={item + ind} pname="regions" value={item.dictCode}>{item.codeName}</Option>)
                }
              </Select>
            </div>
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
              {/* <div className={styles.listTd} >信号接入状态</div>
              <div className={styles.listTd} >数据接入状态</div>
              <div className={styles.listTd} >发布服务状态</div> */}
              <div className={styles.listTd} >操作</div>
            </div>
            {systemList && systemList.map((item, index) => {
              let isc = ''
              stylesList.map((items) => {
                if (item.interId === items.interId) {
                  isc = items.state
                }
              })
              return (
                <div className={styles.listItems} key={item + index}>
                  <div className={styles.listTd} >{item.interName}</div>
                  <div className={styles.listTd} >{item.deviceId}</div>
                  <div className={styles.listTd} >{item.deviceModel}</div>
                  <div className={styles.listTd} >{item.applicationConnectIp}</div>
                  <div className={styles.listTd} >{item.manufactor}</div>
                  <div className={styles.listTd} >{item.lat}</div>
                  <div className={styles.listTd} >{item.lng}</div>
                  <div className={styles.listTd} >{item.maintainPhone}</div>
                  <div className={styles.listTd} >{isc === 1 ? '正在运行' : '停止运行'}</div>
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
            {
              currnum && <Pagination showQuickJumper onChange={this.pageChange} defaultCurrent={current} total={currnum} />
            }
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
    systemCodeListByCodeType: bindActionCreators(systemCodeListByCodeType, dispatch),
    unitInfoList: bindActionCreators(unitInfoList, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(InterworkingList)
