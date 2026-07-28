import { defineStore } from 'pinia'
import { api } from '../lib/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('earme_token') || null,
    user: JSON.parse(localStorage.getItem('earme_user') || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      const { data } = await api.post('/login', { email, password })
      this.token = data.token
      this.user = data.user
      localStorage.setItem('earme_token', data.token)
      localStorage.setItem('earme_user', JSON.stringify(data.user))
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch {
        // token might already be invalid - clear local state regardless
      }
      this.token = null
      this.user = null
      localStorage.removeItem('earme_token')
      localStorage.removeItem('earme_user')
    },
  },
})
