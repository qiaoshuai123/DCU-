import * as types from '../actionTypes/actionTypes'

const equipmentManagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.My_num:
      console.log(payload,'121')
      return Object.assign({}, state, { getObjNum: payload })
    // case types.GET_UNIT_INFO_LIST:
    //   return Object.assign({}, state, { mapPointsData: payload })
    // case types.GET_UNIT_INFO_LIST:
    //   return Object.assign({}, state, { mapPointsData: payload })
    default:
      return state
  }
}

export default equipmentManagement
