/**
 * @file 公用的 API 接口地址
 */
// 例
export const API_UNIT_INFO_LIST = '/DCU/unitInfo/unitInfoList'   // 查询全部路口 地图中所有的点
export const API_UNIT_TREE = '/DCU/unitInfo/unitTree'  // DCU点位树查询
export const API_DCU_BY_INTERID = '/DCU/dcuInfo/dcuByInterId'  // DCU点位弹层信息

// 信号机相关API
export const API_SIGNAL_BY_INTERID = '/DCU/signalInfo/signalByInterId' //信号机基础信息查询（根据interId查询信号机）
export const API_UPDATE_SIGNAL = '/DCU/signalInfo/updateSignal' //信号机基础信息修改（根据interId查询信号机）