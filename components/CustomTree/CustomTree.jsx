import React from 'react'
import { Icon, Tooltip } from 'antd'
import { fromLonLat } from 'ol/proj'
import styles from './CustomTree.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUnitTree } from '../../reactRedux/actions/publicActions'
import { getRegionNum } from '../../reactRedux/actions/equipmentManagement'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [],
      visible: 0, // 右键菜单
      treeChecked: null,
      dcuTreeData: null,
    }
  }
  componentDidMount = () => {
    this.props.getUnitTree()
  }
  componentDidUpdate = (prevState) => {
    const { dcuTreeData } = this.props.data
    if (prevState.data.dcuTreeData !== dcuTreeData) {
      this.countNumber(dcuTreeData)
      this.setState({
        dcuTreeData: dcuTreeData,
      })
    }
  }
  countNumber = (data) => {
    let onNum = 0, allNum = 0;
    data.map(item => {
      onNum += item.onlineUnitNum
      allNum += item.unitNum
    })
    localStorage.setItem('countOnNum', onNum)
    localStorage.setItem('countAllNum', allNum)
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
  handleTreeSelect = (e, name, code) => {
    e.stopPropagation()
    e.preventDefault()
    const id = Number(e.currentTarget.getAttribute('id'))
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
      if (this.state.expendsKey.length < 1) {
        const objs = {
          codeName: '',
          dictCode: '',
        }
        this.props.getRegionNum(objs)
      }
    } else {
      this.state.expendsKey.push(id)
      if (name) {
        const objs = {
          codeName: name,
          dictCode: code,
        }
        this.props.getRegionNum(objs)
      }
    }
    if (!this.props.rightDownNone) {
      this.props.visibleShowLeft('', '', false)
    }
    this.setState({ expendsKey: this.state.expendsKey })
    // this.props.getSelectTreeId(id)
  }
  handleTreeChildSelect = (e, dataItem) => {
    e.stopPropagation()
    const id = Number(e.currentTarget.getAttribute('id'))
    const lng = Number(e.currentTarget.getAttribute('lng'))
    const lat = Number(e.currentTarget.getAttribute('lat'))
    if (this.props.oLMapFlag){
      if (lng && lat && id) {
        this.props.getSelectChildId(id, dataItem.interName, dataItem)
        // 查找坐标弹层
        const overLayer = mapOL.getOverlayById("oLMarker")
        // 坐标转换
        const resultLngLat = fromLonLat([lng, lat])
        // const resultLngLat = fromLonLat([102.829999, 24.894869])
        // 把浮层显示出来
        overLayer.setPosition(resultLngLat)
        mapOL.getView().setCenter(resultLngLat) // 设置中心点
        // 内容自定
        // $("#message").trigger('click')
      } else {
        message.info('未能找到相应坐标！')
      }
    } else {
      if (id) {
        this.props.getSelectChildId(id, lng, lat)
      }
    }
  }
  rightDown = (e, id, boolean, objs) => { // 鼠标右击
    e.stopPropagation()
    if (this.props.rightDownNone) return false
    e.stopPropagation()
    e.preventDefault()
    const { visibleShowLeft } = this.props
    if (!boolean) {
      const top = e.pageY
      if (e.button === 2) {
        console.log(top, id, true, objs, '1111111')
        visibleShowLeft(top, id, true, objs)
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
            <li className={styles.childLi} key={item.id} id={item.id} interid={item.interId} onClick={this.handleTreeSelect}>
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
            onMouseDown={(e) => { this.rightDown(e, item.id, false, item) }}
            key={item.id}
            id={item.id}
            lng={item.lng}
            interid={item.interId}
            lat={item.lat}
            onClick={(e) => { this.handleTreeChildSelect(e, item) }}
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
            this.props.data.dcuTreeData && this.props.data.dcuTreeData.map((item, i) => {
              const isOpen = expendsKey.indexOf(item.id) >= 0
              return (
                <li className={styles.treeLi} key={item.id} id={item.id} onContextMenu={this.noShow} onClick={e => this.handleTreeSelect(e, item.codeName, item.dictCode, i)}>
                  <span className={styles.treeIcon}>
                    <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
                  </span>
                  <span title={item.codeName} onClick={() => this.btns(item.id)} onMouseDown={e => this.rightDown(e, '', true)} className={styles.childNode}>{item.codeName}( <em style={{fontSize: '16px', color: 'orange'}}>{item.onlineUnitNum}</em> / <em style={{fontSize: '12px'}}>{item.unitNum}</em> )</span>
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

const mapStateToProps = (state) => {
  return {
    data: { ...state.publicData },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getUnitTree: bindActionCreators(getUnitTree, dispatch),
    getRegionNum: bindActionCreators(getRegionNum, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(CustomTree)
