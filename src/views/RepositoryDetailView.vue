<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Repository Detail</div>
          <h1 class="page-title">Scan history, live trends, and scheduling.</h1>
          <p class="page-subtitle mb-0">
            Review the current repository posture, schedule the next scan, and inspect live trend charts from the
            backend analytics endpoints.
          </p>
        </div>
        <div class="btn-group">
          <button class="btn btn-outline-warning btn-sm" type="button" @click="runScan" :disabled="actionBusy || pageLoading">
            {{ actionBusy ? 'Scanning...' : 'Run Scan' }}
          </button>
          <button class="btn btn-outline-light btn-sm" type="button" @click="updateSchedule" :disabled="actionBusy || pageLoading">
            Save Schedule
          </button>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div v-if="error" class="page-alert">{{ error }}</div>
    </div>

    <div class="col-md-6 col-xl-3" v-for="card in cards" :key="card.label">
      <MetricCard :label="card.label" :value="card.value" :hint="card.hint" :loading="pageLoading" />
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="row g-3 align-items-end">
          <div class="col-lg-5">
            <div class="section-label">Repository</div>
            <h2 class="h5 mb-1 mt-1">{{ repositoryLabel }}</h2>
            <p class="text-secondary mb-0 text-break">{{ repository?.url || 'Loading repository...' }}</p>
          </div>
          <div class="col-md-4 col-lg-3">
            <label class="form-label small text-secondary">Scan Frequency</label>
            <select v-model="schedule.scan_frequency" class="form-select">
              <option value="manual">manual</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>
          <div class="col-md-4 col-lg-2">
            <label class="form-label small text-secondary">Next Scan</label>
            <div class="form-control bg-transparent text-light">{{ formatDate(repository?.next_scan_at) }}</div>
          </div>
          <div class="col-md-4 col-lg-2">
            <label class="form-label small text-secondary">Last Scan</label>
            <div class="form-control bg-transparent text-light">{{ formatDate(repository?.last_scan_at) }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-6" v-for="chart in charts" :key="chart.key">
      <TrendChart
        :label="chart.label"
        :title="chart.title"
        :timeframe="chart.timeframe"
        :series="chart.series"
        :loading="pageLoading"
      />
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="section-label">Recent Scans</div>
            <h2 class="h5 mb-0 mt-1">Repository scan history</h2>
          </div>
          <span class="status-pill">{{ scans.length }} runs</span>
        </div>

        <div v-if="pageLoading" class="vstack gap-3">
          <div v-for="index in 3" :key="index" class="skeleton skeleton-value w-100"></div>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-darkish align-middle mb-0">
            <thead>
              <tr>
                <th>Scan</th>
                <th>Status</th>
                <th>Health</th>
                <th>Security</th>
                <th>Started</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="scan in scans" :key="scan.id">
                <td>
                  <router-link class="text-decoration-none" :to="`/scans/${scan.id}`">#{{ scan.id }}</router-link>
                </td>
                <td>{{ scan.status }}</td>
                <td>{{ scan.overall_health_score ?? 'N/A' }}</td>
                <td>{{ scan.security_score ?? 'N/A' }}</td>
                <td>{{ formatDate(scan.created_at) }}</td>
              </tr>
              <tr v-if="!scans.length">
                <td colspan="5" class="text-secondary py-4">No scans yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import MetricCard from '../components/MetricCard.vue'
import TrendChart from '../components/TrendChart.vue'

const route = useRoute()
const pageLoading = ref(false)
const actionBusy = ref(false)
const error = ref('')
const repository = ref(null)
const scans = ref([])
const trendPayload = reactive({
  security: [],
  secret: [],
  dependency: [],
  quality: []
})

const schedule = reactive({
  scan_frequency: 'manual'
})

const repositoryLabel = computed(() => {
  if (!repository.value) return 'Loading repository...'
  return `${repository.value.owner}/${repository.value.name}`
})

const cards = computed(() => [
  { label: 'Frequency', value: repository.value?.scan_frequency || 'manual', hint: 'Current schedule' },
  { label: 'Total Scans', value: scans.value.length, hint: 'Historical runs stored in the backend' },
  { label: 'Latest Health', value: scans.value[0]?.overall_health_score ?? 'N/A', hint: 'Most recent computed score' },
  { label: 'Latest Risk', value: scans.value[0]?.risk_level || 'Unknown', hint: 'Risk classification' }
])

const charts = computed(() => [
  {
    key: 'security',
    label: 'Security',
    title: 'Security score trend',
    timeframe: 'Live from backend',
    series: toSeries(trendPayload.security, 'security_score')
  },
  {
    key: 'secret',
    label: 'Secrets',
    title: 'Secret leakage trend',
    timeframe: 'Live from backend',
    series: toSeries(trendPayload.secret, 'secret_score')
  },
  {
    key: 'dependency',
    label: 'Dependencies',
    title: 'Dependency risk trend',
    timeframe: 'Live from backend',
    series: toSeries(trendPayload.dependency, 'dependency_score')
  },
  {
    key: 'quality',
    label: 'Quality',
    title: 'Code quality trend',
    timeframe: 'Live from backend',
    series: toSeries(trendPayload.quality, 'code_quality_score')
  }
])

function toSeries(items, field) {
  return (items || []).map((point, index) => ({
    label: formatTrendLabel(point.created_at, index),
    value: Number(point[field] || 0)
  }))
}

function formatTrendLabel(value, fallbackIndex) {
  if (!value) return `#${fallbackIndex + 1}`
  return new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

async function loadRepository() {
  pageLoading.value = true
  error.value = ''
  try {
    const id = route.params.id
    const [detailResponse, securityResponse, secretResponse, dependencyResponse, qualityResponse] = await Promise.all([
      api.get(`/repositories/${id}`),
      api.get(`/repositories/${id}/security-trend`),
      api.get(`/repositories/${id}/secret-trend`),
      api.get(`/repositories/${id}/dependency-trend`),
      api.get(`/repositories/${id}/quality-trend`)
    ])

    repository.value = detailResponse.data
    scans.value = (detailResponse.data.scans || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    schedule.scan_frequency = detailResponse.data.scan_frequency || 'manual'

    trendPayload.security = securityResponse.data || []
    trendPayload.secret = secretResponse.data || []
    trendPayload.dependency = dependencyResponse.data || []
    trendPayload.quality = qualityResponse.data || []
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to load repository.'
  } finally {
    pageLoading.value = false
  }
}

async function runScan() {
  actionBusy.value = true
  error.value = ''
  try {
    await api.post(`/repositories/${route.params.id}/scans`)
    await loadRepository()
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to start scan.'
  } finally {
    actionBusy.value = false
  }
}

async function updateSchedule() {
  actionBusy.value = true
  error.value = ''
  try {
    await api.put(`/repositories/${route.params.id}/schedule`, {
      scan_frequency: schedule.scan_frequency
    })
    await loadRepository()
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to update schedule.'
  } finally {
    actionBusy.value = false
  }
}

function formatDate(value) {
  if (!value) return 'Never'
  return new Date(value).toLocaleString()
}

let refreshTimer = null

onMounted(async () => {
  await loadRepository()
  refreshTimer = window.setInterval(() => {
    if (!actionBusy.value) {
      loadRepository()
    }
  }, 120000)
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer)
  }
})
</script>
