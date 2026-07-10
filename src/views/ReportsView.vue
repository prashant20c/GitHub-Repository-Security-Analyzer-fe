<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel">
        <div class="section-label">Reports</div>
        <h1 class="page-title">Generated PDF reports.</h1>
        <p class="page-subtitle mb-0">
          Download security summaries, remediation checklists, and trend snapshots for completed scans.
        </p>
      </div>
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="section-label">Report Archive</div>
            <h2 class="h5 mb-0 mt-1">Available downloads</h2>
          </div>
          <span class="status-pill">{{ reports.length }} reports</span>
        </div>

        <div v-if="loading" class="vstack gap-3">
          <div v-for="index in 4" :key="index" class="skeleton skeleton-value w-100"></div>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-darkish align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Scan</th>
                <th>Generated</th>
                <th>File</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>#{{ report.id }}</td>
                <td>#{{ report.scan_id }}</td>
                <td>{{ formatDate(report.generated_at) }}</td>
                <td class="text-secondary text-break">{{ report.file_path }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-warning" type="button" @click="downloadReport(report)">
                    Download
                  </button>
                </td>
              </tr>
              <tr v-if="!reports.length">
                <td colspan="5" class="text-secondary py-4">No reports have been generated yet.</td>
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
import { onMounted, ref } from 'vue'
import api from '../services/api'

const loading = ref(false)
const error = ref('')
const reports = ref([])

async function loadReports() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/reports')
    reports.value = data || []
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to load reports.'
  } finally {
    loading.value = false
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
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = err?.response?.data?.message || 'Unable to download report.'
  }
}

function formatDate(value) {
  if (!value) return 'Not available'
  return new Date(value).toLocaleString()
}

onMounted(loadReports)
</script>
