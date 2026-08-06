import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const HomeView = () => import('../views/HomeView.vue')
const WhoWeAreView = () => import('../views/WhoWeAreView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const VerifyEmailView = () => import('../views/VerifyEmailView.vue')
const EmailVerifiedView = () => import('../views/EmailVerifiedView.vue')
const ForgotPasswordView = () => import('../views/ForgotPasswordView.vue')
const ResetPasswordView = () => import('../views/ResetPasswordView.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const RepositoryCreateView = () => import('../views/RepositoryCreateView.vue')
const RepositoryDetailView = () => import('../views/RepositoryDetailView.vue')
const RepositoryScansView = () => import('../views/RepositoryScansView.vue')
const ScanDetailView = () => import('../views/ScanDetailView.vue')
const FindingDetailView = () => import('../views/FindingDetailView.vue')
const ReportsView = () => import('../views/ReportsView.vue')

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { shell: 'public', section: 'Home' } },
  { path: '/home', redirect: { name: 'home' } },
  { path: '/who-we-are', name: 'who-we-are', component: WhoWeAreView, meta: { shell: 'public', section: 'Who We Are' } },
  { path: '/login', name: 'login', component: LoginView, meta: { shell: 'auth', guestOnly: true, section: 'Sign In' } },
  { path: '/register', name: 'register', component: RegisterView, meta: { shell: 'auth', guestOnly: true, section: 'Create Account' } },
  { path: '/verify-email', name: 'verify-email', component: VerifyEmailView, meta: { shell: 'auth', section: 'Verify Email' } },
  { path: '/email-verified', name: 'email-verified', component: EmailVerifiedView, meta: { shell: 'auth', section: 'Email Verified' } },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView, meta: { shell: 'auth', guestOnly: true, section: 'Forgot Password' } },
  { path: '/reset-password', name: 'reset-password', component: ResetPasswordView, meta: { shell: 'auth', section: 'Reset Password' } },
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
  const token = auth.token || sessionStorage.getItem('auth_token')

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
