/**
 * @file actions
 */


import * as types from '../actionTypes/publicTypes'
import RestUtil from '../RestUtil'

import {
  API_UINTINTER_INFO
} from '../actionTypes/publicAPIs'

// 首页路口列表
export const getInterList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(API_INTER_LIST)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_INTER_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const getLoadPlanTree = (id = '', keyword = '', type = 'district') => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.post(`${API_LOAD_PLANTREE}?id=${id}&searchWord=${keyword}&type=${type}`)
      if (result.data.code === 200) {
        dispatch({ type: types.GET_LOAD_PLANTREE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

