import React, { PureComponent } from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImgEvent from '../ImgEvent/ImgEvent'
import { getPicListsType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'
class LightConfigLeft extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lightPicLists: [
        {
          UI_WIDTH: 85,
          DEVICE_NAME: "灯",
          P_TOP: 343,
          UI_HIGHT: 31,
          UI_IMAGE_NAME: "arrow42_21.gif",
          DETAIL: "无",
          DEVICE_CODE: 1,
          P_LEFT: 485,
          DEVICE_ID: 9370224,
          UI_TYPE_ID: 4
        },
      ],// 灯组排列
    }
  }
  componentDidUpdate = (prevState) => {
    const { lightPicLists } = this.props.data
    if (prevState.data.lightPicLists !== lightPicLists) {
      this.setState({ lightPicLists })
    }
  }
  componentDidMount = () => {
    console.log(this.props.isMoveFlag, '状态')
    this.props.getPicListsType(this.props.roadInterId, this.props.roadNodeNo, 'LIGHT')
  }
  popLayerShowHide = (name, flag, eventType) => {
    this.props.popLayerShowHide(name, flag, eventType)
  }

  render() {
    const { lightPicLists } = this.state
    return (
      <div>
        {
          lightPicLists.length > 0 && lightPicLists.map((item, i) => {
            return <ImgEvent {...this.props} key={'light'+item.id} lightSelectIds={this.props.lightSelectIds} isMoveFlag={this.props.isMoveFlag} isClick={this.props.isClick} imgMsg={item} typeUrl={this.props.typeUrl} popLayerShowHide={this.popLayerShowHide} />
          })
        }
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
    getPicListsType: bindActionCreators(getPicListsType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(LightConfigLeft)
