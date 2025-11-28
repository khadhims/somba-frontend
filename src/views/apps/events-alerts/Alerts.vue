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
            <div class="d-flex align-items-center me-3">
              <label class="form-label me-3 mb-0 fw-semibold">{{ t('appsEventsAlerts.alertsFilters.siteLabel') }}</label>
              <select
                v-model="tempSelectedSiteFilter"
                class="form-select form-select-solid w-200px"
                :disabled="loadingSites"
                @change="onTempFilterSiteChange"
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
            
            <!-- Camera Filter -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">{{ t('appsEventsAlerts.alertsFilters.cameraLabel') || 'Camera' }}</label>
              <select
                v-model="tempSelectedCameraFilter"
                class="form-select form-select-solid w-200px"
                :disabled="loadingCameras || !tempSelectedSiteFilter"
                @change="onTempFilterCameraChange"
              >
                <option value="">{{ t('appsEventsAlerts.alertsFilters.cameraAll') || 'All Cameras' }}</option>
                <option
                  v-for="camera in cameras"
                  :key="camera.uuid"
                  :value="camera.uuid"
                >
                  {{ camera.name }}
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
              v-model="tempDateFrom"
              size="sm"
              :clearable="true"
              defaultType="monthAgo"
              style="width: 180px;"
            />
          </div>
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-2 mb-0 text-nowrap fw-semibold">{{ t('appsEventsAlerts.alertsFilters.toDateLabel') }}</label>
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
      <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
        <KTDataTable
        :data="alerts"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="pagination.per_page"
        :current-page="pagination.page"
        :total="pagination.total_items"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        :empty-table-text="t('appsEventsAlerts.alertsTable.empty')"
      >
        <template v-slot:alert_name="{ row }">
          <div style="max-width: 200px; min-width: 180px;">
            <span class="text-dark fw-bold text-hover-primary fs-6" style="word-break: break-all;">
              {{ row.name }}
            </span>
          </div>
        </template>

        <template v-slot:severity="{ row }">
          <span class="badge" :class="getSeverityBadgeClass(row.severity)">
            {{ getSeverityLabel(row.severity) }}
          </span>
        </template>

        <template v-slot:activities="{ row }">
          <div class="d-flex align-items-center" style="max-width: 200px; min-width: 180px;">
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold fs-6" style="word-break: break-all;">{{ row.activities }}</span>
            </div>
          </div>
        </template>

        <template v-slot:timestamp="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            row.timestamp && row.timestamp !== 'Unknown Timestamp' ? new Date(row.timestamp).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }) : row.timestamp || '-'
          }}</span>
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
          <button 
            @click="viewAlertDetail(row)"
            class="btn btn-sm btn-light-primary btn-icon"
            title="View Detail"
            :disabled="loadingDetail"
          >
            <i class="ki-duotone ki-eye fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </button>
        </template>
        </KTDataTable>
      </div>
      
      <!--begin::Pagination-->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <ItemPerPage
          :model-value="pagination.per_page"
          :label="t('appsEventsAlerts.alertsTable.pagination.itemsLabel') || 'Items per page:'"
          :options="[10, 20, 30, 50]"
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

  <!-- Alert Detail Modal -->
  <div 
    v-if="showDetailModal" 
    class="modal fade show" 
    style="display: block; background-color: rgba(0,0,0,0.5);"
    @click.self="closeDetailModal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ t('appsEventsAlerts.alertDetail.title') || 'Alert Detail' }}</h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeDetailModal"
            aria-label="Close"
          ></button>
        </div>
        
        <div class="modal-body">
          <div v-if="loadingDetail" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="selectedAlertDetail" class="row">
            <!-- Basic Information -->
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">{{ t('appsEventsAlerts.alertDetail.basicInfo') || 'Basic Information' }}</h6>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.eventId') || 'Event ID' }}:</label>
                <p class="mb-0">{{ selectedAlertDetail.event_id || '-' }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.cameraName') || 'Camera Name' }}:</label>
                <p class="mb-0">{{ selectedAlertDetail.camera_name || '-' }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.status') || 'Status' }}:</label>
                <div v-if="!editMode">
                  <span class="badge ms-2" :class="getStatusBadgeClass(selectedAlertDetail.status)">
                    {{ getStatusLabel(selectedAlertDetail.status) }}
                  </span>
                </div>
                <div v-else>
                  <select v-model="editForm.status" class="form-select form-select-sm mt-2">
                    <option value="">{{ t('appsEventsAlerts.alertsFilters.selectStatus') || 'Select Status' }}</option>
                    <option value="active">{{ t('appsEventsAlerts.alertsTable.status.active') || 'Active' }}</option>
                    <option value="acknowledged">{{ t('appsEventsAlerts.alertsTable.status.acknowledged') || 'Acknowledged' }}</option>
                    <option value="resolved">{{ t('appsEventsAlerts.alertsTable.status.resolved') || 'Resolved' }}</option>
                    <option value="unresolved">{{ t('appsEventsAlerts.alertsTable.status.unresolved') || 'Unresolved' }}</option>
                    <option value="falsedetection">{{ t('appsEventsAlerts.alertsTable.status.falseDetection') || 'False Detection' }}</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.duration') || 'Duration' }}:</label>
                <p class="mb-0">{{ formatDuration(selectedAlertDetail.duration_minutes) }}</p>
              </div>
            </div>
            
            <!-- Event Details -->
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">{{ t('appsEventsAlerts.alertDetail.eventDetails') || 'Event Details' }}</h6>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.eventStart') || 'Event Start' }}:</label>
                <p class="mb-0">{{ 
                  selectedAlertDetail.event_start ? 
                    new Date(selectedAlertDetail.event_start).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 
                    '-' 
                }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.eventEnd') || 'Event End' }}:</label>
                <p class="mb-0">{{ 
                  selectedAlertDetail.event_end ? 
                    new Date(selectedAlertDetail.event_end).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 
                    '-' 
                }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">{{ t('appsEventsAlerts.alertDetail.totalDetections') || 'Total Detections' }}:</label>
                <p class="mb-0">{{ selectedAlertDetail.total_detections || 0 }}</p>
              </div>
            </div>
            
            <!-- Detected Objects -->
            <div class="col-12 mt-4" v-if="selectedAlertDetail.detected_objects && selectedAlertDetail.detected_objects.length > 0">
              <h6 class="fw-bold mb-3">{{ t('appsEventsAlerts.alertDetail.detectedObjects') || 'Detected Objects' }}</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>{{ t('appsEventsAlerts.alertDetail.objectType') || 'Object Type' }}</th>
                      <th>{{ t('appsEventsAlerts.alertDetail.detectionCount') || 'Detection Count' }}</th>
                      <th>{{ t('appsEventsAlerts.alertDetail.duration') || 'Duration (seconds)' }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(obj, index) in selectedAlertDetail.detected_objects" :key="index">
                      <td>{{ obj.object_type || '-' }}</td>
                      <td>{{ obj.detection_count || 0 }}</td>
                      <td>{{ formatSecondsShort(obj.duration_seconds) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Activities -->
            <div class="col-12 mt-4" v-if="selectedAlertDetail.activities && selectedAlertDetail.activities.length > 0">
              <h6 class="fw-bold mb-3">{{ t('appsEventsAlerts.alertDetail.activities') || 'Activities' }}</h6>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="(activity, index) in selectedAlertDetail.activities" :key="index" class="badge badge-light-primary">
                  {{ activity }}
                </span>
              </div>
            </div>
            
            <!-- Comment -->
            <div class="col-12 mt-4">
              <h6 class="fw-bold mb-3">{{ t('appsEventsAlerts.alertDetail.comment') || 'Comment' }}</h6>
              <div v-if="!editMode">
                <div v-if="selectedAlertDetail.comment" class="p-3 bg-light rounded">
                  <p class="mb-0">{{ selectedAlertDetail.comment }}</p>
                </div>
                <div v-else class="text-muted fst-italic">
                  {{ t('appsEventsAlerts.alertDetail.noComment') || 'No comment available' }}
                </div>
              </div>
              <div v-else>
                <textarea 
                  v-model="editForm.comment" 
                  class="form-control" 
                  rows="3" 
                  :placeholder="t('appsEventsAlerts.alertDetail.commentPlaceholder') || 'Enter comment...'"
                ></textarea>
              </div>
            </div>
            
            <!-- Images -->
            <div class="col-12 mt-4" v-if="selectedAlertDetail.image_url || (selectedAlertDetail.image_urls && selectedAlertDetail.image_urls.length > 0)">
              <h6 class="fw-bold mb-3">{{ t('appsEventsAlerts.alertDetail.images') || 'Images' }}</h6>
              <div class="row">
                <div class="col-md-4 mb-3" v-if="selectedAlertDetail.image_url">
                  <img 
                    :src="selectedAlertDetail.image_url" 
                    class="img-fluid rounded" 
                    alt="Alert Image"
                    style="max-height: 200px; object-fit: cover;"
                  />
                </div>
                <div 
                  class="col-md-4 mb-3" 
                  v-for="(imageUrl, index) in selectedAlertDetail.image_urls" 
                  :key="index"
                >
                  <img 
                    :src="imageUrl" 
                    class="img-fluid rounded" 
                    alt="Alert Image"
                    style="max-height: 200px; object-fit: cover;"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-5">
            <p class="text-muted">{{ t('appsEventsAlerts.alertDetail.noData') || 'No alert detail available' }}</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <div v-if="!editMode" class="d-flex gap-2">
            <button type="button" class="btn btn-secondary" @click="closeDetailModal">
              {{ t('common.close') || 'Close' }}
            </button>
            <button type="button" class="btn btn-primary" @click="enableEditMode">
              <i class="ki-duotone ki-pencil fs-2 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('common.edit') || 'Edit' }}
            </button>
          </div>
          <div v-else class="d-flex gap-2">
            <button type="button" class="btn btn-secondary" @click="cancelEdit">
              {{ t('common.cancel') || 'Cancel' }}
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="updateAlert"
              :disabled="loadingUpdate"
            >
              <span v-if="loadingUpdate" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="ki-duotone ki-check fs-2 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('common.update') || 'Update' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ItemPerPage from '@/components/ItemPerPage.vue';
import DatePicker from '@/components/DatePicker.vue';
import ApiService from "@/core/services/ApiService";
import { duration } from "moment";

const { t } = useI18n();

type detectedObjects = {
  object_type: string;
  duration_seconds: number;
  duration_minutes: number;
}

// Interface definitions
interface Alert {
  event_id: string;
  camera_uuid: string;
  camera_name: string;
  event_start: string;
  event_end: string;
  timestamp: string;
  duration_minutes: number;
  total_detections: number;
  detected_objects: detectedObjects[];
  status: string;
  comments: string;
  image_url: string;
  image_urls: string[];
  activities: any[];
}

interface AlertDetail {
  event_id: string;
  camera_uuid: string;
  camera_name: string;
  event_start: string;
  event_end: string;
  duration_minutes: number;
  total_detections: number;
  detected_objects: {
    object_type: string;
    duration_seconds: number;
    detection_count: number;
  }[];
  status: string;
  comment: string;
  image_url: string;
  image_urls: string[];
  activities: any[];
}

interface Site {
  uid: string;
  name: string;
}

interface Camera {
  uuid: string;
  name: string;
  site_uuid: string;
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
const loadingUpdate = ref(false);
const editMode = ref(false);
// Form state for editing
const editForm = ref({
  status: '',
  comment: ''
});

// Pagination handlers - simplified like Camera.vue
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
  const storedFromDate = localStorage.getItem('alertsDefaultFromDate');
  const storedToDate = localStorage.getItem('alertsDefaultToDate');
  
  if (!storedFromDate || !storedToDate) {
    // Store default dates in localStorage
    localStorage.setItem('alertsDefaultFromDate', defaultFromDate);
    localStorage.setItem('alertsDefaultToDate', defaultToDate);
    console.log('Alerts.vue: Set default dates in localStorage:', { defaultFromDate, defaultToDate });
  }
  
  // Set reactive date values from localStorage
  const fromDate = localStorage.getItem('alertsDefaultFromDate') || defaultFromDate;
  const toDate = localStorage.getItem('alertsDefaultToDate') || defaultToDate;
  
  dateFrom.value = fromDate;
  dateTo.value = toDate;
  tempDateFrom.value = fromDate;
  tempDateTo.value = toDate;
  
  console.log('Alerts.vue: Initialized default dates:', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    tempDateFrom: tempDateFrom.value,
    tempDateTo: tempDateTo.value
  });
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
  console.log('Alerts changeItemsPerPage called with:', newPerPage);
  console.log('Current per_page value before change:', pagination.value.per_page);
  
  // Force update the reactive value
  pagination.value.per_page = newPerPage;
  
  console.log('per_page value after change:', pagination.value.per_page);
  console.log('Will send to API: page_size =', pagination.value.per_page);
  
  // Reset to first page
  pagination.value.page = 1;
  
  // Fetch immediately without debounce for items per page change
  fetchAlerts();
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
    columnName: t('appsEventsAlerts.alertsTable.columns.activities'),
    columnLabel: 'activities',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsEventsAlerts.alertsTable.columns.timestamp'),
    columnLabel: 'timestamp',
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

// Fetch cameras from API based on selected site
const fetchCameras = async (siteUid: string) => {
  if (!siteUid) {
    cameras.value = [];
    return;
  }

  loadingCameras.value = true;
  try {
    const resp = await ApiService.get(`sites/${siteUid}/cameras`);
    
    // Parse response (wrapped or direct)
    if (resp && resp.data) {
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        cameras.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        cameras.value = resp.data;
      } else {
        console.warn('Unexpected cameras response format:', resp.data);
        cameras.value = [];
      }
    } else {
      console.warn('No data received from cameras API');
      cameras.value = [];
    }
  } catch (error) {
    console.error('Error loading cameras:', error);
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
    const params: any = {
      page: pagination.value.page,
      page_size: pagination.value.per_page
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
    
    const resp = await ApiService.query(`sites/${selectedSiteFilter.value}/alerts`, {
      params: Object.keys(params).length > 0 ? params : undefined
    });
    
    if (resp && resp.data) {
      const payload = resp.data;
      
      // Handle the response structure: { data: [...], pagination: {...} }
      if (Array.isArray(payload.data)) {
        alerts.value = payload.data.map((item: any) => ({
          event_id: item.event_id || `alert-${Date.now()}-${Math.random()}`, // Generate ID if not provided
          name: item.name || 'Unnamed Alert',
          activities: (Array.isArray(item.activities) && item.activities.length > 0) ? item.activities : "No activities",
          timestamp: item.timestamp || 'Unknown Timestamp',
          status: item.status ?? 'No Status',
          severity: item.severity ?? 'Unknown Severity',
        }));
        
        // Update pagination from API response
        if (payload.pagination) {
          const p = payload.pagination;
          
          console.log('Alerts API pagination response:', p);
          console.log('Our sent parameters:', { page: pagination.value.page, page_size: pagination.value.per_page });
          
          pagination.value.page = p.page || 1;
          pagination.value.total_items = p.total_items || alerts.value.length;
          pagination.value.next_page = p.next_page || null;
          pagination.value.prev_page = p.prev_page || null;
          
          // DON'T update per_page from API response - keep user's selection
          if (typeof p.per_page === "number" && p.per_page !== pagination.value.per_page) {
            console.warn(`API returned different per_page: ${p.per_page}, but keeping user selection: ${pagination.value.per_page}`);
          }
          
          // Use API total_pages if available, otherwise calculate
          if (typeof p.total_pages === "number") {
            pagination.value.total_pages = p.total_pages;
          } else {
            pagination.value.total_pages = Math.ceil(pagination.value.total_items / pagination.value.per_page);
          }
          
          console.log('Alerts pagination calculated:', {
            page: pagination.value.page,
            per_page: pagination.value.per_page,
            total_items: pagination.value.total_items,
            total_pages: pagination.value.total_pages,
            apiTotalPages: p.total_pages
          });
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

const fetchAlertsByEvents = async (eventId: string) => {
  loadingDetail.value = true;
  try {
    const resp = await ApiService.get(`sites/alerts/${eventId}`);
    
    if (resp && resp.data) {
      // Response langsung berupa object detail alert
      selectedAlertDetail.value = resp.data;
      showDetailModal.value = true;
    } else {
      console.error('No alert detail data received');
      selectedAlertDetail.value = null;
    }
  } catch (error) {
    console.error('Error loading alert detail:', error);
    selectedAlertDetail.value = null;
  } finally {
    loadingDetail.value = false;
  }
};

// Filter alerts
const filterAlerts = () => {
  // Filtering is handled in computed property
};

const applyDateFilter = () => {
  // Reset to first page when applying date filter
  pagination.value.page = 1;
  debouncedFetchAlerts();
};

// Refresh alerts
const refreshAlerts = () => {
  debouncedFetchAlerts();
};

// Temp filter handlers (no immediate API calls)
const onTempFilterSiteChange = async () => {
  // Reset camera filter when site changes
  tempSelectedCameraFilter.value = '';
  
  // Fetch cameras for the selected site immediately for dropdown
  if (tempSelectedSiteFilter.value) {
    await fetchCameras(tempSelectedSiteFilter.value);
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
  localStorage.setItem('lastSelectedCamera', selectedCameraFilter.value || '');
  
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
  localStorage.setItem('alertsDefaultFromDate', defaultFromDate);
  localStorage.setItem('alertsDefaultToDate', defaultToDate);
  
  console.log('Alerts.vue: Reset to defaults', {
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
  if (!status || status === 'No Status') return 'badge-light-secondary';
  return 'badge-light-secondary'; // Default return
};

const getStatusLabel = (status: string) => {
  // Handle fallback values directly
  if (!status || status === 'No Status') {
    return status || 'No Status';
  }
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

const viewAlertDetail = (alert: any) => {
  if (alert.event_id) {
    fetchAlertsByEvents(alert.event_id);
  } else {
    console.warn('No event_id found in alert:', alert);
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedAlertDetail.value = null;
  editMode.value = false;
  editForm.value = { status: '', comment: '' };
};

const enableEditMode = () => {
  editMode.value = true;
  // Initialize form with current values
  if (selectedAlertDetail.value) {
    editForm.value.status = selectedAlertDetail.value.status || '';
    editForm.value.comment = selectedAlertDetail.value.comment || '';
  }
};

const cancelEdit = () => {
  editMode.value = false;
  editForm.value = { status: '', comment: '' };
};

const updateAlert = async () => {
  if (!selectedAlertDetail.value?.event_id) {
    console.error('No event ID found for update');
    return;
  }

  loadingUpdate.value = true;
  try {
    const response = await ApiService.post(`sites/alerts/${selectedAlertDetail.value.event_id}/update`, {
      status: editForm.value.status,
      comment: editForm.value.comment
    });

    if (response && response.data) {
      // Update the selected alert detail with new values
      selectedAlertDetail.value.status = editForm.value.status;
      selectedAlertDetail.value.comment = editForm.value.comment;
      
      // Exit edit mode
      editMode.value = false;
      
      // Refresh the alerts list to show updated data
      await fetchAlerts();
      
      console.log('Alert updated successfully');
    }
  } catch (error) {
    console.error('Error updating alert:', error);
    // You might want to show an error message to the user here
  } finally {
    loadingUpdate.value = false;
  }
};

// Initialize data on component mount - following Camera.vue pattern
onMounted(async () => {
  try {
    // Initialize default dates first
    initializeDefaultDates();
    
    await fetchSites();
    
    // Initialize selected site filter from localStorage (but don't auto-select first site)
    const storedSite = localStorage.getItem('lastSelectedSite');
    if (storedSite && sites.value.some(s => s.uid === storedSite)) {
      selectedSiteFilter.value = storedSite;
      tempSelectedSiteFilter.value = storedSite;
      localStorage.setItem('lastSelectedSite', selectedSiteFilter.value);
      
      // Initialize selected camera filter from localStorage
      const storedCamera = localStorage.getItem('lastSelectedCamera');
      selectedCameraFilter.value = storedCamera && storedCamera !== 'null' && storedCamera !== 'undefined' ? storedCamera : '';
      tempSelectedCameraFilter.value = selectedCameraFilter.value;
      
      console.log('Alerts.vue: Initialized filters from localStorage', {
        selectedSite: selectedSiteFilter.value,
        selectedCamera: selectedCameraFilter.value,
        tempSite: tempSelectedSiteFilter.value,
        tempCamera: tempSelectedCameraFilter.value
      });
      
      console.log('Alerts.vue: Site and camera filters initialized from localStorage');
      
      // Load cameras and alerts only if we have a valid stored site
      await fetchCameras(selectedSiteFilter.value);
      await fetchAlerts();
    } else {
      // Clear localStorage if stored site doesn't exist
      localStorage.removeItem('lastSelectedSite');
      localStorage.removeItem('lastSelectedCamera');
      selectedSiteFilter.value = '';
      selectedCameraFilter.value = '';
      tempSelectedSiteFilter.value = '';
      tempSelectedCameraFilter.value = '';
      
      console.log('Alerts.vue: No valid stored site, default dates are set, waiting for user site selection');
    }
  } catch (error) {
    console.error('Error initializing alerts:', error);
  }
});

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout);
  }
});
</script>