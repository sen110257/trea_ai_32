import { mockUsers, defaultUser } from '@/data/mockData'

class UserApi {
  constructor() {
    this.useMock = true
  }

  async login(data) {
    if (this.useMock) {
      await this.simulateDelay(500)
      
      const user = mockUsers.find(u => 
        u.userName === data.userName && u.password === data.password
      )
      
      if (user) {
        const token = `token_${Date.now()}`
        return {
          success: true,
          data: {
            user: {
              id: user.id,
              userName: user.userName,
              avatar: user.avatar
            },
            token
          },
          message: '登录成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '用户名或密码错误'
      }
    }

    return request.post('/api/user/login', data)
  }

  async register(data) {
    if (this.useMock) {
      await this.simulateDelay(500)
      
      const exists = mockUsers.find(u => u.userName === data.userName)
      if (exists) {
        return {
          success: false,
          data: null,
          message: '用户名已存在'
        }
      }
      
      const newUser = {
        id: mockUsers.length + 1,
        userName: data.userName,
        password: data.password,
        email: data.email || '',
        avatar: ''
      }
      
      mockUsers.push(newUser)
      
      const token = `token_${Date.now()}`
      
      return {
        success: true,
        data: {
          user: {
            id: newUser.id,
            userName: newUser.userName,
            avatar: newUser.avatar
          },
          token
        },
        message: '注册成功'
      }
    }

    return request.post('/api/user/register', data)
  }

  async logout() {
    if (this.useMock) {
      await this.simulateDelay()
      return {
        success: true,
        data: null,
        message: '退出成功'
      }
    }

    return request.post('/api/user/logout')
  }

  async getUserInfo() {
    if (this.useMock) {
      await this.simulateDelay()
      
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        return {
          success: true,
          data: user,
          message: '获取用户信息成功'
        }
      }
      
      return {
        success: false,
        data: defaultUser,
        message: '用户未登录'
      }
    }

    return request.get('/api/user/info')
  }

  async updateUserInfo(data) {
    if (this.useMock) {
      await this.simulateDelay()
      return {
        success: true,
        data: data,
        message: '更新成功'
      }
    }

    return request.put('/api/user/info', data)
  }

  simulateDelay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const userApi = new UserApi()

export default userApi
