import * as types from '../actionTypes/publicTypes'

const publics = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_SYSTEM_CODE_TYPE:
      return Object.assign({}, state, { codeTypeData: payload })
    case types.GET_UNIT_INFO_LIST:
      return Object.assign({}, state, { mapPointsData: payload })
    case types.GET_UNIT_TREE:
      return Object.assign({}, state, { dcuTreeData: payload })
    case types.GET_SIGNAL_BY_INTERID:
      return Object.assign({}, state, { dcuPopData: payload })
    case types.POST_UPDATE_SIGNAL:
      return Object.assign({}, state, { savePopData: payload })
    case types.GET_REBOOT:
      return Object.assign({}, state, { rebootData: payload })
    case types.GET_SET_OFF_LINE:
      return Object.assign({}, state, { offLineData: payload })
    case types.GET_PROOFREAD_TIME:
      return Object.assign({}, state, { proofreadTimeData: payload })
    default:
      return state
  }
}

export default publics
