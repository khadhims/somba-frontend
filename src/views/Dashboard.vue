<template>
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!-- App page -->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!-- App main -->
      <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
        <!-- Content wrapper -->
        <div class="d-flex flex-column flex-column-fluid">
          <!-- Content -->
          <div id="kt_app_content" class="app-content flex-column-fluid">
            <div id="kt_app_content_container" class="app-container container-xxl">
              
              <!-- Main Dashboard Card - Gabungan 3 Section -->
              <div class="row g-3 g-xl-4 mb-3">
                <div class="col-12">
                  <div class="card dashboard-main-card">
                    
                    <!-- Section 1: Proses Pelaksanaan Harian -->
                    <div class="card-header border-0 pt-3 pb-3">
                      <div class="card-title">
                        <div class="d-flex flex-column">
                          <h3 class="fw-bold text-dark text-white-dark fs-5 mb-2">{{ t('dashboard.sections.dailyProcess.title') }}</h3>
                          <div class="d-flex align-items-center gap-3">
                            <span class="badge badge-light-primary fs-8">
                              Data per: {{ currentDate }}
                            </span>
                            <span class="text-muted fs-8 d-flex align-items-center">
                              <i class="ki-duotone ki-arrows-circle fs-6 me-1 text-primary">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
                              Otomatis update tiap {{ autoUpdateInterval }} menit
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <!-- Dropdown Pemilihan Lokasi -->
                        <select 
                          v-model="selectedSite" 
                          @change="onSiteChange"
                          class="form-select form-select-sm w-auto"
                          style="min-width: 200px;"
                        >
                          <option 
                            v-for="site in availableSites" 
                            :key="site.uid" 
                            :value="site.uid"
                          >
                            <i class="ki-duotone ki-geolocation fs-6 me-1"></i>
                            {{ site.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="card-body position-relative" style="padding: 1rem 1rem 1.5rem 1rem;">
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
                      
                      <!-- Activities carousel -->
                      <div v-else class="activities-carousel-wrapper">
                        <!-- Carousel container -->
                        <div 
                          ref="carouselContainer"
                          class="activities-carousel"
                          @mousedown="handleDragStart"
                          @mousemove="handleDragMove"
                          @mouseup="handleDragEnd"
                          @mouseleave="handleDragEnd"
                          @touchstart="handleTouchStart"
                          @touchmove="handleTouchMove"
                          @touchend="handleTouchEnd"
                        >
                          <div 
                            class="activities-carousel-track"
                            :style="{ transform: `translateX(-${currentScrollIndex * scrollStep}%)` }"
                          >
                            <!-- Loop untuk menampilkan Card5 dengan data dari API -->
                            <div 
                              v-for="activity in liveActivities"
                              :key="activity.activity_uid"
                              class="carousel-item-wrapper"
                            >
                              <Card5
                                :activity-name="getTranslatedActivityName(activity.activity_name)"
                                :last-activity-timestamp="activity.last_activity_timestamp"
                                :currently-active="activity.currently_active"
                                :icon="getActivityConfig(activity.activity_name).icon"
                                :bg-color="getActivityConfig(activity.activity_name).bgColor"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <!-- Pagination dots -->
                        <div v-if="liveActivities.length > cardsPerView" class="carousel-pagination">
                          <button
                            v-for="index in totalPages"
                            :key="index"
                            class="pagination-dot"
                            :class="{ active: currentScrollIndex === index - 1 }"
                            @click="scrollToPage(index - 1)"
                          ></button>
                        </div>
                        
                        <!-- Empty state -->
                        <div v-if="liveActivities.length === 0" class="col-12 text-center py-8">
                          <i class="fas fa-inbox fs-1 text-muted mb-3"></i>
                          <h5 class="text-muted">{{ t('dashboard.general.noData') }}</h5>
                          <p class="text-muted">{{ t('dashboard.general.noDataDescription') }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Divider -->
                    <div class="separator separator-dashed my-3"></div>

                    <!-- Section 2: Sistem Monitoring -->
                    <div class="card-body" style="padding: 1rem;">
                      <div class="d-flex flex-wrap" style="gap: 0.5rem;">
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

                    <!-- Divider -->
                    <div class="separator separator-dashed my-3"></div>

                    <!-- Section 3: Real Time Report -->
                    <div class="card-header border-0 pt-3 pb-2">
                      <div class="card-title">
                        <div class="d-flex align-items-center position-relative my-0">
                          <i class="ki-duotone ki-chart-line fs-4 position-absolute ms-3 text-primary text-white-dark">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          <h3 class="fw-bold ms-10 text-dark text-white-dark fs-5 mb-0">{{ t('dashboard.sections.realTimeReport.title') }}</h3>
                        </div>
                      </div>
                      <div class="card-toolbar">
                        <span class="text-muted fs-8">{{ t('dashboard.sections.realTimeReport.subtitle') }}</span>
                      </div>
                    </div>
                    <div class="card-body py-3">
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';

// Reactive data untuk live activities dari API
const liveActivities = ref([]);
const loading = ref(true);
const error = ref(null);

// Carousel state
const carouselContainer = ref(null);
const currentScrollIndex = ref(0);
const cardsPerView = ref(4); // Default cards visible at once
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const dragThreshold = 50; // Minimum drag distance to trigger scroll

// Reactive data untuk sistem monitoring dari mockup
const sistemMonitoring = ref([]);

// Reactive data untuk navigation apps
const navigationApps = ref([]);

// Router setup
const router = useRouter();

// I18n setup
const { t } = useI18n();

// Site selection and header info
const selectedSite = ref('');
const availableSites = ref([
  { uid: 'sppg-tanah-sereal-bogor', name: 'SPPG Tanah Sereal Bogor' },
  { uid: 'sppg-jakarta-pusat', name: 'SPPG Jakarta Pusat' },
  { uid: 'sppg-bandung', name: 'SPPG Bandung' },
  { uid: 'sppg-surabaya', name: 'SPPG Surabaya' },
]);

// Current date and auto update info
const currentDate = computed(() => {
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
});

const autoUpdateInterval = ref(2);

// Site UID untuk permintaan live-activities (gunakan env atau fallback demo)
const activeSiteUid = computed(() => selectedSite.value || import.meta.env.VITE_ACTIVE_SITE_UID || 'site-demo');

// Function to handle site change
const onSiteChange = () => {
  console.log('Site changed to:', selectedSite.value);
  // Reload data when site changes
  fetchLiveActivities();
  loadSistemMonitoringData();
};

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

// Computed properties for carousel
const scrollStep = computed(() => {
  return 100 / cardsPerView.value;
});

const maxScrollIndex = computed(() => {
  return Math.max(0, liveActivities.value.length - cardsPerView.value);
});

const totalPages = computed(() => {
  return Math.ceil(liveActivities.value.length / cardsPerView.value);
});

// Carousel navigation functions
const scrollCarousel = (direction) => {
  if (direction === 'next' && currentScrollIndex.value < maxScrollIndex.value) {
    currentScrollIndex.value++;
  } else if (direction === 'prev' && currentScrollIndex.value > 0) {
    currentScrollIndex.value--;
  }
};

const scrollToPage = (pageIndex) => {
  currentScrollIndex.value = Math.min(pageIndex, maxScrollIndex.value);
};

// Touch and drag handlers
const handleDragStart = (e) => {
  isDragging.value = true;
  startX.value = e.pageX;
  currentX.value = e.pageX;
};

const handleDragMove = (e) => {
  if (!isDragging.value) return;
  currentX.value = e.pageX;
};

const handleDragEnd = () => {
  if (!isDragging.value) return;
  
  const diff = startX.value - currentX.value;
  
  if (Math.abs(diff) > dragThreshold) {
    if (diff > 0) {
      scrollCarousel('next');
    } else {
      scrollCarousel('prev');
    }
  }
  
  isDragging.value = false;
};

const handleTouchStart = (e) => {
  startX.value = e.touches[0].pageX;
  currentX.value = e.touches[0].pageX;
};

const handleTouchMove = (e) => {
  currentX.value = e.touches[0].pageX;
};

const handleTouchEnd = () => {
  const diff = startX.value - currentX.value;
  
  if (Math.abs(diff) > dragThreshold) {
    if (diff > 0) {
      scrollCarousel('next');
    } else {
      scrollCarousel('prev');
    }
  }
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
    const response = await ApiService.get(`/sites/${activeSiteUid.value}/live-activities`, {});

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

// Update cards per view based on window size
const updateCardsPerView = () => {
  const width = window.innerWidth;
  if (width < 577) {
    cardsPerView.value = 1; // Small screens
  } else if (width < 993) {
    cardsPerView.value = 3; // Medium screens
  } else if (width < 1200) {
    cardsPerView.value = 4; // Medium-large screens
  } else if (width < 1400) {
    cardsPerView.value = 5; // Large screens
  } else {
    cardsPerView.value = 7; // Extra large screens
  }
  // Reset scroll index if it exceeds new max
  if (currentScrollIndex.value > maxScrollIndex.value) {
    currentScrollIndex.value = maxScrollIndex.value;
  }
};

// Mount lifecycle
onMounted(() => {
  // Initialize selected site with first available site or from env
  selectedSite.value = import.meta.env.VITE_ACTIVE_SITE_UID || availableSites.value[0]?.uid || 'sppg-tanah-sereal-bogor';
  
  fetchLiveActivities(); // Utamakan API, fallback otomatis ke mock data
  loadSistemMonitoringData();
  loadNavigationAppsData();
  
  // Initialize cards per view
  updateCardsPerView();
  
  // Add resize listener
  window.addEventListener('resize', updateCardsPerView);
  
  // Cleanup on unmount
  return () => {
    window.removeEventListener('resize', updateCardsPerView);
  };
});
</script>

<style scoped>
/* Global rendering improvements */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* Optimize SVG and icon rendering */
svg, img {
  shape-rendering: geometricPrecision;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

i, .ki-duotone, .fas, .far, .fab {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.card {
  transition: all 0.2s ease-in-out;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.card:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.symbol {
  transition: all 0.2s ease-in-out;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.card:hover .symbol {
  transform: scale(1.05) translateZ(0);
}

/* Site Selection Dropdown */
.form-select-sm {
  padding: 0.375rem 2rem 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid #e4e6ef;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.form-select-sm:hover {
  border-color: #3b82f6;
  background-color: #ffffff;
}

.form-select-sm:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.15);
  background-color: #ffffff;
}

[data-bs-theme="dark"] .form-select-sm,
.dark .form-select-sm,
.app-dark .form-select-sm {
  background-color: #1e293b;
  border-color: #3f4254;
  color: #ffffff;
}

[data-bs-theme="dark"] .form-select-sm:hover,
.dark .form-select-sm:hover,
.app-dark .form-select-sm:hover {
  background-color: #2d3748;
  border-color: #3b82f6;
}

/* Badge styling */
.badge-light-primary {
  background-color: #eff6ff;
  color: #3b82f6;
  padding: 0.35rem 0.65rem;
  font-weight: 500;
}

[data-bs-theme="dark"] .badge-light-primary,
.dark .badge-light-primary,
.app-dark .badge-light-primary {
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

/* Carousel Styles */
.activities-carousel-wrapper {
  position: relative;
  padding: 0.5rem;
  margin: -0.5rem;
}

.activities-carousel {
  overflow: visible;
  cursor: grab;
  user-select: none;
  padding: 0.5rem 0;
}

.activities-carousel:active {
  cursor: grabbing;
}

.activities-carousel-track {
  display: flex;
  gap: 20px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-item-wrapper {
  flex: 0 0 calc(25% - 15px);
  min-width: 0;
}

/* Pagination Dots */
.carousel-pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 1rem;
}

.pagination-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.pagination-dot:hover {
  background: #94a3b8;
  transform: scale(1.2);
}

.pagination-dot.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 18px;
  border-radius: 3px;
}

/* Daily Process Card Enhancement */
.daily-process-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

[data-bs-theme="dark"] .daily-process-card,
.dark .daily-process-card,
.app-dark .daily-process-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Dashboard Main Card - Gabungan 3 Section */
.dashboard-main-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

[data-bs-theme="dark"] .dashboard-main-card,
.dark .dashboard-main-card,
.app-dark .dashboard-main-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Separator styling */
.separator.separator-dashed {
  border-top: 1px dashed #e4e6ef;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

[data-bs-theme="dark"] .separator.separator-dashed,
.dark .separator.separator-dashed,
.app-dark .separator.separator-dashed {
  border-top: 1px dashed #3f4254;
}

/* Responsive Carousel */
/* Extra large screens - 7 cards */
@media (min-width: 1400px) {
  .carousel-item-wrapper {
    flex: 0 0 calc((100% - 120px) / 7);
  }
}

/* Large screens - 5 cards */
@media (max-width: 1399px) and (min-width: 1200px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(20% - 16px);
  }
}

/* Medium-large screens - 4 cards */
@media (max-width: 1199px) and (min-width: 993px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(25% - 15px);
  }
  
  .activities-carousel-wrapper {
    padding: 0 0.5rem;
  }
}

/* Medium screens - 3 cards */
@media (max-width: 992px) and (min-width: 577px) {
  .carousel-item-wrapper {
    flex: 0 0 calc(33.333% - 13.333px);
  }
  
  .activities-carousel-wrapper {
    padding: 0 0.5rem;
  }
}

/* Small screens - 1 card */
@media (max-width: 576px) {
  .carousel-item-wrapper {
    flex: 0 0 100%;
  }
  
  .activities-carousel-wrapper {
    padding: 0 0.5rem;
  }
  
  .activities-carousel-track {
    gap: 0;
  }
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
