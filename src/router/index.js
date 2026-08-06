import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '../views/HomeView.vue'
import WhoWeAreView from '../views/WhoWeAreView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import RepositoryCreateView from '../views/RepositoryCreateView.vue'
import RepositoryDetailView from '../views/RepositoryDetailView.vue'
import RepositoryScansView from '../views/RepositoryScansView.vue'
import ScanDetailView from '../views/ScanDetailView.vue'
import FindingDetailView from '../views/FindingDetailView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { shell: 'public', section: 'Home' } },
  { path: '/home', redirect: { name: 'home' } },
  { path: '/who-we-are', name: 'who-we-are', component: WhoWeAreView, meta: { shell: 'public', section: 'Who We Are' } },
  { path: '/login', name: 'login', component: LoginView, meta: { shell: 'auth', guestOnly: true, section: 'Sign In' } },
  { path: '/register', name: 'register', component: RegisterView, meta: { shell: 'auth', guestOnly: true, section: 'Create Account' } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { shell: 'app', requiresAuth: true, section: 'Dashboard' } },
  { path: '/repositories/new', name: 'repository-create', component: RepositoryCreateView, meta: { shell: 'app', requiresAuth: true, section: 'Add Repository' } },
  { path: '/repositories/:id', name: 'repository-detail', component: RepositoryDetailView, props: true, meta: { shell: 'app', requiresAuth: true, section: 'Repository Detail' } },
  { path: '/repositories/:id/scans', name: 'repository-scans', component: RepositoryScansView, props: true, meta: { shell: 'app', requiresAuth: true, section: 'Repository Scans' } },
  { path: '/scans/:id', name: 'scan-detail', component: ScanDetailView, props: true, meta: { shell: 'app', requiresAuth: true, section: 'Scan Detail' } },
  { path: '/findings/:id', name: 'finding-detail', component: FindingDetailView, props: true, meta: { shell: 'app', requiresAuth: true, section: 'Finding Detail' } },
  { path: '/reports', name: 'reports', component: ReportsView, meta: { shell: 'app', requiresAuth: true, section: 'Reports' } },
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

router.afterEach((to) => {
  if (typeof document !== 'undefined') {
    document.title = `${to.meta.section || 'GIT Code Analyzer'} | GIT Code Analyzer`
  }
})

export default router
