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
          <button class="btn btn-outline-warning" type="button" @click="generateReport" :disabled="loading || !scan">
            {{ reportBusy ? 'Generating...' : 'Generate Report' }}
          </button>
          <router-link class="btn btn-outline-light" :to="`/repositories/${scan?.repository_id || ''}`">
            Repository
          </router-link>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-xl-3" v-for="card in cards" :key="card.label">
      <MetricCard :label="card.label" :value="card.value" :hint="card.hint" :loading="loading" />
    </div>

    <div class="col-12 col-lg-5">
      <div class="glass-card h-100">
        <div class="section-label">Scan Metadata</div>
        <h2 class="h5 mb-3 mt-1">Run details</h2>
        <div v-if="loading" class="text-secondary">Loading scan...</div>
        <div v-else class="vstack gap-3">
          <div>
            <div class="text-secondary small">Repository</div>
            <div class="fw-semibold">{{ scan?.repository?.owner || 'Unknown' }}/{{ scan?.repository?.name || 'Repository' }}</div>
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
          <router-link class="btn btn-outline-light btn-sm" :to="`/repositories/${scan?.repository_id || ''}`">
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import MetricCard from '../components/MetricCard.vue'
import TrendChart from '../components/TrendChart.vue'

const route = useRoute()
const loading = ref(false)
const reportBusy = ref(false)
const error = ref('')
const scan = ref(null)
const findings = ref([])

const cards = computed(() => [
  { label: 'Status', value: scan.value?.status || 'Pending', hint: 'Current scan state' },
  { label: 'Security Score', value: scan.value?.security_score ?? 'N/A', hint: 'Normalized security result' },
  { label: 'Health Score', value: scan.value?.overall_health_score ?? 'N/A', hint: 'Overall repository posture' },
  { label: 'Findings', value: findings.value.length, hint: 'Total normalized issues' }
])

const series = computed(() =>
  findings.value.slice(0, 5).map((finding, index) => ({
    label: `${index + 1}`,
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
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to load scan.'
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
    error.value = err?.response?.data?.message || 'Unable to generate report.'
  } finally {
    reportBusy.value = false
  }
}

function formatDate(value) {
  if (!value) return 'Not available'
  return new Date(value).toLocaleString()
}

onMounted(loadScan)
</script>
