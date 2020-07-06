/**
 * @file actions 日志管理
 */


import * as types from '../actionTypes/actionTypes'
import RestUtil from '../RestUtil'

import {
  API_SYS_LOADMANAGEMENT,
  API_SYS_LOADUSER,
  API_SYS_LOADSYSTEMOPERATIONLOGLIST,
  API_SYS_EXPORTEXCELTHING,
} from '../actionTypes/actionAPIs'

// 用户操作日志
export const getloadManageMent = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SYS_LOADMANAGEMENT}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SYS_LOADMANAGEMENT, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getloaduser = () => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SYS_LOADUSER}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SYS_LOADUSER, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getloadSystemOperationLogList = id => async (dispatch) => {
  try {
    const result = await RestUtil.post(`${API_SYS_LOADSYSTEMOPERATIONLOGLIST}?${id}`)
    if (result.data.code === 200) {
      dispatch({ type: types.GET_SYS_LOADSYSTEMOPERATIONLOGLIST, payload: result.data.data })
    } else {
      console.error(result.data.message)
    }
  } catch (e) {
    console.log(e)
  }
}
export const getexportExcelThing = id => async (dispatch) => {
  try {
    await RestUtil({
      method: 'post',
      url: `${API_SYS_EXPORTEXCELTHING}?${id}`,
      responseType: 'blob',
    }).then((results) => {
      dispatch({ type: types.GET_SYS_EXPORTEXCELTHING, payload: results.data })
    })
  } catch (e) {
    console.log(e)
  }
}
