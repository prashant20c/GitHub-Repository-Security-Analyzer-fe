import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import RepositoryCreateView from '../views/RepositoryCreateView.vue'
import RepositoryDetailView from '../views/RepositoryDetailView.vue'
import ScanDetailView from '../views/ScanDetailView.vue'
import FindingDetailView from '../views/FindingDetailView.vue'
import ReportsView from '../views/ReportsView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/dashboard', component: DashboardView },
  { path: '/repositories/new', component: RepositoryCreateView },
  { path: '/repositories/:id', component: RepositoryDetailView, props: true },
  { path: '/scans/:id', component: ScanDetailView, props: true },
  { path: '/findings/:id', component: FindingDetailView, props: true },
  { path: '/reports', component: ReportsView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
