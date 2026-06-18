<template>
  <div class="glass-card">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <div class="section-label">{{ label }}</div>
        <h2 class="h5 mb-0 mt-1">{{ title }}</h2>
      </div>
      <span class="status-pill">{{ timeframe }}</span>
    </div>
    <div v-if="loading" class="chart-skeleton">
      <div class="skeleton skeleton-line w-25 mb-4"></div>
      <div class="skeleton skeleton-chart"></div>
    </div>
    <canvas v-else ref="canvasEl" height="120"></canvas>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  timeframe: { type: String, default: 'Last 6 scans' },
  series: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const canvasEl = ref(null)
let chartInstance = null

function renderChart() {
  if (!canvasEl.value || props.loading) return

  const labels = props.series.map((point) => point.label)
  const values = props.series.map((point) => point.value)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: props.title,
          data: values,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.12)',
          pointRadius: 3,
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.08)' }
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.08)' }
        }
      }
    }
  })
}

onMounted(renderChart)

watch(
  () => [props.loading, props.series],
  () => renderChart(),
  { deep: true }
)

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>
