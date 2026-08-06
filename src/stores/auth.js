import { defineStore } from 'pinia'

function readJson(key) {
  const raw = localStorage.getItem(key)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    user: readJson('auth_user')
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
    },
    hydrateSession() {
      this.token = localStorage.getItem('auth_token') || null
      this.user = readJson('auth_user')
    }
  }
})
