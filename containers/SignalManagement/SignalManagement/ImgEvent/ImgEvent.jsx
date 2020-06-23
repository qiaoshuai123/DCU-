import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import {  } from '../../../../reactRedux/actions/signalmanagementActions'

class ImgEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.drag = false
  }
  componentDidMount = () => {
    document.addEventListener('mousemove', (e) => {
      if (this.drag) {
        const movePageX = e.pageX
        const movePageY = e.pageY
        this.ImgLeft = `${this.defaultLeft + (movePageX - this.defaultX)}`
        this.ImgTop = `${this.defaultTop + (movePageY - this.defaultY)}`
        const PrimitWidth = 978 - this.imgBox.offsetWidth
        const PrimitHeight = 780 - this.imgBox.offsetHeight
        if (this.ImgLeft < 0) {
          this.ImgLeft = 0
        }
        if (this.ImgTop < 0) {
          this.ImgTop = 0
        }
        if (this.ImgLeft > PrimitWidth) {
          this.ImgLeft = PrimitWidth
        }
        if (this.ImgTop > PrimitHeight) {
          this.ImgTop = PrimitHeight
        }
        this.imgBox.style.left = `${this.ImgLeft}px`
        this.imgBox.style.top = `${this.ImgTop}px`
      }
    })
    document.addEventListener('mouseup', () => {
      this.drag = false
    })
    // console.log(this.props.isMoveFlag, '状态')
  }
  componentDidUpdate = (prevState) => {
    const { showDeviceInfo } = this.props.data
    // if (prevState.data.showDeviceInfo !== showDeviceInfo) {
    //   this.getshowDeviceInfo(showDeviceInfo)
    // }
  }
  // getshowDeviceInfo = (showDeviceInfo) => {
  //   console.log(showDeviceInfo, 'ssv')
  // }
  popLayerShowHide = (name, flag, eventType) => {
    this.props.popLayerShowHide(name, flag, eventType)
  }
  handleDeviceDown = (e) => {
    this.timeStep = new Date().getTime()
    this.drag = true
    this.defaultX = e.pageX
    this.defaultY = e.pageY
    this.defaultLeft = parseInt(this.imgBox.style.left, 0)
    this.defaultTop = parseInt(this.imgBox.style.top, 0)
    this.imgBox.style.cursor = 'move'
  }
  handleDeviceUp = () => {
    const nowTime = new Date().getTime()
    this.imgBox.style.cursor = 'default'
    const {
      ID,
      DEVICE_ID,
      DETAIL,
      UI_WIDTH,
      UI_HIGHT,
    } = this.props.imgMsg
    if (nowTime - this.timeStep < 200) {
      if (DEVICE_ID) {
        // this.props.getshowDeviceInfo(ID, this.props.InterIds)
      } else {
        // this.props.showNameOfRoad(DETAIL, ID, UI_WIDTH, UI_HIGHT)
      }
    } else {
      // this.props.geteditDeviceInfoPo(ID, this.ImgLeft, this.ImgTop)
    }
  }
  render() {
    const {
      UI_WIDTH,
      UI_HIGHT,
      UI_TYPE_ID,
      UI_IMAGE_NAME,
      DEVICE_NAME,
      P_LEFT, P_TOP,
      DETAIL,
      DEVICE_ID,
    } = this.props.imgMsg
    const imgStyle = {
      position: 'absolute', top: `${P_TOP}px`, left: `${P_LEFT}px`, width: `${UI_WIDTH}px`, height: `${UI_HIGHT}px`, userSelect: 'none', cursor: 'pointer',
    }
    const deviceSrc = DEVICE_NAME === '信号机' && this.props.system === '海信' ? 'jm/' :
      DEVICE_NAME === '信号机' && this.props.system === '西门子' ? 'byzt/' : ''
    let thisName = '';
    if (UI_TYPE_ID === 3) {
      thisName = "stepRoadAddEdit";
    } else if(UI_TYPE_ID === 4){
      thisName = "stepThreeAddEdit";
    } else if(UI_TYPE_ID === 2) {
      thisName = "stepFourAddEdit";
    }
    return (
      <React.Fragment>
        {
          DEVICE_ID ?
            <img
              onMouseDown={(!this.props.isMoveFlag ? null : this.handleDeviceDown)}
              onMouseUp={this.handleDeviceUp}
              onDoubleClick={()=>{ (!this.props.isMoveFlag ? null : this.popLayerShowHide(thisName, true, true)) }}
              style={imgStyle}
              ref={(input) => { this.imgBox = input }}
              width="100%"
              height="100%"
              draggable="false"
              src={`http://192.168.1.123:26001/atms/imgs/${UI_TYPE_ID}/${UI_IMAGE_NAME}`}
              alt=""
            /> : null
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
  }
}
const mapDisPatchToProps = (dispatch) => {
  return {
    
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(ImgEvent)
