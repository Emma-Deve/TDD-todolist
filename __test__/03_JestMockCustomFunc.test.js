// 用jest mock自定义异步函数，而不是向真实的api发送请求

// 如果测试真实代码fetchMockData, jest.mock表示从 fetchMockData 从mocks/xx中读取
import { fetchMockData } from './03_JestMock' //真实代码路径
jest.mock('./__mocks__/mockFunc.js') //mock代码在mocks中的路径
// 引入真实代码
const { add } = jest.requireActual('./03_JestMock')

//3. 使用自定义的mock函数 代替 真实的异步请求代码
/* 打开 test.config中的'automock:true',或则在 test文件顶上引入__mock__自定义函数： jest.mock('./demo')*/
test('测试自定义mock代码', () => {
  return fetchMockData().then((data) => {
    expect(eval(data)).toBeEqual('123')
  })
})

test('测试add', () => {
  expect(add(1, 1)).toBe(2)
})
