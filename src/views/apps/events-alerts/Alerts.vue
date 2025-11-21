<template>
  <!--begin::Events & Alerts Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">{{ t('appsEventsAlerts.alerts.title') }}</h4>
          <p class="text-muted mb-0">
            {{ currentSite ? t('appsEventsAlerts.alerts.subtitleSite', { site: currentSite.name }) : t('appsEventsAlerts.alerts.subtitleAll') }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <div class="me-3 d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">{{ t('appsEventsAlerts.alertsFilters.siteLabel') }}</label>
              <select
                v-model="selectedSiteFilter"
                class="form-select form-select-solid w-200px"
                :disabled="loadingSites"
                @change="onFilterSiteChange"
              >
                <option value="">{{ t('appsEventsAlerts.alertsFilters.siteAll') }}</option>
                <option
                  v-for="site in sites"
                  :key="site.uid"
                  :value="site.uid"
                >
                  {{ site.name }}
                </option>
              </select>
            </div>

            <div class="me-3">
              <select
                v-model="selectedEventType"
                @change="filterEvents"
                class="form-select form-select-solid w-150px"
              >
                <option value="">{{ t('appsEventsAlerts.alertsFilters.typeAll') }}</option>
                <option value="security">{{ t('appsEventsAlerts.alertsTable.types.security') }}</option>
                <option value="technical">{{ t('appsEventsAlerts.alertsTable.types.technical') }}</option>
                <option value="system">{{ t('appsEventsAlerts.alertsTable.types.system') }}</option>
                <option value="maintenance">{{ t('appsEventsAlerts.alertsTable.types.maintenance') }}</option>
              </select>
            </div>

            <div class="me-3">
              <select
                v-model="selectedSeverityType"
                @change="filterEvents"
                class="form-select form-select-solid w-150px"
              >
                <option value="">{{ t('appsEventsAlerts.alertsFilters.severityAll') }}</option>
                <option value="low">{{ t('appsEventsAlerts.alertsTable.severity.low') }}</option>
                <option value="medium">{{ t('appsEventsAlerts.alertsTable.severity.medium') }}</option>
                <option value="high">{{ t('appsEventsAlerts.alertsTable.severity.high') }}</option>
                <option value="critical">{{ t('appsEventsAlerts.alertsTable.severity.critical') }}</option>
              </select>
            </div>

            <button @click="refreshEvents" class="btn btn-sm btn-light-primary">
              <i class="ki-duotone ki-arrows-circle fs-2"></i>
              {{ t('appsEventsAlerts.alertsFilters.refresh') }}
            </button>
          </div>
          <!--end::Card toolbar-->
        </div>
      </div>
    </div>

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedEvents"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="15"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        :empty-table-text="t('appsEventsAlerts.alertsTable.empty')"
      >
        <template v-slot:event_name="{ row }">
          <div style="max-width: 200px; min-width: 180px;">
            <span class="text-dark fw-bold text-hover-primary fs-6" style="word-break: break-all;">
              {{ row.event_name }}
            </span>
          </div>
        </template>

        <template v-slot:severity="{ row }">
          <span
            class="badge"
            :class="getSeverityBadgeClass(row.severity)"
          >
            {{ getSeverityLabel(row.severity) }}
          </span>
        </template>

        <template v-slot:camera_name="{ row }">
          <div class="d-flex align-items-center" style="max-width: 200px; min-width: 180px;">
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold fs-6" style="word-break: break-all;">{{ row.camera_name }}</span>
              <span class="text-muted fw-semibold d-block fs-7">{{ row.location || t('appsEventsAlerts.alertsTable.noAssignee') }}</span>
            </div>
          </div>
        </template>

        <template v-slot:startTime="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            row.startTime ? new Date(row.startTime).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-'
          }}</span>
          <span class="text-muted fw-semibold d-block fs-7">
            {{ row.startTime ? new Date(row.startTime).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }).substring(0, 5) : '-' }}
            <span v-if="row.endTime"> - {{ new Date(row.endTime).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }).substring(0, 5) }}</span>
          </span>
        </template>

        <template v-slot:duration="{ row }">
          <span class="text-dark fw-bold fs-6">
            {{ row.duration ?? t('appsEventsAlerts.format.notAvailable') }}
          </span>
        </template>

        <template v-slot:avg_seconds_with_detection="{ row }">
          <span class="text-dark fw-bold fs-6">
            {{ row.avg_seconds_with_detection }}
          </span>
        </template>

        <template v-slot:status="{ row }">
          <span
            class="badge"
            :class="getStatusBadgeClass(row.status)"
          >
            {{ getStatusLabel(row.status) }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
              @click="viewAndEditEvent(row)"
              :title="t('appsEventsAlerts.table.actions.viewEdit')"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>
      
      <!--begin::Pagination-->
      <div class="d-flex flex-stack flex-wrap pt-10">
        <div class="fs-6 fw-semibold text-gray-700">
          {{ t('appsEventsAlerts.alertsTable.pagination', {
            start: ((currentPage - 1) * itemsPerPage) + 1,
            end: Math.min(currentPage * itemsPerPage, totalItems),
            total: totalItems
          }) }}
        </div>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button 
              class="page-link" 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              <i class="previous"></i>
            </button>
          </li>
          <li 
            v-for="page in visiblePages" 
            :key="page"
            class="page-item" 
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button 
              class="page-link" 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              <i class="next"></i>
            </button>
          </li>
        </ul>
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Events List-->

  <!--begin::Event Details Modal-->
  <div class="modal fade" id="eventDetailsModal" tabindex="-1" aria-labelledby="eventDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title fw-bold" id="eventDetailsModalLabel">{{ t('appsEventsAlerts.alertsModals.details.title') }}</h3>
          <button type="button" class="btn-close" @click="closeModal" :aria-label="t('appsEventsAlerts.actions.close')"></button>
        </div>
        <div class="modal-body" v-if="selectedEvent">
          <!--begin::Event Image-->
          <div class="row mb-6" v-if="selectedEvent.image_path">
            <div class="col-12">
              <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.modals.details.image') }}</label>
              <div class="text-center">
                <img 
                  :src="selectedEvent.image_path" 
                  :alt="selectedEvent.description"
                  class="img-fluid rounded border"
                  style="max-height: 300px; object-fit: contain;"
                  @error="handleImageError"
                />
              </div>
            </div>
          </div>
          <!--end::Event Image-->

          <!--begin::Event Info Grid-->
          <div class="row g-6">
            <!--begin::Left Column-->
            <div class="col-md-6">
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.alertName') }}</label>
                <p class="text-gray-800 mb-0 fs-4 font-monospace">{{ selectedEvent.event_name }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.cameraUuid') }}</label>
                <p class="text-gray-800 mb-0 fs-4 font-monospace">{{ selectedEvent.camera_name }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.status') }}</label>
                <div>
                  <span class="badge fs-5" :class="getStatusBadgeClass(selectedEvent.status)" style="padding: 8px 12px;">
                    {{ getStatusLabel(selectedEvent.status) }}
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.description') }}</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEvent.description }}</p>
              </div>
            </div>
            <!--end::Left Column-->

            <!--begin::Right Column-->
            <div class="col-md-6">
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.triggeredTime') }}</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEvent.startTime) }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.acknowledgedTime') }}</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEvent.endTime) }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.resolvedTime') }}</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEvent.startTime) }}</p>
              </div>

              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.severity') }}</label>
                <div>
                  <span class="badge fs-5" :class="getSeverityBadgeClass(selectedEvent.severity)" style="padding: 8px 12px;">
                    {{ getSeverityLabel(selectedEvent.severity) }}
                  </span>
                </div>
              </div>
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">{{ t('appsEventsAlerts.alertsModals.details.responseTime') }}</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEvent.avg_seconds_with_detection }}</p>
              </div>
            </div>
            <!--end::Right Column-->
          </div>
          <!--end::Event Info Grid-->

          <!--begin::Comments Section-->
          <div class="row mt-6" v-if="selectedEvent.comment">
            <div class="col-12">
              <div class="bg-light-info p-4 rounded">
                <label class="fw-semibold fs-4 text-gray-700 mb-2 d-block">{{ t('appsEventsAlerts.alertsModals.details.comments') }}</label>
                <p class="text-gray-800 mb-0 fs-5" style="white-space: pre-wrap;">{{ selectedEvent.comment }}</p>
              </div>
            </div>
          </div>
          <!--end::Comments Section-->

          <!--begin::Event UID-->
          <div class="row mt-6">
            <div class="col-12">
              <div class="bg-light p-4 rounded">
                <label class="fw-semibold fs-5 text-gray-600 mb-1">{{ t('appsEventsAlerts.alertsModals.details.alertIdHint') }}</label>
                <p class="text-gray-800 mb-0 font-monospace fs-6">{{ selectedEvent.uid }}</p>
              </div>
            </div>
          </div>
          <!--end::Event UID-->

          <!--begin::Edit Fields-->
          <div class="row mt-6">
            <div class="col-md-6">
              <label class="form-label fw-bold text-dark">Status</label>
              <select class="form-select" v-model="editStatus">
                <option value="">{{ t('appsEventsAlerts.form.selectStatus') }}</option>
                <option value="active">{{ t('appsEventsAlerts.alertsTable.status.active') }}</option>
                <option value="acknowledged">{{ t('appsEventsAlerts.alertsTable.status.acknowledged') }}</option>
                <option value="resolved">{{ t('appsEventsAlerts.alertsTable.status.resolved') }}</option>
              </select>
            </div>
            <div class="col-12 mt-3">
              <label class="form-label fw-bold text-dark">{{ t('appsEventsAlerts.alertsModals.details.comment') }}</label>
              <textarea 
                class="form-control" 
                rows="3" 
                v-model="editComment"
                :placeholder="t('appsEventsAlerts.alertsModals.details.commentPlaceholder')"
              ></textarea>
            </div>
          </div>
          <!--end::Edit Fields-->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary fs-5 px-4 py-2" @click="closeModal">{{ t('appsEventsAlerts.actions.close') }}</button>
          <button 
            type="button" 
            class="btn btn-primary fs-5 px-4 py-2" 
            v-if="hasChanges" 
            @click="saveEventChanges" 
            :disabled="isModalLoading"
          >
            <span v-if="isModalLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('appsEventsAlerts.actions.update') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Event Details Modal-->


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

const { t } = useI18n();

// Interface definitions
interface Event {
  code: number;
  message: string;
  data: Array<{
    duration: number;
    endTime: string;
    image_path: string;
    process: string;
    startTime: string;
    status: string;
    comment?: string;
  }>;
  uid: string;
  type: 'motion' | 'intrusion' | 'system' | 'camera_offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  camera_name?: string;
  location: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  site_uid?: string;
  comment?: string;
}

interface Site {
  uid: string;
  name: string;
}

// Reactive data
const events = ref<any[]>([]);
const sites = ref<Site[]>([]);
const nvrs = ref<Array<{ uid: string; name: string; site_uid?: string }>>([]);
const camerasCache = ref<Record<string, Record<string, string>>>({});
const loading = ref(false);
const loadingSites = ref(false);
const loadingNvrs = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref("");
// Header filter state (site + nvr)
const selectedSiteFilter = ref<string>("");
const selectedNvrFilter = ref<string>("");
const selectedEventType = ref("");
const selectedSeverityType = ref("");
const sortLabel = ref("timestamp");
const sortOrder = ref<"asc" | "desc">("desc");
const currentSite = ref<Site | null>(null);
// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(15);
const totalItems = ref(0);
const totalPages = ref(0);
// Modal state
const selectedEvent = ref<any>(null);
const editStatus = ref('');
const editComment = ref('');
const isModalLoading = ref(false);

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.alert'),
    columnLabel: 'event_name',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.severity'),
    columnLabel: 'severity',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.camera'),
    columnLabel: 'camera_name',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.timestamp'),
    columnLabel: 'startTime',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.status'),
    columnLabel: 'status',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.actions'),
    columnLabel: 'actions',
    sortEnabled: false,
    searchable: false,
  },
]);

// Fetch events from API (uses mock response shape as fallback)
const fetchEvents = async () => {
  loading.value = true;
  try {
    // Determine site uid to request - prefer selectedSiteFilter, fallback to first loaded site
    let siteUid = selectedSiteFilter.value || (sites.value.length ? sites.value[0].uid : "") || "fff0f3a7-cea8-4383-a0de-c7d9041a2519";
    if (!siteUid) {
      console.warn("No site selected and no sites available - skipping list-activity call");
      events.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
      return;
    }

    await fetchCameras(siteUid);

    // Call API: sites/{site_uid}/list-activity
    const resp = await ApiService.get(`sites/${siteUid}/list-activity`);
    const payload = resp && resp.data ? resp.data : resp;

    // Handle API response structure: { status, code, message, data: [...], pagination: {...} }
    let results = [];
    if (payload?.status === "success" && Array.isArray(payload?.data)) {
      results = payload.data;
    } else if (Array.isArray(payload?.results)) {
      // Fallback untuk struktur lama
      results = payload.results;
    } else {
      console.warn('Unexpected API response format:', payload);
      results = [];
    }

    // Map response data items to internal event structure
    events.value = results.map((item: any, idx: number) => {
      return {
        uid: item.event_id || `evt-${idx}-${Date.now()}`,
        type: 'motion', // default type - adjust if API provides type later
        severity: 'medium', // default severity based on detection activity
        description: t('appsEventsAlerts.alertsTable.generatedDescription', {
          seconds: Math.round(item.avg_seconds_with_detection || 0),
        }),
        event_name: item.event_name || '',
        camera_name: item.camera_name || '',
        location: '',
        timestamp: item.event_start || item.event_end || new Date().toISOString(),
        status: 'resolved', // default status
        site_uid: siteUid,
        // preserve fields from API
        duration: item.duration_minutes,
        startTime: item.event_start,
        endTime: item.event_end,
        image_path: '',
        process: '',
        comment: null,
        avg_seconds_with_detection: item.avg_seconds_with_detection
      }
    });

    // Use pagination from API response
    const pagination = payload?.pagination || {};
    totalItems.value = typeof pagination.total_items === "number" ? pagination.total_items : events.value.length;
    itemsPerPage.value = typeof pagination.per_page === "number" && pagination.per_page > 0 ? pagination.per_page : itemsPerPage.value;
    totalPages.value = typeof pagination.total_pages === "number" && pagination.total_pages > 0
      ? pagination.total_pages
      : Math.ceil(totalItems.value / itemsPerPage.value);

    // Apply client-side filters if header filters are set
    if (selectedSiteFilter.value) {
      events.value = events.value.filter(e => !e.site_uid || e.site_uid === selectedSiteFilter.value);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    events.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

// Fetch sites from API (following Camera.vue pattern)
const fetchSites = async () => {
  loadingSites.value = true;
  try {
    // Get selected team from localStorage (following Camera.vue pattern)
    const selectedTeamId = localStorage.getItem('lastSelectedTeam');
    if (!selectedTeamId) {
      console.warn('No team selected, cannot load sites');
      sites.value = [];
      return;
    }
    
    const resp = await ApiService.query(`teams/${selectedTeamId}/sites`, {});
    // Parse response (wrapped or direct) - exactly like Camera.vue
    if (resp && resp.data) {
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        sites.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        sites.value = resp.data;
      } else {
        console.warn('Unexpected sites response format:', resp.data);
        sites.value = [];
      }
    } else {
      console.warn('No data received from sites API');
      sites.value = [];
    }
  } catch (error) {
    console.error("Error fetching sites:", error);
    // Fallback to mock data for development
  } finally {
    loadingSites.value = false;
  }
};

  // Fetch cameras for a site and cache uuid->name map per site
  const fetchCameras = async (siteUid: string) => {
    if (!siteUid) return;
    // if cache exists for this site, skip
    if (camerasCache.value[siteUid] && Object.keys(camerasCache.value[siteUid]).length) return;

    try {
      const resp = await ApiService.get(`sites/${siteUid}/cameras`);
      const payload = resp && resp.data ? resp.data : resp;

      let cams: any[] = [];
      if (payload?.status === 'success' && Array.isArray(payload?.data)) {
        cams = payload.data;
      } else if (Array.isArray(payload)) {
        cams = payload;
      } else if (Array.isArray(payload?.results)) {
        cams = payload.results;
      }

      const map: Record<string, string> = {};
      cams.forEach((c: any) => {
        const id = c.uuid || c.camera_uuid || c.id;
        if (id) {
          map[id] = c.name || c.camera_name || c.label || id;
        }
      });

      camerasCache.value[siteUid] = map;
    } catch (err) {
      console.warn('Failed to load cameras for site', siteUid, err);
      // set empty map to avoid retry storm
      camerasCache.value[siteUid] = {};
    }
  };

// Switch site
const switchSite = () => {
  const site = sites.value.find(s => s.uid === selectedSiteId.value);
  currentSite.value = site || null;
  fetchEvents();
};

// Filter events
const filterEvents = () => {
  // Filtering is handled in computed property
};

// Refresh events
const refreshEvents = () => {
  fetchEvents();
};

// Header filter handlers
const onFilterSiteChange = () => {
  // selectedSiteFilter stores the site uid
  currentSite.value = sites.value.find(s => s.uid === selectedSiteFilter.value) || null;
  // reset NVR filter when site changes
  selectedNvrFilter.value = "";
  fetchEvents();
};

const onFilterNvrChange = () => {
  // Changing NVR filter should reload events scoped to that NVR
  fetchEvents();
};


// Helpers for badge styling and translated labels
const normalizeKey = (value?: string) => (value ?? '').toLowerCase().replace(/[\s_-]/g, '');

const statusKeyMap: Record<string, string> = {
  active: 'active',
  acknowledged: 'acknowledged',
  resolved: 'resolved',
  unresolved: 'unresolved',
  notresolved: 'notResolved',
  falsedetection: 'falseDetection',
};

const severityKeyMap: Record<string, string> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
};

const typeKeyMap: Record<string, string> = {
  motion: 'motion',
  intrusion: 'intrusion',
  system: 'system',
  cameraoffline: 'cameraOffline',
};

const getEventTypeBadgeClass = (type: string) => {
  switch (normalizeKey(type)) {
    case 'motion':
      return 'badge-light-primary';
    case 'intrusion':
      return 'badge-light-danger';
    case 'system':
      return 'badge-light-info';
    case 'cameraoffline':
      return 'badge-light-warning';
    default:
      return 'badge-light-secondary';
  }
};

const getSeverityBadgeClass = (severity: string) => {
  switch (normalizeKey(severity)) {
    case 'critical':
      return 'badge-danger';
    case 'high':
      return 'badge-warning';
    case 'medium':
      return 'badge-primary';
    case 'low':
      return 'badge-success';
    default:
      return 'badge-secondary';
  }
};

const getStatusBadgeClass = (status: string) => {
  const normalized = normalizeKey(status);
  if (normalized === 'active' || normalized === 'unresolved') return 'badge-light-danger';
  if (normalized === 'acknowledged') return 'badge-light-warning';
  if (normalized === 'resolved' || normalized === 'notresolved') return 'badge-light-success';
  if (normalized === 'falsedetection') return 'badge-light-info';
  return 'badge-light-secondary';
};

const getStatusLabel = (status: string) => {
  const key = statusKeyMap[normalizeKey(status)];
  return key ? t(`appsEventsAlerts.alertsTable.status.${key}`) : status;
};

const getSeverityLabel = (severity: string) => {
  const key = severityKeyMap[normalizeKey(severity)];
  return key ? t(`appsEventsAlerts.alertsTable.severity.${key}`) : severity;
};

const getEventTypeLabel = (type: string) => {
  const key = typeKeyMap[normalizeKey(type)];
  return key ? t(`appsEventsAlerts.table.types.${key}`) : type;
};

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

const formatMinutesShort = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes)) {
    return t('appsEventsAlerts.format.notAvailable');
  }
  return t('appsEventsAlerts.format.minutesShort', {
    value: formatNumber(Math.max(0, minutes), 1),
  });
};

const formatSecondsShort = (seconds?: number | null) => {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) {
    return t('appsEventsAlerts.format.notAvailable');
  }
  return t('appsEventsAlerts.format.secondsShort', {
    value: formatNumber(Math.max(0, seconds), 1),
  });
};

const formatSecondsLong = (seconds?: number | null) => {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) {
    return t('appsEventsAlerts.format.notAvailable');
  }
  return t('appsEventsAlerts.format.secondsLong', {
    value: formatNumber(Math.max(0, seconds), 2),
  });
};

const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes)) {
    return t('appsEventsAlerts.format.notAvailable');
  }
  if (minutes < 1) {
    return formatSecondsLong(minutes * 60);
  }
  return t('appsEventsAlerts.format.minutesLong', {
    value: formatNumber(Math.max(0, minutes), 2),
  });
};

// Computed properties
const filteredAndSortedEvents = computed(() => {
  let filtered = events.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((event) => {
      const description = (event.description || '').toLowerCase();
      const camera = (event.camera_name || '').toLowerCase();
      const location = (event.location || '').toLowerCase();
      const type = (event.type || '').toLowerCase();
      const status = (event.status || '').toLowerCase();
      const severity = (event.severity || '').toLowerCase();
      const translatedType = getEventTypeLabel(event.type).toLowerCase();

      return (
        description.includes(query) ||
        camera.includes(query) ||
        location.includes(query) ||
        type.includes(query) ||
        status.includes(query) ||
        severity.includes(query) ||
        translatedType.includes(query)
      );
    });
  }

  if (selectedEventType.value) {
    filtered = filtered.filter((event) => event.type === selectedEventType.value);
  }

  if (selectedSeverityType.value) {
    filtered = filtered.filter((event) => event.severity === selectedSeverityType.value);
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortLabel.value as keyof Event];
      let bValue: any = b[sortLabel.value as keyof Event];

      if (sortLabel.value === 'startTime' || sortLabel.value === 'endTime' || sortLabel.value === 'timestamp') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0;
        bValue = bValue ? new Date(bValue as string).getTime() : 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortOrder.value === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  }

  totalItems.value = filtered.length;
  totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);

  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;

  return filtered.slice(startIndex, endIndex);
});

// Statistics computed properties
const activeAlerts = computed(() => events.value.filter(e => e.status === 'active').length);
const criticalAlerts = computed(() => events.value.filter(e => e.severity === 'critical' && e.status === 'active').length);
const motionEvents = computed(() => events.value.filter(e => e.type === 'motion').length);
const resolvedToday = computed(() => {
  const today = new Date().toDateString();
  return events.value.filter(e => 
    e.status === 'resolved' && 
    new Date(e.timestamp).toDateString() === today
  ).length;
});
const totalResolved = computed(() => events.value.filter(e => e.status === 'resolved').length);
const avgResponseTime = computed(() => 15); // Mock data

const criticalAlertsPercentage = computed(() =>
  activeAlerts.value > 0 ? Math.round((criticalAlerts.value / activeAlerts.value) * 100) : 0
);

const resolvedTodayPercentage = computed(() =>
  totalResolved.value > 0 ? Math.round((resolvedToday.value / totalResolved.value) * 100) : 0
);

const responseTimePercentage = computed(() => 75); // Mock data

// Check if there are changes to enable update button
const hasChanges = computed(() => {
  if (!selectedEvent.value) return false;
  
  const originalStatus = selectedEvent.value.status || '';
  const originalComment = selectedEvent.value.comment || '';
  
  return editStatus.value !== originalStatus || editComment.value !== originalComment;
});

// Pagination computed properties
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const viewAndEditEvent = (event: Event) => {
  selectedEvent.value = event;
  // Initialize edit fields with current values
  editStatus.value = event.status || '';
  editComment.value = event.comment || '';
  
  // Show modal using Bootstrap 5
  const modalElement = document.getElementById('eventDetailsModal');
  if (modalElement) {
    try {
      const modal = new Modal(modalElement);
      modal.show();
    } catch (error) {
      console.error('Error showing modal:', error);
    }
  }
};

const closeEditModal = () => {
  const modalElement = document.getElementById('editEventModal');
  if (modalElement) {
    try {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('Error hiding edit modal:', error);
    }
  }

  editStatus.value = '';
  editComment.value = '';
};

const saveEventChanges = async () => {
  if (!editStatus.value || !selectedEvent.value) return;
  
  try {
    isModalLoading.value = true;
    
    const updateData = {
      status: editStatus.value,
      comment: editComment.value
    };
    
    // TODO: API call untuk update event
    // await ApiService.put(`events/${selectedEvent.value.uid}`, updateData);
    
    // Update local state
    const index = events.value.findIndex(e => e.uid === selectedEvent.value!.uid);
    if (index !== -1) {
      events.value[index].status = editStatus.value;
      if (editComment.value) {
        events.value[index].comment = editComment.value;
      }
    }
    
    // Update selectedEvent for display
    selectedEvent.value.status = editStatus.value;
    if (editComment.value) {
      selectedEvent.value.comment = editComment.value;
    }
    
    console.log('Event updated:', updateData);
    
  } catch (error) {
    console.error("Error updating event:", error);
  } finally {
    isModalLoading.value = false;
  }
};

const updatePaginationInfo = () => {
  totalItems.value = filteredAndSortedEvents.value.length;
  totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
  
  // Adjust current page if it exceeds total pages
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
};

const viewEventDetails = (event: Event) => {
  selectedEvent.value = event;
  console.log('Opening modal for event:', event);
  
  // Show modal using Bootstrap 5
  const modalElement = document.getElementById('eventDetailsModal');
  if (modalElement) {
    try {
      const modal = new Modal(modalElement);
      modal.show();
      console.log('Modal shown successfully');
    } catch (error) {
      console.error('Error showing modal:', error);
      // Fallback: manually show modal
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.setAttribute('aria-hidden', 'false');
      
      // Add backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.id = 'eventDetailsModalBackdrop';
      document.body.appendChild(backdrop);
      
      // Add body class for modal behavior
      document.body.classList.add('modal-open');
    }
  } else {
    console.error('Modal element not found');
  }
};

const closeModal = () => {
  const modalElement = document.getElementById('eventDetailsModal');
  if (modalElement) {
    try {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    } catch (error) {
      console.error('Error hiding modal:', error);
      // Fallback: manually hide modal
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      
      // Remove backdrop
      const backdrop = document.getElementById('eventDetailsModalBackdrop');
      if (backdrop) {
        backdrop.remove();
      }
      
      // Remove body class
      document.body.classList.remove('modal-open');
    }
  }
  selectedEvent.value = null;
  editStatus.value = '';
  editComment.value = '';
};

const acknowledgeEventFromModal = async () => {
  if (selectedEvent.value) {
    await acknowledgeEvent(selectedEvent.value);
    // Update selected event status
    selectedEvent.value.status = 'acknowledged';
    closeModal();
  }
};

const resolveEventFromModal = async () => {
  if (selectedEvent.value) {
    await resolveEvent(selectedEvent.value);
    // Update selected event status
    selectedEvent.value.status = 'resolved';
    closeModal();
  }
};

const formatDateTime = (dateTimeString?: string | null) => {
  if (!dateTimeString) return t('appsEventsAlerts.format.notAvailable');
  const date = new Date(dateTimeString);
  if (Number.isNaN(date.getTime())) {
    return dateTimeString;
  }
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const handleImageError = (event: any) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMzUgNzVIMTY1VjEyNUgxMzVWNzVaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMjAgMTA1TDE0MCA5MEwxNjAgMTEwTDE4MCA5MEwyMDAgMTEwVjEzNUgxMDBWMTEwTDEyMCAxMDVaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjE0cHgiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
  event.target.alt = t('appsEventsAlerts.modals.details.imageFallback');
};

const acknowledgeEvent = async (event: Event) => {
  try {
    // TODO: API call to acknowledge event
    // await ApiService.post(`events/${event.uid}/acknowledge`);
    
    // Update local state
    const index = events.value.findIndex(e => e.uid === event.uid);
    if (index !== -1) {
      events.value[index].status = 'acknowledged';
    }
  } catch (error) {
    console.error("Error acknowledging event:", error);
  }
};

const resolveEvent = async (event: Event) => {
  try {
    // TODO: API call to resolve event
    // await ApiService.post(`events/${event.uid}/resolve`);
    
    // Update local state
    const index = events.value.findIndex(e => e.uid === event.uid);
    if (index !== -1) {
      events.value[index].status = 'resolved';
    }
  } catch (error) {
    console.error("Error resolving event:", error);
  }
};

// Initialize data on component mount
onMounted(() => {
  fetchSites();
  fetchEvents();
  
  // Add event listener for manual modal backdrop click
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement)?.id === 'eventDetailsModalBackdrop') {
      closeModal();
    }
  });
});
</script>