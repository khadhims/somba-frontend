<template>
  <KTDataTable
    :data="events"
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
    :empty-table-text="t('appsEventsAlerts.eventsTable.empty')"
  >
    <template #event_name="{ row }">
      <div class="flex min-w-[250px] max-w-[300px] items-center">
        <div class="mr-3 shrink-0">
          <img
            v-if="row.image_url"
            :src="row.image_url"
            alt="Event Thumbnail"
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
            {{ row.event_name || "Unknown Event" }}
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

    <template #timestamp="{ row }">
      <span
        class="block font-bold tabular-nums text-gray-900 dark:text-gray-100"
        >{{ formatDate(row.event_start) }}</span
      >
      <span class="block text-sm tabular-nums text-gray-500">{{
        formatTime(row.event_start)
      }}</span>
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
        class="flex h-8 w-8 items-center justify-center rounded-md bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.95]"
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
  events: any[];
  header: any[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  loading: boolean;
  sortLabel: string;
  sortOrder: "asc" | "desc";
}>();

const emit = defineEmits<{
  (e: "sort", payload: { label: string; order: "asc" | "desc" }): void;
  (e: "viewDetail", event: any): void;
}>();

const { t } = useI18n();

const onSort = (payload: { label: string; order: "asc" | "desc" }) =>
  emit("sort", payload);
const viewDetail = (event: any) => emit("viewDetail", event);

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
  const parent = img.parentElement;
  if (parent) {
    parent.innerHTML =
      '<div class="flex h-[60px] w-[60px] items-center justify-center rounded bg-gray-100 dark:bg-gray-800"><i class="ki-duotone ki-picture fs-2x text-gray-400"><span class="path1"></span><span class="path2"></span></i></div>';
  }
};

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes))
    return t("appsEventsAlerts.format.notAvailable");
  if ((minutes || 0) < 1)
    return t("appsEventsAlerts.format.secondsLong", {
      value: formatNumber(Math.max(0, (minutes || 0) * 60), 2),
    });
  return t("appsEventsAlerts.format.minutesLong", {
    value: formatNumber(Math.max(0, minutes || 0), 2),
  });
};

// avg_seconds_with_detection hidden per request

const formatDate = (value?: string) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("id-ID", {
      timeZone: "Asia/Makassar",
    });
  } catch {
    return value;
  }
};

const formatTime = (value?: string) => {
  if (!value) return "-";
  try {
    const timeStr = new Date(value).toLocaleTimeString("id-ID", {
      timeZone: "Asia/Makassar",
      hour12: false,
    });
    return timeStr.substring(0, 5);
  } catch {
    return value;
  }
};

const normalizeKey = (v?: string) =>
  (v || "").toLowerCase().replace(/[\s_-]/g, "");
const statusBadgeClass = (status: string) => {
  const k = normalizeKey(status);
  if (k === "active" || k === "unresolved") return badgeVariantClass("danger");
  if (k === "acknowledged") return badgeVariantClass("warning");
  if (k === "resolved" || k === "notresolved")
    return badgeVariantClass("success");
  if (k === "falsedetection") return badgeVariantClass("info");
  return badgeVariantClass("secondary");
};
const statusLabel = (status: string) => {
  const k = normalizeKey(status);
  if (k === "active")
    return t("appsEventsAlerts.eventsTable.status.active") || "Active";
  if (k === "acknowledged")
    return (
      t("appsEventsAlerts.eventsTable.status.acknowledged") || "Acknowledged"
    );
  if (k === "resolved")
    return t("appsEventsAlerts.eventsTable.status.resolved") || "Resolved";
  if (k === "unresolved" || k === "notresolved")
    return t("appsEventsAlerts.eventsTable.status.unresolved") || "Unresolved";
  if (k === "falsedetection")
    return (
      t("appsEventsAlerts.eventsTable.status.falseDetection") ||
      "False Detection"
    );
  return status || "-";
};
</script>
