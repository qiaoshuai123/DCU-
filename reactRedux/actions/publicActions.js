/**
 * @file actions  公用的
 */


import * as types from '../actionTypes/publicTypes'
import RestUtil from '../RestUtil'

import {
  API_UNIT_INFO_LIST
} from '../actionTypes/publicAPIs'

export const getInterInfoList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_INFO_LIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNIT_INFO_LIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

