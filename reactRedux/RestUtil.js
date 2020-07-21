/**
 * @file Http request
 */

import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
  // axios.defaults.baseURL = 'http://192.168.1.213:20203'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://39.100.128.220:20203' // http://192.168.1.213:20203
}

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  const pathName = (config.url.split('/')).pop()
  if (pathName !== 'login') {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // console.log(userInfo, 'sdsdsd')
    if (userInfo) {
      config.headers.Authorization = userInfo.token
    } else {
      window.location.href = '#login' // 登录失效后的跳转地址
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})


export default axios
