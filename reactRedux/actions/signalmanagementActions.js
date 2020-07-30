/**
 * @file actions
 */


import * as types from '../actionTypes/actionTypes'
// import * as publictypes from '../actionTypes/publicTypes'
import RestUtil from '../RestUtil'

import * as APIs from '../actionTypes/actionAPIs'
// import { API_SIGNAL_BY_INTERID, API_UPDATE_SIGNAL } from '../actionTypes/publicAPIs'

// DCU信号参数据管理 step
export const getStepStatus = (interId, nodeNo) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${APIs.API_UNIT_STATUS}?interId=${interId}&nodeNo=${nodeNo}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNIT_STATUS, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 基础信息配置 之 查询全部底图
export const getBgLists = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${APIs.API_BG_LIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_BG_LIST, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 基础信息配置 之 选中底图 > 更新
export const postBgBySelect = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${APIs.API_DCU_BY_INTERID}`, params)
      if (result.data.code === 0) {
        dispatch({ type: types.POST_DCU_BY_INTERID, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 基础信息配置 之 上传底图 > 更新
export const postBgByUpload = (unitId, uploadFile) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${APIs.API_UPDATE_DCU}?unitId=${unitId}`, uploadFile)
      if (result.data.code === 0) {
        dispatch({ type: types.POST_UPDATE_DCU, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
/* {
  根据类型添删改查
  类型: type
       (车道:'LANE',灯组:'LIGHT',检测器:'DETECTOR', 相位:'PHASE', 阶段:'STAGE', 配时方案:'PLAN', 日计划:'DAYPLAN', 调度:'DISPATCH') 
} */
// 新增坐标、图片、旋转角度 以type类型为准
export const postAddPicType = (params, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_ADD_LANE_PIC
      thisTYPE = types.POST_ADD_LANE_PIC
      break;
    case "LIGHT":
      thisAPI = APIs.API_ADD_LIGHT_PIC
      thisTYPE = types.POST_ADD_LIGHT_PIC
      break;
    case "DETECTOR":
      thisAPI = APIs.API_ADD_DETECTOR_PIC
      thisTYPE = types.POST_ADD_DETECTOR_PIC
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${thisAPI}`, params)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 新增其它信息 以type类型为准
export const postAddOthersType = (params, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_ADD_LANE_OTHERS
      thisTYPE = types.POST_ADD_LANE_OTHERS
      break;
    case "LIGHT":
      thisAPI = APIs.API_ADD_LIGHT_OTHERS
      thisTYPE = types.POST_ADD_LIGHT_OTHERS
      break;
    case "DETECTOR":
      thisAPI = APIs.API_ADD_DETECTOR_OTHERS
      thisTYPE = types.POST_ADD_DETECTOR_OTHERS
      break;
    case "PHASE":
      thisAPI = APIs.API_ADD_PHASE_OTHERS
      thisTYPE = types.POST_ADD_PHASE_OTHERS
      break;
    case "STAGE":
      thisAPI = APIs.API_ADD_STAGE_OTHERS
      thisTYPE = types.POST_ADD_STAGE_OTHERS
      break;
    case "PLAN":
      thisAPI = APIs.API_ADD_PLAN_OTHERS
      thisTYPE = types.POST_ADD_PLAN_OTHERS
      break;
    case "DAYPLAN":
      thisAPI = APIs.API_ADD_DAYPLAN_OTHERS
      thisTYPE = types.POST_ADD_DAYPLAN_OTHERS
      break;
    case "DISPATCH":
      thisAPI = APIs.API_ADD_DISPATCH_OTHERS
      thisTYPE = types.POST_ADD_DISPATCH_OTHERS
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${thisAPI}`, params)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 新增图标和列表一条数据
export const postAddAllType = (params, stepType) => {
  debugger
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_ADD_LANE_INFO_AND_DETAIL
      thisTYPE = types.POST_ADD_LANE_INFO_AND_DETAIL
      break;
    case "LIGHT":
      thisAPI = APIs.API_ADD_LIGHT_INFO_AND_DETAIL
      thisTYPE = types.POST_ADD_LIGHT_INFO_AND_DETAIL
      break;
    case "DETECTOR":
      thisAPI = APIs.API_ADD_DETECTOR_INFO_AND_DETAIL
      thisTYPE = types.POST_ADD_DETECTOR_INFO_AND_DETAIL
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${thisAPI}`, params)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 删除左侧图标 以type类型为准
export const getDelPicType = (id, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_DEL_LANE_PIC
      thisTYPE = types.GET_DEL_LANE_PIC
      break;
    case "LIGHT":
      thisAPI = APIs.API_DEL_LIGHT_PIC
      thisTYPE = types.GET_DEL_LIGHT_PIC
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DEL_DETECTOR_PIC
      thisTYPE = types.GET_DEL_DETECTOR_PIC
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${thisAPI}?id=${id}`)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 删除右侧列表中一条 以type类型为准
export const getDelInfoType = (id, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_DEL_LANE_INFO
      thisTYPE = types.GET_DEL_LANE_INFO
      break;
    case "LIGHT":
      thisAPI = APIs.API_DEL_LIGHT_INFO
      thisTYPE = types.GET_DEL_LIGHT_INFO
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DEL_DETECTOR_INFO
      thisTYPE = types.GET_DEL_DETECTOR_INFO
      break;
    case "PHASE":
      thisAPI = APIs.API_DEL_PHASE_INFO
      thisTYPE = types.GET_DEL_PHASE_INFO
      break;
    case "STAGE":
      thisAPI = APIs.API_DEL_STAGE_INFO
      thisTYPE = types.GET_DEL_STAGE_INFO
      break;
    case "PLAN":
      thisAPI = APIs.API_DEL_PLAN_INFO
      thisTYPE = types.GET_DEL_PLAN_INFO
      break;
    case "DAYPLAN":
      thisAPI = APIs.API_DEL_DAYPLAN_INFO
      thisTYPE = types.GET_DEL_DAYPLAN_INFO
      break;
    case "DISPATCH":
      thisAPI = APIs.API_DEL_DISPATCH_INFO
      thisTYPE = types.GET_DEL_DISPATCH_INFO
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${thisAPI}?id=${id}`)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 左侧图标 以type类型为准
export const getPicListsType = (interId, nodeNo, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_LANE_PIC_LISTS
      thisTYPE = types.GET_LANE_PIC_LISTS
      break;
    case "LIGHT":
      thisAPI = APIs.API_LIGHT_PIC_LISTS
      thisTYPE = types.GET_LIGHT_PIC_LISTS
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DETECTOR_PIC_LISTS
      thisTYPE = types.GET_DETECTOR_PIC_LISTS
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${thisAPI}?interId=${interId}&nodeNo=${nodeNo}`)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 右侧列表 以type类型为准
export const getInfoListsType = (interId, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_LANE_INFO_LISTS
      thisTYPE = types.GET_LANE_INFO_LISTS
      break;
    case "LIGHT":
      thisAPI = APIs.API_LIGHT_INFO_LISTS
      thisTYPE = types.GET_LIGHT_INFO_LISTS
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DETECTOR_INFO_LISTS
      thisTYPE = types.GET_DETECTOR_INFO_LISTS
      break;
    case "PHASE":
      thisAPI = APIs.API_PHASE_INFO_LISTS
      thisTYPE = types.GET_PHASE_INFO_LISTS
      break;
    case "STAGE":
      thisAPI = APIs.API_STAGE_INFO_LISTS
      thisTYPE = types.GET_STAGE_INFO_LISTS
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${thisAPI}?interId=${interId}`)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 右侧列表 配时方案、日计划、调度的列表以此为准
export const getInfoListsTypeMore = (interId, nodeNo, stepType, schemeNo) => {
  let thisAPI, thisTYPE, resUrl;
  switch(stepType){
    case "PLAN":
      debugger
      if (!schemeNo){
        thisAPI = APIs.API_PLAN_INFO_LISTS
        thisTYPE = types.GET_PLAN_INFO_LISTS
        resUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}`
      } else {
        thisAPI = APIs.API_S_PHASE_STAGE_CHAINS
        thisTYPE = types.GET_S_PHASE_STAGE_CHAINS
        resUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}&schemeNo=${schemeNo}`
      }
      break;
    case "DAYPLAN":
      debugger
      if (!schemeNo){
        thisAPI = APIs.API_DAYPLAN_INFO_LISTS
        thisTYPE = types.GET_DAYPLAN_INFO_LISTS
        resUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}`
      } else {
        thisAPI = APIs.API_LINE_DAYPLAN_CLICK
        thisTYPE = types.GET_LINE_DAYPLAN_CLICK
        resUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}&schemeNo=${schemeNo}`
      }
      break;
    case "DISPATCH":
      if (!schemeNo){
        thisAPI = APIs.API_DISPATCH_INFO_LISTS
        thisTYPE = types.GET_DISPATCH_INFO_LISTS
        resUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}`
      } else {
        thisAPI = APIs.API_LINE_DISPATCH_CLICK
        thisTYPE = types.GET_LINE_DISPATCH_CLICK
        resUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}&dailyplanNo=${schemeNo}`
      }
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(resUrl)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 修改坐标、图片、旋转角度 以type类型为准
export const postUpdatePicType = (params, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_UPDATE_LANE_PIC
      thisTYPE = types.POST_UPDATE_LANE_PIC
      break;
    case "LIGHT":
      thisAPI = APIs.API_UPDATE_LIGHT_PIC
      thisTYPE = types.POST_UPDATE_LIGHT_PIC
      break;
    case "DETECTOR":
      thisAPI = APIs.API_UPDATE_DETECTOR_PIC
      thisTYPE = types.POST_UPDATE_DETECTOR_PIC
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${thisAPI}`, params)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 修改其它信息 以type类型为准
export const postUpdateOthersType = (params, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_UPDATE_LANE_OTHERS
      thisTYPE = types.POST_UPDATE_LANE_OTHERS
      break;
    case "LIGHT":
      thisAPI = APIs.API_UPDATE_LIGHT_OTHERS
      thisTYPE = types.POST_UPDATE_LIGHT_OTHERS
      break;
    case "DETECTOR":
      thisAPI = APIs.API_UPDATE_DETECTOR_OTHERS
      thisTYPE = types.POST_UPDATE_DETECTOR_OTHERS
      break;
    case "PHASE":
      thisAPI = APIs.API_UPDATE_PHASE_OTHERS
      thisTYPE = types.POST_UPDATE_PHASE_OTHERS
      break;
    case "STAGE":
      thisAPI = APIs.API_UPDATE_STAGE_OTHERS
      thisTYPE = types.POST_UPDATE_STAGE_OTHERS
      break;
    case "PLAN":
      thisAPI = APIs.API_UPDATE_PLAN_OTHERS
      thisTYPE = types.POST_UPDATE_PLAN_OTHERS
      break;
    case "DAYPLAN":
      thisAPI = APIs.API_UPDATE_DAYPLAN_OTHERS
      thisTYPE = types.POST_UPDATE_DAYPLAN_OTHERS
      break;
    case "DISPATCH":
      thisAPI = APIs.API_UPDATE_DISPATCH_OTHERS
      thisTYPE = types.POST_UPDATE_DISPATCH_OTHERS
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${thisAPI}`, params)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 修改图标和列表一条数据
export const postUpdateAllType = (params, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_UPDATE_LANE_INFO_AND_DETAIL
      thisTYPE = types.POST_UPDATE_LANE_INFO_AND_DETAIL
      break;
    case "LIGHT":
      thisAPI = APIs.API_UPDATE_LIGHT_INFO_AND_DETAIL
      thisTYPE = types.POST_UPDATE_LIGHT_INFO_AND_DETAIL
      break;
    case "DETECTOR":
      thisAPI = APIs.API_UPDATE_DETECTOR_INFO_AND_DETAIL
      thisTYPE = types.POST_UPDATE_DETECTOR_INFO_AND_DETAIL
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${thisAPI}`, params)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 回显图标所有内容
export const getUpdateAllType = (interId, nodeNo, Id, stepType) => {
  debugger
  let thisAPI, thisTYPE, getUrl;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_LANE_INFO_AND_DETAIL
      thisTYPE = types.GET_LANE_INFO_AND_DETAIL
      getUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}&laneId=${Id}`
      break;
    case "LIGHT":
      thisAPI = APIs.API_LIGHT_INFO_AND_DETAIL
      thisTYPE = types.GET_LIGHT_INFO_AND_DETAIL
      getUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}&lampgroupNo=${Id}`
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DETECTOR_INFO_AND_DETAIL
      thisTYPE = types.GET_DETECTOR_INFO_AND_DETAIL
      getUrl = `${thisAPI}?interId=${interId}&nodeNo=${nodeNo}&detectorId=${Id}`
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(getUrl)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 回显全部图标
export const getIconImageList = (stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_LANE_IMAGE_LIST
      thisTYPE = types.GET_LANE_IMAGE_LIST
      break;
    case "LIGHT":
      thisAPI = APIs.API_LIGHT_IMAGE_LIST
      thisTYPE = types.GET_LIGHT_IMAGE_LIST
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DETECTOR_IMAGE_LIST
      thisTYPE = types.GET_DETECTOR_IMAGE_LIST
      break;
    case "PHASE":
      thisAPI = APIs.API_PHASE_IMAGE_LIST
      thisTYPE = types.GET_PHASE_IMAGE_LIST
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${thisAPI}`)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 选择列表，提供添加、修改之用
export const getSelectLists = (interId, nodeNo, stepType) => {
  let thisAPI, thisTYPE;
  switch(stepType){
    case "LANE":
      thisAPI = APIs.API_LANE_SELECT_LIST
      thisTYPE = types.GET_LANE_SELECT_LIST
      break;
    case "LIGHT":
      thisAPI = APIs.API_LIGHT_SELECT_LIST
      thisTYPE = types.GET_LIGHT_SELECT_LIST
      break;
    case "DETECTOR":
      thisAPI = APIs.API_DETECTOR_SELECT_LIST
      thisTYPE = types.GET_DETECTOR_SELECT_LIST
      break;
  }
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${thisAPI}?interId=${interId}&nodeNo=${nodeNo}`)
      if (result.data.code === 0) {
        dispatch({ type: thisTYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 方案相位阶段链时间的合法不
export const getCheckPhaseTime = (interId, phaseStageNo, time ) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${APIs.API_CHECK_PHASE_STAGE_TIME}?interId=${interId}&phaseStageNo=${phaseStageNo}&time=${time}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_CHECK_PHASE_STAGE_TIME, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 下发配置验证
export const getEditCheckData = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${APIs.API_EDIT_DATA_CHECK}?interId=${interId}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_EDIT_DATA_CHECK, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}