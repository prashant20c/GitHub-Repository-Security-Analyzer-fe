<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel">
        <div class="section-label">Repository Detail</div>
        <h1 class="page-title">Scan history, trends, and scheduling.</h1>
        <p class="page-subtitle mb-0">A repository overview with score trends, recent scans, and configuration actions.</p>
      </div>
    </div>
    <div class="col-lg-8">
      <TrendChart
        label="Security"
        title="Security score history"
        timeframe="Last 5 scans"
        :series="series"
      />
    </div>
    <div class="col-lg-4">
      <div class="glass-card h-100">
        <h2 class="h5">Recent scans</h2>
        <ul class="list-group list-group-flush">
          <li class="list-group-item bg-transparent text-light border-secondary-subtle px-0">No scans yet</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import TrendChart from '../components/TrendChart.vue'

const series = [
  { label: 'Run 1', value: 100 },
  { label: 'Run 2', value: 94 },
  { label: 'Run 3', value: 88 },
  { label: 'Run 4', value: 91 },
  { label: 'Run 5', value: 96 }
]
</script>
