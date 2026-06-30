<template>
  <KTDataTable
    :data="alerts"
    :header="header"
    :checkbox-enabled="false"
    :items-per-page-dropdown-enabled="false"
    :items-per-page="pagination.per_page"
    :current-page="pagination.page"
    :total="pagination.total_items"
    :loading="loading"
    :sort-label="sortLabel"
    :sort-order="sortOrder"
    @on-sort="onSort"
    :empty-table-text="t('appsEventsAlerts.alertsTable.empty')"
  >
    <template #alert_name="{ row }">
      <div
        class="d-flex align-items-center"
        style="max-width: 300px; min-width: 250px"
      >
        <div class="me-3">
          <img
            v-if="row.image_url"
            :src="row.image_url"
            class="rounded"
            alt="Alert Thumbnail"
            style="width: 60px; height: 60px; object-fit: cover"
            @error="handleImageError"
          />
          <div
            v-else
            class="bg-light rounded d-flex align-items-center justify-content-center"
            style="width: 60px; height: 60px"
          >
            <i class="ki-duotone ki-picture fs-2x text-muted"
              ><span class="path1"></span><span class="path2"></span
            ></i>
          </div>
        </div>
        <div class="d-flex flex-column">
          <span class="text-dark fw-bold text-hover-primary fs-6">
            {{ formatViolationName(row.violation_name) || "Unknown Violation" }}
          </span>
          <span class="text-muted fs-7">{{ row.camera_name }}</span>
        </div>
      </div>
    </template>

    <template #duration="{ row }">
      <span class="text-dark fw-bold fs-6">{{
        formatDuration(row.duration_minutes)
      }}</span>
    </template>

    <template #detections="{ row }">
      <span class="badge badge-light-primary fs-6">{{
        row.total_detections || 0
      }}</span>
    </template>

    <template #timestamp="{ row }">
      <span class="text-dark fw-bold d-block fs-6">{{
        formatDate(row.timestamp)
      }}</span>
    </template>

    <template #status="{ row }">
      <span class="badge" :class="statusBadge(row.status)">{{
        statusLabel(row.status)
      }}</span>
    </template>

    <template #actions="{ row }">
      <button
        @click="viewDetail(row)"
        class="btn btn-sm btn-light-primary btn-icon"
        title="View Detail"
        :disabled="loadingDetail"
      >
        <i class="ki-duotone ki-eye fs-2"
          ><span class="path1"></span><span class="path2"></span
          ><span class="path3"></span
        ></i>
      </button>
    </template>
  </KTDataTable>
</template>

<script setup lang="ts">
defineOptions({
  name: "AlertsTableComponent",
});

import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import { formatViolationName } from "@/core/helpers/operations-mapper";

defineProps<{
  alerts: any[];
  header: any[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  loading: boolean;
  loadingDetail: boolean;
  sortLabel: string;
  sortOrder: "asc" | "desc";
}>();

const emit = defineEmits<{
  (e: "sort", payload: { label: string; order: "asc" | "desc" }): void;
  (e: "view-detail", alert: any): void;
}>();

const { t } = useI18n();

const onSort = (s: { label: string; order: "asc" | "desc" }) => emit("sort", s);
const viewDetail = (a: any) => emit("view-detail", a);

const formatDate = (ts?: string) => {
  if (!ts || ts === "Unknown Timestamp") return ts || "-";
  try {
    return new Date(ts).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return ts;
  }
};
const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
const formatDuration = (m?: number | null) => {
  if (m === undefined || m === null || Number.isNaN(m))
    return t("appsEventsAlerts.format.notAvailable");
  if (m < 1)
    return t("appsEventsAlerts.format.secondsLong", {
      value: formatNumber(Math.max(0, m * 60), 2),
    });
  return t("appsEventsAlerts.format.minutesLong", {
    value: formatNumber(Math.max(0, m), 2),
  });
};
const normalizeKey = (v?: string) =>
  (v || "").toLowerCase().replace(/[\s_-]/g, "");
const statusBadge = (s: string) => {
  const k = normalizeKey(s);
  if (k === "notresolved") return "badge-light-danger";
  if (k === "resolved") return "badge-light-success";
  if (k === "falsealarm") return "badge-light-info";
  if (!s || s === "No Status") return "badge-light-secondary";
  return "badge-light-secondary";
};
const statusLabel = (s: string) => {
  if (!s || s === "No Status") return s || "No Status";
  const k = normalizeKey(s);
  if (k === "notresolved")
    return (
      t("appsEventsAlerts.alertsTable.status.unresolved") || "Belum Selesai"
    );
  if (k === "resolved")
    return t("appsEventsAlerts.alertsTable.status.resolved") || "Selesai";
  if (k === "falsealarm")
    return t("appsEventsAlerts.alertsTable.status.falseAlarm") || "Alarm Palsu";
  return s;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.style.display = "none";
  const parent = target.parentElement;
  if (parent) {
    parent.innerHTML = `<div class='bg-light rounded d-flex align-items-center justify-content-center' style='width:60px;height:60px;'><i class='ki-duotone ki-picture fs-2x text-muted'><span class='path1'></span><span class='path2'></span></i></div>`;
  }
};
</script>

<style scoped></style>
