import React, { PureComponent } from 'react'
import { Icon, Radio, Upload, message } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { getUnitInfoList, getUnitPop } from '../../../../reactRedux/actions/publicActions'
// import { getStepStatus } from '../../../../reactRedux/actions/signalmanagementActions'
import styles from '../SignalManagement.scss'


// 上传图片的格式及大小
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.info("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.info("图片大小不能大于2MB!");
  }
  return isJpgOrPng && isLt2M;
}
class BasicInfoLeft extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      baseMapValue: 1, //选择底图
    }
  }
  // step2 底图选择
  onChangeBaseMap = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      baseMapValue: e.target.value,
    })
  }
  handleChangeBaseMap = (info) => {
    this.props.handleChangeBaseMap(info)
  }
  popLayerShowHide = (name, flag) => {
    this.props.popLayerShowHide(name, flag)
  }
  handleClickBaseMap = () => {
    this.props.handleClickBaseMap()
  }
  render() {
    const uploadButton = (
      <em>{this.props.baseLoading ? <span><Icon type="loading" /> loading</span> : '上 传'}</em>
    );
    return (
      <div className={styles.maskBg}>
        <div className={styles.popBox}>
          <div className={styles.popTit}>请点击图片 > 已选中当前图片为底图<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("baseMapFlag", null) }} /></div>
          <div className={styles.popCon}>这里显示图片</div>
        </div>
        <div className={styles.popBox} style={{ top: '75%' }} >
          <div className={styles.popTit}>选择底图<Icon className={styles.Close} type="close" onClick={() => { this.popLayerShowHide("baseMapFlag", null) }} /></div>
          <div className={styles.popCon}>
            <div className={styles.typePic}>
              <Radio.Group name="radiogroup" onChange={this.onChangeBaseMap} value={this.state.baseMapValue}>
                <Radio value={1}>选择底图</Radio>
                <Radio value={2}>上传底图</Radio>
              </Radio.Group>
            </div>
            <div className={styles.typePic} style={{ width: '220px' }}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChangeBaseMap}
              >
                {this.props.imageUrl ?
                  <img src={this.props.imageUrl} alt="底图" style={{ width: "100%" }} /> : <s>图片预览</s>
                }
                {this.state.baseMapValue === 2 ? uploadButton : null}
              </Upload>
              {this.state.baseMapValue === 2 ? null : <em>选 择</em>}

            </div>
          </div>
          <div className={styles.popBottom}>
            <em onClick={this.handleClickBaseMap}>确 定</em>
            <em onClick={() => { this.popLayerShowHide("baseMapFlag", null) }}>取 消</em>
          </div>
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
    // getUnitInfoList: bindActionCreators(getUnitInfoList, dispatch),
    // getUnitPop: bindActionCreators(getUnitPop, dispatch),
    // getStepStatus: bindActionCreators(getStepStatus, dispatch),
  }
}
export default connect(mapStateToProps, mapDisPatchToProps)(BasicInfoLeft)