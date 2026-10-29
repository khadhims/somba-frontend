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
      <div class="flex min-w-[250px] max-w-[300px] items-center">
        <div class="mr-3 shrink-0">
          <img
            v-if="row.image_url"
            :src="row.image_url"
            alt="Alert Thumbnail"
            class="h-[60px] w-[60px] rounded object-cover"
            @error="handleImageError"
          />
          <div
            v-else
            class="flex h-[60px] w-[60px] items-center justify-center rounded bg-gray-100 dark:bg-gray-800"
          >
            <i class="ki-duotone ki-picture fs-2x text-gray-400">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
        <div class="flex flex-col">
          <span
            class="font-bold text-gray-900 hover:text-primary dark:text-gray-100"
          >
            {{ row.violation_name || "Unknown Violation" }}
          </span>
          <span class="text-sm text-gray-500">{{ row.camera_name }}</span>
        </div>
      </div>
    </template>

    <template #duration="{ row }">
      <span class="font-bold tabular-nums text-gray-900 dark:text-gray-100">{{
        formatDuration(row.duration_minutes)
      }}</span>
    </template>

    <template #detections="{ row }">
      <span
        class="inline-flex rounded px-2 py-1 text-xs font-semibold tabular-nums"
        :class="badgeVariantClass('primary')"
        >{{ row.total_detections || 0 }}</span
      >
    </template>

    <template #timestamp="{ row }">
      <span
        class="block font-bold tabular-nums text-gray-900 dark:text-gray-100"
        >{{ formatDate(row.timestamp) }}</span
      >
    </template>

    <template #status="{ row }">
      <span
        class="inline-flex rounded px-2 py-1 text-xs font-semibold"
        :class="statusBadgeClass(row.status)"
        >{{ statusLabel(row.status) }}</span
      >
    </template>

    <template #actions="{ row }">
      <button
        @click="viewDetail(row)"
        title="View Detail"
        :disabled="loadingDetail"
        class="flex h-8 w-8 items-center justify-center rounded-md bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
      >
        <i class="ki-duotone ki-eye fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
      </button>
    </template>
  </KTDataTable>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import { badgeVariantClass } from "@/core/helpers/badge";

const props = defineProps<{
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
const statusBadgeClass = (s: string) => {
  const k = normalizeKey(s);
  if (k === "notresolved") return badgeVariantClass("danger");
  if (k === "resolved") return badgeVariantClass("success");
  if (k === "falsealarm") return badgeVariantClass("info");
  return badgeVariantClass("secondary");
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
    parent.innerHTML = `<div class="flex h-[60px] w-[60px] items-center justify-center rounded bg-gray-100 dark:bg-gray-800"><i class="ki-duotone ki-picture fs-2x text-gray-400"><span class="path1"></span><span class="path2"></span></i></div>`;
  }
};
</script>

<style scoped></style>
