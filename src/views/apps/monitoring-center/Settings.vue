<template>
  <!--begin::Monitoring Center Settings-->
  <div class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
    <h4 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
      {{ t("appsMonitoringCenter.settings.header.title") }}
    </h4>
    <p class="m-0 text-gray-500">
      {{ t("appsMonitoringCenter.settings.header.subtitle") }}
    </p>
  </div>

  <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
    <!--begin::Monitoring Thresholds-->
    <div>
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsMonitoringCenter.settings.monitoring.title") }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveMonitoringSettings">
            <!--begin::CPU Threshold-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.monitoring.thresholds.cpu.label") }}
              </label>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.cpu.warning") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.cpu.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.warning')"
                    :class="formInputClass"
                  />
                </div>
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.cpu.critical") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.cpu.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.cpu.critical')"
                    :class="formInputClass"
                  />
                </div>
              </div>
            </div>
            <!--end::CPU Threshold-->

            <!--begin::Memory Threshold-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.monitoring.thresholds.memory.label") }}
              </label>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.memory.warning") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.memory.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.memory.warning')"
                    :class="formInputClass"
                  />
                </div>
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.memory.critical") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.memory.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.memory.critical')"
                    :class="formInputClass"
                  />
                </div>
              </div>
            </div>
            <!--end::Memory Threshold-->

            <!--begin::Storage Threshold-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.monitoring.thresholds.storage.label") }}
              </label>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.storage.warning") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.storage.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.storage.warning')"
                    :class="formInputClass"
                  />
                </div>
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.storage.critical") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.storage.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.storage.critical')"
                    :class="formInputClass"
                  />
                </div>
              </div>
            </div>
            <!--end::Storage Threshold-->

            <!--begin::Network Threshold-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.label") }}
              </label>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.warning") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.bandwidth.warning"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.warning')"
                    :class="formInputClass"
                  />
                </div>
                <div>
                  <div class="mb-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.critical") }}</div>
                  <input
                    type="number"
                    v-model="monitoringSettings.thresholds.bandwidth.critical"
                    min="1"
                    max="100"
                    :placeholder="t('appsMonitoringCenter.settings.monitoring.thresholds.bandwidth.critical')"
                    :class="formInputClass"
                  />
                </div>
              </div>
            </div>
            <!--end::Network Threshold-->

            <!--begin::Device Monitoring-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.monitoring.deviceMonitoring.title") }}
              </label>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="monitoringSettings.deviceMonitoring.cameraOfflineAlert"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.monitoring.deviceMonitoring.cameraOfflineAlert") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="monitoringSettings.deviceMonitoring.nvrHealthCheck"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.monitoring.deviceMonitoring.nvrHealthCheck") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.monitoring.deviceMonitoring.offlineTimeout.label") }}
                </label>
                <input
                  type="number"
                  v-model="monitoringSettings.deviceMonitoring.offlineTimeout"
                  min="1"
                  max="60"
                  :class="formInputClass"
                />
                <div class="mt-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.monitoring.deviceMonitoring.offlineTimeout.help") }}</div>
              </div>
            </div>
            <!--end::Device Monitoring-->

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingMonitoringSettings"
                class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="savingMonitoringSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ savingMonitoringSettings ? t("appsMonitoringCenter.settings.monitoring.actions.saving") : t("appsMonitoringCenter.settings.monitoring.actions.save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Monitoring Thresholds-->

    <!--begin::Dashboard Preferences-->
    <div>
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsMonitoringCenter.settings.dashboard.title") }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveDashboardSettings">
            <!--begin::Refresh Interval-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.label") }}
              </label>
              <select v-model="dashboardSettings.refreshInterval" :class="formInputClass">
                <option value="5">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.options.5s") }}</option>
                <option value="10">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.options.10s") }}</option>
                <option value="30">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.options.30s") }}</option>
                <option value="60">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.options.1m") }}</option>
                <option value="300">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.options.5m") }}</option>
                <option value="0">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.options.manual") }}</option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.dashboard.refreshInterval.help") }}</div>
            </div>
            <!--end::Refresh Interval-->

            <!--begin::Default Time Range-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.dashboard.defaultTimeRange.label") }}
              </label>
              <select v-model="dashboardSettings.defaultTimeRange" :class="formInputClass">
                <option value="1h">{{ t("appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.1h") }}</option>
                <option value="24h">{{ t("appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.24h") }}</option>
                <option value="7d">{{ t("appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.7d") }}</option>
                <option value="30d">{{ t("appsMonitoringCenter.settings.dashboard.defaultTimeRange.options.30d") }}</option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsMonitoringCenter.settings.dashboard.defaultTimeRange.help") }}</div>
            </div>
            <!--end::Default Time Range-->

            <!--begin::Widget Preferences-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.dashboard.widgets.title") }}
              </label>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.systemHealth"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.widgets.systemHealth") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.performanceCharts"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.widgets.performanceCharts") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.deviceStatus"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.widgets.deviceStatus") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.alertSummary"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.widgets.alertSummary") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.widgets.recentActivities"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.widgets.recentActivities") }}</span>
                </label>
              </div>
            </div>
            <!--end::Widget Preferences-->

            <!--begin::Chart Preferences-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.dashboard.chartSettings.title") }}
              </label>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.label") }}
                </label>
                <select v-model="dashboardSettings.chartSettings.defaultType" :class="formInputClass">
                  <option value="line">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.options.line") }}</option>
                  <option value="area">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.options.area") }}</option>
                  <option value="bar">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.defaultType.options.bar") }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.label") }}
                </label>
                <select v-model="dashboardSettings.chartSettings.dataPoints" :class="formInputClass">
                  <option value="20">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.20") }}</option>
                  <option value="50">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.50") }}</option>
                  <option value="100">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.100") }}</option>
                  <option value="200">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.dataPoints.options.200") }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.chartSettings.showGridLines"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.showGridLines") }}</span>
                </label>
              </div>

              <div class="mb-4">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="dashboardSettings.chartSettings.animateOnLoad"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.dashboard.chartSettings.animateOnLoad") }}</span>
                </label>
              </div>
            </div>
            <!--end::Chart Preferences-->

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingDashboardSettings"
                class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="savingDashboardSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ savingDashboardSettings ? t("appsMonitoringCenter.settings.dashboard.actions.saving") : t("appsMonitoringCenter.settings.dashboard.actions.save") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Dashboard Preferences-->
  </div>

  <!--begin::Data Export & Reporting-->
  <div class="mt-5">
    <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div class="p-6 pb-0">
        <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ t("appsMonitoringCenter.settings.reporting.title") }}
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!--begin::Automated Reports-->
          <div>
            <h5 class="mb-4 text-gray-900 dark:text-gray-100">{{ t("appsMonitoringCenter.settings.reporting.automated.title") }}</h5>

            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="reportingSettings.automated.enabled"
                />
                <span class="form-check-label font-semibold text-gray-800">
                  {{ t("appsMonitoringCenter.settings.reporting.automated.enabled") }}
                </span>
              </label>
              <div class="mt-1 text-sm text-gray-500">
                {{ t("appsMonitoringCenter.settings.reporting.automated.enabledHelp") }}
              </div>
            </div>

            <div v-if="reportingSettings.automated.enabled">
              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.reporting.automated.frequency.label") }}
                </label>
                <select v-model="reportingSettings.automated.frequency" :class="formInputClass">
                  <option value="daily">{{ t("appsMonitoringCenter.settings.reporting.automated.frequency.options.daily") }}</option>
                  <option value="weekly">{{ t("appsMonitoringCenter.settings.reporting.automated.frequency.options.weekly") }}</option>
                  <option value="monthly">{{ t("appsMonitoringCenter.settings.reporting.automated.frequency.options.monthly") }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.reporting.automated.reportTypes.label") }}
                </label>
                <div class="flex flex-col gap-2">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="reportingSettings.automated.includeSystemHealth"
                    />
                    <span class="form-check-label">{{ t("appsMonitoringCenter.settings.reporting.automated.reportTypes.systemHealth") }}</span>
                  </label>
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="reportingSettings.automated.includeAlertSummary"
                    />
                    <span class="form-check-label">{{ t("appsMonitoringCenter.settings.reporting.automated.reportTypes.alertSummary") }}</span>
                  </label>
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="reportingSettings.automated.includeDeviceStatus"
                    />
                    <span class="form-check-label">{{ t("appsMonitoringCenter.settings.reporting.automated.reportTypes.deviceStatus") }}</span>
                  </label>
                </div>
              </div>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.reporting.automated.emailRecipients.label") }}
                </label>
                <textarea
                  v-model="emailRecipientsText"
                  rows="3"
                  :placeholder="t('appsMonitoringCenter.settings.reporting.automated.emailRecipients.placeholder')"
                  :class="formInputClass"
                ></textarea>
              </div>
            </div>
          </div>
          <!--end::Automated Reports-->

          <!--begin::Manual Export-->
          <div>
            <h5 class="mb-4 text-gray-900 dark:text-gray-100">{{ t("appsMonitoringCenter.settings.reporting.manual.title") }}</h5>

            <div class="mb-4">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.reporting.manual.format.label") }}
              </label>
              <select v-model="exportSettings.format" :class="formInputClass">
                <option value="pdf">{{ t("appsMonitoringCenter.settings.reporting.manual.format.options.pdf") }}</option>
                <option value="excel">{{ t("appsMonitoringCenter.settings.reporting.manual.format.options.excel") }}</option>
                <option value="csv">{{ t("appsMonitoringCenter.settings.reporting.manual.format.options.csv") }}</option>
                <option value="json">{{ t("appsMonitoringCenter.settings.reporting.manual.format.options.json") }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.reporting.manual.dateRange.label") }}
              </label>
              <select v-model="exportSettings.dateRange" :class="formInputClass">
                <option value="24h">{{ t("appsMonitoringCenter.settings.reporting.manual.dateRange.options.24h") }}</option>
                <option value="7d">{{ t("appsMonitoringCenter.settings.reporting.manual.dateRange.options.7d") }}</option>
                <option value="30d">{{ t("appsMonitoringCenter.settings.reporting.manual.dateRange.options.30d") }}</option>
                <option value="custom">{{ t("appsMonitoringCenter.settings.reporting.manual.dateRange.options.custom") }}</option>
              </select>
            </div>

            <div v-if="exportSettings.dateRange === 'custom'" class="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.reporting.manual.customRange.startDate") }}
                </label>
                <input type="date" v-model="exportSettings.customStartDate" :class="formInputClass" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsMonitoringCenter.settings.reporting.manual.customRange.endDate") }}
                </label>
                <input type="date" v-model="exportSettings.customEndDate" :class="formInputClass" />
              </div>
            </div>

            <div class="mb-4">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsMonitoringCenter.settings.reporting.manual.includeData.label") }}
              </label>
              <div class="flex flex-col gap-2">
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="exportSettings.includePerformanceData"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.reporting.manual.includeData.performanceMetrics") }}</span>
                </label>
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="exportSettings.includeAlertData"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.reporting.manual.includeData.alertHistory") }}</span>
                </label>
                <label class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="exportSettings.includeDeviceData"
                  />
                  <span class="form-check-label">{{ t("appsMonitoringCenter.settings.reporting.manual.includeData.deviceLogs") }}</span>
                </label>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                @click="exportData"
                :disabled="exporting"
                class="inline-flex items-center gap-2 rounded-md bg-success px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-success-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="exporting" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <i v-else class="ki-duotone ki-download fs-6 mr-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ exporting ? t("appsMonitoringCenter.settings.reporting.manual.actions.exporting") : t("appsMonitoringCenter.settings.reporting.manual.actions.export") }}
              </button>
              <button
                type="button"
                @click="previewReport"
                class="inline-flex items-center gap-2 rounded-md bg-primary-light px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98]"
              >
                <i class="ki-duotone ki-eye fs-6 mr-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ t("appsMonitoringCenter.settings.reporting.manual.actions.preview") }}
              </button>
            </div>
          </div>
          <!--end::Manual Export-->
        </div>

        <div class="mt-5 flex justify-end">
          <button
            type="button"
            @click="saveReportingSettings"
            :disabled="savingReportingSettings"
            class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="savingReportingSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ savingReportingSettings ? t("appsMonitoringCenter.settings.reporting.actions.saving") : t("appsMonitoringCenter.settings.reporting.actions.save") }}
          </button>
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
import { formInputClass } from "@/core/helpers/badge";

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
