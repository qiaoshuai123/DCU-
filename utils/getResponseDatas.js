import axios from 'axios'

// const instance = axios.create({
//   baseURL: 'http://192.168.1.213:20201'
// })
// // 请求拦截
// instance.interceptors.request.use((config) => {
//   const pathName = (config.url.split('/')).pop()
//   if (pathName !== 'login') {
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'))
//     if (userInfo) {
//       config.headers.Authorization = userInfo.token
//     } else {
//       window.location.href = '#/login'
//     }
//   }
//   return config
// }, error => Promise.reject(error))
// 返回拦截
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})
const getResponseDatas = async (type, url, requestParams) {
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
