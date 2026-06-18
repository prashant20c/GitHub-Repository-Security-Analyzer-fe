<template>
  <div class="app-shell">
    <nav class="navbar navbar-expand-lg navbar-dark px-3 py-3">
      <div class="container-fluid glass-card">
        <router-link class="navbar-brand fw-semibold" to="/dashboard">Security Analyzer</router-link>
        <div class="ms-auto d-flex gap-2">
          <router-link class="btn btn-outline-light btn-sm" to="/reports">Reports</router-link>
          <router-link class="btn btn-outline-light btn-sm" to="/login">Login</router-link>
          <router-link class="btn btn-warning btn-sm" to="/register">Register</router-link>
        </div>
      </div>
    </nav>

    <main class="container py-4 py-lg-5">
      <router-view />
    </main>
  </div>
</template>
