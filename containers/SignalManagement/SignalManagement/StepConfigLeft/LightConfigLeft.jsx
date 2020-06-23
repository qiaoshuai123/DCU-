import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'
import ImgEvent from '../ImgEvent/ImgEvent'
class LightConfigLeft extends PureComponent {
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
          this.props.lights.length > 0 && this.props.lights.map((item, i) => {
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
export default connect(mapStateToProps, mapDisPatchToProps)(LightConfigLeft)
