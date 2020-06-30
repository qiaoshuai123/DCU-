import React, { Component } from 'react'
import { Input, Select } from 'antd'
import  form '../../../'
import styles from './roadDetailEq.scss'

class JurManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interType: '',
      btnShows: true,
    }
  }

  render() {
    const { Option } = Select
    const { interType, btnShows, roadName, interName, interId, nodeId, lng, lat } = this.state
    return (
      <div className={styles.roadDetailEqBox}>
        <div className={styles.roadDetailLeft}>
          <img src="" alt="" />
        </div>
        <div className={styles.roadDetailRight}>
          <div className={styles.roadDetailRight_top}>
            <div className={styles.topTitle}><b style={{ color: '#15AEE5', margin: '0 3px' }}>{roadName}</b>点位信息<span onClick={this.closeMessage}>上传配置</span><span onClick={this.closeMessage}>下发配置</span></div>
            <div className={styles.items}><span>路口ID:</span><Input disabled={!btnShows} paths="interId" style={{ width: 300 }} value={interId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>路口名称:</span><Input paths="interName" style={{ width: 300 }} value={interName} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>是不是主控路口:</span>
              <Select value={interType} style={{ width: 300, margin: 0 }} onChange={this.changeNumber}>
                <Option pname="interType" value="">请选择</Option>
                <Option pname="interType" value="0">是</Option>
                <Option pname="interType" value="1">否</Option>
              </Select>
            </div>
            <div className={styles.items}><span>路口序号:</span><Input disabled={!btnShows} paths="nodeId" style={{ width: 300 }} value={nodeId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>经度:</span><Input paths="lng" style={{ width: 300 }} value={lng} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>纬度:</span><Input paths="lat" style={{ width: 300 }} value={lat} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>设备重启</span><span>保存</span></div>
          </div>
          <div className={styles.roadDetailRight_bom}>
            <div className={styles.topTitle}><b style={{ color: '#15AEE5', margin: '0 3px' }}>{roadName}</b>信号机基础信息</div>
            <div className={styles.items}><span>路口ID:</span><Input disabled={!btnShows} paths="interId" style={{ width: 300 }} value={interId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>路口名称:</span><Input paths="interName" style={{ width: 300 }} value={interName} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>是不是主控路口:</span>
              <Select value={interType} style={{ width: 300, margin: 0 }} onChange={this.changeNumber}>
                <Option pname="interType" value="">请选择</Option>
                <Option pname="interType" value="0">是</Option>
                <Option pname="interType" value="1">否</Option>
              </Select>
            </div>
            <div className={styles.items}><span>路口序号:</span><Input disabled={!btnShows} paths="nodeId" style={{ width: 300 }} value={nodeId} onBlur={this.changBlur} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>经度:</span><Input paths="lng" style={{ width: 300 }} value={lng} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>纬度:</span><Input paths="lat" style={{ width: 300 }} value={lat} onChange={this.changeNumber} /></div>
            <div className={styles.items}><span>设备重启</span><span>保存</span></div>
          </div>
        </div>
      </div>
    )
  }
}

export default JurManagement
