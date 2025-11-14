<template>
  <!-- Live Camera Feed header -->
  <div class="card mb-4">
    <div class="card-body d-flex align-items-center justify-content-between">
      <div>
        <h4 class="card-title mb-0">Live Camera Feed</h4>
        <div class="small text-muted">
          <span class="text-success me-2">●</span>{{ activeCameras }} cameras online
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        <div v-if="sites.length > 0" class="d-flex align-items-center">
          <label class="form-label me-2 mb-0 fw-semibold">Site:</label>
          <select
            v-model="selectedSiteId"
            @change="switchSite"
            class="form-select form-select-solid w-200px"
            :disabled="loadingSites"
          >
            <option value="">All Sites</option>
            <option v-for="site in sites" :key="site.uid" :value="site.uid">
              {{ site.name }}
            </option>
          </select>
        </div>

        <div class="btn-group" role="group">
          <button type="button" class="btn btn-sm" :class="{ 'btn-light': true }">
            <i class="bi-grid-fill"></i>
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
            <div v-for="camera in filteredCameras" :key="camera.uid" :class="cameraColClass">
              <div class="card">
                <div class="card-body p-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-title mb-0">{{ camera.room }}</h6>
                    <span class="badge" :class="camera.status === 'online' ? 'badge-light-success' : 'badge-light-danger'">{{ camera.status }}</span>
                  </div>

                  <div class="camera-feed-container bg-gray-300 rounded" style="height: 160px; position: relative;">
                    <div v-if="camera.public_endpoint_url && !invalidUrlSet.has(camera.uid)" class="h-100">
                      <video
                        :src="camera.public_endpoint_url"
                        class="camera-video"
                        playsinline
                        muted
                        autoplay
                        preload="auto"
                        crossorigin="anonymous"
                        controls
                      ></video>
                    </div>
                    <div v-else-if="camera.public_endpoint_url && invalidUrlSet.has(camera.uid)" class="d-flex align-items-center justify-content-center h-100 px-3 text-wrap">
                      <small class="text-muted">URL invalid: <a :href="camera.public_endpoint_url" target="_blank" rel="noopener">{{ camera.public_endpoint_url }}</a></small>
                    </div>
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
                        Fullscreen
                      </button>
                      <button class="btn btn-sm btn-light-info" @click="viewRecordings(camera)">
                        <i class="ki-duotone ki-video fs-6"></i>
                        Recordings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredCameras.length === 0" class="text-center py-5">
            <i class="ki-duotone ki-security-user fs-3x text-gray-400 mb-3"><span class="path1"></span><span class="path2"></span></i>
            <p class="text-gray-500">No cameras found</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <h3 class="fw-bold m-0">{{ selectedSiteName }}</h3>
            <div class="small text-muted">{{ totalCameras }} cameras</div>
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
              <div>
                <span :class="['badge', cam.status === 'online' ? 'bg-success' : 'bg-secondary']" style="width:10px; height:10px; border-radius:50%; display:inline-block;"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute } from 'vue-router';
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import ApiService from "@/core/services/ApiService";

// Interface definitions
interface Camera {
  uid: string;
  name: string;
  room: string;
  status: 'online' | 'offline';
  recording: boolean;
  site_uid: string;
  public_endpoint_url?: string;
}

interface Site {
  uid: string;
  name: string;
}

// Reactive data
const cameras = ref<Camera[]>([]);
const sites = ref<Site[]>([]);
const loading = ref(false);
const loadingSites = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref("");
const gridView = ref("3x3");

// Track urls that fail quick validation
const invalidUrlSet = ref<Set<string>>(new Set());

const route = useRoute();

// Mock data for demonstration
const mockCameras: Camera[] = [
  { uid: "1", name: "Front Entrance", room: "Lobby", status: "online", recording: true, site_uid: "site1" },
  { uid: "2", name: "Parking Area", room: "Parking", status: "online", recording: true, site_uid: "site1" },
  { uid: "3", name: "Reception Desk", room: "Reception", status: "offline", recording: false, site_uid: "site1" },
  { uid: "4", name: "Conference Room A", room: "Meeting", status: "online", recording: true, site_uid: "site1" },
  { uid: "5", name: "Warehouse Entry", room: "Warehouse", status: "online", recording: true, site_uid: "site1" },
  { uid: "6", name: "Loading Dock", room: "Loading", status: "online", recording: false, site_uid: "site1" },
];

const mockSites: Site[] = [
  { uid: "site1", name: "Main Office" },
  { uid: "site2", name: "Warehouse Branch" },
];

// Fetch cameras from API (sites/{site_uid}/cameras)
const fetchCameras = async () => {
  loading.value = true;
  invalidUrlSet.value = new Set();
  try {
    if (!selectedSiteId.value) {
      cameras.value = [];
      return;
    }

    const resp = await ApiService.query(`sites/${encodeURIComponent(selectedSiteId.value)}/cameras`, {});
    let raw: any = resp?.data?.data ?? resp?.data ?? null;
    let data: any[] = [];
    if (Array.isArray(raw)) data = raw; else if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.items)) data = raw.items;
      else if (Array.isArray(raw.cameras)) data = raw.cameras;
      else if (Array.isArray(raw.results)) data = raw.results;
      else data = [raw];
    }

    cameras.value = data.map((it: any) => ({
      uid: it.uid ?? it.id?.toString() ?? (Math.random() * 1e9).toString(),
      name: it.name ?? it.camera_name ?? '',
      room: it.room_name ?? it.room ?? it.location ?? '',
      status: (String(it.status || '').toLowerCase() === 'online') ? 'online' : 'offline',
      recording: Boolean(it.is_recording || it.recording),
      site_uid: it.site_uid ?? it.site?.uid ?? selectedSiteId.value,
      public_endpoint_url: it.public_endpoint_url ?? it.publicEndpointUrl ?? it.ipAddress ?? it.url ?? undefined,
    }));

    // Quick validation: try load each URL natively to detect obviously invalid URLs
    await nextTick();
    cameras.value.forEach((cam) => {
      const url = cam.public_endpoint_url;
      if (!url) return;

      const lower = String(url).toLowerCase();

      // If URL looks like an HLS manifest, attempt HLS-aware validation first.
      if (lower.includes('.m3u8')) {
        try {
          // If browser natively supports HLS (Safari), treat as valid
          const nativeTest = document.createElement('video');
          if (nativeTest && typeof nativeTest.canPlayType === 'function') {
            const can = nativeTest.canPlayType('application/vnd.apple.mpegurl');
            if (can === 'probably' || can === 'maybe') {
              return; // native HLS supported
            }
          }

          const HlsLib = (window as any).Hls;
          if (HlsLib) {
            let done = false;
            const videoEl = document.createElement('video');
            videoEl.muted = true;
            videoEl.crossOrigin = 'anonymous';

            const hls = new HlsLib({
              enableWorker: true,
              lowLatencyMode: true,
              maxBufferLength: 30,
              // don't automatically start loading fragments (segments) during validation
              // this prevents .ts segment downloads until we explicitly call startLoad()
              autoStartLoad: false,
            });

            const cleanupHls = () => {
              try { hls.destroy(); } catch (e) {}
              try { videoEl.removeAttribute('src'); videoEl.load(); } catch (e) {}
            };

            const manifestParsed = () => {
              if (done) return; done = true;
              clearTimeout(hlsTimer);
              cleanupHls();
              // manifest parsed => treat as valid (do nothing)
            };

            const onHlsError = (_evt: any, data: any) => {
              if (done) return;
              // mark invalid only on fatal errors
              if (data && data.fatal) {
                done = true;
                clearTimeout(hlsTimer);
                cleanupHls();
                invalidUrlSet.value.add(cam.uid);
              }
            };

            hls.on(HlsLib.Events.MANIFEST_PARSED, manifestParsed);
            hls.on(HlsLib.Events.ERROR, onHlsError);

            // safety timeout
            const hlsTimer = window.setTimeout(() => {
              if (done) return; done = true;
              try { cleanupHls(); } catch (e) {}
              // if manifest not parsed within timeout, mark invalid
              invalidUrlSet.value.add(cam.uid);
            }, 4000);

            try {
              hls.loadSource(url);
              hls.attachMedia(videoEl);
              return; // we've launched HLS validation, skip native test
            } catch (e) {
              try { clearTimeout(hlsTimer); } catch (e) {}
              try { cleanupHls(); } catch (e) {}
              // fall through to native test as fallback
            }
          } else {
            // hls.js not available; don't mark invalid here — let main player try
            return;
          }
        } catch (e) {
          // any unexpected error — fall back to native validation below
        }
      }

      // create an off-DOM video element to test native playback for non-HLS URLs
      try {
        const v = document.createElement('video');
        v.crossOrigin = 'anonymous';
        v.preload = 'metadata';
        let done = false;
        let timer: number | undefined;
        const onCan = () => {
          if (done) return; done = true;
          cleanup();
        };
        const onErr = () => {
          if (done) return; done = true;
          invalidUrlSet.value.add(cam.uid);
          cleanup();
        };
        const cleanup = () => {
          try { if (timer) clearTimeout(timer); } catch (e) {}
          try { v.pause(); } catch {}
          try { v.removeAttribute('src'); } catch {}
          try { v.load(); } catch {}
          v.removeEventListener('loadeddata', onCan);
          v.removeEventListener('error', onErr);
        };
        v.addEventListener('loadeddata', onCan, { once: true });
        v.addEventListener('error', onErr, { once: true });
        // timeout fallback: if not loaded in 3s mark invalid
        timer = window.setTimeout(() => {
          if (done) return; done = true;
          invalidUrlSet.value.add(cam.uid);
          cleanup();
        }, 3000);
        // set src last
        v.src = url;
      } catch (e) {
        invalidUrlSet.value.add(cam.uid);
      }
    });

  } catch (error) {
    console.error('Error fetching cameras:', error);
    cameras.value = mockCameras.filter(camera => !selectedSiteId.value || camera.site_uid === selectedSiteId.value);
  } finally {
    loading.value = false;
  }
};

// Fetch sites from API (prefer team-scoped: teams/{team_uid}/sites)
const fetchSites = async () => {
  loadingSites.value = true;
  try {
    // Resolve team UID from route query or localStorage
    const teamUid = (route.query.teamId as string) || localStorage.getItem('lastSelectedTeam') || '';

    let resp: any;
    if (teamUid) {
      resp = await ApiService.query(`teams/${encodeURIComponent(teamUid)}/sites`, {});
    } else {
      resp = await ApiService.query('sites', {});
    }

    // Normalize response shapes: resp.data.data | resp.data | items | sites | results
    const raw = resp?.data?.data ?? resp?.data ?? [];
    let data: any[] = [];
    if (Array.isArray(raw)) data = raw;
    else if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.items)) data = raw.items;
      else if (Array.isArray(raw.sites)) data = raw.sites;
      else if (Array.isArray(raw.results)) data = raw.results;
      else data = [raw];
    }

    sites.value = data.map((s: any) => ({ uid: s.uid ?? s.id, name: s.name ?? s.title ?? '' }));

    // choose selected site: prefer route query -> lastSelectedSite -> first site
    const fromRoute = (route.query.siteId as string) || '';
    const fromStorage = localStorage.getItem('lastSelectedSite') || '';
    selectedSiteId.value = fromRoute || fromStorage || (sites.value[0] ? sites.value[0].uid : '');

    if (selectedSiteId.value) {
      // persist selection
      try { localStorage.setItem('lastSelectedSite', selectedSiteId.value); } catch {}
      await fetchCameras();
    } else {
      cameras.value = [];
    }
  } catch (err) {
    console.error('Error fetching sites:', err);
    // fall back to mock sites if API fails
    sites.value = mockSites;
    if (sites.value.length > 0) {
      selectedSiteId.value = sites.value[0].uid;
      await fetchCameras();
    }
  } finally {
    loadingSites.value = false;
  }
};

// Switch site
const switchSite = () => {
  fetchCameras();
};

// Grid view management
const setGridView = (view: string) => {
  gridView.value = view;
};

// Computed properties
const gridClasses = computed(() => {
  return gridView.value;
});

const cameraColClass = computed(() => {
  switch (gridView.value) {
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

const filteredCameras = computed(() => {
  if (!searchQuery.value.trim()) {
    return cameras.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return cameras.value.filter(camera =>
    camera.name.toLowerCase().includes(query) ||
    camera.room.toLowerCase().includes(query)
  );
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

// Initialize data on component mount
onMounted(() => {
  fetchSites();
});
</script>

<style scoped>
.camera-feed-container {
  border: 2px solid #e4e6ef;
}
</style>
