<template>
  <div class="glass-card trend-chart-card">
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
    <div v-else-if="!hasSeries" class="empty-state">
      <div class="metric-label">No data yet</div>
      <p class="text-secondary mb-0 mt-2">Run more scans to build this trend.</p>
    </div>
    <div v-else class="trend-chart-frame">
      <canvas ref="canvasEl" height="120" class="trend-chart-canvas"></canvas>
    </div>
    <div v-if="scaleLowLabel || scaleHighLabel" class="trend-chart-scale-note">
      <span v-if="scaleLowLabel">{{ scaleLowLabel }}</span>
      <span v-if="scaleHighLabel">{{ scaleHighLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  timeframe: { type: String, default: 'Last 6 scans' },
  series: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  scaleLowLabel: { type: String, default: '' },
  scaleHighLabel: { type: String, default: '' }
})

const canvasEl = ref(null)
let chartInstance = null
const hasSeries = computed(() => Array.isArray(props.series) && props.series.length > 0)

function renderChart() {
  if (!hasSeries.value) {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    return
  }

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
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          pointRadius: 3,
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1400,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false }
      },
      interaction: {
        mode: 'index',
        intersect: false
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
  async () => {
    await nextTick()
    renderChart()
  },
  { deep: true, flush: 'post' }
)

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
