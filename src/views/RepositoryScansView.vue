<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Repository Scans</div>
          <h1 class="page-title">{{ repositoryLabel }}</h1>
          <p class="page-subtitle mb-0">
            Open any scan report, inspect the stats, and review the full scan history for this repository.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <router-link class="btn btn-outline-light btn-lg fw-semibold" :to="repositoryLink">Repository</router-link>
          <router-link class="btn btn-warning btn-lg fw-semibold" :to="`/repositories/${route.params.id}`">
            Back
          </router-link>
        </div>
      </div>
    </div>

    <div class="col-12" v-if="error">
      <div class="page-alert">{{ error }}</div>
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
          <div>
            <div class="section-label">Scan History</div>
            <h2 class="h5 mb-0 mt-1">All reports</h2>
          </div>
          <span class="status-pill">{{ scans.length }} scans</span>
        </div>

        <div class="repo-progress-wrap mt-4 mb-4">
          <div class="d-flex justify-content-between align-items-center gap-3 mb-2 small text-secondary">
            <span>Repository progress</span>
            <span>{{ repositoryProgressLabel }}</span>
          </div>
          <div class="progress repo-progress" role="progressbar" aria-label="Repository progress">
            <div class="progress-bar repo-progress-bar" :class="{ 'is-running': isRunning }" :style="{ width: progressWidth }"></div>
          </div>
        </div>

        <div v-if="loading" class="vstack gap-3">
          <div v-for="index in 4" :key="index" class="repo-list-skeleton">
            <div class="skeleton skeleton-line w-25 mb-3"></div>
            <div class="skeleton skeleton-value w-100 mb-3"></div>
            <div class="skeleton skeleton-line w-75"></div>
          </div>
        </div>

        <div v-else class="repo-list">
          <article v-for="scan in scans" :key="scan.id" class="repo-list-item">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start">
              <div>
                <div class="fw-semibold">Scan #{{ scan.id }}</div>
                <div class="text-secondary small">{{ formatDate(scan.created_at) }} · {{ scan.status }}</div>
              </div>
              <router-link class="btn btn-outline-light btn-sm" :to="`/scans/${scan.id}`">
                Open scan report
              </router-link>
            </div>

            <div class="repo-scan-details-body is-open">
              <div class="repo-scan-details-inner">
                <ul class="repo-scan-bullets mt-3">
                  <li>
                    <span>Health score</span>
                    <span>{{ healthScoreDisplay(scan.analytics?.overall_health_score ?? scan.overall_health_score) }}</span>
                  </li>
                  <li>
                    <span>Security score</span>
                    <span>{{ scoreValue(scan.analytics?.security_score ?? scan.security_score) }}</span>
                  </li>
                  <li>
                    <span>Findings</span>
                    <span>{{ scan.total_findings ?? 0 }}</span>
                  </li>
                  <li>
                    <span>Trend</span>
                    <span>{{ scan.analytics?.trend_direction || 'n/a' }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <div v-if="!scans.length" class="empty-state">
            <div>
              <div class="metric-label">No scans yet</div>
              <p class="text-secondary mb-0 mt-2">Run a scan to populate this repository history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const repository = ref(null)
const scans = ref([])

const repositoryLabel = computed(() => {
  if (!repository.value) return 'Loading repository...'
  return `${repository.value.owner}/${repository.value.name}`
})

const repositoryLink = computed(() => (route.params.id ? `/repositories/${route.params.id}` : '/dashboard'))

const latestScan = computed(() => scans.value[0] || null)
const isRunning = computed(() => {
  const status = String(latestScan.value?.status || '').toLowerCase()
  return status === 'running' || status === 'in_progress' || status === 'pending'
})
const repositoryProgressLabel = computed(() => {
  const latestScore = scoreValue(latestScan.value?.analytics?.overall_health_score ?? latestScan.value?.overall_health_score)
  return `${latestScore}/100 · ${healthScoreGrade(latestScore)}`
})
const progressWidth = computed(() => {
  const latestScore = scoreValue(latestScan.value?.analytics?.overall_health_score ?? latestScan.value?.overall_health_score)
  return `${isRunning.value ? Math.max(18, latestScore) : latestScore}%`
})

async function loadRepositoryScans() {
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.get(`/repositories/${route.params.id}`)
    repository.value = data || null
    scans.value = Array.isArray(data?.scans)
      ? data.scans.slice().sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
      : []
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to load repository scans.')
    repository.value = null
    scans.value = []
  } finally {
    loading.value = false
  }
}

function scoreValue(value) {
  const score = Number(value)
  return Number.isFinite(score) ? score : 0
}

function healthScoreDisplay(score) {
  const normalized = scoreValue(score)
  return `${normalized}/100 · ${healthScoreGrade(normalized)}`
}

function healthScoreGrade(score) {
  const normalized = scoreValue(score)
  if (normalized >= 80) return 'Excellent'
  if (normalized >= 60) return 'Good'
  if (normalized >= 40) return 'Fair'
  if (normalized >= 20) return 'Weak'
  return 'Poor'
}

function formatDate(value) {
  if (!value) return 'Not available'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString()
}

onMounted(loadRepositoryScans)

watch(
  () => route.params.id,
  async () => {
    await loadRepositoryScans()
  }
)
</script>
