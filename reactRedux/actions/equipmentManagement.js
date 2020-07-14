import * as types from '../actionTypes/actionTypes'
import RestUtil from '../RestUtil'

import {
  API_DCU_ADDDCU_INFO,
  API_DEL_UPDATEDCU_INFO,
  API_DCU_INTERCHECK_INFO,
  API_DEL_UNITINFO_INFO,
  API_DEL_DCUBYINTERID,
  API_DEL_UPDATEDCU,
  API_DEL_SIGNALBYINTERID,
  API_DEL_UPDATESIGNAL,
  API_LAN_LANEINFOANDDETAIL,
  API_LAM_LAMPGROUPDETAILLIST,
  API_DET_DETECTORDETAILLIST,
  API_PHA_NOWPHASESTAGEINGO,
  API_UNI_LOCKSTATELIST,
  API_SCH_SCHMEINFOLIST,
  API_DCU_PROOFREADTIME,
  API_DCU_CENTERCONTROL,
  API_DCU_DCULIST,
  API_DCU_DCULISTBYPAGE,
  API_SYS_SYSTEMCODELISTBYCODETYPE,
  API_UNI_UNITINFOLIST,
  API_SIG_SIGNALLIST,
  API_SIG_SIGNALLISTBYPAGE,
  API_SIG_LOADDATA,
  API_SIG_EDITDATA,
  API_DCU_LOADDATA,
  API_DCU_EDITDATA,
  API_UNI_REBOOT,
  API_DCU_DETECTORREALTIMELISTBYPAGE,
  API_DET_DETECTORDATALISTBYPAGE,
  API_DET_EXPORTDETECTORDATALIST,
} from '../actionTypes/actionAPIs'

// 更改点位信息名称
export const getRegionNum = (obj) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.GET_DELNUM, payload: obj })
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
// 删除点位
export const postdeleteUnit = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DEL_UNITINFO_INFO}?unitId=${params}`)
    return result
  }
}
// DCU基础信息查询（根据interId查询
export const getdcuByInterId = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DEL_DCUBYINTERID}?interId=${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DEL_DCUBYINTERID, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// DCU更改
export const postupdateDcuinfo = (params) => {
  return async () => {
    const result = await RestUtil.post(`${API_DEL_UPDATEDCU}`, params)
    return result
  }
}
// 信号机上传配置
export const loadData = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_SIG_LOADDATA}?${params}`)
    return result
  }
}
// 信号机下发配置
export const editData = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_SIG_EDITDATA}?${params}`)
    return result
  }
}
// DCU上传配置
export const dculoadData = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DCU_LOADDATA}?${params}`)
    return result
  }
}
// DCU下发配置
export const dcueditData = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DCU_EDITDATA}?${params}`)
    return result
  }
}
// 信号机DCU重启
export const reboot = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_UNI_REBOOT}?${params}`)
    return result
  }
}
// 信号机基础信息查询（根据interId查询信号机）
export const getsignalByInterId = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DEL_SIGNALBYINTERID}?interId=${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DEL_SIGNALBYINTERID, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 修改信号机
export const postupdateSignal = (params) => {
  return async () => {
    const result = await RestUtil.post(`${API_DEL_UPDATESIGNAL}`, params)
    return result
  }
}

/** *********** 实时监控模块 ************* */

// DCU状态

// 车道图片接口
export const laneInfoAndDetail = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_LAN_LANEINFOANDDETAIL}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_LAN_LANEINFOANDDETAIL, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 灯组图片接口
export const lampgroupDetailList = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_LAM_LAMPGROUPDETAILLIST}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_LAM_LAMPGROUPDETAILLIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 检测器接口
export const detectorDetailList = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DET_DETECTORDETAILLIST}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DET_DETECTORDETAILLIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 查询路口当前方案的全部阶段
export const nowPhasestageInfo = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_PHA_NOWPHASESTAGEINGO}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_PHA_NOWPHASESTAGEINGO, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 锁定状态
export const lockStateList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNI_LOCKSTATELIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNI_LOCKSTATELIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 当前路口全部方案
export const schemeInfoList = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SCH_SCHMEINFOLIST}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_SCH_SCHMEINFOLIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// DCU校时信号机校时两个参数 interId   proofreadType
export const proofreadTime = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DCU_PROOFREADTIME}?${params}`)
    return result
  }
}
// DCU校时信号机校时两个参数 interId   proofreadType
export const centerControl = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DCU_CENTERCONTROL}?${params}`)
    return result
  }
}
// 查询全部DCU
export const dcuLists = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DCU_DCULIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DCU_DCULIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 分页查询DCU
export const dcuListByPages = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DCU_DCULISTBYPAGE}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DCU_DCULISTBYPAGE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 获取所有区号
export const systemCodeListByCodeType = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SYS_SYSTEMCODELISTBYCODETYPE}?dictType=${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_SYS_SYSTEMCODELISTBYCODETYPE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 获取所有点位
export const unitInfoList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_UNI_UNITINFOLIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_UNI_UNITINFOLIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 查询全部信号机数据
export const signalList = () => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SIG_SIGNALLIST}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_SIG_SIGNALLIST, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 分页查询信号机数据
export const signalListByPage = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_SIG_SIGNALLISTBYPAGE}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_SIG_SIGNALLISTBYPAGE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 获取所有点位
export const detectorRealTimeListByPage = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DCU_DETECTORREALTIMELISTBYPAGE}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DCU_DETECTORREALTIMELISTBYPAGE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 分页查询检测器数据
export const detectorDataListByPage = (params) => {
  return async (dispatch) => {
    try {
      const result = await RestUtil.get(`${API_DET_DETECTORDATALISTBYPAGE}?${params}`)
      if (result.data.code === 0) {
        dispatch({ type: types.GET_DET_DETECTORDATALISTBYPAGE, payload: result.data.data })
      } else {
        console.error(result.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
// 导出检测器数据
export const exportDetectorDataList = (params) => {
  return async () => {
    const result = await RestUtil.get(`${API_DET_EXPORTDETECTORDATALIST}?${params}`)
    return result
  }
}