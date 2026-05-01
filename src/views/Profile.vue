<template>
  <div class="profile-page">
    <div class="user-header">
      <div class="user-avatar" v-if="userStore.isLoggedIn">
        {{ userStore.userInfo.userName.charAt(0) }}
      </div>
      <div class="user-avatar guest" v-else @click="userStore.openLoginModal">
        👤
      </div>
      
      <div class="user-info" v-if="userStore.isLoggedIn">
        <div class="user-name">{{ userStore.userInfo.userName }}</div>
        <div class="user-status">🎵 音乐爱好者</div>
      </div>
      <div class="user-info" v-else @click="userStore.openLoginModal">
        <div class="user-name guest-name">点击登录</div>
        <div class="user-status guest-status">登录后享受更多功能</div>
      </div>
      
      <div class="user-action" v-if="userStore.isLoggedIn" @click="showLogoutConfirm = true">
        <span class="action-icon">🚪</span>
      </div>
    </div>
    
    <div class="stats-section" v-if="userStore.isLoggedIn">
      <div class="stat-item" @click="goToFavorites">
        <div class="stat-value">{{ dataStore.favorites.length }}</div>
        <div class="stat-label">收藏</div>
      </div>
      <div class="stat-item" @click="goToHistory">
        <div class="stat-value">{{ dataStore.browsingHistory.length }}</div>
        <div class="stat-label">浏览</div>
      </div>
    </div>
    
    <div class="menu-section">
      <div class="menu-title">功能菜单</div>
      
      <div class="menu-list">
        <div class="menu-item" @click="goToFavorites">
          <span class="menu-icon">❤️</span>
          <span class="menu-text">我的收藏</span>
          <span class="menu-arrow">›</span>
        </div>
        
        <div class="menu-item" @click="goToHistory">
          <span class="menu-icon">📖</span>
          <span class="menu-text">浏览历史</span>
          <span class="menu-arrow">›</span>
        </div>
        
        <div class="menu-item" @click="goToSettings">
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">系统设置</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>
    </div>
    
    <div class="menu-section">
      <div class="menu-title">更多</div>
      
      <div class="menu-list">
        <div class="menu-item" @click="handleFeedback">
          <span class="menu-icon">📧</span>
          <span class="menu-text">意见反馈</span>
          <span class="menu-arrow">›</span>
        </div>
        
        <div class="menu-item" @click="handleAbout">
          <span class="menu-icon">ℹ️</span>
          <span class="menu-text">关于我们</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>
    </div>
    
    <div class="footer-section">
      <div class="footer-text">🎵 乐器入门科普站 v1.0.0</div>
      <div class="footer-subtitle">让音乐学习更简单</div>
    </div>
    
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showLogoutConfirm" class="confirm-mask" @click="showLogoutConfirm = false">
          <div class="confirm-dialog" @click.stop>
            <div class="confirm-title">退出登录</div>
            <div class="confirm-content">确定要退出登录吗？</div>
            <div class="confirm-actions">
              <button class="confirm-btn cancel" @click="showLogoutConfirm = false">
                取消
              </button>
              <button class="confirm-btn confirm" @click="handleLogout">
                退出登录
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showFeedbackModal" class="feedback-mask" @click="showFeedbackModal = false">
          <div class="feedback-dialog" @click.stop>
            <div class="feedback-header">
              <div class="feedback-title">📧 意见反馈</div>
              <div class="feedback-close" @click="showFeedbackModal = false">✕</div>
            </div>
            <div class="feedback-body">
              <p class="feedback-info">您的反馈对我们非常重要！</p>
              <p class="feedback-detail">如果您在使用过程中遇到任何问题，或者有任何建议和想法，请通过以下方式联系我们：</p>
              <div class="feedback-contact">
                <div class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span class="contact-text">feedback@music-instrument.com</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">💬</span>
                  <span class="contact-text">欢迎在应用商店评论留言</span>
                </div>
              </div>
            </div>
            <div class="feedback-footer">
              <button class="feedback-btn" @click="showFeedbackModal = false">
                我知道了
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showAboutModal" class="about-mask" @click="showAboutModal = false">
          <div class="about-dialog" @click.stop>
            <div class="about-header">
              <div class="about-title">ℹ️ 关于我们</div>
              <div class="about-close" @click="showAboutModal = false">✕</div>
            </div>
            <div class="about-body">
              <div class="about-logo">🎵</div>
              <div class="about-name">乐器入门科普站</div>
              <div class="about-version">版本 v1.0.0</div>
              <div class="about-divider"></div>
              <div class="about-content">
                <p class="about-text">乐器入门科普站致力于为音乐爱好者提供专业、易懂的乐器入门知识。</p>
                <p class="about-text">我们精选了各类热门和冷门乐器，包含详细的介绍、音色特点、入门优缺点分析以及新手入门教程，帮助您选择最适合自己的乐器。</p>
              </div>
              <div class="about-footer-text">
                让音乐学习更简单，让每个人都能享受音乐的乐趣。
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const userStore = useUserStore()
const dataStore = useDataStore()

const showLogoutConfirm = ref(false)
const showFeedbackModal = ref(false)
const showAboutModal = ref(false)

function goToFavorites() {
  router.push('/favorites')
}

function goToHistory() {
  router.push('/history')
}

function goToSettings() {
  router.push('/settings')
}

async function handleLogout() {
  await userStore.logout()
  showLogoutConfirm.value = false
}

function handleFeedback() {
  showFeedbackModal.value = true
}

function handleAbout() {
  showAboutModal.value = true
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-bottom: var(--tabbar-height);
}

.user-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
}

.user-avatar {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  font-size: var(--font-size-xxl);
  font-weight: 600;
  color: var(--primary-color);
  margin-right: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar.guest {
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.user-info {
  flex: 1;
  cursor: pointer;
}

.user-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: var(--spacing-xs);
}

.user-name.guest-name {
  opacity: 0.9;
}

.user-status {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.user-status.guest-status {
  opacity: 0.7;
}

.user-action {
  padding: var(--spacing-sm);
  cursor: pointer;
}

.action-icon {
  font-size: 20px;
  opacity: 0.8;
}

.stats-section {
  display: flex;
  background-color: var(--bg-card);
  margin: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 8px var(--shadow-color);
  overflow: hidden;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.stat-item:first-child {
  border-right: 1px solid var(--border-color);
}

.stat-item:active {
  background-color: var(--bg-secondary);
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.menu-section {
  background-color: var(--bg-card);
  margin-bottom: var(--spacing-lg);
}

.menu-title {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  padding: var(--spacing-md) var(--spacing-lg);
  padding-bottom: var(--spacing-xs);
}

.menu-list {
  padding: 0 var(--spacing-lg);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  opacity: 0.7;
}

.menu-icon {
  font-size: 20px;
  margin-right: var(--spacing-md);
}

.menu-text {
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.menu-arrow {
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .confirm-dialog,
.modal-leave-to .confirm-dialog {
  transform: scale(0.9);
  opacity: 0;
}

.feedback-mask,
.about-mask {
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

.feedback-dialog,
.about-dialog {
  width: 100%;
  max-width: 360px;
  background-color: var(--bg-card);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
}

.feedback-header,
.about-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.feedback-title,
.about-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.feedback-close,
.about-close {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--spacing-xs);
}

.feedback-body,
.about-body {
  padding: var(--spacing-lg);
}

.feedback-info {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.feedback-detail {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.feedback-contact {
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-icon {
  font-size: 16px;
  margin-right: var(--spacing-sm);
}

.contact-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.feedback-footer {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
}

.feedback-btn {
  width: 100%;
  height: 44px;
  background-color: var(--primary-color);
  color: var(--text-light);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.feedback-btn:active {
  background-color: var(--primary-dark);
}

.about-logo {
  font-size: 48px;
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.about-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.about-version {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.about-divider {
  height: 1px;
  background-color: var(--border-color);
  margin-bottom: var(--spacing-md);
}

.about-content {
  margin-bottom: var(--spacing-md);
}

.about-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
}

.about-text:last-child {
  margin-bottom: 0;
}

.about-footer-text {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-align: center;
  font-style: italic;
}

.modal-enter-from .feedback-dialog,
.modal-leave-to .feedback-dialog,
.modal-enter-from .about-dialog,
.modal-leave-to .about-dialog {
  transform: scale(0.9);
  opacity: 0;
}
</style>
