<template>
  <section class="hero-panel mx-auto" style="max-width: 720px;">
    <div class="section-label">Repository Intake</div>
    <h1 class="page-title">Add a public GitHub repository.</h1>
    <p class="page-subtitle mb-4">Submit the repository URL and choose how often the scheduler should re-scan it.</p>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">GitHub Repository URL</label>
        <input
          v-model.trim="form.url"
          class="form-control form-control-lg"
          type="url"
          placeholder="https://github.com/owner/repo"
          required
        />
        <small class="text-secondary d-block mt-2">Only public GitHub repositories are accepted by the backend.</small>
      </div>
      <div class="mb-3">
        <label class="form-label">Scan Frequency</label>
        <select v-model="form.scan_frequency" class="form-select form-select-lg">
          <option value="manual">manual</option>
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
        </select>
      </div>
      <p v-if="error" class="text-danger small">{{ error }}</p>
      <button class="btn btn-warning btn-lg fw-semibold" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Repository' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { getApiErrorMessage } from '../services/errors'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  url: '',
  scan_frequency: 'manual'
})

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.post('/repositories', {
      url: form.url.trim(),
      scan_frequency: form.scan_frequency
    })
    router.push(`/repositories/${data.id}`)
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Unable to save repository.')
  } finally {
    loading.value = false
  }
}
</script>
