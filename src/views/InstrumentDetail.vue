<template>
  <div class="detail-page" ref="pageContainer">
    <div class="detail-header" :class="{ 'header-scrolled': isScrolled }">
      <div class="header-back" @click="goBack">←</div>
      <div class="header-title" v-if="isScrolled">{{ instrument?.name }}</div>
      <div class="header-actions">
        <div class="header-action" @click="toggleFavorite">
          {{ isFavorited ? '❤️' : '🤍' }}
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>
    
    <template v-else-if="instrument">
      <div class="detail-hero">
        <img 
          :src="instrument.image" 
          :alt="instrument.name"
          class="hero-image"
          @error="handleImageError"
        />
        <div class="hero-overlay">
          <div class="hero-info">
            <h1 class="hero-title">{{ instrument.name }}</h1>
            <div class="hero-tags">
              <span class="tag" :class="getDifficultyClass()">
                {{ instrument.difficultyLabel }}
              </span>
              <span 
                v-for="tag in instrument.suitableFor" 
                :key="tag"
                class="tag tag-primary"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-content">
        <div class="section-card">
          <div class="section-card-header">
            <span class="section-icon">📖</span>
            <span class="section-title">乐器基础介绍</span>
          </div>
          <div class="section-card-body">
            <p class="description-text">{{ instrument.description }}</p>
            
            <div class="info-block" v-if="instrument.introduction.history">
              <div class="info-title">历史渊源</div>
              <p class="info-text">{{ instrument.introduction.history }}</p>
            </div>
            
            <div class="info-block" v-if="instrument.introduction.structure">
              <div class="info-title">结构组成</div>
              <p class="info-text">{{ instrument.introduction.structure }}</p>
            </div>
            
            <div class="info-block" v-if="instrument.introduction.types">
              <div class="info-title">主要类型</div>
              <p class="info-text">{{ instrument.introduction.types }}</p>
            </div>
          </div>
        </div>
        
        <div class="section-card">
          <div class="section-card-header">
            <span class="section-icon">🎵</span>
            <span class="section-title">音色特点讲解</span>
          </div>
          <div class="section-card-body">
            <p class="description-text" v-if="instrument.tone.description">
              {{ instrument.tone.description }}
            </p>
            
            <div class="tag-list" v-if="instrument.tone.characteristics?.length">
              <span 
                v-for="char in instrument.tone.characteristics" 
                :key="char"
                class="feature-tag"
              >
                ✨ {{ char }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="section-card">
          <div class="section-card-header">
            <span class="section-icon">⚖️</span>
            <span class="section-title">入门优缺点分析</span>
          </div>
          <div class="section-card-body">
            <div class="pros-cons-grid">
              <div class="pros-col">
                <div class="col-header pros">
                  <span class="col-icon">👍</span>
                  <span class="col-title">优点</span>
                </div>
                <ul class="pros-list">
                  <li v-for="(pro, index) in instrument.pros" :key="index" class="pros-item">
                    <span class="bullet pros">✓</span>
                    <span class="item-text">{{ pro }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="cons-col">
                <div class="col-header cons">
                  <span class="col-icon">👎</span>
                  <span class="col-title">缺点</span>
                </div>
                <ul class="cons-list">
                  <li v-for="(con, index) in instrument.cons" :key="index" class="cons-item">
                    <span class="bullet cons">✗</span>
                    <span class="item-text">{{ con }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-card" v-if="instrument.tutorial?.length">
          <div class="section-card-header">
            <span class="section-icon">📚</span>
            <span class="section-title">新手入门图文教程</span>
          </div>
          <div class="section-card-body">
            <div 
              v-for="(step, index) in instrument.tutorial" 
              :key="index"
              class="tutorial-step"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-text">{{ step.content }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-card">
          <div class="section-card-header">
            <span class="section-icon">💬</span>
            <span class="section-title">爱好者评论区</span>
            <span class="section-count">({{ commentsTotal }})</span>
          </div>
          <div class="section-card-body">
            <div class="comment-input-area" v-if="userStore.isLoggedIn">
              <textarea 
                v-model="commentContent"
                class="comment-textarea"
                placeholder="分享你的入门心得、体验感受..."
                rows="3"
              ></textarea>
              <div class="comment-actions">
                <div class="rating-selector">
                  <span class="rating-label">评分：</span>
                  <span 
                    v-for="star in 5" 
                    :key="star"
                    class="star-item"
                    @click="selectRating(star)"
                  >
                    {{ star <= commentRating ? '⭐' : '☆' }}
                  </span>
                </div>
                <button 
                  class="btn btn-primary"
                  :class="{ 'btn-disabled': !commentContent.trim() }"
                  @click="submitComment"
                  :disabled="submitting || !commentContent.trim()"
                >
                  {{ submitting ? '发布中...' : '发布评论' }}
                </button>
              </div>
            </div>
            
            <div class="login-prompt" v-else @click="userStore.openLoginModal">
              <span class="prompt-icon">🔒</span>
              <span class="prompt-text">登录后可以发表评论，分享你的入门心得</span>
              <span class="prompt-arrow">→</span>
            </div>
            
            <div class="comments-list">
              <div v-if="commentsLoading" class="comments-loading">
                <div class="loading-spinner-small"></div>
              </div>
              
              <template v-else-if="comments.length > 0">
                <div 
                  v-for="comment in comments" 
                  :key="comment.id"
                  class="comment-item"
                >
                  <div class="comment-header">
                    <div class="comment-avatar">
                      {{ comment.userName.charAt(0) }}
                    </div>
                    <div class="comment-info">
                      <div class="comment-author">{{ comment.userName }}</div>
                      <div class="comment-meta">
                        <span class="comment-time">{{ comment.createdAt }}</span>
                        <span class="comment-rating">
                          <span v-for="star in 5" :key="star">
                            {{ star <= comment.rating ? '⭐' : '☆' }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="comment-content">{{ comment.content }}</div>
                  <div class="comment-footer">
                    <div class="comment-like" @click="likeComment(comment.id)">
                      <span class="like-icon">👍</span>
                      <span class="like-count">{{ comment.likes }}</span>
                    </div>
                  </div>
                </div>
              </template>
              
              <div v-else class="comments-empty">
                <span class="empty-icon">💭</span>
                <span class="empty-text">暂无评论，来分享你的感受吧~</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-bottom-bar">
        <div class="bottom-action" @click="toggleFavorite">
          <span class="bottom-icon">{{ isFavorited ? '❤️' : '🤍' }}</span>
          <span class="bottom-text">{{ isFavorited ? '已收藏' : '收藏' }}</span>
        </div>
        <button class="bottom-btn-primary" @click="scrollToComments">
          查看评论
        </button>
      </div>
    </template>
    
    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <div class="error-text">乐器不存在或已下架</div>
      <button class="btn btn-primary" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { instrumentApi } from '@/api/instrument'
import { useDataStore } from '@/stores/data'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const dataStore = useDataStore()
const userStore = useUserStore()

const pageContainer = ref(null)
const loading = ref(true)
const isScrolled = ref(false)
const instrument = ref(null)

const comments = ref([])
const commentsLoading = ref(false)
const commentsTotal = ref(0)
const commentsPage = ref(1)
const commentsHasMore = ref(true)

const commentContent = ref('')
const commentRating = ref(5)
const submitting = ref(false)

const isFavorited = computed(() => {
  return instrument.value ? dataStore.isFavorite(instrument.value.id) : false
})

function getDifficultyClass() {
  if (!instrument.value) return 'tag-primary'
  switch (instrument.value.difficulty) {
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

function handleImageError(event) {
  event.target.style.display = 'none'
}

function goBack() {
  router.back()
}

function goHome() {
  router.push('/')
}

function toggleFavorite() {
  if (!userStore.checkLogin()) return
  
  if (instrument.value) {
    dataStore.toggleFavorite(instrument.value)
  }
}

function selectRating(rating) {
  commentRating.value = rating
}

async function submitComment() {
  if (!commentContent.value.trim()) return
  
  submitting.value = true
  
  const result = await instrumentApi.addComment(route.params.id, {
    userId: userStore.userInfo.id,
    userName: userStore.userInfo.userName,
    content: commentContent.value,
    rating: commentRating.value
  })
  
  submitting.value = false
  
  if (result.success) {
    commentContent.value = ''
    commentRating.value = 5
    commentsPage.value = 1
    comments.value = []
    loadComments()
  }
}

async function likeComment(commentId) {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.likes += 1
    await instrumentApi.likeComment(commentId)
  }
}

function scrollToComments() {
  const commentSection = document.querySelector('.comment-input-area, .login-prompt')
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleScroll() {
  isScrolled.value = window.pageYOffset > 200
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadComments()
  }
}

async function loadInstrument() {
  loading.value = true
  
  const result = await instrumentApi.getInstrumentDetail(route.params.id)
  
  loading.value = false
  
  if (result.success) {
    instrument.value = result.data
    dataStore.addToBrowsingHistory(result.data)
  }
}

async function loadComments() {
  if (commentsLoading.value || !commentsHasMore.value) return
  
  commentsLoading.value = true
  
  const result = await instrumentApi.getComments(route.params.id, {
    page: commentsPage.value,
    pageSize: 10
  })
  
  commentsLoading.value = false
  
  if (result.success) {
    if (result.data.list.length > 0) {
      comments.value = [...comments.value, ...result.data.list]
      commentsTotal.value = result.data.total
      commentsHasMore.value = result.data.hasMore
      if (result.data.hasMore) {
        commentsPage.value++
      }
    } else {
      commentsHasMore.value = false
    }
  }
}

onMounted(() => {
  loadInstrument()
  loadComments()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-bottom: 70px;
}

.detail-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: transparent;
  z-index: 100;
  transition: background-color var(--transition-normal), box-shadow var(--transition-normal);
}

.detail-header.header-scrolled {
  background-color: var(--bg-card);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.header-back,
.header-action {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.header-back:active,
.header-action:active {
  transform: scale(0.95);
}

.header-scrolled .header-back,
.header-scrolled .header-action {
  background-color: var(--bg-secondary);
}

.header-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.header-scrolled .header-title {
  opacity: 1;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.detail-hero {
  position: relative;
  width: 100%;
}

.hero-image {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: var(--spacing-xxl) var(--spacing-lg) var(--spacing-lg);
}

.hero-title {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: var(--spacing-sm);
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.detail-content {
  padding: var(--spacing-md);
}

.section-card {
  background-color: var(--bg-card);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 2px 8px var(--shadow-color);
  overflow: hidden;
}

.section-card-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.section-icon {
  font-size: 18px;
  margin-right: var(--spacing-sm);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.section-count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-left: var(--spacing-xs);
}

.section-card-body {
  padding: var(--spacing-lg);
}

.description-text {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
}

.info-block {
  margin-bottom: var(--spacing-md);
}

.info-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.info-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-light);
  color: var(--primary-dark);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.pros-cons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.col-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.col-header.pros {
  color: #2e7d32;
}

.col-header.cons {
  color: #c62828;
}

.col-icon {
  font-size: 16px;
  margin-right: var(--spacing-xs);
}

.col-title {
  font-size: var(--font-size-md);
  font-weight: 600;
}

.pros-list,
.cons-list {
  list-style: none;
}

.pros-item,
.cons-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.bullet {
  font-weight: bold;
  margin-right: var(--spacing-xs);
  flex-shrink: 0;
}

.bullet.pros {
  color: #2e7d32;
}

.bullet.cons {
  color: #c62828;
}

.item-text {
  color: var(--text-secondary);
}

.tutorial-step {
  display: flex;
  margin-bottom: var(--spacing-lg);
}

.tutorial-step:last-child {
  margin-bottom: 0;
}

.step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: var(--text-light);
  border-radius: 50%;
  font-size: var(--font-size-sm);
  font-weight: 600;
  flex-shrink: 0;
  margin-right: var(--spacing-md);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.step-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.comment-input-area {
  margin-bottom: var(--spacing-lg);
}

.comment-textarea {
  width: 100%;
  min-height: 80px;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  color: var(--text-primary);
  resize: vertical;
  border: 1px solid transparent;
  transition: border-color var(--transition-fast);
}

.comment-textarea:focus {
  border-color: var(--primary-color);
  background-color: var(--bg-card);
}

.comment-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-sm);
}

.rating-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.rating-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.star-item {
  font-size: 18px;
  cursor: pointer;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-prompt {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  margin-bottom: var(--spacing-lg);
  transition: background-color var(--transition-fast);
}

.login-prompt:active {
  background-color: var(--border-color);
}

.prompt-icon {
  font-size: 16px;
  margin-right: var(--spacing-sm);
}

.prompt-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.prompt-arrow {
  color: var(--primary-color);
}

.comments-list {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-md);
}

.comments-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.comment-item {
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.comment-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  border-radius: 50%;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-right: var(--spacing-sm);
}

.comment-info {
  flex: 1;
}

.comment-author {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: 2px;
}

.comment-time {
  font-size: 11px;
  color: var(--text-muted);
}

.comment-rating {
  font-size: 10px;
}

.comment-content {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
}

.comment-footer {
  display: flex;
  align-items: center;
}

.comment-like {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-fast);
}

.comment-like:active {
  background-color: var(--bg-secondary);
}

.like-icon {
  font-size: 14px;
}

.like-count {
  font-size: 12px;
  color: var(--text-muted);
}

.comments-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-sm);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.detail-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  padding-bottom: calc(var(--spacing-md) + var(--safe-area-bottom));
  background-color: var(--bg-card);
  box-shadow: 0 -2px 10px var(--shadow-color);
  z-index: 99;
}

.bottom-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-md);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.bottom-action:active {
  transform: scale(0.95);
}

.bottom-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.bottom-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.bottom-btn-primary {
  flex: 1;
  margin-left: var(--spacing-md);
  height: 44px;
  background-color: var(--primary-color);
  color: var(--text-light);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.bottom-btn-primary:active {
  background-color: var(--primary-dark);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--spacing-xxl);
}

.error-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
}

.error-text {
  font-size: var(--font-size-md);
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
