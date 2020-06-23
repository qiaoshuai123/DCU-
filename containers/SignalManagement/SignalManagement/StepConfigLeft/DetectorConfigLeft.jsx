import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImgEvent from '../ImgEvent/ImgEvent'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class DetectorConfigLeft extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidUpdate = () => {

  }
  componentDidMount = () => {

  }
  popLayerShowHide = (name, flag, eventType) => {
    this.props.popLayerShowHide(name, flag, eventType)
  }

  render() {
    return (
      <div>
        {
          this.props.detectors.length > 0 && this.props.detectors.map((item, i) => {
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

  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(DetectorConfigLeft)