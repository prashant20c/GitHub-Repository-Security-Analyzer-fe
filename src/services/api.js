import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api',
  headers: {
    Accept: 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token')
  config.headers = config.headers || {}

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401 && typeof window !== 'undefined') {
      const auth = useAuthStore()
      auth.clearSession()

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default api
