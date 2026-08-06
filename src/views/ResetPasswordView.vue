<template>
  <section class="hero-panel mx-auto" style="max-width: 460px;">
    <div class="section-label">Account Recovery</div>
    <h1 class="page-title">Choose a new password.</h1>
    <p class="page-subtitle mb-4">The reset link is valid for 60 minutes.</p>
    <div v-if="message" class="text-success small mb-3">{{ message }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model.trim="form.email" class="form-control form-control-lg" type="email" autocomplete="email" required />
      </div>
      <div class="mb-3">
        <label class="form-label">New Password</label>
        <input v-model="form.password" class="form-control form-control-lg" type="password" autocomplete="new-password" minlength="8" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input v-model="form.password_confirmation" class="form-control form-control-lg" type="password" autocomplete="new-password" minlength="8" required />
      </div>
      <p v-if="error" class="text-danger small">{{ error }}</p>
      <button class="btn btn-warning btn-lg w-100 fw-semibold" :disabled="loading || !token">
        {{ loading ? 'Resetting...' : 'Reset password' }}
      </button>
    </form>
    <div class="text-center mt-4">
      <router-link class="text-secondary small" to="/login">Back to sign in</router-link>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'

const route = useRoute()
const router = useRouter()
const token = String(route.query.token || '')
const loading = ref(false)
const error = ref(token ? '' : 'This password reset link is missing or invalid.')
const message = ref('')
const form = reactive({
  email: String(route.query.email || ''),
  password: '',
  password_confirmation: ''
})

async function submit() {
  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { data } = await api.post('/reset-password', {
      token,
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    message.value = data.message || 'Password reset successfully.'
    window.setTimeout(() => router.push('/login'), 1200)
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to reset password.')
  } finally {
    loading.value = false
  }
}
</script>
