import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import RepositoryCreateView from '../views/RepositoryCreateView.vue'
import RepositoryDetailView from '../views/RepositoryDetailView.vue'
import ScanDetailView from '../views/ScanDetailView.vue'
import FindingDetailView from '../views/FindingDetailView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/repositories/new', component: RepositoryCreateView, meta: { requiresAuth: true } },
  { path: '/repositories/:id', component: RepositoryDetailView, props: true, meta: { requiresAuth: true } },
  { path: '/scans/:id', component: ScanDetailView, props: true, meta: { requiresAuth: true } },
  { path: '/findings/:id', component: FindingDetailView, props: true, meta: { requiresAuth: true } },
  { path: '/reports', component: ReportsView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const token = auth.token || localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.meta.guestOnly && token) {
    return '/dashboard'
  }

  return true
})

export default router
