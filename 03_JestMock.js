import axios from 'axios'

// 1.函数接收函数并执行函数
export function runCallback1(callback) {
  callback('abc')
}

// 2. 使用axios发送ajax请求
export const getData = () => {
  return axios.get('./api').then((res) => res.data)
}
