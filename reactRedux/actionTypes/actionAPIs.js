/**
 * @file 模块化 API 接口地址
 */

export const API_UNIT_STATUS = '/DCU/unitInfo/unitStatus' // 信号参数据管理 step

/** *********** 信号参数管理模块 ************* */
// 切换视图
export const API_SIGNAL_lIST_BY_PAGE = '/DCU/signalInfo/signalListByPage' // 切换视图
// 基础信息配置
export const API_BG_LIST = '/DCU/unitInfo/backgroundList' // 查询全部底图
export const API_DCU_BY_INTERID = '/DCU/unitInfo/updateUnit' // 选中底图 > 更新底图
export const API_UPDATE_DCU = '/DCU/unitInfo/fileUpload' // 上传底图 > 更新底图
// 车道配置
export const API_LANE_INFO_LISTS = '/DCU/laneInfo/laneInfoList' // 根据interId查询路口下所有车道列表
export const API_LANE_PIC_LISTS = '/DCU/laneInfo/laneDetailList'  // 根据interId 路口序号查询图上的车道
export const API_ADD_LANE_OTHERS = '/DCU/laneInfo/addLaneInfo' // 新增车道其它信息
export const API_ADD_LANE_PIC = '/DCU/laneInfo/addLaneDetail' // 新增车道坐标、图片、旋转角度
export const API_UPDATE_LANE_OTHERS = '/DCU/laneInfo/updateLaneInfo' // 修改车道其它信息
export const API_UPDATE_LANE_PIC = '/DCU/laneInfo/updateLaneDetail' // 修改车道坐标、图片、旋转角度
export const API_DEL_LANE_INFO = '/DCU/laneInfo/deleteLaneInfo' // 删除车道当前一条
export const API_DEL_LANE_PIC = '/DCU/laneInfo/deleteLaneDetail' // 删除车道详细
export const API_LANE_INFO_AND_DETAIL = '/DCU/laneInfo/laneInfoAndDetail' // 回显内容
export const API_ADD_LANE_INFO_AND_DETAIL = '/DCU/laneInfo/addLaneInfoAndDetail' // 新增内容图标和列表
export const API_UPDATE_LANE_INFO_AND_DETAIL = '/DCU/laneInfo/updateLaneInfoAndDetail' // 修改内容图标和列表
export const API_LANE_IMAGE_LIST = '/DCU/laneInfo/laneImageList' // 回显全部图标
export const API_LANE_SELECT_LIST = '/DCU/laneInfo/laneInfoAndDetailList' // 选中后列表
// 灯组配置
export const API_LIGHT_INFO_LISTS = '/DCU/lampgroupInfo/lampgroupInfoList' // 根据interId查询路口下所有灯组列表
export const API_LIGHT_PIC_LISTS = '/DCU/lampgroupInfo/lampgroupDetailList' // 根据interId 路口序号查询图上的灯
export const API_ADD_LIGHT_OTHERS = '/DCU/lampgroupInfo/addLampgroupInfo' // 新增灯组其它信息
export const API_ADD_LIGHT_PIC = '/DCU/lampgroupInfo/addLampgroupDetail' // 新增灯组坐标、图片、旋转角度
export const API_UPDATE_LIGHT_OTHERS = '/DCU/lampgroupInfo/updateLampgroupInfo' // 修改灯组其它信息
export const API_UPDATE_LIGHT_PIC = '/DCU/lampgroupInfo/updateLampgroupDetail' // 修改灯组坐标、图片、旋转角度
export const API_DEL_LIGHT_INFO = '/DCU/lampgroupInfo/deleteLampgroupInfo' // 右侧删除灯组当前一条
export const API_DEL_LIGHT_PIC = '/DCU/lampgroupInfo/deleteLampgroupDetail' // 删除灯组图片
export const API_LIGHT_INFO_AND_DETAIL = '/DCU/lampgroupInfo/lampgroupInfoAndDetail' // 回显内容
export const API_ADD_LIGHT_INFO_AND_DETAIL = '/DCU/lampgroupInfo/addLampgroupInfoAndDetail' // 新增内容图标和列表
export const API_UPDATE_LIGHT_INFO_AND_DETAIL = '/DCU/lampgroupInfo/updateLampgroupInfoAndDetail' // 修改内容图标和列表
export const API_LIGHT_IMAGE_LIST = '/DCU/lampgroupInfo/lampgroupImageList' // 回显全部图标
export const API_LIGHT_SELECT_LIST = '/DCU/lampgroupInfo/lampgroupInfoAndDetailList' // 选中后列表
// 检测器配置
export const API_DETECTOR_INFO_LISTS = '/DCU/detectorInfo/detectorInfoList' // 根据interId查询路口下所有检测器列表
export const API_DETECTOR_PIC_LISTS = '/DCU/detectorInfo/detectorDetailList' // 根据interId 路口序号查询图上的检测器
export const API_ADD_DETECTOR_OTHERS = '/DCU/detectorInfo/addDetectorInfo' // 新增检测器其它信息
export const API_ADD_DETECTOR_PIC = '/DCU/detectorInfo/addDetectorDetail' // 新增检测器坐标、图片、旋转角度
export const API_UPDATE_DETECTOR_OTHERS = '/DCU/detectorInfo/updateDetectorInfo' // 修改检测器其它信息
export const API_UPDATE_DETECTOR_PIC = '/DCU/detectorInfo/updateDetectorDetail' // 修改检测器坐标、图片、旋转角度
export const API_DEL_DETECTOR_INFO = '/DCU/detectorInfo/deleteDetectorInfo' // 删除检测器当前一条
export const API_DEL_DETECTOR_PIC = '/DCU/detectorInfo/deleteDetectorDetail' // 删除检测器图片
export const API_DETECTOR_INFO_AND_DETAIL = '/DCU/detectorInfo/detectorInfoAndDetail' // 回显内容
export const API_ADD_DETECTOR_INFO_AND_DETAIL = '/DCU/detectorInfo/addDetectorInfoAndDetail' // 新增内容图标和列表
export const API_UPDATE_DETECTOR_INFO_AND_DETAIL = '/DCU/detectorInfo/updateDetectorInfoAndDetail' // 修改内容图标和列表
export const API_DETECTOR_IMAGE_LIST = '/DCU/detectorInfo/detectorImageList' // 回显全部图标
export const API_DETECTOR_SELECT_LIST = '/DCU/detectorInfo/detectorInfoAndDetailList' // 选中后列表
// 相位配置
export const API_PHASE_INFO_LISTS = '/DCU/phaseInfo/phaseInfoList' // 相位查询列表
export const API_ADD_PHASE_OTHERS = '/DCU/phaseInfo/addPhaseInfo' // 相位新增
export const API_UPDATE_PHASE_OTHERS = '/DCU/phaseInfo/updatePhaseInfo' // 相位修改
export const API_DEL_PHASE_INFO = '/DCU/phaseInfo/deletePhaseInfo' // 相位删除
export const API_PHASE_IMAGE_LIST = '/DCU/phaseStageInfo/phasestageImageList' // 回显全部图标
// 阶段配置
export const API_STAGE_INFO_LISTS = '/DCU/phaseStageInfo/phaseStageInfoList' // 阶段查询列表
export const API_ADD_STAGE_OTHERS = '/DCU/phaseStageInfo/addPhaseStageInfo' // 阶段新增
export const API_UPDATE_STAGE_OTHERS = '/DCU/phaseStageInfo/updatePhaseStageInfo' // 阶段修改
export const API_DEL_STAGE_INFO = '/DCU/phaseStageInfo/deletePhaseStageInfo' // 阶段删除
// 配时方案配置
export const API_PLAN_INFO_LISTS = '/DCU/schemeInfo/schemeInfoList' // 配时方案查询列表
export const API_ADD_PLAN_OTHERS = '/DCU/schemeInfo/addSchemeInfo' // 配时方案新增
export const API_UPDATE_PLAN_OTHERS = '/DCU/schemeInfo/updateSchemeInfo' // 配时方案修改
export const API_DEL_PLAN_INFO = '/DCU/schemeInfo/deleteSchemeInfo' // 配时方案删除
export const API_S_PHASE_STAGE_CHAINS = '/DCU/schemeInfo/schemePhaseStageChains' //方案阶段链
// 日计划配置
export const API_DAYPLAN_INFO_LISTS = '/DCU/dailyPlan/dailyPlanList' // 日计划查询列表
export const API_ADD_DAYPLAN_OTHERS = '/DCU/dailyPlan/addDailyPlan' // 日计划新增
export const API_UPDATE_DAYPLAN_OTHERS = '/DCU/dailyPlan/updateDailyPlan' // 日计划修改
export const API_DEL_DAYPLAN_INFO = '/DCU/dailyPlan/deleteDailyPlan' // 日计划删除
export const API_LINE_DAYPLAN_CLICK = '/DCU/schemeInfo/schemeInfoBySchemeNo' // 日计划点击 根据方案号查询配时方案
// 调度配置
export const API_DISPATCH_INFO_LISTS = '/DCU/schedule/scheduleList' // 调度配置查询列表
export const API_ADD_DISPATCH_OTHERS = '/DCU/schedule/addSchedule' // 调度配置新增
export const API_UPDATE_DISPATCH_OTHERS = '/DCU/schedule/updateSchedule' // 调度配置修改
export const API_DEL_DISPATCH_INFO = '/DCU/schedule/deleteSchedule' // 调度配置删除
export const API_LINE_DISPATCH_CLICK = '/DCU/dailyPlan/dailyPlanByDailyplanNo' // 调度点击 根据方案号查询配时方案

/** *********** 设备参数管理模块 ************* */
export const API_DCU_INTERCHECK_INFO = '/DCU/unitInfo/interCheck' // 判断是否存在点位
export const API_DCU_ADDDCU_INFO = '/DCU/unitInfo/addUnit' // 添加点位
export const API_DEL_UPDATEDCU_INFO = '/DCU/unitInfo/updateUnit' // 修改点位
export const API_DEL_UNITINFO_INFO = '/DCU/unitInfo/deleteUnit' // 删除点位
// 设备基础配置
export const API_DEL_DCUBYINTERID = '/DCU/dcuInfo/dcuByInterId' // DCU基础信息查询（根据interId查询
export const API_DEL_UPDATEDCU = '/DCU/dcuInfo/updateDcu' // DCU修改
export const API_DEL_SIGNALBYINTERID = '/DCU/signalInfo/signalByInterId' // 信号机基础信息查询（根据interId查询信号机）
export const API_DEL_UPDATESIGNAL = '/DCU/signalInfo/updateSignal' // 修改信号机
export const API_DEL_UPDATEUNIT = '/DCU/unitInfo/updateUnit' // 选择底图
export const API_DEL_FILEUPLOAD = '/DCU/unitInfo/fileUpload' // 上传底图
export const API_DEL_BACKGROUNDLIST = '/DCU/unitInfo/backgroundList' // 查询全部底图
export const API_SIG_LOADDATA = '/DCU/signalInfo/loadData' // 信号机上传配置
export const API_SIG_EDITDATA = '/DCU/signalInfo/editData' // 信号机下发配置
export const API_DCU_LOADDATA = '/DCU/dcuInfo/loadData' // DCU上传配置
export const API_DCU_EDITDATA = '/DCU/dcuInfo/editData' // DCU下发配置
export const API_UNI_REBOOT = '/DCU/unitInfo/reboot' // 信号机DCU重启

/** *********** 实时监控模块 ************* */
// DCU状态
export const API_LAN_LANEINFOANDDETAIL = '/DCU/laneInfo/laneDetailList' // 车道图片接口..
export const API_LAM_LAMPGROUPDETAILLIST = '/DCU/lampgroupInfo/lampgroupDetailList' // 灯组图片接口
export const API_DET_DETECTORDETAILLIST = '/DCU/detectorInfo/detectorDetailList' // 检测器接口
export const API_PHA_NOWPHASESTAGEINGO = '/DCU/phaseStageInfo/nowPhasestageInfo' // 查询路口当前方案的全部阶段
export const API_UNI_LOCKSTATELIST = '/DCU/unitInfo/lockStateList' // 锁定状态
export const API_SCH_SCHMEINFOLIST = '/DCU/schemeInfo/schemeInfoList' // 当前路口全部方案
export const API_DCU_PROOFREADTIME = '/DCU/dcuInfo/proofreadTime' // DCU校时信号机校时两个参数 interId   proofreadType
export const API_DCU_CENTERCONTROL = '/DCU/dcuInfo/centerControl' // 中心控制
export const API_DCU_DCULIST = '/DCU/dcuInfo/dcuList' // 查询全部DCU
export const API_DCU_DCULISTBYPAGE = '/DCU/dcuInfo/dcuListByPage' // 分页查询DCU
export const API_DCU_DCUBYINTERID = '/DCU/dcuInfo/dcuByInterId' // 根据点位主键ID查询DCU
export const API_SYS_SYSTEMCODELISTBYCODETYPE = '/DCU/sys/code/systemCodeListByCodeType' // 获取所有区号
export const API_UNI_UNITINFOLIST = '/DCU/unitInfo/unitInfoList' // 获取所有点位/signalInfo/signalListByPage

// 信号机实时状态
export const API_SIG_SIGNALLIST = '/DCU/signalInfo/signalList' // 查询全部信号机数据
export const API_SIG_SIGNALLISTBYPAGE = '/DCU/signalInfo/signalListByPage' // 分页查询信号机
export const API_DCU_DETECTORREALTIMELISTBYPAGE = '/DCU/dcuInfo/detectorRealTimeListByPage' // 分页查询数据状态
export const API_DET_DETECTORTYPENAMEBYINTERID = '/DCU/detectorInfo/detectorTypeNameByInterId' // 根据路口编号查询数据来源

// 检测器数据
export const API_DET_DETECTORDATALISTBYPAGE = '/DCU/detectorData/detectorDataListByPage' // 分页查询检测器数据
export const API_DET_EXPORTDETECTORDATALIST = '/DCU/detectorData/exportDetectorDataList' // 导出检测器数据
export const API_DET_DETECTORINFOLIST = '/DCU/detectorInfo/detectorInfoList' // 根据interId查询检测器

// export const API_DCU_CENTERCONTROL = '/DCU/dcuInfo/centerControl' // 中心控制
// export const API_DCU_CENTERCONTROL = '/DCU/dcuInfo/centerControl' // 中心控制
// export const API_DCU_CENTERCONTROL = '/DCU/dcuInfo/centerControl' // 中心控制
// export const API_DCU_CENTERCONTROL = '/DCU/dcuInfo/centerControl' // 中心控制
