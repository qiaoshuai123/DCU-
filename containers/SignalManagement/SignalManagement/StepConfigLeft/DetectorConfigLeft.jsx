import React, { PureComponent } from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImgEvent from '../ImgEvent/ImgEvent'
import { getPicListsType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class DetectorConfigLeft extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      detectorPicLists: [
        {
          UI_WIDTH: 24,
          DEVICE_NAME: "检测器",
          P_TOP: 343,
          UI_HIGHT: 23,
          UI_IMAGE_NAME: "detector_1.png",
          DETAIL: "无",
          DEVICE_CODE: 1,
          P_LEFT: 485,
          DEVICE_ID: 9370224,
          UI_TYPE_ID: 2
        },
      ], // 检测器
    }
  }
  componentDidUpdate = (prevState) => {
    const { detectorPicLists } = this.props.data
    if (prevState.data.detectorPicLists !== detectorPicLists) {
      // console.log(mapPointsData, '点数据')
      this.setState({ detectorPicLists })
    }
  }
  componentDidMount = () => {
    console.log(this.props.isMoveFlag, '状态')
    this.props.getPicListsType(this.props.roadInterId, this.props.roadNodeNo, 'DETECTOR')
  }
  popLayerShowHide = (name, flag, eventType) => {
    this.props.popLayerShowHide(name, flag, eventType)
  }

  render() {
    const { detectorPicLists } = this.state
    return (
      <div>
        {
          detectorPicLists.length > 0 && detectorPicLists.map((item, i) => {
            return <ImgEvent isMoveFlag={this.props.isMoveFlag} key={item.DEVICE_CODE} imgMsg={item} popLayerShowHide={this.popLayerShowHide} />
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
export default connect(mapStateToProps, mapDisPatchToProps)(DetectorConfigLeft)