<template>
  <div class="favorites-page">
    <div class="page-header">
      <div class="header-title">我的收藏</div>
      <div 
        v-if="favoritesStore.favorites.length > 0" 
        class="header-action"
        @click="showClearConfirm = true"
      >
        编辑
      </div>
    </div>
    
    <div v-if="!userStore.isLoggedIn" class="login-required">
      <div class="required-icon">🔒</div>
      <div class="required-title">登录后查看收藏</div>
      <div class="required-desc">登录后可以收藏喜欢的乐器，方便随时学习</div>
      <button class="btn btn-primary" @click="userStore.openLoginModal">
        立即登录
      </button>
    </div>
    
    <template v-else>
      <div v-if="favoritesStore.favorites.length > 0" class="favorites-list">
        <div 
          v-for="item in favoritesStore.favorites" 
          :key="item.id"
          class="favorite-item"
        >
          <div class="item-content" @click="goToDetail(item.id)">
            <img 
              :src="item.image" 
              :alt="item.name"
              class="item-image"
            />
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-tags">
                <span class="small-tag" :class="getDifficultyClass(item.difficulty)">
                  {{ item.difficultyLabel }}
                </span>
                <span class="small-tag">
                  {{ getCategoryName(item.category) }}
                </span>
              </div>
            </div>
          </div>
          <div class="item-action" @click="removeFavorite(item.id)">
            <span class="action-icon">🗑️</span>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">🤍</div>
        <div class="empty-title">暂无收藏</div>
        <div class="empty-desc">去首页逛逛，发现喜欢的乐器吧~</div>
        <button class="btn btn-primary" @click="goHome">
          去首页
        </button>
      </div>
    </template>
    
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showClearConfirm" class="confirm-mask" @click="showClearConfirm = false">
          <div class="confirm-dialog" @click.stop>
            <div class="confirm-title">清空收藏</div>
            <div class="confirm-content">确定要清空所有收藏的乐器吗？</div>
            <div class="confirm-actions">
              <button class="confirm-btn cancel" @click="showClearConfirm = false">
                取消
              </button>
              <button class="confirm-btn confirm" @click="clearAllFavorites">
                确定清空
              </button>
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
import { useDataStore } from '@/stores/data'
import { useUserStore } from '@/stores/user'
import { categories } from '@/data/mockData'

const router = useRouter()
const favoritesStore = useDataStore()
const userStore = useUserStore()

const showClearConfirm = ref(false)

function getDifficultyClass(difficulty) {
  switch (difficulty) {
    case 'easy':
      return 'tag-level-easy'
    case 'medium':
      return 'tag-level-medium'
    case 'hard':
      return 'tag-level-hard'
    default:
      return 'tag-primary'
  }
}

function getCategoryName(categoryId) {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : '其他'
}

function goToDetail(id) {
  router.push(`/instrument/${id}`)
}

function goHome() {
  router.push('/')
}

function removeFavorite(id) {
  favoritesStore.removeFavorite(id)
}

function clearAllFavorites() {
  favoritesStore.clearFavorites()
  showClearConfirm.value = false
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  background-color: var(--bg-card);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.header-title {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  color: var(--text-primary);
}

.header-action {
  font-size: var(--font-size-md);
  color: var(--primary-color);
  cursor: pointer;
  padding: var(--spacing-xs);
}

.login-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) * 2;
}

.required-icon {
  font-size: 56px;
  margin-bottom: var(--spacing-lg);
}

.required-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.required-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.favorites-list {
  padding: var(--spacing-md);
}

.favorite-item {
  display: flex;
  align-items: center;
  background-color: var(--bg-card);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.favorite-item:active {
  transform: scale(0.98);
}

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  margin-right: var(--spacing-md);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.item-tags {
  display: flex;
  gap: var(--spacing-xs);
}

.small-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

.small-tag.tag-level-easy {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.small-tag.tag-level-medium {
  background-color: #fff3e0;
  color: #ef6c00;
}

.small-tag.tag-level-hard {
  background-color: #ffebee;
  color: #c62828;
}

.item-action {
  padding: var(--spacing-sm);
  cursor: pointer;
}

.action-icon {
  font-size: 18px;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.item-action:active .action-icon {
  opacity: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) * 2;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-desc {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
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
</style>
