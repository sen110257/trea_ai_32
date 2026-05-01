<template>
  <div class="home-page">
    <div class="search-section">
      <div class="search-box" @click="focusSearch">
        <span class="search-icon">🔍</span>
        <input 
          ref="searchInput"
          v-model="searchKeyword"
          type="text"
          placeholder="搜索乐器名称、类型..."
          class="search-input"
          @input="handleSearch"
          @keyup.enter="performSearch"
        />
        <span v-if="searchKeyword" class="search-clear" @click="clearSearch">✕</span>
      </div>
    </div>
    
    <div class="category-section">
      <div class="category-scroll">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="!searchKeyword && activeCategory === 'all'" class="hot-section">
      <div class="section-header">
        <span class="section-title">🔥 热门推荐</span>
        <span class="section-more" @click="goToCategory">查看全部 →</span>
      </div>
      <div class="hot-list">
        <div 
          v-for="instrument in hotInstrumentsList.slice(0, 4)" 
          :key="instrument.id"
          class="hot-item"
          @click="goToDetail(instrument.id)"
        >
          <div class="hot-image-wrapper">
            <img 
              v-if="instrument.image"
              :src="instrument.image" 
              :alt="instrument.name"
              class="hot-image"
              @load="handleImageLoad($event, instrument.id)"
              @error="handleHotImageError($event, instrument)"
            />
            <div v-else class="hot-image-placeholder">
              {{ getCategoryIcon(instrument.category) }}
            </div>
          </div>
          <div class="hot-name">{{ instrument.name }}</div>
        </div>
      </div>
    </div>
    
    <div class="list-section">
      <div class="section-header">
        <span class="section-title">{{ getSectionTitle() }}</span>
      </div>
      
      <div v-if="instruments.length > 0" class="instruments-list">
        <InstrumentCard 
          v-for="instrument in instruments" 
          :key="instrument.id"
          :instrument="instrument"
        />
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-if="!loading && instruments.length === 0 && !hasMore" class="empty-state">
        <div class="empty-state-icon">🎵</div>
        <div class="empty-state-text">暂无相关乐器</div>
      </div>
      
      <div v-if="!loading && instruments.length > 0 && !hasMore" class="no-more">
        — 没有更多了 —
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { instrumentApi } from '@/api/instrument'
import { categories, hotInstruments } from '@/data/mockData'
import InstrumentCard from '@/components/InstrumentCard.vue'

const router = useRouter()

const searchInput = ref(null)
const searchKeyword = ref('')
const activeCategory = ref('all')
const instruments = ref([])
const hotInstrumentsList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const searchTimer = ref(null)

const getSectionTitle = () => {
  if (searchKeyword.value) {
    return `"${searchKeyword.value}" 的搜索结果`
  }
  if (activeCategory.value !== 'all') {
    const category = categories.find(c => c.id === activeCategory.value)
    return category ? `${category.icon} ${category.name}` : '全部乐器'
  }
  return '全部乐器'
}

function focusSearch() {
  if (searchInput.value) {
    searchInput.value.focus()
  }
}

function handleSearch() {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  searchTimer.value = setTimeout(() => {
    performSearch()
  }, 300)
}

function performSearch() {
  currentPage.value = 1
  instruments.value = []
  hasMore.value = true
  loadInstruments()
}

function clearSearch() {
  searchKeyword.value = ''
  performSearch()
}

function selectCategory(categoryId) {
  activeCategory.value = categoryId
  currentPage.value = 1
  instruments.value = []
  hasMore.value = true
  loadInstruments()
}

function goToCategory() {
  router.push('/category')
}

function goToDetail(id) {
  router.push(`/instrument/${id}`)
}

async function loadInstruments() {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  const params = {
    page: currentPage.value,
    pageSize: 10
  }
  
  if (activeCategory.value !== 'all') {
    params.category = activeCategory.value
  }
  
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value
  }
  
  const result = await instrumentApi.getInstruments(params)
  
  loading.value = false
  
  if (result.success) {
    if (result.data.list.length > 0) {
      instruments.value = [...instruments.value, ...result.data.list]
      hasMore.value = result.data.hasMore
      if (result.data.hasMore) {
        currentPage.value++
      }
    } else {
      hasMore.value = false
    }
  }
}

async function loadHotInstruments() {
  const result = await instrumentApi.getHotInstruments()
  if (result.success) {
    hotInstrumentsList.value = result.data
  }
}

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadInstruments()
  }
}

function pullToRefresh() {
  if (window.pageYOffset === 0) {
    currentPage.value = 1
    instruments.value = []
    hasMore.value = true
    loadInstruments()
  }
}

function getCategoryIcon(category) {
  const icons = {
    string: '🎻',
    wind: '🎷',
    percussion: '🥁',
    niche: '🎭',
    traditional: '🏮'
  }
  return icons[category] || '🎵'
}

function handleImageLoad(event, instrumentId) {
  event.target.style.opacity = '1'
}

function handleHotImageError(event, instrument) {
  event.target.style.display = 'none'
  const wrapper = event.target.closest('.hot-image-wrapper')
  if (wrapper) {
    const placeholder = document.createElement('div')
    placeholder.className = 'hot-image-placeholder'
    placeholder.textContent = getCategoryIcon(instrument.category)
    wrapper.appendChild(placeholder)
  }
}

watch(activeCategory, () => {
  loadInstruments()
})

onMounted(() => {
  loadHotInstruments()
  loadInstruments()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('touchstart', () => {
    if (window.pageYOffset === 0) {
      // 下拉刷新触发位置
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-page {
  padding-bottom: var(--spacing-lg);
}

.search-section {
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  padding: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  z-index: 10;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: var(--bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.search-icon {
  font-size: 16px;
  margin-right: var(--spacing-sm);
}

.search-input {
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-clear {
  font-size: 14px;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--spacing-xs);
}

.category-section {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.category-scroll {
  display: flex;
  gap: var(--spacing-md);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: var(--spacing-xs);
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-card);
  border-radius: var(--border-radius-md);
  min-width: 64px;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.category-item:active {
  transform: scale(0.95);
}

.category-item.active {
  background-color: var(--primary-color);
}

.category-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.category-name {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: 500;
}

.category-item.active .category-name {
  color: var(--text-light);
}

.hot-section {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  cursor: pointer;
}

.hot-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.hot-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.hot-item:active {
  transform: scale(0.95);
}

.hot-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  margin-bottom: var(--spacing-xs);
}

.hot-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px var(--shadow-color);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.hot-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  border-radius: var(--border-radius-md);
  font-size: 32px;
  color: var(--text-light);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.hot-name {
  font-size: var(--font-size-xs);
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
}

.list-section {
  padding: 0 var(--spacing-lg);
}

.instruments-list {
  padding-bottom: var(--spacing-lg);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl) * 2;
}

.empty-state-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state-text {
  font-size: var(--font-size-md);
  color: var(--text-muted);
}

.no-more {
  text-align: center;
  padding: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}
</style>
