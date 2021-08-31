import Counter from './02_HookAPI'

describe('Counter test code', () => {
  let counter = null

  // 外层钩子函数对外层describe和内层describe都生效
  beforeAll(() => {
    console.log('BeforeAll')
  })
  beforeEach(() => {
    console.log('beforeEach')
    counter = new Counter() //class需要new一个实例对象
  })
  afterEach(() => {
    console.log('afterEach')
  })
  afterAll(() => {
    console.log('afterAll')
  })

  // 测试加法代码
  describe('test add code', () => {
    // 内层钩子函数只对内层 describe生效
    beforeEach(() => {
      console.log('add beforeEach')
    })
    afterEach(() => {
      console.log('add afterEach')
    })

    test('test addOne', () => {
      console.log('test addOne')
      counter.addOne()
      expect(counter.number).toBe(1)
    })
    test('test addTwo', () => {
      console.log('test addTwo')
      counter.addTwo()
      expect(counter.number).toBe(2)
    })
  })

  //测试减法代码
  describe('test minus code', () => {
    test('test minusOne', () => {
      console.log('test minusOne')
      counter.addOne()
      expect(counter.number).toBe(1)
    })
  })
})
