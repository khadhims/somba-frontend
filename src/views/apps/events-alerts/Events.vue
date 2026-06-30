<template>
  <!--begin::Events & Alerts Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center gy-3">
        <div class="col-12 col-md-4">
          <h4 class="card-title mb-0">
            {{ t("appsEventsAlerts.events.title") }}
          </h4>
          <p class="text-muted mb-0">
            {{
              currentSite
                ? t("appsEventsAlerts.events.subtitleSite", {
                    site: currentSite.name,
                  })
                : t("appsEventsAlerts.events.subtitleAll")
            }}
          </p>
        </div>
        <div class="col-12 col-md-8">
          <div
            class="d-flex flex-column flex-md-row justify-content-md-end align-items-start align-items-md-center gap-3"
          >
            <!-- Site Filter -->
            <div class="d-flex align-items-center w-100 w-md-auto mb-2 mb-md-0">
              <label class="form-label me-3 mb-0 fw-semibold text-nowrap">{{
                t("appsEventsAlerts.eventsFilters.siteLabel")
              }}</label>
              <select
                v-model="tempSelectedSiteFilter"
                class="form-select form-select-solid w-100 w-md-200px"
                :disabled="loadingSites"
                @change="onTempFilterSiteChange"
              >
                <option value="">
                  {{ t("appsEventsAlerts.eventsFilters.siteAll") }}
                </option>
                <option v-for="site in sites" :key="site.uid" :value="site.uid">
                  {{ site.name }}
                </option>
              </select>
            </div>

            <!-- Camera Filter -->
            <div class="d-flex align-items-center w-100 w-md-auto">
              <label class="form-label me-3 mb-0 fw-semibold text-nowrap">{{
                t("appsEventsAlerts.eventsFilters.cameraLabel") || "Camera"
              }}</label>
              <select
                v-model="tempSelectedCameraFilter"
                class="form-select form-select-solid w-100 w-md-200px"
                :disabled="loadingCameras || !tempSelectedSiteFilter"
                @change="onTempFilterCameraChange"
              >
                <option value="">
                  {{
                    t("appsEventsAlerts.eventsFilters.cameraAll") ||
                    "All Cameras"
                  }}
                </option>
                <option
                  v-for="camera in cameras"
                  :key="camera.uuid"
                  :value="camera.uuid"
                  :title="`ID: ${camera.uuid} | Model: ${
                    camera.model || 'N/A'
                  }`"
                >
                  {{ camera.name }}
                  {{ camera.model ? `(${camera.model})` : "" }}
                </option>
              </select>
            </div>
            <button
              @click="applyFilters"
              class="btn btn-md btn-primary py-3 px-2"
              title="Apply All Filters"
            >
              <i class="ki-duotone ki-check fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t("common.apply") || "Apply" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--begin::Events List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("appsEventsAlerts.events.title") }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div
        class="card-toolbar d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-center w-100 gap-3"
      >
        <!-- Date Range Filters - Start -->
        <div class="d-flex flex-wrap align-items-center gap-2 w-100 w-xl-auto">
          <div
            class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center me-0 me-sm-2 w-100 w-sm-auto gap-2"
          >
            <div class="d-flex align-items-center w-100 w-sm-auto">
              <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{
                t("appsEventsAlerts.eventsFilters.fromDateLabel")
              }}</label>
              <DatePicker
                v-model="tempDateFrom"
                size="sm"
                :clearable="true"
                style="width: 100%; min-width: 140px"
                class="w-100 w-sm-auto"
              />
            </div>
            <div class="d-flex align-items-center w-100 w-sm-auto">
              <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{
                t("appsEventsAlerts.eventsFilters.toDateLabel")
              }}</label>
              <DatePicker
                v-model="tempDateTo"
                size="sm"
                :clearable="true"
                style="width: 100%; min-width: 140px"
                class="w-100 w-sm-auto"
              />
            </div>
          </div>

          <!-- Apply/Reset Buttons -->
          <div class="d-flex flex-wrap gap-2 mt-2 mt-sm-0">
            <button
              @click="resetFilters"
              class="btn btn-sm btn-light py-1 px-2"
              title="Reset to Applied Filters"
            >
              <i class="ki-duotone ki-arrows-circle fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Reset
            </button>
          </div>
        </div>

        <!-- Other Filters - End -->
        <div class="d-flex align-items-center w-100 w-xl-auto gap-2">
          <ItemPerPage
            :model-value="itemsPerPage"
            :label="
              t('appsEventsAlerts.eventsTable.pagination.itemsLabel') ||
              'Items per page:'
            "
            :options="[5, 10, 20, 30, 50]"
            :show-items-text="false"
            size="sm"
            class="me-3"
            @change="changeItemsPerPage"
          />

          <!--begin::Search-->
          <div
            class="d-flex align-items-center position-relative my-1 flex-grow-1 flex-xl-grow-0"
          >
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control form-control-sm form-control-solid w-100 w-xl-200px ps-12"
              placeholder="Search"
            />
          </div>
          <!--end::Search-->

          <button
            @click="refreshEvents"
            class="btn btn-sm btn-light-primary btn-icon"
            title="Refresh"
          >
            <i class="ki-duotone ki-arrows-circle fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
        </div>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <EventsTable
        :events="filteredAndSortedEvents"
        :header="tableHeader"
        :pagination="{
          page: currentPage,
          per_page: itemsPerPage,
          total_items: totalItems,
          total_pages: totalPages,
        }"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @sort="handleSort"
        @view-detail="viewEventDetails"
      />

      <!--begin::Pagination-->
      <div class="d-flex justify-content-end mt-4">
        <Pagination
          :page="currentPage"
          :per-page="itemsPerPage"
          :total-items="totalItems"
          :total-pages="totalPages"
          @page-change="goToPage"
        />
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Events List-->

  <!-- Event Detail Modal -->
  <EventDetailModal
    :show="showDetailModal"
    :event="selectedEvent"
    :loading="loadingDetail"
    @close="closeModal"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: "EventsComponent",
});

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
// import { Modal } from "bootstrap";
// import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
// import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from "@/components/common/Pagination.vue";
import ItemPerPage from "@/components/ItemPerPage.vue";
import DatePicker from "@/components/DatePicker.vue";
import ApiService from "@/core/services/ApiService";
import EventsTable from "@/components/apps/events-alerts/EventsTable.vue";
import EventDetailModal from "@/components/apps/events-alerts/EventDetailModal.vue";
import {
  convertToGMT8,
  getCurrentDateTimeGMT8,
} from "@/core/helpers/timezone";
import {
  applyPaginationMeta,
  parsePaginatedResponse,
} from "@/core/helpers/paginated-response";
import { mapActivityEventItem } from "@/core/helpers/operations-mapper";

const { t } = useI18n();

// Interface definitions
interface Event {
  // type: 'motion' | 'intrusion' | 'system' | 'camera_offline';
  severity: "low" | "medium" | "high" | "critical";
  site_uid: string;
  camera_uuid?: string;
  camera_name?: string;
  event_id: string;
  event_name: string;
  event_start: string;
  event_end: string;
  duration_minutes?: number;
  total_minutes?: number;
  avg_seconds_with_detection?: number;
  status: "active" | "acknowledged" | "resolved";
  image_url?: string;
  image_urls?: string[];
  recording_url?: string;
  activities?: any[];
}

interface Site {
  uid: string;
  name: string;
}

interface Camera {
  // Compatibility fields (mapped from API)
  uuid: string; // Mapped from API's uid field for compatibility
  name: string;
  site_uuid: string;
  status?: string;

  // Original API fields
  uid?: string;
  site_uid?: string;
  site_name?: string;
  camera_config?: {
    zones?: any[];
    uid?: string;
    name?: string;
    allow_labels?: string[];
    deny_labels?: string[];
    min_score?: number;
    zone_test?: string;
    iou_threshold?: number;
  };
  model?: string;
  stream_url?: string;
  created_by?: {
    username?: string;
    email?: string;
  };
}

// Reactive data
const events = ref<Event[]>([]);
const sites = ref<Site[]>([]);
const cameras = ref<Camera[]>([]);
// const camerasCache = ref<Record<string, Record<string, string>>>({
//   /* empty */
// });
const loading = ref(false);
const loadingSites = ref(false);
const loadingCameras = ref(false);
const searchQuery = ref("");
// const selectedSiteId = ref("");
// Header filter state (site + camera)
const selectedSiteFilter = ref<string>("");
const selectedCameraFilter = ref<string>("");
// const selectedEventType = ref("");
const selectedSeverityType = ref("");
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
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalItems = ref(0);
const totalPages = ref(0);
// Modal state
const selectedEvent = ref<any>(null);
const showDetailModal = ref(false);
const loadingDetail = ref(false);

// Pagination handlers
let fetchTimeout: number | null = null;
const FROM_DATE_STORAGE_KEY = "lastSelectedFromDate";
const TO_DATE_STORAGE_KEY = "lastSelectedToDate";
const LEGACY_FROM_DATE_STORAGE_KEY = "globalFromDate";
const LEGACY_TO_DATE_STORAGE_KEY = "globalToDate";

// Initialize default dates (always today → today, business timezone GMT+8)
const initializeDefaultDates = () => {
  const todayStr = getCurrentDateTimeGMT8("YYYY-MM-DD");
  localStorage.setItem(FROM_DATE_STORAGE_KEY, todayStr);
  localStorage.setItem(TO_DATE_STORAGE_KEY, todayStr);
  localStorage.removeItem(LEGACY_FROM_DATE_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TO_DATE_STORAGE_KEY);
  dateFrom.value = todayStr;
  dateTo.value = todayStr;
  tempDateFrom.value = todayStr;
  tempDateTo.value = todayStr;
};

const debouncedFetchEvents = () => {
  if (fetchTimeout) clearTimeout(fetchTimeout);
  fetchTimeout = setTimeout(() => {
    fetchEvents();
  }, 100); // 100ms debounce
};

const goToPage = (page: number) => {
  currentPage.value = page;
  debouncedFetchEvents();
};

const changeItemsPerPage = (newPerPage: number) => {
  // Force update the reactive value
  itemsPerPage.value = newPerPage;

  // Reset to first page
  currentPage.value = 1;

  // Fetch immediately without debounce for items per page change
  fetchEvents();
};

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("appsEventsAlerts.eventsTable.columns.event"),
    columnLabel: "event_name",
    sortEnabled: false,
    searchable: true,
  },
  {
    columnName: t("appsEventsAlerts.eventsTable.columns.camera"),
    columnLabel: "camera_name",
    sortEnabled: false,
    searchable: true,
  },
  {
    columnName: t("appsEventsAlerts.eventsTable.columns.timestamp"),
    columnLabel: "timestamp",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.eventsTable.columns.duration"),
    columnLabel: "duration",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.eventsTable.columns.status"),
    columnLabel: "status",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsEventsAlerts.eventsTable.columns.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Fetch events from API (uses mock response shape as fallback)
const fetchEvents = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  try {
    // Determine site uid to request - prefer selectedSiteFilter, fallback to first loaded site
    let siteUid =
      selectedSiteFilter.value ||
      (sites.value.length ? sites.value[0].uid : "");
    if (!siteUid) {
      console.warn(
        "No site selected and no sites available - skipping list-activity call"
      );
      events.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
      return;
    }

    // Call API: sites/{site_uid}/list-activity with pagination params
    // ${siteUid}
    const params: any = {
      page: currentPage.value,
      page_size: itemsPerPage.value,
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

    const resp = await ApiService.query(`sites/${siteUid}/activities`, {
      params,
    });
    const { items: results, pagination } = parsePaginatedResponse(resp);

    events.value = results.map((item: any) =>
      mapActivityEventItem(
        {
          ...item,
          event_start: convertToGMT8(item.event_start),
          event_end: convertToGMT8(item.event_end),
        },
        siteUid
      )
    );

    applyPaginationMeta(pagination, {
      totalItems,
      totalPages,
      page: currentPage,
      perPage: itemsPerPage,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    events.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

watch([dateFrom, dateTo], ([from, to]) => {
  try {
    if (from) {
      localStorage.setItem(FROM_DATE_STORAGE_KEY, from);
    } else {
      localStorage.removeItem(FROM_DATE_STORAGE_KEY);
    }

    if (to) {
      localStorage.setItem(TO_DATE_STORAGE_KEY, to);
    } else {
      localStorage.removeItem(TO_DATE_STORAGE_KEY);
    }

    localStorage.removeItem(LEGACY_FROM_DATE_STORAGE_KEY);
    localStorage.removeItem(LEGACY_TO_DATE_STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to persist date filters to localStorage", error);
  }
});

let searchTimeout: number | null = null;
watch(searchQuery, () => {
  currentPage.value = 1;
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = window.setTimeout(() => {
    fetchEvents();
  }, 300);
});

// Fetch sites from API (following Camera.vue pattern)
const fetchSites = async () => {
  loadingSites.value = true;
  try {
    const resp = await ApiService.get(`sites`);
    // Parse response (wrapped or direct) - exactly like Camera.vue
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
    console.error("Error fetching sites:", error);
    // Fallback to mock data for development
  } finally {
    loadingSites.value = false;
  }
};

// Fetch cameras for dropdown filter
const fetchCamerasForFilter = async (siteUid: string) => {
  if (!siteUid) {
    cameras.value = [];
    return;
  }
  loadingCameras.value = true;
  try {
    const resp = await ApiService.query(`sites/${siteUid}/cameras`, {
      params: { page: 1, page_size: 100 },
    });
    const { items: rawCameras } = parsePaginatedResponse(resp);

    cameras.value = rawCameras.map((camera: any) => ({
      // Map uid to uuid for compatibility with existing code
      uuid: camera.uid || camera.uuid || camera.id,
      name:
        camera.name ||
        camera.camera_name ||
        `Camera ${camera.uid || camera.id}`,
      site_uuid: camera.site_uid || camera.site_uuid || siteUid,
      status: "active", // Default status

      // Preserve all original API fields
      uid: camera.uid,
      site_uid: camera.site_uid,
      site_name: camera.site_name,
      camera_config: camera.camera_config,
      model: camera.model,
      stream_url: camera.stream_url,
      created_by: camera.created_by,
    }));
  } catch (error) {
    console.error("Error loading cameras for site", siteUid, ":", error);
    cameras.value = [];
  } finally {
    loadingCameras.value = false;
  }
};

// Refresh events
const refreshEvents = () => {
  debouncedFetchEvents();
};

// Temp filter handlers (no immediate API calls)
const onTempFilterSiteChange = async () => {
  // Reset camera filter when site changes
  tempSelectedCameraFilter.value = "";

  // Fetch cameras for the selected site immediately for dropdown
  if (tempSelectedSiteFilter.value) {
    await fetchCamerasForFilter(tempSelectedSiteFilter.value);
  } else {
    cameras.value = [];
  }
};

const onTempFilterCameraChange = () => {
  // Just update temp state, no API call

  // Save temp camera selection for persistence (backup method)
  if (
    tempSelectedCameraFilter.value &&
    tempSelectedCameraFilter.value !== "" &&
    tempSelectedCameraFilter.value !== "undefined"
  ) {
    localStorage.setItem(
      "lastTempSelectedCamera",
      tempSelectedCameraFilter.value
    );
  }
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
  const cameraToSave =
    selectedCameraFilter.value &&
    selectedCameraFilter.value !== "undefined" &&
    selectedCameraFilter.value !== "null"
      ? selectedCameraFilter.value
      : "";
  localStorage.setItem("lastSelectedCamera", cameraToSave);
  localStorage.setItem(FROM_DATE_STORAGE_KEY, dateFrom.value);
  localStorage.setItem(TO_DATE_STORAGE_KEY, dateTo.value);

  // Reset pagination and fetch events
  currentPage.value = 1;

  if (selectedSiteFilter.value) {
    await debouncedFetchEvents();
  } else {
    events.value = [];
  }
};

// Reset filters to stored values
const resetFilters = () => {
  tempSelectedSiteFilter.value = selectedSiteFilter.value || "";
  tempSelectedCameraFilter.value = selectedCameraFilter.value || "";

  // Reset dates to Today (business timezone GMT+8)
  const todayStr = getCurrentDateTimeGMT8("YYYY-MM-DD");

  dateFrom.value = todayStr;
  dateTo.value = todayStr;
  tempDateFrom.value = todayStr;
  tempDateTo.value = todayStr;

  // Update localStorage immediately (though watcher might handle it too)
  localStorage.setItem(FROM_DATE_STORAGE_KEY, todayStr);
  localStorage.setItem(TO_DATE_STORAGE_KEY, todayStr);

  // Refresh data
  fetchEvents();
};

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

// Computed properties
const filteredAndSortedEvents = computed(() => events.value);

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
  currentPage.value = 1;
  fetchEvents();
};

const viewEventDetails = (event: Event) => {
  selectedEvent.value = event;
  showDetailModal.value = true;
};

const closeModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
};

// Initialize data on component mount
onMounted(async () => {
  try {
    // Initialize default dates first
    initializeDefaultDates();

    // Then load sites
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
      localStorage.setItem("lastSelectedSite", initialSiteUid);

      // Load cameras for the selected site
      await fetchCamerasForFilter(initialSiteUid);

      // Default: Semua Kamera
      selectedCameraFilter.value = "";
      tempSelectedCameraFilter.value = "";

      // Only fetch events after sites and cameras are loaded and default dates are set
      // Wait a bit for DatePicker components to initialize with default values
      setTimeout(() => {
        fetchEvents();
      }, 200);
    } else {
      // No sites available — clear stored selections
      localStorage.removeItem("lastSelectedSite");
      localStorage.removeItem("lastSelectedCamera");
      selectedSiteFilter.value = "";
      selectedCameraFilter.value = "";
      tempSelectedSiteFilter.value = "";
      tempSelectedCameraFilter.value = "";
    }

    // Add event listener for manual modal backdrop click
    document.addEventListener("click", (e) => {
      if ((e.target as HTMLElement)?.id === "eventDetailsModalBackdrop") {
        closeModal();
      }
    });
  } catch (error) {
    console.error("Error initializing events page:", error);
  }
});

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
});
</script>
