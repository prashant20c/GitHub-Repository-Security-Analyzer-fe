<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Security Overview</div>
          <h1 class="page-title">Repository risk, trends, and remediation in one place.</h1>
          <p class="page-subtitle">
            Track scan history, prioritize vulnerabilities, and review AI guidance for every repository you manage.
          </p>
        </div>
        <router-link class="btn btn-warning btn-lg fw-semibold" to="/repositories/new">Add Repository</router-link>
      </div>
    </div>

    <div class="col-md-6 col-xl-3" v-for="card in cards" :key="card.label">
      <MetricCard :label="card.label" :value="card.value" :hint="card.hint" :loading="loading" />
    </div>

    <div class="col-12 col-lg-8">
      <TrendChart
        label="Repository Health"
        title="Overall Health Score"
        timeframe="Trend ready"
        :series="trendSeries"
        :loading="loading"
      />
    </div>

    <div class="col-12 col-lg-4">
      <div class="glass-card h-100">
        <div class="section-label">Latest Activity</div>
        <h2 class="h5 mt-2">Recent scans</h2>
        <div v-if="loading" class="vstack gap-3 mt-3">
          <div v-for="index in 4" :key="index" class="skeleton skeleton-value w-100"></div>
        </div>
        <ul v-else class="list-group list-group-flush mt-3">
          <li
            v-for="scan in recentScans"
            :key="scan.id"
            class="list-group-item bg-transparent text-light border-secondary-subtle px-0"
          >
            <div class="d-flex justify-content-between gap-3">
              <div>
                <div class="fw-semibold">#{{ scan.id }} · {{ scan.repository?.name || 'Repository' }}</div>
                <div class="text-secondary small">{{ scan.status }}</div>
              </div>
              <router-link class="btn btn-sm btn-outline-light" :to="`/scans/${scan.id}`">View</router-link>
            </div>
          </li>
          <li v-if="!recentScans.length" class="list-group-item bg-transparent text-light border-secondary-subtle px-0">
            No scans have been run yet.
          </li>
        </ul>
      </div>
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="section-label">Repositories</div>
            <h2 class="h5 mb-0 mt-1">Managed repositories</h2>
          </div>
          <router-link class="btn btn-outline-light btn-sm" to="/repositories/new">Add Repository</router-link>
        </div>
        <div v-if="loading" class="vstack gap-3">
          <div v-for="index in 4" :key="index" class="skeleton skeleton-value w-100"></div>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-darkish align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Frequency</th>
                <th>Last Scan</th>
                <th>Risk</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="repository in repositories" :key="repository.id">
                <td>{{ repository.owner }}/{{ repository.name }}</td>
                <td class="text-truncate" style="max-width: 280px;">{{ repository.url }}</td>
                <td>{{ repository.scan_frequency }}</td>
                <td>{{ formatDate(repository.last_scan_at) }}</td>
                <td>{{ repository.latest_analytics?.risk_level || 'Unknown' }}</td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-warning" type="button" @click="runScan(repository.id)">Scan</button>
                    <router-link class="btn btn-outline-light" :to="`/repositories/${repository.id}`">Open</router-link>
                  </div>
                </td>
              </tr>
              <tr v-if="!repositories.length">
                <td colspan="6" class="text-secondary py-4">No repositories have been added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="col-12" v-if="error">
      <div class="page-alert">{{ error }}</div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/api'
import MetricCard from '../components/MetricCard.vue'
import TrendChart from '../components/TrendChart.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const loading = ref(false)
const error = ref('')
const repositories = ref([])
const recentScans = ref([])

const cards = computed(() => {
  const repoCount = repositories.value.length
  const scanCount = recentScans.value.length
  const scores = recentScans.value
    .map((scan) => Number(scan.overall_health_score || 0))
    .filter((score) => score > 0)
  const average = scores.length
    ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
    : 100

  return [
    { label: 'Total Repositories', value: repoCount, hint: 'Manage multiple GitHub repos' },
    { label: 'Total Scans', value: scanCount, hint: 'Manual and scheduled scans' },
    { label: 'Average Security Score', value: average, hint: 'Aggregated over history' },
    { label: 'Highest Risk Repository', value: repositories.value[0]?.name || 'None', hint: 'Prioritization target' }
  ]
})

const trendSeries = computed(() =>
  recentScans.value.slice(0, 5).map((scan, index) => ({
    label: `Scan ${index + 1}`,
    value: Number(scan.overall_health_score || 0)
  }))
)

async function loadDashboard() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/repositories')
    const reposWithDetails = await Promise.all(
      data.map(async (repository) => {
        const { data: detail } = await api.get(`/repositories/${repository.id}`)
        const { data: analytics } = await api.get(`/repositories/${repository.id}/analytics`)

        return {
          ...detail,
          latest_analytics: analytics.length ? analytics.at(-1)?.analytics?.at?.(0) || analytics.at(-1)?.analytics || null : null
        }
      })
    )

    repositories.value = reposWithDetails
    recentScans.value = reposWithDetails
      .flatMap((repository) => repository.scans || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to load dashboard.'
    repositories.value = []
    recentScans.value = []
  } finally {
    loading.value = false
  }
}

async function runScan(repositoryId) {
  await api.post(`/repositories/${repositoryId}/scans`)
  await loadDashboard()
}

function formatDate(value) {
  if (!value) return 'Never'
  return new Date(value).toLocaleString()
}

onMounted(() => {
  if (auth.token) {
    loadDashboard()
  }
})
</script>
