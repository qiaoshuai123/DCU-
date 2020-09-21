/**
 * @file 公用的 type name
 */
// 例
export const GET_UNIT_INFO_LIST = 'GET_UNIT_INFO_LIST'  // 查询全部路口 地图中所有的点
export const GET_UNIT_TREE = 'GET_UNIT_TREE'  //  DCU点位树查询
export const GET_SIGNAL_BY_UNIT_ID = 'GET_SIGNAL_UNIT_BY_ID'  //  DCU点位弹层信息

export const GET_SIGNAL_BY_INTERID = 'GET_SIGNAL_BY_INTERID'  //  //信号机基础信息查询（根据interId查询信号机）
export const POST_UPDATE_SIGNAL = 'POST_UPDATE_SIGNAL'  //  //信号机基础信息修改（根据interId查询信号机）

// 系统字典
export const GET_SYSTEM_CODE_TYPE = 'GET_SYSTEM_CODE_TYPE'

export const GET_REBOOT = 'GET_REBOOT' // 设备重启
export const GET_SET_OFF_LINE = 'GET_SET_OFF_LINE' // 手动离线
export const GET_PROOFREAD_TIME = 'GET_PROOFREAD_TIME' //校时

// 设备状态验证
export const GET_DCU_STATE = 'GET_DCU_STATE' //状态校验