<template>
  <div class="settings-page">
    <div class="page-header">
      <div class="header-back" @click="goBack">←</div>
      <div class="header-title">系统设置</div>
      <div class="header-placeholder"></div>
    </div>
    
    <div class="settings-section">
      <div class="settings-title">通用设置</div>
      
      <div class="settings-list">
        <div class="settings-item">
          <span class="settings-text">深色模式</span>
          <div class="settings-switch" :class="{ active: darkMode }" @click="toggleDarkMode">
            <div class="switch-dot"></div>
          </div>
        </div>
        
        <div class="settings-item">
          <span class="settings-text">推送通知</span>
          <div class="settings-switch" :class="{ active: pushNotification }" @click="togglePushNotification">
            <div class="switch-dot"></div>
          </div>
        </div>
        
        <div class="settings-item" @click="showLanguagePicker = true">
          <span class="settings-text">语言</span>
          <div class="settings-value">
            <span class="value-text">{{ languageLabel }}</span>
            <span class="value-arrow">›</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <div class="settings-title">数据管理</div>
      
      <div class="settings-list">
        <div class="settings-item" @click="handleClearCache">
          <span class="settings-text">清除缓存</span>
          <div class="settings-value">
            <span class="value-text">{{ cacheSize }}</span>
            <span class="value-arrow">›</span>
          </div>
        </div>
        
        <div class="settings-item" @click="showClearDataConfirm = true">
          <span class="settings-text">清除本地数据</span>
          <span class="value-arrow">›</span>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <div class="settings-title">关于</div>
      
      <div class="settings-list">
        <div class="settings-item">
          <span class="settings-text">版本号</span>
          <span class="version-text">v1.0.0</span>
        </div>
        
        <div class="settings-item">
          <span class="settings-text">检查更新</span>
          <span class="value-arrow">›</span>
        </div>
        
        <div class="settings-item">
          <span class="settings-text">用户协议</span>
          <span class="value-arrow">›</span>
        </div>
        
        <div class="settings-item">
          <span class="settings-text">隐私政策</span>
          <span class="value-arrow">›</span>
        </div>
      </div>
    </div>
    
    <div class="footer-section">
      <div class="footer-text">🎵 乐器入门科普站</div>
      <div class="footer-subtitle">让音乐学习更简单</div>
    </div>
    
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showLanguagePicker" class="picker-mask" @click="showLanguagePicker = false">
          <div class="picker-dialog" @click.stop>
            <div class="picker-header">
              <span class="picker-title">选择语言</span>
              <span class="picker-close" @click="showLanguagePicker = false">完成</span>
            </div>
            <div class="picker-list">
              <div 
                v-for="lang in languages" 
                :key="lang.value"
                class="picker-item"
                :class="{ active: language === lang.value }"
                @click="selectLanguage(lang.value)"
              >
                <span class="picker-item-text">{{ lang.label }}</span>
                <span class="picker-item-check" v-if="language === lang.value">✓</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showClearDataConfirm" class="confirm-mask" @click="showClearDataConfirm = false">
          <div class="confirm-dialog" @click.stop>
            <div class="confirm-title">清除数据</div>
            <div class="confirm-content">确定要清除所有本地数据吗？收藏、浏览记录等将被清空。</div>
            <div class="confirm-actions">
              <button class="confirm-btn cancel" @click="showClearDataConfirm = false">
                取消
              </button>
              <button class="confirm-btn confirm" @click="clearAllData">
                确定清除
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    
    <Teleport to="body">
      <transition name="toast">
        <div v-if="showToast" class="toast">{{ toastMessage }}</div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const dataStore = useDataStore()

const darkMode = ref(false)
const pushNotification = ref(true)
const language = ref('zh-CN')

const showLanguagePicker = ref(false)
const showClearDataConfirm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const languages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en' }
]

const cacheSize = ref('0.0 MB')

const languageLabel = computed(() => {
  const lang = languages.find(l => l.value === language.value)
  return lang ? lang.label : '简体中文'
})

function goBack() {
  router.back()
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  showToastMessage(darkMode.value ? '已开启深色模式' : '已关闭深色模式')
}

function togglePushNotification() {
  pushNotification.value = !pushNotification.value
  showToastMessage(pushNotification.value ? '已开启推送通知' : '已关闭推送通知')
}

function selectLanguage(lang) {
  language.value = lang
  showLanguagePicker.value = false
  showToastMessage('语言已切换')
}

function handleClearCache() {
  cacheSize.value = '0.0 MB'
  showToastMessage('缓存已清除')
}

function clearAllData() {
  dataStore.clearFavorites()
  dataStore.clearBrowsingHistory()
  localStorage.clear()
  showClearDataConfirm.value = false
  showToastMessage('本地数据已清除')
}

function showToastMessage(message) {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

onMounted(() => {
  cacheSize.value = '0.8 MB'
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-card);
  box-shadow: 0 2px 8px var(--shadow-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-back {
  font-size: var(--font-size-xl);
  cursor: pointer;
  padding: var(--spacing-xs);
  color: var(--text-primary);
}

.header-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.header-placeholder {
  width: 32px;
}

.settings-section {
  background-color: var(--bg-card);
  margin-bottom: var(--spacing-lg);
}

.settings-title {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--spacing-md) var(--spacing-lg);
  padding-bottom: var(--spacing-xs);
}

.settings-list {
  padding: 0 var(--spacing-lg);
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-text {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.version-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.settings-switch {
  position: relative;
  width: 48px;
  height: 28px;
  background-color: var(--border-color);
  border-radius: 14px;
  transition: background-color var(--transition-fast);
  cursor: pointer;
}

.settings-switch.active {
  background-color: var(--primary-color);
}

.switch-dot {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background-color: var(--bg-card);
  border-radius: 50%;
  transition: transform var(--transition-fast);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.settings-switch.active .switch-dot {
  transform: translateX(20px);
}

.settings-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.value-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.value-arrow {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
}

.footer-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
}

.footer-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  opacity: 0.7;
}

.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.picker-dialog {
  width: 100%;
  background-color: var(--bg-card);
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
  max-height: 60vh;
  overflow: hidden;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.picker-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
}

.picker-close {
  font-size: var(--font-size-md);
  color: var(--primary-color);
  cursor: pointer;
  padding: var(--spacing-xs);
}

.picker-list {
  max-height: 50vh;
  overflow-y: auto;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.picker-item:active {
  background-color: var(--bg-secondary);
}

.picker-item:last-child {
  border-bottom: none;
}

.picker-item-text {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.picker-item.active .picker-item-text {
  color: var(--primary-color);
  font-weight: 500;
}

.picker-item-check {
  font-size: var(--font-size-md);
  color: var(--primary-color);
}

.confirm-mask {
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

.confirm-dialog {
  width: 100%;
  max-width: 320px;
  background-color: var(--bg-card);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
}

.confirm-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-sm);
}

.confirm-content {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-align: center;
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  border-top: 1px solid var(--border-color);
}

.confirm-btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.confirm-btn.cancel {
  color: var(--text-secondary);
  border-right: 1px solid var(--border-color);
}

.confirm-btn.confirm {
  color: #e53935;
  font-weight: 500;
}

.confirm-btn:active {
  background-color: var(--bg-secondary);
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: var(--text-light);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  z-index: 2000;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .picker-dialog,
.modal-leave-to .picker-dialog {
  transform: translateY(100%);
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.9);
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}
</style>
