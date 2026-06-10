<template>
  <div class="card skeleton-card border-0">
    <div
      class="card-body p-3 d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center gap-3">
        <div class="symbol" :class="symbolClass">
          <div class="symbol-label">
            <SkeletonBlock :width="symbolSize" :height="symbolSize" />
          </div>
        </div>
        <div class="flex-grow-1">
          <SkeletonBlock :width="titleWidth" :height="18" />
          <div class="mt-2" v-for="n in lines" :key="`ln-${n}`">
            <SkeletonBlock :width="lineWidth(n)" :height="12" />
          </div>
        </div>
      </div>
      <div class="text-end d-none d-md-block">
        <SkeletonBlock :width="badgeWidth" :height="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SkeletonCardComponent",
});

import { computed } from "vue";
import SkeletonBlock from "./SkeletonBlock.vue";

const props = defineProps({
  lines: { type: Number, default: 3 },
  compact: { type: Boolean, default: false },
});

const symbolSize = computed(() => (props.compact ? 40 : 50));
const titleWidth = computed(() => (props.compact ? 120 : 160));
const badgeWidth = computed(() => (props.compact ? 60 : 80));
const symbolClass = computed(() =>
  props.compact ? "symbol-40px" : "symbol-50px"
);
const lineWidth = (n: number) =>
  props.compact ? (n % 2 ? 90 : 140) : n % 2 ? 110 : 180;
</script>

<style scoped>
.skeleton-card {
  background: rgba(245, 247, 250, 0.6);
}

[data-bs-theme="dark"] .skeleton-card,
.dark .skeleton-card,
.app-dark .skeleton-card {
  background: rgba(30, 41, 59, 0.6);
}

.symbol {
  width: auto;
  height: auto;
}

.symbol-50px .symbol-label,
.symbol-40px .symbol-label {
  border-radius: 10px;
  overflow: hidden;
}
</style>
