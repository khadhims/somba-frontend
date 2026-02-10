<script setup>
/**
 * RealTimeReport Component
 *
 * A comprehensive dashboard component for displaying real-time process tracking
 * with interactive Gantt charts, auto-play functionality, and detailed modals.
 *
 * Features:
 * - Interactive Gantt chart with Highcharts
 * - Date picker for historical data
 * - Auto-play timeline with popup indicators
 * - Image modals and detail views
 * - Status filtering and legend
 * - Responsive design with hover effects
 */

import { ref, onMounted, onUnmounted, nextTick, watch, computed } from "vue";
import DatePicker from "@/components/DatePicker.vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import mockEventActivity from "@/assets/mockupData/dashboard/event_activity.json";
import {
  toGMT8ISOString,
  formatDateTimeGMT8,
  toMomentGMT8,
} from "@/core/helpers/timezone";

const { t } = useI18n();

// ========================
// COMPONENT CONFIGURATION
// ========================

// Component state
const chartsReady = ref(false);
const isRendering = ref(false);

// Props definition
const props = defineProps({
  title: {
    type: String,
    default: "Real Time Report",
  },
  subtitle: {
    type: String,
    default: "Live Process Timeline & Duration Tracking",
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
  siteUid: {
    type: String,
    default: null,
  },
});

// ========================
// REACTIVE STATE
// ========================

// Filter state for process tracking chart
const selectedStatuses = ref(["active", "completed", "scheduled"]);

// Date range state (from_date / to_date) - using single picker
const selectedDate = ref(new Date());
const showDatePicker = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDateValue = ref(""); // Single date picker value
const fromDate = ref("");
const toDate = ref("");
const fromDateKey = "lastSelectedFromDate";
const toDateKey = "lastSelectedToDate";
const legacyFromDateKey = "globalFromDate";
const legacyToDateKey = "globalToDate";

// API data state
const apiData = ref([]);
const isLoading = ref(false);
const apiError = ref(null);
const fetchJobId = ref(0); // Counter to track and cancel stale fetch jobs

// Chart and playback state
let chartInstance = null;
const isPlaying = ref(false);
const playSpeed = ref(2000); // 2 seconds per step
let playInterval = null;
let currentPlayheadPosition = null;
let playheadPopups = []; // Auto-play popups (temporary)
let hoverPreview = null; // Hover preview popup (single, small)
let alertsAutoRefreshInterval = null;
const hasInitiallyLoaded = ref(false); // Flag to prevent duplicate initial loads

// Modal states
const showImageModal = ref(false);
const modalImageSrc = ref("");
const modalImageAlt = ref("");
const showDetailModal = ref(false);
const modalDetailData = ref(null);
const detailImageIndex = ref(0);
const detailModalImages = computed(() => {
  const detail = modalDetailData.value;
  if (!detail) {
    return [];
  }
  const images = Array.isArray(detail.image_urls)
    ? detail.image_urls.filter(Boolean)
    : [];
  const uniqueImages = images.filter(
    (url, index, self) => self.indexOf(url) === index
  );
  if (detail.image_url) {
    const currentIndex = uniqueImages.indexOf(detail.image_url);
    if (currentIndex > 0) {
      uniqueImages.splice(currentIndex, 1);
      uniqueImages.unshift(detail.image_url);
    } else if (currentIndex === -1) {
      uniqueImages.unshift(detail.image_url);
    }
  }
  return uniqueImages;
});
const currentDetailImage = computed(
  () => detailModalImages.value[detailImageIndex.value] ?? null
);
const hasMultipleDetailImages = computed(
  () => detailModalImages.value.length > 1
);

watch(modalDetailData, () => {
  detailImageIndex.value = 0;
});

watch(detailModalImages, (images) => {
  if (detailImageIndex.value >= images.length) {
    detailImageIndex.value = 0;
  }
});

const showNextDetailImage = () => {
  if (detailModalImages.value.length <= 1) {
    return;
  }
  detailImageIndex.value =
    (detailImageIndex.value + 1) % detailModalImages.value.length;
};

const showPreviousDetailImage = () => {
  if (detailModalImages.value.length <= 1) {
    return;
  }
  detailImageIndex.value =
    (detailImageIndex.value - 1 + detailModalImages.value.length) %
    detailModalImages.value.length;
};

// Shared mapping helpers
const detectionToProcessMap = {
  apd: "Persiapan",
  apd_without_mask: "Persiapan",
  person: "Masak",
  helmet: "Persiapan",
  food: "Pemorsian",
  plate: "Pemorsian",
  tray: "Pengiriman",
  cleaning: "Cuci Nampan",
};

const cameraFallbackActivities = {
  "cam01-ruang masak": ["masak"],
  "cam05-ruang pemorsian": ["pemorsian"],
  "cam04-ruang persiapan": ["persiapan"],
};

const activityKeyToProcessName = {
  persiapan: "Persiapan",
  masak: "Masak",
  pemorsian: "Pemorsian",
  pengiriman: "Pengiriman",
  ambilnampan: "Ambil Nampan",
  cucinampan: "Cuci Nampan",
  cucitray: "Cuci Nampan",
  selesai: "Selesai",
};

const normalizeCameraNameKey = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).toLowerCase().trim();
};

const normalizeActivityKey = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\s_-]/g, "")
    .trim();
};

const formatActivityLabel = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  const cleaned = String(value).replace(/[_-]+/g, " ").trim();
  if (!cleaned) {
    return "";
  }
  return cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const canonicalizeActivityLabel = (value) => {
  const key = normalizeActivityKey(value);
  if (!key) {
    return "";
  }
  return activityKeyToProcessName[key] ?? formatActivityLabel(value ?? "");
};

const resolveActivityFromCamera = (cameraName) => {
  const normalized = normalizeCameraNameKey(cameraName);
  if (!normalized) {
    return [];
  }

  for (const [pattern, activities] of Object.entries(
    cameraFallbackActivities
  )) {
    if (normalized.includes(pattern)) {
      if (Array.isArray(activities)) {
        return [...activities];
      }
      return [];
    }
  }

  return [];
};

const normalizeActivitiesValue = (value, cameraName) => {
  const resolved = [];

  const pushCandidate = (candidate) => {
    if (candidate === null || candidate === undefined) {
      return;
    }
    const canonical = canonicalizeActivityLabel(candidate);
    if (canonical) {
      resolved.push(canonical);
    }
  };

  if (Array.isArray(value) && value.length) {
    value.forEach((item) => {
      if (typeof item === "string" || typeof item === "number") {
        pushCandidate(item);
      } else if (item && typeof item === "object") {
        const candidate =
          item.label ?? item.name ?? item.activity ?? item.value ?? item.title;
        pushCandidate(candidate);
      }
    });
  }

  if (!resolved.length && typeof value === "string" && value.trim()) {
    pushCandidate(value);
  }

  if (!resolved.length && cameraName) {
    const fallbackActivities = resolveActivityFromCamera(cameraName);
    fallbackActivities.forEach((activity) => {
      if (typeof activity === "string" || typeof activity === "number") {
        pushCandidate(activity);
      }
    });
  }

  const unique = Array.from(new Set(resolved));
  return unique;
};

const enrichAlertWithActivities = (alert) => {
  if (!alert || typeof alert !== "object") {
    return alert;
  }

  const activities = normalizeActivitiesValue(
    alert.activities,
    alert.camera_name
  );
  return {
    ...alert,
    activities,
  };
};

const enrichAlertsWithActivities = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map((entry) => enrichAlertWithActivities(entry));
};

const statusMap = {
  not_resolved: "active",
  resolved: "completed",
  in_progress: "active",
};

const normalizeStatusKey = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .toLowerCase()
    .replace(/[\s_-]/g, "");
};

const detailStatusBadgeClass = (status) => {
  const key = normalizeStatusKey(status);
  if (key === "resolved" || key === "completed") {
    return "badge-light-success";
  }
  if (key === "notresolved" || key === "active") {
    return "badge-light-danger";
  }
  if (key === "falsealarm") {
    return "badge-light-info";
  }
  if (key === "scheduled") {
    return "badge-light-warning";
  }
  return "badge-light-secondary";
};

const detailStatusLabel = (status) => {
  const key = normalizeStatusKey(status);
  if (key === "resolved" || key === "completed") {
    return "Selesai";
  }
  if (key === "notresolved" || key === "active") {
    return "Belum Selesai";
  }
  if (key === "falsealarm") {
    return "Alarm Palsu";
  }
  if (key === "scheduled") {
    return "Terjadwal";
  }
  return status || "Tidak diketahui";
};

// Generate calendar days for date picker
const generateCalendarDays = () => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear.value, currentMonth.value, day));
  }

  return calendarDays;
};

const calendarDays = ref(generateCalendarDays());

// Month navigation
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  calendarDays.value = generateCalendarDays();
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  calendarDays.value = generateCalendarDays();
};

// ========================
// API AND DATA FUNCTIONS
// ========================

// Fetch alerts for selected site between fromDate and toDate (with mockup fallback)
const fetchAlertsDebounceTimer = ref(null);

const fetchAlerts = async () => {
  // Debounce the actual fetch execution
  if (fetchAlertsDebounceTimer.value) {
    clearTimeout(fetchAlertsDebounceTimer.value);
  }

  fetchAlertsDebounceTimer.value = setTimeout(() => {
    void executeFetchAlerts();
  }, 300);
};

const executeFetchAlerts = async () => {
  isLoading.value = true;
  apiError.value = null;

  // Increment job ID to invalidate previous running fetches
  const currentJobId = ++fetchJobId.value;

  try {
    const site =
      props.siteUid || window.localStorage.getItem("lastSelectedSite");
    if (!site) {
      apiData.value = [];
      apiError.value = "Site tidak dipilih.";
      isLoading.value = false;
      return;
    }

    const f = fromDate.value;
    const t = toDate.value;

    const baseResource = `/sites/${site}/alerts`;
    const baseParams = {
      from_date: f,
      to_date: t,
      // camera_uuid: 'fb3a2107-befe-4aa9-b099-f642dc65cc3d',
      page_size: 100,
    };
    const baseHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const axiosInstance = ApiService.vueInstance?.axios;
    if (!axiosInstance) {
      throw new Error(
        "Axios instance belum diinisialisasi. Pastikan ApiService.init sudah dipanggil."
      );
    }
    const baseUrl = axiosInstance.defaults?.baseURL ?? "";

    const aggregatedData = [];
    const visitedLinks = new Set();
    const pagingState = {
      nextLink: null,
      currentPage: 1,
      lastPage: null,
      hasMetaNext: false,
    };
    const MAX_PAGES = 50;
    const shouldPaginate = true; // Temporary: only fetch page 1

    const fetchPage = async (pageNumber) => {
      const params = { ...baseParams };
      if (pageNumber != null) {
        params.page = pageNumber;
      }
      const config = {
        params,
        headers: baseHeaders,
      };
      return ApiService.query(baseResource, config);
    };

    const processPayload = (payload) => {
      const items = extractAlertsFromPayload(payload);
      if (items.length) {
        aggregatedData.push(...items);
      }

      const info = resolvePaginationInfo(payload);
      if (info.currentPage != null && !Number.isNaN(info.currentPage)) {
        pagingState.currentPage = info.currentPage;
      }
      if (info.lastPage != null && !Number.isNaN(info.lastPage)) {
        pagingState.lastPage = info.lastPage;
      }

      if (info.nextLink) {
        pagingState.nextLink = normalizeNextLink(
          info.nextLink,
          baseResource,
          baseUrl
        );
      } else {
        pagingState.nextLink = null;
      }

      pagingState.hasMetaNext = Boolean(
        info.hasNext ||
          (info.currentPage != null &&
            info.lastPage != null &&
            info.currentPage < info.lastPage)
      );

      return items.length;
    };

    let response = await fetchPage(pagingState.currentPage);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Gagal mengambil data alerts");
    }

    let payload = response.data;
    processPayload(payload);

    let iteration = 1;
    while (
      shouldPaginate &&
      iteration < MAX_PAGES &&
      (pagingState.nextLink || pagingState.hasMetaNext)
    ) {
      // Check if a new fetch job has started
      if (fetchJobId.value !== currentJobId) {
        console.log(
          `[RealTimeReport] Aborting stale fetch job ${currentJobId} (current: ${fetchJobId.value})`
        );
        return; // Stop this job completely
      }

      iteration += 1;
      const previousCount = aggregatedData.length;

      if (pagingState.nextLink) {
        const normalizedLink = normalizeNextLink(
          pagingState.nextLink,
          baseResource,
          baseUrl
        );
        if (!normalizedLink) {
          pagingState.nextLink = null;
        } else if (visitedLinks.has(normalizedLink)) {
          console.warn(
            "[RealTimeReport] Duplicate next link detected, stopping pagination to avoid loop:",
            normalizedLink
          );
          pagingState.nextLink = null;
        } else {
          visitedLinks.add(normalizedLink);
          payload = (
            await axiosInstance.get(normalizedLink, { headers: baseHeaders })
          ).data;
          processPayload(payload);
        }
      } else if (pagingState.hasMetaNext) {
        const nextPageNumber = (pagingState.currentPage ?? 1) + 1;
        pagingState.currentPage = nextPageNumber;
        response = await fetchPage(nextPageNumber);
        payload = response.data;
        processPayload(payload);
      } else {
        break;
      }

      if (aggregatedData.length === previousCount) {
        console.warn(
          "[RealTimeReport] Pagination did not return additional data, stopping to avoid infinite loop."
        );
        break;
      }
    }

    if (iteration >= MAX_PAGES) {
      console.warn(
        `[RealTimeReport] Reached pagination cap of ${MAX_PAGES} iterations. Some data may not be loaded.`
      );
    }

    if (!aggregatedData.length) {
      apiData.value = enrichAlertsWithActivities(mockEventActivity);
      apiError.value = null;
      return;
    }

    apiError.value = null;
    apiData.value = enrichAlertsWithActivities(aggregatedData);
  } catch (err) {
    // fallback to mockup
    console.error("API error, response format or anoher thing occurs:", err);
    apiData.value = enrichAlertsWithActivities(mockEventActivity);
    apiError.value = null;
  } finally {
    isLoading.value = false;
  }
};

const startAlertsAutoRefresh = () => {
  if (typeof window === "undefined") {
    return;
  }
  if (alertsAutoRefreshInterval) {
    clearInterval(alertsAutoRefreshInterval);
  }
  alertsAutoRefreshInterval = window.setInterval(() => {
    if (typeof document !== "undefined" && document.hidden) {
      return;
    }
    if (!isLoading.value) {
      void fetchAlerts();
    }
  }, 300000);
};

const stopAlertsAutoRefresh = () => {
  if (alertsAutoRefreshInterval) {
    clearInterval(alertsAutoRefreshInterval);
    alertsAutoRefreshInterval = null;
  }
};

const convertToIsoString = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Date) {
    const timestamp = value.getTime();
    if (Number.isNaN(timestamp)) {
      return null;
    }
    return toGMT8ISOString(value.toISOString());
  }
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? null
      : toGMT8ISOString(date.toISOString());
  }
  return toGMT8ISOString(String(value));
};

const calculateDurationMinutes = (startIso, endIso) => {
  if (!startIso || !endIso) {
    return null;
  }
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);
  const diffMs = endDate.getTime() - startDate.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) {
    return null;
  }
  return Math.round(diffMs / (1000 * 60));
};

const extractAlertsFromPayload = (payload) => {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  const candidateKeys = [
    "data",
    "results",
    "items",
    "alerts",
    "records",
    "rows",
  ];
  for (const key of candidateKeys) {
    const value = payload?.[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
};

const normalizeNextLink = (link, baseResource, baseUrl = "") => {
  if (!link || typeof link !== "string") {
    return null;
  }
  const trimmed = link.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const defaultOrigin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "http://localhost";
  let reference;
  try {
    reference = baseUrl
      ? new URL(baseUrl, defaultOrigin)
      : new URL(baseResource, defaultOrigin);
  } catch {
    reference = new URL(defaultOrigin);
  }

  try {
    const resolved = new URL(trimmed, reference);
    if (resolved.origin === reference.origin) {
      return resolved.pathname + resolved.search;
    }
    return resolved.toString();
  } catch {
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
    if (trimmed.startsWith("?")) {
      return `${baseResource}${trimmed}`;
    }
    return trimmed;
  }
};

const resolvePaginationInfo = (payload) => {
  const info = {
    nextLink: null,
    currentPage: null,
    lastPage: null,
    hasNext: false,
  };

  if (!payload || typeof payload !== "object") {
    return info;
  }

  const potentialNextLinks = [
    payload?.links?.next,
    payload?.meta?.links?.next,
    payload?.meta?.next_page_url,
    payload?.meta?.next,
    payload?.meta?.pagination?.next,
    payload?.meta?.pagination?.next_page_url,
    payload?.pagination?.next,
    payload?.pagination?.next_page_url,
    payload?.next,
    payload?.next_page_url,
  ];

  for (const link of potentialNextLinks) {
    if (typeof link === "string" && link) {
      info.nextLink = link;
      break;
    }
  }

  const metaCandidates = [
    payload?.meta?.pagination,
    payload?.pagination,
    payload?.meta,
  ];
  metaCandidates.forEach((meta) => {
    if (!meta || typeof meta !== "object") {
      return;
    }

    if (info.currentPage == null) {
      const currentCandidates = [
        meta.current_page,
        meta.currentPage,
        meta.page,
        meta.page_index,
        meta.pageIndex,
        meta.pagination?.page,
      ];
      for (const candidate of currentCandidates) {
        if (typeof candidate === "number" && !Number.isNaN(candidate)) {
          info.currentPage = candidate;
          break;
        }
      }
    }

    if (info.lastPage == null) {
      const lastCandidates = [
        meta.last_page,
        meta.lastPage,
        meta.total_pages,
        meta.totalPages,
        meta.page_count,
        meta.pageCount,
        meta.pagination?.pageCount,
      ];
      for (const candidate of lastCandidates) {
        if (typeof candidate === "number" && !Number.isNaN(candidate)) {
          info.lastPage = candidate;
          break;
        }
      }
    }

    if (!info.hasNext) {
      const nextIndicators = [
        meta.has_next,
        meta.hasNext,
        meta.has_more,
        meta.hasMore,
        meta.next_page,
        meta.nextPage,
        meta.pagination?.has_next,
        meta.pagination?.hasNext,
      ];
      info.hasNext = nextIndicators.some((flag) => {
        if (typeof flag === "boolean") {
          return flag;
        }
        if (typeof flag === "number") {
          const current = info.currentPage ?? 0;
          return flag > current;
        }
        return false;
      });
    }

    if (
      !info.hasNext &&
      typeof meta.next_page_url === "string" &&
      meta.next_page_url
    ) {
      info.hasNext = true;
      if (!info.nextLink) {
        info.nextLink = meta.next_page_url;
      }
    }
  });

  if (!info.hasNext && info.currentPage != null && info.lastPage != null) {
    info.hasNext = info.currentPage < info.lastPage;
  }

  if (!info.hasNext) {
    const inlineNext = payload?.next_page ?? payload?.nextPage ?? null;
    if (typeof inlineNext === "number") {
      const current = info.currentPage ?? 0;
      info.hasNext = inlineNext > current;
    }
  }

  return info;
};

const extractPointSnapshot = (point) => {
  if (!point) {
    return null;
  }

  const startIso = convertToIsoString(
    point.start ?? point.startDate ?? point.displayStartTime ?? null
  );
  const endIso = convertToIsoString(
    point.end ?? point.endDate ?? point.displayEndTime ?? null
  );
  const resolvedIdRaw =
    point.event_id ?? point.eventId ?? point.id ?? point.uid ?? null;
  const resolvedId = resolvedIdRaw != null ? String(resolvedIdRaw) : null;

  const pointImages = Array.isArray(point.image_urls)
    ? point.image_urls.filter(Boolean)
    : [];
  const dedupedImages = pointImages.filter(
    (url, index, self) => self.indexOf(url) === index
  );
  let primaryImage = point.image_url || null;
  if (!primaryImage && dedupedImages.length > 0) {
    primaryImage = dedupedImages[0];
  } else if (primaryImage) {
    const existingIndex = dedupedImages.indexOf(primaryImage);
    if (existingIndex > 0) {
      dedupedImages.splice(existingIndex, 1);
      dedupedImages.unshift(primaryImage);
    } else if (existingIndex === -1) {
      dedupedImages.unshift(primaryImage);
    }
  }

  return {
    id: resolvedId,
    eventId: resolvedId,
    event_id: resolvedId,
    name: point.name ?? point.process ?? null,
    process: point.process ?? point.name ?? null,
    status: point.status ?? null,
    raw_status: point.raw_status ?? null,
    color: point.color ?? null,
    start: startIso,
    end: endIso,
    duration_minutes:
      point.duration_minutes ?? calculateDurationMinutes(startIso, endIso),
    image_url: primaryImage,
    image_urls: dedupedImages,
    camera_name: point.camera_name ?? null,
    total_detections: point.total_detections ?? null,
    detected_objects: point.detected_objects ?? [],
    activities: normalizeActivitiesValue(point.activities, point.camera_name),
  };
};

const normalizeAlertDetail = (detail, fallbackPoint = null) => {
  if (!detail && !fallbackPoint) {
    return null;
  }

  const pointReference = fallbackPoint ? { ...fallbackPoint } : {};
  const primaryDetection =
    Array.isArray(detail?.detected_objects) &&
    detail.detected_objects.length > 0
      ? detail.detected_objects[0]
      : null;
  const inferredProcess =
    pointReference.name ||
    pointReference.process ||
    (primaryDetection
      ? detectionToProcessMap[primaryDetection.object_type]
      : undefined);

  const resolvedEventIdRaw =
    detail?.event_id ??
    pointReference.event_id ??
    pointReference.eventId ??
    pointReference.id ??
    pointReference.uid ??
    null;
  const resolvedEventId =
    resolvedEventIdRaw != null ? String(resolvedEventIdRaw) : null;
  const startIso =
    convertToIsoString(detail?.event_start) ??
    convertToIsoString(
      pointReference.start ?? pointReference.startDate ?? null
    );
  const endIso =
    convertToIsoString(detail?.event_end) ??
    convertToIsoString(pointReference.end ?? pointReference.endDate ?? null);
  const normalizedDurationMinutes =
    typeof detail?.duration_minutes === "number"
      ? detail.duration_minutes
      : calculateDurationMinutes(startIso, endIso);

  const imageCandidates = [];
  if (Array.isArray(detail?.image_urls)) {
    imageCandidates.push(...detail.image_urls.filter(Boolean));
  }
  if (detail?.image_url) {
    imageCandidates.unshift(detail.image_url);
  }
  if (Array.isArray(pointReference.image_urls)) {
    imageCandidates.push(...pointReference.image_urls.filter(Boolean));
  }
  if (pointReference.image_url) {
    imageCandidates.push(pointReference.image_url);
  }

  const dedupedImages = imageCandidates
    .filter(Boolean)
    .filter((url, index, self) => self.indexOf(url) === index);
  const resolvedImage = dedupedImages.length > 0 ? dedupedImages[0] : null;

  return {
    ...pointReference,
    ...detail,
    id:
      resolvedEventId ??
      pointReference.id ??
      pointReference.event_id ??
      pointReference.eventId ??
      null,
    eventId: resolvedEventId,
    event_id: resolvedEventId,
    name: inferredProcess ?? detail?.camera_name ?? "Event Alert",
    process: inferredProcess ?? detail?.camera_name ?? "Event Alert",
    status: detail?.status
      ? statusMap[detail.status] || detail.status
      : pointReference.status || "active",
    raw_status: detail?.status ?? pointReference.status ?? null,
    start: startIso,
    end: endIso,
    duration_minutes: normalizedDurationMinutes,
    total_detections:
      detail?.total_detections ?? pointReference.total_detections ?? null,
    detected_objects:
      detail?.detected_objects ?? pointReference.detected_objects ?? [],
    comment: detail?.comment ?? pointReference.comment ?? null,
    image_url: resolvedImage,
    image_urls: dedupedImages,
    camera_name: detail?.camera_name ?? pointReference.camera_name ?? null,
    activities: normalizeActivitiesValue(
      detail?.activities ?? pointReference.activities,
      detail?.camera_name ?? pointReference.camera_name ?? null
    ),
  };
};

// Helper function to find alert in local apiData without network requests
const getAlertFromLocalData = (eventId) => {
  if (!eventId) return null;
  const id = String(eventId);
  return (
    apiData.value.find((item) => {
      const candidates = [
        item.event_id,
        item.eventId,
        item.id,
        item.uid,
        item.alert_id,
        item.alertId,
      ];
      return candidates.some((c) => c != null && String(c) === id);
    }) ?? null
  );
};

const fetchAlertById = async (eventId) => {
  if (!eventId) {
    console.warn("fetchAlertById: Event ID is required");
    return null;
  }

  // Search in local data only (no API fallback)
  const localAlert = getAlertFromLocalData(eventId);
  if (localAlert) {
    return localAlert;
  }

  console.warn(`Alert with ID ${eventId} not found in local data`);
  return null;
};

// Generate process tracking data (now supports mapping detection objects to processes)
const generateProcessTrackingData = () => {
  const rawData = apiData.value;
  const getProcessFromDetection = (item) => {
    if (item.process && typeof item.process === "string") {
      return item.process;
    }
    // Check if item has detected_objects array
    if (
      item.detected_objects &&
      Array.isArray(item.detected_objects) &&
      item.detected_objects.length > 0
    ) {
      const firstDetection = item.detected_objects[0];
      return detectionToProcessMap[firstDetection.object_type] || "Persiapan";
    }
    // Fallback to camera name or default
    if (item.camera_name && item.camera_name.includes("Kitchen")) {
      return "Masak";
    } else if (item.camera_name && item.camera_name.includes("Prep")) {
      return "Persiapan";
    }

    return "Persiapan"; // Default fallback
  };

  // Parse API timestamp into a Date, while keeping display fields in GMT+8.
  // Note: API strings without timezone are treated as UTC (see timezone helper).
  const parseTimeAdd6Hours = (timeStr) => {
    if (!timeStr) return null;

    const isoGmt8 = toGMT8ISOString(String(timeStr));
    if (!isoGmt8) return null;

    const date = new Date(isoGmt8);
    if (Number.isNaN(date.getTime())) return null;

    const displayTime =
      formatDateTimeGMT8(String(timeStr), "HH:mm") ??
      formatDateTimeGMT8(isoGmt8, "HH:mm");
    if (displayTime) {
      date.displayTime = displayTime;
    }

    const momentValue = toMomentGMT8(String(timeStr)) ?? toMomentGMT8(isoGmt8);
    if (momentValue) {
      date.originalHour = momentValue.hours();
      date.originalMinute = momentValue.minutes();
    }

    return date;
  };

  const resolveTimeField = (item, fields) => {
    for (const field of fields) {
      if (item[field]) {
        return item[field];
      }
    }
    return null;
  };

  const validData = [];
  rawData.forEach((item) => {
    const rawActivities = item.activities;
    const hadApiActivities = Array.isArray(rawActivities)
      ? rawActivities.length > 0
      : typeof rawActivities === "string" && rawActivities.trim().length > 0;

    const normalizedActivities = normalizeActivitiesValue(
      rawActivities,
      item.camera_name
    );
    const primaryActivity = normalizedActivities.length
      ? normalizedActivities[0]
      : null;

    // Prefer explicit activities (including camera fallbacks) before detection-based inference
    const process = primaryActivity ?? getProcessFromDetection(item);
    const processSource = primaryActivity
      ? hadApiActivities
        ? "activities-api"
        : "activities-fallback"
      : "detection";

    // Get mapped status
    const mappedStatus = statusMap[item.status] || item.status || "active";

    let start, end;
    let valid = true;
    try {
      // Use event_start/event_end fields or fall back to other timestamp fields
      const startTime = resolveTimeField(item, [
        "event_start",
        "start_time",
        "timestamp",
        "detected_at",
        "created_at",
      ]);

      let endTime = resolveTimeField(item, [
        "event_end",
        "end_time",
        "resolved_at",
        "updated_at",
      ]);

      if (!startTime) {
        valid = false;
      } else {
        start = parseTimeAdd6Hours(startTime);

        if (endTime) {
          end = parseTimeAdd6Hours(endTime);
        }
      }

      if (start && !end) {
        // Fallback: if end is still null but start exists
        const fallbackEnd = new Date(start.getTime() + 60 * 1000);
        const fallbackDisplay = formatDateTimeGMT8(
          fallbackEnd.toISOString(),
          "HH:mm"
        );
        if (fallbackDisplay) {
          fallbackEnd.displayTime = fallbackDisplay;
        }
        const fallbackMoment = toMomentGMT8(fallbackEnd.toISOString());
        if (fallbackMoment) {
          fallbackEnd.originalHour = fallbackMoment.hours();
          fallbackEnd.originalMinute = fallbackMoment.minutes();
        }
        end = fallbackEnd;
      } else if (start && end && end.getTime() <= start.getTime()) {
        const adjustedEnd = new Date(start.getTime() + 60 * 1000);
        const adjustedDisplay = formatDateTimeGMT8(
          adjustedEnd.toISOString(),
          "HH:mm"
        );
        if (adjustedDisplay) {
          adjustedEnd.displayTime = adjustedDisplay;
        }
        const adjustedMoment = toMomentGMT8(adjustedEnd.toISOString());
        if (adjustedMoment) {
          adjustedEnd.originalHour = adjustedMoment.hours();
          adjustedEnd.originalMinute = adjustedMoment.minutes();
        }
        end = adjustedEnd;
      }

      // Validate local time: should be between 00:00 and 23:59
      if (
        !start ||
        !end ||
        isNaN(start.getTime()) ||
        isNaN(end.getTime()) ||
        start.getHours() < 0 ||
        start.getHours() > 23 ||
        end.getHours() < 0 ||
        end.getHours() > 23 ||
        start.getMinutes() < 0 ||
        start.getMinutes() > 59 ||
        end.getMinutes() < 0 ||
        end.getMinutes() > 59
      ) {
        valid = false;
      }
    } catch (e) {
      valid = false;
    }
    if (!valid) {
      return;
    }
    const imageCandidates = [];
    if (Array.isArray(item.image_urls)) {
      imageCandidates.push(...item.image_urls.filter(Boolean));
    }
    if (item.image_url) {
      imageCandidates.push(item.image_url);
    }
    if (item.thumbnail) {
      imageCandidates.push(item.thumbnail);
    }
    if (item.thumbnail_url) {
      imageCandidates.push(item.thumbnail_url);
    }
    if (item.image_path) {
      imageCandidates.push(item.image_path);
    }
    if (item.image) {
      imageCandidates.push(item.image);
    }
    if (item.media_url) {
      imageCandidates.push(item.media_url);
    }

    const dedupedImages = imageCandidates
      .filter(Boolean)
      .filter((url, index, self) => self.indexOf(url) === index);

    if (item.image_url) {
      const existingIndex = dedupedImages.indexOf(item.image_url);
      if (existingIndex > 0) {
        dedupedImages.splice(existingIndex, 1);
        dedupedImages.unshift(item.image_url);
      } else if (existingIndex === -1) {
        dedupedImages.unshift(item.image_url);
      }
    }

    const primaryImage = dedupedImages[0] ?? null;

    const processedItem = {
      ...item,
      process,
      start,
      end,
      label: "",
      status: mappedStatus,
      image_url: primaryImage,
      image_urls: dedupedImages,
      color:
        mappedStatus === "completed"
          ? "#10B981"
          : mappedStatus === "active"
          ? "#3B82F6"
          : "#9CA3AF",
    };

    const resolvedEventId =
      item.event_id ??
      item.eventId ??
      item.id ??
      item.uid ??
      item.alert_id ??
      item.alertId ??
      null;
    if (resolvedEventId) {
      processedItem.eventId = resolvedEventId;
      if (!processedItem.event_id) {
        processedItem.event_id = resolvedEventId;
      }
    }

    processedItem.activities = normalizedActivities;

    validData.push(processedItem);
  });

  return validData;
};

// ========================
// UTILITY FUNCTIONS
// ========================

// Handle single date picker change - sets both from and to dates
const handleSelectedDateChange = async (newDateValue) => {
  if (newDateValue) {
    // Set both fromDate and toDate to the same selected date
    fromDate.value = newDateValue;
    toDate.value = newDateValue;
    selectedDateValue.value = newDateValue;
    selectedDate.value = new Date(newDateValue);

    // Persist to localStorage with same value for both keys
    try {
      window.localStorage.setItem(fromDateKey, newDateValue);
      window.localStorage.setItem(toDateKey, newDateValue);
    } catch (e) {
      // ignore storage errors
    }

    await fetchAlerts();
    startAlertsAutoRefresh();
    // Chart will be rendered automatically by watcher
  }
};

// Legacy select date function for backwards compatibility
const selectDate = async (date) => {
  if (date) {
    const dateStr = date.toISOString().split("T")[0];
    await handleSelectedDateChange(dateStr);
    showDatePicker.value = false;
  }
};

// Check if date is today
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if date is selected
const isSelected = (date) => {
  if (!date) return false;
  return date.toDateString() === selectedDate.value.toDateString();
};

// Format date for display
const formatDate = (date) => {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Month names
const monthNames = [
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

// Day names
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// ========================
// FILTER FUNCTIONS
// ========================

// Toggle status filter
const toggleStatusFilter = (status) => {
  const index = selectedStatuses.value.indexOf(status);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(status);
  }

  // Re-render chart with filtered data
  updateChartWithFilter();
};

// Check if status is selected
const isStatusSelected = (status) => {
  return selectedStatuses.value.includes(status);
};

// ========================
// DATE AND CALENDAR FUNCTIONS
// ========================
const setupChartEvents = () => {
  if (!chartInstance) return;

  const chart = chartInstance;
  let hoverTimeout = null;

  // Add mouse move event for hover preview
  chart.container.addEventListener("mousemove", (e) => {
    if (isPlaying.value) return; // Don't show preview during auto-play

    clearTimeout(hoverTimeout);

    // Small delay to prevent flickering
    hoverTimeout = setTimeout(() => {
      const point = chart.series[0].searchPoint(e, true);

      if (point && point.visible !== false && point.status !== "dummy") {
        const rect = chart.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        showHoverPreview(point, mouseX, mouseY);
      } else {
        hideHoverPreview();
      }
    }, 50);
  });

  // Add mouse leave event
  chart.container.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimeout);
    hideHoverPreview();
  });

  // Add click event for opening detail modal - use plotOptions for better event handling
  chart.update(
    {
      plotOptions: {
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                if (isPlaying.value) return; // Don't allow modal during auto-play

                const point = this;

                // Open detail modal instead of pinned popup
                openDetailModal(point);
              },
            },
          },
        },
      },
    },
    true
  );

  // Remove pinned popup event handling since we're using modal now
}; // Update chart with current filter
const updateChartWithFilter = () => {
  if (!chartInstance) {
    return;
  }

  const filteredData = generateProcessTrackingData().filter((item) =>
    selectedStatuses.value.includes(item.status)
  );

  try {
    // For Highcharts Gantt, we need to update the series data
    if (chartInstance.series && chartInstance.series[0]) {
      const updatedSeriesData = filteredData.map((item, idx) => {
        const resolvedEventId =
          item.event_id ??
          item.eventId ??
          item.id ??
          item.uid ??
          item.alert_id ??
          item.alertId ??
          `task-${idx}`;
        return {
          id: String(resolvedEventId),
          eventId: resolvedEventId,
          event_id: resolvedEventId,
          name: item.process,
          start: item.start.getTime(),
          end: item.end.getTime(),
          y: [
            "Persiapan",
            "Masak",
            "Pemorsian",
            "Pengiriman",
            "Ambil Nampan",
            "Cuci Nampan",
            "Selesai",
          ].indexOf(item.process),
          color: item.color,
          status: item.status,
          visible: true,
          image_url: item.image_url,
          activities: Array.isArray(item.activities)
            ? [...item.activities]
            : normalizeActivitiesValue(item.activities, item.camera_name),
        };
      });
      chartInstance.series[0].setData(updatedSeriesData, true);
    }
  } catch (error) {
    console.error("Error updating chart data:", error);
  }

  setupChartEvents();
};

// Reset all filters
const resetFilters = () => {
  selectedStatuses.value = [];
  updateChartWithFilter();
};

// ========================
// AUTO-PLAY FUNCTIONS
// ========================

// Start auto-play functionality
const startAutoPlay = () => {
  if (!chartInstance || isPlaying.value) return;

  isPlaying.value = true;

  // Clear any hover previews and detail modal during auto-play
  hideHoverPreview();
  closeDetailModal();

  // Disable chart tooltip during auto-play to prevent overlap
  if (chartInstance && chartInstance.tooltip) {
    chartInstance.tooltip.enabled = false;
  }
  // Also update chart options to ensure tooltip is disabled
  if (chartInstance && chartInstance.update) {
    chartInstance.update(
      {
        tooltip: {
          enabled: false,
        },
      },
      true,
      false
    );
  }

  const xAxis = chartInstance.xAxis[0];
  const extremes = xAxis.getExtremes();
  const dayStart = extremes.dataMin;
  const dayEnd = extremes.dataMax;
  const stepSize = 10 * 60 * 1000; // 10 minutes in milliseconds
  const viewWindowSize = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  let currentPosition = extremes.min || dayStart; // Start from current position or beginning

  playInterval = setInterval(() => {
    if (!chartInstance || !isPlaying.value) {
      stopAutoPlay();
      return;
    }

    // Check if we've reached the end
    if (currentPosition + viewWindowSize >= dayEnd) {
      // Reset to beginning and continue
      currentPosition = dayStart;
    }

    // Move the view window
    const newMin = currentPosition;
    const newMax = Math.min(currentPosition + viewWindowSize, dayEnd);

    // Update chart view with smooth animation
    xAxis.setExtremes(newMin, newMax, true, true);

    // Calculate playhead position (center of view window)
    const playheadTime = currentPosition + viewWindowSize / 2;
    currentPlayheadPosition = playheadTime;

    // Check for data at playhead position and show popup
    checkDataAtPlayhead(playheadTime);

    // Move to next position
    currentPosition += stepSize;
  }, playSpeed.value);
};

const stopAutoPlay = () => {
  isPlaying.value = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
  currentPlayheadPosition = null;
  hidePlayheadPopups();

  // Re-enable chart tooltip after auto-play stops
  if (chartInstance && chartInstance.tooltip) {
    chartInstance.tooltip.enabled = true;
  }
  // Also update chart options to ensure tooltip is re-enabled
  if (chartInstance && chartInstance.update) {
    chartInstance.update(
      {
        tooltip: {
          enabled: true,
        },
      },
      true,
      false
    );
  }
};
const toggleAutoPlay = () => {
  if (isPlaying.value) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
};

// ========================
// POPUP FUNCTIONS
// ========================

// Check for data at playhead position and show popup
const checkDataAtPlayhead = (playheadTime) => {
  if (!chartInstance) return;

  // Get filtered chart data
  const chartData = generateProcessTrackingData().filter((item) =>
    selectedStatuses.value.includes(item.status)
  );

  // Find data points that intersect with playhead (within 5 minute tolerance)
  const tolerance = 5 * 60 * 1000; // 5 minutes
  const dataAtPlayhead = chartData.filter((item) => {
    return (
      playheadTime >= item.start.getTime() - tolerance &&
      playheadTime <= item.end.getTime() + tolerance
    );
  });

  if (dataAtPlayhead.length > 0) {
    // Group data by process/row to show only one popup per row
    const groupedByProcess = {};
    dataAtPlayhead.forEach((item) => {
      // Only keep the first (or most relevant) data for each process
      if (!groupedByProcess[item.process]) {
        groupedByProcess[item.process] = item;
      }
    });

    // Convert back to array and sort by process order (top to bottom on chart)
    const processList = [
      "Persiapan",
      "Masak",
      "Pemorsian",
      "Pengiriman",
      "Ambil Nampan",
      "Cuci Nampan",
      "Selesai",
    ];
    const uniqueDataPoints = Object.values(groupedByProcess).sort(
      (a, b) => processList.indexOf(a.process) - processList.indexOf(b.process)
    );

    // Show popups for unique processes only, arranged side by side
    showMultiplePlayheadPopups(uniqueDataPoints, playheadTime);
  } else {
    // Hide popup if no data
    hidePlayheadPopups();
  }
};

// Show multiple popups side by side for multiple data points
const showMultiplePlayheadPopups = (dataPoints, playheadTime) => {
  if (!chartInstance) return;

  const chart = chartInstance;
  const xAxis = chart.xAxis[0];

  // Clear existing popups
  hidePlayheadPopups();

  // Calculate playhead position
  const playheadX = xAxis.toPixels(playheadTime);

  // Popup dimensions
  const popupWidth = 200;
  const popupSpacing = 20; // Changed from 15 to 20px
  const totalWidth =
    (popupWidth + popupSpacing) * dataPoints.length - popupSpacing;

  // Position all popups behind (to the left of) the playhead
  let startX = playheadX - totalWidth - 30; // All popups positioned behind playhead with 30px gap

  dataPoints.forEach((dataPoint, index) => {
    const yAxis = chart.yAxis[0];
    // Use the y position from the chart data (which corresponds to process order)
    const dataY = yAxis.toPixels(dataPoint.y);

    // Calculate position for this popup
    const popupX = startX + (popupWidth + popupSpacing) * index;
    // Position popup slightly above the data row
    const popupY = dataY - 60;

    // Ensure popup stays within chart bounds
    const finalX = Math.max(
      chart.plotLeft + 10,
      Math.min(popupX, chart.plotLeft + chart.plotWidth - popupWidth - 10)
    );
    const finalY = Math.max(
      chart.plotTop + 10,
      Math.min(popupY, chart.plotTop + chart.plotHeight - 200)
    );

    // Create popup for this data point
    const popup = createSinglePlayheadPopup(
      dataPoint,
      finalX,
      finalY,
      chart,
      index
    );
    playheadPopups.push(popup);
  });

  // Add event listeners for all popup images after a short delay to ensure DOM is ready
  setTimeout(() => {
    dataPoints.forEach((dataPoint, index) => {
      if (dataPoint.image_url) {
        const uniqueImageId = `popup-image-${dataPoint.process.replace(
          /\s+/g,
          "-"
        )}-${index}`;
        const imageElement = document.getElementById(uniqueImageId);
        if (imageElement) {
          imageElement.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const imgUrl = dataPoint.image_url;
            modalImageSrc.value = imgUrl;
            modalImageAlt.value = `Rekaman ${dataPoint.process}`;
            showImageModal.value = true;
          });
        }
      }
    });
  }, 200);
};

// Create a single popup element
const createSinglePlayheadPopup = (dataPoint, x, y, chart, index) => {
  // Create accurate time display from actual data timestamps
  const startDate = new Date(dataPoint.start.getTime());
  const endDate = new Date(dataPoint.end.getTime());

  const startTime = formatDateTimeGMT8(startDate.toISOString(), "HH:mm") ?? "";
  const endTime = formatDateTimeGMT8(endDate.toISOString(), "HH:mm") ?? "";

  // Calculate accurate duration in hours and minutes
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  const duration =
    durationHours > 0
      ? `${durationHours} jam ${durationMinutes} menit`
      : `${durationMinutes} menit`;

  // Generate unique ID for this popup
  const popupId = `playhead-popup-${index}`;

  // Create popup content with clickable image
  let popupContent = `
        <div style="
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            border: 1px solid #e2e8f0;
            max-width: 200px;
            font-family: 'Inter', sans-serif;
        ">
            <div style="
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 8px 10px;
                margin: -12px -12px 8px -12px;
                border-radius: 8px 8px 0 0;
                font-size: 12px;
                font-weight: 600;
            ">
                ${dataPoint.process}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
                <i class="fas fa-clock" style="margin-right: 4px;"></i>
                ${startTime} - ${endTime}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
                Durasi: ${duration}
            </div>`;

  // Add image thumbnail if available
  if (dataPoint.image_url) {
    const imgUrl = dataPoint.image_url;
    const uniqueImageId = `popup-image-${dataPoint.process.replace(
      /\s+/g,
      "-"
    )}-${index}`;
    popupContent += `
            <div style="margin-bottom: 8px;">
                <div style="
                    font-size: 10px;
                    color: #64748b;
                    margin-bottom: 4px;
                    font-weight: 500;
                ">
                    <i class="fas fa-camera" style="margin-right: 3px;"></i>
                    Rekaman
                </div>
                <div id="${uniqueImageId}" style="
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border: 1px solid #e2e8f0;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"
                   onclick="window.openImageModal('${imgUrl}', 'Rekaman ${dataPoint.process}')"
                   data-image-url="${imgUrl}" data-image-alt="Rekaman ${dataPoint.process}">
                    <img src='${imgUrl}'
                         alt='Rekaman ${dataPoint.process}'
                         style='
                             width: 100%;
                             height: 80px;
                             object-fit: cover;
                             display: block;
                         '
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    />
                    <div style="
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 8px;
                    ">
                        <i class="fas fa-expand"></i>
                    </div>
                    <div style="
                        display: none;
                        padding: 12px;
                        text-align: center;
                        background: #f8fafc;
                        color: #9ca3af;
                        font-size: 10px;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        height: 80px;
                    ">
                        <i class="fas fa-image" style="font-size: 16px; margin-bottom: 4px;"></i>
                        <span>Tidak tersedia</span>
                    </div>
                </div>
            </div>`;

    // Note: Event listener will be added in showMultiplePlayheadPopups function
  } else {
    popupContent += `
            <div style="
                text-align: center;
                padding: 12px;
                background: #f8fafc;
                border-radius: 6px;
                color: #9ca3af;
                font-size: 10px;
                border: 1px dashed #cbd5e1;
                margin-bottom: 8px;
            ">
                <i class="fas fa-camera-slash" style="font-size: 14px; margin-bottom: 4px; display: block;"></i>
                <span>Tidak ada rekaman</span>
            </div>`;
  }

  popupContent += `
            <div style="
                display: inline-block;
                background: ${
                  dataPoint.status === "completed"
                    ? "#ecfdf5"
                    : dataPoint.status === "active"
                    ? "#eff6ff"
                    : "#f3f4f6"
                };
                color: ${
                  dataPoint.status === "completed"
                    ? "#10b981"
                    : dataPoint.status === "active"
                    ? "#3b82f6"
                    : "#6b7280"
                };
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 500;
                text-transform: capitalize;
            ">
                <i class="fas fa-circle" style="font-size: 6px; margin-right: 4px;"></i>
                ${dataPoint.status}
            </div>
        </div>
    `;

  // Create popup element
  const popup = chart.renderer
    .label(
      popupContent,
      x,
      y,
      "rect",
      null,
      null,
      true // useHTML
    )
    .attr({
      fill: "rgba(255, 255, 255, 0.98)",
      stroke: "#e2e8f0",
      "stroke-width": 1,
      r: 8,
      zIndex: 20,
      padding: 0,
      id: popupId,
    })
    .css({
      fontFamily: "Inter, sans-serif",
      fontSize: "11px",
    })
    .add();

  return { popup, triangle: null };
};

// Hide all playhead popups
const hidePlayheadPopups = () => {
  playheadPopups.forEach(({ popup, triangle }) => {
    if (popup) {
      popup.destroy();
    }
    if (triangle) {
      triangle.destroy();
    }
  });
  playheadPopups = [];

  // Remove triangle elements and cleanup image event listeners
  if (chartInstance && chartInstance.container) {
    const triangles = chartInstance.container.querySelectorAll(
      "[data-popup-triangle]"
    );
    triangles.forEach((triangle) => {
      if (triangle.parentNode) {
        triangle.parentNode.removeChild(triangle);
      }
    });

    // Clean up any popup image elements with event listeners
    const popupImages = chartInstance.container.querySelectorAll(
      '[id^="popup-image-"], [id^="tooltip-image-"]'
    );
    popupImages.forEach((imageElement) => {
      if (imageElement.parentNode) {
        imageElement.parentNode.removeChild(imageElement);
      }
    });
  }
};

// ========================
// MODAL FUNCTIONS
// ========================

// Global function to open image modal (accessible from HTML onclick)
window.openImageModal = (imageSrc, imageAlt) => {
  modalImageSrc.value = imageSrc;
  modalImageAlt.value = imageAlt;
  showImageModal.value = true;
};

// Global function to download image directly from URL (accessible from HTML onclick)
window.downloadImageFromUrl = async (imageSrc, imageAlt) => {
  try {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${imageAlt.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

// Hover Preview Functions (Small popup)
const showHoverPreview = (point, mouseX, mouseY) => {
  hideHoverPreview(); // Clear any existing preview

  if (!chartInstance) return;

  // Calculate display times
  const startDate = new Date(point.start);
  const endDate = new Date(point.end);
  const startTime = formatDateTimeGMT8(startDate.toISOString(), "HH:mm") ?? "";
  const endTime = formatDateTimeGMT8(endDate.toISOString(), "HH:mm") ?? "";

  // Create small hover preview content
  let previewContent = `
        <div style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            padding: 8px 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid #e2e8f0;
            max-width: 180px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
        ">
            <div style="
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 3px;
                font-size: 12px;
            ">
                ${point.name}
            </div>
            <div style="color: #6b7280; margin-bottom: 4px;">
                ${startTime} - ${endTime}
            </div>`;

  // Add small thumbnail if image exists
  if (point.image_url) {
    const imgUrl = point.image_url;
    previewContent += `
            <div style="
                width: 60px;
                height: 40px;
                border-radius: 4px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                margin-bottom: 4px;
            ">
                <img src='${imgUrl}'
                     style='width: 100%; height: 100%; object-fit: cover;'
                     onerror="this.style.display='none';"
                />
            </div>`;
  }

  // Add status badge
  const statusColor =
    point.status === "completed"
      ? "#10b981"
      : point.status === "active"
      ? "#3b82f6"
      : "#6b7280";
  const statusBg =
    point.status === "completed"
      ? "#ecfdf5"
      : point.status === "active"
      ? "#eff6ff"
      : "#f3f4f6";

  previewContent += `
            <div style="
                display: inline-block;
                background: ${statusBg};
                color: ${statusColor};
                padding: 1px 6px;
                border-radius: 8px;
                font-size: 9px;
                font-weight: 500;
                text-transform: capitalize;
            ">
                ${point.status}
            </div>
            <div style="
                font-size: 9px;
                color: #9ca3af;
                margin-top: 4px;
                text-align: center;
            ">
                Click untuk detail
            </div>
        </div>
    `;

  // Position preview near mouse but within chart bounds
  const chart = chartInstance;
  const previewX = Math.min(
    mouseX + 15,
    chart.plotLeft + chart.plotWidth - 180
  );
  const previewY = Math.max(mouseY - 60, chart.plotTop + 10);

  // Create hover preview popup
  hoverPreview = chart.renderer
    .label(
      previewContent,
      previewX,
      previewY,
      "rect",
      null,
      null,
      true // useHTML
    )
    .attr({
      fill: "rgba(255, 255, 255, 0.95)",
      stroke: "#e2e8f0",
      "stroke-width": 1,
      r: 8,
      zIndex: 25,
      padding: 0,
    })
    .add();
};

const hideHoverPreview = () => {
  if (hoverPreview) {
    hoverPreview.destroy();
    hoverPreview = null;
  }
};

// Detail Modal Functions
const fetchAlertDetail = async (eventId, fallbackPoint = null) => {
  const normalizedEventId = eventId != null ? String(eventId) : null;
  if (!normalizedEventId) {
    modalDetailData.value = {
      ...(fallbackPoint || {}),
      error: "Event ID tidak tersedia.",
    };
    showDetailModal.value = true;
    return;
  }

  try {
    modalDetailData.value = fallbackPoint
      ? {
          ...fallbackPoint,
          eventId: normalizedEventId,
          event_id: normalizedEventId,
          isLoading: true,
        }
      : {
          eventId: normalizedEventId,
          event_id: normalizedEventId,
          isLoading: true,
        };

    // Try to get from local data first (faster, no network)
    const localAlert = getAlertFromLocalData(normalizedEventId);
    if (localAlert) {
      const normalizedDetail = normalizeAlertDetail(
        localAlert,
        fallbackPoint ?? modalDetailData.value ?? null
      );
      modalDetailData.value = normalizedDetail || {
        ...(fallbackPoint || {}),
        eventId: normalizedEventId,
        event_id: normalizedEventId,
      };
      return;
    }

    // If not found in local data, use fallback point data
    const normalizedDetail = normalizeAlertDetail(
      null,
      fallbackPoint ?? modalDetailData.value ?? null
    );
    modalDetailData.value = normalizedDetail || {
      ...(fallbackPoint || {}),
      eventId: normalizedEventId,
      event_id: normalizedEventId,
      error: "Detail tidak ditemukan dalam data lokal.",
    };
  } catch (error) {
    console.error("[RealTimeReport] Failed to process alert detail:", error);
    modalDetailData.value = {
      ...(fallbackPoint || {}),
      eventId: normalizedEventId,
      event_id: normalizedEventId,
      error: "Gagal memproses detail event.",
    };
  } finally {
    showDetailModal.value = true;
  }
};

const openDetailModal = (point) => {
  const snapshot = extractPointSnapshot(point);
  const eventId = snapshot?.eventId || snapshot?.event_id || null;
  if (eventId) {
    fetchAlertDetail(eventId, snapshot);
  } else if (snapshot) {
    modalDetailData.value = snapshot;
    showDetailModal.value = true;
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  modalDetailData.value = null;
};

// Function to open image modal from detail modal
const openImageFromDetail = (imageSrc, imageAlt) => {
  if (!imageSrc) {
    return;
  }
  modalImageSrc.value = imageSrc;
  modalImageAlt.value = imageAlt;
  showImageModal.value = true;
  // Keep detail modal open in background
};

// Helper functions for modal display
const formatTime = (dateString) => {
  return formatDateTimeGMT8(dateString, "HH:mm") ?? "";
};

const formatDuration = (point) => {
  const startDate = new Date(point.start);
  const endDate = new Date(point.end);
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  return durationHours > 0
    ? `${durationHours} jam ${durationMinutes} menit`
    : `${durationMinutes} menit`;
};

// Function to download image from URL (used in modal)
const downloadImageFromUrl = async (imageUrl, fileName) => {
  if (!imageUrl) {
    return;
  }
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

// Function to download image
const downloadImage = async () => {
  try {
    const response = await fetch(modalImageSrc.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${modalImageAlt.value}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

// Close image modal
const closeImageModal = () => {
  showImageModal.value = false;
  modalImageSrc.value = "";
  modalImageAlt.value = "";
}; // ========================
// CHART RENDERING FUNCTIONS
// ========================

// Load Highcharts Gantt library and initialize chart
const loadHighchartsGantt = async () => {
  try {
    await loadScript("https://code.highcharts.com/gantt/highcharts-gantt.js");
    await loadScript("https://code.highcharts.com/modules/exporting.js");
    await loadScript("https://code.highcharts.com/modules/accessibility.js");
    chartsReady.value = true;
    await nextTick();

    if (apiData.value && apiData.value.length > 0) {
      setTimeout(() => {
        renderHighchartsGantt();
      }, 100);
    }
  } catch (error) {
    console.error("Failed to load Highcharts Gantt:", error);
  }
};

// Helper function to load scripts
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Initialize fromDate/toDate defaults (today for both)
const initializeDefaultDates = () => {
  const today = new Date().toISOString().split("T")[0];

  // Set both fromDate and toDate to today (same value)
  toDate.value = todayStr;
  fromDate.value = todayStr;
  selectedDateValue.value = todayStr;

  // default selected date points to today
  selectedDate.value = new Date(todayStr);

  // persist defaults locally - both keys have the same value (today)
  try {
    window.localStorage.setItem(fromDateKey, todayStr);
    window.localStorage.setItem(toDateKey, todayStr);
    window.localStorage.removeItem(legacyFromDateKey);
    window.localStorage.removeItem(legacyToDateKey);
  } catch (e) {
    // ignore storage errors
  }
};

// Render Highcharts Gantt chart with timeline bar, zoom, and current time indicator
const renderHighchartsGantt = () => {
  const chartContainer = document.getElementById("process-tracking-chart");
  if (!chartContainer) {
    console.error("Chart container #process-tracking-chart not found");
    return;
  }

  // Destroy previous chart if any
  if (chartInstance && chartInstance.destroy) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const chartData = generateProcessTrackingData().filter((item) =>
    selectedStatuses.value.includes(item.status)
  );

  // Map to Highcharts Gantt format
  const processList = [
    "Persiapan",
    "Masak",
    "Pemorsian",
    "Pengiriman",
    "Ambil Nampan",
    "Cuci Nampan",
    "Selesai",
  ];
  const categories = processList;

  let sortedChartData = chartData
    .filter((item) => processList.includes(item.process))
    .sort(
      (a, b) =>
        processList.indexOf(a.process) - processList.indexOf(b.process) ||
        a.start - b.start
    );

  let seriesData = sortedChartData.map((item, idx) => {
    const resolvedEventId =
      item.event_id ??
      item.eventId ??
      item.id ??
      item.uid ??
      item.alert_id ??
      item.alertId ??
      `task-${idx}`;
    // Get display times directly from the actual Date objects for consistency
    const startDisplayTime =
      item.start?.displayTime ??
      formatDateTimeGMT8(item.start?.toISOString?.(), "HH:mm") ??
      "";
    const endDisplayTime =
      item.end?.displayTime ??
      formatDateTimeGMT8(item.end?.toISOString?.(), "HH:mm") ??
      "";

    // Calculate duration for consistency
    const durationMs = item.end.getTime() - item.start.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const calculatedDuration =
      durationHours > 0
        ? `${durationHours}.${Math.round((durationMinutes / 60) * 10) / 10}`
        : `0.${Math.round((durationMinutes / 60) * 10) / 10}`;

    return {
      id: String(resolvedEventId),
      eventId: resolvedEventId,
      event_id: resolvedEventId,
      name: item.process,
      start: item.start.getTime(),
      end: item.end.getTime(),
      y: categories.indexOf(item.process),
      color: item.color,
      status: item.status,
      visible: true,
      // Store actual calculated times for tooltip consistency
      displayStartTime: startDisplayTime,
      displayEndTime: endDisplayTime,
      // Store image path and calculated duration for tooltip
      image_url: item.image_url,
      duration: calculatedDuration,
      // Store the original Date objects for accurate calculations
      startDate: item.start,
      endDate: item.end,
      activities: Array.isArray(item.activities)
        ? [...item.activities]
        : normalizeActivitiesValue(item.activities, item.camera_name),
    };
  });
  const rangeStartInput = fromDate.value
    ? new Date(fromDate.value)
    : new Date(selectedDate.value);
  const rangeEndInput = toDate.value
    ? new Date(toDate.value)
    : new Date(selectedDate.value);

  // Normalize to start/end of their respective days in local time
  const dayStart = new Date(
    rangeStartInput.getFullYear(),
    rangeStartInput.getMonth(),
    rangeStartInput.getDate(),
    0,
    0,
    0,
    0
  );
  const dayEnd = new Date(
    rangeEndInput.getFullYear(),
    rangeEndInput.getMonth(),
    rangeEndInput.getDate(),
    23,
    59,
    59,
    999
  );

  // Use timestamps for chart range (can span multiple days)
  const xMin = dayStart.getTime();
  const xMax = dayEnd.getTime();

  // Add dummy points for processes without data to maintain Y-axis structure
  processList.forEach((proc, i) => {
    if (!seriesData.some((d) => d.y === i)) {
      seriesData.push({
        id: "dummy-" + i,
        name: proc,
        start: xMin,
        end: xMin + 60 * 1000, // 1 minute
        y: i,
        color: "rgba(0,0,0,0)",
        status: "dummy",
        visible: false,
      });
    }
  });

  // Sort to maintain consistent Y order
  seriesData = seriesData.sort((a, b) => a.y - b.y || a.start - b.start);

  // Current time indicator for today only
  const now = new Date();
  const isToday = now.getTime() >= xMin && now.getTime() <= xMax;

  // Ensure that data bounds are strictly within the selected day
  seriesData = seriesData.map((item) => {
    // Restrict any out-of-bounds data
    item.start = Math.max(item.start, xMin);
    item.end = Math.min(item.end, xMax);
    return item;
  });

  const captionText =
    dayStart.toDateString() === dayEnd.toDateString()
      ? formatDate(dayStart)
      : `${formatDate(dayStart)} - ${formatDate(dayEnd)}`;

  chartInstance = window.Highcharts.ganttChart(chartContainer, {
    chart: {
      height: 350,
      backgroundColor: "#fff",
      zoomType: null, // Disable zoom to prioritize panning
      panning: {
        enabled: true,
        type: "x",
      },
      panKey: "normal", // Allow panning without any key
      events: {
        load: function () {
          this.setTitle(null);

          // Add mouse wheel zoom functionality
          const chart = this;
          chart.container.addEventListener("wheel", function (e) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.1 : -0.1;
            const extremes = chart.xAxis[0].getExtremes();
            const range = extremes.max - extremes.min;
            const center = (extremes.max + extremes.min) / 2;
            const newRange = range * (1 + delta);
            const newMin = center - newRange / 2;
            const newMax = center + newRange / 2;

            // Prevent zooming out beyond day bounds
            const dayStart = xMin;
            const dayEnd = xMax;
            if (newMin >= dayStart && newMax <= dayEnd) {
              chart.xAxis[0].setExtremes(newMin, newMax, true, false);
            }
          });

          // Add playhead line for auto-play mode
          chart.playheadLine = null;

          // Setup interactive events after chart is loaded
          setTimeout(() => {
            setupChartEvents();
          }, 100);
        },
        redraw: function () {
          // Update playhead line position during auto-play
          const chart = this;
          if (
            isPlaying.value &&
            currentPlayheadPosition &&
            chart.xAxis &&
            chart.xAxis[0]
          ) {
            const xAxis = chart.xAxis[0];
            const extremes = xAxis.getExtremes();

            // Only show playhead if it's within the current view
            if (
              currentPlayheadPosition >= extremes.min &&
              currentPlayheadPosition <= extremes.max
            ) {
              // Remove existing playhead line
              if (chart.playheadLine) {
                chart.playheadLine.destroy();
              }

              // Draw new playhead line
              const playheadX = xAxis.toPixels(currentPlayheadPosition);
              chart.playheadLine = chart.renderer
                .path([
                  "M",
                  playheadX,
                  chart.plotTop,
                  "L",
                  playheadX,
                  chart.plotTop + chart.plotHeight,
                ])
                .attr({
                  stroke: "#EF4444",
                  "stroke-width": 3,
                  zIndex: 15,
                  opacity: 0.8,
                })
                .add();

              // Add playhead indicator at top
              chart.renderer
                .circle(playheadX, chart.plotTop - 5, 4)
                .attr({
                  fill: "#EF4444",
                  stroke: "#ffffff",
                  "stroke-width": 2,
                  zIndex: 16,
                })
                .add();
            } else if (chart.playheadLine) {
              chart.playheadLine.destroy();
              chart.playheadLine = null;
            }
          } else if (chart.playheadLine) {
            chart.playheadLine.destroy();
            chart.playheadLine = null;
          }
        },
        mouseMove: function (e) {
          // Disable crosshair during auto-play
          if (isPlaying.value) {
            return;
          }

          const chart = this;
          if (!chart.xAxis || !chart.xAxis[0]) return;
          const xAxis = chart.xAxis[0];
          const pointer = chart.pointer.normalize(e.originalEvent);
          const xValue = xAxis.toValue(pointer.chartX);
          // Only show crosshair if inside plot area
          if (
            pointer.chartX < chart.plotLeft ||
            pointer.chartX > chart.plotLeft + chart.plotWidth
          ) {
            if (chart.dynamicCrosshair) {
              chart.dynamicCrosshair.destroy();
              chart.dynamicCrosshair = null;
            }
            if (chart.dynamicCrosshairLabel) {
              chart.dynamicCrosshairLabel.destroy();
              chart.dynamicCrosshairLabel = null;
            }
            return;
          }
          // Remove previous dynamic line
          if (chart.dynamicCrosshair) {
            chart.dynamicCrosshair.destroy();
            chart.dynamicCrosshair = null;
          }
          // Draw new dynamic line
          chart.dynamicCrosshair = chart.renderer
            .path([
              "M",
              xAxis.toPixels(xValue),
              chart.plotTop,
              "L",
              xAxis.toPixels(xValue),
              chart.plotTop + chart.plotHeight,
            ])
            .attr({
              stroke: "#EF4444",
              "stroke-width": 2,
              zIndex: 10,
            })
            .add();
          // Show label with time in HH:mm
          if (chart.dynamicCrosshairLabel) {
            chart.dynamicCrosshairLabel.destroy();
          }
          chart.dynamicCrosshairLabel = chart.renderer
            .label(
              chart.time.dateFormat("%H:%M", Math.round(xValue)),
              xAxis.toPixels(xValue) + 4,
              chart.plotTop + 5,
              null,
              null,
              null,
              false
            )
            .attr({
              fill: "#fff",
              padding: 2,
              r: 2,
              zIndex: 11,
            })
            .css({ color: "#EF4444", fontWeight: "bold", fontSize: "11px" })
            .add();
        },
        mouseOut: function () {
          const chart = this;
          if (chart.dynamicCrosshair) {
            chart.dynamicCrosshair.destroy();
            chart.dynamicCrosshair = null;
          }
          if (chart.dynamicCrosshairLabel) {
            chart.dynamicCrosshairLabel.destroy();
            chart.dynamicCrosshairLabel = null;
          }
        },
      },
    },
    title: { text: "" },
    time: {
      // Render chart times in the browser's local timezone.
      // This ensures the day starts at 00:00 (not 16:00 UTC).
      useUTC: false,
    },
    xAxis: {
      type: "datetime",
      min: xMin,
      max: xMax,
      startOfWeek: 0,
      dateTimeLabelFormats: {
        day: "%A, %e %b",
      },
      grid: { borderColor: "#e5e7eb" },
      labels: {
        format: "{value:%H:%M}",
        style: { color: "#374151", fontSize: "12px", fontWeight: "bold" },
        autoRotation: [-45, -90],
        staggerLines: 2, // jika label tetap terlalu rapat, akan bertingkat
      },
      tickPixelInterval: 90, // Lebarkan jarak antar label
      tickInterval: 1000 * 60 * 10, // 10 minutes
      breaks: [
        {
          from: xMin - 24 * 3600 * 1000,
          to: xMin,
          breakSize: 0,
        },
      ],
    },
    yAxis: {
      categories: categories,
      title: { text: "Processes", style: { fontSize: "12px" } },
      labels: { style: { color: "#374151", fontSize: "11px" } },
      grid: { borderColor: "#e5e7eb" },
      reversed: true,
    },
    navigator: {
      enabled: true,
      liveRedraw: true,
      height: 50,
      margin: 10,
      xAxis: {
        min: xMin,
        max: xMax, // 24 jam penuh
        labels: {
          format: "{value:%H:%M}", // Format 24-jam
        },
        dateTimeLabelFormats: {
          day: "%H:%M",
        },
      },
      adaptToUpdatedData: false,
      series: {
        dataLabels: {
          allowOverlap: false,
        },
      },
    },
    scrollbar: { enabled: true },
    rangeSelector: {
      enabled: false,
    },
    // Set explicit date format for chart header
    caption: {
      text: captionText,
      style: {
        color: "#1F2937",
        fontWeight: "bold",
        display: "none", // Hide the caption since we already show the date in the dropdown
      },
    },
    series: [
      {
        name: "Aktivitas",
        data: seriesData,
        dataLabels: {
          enabled: false,
        },
      },
    ],
    tooltip: {
      formatter: function () {
        // Don't show tooltip if auto-play is running
        if (isPlaying.value) {
          return false;
        }

        const point = this.point;

        // Skip tooltip for dummy/invisible points
        if (point.status === "dummy" || point.visible === false) {
          return false;
        }

        // Use consistent time calculation from the actual timestamps
        const startDate = new Date(point.start);
        const endDate = new Date(point.end);
        const startTime =
          formatDateTimeGMT8(startDate.toISOString(), "HH:mm") ?? "";
        const endTime =
          formatDateTimeGMT8(endDate.toISOString(), "HH:mm") ?? "";

        // Calculate accurate duration
        const durationMs = endDate.getTime() - startDate.getTime();
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const duration =
          durationHours > 0
            ? `${durationHours} jam ${durationMinutes} menit`
            : `${durationMinutes} menit`;

        let html = `
                <div style="
                    min-width: 280px;
                    max-width: 350px;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 12px;
                    padding: 0;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                ">`;

        // Header dengan gradient
        html += `
                <div style="
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    padding: 12px 16px;
                    margin: 0;
                ">
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${point.name}</div>
                    <div style="font-size: 13px; opacity: 0.9;">
                        <i class="fas fa-clock" style="margin-right: 6px;"></i>
                        ${startTime} - ${endTime} (${duration})
                    </div>
                </div>`;

        // Content area
        html += `<div style="padding: 16px;">`;

        // Status badge
        const statusColor =
          point.status === "completed"
            ? "#10b981"
            : point.status === "active"
            ? "#3b82f6"
            : "#6b7280";
        const statusBg =
          point.status === "completed"
            ? "#ecfdf5"
            : point.status === "active"
            ? "#eff6ff"
            : "#f3f4f6";

        html += `
                <div style="
                    display: inline-block;
                    background: ${statusBg};
                    color: ${statusColor};
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                    margin-bottom: 12px;
                ">
                    <i class="fas fa-circle" style="font-size: 8px; margin-right: 6px;"></i>
                    ${point.status}
                </div>`;

        // Image section if available
        if (point.image_url) {
          const imgUrl = point.image_url;
          html += `
                    <div style="margin-bottom: 8px;">
                        <div style="
                            font-size: 12px;
                            color: #64748b;
                            margin-bottom: 8px;
                            font-weight: 500;
                        ">
                            <i class="fas fa-camera" style="margin-right: 6px;"></i>
                            Rekaman Aktivitas
                        </div>
                        <div style="
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            border: 2px solid #f1f5f9;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            position: relative;
                        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <img src='${imgUrl}'
                                 alt='Rekaman ${point.name}'
                                 style='
                                     width: 100%;
                                     max-width: 100%;
                                     height: 140px;
                                     object-fit: cover;
                                     display: block;
                                 '
                                 onclick="window.openImageModal('${imgUrl}', 'Rekaman ${point.name}')"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                            />
                            <div style="
                                display: none;
                                padding: 20px;
                                text-align: center;
                                background: #f8fafc;
                                color: #64748b;
                                font-size: 12px;
                            ">
                                <i class="fas fa-image" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                                Gambar tidak tersedia
                            </div>
                            <div style="
                                position: absolute;
                                top: 8px;
                                right: 8px;
                                display: flex;
                                gap: 6px;
                            ">
                                <div style="
                                    background: rgba(0,0,0,0.7);
                                    color: white;
                                    border-radius: 50%;
                                    width: 24px;
                                    height: 24px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 10px;
                                " onclick="window.openImageModal('${imgUrl}', 'Rekaman ${point.name}')">
                                    <i class="fas fa-expand"></i>
                                </div>
                            </div>
                        </div>
                    </div>`;
        } else {
          html += `
                    <div style="
                        text-align: center;
                        padding: 20px;
                        background: #f8fafc;
                        border-radius: 8px;
                        color: #64748b;
                        font-size: 12px;
                        border: 1px dashed #cbd5e1;
                    ">
                        <i class="fas fa-camera-slash" style="font-size: 20px; margin-bottom: 8px; display: block;"></i>
                        Tidak ada rekaman visual
                    </div>`;
        }

        html += `</div></div>`;
        return html;
      },
      useHTML: true,
      backgroundColor: "transparent",
      borderWidth: 0,
      shadow: false,
      style: {
        padding: 0,
      },
    },
    credits: { enabled: false },
    exporting: { enabled: true },
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {},
        },
      },
    },
  });
};

// ========================
// WATCHERS AND LIFECYCLE
// ========================

// Watch API data and update chart when data changes
watch(
  apiData,
  () => {
    if (!chartsReady.value) {
      return;
    }
    setTimeout(() => {
      renderHighchartsGantt();
    }, 100);
  },
  { deep: true }
);

// Watch chartsReady: render chart when library is ready and data is available
watch(chartsReady, (ready) => {
  if (ready && apiData.value && apiData.value.length > 0) {
    setTimeout(() => {
      renderHighchartsGantt();
    }, 150);
  }
});

// Watch play speed: restart auto-play with new speed if currently playing
watch(playSpeed, (newSpeed) => {
  if (isPlaying.value) {
    stopAutoPlay();
    // Restart with new speed after a small delay
    setTimeout(() => {
      startAutoPlay();
    }, 100);
  }
});

// Watch siteUid prop: fetch data when site changes or when initially available
watch(
  () => props.siteUid,
  (newSiteUid, oldSiteUid) => {
    // Handle initial load when siteUid becomes available for the first time
    if (
      newSiteUid &&
      !hasInitiallyLoaded.value &&
      chartsReady.value &&
      fromDate.value &&
      toDate.value
    ) {
      hasInitiallyLoaded.value = true;
      fetchAlerts();
      return;
    }

    // Handle site changes after initial load
    if (
      newSiteUid &&
      newSiteUid !== oldSiteUid &&
      hasInitiallyLoaded.value &&
      chartsReady.value &&
      fromDate.value &&
      toDate.value
    ) {
      fetchAlerts();
    }
  },
  { immediate: false }
);

// Watch selectedDateValue changes
watch(selectedDateValue, (newValue) => {
  if (newValue) {
    handleSelectedDateChange(newValue);
  }
});

onMounted(async () => {
  // Clean up old/conflicting localStorage keys
  try {
    window.localStorage.removeItem("datePicker.selected");
    window.localStorage.removeItem("realTimeReport.fromDate");
    window.localStorage.removeItem("realTimeReport.toDate");
  } catch (e) {
    // ignore cleanup errors
  }

  // Initialize date from localStorage or default to today
  try {
    const storedFrom =
      window.localStorage.getItem(fromDateKey) ||
      window.localStorage.getItem(legacyFromDateKey);
    const storedTo =
      window.localStorage.getItem(toDateKey) ||
      window.localStorage.getItem(legacyToDateKey);

    if (storedFrom && storedTo && storedFrom === storedTo) {
      // If both dates are the same (preferred single date mode)
      selectedDateValue.value = storedFrom;
      fromDate.value = storedFrom;
      toDate.value = storedTo;
      selectedDate.value = new Date(storedFrom);
    } else if (storedTo) {
      // If they differ, use toDate and sync both to it
      selectedDateValue.value = storedTo;
      fromDate.value = storedTo;
      toDate.value = storedTo;
      selectedDate.value = new Date(storedTo);
      // Update localStorage to sync both keys
      window.localStorage.setItem(fromDateKey, storedTo);
      window.localStorage.setItem(toDateKey, storedTo);
    } else {
      initializeDefaultDates();
    }
  } catch (e) {
    initializeDefaultDates();
  }

  // Ensure dates are set before fetching alerts
  await nextTick();

  // Load Highcharts first, then fetch data and render
  await loadHighchartsGantt();

  // Try to fetch alerts immediately if site is available
  const initialSite =
    props.siteUid || window.localStorage.getItem("lastSelectedSite");

  startAlertsAutoRefresh();
});

// persist date changes - single date mode
watch([fromDate, toDate], ([f, t]) => {
  try {
    if (f) window.localStorage.setItem(fromDateKey, f);
    if (t) window.localStorage.setItem(toDateKey, t);
    window.localStorage.removeItem(legacyFromDateKey);
    window.localStorage.removeItem(legacyToDateKey);
  } catch (e) {}

  // In single date mode, both f and t should be the same
  // Update selectedDate and selectedDateValue to stay in sync
  const dateToUse = t || f; // prefer t (toDate) if available
  if (dateToUse) {
    selectedDate.value = new Date(dateToUse);
    if (selectedDateValue.value !== dateToUse) {
      selectedDateValue.value = dateToUse;
    }
  }
});

onUnmounted(() => {
  // Clean up any intervals or event listeners
  stopAutoPlay();
  stopAlertsAutoRefresh();
  hidePlayheadPopups();
  hideHoverPreview();
  closeDetailModal();

  if (chartInstance) {
    chartInstance = null;
  }

  // Clean up global functions
  if (window.openImageModal) {
    delete window.openImageModal;
  }
  if (window.downloadImageFromUrl) {
    delete window.downloadImageFromUrl;
  }
});

defineExpose({
  fetchAlerts,
});
</script>

<template>
  <!-- Real Time Process Monitoring Dashboard -->
  <div class="card card-flush">
    <!-- Header Section -->
    <div class="card-header py-6">
      <!-- 2x2 Grid Layout -->
      <div class="container-fluid">
        <div class="row g-4 d-flex align-items-center">
          <!-- Row 1: Title (Left) + Status Filters (Right) -->
          <div class="col-12 col-lg-6 d-flex justify-content-between">
            <!-- Title Section -->
            <div class="d-flex align-items-center">
              <div class="symbol symbol-45px me-3">
                <div class="symbol-label bg-light-primary">
                  <i class="ki-duotone ki-chart-simple text-primary fs-2x">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                  </i>
                </div>
              </div>
              <div>
                <h2 class="fs-1 fw-bold text-gray-900 mb-1">{{ title }}</h2>
                <p class="fs-6 text-muted mb-0">{{ subtitle }}</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6" v-if="showFilters">
            <!-- Status Filters -->
            <div
              class="d-flex flex-wrap align-items-center justify-content-lg-end gap-2"
            >
              <span class="fs-7 fw-bold text-gray-700 me-2">Status:</span>
              <button
                @click="toggleStatusFilter('active')"
                :class="[
                  'btn btn-sm d-flex align-items-center px-3 py-1',
                  isStatusSelected('active')
                    ? 'btn-primary'
                    : 'btn-light-primary',
                ]"
              >
                <div
                  class="rounded-circle me-2"
                  :class="
                    isStatusSelected('active') ? 'bg-white' : 'bg-primary'
                  "
                  style="width: 8px; height: 8px"
                ></div>
                <span class="fw-medium">Aktif</span>
              </button>
              <button
                @click="toggleStatusFilter('completed')"
                :class="[
                  'btn btn-sm d-flex align-items-center px-3 py-1',
                  isStatusSelected('completed')
                    ? 'btn-success'
                    : 'btn-light-success',
                ]"
              >
                <div
                  class="rounded-circle me-2"
                  :class="
                    isStatusSelected('completed') ? 'bg-white' : 'bg-success'
                  "
                  style="width: 8px; height: 8px"
                ></div>
                <span class="fw-medium">Selesai</span>
              </button>
              <button
                @click="toggleStatusFilter('scheduled')"
                :class="[
                  'btn btn-sm d-flex align-items-center px-3 py-1',
                  isStatusSelected('scheduled')
                    ? 'btn-secondary'
                    : 'btn-light-secondary',
                ]"
              >
                <div
                  class="rounded-circle me-2"
                  :class="
                    isStatusSelected('scheduled') ? 'bg-white' : 'bg-secondary'
                  "
                  style="width: 8px; height: 8px"
                ></div>
                <span class="fw-medium">Terjadwal</span>
              </button>
              <div class="badge badge-light-info ms-2">
                {{ selectedStatuses.length }}/3
              </div>
            </div>
          </div>
          <!-- Row 2: Date Picker (Left) + Auto-play Controls (Right) -->
          <div class="col-12 col-lg-6" v-if="showFilters">
            <!-- Date Picker Section -->
            <div class="d-flex align-items-center gap-3">
              <span class="fs-7 fw-bold text-gray-700">Tanggal:</span>
              <div style="width: 160px">
                <DatePicker
                  v-model="selectedDateValue"
                  label=""
                  size="sm"
                  storage-key="lastSelectedFromDate"
                  @update:model-value="handleSelectedDateChange"
                />
              </div>
              <button
                class="btn btn-light-primary btn-sm d-flex align-items-center px-3 py-2"
                @click="fetchAlerts"
                :disabled="isLoading"
              >
                <i class="ki-duotone ki-arrows-circle fs-6 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Muat
              </button>
            </div>
          </div>
          <div class="col-12 col-lg-6" v-if="showFilters">
            <!-- Auto-play Controls Section -->
            <div class="d-flex align-items-center justify-content-lg-end gap-3">
              <span class="fs-7 fw-bold text-gray-700">Kontrol:</span>
              <select
                v-model="playSpeed"
                class="form-select form-select-sm"
                :disabled="isPlaying"
                style="width: 140px; height: 30px"
              >
                <option :value="1000">Cepat (1s)</option>
                <option :value="2000">Normal (2s)</option>
                <option :value="3000">Lambat (3s)</option>
              </select>
              <button
                @click="toggleAutoPlay"
                :class="[
                  'btn btn-sm d-flex align-items-center px-3 py-1',
                  isPlaying ? 'btn-danger' : 'btn-success',
                ]"
                :disabled="!apiData || apiData.length === 0"
              >
                <i
                  :class="[
                    'me-2 fs-6',
                    isPlaying
                      ? 'ki-duotone ki-stop-circle'
                      : 'ki-duotone ki-play',
                  ]"
                >
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ isPlaying ? "Stop" : "Play" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Chart Area -->
    <div class="card-body">
      <!-- Auto-play indicator -->
      <div
        v-if="isPlaying"
        class="position-absolute top-0 end-0 z-3 badge badge-danger badge-lg d-flex align-items-center"
        style="margin: 1rem"
      >
        <div
          class="badge badge-circle badge-light-danger pulse me-2"
          style="width: 8px; height: 8px"
        ></div>
        AUTO PLAY AKTIF
      </div>

      <!-- Error & state messaging -->
      <div
        v-if="apiError"
        class="alert alert-warning d-flex align-items-center mb-4"
        role="alert"
      >
        <i class="ki-duotone ki-information fs-3 me-3 text-warning">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        <span class="fw-semibold text-warning">{{ apiError }}</span>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="d-flex flex-column align-items-center justify-content-center text-center"
        style="height: 400px"
      >
        <div class="spinner-border text-primary mb-4" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-gray-600 fw-semibold mb-2">Memuat data aktivitas...</p>
        <p class="fs-6 text-muted">Mohon tunggu sebentar</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!isLoading && apiData.length === 0"
        class="d-flex flex-column align-items-center justify-content-center text-center bg-white rounded border border-dashed border-gray-300"
        style="height: 400px"
      >
        <div class="symbol symbol-60px bg-light-gray-400 mb-4">
          <div class="symbol-label">
            <i class="ki-duotone ki-calendar-remove text-gray-400 fs-2x">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </div>
        </div>
        <h3 class="fs-4 fw-semibold text-gray-700 mb-2">Belum Ada Aktivitas</h3>
        <p class="text-muted mb-1">
          Tidak ada data aktivitas untuk tanggal ini.
        </p>
        <p class="fs-6 text-gray-400 mb-4">
          Silakan pilih tanggal lain atau coba lagi nanti.
        </p>
        <button @click="fetchAlerts" class="btn btn-primary btn-sm">
          <i class="ki-duotone ki-arrows-circle fs-6 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Muat Ulang
        </button>
      </div>

      <!-- Chart Container -->
      <div v-else class="bg-white rounded border p-4">
        <div
          id="process-tracking-chart"
          class="w-100"
          style="height: 400px"
        ></div>
      </div>
    </div>
  </div>

  <!-- Move existing modals to body using teleport -->
  <teleport to="body">
    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="modal show d-block"
      tabindex="-1"
      style="z-index: 2000; background-color: rgba(0, 0, 0, 0.6)"
      @click.self="closeDetailModal"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        style="max-width: 960px"
      >
        <div class="modal-content shadow-lg border-0">
          <!-- Modal Header -->
          <div class="modal-header bg-primary position-relative">
            <h1 class="modal-title fs-3 text-white fw-bold">
              {{
                modalDetailData?.process ||
                modalDetailData?.name ||
                "Detail Aktivitas"
              }}
            </h1>
            <button
              @click="closeDetailModal"
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body p-0" v-if="modalDetailData">
            <div class="container-fluid p-6">
              <!-- Error State -->
              <div
                v-if="modalDetailData.error"
                class="alert alert-danger d-flex align-items-center mb-6"
                role="alert"
              >
                <div class="symbol symbol-30px bg-light-danger me-4">
                  <div class="symbol-label">
                    <i class="ki-duotone ki-cross-circle text-danger fs-4">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div>
                  <h5 class="mb-1">Terjadi Kesalahan</h5>
                  <div class="fw-semibold">{{ modalDetailData.error }}</div>
                </div>
              </div>

              <!-- Success Content -->
              <div v-else>
                <!-- Status Card -->
                <div class="mb-4">
                  <div class="d-flex align-items-start justify-content-start">
                    <span
                      :class="detailStatusBadgeClass(modalDetailData.status)"
                      class="badge badge-lg fs-6 fw-bold"
                    >
                      {{ detailStatusLabel(modalDetailData.status) }}
                    </span>
                  </div>
                </div>

                <!-- Timing Information -->
                <div
                  class="text-start mb-4"
                  v-if="modalDetailData.start || modalDetailData.end"
                >
                  <div
                    class="d-flex justify-content-start align-items-start gap-3"
                  >
                    <div v-if="modalDetailData.start" class="text-muted">
                      <i class="ki-duotone ki-timer fs-6 me-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      {{ formatTime(modalDetailData.start) }}
                    </div>
                    <span
                      v-if="modalDetailData.start && modalDetailData.end"
                      class="text-muted"
                      >-</span
                    >
                    <div v-if="modalDetailData.end" class="text-muted">
                      {{ formatTime(modalDetailData.end) }}
                    </div>
                  </div>
                </div>

                <!-- Combined Section: Visual Documentation and Status & Comment in one row -->
                <div class="row g-4 mb-4">
                  <!-- Visual Documentation Column -->
                  <div class="col-md-6">
                    <div v-if="currentDetailImage" class="h-100">
                      <h5
                        class="fs-5 fw-bold text-gray-800 mb-3 d-flex align-items-center"
                      >
                        <i class="ki-duotone ki-picture text-primary fs-5 me-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Dokumentasi Visual
                      </h5>

                      <div
                        class="position-relative d-flex justify-content-center"
                      >
                        <img
                          :src="currentDetailImage"
                          class="img-fluid rounded border cursor-pointer shadow-sm"
                          @click="
                            openImageFromDetail(
                              currentDetailImage,
                              `Rekaman ${modalDetailData.name}`
                            )
                          "
                          style="max-width: 100%; height: auto"
                          @error="
                            $event.target.style.display = 'none';
                            $event.target.nextElementSibling.style.display =
                              'block';
                          "
                        />

                        <!-- Error fallback -->
                        <div
                          class="d-none border border-dashed border-gray-300 rounded p-4 text-center bg-light"
                        >
                          <i
                            class="ki-duotone ki-picture text-gray-400 fs-2x mb-2"
                          >
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <p class="text-muted mb-0">
                            Gambar tidak dapat dimuat
                          </p>
                        </div>

                        <button
                          v-if="hasMultipleDetailImages"
                          @click.stop="showPreviousDetailImage"
                          class="btn btn-icon btn-sm btn-light-primary position-absolute top-50 start-0 translate-middle-y ms-2 shadow-sm"
                          title="Sebelumnya"
                        >
                          <i class="ki-duotone ki-left fs-6">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>

                        <button
                          v-if="hasMultipleDetailImages"
                          @click.stop="showNextDetailImage"
                          class="btn btn-icon btn-sm btn-light-primary position-absolute top-50 end-0 translate-middle-y me-2 shadow-sm"
                          title="Berikutnya"
                        >
                          <i class="ki-duotone ki-right fs-6">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </button>

                        <div
                          v-if="hasMultipleDetailImages"
                          class="position-absolute bottom-0 end-0 bg-dark bg-opacity-75 text-white px-2 py-1 m-2 rounded fs-7"
                        >
                          {{ detailImageIndex + 1 }} /
                          {{ detailModalImages.length }}
                        </div>

                        <!-- Hover Overlay -->
                        <div
                          class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 opacity-0 d-flex align-items-end justify-content-center pb-3 hover-overlay"
                        >
                          <div class="d-flex">
                            <button
                              @click="
                                openImageFromDetail(
                                  currentDetailImage,
                                  `Rekaman ${modalDetailData.name}`
                                )
                              "
                              class="btn btn-primary btn-sm me-2"
                              title="Lihat ukuran penuh"
                            >
                              <i class="ki-duotone ki-resize fs-6 me-1">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
                              Perbesar
                            </button>
                            <button
                              @click="
                                downloadImageFromUrl(
                                  currentDetailImage,
                                  `Rekaman ${modalDetailData.name}`
                                )
                              "
                              class="btn btn-success btn-sm"
                              title="Download gambar"
                            >
                              <i class="ki-duotone ki-cloud-download fs-6">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- No Image Section -->
                    <div v-else class="h-100">
                      <h5
                        class="fs-5 fw-bold text-gray-800 mb-3 d-flex align-items-center"
                      >
                        <i
                          class="ki-duotone ki-picture text-secondary fs-5 me-2"
                        >
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Dokumentasi Visual
                      </h5>

                      <div
                        class="p-4 text-center bg-light rounded border border-dashed border-gray-300"
                      >
                        <i
                          class="ki-duotone ki-picture text-secondary fs-2x mb-3"
                        >
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        <h6 class="fw-semibold text-gray-700 mb-1">
                          Tidak Ada Dokumentasi
                        </h6>
                        <p class="text-muted fs-7 mb-0">
                          Tidak ada rekaman visual
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Status & Comment Column -->
                  <div class="col-md-6">
                    <h5
                      class="fs-5 fw-bold text-gray-800 mb-3 d-flex align-items-center"
                    >
                      <i class="ki-duotone ki-notepad-edit text-info fs-5 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Status & Komentar
                    </h5>

                    <div class="bg-light rounded p-3 mb-3">
                      <div class="d-flex align-items-center mb-2">
                        <i
                          class="ki-duotone ki-message-text text-secondary fs-6 me-2"
                        >
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <span class="fw-semibold text-gray-700 fs-6"
                          >Komentar:</span
                        >
                      </div>
                      <p class="text-gray-700 fs-6 mb-2">
                        {{
                          modalDetailData.comment ||
                          modalDetailData.description ||
                          "Tidak ada komentar tambahan untuk aktivitas ini."
                        }}
                      </p>
                      <div class="fs-7 text-muted">
                        <i class="ki-duotone ki-time fs-7 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Terakhir diperbarui:
                        {{
                          formatTime(
                            modalDetailData.updated_at || modalDetailData.start
                          )
                        }}
                      </div>
                    </div>

                    <!-- Help Section -->
                    <div class="alert alert-primary py-2 mb-0">
                      <div class="d-flex align-items-start">
                        <i
                          class="ki-duotone ki-information text-primary fs-6 me-2 mt-1"
                        >
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>
                        <div class="flex-grow-1">
                          <h6 class="fw-bold text-primary mb-2 fs-6">Tips:</h6>
                          <ul class="text-primary fs-7 mb-0 ps-3">
                            <li>
                              Klik gambar untuk melihat dalam ukuran penuh
                            </li>
                            <li>
                              Gunakan tombol download untuk menyimpan gambar
                            </li>
                            <li>Klik di luar modal untuk menutup</li>
                          </ul>
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
    </div>

    <!-- Image Modal -->
    <div
      v-if="showImageModal"
      class="modal show d-block"
      style="z-index: 2100; background-color: rgba(0, 0, 0, 0.95)"
      @click.self="closeImageModal"
    >
      <div
        class="modal-dialog modal-fullscreen d-flex align-items-center justify-content-center p-3"
      >
        <div
          class="position-relative w-100 h-100 d-flex align-items-center justify-content-center"
        >
          <button
            @click="closeImageModal"
            class="btn btn-sm btn-light position-absolute top-0 end-0 m-3 opacity-75 hover-opacity-100 rounded-circle"
            style="z-index: 10; width: 40px; height: 40px"
          >
            <i class="ki-duotone ki-cross fs-3">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
          <img
            :src="modalImageSrc"
            :alt="modalImageAlt"
            class="img-fluid rounded shadow-lg"
            style="max-height: 95vh; max-width: 95vw; object-fit: contain"
          />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
// Variables
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$shadow-subtle: 0 4px 12px rgba(0, 0, 0, 0.15);
$shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

// Colors
$primary-color: #3b82f6;
$success-color: #10b981;
$secondary-color: #6c757d;
$info-color: #0dcaf0;

// Hover effects
.hover-overlay {
  transition: all $transition-normal;
  opacity: 0;
  visibility: hidden;
  z-index: 5;
  border-radius: inherit;

  &:hover,
  &.active {
    opacity: 1 !important;
    visibility: visible;
  }
}

*:hover > .hover-overlay {
  opacity: 1;
  visibility: visible;
}

// Animations
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// Modal improvements
.modal {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  &-content {
    box-shadow: $shadow-modal;
  }
}

// Image states
.img-fluid {
  transition: all $transition-normal;

  &:hover {
    transform: scale(1.02);
  }
}

// Button improvements
.btn {
  transition: all $transition-fast;

  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-subtle;
  }

  // Button variants
  &-light-primary {
    background-color: rgba($primary-color, 0.1);
    border-color: rgba($primary-color, 0.3);
    color: $primary-color;
  }

  &-light-success {
    background-color: rgba($success-color, 0.1);
    border-color: rgba($success-color, 0.3);
    color: $success-color;
  }

  &-light-secondary {
    background-color: rgba($secondary-color, 0.1);
    border-color: rgba($secondary-color, 0.3);
    color: $secondary-color;
  }
}

// Badge styles
.badge-light-info {
  background-color: rgba($info-color, 0.1);
  color: $info-color;
  font-size: 0.75rem;
  font-weight: 600;
}

// Utility classes
.w-8px {
  width: 8px;
}
.h-8px {
  height: 8px;
}
.w-10px {
  width: 10px;
}
.h-10px {
  height: 10px;
}
.w-15px {
  width: 15px;
}
.h-15px {
  height: 15px;
}

.rotate-180 {
  transform: rotate(180deg);
}

.me-auto {
  margin-right: auto;
}

// Grid and layout
.card-header {
  .container-fluid {
    padding: 0;
  }

  .row {
    align-items: center;
  }
}

.row.g-1 > .col {
  flex: 0 0 14.2857%;
}

// Status filter hover states
.bg-light-primary:hover {
  background-color: var(--bs-primary-bg-subtle) !important;
}

.bg-light-success:hover {
  background-color: var(--bs-success-bg-subtle) !important;
}

.bg-light-secondary:hover {
  background-color: var(--bs-secondary-bg-subtle) !important;
}

// Responsive design with SASS
// Touch devices
@media (hover: none) and (pointer: coarse) {
  .hover-overlay {
    opacity: 0.8;
    visibility: visible;
  }

  .btn {
    min-height: 44px;
    min-width: 44px;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  .card:hover {
    transform: none;
    box-shadow: none;
  }
}

// Desktop and large tablets
@media (max-width: 1200px) {
  .modal-dialog {
    max-width: 90vw !important;
    margin: 1rem;
  }

  .controls-section .row {
    gap: 1rem;
  }

  .filter-group .d-flex {
    justify-content: center;
  }

  .filter-stats {
    justify-content: center;
    margin-top: 1rem;
    flex-basis: 100%;
  }
}

// Tablets
@media (max-width: 992px) {
  .header-title-section {
    .d-flex {
      text-align: center;
      justify-content: center;
    }

    h1 {
      font-size: 1.75rem !important;
    }
  }

  .status-filter-section .d-flex {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filter-group {
    order: 1;

    .d-flex {
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .filter-stats {
    order: 2;
    justify-content: center;
    margin-top: 0;
  }

  .controls-section {
    .row {
      flex-direction: column;
    }

    .col-12 {
      margin-bottom: 1rem;
    }
  }

  .modal-body {
    .row {
      flex-direction: column;
    }

    .col-md-6 {
      width: 100%;
      margin-bottom: 1.5rem;
    }
  }
}

// Small tablets and large phones
@media (max-width: 768px) {
  .card-header {
    padding: 1.5rem 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .header-title-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;

    .symbol-50px {
      width: 40px !important;
      height: 40px !important;
    }

    h1 {
      font-size: 1.5rem !important;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.875rem !important;
    }
  }

  .status-filter-section,
  .controls-section {
    margin-bottom: 1.5rem;

    .bg-white {
      padding: 1rem;
    }
  }

  .btn-sm {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .form-select-solid {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }

  .control-group .d-flex {
    flex-direction: column;
    gap: 0.75rem;

    .btn {
      width: 100%;
      justify-content: center;
    }
  }

  #process-tracking-chart {
    height: 280px !important;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}

// Mobile phones
@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem) !important;
  }

  .modal-fullscreen .modal-dialog {
    margin: 0;
    max-width: 100vw !important;
    height: 100vh;
  }

  .card-header .d-flex.justify-content-between {
    flex-direction: column;
    align-items: stretch;
  }

  .status-filters {
    justify-content: center;
    margin-top: 1rem;
  }

  .btn-group {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .img-fluid {
    max-width: 100%;
    height: auto;
  }

  .position-absolute.top-0.end-0 {
    position: fixed !important;
    top: 1rem !important;
    right: 1rem !important;
  }
}

/* Global styles & transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
