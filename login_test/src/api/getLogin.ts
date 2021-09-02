import * as axios from 'axios'

axios.default.defaults.validateStatus = function () {
  return true
}

interface User {
  username: string
  password: string
}

const serverUrl = 'https://f6f7786e-7fcc-4f1f-aee4-97c3664d8cdf.mock.pstmn.io'

export class LoginService {
  public async login(userName: string, password: string): Promise<boolean> {
    try {
      const loginResponse = await axios.default.post(serverUrl + '/login', {
        username: userName,
        password: password
      })
      if (loginResponse.status === 200) return true
      else return false
    } catch (error) {
      return false
    }
  }
}
