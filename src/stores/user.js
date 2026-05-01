import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    id: 0,
    userName: '游客',
    avatar: '',
    isLoggedIn: false
  })
  
  const token = ref('')
  const showLoginModal = ref(false)

  const isLoggedIn = computed(() => userInfo.value.isLoggedIn)

  function initFromStorage() {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      userInfo.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  async function login(userName, password) {
    const result = await userApi.login({ userName, password })
    
    if (result.success) {
      userInfo.value = {
        ...result.data.user,
        isLoggedIn: true
      }
      token.value = result.data.token
      
      localStorage.setItem('user', JSON.stringify(userInfo.value))
      localStorage.setItem('token', token.value)
      
      showLoginModal.value = false
    }
    
    return result
  }

  async function register(userName, password, email) {
    const result = await userApi.register({ userName, password, email })
    
    if (result.success) {
      userInfo.value = {
        ...result.data.user,
        isLoggedIn: true
      }
      token.value = result.data.token
      
      localStorage.setItem('user', JSON.stringify(userInfo.value))
      localStorage.setItem('token', token.value)
      
      showLoginModal.value = false
    }
    
    return result
  }

  async function logout() {
    await userApi.logout()
    
    userInfo.value = {
      id: 0,
      userName: '游客',
      avatar: '',
      isLoggedIn: false
    }
    token.value = ''
    
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  function openLoginModal() {
    showLoginModal.value = true
  }

  function closeLoginModal() {
    showLoginModal.value = false
  }

  function checkLogin() {
    if (!isLoggedIn.value) {
      openLoginModal()
      return false
    }
    return true
  }

  return {
    userInfo,
    token,
    showLoginModal,
    isLoggedIn,
    initFromStorage,
    login,
    register,
    logout,
    openLoginModal,
    closeLoginModal,
    checkLogin
  }
})
