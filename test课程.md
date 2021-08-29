# Jest 使用步骤

结合官方文档使用 1.安装 jest: npm i jest@24.8.0 -D(开发环境使用)。  
2.创建测试文件：math.test.js (组件名.test.js)  
3.编写测试代码：

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

4.运行测试代码，
4.1 修改 package.json - script 下面的 "test" 为
"test": "jest"
或者 "test": "jest --watchAll" //保持时刻监测所有文件的变化，不需要每次都 run test
4.2 运行测试：npm run test

5.配置 test 配置文件
5.1 暴露 test 配置文件：npx jest --init(前端选择 browser 环境，后端选择 node)
5.2 在暴露的 jest.config.js 中编写要配置的选项
5.3 查看代码测试覆盖率：npx jest --coverage(或者在 package.json-script 中添加 "coverage": "jest coverage", 然后运行 npm run --coverage)
5.4 运行 coverage 之后会生成 coverage 文件夹，打开里面的 index.html 可以查看报告

6.jest 默认是 node 使用环境，只认识 commonJS 语法，需要用 babel 帮助将 import 等转成 commonjs 语法
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

7.Jest 匹配器
describe: 对测试进行分组
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

8.Jest 命令行工具的使用
npm run test 下的几个模式（watchAll）
› Press f to run only failed tests.
› Press o to only run tests related to changed files.
› Press p to filter by a filename regex pattern.
› Press t to filter by a test name regex pattern.
› Press q to quit watch mode.
› Press Enter to trigger a test run.

9.异步代码的测试
测试获取的数据是否与接口文档的正确案例一致，可以测试返回的数据，也可以测试 catch 的错误

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

10.jest 钩子函数
beforeAll():在所有用例执行之前调用，只调用一次，用例之间的结果可能会相互影响
beforeEach():在每一个用例执行之前调用个，用例相互之间不会受影响
afterAll():在所有用例执行之后调用。
afterEach():在每一个用例执行之后调用个。
