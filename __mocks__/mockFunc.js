export const fetchMockData = () => {
  //自定义一个Promise给定返回的数据(代替发送数据请求)
  return new Promise((resolved, reject) => {
    resolved("(function(){return '123})()")
  })
}
