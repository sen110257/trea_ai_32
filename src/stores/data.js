import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDataStore = defineStore('data', () => {
  const favorites = ref([])
  const browsingHistory = ref([])
  const currentPage = ref(1)
  const hasMore = ref(true)
  const isLoading = ref(false)

  const favoriteIds = computed(() => favorites.value.map(item => item.id))

  function initFromStorage() {
    const storedFavorites = localStorage.getItem('favorites')
    const storedHistory = localStorage.getItem('browsingHistory')
    
    if (storedFavorites) {
      favorites.value = JSON.parse(storedFavorites)
    }
    
    if (storedHistory) {
      browsingHistory.value = JSON.parse(storedHistory)
    }
  }

  function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function saveBrowsingHistory() {
    localStorage.setItem('browsingHistory', JSON.stringify(browsingHistory.value))
  }

  function isFavorite(instrumentId) {
    return favoriteIds.value.includes(parseInt(instrumentId))
  }

  function toggleFavorite(instrument) {
    const id = parseInt(instrument.id)
    const index = favorites.value.findIndex(item => item.id === id)
    
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.unshift({
        id: instrument.id,
        name: instrument.name,
        image: instrument.image,
        difficulty: instrument.difficulty,
        difficultyLabel: instrument.difficultyLabel,
        category: instrument.category,
        addedAt: Date.now()
      })
    }
    
    saveFavorites()
    return index === -1
  }

  function removeFavorite(instrumentId) {
    const id = parseInt(instrumentId)
    const index = favorites.value.findIndex(item => item.id === id)
    
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
      return true
    }
    
    return false
  }

  function clearFavorites() {
    favorites.value = []
    saveFavorites()
  }

  function addToBrowsingHistory(instrument) {
    const id = parseInt(instrument.id)
    const index = browsingHistory.value.findIndex(item => item.id === id)
    
    if (index > -1) {
      browsingHistory.value.splice(index, 1)
    }
    
    browsingHistory.value.unshift({
      id: instrument.id,
      name: instrument.name,
      image: instrument.image,
      difficulty: instrument.difficulty,
      difficultyLabel: instrument.difficultyLabel,
      category: instrument.category,
      viewedAt: Date.now()
    })
    
    if (browsingHistory.value.length > 50) {
      browsingHistory.value = browsingHistory.value.slice(0, 50)
    }
    
    saveBrowsingHistory()
  }

  function removeFromBrowsingHistory(instrumentId) {
    const id = parseInt(instrumentId)
    const index = browsingHistory.value.findIndex(item => item.id === id)
    
    if (index > -1) {
      browsingHistory.value.splice(index, 1)
      saveBrowsingHistory()
      return true
    }
    
    return false
  }

  function clearBrowsingHistory() {
    browsingHistory.value = []
    saveBrowsingHistory()
  }

  function setLoading(status) {
    isLoading.value = status
  }

  function setHasMore(status) {
    hasMore.value = status
  }

  function resetPagination() {
    currentPage.value = 1
    hasMore.value = true
  }

  function incrementPage() {
    currentPage.value += 1
  }

  return {
    favorites,
    browsingHistory,
    favoriteIds,
    currentPage,
    hasMore,
    isLoading,
    initFromStorage,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    addToBrowsingHistory,
    removeFromBrowsingHistory,
    clearBrowsingHistory,
    setLoading,
    setHasMore,
    resetPagination,
    incrementPage
  }
})
