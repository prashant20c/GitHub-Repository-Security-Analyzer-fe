<template>
  <section class="hero-panel mx-auto" style="max-width: 460px;">
    <div class="section-label">Access</div>
    <h1 class="page-title">Welcome back.</h1>
    <p class="page-subtitle mb-4">Sign in to review scans, findings, and remediation guidance.</p>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.email" class="form-control form-control-lg" type="email" autocomplete="email" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="form.password" class="form-control form-control-lg" type="password" autocomplete="current-password" />
      </div>
      <p v-if="error" class="text-danger small">{{ error }}</p>
      <button class="btn btn-warning btn-lg w-100 fw-semibold" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: ''
})

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/login', form)
    auth.setSession(data.token, data.user)
    router.push('/dashboard')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>
