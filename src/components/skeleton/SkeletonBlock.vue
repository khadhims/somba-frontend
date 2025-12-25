<template>
  <div class="skeleton" :style="styleObject"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  width: { type: [String, Number], default: '100%' },
  height: { type: [String, Number], default: 16 },
  circle: { type: Boolean, default: false },
});

const styleObject = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  borderRadius: props.circle ? '9999px' : '8px',
}));
</script>

<style scoped>
.skeleton {
  display: block;
  position: relative;
  overflow: hidden;
  background: #e9edf3;
}

[data-bs-theme="dark"] .skeleton,
.dark .skeleton,
.app-dark .skeleton {
  background: #1f2937;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>