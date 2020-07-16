import React, { Component } from 'react'
import classNames from 'classnames'
import { Select, message, Icon } from 'antd'
import styles from './ListForAntd.scss'
const { Option } = Select;

class ListForAntd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowSelect: null,
      // dataSourse: [
      //   {'name': '小明', 'age': 38, 'like': 'play', 'sex': '男', 'job': '不知道'},
      //   {'name': '小亮', 'age': 18, 'like': 'play', 'sex': '女', 'job': '不知道'},
      //   {'name': '小王', 'age': 38, 'like': 'play', 'sex': '男', 'job': '不知道'},
      //   {'name': '小红', 'age': 48, 'like': 'play', 'sex': '女', 'job': '不知道'}
      // ], // 数据源
      // listNames: ['名字', '年龄', '喜欢', '性别', '工作'], // 列名
      dataSourse: this.props.dataSourse, // 数据源
      listNames: this.props.listNames, // 列名
      showIndex: this.props.showIndex, // 循环显示多少列
      handleFlag: true,
      showListDatas: [],
      hideListDatas: [],
      userLimit: null,
    }
    this.selectIndex = null
  }
  componentDidUpdate = (prevState) => {
    // 数据更新
    // const { loadPlanTree, loadChildTree } = this.props.data
    // if (prevState.data.loadPlanTree !== loadPlanTree) {
    //   this.getPlanTree(loadPlanTree)
    // }
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    limitArr.forEach((item) => {
      if (item.id === 201){
        this.setState({ userLimit: true })
      }
    })
    // 根据数据源填充到显示与隐藏的列表
    const listNames = JSON.parse(JSON.stringify(this.props.listNames)), showListDatas = [], hideListDatas = [];
      for (let i = 0; i < listNames.length; i++) {
        if (i < this.state.showIndex) {
          showListDatas.push(listNames[i])
        } else {
          hideListDatas.push(listNames[i])
        }
      }
      console.log(listNames, showListDatas, hideListDatas)
      this.setState({ listNames, showListDatas, hideListDatas })
  }
  getIndex = index => {
    this.selectIndex = index
  }
  updateListItem = (itemDetailData, stepType, e) => {
    debugger
    e.stopPropagation()
    console.log(itemDetailData, stepType, '修改的')
    this.props.updateListItem(itemDetailData, stepType)
  }
  delListItem = (e, id) => {
    e.stopPropagation();
    this.props.delListItem(e, id)
  }
  handleClick = (e, itemData) => {
    this.props.handleClickFind(e, itemData)
  }
  formatNumberStr = (str) => {
    let arr = str.split(',')
    let i = 0
    let ret = []
    for (let j = 1; j <= arr.length; j++) {
      if (arr[j] - arr[j - 1] !== 1) {
        ret.push(j - i === 1 ? arr[i] : `${arr[i]}~${arr[j - 1]}`)
        i = j
      }
    }
    return ret.join(',')
}
  handleChange = (value, index) => {
    const hideListDatas = JSON.parse(JSON.stringify(this.state.hideListDatas)) // 副本隐藏的下拉
    const showListDatas = JSON.parse(JSON.stringify(this.state.showListDatas))
    const newLabel = {
      key: value.key,
      label: value.label,
    }
    hideListDatas[this.selectIndex] = JSON.parse(JSON.stringify(showListDatas[index])) // 显示的值赋值给隐藏的下拉
    showListDatas[index] = newLabel
    const oldDatas = JSON.parse(JSON.stringify(this.state.dataSourse))
    this.setState({
      dataSourse: [],
      showListDatas: [],
      hideListDatas: [],
    }, () => {
      this.setState({ dataSourse: oldDatas, showListDatas, hideListDatas })
    })
  }
  handleLineClick = (e, id, stepType) => {
    e.stopPropagation()
    this.props.handleLineClick(id, stepType)
  }
  render() {
    const { rowSelect, dataSourse, showListDatas, hideListDatas, handleFlag, userLimit } = this.state
    return (
      <div className={styles.SignalManagement}>
        <div className={styles.stepBoxContent}>
          <div className={styles.stepRightCon}>
            <div className={styles.conBox}>
              <div className={styles.rList}>
                <div className={styles.listItem}>
                  {
                    !!showListDatas && showListDatas.map((item, i) => {
                      return <em key={"emTit" + i} style={ i === 0 && (this.props.listType === 'DAYPLAN' || this.props.listType === 'DISPATCH') ? {flex: '0.3'} : null }>
                        <Select
                          labelInValue
                          defaultValue={{ key: item.label }}
                          // style={{ width: 120 }}
                          onChange={(e) => { this.handleChange(e, i) }}>
                          {
                            !!hideListDatas && hideListDatas.map((items, key) => {
                              return <Option key={"optionList" + key} value={items.key} onClick={() => { this.getIndex(key) }}>{items.label}</Option>
                            })
                          }
                        </Select>
                      </em>

                    })
                  }
                  {handleFlag && this.props.nothing === undefined && userLimit ? <em style={ this.props.listType === 'DAYPLAN' || this.props.listType === 'DISPATCH' ? {flex: '0.3'} : null }>操作</em> : null}
                </div>
                {
                  !!dataSourse && dataSourse.map((item, i) => {
                    return <div key={'List' + i} className={classNames(styles.listItem)} tag-mark={item.phaseLampgroupId} onClick={ this.props.nothing === undefined ? e => this.handleClick(e, item) : null }>
                      {!!showListDatas && showListDatas.map((val, k) => {
                        return <span key={"spanText" + k}  style={ (k === 0 && this.props.listType === 'DAYPLAN' || this.props.listType === 'DISPATCH') ? {flex: '1'} : null }>
                        { item[val.key] instanceof Array && this.props.listType === 'PLAN' ? 
                            item[val.key].map((items, d) => {
                              return <div className={styles.stageImgText} key={'ListItem' + d}>
                                      <s>{!items.imagePath ? '暂无' : <img style={{width: '30px', height: '30px'}} src={`${this.props.imgIconUrl}${items.imagePath}`} /> }</s>
                                      <s>{!items.schemePhaseTime ? '暂无' : items.schemePhaseTime }</s>
                                      <Icon type="arrow-right" />
                                    </div>
                            }) : 
                            item[val.key] instanceof Array && this.props.listType === 'DAYPLAN' ? 
                            item[val.key].map((items, d) => {
                              return <div className={styles.dayPlanBox} key={'ListItem' + d}>
                                      { d === 0 ? <div><b>开始时间</b><b>执行方案</b><b>运行模式</b></div> : null }
                                      <div className={styles.hLine} onClick={(e) => this.handleLineClick(e, items.timeintervalScheme, 'DAYPLAN')}>
                                        <s>{!items.timeintervalStarttime ? '暂无' : items.timeintervalStarttime }</s>
                                        <s>{!items.timeintervalScheme ? '暂无' : items.timeintervalScheme }</s>
                                        <s>{!items.timeintervalModelName ? '暂无' : items.timeintervalModelName }</s>
                                      </div>
                                    </div>
                            }) : 
                            item[val.key] instanceof Array && this.props.listType === 'DISPATCH' ? 
                            item[val.key].map((items, d) => {
                              return <div className={styles.dayPlanBox} key={'ListItem' + d}>
                                      { d === 0 ? <div><b>调度类型</b><b>优先级</b><b>调度类型值</b><b>日计划编号</b></div> : null }
                                      <div className={styles.hLine} onClick={(e) => this.handleLineClick(e, items.dailyPlanId, 'DISPATCH')}>
                                        <s>{items.dateTypeName ? items.dateTypeName : '' }</s>
                                        <s>{items.priority ? items.priority : '' }</s>
                                        {/* dateType 1 日期 星期 dataValueCodes  monthValueCodes */}
                                        <s>{items.dataValueNames ? (items.monthValueCodes !== '' ? ( "（" +this.formatNumberStr(items.monthValueCodes) +"）" + "月" + "（" + this.formatNumberStr(items.dataValueCodes) +" ）日" ) : "星期：（"+this.formatNumberStr(items.dataValueCodes)+ "）" )  : '' }</s>
                                        <s>{items.dailyPlanId ? items.dailyPlanId : '' }</s>
                                      </div>
                                    </div>
                            }) : 
                            val.key === 'coordinationImagePath' && !!item[val.key] ? <img style={{width: '30px', height: '30px'}} src={`${this.props.imgIconUrl}${item[val.key]}`} /> :
                            !item[val.key] ? '暂无' : item[val.key]
                        }
                        </span>
                      })
                      }
                      {handleFlag && this.props.nothing === undefined && userLimit ? <span><b onClick={(e) => { this.updateListItem(item, this.props.listType, e) }}>修改</b><b onClick={(e) => { this.delListItem(e, item.id) }}>删除</b></span> : null}
                    </div>
                  })
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ListForAntd