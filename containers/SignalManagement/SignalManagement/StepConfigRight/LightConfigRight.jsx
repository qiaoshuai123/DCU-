import React, { PureComponent } from 'react'
import { Input, Icon, message, Modal } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getStepStatus, getPicListsType, getInfoListsType, getDelInfoType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class LightConfigRight extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lightLists: null,
      clickFlag: null,
      userLimit: null,
    }
  }
  componentDidUpdate = (prevState) => {
    const { lightLists } = this.props.data
    if (prevState.data.lightLists !== lightLists) {
      this.setState({ lightLists })
    }
  }
  componentDidMount = () => {
    // 获取用户权限
    const limitArr = JSON.parse(localStorage.getItem('userLimit'))
    limitArr.forEach((item) => {
      if (item.id === 201){
        this.setState({ userLimit: true })
      }
    })
    this.props.getInfoListsType(this.props.roadInterId, 'LIGHT')
  }
  popLayerShowHide = (name, flag, event, stepType) => {
    this.props.popLayerShowHide(name, flag, event, stepType)
  }
  handleClickFind = (e) => {
    this.props.tagToPicMark(e)
  }
  delListItem = (e, id) => {
    e.stopPropagation();
    const _this = this;
    Modal.confirm({
      title: '确认要删除该数据？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        const resultP = Promise.resolve(_this.props.getDelInfoType(id, 'LIGHT'))
        resultP.then((res)=>{
          _this.props.getStepStatus(_this.props.roadInterId, _this.props.roadNodeNo)
          _this.props.getPicListsType(_this.props.roadInterId, _this.props.roadNodeNo, 'LIGHT')
          _this.props.getInfoListsType(_this.props.roadInterId, 'LIGHT')
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
  }
  updateListItem = (itemDetailData, stepType, e) => {
    e.stopPropagation();
    this.props.getUpdateAllTypes(itemDetailData.interId, this.props.roadNodeNo, itemDetailData.lampgroupNo, stepType, true)
  }
  render() {
    const { lightLists, clickFlag, userLimit } = this.state
    return (
      <div className={styles.conBox}>
        <div className={styles.rTit}>灯组配置列表{ userLimit ? <em onClick={() => { this.popLayerShowHide("stepThreeAddEdit", true, null, 'LIGHT') }}>添加</em> : null }</div>

        <div className={styles.rList}>
          { lightLists === null || lightLists.length === 0  ? <div className={styles.noData}>暂无数据</div> : <div className={styles.listItem}>
            <em>灯组序号</em>
            <em>灯组类型</em>
            <em>控制转向</em>
            <em>控制方向</em>
            { userLimit ? <em>操作</em> : null }
          </div> }
          {
            lightLists && lightLists.map((item) => {
              return <div onClick={this.handleClickFind} key={'lampgroup'+item.lampgroupNo} tag-mark={'lampgroup'+item.lampgroupNo} className={classNames(styles.listItem, clickFlag ? styles.current : null)}>
                        <span>{!item.lampgroupNo ? '无' : item.lampgroupNo}</span>
                        <span>{!item.lampgroupTypeName ? '无' : item.lampgroupTypeName}</span>
                        <span>{!item.controlTurnName ? '无' : item.controlTurnName}</span>
                        <span>{!item.controlDirName ? '无' : item.controlDirName}</span>
                        { userLimit ? <span className={styles.del}><b onClick={(e) => this.updateListItem(item, 'LIGHT', e)}>修改</b><b onClick={(e) => this.delListItem(e, item.id)}>删除</b></span> : null }
                      </div>
            })
          }
          
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: { ...state.publicData, ...state.SignalManagement },
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    getStepStatus: bindActionCreators(getStepStatus, dispatch),
    getPicListsType: bindActionCreators(getPicListsType, dispatch),
    getInfoListsType: bindActionCreators(getInfoListsType, dispatch),
    getDelInfoType: bindActionCreators(getDelInfoType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(LightConfigRight)