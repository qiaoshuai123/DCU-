import * as types from '../actionTypes/actionTypes'

const signalmanagement = (state = {}, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNIT_STATUS:
      return Object.assign({}, state, { stepStatusData: payload })
    case types.GET_BG_LIST:
      return Object.assign({}, state, { basicBgLists: payload })
    case types.POST_DCU_BY_INTERID:
      return Object.assign({}, state, { basicSelSuccess: payload })
    case types.POST_UPDATE_DCU:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 车道配置
    case types.GET_LANE_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_LANE_PIC_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_LANE_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_LANE_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_LANE_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_LANE_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_LANE_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_LANE_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 灯组配置
    case types.GET_LIGHT_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_LIGHT_PIC_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_LIGHT_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_LIGHT_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_LIGHT_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_LIGHT_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_LIGHT_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_LIGHT_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 检测器配置
    case types.GET_DETECTOR_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DETECTOR_PIC_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_DETECTOR_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_DETECTOR_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_DETECTOR_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_DETECTOR_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_DETECTOR_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_DETECTOR_PIC:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 相位配置
    case types.GET_PHASE_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_PHASE_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_PHASE_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_PHASE_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 阶段配置
    case types.GET_STAGE_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_STAGE_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_STAGE_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_STAGE_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 配时方案配置
    case types.GET_PLAN_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_PLAN_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_PLAN_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_PLAN_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 日计划配置
    case types.GET_DAYPLAN_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_DAYPLAN_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_DAYPLAN_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_DAYPLAN_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 调度配置
    case types.GET_DISPATCH_INFO_LISTS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_ADD_DISPATCH_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.POST_UPDATE_DISPATCH_OTHERS:
      return Object.assign({}, state, { basicUplSuccess: payload })
    case types.GET_DEL_DISPATCH_INFO:
      return Object.assign({}, state, { basicUplSuccess: payload })
    default:
      return state
  }
}

export default signalmanagement
