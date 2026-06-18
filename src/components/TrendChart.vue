<template>
  <div class="glass-card">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <div class="section-label">{{ label }}</div>
        <h2 class="h5 mb-0 mt-1">{{ title }}</h2>
      </div>
      <span class="status-pill">{{ timeframe }}</span>
    </div>
    <canvas ref="canvasEl" height="120"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  timeframe: { type: String, default: 'Last 6 scans' },
  series: { type: Array, default: () => [] }
})

const canvasEl = ref(null)

onMounted(() => {
  if (!canvasEl.value) return

  const labels = props.series.map((point) => point.label)
  const values = props.series.map((point) => point.value)

  new Chart(canvasEl.value, {
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
})
</script>
