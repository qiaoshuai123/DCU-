import * as types from '../actionTypes/actionTypes'

const objs = {
  // devSockets: 'ws://53.101.255.23:20203', // 本地地址
  // devImage: 'http://53.101.255.23:20203', // 本地地址
  // devSockets: 'ws://192.168.1.213:20203', // 本地地址
  // devImage: 'http://192.168.1.213:20203', // 本地地址

  devSockets: 'ws://53.101.224.151:20203', // 昆明本地地址
  devImage: 'http://53.101.224.151:20203', // 昆明本地地址
  // devSockets: 'ws://39.100.128.220:20203', // 线上地址
  // devImage: 'http://39.100.128.220:20203', // 线上地址
}
const signalmanagement = (state = objs, action) => {
  const { type, payload } = action
  switch (type) {
    case types.GET_UNIT_STATUS:
      return Object.assign({}, state, { stepStatusData: payload })
    case types.GET_EDIT_DATA_CHECK:
      return Object.assign({}, state, { editCheckData: payload })
    case types.GET_BG_LIST:
      return Object.assign({}, state, { basicBgLists: payload })
    case types.POST_DCU_BY_INTERID:
      return Object.assign({}, state, { basicSelSuccess: payload })
    case types.POST_UPDATE_DCU:
      return Object.assign({}, state, { basicUplSuccess: payload })
    // 切换视图
    case types.GET_SIGNAL_lIST_BY_PAGE:
      return Object.assign({}, state, { signalDataList: payload })
    // 车道配置
    case types.GET_LANE_INFO_LISTS:
      return Object.assign({}, state, { laneLists: payload })
    case types.GET_LANE_PIC_LISTS:
      return Object.assign({}, state, { lanePicLists: payload })
    case types.POST_ADD_LANE_OTHERS:
      return Object.assign({}, state, { laneOtherData: payload })
    case types.POST_ADD_LANE_PIC:
      return Object.assign({}, state, { laneAddData: payload })
    case types.POST_UPDATE_LANE_OTHERS:
      return Object.assign({}, state, { laneUpdateOthers: payload })
    case types.POST_UPDATE_LANE_PIC:
      return Object.assign({}, state, { laneUpdatePic: payload })
    case types.GET_DEL_LANE_INFO:
      return Object.assign({}, state, { laneDelInfo: payload })
    case types.GET_DEL_LANE_PIC:
      return Object.assign({}, state, { laneDelPic: payload })
    case types.GET_LANE_INFO_AND_DETAIL:
      return Object.assign({}, state, { laneShowDetail: payload })
    case types.POST_ADD_LANE_INFO_AND_DETAIL:
      return Object.assign({}, state, { laneAddMore: payload })
    case types.POST_UPDATE_LANE_INFO_AND_DETAIL:
      return Object.assign({}, state, { laneUpdateMore: payload })
    case types.GET_LANE_IMAGE_LIST:
      return Object.assign({}, state, { laneIconLists: payload })
    case types.GET_LANE_SELECT_LIST:
      return Object.assign({}, state, { laneSelectLists: payload })
    // 灯组配置
    case types.GET_LIGHT_INFO_LISTS:
      return Object.assign({}, state, { lightLists: payload })
    case types.GET_LIGHT_PIC_LISTS:
      return Object.assign({}, state, { lightPicLists: payload })
    case types.POST_ADD_LIGHT_OTHERS:
      return Object.assign({}, state, { lightOtherData: payload })
    case types.POST_ADD_LIGHT_PIC:
      return Object.assign({}, state, { lightAddData: payload })
    case types.POST_UPDATE_LIGHT_OTHERS:
      return Object.assign({}, state, { lightUpdateOthers: payload })
    case types.POST_UPDATE_LIGHT_PIC:
      return Object.assign({}, state, { lightUpdatePic: payload })
    case types.GET_DEL_LIGHT_INFO:
      return Object.assign({}, state, { lightDelInfo: payload })
    case types.GET_DEL_LIGHT_PIC:
      return Object.assign({}, state, { lightDelPic: payload })
    case types.GET_LIGHT_INFO_AND_DETAIL:
      return Object.assign({}, state, { lightShowDetail: payload })
    case types.POST_ADD_LIGHT_INFO_AND_DETAIL:
      return Object.assign({}, state, { lightAddMore: payload })
    case types.POST_UPDATE_LIGHT_INFO_AND_DETAIL:
      return Object.assign({}, state, { lightUpdateMore: payload })
    case types.GET_LIGHT_IMAGE_LIST:
      return Object.assign({}, state, { lightIconLists: payload })
    case types.GET_LIGHT_SELECT_LIST:
      return Object.assign({}, state, { lightSelectLists: payload })
    // 检测器配置
    case types.GET_DETECTOR_INFO_LISTS:
      return Object.assign({}, state, { detectorLists: payload })
    case types.GET_DETECTOR_PIC_LISTS:
      return Object.assign({}, state, { detectorPicLists: payload })
    case types.POST_ADD_DETECTOR_OTHERS:
      return Object.assign({}, state, { detectorOtherData: payload })
    case types.POST_ADD_DETECTOR_PIC:
      return Object.assign({}, state, { detectorAddData: payload })
    case types.POST_UPDATE_DETECTOR_OTHERS:
      return Object.assign({}, state, { detectorUpdateOthers: payload })
    case types.POST_UPDATE_DETECTOR_PIC:
      return Object.assign({}, state, { detectorUpdatePic: payload })
    case types.GET_DEL_DETECTOR_INFO:
      return Object.assign({}, state, { detectorDelInfo: payload })
    case types.GET_DEL_DETECTOR_PIC:
      return Object.assign({}, state, { detectorDelPic: payload })
    case types.GET_DETECTOR_INFO_AND_DETAIL:
      return Object.assign({}, state, { detectorShowDetail: payload })
    case types.POST_ADD_DETECTOR_INFO_AND_DETAIL:
      return Object.assign({}, state, { detectorAddMore: payload })
    case types.POST_UPDATE_DETECTOR_INFO_AND_DETAIL:
      return Object.assign({}, state, { detectorUpdateMore: payload })
    case types.GET_DETECTOR_IMAGE_LIST:
      return Object.assign({}, state, { detectorIconLists: payload })
    case types.GET_DETECTOR_SELECT_LIST:
      return Object.assign({}, state, { detectorSelectLists: payload })
    // 相位配置
    case types.GET_PHASE_INFO_LISTS:
      return Object.assign({}, state, { phaseLists: payload })
    case types.POST_ADD_PHASE_OTHERS:
      return Object.assign({}, state, { phaseOtherData: payload })
    case types.POST_UPDATE_PHASE_OTHERS:
      return Object.assign({}, state, { phaseUpdateOthers: payload })
    case types.GET_DEL_PHASE_INFO:
      return Object.assign({}, state, { phaseDelInfo: payload })
    case types.GET_PHASE_IMAGE_LIST:
      return Object.assign({}, state, { phaseIconLists: payload })
    // 阶段配置
    case types.GET_STAGE_INFO_LISTS:
      return Object.assign({}, state, { stageLists: payload })
    case types.POST_ADD_STAGE_OTHERS:
      return Object.assign({}, state, { stageOtherData: payload })
    case types.POST_UPDATE_STAGE_OTHERS:
      return Object.assign({}, state, { stageUpdateOthers: payload })
    case types.GET_DEL_STAGE_INFO:
      return Object.assign({}, state, { stageDelInfo: payload })
    // 配时方案配置
    case types.GET_PLAN_INFO_LISTS:
      return Object.assign({}, state, { planLists: payload })
    case types.POST_ADD_PLAN_OTHERS:
      return Object.assign({}, state, { planOtherData: payload })
    case types.POST_UPDATE_PLAN_OTHERS:
      return Object.assign({}, state, { planUpdateOthers: payload })
    case types.GET_DEL_PLAN_INFO:
      return Object.assign({}, state, { planDelInfo: payload })
    case types.GET_S_PHASE_STAGE_CHAINS:
      return Object.assign({}, state, { planChainsLists: payload })
    case types.GET_CHECK_PHASE_STAGE_TIME:
      return Object.assign({}, state, { planCheckTimeRes: payload })
    // 日计划配置
    case types.GET_DAYPLAN_INFO_LISTS:
      return Object.assign({}, state, { dayPlanLists: payload })
    case types.POST_ADD_DAYPLAN_OTHERS:
      return Object.assign({}, state, { dayPlanOtherData: payload })
    case types.POST_UPDATE_DAYPLAN_OTHERS:
      return Object.assign({}, state, { dayPlanUpdateOthers: payload })
    case types.GET_DEL_DAYPLAN_INFO:
      return Object.assign({}, state, { dayPlanDelInfo: payload })
    case types.GET_LINE_DAYPLAN_CLICK:
      return Object.assign({}, state, { dayPlanClickInfo: payload })
    // 调度配置
    case types.GET_DISPATCH_INFO_LISTS:
      return Object.assign({}, state, { dispatchLists: payload })
    case types.POST_ADD_DISPATCH_OTHERS:
      return Object.assign({}, state, { dispatchOtherData: payload })
    case types.POST_UPDATE_DISPATCH_OTHERS:
      return Object.assign({}, state, { dispatchUpdateOthers: payload })
    case types.GET_DEL_DISPATCH_INFO:
      return Object.assign({}, state, { dispatchDelInfo: payload })
    case types.GET_LINE_DISPATCH_CLICK:
      return Object.assign({}, state, { dispatchClickInfo: payload })
    default:
      return state
  }
}

export default signalmanagement
