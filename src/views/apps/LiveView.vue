<template>
  <!-- Live Camera Feed header -->
  <div class="card mb-4">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div>
        <h4 class="card-title mb-0">{{ t('appsLiveView.header.title') }}</h4>
        <!-- <div class="small text-muted">
          <span class="text-success me-2">●</span>{{ t('appsLiveView.header.status', { count: activeCameras }) }}
        </div> -->
      </div>

      <div class="d-flex align-items-center gap-2">
        <div class="d-flex align-items-center">
          <label class="form-label me-2 mb-0 fw-semibold">{{ t('appsLiveView.header.filters.siteLabel') }}</label>
          <select
            v-model="selectedSiteFilter"
            @change="onHeaderSiteFilterChange"
            class="form-select form-select-solid w-200px"
            :disabled="loadingSites"
          >
            <option v-if="loadingSites" value="">{{ t('appsLiveView.header.filters.site.loading') }}</option>
            <option v-else-if="sites.length === 0" value="">{{ t('appsLiveView.header.filters.site.none') }}</option>
            <option v-else value="" disabled>{{ t('appsLiveView.header.filters.site.placeholder') }}</option>
            <option v-for="site in sites" :key="site.uid" :value="site.uid">{{ site.name }}</option>
          </select>
        </div>

        <div class="d-flex align-items-center">
          <label class="form-label me-2 mb-0 fw-semibold">{{ t('appsLiveView.header.filters.nvrLabel') }}</label>
          <select
            v-model="selectedNvrFilter"
            @change="onHeaderNvrFilterChange"
            class="form-select form-select-solid w-200px"
            :disabled="loadingNvrs || !selectedSiteFilter"
          >
            <option v-if="loadingNvrs" value="">{{ t('appsLiveView.header.filters.nvr.loading') }}</option>
            <option v-else-if="!selectedSiteFilter" value="">{{ t('appsLiveView.header.filters.nvr.requiresSite') }}</option>
            <option v-else-if="availableHeaderNvrs.length === 0" value="">{{ t('appsLiveView.header.filters.nvr.none') }}</option>
            <option v-else value="">{{ t('appsLiveView.header.filters.nvr.all') }}</option>
            <option v-for="nvr in availableHeaderNvrs" :key="nvr.uid" :value="nvr.uid">{{ nvr.name }}</option>
          </select>
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
          >
            1x1
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '2x2' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('2x2')"
          >
            2x2
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '3x3' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('3x3')"
          >
            3x3
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="gridView === '4x4' ? 'btn-primary' : 'btn-light'"
            @click="setGridView('4x4')"
          >
            4x4
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main layout: left = camera grid, right = camera list -->
  <div class="row g-4">
    <div class="col-xl-9">
      <div class="card">
        <div class="card-body py-3">
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
                <div class="card-body p-3">
                  <!-- Drag handle -->
                  <div class="drag-handle position-absolute" style="top: 8px; right: 8px; z-index: 10;">
                    <i class="ki-duotone ki-menu fs-4 text-muted cursor-move">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title mb-0">{{ camera.room }}</h6>
                    <!-- <span class="badge" :class="camera.status === 'online' ? 'badge-light-success' : 'badge-light-danger'">{{ getStatusLabel(camera.status) }}</span> -->
                  </div>

                  <div
                    class="camera-feed-container bg-gray-300 rounded"
                    :style="{ height: gridView === '1x1' ? '520px' : '160px', position: 'relative' }"
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
                      <i class="ki-duotone ki-security-user fs-3x text-gray-500"><span class="path1"></span><span class="path2"></span></i>
                    </div>

                    <div class="position-absolute bottom-0 start-0 p-2">
                      <small class="text-white bg-dark bg-opacity-75 px-2 py-1 rounded">{{ camera.name }}</small>
                    </div>
                  </div>

                  <div class="mt-2">
                    <div class="d-flex justify-content-between">
                      <button class="btn btn-sm btn-light-primary" @click="viewFullscreen(camera)">
                        <i class="ki-duotone ki-maximize fs-6"></i>
                          {{ t('appsLiveView.grid.fullscreen') }}
                      </button>
                      <button class="btn btn-sm btn-light-info" @click="viewRecordings(camera)">
                        <i class="ki-duotone ki-video fs-6"></i>
                          {{ t('appsLiveView.grid.recordings') }}
                      </button>
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
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <h3 class="fw-bold m-0">{{ selectedSiteName }}</h3>
            <div class="small text-muted">{{ t('appsLiveView.sidebar.cameraCount', { count: totalCameras }) }}</div>
          </div>
          <div class="btn btn-sm btn-light">
            <i class="bi-list"></i>
          </div>
        </div>
        <div class="card-body p-0">
          <ul class="list-group list-group-flush">
            <li v-for="cam in siteCameras" :key="cam.uid" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-semibold">{{ cam.room }}</div>
                <div class="text-muted small">{{ cam.name }}</div>
              </div>
              <!-- <div>
                <span :class="['badge', cam.status === 'online' ? 'bg-success' : 'bg-secondary']" style="width:10px; height:10px; border-radius:50%; display:inline-block;"></span>
              </div> -->
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
  status: 'online' | 'offline' | 'connecting';
  recording: boolean;
  site_uid: string;
  nvr_uid?: string;
  public_endpoint_url?: string;
  // runtime fields for status management
  errorCount?: number;
  offlineTimer?: any;
  retryTimer?: any;
  statusCheckPausedUntil?: number | null;
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

// Drag and drop state
const draggedCamera = ref<Camera | null>(null);
const dragOverIndex = ref<number>(-1);
const isDragging = ref(false);

const normalizeStatusKey = (status?: string) => (status ?? "").toLowerCase();

const getStatusLabel = (status: string) => {
  switch (normalizeStatusKey(status)) {
    case "online":
      return t('appsLiveView.grid.status.online');
    case "offline":
      return t('appsLiveView.grid.status.offline');
    case "connecting":
      return t('appsLiveView.grid.status.connecting');
    default:
      return status;
  }
};

// Mock fallbacks to avoid compile/runtime errors when API fails
const mockSites: Site[] = [];
const mockCameras: Camera[] = [];

// Fetch cameras from API
const hlsInstances = new Map<string, any>();
const stallWatchers = new Map<string, number>();
// Nudge playback to live-edge when too far behind or stalling
const snapToLiveEdge = (videoEl: HTMLVideoElement, maxLagSec = 8, safetyBackSec = 2) => {
  try {
    if (!videoEl.seekable || videoEl.seekable.length === 0) return;
    const end = videoEl.seekable.end(videoEl.seekable.length - 1);
    const lag = end - videoEl.currentTime;
    if (lag > maxLagSec) {
      const target = Math.max(0, end - safetyBackSec);
      videoEl.currentTime = target;
    }
  } catch {}
};
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
  const existingWatch = stallWatchers.get(cam.uid);
  if (existingWatch) {
    clearInterval(existingWatch);
    stallWatchers.delete(cam.uid);
  }

  // initialize status tracking
  if (cam.offlineTimer) { try { clearTimeout(cam.offlineTimer); } catch {} cam.offlineTimer = null; }
  cam.errorCount = 0;
  cam.statusCheckPausedUntil = null;
  // Set connecting while (re)initializing
  cam.status = 'connecting';

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

    // Helpful logs and live-edge management
    const markOnline = () => {
      cam.status = 'online';
      cam.errorCount = 0;
      if (cam.offlineTimer) { try { clearTimeout(cam.offlineTimer); } catch {} cam.offlineTimer = null; }
      cam.statusCheckPausedUntil = Date.now() + 5 * 60 * 1000; // pause status flips for 5 minutes
    };

    hls.on(HlsGlobal.Events.LEVEL_LOADED, (_evt: any, data: any) => {
      if ((import.meta as any)?.env?.DEV) {
        console.log('[HLS] level loaded:', {
          live: data?.details?.live,
          targetduration: data?.details?.targetduration,
          partTarget: data?.details?.partTarget,
          totalduration: data?.details?.totalduration,
        });
      }
    });

    hls.on(HlsGlobal.Events.BUFFER_APPENDED, () => {
      // keep near live edge, but not at exact end
      snapToLiveEdge(videoEl, 12, 2);
      // Optional: debug buffer length in dev
      if ((import.meta as any)?.env?.DEV) {
        try {
          const b = videoEl.buffered;
          if (b.length) {
            const len = b.end(b.length - 1) - videoEl.currentTime;
            console.log(`[HLS] buffer=${len.toFixed(2)}s for`, cam.uid);
          }
        } catch {}
      }
    });

    hls.on(HlsGlobal.Events.FRAG_LOADED, () => {
      if (cam.status !== 'online') markOnline();
    });
    hls.on(HlsGlobal.Events.ERROR, (_evt: any, data: any) => {
      // Respect pause window to avoid thrash for status flips, but still handle recovery
      const inPause = cam.statusCheckPausedUntil && Date.now() < cam.statusCheckPausedUntil;
      if (data && data.fatal === false) {
        const details = (data.details || data.error || data.reason || '').toString().toLowerCase();
        if (details.includes('buffer_stalled') || details.includes('buffer-stalled')) {
          snapToLiveEdge(videoEl, 6, 1.5);
          videoEl.play().catch(() => {});
        }
        cam.errorCount = (cam.errorCount || 0) + 1;
        if (!inPause && cam.errorCount > 3 && !cam.offlineTimer) {
          cam.offlineTimer = setTimeout(() => {
            if ((cam.errorCount || 0) > 3) {
              cam.status = 'offline';
              cam.statusCheckPausedUntil = null;
              if (!cam.retryTimer) {
                cam.retryTimer = setInterval(() => {
                  if (cam.statusCheckPausedUntil && Date.now() < cam.statusCheckPausedUntil) return;
                  cam.errorCount = 0;
                  cam.status = 'offline';
                  const ex = hlsInstances.get(cam.uid);
                  if (ex) { try { ex.destroy(); } catch {} hlsInstances.delete(cam.uid); }
                  const ve = document.getElementById(`video-${cam.uid}`) as HTMLVideoElement | null;
                  if (ve) attachStreamToVideo(cam);
                }, 30000);
              }
            }
            cam.offlineTimer = null;
          }, 60000);
        }
        return;
      }
      if (!data || !('fatal' in data)) return;
      // Fatal errors
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
    });

    hls.loadSource(url);
    hls.attachMedia(videoEl);
    hls.on(HlsGlobal.Events.MANIFEST_PARSED, () => {
      markOnline();
      videoEl.play().catch(() => {
        // Autoplay or readiness might delay playback; retry shortly without flipping status
        window.setTimeout(() => {
          try { videoEl.play().catch(() => {}); } catch {}
        }, 500);
      });
    });
    hlsInstances.set(cam.uid, hls);
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    // native HLS (Safari)
    videoEl.src = url;
    const onPlaying = () => {
      cam.status = 'online';
    };
    videoEl.addEventListener('playing', onPlaying, { once: true });
    videoEl.addEventListener('loadeddata', () => {
      try {
        videoEl.play().catch(() => {
          // Retry without changing status
          window.setTimeout(() => { try { videoEl.play().catch(() => {}); } catch {} }, 500);
        });
      } catch {}
    }, { once: true });
  } else {
    // fallback: set src and hope for best
    videoEl.src = url;
  }

  // Simple stall detection and recovery for live
  const watcher = window.setInterval(() => {
    if (!videoEl) return;
    const stalled = videoEl.readyState < 2 || videoEl.paused;
    if (stalled) {
      try {
        videoEl.play().catch(() => {});
      } catch {}
    }
  }, 5000);
  stallWatchers.set(cam.uid, watcher);
  attachedSet.add(cam.uid);
};

const detachAllStreams = () => {
  hlsInstances.forEach((hls) => {
    try { hls.destroy(); } catch(_) {}
  });
  hlsInstances.clear();
  stallWatchers.forEach((id) => clearInterval(id));
  stallWatchers.clear();
  // clear camera timers
  cameras.value.forEach((c) => {
    if (c.retryTimer) { try { clearInterval(c.retryTimer); } catch {} c.retryTimer = null; }
    if (c.offlineTimer) { try { clearTimeout(c.offlineTimer); } catch {} c.offlineTimer = null; }
  });
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
        status: (String(it.status || '').toLowerCase() === 'online') ? 'online' : 'offline',
        recording: Boolean(it.is_recording || it.recording),
        site_uid: (it.site_uid ?? it.site?.uid) || selectedSiteId.value,
        // Canonical field used across this component
        nvr_uid: nvrCandidate ?? undefined,
        // Keep original common variants to help debugging and external consumers
        video_recorder_uid: it.video_recorder_uid ?? undefined,
        nvrId: it.nvrId ?? it.nvr_id ?? undefined,
        nvr: it.nvr ?? undefined,
        public_endpoint_url: it.public_endpoint_url ?? it.publicEndpointUrl ?? it.ipAddress ?? it.url ?? undefined,
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
    if (!selectedTeamId) {
      console.warn('[LiveView] No team selected, cannot load sites');
      sites.value = [];
      return;
    }

    console.debug('[LiveView] Using selectedTeamId:', selectedTeamId);
    const resp = await ApiService.query(`teams/${selectedTeamId}/sites`, {});
    
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
  gridView.value = view;
  await nextTick();
  setupVideoObservers();
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

  return filtered;
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
const activeCameras = computed(() => cameras.value.filter(c => c.status === 'online').length);
const onlineCameras = computed(() => activeCameras.value);
const recordingCameras = computed(() => cameras.value.filter(c => c.recording).length);
const motionEvents = computed(() => 24); // Mock data
const activeAlerts = computed(() => 3); // Mock data
const resolvedAlerts = computed(() => 12); // Mock data

const onlineCamerasPercentage = computed(() =>
  totalCameras.value > 0 ? Math.round((onlineCameras.value / totalCameras.value) * 100) : 0
);

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
  console.log("View fullscreen for camera:", camera.name);
  // TODO: Implement fullscreen view
};

const viewRecordings = (camera: Camera) => {
  console.log("View recordings for camera:", camera.name);
  // TODO: Navigate to recordings view
};

// Drag and drop methods
const onDragStart = (event: DragEvent, camera: Camera, index: number) => {
  draggedCamera.value = camera;
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', camera.uid);
  }
};

const onDragEnd = () => {
  draggedCamera.value = null;
  dragOverIndex.value = -1;
  isDragging.value = false;
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

const onDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault();
  
  if (!draggedCamera.value) return;
  
  const draggedIndex = filteredCameras.value.findIndex(c => c.uid === draggedCamera.value!.uid);
  if (draggedIndex === -1 || draggedIndex === targetIndex) return;
  
  // Create a new array with reordered cameras
  const reorderedCameras = [...filteredCameras.value];
  const [draggedItem] = reorderedCameras.splice(draggedIndex, 1);
  reorderedCameras.splice(targetIndex, 0, draggedItem);
  
  // Update the main cameras array while preserving the original order for non-filtered items
  const newCamerasOrder = [...cameras.value];
  
  // Remove filtered cameras from their current positions
  filteredCameras.value.forEach(camera => {
    const index = newCamerasOrder.findIndex(c => c.uid === camera.uid);
    if (index !== -1) {
      newCamerasOrder.splice(index, 1);
    }
  });
  
  // Insert reordered cameras at the beginning (or you could insert at original position)
  reorderedCameras.forEach((camera, index) => {
    newCamerasOrder.splice(index, 0, camera);
  });
  
  cameras.value = newCamerasOrder;
  
  // Reset drag state
  draggedCamera.value = null;
  dragOverIndex.value = -1;
  isDragging.value = false;
  
  // Re-setup video observers after reordering
  nextTick(() => {
    setupVideoObservers();
  });
};

// Initialize data on component mount
onMounted(() => {
  fetchSites();
});
</script>

<style scoped>
.camera-feed-container {
  border: 2px solid #e4e6ef;
}
.camera-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  background: #000;
}

/* Drag and drop styles */
.camera-card {
  transition: all 0.2s ease;
  cursor: grab;
}

.camera-card:active {
  cursor: grabbing;
}

.camera-card.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
  z-index: 1000;
}

.camera-card.drag-over {
  border: 2px dashed #009ef7;
  background-color: rgba(0, 158, 247, 0.05);
  transform: scale(1.02);
}

.drag-handle {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.camera-card:hover .drag-handle {
  opacity: 1;
}

.cursor-move {
  cursor: move;
}
</style>
