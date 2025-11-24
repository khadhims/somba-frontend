<template>
  <!-- Live Camera Feed header -->
  <div class="card mb-4">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div>
        <div class="d-flex align-items-center">
          <h4 class="card-title mb-0 me-3">{{ t('appsLiveView.header.title') }}</h4>
        </div>
      </div>

      <div class="btn-group" role="group">
          <button type="button" class="btn btn-sm" :class="{ 'btn-light': true }">
            <i class="bi-grid-fill"></i>
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '1x1' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('1x1')"
            :title="`1x1 (max 1 camera)`"
          >
            1x1
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '2x2' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('2x2')"
            :title="`2x2 (max 4 cameras)`"
          >
            2x2
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '3x3' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('3x3')"
            :title="`3x3 (max 9 cameras)`"
          >
            3x3
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '4x4' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('4x4')"
            :title="`4x4 (max 16 cameras)`"
          >
            4x4
          </button>
      </div>
    </div>
  </div>

  <!-- Main layout: left = camera grid, right = camera list -->
  <div class="row g-4">
    <div class="col-xl-9">
      <div class="card">
        <div class="card-body py-3">
          <!-- Camera count indicator -->

          <div class="row g-3" :class="gridClasses">
            <div 
              v-for="(camera, index) in filteredCameras" 
              :key="camera.uid" 
              :class="cameraColClass"
              @dragover="onDragOver($event, index)"
              @dragleave="onDragLeave"
              @drop="onDrop($event, index)"
            >
              <div 
                class="card camera-card"
                :class="{
                  'dragging': isDragging && draggedCamera?.uid === camera.uid,
                  'drag-over': dragOverIndex === index && draggedCamera?.uid !== camera.uid
                }"
                draggable="true"
                @dragstart="onDragStart($event, camera, index)"
                @dragend="onDragEnd"
              >
                <div class="card-body p-0 position-relative">
                  <!-- Drag handle overlay -->
                  <div class="drag-handle position-absolute" style="top: 8px; right: 8px; z-index: 10;">
                    <i class="ki-duotone ki-menu fs-4 text-white cursor-move drop-shadow">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>

                  <div
                    class="camera-feed-container bg-black rounded overflow-hidden"
                    :style="{ height: gridView === '1x1' ? '520px' : '200px', position: 'relative' }"
                  >
                    <video
                      v-if="camera.public_endpoint_url"
                      :id="`video-${camera.uid}`"
                      class="camera-video"
                      playsinline
                      muted
                      autoplay
                      preload="auto"
                      crossorigin="anonymous"
                      controls
                    ></video>
                    <div v-else class="d-flex align-items-center justify-content-center h-100">
                      <i class="ki-duotone ki-security-user fs-3x text-gray-600"><span class="path1"></span><span class="path2"></span></i>
                    </div>

                    <!-- Info Overlay -->
                    <div class="position-absolute bottom-0 start-0 w-100 p-3" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);">
                      <div class="d-flex justify-content-between align-items-end">
                        <div>
                          <div class="text-white fw-bold fs-6">{{ camera.room }}</div>
                          <div class="d-flex align-items-center text-gray-400 fs-8">
                            <span class="me-2">{{ camera.name }}</span>
                            <span v-if="camera.model" class="badge badge-sm badge-light-primary bg-opacity-20 text-white border-0 px-1 py-0" style="font-size: 0.7rem;">{{ camera.model }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredCameras.length === 0" class="text-center py-5">
            <i class="ki-duotone ki-security-user fs-3x text-gray-400 mb-3"><span class="path1"></span><span class="path2"></span></i>
              <p class="text-gray-500">{{ t('appsLiveView.grid.empty') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card h-100">
        <div class="card-header d-flex justify-content-between align-items-center cursor-pointer" @click="toggleSiteList">
          <div class="overflow-hidden">
            <h3 class="fw-bold m-0 text-truncate">{{ selectedSiteName }}</h3>
            <div class="small text-muted">({{ totalCameras }} cameras)</div>
          </div>
          <div class="btn btn-sm btn-icon btn-light">
            <i class="bi" :class="isSiteSelectionOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </div>
        </div>
        <div class="card-body p-0 overflow-auto" style="max-height: 80vh;">
          <!-- Site List (Dropdown) -->
          <div v-if="isSiteSelectionOpen">
            <!-- Search Input -->
            <div class="p-3 border-bottom">
              <input 
                type="text" 
                v-model="siteSearchQuery"
                class="form-control form-control-sm"
                placeholder="Search sites..."
                @click.stop
              />
            </div>
            <ul class="list-group list-group-flush">
              <li 
                v-for="site in filteredSites" 
                :key="site.uid" 
                class="list-group-item list-group-item-action cursor-pointer"
                :class="{ 'active': site.uid === selectedSiteId }"
                @click.stop="selectSite(site)"
              >
                <div class="fw-semibold">{{ site.name }}</div>
              </li>
              <li v-if="filteredSites.length === 0" class="list-group-item text-muted text-center">
                No sites found
              </li>
            </ul>
          </div>

          <!-- Camera List -->
          <ul v-else class="list-group list-group-flush">
            <li 
              v-for="cam in siteCameras" 
              :key="cam.uid" 
              class="list-group-item border-0 py-3 px-4 d-flex justify-content-between align-items-center cursor-grab sidebar-camera-item"
              :class="{ 'dragging': draggedCamera?.uid === cam.uid }"
              draggable="true"
              @dragstart="onDragStartFromSidebar($event, cam)"
              @dragend="onDragEnd"
              @click="onCameraClick(cam)"
            >
              <div class="d-flex align-items-center flex-grow-1 overflow-hidden">
                <!-- Camera Initial Icon -->
                <div class="d-flex justify-content-center align-items-center bg-light-primary rounded me-3 flex-shrink-0" style="width: 40px; height: 40px;">
                  <span class="text-primary fs-3 fw-bold">
                    {{ (cam.room || cam.name || '?').trim().charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div class="d-flex flex-column flex-grow-1 overflow-hidden">
                  <div class="fw-bold text-gray-800 text-truncate fs-6">{{ cam.room }}</div>
                  <div class="text-muted fs-7 text-truncate">{{ cam.name }}</div>
                  <div v-if="cam.model" class="d-flex align-items-center mt-1">
                    <span class="badge badge-light-info fs-8 px-2 py-1">
                      <i class="bi bi-camera-video me-1"></i>{{ cam.model }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="d-flex align-items-center ms-3 text-gray-400">
                <i class="bi bi-grip-vertical fs-4"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from 'vue-router';
import { useI18n } from "vue-i18n";

// Using HLS from CDN via window.Hls (see index.html)

// Ensure HLS is available via CDN (no-op if already present)
const loadHlsCdn = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w.Hls && typeof w.Hls.isSupported === 'function') {
      resolve();
      return;
    }
    let script = document.querySelector('script[data-hls-cdn]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.async = true;
      script.setAttribute('data-hls-cdn', 'true');
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Failed to load HLS CDN script')));
  });
};
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import ApiService from "@/core/services/ApiService";

const { t } = useI18n();

// Interface definitions
interface Camera {
  uid: string;
  name: string;
  room: string;
  recording: boolean;
  site_uid: string;
  nvr_uid?: string;
  public_endpoint_url?: string;
  model?: string;
}

interface Site {
  uid: string;
  name: string;
}

interface NVR {
  uid: string;
  name: string;
  site_uid: string;
}

// Reactive data
const cameras = ref<Camera[]>([]);
const sites = ref<Site[]>([]);
const nvrs = ref<NVR[]>([]);
const loading = ref(false);
const loadingSites = ref(true);
const loadingNvrs = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref(""); // Keep for internal use
const selectedNvrId = ref(""); // Keep for internal use
// Header filter state (like Camera.vue)
const selectedSiteFilter = ref<string>("");
const selectedNvrFilter = ref<string>("");
const gridView = ref("3x3");
const isSiteSelectionOpen = ref(false);
const siteSearchQuery = ref("");

// Drag and drop state
const draggedCamera = ref<Camera | null>(null);
const dragOverIndex = ref<number>(-1);
const isDragging = ref(false);



// Mock fallbacks to avoid compile/runtime errors when API fails
const mockSites: Site[] = [];
const mockCameras: Camera[] = [];

// Fetch cameras from API
const hlsInstances = new Map<string, any>();
let videoObserver: IntersectionObserver | null = null;
const attachedSet = new Set<string>();

const attachStreamToVideo = (cam: Camera) => {
  const videoEl = document.getElementById(`video-${cam.uid}`) as HTMLVideoElement | null;
  const url = cam.public_endpoint_url;
  if (!videoEl || !url) return;

  // Destroy previous instance if exists and source changed
  const existing = hlsInstances.get(cam.uid);
  if (existing) {
    try { existing.destroy(); } catch(_) {}
    hlsInstances.delete(cam.uid);
  }

  const HlsGlobal = (window as any).Hls;
  if (HlsGlobal && HlsGlobal.isSupported && HlsGlobal.isSupported()) {
    const hls = new HlsGlobal({
      // Optimized chunking configuration for 9 CCTV
      lowLatencyMode: true,
      backBufferLength: 30,
      maxBufferLength: 300, // 5 menit buffer
      maxMaxBufferLength: 600, // 10 menit buffer
      liveSyncDurationCount: 16, // lebih panjang, request chunk lebih jarang
      liveMaxLatencyDurationCount: 20,

      // Fragment loading optimization
      fragLoadingTimeOut: 10000,
      fragLoadingMaxRetry: 3,
      fragLoadingRetryDelay: 1000,

      // Manifest loading optimization
      manifestLoadingTimeOut: 5000,
      manifestLoadingMaxRetry: 3,
      manifestLoadingRetryDelay: 1000,

      // Level loading optimization
      levelLoadingTimeOut: 5000,
      levelLoadingMaxRetry: 2,
      levelLoadingRetryDelay: 2000,

      // Reduce aggressive requesting
      enableWorker: true,
      startFragPrefetch: false,
      testBandwidth: false,
      maxLiveSyncPlaybackRate: 2,
    });

    hls.on(HlsGlobal.Events.ERROR, (_evt: any, data: any) => {
      if (data.fatal) {
        switch (data.type) {
          case HlsGlobal.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case HlsGlobal.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            try { hls.destroy(); } catch {}
            hls.loadSource(url);
            hls.attachMedia(videoEl);
        }
      }
    });

    hls.loadSource(url);
    hls.attachMedia(videoEl);
    hls.on(HlsGlobal.Events.MANIFEST_PARSED, () => {
      videoEl.play().catch(() => {
        // Autoplay or readiness might delay playback; retry shortly
        window.setTimeout(() => {
          try { videoEl.play().catch(() => {}); } catch {}
        }, 500);
      });
    });
    hlsInstances.set(cam.uid, hls);
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    // native HLS (Safari)
    videoEl.src = url;
    videoEl.addEventListener('loadeddata', () => {
      try {
        videoEl.play().catch(() => {
          window.setTimeout(() => { try { videoEl.play().catch(() => {}); } catch {} }, 500);
        });
      } catch {}
    }, { once: true });
  } else {
    // fallback: set src and hope for best
    videoEl.src = url;
  }

  attachedSet.add(cam.uid);
};

const detachAllStreams = () => {
  hlsInstances.forEach((hls) => {
    try { hls.destroy(); } catch(_) {}
  });
  hlsInstances.clear();
  attachedSet.clear();
  if (videoObserver) {
    try { videoObserver.disconnect(); } catch {}
    videoObserver = null;
  }
};

// Lazy initialize streams only when videos are visible, with staggered initialization
const setupVideoObservers = () => {
  if (videoObserver) {
    try { videoObserver.disconnect(); } catch {}
    videoObserver = null;
  }
  let staggerIndex = 0;
  videoObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting);
    visible.forEach((entry) => {
      const el = entry.target as HTMLVideoElement;
      const id = el.id.replace('video-', '');
      if (!id) return;
      if (attachedSet.has(id)) return;
      const cam = cameras.value.find((c) => c.uid === id);
      if (!cam) return;
      // Skip if already has hls instance
      if (hlsInstances.has(id)) return;
      const delay = staggerIndex * 150;
      staggerIndex += 1;
      window.setTimeout(() => attachStreamToVideo(cam), delay);
    });
  }, { root: null, rootMargin: '64px', threshold: 0.25 });

  // Observe current rendered videos
  cameras.value.forEach((cam) => {
    const el = document.getElementById(`video-${cam.uid}`) as HTMLVideoElement | null;
    if (el) {
      try { videoObserver!.observe(el); } catch {}
    }
  });
};

const route = useRoute();

const fetchCameras = async () => {
  loading.value = true;
  try {
    if (!selectedSiteId.value) {
      cameras.value = [];
      return;
    }

    const resp = await ApiService.query(`sites/${selectedSiteId.value}/cameras`, {});
    // Debug raw response for troubleshooting when status 200 but no cameras shown
    console.debug('[LiveView] fetchCameras raw response:', resp);

    // Normalize different API shapes: resp.data.data, resp.data, or single object
    let raw: any = resp?.data?.data ?? resp?.data ?? null;
    console.debug('[LiveView] fetchCameras selectedSiteId:', selectedSiteId.value, 'rawType:', typeof raw, 'isArray:', Array.isArray(raw));

    let data: any[] = [];
    if (Array.isArray(raw)) {
      data = raw;
    } else if (raw == null) {
      data = [];
    } else if (typeof raw === 'object') {
      // If server wrapped list under common keys, detect them
      if (Array.isArray(raw.items)) data = raw.items;
      else if (Array.isArray(raw.cameras)) data = raw.cameras;
      else if (Array.isArray(raw.results)) data = raw.results;
      else {
        // single object -> wrap into array
        data = [raw];
      }
    } else {
      data = [];
    }

    console.debug('[LiveView] fetchCameras normalized data length:', data.length);

    // Map to local Camera interface with tolerant field matching
    cameras.value = data.map((it: any) => {
      // Normalize NVR-related identifiers into multiple fields so filters can match
      const nvrCandidate = it.nvr_uid ?? it.video_recorder_uid ?? it.video_recorder_uid ?? it.nvr?.uid ?? it.nvrId ?? it.nvrUid ?? it.nvr_id ?? it.nvrId ?? it.nvr ?? undefined;
      return ({
        uid: it.uid ?? it.id?.toString() ?? (Math.random() * 1e9).toString(),
        name: it.name ?? it.camera_name ?? '',
        room: it.room_name ?? it.roomName ?? it.room ?? it.location ?? '',
        recording: Boolean(it.is_recording || it.recording),
        site_uid: (it.site_uid ?? it.site?.uid) || selectedSiteId.value,
        // Canonical field used across this component
        nvr_uid: nvrCandidate ?? undefined,
        // Keep original common variants to help debugging and external consumers
        video_recorder_uid: it.video_recorder_uid ?? undefined,
        nvrId: it.nvrId ?? it.nvr_id ?? undefined,
        nvr: it.nvr ?? undefined,
        public_endpoint_url: it.public_endpoint_url ?? it.publicEndpointUrl ?? it.ipAddress ?? it.url ?? undefined,
        model: it.model ?? it.camera_model ?? it.modelName ?? undefined,
      });
    });

  // Ensure HLS is loaded, wait DOM update, then lazily attach streams
  try { await loadHlsCdn(); } catch {}
    await nextTick();
    setupVideoObservers();
  } catch (err) {
    console.error('Error fetching cameras:', err);
    // fallback to mock if API fails
    cameras.value = mockCameras.filter(camera => !selectedSiteId.value || camera.site_uid === selectedSiteId.value);
  } finally {
    loading.value = false;
  }
};

// Fetch NVRs from API - following Camera.vue pattern exactly
const fetchNvrs = async () => {
  if (!selectedSiteId.value) {
    nvrs.value = [];
    return;
  }

  loadingNvrs.value = true;
  try {
    // Use video-recorders endpoint exactly like Camera.vue
    const resp = await ApiService.query(`sites/${selectedSiteId.value}/video-recorders`, {});
    console.debug('[LiveView] fetchNvrs response:', resp);
    
    if (resp && resp.data) {
      const siteNvrs = resp.data.data && Array.isArray(resp.data.data) ? resp.data.data : Array.isArray(resp.data) ? resp.data : [];
      
      nvrs.value = siteNvrs.map((nvr: any) => ({
        uid: nvr.uid,
        site_uid: nvr.site_uid || selectedSiteId.value,
        name: nvr.name
      }));
      
      console.debug('[LiveView] fetchNvrs mapped:', nvrs.value);
    } else {
      nvrs.value = [];
    }
  } catch (error) {
    console.error('[LiveView] Error loading NVRs:', error);
    // Fallback to mock data like Camera.vue
    nvrs.value = [
      { uid: "nvr-1", site_uid: selectedSiteId.value, name: "NVR-Reception-01" },
      { uid: "nvr-2", site_uid: selectedSiteId.value, name: "NVR-Conference-01" },
    ];
  } finally {
    loadingNvrs.value = false;
  }
};

// Fetch sites from API - following Camera.vue pattern exactly
const fetchSites = async () => {
  loadingSites.value = true;
  try {
    // Get selected team from localStorage or query params (exactly like Camera.vue)
    const selectedTeamId = localStorage.getItem('lastSelectedTeam') || route.query.teamId as string;    
    const resp = selectedTeamId
      ? await ApiService.query(`teams/${selectedTeamId}/sites`, {})
      : await ApiService.query(`sites`, {}); 
    
    // Parse response (wrapped or direct) - exactly like Camera.vue
    if (resp && resp.data) {
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        sites.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        sites.value = resp.data;
      } else {
        console.warn('[LiveView] Unexpected sites response format:', resp.data);
        sites.value = [];
      }
    } else {
      console.warn('[LiveView] No data received from sites API');
      sites.value = [];
    }

    console.debug('[LiveView] Loaded sites:', sites.value);
    
    if (sites.value.length > 0) {
      // Auto-select first site or preferred site
      const preferred = sites.value.find((ss) => ss.name === 'Site BE');
      const selectedUid = preferred ? preferred.uid : sites.value[0].uid;
      
      // Initialize both filter and internal state
      selectedSiteFilter.value = selectedUid;
      selectedSiteId.value = selectedUid;
      
      console.debug('[LiveView] selectedSiteId set to:', selectedSiteId.value);
      await fetchNvrs();
      await fetchCameras();
    }
  } catch (error) {
    console.error('[LiveView] Error loading sites:', error);
    // Fallback to mock data for development - like Camera.vue
    sites.value = [
      { uid: "site-1", name: "Main Office" },
      { uid: "site-2", name: "Branch Office" },
      { uid: "site-3", name: "Warehouse A" },
    ];
    if (sites.value.length > 0) {
      // Initialize both filter and internal state
      selectedSiteFilter.value = sites.value[0].uid;
      selectedSiteId.value = sites.value[0].uid;
      await fetchCameras();
    }
  } finally {
    loadingSites.value = false;
  }
};

// Header filter change handlers (following Camera.vue pattern)
const onHeaderSiteFilterChange = () => {
  selectedNvrFilter.value = "";
  selectedSiteId.value = selectedSiteFilter.value; // Sync internal state
  // cleanup previous streams
  detachAllStreams();
  // Load cameras for the new selected site
  if (selectedSiteFilter.value) {
    fetchNvrs();
    fetchCameras();
  } else {
    cameras.value = [];
    nvrs.value = [];
  }
};

const onHeaderNvrFilterChange = async () => {
  selectedNvrId.value = selectedNvrFilter.value; // Sync internal state
  // Re-init streams for the currently rendered (filtered) videos so
  // HLS instances attach and status flips to `online` when playback starts.
  detachAllStreams();
  await nextTick();
  try { await loadHlsCdn(); } catch {}
  setupVideoObservers();
  console.debug('[LiveView] onHeaderNvrFilterChange - selectedNvrFilter:', selectedNvrFilter.value);
};

// Switch site (kept for backward compatibility)
const switchSite = async () => {
  // cleanup previous streams
  detachAllStreams();
  selectedNvrId.value = ""; // Reset NVR selection when site changes
  await fetchNvrs();
  await fetchCameras();
};

// Switch NVR (kept for backward compatibility)
const switchNvr = async () => {
  // cleanup previous streams
  detachAllStreams();
  await fetchCameras();
};

// cleanup on unmount
onUnmounted(() => {
  detachAllStreams();
});

// if selected site changes elsewhere, refresh cameras
watch(selectedSiteId, (nv, ov) => {
  if (nv !== ov) {
    detachAllStreams();
    fetchCameras();
  }
});

// Grid view management
const setGridView = async (view: string) => {
  // Clean up existing streams before changing grid
  detachAllStreams();
  gridView.value = view;
  await nextTick();
  // Re-setup streams for the new grid layout
  try { await loadHlsCdn(); } catch {}
  setupVideoObservers();
  console.log(`Grid view changed to ${view}, showing max ${maxCamerasForGrid.value} cameras`);
};

// Computed properties
const gridClasses = computed(() => {
  return gridView.value;
});

const cameraColClass = computed(() => {
  switch (gridView.value) {
    case '1x1':
      return 'col-12';
    case '2x2':
      return 'col-md-6';
    case '3x3':
      return 'col-lg-4';
    case '4x4':
      return 'col-xl-3';
    default:
      return 'col-lg-4';
  }
});

const filteredNvrs = computed(() => {
  return nvrs.value.filter(nvr => nvr.site_uid === selectedSiteId.value);
});

const availableHeaderNvrs = computed(() => {
  if (!selectedSiteFilter.value) return [];
  return nvrs.value.filter(
    (nvr) => nvr.site_uid === selectedSiteFilter.value
  );
});

const maxCamerasForGrid = computed(() => {
  switch (gridView.value) {
    case '1x1':
      return 1;
    case '2x2':
      return 4;
    case '3x3':
      return 9;
    case '4x4':
      return 16;
    default:
      return 9;
  }
});

const filteredCameras = computed(() => {
  let filtered = cameras.value;

  // Filter by NVR if selected (using header filter)
  if (selectedNvrFilter.value) {
    const sel = String(selectedNvrFilter.value).trim();
    filtered = filtered.filter((camera) => {
      const anyCam: any = camera as any;
      const camNvr = (
        anyCam.nvr_uid ?? anyCam.nvrUid ?? anyCam.nvrId ?? anyCam.nvr ?? anyCam.video_recorder_uid ?? (anyCam.nvr && anyCam.nvr.uid) ?? ''
      );
      return String(camNvr || '').trim() === sel;
    });
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(camera =>
      camera.name.toLowerCase().includes(query) ||
      camera.room.toLowerCase().includes(query)
    );
  }

  // Limit cameras based on grid view
  const maxCameras = maxCamerasForGrid.value;
  return filtered.slice(0, maxCameras);
});

// Debug watcher: log filter changes and counts to help diagnose missing cameras
watch(selectedNvrFilter, (nv) => {
  try {
    const sel = String(nv || '').trim();
    const total = cameras.value.length;
    const matched = cameras.value.filter((camera) => {
      const anyCam: any = camera as any;
      const camNvr = (
        anyCam.nvr_uid ?? anyCam.nvrUid ?? anyCam.nvrId ?? anyCam.nvr ?? anyCam.video_recorder_uid ?? (anyCam.nvr && anyCam.nvr.uid) ?? ''
      );
      return String(camNvr || '').trim() === sel;
    }).length;
    console.debug('[LiveView] selectedNvrFilter changed:', sel, 'totalCameras:', total, 'matchedByNvr:', matched);
  } catch (e) {}
});

const totalCameras = computed(() => cameras.value.length);

const filteredSites = computed(() => {
  if (!siteSearchQuery.value.trim()) {
    return sites.value;
  }
  const query = siteSearchQuery.value.toLowerCase();
  return sites.value.filter(site => 
    site.name.toLowerCase().includes(query)
  );
});

const toggleSiteList = () => {
  isSiteSelectionOpen.value = !isSiteSelectionOpen.value;
  if (isSiteSelectionOpen.value) {
    siteSearchQuery.value = ""; // Reset search when opening
  }
};

const selectSite = (site: Site) => {
  selectedSiteFilter.value = site.uid;
  onHeaderSiteFilterChange();
  isSiteSelectionOpen.value = false;
};
const recordingCameras = computed(() => cameras.value.filter(c => c.recording).length);
const motionEvents = computed(() => 24); // Mock data
const activeAlerts = computed(() => 3); // Mock data
const resolvedAlerts = computed(() => 12); // Mock data



const recordingPercentage = computed(() =>
  totalCameras.value > 0 ? Math.round((recordingCameras.value / totalCameras.value) * 100) : 0
);

const alertsResolvedPercentage = computed(() =>
  (activeAlerts.value + resolvedAlerts.value) > 0 
    ? Math.round((resolvedAlerts.value / (activeAlerts.value + resolvedAlerts.value)) * 100) 
    : 0
);



// Sidebar helpers
const selectedSiteName = computed(() => {
  const site = sites.value.find(s => s.uid === selectedSiteId.value);
  return site ? site.name : (sites.value[0] ? sites.value[0].name : '');
});

const siteCameras = computed(() => {
  return cameras.value.filter(c => !selectedSiteId.value || c.site_uid === selectedSiteId.value);
});

// Methods
const viewFullscreen = (camera: Camera) => {
  const videoEl = document.getElementById(`video-${camera.uid}`) as HTMLVideoElement;
  if (videoEl) {
    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    } else if ((videoEl as any).webkitRequestFullscreen) { /* Safari */
      (videoEl as any).webkitRequestFullscreen();
    } else if ((videoEl as any).msRequestFullscreen) { /* IE11 */
      (videoEl as any).msRequestFullscreen();
    }
  }
};

const viewRecordings = (camera: Camera) => {
  console.log("View recordings for camera:", camera.name);
  // TODO: Navigate to recordings page with camera filter
};

// Drag and drop handlers
const onDragStart = (event: DragEvent, camera: Camera, index: number) => {
  draggedCamera.value = camera;
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({ uid: camera.uid, fromGrid: true, index }));
  }
};

const onDragStartFromSidebar = (event: DragEvent, camera: Camera) => {
  draggedCamera.value = camera;
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', JSON.stringify({ uid: camera.uid, fromGrid: false }));
  }
};

const onDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dragOverIndex.value = index;
};

const onDragLeave = () => {
  dragOverIndex.value = -1;
};

const onDrop = async (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  dragOverIndex.value = -1;

  if (!draggedCamera.value) return;

  try {
    const data = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
    const draggedUid = data.uid;
    const fromGrid = data.fromGrid;

    if (fromGrid) {
      // Reordering within grid
      const draggedIndex = filteredCameras.value.findIndex(c => c.uid === draggedUid);
      if (draggedIndex !== -1 && draggedIndex !== dropIndex) {
        const newCameras = [...cameras.value];
        const draggedCam = newCameras.find(c => c.uid === draggedUid);
        const targetCam = filteredCameras.value[dropIndex];
        
        if (draggedCam && targetCam) {
          const draggedMainIndex = newCameras.findIndex(c => c.uid === draggedUid);
          const targetMainIndex = newCameras.findIndex(c => c.uid === targetCam.uid);
          
          // Swap positions
          [newCameras[draggedMainIndex], newCameras[targetMainIndex]] = 
          [newCameras[targetMainIndex], newCameras[draggedMainIndex]];
          
          cameras.value = newCameras;
          
          // Refresh video streams
          detachAllStreams();
          await nextTick();
          setupVideoObservers();
        }
      }
    } else {
      // Dragged from sidebar - replace camera at dropIndex
      const targetCamera = filteredCameras.value[dropIndex];
      const sidebarCamera = cameras.value.find(c => c.uid === draggedUid);
      
      if (targetCamera && sidebarCamera) {
        const newCameras = [...cameras.value];
        const targetMainIndex = newCameras.findIndex(c => c.uid === targetCamera.uid);
        const sidebarMainIndex = newCameras.findIndex(c => c.uid === draggedUid);
        
        // Swap positions
        [newCameras[targetMainIndex], newCameras[sidebarMainIndex]] = 
        [newCameras[sidebarMainIndex], newCameras[targetMainIndex]];
        
        cameras.value = newCameras;
        
        // Refresh video streams
        detachAllStreams();
        await nextTick();
        setupVideoObservers();
      }
    }
  } catch (error) {
    console.error('Error during drop:', error);
  }
};

const onDragEnd = () => {
  draggedCamera.value = null;
  isDragging.value = false;
  dragOverIndex.value = -1;
};

// Click handler for sidebar camera items
const onCameraClick = async (camera: Camera) => {
  // Don't trigger if currently dragging
  if (isDragging.value) return;
  
  // Switch to 1x1 view
  await setGridView('1x1');
  
  // Move clicked camera to the first position
  const newCameras = [...cameras.value];
  const clickedIndex = newCameras.findIndex(c => c.uid === camera.uid);
  
  if (clickedIndex !== -1 && clickedIndex !== 0) {
    // Move to first position
    const [clickedCam] = newCameras.splice(clickedIndex, 1);
    newCameras.unshift(clickedCam);
    cameras.value = newCameras;
    
    // Refresh video streams
    detachAllStreams();
    await nextTick();
    setupVideoObservers();
  }
};

// Initialize on mount
onMounted(async () => {
  await fetchSites();
});
</script>

<style scoped>
.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-card {
  transition: all 0.2s ease;
  cursor: move;
}

.camera-card.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.camera-card.drag-over {
  border: 2px dashed #3699FF;
  background-color: rgba(54, 153, 255, 0.1);
}

.sidebar-camera-item {
  transition: background-color 0.2s ease;
}

.sidebar-camera-item:hover,
.sidebar-camera-item.hover-bg-light:hover {
  background-color: #f5f8fa !important;
}

.sidebar-camera-item.dragging {
  opacity: 0.5;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}

.drop-shadow {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}
</style>
