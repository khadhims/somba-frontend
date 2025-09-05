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
            <div class="d-flex align-items-center" v-if="sites.length > 0">
              <label class="form-label me-3 mb-0 fw-semibold">Site:</label>
              <select
                v-model="selectedSiteId"
                @change="switchSite"
                class="form-select form-select-solid w-200px"
                :disabled="loadingSites"
              >
                <option value="">All Sites</option>
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
            new Date(row.timestamp).toLocaleDateString()
          }}</span>
          <span class="text-muted fw-semibold text-muted d-block fs-7">{{
            new Date(row.timestamp).toLocaleTimeString()
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
              class="btn btn-icon btn-bg-light btn-active-color-info btn-sm"
              @click="resolveEvent(row)"
              title="Resolve"
            >
              <i class="ki-duotone ki-check-circle fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Events List-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// Interface definitions
interface Event {
  uid: string;
  type: 'motion' | 'intrusion' | 'system' | 'camera_offline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  camera_name?: string;
  location: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  site_uid?: string;
}

interface Site {
  uid: string;
  name: string;
}

// Reactive data
const events = ref<Event[]>([]);
const sites = ref<Site[]>([]);
const loading = ref(false);
const loadingSites = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref("");
const selectedEventType = ref("");
const sortLabel = ref("timestamp");
const sortOrder = ref<"asc" | "desc">("desc");
const currentSite = ref<Site | null>(null);

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

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    uid: "1",
    type: "motion",
    severity: "medium",
    description: "Motion detected in restricted area",
    camera_name: "Front Entrance",
    location: "Lobby",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    status: "active",
    site_uid: "site1"
  },
  {
    uid: "2",
    type: "intrusion",
    severity: "critical",
    description: "Unauthorized access attempt",
    camera_name: "Parking Area",
    location: "Parking",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    status: "acknowledged",
    site_uid: "site1"
  },
  {
    uid: "3",
    type: "camera_offline",
    severity: "high",
    description: "Camera connection lost",
    camera_name: "Reception Desk",
    location: "Reception",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: "resolved",
    site_uid: "site1"
  },
];

const mockSites: Site[] = [
  { uid: "site1", name: "Main Office" },
  { uid: "site2", name: "Warehouse Branch" },
];

// Fetch events from API
const fetchEvents = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    // let apiUrl = "/events";
    // if (selectedSiteId.value) {
    //   apiUrl += `?site_uid=${selectedSiteId.value}`;
    // }
    // const response = await ApiService.get(apiUrl);
    // events.value = response.data.data || response.data;
    
    // Using mock data for now
    events.value = mockEvents.filter(event => 
      !selectedSiteId.value || event.site_uid === selectedSiteId.value
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    events.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch sites from API
const fetchSites = async () => {
  loadingSites.value = true;
  try {
    // TODO: Replace with actual API call
    // const response = await ApiService.get("/sites");
    // sites.value = response.data.data || response.data;
    
    // Using mock data for now
    sites.value = mockSites;
  } catch (error) {
    console.error("Error fetching sites:", error);
    sites.value = [];
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
    case 'resolved':
      return 'badge-light-success';
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
        event.location.toLowerCase().includes(query)
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

  return filtered;
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

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const viewEventDetails = (event: Event) => {
  console.log("View event details:", event);
  // TODO: Implement event details modal
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
});
</script>
