import React from 'react'
import { Icon } from 'antd'

import styles from './CustomTree.scss'

class CustomTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expendsKey: [1, 11, 2, 22, 12],
    }
    this.loopDate = [
      {
        name: '美兰区',
        id: 1,
        children: [
          {
            name: '海淀五西路',
            id: 11,
            children: [
              {
                name: '海淀五西路世纪大道',
                id: 111,
              },
              {
                name: '海淀五西路世纪大道',
                id: 1111,
              },
            ],
          },
          {
            name: '海淀五东路',
            id: 12,
            children: [
              {
                name: '海淀五东路世纪大道',
                id: 112,
              },
              {
                name: '海淀五东路世纪大道',
                id: 1112,
              },
            ],
          },
        ],
      },
      {
        name: '龙华区',
        id: 2,
        children: [
          {
            name: '龙华路',
            id: 22,
            children: [
              {
                name: '龙华路世纪大道',
                id: 222,
              },
            ],
          },
        ],
      },
    ]
  }
  componentDidMount = () => {}
  handleTreeSelect = (e) => {
    e.stopPropagation()
    const id = Number(e.currentTarget.getAttribute('id'))
    const index = this.state.expendsKey.indexOf(id)
    if (index >= 0) {
      this.state.expendsKey.splice(index, 1)
    } else {
      this.state.expendsKey.push(id)
    }
    console.log(this.state.expendsKey)
    this.setState({ expendsKey: this.state.expendsKey })
  }

  render() {
    const { expendsKey } = this.state
    const loop = data => (
      data.map((item) => {
        const isOpen = expendsKey.indexOf(item.id) >= 0
        if (item.children && item.children.length) {
          return (
            <li className={styles.childLi} key={item.id} id={item.id} onClick={this.handleTreeSelect}>
              <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
              <span className={styles.childNode}>{item.name}</span>
              {
                isOpen &&
                <ul className={styles.childTree}>
                  {loop(item.children)}
                </ul>
              }
            </li>
          )
        }
        return (
          <li className={styles.childLi} key={item.id} id={item.id} onClick={this.handleTreeSelect}>
            <span className={styles.childIcon}><Icon type={isOpen ? 'minus-circle' : 'plus-circle'} /></span>
            <span className={styles.childNode}>{item.name}</span>
          </li>
        )
      })
    )
    return (
      <div className={styles.treeWrapper}>
        <ul className={styles.treeList}>
          {
            this.loopDate.map((item) => {
              const isOpen = expendsKey.indexOf(item.id) >= 0
              return (
                <li className={styles.treeLi} key={item.id} id={item.id} onClick={this.handleTreeSelect}>
                  <span className={styles.treeIcon}>
                    <Icon type={isOpen ? 'folder-open' : 'folder'} theme="filled" />
                  </span>
                  <span className={styles.treeNode}>{item.name}</span>
                  {
                    isOpen &&
                    <ul className={styles.childTree} key={item.id}>
                      {loop(item.children)}
                    </ul>
                  }
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default CustomTree
