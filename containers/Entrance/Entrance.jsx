import React from 'react'

import styles from './Entrance.scss'

class Entrance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clickCount: 0,
    }
    this.F = { top: '350px', left: '430px', transform: 'scale(1.4)' }
    this.L = { top: '100px', left: '-60px', transform: 'scale(1)' }
    this.B = { top: '-70px', left: '430px', transform: 'scale(1)' }
    this.R = { top: '100px', left: '905px', transform: 'scale(1)' }
  }
  componentDidMount = () => { }
  handleMoveLeft = () => {
    const clickCount = this.state.clickCount === 4 ? 1 : this.state.clickCount += 1
    this.setState({ clickCount })
  }
  handleMoveRight = () => {
    const clickCount = this.state.clickCount === 0 ? 3 : this.state.clickCount -= 1
    this.setState({ clickCount })
  }
  handleGoSystem = (e) => {
    const path = e.currentTarget.getAttribute('sysname')
    this.props.history.push(path)
  }
  render() {
    const { clickCount } = this.state
    return (
      <div className={styles.entranceWrapper}>
        <div className={styles.boolLight}>
          <div
            className={styles.F}
            style={clickCount === 1 ? this.L : clickCount === 2 ? this.B : clickCount === 3 ? this.R : this.F}
          />
          <div
            className={styles.L}
            style={clickCount === 1 ? this.B : clickCount === 2 ? this.R : clickCount === 3 ? this.F : this.L}
            sysname="/inter"
            onClick={this.handleGoSystem}
          />
          <div
            className={styles.B}
            style={clickCount === 1 ? this.R : clickCount === 2 ? this.F : clickCount === 3 ? this.L : this.B}
            sysname="/signalhome"
            onClick={this.handleGoSystem}
          />
          <div
            className={styles.R}
            style={clickCount === 1 ? this.F : clickCount === 2 ? this.L : clickCount === 3 ? this.B : this.R}
          />
          <span className={styles.moveLeft} onClick={this.handleMoveLeft} />
          <span className={styles.moveRight} onClick={this.handleMoveRight} />
        </div>
      </div>
    )
  }
}

export default Entrance
