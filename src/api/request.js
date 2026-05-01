const BASE_URL = ''
const TIMEOUT = 10000

class Request {
  constructor() {
    this.baseURL = BASE_URL
    this.timeout = TIMEOUT
  }

  interceptors(config) {
    return config
  }

  async request(options) {
    const config = this.interceptors({
      url: this.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      params: options.params || {},
      ...options
    })

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: config.method !== 'GET' ? JSON.stringify(config.data) : undefined
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return this.handleResponse(result)
    } catch (error) {
      return this.handleError(error)
    }
  }

  handleResponse(response) {
    if (response.code === 200 || response.success) {
      return {
        success: true,
        data: response.data || response,
        message: response.message || '请求成功'
      }
    }
    return {
      success: false,
      data: null,
      message: response.message || '请求失败'
    }
  }

  handleError(error) {
    console.error('Request error:', error)
    return {
      success: false,
      data: null,
      message: error.message || '网络错误，请稍后重试'
    }
  }

  get(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      params,
      ...options
    })
  }

  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }
}

export const request = new Request()

export default request
