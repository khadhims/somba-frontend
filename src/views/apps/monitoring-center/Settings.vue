<template>
  <!--begin::Monitoring Center Settings-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Monitoring Center Settings</h4>
          <p class="text-muted mb-0">
            Configure monitoring thresholds and dashboard preferences
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-8">
    <!--begin::Monitoring Thresholds-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">System Monitoring Thresholds</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveMonitoringSettings">
            <!--begin::CPU Threshold-->
            <div class="mb-7">
              <label class="form-label">CPU Usage Alert Threshold (%)</label>
              <div class="row">
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.cpu.warning"
                    min="1"
                    max="100"
                    placeholder="Warning threshold"
                  />
                  <div class="text-muted fs-7">Warning level</div>
                </div>
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.cpu.critical"
                    min="1"
                    max="100"
                    placeholder="Critical threshold"
                  />
                  <div class="text-muted fs-7">Critical level</div>
                </div>
              </div>
            </div>
            <!--end::CPU Threshold-->

            <!--begin::Memory Threshold-->
            <div class="mb-7">
              <label class="form-label">Memory Usage Alert Threshold (%)</label>
              <div class="row">
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.memory.warning"
                    min="1"
                    max="100"
                    placeholder="Warning threshold"
                  />
                  <div class="text-muted fs-7">Warning level</div>
                </div>
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.memory.critical"
                    min="1"
                    max="100"
                    placeholder="Critical threshold"
                  />
                  <div class="text-muted fs-7">Critical level</div>
                </div>
              </div>
            </div>
            <!--end::Memory Threshold-->

            <!--begin::Storage Threshold-->
            <div class="mb-7">
              <label class="form-label">Storage Usage Alert Threshold (%)</label>
              <div class="row">
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.storage.warning"
                    min="1"
                    max="100"
                    placeholder="Warning threshold"
                  />
                  <div class="text-muted fs-7">Warning level</div>
                </div>
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.storage.critical"
                    min="1"
                    max="100"
                    placeholder="Critical threshold"
                  />
                  <div class="text-muted fs-7">Critical level</div>
                </div>
              </div>
            </div>
            <!--end::Storage Threshold-->

            <!--begin::Network Threshold-->
            <div class="mb-7">
              <label class="form-label">Network Bandwidth Alert Threshold (%)</label>
              <div class="row">
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.bandwidth.warning"
                    min="1"
                    max="100"
                    placeholder="Warning threshold"
                  />
                  <div class="text-muted fs-7">Warning level</div>
                </div>
                <div class="col-md-6">
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.bandwidth.critical"
                    min="1"
                    max="100"
                    placeholder="Critical threshold"
                  />
                  <div class="text-muted fs-7">Critical level</div>
                </div>
              </div>
            </div>
            <!--end::Network Threshold-->

            <!--begin::Device Monitoring-->
            <div class="mb-7">
              <label class="form-label">Device Health Monitoring</label>
              
              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="monitoringSettings.deviceMonitoring.cameraOfflineAlert"
                  />
                  <span class="form-check-label">Alert when cameras go offline</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="monitoringSettings.deviceMonitoring.nvrHealthCheck"
                  />
                  <span class="form-check-label">Monitor NVR system health</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-label">Device Offline Timeout (minutes)</label>
                <input
                  type="number"
                  class="form-control form-control-solid"
                  v-model="monitoringSettings.deviceMonitoring.offlineTimeout"
                  min="1"
                  max="60"
                />
                <div class="text-muted fs-7">Consider device offline after this time</div>
              </div>
            </div>
            <!--end::Device Monitoring-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingMonitoringSettings">
                <span v-if="savingMonitoringSettings" class="spinner-border spinner-border-sm me-2"></span>
                Save Monitoring Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Monitoring Thresholds-->

    <!--begin::Dashboard Preferences-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Dashboard Preferences</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveDashboardSettings">
            <!--begin::Refresh Interval-->
            <div class="mb-7">
              <label class="form-label">Auto-refresh Interval</label>
              <select
                v-model="dashboardSettings.refreshInterval"
                class="form-select form-select-solid"
              >
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="0">Manual only</option>
              </select>
              <div class="text-muted fs-7">How often to update dashboard data</div>
            </div>
            <!--end::Refresh Interval-->

            <!--begin::Default Time Range-->
            <div class="mb-7">
              <label class="form-label">Default Time Range</label>
              <select
                v-model="dashboardSettings.defaultTimeRange"
                class="form-select form-select-solid"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <div class="text-muted fs-7">Default time range for charts and statistics</div>
            </div>
            <!--end::Default Time Range-->

            <!--begin::Widget Preferences-->
            <div class="mb-7">
              <label class="form-label">Visible Widgets</label>
              
              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.systemHealth"
                  />
                  <span class="form-check-label">System Health</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.performanceCharts"
                  />
                  <span class="form-check-label">Performance Charts</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.deviceStatus"
                  />
                  <span class="form-check-label">Device Status Table</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.alertSummary"
                  />
                  <span class="form-check-label">Alert Summary</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.recentActivities"
                  />
                  <span class="form-check-label">Recent Activities</span>
                </label>
              </div>
            </div>
            <!--end::Widget Preferences-->

            <!--begin::Chart Preferences-->
            <div class="mb-7">
              <label class="form-label">Chart Settings</label>
              
              <div class="mb-4">
                <label class="form-label">Default Chart Type</label>
                <select
                  v-model="dashboardSettings.chartSettings.defaultType"
                  class="form-select form-select-solid"
                >
                  <option value="line">Line Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="bar">Bar Chart</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">Data Points to Show</label>
                <select
                  v-model="dashboardSettings.chartSettings.dataPoints"
                  class="form-select form-select-solid"
                >
                  <option value="20">20 points</option>
                  <option value="50">50 points</option>
                  <option value="100">100 points</option>
                  <option value="200">200 points</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.chartSettings.showGridLines"
                  />
                  <span class="form-check-label">Show grid lines</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.chartSettings.animateOnLoad"
                  />
                  <span class="form-check-label">Animate charts on load</span>
                </label>
              </div>
            </div>
            <!--end::Chart Preferences-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingDashboardSettings">
                <span v-if="savingDashboardSettings" class="spinner-border spinner-border-sm me-2"></span>
                Save Dashboard Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Dashboard Preferences-->
  </div>

  <!--begin::Data Export & Reporting-->
  <div class="row g-5 mt-5">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Data Export & Reporting</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <!--begin::Automated Reports-->
            <div class="col-md-6">
              <h5 class="mb-4">Automated Reports</h5>
              
              <div class="mb-7">
                <label class="form-check form-switch form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="reportingSettings.automated.enabled"
                  />
                  <span class="form-check-label fw-semibold text-gray-800">
                    Enable Automated Reports
                  </span>
                </label>
                <div class="text-muted fs-7">
                  Generate and send reports automatically
                </div>
              </div>

              <div v-if="reportingSettings.automated.enabled">
                <div class="mb-4">
                  <label class="form-label">Report Frequency</label>
                  <select
                    v-model="reportingSettings.automated.frequency"
                    class="form-select form-select-solid"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label">Report Types</label>
                  <div class="d-flex flex-column gap-2">
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="reportingSettings.automated.includeSystemHealth"
                      />
                      <span class="form-check-label">System Health Summary</span>
                    </label>
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="reportingSettings.automated.includeAlertSummary"
                      />
                      <span class="form-check-label">Alert Summary</span>
                    </label>
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="reportingSettings.automated.includeDeviceStatus"
                      />
                      <span class="form-check-label">Device Status</span>
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Email Recipients</label>
                  <textarea
                    v-model="emailRecipientsText"
                    class="form-control form-control-solid"
                    rows="3"
                    placeholder="Enter email addresses, one per line"
                  ></textarea>
                </div>
              </div>
            </div>
            <!--end::Automated Reports-->

            <!--begin::Manual Export-->
            <div class="col-md-6">
              <h5 class="mb-4">Manual Export</h5>
              
              <div class="mb-4">
                <label class="form-label">Export Format</label>
                <select
                  v-model="exportSettings.format"
                  class="form-select form-select-solid"
                >
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data</option>
                  <option value="json">JSON Data</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">Data Range</label>
                <select
                  v-model="exportSettings.dateRange"
                  class="form-select form-select-solid"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div v-if="exportSettings.dateRange === 'custom'" class="row mb-4">
                <div class="col-6">
                  <label class="form-label">Start Date</label>
                  <input
                    type="date"
                    v-model="exportSettings.customStartDate"
                    class="form-control form-control-solid"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label">End Date</label>
                  <input
                    type="date"
                    v-model="exportSettings.customEndDate"
                    class="form-control form-control-solid"
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label">Include Data</label>
                <div class="d-flex flex-column gap-2">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="exportSettings.includePerformanceData"
                    />
                    <span class="form-check-label">Performance Metrics</span>
                  </label>
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="exportSettings.includeAlertData"
                    />
                    <span class="form-check-label">Alert History</span>
                  </label>
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="exportSettings.includeDeviceData"
                    />
                    <span class="form-check-label">Device Logs</span>
                  </label>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  type="button"
                  @click="exportData"
                  class="btn btn-success"
                  :disabled="exporting"
                >
                  <span v-if="exporting" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="ki-duotone ki-download fs-6 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Export Data
                </button>
                <button
                  type="button"
                  @click="previewReport"
                  class="btn btn-light-primary"
                >
                  <i class="ki-duotone ki-eye fs-6 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Preview
                </button>
              </div>
            </div>
            <!--end::Manual Export-->
          </div>

          <div class="d-flex justify-content-end mt-5">
            <button
              type="button"
              @click="saveReportingSettings"
              class="btn btn-primary"
              :disabled="savingReportingSettings"
            >
              <span v-if="savingReportingSettings" class="spinner-border spinner-border-sm me-2"></span>
              Save Reporting Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Data Export & Reporting-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";

// Interface definitions
interface MonitoringSettings {
  thresholds: {
    cpu: { warning: number; critical: number };
    memory: { warning: number; critical: number };
    storage: { warning: number; critical: number };
    bandwidth: { warning: number; critical: number };
  };
  deviceMonitoring: {
    cameraOfflineAlert: boolean;
    nvrHealthCheck: boolean;
    offlineTimeout: number;
  };
}

interface DashboardSettings {
  refreshInterval: number;
  defaultTimeRange: string;
  widgets: {
    systemHealth: boolean;
    performanceCharts: boolean;
    deviceStatus: boolean;
    alertSummary: boolean;
    recentActivities: boolean;
  };
  chartSettings: {
    defaultType: 'line' | 'area' | 'bar';
    dataPoints: number;
    showGridLines: boolean;
    animateOnLoad: boolean;
  };
}

interface ReportingSettings {
  automated: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    includeSystemHealth: boolean;
    includeAlertSummary: boolean;
    includeDeviceStatus: boolean;
    emailRecipients: string[];
  };
}

interface ExportSettings {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: '24h' | '7d' | '30d' | 'custom';
  customStartDate: string;
  customEndDate: string;
  includePerformanceData: boolean;
  includeAlertData: boolean;
  includeDeviceData: boolean;
}

// Reactive data
const monitoringSettings = ref<MonitoringSettings>({
  thresholds: {
    cpu: { warning: 75, critical: 90 },
    memory: { warning: 80, critical: 95 },
    storage: { warning: 85, critical: 95 },
    bandwidth: { warning: 80, critical: 95 }
  },
  deviceMonitoring: {
    cameraOfflineAlert: true,
    nvrHealthCheck: true,
    offlineTimeout: 5
  }
});

const dashboardSettings = ref<DashboardSettings>({
  refreshInterval: 30,
  defaultTimeRange: '24h',
  widgets: {
    systemHealth: true,
    performanceCharts: true,
    deviceStatus: true,
    alertSummary: true,
    recentActivities: true
  },
  chartSettings: {
    defaultType: 'line',
    dataPoints: 50,
    showGridLines: true,
    animateOnLoad: true
  }
});

const reportingSettings = ref<ReportingSettings>({
  automated: {
    enabled: false,
    frequency: 'weekly',
    includeSystemHealth: true,
    includeAlertSummary: true,
    includeDeviceStatus: true,
    emailRecipients: []
  }
});

const exportSettings = ref<ExportSettings>({
  format: 'pdf',
  dateRange: '7d',
  customStartDate: '',
  customEndDate: '',
  includePerformanceData: true,
  includeAlertData: true,
  includeDeviceData: false
});

const savingMonitoringSettings = ref(false);
const savingDashboardSettings = ref(false);
const savingReportingSettings = ref(false);
const exporting = ref(false);

// Computed properties
const emailRecipientsText = computed({
  get: () => reportingSettings.value.automated.emailRecipients.join('\n'),
  set: (value: string) => {
    reportingSettings.value.automated.emailRecipients = value
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }
});

// Methods
const loadSettings = async () => {
  try {
    // TODO: Load settings from API
    // const response = await ApiService.get('/settings/monitoring-center');
    // monitoringSettings.value = response.data.monitoring;
    // dashboardSettings.value = response.data.dashboard;
    // reportingSettings.value = response.data.reporting;
    
    console.log("Settings loaded");
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveMonitoringSettings = async () => {
  savingMonitoringSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/monitoring-center/monitoring', monitoringSettings.value);
    
    console.log("Monitoring settings saved:", monitoringSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving monitoring settings:", error);
  } finally {
    savingMonitoringSettings.value = false;
  }
};

const saveDashboardSettings = async () => {
  savingDashboardSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/monitoring-center/dashboard', dashboardSettings.value);
    
    console.log("Dashboard settings saved:", dashboardSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving dashboard settings:", error);
  } finally {
    savingDashboardSettings.value = false;
  }
};

const saveReportingSettings = async () => {
  savingReportingSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/monitoring-center/reporting', reportingSettings.value);
    
    console.log("Reporting settings saved:", reportingSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving reporting settings:", error);
  } finally {
    savingReportingSettings.value = false;
  }
};

const exportData = async () => {
  exporting.value = true;
  try {
    // TODO: Export data via API
    // const response = await ApiService.post('/monitoring-center/export', exportSettings.value);
    
    console.log("Exporting data with settings:", exportSettings.value);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show success message
    alert("Data exported successfully!");
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    exporting.value = false;
  }
};

const previewReport = () => {
  console.log("Preview report with settings:", exportSettings.value);
  // TODO: Open preview modal or new window
};

// Initialize data on component mount
onMounted(() => {
  loadSettings();
});
</script>
