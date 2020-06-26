import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImgEvent from '../ImgEvent/ImgEvent'
import { getPicListsType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class LaneConfigLeft extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lanePicLists: [
        {
          UI_WIDTH: 66,
          DEVICE_NAME: "车道",
          P_TOP: 343,
          UI_HIGHT: 20,
          UI_IMAGE_NAME: "westleft_23.gif",
          DETAIL: "无",
          DEVICE_CODE: 1,
          P_LEFT: 485,
          DEVICE_ID: 9370224,
          UI_TYPE_ID: 3
        },
      ],// 车道
    }
  }
  componentDidUpdate = (prevState) => {
    const { lanePicLists } = this.props.data
    if (prevState.data.lanePicLists !== lanePicLists) {
      // console.log(mapPointsData, '点数据')
      this.setState({ lanePicLists })
    }
  }
  componentDidMount = () => {
    console.log(this.props.isMoveFlag, '状态')
    this.props.getPicListsType(this.props.roadInterId, this.props.roadNodeNo, 'LANE')
  }
  popLayerShowHide = (name, flag, eventType) => {
    this.props.popLayerShowHide(name, flag, eventType)
  }

  render() {
    const { lanePicLists } = this.state
    return (
      <div>
        {
          lanePicLists.length > 0 && lanePicLists.map((item, i) => {
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
export default connect(mapStateToProps, mapDisPatchToProps)(LaneConfigLeft)