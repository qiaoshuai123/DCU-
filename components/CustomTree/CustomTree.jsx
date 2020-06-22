import React from 'react'
import { Icon, Tooltip } from 'antd'

import styles from './CustomTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [],
      visible: 0, // 右键菜单
      treeChecked: null,
    }
  }
  componentDidMount = () => {
  }
  btns = (id) => {
    // console.log(id)
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    this.setState({ expendsKey: this.state.expendsKey })
  }
  handleTreeSelect = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const id = Number(e.currentTarget.getAttribute('id'))
    this.treeIndex = Number(e.currentTarget.getAttribute('itemindex'))
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    if (!this.props.rightDownNone) {
      this.props.visibleShowLeft('', '', false)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    // this.props.getSelectTreeId(id)
  }
  handleTreeChildSelect = (e, index) => {
    e.stopPropagation()
    const id = Number(e.currentTarget.getAttribute('id'))
    const lng = Number(e.currentTarget.getAttribute('lng'))
    const lat = Number(e.currentTarget.getAttribute('lat'))
    if (id) {
      this.props.getSelectChildId(id, index, lng, lat)
    }
  }
  rightDown = (e, id, boolean) => { // 鼠标右击
    if (this.props.rightDownNone) return false
    e.stopPropagation()
    e.preventDefault()
    const { visibleShowLeft } = this.props
    if (boolean) {
      const top = e.pageY
      if (e.button === 2) {
        visibleShowLeft(top, id, true)
      }
    } else {
      visibleShowLeft('', '', false)
    }
  }
  noShow = (e) => { // 禁止默认右键菜单
    e.stopPropagation()
    e.preventDefault()
  }
  render() {
    const { expendsKey, treeChecked } = this.state
    const loop = data => (
      data.map((item, index) => {
        const isOpen = expendsKey.indexOf(item.id) >= 0
        if (item.units && item.units.length) {
          return (
            <li className={styles.childLi} key={item.id} id={item.id} onClick={this.handleTreeSelect}>
              <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
              <span className={styles.childNode}>{item.codeName}</span>
              {
                isOpen &&
                <ul className={styles.childTree}>
                  {loop(item.units)}
                </ul>
              }
            </li>
          )
        }
        return (
          <li
            className={styles.childLi}
            onMouseDown={(e) => { this.rightDown(e, '', false) }}
            key={item.id}
            id={item.id}
            lng={item.lng}
            lat={item.lat}
            onClick={(e)=>{this.handleTreeChildSelect(e, index)}}
          >
            <span className={styles.childIcon}><Icon type="environment" theme="filled" /></span>
            <span title={item.interName} className={styles.childNode}>{item.interName}</span>
          </li>
        )
      })
    )
    return (
      <div className={styles.treeWrapper}>
        <ul className={styles.treeList}>
          {
            this.props.data.dcuTreeData && this.props.data.dcuTreeData.map((item) => {
              const isOpen = expendsKey.indexOf(item.id) >= 0
              return (
                <li className={styles.treeLi} key={item.id} id={item.id} onContextMenu={this.noShow} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
                  </span>
                  <span title={item.codeName} onClick={() => this.btns(item.id)} onMouseDown={e => this.rightDown(e, item.id, true)} className={styles.childNode}>{item.codeName}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.id}>
                      {loop(item.units)}
                    </ul>
                  }
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default CustomTree
