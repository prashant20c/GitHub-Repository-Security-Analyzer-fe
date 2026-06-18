<template>
  <section class="hero-panel mx-auto" style="max-width: 720px;">
    <div class="section-label">Repository Intake</div>
    <h1 class="page-title">Add a public GitHub repository.</h1>
    <p class="page-subtitle mb-4">Submit the repository URL and choose how often the scheduler should re-scan it.</p>
    <form @submit.prevent>
      <div class="mb-3">
        <label class="form-label">GitHub Repository URL</label>
        <input class="form-control form-control-lg" type="url" placeholder="https://github.com/owner/repo" />
      </div>
      <div class="mb-3">
        <label class="form-label">Scan Frequency</label>
        <select class="form-select form-select-lg">
          <option>manual</option>
          <option>daily</option>
          <option>weekly</option>
          <option>monthly</option>
        </select>
      </div>
      <button class="btn btn-warning btn-lg fw-semibold">Save Repository</button>
    </form>
  </section>
</template>
