<template>
  <div class="app-container">
    <router-view />
    <TabBar v-if="showTabBar" />
    <LoginModal />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'
import LoginModal from './components/LoginModal.vue'

const route = useRoute()

const showTabBar = computed(() => {
  const tabBarRoutes = ['/', '/favorites', '/profile']
  return tabBarRoutes.includes(route.path)
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-bottom: var(--tabbar-height);
}
</style>
