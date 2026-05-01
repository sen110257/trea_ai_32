<template>
  <div class="instrument-card card" @click="handleClick">
    <div class="card-image-wrapper">
      <img 
        v-if="instrument.image" 
        :src="instrument.image" 
        :alt="instrument.name"
        class="card-image"
        @error="handleImageError"
        :class="{ 'image-loaded': imageLoaded }"
      />
      <div v-else class="card-image-fallback">
        {{ getCategoryIcon() }}
      </div>
      <div v-if="showFavorite && isFavorited" class="favorite-badge">
        ❤️
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <div class="card-title">{{ instrument.name }}</div>
        <div class="card-difficulty">
          <span class="tag" :class="getDifficultyClass()">
            {{ instrument.difficultyLabel }}
          </span>
        </div>
      </div>
      
      <p class="card-description">{{ instrument.description }}</p>
      
      <div class="card-footer">
        <div class="card-popularity">
          <span class="popularity-icon">🔥</span>
          <span class="popularity-text">{{ instrument.popularity }}人气</span>
        </div>
        <div class="card-tags">
          <span 
            v-for="(tag, index) in displayTags" 
            :key="index" 
            class="small-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'

const props = defineProps({
  instrument: {
    type: Object,
    required: true
  },
  showFavorite: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const dataStore = useDataStore()

const imageLoaded = ref(false)

const isFavorited = computed(() => {
  return dataStore.isFavorite(props.instrument.id)
})

const displayTags = computed(() => {
  return props.instrument.suitableFor?.slice(0, 2) || []
})

function getDifficultyClass() {
  switch (props.instrument.difficulty) {
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

function getCategoryIcon() {
  const icons = {
    string: '🎻',
    wind: '🎷',
    percussion: '🥁',
    niche: '🎭',
    traditional: '🏮'
  }
  return icons[props.instrument.category] || '🎵'
}

function handleImageError(event) {
  event.target.style.display = 'none'
}

function handleClick() {
  router.push(`/instrument/${props.instrument.id}`)
}
</script>

<style scoped>
.instrument-card {
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  background-color: var(--bg-secondary);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.card-image.image-loaded {
  opacity: 1;
}

.favorite-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.card-content {
  padding: var(--spacing-md);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.card-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-popularity {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.popularity-icon {
  font-size: 14px;
}

.popularity-text {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.card-tags {
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
</style>
