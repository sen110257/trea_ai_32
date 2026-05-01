<template>
  <div class="category-page">
    <div class="page-header">
      <div class="header-back" @click="goBack">←</div>
      <div class="header-title">乐器分类</div>
      <div class="header-placeholder"></div>
    </div>
    
    <div class="category-tabs">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-tab"
        :class="{ active: activeCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-name">{{ category.name }}</span>
      </div>
    </div>
    
    <div class="sort-section">
      <div class="sort-title">排序方式：</div>
      <div class="sort-options">
        <div 
          v-for="sort in sortOptions" 
          :key="sort.value"
          class="sort-option"
          :class="{ active: activeSort === sort.value }"
          @click="selectSort(sort.value)"
        >
          {{ sort.label }}
        </div>
      </div>
    </div>
    
    <div class="list-section">
      <div v-if="instruments.length > 0" class="instruments-list">
        <InstrumentCard 
          v-for="instrument in instruments" 
          :key="instrument.id"
          :instrument="instrument"
          :show-favorite="true"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { instrumentApi } from '@/api/instrument'
import { categories } from '@/data/mockData'
import InstrumentCard from '@/components/InstrumentCard.vue'

const router = useRouter()
const route = useRoute()

const activeCategory = ref(route.params.categoryId || 'all')
const activeSort = ref('hot')
const instruments = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

const sortOptions = [
  { label: '热门', value: 'hot' },
  { label: '入门友好', value: 'beginner' },
  { label: '新手优先', value: 'friendly' }
]

function goBack() {
  router.back()
}

function selectCategory(categoryId) {
  activeCategory.value = categoryId
  currentPage.value = 1
  instruments.value = []
  hasMore.value = true
  loadInstruments()
}

function selectSort(sortValue) {
  activeSort.value = sortValue
  currentPage.value = 1
  instruments.value = []
  hasMore.value = true
  loadInstruments()
}

async function loadInstruments() {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  const params = {
    page: currentPage.value,
    pageSize: 10,
    sort: activeSort.value
  }
  
  if (activeCategory.value !== 'all') {
    params.category = activeCategory.value
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

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadInstruments()
  }
}

onMounted(() => {
  loadInstruments()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.page-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-card);
  box-shadow: 0 2px 8px var(--shadow-color);
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

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-tab:active {
  transform: scale(0.95);
}

.category-tab.active {
  background-color: var(--primary-color);
}

.tab-icon {
  font-size: 16px;
}

.tab-name {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.category-tab.active .tab-name {
  color: var(--text-light);
}

.sort-section {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-color);
}

.sort-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-right: var(--spacing-md);
}

.sort-options {
  display: flex;
  gap: var(--spacing-sm);
}

.sort-option {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--bg-card);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--border-color);
}

.sort-option:active {
  transform: scale(0.95);
}

.sort-option.active {
  background-color: var(--primary-color);
  color: var(--text-light);
  border-color: var(--primary-color);
}

.list-section {
  padding: 0 var(--spacing-lg);
  padding-bottom: var(--spacing-xxl);
}

.instruments-list {
  padding-top: var(--spacing-md);
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
