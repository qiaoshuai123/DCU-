/**
 * @file actions
 */


import * as types from '../actionTypes/actionTypes'
import RestUtil from '../RestUtil'

import {
  API_UNIT_STATUS
} from '../actionTypes/actionAPIs'

// DCU信号参数据管理 step
export const getStepStatus = (unitId) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNIT_STATUS}?unitId=${unitId}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNIT_STATUS, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}

// export const getList = (id = '', keyword = '', type = 'district') => {
//   return async (dispatch) => {
//     try {
//       const result = await RestUtil.post(`${API_LOAD_PLANTREE}?id=${id}&searchWord=${keyword}&type=${type}`)
//       if (result.data.code === 200) {
//         dispatch({ type: types.GET_LOAD_PLANTREE, payload: result.data.data })
//       } else {
//         console.error(result.data.message)
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }