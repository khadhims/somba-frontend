<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out"
      leave-active-class="transition-opacity duration-200 ease-out [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out"
      enter-from-class="opacity-0 [&>div]:-translate-y-5 [&>div]:scale-95 [&>div]:opacity-0"
      leave-to-class="opacity-0 [&>div]:-translate-y-5 [&>div]:scale-95 [&>div]:opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[10000] flex items-start justify-center bg-black/50 pt-[15vh] backdrop-blur-[4px]"
        @click="closeSearch"
      >
        <div 
          class="flex max-h-[70vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
          @click.stop
        >
          <!-- Search Input -->
          <div class="flex items-center border-b border-gray-200 px-5 py-4">
            <i class="fas fa-magnifying-glass mr-3 text-lg text-gray-500"></i>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="flex-1 border-none bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
              placeholder="Search for cameras, sites, teams, accounts, events, alerts..."
              @keydown.esc="closeSearch"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="selectItem"
            />
            <kbd
              class="rounded border border-gray-300 bg-gray-100 px-2 py-1 font-mono text-xs font-semibold text-gray-500"
              >ESC</kbd
            >
          </div>

          <!-- Search Results -->
          <div
            v-if="searchQuery.trim()"
            class="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <!-- Cameras -->
            <div v-if="filteredCameras.length > 0" class="mb-4 last:mb-0">
              <div
                class="flex items-center px-3 py-2 text-xs font-semibold tracking-[0.05em] text-gray-500 uppercase"
              >
                <i class="fas fa-video mr-2"></i>Cameras
              </div>
              <div
                v-for="(camera, index) in filteredCameras"
                :key="`camera-${camera.uid}`"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 hover:bg-gray-100"
                :class="{ 'bg-gray-100': selectedIndex === getCameraIndex(index) }"
                @click="navigateToCamera(camera)"
                @mouseenter="selectedIndex = getCameraIndex(index)"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-lg">
                  <i class="fas fa-video text-primary"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-gray-800">{{ camera.name }}</div>
                  <div class="truncate text-xs text-gray-500">{{ camera.site_name }} - {{ camera.room }}</div>
                </div>
                <i class="fas fa-turn-down text-gray-400"></i>
              </div>
            </div>

            <!-- Sites -->
            <div v-if="filteredSites.length > 0" class="mb-4 last:mb-0">
              <div
                class="flex items-center px-3 py-2 text-xs font-semibold tracking-[0.05em] text-gray-500 uppercase"
              >
                <i class="fas fa-location-dot mr-2"></i>Sites
              </div>
              <div
                v-for="(site, index) in filteredSites"
                :key="`site-${site.uid}`"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 hover:bg-gray-100"
                :class="{ 'bg-gray-100': selectedIndex === getSiteIndex(index) }"
                @click="navigateToSite(site)"
                @mouseenter="selectedIndex = getSiteIndex(index)"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-light text-lg">
                  <i class="fas fa-location-dot text-success"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-gray-800">{{ site.name }}</div>
                  <div class="truncate text-xs text-gray-500">Site</div>
                </div>
                <i class="fas fa-turn-down text-gray-400"></i>
              </div>
            </div>

            <!-- Quick Actions -->
            <div v-if="filteredActions.length > 0" class="mb-4 last:mb-0">
              <div
                class="flex items-center px-3 py-2 text-xs font-semibold tracking-[0.05em] text-gray-500 uppercase"
              >
                <i class="fas fa-bolt mr-2"></i>Quick Actions
              </div>
              <div
                v-for="(action, index) in filteredActions"
                :key="`action-${action.id}`"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 hover:bg-gray-100"
                :class="{ 'bg-gray-100': selectedIndex === getActionIndex(index) }"
                @click="executeAction(action)"
                @mouseenter="selectedIndex = getActionIndex(index)"
              >
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                  :class="action.iconBg"
                >
                  <i :class="[action.icon, action.iconColor]"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-gray-800">{{ action.title }}</div>
                  <div class="truncate text-xs text-gray-500">{{ action.description }}</div>
                </div>
                <i class="fas fa-turn-down text-gray-400"></i>
              </div>
            </div>

            <!-- No Results -->
            <div
              v-if="totalResults === 0"
              class="flex flex-col items-center justify-center px-6 py-12 text-center"
            >
              <i class="fas fa-magnifying-glass mb-3 text-4xl text-gray-400"></i>
              <div class="font-bold text-gray-600">No results found</div>
              <div class="text-xs text-gray-500">Try searching for something else</div>
            </div>
          </div>

          <!-- Recent Searches / Quick Links -->
          <div
            v-else
            class="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <div class="mb-4 last:mb-0">
              <div
                class="flex items-center px-3 py-2 text-xs font-semibold tracking-[0.05em] text-gray-500 uppercase"
              >
                <i class="fas fa-clock-rotate-left mr-2"></i>Quick Links
              </div>
              <div
                v-for="(link, index) in quickLinks"
                :key="`link-${link.id}`"
                class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 hover:bg-gray-100"
                :class="{ 'bg-gray-100': selectedIndex === index }"
                @click="navigateTo(link.path)"
                @mouseenter="selectedIndex = index"
              >
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                  :class="link.iconBg"
                >
                  <i :class="[link.icon, link.iconColor]"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-semibold text-gray-800">{{ link.title }}</div>
                  <div class="truncate text-xs text-gray-500">{{ link.description }}</div>
                </div>
                <i class="fas fa-turn-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center gap-4 border-t border-gray-200 bg-gray-50 px-5 py-3">
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <kbd class="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">↑</kbd
              ><kbd class="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">↓</kbd>
              Navigate
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <kbd class="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">↵</kbd>
              Select
            </div>
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <kbd class="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">ESC</kbd>
              Close
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
    icon: 'fas fa-video',
    iconColor: 'text-primary',
    iconBg: 'bg-primary-light',
    path: '/apps/live-view'
  },
  {
    id: 'events',
    title: 'Events & Alerts',
    description: 'View recent events and alerts',
    icon: 'fas fa-bell',
    iconColor: 'text-warning',
    iconBg: 'bg-warning-light',
    path: '/apps/events-alerts/events'
  },
  {
    id: 'cameras',
    title: 'Camera Management',
    description: 'Manage all cameras',
    icon: 'fas fa-gear',
    iconColor: 'text-info',
    iconBg: 'bg-info-light',
    path: '/controlplane/site/camera'
  },
  {
    id: 'sites',
    title: 'Site Management',
    description: 'Manage sites and locations',
    icon: 'fas fa-location-dot',
    iconColor: 'text-success',
    iconBg: 'bg-success-light',
    path: '/controlplane/site/site'
  }
];

const actions = [
  {
    id: 'add-camera',
    title: 'Add New Camera',
    description: 'Register a new camera',
    icon: 'fas fa-plus-circle',
    iconColor: 'text-primary',
    iconBg: 'bg-primary-light',
    action: () => {
      // Navigate to camera management page with query param to open modal
      router.push({ name: 'site-camera', query: { addCamera: '1' } });
    },
  },
  {
    id: 'view-alerts',
    title: 'View Active Alerts',
    description: 'See all active alerts',
    icon: 'fas fa-triangle-exclamation',
    iconColor: 'text-danger',
    iconBg: 'bg-danger-light',
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
  // Normalize key detection for Ctrl+K across browsers
  const isCtrlOrMeta = e.ctrlKey || e.metaKey;
  const key = e.key?.toLowerCase();
  if (isCtrlOrMeta && (key === 'k' || e.code === 'KeyK')) {
    e.preventDefault();
    // Avoid reopening if already open
    if (!isOpen.value) {
      openSearch();
    }
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
  // Use capture to beat browser default (Chrome Ctrl+K quick search)
  window.addEventListener('keydown', handleKeydown, { capture: true });
  window.addEventListener('open-global-search', handleOpenEvent);
  // Don't fetch data on mount - lazy load when search is opened
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown, { capture: true } as any);
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
