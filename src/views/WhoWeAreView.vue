<template>
  <div class="landing-page">
    <section class="landing-hero container">
      <div class="hero-orb hero-orb-a"></div>
      <div class="hero-orb hero-orb-b"></div>
      <div class="row align-items-center g-4 g-xl-5 position-relative">
        <div class="col-lg-7">
          <div class="hero-chip-row">
            <span class="hero-chip">Student Project</span>
            <span class="hero-chip">DevSecOps</span>
            <span class="hero-chip">AI + ML</span>
          </div>
          <div class="section-label">Who We Are</div>
          <h1 class="display-title mt-3">
            We are a student team building GIT Code Analyzer for GitHub repositories.
          </h1>
          <p class="hero-copy mt-4">
            This page introduces the people behind the project, the project title, and the goals we are aiming to
            achieve through the implementation.
          </p>
          <div class="d-flex flex-wrap gap-3 mt-4">
            <router-link class="btn btn-warning btn-lg fw-semibold" to="/home">Back to home</router-link>
            <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/register">Use the app</router-link>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="glass-card project-banner h-100">
            <div class="section-label">Project Title</div>
            <h2 class="section-title mt-3">GIT Code Analyzer</h2>
            <p class="section-copy mt-3 mb-0">
              Built to scan public repositories, generate AI remediation advice, and show trend analytics over time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block">
      <div class="row g-4 align-items-start">
        <div class="col-lg-4">
          <div class="section-label">Student Details</div>
          <h2 class="section-title mt-3">The team behind the project.</h2>
          <p class="section-copy mt-3 mb-0">
            Each member contributes to a specific part of the system: backend, frontend, security analysis, and AI /
            analytics.
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

    <section class="container section-block">
      <div class="glass-card insight-band">
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="section-label">Short Term Goal</div>
            <p class="section-copy mt-3 mb-0">
              Deliver a fully working end-to-end system with secure login, repository management, live scans, AI
              recommendations, PDF reports, and trend visualization.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="section-label">Long Term Goal</div>
            <p class="section-copy mt-3 mb-0">
              Evolve the platform into a stronger continuous security intelligence product with improved ML insights,
              automated reporting, and more collaborative security workflows.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="container section-block pb-5">
      <div class="cta-band">
        <div>
          <div class="section-label">Our Direction</div>
          <h2 class="cta-title mt-3">A practical student project with real security workflow value.</h2>
          <p class="section-copy mt-3 mb-0">
            The project combines development, security, analytics, and AI into a single platform.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-3">
          <router-link class="btn btn-warning btn-lg fw-semibold" to="/home">Home page</router-link>
          <router-link class="btn btn-outline-light btn-lg fw-semibold" to="/login">Dashboard access</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const students = [
  { name: 'Prashant Poudel', id: 'SM20241901' },
  { name: 'Dipak Acharya', id: 'SM20242323' },
  { name: 'Sudip Gautam', id: 'SM20240532' },
  { name: 'Sagar Dhakal', id: 'SM20240146' }
]
</script>
