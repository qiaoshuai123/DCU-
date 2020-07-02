/**
 * @file 模块化 type name
 */

export const GET_UNIT_STATUS = 'GET_UNIT_STATUS'  //  信号参数据管理 step
// 切换视图
export const GET_SIGNAL_lIST_BY_PAGE = 'GET_SIGNAL_lIST_BY_PAGE'  //
// 基础信息配置
export const GET_BG_LIST = 'GET_BG_LIST' // 查询全部底图
export const POST_DCU_BY_INTERID = 'POST_DCU_BY_INTERID' //选中底图 > 更新底图
export const POST_UPDATE_DCU = 'POST_UPDATE_DCU' // 上传底图 > 更新底图
// 车道配置
export const GET_LANE_INFO_LISTS = 'GET_LANEINFO_LISTS' //根据interId查询路口下所有车道列表
export const GET_LANE_PIC_LISTS = 'GET_LANEPIC_LISTS' //根据interId 路口序号查询图上的车道
export const POST_ADD_LANE_OTHERS = 'POST_ADD_LANE_OTHERS' //新增车道其它信息
export const POST_ADD_LANE_PIC = 'POST_ADD_LANEPIC' //新增车道坐标、图片、旋转角度
export const POST_UPDATE_LANE_OTHERS = 'POST_UPDATE_LANE_OTHERS' //修改车道其它信息
export const POST_UPDATE_LANE_PIC = 'POST_UPDATE_LANEPIC' //修改车道坐标、图片、旋转角度
export const GET_DEL_LANE_INFO = 'GET_DEL_LANEINFO' //删除车道当前一条
export const GET_DEL_LANE_PIC = 'GET_DEL_LANEPIC' //删除车道详细
export const GET_LANE_INFO_AND_DETAIL = 'GET_LANE_INFO_AND_DETAIL' //回显内容
export const POST_ADD_LANE_INFO_AND_DETAIL = 'POST_ADD_LANE_INFO_AND_DETAIL' //新增内容图标和列表
export const POST_UPDATE_LANE_INFO_AND_DETAIL = 'POST_UPDATE_LANE_INFO_AND_DETAIL' //修改内容图标和列表
// 灯组配置
export const GET_LIGHT_INFO_LISTS = 'GET_LIGHTINFO_LISTS' //根据interId查询路口下所有灯组列表
export const GET_LIGHT_PIC_LISTS = 'GET_LIGHTPIC_LISTS' //根据interId 路口序号查询图上的灯
export const POST_ADD_LIGHT_OTHERS = 'POST_ADD_LIGHT_OTHERS' // 新增灯组其它信息
export const POST_ADD_LIGHT_PIC = 'POST_ADD_LIGHTPIC' // 新增灯组坐标、图片、旋转角度
export const POST_UPDATE_LIGHT_OTHERS = 'POST_UPDATE_LIGHT_OTHERS' // 修改灯组其它信息
export const POST_UPDATE_LIGHT_PIC = 'POST_UPDATE_LIGHTPIC' //修改灯组坐标、图片、旋转角度
export const GET_DEL_LIGHT_INFO = 'GET_DEL_LIGHTINFO' //右侧删除灯组当前一条
export const GET_DEL_LIGHT_PIC = 'GET_DEL_LIGHTPIC' //删除灯组图片
export const GET_LIGHT_INFO_AND_DETAIL = 'GET_LIGHT_INFO_AND_DETAIL' //回显内容
export const POST_ADD_LIGHT_INFO_AND_DETAIL = 'POST_ADD_LIGHT_INFO_AND_DETAIL' //新增内容图标和列表
export const POST_UPDATE_LIGHT_INFO_AND_DETAIL = 'POST_UPDATE_LIGHT_INFO_AND_DETAIL' //修改内容图标和列表
// 检测器配置
export const GET_DETECTOR_INFO_LISTS = 'GET_DETECTOR_INFO_LISTS' //根据interId查询路口下所有检测器列表
export const GET_DETECTOR_PIC_LISTS = 'GET_DETECTOR_PIC_LISTS' //根据interId 路口序号查询图上的检测器
export const POST_ADD_DETECTOR_OTHERS = 'POST_ADD_DETECTOR_OTHERS' //新增检测器其它信息
export const POST_ADD_DETECTOR_PIC = 'POST_ADD_DETECTOR_PIC' //新增检测器坐标、图片、旋转角度
export const POST_UPDATE_DETECTOR_OTHERS = 'POST_UPDATE_DETECTOR_OTHERS' //修改检测器其它信息
export const POST_UPDATE_DETECTOR_PIC = 'POST_UPDATE_DETECTOR_PIC' //修改检测器坐标、图片、旋转角度
export const GET_DEL_DETECTOR_INFO = 'GET_DEL_DETECTOR_INFO' //删除检测器当前一条
export const GET_DEL_DETECTOR_PIC = 'GET_DEL_DETECTOR_PIC' //删除检测器图片
export const GET_DETECTOR_INFO_AND_DETAIL = 'GET_DETECTOR_INFO_AND_DETAIL' //回显内容
export const POST_ADD_DETECTOR_INFO_AND_DETAIL = 'POST_ADD_DETECTOR_INFO_AND_DETAIL' //新增内容图标和列表
export const POST_UPDATE_DETECTOR_INFO_AND_DETAIL = 'POST_UPDATE_DETECTOR_INFO_AND_DETAIL' //修改内容图标和列表
// 相位配置
export const GET_PHASE_INFO_LISTS = 'GET_PHASE_INFO_LISTS' //相位查询列表
export const POST_ADD_PHASE_OTHERS = 'POST_ADD_PHASE_OTHERS' //相位新增
export const POST_UPDATE_PHASE_OTHERS = 'POST_UPDATE_PHASE_OTHERS' //相位修改
export const GET_DEL_PHASE_INFO = 'GET_DEL_PHASE_INFO' //相位删除
// 阶段配置
export const GET_STAGE_INFO_LISTS = 'GET_STAGE_INFO_LISTS' //阶段查询列表
export const POST_ADD_STAGE_OTHERS = 'POST_ADD_STAGE_OTHERS' //阶段新增
export const POST_UPDATE_STAGE_OTHERS = 'POST_UPDATE_STAGE_OTHERS' //阶段修改
export const GET_DEL_STAGE_INFO = 'GET_DEL_STAGE_INFO' //阶段删除
// 配时方案配置
export const GET_PLAN_INFO_LISTS = 'GET_PLAN_INFO_LISTS' //配时方案查询列表
export const POST_ADD_PLAN_OTHERS = 'POST_ADD_PLAN_OTHERS' //配时方案新增
export const POST_UPDATE_PLAN_OTHERS = 'POST_UPDATE_PLAN_OTHERS' //配时方案修改
export const GET_DEL_PLAN_INFO = 'GET_DEL_PLAN_INFO' //配时方案删除
// 日计划配置
export const GET_DAYPLAN_INFO_LISTS = 'GET_DAYPLAN_INFO_LISTS' //日计划查询列表
export const POST_ADD_DAYPLAN_OTHERS = 'POST_ADD_DAYPLAN_OTHERS' //日计划新增
export const POST_UPDATE_DAYPLAN_OTHERS = 'POST_UPDATE_DAYPLAN_OTHERS' //日计划修改
export const GET_DEL_DAYPLAN_INFO = 'GET_DEL_DAYPLAN_INFO' //日计划删除
// 调度配置
export const GET_DISPATCH_INFO_LISTS = 'GET_DISPATCH_INFO_LISTS' //调度配置查询列表
export const POST_ADD_DISPATCH_OTHERS = 'POST_ADD_DISPATCH_OTHERS' //调度配置新增
export const POST_UPDATE_DISPATCH_OTHERS = 'POST_UPDATE_DISPATCH_OTHERS' //调度配置修改
export const GET_DEL_DISPATCH_INFO = 'GET_DEL_DISPATCH_INFO' //调度配置删除

/** *************设备参数管理************* */
export const GET_DELNUM = 'GET_DELNUM' // 修改添加弹窗
export const GET_DEL_DCUBYINTERID = 'GET_DEL_DCUBYINTERID'
export const GET_DEL_SIGNALBYINTERID = 'GET_DEL_SIGNALBYINTERID'

export const POST_DEL_UPDATEUNIT = 'POST_DEL_UPDATEUNIT'
export const POST_DEL_FILEUPLOAD = 'POST_DEL_FILEUPLOAD'
export const GET_DEL_BACKGROUNDLIST = 'GET_DEL_BACKGROUNDLIST'
