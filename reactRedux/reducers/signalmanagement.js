import * as types from '../actionTypes/actionTypes'

const signalmanagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_VIP_ADD_UNITSIFRAM:
      return Object.assign({}, state, { vip_addSucess: payload })
    default:
      return state
  }
}

export default signalmanagement