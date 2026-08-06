<template>
  <div class="app-shell">
    <nav class="navbar app-nav">
      <div class="container-fluid nav-surface">
        <router-link class="navbar-brand app-brand d-flex align-items-center gap-3" to="/">
          <span class="brand-mark">G</span>
          <span class="d-flex flex-column lh-sm">
            <span class="brand-name fw-semibold">GIT Code Analyzer</span>
            <small class="brand-copy">{{ shellCopy }}</small>
          </span>
        </router-link>

        <button
          class="shell-menu-toggle d-lg-none"
          type="button"
          :aria-expanded="navOpen"
          aria-label="Toggle navigation"
          @click="navOpen = !navOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="shell-nav" :class="{ open: navOpen }">
          <div class="shell-links">
            <router-link
              v-for="link in links"
              :key="link.to"
              class="nav-link-pill"
              :class="{ active: isActive(link.to) }"
              :to="link.to"
            >
              {{ link.label }}
            </router-link>
          </div>

          <div class="shell-actions">
            <span v-if="isAuthenticated" class="user-chip">{{ auth.user?.name || 'Signed in' }}</span>
            <router-link v-if="!isAuthenticated" class="btn btn-outline-light btn-sm nav-action" to="/login">
              Login
            </router-link>
            <router-link v-if="!isAuthenticated" class="btn btn-warning btn-sm nav-action" to="/register">
              Register
            </router-link>
            <router-link v-if="isAuthenticated" class="btn btn-outline-light btn-sm nav-action" to="/dashboard">
              Dashboard
            </router-link>
            <button v-if="isAuthenticated" class="btn btn-outline-warning btn-sm nav-action" type="button" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main :class="mainClass">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from './services/api'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const navOpen = ref(false)

const isAuthenticated = computed(() => Boolean(auth.token))
const shellMode = computed(() => route.meta.shell || (route.path === '/' || route.path === '/who-we-are' ? 'public' : 'app'))
const isPublicShell = computed(() => shellMode.value === 'public')
const isAuthShell = computed(() => shellMode.value === 'auth')
const shellCopy = computed(() => {
  if (isPublicShell.value) return 'Security intelligence for public GitHub repositories'
  if (isAuthShell.value) return 'Secure access to scans, findings, and reports'
  return 'Operational dashboard for security and remediation'
})
const mainClass = computed(() => (isPublicShell.value ? 'landing-main' : 'container py-4 py-lg-5 app-main'))
const links = computed(() => {
  if (isPublicShell.value) {
    return [
      { to: '/', label: 'Home' },
      { to: '/who-we-are', label: 'Who We Are' }
    ]
  }

  if (isAuthShell.value) {
    return [
      { to: '/', label: 'Home' },
      { to: '/who-we-are', label: 'Who We Are' }
    ]
  }

  return [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/repositories/new', label: 'Add Repository' },
    { to: '/reports', label: 'Reports' }
  ]
})

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}

onMounted(async () => {
  if (auth.token && !auth.user) {
    try {
      await auth.fetchCurrentUser(api)
    } catch {
      auth.clearSession()
    }
  }
})

watch(
  () => route.fullPath,
  () => {
    navOpen.value = false
  }
)

async function logout() {
  try {
    await api.post('/logout')
  } catch {
    // Ignore logout network failures; local session is still cleared.
  } finally {
    auth.clearSession()
    router.push('/login')
  }
}
</script>
