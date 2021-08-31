// 引入需要测试的js文件
import { add, fetchData1, fetchData2, fetchData3 } from './01_AsyncFunc'

// 给add函数编写测试用例：test case
test('test function add 3 + 7', () => {
  expect(add(3, 7)).toBe(10)
})

//toMatch
test('toMatch', () => {
  const str = 'http://www.dell-lee.com'
  expect(str).toMatch(/dell-lee/)
})
//toContain
test('toContain', () => {
  const arr = ['dell', 'lee', 'imooc']
  const data = new Set(arr)
  expect(data).toContain('dell')
})
//toThrow
const throwNewErrorFunc = () => {
  throw new Error('this is a new error')
}
test('toThrow', () => {
  expect(throwNewErrorFunc).toThrow('this is a new error')
})

//异步代码测试
// fetchData1：使用回调函数done，测试完后调用done
test('fetchData return true', (done) => {
  fetchData1((data) => {
    expect(data).toEqual({ success: true }), done()
  })
})
// fetchData2: 在fetchData2前使用return
describe('fetchData2 相关的测试方法', () => {
  //方法一：测试then拿到的结果中的data是否等于{ success: true }
  test('fetchData2 return true', () => {
    return fetchData2().then((response) => {
      expect(response.data).toEqual({
        success: true,
      })
    })
  })
  //方法二:测试返回的data中的resolves里面是否包含data: { success: true },
  test('fetchData2 return true', () => {
    return expect(fetchData2()).resolves.toMatchObject({
      data: { success: true },
    })
  })
  //方法三：通过async await获取结果并判断结果
  test('fetchData2 return true', async () => {
    const response = await fetchData2()
    expect(response.data).toEqual({
      success: true,
    })
  })
})

// fetchData3: 测试返回错误
describe('fetchData3 相关的代码', () => {
  //方法一：测试catch到的错误是否包含有404字样
  test('fetchData3 return 404', () => {
    expect.assertions(1) //要求必须执行一个expect语法，以防不返回404时不执行catch语句
    return fetchData3().catch((e) => {
      //console.log(e.toString()) // 打印结果：{Error: Request failed with status code 404}
      expect(e.toString().indexOf('404') > -1).toBe(true) //只要里面字符串包含404就返回true
    })
  })
  //方法二：测试是否能博捉到一个错误
  test('fetchData3 return 404', () => {
    return expect(fetchData3()).rejects.toThrow()
  })
  //方法三：通过async await获取结果并判断结果
  test('fetchData3 return 404', async () => {
    expect.assertions(1)
    try {
      await fetchData3()
    } catch (e) {
      expect(e.toString()).toEqual('Error: Request failed with status code 404')
    }
  })
})
