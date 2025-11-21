<template>
  <!--begin::Monitoring Center Settings-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">{{ t('appsMonitoringCenter.settings.header.title') }}</h4>
          <p class="text-muted mb-0">
            {{ t('appsMonitoringCenter.settings.header.subtitle') }}
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
            <h3 class="fw-bold">{{ t('appsMonitoringCenter.settings.monitoring.title') }}</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveMonitoringSettings">
            <!--begin::CPU Threshold-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.label') }}</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.warning') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.cpu.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.warning')"
                  />
                </div>
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.critical') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.cpu.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.critical')"
                  />
                </div>
              </div>
            </div>
            <!--end::CPU Threshold-->

            <!--begin::Memory Threshold-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.memory.label') }}</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.memory.warning') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.memory.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.memory.warning')"
                  />
                </div>
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.memory.critical') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.memory.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.memory.critical')"
                  />
                </div>
              </div>
            </div>
            <!--end::Memory Threshold-->

            <!--begin::Storage Threshold-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.storage.label') }}</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.storage.warning') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.storage.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.storage.warning')"
                  />
                </div>
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.storage.critical') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.storage.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.storage.critical')"
                  />
                </div>
              </div>
            </div>
            <!--end::Storage Threshold-->

            <!--begin::Network Threshold-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.label') }}</label>
              <div class="row">
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.warning') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.bandwidth.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.warning')"
                  />
                </div>
                <div class="col-md-6">
                  <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.critical') }}</div>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="monitoringSettings.thresholds.bandwidth.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.critical')"
                  />
                </div>
              </div>
            </div>
            <!--end::Network Threshold-->

            <!--begin::Device Monitoring-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.monitoring.deviceMonitoring.title') }}</label>
              
              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="monitoringSettings.deviceMonitoring.cameraOfflineAlert"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.monitoring.deviceMonitoring.cameraOfflineAlert') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="monitoringSettings.deviceMonitoring.nvrHealthCheck"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.monitoring.deviceMonitoring.nvrHealthCheck') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-label">{{ t('appsMonitoringCenter.settings.monitoring.deviceMonitoring.offlineTimeout.label') }}</label>
                <input
                  type="number"
                  class="form-control form-control-solid"
                  v-model="monitoringSettings.deviceMonitoring.offlineTimeout"
                  min="1"
                  max="60"
                />
                <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.monitoring.deviceMonitoring.offlineTimeout.help') }}</div>
              </div>
            </div>
            <!--end::Device Monitoring-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingMonitoringSettings">
                <span v-if="savingMonitoringSettings" class="spinner-border spinner-border-sm me-2"></span>
                {{ savingMonitoringSettings ? t('appsMonitoringCenter.settings.monitoring.actions.saving') : t('appsMonitoringCenter.settings.monitoring.actions.save') }}
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
            <h3 class="fw-bold">{{ t('appsMonitoringCenter.settings.dashboard.title') }}</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveDashboardSettings">
            <!--begin::Refresh Interval-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.label') }}</label>
              <select
                v-model="dashboardSettings.refreshInterval"
                class="form-select form-select-solid"
              >
                <option value="5">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.options.5s') }}</option>
                <option value="10">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.options.10s') }}</option>
                <option value="30">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.options.30s') }}</option>
                <option value="60">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.options.1m') }}</option>
                <option value="300">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.options.5m') }}</option>
                <option value="0">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.options.manual') }}</option>
              </select>
              <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.dashboard.refreshInterval.help') }}</div>
            </div>
            <!--end::Refresh Interval-->

            <!--begin::Default Time Range-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.dashboard.defaultTimeRange.label') }}</label>
              <select
                v-model="dashboardSettings.defaultTimeRange"
                class="form-select form-select-solid"
              >
                <option value="1h">{{ t('appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.1h') }}</option>
                <option value="24h">{{ t('appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.24h') }}</option>
                <option value="7d">{{ t('appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.7d') }}</option>
                <option value="30d">{{ t('appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.30d') }}</option>
              </select>
              <div class="text-muted fs-7">{{ t('appsMonitoringCenter.settings.dashboard.defaultTimeRange.help') }}</div>
            </div>
            <!--end::Default Time Range-->

            <!--begin::Widget Preferences-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.dashboard.widgets.title') }}</label>
              
              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.systemHealth"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.widgets.systemHealth') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.performanceCharts"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.widgets.performanceCharts') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.deviceStatus"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.widgets.deviceStatus') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.alertSummary"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.widgets.alertSummary') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.recentActivities"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.widgets.recentActivities') }}</span>
                </label>
              </div>
            </div>
            <!--end::Widget Preferences-->

            <!--begin::Chart Preferences-->
            <div class="mb-7">
              <label class="form-label">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.title') }}</label>
              
              <div class="mb-4">
                <label class="form-label">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.label') }}</label>
                <select
                  v-model="dashboardSettings.chartSettings.defaultType"
                  class="form-select form-select-solid"
                >
                  <option value="line">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.options.line') }}</option>
                  <option value="area">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.options.area') }}</option>
                  <option value="bar">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.options.bar') }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.label') }}</label>
                <select
                  v-model="dashboardSettings.chartSettings.dataPoints"
                  class="form-select form-select-solid"
                >
                  <option value="20">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.20') }}</option>
                  <option value="50">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.50') }}</option>
                  <option value="100">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.100') }}</option>
                  <option value="200">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.200') }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.chartSettings.showGridLines"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.showGridLines') }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.chartSettings.animateOnLoad"
                  />
                  <span class="form-check-label">{{ t('appsMonitoringCenter.settings.dashboard.chartSettings.animateOnLoad') }}</span>
                </label>
              </div>
            </div>
            <!--end::Chart Preferences-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingDashboardSettings">
                <span v-if="savingDashboardSettings" class="spinner-border spinner-border-sm me-2"></span>
                {{ savingDashboardSettings ? t('appsMonitoringCenter.settings.dashboard.actions.saving') : t('appsMonitoringCenter.settings.dashboard.actions.save') }}
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
            <h3 class="fw-bold">{{ t('appsMonitoringCenter.settings.reporting.title') }}</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <!--begin::Automated Reports-->
            <div class="col-md-6">
              <h5 class="mb-4">{{ t('appsMonitoringCenter.settings.reporting.automated.title') }}</h5>
              
              <div class="mb-7">
                <label class="form-check form-switch form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="reportingSettings.automated.enabled"
                  />
                  <span class="form-check-label fw-semibold text-gray-800">
                    {{ t('appsMonitoringCenter.settings.reporting.automated.enabled') }}
                  </span>
                </label>
                <div class="text-muted fs-7">
                  {{ t('appsMonitoringCenter.settings.reporting.automated.enabledHelp') }}
                </div>
              </div>

              <div v-if="reportingSettings.automated.enabled">
                <div class="mb-4">
                  <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.automated.frequency.label') }}</label>
                  <select
                    v-model="reportingSettings.automated.frequency"
                    class="form-select form-select-solid"
                  >
                    <option value="daily">{{ t('appsMonitoringCenter.settings.reporting.automated.frequency.options.daily') }}</option>
                    <option value="weekly">{{ t('appsMonitoringCenter.settings.reporting.automated.frequency.options.weekly') }}</option>
                    <option value="monthly">{{ t('appsMonitoringCenter.settings.reporting.automated.frequency.options.monthly') }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.automated.reportTypes.label') }}</label>
                  <div class="d-flex flex-column gap-2">
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="reportingSettings.automated.includeSystemHealth"
                      />
                      <span class="form-check-label">{{ t('appsMonitoringCenter.settings.reporting.automated.reportTypes.systemHealth') }}</span>
                    </label>
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="reportingSettings.automated.includeAlertSummary"
                      />
                      <span class="form-check-label">{{ t('appsMonitoringCenter.settings.reporting.automated.reportTypes.alertSummary') }}</span>
                    </label>
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="reportingSettings.automated.includeDeviceStatus"
                      />
                      <span class="form-check-label">{{ t('appsMonitoringCenter.settings.reporting.automated.reportTypes.deviceStatus') }}</span>
                    </label>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.automated.emailRecipients.label') }}</label>
                  <textarea
                    v-model="emailRecipientsText"
                    class="form-control form-control-solid"
                    rows="3"
                    :placeholder="t('appsMonitoringCenter.settings.reporting.automated.emailRecipients.placeholder')"
                  ></textarea>
                </div>
              </div>
            </div>
            <!--end::Automated Reports-->

            <!--begin::Manual Export-->
            <div class="col-md-6">
              <h5 class="mb-4">{{ t('appsMonitoringCenter.settings.reporting.manual.title') }}</h5>
              
              <div class="mb-4">
                <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.manual.format.label') }}</label>
                <select
                  v-model="exportSettings.format"
                  class="form-select form-select-solid"
                >
                  <option value="pdf">{{ t('appsMonitoringCenter.settings.reporting.manual.format.options.pdf') }}</option>
                  <option value="excel">{{ t('appsMonitoringCenter.settings.reporting.manual.format.options.excel') }}</option>
                  <option value="csv">{{ t('appsMonitoringCenter.settings.reporting.manual.format.options.csv') }}</option>
                  <option value="json">{{ t('appsMonitoringCenter.settings.reporting.manual.format.options.json') }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.manual.dateRange.label') }}</label>
                <select
                  v-model="exportSettings.dateRange"
                  class="form-select form-select-solid"
                >
                  <option value="24h">{{ t('appsMonitoringCenter.settings.reporting.manual.dateRange.options.24h') }}</option>
                  <option value="7d">{{ t('appsMonitoringCenter.settings.reporting.manual.dateRange.options.7d') }}</option>
                  <option value="30d">{{ t('appsMonitoringCenter.settings.reporting.manual.dateRange.options.30d') }}</option>
                  <option value="custom">{{ t('appsMonitoringCenter.settings.reporting.manual.dateRange.options.custom') }}</option>
                </select>
              </div>

              <div v-if="exportSettings.dateRange === 'custom'" class="row mb-4">
                <div class="col-6">
                  <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.manual.customRange.startDate') }}</label>
                  <input
                    type="date"
                    v-model="exportSettings.customStartDate"
                    class="form-control form-control-solid"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.manual.customRange.endDate') }}</label>
                  <input
                    type="date"
                    v-model="exportSettings.customEndDate"
                    class="form-control form-control-solid"
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label">{{ t('appsMonitoringCenter.settings.reporting.manual.includeData.label') }}</label>
                <div class="d-flex flex-column gap-2">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="exportSettings.includePerformanceData"
                    />
                    <span class="form-check-label">{{ t('appsMonitoringCenter.settings.reporting.manual.includeData.performanceMetrics') }}</span>
                  </label>
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="exportSettings.includeAlertData"
                    />
                    <span class="form-check-label">{{ t('appsMonitoringCenter.settings.reporting.manual.includeData.alertHistory') }}</span>
                  </label>
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="exportSettings.includeDeviceData"
                    />
                    <span class="form-check-label">{{ t('appsMonitoringCenter.settings.reporting.manual.includeData.deviceLogs') }}</span>
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
                  {{ exporting ? t('appsMonitoringCenter.settings.reporting.manual.actions.exporting') : t('appsMonitoringCenter.settings.reporting.manual.actions.export') }}
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
                  {{ t('appsMonitoringCenter.settings.reporting.manual.actions.preview') }}
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
              {{ savingReportingSettings ? t('appsMonitoringCenter.settings.reporting.actions.saving') : t('appsMonitoringCenter.settings.reporting.actions.save') }}
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
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";

const { t } = useI18n();

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
