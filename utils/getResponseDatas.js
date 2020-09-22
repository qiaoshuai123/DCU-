import axios from 'axios'
// import requestUrl from './getRequestBaseUrl'

// const instance = axios.create({
//   // baseURL: requestUrl(),
// })
// 请求拦截
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://192.168.1.213:20203' // http://192.168.1.213:20203
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://33.89.129.41:20203' // http://192.168.1.213:20203
  // axios.defaults.baseURL = 'http://39.100.128.220:20203' // http://192.168.1.213:20203
}
axios.interceptors.request.use((config) => {
  const pathName = (config.url.split('/')).pop()
  if (pathName !== 'login') {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      config.headers.Authorization = userInfo.token
    } else {
      window.location.href = '#login' // 登录失效后的跳转地址
    }
    // 临时使用
    // config.headers.Authorization = 'dcc6f4eff3b017a1b425051765f351b9d62bee5f9c0d7e9a3db056faedd3fe6fde7bf3a9d8d8e707edf4a1169f5eec1437c7eb859c135847c6db4983208aca47'
    // config.headers.singleToken = '123456'
  }
  return config
}, error => (Promise.reject(error)))

// 返回拦截
axios.interceptors.response.use((response) => {
  if (response.data.code === -10) {
    // localStorage.clear()
    if (process.env.NODE_ENV === 'development') {
      console.log(response)
      // axios.defaults.baseURL = 'http://192.168.1.213:20203'
      window.location.href = 'http://localhost:20204/#/login'
    } else if (process.env.NODE_ENV === 'production') {
      window.location.href = 'http://127.0.0.1:8088/index.html#/login'
      // window.location.href = 'http://39.100.128.220:12345/build/index.html#/login'
    }
  }
  return response
}, (error) => {
  return Promise.reject(error)
})
const getResponseDatas = async (type, url, requestParams) => {
  try {
    let reponse = ''
    switch (type) {
      case 'get':
        reponse = await axios.get(url, { params: requestParams })
        break
      case 'post':
        reponse = await axios.post(url, requestParams)
        break
      case 'put':
        reponse = await axios.put(url, requestParams)
        break
      case 'delete':
        reponse = await axios.delete(url, requestParams)
        break
      default:
        break
    }
    return reponse
  } catch (error) {
    console.error(error)
  }
}
export default getResponseDatas
// ==== axios是基于ajax和promise（浏览器内置）进行封装的库
// fetch 浏览器内置API 内置的类，进行数据请求，天生就是基于Promise进行管理的
