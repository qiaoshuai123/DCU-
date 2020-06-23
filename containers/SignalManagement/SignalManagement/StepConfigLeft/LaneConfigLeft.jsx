import React, { PureComponent } from 'react'
import { Input, Icon, message } from 'antd'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ImgEvent from '../ImgEvent/ImgEvent'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'

class LaneConfigLeft extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidUpdate = (prevState) => {
    
  }
  componentDidMount = () => {
    console.log(this.props.isMoveFlag, '状态')
  }
  popLayerShowHide = (name, flag, eventType) => {
    this.props.popLayerShowHide(name, flag, eventType)
  }

  render() {
    return (
      <div>
        {
          this.props.lanes.length > 0 && this.props.lanes.map((item, i) => {
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
export default connect(mapStateToProps, mapDisPatchToProps)(LaneConfigLeft)