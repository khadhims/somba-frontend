<template>
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!-- App page -->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!-- App main -->
      <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
        <!-- Content wrapper -->
        <div class="d-flex flex-column flex-column-fluid">
          <!-- Toolbar -->
          <div id="kt_app_toolbar" class="app-toolbar py-3 py-lg-6">
            <div id="kt_app_toolbar_container" class="app-container container-xxl d-flex flex-stack">
              <div class="d-flex align-items-center gap-2 gap-lg-3">
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-abstract-26 fs-3 text-primary text-white-dark me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span class="text-muted fs-7">{{ t('dashboard.general.lastUpdated') }}: {{ new Date().toLocaleString('id-ID') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div id="kt_app_content" class="app-content flex-column-fluid">
            <div id="kt_app_content_container" class="app-container container-xxl">
              
              <!-- Section 1: Proses Pelaksanaan Harian -->
              <div class="row g-5 g-xl-8 mb-8 mt-6">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header border-0 pt-6">
                      <div class="card-title">
                        <div class="d-flex align-items-center position-relative my-1">
                          <i class="ki-duotone ki-abstract-26 fs-3 position-absolute ms-4 text-info text-white-dark">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <h3 class="fw-bold ms-12 text-dark text-white-dark">{{ t('dashboard.sections.dailyProcess.title') }}</h3>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <span class="text-muted fs-7">{{ t('dashboard.sections.dailyProcess.subtitle') }}</span>
                      </div>
                    </div>
                    <div class="card-body" style="padding: 2rem 1.5rem 1rem 1.5rem;">
                      <!-- Loading state -->
                      <div v-if="loading" class="text-center py-8">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-3 text-muted">{{ t('dashboard.general.loading') }}</p>
                      </div>
                      
                      <!-- Error state -->
                      <div v-else-if="error" class="alert alert-warning" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        {{ t('dashboard.general.errorLoading') }}: {{ error }}
                        <button class="btn btn-sm btn-outline-primary ms-3" @click="fetchLiveActivities">
                          <i class="fas fa-refresh me-1"></i>{{ t('dashboard.general.retry') }}
                        </button>
                      </div>
                      
                      <!-- Activities data -->
                      <div v-else class="d-flex overflow-x-auto py-2" style="gap: 1rem;">
                        <!-- Loop untuk menampilkan Card5 dengan data dari API -->
                        <Card5
                          v-for="activity in liveActivities"
                          :key="activity.activity_uid"
                          :activity-name="getTranslatedActivityName(activity.activity_name)"
                          :last-activity-timestamp="activity.last_activity_timestamp"
                          :currently-active="activity.currently_active"
                          :icon="getActivityConfig(activity.activity_name).icon"
                          :bg-color="getActivityConfig(activity.activity_name).bgColor"
                        />
                        
                        <!-- Empty state -->
                        <div v-if="liveActivities.length === 0" class="col-12 text-center py-8">
                          <i class="fas fa-inbox fs-1 text-muted mb-3"></i>
                          <h5 class="text-muted">{{ t('dashboard.general.noData') }}</h5>
                          <p class="text-muted">{{ t('dashboard.general.noDataDescription') }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Sistem Monitoring -->
              <div class="row g-5 g-xl-8 mb-8">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header border-0 pt-6">
                      <div class="card-title">
                        <div class="d-flex align-items-center position-relative my-1">
                          <i class="ki-duotone ki-chart-simple fs-3 position-absolute ms-4 text-warning text-white-dark">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                          </i>
                          <h3 class="fw-bold ms-12 text-dark text-white-dark">{{ t('dashboard.sections.systemMonitoring.title') }}</h3>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <span class="text-muted fs-7">{{ t('dashboard.sections.systemMonitoring.subtitle') }}</span>
                      </div>
                    </div>
                    <div class="card-body" style="padding: 2rem 1.5rem 1rem 1.5rem;">
                      <div class="d-flex" style="gap: 0.5rem;">
                        <!-- Loop untuk menampilkan Sistem Monitoring menggunakan Card5 -->
                        <MonitorCard5
                          v-for="monitor in sistemMonitoring"
                          :key="monitor.activity_uid"
                          :activity-name="monitor.activity_name"
                          :icon="monitor.icon"
                          :bg-color="monitor.bgColor"
                          :monitor-value="monitor.value"
                          :monitor-description="monitor.description"
                          :hide-status="true"
                          :hide-description="false"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 3: Menu Navigasi -->
              <div class="row g-5 g-xl-8 mb-8">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header border-0 pt-6">
                      <div class="card-title">
                        <div class="d-flex align-items-center position-relative my-1">
                          <i class="ki-duotone ki-element-11 fs-3 position-absolute ms-4 text-info text-white-dark">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                          </i>
                          <h3 class="fw-bold ms-12 text-dark text-white-dark">{{ t('dashboard.sections.navigation.title') }}</h3>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <span class="text-muted fs-7">{{ t('dashboard.sections.navigation.subtitle') }}</span>
                      </div>
                    </div>
                    <div class="card-body" style="padding: 2rem 1.5rem 1rem 1.5rem;">
                      <div class="d-flex overflow-x-auto py-2" style="gap: 1rem;">
                        <!-- Loop untuk menampilkan Navigation Apps menggunakan Card5 -->
                        <Card5
                          v-for="app in navigationApps"
                          :key="app.activity_uid"
                          :activity-name="app.activity_name"
                          :icon="app.icon"
                          :bg-color="app.bgColor"
                          :hide-status="true"
                          :hide-description="true"
                          @click="navigateToApp(app.route)"
                          :title="app.description"
                          style="cursor: pointer;"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 4: Real Time Report -->
              <div class="row g-5 g-xl-8 mb-8">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header border-0 pt-6">
                      <div class="card-title">
                        <div class="d-flex align-items-center position-relative my-1">
                          <i class="ki-duotone ki-chart-line fs-3 position-absolute ms-4 text-primary text-white-dark">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <h3 class="fw-bold ms-12 text-dark text-white-dark">{{ t('dashboard.sections.realTimeReport.title') }}</h3>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <span class="text-muted fs-7">{{ t('dashboard.sections.realTimeReport.subtitle') }}</span>
                      </div>
                    </div>
                    <div class="card-body py-4">
                      <!-- Real Time Report Component -->
                      <RealTimeReport
                        :title="t('dashboard.sections.realTimeReport.componentTitle')"
                        :subtitle="t('dashboard.sections.realTimeReport.componentSubtitle')"
                        :showFilters="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Card5 from '@/components/cards/Card5.vue';
import MonitorCard5 from '@/components/cards/Card5.vue';
import RealTimeReport from '@/components/dashboard/RealTimeReport.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';

// Reactive data untuk live activities dari API
const liveActivities = ref([]);
const loading = ref(true);
const error = ref(null);

// Reactive data untuk sistem monitoring dari mockup
const sistemMonitoring = ref([]);

// Reactive data untuk navigation apps
const navigationApps = ref([]);

// Router setup
const router = useRouter();

// I18n setup
const { t } = useI18n();

// Site UID untuk permintaan live-activities (gunakan env atau fallback demo)
const activeSiteUid = import.meta.env.VITE_ACTIVE_SITE_UID || 'site-demo';

// Mapping icon dan warna untuk setiap aktivitas
const activityConfig = {
  'preparation': { icon: 'fas fa-list-alt', bgColor: '#2196f3' },
  'cooking': { icon: 'fas fa-fire', bgColor: '#ff5722' },
  'portioning': { icon: 'fas fa-utensils', bgColor: '#ff9800' },
  'delivery': { icon: 'fas fa-truck', bgColor: '#4caf50' },
  'collectTray': { icon: 'fas fa-hand-paper', bgColor: '#9c27b0' },
  'washTray': { icon: 'fas fa-soap', bgColor: '#00bcd4' },
  'completed': { icon: 'fas fa-check-circle', bgColor: '#8bc34a' },
  // Legacy Indonesian names (for backward compatibility)
  'Persiapan': { key: 'preparation', icon: 'fas fa-list-alt', bgColor: '#2196f3' },
  'Masak': { key: 'cooking', icon: 'fas fa-fire', bgColor: '#ff5722' },
  'Pemorsian': { key: 'portioning', icon: 'fas fa-utensils', bgColor: '#ff9800' },
  'Pengiriman': { key: 'delivery', icon: 'fas fa-truck', bgColor: '#4caf50' },
  'Ambil Nampan': { key: 'collectTray', icon: 'fas fa-hand-paper', bgColor: '#9c27b0' },
  'Cuci Nampan': { key: 'washTray', icon: 'fas fa-soap', bgColor: '#00bcd4' },
  'Selesai': { key: 'completed', icon: 'fas fa-check-circle', bgColor: '#8bc34a' },
  // Default fallback
  'default': { icon: 'fas fa-tasks', bgColor: '#607d8b' }
};


// Function untuk load sistem monitoring mockup data
const loadSistemMonitoringData = () => {
  // Mockup data untuk sistem monitoring (format sesuai Card5)
  sistemMonitoring.value = [
    {
      activity_uid: 'monitor_1',
      activity_name: t('dashboard.monitoring.totalCameras.title'),
      last_activity_timestamp: new Date().toISOString(),
      currently_active: true,
      icon: 'fas fa-video',
      bgColor: '#2196f3',
      value: 9,
      description: t('dashboard.monitoring.totalCameras.description')
    },
    {
      activity_uid: 'monitor_2',
      activity_name: t('dashboard.monitoring.activeCameras.title'),
      last_activity_timestamp: new Date().toISOString(),
      currently_active: true,
      icon: 'fas fa-check',
      bgColor: '#4caf50',
      value: 9,
      description: t('dashboard.monitoring.activeCameras.description')
    },
    {
      activity_uid: 'monitor_3',
      activity_name: t('dashboard.monitoring.inactiveCameras.title'),
      last_activity_timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(),
      currently_active: false,
      icon: 'fas fa-times',
      bgColor: '#f44336',
      value: 0,
      description: t('dashboard.monitoring.inactiveCameras.description')
    },
    {
      activity_uid: 'monitor_4',
      activity_name: t('dashboard.monitoring.totalSppg.title'),
      last_activity_timestamp: new Date().toISOString(),
      currently_active: true,
      icon: 'fas fa-chart-bar',
      bgColor: '#9c27b0',
      value: 1,
      description: t('dashboard.monitoring.totalSppg.description')
    },
    {
      activity_uid: 'monitor_5',
      activity_name: t('dashboard.monitoring.distributionLocations.title'),
      last_activity_timestamp: new Date().toISOString(),
      currently_active: true,
      icon: 'fas fa-home',
      bgColor: '#ff9800',
      value: 8,
      description: t('dashboard.monitoring.distributionLocations.description')
    }
  ];
};

// Function untuk load navigation apps data
const loadNavigationAppsData = () => {
  // Data apps berdasarkan gambar yang diberikan
  navigationApps.value = [
    {
      activity_uid: 'app_1',
      activity_name: t('dashboard.navigation.liveView.title'),
      route: t('dashboard.routes.liveView'),
      icon: 'fas fa-video',
      bgColor: '#2196f3',
      description: t('dashboard.navigation.liveView.description')
    },
    {
      activity_uid: 'app_2', 
      activity_name: t('dashboard.navigation.events.title'),
      route: t('dashboard.routes.events'),
      icon: 'fas fa-exclamation-triangle',
      bgColor: '#f44336',
      description: t('dashboard.navigation.events.description')
    },
    {
      activity_uid: 'app_3',
      activity_name: t('dashboard.navigation.alerts.title'),
      route: t('dashboard.routes.alerts'),
      icon: 'fas fa-bell',
      bgColor: '#ff9800',
      description: t('dashboard.navigation.alerts.description')
    },
    {
      activity_uid: 'app_4',
      activity_name: t('dashboard.navigation.dailyReport.title'),
      route: t('dashboard.routes.dailyReport'),
      icon: 'fas fa-chart-line',
      bgColor: '#4caf50',
      description: t('dashboard.navigation.dailyReport.description')
    },
    {
      activity_uid: 'app_5',
      activity_name: t('dashboard.navigation.recording.title'),
      route: t('dashboard.routes.recording'),
      icon: 'fas fa-play-circle',
      bgColor: '#9c27b0',
      description: t('dashboard.navigation.recording.description')
    },
    {
      activity_uid: 'app_6',
      activity_name: t('dashboard.navigation.monitoringCenter.title'),
      route: t('dashboard.routes.monitoringCenter'),
      icon: 'fas fa-desktop',
      bgColor: '#00bcd4',
      description: t('dashboard.navigation.monitoringCenter.description')
    }
  ];
};

// Function untuk navigasi ke apps
const navigateToApp = (route) => {
  // Navigasi menggunakan Vue Router
  router.push(route);
};

// Load mockup data untuk live activities (digunakan sebagai fallback)
const loadMockupData = async ({ manageLoading = true } = {}) => {
  try {
    if (manageLoading) {
      loading.value = true;
    }

    const module = await import('@/assets/mockupData/dashboard/live_activity.json');
    const mockData = module.default || module;

    liveActivities.value = Array.isArray(mockData) ? mockData : [];
    error.value = null;
  } catch (mockError) {
    console.error('[Dashboard] Failed to load mock live activities:', mockError);
    liveActivities.value = [];
    error.value = mockError?.message || 'Tidak dapat memuat data demo.';
  } finally {
    if (manageLoading) {
      loading.value = false;
    }
  }
};

// Fetch live activities dari API dengan fallback ke mockup data
const fetchLiveActivities = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await ApiService.get(`/sites/${activeSiteUid}/live-activities`, {});

    if (response.status !== 200) {
      throw new Error('Gagal mengambil data live activities');
    }

    const data = response.data;

    if (!Array.isArray(data)) {
      throw new Error('Format data live activities tidak valid');
    }

    liveActivities.value = data;
  } catch (err) {
    console.warn('[Dashboard] Falling back to mock live activities data:', err);
    await loadMockupData({ manageLoading: false });
  } finally {
    loading.value = false;
  }
};

// Get activity configuration (icon & color)
const getActivityConfig = (activityName) => {
  const config = activityConfig[activityName];
  if (config && config.key) {
    // If it has a key property, use the key to get the config
    return activityConfig[config.key] || activityConfig.default;
  }
  return config || activityConfig.default;
};

// Get translated activity name
const getTranslatedActivityName = (activityName) => {
  const config = activityConfig[activityName];
  if (config && config.key) {
    return t(`dashboard.activities.${config.key}`);
  }
  // For direct key matches
  const translationKey = `dashboard.activities.${activityName}`;
  return t(translationKey, activityName); // Fallback to original name if translation not found
};

// Mount lifecycle
onMounted(() => {
  fetchLiveActivities(); // Utamakan API, fallback otomatis ke mock data
  loadSistemMonitoringData();
  loadNavigationAppsData();
});
</script>

<style scoped>
.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.symbol {
  transition: all 0.2s ease-in-out;
}

.card:hover .symbol {
  transform: scale(1.05);
}

/* Responsive grid adjustments */
@media (max-width: 1400px) {
  .col-xxl-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
  }
}

@media (max-width: 1200px) {
  .col-xl-2 {
    flex: 0 0 auto;
    width: 20%;
  }
}

@media (max-width: 992px) {
  .col-lg-2 {
    flex: 0 0 auto;
    width: 20%;
  }
  .col-lg-3 {
    flex: 0 0 auto;
    width: 25%;
  }
}

@media (max-width: 768px) {
  .col-md-4 {
    flex: 0 0 auto;
    width: 50%;
  }
}

@media (max-width: 576px) {
  .col-6 {
    flex: 0 0 auto;
    width: 100%;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease-out;
}

/* Dark theme support */
[data-bs-theme="dark"] .text-white-dark,
.dark .text-white-dark,
.app-dark .text-white-dark {
  color: #ffffff !important;
}

/* Ensure icons are bright in dark theme */
[data-bs-theme="dark"] .text-primary,
.dark .text-primary,
.app-dark .text-primary {
  color: #3b82f6 !important;
}

[data-bs-theme="dark"] .text-info,
.dark .text-info,
.app-dark .text-info {
  color: #06b6d4 !important;
}

[data-bs-theme="dark"] .text-warning,
.dark .text-warning,
.app-dark .text-warning {
  color: #f59e0b !important;
}

[data-bs-theme="dark"] .text-success,
.dark .text-success,
.app-dark .text-success {
  color: #10b981 !important;
}

[data-bs-theme="dark"] .text-danger,
.dark .text-danger,
.app-dark .text-danger {
  color: #ef4444 !important;
}
</style>
