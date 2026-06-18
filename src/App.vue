<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg navbar-dark px-3 py-3 app-nav">
      <div class="container-fluid nav-surface">
        <router-link class="navbar-brand fw-semibold d-flex align-items-center gap-2" to="/">
          <span class="brand-mark">G</span>
          <span>Security Analyzer</span>
        </router-link>
        <div class="ms-auto d-flex gap-2 align-items-center flex-wrap justify-content-end">
          <template v-if="isLanding">
            <a class="btn btn-outline-light btn-sm" href="#who-we-are">Who we are</a>
            <a class="btn btn-outline-light btn-sm" href="#how-it-works">How it works</a>
            <router-link v-if="isAuthenticated" class="btn btn-warning btn-sm" to="/dashboard">Open app</router-link>
            <template v-else>
              <router-link class="btn btn-outline-light btn-sm" to="/login">Login</router-link>
              <router-link class="btn btn-warning btn-sm" to="/register">Register</router-link>
            </template>
          </template>
          <template v-else-if="isAuthenticated">
            <span class="text-secondary small d-none d-md-inline">{{ auth.user?.name || 'User' }}</span>
            <router-link class="btn btn-outline-light btn-sm" to="/dashboard">Dashboard</router-link>
            <router-link class="btn btn-outline-light btn-sm" to="/reports">Reports</router-link>
            <button class="btn btn-outline-warning btn-sm" type="button" @click="logout">Logout</button>
          </template>
          <template v-else>
            <router-link class="btn btn-outline-light btn-sm" to="/">Home</router-link>
            <router-link class="btn btn-outline-light btn-sm" to="/login">Login</router-link>
            <router-link class="btn btn-warning btn-sm" to="/register">Register</router-link>
          </template>
        </div>
      </div>
    </nav>

    <main :class="mainClass">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from './services/api'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const isAuthenticated = computed(() => Boolean(auth.token))
const isLanding = computed(() => route.path === '/')
const mainClass = computed(() => (isLanding.value ? 'landing-main' : 'container py-4 py-lg-5'))

onMounted(async () => {
  if (auth.token && !auth.user) {
    try {
      await auth.fetchCurrentUser(api)
    } catch {
      auth.clearSession()
    }
  }
})

async function logout() {
  try {
    await api.post('/logout')
  } catch {
    // ignore logout network failure
  } finally {
    auth.clearSession()
    router.push('/login')
  }
}
</script>
