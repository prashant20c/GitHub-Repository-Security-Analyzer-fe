<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg navbar-dark px-3 py-3 app-nav">
      <div class="container-fluid nav-surface">
        <router-link class="navbar-brand d-flex align-items-center gap-3" to="/">
          <span class="brand-mark">G</span>
          <span class="d-flex flex-column lh-sm">
            <span class="brand-name fw-semibold">GIT Code Analyzer</span>
            <small class="brand-copy">GitHub security intelligence</small>
          </span>
        </router-link>
        <div class="ms-auto d-flex gap-2 align-items-center flex-wrap justify-content-end">
          <template v-if="isLanding">
            <router-link class="btn btn-outline-light btn-sm nav-action" to="/">Home</router-link>
            <router-link class="btn btn-outline-light btn-sm nav-action" to="/who-we-are">Who we are</router-link>
            <router-link v-if="isAuthenticated" class="btn btn-warning btn-sm nav-action" to="/dashboard">Open app</router-link>
            <template v-else>
              <router-link class="btn btn-outline-light btn-sm nav-action" to="/login">Login</router-link>
              <router-link class="btn btn-warning btn-sm nav-action" to="/register">Register</router-link>
            </template>
          </template>
          <template v-else-if="isAuthenticated">
            <span class="user-chip small d-none d-md-inline">{{ auth.user?.name || 'User' }}</span>
            <router-link class="btn btn-outline-light btn-sm nav-action" to="/dashboard">Dashboard</router-link>
            <router-link class="btn btn-outline-light btn-sm nav-action" to="/reports">Reports</router-link>
            <button class="btn btn-outline-warning btn-sm nav-action" type="button" @click="logout">Logout</button>
          </template>
          <template v-else>
            <router-link class="btn btn-outline-light btn-sm nav-action" to="/">Home</router-link>
            <router-link class="btn btn-outline-light btn-sm nav-action" to="/login">Login</router-link>
            <router-link class="btn btn-warning btn-sm nav-action" to="/register">Register</router-link>
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
const isLanding = computed(() => route.path === '/' || route.path === '/home' || route.path === '/who-we-are')
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
