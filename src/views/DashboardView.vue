<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../lib/api'
import PageHeader from '../components/PageHeader.vue'
import LoadingState from '../components/LoadingState.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const loading = ref(true)
const stats = ref({ categories: 0, entries: 0, materials: 0, quiz: 0, articles: 0 })

const cards = [
  { key: 'categories', label: 'Kategori', to: '/categories', icon: '▤', color: 'teal' },
  { key: 'entries', label: 'Kosakata', to: '/entries', icon: '✋', color: 'clay' },
  { key: 'materials', label: 'Materi', to: '/materials', icon: '▥', color: 'teal' },
  { key: 'quiz', label: 'Soal Kuis', to: '/quiz', icon: '？', color: 'clay' },
  { key: 'articles', label: 'Artikel', to: '/articles', icon: '▦', color: 'teal' },
]

async function loadStats() {
  loading.value = true
  try {
    const [categories, entries, materials, quiz, articles] = await Promise.all([
      api.get('/categories'),
      api.get('/dictionary-entries', { params: { per_page: 1 } }),
      api.get('/materials'),
      api.get('/quiz-questions'),
      api.get('/articles'),
    ])
    stats.value = {
      categories: categories.data.data.length,
      entries: entries.data.meta?.total ?? entries.data.data.length,
      materials: materials.data.data.length,
      quiz: quiz.data.data.length,
      articles: articles.data.data.length,
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <div>
    <PageHeader
      :title="`Halo, ${auth.user?.name?.split(' ')[0] || 'Admin'} 👋`"
      description="Ringkasan konten Earme saat ini."
    />

    <LoadingState v-if="loading" />
    <div v-else class="grid">
      <RouterLink v-for="c in cards" :key="c.key" :to="c.to" class="stat-card" :class="c.color">
        <div class="stat-icon">{{ c.icon }}</div>
        <div class="stat-value">{{ stats[c.key] }}</div>
        <div class="stat-label">{{ c.label }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 22px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 16px;
}
.stat-card.teal .stat-icon {
  background: var(--teal-100);
  color: var(--teal-700);
}
.stat-card.clay .stat-icon {
  background: var(--clay-light);
  color: var(--clay-dark);
}

.stat-value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
}
.stat-label {
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 2px;
}
</style>
