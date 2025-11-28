<template>
  <!--begin::Alerts Overview-->
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
          <div class="d-flex justify-content-end align-items-center">
            <!-- Site Filter -->
            <div class="d-flex align-items-center">
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
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--begin::Alerts List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t('appsEventsAlerts.alerts.title') }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar d-flex justify-content-between align-items-center w-100">
        <!-- Date Range Filters - Start -->
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{ t('appsEventsAlerts.alertsFilters.fromDateLabel') }}</label>
            <DatePicker
              v-model="dateFrom"
              size="sm"
              :clearable="true"
            />
          </div>
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{ t('appsEventsAlerts.alertsFilters.toDateLabel') }}</label>
            <DatePicker
              v-model="dateTo"
              size="sm"
              :clearable="true"
            />
          </div>
          <!-- Apply Date Filter Button -->
          <div class="me-3">
            <button 
              @click="applyDateFilter" 
              class="btn btn-sm btn-primary py-1 px-2"
              :disabled="!dateFrom && !dateTo"
              title="Apply Date Filter"
            >
              <i class="ki-duotone ki-check fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Apply Filter
            </button>
          </div>
        </div>
        
        <!-- Other Filters - End -->
        <div class="d-flex align-items-center">
          <!-- Severity Filter -->
          <div class="me-3">
            <select
              v-model="selectedSeverityType"
              @change="filterAlerts"
              class="form-select form-select-sm form-select-solid w-150px"
            >
              <option value="">{{ t('appsEventsAlerts.alertsFilters.severityAll') }}</option>
              <option value="low">{{ t('appsEventsAlerts.alertsTable.severity.low') }}</option>
              <option value="medium">{{ t('appsEventsAlerts.alertsTable.severity.medium') }}</option>
              <option value="high">{{ t('appsEventsAlerts.alertsTable.severity.high') }}</option>
              <option value="critical">{{ t('appsEventsAlerts.alertsTable.severity.critical') }}</option>
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

          <button @click="refreshAlerts" class="btn btn-sm btn-light-primary btn-icon" title="Refresh">
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
      <KTDataTable
        :data="alerts"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="pagination.per_page"
        :current-page="pagination.page"
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
            <span class="text-muted fw-semibold d-block fs-7">{{ row.description }}</span>
          </div>
        </template>

        <template v-slot:severity="{ row }">
          <span class="badge" :class="getSeverityBadgeClass(row.severity)">
            {{ getSeverityLabel(row.severity) }}
          </span>
        </template>

        <template v-slot:camera_name="{ row }">
          <div class="d-flex align-items-center" style="max-width: 200px; min-width: 180px;">
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold fs-6" style="word-break: break-all;">{{ row.camera_name }}</span>
              <span class="text-muted fw-semibold d-block fs-7">{{ row.location || t('appsEventsAlerts.alertsTable.noLocation') }}</span>
            </div>
          </div>
        </template>

        <template v-slot:startTime="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            row.startTime ? new Date(row.startTime).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-'
          }}</span>
          <span class="text-muted fw-semibold d-block fs-7">
            {{ row.startTime ? new Date(row.startTime).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false }).substring(0, 5) : '-' }}
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

        <template v-slot:actions>
          <span class="text-muted">-</span>
        </template>
      </KTDataTable>
      
      <!--begin::Pagination-->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <ItemPerPage
          v-model="pagination.per_page"
          :label="t('appsEventsAlerts.alertsTable.pagination.itemsLabel') || 'Items per page:'"
          :options="[5, 10, 15, 25, 50]"
          @change="changeItemsPerPage"
        />
        <Pagination
          :page="pagination.page"
          :per-page="pagination.per_page"
          :total-items="pagination.total_items"
          :total-pages="Math.max(1, pagination.total_pages)"
          @page-change="goToPage"
        />
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Alerts List-->

  <!-- Modal removed per request -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ItemPerPage from '@/components/ItemPerPage.vue';
import DatePicker from '@/components/DatePicker.vue';
import ApiService from "@/core/services/ApiService";

const { t } = useI18n();

// Interface definitions
interface Alert {
  name: string;
  activities: any[];
  // Additional fields for display purposes
  uid?: string;
  event_name?: string;
  camera_name?: string;
  severity?: string;
  status?: string;
  startTime?: string;
  location?: string;
  description?: string;
}

interface Site {
  uid: string;
  name: string;
}

// Reactive data
const alerts = ref<Alert[]>([]);
const sites = ref<Site[]>([]);
const loading = ref(false);
const loadingSites = ref(false);
const searchQuery = ref("");
// Header filter state (site)
const selectedSiteFilter = ref<string>("");
const selectedEventType = ref("");
const selectedSeverityType = ref("");
// Date range filters
const dateFrom = ref<string | null>(null);
const dateTo = ref<string | null>(null);
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
// Modal interactions removed per request

// Pagination handlers - simplified like Camera.vue
const goToPage = (page: number) => {
  pagination.value.page = page;
  void fetchAlerts();
};

const changeItemsPerPage = () => {
  pagination.value.page = 1;
  void fetchAlerts();
};

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.alert'),
    columnLabel: 'alert_name',
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

// Fetch sites from API using team-based approach like Camera.vue
const fetchSites = async () => {
  try {
    const resp = await ApiService.get(`sites`);
    
    // Parse response (wrapped or direct)
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
    console.error('Error loading sites:', error);
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
    const params: any = {};
    
    // Add date range filters if set
    if (dateFrom.value) {
      params.from_date = dateFrom.value;
    }
    if (dateTo.value) {
      params.to_date = dateTo.value;
    }
    
    const resp = await ApiService.query(`sites/${selectedSiteFilter.value}/alerts`, {
      params: Object.keys(params).length > 0 ? params : undefined
    });
    
    if (resp && resp.data) {
      const payload = resp.data;
      
      // Handle the simple response structure: { results: [...], pagination: {...} }
      if (Array.isArray(payload.results)) {
        alerts.value = payload.results.map((item: any) => ({
          name: item.name || 'Alert',
          activities: Array.isArray(item.activities) ? item.activities : [],
        }));
        
        // Update pagination from API response
        if (payload.pagination) {
          const p = payload.pagination;
          pagination.value = {
            page: p.page || 1,
            per_page: p.per_page || 10,
            total_pages: p.total_pages || 1,
            total_items: p.total_items || alerts.value.length,
            next_page: p.next_page || null,
            prev_page: p.prev_page || null,
          };
        }
      } else {
        alerts.value = [];
      }
    } else {
      alerts.value = [];
    }
  } catch (error) {
    console.error('Error loading alerts:', error);
    alerts.value = [];
  } finally {
    loading.value = false;
  }
};

// Switch site
// Filter events
const filterAlerts = () => {
  // Filtering is handled in computed property
};

// Refresh alerts
const refreshAlerts = () => {
  void fetchAlerts();
};

// Header filter handlers - simplified like Camera.vue
const onFilterSiteChange = () => {
  currentSite.value = sites.value.find(s => s.uid === selectedSiteFilter.value) || null;
  pagination.value.page = 1;
  localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || '');
  if (selectedSiteFilter.value) {
    void fetchAlerts();
  } else {
    alerts.value = [];
  }
};

const applyDateFilter = () => {
  // Reset to first page when applying date filter
  pagination.value.page = 1;
  void fetchAlerts();
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

const getAlertTypeBadgeClass = (type: string) => {
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

const getAlertTypeLabel = (type: string) => {
  const key = typeKeyMap[normalizeKey(type)];
  return key ? t(`appsEventsAlerts.alertsTable.types.${key}`) : type;
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


// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

// Initialize data on component mount - following Camera.vue pattern
onMounted(async () => {
  try {
    await fetchSites();
    
    // Initialize selected site filter from localStorage like Camera.vue
    selectedSiteFilter.value = localStorage.getItem('lastSelectedSite') || (sites.value[0] && sites.value[0].uid) || '';
    localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || '');
    
    // Load alerts for the selected site
    if (selectedSiteFilter.value) {
      await fetchAlerts();
    }
  } catch (error) {
    console.error('Error initializing alerts:', error);
  }
});
</script>