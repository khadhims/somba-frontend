<template>
  <tr>
    <td v-for="i in columns" :key="`col-${i}`" class="text-center py-4">
      <div class="d-flex align-items-center justify-content-center gap-2">
        <SkeletonBlock :width="blockWidth(i)" :height="14" />
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineOptions({
  name: "SkeletonTableRowComponent",
});

import SkeletonBlock from "./SkeletonBlock.vue";

const props = defineProps({
  columns: { type: Number, default: 5 },
  dense: { type: Boolean, default: false },
});

const blockWidth = (i: number) => (props.dense ? 80 : i % 2 ? 120 : 160);
</script>

<style scoped>
/* table row skeleton adjusts with theme via SkeletonBlock */
</style>
