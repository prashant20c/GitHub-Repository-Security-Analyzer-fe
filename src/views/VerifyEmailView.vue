<template>
  <section class="hero-panel mx-auto text-center" style="max-width: 560px;">
    <div class="section-label">Email Verification</div>
    <h1 class="page-title">{{ verified ? 'Email verified.' : 'Check your inbox.' }}</h1>
    <p class="page-subtitle mb-4">
      {{ verified
        ? 'Your account is active. You can now sign in and start scanning repositories.'
        : 'We sent a verification link to your email address. Verify it before accessing your repositories.' }}
    </p>
    <div v-if="error" class="page-alert text-start mb-3">{{ error }}</div>
    <div v-if="message" class="text-success small mb-3">{{ message }}</div>
    <div class="d-flex flex-wrap justify-content-center gap-2">
      <button v-if="!verified && auth.token" class="btn btn-warning" type="button" @click="resend" :disabled="loading">
        {{ loading ? 'Sending...' : 'Resend verification email' }}
      </button>
      <router-link class="btn btn-outline-light" :to="auth.token && verified ? '/dashboard' : '/login'">
        {{ auth.token && verified ? 'Open dashboard' : 'Back to sign in' }}
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()
const loading = ref(false)
const error = ref(route.query.error === 'expired'
  ? 'This verification link is invalid or has expired. Request a new link below.'
  : '')
const message = ref('')
const verified = computed(() => route.query.verified === '1')

async function resend() {
  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { data } = await api.post('/email/verification-notification')
    message.value = data.message || 'Verification email sent.'
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to send verification email.')
  } finally {
    loading.value = false
  }
}
</script>
