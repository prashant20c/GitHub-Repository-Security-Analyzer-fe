<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Security Overview</div>
          <h1 class="page-title">Repositories and last scan status.</h1>
          <p class="page-subtitle mb-0">
            Keep the dashboard focused on each repository, see the latest scan progress, and jump straight into the
            scan report when it is ready.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <router-link class="btn btn-warning btn-lg fw-semibold" to="/repositories/new">Add Repository</router-link>
          <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/reports">Scan Reports</router-link>
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
            <div class="section-label">Repository list</div>
            <h2 class="h5 mb-0 mt-1">Tracked repositories</h2>
          </div>
          <span class="status-pill">{{ repositories.length }} repositories</span>
        </div>

        <div v-if="loading" class="vstack gap-3 mt-4">
          <div v-for="index in 3" :key="index" class="repo-list-skeleton">
            <div class="skeleton skeleton-line w-25 mb-3"></div>
            <div class="skeleton skeleton-value w-100 mb-3"></div>
            <div class="skeleton skeleton-line w-75"></div>
          </div>
        </div>

        <div v-else class="repo-list mt-4">
          <article v-for="repository in repositories" :key="repository.id" class="repo-list-item">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-3">
              <div class="min-w-0">
                <router-link class="repo-name text-decoration-none" :to="`/repositories/${repository.id}`">
                  {{ repository.owner }}/{{ repository.name }}
                </router-link>
                <div class="text-secondary small text-break mt-1">{{ repository.url }}</div>
                <div class="d-flex flex-wrap gap-2 mt-3">
                  <span class="status-pill">{{ repository.scan_frequency }}</span>
                  <span class="status-pill repo-status-pill">{{ repositoryStatus(repository) }}</span>
                  <span class="status-pill">{{ formatDate(repository.last_scan_at || latestScan(repository)?.created_at) }}</span>
                </div>
              </div>
              <div class="d-flex flex-wrap gap-2 align-items-start">
                <button
                  class="btn btn-outline-warning btn-sm scan-action-button"
                  type="button"
                  @click="runScan(repository.id)"
                  :disabled="runningScanId === repository.id"
                  :class="{ 'is-running': runningScanId === repository.id }"
                >
                  <span v-if="runningScanId === repository.id" class="scan-action-indicator" aria-hidden="true"></span>
                  {{ runningScanId === repository.id ? 'Scanning...' : 'Scan' }}
                </button>
                <router-link class="btn btn-outline-light btn-sm" :to="`/repositories/${repository.id}`">
                  Open
                </router-link>
                <router-link v-if="latestScan(repository)" class="btn btn-outline-light btn-sm" :to="`/scans/${latestScan(repository).id}`">
                  Scan report
                </router-link>
              </div>
            </div>

            <div class="repo-progress-wrap mt-4">
              <div class="d-flex justify-content-between align-items-center gap-3 mb-2 small text-secondary">
                <span>Repository-specific progress</span>
                <span>{{ repositoryProgressLabel(repository) }}</span>
              </div>
              <div class="progress repo-progress" role="progressbar" aria-label="Repository progress">
                <div
                  class="progress-bar repo-progress-bar"
                  :class="{ 'is-running': isRepositoryRunning(repository) }"
                  :style="{ width: repositoryProgressWidth(repository) }"
                ></div>
              </div>
            </div>

            <details class="repo-scan-details mt-4">
              <summary>Scan reports</summary>
              <div class="repo-scan-details-body">
                <div class="repo-scan-details-inner">
                  <template v-if="latestScan(repository)">
                    <div class="mt-3">
                      <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-start">
                        <div>
                          <div class="fw-semibold">Latest scan #{{ latestScan(repository).id }}</div>
                          <div class="text-secondary small">{{ formatDate(latestScan(repository).created_at) }} · {{ latestScan(repository).status }}</div>
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                          <router-link :to="`/scans/${latestScan(repository).id}`" class="btn btn-sm btn-outline-light">
                            Open scan report
                          </router-link>
                        </div>
                      </div>

                      <ul class="repo-scan-bullets mt-3">
                        <li>
                          <span>Health score</span>
                          <span>{{ healthScoreDisplay(latestScan(repository).analytics?.overall_health_score ?? latestScan(repository).overall_health_score) }}</span>
                        </li>
                        <li>
                          <span>Security score</span>
                          <span>{{ scoreValue(latestScan(repository).analytics?.security_score ?? latestScan(repository).security_score) }}</span>
                        </li>
                        <li>
                          <span>Findings</span>
                          <span>{{ latestScan(repository).total_findings ?? 0 }}</span>
                        </li>
                        <li>
                          <span>Trend</span>
                          <span>{{ latestScan(repository).analytics?.trend_direction || 'n/a' }}</span>
                        </li>
                      </ul>
                      <div class="d-flex justify-content-end mt-3">
                        <router-link
                          v-if="repository.scans?.length > 1"
                          :to="`/repositories/${repository.id}/scans`"
                          class="btn btn-sm btn-outline-warning"
                        >
                          All scan reports
                        </router-link>
                      </div>
                    </div>
                  </template>
                  <div v-else class="text-secondary small mt-2">No scan has completed for this repository yet.</div>
                </div>
              </div>
            </details>
          </article>

          <div v-if="!repositories.length" class="empty-state">
            <div>
              <div class="metric-label">No repositories yet</div>
              <p class="text-secondary mb-3 mt-2">Add a repository to start scanning and tracking health scores.</p>
              <router-link class="btn btn-warning" to="/repositories/new">Add Repository</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'

const loading = ref(false)
const error = ref('')
const repositories = ref([])
const runningScanId = ref(null)

async function loadDashboard() {
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.get('/repositories')
    const hydratedRepositories = await Promise.all(
      (data || []).map(async (repository) => {
        try {
          const { data: analytics } = await api.get(`/repositories/${repository.id}/analytics`)
          const history = Array.isArray(analytics?.history) ? analytics.history : []
          const scans = history
            .map((scan) => ({
              ...scan,
              repository_id: repository.id,
              repository_name: `${repository.owner}/${repository.name}`,
              analytics: scan.analytics || null
            }))
            .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))

          return {
            ...repository,
            scans,
            latest_scan: scans[0] || null,
            latest_analytics: scans[0]?.analytics || null,
            analytics_trend: analytics?.trend || null
          }
        } catch (err) {
          return {
            ...repository,
            scans: [],
            latest_scan: null,
            latest_analytics: null,
            analytics_trend: null,
            analytics_error: getApiErrorMessage(err, 'Unable to load repository analytics.')
          }
        }
      })
    )

    repositories.value = hydratedRepositories
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to load dashboard.')
    repositories.value = []
  } finally {
    loading.value = false
  }
}

async function runScan(repositoryId) {
  runningScanId.value = repositoryId
  error.value = ''

  try {
    await api.post(`/repositories/${repositoryId}/scans`)
    await loadDashboard()
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to start scan.')
  } finally {
    runningScanId.value = null
  }
}

function latestScan(repository) {
  return (repository?.scans || [])[0] || null
}

function latestHealthScore(repository) {
  const scan = latestScan(repository)
  const value = Number(scan?.analytics?.overall_health_score ?? scan?.overall_health_score)
  return Number.isFinite(value) ? value : 0
}

function latestSecurityScore(repository) {
  const scan = latestScan(repository)
  const value = Number(scan?.analytics?.security_score ?? scan?.security_score)
  return Number.isFinite(value) ? value : 0
}

function isRepositoryRunning(repository) {
  const status = String(latestScan(repository)?.status || '').toLowerCase()
  return status === 'running' || status === 'in_progress' || status === 'pending'
}

function repositoryProgressValue(repository) {
  const healthScore = latestHealthScore(repository)

  if (healthScore > 0) return Math.max(0, Math.min(100, healthScore))
  return isRepositoryRunning(repository) ? 18 : 0
}

function repositoryProgressWidth(repository) {
  return `${repositoryProgressValue(repository)}%`
}

function repositoryProgressLabel(repository) {
  const scan = latestScan(repository)
  if (!scan) return '0/100 · Poor'
  if (isRepositoryRunning(repository)) return 'Running'
  const score = latestHealthScore(repository)
  return `${score}/100 · ${healthScoreGrade(score)}`
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

function repositoryStatus(repository) {
  const scan = latestScan(repository)
  if (!scan) return 'No scan yet'
  return String(scan.status || 'Unknown')
}

function formatDate(value) {
  if (!value) return 'Never'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Never' : date.toLocaleString()
}

onMounted(loadDashboard)
</script>
