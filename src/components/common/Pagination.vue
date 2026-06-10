<template>
  <div class="d-flex flex-stack flex-wrap pt-10">
    <div class="d-flex align-items-center">
      <div class="fs-6 fw-semibold text-gray-700 me-5">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries
      </div>

      <div class="d-flex align-items-center">
        <span class="fs-6 fw-semibold text-gray-500">
          Page {{ page }} of {{ totalPagesComputed }}
        </span>
      </div>
    </div>

    <ul class="pagination">
      <li class="page-item" :class="{ disabled: page <= 1 }">
        <button
          class="page-link"
          @click="goToPage(page - 1)"
          :disabled="page <= 1"
          title="Previous page"
        >
          ‹
        </button>
      </li>

      <li
        v-for="p in visiblePages"
        :key="p"
        class="page-item"
        :class="{ active: p === page }"
      >
        <button class="page-link" @click="goToPage(p)">{{ p }}</button>
      </li>

      <li class="page-item" :class="{ disabled: page >= totalPagesComputed }">
        <button
          class="page-link"
          @click="goToPage(page + 1)"
          :disabled="page >= totalPagesComputed"
          title="Next page"
        >
          ›
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "PaginationComponent",
});

import { computed } from "vue";

const props = defineProps({
  page: { type: Number, required: true },
  perPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  totalPages: { type: Number, required: false },
  maxVisible: { type: Number, default: 5 },
});

const emit = defineEmits(["page-change", "per-page-change"]);

const totalPagesComputed = computed(() => {
  // Always calculate from totalItems and perPage for accuracy
  const calculated = Math.max(
    1,
    Math.ceil((props.totalItems || 0) / (props.perPage || 1))
  );

  // Use props.totalPages only if it's reasonable, otherwise use calculated
  if (typeof props.totalPages === "number" && props.totalPages > 0) {
    // If API totalPages is significantly different from calculated, prefer calculated
    if (Math.abs(props.totalPages - calculated) > 1) {
      console.warn(
        `Pagination mismatch: API says ${props.totalPages} pages, calculated ${calculated} pages. Using calculated.`
      );
      return calculated;
    }
    return props.totalPages;
  }

  return calculated;
});

const startItem = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.page - 1) * props.perPage + 1;
});

const endItem = computed(() => {
  return Math.min(props.page * props.perPage, props.totalItems);
});

const visiblePages = computed(() => {
  const current = props.page;
  const total = totalPagesComputed.value;
  const pages: number[] = [];
  const maxVisible = props.maxVisible;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

function goToPage(p: number) {
  const tp = totalPagesComputed.value;
  if (p < 1 || p > tp) return;
  emit("page-change", p);
}
</script>

<style scoped>
.pagination {
  margin: 0;
}
</style>
