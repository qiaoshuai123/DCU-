function getaddress(str) {
  const ars = str.substring(1).split('&')
  const ars1 = ars.map((item) => {
    return (
      item.replace('=', ':')
    )
  })
  const obj = {}
  ars1.forEach((item) => {
    const newArr = item.split(':')
    obj[newArr[0]] = newArr[1]
  })
  return obj
}

export default getaddress
