const resetTimeStep = (value) => { // 时间戳转换日期格式方法
  if (value == null) {
    return ''
  }
  const date = new Date(value)
  const y = date.getFullYear()// 年
  let MM = date.getMonth() + 1// 月
  MM = MM < 10 ? (`0${MM}`) : MM
  let d = date.getDate()// 日
  d = d < 10 ? (`0${d}`) : d
  let h = date.getHours()// 时
  h = h < 10 ? (`0${h}`) : h
  let m = date.getMinutes()// 分
  m = m < 10 ? (`0${m}`) : m
  let s = date.getSeconds()// 秒
  s = s < 10 ? (`0${s}`) : s
  return `${y}-${MM}-${d} ${h}:${m}:${s}`
}

export default resetTimeStep
