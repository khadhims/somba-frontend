<template>
  <div class="skeleton-card rounded-lg border-0">
    <div class="flex items-center justify-between p-3">
      <div class="flex items-center gap-3">
        <div class="overflow-hidden rounded-[10px]">
          <SkeletonBlock :width="symbolSize" :height="symbolSize" />
        </div>
        <div class="flex-1">
          <SkeletonBlock :width="titleWidth" :height="18" />
          <div class="mt-2" v-for="n in lines" :key="`ln-${n}`">
            <SkeletonBlock :width="lineWidth(n)" :height="12" />
          </div>
        </div>
      </div>
      <div class="hidden text-right md:block">
        <SkeletonBlock :width="badgeWidth" :height="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SkeletonBlock from './SkeletonBlock.vue';

const props = defineProps({
  lines: { type: Number, default: 3 },
  compact: { type: Boolean, default: false },
});

const symbolSize = computed(() => (props.compact ? 40 : 50));
const titleWidth = computed(() => (props.compact ? 120 : 160));
const badgeWidth = computed(() => (props.compact ? 60 : 80));
const lineWidth = (n: number) => (props.compact ? (n % 2 ? 90 : 140) : (n % 2 ? 110 : 180));
</script>

<style scoped>
.skeleton-card {
  background: rgba(245, 247, 250, 0.6);
}

:global([data-bs-theme="dark"]) .skeleton-card {
  background: rgba(30, 41, 59, 0.6);
}
</style>