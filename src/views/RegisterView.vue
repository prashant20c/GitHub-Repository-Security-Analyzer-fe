<template>
  <section class="hero-panel mx-auto" style="max-width: 460px;">
    <div class="section-label">Create Account</div>
    <h1 class="page-title">Start scanning repositories.</h1>
    <p class="page-subtitle mb-4">Register to manage repositories, schedule scans, and review AI recommendations.</p>
    <form @submit.prevent>
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input class="form-control form-control-lg" type="text" />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input class="form-control form-control-lg" type="email" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input class="form-control form-control-lg" type="password" />
      </div>
      <button class="btn btn-warning btn-lg w-100 fw-semibold">Create account</button>
    </form>
  </section>
</template>
