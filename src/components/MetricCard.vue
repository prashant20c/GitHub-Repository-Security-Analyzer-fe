<template>
  <div class="glass-card h-100">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value mt-2">{{ value }}</div>
    <p v-if="hint" class="text-secondary mb-0 mt-2">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' }
})
</script>
