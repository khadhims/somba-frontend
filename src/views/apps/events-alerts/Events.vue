<template>
  <!--begin::Events & Alerts Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">{{ t('appsEventsAlerts.events.title') }}</h4>
          <p class="text-muted mb-0">
            {{ currentSite ? t('appsEventsAlerts.events.subtitleSite', { site: currentSite.name }) : t('appsEventsAlerts.events.subtitleAll') }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end align-items-center">
            <!-- Site Filter -->
            <div class="d-flex align-items-center me-3">
              <label class="form-label me-3 mb-0 fw-semibold">{{ t('appsEventsAlerts.eventsFilters.siteLabel') }}</label>
              <select
                v-model="tempSelectedSiteFilter"
                class="form-select form-select-solid w-200px"
                :disabled="loadingSites"
                @change="onTempFilterSiteChange"
              >
                <option value="">{{ t('appsEventsAlerts.eventsFilters.siteAll') }}</option>
                <option
                  v-for="site in sites"
                  :key="site.uid"
                  :value="site.uid"
                >
                  {{ site.name }}
                </option>
              </select>
            </div>
            
            <!-- Camera Filter -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">{{ t('appsEventsAlerts.eventsFilters.cameraLabel') || 'Camera' }}</label>
              <select
                v-model="tempSelectedCameraFilter"
                class="form-select form-select-solid w-200px"
                :disabled="loadingCameras || !tempSelectedSiteFilter"
                @change="onTempFilterCameraChange"
              >
                <option value="">{{ t('appsEventsAlerts.eventsFilters.cameraAll') || 'All Cameras' }}</option>
                <option
                  v-for="camera in cameras"
                  :key="camera.uuid"
                  :value="camera.uuid"
                  :title="`ID: ${camera.uuid} | Model: ${camera.model || 'N/A'} | Recorder: ${camera.video_recorder_name || 'N/A'}`"
                >
                  {{ camera.name }} {{ camera.model ? `(${camera.model})` : '' }}
                </option>
              </select>
            </div>
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
        <h3 class="fw-bold m-0">{{ t('appsEventsAlerts.events.title') }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar d-flex justify-content-between align-items-center w-100">
        <!-- Date Range Filters - Start -->
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{ t('appsEventsAlerts.eventsFilters.fromDateLabel') }}</label>
            <DatePicker
              v-model="tempDateFrom"
              size="sm"
              :clearable="true"
              defaultType="monthAgo"
              style="width: 180px;"
            />
          </div>
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{ t('appsEventsAlerts.eventsFilters.toDateLabel') }}</label>
            <DatePicker
              v-model="tempDateTo"
              size="sm"
              :clearable="true"
              defaultType="today"
              style="width: 180px;"
            />
          </div>
          
          <!-- Apply All Filters Button -->
          <div class="me-3">
            <button 
              @click="applyFilters" 
              class="btn btn-sm btn-primary py-1 px-2"
              title="Apply All Filters"
            >
              <i class="ki-duotone ki-check fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Apply Filters
            </button>
          </div>
          <!-- Reset Filters Button -->
          <div class="me-3">
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
          <!-- Reset to Defaults Button -->
          <div class="me-3">
            <button 
              @click="resetToDefaults" 
              class="btn btn-sm btn-secondary py-1 px-2"
              title="Reset to Default Values"
            >
              <i class="ki-duotone ki-time fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Defaults
            </button>
          </div>
        </div>
        
        <!-- Other Filters - End -->
        <div class="d-flex align-items-center">
          <!-- Severity Filter -->
          <div class="me-3">
            <select
              v-model="selectedSeverityType"
              @change="filterEvents"
              class="form-select form-select-sm form-select-solid w-150px"
            >
              <option value="">{{ t('appsEventsAlerts.eventsFilters.severityAll') }}</option>
              <option value="low">{{ t('appsEventsAlerts.eventsTable.severity.low') }}</option>
              <option value="medium">{{ t('appsEventsAlerts.eventsTable.severity.medium') }}</option>
              <option value="high">{{ t('appsEventsAlerts.eventsTable.severity.high') }}</option>
              <option value="critical">{{ t('appsEventsAlerts.eventsTable.severity.critical') }}</option>
            </select>
          </div>

          <!--begin::Search-->
          <div class="d-flex align-items-center position-relative my-1 me-3">
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control form-control-sm form-control-solid w-200px ps-12"
              placeholder="Search"
            />
          </div>
          <!--end::Search-->

          <button @click="refreshEvents" class="btn btn-sm btn-light-primary btn-icon" title="Refresh">
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
        :pagination="{ page: currentPage, per_page: itemsPerPage, total_items: totalItems, total_pages: totalPages }"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @sort="handleSort"
        @view-detail="viewEventDetails"
      />
      
      <!--begin::Pagination-->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <ItemPerPage
          :model-value="itemsPerPage"
          :label="t('appsEventsAlerts.eventsTable.pagination.itemsLabel') || 'Items per page:'"
          :options="[10, 20, 30, 50]"
          @change="changeItemsPerPage"
        />
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ItemPerPage from '@/components/ItemPerPage.vue';
import DatePicker from '@/components/DatePicker.vue';
import ApiService from "@/core/services/ApiService";
import EventsTable from '@/components/apps/events-alerts/EventsTable.vue';
import EventDetailModal from '@/components/apps/events-alerts/EventDetailModal.vue';

const { t } = useI18n();

// Interface definitions
interface Event {
  // type: 'motion' | 'intrusion' | 'system' | 'camera_offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
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
  status: 'active' | 'acknowledged' | 'resolved';
  image_url?: string;
  image_urls?: string[];
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
  video_recorder_uid?: string;
  video_recorder_name?: string;
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
  video_recorder?: number;
  model?: string;
  public_endpoint_url?: string;
  created_by?: {
    username?: string;
    email?: string;
  };
}

// Reactive data
const events = ref<Event[]>([]);
const sites = ref<Site[]>([]);
const cameras = ref<Camera[]>([]);
const camerasCache = ref<Record<string, Record<string, string>>>({});
const loading = ref(false);
const loadingSites = ref(false);
const loadingCameras = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref("");
// Header filter state (site + camera)
const selectedSiteFilter = ref<string>("");
const selectedCameraFilter = ref<string>("");
const selectedNvrFilter = ref<string>("");
const selectedEventType = ref("");
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
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);
// Modal state
const selectedEvent = ref<any>(null);
const showDetailModal = ref(false);
const loadingDetail = ref(false);

// Pagination handlers
let fetchTimeout: number | null = null;

// Initialize default dates (1 month ago to today)
const initializeDefaultDates = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const defaultFromDate = formatDate(oneMonthAgo);
  const defaultToDate = formatDate(today);
  
  // Check if dates are already stored in localStorage
  const storedFromDate = localStorage.getItem('eventsDefaultFromDate');
  const storedToDate = localStorage.getItem('eventsDefaultToDate');
  
  if (!storedFromDate || !storedToDate) {
    // Store default dates in localStorage
    localStorage.setItem('eventsDefaultFromDate', defaultFromDate);
    localStorage.setItem('eventsDefaultToDate', defaultToDate);
    console.log('Events.vue: Set default dates in localStorage:', { defaultFromDate, defaultToDate });
  }
  
  // Set reactive date values from localStorage
  const fromDate = localStorage.getItem('eventsDefaultFromDate') || defaultFromDate;
  const toDate = localStorage.getItem('eventsDefaultToDate') || defaultToDate;
  
  dateFrom.value = fromDate;
  dateTo.value = toDate;
  tempDateFrom.value = fromDate;
  tempDateTo.value = toDate;
  
  console.log('Events.vue: Initialized default dates:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    tempDateFrom: tempDateFrom.value,
    tempDateTo: tempDateTo.value
  });
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
  console.log('changeItemsPerPage called with:', newPerPage);
  console.log('Current itemsPerPage value before change:', itemsPerPage.value);
  
  // Force update the reactive value
  itemsPerPage.value = newPerPage;
  
  console.log('itemsPerPage value after change:', itemsPerPage.value);
  console.log('Will send to API: page_size =', itemsPerPage.value);
  
  // Reset to first page
  currentPage.value = 1;
  
  // Fetch immediately without debounce for items per page change
  fetchEvents();
};

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.event'),
    columnLabel: 'event_name',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.camera'),
    columnLabel: 'camera_name',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.timestamp'),
    columnLabel: 'startTime',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.duration'),
    columnLabel: 'duration',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.avgDetection'),
    columnLabel: 'avg_seconds_with_detection',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.status'),
    columnLabel: 'status',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsEventsAlerts.eventsTable.columns.actions'),
    columnLabel: 'actions',
    sortEnabled: false,
    searchable: false,
  },
]);

// Fetch events from API (uses mock response shape as fallback)
const fetchEvents = async () => {
  if (loading.value) {
    console.log('fetchEvents: Already loading, skipping duplicate call');
    return;
  }
  
  loading.value = true;
  try {
    // Determine site uid to request - prefer selectedSiteFilter, fallback to first loaded site
    let siteUid = selectedSiteFilter.value || (sites.value.length ? sites.value[0].uid : "");
    if (!siteUid) {
      console.warn("No site selected and no sites available - skipping list-activity call");
      events.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
      return;
    }

    // Call API: sites/{site_uid}/list-activity with pagination params
    // ${siteUid}
    const params: any = {
      page: currentPage.value,
      page_size: itemsPerPage.value
    };
        
    // Add camera filter if set
    if (selectedCameraFilter.value && selectedCameraFilter.value !== '' && selectedCameraFilter.value !== 'undefined') {
      params.camera_uuid = selectedCameraFilter.value;
      console.log('Adding camera_uuid to query params:', selectedCameraFilter.value);
    }
    
    // Add date range filters if set
    if (dateFrom.value) {
      params.from_date = dateFrom.value;
    }
    if (dateTo.value) {
      params.to_date = dateTo.value;
    }
    
    const resp = await ApiService.query(`sites/${siteUid}/activities`, {
      params
    });
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
        severity: 'medium', // default severity based on detection activity
        site_uid: siteUid,
        camera_uuid: item.camera_uuid || '',
        camera_name: item.camera_name || '',
        event_id: item.event_id || '',
        event_name: item.event_name || '',
        event_start: item.event_start,
        event_end: item.event_end,
        duration_minutes: item.duration_minutes,
        total_minutes: item.total_minutes,
        avg_seconds_with_detection: item.avg_seconds_with_detection,
        // type: 'motion', // default type - adjust if API provides type later
        status: item.status || 'active',
        image_url: item.image_url || '',
        image_urls: item.image_urls || [],
        activities: item.activities || [],
      }
    });

    // Use pagination from API response
    const pagination = payload?.pagination || {};
    
    console.log('API pagination response:', pagination);
    console.log('Our sent parameters:', { page: currentPage.value, page_size: itemsPerPage.value });
    
    // Use pagination values from API response
    if (typeof pagination.total_items === "number") {
      totalItems.value = pagination.total_items;
    }
    if (typeof pagination.total_pages === "number") {
      totalPages.value = pagination.total_pages;
    }
    
    // DON'T update itemsPerPage from API response - keep user's selection
    // The API should respect our per_page parameter, but if it doesn't,
    // we still want to maintain the user's choice in the UI
    if (typeof pagination.per_page === "number" && pagination.per_page !== itemsPerPage.value) {
      console.warn(`API returned different per_page: ${pagination.per_page}, but keeping user selection: ${itemsPerPage.value}`);
    }
    
    console.log('Final pagination state:', {
      currentPage: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      totalItems: totalItems.value,
      totalPages: totalPages.value,
      fromAPI: pagination
    });

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
    const resp = await ApiService.get(`sites`);
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

  // Fetch cameras for dropdown filter
  const fetchCamerasForFilter = async (siteUid: string) => {
    if (!siteUid) {
      cameras.value = [];
      return;
    }
    loadingCameras.value = true;
    try {    
      console.log('Fetching cameras for site:', siteUid);
      const resp = await ApiService.get(`sites/${siteUid}/cameras`);
      
      console.log('Raw camera API response:', resp);
      
      // Parse response - handle direct array or wrapped response
      let rawCameras: any[] = [];
      if (resp && resp.data) {
        if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
          rawCameras = resp.data.data;
        } else if (Array.isArray(resp.data)) {
          rawCameras = resp.data;
        } else {
          console.warn('Unexpected cameras response format:', resp.data);
          rawCameras = [];
        }
      } else if (Array.isArray(resp)) {
        rawCameras = resp;
      } else {
        console.warn('No data received from cameras API');
        rawCameras = [];
      }
      
      console.log('Raw cameras data:', rawCameras);
      
      // Map all camera data to expected structure, preserving all original fields
      cameras.value = rawCameras.map((camera: any) => ({
        // Map uid to uuid for compatibility with existing code
        uuid: camera.uid || camera.uuid || camera.id,
        name: camera.name || camera.camera_name || `Camera ${camera.uid || camera.id}`,
        site_uuid: camera.site_uid || camera.site_uuid || siteUid,
        status: 'active', // Default status
        
        // Preserve all original API fields
        uid: camera.uid,
        site_uid: camera.site_uid,
        site_name: camera.site_name,
        video_recorder_uid: camera.video_recorder_uid,
        video_recorder_name: camera.video_recorder_name,
        camera_config: camera.camera_config,
        video_recorder: camera.video_recorder,
        model: camera.model,
        public_endpoint_url: camera.public_endpoint_url,
        created_by: camera.created_by
      }));
      
      console.log('Mapped cameras for dropdown:', cameras.value);
      console.log('Camera count:', cameras.value.length);
      
    } catch (error) {
      console.error('Error loading cameras for site', siteUid, ':', error);
      cameras.value = [];
    } finally {
      loadingCameras.value = false;
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
        // Handle both uid (new API) and uuid (legacy) fields
        const id = c.uid || c.uuid || c.camera_uuid || c.id;
        if (id) {
          map[id] = c.name || c.camera_name || c.label || id;
        }
      });

      camerasCache.value[siteUid] = map;
      console.log('Cached cameras for site:', siteUid, map);
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
  debouncedFetchEvents();
};

// Temp filter handlers (no immediate API calls)
const onTempFilterSiteChange = async () => {
  // Reset camera and NVR filter when site changes
  tempSelectedCameraFilter.value = "";
  selectedNvrFilter.value = "";
  
  // Fetch cameras for the selected site immediately for dropdown
  if (tempSelectedSiteFilter.value) {
    await fetchCamerasForFilter(tempSelectedSiteFilter.value);
  } else {
    cameras.value = [];
  }
};

const onTempFilterCameraChange = () => {
  // Just update temp state, no API call
  console.log('onTempFilterCameraChange: Camera filter changed', {
    value: tempSelectedCameraFilter.value,
    type: typeof tempSelectedCameraFilter.value,
    isUndefined: tempSelectedCameraFilter.value === undefined,
    isNull: tempSelectedCameraFilter.value === null,
    isEmpty: tempSelectedCameraFilter.value === '',
    stringValue: String(tempSelectedCameraFilter.value)
  });
  
  // Also log available cameras for debugging
  console.log('Available cameras for selection:', cameras.value.map(c => ({ 
    uuid: c.uuid, 
    uid: c.uid, 
    name: c.name,
    site_uid: c.site_uid,
    site_name: c.site_name,
    model: c.model,
    video_recorder_name: c.video_recorder_name
  })));
  
  // Save temp camera selection for persistence (backup method)
  if (tempSelectedCameraFilter.value && tempSelectedCameraFilter.value !== '' && tempSelectedCameraFilter.value !== 'undefined') {
    localStorage.setItem('lastTempSelectedCamera', tempSelectedCameraFilter.value);
    console.log('Saved temp camera to localStorage:', tempSelectedCameraFilter.value);
  }
};

const onFilterNvrChange = () => {
  // For now, NVR changes still immediate (can be converted to temp later if needed)
  currentPage.value = 1;
  debouncedFetchEvents();
};

// Apply all filters at once
const applyFilters = async () => {
  console.log('applyFilters: Applying filters', {
    tempSite: tempSelectedSiteFilter.value,
    tempCamera: tempSelectedCameraFilter.value,
    tempDateFrom: tempDateFrom.value,
    tempDateTo: tempDateTo.value
  });
  
  // Update actual filter values from temp values
  selectedSiteFilter.value = tempSelectedSiteFilter.value || '';
  selectedCameraFilter.value = tempSelectedCameraFilter.value || '';
  dateFrom.value = tempDateFrom.value;
  dateTo.value = tempDateTo.value;
  
  console.log('applyFilters: Updated actual filters', {
    actualSite: selectedSiteFilter.value,
    actualCamera: selectedCameraFilter.value,
    actualDateFrom: dateFrom.value,
    actualDateTo: dateTo.value
  });
  
  // Update current site
  currentSite.value = sites.value.find(s => s.uid === selectedSiteFilter.value) || null;
  
  // Save to localStorage
  localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || '');
  const cameraToSave = selectedCameraFilter.value && selectedCameraFilter.value !== 'undefined' && selectedCameraFilter.value !== 'null' ? selectedCameraFilter.value : '';
  localStorage.setItem('lastSelectedCamera', cameraToSave);
  console.log('applyFilters: Saved to localStorage', {
    savedSite: selectedSiteFilter.value || '',
    savedCamera: cameraToSave,
    selectedCameraDetails: cameras.value.find(c => c.uuid === selectedCameraFilter.value),
    availableCameraCount: cameras.value.length
  });
  
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
  tempSelectedSiteFilter.value = selectedSiteFilter.value || '';
  tempSelectedCameraFilter.value = selectedCameraFilter.value || '';
  tempDateFrom.value = dateFrom.value;
  tempDateTo.value = dateTo.value;
};

// Reset filters to default values (clear site/camera, reset dates to 1 month range)
const resetToDefaults = () => {
  // Reset site and camera filters
  tempSelectedSiteFilter.value = '';
  tempSelectedCameraFilter.value = '';
  
  // Reset dates to default range (1 month ago to today)
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const defaultFromDate = formatDate(oneMonthAgo);
  const defaultToDate = formatDate(today);
  
  tempDateFrom.value = defaultFromDate;
  tempDateTo.value = defaultToDate;
  
  // Update localStorage with new defaults
  localStorage.setItem('eventsDefaultFromDate', defaultFromDate);
  localStorage.setItem('eventsDefaultToDate', defaultToDate);
  
  console.log('Events.vue: Reset to defaults', {
    tempFromDate: tempDateFrom.value,
    tempToDate: tempDateTo.value
  });
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

// const typeKeyMap: Record<string, string> = {
//   motion: 'motion',
//   intrusion: 'intrusion',
//   system: 'system',
//   cameraoffline: 'cameraOffline',
// };

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
  return key ? t(`appsEventsAlerts.eventsTable.status.${key}`) : status;
};

const getSeverityLabel = (severity: string) => {
  const key = severityKeyMap[normalizeKey(severity)];
  return key ? t(`appsEventsAlerts.eventsTable.severity.${key}`) : severity;
};

// const getEventTypeLabel = (type: string) => {
//   const key = typeKeyMap[normalizeKey(type)];
//   return key ? t(`appsEventsAlerts.eventsTable.types.${key}`) : type;
// };

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
      const camera = (event.camera_name || '').toLowerCase();
      // const type = (event.type || '').toLowerCase();
      const status = (event.status || '').toLowerCase();
      const severity = (event.severity || '').toLowerCase();
      // const translatedType = getEventTypeLabel(event.type).toLowerCase();

      return (
        camera.includes(query) ||
        // type.includes(query) ||
        status.includes(query) ||
        severity.includes(query)
        // translatedType.includes(query)
      );
    });
  }

  // if (selectedEventType.value) {
  //   filtered = filtered.filter((event) => event.type === selectedEventType.value);
  // }

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

  // Don't recalculate pagination here - use server-side pagination values
  // Just return filtered/sorted events without slicing
  return filtered;
});

// Statistics computed properties
// const activeAlerts = computed(() => events.value.filter(e => e.status === 'active').length);
// const criticalAlerts = computed(() => events.value.filter(e => e.severity === 'critical' && e.status === 'active').length);
// const motionEvents = computed(() => events.value.filter(e => e.type === 'motion').length);
// const resolvedToday = computed(() => {
//   const today = new Date().toDateString();
//   return events.value.filter(e => 
//     e.status === 'resolved' && 
//     new Date(e.timestamp).toDateString() === today
//   ).length;
// });
// const totalResolved = computed(() => events.value.filter(e => e.status === 'resolved').length);
// const avgResponseTime = computed(() => 15); // Mock data

// const criticalAlertsPercentage = computed(() =>
//   activeAlerts.value > 0 ? Math.round((criticalAlerts.value / activeAlerts.value) * 100) : 0
// );

// const resolvedTodayPercentage = computed(() =>
//   totalResolved.value > 0 ? Math.round((resolvedToday.value / totalResolved.value) * 100) : 0
// );

// const responseTimePercentage = computed(() => 75); // Mock data

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

const viewEventDetails = (event: Event) => {
  selectedEvent.value = event;
  showDetailModal.value = true;
};



const closeModal = () => {
  showDetailModal.value = false;
  selectedEvent.value = null;
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
    hour12: false,
  }).format(date);
};

const handleImageError = (event: any) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMzUgNzVIMTY1VjEyNUgxMzVWNzVaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMjAgMTA1TDE0MCA5MEwxNjAgMTEwTDE4MCA5MEwyMDAgMTEwVjEzNUgxMDBWMTEwTDEyMCAxMDVaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjE0cHgiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
  event.target.alt = t('appsEventsAlerts.eventsModals.details.imageFallback');
};

// const acknowledgeEvent = async (event: Event) => {
//   try {
//     // TODO: API call to acknowledge event
//     // await ApiService.post(`events/${event.uid}/acknowledge`);
    
//     // Update local state
//     const index = events.value.findIndex(e => e.uid === event.event_id);
//     if (index !== -1) {
//       events.value[index].status = 'acknowledged';
//     }
//   } catch (error) {
//     console.error("Error acknowledging event:", error);
//   }
// };

// const resolveEvent = async (event: Event) => {
//   try {
//     // TODO: API call to resolve event
//     // await ApiService.post(`events/${event.uid}/resolve`);
    
//     // Update local state
//     const index = events.value.findIndex(e => e.uid === event.event_id);
//     if (index !== -1) {
//       events.value[index].status = 'resolved';
//     }
//   } catch (error) {
//     console.error("Error resolving event:", error);
//   }
// };

// Initialize data on component mount
onMounted(async () => {
  console.log('Events.vue: Component mounted');
  
  // Initialize default dates first
  initializeDefaultDates();
  
  // Then load sites
  await fetchSites();
  
  // Initialize selected site filter from localStorage (but don't auto-select first site)
  const storedSite = localStorage.getItem('lastSelectedSite');
    if (storedSite && sites.value.some(s => s.uid === storedSite)) {
      selectedSiteFilter.value = storedSite;
      tempSelectedSiteFilter.value = storedSite;
      
      // Initialize selected camera filter from localStorage with backup recovery
      const storedCamera = localStorage.getItem('lastSelectedCamera');
      const backupCamera = localStorage.getItem('lastTempSelectedCamera');
      
      let cameraToUse = '';
      if (storedCamera && storedCamera !== 'null' && storedCamera !== 'undefined') {
        cameraToUse = storedCamera;
      } else if (backupCamera && backupCamera !== 'null' && backupCamera !== 'undefined') {
        cameraToUse = backupCamera;
        console.log('Events.vue: Using backup camera from localStorage:', backupCamera);
      }
      
      selectedCameraFilter.value = cameraToUse;
      tempSelectedCameraFilter.value = cameraToUse;
      
      console.log('Events.vue: Initialized filters from localStorage', {
        selectedSite: selectedSiteFilter.value,
        selectedCamera: selectedCameraFilter.value,
        tempSite: tempSelectedSiteFilter.value,
        tempCamera: tempSelectedCameraFilter.value,
        storedCameraRaw: storedCamera,
        backupCameraRaw: backupCamera,
        finalCameraUsed: cameraToUse
      });
      
      console.log('Events.vue: Site and camera filters initialized from localStorage');
      
      // Load cameras for the valid stored site
      await fetchCamerasForFilter(selectedSiteFilter.value);
      
      // Only fetch events after sites and cameras are loaded and default dates are set
      // Wait a bit for DatePicker components to initialize with default values
      setTimeout(() => {
        console.log('Events.vue: Initial fetch after DatePicker initialization');
        fetchEvents();
      }, 200);
  } else {
    // Clear localStorage if stored site doesn't exist
    localStorage.removeItem('lastSelectedSite');
    localStorage.removeItem('lastSelectedCamera');
    selectedSiteFilter.value = '';
    selectedCameraFilter.value = '';
    tempSelectedSiteFilter.value = '';
    tempSelectedCameraFilter.value = '';
    
    console.log('Events.vue: Cleared filters, initialized to empty strings', {
      selectedSite: selectedSiteFilter.value,
      selectedCamera: selectedCameraFilter.value,
      tempSite: tempSelectedSiteFilter.value,
      tempCamera: tempSelectedCameraFilter.value,
      dateFromValue: dateFrom.value,
      dateToValue: dateTo.value,
      tempDateFromValue: tempDateFrom.value,
      tempDateToValue: tempDateTo.value
    });
    
    console.log('Events.vue: No valid stored site, default dates are set, waiting for user site selection');
  }
  
  // Add event listener for manual modal backdrop click
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement)?.id === 'eventDetailsModalBackdrop') {
      closeModal();
    }
  });
});

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
});
</script>