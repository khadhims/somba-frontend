<template>
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!-- App page -->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!-- App main -->
      <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
        <!-- Content wrapper -->
        <div class="d-flex flex-column flex-column-fluid">
          <!-- Content -->
          <div id="kt_app_content" class="app-content flex-column-fluid">
            <div
              id="kt_app_content_container"
              class="app-container container-xxl"
            >
              <!-- Main Dashboard Card - Gabungan 3 Section -->
              <div class="row g-3 g-xl-4 mb-3">
                <div class="col-12">
                  <div class="card dashboard-main-card">
                    <!-- Section 1: Proses Pelaksanaan Harian -->
                    <div
                      class="card-header border-0 pt-3 pb-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 dashboard-section-header"
                    >
                      <div class="card-title flex-grow-1">
                        <div class="d-flex flex-column gap-2">
                          <h3
                            class="fw-bold text-dark text-white-dark fs-5 mb-0"
                          >
                            {{ t("dashboard.sections.dailyProcess.title") }}
                          </h3>
                          <div
                            class="header-meta d-flex flex-wrap align-items-center gap-2"
                          >
                            <span class="badge badge-light-primary fs-8">
                              Data per: {{ currentDate }}
                            </span>
                            <span
                              class="header-meta-item fs-8 d-flex align-items-center gap-1"
                            >
                              <span
                                class="icon-wrapper"
                                @click="handleManualRefresh"
                                style="cursor: pointer"
                                title="Klik untuk refresh manual"
                              >
                                <i class="pi pi-sync"></i>
                              </span>
                              <span class="meta-text"
                                >Otomatis update tiap
                                {{ autoUpdateInterval }} menit</span
                              >
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        class="card-toolbar d-flex flex-wrap align-items-center gap-2 w-100 w-md-auto"
                      >
                        <label
                          class="fw-semibold fs-7 text-muted mb-0 d-none d-md-block"
                        >
                          {{ t("controlplane.site.camera.filters.siteLabel") }}
                        </label>
                        <!-- Dropdown Pemilihan Lokasi -->
                        <select
                          v-model="selectedSite"
                          class="form-select form-select-sm w-100 w-md-auto"
                          style="min-width: 200px"
                        >
                          <option value="">
                            {{
                              t(
                                "controlplane.site.camera.form.fields.site.placeholder"
                              )
                            }}
                          </option>
                          <option
                            v-for="site in sites"
                            :key="site.uid"
                            :value="site.uid"
                          >
                            {{ site.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div
                      class="card-body position-relative"
                      style="padding: 1rem 1rem 1.5rem 1rem"
                    >
                      <!-- Loading state -->
                      <div v-if="loading" class="text-center py-8">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-3 text-muted">
                          {{ t("dashboard.general.loading") }}
                        </p>
                      </div>

                      <!-- Error state -->
                      <div
                        v-else-if="error"
                        class="alert alert-warning"
                        role="alert"
                      >
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        {{ t("dashboard.general.errorLoading") }}: {{ error }}
                        <button
                          class="btn btn-sm btn-outline-primary ms-3"
                          @click="loadLiveActivities"
                        >
                          <i class="fas fa-refresh me-1"></i
                          >{{ t("dashboard.general.retry") }}
                        </button>
                      </div>

                      <!-- Activities carousel -->
                      <div v-else class="activities-carousel-wrapper">
                        <!-- Carousel container -->
                        <div
                          ref="carouselContainer"
                          class="activities-carousel"
                          @mousedown="handleDragStart"
                          @mousemove="handleDragMove"
                          @mouseup="handleDragEnd"
                          @mouseleave="handleDragEnd"
                          @touchstart="handleTouchStart"
                          @touchmove="handleTouchMove"
                          @touchend="handleTouchEnd"
                        >
                          <div
                            class="activities-carousel-track"
                            :style="{
                              transform: `translateX(-${
                                currentScrollIndex * scrollStep
                              }%)`,
                            }"
                          >
                            <!-- Loop untuk menampilkan Card5 dengan data dari API -->
                            <div
                              v-for="activity in liveActivities"
                              :key="activity.activity_uid"
                              class="carousel-item-wrapper"
                            >
                              <Card5
                                :activity-name="
                                  getTranslatedActivityName(
                                    activity.activity_name
                                  )
                                "
                                :last-activity-timestamp="
                                  activity.last_activity_timestamp
                                "
                                :currently-active="activity.currently_active"
                                :icon="
                                  getActivityConfig(activity.activity_name).icon
                                "
                                :bg-color="
                                  getActivityConfig(activity.activity_name)
                                    .bgColor
                                "
                              />
                            </div>
                          </div>
                        </div>

                        <!-- Pagination dots -->
                        <div
                          v-if="liveActivities.length > cardsPerView"
                          class="carousel-pagination"
                        >
                          <button
                            v-for="index in totalPages"
                            :key="index"
                            class="pagination-dot"
                            :class="{
                              active: currentScrollIndex === index - 1,
                            }"
                            @click="scrollToPage(index - 1)"
                          ></button>
                        </div>

                        <!-- Empty state -->
                        <div
                          v-if="liveActivities.length === 0"
                          class="col-12 text-center py-8"
                        >
                          <i class="fas fa-inbox fs-1 text-muted mb-3"></i>
                          <h5 class="text-muted">
                            {{ t("dashboard.general.noData") }}
                          </h5>
                          <p class="text-muted">
                            {{ t("dashboard.general.noDataDescription") }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- Divider -->
                    <div class="separator separator-dashed my-0"></div>

                    <!-- Section 2: Recent Alerts -->
                    <div class="card-header border-0 pt-3 pb-2">
                      <div class="card-title">
                        <h3 class="fw-bold m-0 d-flex align-items-center gap-2">
                          <i
                            class="pi pi-exclamation-triangle fs-2 text-danger"
                          ></i>
                          {{
                            t("dashboard.alerts.title") || "Pelanggaran Terbaru"
                          }}
                        </h3>
                      </div>
                    </div>
                    <div class="card-body py-3">
                      <div class="row g-4">
                        <!-- Left Column: Alerts Table -->
                        <div class="col-lg-8">
                          <!-- Desktop View: Table -->
                          <div class="table-responsive d-none d-md-block">
                            <table
                              class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3"
                            >
                              <thead>
                                <tr class="fw-bold text-muted">
                                  <th class="min-w-150px">
                                    {{
                                      t("dashboard.alerts.table.violation") ||
                                      "Nama Pelanggaran"
                                    }}
                                  </th>
                                  <th class="min-w-100px">
                                    {{
                                      t("dashboard.alerts.table.duration") ||
                                      "Durasi"
                                    }}
                                  </th>
                                  <th class="min-w-80px">
                                    {{
                                      t("dashboard.alerts.table.detection") ||
                                      "Deteksi"
                                    }}
                                  </th>
                                  <th class="min-w-140px">
                                    {{
                                      t("dashboard.alerts.table.time") ||
                                      "Waktu"
                                    }}
                                  </th>
                                  <th class="min-w-100px">
                                    {{
                                      t("dashboard.alerts.table.status") ||
                                      "Status"
                                    }}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-if="loadingAlerts">
                                  <td colspan="5" class="text-center py-8">
                                    <div
                                      class="spinner-border text-primary"
                                      role="status"
                                    >
                                      <span class="visually-hidden"
                                        >Loading...</span
                                      >
                                    </div>
                                  </td>
                                </tr>
                                <tr v-else-if="!alerts.length">
                                  <td
                                    colspan="5"
                                    class="text-center py-8 text-muted"
                                  >
                                    <i class="pi pi-info-circle fs-2x mb-2"></i>
                                    <div>
                                      {{
                                        t("dashboard.alerts.table.empty") ||
                                        "Tidak ada data pelanggaran"
                                      }}
                                    </div>
                                  </td>
                                </tr>
                                <tr
                                  v-else
                                  v-for="alert in recentAlerts"
                                  :key="alert.event_id"
                                  class="alert-row cursor-pointer"
                                  @click="openAlertDetail(alert)"
                                >
                                  <td>
                                    <div class="d-flex align-items-center">
                                      <div>
                                        <div class="fw-bold text-dark">
                                          {{ alert.alert_type }}
                                        </div>
                                        <div class="text-muted fs-7">
                                          {{ alert.camera_name }}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span class="text-dark fw-semibold">
                                      {{
                                        formatDuration(alert.duration_minutes)
                                      }}
                                    </span>
                                  </td>
                                  <td>
                                    <span class="badge badge-light-primary"
                                      >{{ alert.detection_count }}x</span
                                    >
                                  </td>
                                  <td>
                                    <span class="text-dark">{{
                                      formatDateTime(alert.event_start)
                                    }}</span>
                                  </td>
                                  <td>
                                    <span
                                      class="badge"
                                      :class="statusBadge(alert.status)"
                                    >
                                      {{ statusLabel(alert.status) }}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <!-- Mobile View: Cards -->
                          <div class="d-md-none">
                            <div v-if="loadingAlerts" class="text-center py-8">
                              <div
                                class="spinner-border text-primary"
                                role="status"
                              >
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                            <div
                              v-else-if="!alerts.length"
                              class="text-center py-8 text-muted"
                            >
                              <i class="pi pi-info-circle fs-2x mb-2"></i>
                              <div>
                                {{
                                  t("dashboard.alerts.table.empty") ||
                                  "Tidak ada data pelanggaran"
                                }}
                              </div>
                            </div>
                            <div v-else class="d-flex flex-column gap-3">
                              <div
                                v-for="alert in recentAlerts"
                                :key="`mobile-${alert.event_id}`"
                                class="card bg-light border-0 cursor-pointer shadow-sm"
                                @click="openAlertDetail(alert)"
                              >
                                <div class="card-body p-3">
                                  <div
                                    class="d-flex justify-content-between align-items-start mb-2"
                                  >
                                    <div
                                      class="d-flex align-items-center gap-2"
                                    >
                                      <div class="symbol symbol-35px">
                                        <div
                                          class="symbol-label bg-white text-primary"
                                        >
                                          <i
                                            class="pi pi-exclamation-triangle fs-4"
                                          ></i>
                                        </div>
                                      </div>
                                      <div>
                                        <div class="fw-bold text-dark fs-6">
                                          {{ alert.alert_type }}
                                        </div>
                                        <div class="text-muted fs-8">
                                          {{ alert.camera_name }}
                                        </div>
                                      </div>
                                    </div>
                                    <span
                                      class="badge"
                                      :class="statusBadge(alert.status)"
                                    >
                                      {{ statusLabel(alert.status) }}
                                    </span>
                                  </div>

                                  <div
                                    class="separator separator-dashed my-2"
                                  ></div>

                                  <div class="row g-2 fs-7">
                                    <div class="col-6">
                                      <div class="text-muted">
                                        {{
                                          t(
                                            "dashboard.alerts.table.duration"
                                          ) || "Durasi"
                                        }}
                                      </div>
                                      <div class="fw-bold text-dark">
                                        {{
                                          formatDuration(alert.duration_minutes)
                                        }}
                                      </div>
                                    </div>
                                    <div class="col-6">
                                      <div class="text-muted">
                                        {{
                                          t(
                                            "dashboard.alerts.table.detection"
                                          ) || "Deteksi"
                                        }}
                                      </div>
                                      <div class="fw-bold text-dark">
                                        {{ alert.detection_count }}x
                                      </div>
                                    </div>
                                    <div class="col-12 mt-2">
                                      <div class="text-muted">
                                        {{
                                          t("dashboard.alerts.table.time") ||
                                          "Waktu"
                                        }}
                                      </div>
                                      <div class="fw-bold text-dark">
                                        {{ formatDateTime(alert.event_start) }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- Right Column: Summary Cards -->
                        <div class="col-lg-4">
                          <div class="d-flex flex-column gap-2">
                            <div class="card bg-light-primary border-0">
                              <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                  <div class="symbol symbol-50px flex-shrink-0 me-4">
                                    <div class="symbol-label bg-primary">
                                      <i
                                        class="pi pi-exclamation-circle fs-2 text-white"
                                      ></i>
                                    </div>
                                  </div>
                                  <div class="flex-grow-1 text-end">
                                    <div
                                      class="text-gray-600 fw-semibold fs-7 mb-1"
                                    >
                                      {{
                                        t(
                                          "dashboard.alerts.summary.totalToday.title"
                                        ) || "Total Hari Ini"
                                      }}
                                    </div>
                                    <div
                                      class="d-flex align-items-baseline gap-2 justify-content-end"
                                    >
                                      <div class="fs-2 fw-bolder text-primary">
                                        {{ totalAlertsToday }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="card bg-light-danger border-0">
                              <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                  <div class="symbol symbol-50px flex-shrink-0 me-4">
                                    <div class="symbol-label bg-danger">
                                      <i
                                        class="pi pi-flag-fill fs-2 text-white"
                                      ></i>
                                    </div>
                                  </div>
                                  <div class="flex-grow-1 text-end">
                                    <div
                                      class="text-gray-600 fw-semibold fs-7 mb-1"
                                    >
                                      {{
                                        t(
                                          "dashboard.alerts.summary.unresolvedToday.title"
                                        ) || "Belum Selesai"
                                      }}
                                    </div>
                                    <div class="fs-2 fw-bolder text-danger">
                                      {{ unresolvedAlertsToday }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="card bg-light-success border-0">
                              <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                  <div class="symbol symbol-50px flex-shrink-0 me-4">
                                    <div class="symbol-label bg-success">
                                      <i
                                        class="pi pi-check-circle fs-2 text-white"
                                      ></i>
                                    </div>
                                  </div>
                                  <div class="flex-grow-1 text-end">
                                    <div
                                      class="text-gray-600 fw-semibold fs-7 mb-1"
                                    >
                                      {{
                                        t(
                                          "dashboard.alerts.summary.resolvedToday.title"
                                        ) || "Selesai"
                                      }}
                                    </div>
                                    <div
                                      class="d-flex align-items-baseline gap-2 justify-content-end"
                                    >
                                      <div class="fs-2 fw-bolder text-success">
                                        {{ resolvedAlertsToday }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Divider -->
                    <div class="separator separator-dashed my-0"></div>
                    <!-- Section 3: Real Time Report -->
                    <div class="card-header border-0 pt-3 pb-2">
                      <div class="card-title">
                        <div
                          class="d-flex align-items-center position-relative my-0"
                        >
                          <i
                            class="ki-duotone ki-chart-line fs-4 position-absolute ms-3 text-primary text-white-dark"
                          >
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <h3
                            class="fw-bold ms-10 text-dark text-white-dark fs-5 mb-0"
                          >
                            {{ t("dashboard.sections.realTimeReport.title") }}
                          </h3>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <span class="text-muted fs-8">{{
                          t("dashboard.sections.realTimeReport.subtitle")
                        }}</span>
                      </div>
                    </div>
                    <div class="card-body py-3">
                      <!-- Real Time Report Component -->
                      <RealTimeReport
                        :title="
                          t('dashboard.sections.realTimeReport.componentTitle')
                        "
                        :subtitle="
                          t(
                            'dashboard.sections.realTimeReport.componentSubtitle'
                          )
                        "
                        :showFilters="true"
                        :site-uid="selectedSite"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Alert Detail Modal -->
  <AlertDetailModal
    :show="showAlertModal"
    :alert="selectedAlert"
    :loading="loadingAlertDetail"
    @close="closeAlertModal"
    @update="handleAlertUpdate"
  />
</template>

<script setup lang="ts">
import Card5 from "@/components/cards/Card5.vue";
import RealTimeReport from "@/components/dashboard/RealTimeReport.vue";
import AlertDetailModal from "@/components/apps/events-alerts/AlertDetailModal.vue";
import { ref, onMounted, computed, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import liveActivityMock from "@/assets/mockupData/dashboard/live_activity.json";
import summaryAlertsMock from "@/assets/mockupData/dashboard/summary_alerts.json";
import { todayDate } from "@/core/data/events";
import {
  convertToGMT8,
  formatDateTimeGMT8,
  getCurrentDateTimeGMT8,
  toMomentGMT8,
} from "@/core/helpers/timezone";

interface Site {
  uid: string;
  name: string;
}

// i18n helper
const { t } = useI18n();

// Reactive data untuk live activities dari API
const liveActivities = ref([]);
const loading = ref(true);
const error = ref(null);

// Reactive data untuk alerts
const alerts = ref([]);
const recentAlerts = computed(() => alerts.value.slice(0, 5));
const loadingAlerts = ref(false);
const selectedAlert = ref(null);
const showAlertModal = ref(false);
const loadingAlertDetail = ref(false);

// Auto-refresh functionality
const autoRefreshInterval = ref(null);
const isManualRefreshing = ref(false);

// Carousel state
const carouselContainer = ref(null);
const currentScrollIndex = ref(0);
const cardsPerView = ref(4); // Default cards visible at once
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const dragThreshold = 50; // Minimum drag distance to trigger scroll

// Reactive data
const sistemMonitoring = ref([]);
const navigationApps = ref([]);

const STORAGE_KEY = "lastSelectedSite";
const sites = ref<Site[]>([]);
const selectedSite = ref<string>(
  (typeof window !== "undefined"
    ? window.localStorage.getItem(STORAGE_KEY)
    : null) || ""
);

type MockActivity = {
  activity_uid: string;
  activity_name: string;
  last_activity_timestamp: string;
  currently_active: boolean;
};

const mockLiveActivities = liveActivityMock as Record<string, MockActivity[]>;

type SummaryAlerts = {
  total_today: number;
  unresolved_today: number;
  resolved_today: number;
  as_of: string | null;
};

const summaryAlerts = ref<SummaryAlerts | null>(null);
const loadingSummaryAlerts = ref(false);

// Router setup
const router = useRouter();

// Site selection and header info
// Current date and auto update info
const currentDate = computed(() => {
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${days[now.getDay()]}, ${now.getDate()} ${
    months[now.getMonth()]
  } ${now.getFullYear()} ${now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
});

const autoUpdateInterval = ref(2);

// Computed properties for alert statistics
// NOTE: Counts come from `sites/{site_uid}/alerts-summary` (mocked for now).
const totalAlertsToday = computed(() => summaryAlerts.value?.total_today ?? 0);
const unresolvedAlertsToday = computed(
  () => summaryAlerts.value?.unresolved_today ?? 0
);
const resolvedAlertsToday = computed(
  () => summaryAlerts.value?.resolved_today ?? 0
);

// Local function (requested): endpoint `sites/{site_uid}/alerts-summary` (mock for now)
const fetchSummaryAlerts = async (siteUid: string): Promise<SummaryAlerts> => {
  // TODO: Replace with real endpoint once available.
  // const { data } = await ApiService.get(`sites/${siteUid}/alerts-summary`, { params: { date: getCurrentDateTimeGMT8('YYYY-MM-DD') } });
  // return data;

  const raw: any = (summaryAlertsMock as any)?.default ?? summaryAlertsMock;

  return {
    total_today: Number(raw?.total_today ?? 0),
    unresolved_today: Number(raw?.unresolved_today ?? 0),
    resolved_today: Number(raw?.resolved_today ?? 0),
    as_of:
      raw?.as_of !== undefined && raw?.as_of !== null
        ? convertToGMT8(String(raw.as_of))
        : getCurrentDateTimeGMT8("YYYY-MM-DDTHH:mm:ss.SSSZ"),
  };
};

const loadSummaryAlerts = async () => {
  if (!selectedSite.value) {
    summaryAlerts.value = null;
    return;
  }

  loadingSummaryAlerts.value = true;
  try {
    summaryAlerts.value = await fetchSummaryAlerts(selectedSite.value);
  } catch (err) {
    console.error("loadSummaryAlerts failed:", err);
    summaryAlerts.value = null;
  } finally {
    loadingSummaryAlerts.value = false;
  }
};

// Function to handle site change
// Mapping icon dan warna untuk setiap aktivitas
const activityConfig = {
  preparation: { icon: "fas fa-list-alt", bgColor: "#2196f3" },
  cooking: { icon: "fas fa-fire", bgColor: "#ff5722" },
  portioning: { icon: "fas fa-utensils", bgColor: "#ff9800" },
  delivery: { icon: "fas fa-truck", bgColor: "#4caf50" },
  collectTray: { icon: "fas fa-hand-paper", bgColor: "#9c27b0" },
  washTray: { icon: "fas fa-soap", bgColor: "#00bcd4" },
  completed: { icon: "fas fa-check-circle", bgColor: "#8bc34a" },
  // Legacy Indonesian names (for backward compatibility)
  Persiapan: {
    key: "preparation",
    icon: "fas fa-list-alt",
    bgColor: "#2196f3",
  },
  Masak: { key: "cooking", icon: "fas fa-fire", bgColor: "#ff5722" },
  Pemorsian: { key: "portioning", icon: "fas fa-utensils", bgColor: "#ff9800" },
  Pengiriman: { key: "delivery", icon: "fas fa-truck", bgColor: "#4caf50" },
  "Ambil Nampan": {
    key: "collectTray",
    icon: "fas fa-hand-paper",
    bgColor: "#9c27b0",
  },
  "Cuci Nampan": { key: "washTray", icon: "fas fa-soap", bgColor: "#00bcd4" },
  Selesai: {
    key: "completed",
    icon: "fas fa-check-circle",
    bgColor: "#8bc34a",
  },
  // Default fallback
  default: { icon: "fas fa-tasks", bgColor: "#607d8b" },
};

// Computed properties for carousel
const isCarouselEnabled = computed(() => {
  return liveActivities.value.length > cardsPerView.value;
});

const scrollStep = computed(() => {
  return 100 / cardsPerView.value;
});

const maxScrollIndex = computed(() => {
  return Math.max(0, liveActivities.value.length - cardsPerView.value);
});

const totalPages = computed(() => {
  return Math.ceil(liveActivities.value.length / cardsPerView.value);
});

const trackStyle = computed(() => {
  if (!isCarouselEnabled.value) {
    return {
      display: "flex",
      gap: "20px",
      flexWrap: "nowrap",
      width: "100%",
      transform: "none",
    };
  }

  // Carousel active
  const gap = 20; // px
  const translateP = currentScrollIndex.value * (100 / cardsPerView.value);

  return {
    transform: `translateX(-${translateP}%)`,
    display: "flex",
    gap: `${gap}px`,
    transition: "transform 0.3s ease-in-out",
  };
});

const itemStyle = computed(() => {
  const gap = 20; // px
  // Calculate width: (100% - (total_gaps)) / cardsPerView
  // Total gaps = cardsPerView - 1
  // Use calc() for precise width

  // Checking mobile view requires a responsive listener or CSS media query usage.
  // However, since we want inline style for the carousel math:

  // Note: For mobile, we usually let CSS handle it or have 1 card per view.
  // But here we are reusing the same loop.
  // Let's rely on CSS for width on mobile, and only apply calc on desktop if we can.
  // Or better, use a simpler flex-basis approach that works with gap.

  return {
    flex: `0 0 calc((100% - ${(cardsPerView.value - 1) * gap}px) / ${
      cardsPerView.value
    })`,
    maxWidth: `calc((100% - ${(cardsPerView.value - 1) * gap}px) / ${
      cardsPerView.value
    })`,
  };
});

// Carousel navigation functions
const scrollCarousel = (direction) => {
  if (direction === "next" && currentScrollIndex.value < maxScrollIndex.value) {
    currentScrollIndex.value++;
  } else if (direction === "prev" && currentScrollIndex.value > 0) {
    currentScrollIndex.value--;
  }
};

const scrollToPage = (pageIndex) => {
  currentScrollIndex.value = Math.min(pageIndex, maxScrollIndex.value);
};

// Touch and drag handlers
const handleDragStart = (e) => {
  isDragging.value = true;
  startX.value = e.pageX;
  currentX.value = e.pageX;
};

const handleDragMove = (e) => {
  if (!isDragging.value) return;
  currentX.value = e.pageX;
};

const handleDragEnd = () => {
  if (!isDragging.value) return;

  const diff = startX.value - currentX.value;

  if (Math.abs(diff) > dragThreshold) {
    if (diff > 0) {
      scrollCarousel("next");
    } else {
      scrollCarousel("prev");
    }
  }

  isDragging.value = false;
};

const handleTouchStart = (e) => {
  startX.value = e.touches[0].pageX;
  currentX.value = e.touches[0].pageX;
};

const handleTouchMove = (e) => {
  currentX.value = e.touches[0].pageX;
};

const handleTouchEnd = () => {
  const diff = startX.value - currentX.value;

  if (Math.abs(diff) > dragThreshold) {
    if (diff > 0) {
      scrollCarousel("next");
    } else {
      scrollCarousel("prev");
    }
  }
};

// Alert modal handlers
const openAlertDetail = async (alert: any) => {
  selectedAlert.value = alert;
  showAlertModal.value = true;
};

const closeAlertModal = () => {
  showAlertModal.value = false;
  selectedAlert.value = null;
};

const handleAlertUpdate = (payload: { status: string; comment: string }) => {
  if (selectedAlert.value) {
    selectedAlert.value.status = payload.status;
    selectedAlert.value.comment = payload.comment;

    // Update in alerts array
    const index = alerts.value.findIndex(
      (a) => a.event_id === selectedAlert.value.event_id
    );
    if (index !== -1) {
      alerts.value[index].status = payload.status;
      alerts.value[index].comment = payload.comment;
    }
  }
};

// Manual refresh handler
const handleManualRefresh = async () => {
  if (isManualRefreshing.value) return; // Prevent multiple simultaneous refreshes

  isManualRefreshing.value = true;
  try {
    await loadLiveActivities();
  } finally {
    isManualRefreshing.value = false;
  }
};

// Setup auto-refresh interval
const setupAutoRefresh = () => {
  // Clear existing interval
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
  }

  // Set new interval (5 minutes = 300000 milliseconds)
  autoRefreshInterval.value = setInterval(() => {
    if (!isManualRefreshing.value && selectedSite.value) {
      loadLiveActivities();
    }
  }, 300000); // 5 minutes
};

// Clear auto-refresh interval
const clearAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
};

const loadLiveActivities = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!selectedSite.value) {
      liveActivities.value = [];
      return;
    }

    const { data } = await ApiService.get(
      `sites/${selectedSite.value}/live-activities`
    );

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
      ? data.results
      : [];

    liveActivities.value = list.map((item: any, index: number) => ({
      activity_uid: String(item?.activity_uid ?? item?.uid ?? index),
      activity_name: String(item?.activity_name ?? item?.name ?? "Aktivitas"),
      last_activity_timestamp: convertToGMT8(item?.last_activity_timestamp),
      currently_active: Boolean(item?.currently_active ?? item?.is_active),
    }));
  } catch (err) {
    console.error("loadLiveActivities failed:", err);
    error.value =
      err instanceof Error ? err.message : "Gagal memuat aktivitas.";
    const fallback = mockLiveActivities.default || [];
    liveActivities.value = fallback.map((item) => ({
      activity_uid: item.activity_uid,
      activity_name: item.activity_name,
      last_activity_timestamp: item.last_activity_timestamp,
      currently_active: item.currently_active,
    }));
  } finally {
    loading.value = false;
  }
};

const fetchAlerts = async () => {
  if (!selectedSite.value) {
    alerts.value = [];
    return;
  }

  loadingAlerts.value = true;
  try {
    const { data } = await ApiService.query(
      `sites/${selectedSite.value}/alerts`,
      {
        params: {
          page: 1,
          page_size: 5,
          from_date: new Date().toISOString().split("T")[0],
          to_date: new Date().toISOString().split("T")[0],
        },
      }
    );

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
      ? data.results
      : [];

    const mapped = list.map((item: any) => ({
      event_id: item?.event_id || item?.id,
      alert_type: item?.detected_objects[0].display_name || "Unknown",
      duration_minutes: item?.duration_minutes || 0,
      detection_count: item?.detected_objects[0].detection_count || 0,
      event_start: convertToGMT8(item?.event_start),
      event_end: convertToGMT8(item?.event_end),
      status: item?.status || "not_resolved",
      camera_name: item?.camera_name || "-",
      image_url: item?.image_url || "",
      image_urls: item?.image_urls || [],
      detected_objects: item?.detected_objects || [],
      comment: item?.comment || "",
    }));

    // Sort newest-first so the table can safely take the first 5
    alerts.value = mapped.sort((a: any, b: any) => {
      const bTime = toMomentGMT8(b?.event_start)?.valueOf?.() ?? 0;
      const aTime = toMomentGMT8(a?.event_start)?.valueOf?.() ?? 0;
      return bTime - aTime;
    });
  } catch (err) {
    console.error("fetchAlerts failed:", err);
    alerts.value = [];
  } finally {
    loadingAlerts.value = false;
  }
};

const fetchSites = async () => {
  try {
    const { data } = await ApiService.get("sites");

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
      ? data.results
      : [];

    sites.value = list
      .map((item: any) => {
        const uid = item?.uid ?? item?.site_uid ?? item?.id ?? item?.slug;
        if (!uid) {
          return null;
        }

        return {
          uid: String(uid),
          name: String(
            item?.name ?? item?.display_name ?? item?.site_name ?? `Site ${uid}`
          ),
        } as Site;
      })
      .filter(Boolean) as Site[];

    if (!sites.value.length) {
      selectedSite.value = "";
      liveActivities.value = [];
      loading.value = false;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      return;
    }

    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

    const nextSite =
      stored && sites.value.some((site) => site.uid === stored)
        ? stored
        : sites.value[0].uid;

    if (selectedSite.value !== nextSite) {
      selectedSite.value = nextSite;
      if (typeof window !== "undefined" && nextSite) {
        window.localStorage.setItem(STORAGE_KEY, nextSite);
      }
    } else {
      if (typeof window !== "undefined" && nextSite) {
        window.localStorage.setItem(STORAGE_KEY, nextSite);
      }
      await loadLiveActivities();
    }
  } catch (err) {
    console.error("fetchSites failed:", err);
    error.value = err instanceof Error ? err.message : "Gagal memuat site.";
    sites.value = [];
    liveActivities.value = [];
    loading.value = false;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
};
// Get activity configuration (icon & color)
const getActivityConfig = (activityName) => {
  const config = activityConfig[activityName];
  if (config && config.key) {
    // If it has a key property, use the key to get the config
    return activityConfig[config.key] || activityConfig.default;
  }
  return config || activityConfig.default;
};

// Get translated activity name
const getTranslatedActivityName = (activityName) => {
  const config = activityConfig[activityName];
  if (config && config.key) {
    return t(`dashboard.activities.${config.key}`);
  }
  // For direct key matches
  const translationKey = `dashboard.activities.${activityName}`;
  return t(translationKey, activityName); // Fallback to original name if translation not found
};

// Helper functions for alerts
const normalizeKey = (v?: string) =>
  (v || "").toLowerCase().replace(/[\s_-]/g, "");

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  // Use GMT+8 formatter with Indonesian locale format
  const formatted = formatDateTimeGMT8(value, "DD/MM/YYYY HH:mm");
  return formatted || value;
};

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes))
    return t("appsEventsAlerts.format.notAvailable") || "-";
  if ((minutes || 0) < 1)
    return (
      t("appsEventsAlerts.format.secondsLong", {
        value: formatNumber(Math.max(0, (minutes || 0) * 60), 0),
      }) || `${formatNumber(Math.max(0, (minutes || 0) * 60), 0)} detik`
    );
  return (
    t("appsEventsAlerts.format.minutesLong", {
      value: formatNumber(Math.max(0, minutes || 0), 1),
    }) || `${formatNumber(Math.max(0, minutes || 0), 1)} menit`
  );
};

const statusBadge = (status: string) => {
  const k = normalizeKey(status);
  if (k === "notresolved") return "badge-light-danger";
  if (k === "resolved") return "badge-light-success";
  if (k === "falsealarm") return "badge-light-info";
  return "badge-light-secondary";
};

const statusLabel = (status: string) => {
  const k = normalizeKey(status);
  if (k === "notresolved")
    return (
      t("appsEventsAlerts.alertsTable.status.notResolved") || "Belum Selesai"
    );
  if (k === "resolved")
    return t("appsEventsAlerts.alertsTable.status.resolved") || "Selesai";
  if (k === "falsealarm")
    return t("appsEventsAlerts.alertsTable.status.falseAlarm") || "Alarm Palsu";
  return status || "-";
};

// Update cards per view based on window size
const updateCardsPerView = () => {
  const width = window.innerWidth;
  if (width < 576) {
    cardsPerView.value = 1; // Mobile
  } else if (width < 992) {
    cardsPerView.value = 2; // Tablet
  } else if (width < 1400) {
    cardsPerView.value = 3; // Laptop
  } else {
    cardsPerView.value = 4; // Desktop
  }
  // Reset scroll index if it exceeds new max
  if (currentScrollIndex.value > maxScrollIndex.value) {
    currentScrollIndex.value = maxScrollIndex.value;
  }
};

// Mount lifecycle
onMounted(() => {
  updateCardsPerView();
  window.addEventListener("resize", updateCardsPerView);
  fetchSites();
  fetchAlerts();
  loadSummaryAlerts();
  setupAutoRefresh(); // Setup auto-refresh when component mounts
  window.addEventListener("resize", updateCardsPerView);
});

onBeforeUnmount(() => {
  clearAutoRefresh(); // Clear auto-refresh interval
  window.removeEventListener("resize", updateCardsPerView);
});

watch(selectedSite, async (uid, oldUid) => {
  if (!uid || uid === oldUid) {
    return;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, uid);
  }

  await loadLiveActivities();
  fetchAlerts();
  loadSummaryAlerts();

  // Restart auto-refresh when site changes
  setupAutoRefresh();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateCardsPerView);
  clearAutoRefresh();
});
</script>

<style scoped>
/* Global rendering improvements */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Optimize SVG and icon rendering */
svg,
img {
  shape-rendering: geometricPrecision;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

i,
.ki-duotone,
.fas,
.far,
.fab {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
  position: relative;
  z-index: 1;
}

.card:hover {
  transform: translateY(-4px) translateZ(0);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  z-index: 10;
}

.symbol {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  position: relative;
  z-index: 1;
}

.card:hover .symbol {
  transform: scale(1.08) translateZ(0);
}

/* Prevent hover effects on touch devices */
@media (hover: none) {
  .card:hover {
    transform: translateZ(0);
    box-shadow: none;
  }

  .card:hover .symbol {
    transform: scale(1) translateZ(0);
  }
}

.dashboard-section-header {
  background: transparent;
}

.dashboard-section-header .header-meta {
  gap: 0.75rem;
}

.dashboard-section-header .header-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
}

.dashboard-section-header .header-meta-item .icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  transition: all 0.2s ease;
}

.dashboard-section-header .header-meta-item .icon-wrapper:hover {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.05);
}

.dashboard-section-header .header-meta-item .icon-wrapper:active {
  transform: scale(0.95);
}

.dashboard-section-header .header-meta-item .icon-wrapper i {
  color: #3b82f6;
}

.dashboard-section-header .header-meta-item .meta-text {
  line-height: 1.4;
}

[data-bs-theme="dark"] .dashboard-section-header .header-meta-item,
.dark .dashboard-section-header .header-meta-item,
.app-dark .dashboard-section-header .header-meta-item {
  color: #cbd5f5;
}

[data-bs-theme="dark"]
  .dashboard-section-header
  .header-meta-item
  .icon-wrapper,
.dark .dashboard-section-header .header-meta-item .icon-wrapper,
.app-dark .dashboard-section-header .header-meta-item .icon-wrapper {
  background: rgba(59, 130, 246, 0.2);
}

[data-bs-theme="dark"]
  .dashboard-section-header
  .header-meta-item
  .icon-wrapper
  i,
.dark .dashboard-section-header .header-meta-item .icon-wrapper i,
.app-dark .dashboard-section-header .header-meta-item .icon-wrapper i {
  color: #60a5fa;
}

.dashboard-section-header .card-toolbar {
  justify-content: flex-end;
}

.dashboard-section-header .card-toolbar label {
  min-width: max-content;
}

/* Site Selection Dropdown */
.form-select-sm {
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid #e4e6ef;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.form-select-sm:hover {
  border-color: #3b82f6;
  background-color: #ffffff;
}

.form-select-sm:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.15);
  background-color: #ffffff;
}

[data-bs-theme="dark"] .form-select-sm,
.dark .form-select-sm,
.app-dark .form-select-sm {
  background-color: #1e293b;
  border-color: #3f4254;
  color: #ffffff;
}

[data-bs-theme="dark"] .form-select-sm:hover,
.dark .form-select-sm:hover,
.app-dark .form-select-sm:hover {
  background-color: #2d3748;
  border-color: #3b82f6;
}

/* Badge styling */
.badge-light-primary {
  background-color: #eff6ff;
  color: #3b82f6;
  padding: 0.35rem 0.65rem;
  font-weight: 500;
}

[data-bs-theme="dark"] .badge-light-primary,
.dark .badge-light-primary,
.app-dark .badge-light-primary {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

/* Carousel Styles */
.activities-carousel-wrapper {
  position: relative;
  padding: 0.5rem;
  margin: -0.5rem;
  overflow: hidden;
}

.activities-carousel {
  overflow: hidden;
  cursor: grab;
  user-select: none;
  padding: 0.5rem 0;
  position: relative;
}

.activities-carousel:active {
  cursor: grabbing;
}

.activities-carousel-track {
  display: flex;
  gap: 20px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.carousel-item-wrapper {
  flex: 0 0 calc(25% - 15px);
  min-width: 0;
  position: relative;
  z-index: 1;
}

/* Pagination Dots */
.carousel-pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 1rem;
}

.pagination-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.pagination-dot:hover {
  background: #94a3b8;
  transform: scale(1.2);
}

.pagination-dot.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 18px;
  border-radius: 3px;
}

/* Daily Process Card Enhancement */
.daily-process-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

[data-bs-theme="dark"] .daily-process-card,
.dark .daily-process-card,
.app-dark .daily-process-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Dashboard Main Card - Gabungan 3 Section */
.dashboard-main-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

[data-bs-theme="dark"] .dashboard-main-card,
.dark .dashboard-main-card,
.app-dark .dashboard-main-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Separator styling */
.separator.separator-dashed {
  border-top: 1px dashed #e4e6ef;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

[data-bs-theme="dark"] .separator.separator-dashed,
.dark .separator.separator-dashed,
.app-dark .separator.separator-dashed {
  border-top: 1px dashed #3f4254;
}

/* Responsive Carousel */
/* Extra large screens - 7 cards */
@media (min-width: 1400px) {
  .carousel-item-wrapper {
    flex: 0 0 calc((100% - 120px) / 7);
  }
}

/* Large screens - 5 cards */
@media (max-width: 1399px) and (min-width: 1200px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(20% - 16px);
  }
}

/* Medium-large screens - 4 cards */
@media (max-width: 1199px) and (min-width: 993px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(25% - 15px);
  }

  .activities-carousel-wrapper {
    padding: 0 0.5rem;
  }
}

/* Medium screens - 3 cards */
@media (max-width: 992px) and (min-width: 577px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(33.333% - 13.333px);
  }

  .activities-carousel-wrapper {
    padding: 0 0.5rem;
  }
}

/* Small screens - 1 card */
@media (max-width: 576px) {
  .carousel-item-wrapper {
    flex: 0 0 100%;
  }

  .activities-carousel-wrapper {
    padding: 0 0.5rem;
    margin: 0;
  }

  .activities-carousel-track {
    gap: 10px;
  }

  .dashboard-section-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .dashboard-section-header .card-toolbar {
    width: 100%;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .dashboard-section-header .header-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .dashboard-section-header .header-meta-item {
    width: 100%;
    justify-content: flex-start;
  }

  .card-body {
    padding: 1rem;
  }

  .row {
    margin: 0;
  }

  .col-6 {
    padding: 0.25rem;
  }

  /* Stack columns vertically on mobile */
  .row > [class*="col-"] {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Responsive grid adjustments */
@media (max-width: 1400px) {
  .col-xxl-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
  }
}

@media (max-width: 1200px) {
  .col-xl-2 {
    flex: 0 0 auto;
    width: 20%;
  }
}

@media (max-width: 992px) {
  .col-lg-2 {
    flex: 0 0 auto;
    width: 20%;
  }
  .col-lg-3 {
    flex: 0 0 auto;
    width: 25%;
  }
}

@media (max-width: 768px) {
  .col-md-4 {
    flex: 0 0 auto;
    width: 50%;
  }
}

@media (max-width: 576px) {
  .col-6 {
    flex: 0 0 auto;
    width: 100%;
  }

  .app-page {
    padding: 0.5rem;
  }

  .container-fluid {
    padding: 0.5rem;
  }

  /* Improve button spacing on mobile */
  .btn-group {
    flex-direction: column;
    gap: 0.25rem;
  }

  /* Better form controls */
  .form-select-sm {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  /* Optimize text sizes */
  .fs-1 {
    font-size: 1.75rem !important;
  }

  .fs-2 {
    font-size: 1.5rem !important;
  }

  /* Better touch targets */
  .btn {
    min-height: 44px;
    min-width: 44px;
  }

  .pagination-dot {
    width: 12px;
    height: 12px;
    margin: 0 2px;
  }

  .pagination-dot.active {
    width: 24px;
  }
}

/* Tablet optimization */
@media (max-width: 768px) and (min-width: 577px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(50% - 10px);
  }

  .activities-carousel-track {
    gap: 15px;
  }

  .dashboard-section-header {
    padding: 1.25rem;
  }

  .card {
    margin-bottom: 1rem;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease-out;
}

/* Dark theme support */
[data-bs-theme="dark"] .text-white-dark,
.dark .text-white-dark,
.app-dark .text-white-dark {
  color: #ffffff !important;
}

/* Ensure icons are bright in dark theme */
[data-bs-theme="dark"] .text-primary,
.dark .text-primary,
.app-dark .text-primary {
  color: #3b82f6 !important;
}

[data-bs-theme="dark"] .text-info,
.dark .text-info,
.app-dark .text-info {
  color: #06b6d4 !important;
}

[data-bs-theme="dark"] .text-warning,
.dark .text-warning,
.app-dark .text-warning {
  color: #f59e0b !important;
}

[data-bs-theme="dark"] .text-success,
.dark .text-success,
.app-dark .text-success {
  color: #10b981 !important;
}

[data-bs-theme="dark"] .text-danger,
.dark .text-danger,
.app-dark .text-danger {
  color: #ef4444 !important;
}

/* Alerts Section Styles */
.alert-row {
  transition: all 0.2s ease;
  cursor: pointer;
}

.alert-row:hover {
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateY(-1px);
}

[data-bs-theme="dark"] .alert-row:hover,
.dark .alert-row:hover,
.app-dark .alert-row:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.alert-row td {
  vertical-align: middle;
}

.alert-row .symbol img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

/* Summary Cards Animation */
.card.bg-light-primary,
.card.bg-light-danger,
.card.bg-light-success {
  transition: all 0.3s ease;
}

.card.bg-light-primary:hover,
.card.bg-light-danger:hover,
.card.bg-light-success:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* Badge styles for dark mode */
[data-bs-theme="dark"] .badge-light-danger,
.dark .badge-light-danger,
.app-dark .badge-light-danger {
  background-color: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

[data-bs-theme="dark"] .badge-light-success,
.dark .badge-light-success,
.app-dark .badge-light-success {
  background-color: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

[data-bs-theme="dark"] .badge-light-info,
.dark .badge-light-info,
.app-dark .badge-light-info {
  background-color: rgba(6, 182, 212, 0.2);
  color: #22d3ee;
}

/* Responsive table on mobile */
@media (max-width: 992px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .min-w-150px {
    min-width: 120px !important;
  }

  .min-w-100px {
    min-width: 80px !important;
  }

  .min-w-80px {
    min-width: 60px !important;
  }

  .min-w-140px {
    min-width: 100px !important;
  }
}

@media (max-width: 576px) {
  .alert-row .symbol {
    width: 35px !important;
    height: 35px !important;
  }

  .alert-row .fs-7 {
    font-size: 0.75rem !important;
  }

  .card.bg-light-primary .card-body,
  .card.bg-light-danger .card-body,
  .card.bg-light-success .card-body {
    padding: 1rem !important;
  }

  .symbol-50px {
    width: 40px !important;
    height: 40px !important;
  }

  .fs-2x {
    font-size: 1.5rem !important;
  }
}

/* Force Center daily process on mobile */
@media (max-width: 768px) {
  .activities-carousel-track.justify-content-center .carousel-item-wrapper {
    margin: 0 auto;
    flex: 0 0 85% !important; /* Ensure consistent width */
  }
  
  /* If justified center is active (single item), ensure track takes full width and item is centered */
  .activities-carousel-track.justify-content-center {
    width: 100% !important;
  }
}
</style>
