import axios from 'axios'
import { runCallback1, getData } from './03_JestMock'
// 用jest mock一个axios请求，而不是向真实的api发送请求
jest.mock('axios')

//1. 测试回调函数是否被调用
test('test runCallback1', () => {
  // 用jest mock一个回调函数传递给runCallback，测试回调函数是否被执行了
  // mock的作用1. 捕获函数的调用和返回结果，以及this和调用顺序
  const mockFunc = jest.fn()
  //console.log(mockFunc.mock)
  // mock的作用2. 可以让我们自定义返回结果
  mockFunc.mockImplementationOnce(() => {
    // console.log(mockFunc) // 可以加入一些逻辑处理
    return 'dell'
  })
  //调用2次，返回的结果分别是dell/lee，也可以用func.mockReturnValue('dell')，自定义每次返回结果都是’dell'
  mockFunc.mockImplementationOnce(() => {
    return 'lee'
  })
  runCallback1(mockFunc)
  runCallback1(mockFunc)
  expect(mockFunc).toBeCalled()
  expect(mockFunc.mock.calls.length).toBe(2) //方法二：测试回调函数调用的次数
  expect(mockFunc.mock.calls[0]).toEqual(['abc']) // 方法三：测试回调函数 传递的值
})

// 2. 测试axios发送ajax请求
/* 测试axios请求时不会真的发送请求到api接口，否则耗时过大，我们只需要测试是否发送了异步请求即可，
api能不能拿到数据时后端写api时自己需要做的测试 */
test('测试 getData', async () => {
  // mock的作用3：改变函数的内部实现
  //模拟成功的请求数据为{ data: 'hello' }，需要在上面写jest.mock('axios')才能使用
  /* 可以用mockResolvedValueOnce定义单次返回的结果，也可以用mockResolvedValue定义每次返回的结果 */
  axios.get.mockResolvedValueOnce({ data: 'hello' })
  axios.get.mockResolvedValueOnce({ data: 'world' })
  await getData().then((data) => {
    //测试接收到的数据是不是{ data: 'hello' }
    expect(data).toBe('hello')
  })
  await getData().then((data) => {
    expect(data).toBe('world')
  })
})
