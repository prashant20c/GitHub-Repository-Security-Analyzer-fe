<template>
  <div class="glass-card h-100">
    <template v-if="loading">
      <div class="skeleton skeleton-line w-50 mb-3"></div>
      <div class="skeleton skeleton-value w-75 mb-3"></div>
      <div class="skeleton skeleton-line w-100"></div>
    </template>
    <template v-else>
      <div class="metric-label">{{ label }}</div>
      <div class="metric-value mt-2">{{ value }}</div>
      <p v-if="hint" class="text-secondary mb-0 mt-2">{{ hint }}</p>
    </template>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})
</script>
