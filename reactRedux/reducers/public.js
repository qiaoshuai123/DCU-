import * as types from '../actionTypes/publicTypes'

const publics = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNIT_INFO_LIST:
      return Object.assign({}, state, { mapPointsData: payload })
    case types.GET_UNIT_TREE:
      return Object.assign({}, state, { dcuTreeData: payload })
    default:
      return state
  }
}

export default publics
