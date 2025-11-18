<template>
  <!--begin::Events & Alerts Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Events & Alerts Management</h4>
          <p class="text-muted mb-0">
            Monitor and manage security events {{ currentSite ? `for ${currentSite.name}` : 'across all sites' }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <div class="me-3 d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">Site:</label>
              <select
                v-model="selectedSiteFilter"
                @change="onFilterSiteChange"
                class="form-select form-select-solid w-200px"
              >
                <option value="">All Sites</option>
                <option v-for="site in sites" :key="site.uid" :value="site.uid">
                  {{ site.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'Active Alerts'"
        :value="activeAlerts"
        :progress-text="`${criticalAlerts} Critical`"
        :progress-value="criticalAlertsPercentage"
        bg-color="#F1416C"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Motion Events'"
        :value="motionEvents"
        :progress-text="`Last 24h`"
        :progress-value="100"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Resolved Today'"
        :value="resolvedToday"
        :progress-text="`${totalResolved} Total`"
        :progress-value="resolvedTodayPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Response Time'"
        :value="`${avgResponseTime}m`"
        :progress-text="`Average`"
        :progress-value="responseTimePercentage"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Events List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Recent Events & Alerts</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1 me-5">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-solid w-250px ps-12"
            placeholder="Search events..."
          />
        </div>
        <!--end::Search-->

        <!--begin::Filter-->
        <div class="me-3">
          <select
            v-model="selectedEventType"
            @change="filterEvents"
            class="form-select form-select-solid w-150px"
          >
            <option value="">All Types</option>
            <option value="motion">Motion</option>
            <option value="intrusion">Intrusion</option>
            <option value="system">System</option>
            <option value="camera_offline">Camera Offline</option>
          </select>
        </div>

        <button @click="refreshEvents" class="btn btn-sm btn-light-primary">
          <i class="ki-duotone ki-arrows-circle fs-2"></i>
          Refresh
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

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
        empty-table-text="No events found"
      >
        <template v-slot:type="{ row }">
          <span
            class="badge"
            :class="getEventTypeBadgeClass(row.type)"
          >
            {{ getEventTypeLabel(row.type) }}
          </span>
        </template>

        <template v-slot:severity="{ row }">
          <span
            class="badge"
            :class="getSeverityBadgeClass(row.severity)"
          >
            {{ row.severity }}
          </span>
        </template>

        <template v-slot:description="{ row }">
          <div class="d-flex align-items-center">
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{
                row.description
              }}</span>
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                row.camera_name || row.location
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:timestamp="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            new Date(row.timestamp).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })
          }}</span>
          <span class="text-muted fw-semibold text-muted d-block fs-7">{{
            new Date(row.timestamp).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false })
          }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span
            class="badge"
            :class="getStatusBadgeClass(row.status)"
          >
            {{ row.status }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="viewEventDetails(row)"
              title="View Details"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              v-if="row.status === 'active'"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click="acknowledgeEvent(row)"
              title="Acknowledge"
            >
              <i class="ki-duotone ki-check fs-2"></i>
            </button>
            <button
              v-if="row.status === 'acknowledged'"
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm me-1"
              @click="resolveEvent(row)"
              title="Resolve"
            >
              <i class="ki-duotone ki-check-circle fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm"
              @click="editEvent(row)"
              title="Edit"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>
      
      <!--begin::Pagination-->
      <div class="d-flex flex-stack flex-wrap pt-10">
        <div class="fs-6 fw-semibold text-gray-700">
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} entries
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
          <h3 class="modal-title fw-bold" id="eventDetailsModalLabel">Event Details</h3>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="selectedEvent">
          <!--begin::Event Image-->
          <div class="row mb-6" v-if="selectedEvent.image_path">
            <div class="col-12">
              <label class="fw-semibold fs-4 mb-2">Event Image:</label>
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
                <label class="fw-semibold fs-4 mb-2">Event Type:</label>
                <div>
                  <span class="badge fs-5" :class="getEventTypeBadgeClass(selectedEvent.type)" style="padding: 8px 12px;">
                    {{ getEventTypeLabel(selectedEvent.type) }}
                  </span>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Severity:</label>
                <div>
                  <span class="badge fs-5" :class="getSeverityBadgeClass(selectedEvent.severity)" style="padding: 8px 12px;">
                    {{ selectedEvent.severity }}
                  </span>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Status:</label>
                <div>
                  <span class="badge fs-5" :class="getStatusBadgeClass(selectedEvent.status)" style="padding: 8px 12px;">
                    {{ selectedEvent.status }}
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Process:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEvent.description }}</p>
              </div>
            </div>
            <!--end::Left Column-->

            <!--begin::Right Column-->
            <div class="col-md-6">
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Start Time:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEvent.startTime) }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">End Time:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEvent.endTime) }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Duration:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDuration(selectedEvent.duration) }}</p>
              </div>

              <div class="mb-4" v-if="selectedEvent.camera_name">
                <label class="fw-semibold fs-4 mb-2">Camera:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEvent.camera_name }}</p>
              </div>

              <div class="mb-4" v-if="selectedEvent.location">
                <label class="fw-semibold fs-4 mb-2">Location:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEvent.location }}</p>
              </div>
            </div>
            <!--end::Right Column-->
          </div>
          <!--end::Event Info Grid-->

          <!--begin::Comments Section-->
          <div class="row mt-6" v-if="selectedEvent.comment">
            <div class="col-12">
              <div class="bg-light-info p-4 rounded">
                <label class="fw-semibold fs-4 text-gray-700 mb-2 d-block">Comments:</label>
                <p class="text-gray-800 mb-0 fs-5" style="white-space: pre-wrap;">{{ selectedEvent.comment }}</p>
              </div>
            </div>
          </div>
          <!--end::Comments Section-->

          <!--begin::Event UID-->
          <div class="row mt-6">
            <div class="col-12">
              <div class="bg-light p-4 rounded">
                <label class="fw-semibold fs-5 text-gray-600 mb-1">Event ID:</label>
                <p class="text-gray-800 mb-0 font-monospace fs-6">{{ selectedEvent.uid }}</p>
              </div>
            </div>
          </div>
          <!--end::Event UID-->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary fs-5 px-4 py-2" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary fs-5 px-4 py-2" v-if="selectedEvent && selectedEvent.status === 'active'" @click="acknowledgeEventFromModal">
            <i class="ki-duotone ki-check fs-2 me-2"></i>
            Acknowledge
          </button>
          <button type="button" class="btn btn-success fs-5 px-4 py-2" v-if="selectedEvent && selectedEvent.status === 'acknowledged'" @click="resolveEventFromModal">
            <i class="ki-duotone ki-check-circle fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Resolve
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Event Details Modal-->

  <!--begin::Edit Event Modal-->
  <div class="modal fade" id="editEventModal" tabindex="-1" aria-labelledby="editEventModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title fw-bold" id="editEventModalLabel">Edit Event</h3>
          <button type="button" class="btn-close" @click="closeEditModal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="selectedEventForEdit">
          <!--begin::Event Image-->
          <div class="row mb-6" v-if="selectedEventForEdit.image_path">
            <div class="col-12">
              <label class="fw-semibold fs-4 mb-2">Event Image:</label>
              <div class="text-center">
                <img 
                  :src="selectedEventForEdit.image_path" 
                  :alt="selectedEventForEdit.description"
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
                <label class="fw-semibold fs-4 mb-2">Event Type:</label>
                <div>
                  <span class="badge fs-5" :class="getEventTypeBadgeClass(selectedEventForEdit.type)" style="padding: 8px 12px;">
                    {{ getEventTypeLabel(selectedEventForEdit.type) }}
                  </span>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Severity:</label>
                <div>
                  <span class="badge fs-5" :class="getSeverityBadgeClass(selectedEventForEdit.severity)" style="padding: 8px 12px;">
                    {{ selectedEventForEdit.severity }}
                  </span>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Current Status:</label>
                <div>
                  <span class="badge fs-5" :class="getStatusBadgeClass(selectedEventForEdit.status)" style="padding: 8px 12px;">
                    {{ selectedEventForEdit.status }}
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Process:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEventForEdit.description }}</p>
              </div>
            </div>
            <!--end::Left Column-->

            <!--begin::Right Column-->
            <div class="col-md-6">
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Start Time:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEventForEdit.startTime) }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">End Time:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDateTime(selectedEventForEdit.endTime) }}</p>
              </div>
              
              <div class="mb-4">
                <label class="fw-semibold fs-4 mb-2">Duration:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ formatDuration(selectedEventForEdit.duration) }}</p>
              </div>

              <div class="mb-4" v-if="selectedEventForEdit.camera_name">
                <label class="fw-semibold fs-4 mb-2">Camera:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEventForEdit.camera_name }}</p>
              </div>

              <div class="mb-4" v-if="selectedEventForEdit.location">
                <label class="fw-semibold fs-4 mb-2">Location:</label>
                <p class="text-gray-800 mb-0 fs-4">{{ selectedEventForEdit.location }}</p>
              </div>
            </div>
            <!--end::Right Column-->
          </div>
          <!--end::Event Info Grid-->

          <!--begin::Edit Fields-->
          <div class="row mt-6">
            <div class="col-12">
              <div class="bg-light p-4 rounded">
                <div class="row g-4">
                  <div class="col-md-6">
                    <label class="fw-semibold fs-4 mb-2">Update Status:</label>
                    <select v-model="editStatus" class="form-select form-select-solid fs-5">
                      <option value="">Select new status...</option>
                      <option value="resolved">Resolved</option>
                      <option value="not resolved">Not Resolved</option>
                      <option value="false detection">False Detection</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="fw-semibold fs-4 mb-2">Event ID:</label>
                    <p class="text-gray-800 mb-0 font-monospace fs-6">{{ selectedEventForEdit.uid }}</p>
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-12">
                    <label class="fw-semibold fs-4 mb-2">Comment:</label>
                    <textarea 
                      v-model="editComment" 
                      class="form-control form-control-solid fs-5" 
                      rows="4" 
                      placeholder="Leave a comment about this event..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end::Edit Fields-->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary fs-5 px-4 py-2" @click="closeEditModal" :disabled="isEditModalLoading">Cancel</button>
          <button type="button" class="btn btn-primary fs-5 px-4 py-2" @click="saveEventEdit" :disabled="!editStatus || isEditModalLoading">
            <span v-if="isEditModalLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="ki-duotone ki-check fs-2 me-2"></i>
            {{ isEditModalLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Edit Event Modal-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Modal } from "bootstrap";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

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
const loading = ref(false);
const loadingSites = ref(false);
const loadingNvrs = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref("");
// Header filter state (site + nvr)
const selectedSiteFilter = ref<string>("");
const selectedNvrFilter = ref<string>("");
const selectedEventType = ref("");
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
const selectedEventForEdit = ref<any>(null);
const editStatus = ref('');
const editComment = ref('');
const isEditModalLoading = ref(false);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "Type",
    columnLabel: "type",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Severity",
    columnLabel: "severity",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Description",
    columnLabel: "description",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Timestamp",
    columnLabel: "timestamp",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Actions",
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Mock response in the required shape (fallback)
const mockEventsResponse = {
  code: 200,
  message: "Data retrieved successfully",
  data: [
    {
      duration: 0.12,
      endTime: "2025-09-09T04:13:00+07:00",
      image_path: "/image/stream_502_20250909_0406.jpg",
      process: "Pengiriman",
      startTime: "2025-09-09T04:06:00+07:00",
      status: "completed",
      comment: "Event berhasil diselesaikan dengan baik. Pengiriman telah sampai ke tujuan."
    },
    {
      duration: 0.1,
      endTime: "2025-09-09T04:12:00+07:00",
      image_path: "/image/stream_902_20250909_0406.jpg",
      process: "Masak", startTime: "2025-09-09T04:06:00+07:00",
      status: "completed",
      comment: "Proses memasak telah selesai sesuai standar operasional."
    },
    {
      duration: 0.17,
      endTime: "2025-09-09T04:13:00+07:00",
      image_path: "/image/stream_102_20250909_0403.jpg",
      process: "Ambil Nampan",
      startTime: "2025-09-09T04:03:00+07:00",
      status: "completed",
      comment: null
    },
    {
      duration: 0.17,
      endTime: "2025-09-09T04:13:00+07:00",
      image_path: "/image/stream_702_20250909_0403.jpg",
      process: "Pemorsian",
      startTime: "2025-09-09T04:03:00+07:00",
      status: "completed",
      comment: "Aktivitas pemorsian berjalan normal tanpa kendala."
    },
    {
      duration: 0.15,
      endTime: "2025-09-09T04:12:00+07:00",
      image_path: "/image/stream_602_20250909_0403.jpg",
      process: "Unknown Stream 602",
      startTime: "2025-09-09T04:03:00+07:00",
      status: "completed",
      comment: null
    }
  ],
  pagination: {
    page: 1,
    per_page: 3,
    total_pages: 2,
    total_items: 5,
    next_page: 2,
    prev_page: null
  }
};


// Fetch events from API (uses mock response shape as fallback)
const fetchEvents = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    // let apiUrl = "/events";
    // if (selectedSiteFilter.value) apiUrl += `?site_uid=${selectedSiteFilter.value}`;
    // const response = await ApiService.get(apiUrl);
    // const payload = response.data;

    // Using mock response for now
    const payload = mockEventsResponse;

    // Map response.data items sesuai struktur mockEventsResponse
    events.value = (payload.data || []).map((item, idx) => ({
      uid: `evt-${idx}-${Date.now()}`,
      type: 'motion',
      severity: 'low', 
      description: item.process || 'Event',
      camera_name: '',
      location: '',
      timestamp: item.startTime || item.endTime || new Date().toISOString(),
      // Gunakan status dari response langsung
      status: item.status || 'completed',
      site_uid: selectedSiteFilter.value || null,
      // Preserve semua field dari mockEventsResponse
      duration: item.duration,
      startTime: item.startTime,
      endTime: item.endTime,
      image_path: item.image_path,
      process: item.process,
      comment: item.comment || null
    }));

    // Apply client-side filters if header filters are set
    if (selectedSiteFilter.value) {
      events.value = events.value.filter(e => !e.site_uid || e.site_uid === selectedSiteFilter.value);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    events.value = [];
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


// Badge class helpers
const getEventTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'motion':
      return 'badge-light-primary';
    case 'intrusion':
      return 'badge-light-danger';
    case 'system':
      return 'badge-light-info';
    case 'camera_offline':
      return 'badge-light-warning';
    default:
      return 'badge-light-secondary';
  }
};

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
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
  switch (status) {
    case 'active':
      return 'badge-light-danger';
    case 'acknowledged':
      return 'badge-light-warning';
    case 'completed':
    case 'resolved':
      return 'badge-light-success';
    case 'not resolved':
      return 'badge-light-danger';
    case 'false detection':
      return 'badge-light-info';
    default:
      return 'badge-light-secondary';
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'motion':
      return 'Motion';
    case 'intrusion':
      return 'Intrusion';
    case 'system':
      return 'System';
    case 'camera_offline':
      return 'Camera Offline';
    default:
      return type;
  }
};

// Computed properties
const filteredAndSortedEvents = computed(() => {
  let filtered = events.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.description.toLowerCase().includes(query) ||
        (event.camera_name && event.camera_name.toLowerCase().includes(query)) ||
        event.location.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query) ||
        event.status.toLowerCase().includes(query) ||
        event.severity.toLowerCase().includes(query) ||
        getEventTypeLabel(event.type).toLowerCase().includes(query)
    );
  }

  // Filter by event type
  if (selectedEventType.value) {
    filtered = filtered.filter(event => event.type === selectedEventType.value);
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortLabel.value as keyof Event];
      let bValue: any = b[sortLabel.value as keyof Event];

      if (sortLabel.value === 'timestamp') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === "asc" ? comparison : -comparison;
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortOrder.value === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  // Update pagination info whenever filters change
  totalItems.value = filtered.length;
  totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value);
  
  // Apply pagination
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

const editEvent = async (event: Event) => {
  try {
    isEditModalLoading.value = true;
    
    // TODO: Fetch event details dari API
    // const response = await ApiService.get(`events/${event.uid}`);
    // selectedEventForEdit.value = response.data;
    
    // Untuk sementara gunakan data yang ada
    selectedEventForEdit.value = { ...event };
    editStatus.value = '';
    editComment.value = '';
    
    // Show edit modal
    const modalElement = document.getElementById('editEventModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
  } finally {
    isEditModalLoading.value = false;
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
  selectedEventForEdit.value = null;
  editStatus.value = '';
  editComment.value = '';
};

const saveEventEdit = async () => {
  if (!editStatus.value) return;
  
  try {
    isEditModalLoading.value = true;
    
    const updateData = {
      status: editStatus.value,
      comment: editComment.value
    };
    
    // TODO: API call untuk update event
    // await ApiService.put(`events/${selectedEventForEdit.value.uid}`, updateData);
    
    // Update local state
    const index = events.value.findIndex(e => e.uid === selectedEventForEdit.value.uid);
    if (index !== -1) {
      events.value[index].status = editStatus.value;
      // Bisa tambahkan field comment jika diperlukan
    }
    
    console.log('Event updated:', updateData);
    closeEditModal();
    
  } catch (error) {
    console.error("Error updating event:", error);
  } finally {
    isEditModalLoading.value = false;
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

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('id-ID', { 
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return dateTimeString;
  }
};

const formatDuration = (duration: number) => {
  if (!duration && duration !== 0) return 'N/A';
  if (duration < 1) {
    return `${(duration * 60).toFixed(1)} seconds`;
  }
  return `${duration.toFixed(2)} minutes`;
};

const handleImageError = (event: any) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMzUgNzVIMTY1VjEyNUgxMzVWNzVaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xMjAgMTA1TDE0MCA5MEwxNjAgMTEwTDE4MCA5MEwyMDAgMTEwVjEzNUgxMDBWMTEwTDEyMCAxMDVaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjE0cHgiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
  event.target.alt = 'Image not available';
};

const acknowledgeEvent = async (event: Event) => {
  try {
    // TODO: API call to acknowledge event
    // await ApiService.post(`/events/${event.uid}/acknowledge`);
    
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
    // await ApiService.post(`/events/${event.uid}/resolve`);
    
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