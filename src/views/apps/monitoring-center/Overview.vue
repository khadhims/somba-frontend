<template>
  <!--begin::Monitoring Center Overview-->
  <div class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h4 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ t("appsMonitoringCenter.overview.header.title") }}
        </h4>
        <p class="m-0 text-gray-500">
          {{ t("appsMonitoringCenter.overview.header.subtitle") }}
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-4">
        <div class="flex items-center" v-if="sites.length > 0">
          <label class="mr-3 mb-0 shrink-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("appsMonitoringCenter.overview.header.filters.siteLabel") }}
          </label>
          <select
            v-model="selectedSiteId"
            @change="switchSite"
            :disabled="loadingSites"
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">{{ t("appsMonitoringCenter.overview.header.filters.siteAll") }}</option>
            <option v-for="site in sites" :key="site.uid" :value="site.uid">
              {{ site.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center">
          <label class="mr-3 mb-0 shrink-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("appsMonitoringCenter.overview.header.filters.timeRangeLabel") }}
          </label>
          <select
            v-model="selectedTimeRange"
            @change="updateTimeRange"
            class="w-[150px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="1h">{{ t("appsMonitoringCenter.overview.header.filters.timeRanges.1h") }}</option>
            <option value="24h">{{ t("appsMonitoringCenter.overview.header.filters.timeRanges.24h") }}</option>
            <option value="7d">{{ t("appsMonitoringCenter.overview.header.filters.timeRanges.7d") }}</option>
            <option value="30d">{{ t("appsMonitoringCenter.overview.header.filters.timeRanges.30d") }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <!--begin::System Health Cards-->
    <Widget1
      :description="t('appsMonitoringCenter.overview.widgets.systemHealth.title')"
      :value="`${systemHealthPercentage}%`"
      :progress-text="t('appsMonitoringCenter.overview.widgets.systemHealth.progress', { online: onlineDevices, total: totalDevices })"
      :progress-value="systemHealthPercentage"
      bg-color="#17C653"
      text-color="white"
    />
    <Widget1
      :description="t('appsMonitoringCenter.overview.widgets.activeAlerts.title')"
      :value="activeAlerts"
      :progress-text="t('appsMonitoringCenter.overview.widgets.activeAlerts.progress', { count: criticalAlerts })"
      :progress-value="criticalAlertsPercentage"
      bg-color="#F1416C"
      text-color="white"
    />
    <Widget1
      :description="t('appsMonitoringCenter.overview.widgets.storageUsage.title')"
      :value="`${storageUsedPercentage}%`"
      :progress-text="t('appsMonitoringCenter.overview.widgets.storageUsage.progress', { used: usedStorageGB })"
      :progress-value="storageUsedPercentage"
      bg-color="#FFA800"
      text-color="white"
    />
    <Widget1
      :description="t('appsMonitoringCenter.overview.widgets.bandwidthUsage.title')"
      :value="`${currentBandwidthMbps}Mbps`"
      :progress-text="t('appsMonitoringCenter.overview.widgets.bandwidthUsage.progress', { percentage: bandwidthUsagePercentage })"
      :progress-value="bandwidthUsagePercentage"
      bg-color="#3699FF"
      text-color="white"
    />
  </div>
  <!--end::System Health Cards-->

  <div class="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-12">
    <!--begin::Real-time Charts-->
    <div class="xl:col-span-8">
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="flex flex-wrap items-center justify-between gap-3 p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsMonitoringCenter.overview.charts.systemPerformance.title") }}
          </h3>
          <div class="inline-flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-700" role="group">
            <button
              v-for="metric in ['cpu', 'memory', 'storage', 'network']"
              :key="metric"
              type="button"
              @click="setChartMetric(metric)"
              class="border-r border-gray-300 px-3 py-1.5 text-sm font-semibold transition-colors last:border-r-0 dark:border-gray-700"
              :class="
                chartMetric === metric
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              "
            >
              {{ t(`appsMonitoringCenter.overview.charts.systemPerformance.metrics.${metric}`) }}
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="chart-container" style="height: 300px;">
            <div class="flex h-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
              <div class="text-center">
                <i class="ki-duotone ki-chart-line mb-3 text-3xl text-gray-400">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <p class="text-gray-500">{{ t('appsMonitoringCenter.overview.charts.systemPerformance.placeholder.chart', { metric: chartMetric.toUpperCase() }) }}</p>
                <small class="text-gray-500">{{ t('appsMonitoringCenter.overview.charts.systemPerformance.placeholder.comingSoon') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="xl:col-span-4">
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsMonitoringCenter.overview.charts.recentActivities.title") }}
          </h3>
        </div>
        <div class="overflow-y-auto p-6" style="max-height: 350px;">
          <div class="timeline">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="timeline-item"
            >
              <div class="timeline-line w-10"></div>
              <div class="timeline-icon flex h-10 w-10 items-center justify-center rounded-full">
                <div class="flex h-full w-full items-center justify-center rounded-full" :class="getActivityIconClass(activity.type)">
                  <i :class="getActivityIcon(activity.type)" class="text-xl"></i>
                </div>
              </div>
              <div class="timeline-content ml-3">
                <div class="mb-1">
                  <span class="font-bold text-gray-800">{{ activity.title }}</span>
                  <span class="ml-2 text-sm font-bold text-gray-500">
                    {{ formatTime(activity.timestamp) }}
                  </span>
                </div>
                <div class="text-sm font-semibold text-gray-500">{{ activity.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Real-time Charts-->

  <div class="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
    <!--begin::Device Status-->
    <div>
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsMonitoringCenter.overview.tables.deviceStatus.title") }}
          </h3>
        </div>
        <div class="p-6">
          <KTDataTable
            :data="devices"
            :header="deviceTableHeader"
            :checkbox-enabled="false"
            :enable-items-per-page-dropdown="false"
            :items-per-page="10"
            :loading="loadingDevices"
            :empty-table-text="t('appsMonitoringCenter.overview.tables.deviceStatus.empty')"
          >
            <template v-slot:name="{ row }">
              <div class="flex items-center">
                <div
                  class="mr-3 flex h-[35px] w-[35px] items-center justify-center rounded-full"
                  :class="getDeviceTypeIconClass(row.type)"
                >
                  <i :class="getDeviceTypeIcon(row.type)" class="text-sm"></i>
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900 hover:text-primary dark:text-gray-100">{{
                    row.name
                  }}</span>
                  <span class="text-sm text-gray-500">{{
                    getDeviceTypeText(row.type)
                  }}</span>
                </div>
              </div>
            </template>

            <template v-slot:status="{ row }">
              <span :class="getDeviceStatusBadgeClass(row.status)">
                {{ getDeviceStatusText(row.status) }}
              </span>
            </template>

            <template v-slot:last_seen="{ row }">
              <span class="block font-bold text-gray-900 dark:text-gray-100">
                {{ formatLastSeen(row.last_seen) }}
              </span>
            </template>

            <template v-slot:actions="{ row }">
              <div class="flex justify-end gap-1">
                <RowActionButton
                  @click="viewDeviceDetails(row)"
                  :title="t('appsMonitoringCenter.overview.tables.deviceStatus.actions.viewDetails')"
                >
                  <i class="ki-duotone ki-eye fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </RowActionButton>
                <RowActionButton
                  v-if="row.status === 'offline'"
                  @click="restartDevice(row)"
                  :title="t('appsMonitoringCenter.overview.tables.deviceStatus.actions.restart')"
                  variant="warning"
                >
                  <i class="ki-duotone ki-arrows-circle fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </RowActionButton>
              </div>
            </template>
          </KTDataTable>
        </div>
      </div>
    </div>

    <!--begin::Alert Summary-->
    <div>
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsMonitoringCenter.overview.tables.alertSummary.title") }}
          </h3>
        </div>
        <div class="p-6">
          <KTDataTable
            :data="alerts"
            :header="alertTableHeader"
            :checkbox-enabled="false"
            :enable-items-per-page-dropdown="false"
            :items-per-page="10"
            :loading="loadingAlerts"
            :empty-table-text="t('appsMonitoringCenter.overview.tables.alertSummary.empty')"
          >
            <template v-slot:severity="{ row }">
              <span :class="getSeverityBadgeClass(row.severity)">
                {{ getSeverityText(row.severity) }}
              </span>
            </template>

            <template v-slot:message="{ row }">
              <div class="flex flex-col">
                <span class="font-bold text-gray-900 dark:text-gray-100">{{ row.message }}</span>
                <span class="block text-sm text-gray-500">{{
                  row.source
                }}</span>
              </div>
            </template>

            <template v-slot:timestamp="{ row }">
              <span class="block font-bold text-gray-900 dark:text-gray-100">
                {{ formatTime(row.timestamp) }}
              </span>
            </template>

            <template v-slot:actions="{ row }">
              <div class="flex justify-end">
                <RowActionButton
                  @click="acknowledgeAlert(row)"
                  :title="t('appsMonitoringCenter.overview.tables.alertSummary.actions.acknowledge')"
                  variant="success"
                >
                  <i class="ki-duotone ki-check fs-2"></i>
                </RowActionButton>
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
import { useI18n } from "vue-i18n";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import RowActionButton from "@/components/common/RowActionButton.vue";
import { badgeVariantClass } from "@/core/helpers/badge";

const { t } = useI18n();

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
const deviceTableHeader = computed(() => [
  {
    columnName: t('appsMonitoringCenter.overview.tables.deviceStatus.columns.device'),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsMonitoringCenter.overview.tables.deviceStatus.columns.status'),
    columnLabel: "status",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsMonitoringCenter.overview.tables.deviceStatus.columns.lastSeen'),
    columnLabel: "last_seen",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsMonitoringCenter.overview.tables.deviceStatus.columns.actions'),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

const alertTableHeader = computed(() => [
  {
    columnName: t('appsMonitoringCenter.overview.tables.alertSummary.columns.severity'),
    columnLabel: "severity",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsMonitoringCenter.overview.tables.alertSummary.columns.message'),
    columnLabel: "message",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('appsMonitoringCenter.overview.tables.alertSummary.columns.time'),
    columnLabel: "timestamp",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('appsMonitoringCenter.overview.tables.alertSummary.columns.actions'),
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
  
  if (diffMinutes < 1) return t('appsMonitoringCenter.overview.activities.timeFormat.justNow');
  if (diffMinutes < 60) return t('appsMonitoringCenter.overview.activities.timeFormat.minutesAgo', { minutes: diffMinutes });
  if (diffMinutes < 1440) return t('appsMonitoringCenter.overview.activities.timeFormat.hoursAgo', { hours: Math.floor(diffMinutes / 60) });
  return time.toLocaleDateString();
};

const formatLastSeen = (timestamp: string): string => {
  return formatTime(timestamp);
};

// Badge and icon helpers
const badgePillClass = "inline-flex rounded px-2 py-1 text-xs font-semibold";
const getDeviceStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'online':
      return `${badgePillClass} ${badgeVariantClass('success')}`;
    case 'offline':
      return `${badgePillClass} ${badgeVariantClass('danger')}`;
    case 'warning':
      return `${badgePillClass} ${badgeVariantClass('warning')}`;
    default:
      return `${badgePillClass} ${badgeVariantClass('secondary')}`;
  }
};

const getDeviceStatusText = (status: string) => {
  switch (status) {
    case 'online':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.status.online');
    case 'offline':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.status.offline');
    case 'warning':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.status.warning');
    default:
      return status;
  }
};

const getSeverityBadgeClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return `${badgePillClass} ${badgeVariantClass('danger')}`;
    case 'high':
      return `${badgePillClass} ${badgeVariantClass('warning')}`;
    case 'medium':
      return `${badgePillClass} ${badgeVariantClass('primary')}`;
    case 'low':
      return `${badgePillClass} ${badgeVariantClass('success')}`;
    default:
      return `${badgePillClass} ${badgeVariantClass('secondary')}`;
  }
};

const getSeverityText = (severity: string) => {
  switch (severity) {
    case 'critical':
      return t('appsMonitoringCenter.overview.tables.alertSummary.severity.critical');
    case 'high':
      return t('appsMonitoringCenter.overview.tables.alertSummary.severity.high');
    case 'medium':
      return t('appsMonitoringCenter.overview.tables.alertSummary.severity.medium');
    case 'low':
      return t('appsMonitoringCenter.overview.tables.alertSummary.severity.low');
    default:
      return severity;
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
      return badgeVariantClass('primary');
    case 'nvr':
      return badgeVariantClass('success');
    case 'sensor':
      return badgeVariantClass('warning');
    case 'controller':
      return badgeVariantClass('info');
    default:
      return badgeVariantClass('secondary');
  }
};

const getDeviceTypeText = (type: string) => {
  switch (type) {
    case 'camera':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.deviceTypes.camera');
    case 'nvr':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.deviceTypes.nvr');
    case 'sensor':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.deviceTypes.sensor');
    case 'controller':
      return t('appsMonitoringCenter.overview.tables.deviceStatus.deviceTypes.controller');
    default:
      return type;
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
      return badgeVariantClass('warning');
    case 'system':
      return badgeVariantClass('primary');
    case 'user':
      return badgeVariantClass('success');
    case 'maintenance':
      return badgeVariantClass('info');
    default:
      return badgeVariantClass('secondary');
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
