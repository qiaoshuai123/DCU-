import * as types from '../actionTypes/actionTypes'

const signalmanagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNIT_INFO_LISTq:
      return Object.assign({}, state, { listData: payload })
    default:
      return state
  }
}

export default signalmanagement