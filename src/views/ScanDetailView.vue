<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Scan Detail</div>
          <h1 class="page-title">Scan status, findings, and generated report.</h1>
          <p class="page-subtitle mb-0">
            Review the latest scan output, inspect findings, and generate a PDF report from this run.
          </p>
        </div>
        <div class="btn-group">
          <button
            class="btn btn-outline-warning"
            type="button"
            @click="generateReport"
            :disabled="loading || reportBusy || !canGenerateReport"
          >
            {{ reportBusy ? 'Generating...' : reportActionLabel }}
          </button>
          <button
            v-if="currentReport"
            class="btn btn-outline-light"
            type="button"
            @click="downloadReport(currentReport)"
            :disabled="reportBusy"
          >
            Download Report
          </button>
          <router-link v-if="repositoryLink" class="btn btn-outline-light" :to="repositoryLink">
            Repository
          </router-link>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-xl-3" v-for="card in cards" :key="card.label">
      <MetricCard
        :label="card.label"
        :value="card.value"
        :hint="card.hint"
        :loading="loading"
        :animate="isScanRunning && card.numeric"
      />
    </div>

    <div class="col-12 col-lg-5">
      <div class="glass-card h-100">
        <div class="section-label">Scan Metadata</div>
        <h2 class="h5 mb-3 mt-1">Run details</h2>
        <div v-if="loading" class="text-secondary">Loading scan...</div>
        <div v-else class="vstack gap-3">
          <div>
            <div class="text-secondary small">Repository</div>
            <div class="fw-semibold">{{ repositoryLabel }}</div>
          </div>
          <div>
            <div class="text-secondary small">Commit hash</div>
            <div class="fw-semibold text-break">{{ scan?.commit_hash || 'Pending' }}</div>
          </div>
          <div>
            <div class="text-secondary small">Started</div>
            <div>{{ formatDate(scan?.started_at || scan?.created_at) }}</div>
          </div>
          <div>
            <div class="text-secondary small">Completed</div>
            <div>{{ formatDate(scan?.completed_at) }}</div>
          </div>
          <div>
            <div class="text-secondary small">Error</div>
            <div class="text-warning">{{ scan?.error_message || 'None' }}</div>
          </div>
          <div>
            <div class="text-secondary small">Report</div>
            <div class="fw-semibold">
              <span v-if="currentReport">Generated {{ formatDate(currentReport.generated_at) }}</span>
              <span v-else>Not generated yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-7">
      <div class="glass-card h-100">
        <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
          <div>
            <div class="section-label">Report Flow</div>
            <h2 class="h5 mb-0 mt-1">Generated report</h2>
          </div>
          <span class="status-pill">{{ currentReport ? 'Ready' : 'Pending' }}</span>
        </div>
        <div v-if="currentReport" class="vstack gap-3">
          <ul class="repo-scan-bullets">
            <li>
              <span>Report ID</span>
              <span>#{{ currentReport.id }}</span>
            </li>
            <li>
              <span>Generated</span>
              <span>{{ formatDate(currentReport.generated_at) }}</span>
            </li>
            <li>
              <span>File</span>
              <span class="text-break">{{ currentReport.file_path }}</span>
            </li>
          </ul>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-warning" type="button" @click="downloadReport(currentReport)">Download Report</button>
            <router-link class="btn btn-outline-light" to="/reports">Open Reports</router-link>
          </div>
        </div>
        <div v-else class="empty-state">
          <div>
            <div class="metric-label">No PDF yet</div>
            <p class="text-secondary mb-0 mt-2">Generate the report after the scan completes to create the download.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-7">
      <TrendChart
        label="Repository Health"
        title="Overall health score"
        timeframe="Current scan window"
        :series="series"
        :loading="loading"
      />
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="section-label">Findings</div>
            <h2 class="h5 mb-0 mt-1">Normalized vulnerability output</h2>
          </div>
          <router-link v-if="repositoryLink" class="btn btn-outline-light btn-sm" :to="repositoryLink">
            Back to repository
          </router-link>
        </div>
        <div v-if="loading" class="text-secondary">Loading findings...</div>
        <div v-else class="table-responsive">
          <table class="table table-darkish align-middle mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tool</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="finding in findings" :key="finding.id">
                <td>
                  <router-link class="text-decoration-none" :to="`/findings/${finding.id}`">
                    {{ finding.title }}
                  </router-link>
                </td>
                <td>{{ finding.tool }}</td>
                <td>{{ finding.severity }}</td>
                <td>
                  <span class="text-secondary">{{ finding.file_path || 'N/A' }}</span>
                  <span v-if="finding.line_number">:{{ finding.line_number }}</span>
                </td>
                <td>{{ finding.risk_score ?? 'N/A' }}</td>
              </tr>
              <tr v-if="!findings.length">
                <td colspan="5" class="text-secondary py-4">No findings were returned for this scan.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="error" class="text-danger small mt-3 mb-0">{{ error }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import MetricCard from '../components/MetricCard.vue'
import TrendChart from '../components/TrendChart.vue'
import { getApiErrorMessage } from '../services/errors'

const route = useRoute()
const loading = ref(false)
const reportBusy = ref(false)
const error = ref('')
const scan = ref(null)
const findings = ref([])
const reports = ref([])

const isScanRunning = computed(() => {
  const status = String(scan.value?.status || '').toLowerCase()
  return status === 'running' || status === 'in_progress'
})

const repositoryLabel = computed(() => {
  if (!scan.value?.repository) return 'Unknown repository'
  return `${scan.value.repository.owner}/${scan.value.repository.name}`
})

const repositoryLink = computed(() => {
  const repositoryId = scan.value?.repository_id
  return repositoryId ? `/repositories/${repositoryId}` : null
})

const currentReport = computed(() => {
  return reports.value
    .filter((report) => Number(report.scan_id) === Number(route.params.id))
    .slice()
    .sort((left, right) => new Date(right.generated_at) - new Date(left.generated_at))[0] || null
})

const canGenerateReport = computed(() => {
  const status = String(scan.value?.status || '').toLowerCase()
  return Boolean(scan.value) && status === 'completed'
})

const reportActionLabel = computed(() => (currentReport.value ? 'Regenerate Report' : 'Generate Report'))

const cards = computed(() => [
  { label: 'Status', value: scan.value?.status || 'Pending', hint: 'Current scan state', numeric: false },
  {
    label: 'Security Score',
    value: scan.value?.security_score ?? scan.value?.analytics?.security_score ?? 'N/A',
    hint: 'Normalized security result',
    numeric: true
  },
  {
    label: 'Health Score',
    value: scan.value?.overall_health_score ?? scan.value?.analytics?.overall_health_score ?? 'N/A',
    hint: `Overall repository posture · ${healthScoreGrade(
      scan.value?.overall_health_score ?? scan.value?.analytics?.overall_health_score ?? 0
    )}`,
    numeric: true
  },
  { label: 'Findings', value: findings.value.length, hint: 'Total normalized issues', numeric: true }
])

const series = computed(() =>
  findings.value
    .slice()
    .sort((left, right) => Number(right.risk_score || 0) - Number(left.risk_score || 0))
    .slice(0, 5)
    .map((finding, index) => ({
      label: finding.severity || `#${index + 1}`,
      value: Number(finding.risk_score || 0)
    }))
)

async function loadScan() {
  loading.value = true
  error.value = ''

  try {
    const [scanResponse, findingsResponse] = await Promise.all([
      api.get(`/scans/${route.params.id}`),
      api.get(`/scans/${route.params.id}/findings`)
    ])
    scan.value = scanResponse.data
    findings.value = findingsResponse.data || []
    const reportsResponse = await api.get('/reports')
    reports.value = Array.isArray(reportsResponse.data) ? reportsResponse.data : []
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to load scan.')
  } finally {
    loading.value = false
  }
}

async function generateReport() {
  reportBusy.value = true
  error.value = ''

  try {
    await api.post(`/scans/${route.params.id}/report`)
    await loadScan()
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to generate report.')
  } finally {
    reportBusy.value = false
  }
}

async function downloadReport(report) {
  error.value = ''

  try {
    const response = await api.get(`/reports/${report.id}/download`, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = report.file_path?.split('/').pop() || `report-${report.id}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to download report.')
  }
}

function formatDate(value) {
  if (!value) return 'Not available'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleString()
}

function healthScoreGrade(score) {
  const normalized = Number(score)
  if (!Number.isFinite(normalized)) return 'Poor'
  if (normalized >= 80) return 'Excellent'
  if (normalized >= 60) return 'Good'
  if (normalized >= 40) return 'Fair'
  if (normalized >= 20) return 'Weak'
  return 'Poor'
}

onMounted(loadScan)

watch(
  () => route.params.id,
  async () => {
    await loadScan()
  }
)
</script>
