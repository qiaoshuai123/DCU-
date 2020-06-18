import React, { Component } from 'react'
import { Input, Icon } from 'antd'
import classNames from 'classnames'
import styles from './Information.scss'

// 图片转64位
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
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
class Information extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interRoadBg: '',
      baseMapFlag: false, // 是否显示
      baseMapValue: 1, // 选择底图
    }
  }
  // step2 底图选择
  onChangeBaseMap = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      baseMapValue: e.target.value,
    })
  }
  handleChangeBaseMap = info => {
    if (info.file.status === "uploading") {
      this.setState({ baseLoading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          baseLoading: false
        })
      )
    }
  }
  handleClickBaseMap = () => {
    console.log(this.state.imageUrl)
    if (this.state.imageUrl === '' && this.state.baseMapValue === 2) {
      message.info("请选择底图！");
    } else {
      message.info("底图设置成功！");
      this.setState({
        interRoadBg: this.state.imageUrl,
      }, () => {
        this.popLayerShowHide("baseMapFlag", null)
      })
    }
  }
  // 显示隐藏弹层
  popLayerShowHide = (name, flag) => {
    this.setState({
      [name]: flag,
    })
  }
  render() {
    const { Search } = Input
    const { interRoadBg, baseMapFlag } = this.state
    return (
      <div className={styles.Information}>
        <div className={styles.stepLeftCon}>
          {/* <div className={styles.leftItemCon}> */}
          <div className={styles.leftItemCon} style={interRoadBg !== '' ? {
            background: 'url(' + interRoadBg + ') no-repeat', backgroundPosition: 'center center',
            backgroundSize: 'contain'
          } : {}}>
            {/* 内部变化内容 */}
            {baseMapFlag ?
              <div className={styles.maskBg}><div className={styles.popBox} style={{ top: '75%' }} >
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
                      {imageUrl ?
                        <img src={imageUrl} alt="底图" style={{ width: "100%" }} /> : <s>图片预览</s>
                      }
                      {this.state.baseMapValue === 2 ? uploadButton : null}
                    </Upload>
                    {this.state.baseMapValue === 2 ? null : <em>选 择</em>}

                  </div>
                </div>
                <div className={styles.popBottom}>
                  <em onClick={() => { this.handleClickBaseMap() }}>确 定</em>
                  <em onClick={() => { this.popLayerShowHide("baseMapFlag", null) }}>取 消</em>
                </div>
              </div></div> : null
            }
            <div className={styles.turnBgBtn} onClick={() => { this.popLayerShowHide("baseMapFlag", true) }}>路口底图</div>
          </div>
        </div>
        <div className={styles.stepRightCon}>
          <div className={styles.conBox}>
            <div className={styles.rTit}>信号机基础信息<em>添加</em></div>
            {/* 表单 */}
            <div className={styles.rCon}>
              <div className={styles.itemInputBox}>
                <span>信号机编号：</span><Input placeholder="请输入编号" />
              </div>
              <div className={styles.itemInputBox}>
                <span>信号机IP：</span><Input placeholder="请输入IP" />
              </div>
              <div className={styles.itemInputBox}>
                <span>子网掩码：</span><Input placeholder="请输入掩码" />
              </div>
              <div className={styles.itemInputBox}>
                <span>网 关：</span><Input placeholder="请输入网关" />
              </div>
              <div className={styles.itemInputBox}>
                <span>上位机IP：</span><Input placeholder="请输入IP" />
              </div>
              <div className={styles.itemInputBox}>
                <span>通讯端口：</span><Input placeholder="请输入端口" />
              </div>
              <div className={styles.itemInputBox}>
                <span>信号机时区：</span><Input placeholder="请输入时区" />
              </div>
              <div className={styles.itemInputBox}>
                <span>控制路口数：</span><Input type="number" placeholder="请输入数量" />
              </div>
              <div className={styles.itemInputBox}>
                <span>GPS时钟标志：</span><Input placeholder="请输入标志" />
              </div>
            </div>
            {/* 列表 */}
            <div className={styles.rList}>
              <div className={styles.listItem}>
                <em>灯组序号</em>
                <em>方向</em>
                <em>灯组类型</em>
                <em>操作</em>
              </div>
              <div className={classNames(styles.listItem)}>
                <span>1</span>
                <span>东</span>
                <span>圆灯</span>
                <span>删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Information
