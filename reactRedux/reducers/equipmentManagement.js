import * as types from '../actionTypes/actionTypes'

const equipmentManagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_DELNUM:
      return Object.assign({}, state, { getObjNum: payload })
    case types.GET_DEL_DCUBYINTERID:
      return Object.assign({}, state, { getInterId: payload })
    case types.GET_DEL_SIGNALBYINTERID:
      return Object.assign({}, state, { signalByInterId: payload })
    default:
      return state
  }
}

export default equipmentManagement
