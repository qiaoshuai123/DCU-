import React from 'react'
import { Icon, Modal } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import detectorIcon from '../../../../images/detector_icon.png'
import { postUpdatePicType, getDelPicType, getPicListsType } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'
import Liststyles from '../../ListForAntd/ListForAntd.scss'
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
  checkReturnType = (typeUrl) => {
    let typeName = ''
    switch(typeUrl) {
      case 'lane':
        return typeName = 'LANE';
      case 'lampgroup':
        return typeName = 'LIGHT';
      case 'detector':
        return typeName = 'DETECTOR';
    }
  }
  handleDeviceUp = () => {
    const nowTime = new Date().getTime()
    this.imgBox.style.cursor = 'pointer'
    const {
      id,
      laneId,
      imageUrl,
      x,
      y
    } = this.props.imgMsg
    if (nowTime - this.timeStep > 200) {
      this.props.postUpdatePicType({'id': id, 'x': this.ImgLeft, 'y': this.ImgTop}, this.checkReturnType(this.props.typeUrl))
    }
  }
  handleHover = () => {
    this.setState({ showCloseTag: true })
    // const nowTime = new Date().getTime()
    // if (nowTime - this.timeStep < 300) {
    // }   
  }
  handleLink = () => {
    const showTime = setTimeout(() => {
      this.setState({ showCloseTag: false })     
      clearTimeout(showTime)
    }, 6000)
  }
  handleClick = (e) => {
    e.stopPropagation();
    const nowTime = new Date().getTime()
    if (nowTime - this.timeStep < 200) {
      const idStr = e.currentTarget.getAttribute("pic-mark");
      let flagH;
      if ($(e.currentTarget).hasClass(styles.imgCurrent)) {
        $(e.currentTarget).removeClass(styles.imgCurrent)
        $('div[tag-mark]').map(( i, item ) => {
          if (item.getAttribute('tag-mark') === idStr) {
            $(item).removeClass(styles.hover)
          } else if (item.getAttribute('tag-mark') === idStr.replace('lampgroup', '')) {
            $(item).removeClass(Liststyles.hover)
          } else if (item.getAttribute('tag-mark') && item.getAttribute('tag-mark').indexOf(',') > -1) {
            const picLeftArr = item.getAttribute('tag-mark').split(',')
            for (let s = 0; s < picLeftArr.length; s++){
              if ($(`div[pic-mark='lampgroup`+picLeftArr[s]+`']`).hasClass(styles.imgCurrent)){
                flagH = true
                break
              } else {
                if (picLeftArr.length - 1 === s) {
                  flagH = $(`div[pic-mark='lampgroup`+picLeftArr[s]+`']`).hasClass(styles.imgCurrent)
                }
              }
            }
            // console.log(flagH, '看下最后状态')
            flagH ? null : $(item).removeClass(Liststyles.hover)
          }
        })
      } else {
        $(e.currentTarget).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
        $('div[tag-mark]').map(( i, item ) => {
          $(item).removeClass(styles.hover)
          $(item).removeClass(Liststyles.hover)
          if (item.getAttribute('tag-mark') === idStr) {
            $(item).addClass(styles.hover).siblings().removeClass(styles.hover)
          } else if (item.getAttribute('tag-mark') === idStr.replace('lampgroup', '')) {
            $(item).addClass(Liststyles.hover)
          } else if (item.getAttribute('tag-mark') && item.getAttribute('tag-mark').indexOf(',') > -1) {
            const newImgNo = idStr.replace('lampgroup', '')
            if (item.getAttribute('tag-mark').indexOf(newImgNo) > -1 ) {
              $(item).addClass(Liststyles.hover)
            }
          }
        })
      }
    } else if (!this.timeStep) {
      const idStr = e.currentTarget.getAttribute("pic-mark");
      let flagH;
      if ($(e.currentTarget).hasClass(styles.imgCurrent)) {
        $(e.currentTarget).removeClass(styles.imgCurrent)
        $('div[tag-mark]').map(( i, item ) => {
          if (item.getAttribute('tag-mark') === idStr) {
            $(item).removeClass(styles.hover)
          } else if (item.getAttribute('tag-mark') === idStr.replace('lampgroup', '')) {
            $(item).removeClass(Liststyles.hover)
          } else if (item.getAttribute('tag-mark') && item.getAttribute('tag-mark').indexOf(',') > -1) {
            const picLeftArr = item.getAttribute('tag-mark').split(',')
            for (let s = 0; s < picLeftArr.length; s++){
              if ($(`div[pic-mark='lampgroup`+picLeftArr[s]+`']`).hasClass(styles.imgCurrent)){
                flagH = true
                break
              } else {
                if (picLeftArr.length - 1 === s) {
                  flagH = $(`div[pic-mark='lampgroup`+picLeftArr[s]+`']`).hasClass(styles.imgCurrent)
                }
              }
            }
            // console.log(flagH, '看下最后状态')
            flagH ? null : $(item).removeClass(Liststyles.hover)
          }
        })
      } else {
        $(e.currentTarget).addClass(styles.imgCurrent).siblings().removeClass(styles.imgCurrent)
        $('div[tag-mark]').map(( i, item ) => {
          $(item).removeClass(styles.hover)
          $(item).removeClass(Liststyles.hover)
          if (item.getAttribute('tag-mark') === idStr) {
            $(item).addClass(styles.hover).siblings().removeClass(styles.hover)
          } else if (item.getAttribute('tag-mark') === idStr.replace('lampgroup', '')) {
            $(item).addClass(Liststyles.hover)
          } else if (item.getAttribute('tag-mark') && item.getAttribute('tag-mark').indexOf(',') > -1) {
            const newImgNo = idStr.replace('lampgroup', '')
            if (item.getAttribute('tag-mark').indexOf(newImgNo) > -1 ) {
              $(item).addClass(Liststyles.hover)
            }
          }
        })
      }
    }
  }
  handleDel = (e, id) => {
    e.stopPropagation();
    const _this = this;
    Modal.confirm({
      title: '确认要删除该数据？',
      cancelText: '取消',
      okText: '确认',
      onOk() {
        const resultP = Promise.resolve(_this.props.getDelPicType(id, _this.checkReturnType(_this.props.typeUrl)))
        resultP.then((res)=>{
          _this.props.getPicListsType(_this.props.roadInterId, _this.props.roadNodeNo, _this.checkReturnType(_this.props.typeUrl))
          message.info('操作成功！')
        })
      },
      onCancel() { },
    })
    
  }
  render() {
    const {
      id,
      laneId,
      lampgroupNo,
      detectorId,
      imageUrl,
      x,
      y
    } = this.props.imgMsg
    const { showCloseTag } = this.state
    const imgStyle = {
      position: 'absolute', display: 'inline-block', top: `${y}px`, left: `${x}px`, userSelect: 'none', cursor: 'pointer',
      paddingTop: '14px'
    }
    const imgStyleL = {
      position: 'absolute', display: 'inline-block', top: `${y}px`, left: `${x}px`, userSelect: 'none', paddingTop: '14px'
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
      tagMark = "lampgroup" + lampgroupNo
    } else if(this.props.typeUrl === 'detector') {
      thisName = "stepFourAddEdit";
      thisUrl = "detector";
      tagMark = "detector" + detectorId
    }
    return (
      <React.Fragment>
        {
          id ?
            <div onMouseDown={(!this.props.isMoveFlag ? null : this.handleDeviceDown)}
              onClick={(!this.props.isClick ? null : this.handleClick)}
              onMouseOver={(!this.props.isMoveFlag ? null : this.handleHover)}
              onMouseOut={this.handleLink}
              onMouseUp={this.handleDeviceUp}
              onDoubleClick={()=>{ (!this.props.isMoveFlag ? null : this.popLayerShowHide(thisName, true, true)) }}
              style={(!this.props.isMoveFlag ? imgStyleL : imgStyle)}
              pic-mark={tagMark}
              ref={(input) => { this.imgBox = input }}
              draggable="false">
              { showCloseTag ? <Icon style={{position:'absolute', right:'-6px', top: '0', cursor: 'pointer'}} title='删除' type="close"  onClick={ (e) => this.handleDel(e, id) } /> : null }
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
    getDelPicType: bindActionCreators(getDelPicType, dispatch),
    getPicListsType: bindActionCreators(getPicListsType, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(ImgEvent)
