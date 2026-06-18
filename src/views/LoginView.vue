<template>
  <section class="hero-panel mx-auto" style="max-width: 460px;">
    <div class="section-label">Access</div>
    <h1 class="page-title">Welcome back.</h1>
    <p class="page-subtitle mb-4">Sign in to review scans, findings, and remediation guidance.</p>
    <form @submit.prevent>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input class="form-control form-control-lg" type="email" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input class="form-control form-control-lg" type="password" />
      </div>
      <button class="btn btn-warning btn-lg w-100 fw-semibold">Sign in</button>
    </form>
  </section>
</template>
