import React, { Component } from 'react'
import classNames from 'classnames'
import { Select } from 'antd'
import styles from './SignalManagement.scss'
const { Option } = Select;

class demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phaseValue: 'job',
      dataSourse: [
        {'name': '小明', 'age': 38, 'like': 'play', 'sex': '男', 'job': '不知道'},
        {'name': '小亮', 'age': 18, 'like': 'play', 'sex': '女', 'job': '不知道'},
        {'name': '小王', 'age': 38, 'like': 'play', 'sex': '男', 'job': '不知道'},
        {'name': '小红', 'age': 48, 'like': 'play', 'sex': '女', 'job': '不知道'}
      ],
      listTitles: ['name', 'like', 'job' ],
      listDatas: [ 'age', 'sex', 'job' ],
    }
  }
  componentDidMount = () => {
  }
  handleChange = (value) => {
    console.log(value)
    this.setState({
      phaseValue: value.key,
    }, () => {
      this.state.listTitles[2] = value.key;
    })
    const oldDatas = JSON.parse(JSON.stringify(this.state.dataSourse))
    this.setState({
      dataSourse: [],
    }, () => {
      this.setState({
        dataSourse: oldDatas,
      })
    })
  }
  render() {
    const { dataSourse, listTitles, listDatas } = this.state
    return (
      <div className={styles.SignalManagement}>
        <div className={styles.stepBoxContent}>
          <div className={styles.stepRightCon}>
            <div className={styles.conBox}>
              <div className={styles.rTit}>相位列表<em>添加</em></div>
              <div className={styles.rList} style={{ border: '1px yellow solid' }}>
                <div className={styles.listItem}>
                  <em>名字</em>
                  <em>喜欢</em>
                  <em>
                    <Select
                      labelInValue
                      defaultValue={{ key: 'job' }}
                      style={{ width: 120 }}
                      onChange={this.handleChange}>
                      <Option value={listDatas[0]}>年龄</Option>
                      <Option value={listDatas[1]}>性别</Option>
                      <Option value={listDatas[2]}>工作</Option>
                    </Select>
                  </em>
                  <em>操作</em>
                </div>
                {
                  dataSourse.map((item, i) => {
                    return <div key={'phaseList'+i} className={classNames(styles.listItem)}>
                              <span>{item[listTitles[0]]}</span>
                              <span>{item[listTitles[1]]}</span>
                              <span>{item[listTitles[2]]}</span>
                              <span>删除</span>
                          </div>
                  })
                }
                
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default demo