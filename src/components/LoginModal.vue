<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="userStore.showLoginModal" class="modal-mask" @click="handleMaskClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-title">
              {{ isRegister ? '注册账号' : '登录账号' }}
            </div>
            <div class="modal-close" @click="userStore.closeLoginModal">✕</div>
          </div>
          
          <div class="modal-body">
            <div class="form-item">
              <label class="form-label">用户名</label>
              <input 
                v-model="formData.userName" 
                type="text" 
                class="form-input"
                placeholder="请输入用户名"
              />
            </div>
            
            <div class="form-item">
              <label class="form-label">密码</label>
              <input 
                v-model="formData.password" 
                type="password" 
                class="form-input"
                placeholder="请输入密码"
              />
            </div>
            
            <div v-if="isRegister" class="form-item">
              <label class="form-label">确认密码</label>
              <input 
                v-model="formData.confirmPassword" 
                type="password" 
                class="form-input"
                placeholder="请再次输入密码"
              />
            </div>
            
            <div class="form-tip">
              测试账号：音乐爱好者 / 密码：123456
            </div>
            
            <div v-if="errorMessage" class="form-error">
              {{ errorMessage }}
            </div>
            
            <button class="btn btn-primary btn-full" @click="handleSubmit" :disabled="loading">
              {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
            </button>
            
            <div class="form-switch">
              <span>{{ isRegister ? '已有账号？' : '还没有账号？' }}</span>
              <span class="switch-link" @click="toggleMode">
                {{ isRegister ? '立即登录' : '立即注册' }}
              </span>
            </div>
          </div>
          
          <div class="modal-divider">
            <span>或者</span>
          </div>
          
          <div class="modal-footer">
            <div class="guest-tip">
              🎵 游客可以浏览所有内容，收藏和评论需要登录
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isRegister = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const formData = reactive({
  userName: '',
  password: '',
  confirmPassword: ''
})

watch(() => userStore.showLoginModal, (val) => {
  if (!val) {
    errorMessage.value = ''
    formData.userName = ''
    formData.password = ''
    formData.confirmPassword = ''
  }
})

function toggleMode() {
  isRegister.value = !isRegister.value
  errorMessage.value = ''
  formData.confirmPassword = ''
}

function handleMaskClick() {
  userStore.closeLoginModal()
}

async function handleSubmit() {
  errorMessage.value = ''
  
  if (!formData.userName.trim()) {
    errorMessage.value = '请输入用户名'
    return
  }
  
  if (!formData.password) {
    errorMessage.value = '请输入密码'
    return
  }
  
  if (formData.password.length < 6) {
    errorMessage.value = '密码至少6位'
    return
  }
  
  if (isRegister.value && formData.password !== formData.confirmPassword) {
    errorMessage.value = '两次密码输入不一致'
    return
  }
  
  loading.value = true
  
  try {
    let result
    if (isRegister.value) {
      result = await userStore.register(formData.userName, formData.password)
    } else {
      result = await userStore.login(formData.userName, formData.password)
    }
    
    if (!result.success) {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '操作失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--bg-card);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-sm);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.modal-close:active {
  background-color: var(--bg-secondary);
}

.modal-body {
  padding: var(--spacing-md) var(--spacing-lg);
}

.form-item {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  border: 1px solid transparent;
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  border-color: var(--primary-color);
  background-color: var(--bg-card);
}

.form-tip {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: center;
  padding: var(--spacing-sm);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-md);
}

.form-error {
  font-size: var(--font-size-sm);
  color: #e53935;
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.btn-full {
  width: 100%;
  height: 46px;
  font-size: var(--font-size-md);
  border-radius: var(--border-radius-md);
}

.btn-full:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-switch {
  text-align: center;
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.switch-link {
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  margin-left: var(--spacing-xs);
}

.modal-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-sm) var(--spacing-lg);
}

.modal-divider::before,
.modal-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.modal-divider span {
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.modal-footer {
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-lg);
}

.guest-tip {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-align: center;
  line-height: 1.5;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}
</style>
