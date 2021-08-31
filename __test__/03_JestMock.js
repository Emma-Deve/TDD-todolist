import axios from 'axios'

// 1.函数接收函数并执行函数
export function runCallback1(callback) {
  callback('abc')
}

// 2. 使用axios发送ajax请求
export const getData = () => {
  // 发送真实的axios请求
  return axios.get('./api').then((res) => res.data)
}

//
export function add(a, b) {
  return a + b
}
