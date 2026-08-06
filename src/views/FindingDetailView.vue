<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Finding Detail</div>
          <h1 class="page-title">{{ finding?.title || 'Detailed vulnerability review.' }}</h1>
          <p class="page-subtitle mb-0">
            Inspect the affected file, understand the impact, and regenerate AI guidance when needed.
          </p>
        </div>
        <button class="btn btn-outline-warning" type="button" @click="generateRecommendation" :disabled="loading || generating">
          {{ generating ? 'Generating...' : 'Generate Recommendation' }}
        </button>
      </div>
    </div>

    <div class="col-12" v-if="error">
      <div class="page-alert">{{ error }}</div>
    </div>

    <div class="col-lg-6">
      <div class="glass-card h-100">
        <div class="section-label">Finding Metadata</div>
        <h2 class="h5 mb-3 mt-1">Vulnerability context</h2>
        <div v-if="loading" class="vstack gap-3">
          <div v-for="index in 4" :key="index" class="skeleton skeleton-value w-100"></div>
        </div>
        <div v-else class="vstack gap-3">
          <div>
            <div class="text-secondary small">Repository</div>
            <div class="fw-semibold">{{ repositoryLabel }}</div>
          </div>
          <div>
            <div class="text-secondary small">Severity</div>
            <div class="fw-semibold">{{ finding?.severity || 'Unknown' }}</div>
          </div>
          <div>
            <div class="text-secondary small">Tool</div>
            <div class="fw-semibold">{{ finding?.tool || 'Unknown' }}</div>
          </div>
          <div>
            <div class="text-secondary small">File</div>
            <div class="fw-semibold text-break">{{ finding?.file_path || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-secondary small">Line</div>
            <div class="fw-semibold">{{ finding?.line_number || 'N/A' }}</div>
          </div>
          <div>
            <div class="text-secondary small">OWASP / CWE</div>
            <div class="fw-semibold">
              {{ finding?.owasp_category || 'N/A' }}<span v-if="finding?.cwe_id"> · {{ finding.cwe_id }}</span>
            </div>
          </div>
          <div>
            <div class="text-secondary small">Risk score</div>
            <div class="fw-semibold">{{ finding?.risk_score ?? 'N/A' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="glass-card h-100">
        <div class="section-label">Code Snippet</div>
        <h2 class="h5 mb-3 mt-1">Affected code</h2>
        <pre class="code-block mb-0">{{ finding?.code_snippet || 'No snippet was captured.' }}</pre>
      </div>
    </div>

    <div class="col-12">
      <div class="glass-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div class="section-label">AI Recommendation</div>
            <h2 class="h5 mb-0 mt-1">Remediation guidance</h2>
          </div>
          <span class="status-pill">{{ recommendation ? 'Generated' : 'Pending' }}</span>
        </div>

        <div v-if="loading" class="vstack gap-3">
          <div class="skeleton skeleton-line w-50"></div>
          <div class="skeleton skeleton-value w-100"></div>
          <div class="skeleton skeleton-value w-100"></div>
        </div>
        <div v-else class="row g-4">
          <div class="col-md-6">
            <h3 class="h6 text-uppercase text-secondary">Plain English Summary</h3>
            <p class="mb-0">{{ recommendation?.plain_english_summary || 'No recommendation has been generated yet.' }}</p>
          </div>
          <div class="col-md-6">
            <h3 class="h6 text-uppercase text-secondary">Business Impact</h3>
            <p class="mb-0">{{ recommendation?.business_impact || 'No recommendation has been generated yet.' }}</p>
          </div>
          <div class="col-md-6">
            <h3 class="h6 text-uppercase text-secondary">Technical Explanation</h3>
            <p class="mb-0">{{ recommendation?.technical_explanation || 'No recommendation has been generated yet.' }}</p>
          </div>
          <div class="col-md-6">
            <h3 class="h6 text-uppercase text-secondary">Recommended Fix</h3>
            <p class="mb-0">{{ recommendation?.recommended_fix || 'No recommendation has been generated yet.' }}</p>
          </div>
          <div class="col-12">
            <h3 class="h6 text-uppercase text-secondary">Secure Code Example</h3>
            <pre class="code-block mb-0">{{ recommendation?.secure_code_example || 'No secure code example available yet.' }}</pre>
          </div>
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
import { getApiErrorMessage } from '../services/errors'

const route = useRoute()
const loading = ref(false)
const generating = ref(false)
const error = ref('')
const finding = ref(null)
const recommendation = ref(null)

const repositoryLabel = computed(() => {
  const repository = finding.value?.scan?.repository
  if (!repository) return 'Unknown repository'

  return `${repository.owner}/${repository.name}`
})

async function loadFinding() {
  loading.value = true
  error.value = ''

  try {
    const { data } = await api.get(`/findings/${route.params.id}`)
    finding.value = data
    recommendation.value = data.recommendation || null
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to load finding.')
  } finally {
    loading.value = false
  }
}

async function generateRecommendation() {
  generating.value = true
  error.value = ''

  try {
    const { data } = await api.post(`/findings/${route.params.id}/generate-recommendation`)
    recommendation.value = data
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to generate recommendation.')
  } finally {
    generating.value = false
  }
}

onMounted(loadFinding)

watch(
  () => route.params.id,
  async () => {
    await loadFinding()
  }
)
</script>
