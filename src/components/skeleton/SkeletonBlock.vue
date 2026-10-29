<template>
  <div
    class="relative block overflow-hidden bg-[#e9edf3] after:absolute after:inset-0 after:[transform:translateX(-100%)] after:animate-[shimmer_1.2s_infinite] after:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0)_100%)] after:content-[''] dark:bg-[#1f2937]"
    :style="styleObject"
  ></div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SkeletonBlockComponent",
});

import { computed } from "vue";

const props = defineProps({
  width: { type: [String, Number], default: "100%" },
  height: { type: [String, Number], default: 16 },
  circle: { type: Boolean, default: false },
});

const styleObject = computed(() => ({
  width: typeof props.width === "number" ? `${props.width}px` : props.width,
  height: typeof props.height === "number" ? `${props.height}px` : props.height,
  borderRadius: props.circle ? "9999px" : "8px",
}));
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
