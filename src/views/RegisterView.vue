<template>
  <section class="hero-panel mx-auto" style="max-width: 460px;">
    <div class="section-label">Create Account</div>
    <h1 class="page-title">Start scanning repositories.</h1>
    <p class="page-subtitle mb-4">Register to manage repositories, schedule scans, and review AI recommendations.</p>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model.trim="form.name" class="form-control form-control-lg" type="text" autocomplete="name" placeholder="Full name" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model.trim="form.email" class="form-control form-control-lg" type="email" autocomplete="email" placeholder="you@example.com" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="form.password" class="form-control form-control-lg" type="password" autocomplete="new-password" placeholder="At least 8 characters" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input v-model="form.password_confirmation" class="form-control form-control-lg" type="password" autocomplete="new-password" placeholder="Repeat your password" required />
      </div>
      <p v-if="error" class="text-danger small">{{ error }}</p>
      <button class="btn btn-warning btn-lg w-100 fw-semibold" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/register', {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    auth.setSession(data.token, data.user)
    router.push('/verify-email')
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Registration failed.')
  } finally {
    loading.value = false
  }
}
</script>
