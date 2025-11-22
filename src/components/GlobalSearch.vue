<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div 
        v-if="isOpen" 
        class="global-search-overlay"
        @click="closeSearch"
      >
        <div 
          class="global-search-container"
          @click.stop
        >
          <!-- Search Input -->
          <div class="search-header">
            <i class="bi bi-search text-gray-500 fs-4 me-3"></i>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search for cameras, sites, teams, accounts, events, alerts..."
              @keydown.esc="closeSearch"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="selectItem"
            />
            <kbd class="search-kbd">ESC</kbd>
          </div>

          <!-- Search Results -->
          <div class="search-results" v-if="searchQuery.trim()">
            <!-- Cameras -->
            <div v-if="filteredCameras.length > 0" class="result-section">
              <div class="result-section-title">
                <i class="bi bi-camera-video me-2"></i>Cameras
              </div>
              <div
                v-for="(camera, index) in filteredCameras"
                :key="`camera-${camera.uid}`"
                class="result-item"
                :class="{ 'active': selectedIndex === getCameraIndex(index) }"
                @click="navigateToCamera(camera)"
                @mouseenter="selectedIndex = getCameraIndex(index)"
              >
                <div class="result-icon bg-light-primary">
                  <i class="bi bi-camera-video text-primary"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ camera.name }}</div>
                  <div class="result-subtitle">{{ camera.site_name }} - {{ camera.room }}</div>
                </div>
                <i class="bi bi-arrow-return-left text-gray-400"></i>
              </div>
            </div>

            <!-- Sites -->
            <div v-if="filteredSites.length > 0" class="result-section">
              <div class="result-section-title">
                <i class="bi bi-geo-alt me-2"></i>Sites
              </div>
              <div
                v-for="(site, index) in filteredSites"
                :key="`site-${site.uid}`"
                class="result-item"
                :class="{ 'active': selectedIndex === getSiteIndex(index) }"
                @click="navigateToSite(site)"
                @mouseenter="selectedIndex = getSiteIndex(index)"
              >
                <div class="result-icon bg-light-success">
                  <i class="bi bi-geo-alt text-success"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ site.name }}</div>
                  <div class="result-subtitle">Site</div>
                </div>
                <i class="bi bi-arrow-return-left text-gray-400"></i>
              </div>
            </div>

            <!-- Quick Actions -->
            <div v-if="filteredActions.length > 0" class="result-section">
              <div class="result-section-title">
                <i class="bi bi-lightning me-2"></i>Quick Actions
              </div>
              <div
                v-for="(action, index) in filteredActions"
                :key="`action-${action.id}`"
                class="result-item"
                :class="{ 'active': selectedIndex === getActionIndex(index) }"
                @click="executeAction(action)"
                @mouseenter="selectedIndex = getActionIndex(index)"
              >
                <div class="result-icon" :class="action.iconBg">
                  <i :class="[action.icon, action.iconColor]"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ action.title }}</div>
                  <div class="result-subtitle">{{ action.description }}</div>
                </div>
                <i class="bi bi-arrow-return-left text-gray-400"></i>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="totalResults === 0" class="no-results">
              <i class="bi bi-search fs-1 text-gray-400 mb-3"></i>
              <div class="text-gray-600 fw-bold">No results found</div>
              <div class="text-gray-500 fs-7">Try searching for something else</div>
            </div>
          </div>

          <!-- Recent Searches / Quick Links -->
          <div class="search-results" v-else>
            <div class="result-section">
              <div class="result-section-title">
                <i class="bi bi-clock-history me-2"></i>Quick Links
              </div>
              <div
                v-for="(link, index) in quickLinks"
                :key="`link-${link.id}`"
                class="result-item"
                :class="{ 'active': selectedIndex === index }"
                @click="navigateTo(link.path)"
                @mouseenter="selectedIndex = index"
              >
                <div class="result-icon" :class="link.iconBg">
                  <i :class="[link.icon, link.iconColor]"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ link.title }}</div>
                  <div class="result-subtitle">{{ link.description }}</div>
                </div>
                <i class="bi bi-arrow-return-left text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="search-footer">
            <div class="search-footer-item">
              <kbd>↑</kbd><kbd>↓</kbd> Navigate
            </div>
            <div class="search-footer-item">
              <kbd>↵</kbd> Select
            </div>
            <div class="search-footer-item">
              <kbd>ESC</kbd> Close
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Camera Playback Modal -->
  <CameraPlaybackModal ref="playbackModal" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/core/services/ApiService';
import CameraPlaybackModal from '@/components/CameraPlaybackModal.vue';

const router = useRouter();
const isOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const selectedIndex = ref(0);
const playbackModal = ref<InstanceType<typeof CameraPlaybackModal> | null>(null);

// Mock data - replace with actual API calls
const cameras = ref<any[]>([]);
const sites = ref<any[]>([]);

const quickLinks = [
  {
    id: 'live-view',
    title: 'Live Camera Feed',
    description: 'View all cameras in real-time',
    icon: 'bi bi-camera-video',
    iconColor: 'text-primary',
    iconBg: 'bg-light-primary',
    path: '/apps/live-view'
  },
  {
    id: 'events',
    title: 'Events & Alerts',
    description: 'View recent events and alerts',
    icon: 'bi bi-bell',
    iconColor: 'text-warning',
    iconBg: 'bg-light-warning',
    path: '/apps/events-alerts/events'
  },
  {
    id: 'cameras',
    title: 'Camera Management',
    description: 'Manage all cameras',
    icon: 'bi bi-gear',
    iconColor: 'text-info',
    iconBg: 'bg-light-info',
    path: '/controlplane/site/camera'
  },
  {
    id: 'sites',
    title: 'Site Management',
    description: 'Manage sites and locations',
    icon: 'bi bi-geo-alt',
    iconColor: 'text-success',
    iconBg: 'bg-light-success',
    path: '/controlplane/site/site'
  }
];

const actions = [
  {
    id: 'add-camera',
    title: 'Add New Camera',
    description: 'Register a new camera',
    icon: 'bi bi-plus-circle',
    iconColor: 'text-primary',
    iconBg: 'bg-light-primary',
    action: () => { window.dispatchEvent(new CustomEvent('open-add-camera')); closeSearch(); },
  },
  {
    id: 'view-alerts',
    title: 'View Active Alerts',
    description: 'See all active alerts',
    icon: 'bi bi-exclamation-triangle',
    iconColor: 'text-danger',
    iconBg: 'bg-light-danger',
    action: () => router.push('/apps/events-alerts/alerts')
  }
];

// Filtered results
const filteredCameras = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase();
  return cameras.value
    .filter(cam => 
      cam.name?.toLowerCase().includes(query) || 
      cam.room?.toLowerCase().includes(query) ||
      cam.model?.toLowerCase().includes(query) ||
      cam.site_name?.toLowerCase().includes(query)
    )
    .slice(0, 5);
});

const filteredSites = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase();
  return sites.value
    .filter(site => site.name?.toLowerCase().includes(query))
    .slice(0, 5);
});

const filteredActions = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase();
  return actions.filter(action => 
    action.title.toLowerCase().includes(query) ||
    action.description.toLowerCase().includes(query)
  );
});

const totalResults = computed(() => 
  filteredCameras.value.length + 
  filteredSites.value.length + 
  filteredActions.value.length
);

// Index helpers
const getCameraIndex = (index: number) => index;
const getSiteIndex = (index: number) => filteredCameras.value.length + index;
const getActionIndex = (index: number) => 
  filteredCameras.value.length + filteredSites.value.length + index;

// Keyboard navigation
const navigateDown = () => {
  const maxIndex = searchQuery.value.trim() 
    ? totalResults.value - 1 
    : quickLinks.length - 1;
  selectedIndex.value = Math.min(selectedIndex.value + 1, maxIndex);
};

const navigateUp = () => {
  selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
};

const selectItem = () => {
  if (!searchQuery.value.trim()) {
    if (quickLinks[selectedIndex.value]) {
      navigateTo(quickLinks[selectedIndex.value].path);
    }
    return;
  }

  const cameraCount = filteredCameras.value.length;
  const siteCount = filteredSites.value.length;

  if (selectedIndex.value < cameraCount) {
    navigateToCamera(filteredCameras.value[selectedIndex.value]);
  } else if (selectedIndex.value < cameraCount + siteCount) {
    navigateToSite(filteredSites.value[selectedIndex.value - cameraCount]);
  } else {
    const actionIndex = selectedIndex.value - cameraCount - siteCount;
    executeAction(filteredActions.value[actionIndex]);
  }
};

// Navigation functions
const navigateToCamera = async (camera: any) => {
  // Fetch full camera details if needed
  try {
    const cameraData = {
      uid: camera.uid,
      name: camera.name,
      room: camera.room || camera.site_name,
      recording: true,
      site_uid: camera.site_uid,
      public_endpoint_url: camera.public_endpoint_url,
      model: camera.model
    };
    
    // If public_endpoint_url is missing, try to fetch it
    if (!cameraData.public_endpoint_url && camera.site_uid) {
      try {
        const resp = await ApiService.query(`sites/${camera.site_uid}/cameras`, {});
        const cameras = resp?.data?.data || resp?.data || [];
        const fullCamera = cameras.find((c: any) => c.uid === camera.uid);
        if (fullCamera?.public_endpoint_url) {
          cameraData.public_endpoint_url = fullCamera.public_endpoint_url;
        }
      } catch (err) {
        console.error('[GlobalSearch] Error fetching camera details:', err);
      }
    }
    
    closeSearch();
    
    // Open playback modal
    if (playbackModal.value) {
      playbackModal.value.openModal(cameraData);
    }
  } catch (error) {
    console.error('[GlobalSearch] Error opening camera:', error);
    closeSearch();
  }
};

const navigateToSite = (site: any) => {
  router.push(`/apps/live-view?site=${site.uid}`);
  closeSearch();
};

const navigateTo = (path: string) => {
  router.push(path);
  closeSearch();
};

const executeAction = (action: any) => {
  action.action();
  closeSearch();
};

// Open/Close
const openSearch = async () => {
  isOpen.value = true;
  
  // Lazy load data when opening search
  if (!dataCache) {
    await fetchData();
  }
  
  await nextTick();
  searchInput.value?.focus();
  selectedIndex.value = 0;
};

const closeSearch = () => {
  isOpen.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
};

// Keyboard shortcut handler
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
};

// Event handler for sidebar trigger
const handleOpenEvent = () => {
  openSearch();
};

// Fetch data
let isFetching = false;
let dataCache: { cameras: any[], sites: any[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchData = async () => {
  // Prevent duplicate fetches
  if (isFetching) {
    console.log('[GlobalSearch] Already fetching, skipping...');
    return;
  }

  // Check cache
  if (dataCache && (Date.now() - dataCache.timestamp) < CACHE_DURATION) {
    console.log('[GlobalSearch] Using cached data');
    cameras.value = dataCache.cameras;
    sites.value = dataCache.sites;
    return;
  }

  isFetching = true;
  
  try {
    const selectedTeamId = localStorage.getItem('lastSelectedTeam');
    if (!selectedTeamId) {
      isFetching = false;
      return;
    }

    console.log('[GlobalSearch] Fetching fresh data...');

    // Fetch sites
    const sitesResp = await ApiService.query(`teams/${selectedTeamId}/sites`, {});
    if (sitesResp?.data?.data) {
      sites.value = sitesResp.data.data;
    }

    // Fetch cameras from all sites for comprehensive global search
    const allCameras: any[] = [];
    
    for (const site of sites.value) {
      try {
        const camerasResp = await ApiService.query(`sites/${site.uid}/cameras`, {});
        const cameraData = camerasResp?.data?.data || camerasResp?.data || [];
        const normalizedCameras = (Array.isArray(cameraData) ? cameraData : [cameraData]).map((cam: any) => ({
          uid: cam.uid,
          name: cam.name || cam.camera_name,
          room: cam.room_name || cam.room || cam.location,
          model: cam.model || cam.camera_model,
          site_uid: site.uid,
          site_name: site.name,
          public_endpoint_url: cam.public_endpoint_url || ''
        }));
        allCameras.push(...normalizedCameras);
      } catch (err) {
        console.error(`[GlobalSearch] Error fetching cameras for site ${site.uid}:`, err);
      }
    }
    
    cameras.value = allCameras;

    // Update cache
    dataCache = {
      cameras: allCameras,
      sites: sites.value,
      timestamp: Date.now()
    };

    console.log(`[GlobalSearch] Fetched ${allCameras.length} cameras from ${sites.value.length} sites`);
  } catch (error) {
    console.error('[GlobalSearch] Error fetching search data:', error);
  } finally {
    isFetching = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('open-global-search', handleOpenEvent);
  // Don't fetch data on mount - lazy load when search is opened
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('open-global-search', handleOpenEvent);
});

// Watch for search query changes
watch(searchQuery, () => {
  selectedIndex.value = 0;
});

// Expose for parent components
defineExpose({
  openSearch,
  closeSearch
});
</script>

<style scoped>
.global-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.global-search-container {
  width: 100%;
  max-width: 640px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1f2937;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-kbd {
  padding: 4px 8px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  font-family: monospace;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.result-section {
  margin-bottom: 16px;
}

.result-section:last-child {
  margin-bottom: 0;
}

.result-section-title {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  gap: 12px;
}

.result-item:hover,
.result-item.active {
  background: #f3f4f6;
}

.result-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-subtitle {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.search-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.search-footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.search-footer kbd {
  padding: 2px 6px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  font-family: monospace;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Animations */
.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.2s ease;
}

.search-modal-enter-active .global-search-container,
.search-modal-leave-active .global-search-container {
  transition: all 0.2s ease;
}

.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}

.search-modal-enter-from .global-search-container {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

.search-modal-leave-to .global-search-container {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* Scrollbar styling */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: transparent;
}

.search-results::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
