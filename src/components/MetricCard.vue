<template>
  <div class="glass-card h-100">
    <template v-if="loading">
      <div class="skeleton skeleton-line w-50 mb-3"></div>
      <div class="skeleton skeleton-value w-75 mb-3"></div>
      <div class="skeleton skeleton-line w-100"></div>
    </template>
    <template v-else>
      <div class="metric-label">{{ label }}</div>
      <div class="metric-value mt-2" :class="{ 'metric-value-animated': showAnimation }">
        <span v-if="showAnimation">{{ animatedValue }}</span>
        <span v-else>{{ value }}</span>
      </div>
      <p v-if="hint" class="text-secondary mb-0 mt-2">{{ hint }}</p>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  hint: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  animate: { type: Boolean, default: false }
})

const animatedValue = ref(props.value)
let animationFrame = null
let animationToken = 0

const numericValue = computed(() => {
  if (typeof props.value === 'number' && Number.isFinite(props.value)) {
    return props.value
  }

  if (typeof props.value === 'string' && props.value.trim() !== '') {
    const parsed = Number(props.value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
})

const showAnimation = computed(() => props.animate && numericValue.value !== null)

function cancelAnimation() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

function formatAnimatedValue(value) {
  if (!Number.isFinite(value)) return props.value
  if (Number.isInteger(numericValue.value)) return Math.round(value)

  const stringValue = String(props.value)
  const decimalDigits = stringValue.includes('.') ? stringValue.split('.')[1].length : 1
  return value.toFixed(Math.min(decimalDigits, 2))
}

function animateTo(target) {
  cancelAnimation()
  const currentToken = ++animationToken
  const startValue = 0
  const duration = 900
  const startTime = performance.now()

  const step = (timestamp) => {
    if (currentToken !== animationToken) return

    const progress = Math.min((timestamp - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const nextValue = startValue + (target - startValue) * eased
    animatedValue.value = formatAnimatedValue(nextValue)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step)
    }
  }

  animationFrame = requestAnimationFrame(step)
}

watch(
  () => [props.value, props.animate],
  () => {
    if (!showAnimation.value) {
      animatedValue.value = props.value
      cancelAnimation()
      return
    }

    animatedValue.value = formatAnimatedValue(0)
    animateTo(numericValue.value)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  cancelAnimation()
})
</script>
