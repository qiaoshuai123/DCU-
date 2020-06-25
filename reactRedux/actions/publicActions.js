/**
 * @file actions  公用的
 */


import * as types from '../actionTypes/publicTypes'
import RestUtil from '../RestUtil'

import {
  API_UNIT_INFO_LIST, API_UNIT_TREE, API_SIGNAL_BY_INTERID
} from '../actionTypes/publicAPIs'

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

// DCU点位弹层信息
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
