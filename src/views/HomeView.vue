<template>
  <div class="landing-page">
    <section class="landing-hero container">
      <div class="hero-orb hero-orb-a"></div>
      <div class="hero-orb hero-orb-b"></div>
      <div class="row align-items-center g-4 g-xl-5 position-relative">
        <div class="col-lg-7">
          <div class="hero-chip-row">
            <span class="hero-chip">Continuous Scanning</span>
            <span class="hero-chip">Trend Analytics</span>
            <span class="hero-chip">Report Automation</span>
          </div>
          <div class="section-label">Home</div>
          <h1 class="display-title mt-3">
            Security visibility for GitHub repositories, built for teams that move fast.
          </h1>
          <p class="hero-copy mt-4">
            Monitor public repositories with safe static analysis, automated reports, historical trend charts, and
            AI-backed remediation guidance. The home page focuses on the product value, not the team details.
          </p>
          <div class="d-flex flex-wrap gap-3 mt-4">
            <router-link class="btn btn-warning btn-lg fw-semibold" to="/register">Get started</router-link>
            <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/login">Sign in</router-link>
            <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/who-we-are">Who we are</router-link>
          </div>
          <div class="hero-stats mt-5">
            <div class="hero-stat">
              <span>4 scanners</span>
              <small>Semgrep, Gitleaks, Composer Audit, npm Audit</small>
            </div>
            <div class="hero-stat">
              <span>Live trends</span>
              <small>Security, dependency, secret, and quality charts</small>
            </div>
            <div class="hero-stat">
              <span>AI advice</span>
              <small>Human-readable remediation and code examples</small>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="landing-orbit">
            <div class="landing-orbit-core"></div>
            <div class="orbit-card orbit-card-a">
              <img :src="shieldIcon" alt="Shield icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Scan repositories</div>
                <p>Detect vulnerabilities before they reach production.</p>
              </div>
            </div>
            <div class="orbit-card orbit-card-b">
              <img :src="radarIcon" alt="Radar icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Track drift</div>
                <p>See whether the repository is improving or regressing.</p>
              </div>
            </div>
            <div class="orbit-card orbit-card-c">
              <img :src="brainIcon" alt="Brain icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Get guidance</div>
                <p>Turn findings into practical fixes for the team.</p>
              </div>
            </div>
            <div class="orbit-card orbit-card-d">
              <img :src="chartIcon" alt="Chart icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Export reports</div>
                <p>Generate PDF evidence for review and documentation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="glass-card insight-band">
        <div class="row g-4 align-items-center">
          <div class="col-lg-5">
            <div class="section-label">Why It Matters</div>
            <h2 class="section-title mt-3">One workflow from scan to remediation.</h2>
            <p class="section-copy mt-3 mb-0">
              The home experience explains the product flow and the outcomes: actionable security checks, trend
              tracking, and downloadable reporting.
            </p>
          </div>
          <div class="col-lg-7">
            <div class="signal-grid">
              <article class="signal-card">
                <h3>Reduce manual review time</h3>
                <p>Centralize scan results and prioritize what matters first.</p>
              </article>
              <article class="signal-card">
                <h3>Spot regressions early</h3>
                <p>Track score movement over time instead of relying on one-off reports.</p>
              </article>
              <article class="signal-card">
                <h3>Improve handoff quality</h3>
                <p>Keep findings, recommendations, and reports aligned for the team.</p>
              </article>
              <article class="signal-card">
                <h3>Stay deployment-safe</h3>
                <p>Run static checks without executing repository code.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="row g-4">
        <div class="col-12 col-xl-5">
          <div class="section-label">Product Snapshot</div>
          <h2 class="section-title mt-3">Designed for scanning, tracking, and reporting.</h2>
          <p class="section-copy mt-3">
            The landing page highlights what the platform does, how the scans work, and why it gives teams a better
            security workflow.
          </p>
        </div>
        <div class="col-12 col-xl-7">
          <div class="row g-3">
            <div v-for="feature in features" :key="feature.title" class="col-md-6">
              <article class="feature-card h-100">
                <img :src="feature.icon" :alt="`${feature.title} icon`" class="feature-icon feature-icon-lg" />
                <h3>{{ feature.title }}</h3>
                <p>{{ feature.description }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="cta-band">
        <div>
          <div class="section-label">Next Step</div>
          <h2 class="cta-title mt-3">Open the app and connect a public repository.</h2>
          <p class="section-copy mt-3 mb-0">Start with a login, add a repository, and let the scanner do the rest.</p>
        </div>
        <div class="d-flex flex-wrap gap-3">
          <router-link class="btn btn-warning btn-lg fw-semibold" to="/register">Create account</router-link>
          <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/who-we-are">Meet the team</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import shieldIcon from '../assets/icons/shield-gradient.svg'
import radarIcon from '../assets/icons/radar-gradient.svg'
import brainIcon from '../assets/icons/brain-gradient.svg'
import chartIcon from '../assets/icons/chart-gradient.svg'

const features = [
  {
    title: 'Continuous scanning',
    description: 'Automate manual, daily, weekly, or monthly scans for each public repository.',
    icon: shieldIcon
  },
  {
    title: 'Trend dashboards',
    description: 'Use live chart data to watch security, secret, dependency, and quality scores.',
    icon: radarIcon
  },
  {
    title: 'AI remediation',
    description: 'Generate readable explanations, business impact, and secure code suggestions.',
    icon: brainIcon
  },
  {
    title: 'Report export',
    description: 'Generate and download PDF reports for evidence, review, and presentation.',
    icon: chartIcon
  }
]
</script>
