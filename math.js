import axios from 'axios'

// 基本测试用例
export function add(a, b) {
  return a + b
}

// 异步测试用例
// fetchData1 接收回调函数，返回回调函数处理的结果
export function fetchData1(fn) {
  axios.get('http://www.dell-lee.com/react/api/demo.json').then((response) => {
    fn(response.data)
  })
}
// fetchData2 收到结果不执行任何操作, 直接返回promise
export function fetchData2() {
  return axios.get('http://www.dell-lee.com/react/api/demo.json')
}
// fetchData3 与2相同，给错误的url，测试返回错误
export function fetchData3() {
  return axios.get('http://www.dell-lee.com/react/api/demo1.json')
}
