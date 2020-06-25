import * as types from '../actionTypes/publicTypes'

const publics = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNIT_INFO_LIST:
      return Object.assign({}, state, { mapPointsData: payload })
    case types.GET_UNIT_TREE:
      return Object.assign({}, state, { dcuTreeData: payload })
    case types.GET_SIGNAL_BY_INTERID:
      return Object.assign({}, state, { dcuPopData: payload })
    default:
      return state
  }
}

export default publics
