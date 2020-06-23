import * as types from '../actionTypes/actionTypes'

const signalmanagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNIT_STATUS:
      return Object.assign({}, state, { stepStatusData: payload })
    default:
      return state
  }
}

export default signalmanagement
