/**
 * @file 模块化 type name
 */

export const GET_UNIT_STATUS = 'GET_UNIT_STATUS'  //  信号参数据管理 step

// 基础信息配置
export const GET_BG_LIST = 'GET_BG_LIST' // 查询全部底图
export const POST_DCU_BY_INTERID = 'POST_DCU_BY_INTERID' //选中底图 > 更新底图
export const POST_UPDATE_DCU = 'POST_UPDATE_DCU' // 上传底图 > 更新底图
// 车道配置
export const GET_LANEINFO_LISTS = 'GET_LANEINFO_LISTS' //根据interId查询路口下所有车道列表
export const GET_LANEPIC_LISTS = 'GET_LANEPIC_LISTS' //根据interId 路口序号查询图上的车道
export const POST_ADD_LANE_OTHERS = 'POST_ADD_LANE_OTHERS' //新增车道其它信息
export const POST_ADD_LANEPIC = 'POST_ADD_LANEPIC' //新增车道坐标、图片、旋转角度
export const POST_UPDATE_LANE_OTHERS = 'POST_UPDATE_LANE_OTHERS' //修改车道其它信息
export const POST_UPDATE_LANEPIC = 'POST_UPDATE_LANEPIC' //修改车道坐标、图片、旋转角度
export const GET_DEL_LANEINFO = 'GET_DEL_LANEINFO' //删除车道当前一条
export const GET_DEL_LANEPIC = 'GET_DEL_LANEPIC' //删除车道详细
// 灯组配置
export const GET_LIGHTINFO_LISTS = 'GET_LIGHTINFO_LISTS' //根据interId查询路口下所有灯组列表
export const GET_LIGHTPIC_LISTS = 'GET_LIGHTPIC_LISTS' //根据interId 路口序号查询图上的灯
export const POST_ADD_LIGHT_OTHERS = 'POST_ADD_LIGHT_OTHERS' // 新增灯组其它信息
export const POST_ADD_LIGHTPIC = 'POST_ADD_LIGHTPIC' // 新增灯组坐标、图片、旋转角度
export const POST_UPDATE_LIGHT_OTHERS = 'POST_UPDATE_LIGHT_OTHERS' // 修改灯组其它信息
export const POST_UPDATE_LIGHTPIC = 'POST_UPDATE_LIGHTPIC' //修改灯组坐标、图片、旋转角度
export const GET_DEL_LIGHTINFO = 'GET_DEL_LIGHTINFO' //右侧删除灯组当前一条
export const GET_DEL_LIGHTPIC = 'GET_DEL_LIGHTPIC' //删除灯组图片
// 检测器配置
export const GET_DETECTOR_INFO_LISTS = 'GET_DETECTOR_INFO_LISTS' //根据interId查询路口下所有检测器列表
export const GET_DETECTOR_PIC_LISTS = 'GET_DETECTOR_PIC_LISTS' //根据interId 路口序号查询图上的检测器
export const POST_ADD_DETECTOR_OTHERS = 'POST_ADD_DETECTOR_OTHERS' //新增检测器其它信息
export const POST_ADD_DETECTOR_PIC = 'POST_ADD_DETECTOR_PIC' //新增检测器坐标、图片、旋转角度
export const POST_UPDATE_DETECTOR_OTHERS = 'POST_UPDATE_DETECTOR_OTHERS' //修改检测器其它信息
export const POST_UPDATE_DETECTOR_PIC = 'POST_UPDATE_DETECTOR_PIC' //修改检测器坐标、图片、旋转角度
export const GET_DEL_DETECTOR_INFO = 'GET_DEL_DETECTOR_INFO' //删除检测器当前一条
export const GET_DEL_DETECTOR_PIC = 'GET_DEL_DETECTOR_PIC' //删除检测器图片
// 相位配置

// 阶段配置

// 配时方案配置

// 日计划配置

// 调度配置