import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    user: null
  }),
  actions: {
    setSession(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('auth_token', token)
    },
    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
    }
  }
})
