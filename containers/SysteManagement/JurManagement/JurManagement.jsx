import React from 'react'
import classNames from 'classnames'
import { Icon, Select, Input, message, Pagination, Tree, Modal } from 'antd'
import Header from '../../../components/Header/Header'
import roadStyles from '../UserManagement/Roadtraffic.scss'
import styles from '../UserManagement/UserManagement.scss'
import getResponseDatas from '../../../utils/getResponseDatas'

const { confirm } = Modal
const { Option } = Select
const { TreeNode } = Tree


// 系统管理
class Jurisdiction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listDatas: null,
      showGroupMsg: false,
      totalCount: 1,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: null,
      userLimit: null,
      current: 1,
    }
    this.deptListUrl = '/DCU/sys/role/listPage'
    this.addListUrl = '/DCU/sys/role/save'
    this.updateUrl = '/DCU/sys/role/update'
    this.deleteUrl = '/DCU/sys/role/delete'
    this.sysMenuUrl = '/DCU/sys/menu/list'
    this.listTrueUrl = '/DCU/sys/menu/listTrue' // 获取树结构
    this.deleteParams = {
      roleIds: [],
    }
    this.listParams = {
      keyword: '',
      pageNo: 1,
    }
    this.defaultparams = {
      id: '',
      menuIds: '',
      name: '',
      remark: '',
    }
    this.TreeData = []
  }
  componentDidMount = () => {
    this.getSystemMenu()
    this.getDeptList()
    this.onlistTrue()
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    const userLimit = []
    limitArr.forEach((item) => {
      userLimit.push(item.id)
    })
    this.setState({ userLimit })
  }
  onlistTrue = () => {
    getResponseDatas('post', this.listTrueUrl).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        this.handleTreeData(data)
        this.setState({ treeData: data })
      }
    })
  }
  onExpand = (expandedKeys) => {
    // console.log('onExpand', expandedKeys)
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  // onCheck = (checkedKeys, e) => {
  //   // console.log('onCheck', checkedKeys, e)
  //   this.defaultparams.menuIds = checkedKeys.checked
  //   /*  this.defaultparams.menuIds = [...e.halfCheckedKeys, ...checkedKeys] */
  //   this.setState({ checkedKeys: checkedKeys.checked })
  // }
  onCheck = (check, e) => {
    // console.log('onCheck', checkedKeys, e, this.state.treeData)
    const { checkedKeys } = this.state
    // console.log(checked);
    const Item = e.checkedNodes[e.checkedNodes.length - 1]
    const dataRefs = Item.props.dataRef
    this.Ids = []
    this.parentIds = []
    this.childrenItem = null
    this.Ids.push(Item.key)
    if (e.checked) {
      if (dataRefs.parentId) {
        this.Ids.push((dataRefs.parentId).toString())
        // console.log(dataRefs.parentId, '1111111111111');
        this.handleCheckparentId(dataRefs.parentId)
        this.Ids.push(...this.parentIds)
      }
      this.handleCheckedKeys(Item.props.children)
      // console.log(this.Ids);
      this.defaultparams.menuIds = [...new Set([...check.checked, ...this.Ids])]
    } else {
      checkedKeys.forEach((item) => { // 取出取消的项id
        if (!check.checked.includes(item)) {
          this.handleCheckparentId(item, true) // 拿到this.childrenItem 当前取消项数据
          // this.handleCheckparentId(item) // 拿到 this.parentIds 当前取消项所有的父亲id
          this.TreeData.forEach((it) => {
            if (it.id === Number(item)) { // 找到当前级别是否取消父节
              this.TreeData.forEach((ite) => {
                if (ite.id === Number(it.parentId)) { // 找到当前的父亲项
                  const childrenId = []
                  ite.children.forEach((t) => {
                    childrenId.push(check.checked.includes((t.id).toString())) // 判断是受当前父亲项下有勾选
                  })
                  const bl = childrenId.some((x) => { return x === true }) // 有一项为true时候就是true
                  if (!bl) { // 无勾选则取消父亲项的勾选
                    if (it.type === 1) { // 判断是否是按钮，1的时候为菜单 2的时候为按钮
                      if (check.checked.includes((it.parentId).toString())) {
                        check.checked.splice(check.checked.indexOf((it.parentId).toString()), 1)
                      }
                    }
                  }
                }
              })

              if (it.children) { // 取消掉当前项下所有子项的勾选
                it.children.forEach((i) => {
                  // console.log(check.checked, i.id);
                  if (check.checked.includes((i.id).toString())) {
                    check.checked.splice(check.checked.indexOf((i.id).toString()), 1)
                  }
                })
              }
            }
          })
        }
      })
      console.log(checkedKeys, check.checked, this.childrenItem)
      this.defaultparams.menuIds = [...new Set(check.checked)]
    }
    this.setState({ checkedKeys: this.defaultparams.menuIds })
  }
  onSelect = (selectedKeys, info) => {
    // console.log('onSelect', info)
    this.setState({ selectedKeys })
  }
  getSystemMenu = () => {
    getResponseDatas('post', this.sysMenuUrl).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        const menuIdArr = []
        data.forEach((item) => {
          menuIdArr.push(item.id)
        })
        this.defaultparams.menuIds = menuIdArr
      }
    })
  }
  getDeptList = () => {
    getResponseDatas('post', this.deptListUrl, this.getFormData(this.listParams)).then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        const listdata = data.list.filter((item) => {
          return item.isDelete == 0
        })
        this.setState({
          listDatas: listdata,
          totalCount: data.totalCount,
          current: Number(this.listParams.pageNo)
        })
      }
    })
  }
  // 转格式
  getFormData = (obj) => {
    const formData = new FormData()
    Object.keys(obj).forEach((item) => {
      formData.append(item, obj[item])
    })
    // console.log(formData)
    return formData
  }
  handlePagination = (pageNumber) => {
    // console.log('Page: ', pageNumber)
    this.listParams.pageNo = pageNumber
    this.getDeptList()
  }
  handleCheckedKeys = (data) => {
    data.map((item) => {
      this.Ids.push(item.key || item.id)
      console.log(item);
      if (item.props.children) {
        this.handleCheckedKeys(item.props.children)
      }
    })
  }
  handleTreeData = (data) => {
    this.TreeData.push(...data)
    data.forEach((item) => {
      if (item.children) {
        this.handleTreeData(item.children)
      }
    })
  }
  handleCheckparentId = (id, bool) => {
    for (let i = 0; i < this.TreeData.length; i++) {
      const item = this.TreeData[i]
      // console.log(item, item.id === id);
      if (item.id === Number(id)) {
        if (bool) {
          this.childrenItem = item
          return
        } else if (item.parentId) {
          this.parentIds.push((item.parentId).toString())
          this.handleCheckparentId(item.parentId)
          return
        }
      }
    }
  }
  handleAddGroup = () => {
    this.isAdd = true
    this.setState({
      listItems: null,
      showGroupMsg: true,
    })
  }
  handleCloseGroupMsg = () => {
    this.state.checkedKeys = []
    this.defaultparams = {
      id: '',
      menuIds: '',
      name: '',
      remark: '',
    }
    this.setState({ showGroupMsg: false })
  }
  handleEditItems = (id) => {
    this.isAdd = false
    let menuId = []
    const listItem = (this.state.listDatas.filter(item => item.id === id))[0]
    // console.log(listItem)
    if (listItem.menuId) {
      menuId = listItem.menuId.split(',')
    }
    this.setState({
      listItems: listItem,
      showGroupMsg: true,
      checkedKeys: menuId,
    })
    Object.keys(this.defaultparams).map((item) => {
      if (item === 'menuIds') {
        this.defaultparams[item] = listItem.menuId
      } else {
        this.defaultparams[item] = listItem[item]
      }
    })
  }
  handleGroupMsgChange = (e, itemname) => {
    const value = typeof (e) === 'object' ? e.target.value : e
    this.defaultparams[itemname] = value
  }
  handleAddEdit = () => {
    const { menuIds, name } = this.defaultparams
    if (!name) {
      message.error('请填写角色名称!')
      return
    }
    if (menuIds == '') {
      message.error('请选择角色权限!')
      return
    }
    if (this.isAdd) {
      getResponseDatas('post', this.addListUrl, this.getFormData(this.defaultparams)).then((res) => {
        const { code, msg } = res.data
        if (code === 0) {
          this.listParams.keyword = ''
          this.listParams.pageNo = 1
          this.state.checkedKeys = []
          this.defaultparams = {
            id: '',
            menuIds: '',
            name: '',
            remark: '',
          }
          message.info('添加成功!')
          this.getDeptList()
        } else {
          message.info(msg)
        }
      })
    } else {
      getResponseDatas('post', this.updateUrl, this.getFormData(this.defaultparams)).then((res) => {
        const { code, msg } = res.data
        if (code === 0) {
          this.listParams.keyword = ''
          this.listParams.pageNo = 1
          this.state.checkedKeys = []
          this.defaultparams = {
            id: '',
            menuIds: '',
            name: '',
            remark: '',
          }
          message.info('修改成功!')
          this.getDeptList()
        } else {
          message.info(msg)
        }
      })
    }
    this.handleCloseGroupMsg()
  }
  handleDeleteItem = (id) => {
    const that = this
    this.deleteParams.roleIds.push(id)
    confirm({
      title: '确认要删除当前角色权限?',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        return new Promise((resolve) => {
          getResponseDatas('post', that.deleteUrl, that.getFormData(that.deleteParams)).then((res) => {
            const { code, msg } = res.data
            if (code === 0) {
              message.info('删除成功！')
              /*  that.listParams.keyword = '' */
              // this.listParams.pageNo = 1
              const { listDatas } = that.state
              if (listDatas.length === 1 && that.listParams.pageNo > 1) {
                that.listParams.pageNo = Number(that.listParams.pageNo) - 1
              }
              that.getDeptList()
              resolve()
            } else {
              message.info(msg)
            }
          })
        }).catch(() => message.error('网络错误!'))
      },
      onCancel() { },
    })
  }
  handleInputChange = (e) => {
    this.listParams.keyword = e.target.value
  }
  handleChangePage = (page) => {
    this.listParams.pageNo = page
    this.getDeptList()
  }
  handleKeywordChange = (e) => {
    const { value } = e.target
    this.listParams.keyword = value
  }
  renderTreeNodes = (data) => {
    return (
      data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode key={item.id} {...item} />
      })
    )
  }
  render() {
    const { listDatas, showGroupMsg, treeData, listItems, totalCount, userLimit, current } = this.state
    return (
      <div className={(roadStyles.Roadtcontent)}>
        <Header {...this.props} />
        {/* 地图 */}
        <div id="mapContainer" className={classNames(roadStyles.mapContainer, styles.mapContainer)} >
          <div className={styles.syetem_bg}>
            <div className={styles.syetem_title}>
              <div className={styles.syetem_titleLeft}>权限角色管理</div>
            </div>
            <div className={styles.syetem_top}>
              <div className={styles.syetem_item}><span className={styles.item}>关键词</span><div className={styles.inSle}><Input onChange={this.handleInputChange} placeholder="查询条件" /></div></div>
              {/* <div className={styles.syetem_item}><span className={styles.item}>用户组</span>
                <div className={styles.inSle}>
                  <Select defaultValue="lucy" style={{ width: 200 }}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                  </Select>
                </div>
              </div> */}
              {
                userLimit && userLimit.indexOf(52) !== -1 ?
                  <span className={styles.searchBtn} onClick={() => { this.handlePagination('1') }}>查询</span> : null
              }
              <i className={styles.line} />
            </div>
            <div className={styles.syetem_buttom}>
              {
                userLimit && userLimit.indexOf(521) !== -1 ?
                  <div className={styles.title}><span onClick={this.handleAddGroup}>+添加角色</span></div> : null
              }
              <div className={styles.listBox}>
                <div className={styles.listItems}>
                  <div className={styles.listTd} >角色编号</div>
                  <div className={styles.listTd} >角色名称</div>
                  <div className={styles.listTd} >角色描述</div>
                  <div className={styles.listTd} >创建时间</div>
                  <div className={styles.listTd} >操作</div>
                </div>
                {
                  listDatas &&
                  listDatas.map((item) => {
                    return (
                      <div className={styles.listItems} key={item.id}>
                        <div className={styles.listTd} ><span className={styles.roadName}>{item.id}</span></div>
                        <div className={styles.listTd} ><span className={styles.roadName}>{item.name}</span></div>
                        <div className={styles.listTd} ><span className={styles.roadName}>{item.remark}</span></div>
                        <div className={styles.listTd} ><span className={styles.roadName}>{item.createTime}</span></div>
                        <div className={styles.listTd} >
                          {
                            userLimit && userLimit.indexOf(522) !== -1 ?
                              <span className={styles.updateName} onClick={() => { this.handleEditItems(item.id) }}>
                                <Icon type="edit" className={styles.icon} />修改
                              </span> : null
                          }
                          {
                            userLimit && userLimit.indexOf(523) !== -1 ?
                              <span className={styles.delectName} onClick={() => { this.handleDeleteItem(item.id) }}>
                                <Icon type="close" className={styles.icon} />删除
                              </span> : null
                          }
                        </div>
                      </div>)
                  })}
                {
                  !!listDatas && listDatas.length === 0 ? <div className={styles.noData}>当前查询无数据</div> : null
                }
              </div>
            </div>
          </div>
          <div className={styles.pagination}>
            <div className={styles.page}><span className={styles.count}>当前共{totalCount}条，每页显示10条</span><Pagination showQuickJumper current={current} total={totalCount} onChange={this.handlePagination} /></div>
          </div>
        </div>
        {showGroupMsg ?
          <div className={styles.traBox}>
            <div className={styles.addListBox}>
              <div className={styles.titleBox}>
                <div className={styles.title} style={{ marginRight: 15 }}><Icon type="double-right" /><span>角色信息</span></div>
                <Icon type="close" onClick={this.handleCloseGroupMsg} className={styles.close} />
              </div>
              <div className={styles.content}>
                <div className={styles.syetemItem}>
                  <span className={styles.item}>角色名称</span>
                  <div className={styles.inSle}>
                    <Input maxLength={18} placeholder="请输入角色名称" defaultValue={listItems && listItems.name} onChange={(e) => { this.handleGroupMsgChange(e, 'name') }} />
                  </div>
                </div>
                <div className={styles.syetemItem}><span className={styles.item}>角色描述</span>
                  <div className={styles.inSle}>
                    <Input maxLength={50} placeholder="请输入角色描述" defaultValue={listItems && listItems.remark} onChange={(e) => { this.handleGroupMsgChange(e, 'remark') }} />
                  </div>
                </div>
                <div className={styles.syetemItem}><span className={styles.item}>角色权限</span>
                  <div className={styles.inSle} style={{ maxHeight: '201px', overflowY: 'auto' }}>
                    {treeData ?
                      <Tree
                        checkable
                        checkStrictly
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                        defaultExpandAll={true}
                      >
                        {this.renderTreeNodes(treeData)}
                      </Tree> : null}
                  </div>
                </div>
                <div className={styles.syetemItem}>
                  <span className={styles.botton} style={{ position: 'initial' }} onClick={this.handleAddEdit}>确认</span>
                  <span className={styles.botton} style={{ position: 'initial', color: '#817d7a' }} onClick={this.handleCloseGroupMsg}>取消</span>
                </div>
              </div>
            </div>
          </div> : null}
      </div>
    )
  }
}

export default Jurisdiction
