import * as types from '../actionTypes/actionTypes'
import RestUtil from '../RestUtil'

import {
  API_DCU_ADDDCU_INFO,
  API_DEL_UPDATEDCU_INFO,
  API_DCU_INTERCHECK_INFO,
} from '../actionTypes/actionAPIs'

// 更改点位信息名称
export const getRegionNum = (obj) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.My_num, payload: obj })
    } catch (e) {
      console.log(e)
    }
  }
}
// 点位状态
export const getintercheck = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DCU_INTERCHECK_INFO}?${params}`)
    return result
  }
}
// 添加点位
export const postaddDcu = (params) => {
  return async () => {
    const result = await RestUtil.post(`${API_DCU_ADDDCU_INFO}`, params)
    return result
  }
}

// 修改点位
export const postupdateDcu = (params) => {
  return async () => {
    const result = await RestUtil.post(`${API_DEL_UPDATEDCU_INFO}`, params)
    return result
  }
}
// export const getMapUnitInfoList = () => {
//   return async (dispatch) => {
//     try {
//       const result = await RestUtil.post(`${API_DCU_ADDDCU_INFO}`)
//       if (result.data.code === 0) {
//         dispatch({ type: types.GET_UNIT_INFO_LIST, payload: result.data.data })
//       } else {
//         console.error(result.data.message)
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }
