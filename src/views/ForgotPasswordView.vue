<template>
  <section class="hero-panel mx-auto" style="max-width: 460px;">
    <div class="section-label">Account Recovery</div>
    <h1 class="page-title">Reset your password.</h1>
    <p class="page-subtitle mb-4">Enter your account email and we will send a secure reset link.</p>
    <div v-if="message" class="text-success small mb-3">{{ message }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model.trim="email" class="form-control form-control-lg" type="email" autocomplete="email" required />
      </div>
      <p v-if="error" class="text-danger small">{{ error }}</p>
      <button class="btn btn-warning btn-lg w-100 fw-semibold" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send reset link' }}
      </button>
    </form>
    <div class="text-center mt-4">
      <router-link class="text-secondary small" to="/login">Back to sign in</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'

const email = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { data } = await api.post('/forgot-password', { email: email.value.trim() })
    message.value = data.message || 'If that email is registered, a reset link has been sent.'
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to request a password reset.')
  } finally {
    loading.value = false
  }
}
</script>
