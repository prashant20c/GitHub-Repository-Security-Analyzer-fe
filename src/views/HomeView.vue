<template>
  <div class="landing-page">
    <section class="landing-hero container" id="who-we-are">
      <div class="hero-orb hero-orb-a"></div>
      <div class="hero-orb hero-orb-b"></div>
      <div class="row align-items-center g-4 g-xl-5 position-relative">
        <div class="col-lg-7">
          <div class="hero-chip-row">
            <span class="hero-chip">Continuous Scanning</span>
            <span class="hero-chip">AI Recommendations</span>
            <span class="hero-chip">Trend Analytics</span>
          </div>
          <div class="section-label">Who We Are</div>
          <h1 class="display-title mt-3">
            Continuous GitHub security intelligence built for teams that ship fast.
          </h1>
          <p class="hero-copy mt-4">
            We combine static security scanning, secret detection, dependency checks, AI remediation, and trend analysis
            into one continuous workflow. The result is a product that helps developers act faster and security teams
            prioritize with clarity.
          </p>
          <div class="d-flex flex-wrap gap-3 mt-4">
            <router-link class="btn btn-warning btn-lg fw-semibold" to="/register">Start scanning</router-link>
            <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/login">Sign in</router-link>
          </div>
          <div class="hero-stats mt-5">
            <div class="hero-stat">
              <span>4 scanners</span>
              <small>Semgrep, Gitleaks, Composer Audit, npm Audit</small>
            </div>
            <div class="hero-stat">
              <span>1 workflow</span>
              <small>Manual and scheduled scans in one flow</small>
            </div>
            <div class="hero-stat">
              <span>1 score</span>
              <small>Security, quality, secret, dependency, and health</small>
            </div>
          </div>
          <div class="trust-strip mt-4">
            <span>Public GitHub repos only</span>
            <span>Safe static analysis</span>
            <span>PDF reports</span>
            <span>Live trend charts</span>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="landing-orbit">
            <div class="landing-orbit-core"></div>
            <div class="orbit-card orbit-card-a">
              <img :src="shieldIcon" alt="Shield icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Security scans</div>
                <p>Detect code issues before they become incidents.</p>
              </div>
            </div>
            <div class="orbit-card orbit-card-b">
              <img :src="radarIcon" alt="Radar icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Live trends</div>
                <p>Track scores over time across every repository.</p>
              </div>
            </div>
            <div class="orbit-card orbit-card-c">
              <img :src="brainIcon" alt="Brain icon" class="feature-icon" />
              <div>
                <div class="orbit-title">AI guidance</div>
                <p>Turn noisy findings into readable remediation steps.</p>
              </div>
            </div>
            <div class="orbit-card orbit-card-d">
              <img :src="chartIcon" alt="Chart icon" class="feature-icon" />
              <div>
                <div class="orbit-title">Reporting</div>
                <p>Generate downloadable PDF evidence for teams.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="glass-card project-banner">
        <div class="row g-4 align-items-start">
          <div class="col-lg-5">
            <div class="section-label">Project Identity</div>
            <h2 class="section-title mt-3">AI-Powered GitHub Repository Security Analyzer and Remediation Advisor</h2>
            <p class="section-copy mt-3 mb-0">
              A DevSecOps platform for scanning public GitHub repositories, generating remediation guidance, and
              tracking security trends over time.
            </p>
          </div>
          <div class="col-lg-7">
            <div class="project-grid">
              <div class="project-card">
                <div class="section-label">Short Term Goal</div>
                <p>Deliver a working end-to-end system with authentication, repository scans, AI recommendations, PDF reports, and trend analytics.</p>
              </div>
              <div class="project-card">
                <div class="section-label">Long Term Goal</div>
                <p>Grow the platform into a continuous security intelligence product with stronger ML insights, better report automation, and team-level collaboration.</p>
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
            <div class="section-label">Why Teams Use It</div>
            <h2 class="section-title mt-3">A product layer on top of security scanning.</h2>
            <p class="section-copy mt-3 mb-0">
              We turn raw scanner output into a working system that developers can understand and security teams can
              operationalize.
            </p>
          </div>
          <div class="col-lg-7">
            <div class="signal-grid">
              <article class="signal-card">
                <h3>For developers</h3>
                <p>Fast, readable findings with AI explanations and secure code examples.</p>
              </article>
              <article class="signal-card">
                <h3>For security teams</h3>
                <p>Consistent scoring, historical trends, and report-ready outputs for review.</p>
              </article>
              <article class="signal-card">
                <h3>For managers</h3>
                <p>Health scores and remediation priorities that make risk easier to track.</p>
              </article>
              <article class="signal-card">
                <h3>For operations</h3>
                <p>Scheduled scans, queue-backed jobs, and repeatable evidence generation.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block" id="team">
      <div class="row g-4 align-items-start">
        <div class="col-lg-4">
          <div class="section-label">Student Details</div>
          <h2 class="section-title mt-3">Who is building the project.</h2>
          <p class="section-copy mt-3 mb-0">
            The team is responsible for the backend workflow, frontend experience, scanning pipeline, AI integration,
            and reporting.
          </p>
        </div>
        <div class="col-lg-8">
          <div class="glass-card team-card">
            <div class="table-responsive">
              <table class="table table-darkish align-middle mb-0">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in students" :key="student.id">
                    <td>{{ student.name }}</td>
                    <td>{{ student.id }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block" id="what-we-do">
      <div class="row g-4">
        <div class="col-12 col-xl-5">
          <div class="section-label">What We Do</div>
          <h2 class="section-title mt-3">A security platform with product design, not just logs.</h2>
          <p class="section-copy mt-3">
            The frontend is designed around clarity, speed, and motion. Each page turns raw scanner output into a
            workflow a developer can understand in seconds.
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

    <section class="container section-block" id="how-it-works">
      <div class="section-label">How It Works</div>
      <h2 class="section-title mt-3">From repository onboarding to automated remediation.</h2>
      <div class="workflow-line mt-4">
        <div v-for="step in steps" :key="step.title" class="workflow-step">
          <div class="workflow-index">{{ step.index }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <section class="container section-block" id="stack">
      <div class="row g-4 align-items-start">
        <div class="col-lg-5">
          <div class="section-label">Built For</div>
          <h2 class="section-title mt-3">Teams that need continuous visibility without manual overhead.</h2>
          <p class="section-copy mt-3">
            This stack is built for public repositories, recurring scans, historical context, and clear reporting for
            both engineering and security reviewers.
          </p>
        </div>
        <div class="col-lg-7">
          <div class="glass-card stack-card">
            <div class="stack-grid">
              <span v-for="item in stackItems" :key="item" class="stack-pill">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block pb-5">
      <div class="cta-band">
        <div>
          <div class="section-label">Ready to start</div>
          <h2 class="cta-title mt-3">Scan a repository and see the security story unfold.</h2>
          <p class="section-copy mt-3 mb-0">Create an account, connect a public repo, and start your first scan.</p>
        </div>
        <div class="d-flex flex-wrap gap-3">
          <router-link class="btn btn-warning btn-lg fw-semibold" to="/register">Create account</router-link>
          <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/login">See the app</router-link>
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
    description: 'Automate scans manually or on schedule, then surface findings in a single workflow.',
    icon: shieldIcon
  },
  {
    title: 'Trend intelligence',
    description: 'Use live security, secret, dependency, and quality charts to track drift over time.',
    icon: radarIcon
  },
  {
    title: 'AI remediation',
    description: 'Convert technical findings into plain English guidance and secure code examples.',
    icon: brainIcon
  },
  {
    title: 'Executive reporting',
    description: 'Export professional PDF evidence with scores, trends, and remediation checklists.',
    icon: chartIcon
  }
]

const students = [
  { name: 'Prashant Poudel', id: 'SM20241901' },
  { name: 'Dipak Acharya', id: 'SM20242323' },
  { name: 'Sudip Gautam', id: 'SM20240532' },
  { name: 'Sagar Dhakal', id: 'SM20240146' }
]

const steps = [
  { index: '01', title: 'Connect a repository', description: 'Add a public GitHub repo and choose manual or scheduled scanning.' },
  { index: '02', title: 'Run static analysis', description: 'Clone safely, scan without executing code, and normalize findings.' },
  { index: '03', title: 'Generate guidance', description: 'Create AI explanations, business impact, and fixes for each issue.' },
  { index: '04', title: 'Track the trend', description: 'Persist scan history so your charts show improvement or regression.' }
]

const stackItems = [
  'Vue 3',
  'Bootstrap 5',
  'Pinia',
  'Axios',
  'Chart.js',
  'Laravel Sanctum',
  'Queues',
  'Scheduler',
  'Semgrep',
  'Gitleaks',
  'Composer Audit',
  'npm Audit',
  'OpenAI'
]
</script>
