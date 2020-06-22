import React, { Component } from 'react'
import classNames from 'classnames'
import { Select, message } from 'antd'
import styles from './ListForAntd.scss'
const { Option } = Select;

class ListForAntd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowSelect: null,
      dataSourse: [
        {'name': '小明', 'age': 38, 'like': 'play', 'sex': '男', 'job': '不知道'},
        {'name': '小亮', 'age': 18, 'like': 'play', 'sex': '女', 'job': '不知道'},
        {'name': '小王', 'age': 38, 'like': 'play', 'sex': '男', 'job': '不知道'},
        {'name': '小红', 'age': 48, 'like': 'play', 'sex': '女', 'job': '不知道'}
      ], // 数据源
      listNames: ['名字', '年龄', '喜欢', '性别', '工作'], // 列名
      showIndex: 3, // 循环显示多少列
      handleFlag: true,
      showListDatas: [],
      hideListDatas: [],
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
    // 根据数据源填充到显示与隐藏的列表
    const listNames = [], showListDatas = [], hideListDatas = [];
    for (let prop in this.state.dataSourse[0]) {
      const obj ={
        key: prop,
      }
      listNames.push(obj)
    }
    listNames.map((item, i)=>{
      item.label = this.state.listNames[i];
    })

    for (let i = 0; i < listNames.length; i++) {
      if (i < this.state.showIndex){
        showListDatas.push(listNames[i])
      } else {
        hideListDatas.push(listNames[i])
      }
    }
    this.setState({ listNames, showListDatas, hideListDatas })
  }
  getIndex = index => {
    this.selectIndex = index
  }
  update = (e) => {
    e.stopPropagation();
    console.log('我是操作栏')
  }
  handleClick = index => {
    message.info("当前点击的是第"+Number(index+1)+"行")
    this.setState({
      rowSelect: index,
    })
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
  render() {
    const { rowSelect, dataSourse, showListDatas, hideListDatas, handleFlag } = this.state
    return (
      <div className={styles.SignalManagement}>
        <div className={styles.stepBoxContent}>
          <div className={styles.stepRightCon}>
            <div className={styles.conBox}>
              <div className={styles.rList}>
                <div className={styles.listItem}>
                  {
                    !!showListDatas && showListDatas.map((item, i) => {
                          return <em key={"emTit"+i}>
                          <Select
                            labelInValue
                            defaultValue={{ key: item.label }}
                            style={{ width: 120 }}
                            onChange={(e) => {this.handleChange(e, i)}}>
                            {
                              !!hideListDatas && hideListDatas.map((items, key) => {
                                return <Option key={"optionList"+ key} value={items.key} onClick={()=>{this.getIndex(key)}}>{items.label}</Option>
                              })
                            }
                          </Select>
                          </em>
                        
                    })
                  }
                  {handleFlag ? <em>操作</em> : null}
                </div>
                {
                  !!dataSourse && dataSourse.map((item, i) => {
                    return <div key={'phaseList'+i} className={classNames(styles.listItem, rowSelect === i ? styles.hover : null)} onClick={()=>{this.handleClick(i)}}>
                      {!!showListDatas && showListDatas.map((val, k) => {
                          return <span key={"spanText"+ k}>{item[val.key]}</span>
                        })
                      }
                      {handleFlag ? <span><b onClick={(e)=>{this.update(e)}}>删除</b></span> : null}
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