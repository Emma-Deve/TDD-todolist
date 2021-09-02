import * as ReactDOM from 'react-dom'
import React from 'react'
import Login from './login'
import { LoginService } from '../api/getLogin'
import { fireEvent } from '@testing-library/dom'
import { waitForElement } from '@testing-library/dom'

describe('Login component tests', () => {
  // 定义一个HTML元素容器：container
  let container: HTMLDivElement
  // 用spyOn模拟一个mocking function测试LoginService是否发送了axios请求，不需要测试真实的async函数
  const loginServiceSpy = jest.spyOn(LoginService.prototype, 'login')

  // 钩子函数： 创建container容器，每一个测试用例之前执行
  beforeEach(() => {
    container = document.createElement('div') // 将div元素存放在container中
    document.body.appendChild(container)
    ReactDOM.render(<Login />, container) // 将login组件放在容器container中
  })
  // 钩子函数：清除container容器，每个测试用例执行后执行
  afterEach(() => {
    document.body.removeChild(container)
    container.remove()
  })

  // 测试初始文档方法一: 1个input，2个label
  it('Render correctly initial document', () => {
    const inputs = container.querySelectorAll('input')
    expect(inputs).toHaveLength(3) // 3 inputs element
    expect(inputs[0].name).toBe('username')
    expect(inputs[1].name).toBe('password')
    expect(inputs[2].value).toBe('login')
    // 初次渲染 label不存在
    const label = container.querySelector('label')
    expect(label).not.toBeInTheDocument()
  })

  // 测试初始文档方法二: 用data-test标签测试
  it('Render correctly initial document with data-test query', () => {
    expect(
      // 存在login-form
      container.querySelector("[data-test ='login-form']")
    ).toBeInTheDocument()
    // 存在username-input, 并且name = username
    expect(
      container
        .querySelector("[data-test ='username-input']")
        ?.getAttribute('name')
    ).toBe('username')
    // 存在password-input, 并且name = password
    expect(
      container
        .querySelector("[data-test ='password-input']")
        ?.getAttribute('name')
    ).toBe('password')
    // 存在password-input, 并且value = login
    expect(
      container
        .querySelector("[data-test ='submit-button']")
        ?.getAttribute('value')
    ).toBe('login')
  })

  // 测试handler函数/async函数传值是否正确
  it('Passes credentials correctly', () => {
    // 找到3个input element
    const inputs = container.querySelectorAll('input')
    const loginInput = inputs[0]
    const passwordInput = inputs[1]
    const loginButton = inputs[2]
    // 测试LoginService函数是否执行: 出发loginButton，检测LoginService是否被调用,fireEvent(react-testing-library)
    fireEvent.change(loginInput, { target: { value: 'Tom' } }) // 行为：改变loginInput里的值为’TOM'
    fireEvent.change(passwordInput, { target: { value: '123456' } }) // 行为：改变passwordInput里的值为’123456'
    fireEvent.click(loginButton) // 行为：点击button
    expect(loginServiceSpy).toBeCalledWith('Tom', '123456') // 将上面行为得到的username和password传递给LoginService
  })

  // 测试label是否渲染正确: 点击login，不执行异步mock函数，label渲染为 failed
  it('Renders correctly status label - invalid login', async () => {
    loginServiceSpy.mockResolvedValueOnce(false) // 不执行mock函数（不发送请求）

    const inputs = container.querySelectorAll('input')
    const loginButton = inputs[2]
    fireEvent.click(loginButton) // 点击loginButton
    const statusLabel = await waitForElement(() =>
      container.querySelector('label')
    ) // label是异步函数调用后才出现的
    expect(statusLabel).toBeInTheDocument() // 测试label是否被渲染
    expect(statusLabel).toHaveTextContent('Login failed') // 测试label的值（没发送数据请求，所以login failed)
  })

  // 测试label是否渲染正确: 点击login，执行异步mock函数，label渲染为 successful
  it('Renders correctly status label - invalid login', async () => {
    loginServiceSpy.mockResolvedValueOnce(true) // 执行mock函数（不发送请求）

    const inputs = container.querySelectorAll('input')
    const loginButton = inputs[2]
    fireEvent.click(loginButton) // 点击loginButton
    const statusLabel = await waitForElement(() =>
      container.querySelector('label')
    ) // label是异步函数调用后才出现的
    expect(statusLabel).toBeInTheDocument() // 测试label是否被渲染
    expect(statusLabel).toHaveTextContent('Login successful') // 测试label的值
  })
})
