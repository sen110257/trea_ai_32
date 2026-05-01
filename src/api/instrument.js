import { instruments, categories, hotInstruments, comments } from '@/data/mockData'

class InstrumentApi {
  constructor() {
    this.useMock = true
  }

  async getCategories() {
    if (this.useMock) {
      await this.simulateDelay()
      return {
        success: true,
        data: categories,
        message: '获取分类成功'
      }
    }

    return request.get('/api/instruments/categories')
  }

  async getHotInstruments() {
    if (this.useMock) {
      await this.simulateDelay()
      const hotList = hotInstruments.map(id => 
        instruments.find(item => item.id === id)
      ).filter(Boolean)
      return {
        success: true,
        data: hotList,
        message: '获取热门乐器成功'
      }
    }

    return request.get('/api/instruments/hot')
  }

  async getInstruments(params = {}) {
    if (this.useMock) {
      await this.simulateDelay(300)
      
      let result = [...instruments]
      
      if (params.category && params.category !== 'all') {
        result = result.filter(item => item.category === params.category)
      }
      
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        result = result.filter(item => 
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.suitableFor.some(tag => tag.toLowerCase().includes(keyword))
        )
      }
      
      if (params.sort) {
        switch (params.sort) {
          case 'hot':
            result.sort((a, b) => b.popularity - a.popularity)
            break
          case 'beginner':
            result.sort((a, b) => {
              const order = { easy: 1, medium: 2, hard: 3 }
              return order[a.difficulty] - order[b.difficulty]
            })
            break
          case 'friendly':
            result.sort((a, b) => {
              const order = { easy: 1, medium: 2, hard: 3 }
              return order[a.difficulty] - order[b.difficulty]
            })
            break
        }
      }
      
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedResult = result.slice(start, end)
      
      return {
        success: true,
        data: {
          list: paginatedResult,
          total: result.length,
          page,
          pageSize,
          hasMore: end < result.length
        },
        message: '获取乐器列表成功'
      }
    }

    return request.get('/api/instruments', params)
  }

  async getInstrumentDetail(id) {
    if (this.useMock) {
      await this.simulateDelay()
      
      const instrument = instruments.find(item => item.id === parseInt(id))
      
      if (!instrument) {
        return {
          success: false,
          data: null,
          message: '乐器不存在'
        }
      }
      
      return {
        success: true,
        data: instrument,
        message: '获取乐器详情成功'
      }
    }

    return request.get(`/api/instruments/${id}`)
  }

  async getComments(instrumentId, params = {}) {
    if (this.useMock) {
      await this.simulateDelay()
      
      let result = comments.filter(item => item.instrumentId === parseInt(instrumentId))
      
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedResult = result.slice(start, end)
      
      return {
        success: true,
        data: {
          list: paginatedResult,
          total: result.length,
          page,
          pageSize,
          hasMore: end < result.length
        },
        message: '获取评论列表成功'
      }
    }

    return request.get(`/api/instruments/${instrumentId}/comments`, params)
  }

  async addComment(instrumentId, data) {
    if (this.useMock) {
      await this.simulateDelay(500)
      
      const newComment = {
        id: comments.length + 1,
        instrumentId: parseInt(instrumentId),
        userId: data.userId || 1,
        userName: data.userName || '匿名用户',
        userAvatar: data.userAvatar || '',
        content: data.content,
        rating: data.rating || 5,
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-'),
        likes: 0
      }
      
      comments.unshift(newComment)
      
      return {
        success: true,
        data: newComment,
        message: '评论发布成功'
      }
    }

    return request.post(`/api/instruments/${instrumentId}/comments`, data)
  }

  async likeComment(commentId) {
    if (this.useMock) {
      await this.simulateDelay()
      
      const comment = comments.find(item => item.id === parseInt(commentId))
      if (comment) {
        comment.likes += 1
      }
      
      return {
        success: true,
        data: null,
        message: '点赞成功'
      }
    }

    return request.post(`/api/comments/${commentId}/like`)
  }

  simulateDelay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const instrumentApi = new InstrumentApi()

export default instrumentApi
