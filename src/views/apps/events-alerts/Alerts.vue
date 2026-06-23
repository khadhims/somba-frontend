<template>
  <!-- Overview Card -->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center gy-3">
        <div class="col-12 col-md-4">
          <h4 class="card-title mb-0">
            {{ t("appsEventsAlerts.alerts.title") }}
          </h4>
          <p class="text-muted mb-0">
            {{
              currentSite
                ? t("appsEventsAlerts.alerts.subtitleSite", {
                    site: currentSite.name,
                  })
                : t("appsEventsAlerts.alerts.subtitleAll")
            }}
          </p>
        </div>
        <div class="col-12 col-md-8">
          <div
            class="d-flex flex-column flex-md-row justify-content-md-end align-items-start align-items-md-center gap-3"
          >
            <div class="d-flex align-items-center w-100 w-md-auto mb-2 mb-md-0">
              <label class="form-label me-3 mb-0 fw-semibold text-nowrap">{{
                t("appsEventsAlerts.alertsFilters.siteLabel")
              }}</label>
              <select
                v-model="tempSelectedSiteFilter"
                class="form-select form-select-solid w-100 w-md-200px"
                :disabled="loadingSites"
                @change="onTempFilterSiteChange"
              >
                <option value="">
                  {{ t("appsEventsAlerts.alertsFilters.siteAll") }}
                </option>
                <option v-for="site in sites" :key="site.uid" :value="site.uid">
                  {{ site.name }}
                </option>
              </select>
            </div>
            <div class="d-flex align-items-center w-100 w-md-auto">
              <label class="form-label me-3 mb-0 fw-semibold text-nowrap">{{
                t("appsEventsAlerts.alertsFilters.cameraLabel") || "Camera"
              }}</label>
              <select
                v-model="tempSelectedCameraFilter"
                class="form-select form-select-solid w-100 w-md-200px"
                :disabled="loadingCameras || !tempSelectedSiteFilter"
                @change="onTempFilterCameraChange"
              >
                <option value="">
                  {{
                    t("appsEventsAlerts.alertsFilters.cameraAll") ||
                    "All Cameras"
                  }}
                </option>
                <option
                  v-for="camera in cameras"
                  :key="camera.uid"
                  :value="camera.uid"
                >
                  {{ camera.name }}
                </option>
              </select>
            </div>
            <button
              @click="applyFilters"
              class="btn btn-md btn-primary py-3 px-2"
              title="Apply All Filters"
            >
              <i class="ki-duotone ki-check fs-2"
                ><span class="path1"></span><span class="path2"></span
              ></i>
              {{ t("common.apply") || "Apply" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Alerts List -->
  <div class="card">
    <div class="card-header border-0 pt-5">
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("appsEventsAlerts.alerts.title") }}</h3>
      </div>
      <div
        class="card-toolbar d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-center w-100 gap-3"
      >
        <div class="d-flex flex-wrap align-items-center gap-2 w-100 w-xl-auto">
          <div
            class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center me-0 me-sm-2 w-100 w-sm-auto gap-2"
          >
            <div class="d-flex align-items-center w-100 w-sm-auto">
              <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{
                t("appsEventsAlerts.alertsFilters.fromDateLabel")
              }}</label>
              <DatePicker
                ref="dateFromPicker"
                v-model="tempDateFrom"
                size="sm"
                :clearable="true"
                style="width: 100%; min-width: 140px"
                class="w-100 w-sm-auto"
              />
            </div>
            <div class="d-flex align-items-center w-100 w-sm-auto">
              <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{
                t("appsEventsAlerts.alertsFilters.toDateLabel")
              }}</label>
              <DatePicker
                ref="dateToPicker"
                v-model="tempDateTo"
                size="sm"
                :clearable="true"
                style="width: 100%; min-width: 140px"
                class="w-100 w-sm-auto"
              />
            </div>
          </div>

          <div class="d-flex flex-wrap gap-2 mt-2 mt-sm-0">
            <button
              @click="resetFilters"
              class="btn btn-sm btn-light py-1 px-2"
              title="Reset to Applied Filters"
            >
              <i class="ki-duotone ki-arrows-circle fs-2"
                ><span class="path1"></span><span class="path2"></span
              ></i>
              {{ t("common.reset") || "Reset" }}
            </button>
          </div>
        </div>

        <div class="d-flex align-items-center w-100 w-xl-auto gap-2">
          <ItemPerPage
            :model-value="pagination.per_page"
            :label="
              t('appsEventsAlerts.alertsTable.pagination.itemsLabel') ||
              'Items per page:'
            "
            :options="[5, 10, 20, 30, 50]"
            :show-items-text="false"
            size="sm"
            class="me-3"
            @change="changeItemsPerPage"
          />

          <div
            class="d-flex align-items-center position-relative my-1 flex-grow-1 flex-xl-grow-0"
          >
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4"
              ><span class="path1"></span><span class="path2"></span
            ></i>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control form-control-sm form-control-solid w-100 w-xl-200px ps-12"
              :placeholder="
                t('appsEventsAlerts.alertsFilters.searchPlaceholder') ||
                'Search'
              "
            />
          </div>
          <button
            @click="refreshAlerts"
            class="btn btn-sm btn-light-primary btn-icon"
            title="Refresh"
          >
            <i class="ki-duotone ki-arrows-circle fs-2"
              ><span class="path1"></span><span class="path2"></span
            ></i>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body py-3">
      <div class="table-responsive">
        <AlertsTable
          :alerts="filteredAndSortedAlerts"
          :header="tableHeader"
          :pagination="pagination"
          :loading="loading"
          :loading-detail="loadingDetail"
          :sort-label="sortLabel"
          :sort-order="sortOrder"
          @sort="handleSort"
          @view-detail="viewAlertDetail"
        />
      </div>
      <div class="d-flex justify-content-end mt-4">
        <Pagination
          :page="pagination.page"
          :per-page="pagination.per_page"
          :total-items="pagination.total_items"
          :total-pages="Math.max(1, pagination.total_pages)"
          @page-change="goToPage"
        />
      </div>
    </div>
  </div>

  <!-- Detail Modal Component -->
  <AlertDetailModal
    :show="showDetailModal"
    :alert="selectedAlertDetail"
    :loading="loadingDetail"
    :updating="loadingUpdate"
    @close="closeDetailModal"
    @update="handleDetailUpdate"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: "AlertsComponent",
});

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import AlertsTable from "@/components/apps/events-alerts/AlertsTable.vue";
import AlertDetailModal from "@/components/apps/events-alerts/AlertDetailModal.vue";
import Pagination from "@/components/common/Pagination.vue";
import ItemPerPage from "@/components/ItemPerPage.vue";
import DatePicker from "@/components/DatePicker.vue";
import ApiService from "@/core/services/ApiService";
import {
  parsePaginatedResponse,
} from "@/core/helpers/paginated-response";

const { t } = useI18n();

type detectedObjects = {
  object_type: string;
  display_name: string;
  duration_seconds: number;
  duration_minutes: number;
  detection_count?: number;
};

// Interface definitions
interface Alert {
  event_id: string;
  camera_uuid: string;
  camera_name: string;
  violation_name: string;
  event_start: string;
  event_end: string;
  timestamp: string;
  duration_minutes: number;
  total_detections: number;
  detected_objects: detectedObjects[];
  status: string;
  comment: string | null;
  image_url: string;
  image_urls: string[];
  activities: any[];
}

interface AlertDetail {
  event_id: string;
  camera_uuid: string;
  camera_name: string;
  violation_name?: string;
  event_start: string;
  event_end: string;
  duration_minutes: number;
  total_detections: number;
  detected_objects: {
    object_type: string;
    display_name: string;
    duration_seconds: number;
    detection_count: number;
  }[];
  status: string;
  comment: string | null;
  image_url: string;
  image_urls: string[];
  activities: any[];
}

interface Site {
  uid: string;
  name: string;
}

interface Camera {
  uid: string;
  name: string;
  site_uid: string;
  status?: string;
}

// Reactive data
const alerts = ref<Alert[]>([]);
const sites = ref<Site[]>([]);
const cameras = ref<Camera[]>([]);
const loading = ref(false);
const loadingSites = ref(false);
const loadingCameras = ref(false);
const searchQuery = ref("");
// Header filter state (site and camera)
const selectedSiteFilter = ref<string>("");
const selectedCameraFilter = ref<string>("");
// Date range filters
const dateFrom = ref<string | null>(null);
const dateTo = ref<string | null>(null);

// Temporary filter states (for apply button)
const tempSelectedSiteFilter = ref<string>("");
const tempSelectedCameraFilter = ref<string>("");
const tempDateFrom = ref<string | null>(null);
const tempDateTo = ref<string | null>(null);
const sortLabel = ref("timestamp");
const sortOrder = ref<"asc" | "desc">("desc");
const currentSite = ref<Site | null>(null);
// Pagination
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null as number | null,
  prev_page: null as number | null,
});
// Modal state
const showDetailModal = ref(false);
const selectedAlertDetail = ref<AlertDetail | null>(null);
const loadingDetail = ref(false);
const loadingUpdate = ref(false); // retained for modal prop compatibility

// Pagination handlers - simplified like Camera.vue
let fetchTimeout: number | null = null;

const FROM_DATE_STORAGE_KEY = "lastSelectedFromDate";
const TO_DATE_STORAGE_KEY = "lastSelectedToDate";
const LEGACY_FROM_DATE_STORAGE_KEY = "globalFromDate";
const LEGACY_TO_DATE_STORAGE_KEY = "globalToDate";

// Initialize default dates (yesterday to today)
const initializeDefaultDates = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const defaultFromDate = formatDate(yesterday);
  const defaultToDate = formatDate(today);

  let storedFromDate = localStorage.getItem(FROM_DATE_STORAGE_KEY);
  let storedToDate = localStorage.getItem(TO_DATE_STORAGE_KEY);

  if (!storedFromDate || !storedToDate) {
    const legacyFrom = localStorage.getItem(LEGACY_FROM_DATE_STORAGE_KEY);
    const legacyTo = localStorage.getItem(LEGACY_TO_DATE_STORAGE_KEY);
    if (legacyFrom && legacyTo) {
      storedFromDate = legacyFrom;
      storedToDate = legacyTo;
      localStorage.setItem(FROM_DATE_STORAGE_KEY, legacyFrom);
      localStorage.setItem(TO_DATE_STORAGE_KEY, legacyTo);
      localStorage.removeItem(LEGACY_FROM_DATE_STORAGE_KEY);
      localStorage.removeItem(LEGACY_TO_DATE_STORAGE_KEY);
    }
  }

  if (!storedFromDate || !storedToDate) {
    storedFromDate = defaultFromDate;
    storedToDate = defaultToDate;
    localStorage.setItem(FROM_DATE_STORAGE_KEY, storedFromDate);
    localStorage.setItem(TO_DATE_STORAGE_KEY, storedToDate);
  }

  dateFrom.value = storedFromDate;
  dateTo.value = storedToDate;
  tempDateFrom.value = storedFromDate;
  tempDateTo.value = storedToDate;
};

const debouncedFetchAlerts = () => {
  if (fetchTimeout) clearTimeout(fetchTimeout);
  fetchTimeout = setTimeout(() => {
    void fetchAlerts();
  }, 100); // 100ms debounce
};

const goToPage = (page: number) => {
  pagination.value.page = page;
  debouncedFetchAlerts();
};

const changeItemsPerPage = (newPerPage: number) => {
  // Force update the reactive value
  pagination.value.per_page = newPerPage;

  // Reset to first page
  pagination.value.page = 1;

  // Fetch immediately without debounce for items per page change
  fetchAlerts();
};

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("appsEventsAlerts.alertsTable.columns.alert"),
    columnLabel: "alert_name",
    sortEnabled: false,
    searchable: true,
  },
  {
    columnName: t("appsEventsAlerts.alertsTable.columns.duration"),
    columnLabel: "duration",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.alertsTable.columns.detections"),
    columnLabel: "detections",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.alertsTable.columns.timestamp"),
    columnLabel: "timestamp",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.alertsTable.columns.status"),
    columnLabel: "status",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.alertsTable.columns.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Fetch cameras from API based on selected site
const fetchCameras = async (siteUid: string) => {
  if (!siteUid) {
    cameras.value = [];
    return;
  }

  loadingCameras.value = true;
  try {
    const resp = await ApiService.query(`sites/${siteUid}/cameras`, {
      params: { page: 1, page_size: 100 },
    });
    const { items } = parsePaginatedResponse(resp);
    cameras.value = items.map((camera: any) => ({
      uid: camera.uid,
      uuid: camera.uid,
      name: camera.name,
      site_uid: camera.site_uid || siteUid,
    }));
  } catch (error) {
    console.error("Error loading cameras:", error);
    cameras.value = [];
  } finally {
    loadingCameras.value = false;
  }
};

// Fetch sites from API using team-based approach like Camera.vue
const fetchSites = async () => {
  try {
    const resp = await ApiService.get(`sites`);

    // Parse response (wrapped or direct)
    if (resp && resp.data) {
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        sites.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        sites.value = resp.data;
      } else {
        console.warn("Unexpected sites response format:", resp.data);
        sites.value = [];
      }
    } else {
      console.warn("No data received from sites API");
      sites.value = [];
    }
  } catch (error) {
    console.error("Error loading sites:", error);
    // Fallback to mock data for development
    sites.value = [
      { uid: "site-1", name: "Main Office" },
      { uid: "site-2", name: "Branch Office" },
      { uid: "site-3", name: "Warehouse A" },
    ];
  }
};

const fetchAlerts = async () => {
  // Get alerts for the selected site only
  if (!selectedSiteFilter.value) {
    alerts.value = [];
    return;
  }

  loading.value = true;

  try {
    const params: any = {
      page: pagination.value.page,
      page_size: pagination.value.per_page,
      sort_by: sortLabel.value || "timestamp",
      sort_order: sortOrder.value,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    // Add camera filter if set
    if (
      selectedCameraFilter.value &&
      selectedCameraFilter.value !== "" &&
      selectedCameraFilter.value !== "undefined"
    ) {
      params.camera_uuid = selectedCameraFilter.value;
    }

    // Add date range filters if set
    if (dateFrom.value) {
      params.from_date = dateFrom.value;
    }
    if (dateTo.value) {
      params.to_date = dateTo.value;
    }

    const resp = await ApiService.query(
      `sites/${selectedSiteFilter.value}/alerts`,
      {
        params: Object.keys(params).length > 0 ? params : undefined,
      }
    );

    if (resp && resp.data) {
      const { items, pagination: paginationMeta } = parsePaginatedResponse(resp);

      alerts.value = items.map((item: any) => ({
        event_id: item.alert_id || item.event_id || `alert-${Date.now()}-${Math.random()}`,
        camera_uuid: item.camera_uid || item.camera_uuid || "",
        camera_name: item.camera?.name || item.camera_name || "Unknown Camera",
        violation_name: item.violation_name || "Unknown Violation",
        event_start: item.detected_at || item.event_start || "",
        event_end: item.event_end || "",
        timestamp: item.detected_at || item.event_start || "",
        duration_minutes: item.duration_minutes || 0,
        total_detections: item.total_detections || 1,
        detected_objects: item.detected_objects || [],
        status: item.status || "notResolved",
        image_url: item.image_url || "",
        image_urls: item.image_urls || [],
        activities: item.activities || [],
        comment: item.comment || null,
      }));

      if (typeof paginationMeta.total_items === "number") {
        pagination.value.total_items = paginationMeta.total_items;
      }
      if (typeof paginationMeta.total_pages === "number") {
        pagination.value.total_pages = paginationMeta.total_pages;
      } else {
        pagination.value.total_pages = Math.max(
          1,
          Math.ceil(pagination.value.total_items / pagination.value.per_page),
        );
      }
      if (typeof paginationMeta.page === "number") {
        pagination.value.page = paginationMeta.page;
      }
      pagination.value.next_page = paginationMeta.next_page ?? null;
      pagination.value.prev_page = paginationMeta.prev_page ?? null;
    } else {
      alerts.value = [];
    }
  } catch (error) {
    console.error("Error loading alerts:", error);
    alerts.value = [];
    pagination.value.total_items = 0;
    pagination.value.total_pages = 0;
  } finally {
    loading.value = false;
  }
};

// Removed remote detail fetch; list data already has needed fields.

// Filter alerts
// const filterAlerts = () => {
// Filtering is handled in computed property
// };

// const applyDateFilter = () => {
// Reset to first page when applying date filter
//   pagination.value.page = 1;
//   debouncedFetchAlerts();
// };

// Refresh alerts
const refreshAlerts = () => {
  debouncedFetchAlerts();
};

// Temp filter handlers (no immediate API calls)
const onTempFilterSiteChange = async () => {
  // Reset camera filter when site changes
  tempSelectedCameraFilter.value = "";

  // Fetch cameras for the selected site immediately for dropdown
  if (tempSelectedSiteFilter.value) {
    await fetchCameras(tempSelectedSiteFilter.value);
  } else {
    cameras.value = [];
  }
};

const onTempFilterCameraChange = () => {
  // Just update temp state, no API call
};

// Apply all filters at once
const applyFilters = async () => {
  // Update actual filter values from temp values
  selectedSiteFilter.value = tempSelectedSiteFilter.value || "";
  selectedCameraFilter.value = tempSelectedCameraFilter.value || "";
  dateFrom.value = tempDateFrom.value;
  dateTo.value = tempDateTo.value;

  // Update current site
  currentSite.value =
    sites.value.find((s) => s.uid === selectedSiteFilter.value) || null;

  // Save to localStorage
  localStorage.setItem("lastSelectedSite", selectedSiteFilter.value || "");
  localStorage.setItem("lastSelectedCamera", selectedCameraFilter.value || "");

  // Reset pagination and fetch alerts
  pagination.value.page = 1;

  if (selectedSiteFilter.value) {
    await debouncedFetchAlerts();
  } else {
    alerts.value = [];
  }
};

// Reset filters to stored values
const resetFilters = () => {
  tempSelectedSiteFilter.value = selectedSiteFilter.value;
  tempSelectedCameraFilter.value = selectedCameraFilter.value;

  // Reset dates to Today
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  dateFrom.value = todayStr;
  dateTo.value = todayStr;
  tempDateFrom.value = todayStr;
  tempDateTo.value = todayStr;

  // Update localStorage immediately
  localStorage.setItem(FROM_DATE_STORAGE_KEY, todayStr);
  localStorage.setItem(TO_DATE_STORAGE_KEY, todayStr);

  // Refresh data
  pagination.value.page = 1;
  debouncedFetchAlerts();
};

// Reset filters to default values (clear site/camera, reset dates to yesterday-today)
// const resetToDefaults = () => {
// Reset site and camera filters
//   tempSelectedSiteFilter.value = "";
//   tempSelectedCameraFilter.value = "";
//
// Reset dates to default range (yesterday to today)
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);
//
//   const formatDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };
//
//   const defaultFromDate = formatDate(yesterday);
//   const defaultToDate = formatDate(today);
//
//   tempDateFrom.value = defaultFromDate;
//   tempDateTo.value = defaultToDate;
//
// Update localStorage with new defaults
//   localStorage.setItem(FROM_DATE_STORAGE_KEY, defaultFromDate);
//   localStorage.setItem(TO_DATE_STORAGE_KEY, defaultToDate);
//   localStorage.removeItem(LEGACY_FROM_DATE_STORAGE_KEY);
//   localStorage.removeItem(LEGACY_TO_DATE_STORAGE_KEY);
// };

// Helpers for badge styling and translated labels
// const normalizeKey = (value?: string) =>
//   (value ?? "").toLowerCase().replace(/[\s_-]/g, "");

// const statusKeyMap: Record<string, string> = {
//   notresolved: "notResolved",
//   resolved: "resolved",
//   falsealarm: "falseAlarm",
// };

// const severityKeyMap: Record<string, string> = {
//   low: "low",
//   medium: "medium",
//   high: "high",
//   critical: "critical",
// };

// const typeKeyMap: Record<string, string> = {
//   motion: "motion",
//   intrusion: "intrusion",
//   system: "system",
//   cameraoffline: "cameraOffline",
// };

// const getAlertTypeBadgeClass = (type: string) => {
//   switch (normalizeKey(type)) {
//     case "motion":
//       return "badge-light-primary";
//     case "intrusion":
//       return "badge-light-danger";
//     case "system":
//       return "badge-light-info";
//     case "cameraoffline":
//       return "badge-light-warning";
//     default:
//       return "badge-light-secondary";
//   }
// };

// const getSeverityBadgeClass = (severity: string) => {
//   switch (normalizeKey(severity)) {
//     case "critical":
//       return "badge-danger";
//     case "high":
//       return "badge-warning";
//     case "medium":
//       return "badge-primary";
//     case "low":
//       return "badge-success";
//     default:
//       return "badge-secondary";
//   }
// };

// const getStatusBadgeClass = (status: string) => {
//   const normalized = normalizeKey(status);
//   if (normalized === "notresolved") return "badge-light-danger";
//   if (normalized === "resolved") return "badge-light-success";
//   if (normalized === "falsealarm") return "badge-light-info";
//   if (!status || status === "No Status") return "badge-light-secondary";
//   return "badge-light-secondary"; // Default return
// };

// const getStatusLabel = (status: string) => {
// Handle fallback values directly
//   if (!status || status === "No Status") {
//     return status || "No Status";
//   }
//   const key = statusKeyMap[normalizeKey(status)];
//   return key ? t(`appsEventsAlerts.alertsTable.status.${key}`) : status;
// };

// const getSeverityLabel = (severity: string) => {
//   const key = severityKeyMap[normalizeKey(severity)];
//   return key ? t(`appsEventsAlerts.alertsTable.severity.${key}`) : severity;
// };

// const getAlertTypeLabel = (type: string) => {
//   const key = typeKeyMap[normalizeKey(type)];
//   return key ? t(`appsEventsAlerts.alertsTable.types.${key}`) : type;
// };

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

// const formatMinutesShort = (minutes?: number | null) => {
//   if (minutes === undefined || minutes === null || Number.isNaN(minutes)) {
//     return t("appsEventsAlerts.format.notAvailable");
//   }
//   return t("appsEventsAlerts.format.minutesShort", {
//     value: formatNumber(Math.max(0, minutes), 1),
//   });
// };

// const formatSecondsShort = (seconds?: number | null) => {
//   if (seconds === undefined || seconds === null || Number.isNaN(seconds)) {
//     return t("appsEventsAlerts.format.notAvailable");
//   }
//   return t("appsEventsAlerts.format.secondsShort", {
//     value: formatNumber(Math.max(0, seconds), 1),
//   });
// };

// const formatSecondsLong = (seconds?: number | null) => {
//   if (seconds === undefined || seconds === null || Number.isNaN(seconds)) {
//     return t("appsEventsAlerts.format.notAvailable");
//   }
//   return t("appsEventsAlerts.format.secondsLong", {
//     value: formatNumber(Math.max(0, seconds), 2),
//   });
// };

// const formatDuration = (minutes?: number | null) => {
//   if (minutes === undefined || minutes === null || Number.isNaN(minutes)) {
//     return t("appsEventsAlerts.format.notAvailable");
//   }
//   if (minutes < 1) {
//     return formatSecondsLong(minutes * 60);
//   }
//   return t("appsEventsAlerts.format.minutesLong", {
//     value: formatNumber(Math.max(0, minutes), 2),
//   });
// };

const filteredAndSortedAlerts = computed(() => alerts.value);

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
  pagination.value.page = 1;
  void fetchAlerts();
};

// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement;
//   target.style.display = "none";
//   const parent = target.parentElement;
//   if (parent) {
//     parent.innerHTML = `
//       <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
//         <i class="ki-duotone ki-picture fs-2x text-muted">
//           <span class="path1"></span>
//           <span class="path2"></span>
//         </i>
//       </div>
//     `;
//   }
// };

const viewAlertDetail = (alert: Alert) => {
  selectedAlertDetail.value = {
    event_id: alert.event_id,
    camera_uuid: alert.camera_uuid,
    camera_name: alert.camera_name,
    violation_name: alert.violation_name,
    event_start: alert.event_start,
    event_end: alert.event_end,
    duration_minutes: alert.duration_minutes,
    total_detections: alert.total_detections,
    detected_objects: (alert.detected_objects || []).map((o) => ({
      object_type: o.object_type,
      display_name: o.display_name,
      duration_seconds: o.duration_seconds,
      detection_count: (o as any).detection_count ?? 0,
    })),
    status: alert.status,
    comment: alert.comment,
    image_url: alert.image_url,
    image_urls: alert.image_urls,
    activities: alert.activities,
  };
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedAlertDetail.value = null;
};

const handleDetailUpdate = (payload: {
  status: string;
  comment: string | null;
}) => {
  if (!selectedAlertDetail.value) return;
  // Update local detail
  selectedAlertDetail.value.status = payload.status;
  selectedAlertDetail.value.comment = payload.comment;
  // Reflect in list
  const idx = alerts.value.findIndex(
    (a) => a.event_id === selectedAlertDetail.value?.event_id
  );
  if (idx !== -1) {
    alerts.value[idx].status = payload.status;
    alerts.value[idx].comment = payload.comment;
  }
};

// Initialize data on component mount - following Camera.vue pattern
let alertsSearchTimeout: number | null = null;
watch(searchQuery, () => {
  pagination.value.page = 1;
  if (alertsSearchTimeout) {
    clearTimeout(alertsSearchTimeout);
  }
  alertsSearchTimeout = window.setTimeout(() => {
    void fetchAlerts();
  }, 300);
});

onMounted(async () => {
  try {
    // Initialize default dates first
    initializeDefaultDates();
    await fetchSites();
    // Determine initial site: prefer stored value, otherwise first site in list
    const storedSite = localStorage.getItem("lastSelectedSite");
    let initialSiteUid = "";
    if (storedSite && sites.value.some((s) => s.uid === storedSite)) {
      initialSiteUid = storedSite;
    } else if (sites.value.length > 0) {
      initialSiteUid = sites.value[0].uid;
    }

    if (initialSiteUid) {
      // Set selected site and temp selection
      selectedSiteFilter.value = initialSiteUid;
      tempSelectedSiteFilter.value = initialSiteUid;
      currentSite.value =
        sites.value.find((s) => s.uid === initialSiteUid) || null;
      localStorage.setItem("lastSelectedSite", initialSiteUid);
      // Load cameras for the selected site
      await fetchCameras(initialSiteUid);
      // Default: Semua Kamera
      selectedCameraFilter.value = "";
      tempSelectedCameraFilter.value = "";
      // Fetch alerts for the selected site (and camera if set)
      await fetchAlerts();
    } else {
      // No sites available — clear stored selections
      localStorage.removeItem("lastSelectedSite");
      localStorage.removeItem("lastSelectedCamera");
      selectedSiteFilter.value = "";
      selectedCameraFilter.value = "";
      tempSelectedSiteFilter.value = "";
      tempSelectedCameraFilter.value = "";
      currentSite.value = null;
    }
  } catch (error) {
    console.error("Error initializing alerts:", error);
  }
});

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
});
</script>
