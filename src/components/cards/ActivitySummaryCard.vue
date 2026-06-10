<template>
  <div class="activity-summary-card-wrapper">
    <div class="card h-100 activity-summary-card">
      <div class="card-body p-4">
        <!-- Icon and Title -->
        <div class="d-flex align-items-center mb-3">
          <div
            class="symbol symbol-45px me-3"
            :style="{ backgroundColor: bgColor || '#2196f3' }"
          >
            <span class="symbol-label">
              <i :class="icon || 'fas fa-tasks'" class="fs-2 activity-icon"></i>
            </span>
          </div>
          <div class="flex-grow-1">
            <h5 class="fw-bold text-dark mb-0 fs-6">{{ activityName }}</h5>
          </div>
        </div>

        <!-- Time Information -->
        <div class="activity-times">
          <!-- Earliest Active -->
          <div class="time-row mb-2">
            <div class="d-flex align-items-center justify-content-between">
              <span class="text-muted fs-8">{{
                t("dashboard.activities.summary.earliestActive") ||
                "Pertama Aktif"
              }}</span>
              <span class="fw-semibold text-dark fs-8">
                {{ earliestActiveFormatted }}
              </span>
            </div>
          </div>

          <!-- Latest Active -->
          <div class="time-row">
            <div class="d-flex align-items-center justify-content-between">
              <span class="text-muted fs-8">{{
                t("dashboard.activities.summary.latestActive") ||
                "Terakhir Aktif"
              }}</span>
              <span class="fw-semibold text-dark fs-8">
                {{ latestActiveFormatted }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "ActivitySummaryCardComponent",
});

import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatDateTimeGMT8 } from "@/core/helpers/timezone";

const { t } = useI18n();

interface Props {
  activityName: string;
  earliestActive: string | null;
  latestActive: string | null;
  icon?: string;
  bgColor?: string;
}

const props = defineProps<Props>();

const earliestActiveFormatted = computed(() => {
  if (!props.earliestActive) {
    return (
      t("dashboard.activities.summary.noActivity") || "Belum ada aktivitas"
    );
  }
  return formatDateTimeGMT8(props.earliestActive, "HH:mm:ss");
});

const latestActiveFormatted = computed(() => {
  if (!props.latestActive) {
    return (
      t("dashboard.activities.summary.noActivity") || "Belum ada aktivitas"
    );
  }
  return formatDateTimeGMT8(props.latestActive, "HH:mm:ss");
});
</script>

<style scoped>
.activity-summary-card {
  border: 1px solid #e4e6ef;
}

.symbol {
  border: none !important;
}

.activity-icon {
  color: #1a1a1a !important;
  opacity: 1 !important;
}

[data-bs-theme="dark"] .activity-icon,
.dark .activity-icon,
.app-dark .activity-icon {
  color: #ffffff !important;
}

.time-row {
  padding: 0.25rem 0;
}

.activity-times {
  border-top: 1px dashed #e4e6ef;
  padding-top: 0.75rem;
}
</style>
