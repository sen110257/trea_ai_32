<template>
  <div class="tabbar">
    <div 
      v-for="item in tabs" 
      :key="item.path"
      class="tabbar-item"
      :class="{ active: isActive(item.path) }"
      @click="navigateTo(item.path)"
    >
      <div class="tabbar-icon">{{ isActive(item.path) ? item.activeIcon : item.icon }}</div>
      <div class="tabbar-text">{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  {
    name: '首页',
    path: '/',
    icon: '🏠',
    activeIcon: '🏡'
  },
  {
    name: '收藏',
    path: '/favorites',
    icon: '🤍',
    activeIcon: '❤️'
  },
  {
    name: '我的',
    path: '/profile',
    icon: '👤',
    activeIcon: '🧑'
  }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function navigateTo(path) {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--tabbar-height);
  background-color: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2px 10px var(--shadow-color);
  padding-bottom: var(--safe-area-bottom);
  z-index: 100;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tabbar-item:active {
  transform: scale(0.95);
}

.tabbar-icon {
  font-size: 22px;
  margin-bottom: 2px;
  transition: all var(--transition-fast);
}

.tabbar-text {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.tabbar-item.active .tabbar-text {
  color: var(--primary-color);
  font-weight: 500;
}
</style>
