<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center py-10"
  >
    <div class="text-center">
      <i class="ki-duotone ki-questionnaire-tablet fs-4x text-muted mb-4">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
      <h3 class="fw-semibold text-gray-500 mb-2">{{ title }}</h3>
      <p class="text-muted fs-6 mb-0">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "ControlPlaneEmptyState",
});

defineProps<{
  title: string;
  description: string;
}>();
</script>
