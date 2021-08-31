# Jest 使用步骤

结合官方文档使用

## 1.安装 jest

npm i jest@24.8.0 -D(开发环境使用)。

## 2.创建测试文件

math.test.js (组件名.test.js)

## 3.编写测试代码：

```js
// 引入需要测试的js文件
const math = require('./math.js')
const { add, minus, multi } = math

// 给add函数编写测试代码
test('test function add 3 + 7', () => {
  expect(add(3, 7)).toBe(10)
})
// 给minus函数编写测试代码
test('test minus function 3-3', () => {
  expect(minus(3, 3)).toBe(0)
})
// 给multi函数编写测试代码
test('multi function 3 * 3', () => {
  expect(multi(3, 3)).toBe(9)
})
```

## 4.运行测试代码，

4.1 修改 package.json - script 下面的 "test" 为
"test": "jest"
或者 "test": "jest --watchAll" //保持时刻监测所有文件的变化，不需要每次都 run test
4.2 运行测试：npm run test
4.3 开挂：使用 vscode 插件帮助测试 jest（facebook），不需要在运行 npm run test 了

## 5.配置 test 配置文件

5.1 暴露 test 配置文件：npx jest --init(前端选择 browser 环境，后端选择 node)
5.2 在暴露的 jest.config.js 中编写要配置的选项
5.3 查看代码测试覆盖率：npx jest --coverage(或者在 package.json-script 中添加 "coverage": "jest coverage", 然后运行 npm run --coverage)
5.4 运行 coverage 之后会生成 coverage 文件夹，打开里面的 index.html 可以查看报告

## 6.配置 babel

jest 默认是 node 使用环境，只认识 commonJS 语法，需要用 babel 帮助将 import 等转成 commonjs 语法
6.1 安装 babel： npm i @babel/core@7.4.5 @babel/preset-env@7.4.5 -D
6.2 配置 babel 文件: 根目录创建 .babelrc 文件 并写入相关配置

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

6.3 随后可以正常编写有 import 等不是 commonJS 的语句了

```js
import { add, minus, multi } from './math'
//会被babel转化成
const math = require('./math.js')
const { add, minus, multi } = math
```

## 7.Jest 匹配器

describe: 对测试进行分组，有作用域
toBe(): === 匹配内容和格式
.not.toBe : 非
toEqual: == 匹配内容
toBeNull(): null
toBeUndefined(): undefined
toBeTruthy(): true
toBeFalsy(): false
toBeGreaterThan(): 大于
toBeGreaterThanOrEqual(): 大于等于
toBeLessThan(): 小于
toBeCloseTo(): 近似等于(用于小数计算)
toMatch(): string 中时候含有 xx 字段
toContain(): arr 中是否包含 xx 元素
toThrow(): 是抛出异常
toBeCalled(): 函数被调用了
not.toThrow(): 不抛出异常抛出异常

```js
//toMatch
test('toMatch',()=>{
  const str = 'http://www.dell-lee.com'
  expect(str).toMatch(/dell-lee)
})
//toContain
test('toContain',()=>{
  const arr = ['dell', 'lee', 'imooc']
  const data = new Set(arr)
  expect(data).toContain('delllee')
})
//toThrow
const throwNewErrorFunc=()=>{
  throw new Error('this is a new error')
}
test.('toThrow',()=>{
  expect(throwNewErrorFunc).toThrow('具体的error信息/也可以不写/如果写了错误信息就一定要相同')
})
```

## 8.Jest 命令行工具的使用

npm run test 下的几个模式（watchAll）
› Press f to run only failed tests.
› Press o to only run tests related to changed files.
› Press p to filter by a filename regex pattern.
› Press t to filter by a test name regex pattern.
› Press q to quit watch mode.
› Press Enter to trigger a test run.

## 9.异步代码的测试

测试获取的数据是否与接口文档的正确案例一致，可以测试返回的数据，也可以测试 catch 的错误
结合 11 jest.mock('axios')使用，一般不会发真正的请求，效率太低，一般只是测试接口能否发送请求数据。至于发送请求的数据对不对，这是后端需要测试的。

```js
// 1.代码
// fetchData2 收到结果不执行任何操作, 直接返回promise
export function fetchData2() {
  return axios.get('http://www.dell-lee.com/react/api/demo.json')
}
// fetchData3 与2相同，给错误的url，测试返回错误
export function fetchData3() {
  return axios.get('http://www.dell-lee.com/react/api/demo1.json')
}

// 2.测试
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
```

## 10.jest 钩子函数

对于准备型的代码需要把代码写在钩子函数中，如 new class()实例，给初始化值。
beforeAll():在所有用例执行之前调用，只调用一次，用例之间的结果可能会相互影响
beforeEach():在每一个用例执行之前调用个，用例相互之间不会受影响
afterAll():在所有用例执行之后调用。
afterEach():在每一个用例执行之后调用个。
作用域：钩子函数会在其所在的 describe 作用域 中生效，如果 describe 中还有 describe，外层的钩子函数会对内层生效。

## 11.Jest mock 函数使用

作用： 测试没有 return 的函数
格式：const mockFunc = jest.fn() //mock 函数
mockFunc.mock={ calls: [], instances: [], invocationCallOrder: [], results: [] }
当 mockFunc 被调用多次，calls 就有多个'[]'
如果要测试被调用的次数： mockFunc.mock.calls.length

```js 1. 测试回调函数：const mockFunc = jest.fn()
// 代码
export const runCallback = (callback) => {
  callback()
}
//测试回调函数是否被调用
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
```

```js 2. 测试异步代码，模拟axios库：jest.mock('axios')
// 使用axios发送ajax请求
export const getData = () => {
  return axios.get('./api').then((res) => res.data)
}

// 测试axios发送ajax请求
/* 测试axios请求时不会真的发送请求到api接口，否则耗时过大，我们只需要测试是否发送了异步请求即可，
api能不能拿到数据时后端写api时自己需要做的测试 */
// 1. 用jest mock一个axios请求，而不是向真实的api发送请求
jest.mock('axios')
test.only('测试 getData', async () => {
  // mock的作用3：改变函数的内部实现
  //模拟成功的请求数据为{ data: 'hello' }，需要在上面写jest.mock('axios')才能使用
  /* 可以用mockResolvedValueOnce定义单次返回的结果，也可以用mockResolvedValue定义每次返回的结果 */
  // axios.get.mockResolvedValue({ data: 'hello' }) //定义每次返回的结果（相同）
  axios.get.mockResolvedValueOnce({ data: 'hello' }) //定义单次返回的结果（用于每次不同）
  axios.get.mockResolvedValueOnce({ data: 'world' })
  await getData().then((data) => {
    //测试接收到的数据是不是{ data: 'hello' }
    expect(data).toBe('hello')
  })
  await getData().then((data) => {
    expect(data).toBe('world')
  })
})
```

```js 3. 测试异步代码，模拟自定义异步代码（代替原有真实异步代码）：jest.mock('./模拟文件路径')
//3.1 真实代码
export const getData = () => {
  return axios
    .get('http://www.dell-lee.com/react/api/demo.json')
    .then((res) => res.data)
}
//3.2 自定义mock文件:demo.js（放在'__mocks__'文件夹中）

//3.3 测试代码
/* 3.3.1 引入mock数据
引入__mock__中的demo.js模拟代码，也可以设置jest.config.js/automock:ture, jest会自己去寻找对应__mock__文件中的demo */
jest.mock('./demo')
import { fetchData } from './demo' //fetchData自动引入的是__mock__文件中的demo
const { getNumber } = jest.requireActual('./demo') //getNumber从真实的代码文件中获取，不适用mock文件
```
