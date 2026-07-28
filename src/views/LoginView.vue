<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push(route.query.redirect || { name: 'dashboard' })
  } catch (e) {
    error.value = e.response?.data?.message || 'Email atau password salah.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-screen">
    <div class="panel">
      <div class="brand-mark">✋</div>
      <h1>Masuk ke Earme Admin</h1>
      <p class="subtitle">Kelola kosakata, materi, kuis, dan artikel Earme.</p>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="admin@earme.test"
            required
            autocomplete="username"
          />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="btn btn-primary submit-btn" :disabled="loading">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(165deg, var(--teal-900), var(--teal-600));
  padding: 20px;
}

.panel {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
  box-shadow: var(--shadow-lg);
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: var(--clay-light);
  color: var(--clay-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 20px;
}

h1 {
  font-size: 21px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 13.5px;
  margin-top: 6px;
  margin-bottom: 28px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  margin-top: 4px;
}

.error {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}
</style>
