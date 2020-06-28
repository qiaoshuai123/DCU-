import React from 'react'
import { Icon } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import detectorIcon from '../../../../images/detector_icon.png'
import { postUpdatePicType } from '../../../../reactRedux/actions/signalmanagementActions'

class ImgEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCloseTag: false,
    }
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

  }

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
      id,
      laneId,
      imageUrl,
      x,
      y
    } = this.props.imgMsg
    if (nowTime - this.timeStep > 200) {
      if (this.props.typeUrl === 'lane') {
        this.props.postUpdatePicType({'id': id, 'x': this.ImgLeft, 'y': this.ImgTop}, 'LANE')
      } else if(this.props.typeUrl === 'lampgroup'){
        this.props.postUpdatePicType({'id': id, 'x': this.ImgLeft, 'y': this.ImgTop}, 'LIGHT')
      } else if(this.props.typeUrl === 'detector') {
        this.props.postUpdatePicType({'id': id, 'x': this.ImgLeft, 'y': this.ImgTop}, 'DETECTOR')
      } 
    }
  }
  handleHover = () => {
    const nowTime = new Date().getTime()
    if (nowTime - this.timeStep < 300) {
      this.setState({ showCloseTag: true })
    }   
  }
  handleLink = (e) => {
    console.log(e.currentTarget.getAttribute("tag-mark"))
    // $("#"+e.currentTarget.getAttribute("tag-mark"))
    const showTime = setTimeout(() => {
      this.setState({ showCloseTag: false })     
      clearTimeout(showTime)
    }, 6000)
  }
  render() {
    const {
      id,
      laneId,
      asd,
      imageUrl,
      x,
      y
    } = this.props.imgMsg
    const { showCloseTag } = this.state
    const imgStyle = {
      position: 'absolute', display: 'inline-block', top: `${y}px`, left: `${x}px`, userSelect: 'none', cursor: 'pointer',
      paddingTop: '14px'
    }
    let thisName = '';
    let thisUrl= '';
    let tagMark = '';
    if (this.props.typeUrl === 'lane') {
      thisName = "stepRoadAddEdit";
      thisUrl = "lane";
      tagMark = "lane" + laneId
    } else if(this.props.typeUrl === 'lampgroup'){
      thisName = "stepThreeAddEdit";
      thisUrl = "lampgroup";
      tagMark = "lampgroup" + laneId
    } else if(this.props.typeUrl === 'detector') {
      thisName = "stepFourAddEdit";
      thisUrl = "detector";
      tagMark = "detector" + laneId
    }
    return (
      <React.Fragment>
        {/* {
          id ?
            <img 
              onMouseDown={(!this.props.isMoveFlag ? null : this.handleDeviceDown)}
              onMouseUp={this.handleDeviceUp}
              onDoubleClick={()=>{ (!this.props.isMoveFlag ? null : this.popLayerShowHide(thisName, true, true)) }}
              style={imgStyle}
              tag-mark={tagMark}
              ref={(input) => { this.imgBox = input }}
              draggable="false"
              src={ this.props.typeUrl === 'detector' ? detectorIcon : `http://192.168.1.213:20203/DCU/dcuImage/${thisUrl}/${imageUrl}`}
              alt=""
            /> : null
        } */}
        {
          id ?
            <div onMouseDown={(!this.props.isMoveFlag ? null : this.handleDeviceDown)}
              onClick={this.handleHover}
              onMouseOut={this.handleLink}
              // onMouseOver={this.handleHover}
              onMouseUp={this.handleDeviceUp}
              onDoubleClick={()=>{ (!this.props.isMoveFlag ? null : this.popLayerShowHide(thisName, true, true)) }}
              style={imgStyle}
              tag-mark={tagMark}
              ref={(input) => { this.imgBox = input }}
              draggable="false">
              { showCloseTag ? <Icon style={{position:'absolute', right:'-6px', top: '0', cursor: 'pointer'}} title='删除' type="close"  onClick={ () => {console.log('删除了')} } /> : null }
              <img style={{pointerEvents:'none'}} src={ this.props.typeUrl === 'detector' ? detectorIcon : `http://192.168.1.213:20203/DCU/dcuImage/${thisUrl}/${imageUrl}`}
                alt="" />
            </div> : null
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
    postUpdatePicType: bindActionCreators(postUpdatePicType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(ImgEvent)
