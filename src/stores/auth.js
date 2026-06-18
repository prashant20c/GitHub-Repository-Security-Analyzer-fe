import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    user: JSON.parse(localStorage.getItem('auth_user') || 'null')
  }),
  actions: {
    setSession(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    },
    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
    async fetchCurrentUser(api) {
      if (!this.token) return null
      const { data } = await api.get('/user')
      this.user = data
      localStorage.setItem('auth_user', JSON.stringify(data))
      return data
    }
  }
})
