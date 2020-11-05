const getRequestBaseUrl = () => {
  // http://39.100.128.220:20203 公网
  // http://192.168.1.213:20203 内网
  if (process.env.NODE_ENV === 'development') {
    return 'http://192.168.1.213:20203'
  } else if (process.env.NODE_ENV === 'production') {
    return 'http://53.101.255.41:20203'
    // return 'http://39.100.128.220:12345'
  }
}
export default getRequestBaseUrl
