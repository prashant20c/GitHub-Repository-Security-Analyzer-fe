import { defineStore } from 'pinia'

function readJson(key) {
  const raw = sessionStorage.getItem(key)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('auth_token') || null,
    user: readJson('auth_user')
  }),
  actions: {
    setSession(token, user) {
      this.token = token
      this.user = user
      sessionStorage.setItem('auth_token', token)
      sessionStorage.setItem('auth_user', JSON.stringify(user))
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
    clearSession() {
      this.token = null
      this.user = null
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
    async fetchCurrentUser(api) {
      if (!this.token) return null
      const { data } = await api.get('/user')
      this.user = data
      sessionStorage.setItem('auth_user', JSON.stringify(data))
      return data
    },
    hydrateSession() {
      this.token = sessionStorage.getItem('auth_token') || null
      this.user = readJson('auth_user')
    }
  }
})
