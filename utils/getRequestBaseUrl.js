const getRequestBaseUrl = () => {
  // http://39.100.128.220:7002 公网
  // http://10.11.57.101:20206 内网
  return process.env.NODE_ENV === 'development' ? 'http://192.168.1.213:20203' :
    process.env.NODE_ENV === 'production' ? 'http://192.168.1.213:20203' : null
}
export default getRequestBaseUrl()
