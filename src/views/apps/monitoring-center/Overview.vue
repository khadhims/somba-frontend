<template>
  <!--begin::Monitoring Center Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Monitoring Center</h4>
          <p class="text-muted mb-0">
            Centralized monitoring and analytics dashboard
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
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">Time Range:</label>
              <select
                v-model="selectedTimeRange"
                @change="updateTimeRange"
                class="form-select form-select-solid w-150px"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::System Health Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'System Health'"
        :value="`${systemHealthPercentage}%`"
        :progress-text="`${onlineDevices}/${totalDevices} Online`"
        :progress-value="systemHealthPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

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
        :description="'Storage Usage'"
        :value="`${storageUsedPercentage}%`"
        :progress-text="`${usedStorageGB}GB Used`"
        :progress-value="storageUsedPercentage"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Bandwidth Usage'"
        :value="`${currentBandwidthMbps}Mbps`"
        :progress-text="`${bandwidthUsagePercentage}% of limit`"
        :progress-value="bandwidthUsagePercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>
  </div>
  <!--end::System Health Cards-->

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Real-time Charts-->
    <div class="col-xl-8">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">System Performance</h3>
          </div>
          <div class="card-toolbar">
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-sm"
                :class="{ 'btn-primary': chartMetric === 'cpu', 'btn-light': chartMetric !== 'cpu' }"
                @click="setChartMetric('cpu')"
              >
                CPU
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="{ 'btn-primary': chartMetric === 'memory', 'btn-light': chartMetric !== 'memory' }"
                @click="setChartMetric('memory')"
              >
                Memory
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="{ 'btn-primary': chartMetric === 'storage', 'btn-light': chartMetric !== 'storage' }"
                @click="setChartMetric('storage')"
              >
                Storage
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="{ 'btn-primary': chartMetric === 'network', 'btn-light': chartMetric !== 'network' }"
                @click="setChartMetric('network')"
              >
                Network
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="chart-container" style="height: 300px;">
            <div class="d-flex align-items-center justify-content-center h-100 bg-light rounded">
              <div class="text-center">
                <i class="ki-duotone ki-chart-line fs-3x text-gray-400 mb-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <p class="text-gray-500">{{ chartMetric.toUpperCase() }} Performance Chart</p>
                <small class="text-muted">Chart implementation coming soon</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-4">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Recent Activities</h3>
          </div>
        </div>
        <div class="card-body" style="max-height: 350px; overflow-y: auto;">
          <div class="timeline">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="timeline-item"
            >
              <div class="timeline-line w-40px"></div>
              <div class="timeline-icon symbol symbol-circle symbol-40px">
                <div class="symbol-label" :class="getActivityIconClass(activity.type)">
                  <i :class="getActivityIcon(activity.type)" class="fs-2"></i>
                </div>
              </div>
              <div class="timeline-content ms-3">
                <div class="mb-1">
                  <span class="fs-6 text-gray-800 fw-bold">{{ activity.title }}</span>
                  <span class="text-muted fw-bold fs-7 ms-2">
                    {{ formatTime(activity.timestamp) }}
                  </span>
                </div>
                <div class="text-muted fw-semibold fs-7">{{ activity.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Real-time Charts-->

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Device Status-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Device Status</h3>
          </div>
        </div>
        <div class="card-body">
          <KTDataTable
            :data="devices"
            :header="deviceTableHeader"
            :checkbox-enabled="false"
            :enable-items-per-page-dropdown="false"
            :items-per-page="10"
            :loading="loadingDevices"
            empty-table-text="No devices found"
          >
            <template v-slot:name="{ row }">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-35px me-3">
                  <span class="symbol-label" :class="getDeviceTypeIconClass(row.type)">
                    <i :class="getDeviceTypeIcon(row.type)" class="fs-6"></i>
                  </span>
                </div>
                <div class="d-flex justify-content-start flex-column">
                  <span class="text-dark fw-bold text-hover-primary fs-6">{{
                    row.name
                  }}</span>
                  <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                    row.type
                  }}</span>
                </div>
              </div>
            </template>

            <template v-slot:status="{ row }">
              <span
                class="badge"
                :class="getDeviceStatusBadgeClass(row.status)"
              >
                {{ row.status }}
              </span>
            </template>

            <template v-slot:last_seen="{ row }">
              <span class="text-dark fw-bold d-block fs-6">
                {{ formatLastSeen(row.last_seen) }}
              </span>
            </template>

            <template v-slot:actions="{ row }">
              <div class="d-flex justify-content-end flex-shrink-0">
                <button
                  class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                  @click="viewDeviceDetails(row)"
                  title="View Details"
                >
                  <i class="ki-duotone ki-eye fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
                <button
                  v-if="row.status === 'offline'"
                  class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm"
                  @click="restartDevice(row)"
                  title="Restart Device"
                >
                  <i class="ki-duotone ki-arrows-circle fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
              </div>
            </template>
          </KTDataTable>
        </div>
      </div>
    </div>

    <!--begin::Alert Summary-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Alert Summary</h3>
          </div>
        </div>
        <div class="card-body">
          <KTDataTable
            :data="alerts"
            :header="alertTableHeader"
            :checkbox-enabled="false"
            :enable-items-per-page-dropdown="false"
            :items-per-page="10"
            :loading="loadingAlerts"
            empty-table-text="No active alerts"
          >
            <template v-slot:severity="{ row }">
              <span
                class="badge"
                :class="getSeverityBadgeClass(row.severity)"
              >
                {{ row.severity }}
              </span>
            </template>

            <template v-slot:message="{ row }">
              <div class="d-flex justify-content-start flex-column">
                <span class="text-dark fw-bold fs-6">{{ row.message }}</span>
                <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                  row.source
                }}</span>
              </div>
            </template>

            <template v-slot:timestamp="{ row }">
              <span class="text-dark fw-bold d-block fs-6">
                {{ formatTime(row.timestamp) }}
              </span>
            </template>

            <template v-slot:actions="{ row }">
              <div class="d-flex justify-content-end flex-shrink-0">
                <button
                  class="btn btn-icon btn-bg-light btn-active-color-success btn-sm"
                  @click="acknowledgeAlert(row)"
                  title="Acknowledge"
                >
                  <i class="ki-duotone ki-check fs-2"></i>
                </button>
              </div>
            </template>
          </KTDataTable>
        </div>
      </div>
    </div>
  </div>
  <!--end::Device Status-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// Interface definitions
interface Device {
  uid: string;
  name: string;
  type: 'camera' | 'nvr' | 'sensor' | 'controller';
  status: 'online' | 'offline' | 'warning';
  last_seen: string;
  site_uid?: string;
}

interface Alert {
  uid: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  source: string;
  timestamp: string;
  status: 'active' | 'acknowledged';
}

interface Activity {
  id: string;
  type: 'event' | 'system' | 'user' | 'maintenance';
  title: string;
  description: string;
  timestamp: string;
}

interface Site {
  uid: string;
  name: string;
}

// Reactive data
const devices = ref<Device[]>([]);
const alerts = ref<Alert[]>([]);
const recentActivities = ref<Activity[]>([]);
const sites = ref<Site[]>([]);
const loadingDevices = ref(false);
const loadingAlerts = ref(false);
const loadingSites = ref(false);
const selectedSiteId = ref("");
const selectedTimeRange = ref("24h");
const chartMetric = ref("cpu");

// Table headers
const deviceTableHeader = ref([
  {
    columnName: "Device",
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Last Seen",
    columnLabel: "last_seen",
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

const alertTableHeader = ref([
  {
    columnName: "Severity",
    columnLabel: "severity",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Message",
    columnLabel: "message",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Time",
    columnLabel: "timestamp",
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

// Mock data
const mockDevices: Device[] = [
  {
    uid: "1",
    name: "Front Entrance Camera",
    type: "camera",
    status: "online",
    last_seen: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    site_uid: "site1"
  },
  {
    uid: "2",
    name: "Main NVR System",
    type: "nvr",
    status: "online",
    last_seen: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    site_uid: "site1"
  },
  {
    uid: "3",
    name: "Reception Camera",
    type: "camera",
    status: "offline",
    last_seen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    site_uid: "site1"
  },
];

const mockAlerts: Alert[] = [
  {
    uid: "1",
    severity: "critical",
    message: "Camera offline",
    source: "Reception Camera",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "active"
  },
  {
    uid: "2",
    severity: "medium",
    message: "Motion detected",
    source: "Front Entrance",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: "active"
  },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "event",
    title: "Motion Event",
    description: "Motion detected at Front Entrance",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: "2",
    type: "system",
    title: "System Backup",
    description: "Daily backup completed successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: "3",
    type: "maintenance",
    title: "Camera Restart",
    description: "Reception camera restarted",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
];

const mockSites: Site[] = [
  { uid: "site1", name: "Main Office" },
  { uid: "site2", name: "Warehouse Branch" },
];

// Fetch functions
const fetchDevices = async () => {
  loadingDevices.value = true;
  try {
    // TODO: Replace with actual API call
    devices.value = mockDevices.filter(device => 
      !selectedSiteId.value || device.site_uid === selectedSiteId.value
    );
  } catch (error) {
    console.error("Error fetching devices:", error);
  } finally {
    loadingDevices.value = false;
  }
};

const fetchAlerts = async () => {
  loadingAlerts.value = true;
  try {
    // TODO: Replace with actual API call
    alerts.value = mockAlerts;
  } catch (error) {
    console.error("Error fetching alerts:", error);
  } finally {
    loadingAlerts.value = false;
  }
};

const fetchActivities = async () => {
  try {
    // TODO: Replace with actual API call
    recentActivities.value = mockActivities;
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

const fetchSites = async () => {
  loadingSites.value = true;
  try {
    // TODO: Replace with actual API call
    sites.value = mockSites;
  } catch (error) {
    console.error("Error fetching sites:", error);
  } finally {
    loadingSites.value = false;
  }
};

// Event handlers
const switchSite = () => {
  fetchDevices();
  fetchAlerts();
  fetchActivities();
};

const updateTimeRange = () => {
  fetchAlerts();
  fetchActivities();
};

const setChartMetric = (metric: string) => {
  chartMetric.value = metric;
  // TODO: Update chart data
};

const viewDeviceDetails = (device: Device) => {
  console.log("View device details:", device);
  // TODO: Open device details modal
};

const restartDevice = async (device: Device) => {
  try {
    // TODO: API call to restart device
    console.log("Restarting device:", device.name);
    // Update status temporarily
    const index = devices.value.findIndex(d => d.uid === device.uid);
    if (index !== -1) {
      devices.value[index].status = 'online';
      devices.value[index].last_seen = new Date().toISOString();
    }
  } catch (error) {
    console.error("Error restarting device:", error);
  }
};

const acknowledgeAlert = async (alert: Alert) => {
  try {
    // TODO: API call to acknowledge alert
    const index = alerts.value.findIndex(a => a.uid === alert.uid);
    if (index !== -1) {
      alerts.value[index].status = 'acknowledged';
    }
  } catch (error) {
    console.error("Error acknowledging alert:", error);
  }
};

// Utility functions
const formatTime = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return time.toLocaleDateString();
};

const formatLastSeen = (timestamp: string): string => {
  return formatTime(timestamp);
};

// Badge and icon helpers
const getDeviceStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'online':
      return 'badge-light-success';
    case 'offline':
      return 'badge-light-danger';
    case 'warning':
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

const getDeviceTypeIcon = (type: string) => {
  switch (type) {
    case 'camera':
      return 'ki-duotone ki-security-user';
    case 'nvr':
      return 'ki-duotone ki-router';
    case 'sensor':
      return 'ki-duotone ki-technology-4';
    case 'controller':
      return 'ki-duotone ki-tablet';
    default:
      return 'ki-duotone ki-technology-2';
  }
};

const getDeviceTypeIconClass = (type: string) => {
  switch (type) {
    case 'camera':
      return 'bg-light-primary text-primary';
    case 'nvr':
      return 'bg-light-success text-success';
    case 'sensor':
      return 'bg-light-warning text-warning';
    case 'controller':
      return 'bg-light-info text-info';
    default:
      return 'bg-light-secondary text-secondary';
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'event':
      return 'ki-duotone ki-notification-bing';
    case 'system':
      return 'ki-duotone ki-technology-2';
    case 'user':
      return 'ki-duotone ki-profile-user';
    case 'maintenance':
      return 'ki-duotone ki-setting-2';
    default:
      return 'ki-duotone ki-information';
  }
};

const getActivityIconClass = (type: string) => {
  switch (type) {
    case 'event':
      return 'bg-light-warning text-warning';
    case 'system':
      return 'bg-light-primary text-primary';
    case 'user':
      return 'bg-light-success text-success';
    case 'maintenance':
      return 'bg-light-info text-info';
    default:
      return 'bg-light-secondary text-secondary';
  }
};

// Computed properties for statistics
const totalDevices = computed(() => devices.value.length);
const onlineDevices = computed(() => devices.value.filter(d => d.status === 'online').length);
const systemHealthPercentage = computed(() =>
  totalDevices.value > 0 ? Math.round((onlineDevices.value / totalDevices.value) * 100) : 0
);

const activeAlerts = computed(() => alerts.value.filter(a => a.status === 'active').length);
const criticalAlerts = computed(() => 
  alerts.value.filter(a => a.severity === 'critical' && a.status === 'active').length
);
const criticalAlertsPercentage = computed(() =>
  activeAlerts.value > 0 ? Math.round((criticalAlerts.value / activeAlerts.value) * 100) : 0
);

const usedStorageGB = computed(() => 650); // Mock data
const totalStorageGB = computed(() => 1000); // Mock data
const storageUsedPercentage = computed(() =>
  Math.round((usedStorageGB.value / totalStorageGB.value) * 100)
);

const currentBandwidthMbps = computed(() => 45); // Mock data
const maxBandwidthMbps = computed(() => 100); // Mock data
const bandwidthUsagePercentage = computed(() =>
  Math.round((currentBandwidthMbps.value / maxBandwidthMbps.value) * 100)
);

// Initialize data on component mount
onMounted(() => {
  fetchSites();
  fetchDevices();
  fetchAlerts();
  fetchActivities();
});
</script>

<style scoped>
.timeline {
  position: relative;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 20px;
  width: 2px;
  height: 40px;
  background-color: #e4e6ef;
  z-index: 1;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-icon {
  position: relative;
  z-index: 2;
}

.chart-container {
  position: relative;
}
</style>
