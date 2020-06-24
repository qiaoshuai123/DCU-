/**
 * @file 模块化 API 接口地址
 */

export const API_UNIT_STATUS = '/DCU/unitInfo/unitStatus'  // 信号参数据管理 step

/************* 信号参数管理模块 **************/
// 基础信息配置
export const API_BG_LIST = '/DCU/unitInfo/backgroundList' // 查询全部底图
export const API_DCU_BY_INTERID = '/DCU/unitInfo/updateUnit' //选中底图 > 更新底图
export const API_UPDATE_DCU = '/DCU/unitInfo/fileUpload' // 上传底图 > 更新底图
// 车道配置
export const API_LANEINFO_LISTS = '/DCU/laneInfo/laneInfoList' //根据interId查询路口下所有车道列表
export const API_LANEPIC_LISTS = '/DCU/laneInfo/laneDetailList' //根据interId 路口序号查询图上的车道
export const API_ADD_LANE_OTHERS = '/DCU/laneInfo/addLaneInfo' //新增车道其它信息
export const API_ADD_LANEPIC = '/DCU/laneInfo/addLaneDetail' //新增车道坐标、图片、旋转角度
export const API_UPDATE_LANE_OTHERS = '/DCU/laneInfo/updateLaneInfo' //修改车道其它信息
export const API_UPDATE_LANEPIC = '/DCU/laneInfo/updateLaneDetail' //修改车道坐标、图片、旋转角度
export const API_DEL_LANEINFO = '/DCU/laneInfo/deleteLaneInfo' //删除车道当前一条
export const API_DEL_LANEPIC = '/DCU/laneInfo/deleteLaneDetail' //删除车道详细
// 灯组配置
export const API_LIGHTINFO_LISTS = '/DCU/lampgroupInfo/lampgroupInfoList' //根据interId查询路口下所有灯组列表
export const API_LIGHTPIC_LISTS = '/DCU/lampgroupInfo/lampgroupDetailList' //根据interId 路口序号查询图上的灯
export const API_ADD_LIGHT_OTHERS = '/DCU/lampgroupInfo/addLampgroupInfo' // 新增灯组其它信息
export const API_ADD_LIGHTPIC = '/DCU/lampgroupInfo/addLampgroupDetail' // 新增灯组坐标、图片、旋转角度
export const API_UPDATE_LIGHT_OTHERS = '/DCU/lampgroupInfo/updateLampgroupInfo' // 修改灯组其它信息
export const API_UPDATE_LIGHTPIC = '/DCU/lampgroupInfo/updateLampgroupDetail' //修改灯组坐标、图片、旋转角度
export const API_DEL_LIGHTINFO = '/DCU/lampgroupInfo/deleteLampgroupInfo' //右侧删除灯组当前一条
export const API_DEL_LIGHTPIC = '/DCU/lampgroupInfo/deleteLampgroupDetail' //删除灯组图片
// 检测器配置
export const API_DETECTOR_INFO_LISTS = '/DCU/detectorInfo/detectorInfoList' //根据interId查询路口下所有检测器列表
export const API_DETECTOR_PIC_LISTS = '/DCU/detectorInfo/detectorDetailList' //根据interId 路口序号查询图上的检测器
export const API_ADD_DETECTOR_OTHERS = '/DCU/detectorInfo/addDetectorInfo' //新增检测器其它信息
export const API_ADD_DETECTOR_PIC = '/DCU/detectorInfo/addDetectorDetail' //新增检测器坐标、图片、旋转角度
export const API_UPDATE_DETECTOR_OTHERS = '/DCU/detectorInfo/updateDetectorInfo' //修改检测器其它信息
export const API_UPDATE_DETECTOR_PIC = '/DCU/detectorInfo/updateDetectorDetail' //修改检测器坐标、图片、旋转角度
export const API_DEL_DETECTOR_INFO = '/DCU/detectorInfo/deleteDetectorInfo' //删除检测器当前一条
export const API_DEL_DETECTOR_PIC = '/DCU/detectorInfo/deleteDetectorDetail' //删除检测器图片
// 相位配置

// 阶段配置

// 配时方案配置

// 日计划配置

// 调度配置