/**
 * @file actions
 */


import * as types from '../actionTypes/actionTypes'
import RestUtil from '../RestUtil'

// import {
//   API_UINTINTER_INFO
// } from '../actionTypes/actionAPIs'

// export const getInterInfoList = () => {
//   return async (dispatch) => {
//     try {
//       const result = await RestUtil.get(`${API_UNIT_INFO_LIST}/${interId}`)
//       if (result.data.code === 200) {
//         dispatch({ type: types.GET_UNIT_INFO_LIST, payload: result.data.data })
//       } else {
//         console.error(result.data.message)
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }

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