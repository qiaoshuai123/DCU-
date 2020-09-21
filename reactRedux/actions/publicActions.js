/**
 * @file actions  公用的
 */


import * as types from '../actionTypes/publicTypes'
import RestUtil from '../RestUtil'

import {
  API_UNIT_INFO_LIST, API_UNIT_TREE, API_SIGNAL_BY_INTERID, API_UPDATE_SIGNAL, API_SYSTEM_CODE_TYPE,
  API_REBOOT, API_SET_OFF_LINE, API_PROOFREAD_TIME, API_GET_DCU_STATE,
} from '../actionTypes/publicAPIs'

// 系统字典方法
export const getSystemCodeType = (dictType) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SYSTEM_CODE_TYPE}?dictType=${dictType}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_SYSTEM_CODE_TYPE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 查询全部路口 地图中所有的点
export const getMapUnitInfoList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_INFO_LIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNIT_INFO_LIST, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// DCU点位树查询
export const getUnitTree = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_TREE}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNIT_TREE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
export const checkUnitTree = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_UNIT_TREE, payload: data })
    } catch (e) {
      console.log(e)
    }
  }
}

// DCU点位弹层信息 || 基础信息配置 之 右侧信息回显
export const getUnitPop = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SIGNAL_BY_INTERID}?interId=${interId}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_SIGNAL_BY_INTERID, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// 基础信息配置 之 右侧信息保存
export const postSignalSave = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_UPDATE_SIGNAL}`, params)
      if (result.data.code === 0) {
        dispatch({ type: types.POST_UPDATE_SIGNAL, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// DCU点位弹层信息 || 设备重启
export const getReboot = (interId, rebootDeviceType) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_REBOOT}?interId=${interId}&rebootDeviceType=${rebootDeviceType}`)
      if (result.data.code === 0 || result.data.code === -1) {
        dispatch({ type: types.GET_REBOOT, payload: result.data.msg })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// DCU点位弹层信息 || 手动离线
export const getSetOffLine = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SET_OFF_LINE}?interId=${interId}`)
      if (result.data.code === 0 || result.data.code === -1) {
        dispatch({ type: types.GET_SET_OFF_LINE, payload: result.data.msg })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// DCU点位弹层信息 ||  校时
export const getProofreadTime = (interId, proofreadType) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PROOFREAD_TIME}?interId=${interId}&proofreadType=${proofreadType}`)
      if (result.data.code === 0 || result.data.code === -1) {
        dispatch({ type: types.GET_PROOFREAD_TIME, payload: result.data.msg })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// DCU状态校验
export const getDcuState = (interId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_GET_DCU_STATE}?interId=${interId}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DCU_STATE, payload: result.data.data })
      } else {
        console.error(result.data.msg)
      }
    } catch (e) {
      console.log(e)
    }
  }
}