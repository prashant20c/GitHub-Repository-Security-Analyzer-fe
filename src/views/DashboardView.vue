<template>
  <section class="row g-4">
    <div class="col-12">
      <div class="hero-panel d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        <div>
          <div class="section-label">Security Overview</div>
          <h1 class="page-title">Repository risk, trends, and remediation in one place.</h1>
          <p class="page-subtitle">
            Track scan history, prioritize vulnerabilities, and review AI guidance for every repository you manage.
          </p>
        </div>
        <router-link class="btn btn-warning btn-lg fw-semibold" to="/repositories/new">Add Repository</router-link>
      </div>
    </div>

    <div class="col-md-6 col-xl-3" v-for="card in cards" :key="card.label">
      <MetricCard :label="card.label" :value="card.value" :hint="card.hint" />
    </div>

    <div class="col-12 col-lg-8">
      <TrendChart
        label="Repository Health"
        title="Overall Health Score"
        timeframe="Trend ready"
        :series="trendSeries"
      />
    </div>

    <div class="col-12 col-lg-4">
      <div class="glass-card h-100">
        <div class="section-label">Latest Activity</div>
        <h2 class="h5 mt-2">Recent scans</h2>
        <ul class="list-group list-group-flush mt-3">
          <li class="list-group-item bg-transparent text-light border-secondary-subtle px-0">
            No scans have been run yet.
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import MetricCard from '../components/MetricCard.vue'
import TrendChart from '../components/TrendChart.vue'

const cards = [
  { label: 'Total Repositories', value: '0', hint: 'Manage multiple GitHub repos' },
  { label: 'Total Scans', value: '0', hint: 'Manual and scheduled scans' },
  { label: 'Average Security Score', value: '100', hint: 'Aggregated over history' },
  { label: 'Highest Risk Repository', value: 'None', hint: 'Prioritization target' }
]

const trendSeries = [
  { label: 'Scan 1', value: 100 },
  { label: 'Scan 2', value: 100 },
  { label: 'Scan 3', value: 100 },
  { label: 'Scan 4', value: 100 },
  { label: 'Scan 5', value: 100 }
]
</script>
