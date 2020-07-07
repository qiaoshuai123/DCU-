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
    case types.GET_LAN_LANEINFOANDDETAIL:
      return Object.assign({}, state, { laneInfoAndDetailinfo: payload })
    case types.GET_LAM_LAMPGROUPDETAILLIST:
      return Object.assign({}, state, { lampgroupDetailListinfo: payload })
    case types.GET_DET_DETECTORDETAILLIST:
      return Object.assign({}, state, { detectorDetailListinfo: payload })
    case types.GET_PHA_NOWPHASESTAGEINGO:
      return Object.assign({}, state, { nowPhasestageInfos: payload })
    case types.GET_UNI_LOCKSTATELIST:
      return Object.assign({}, state, { lockStateListinfo: payload })
    case types.GET_SCH_SCHMEINFOLIST:
      return Object.assign({}, state, { schemeInfoListinfo: payload })
    case types.GET_DCU_DCULIST:
      return Object.assign({}, state, { dcuList: payload })
    case types.GET_DCU_DCULISTBYPAGE:
      return Object.assign({}, state, { dcuListByPage: payload })
    default:
      return state
  }
}

export default equipmentManagement
