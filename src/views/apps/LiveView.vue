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
            <option v-for="site in sites" :key="site.uid" :value="site.uid">{{ site.name }}</option>
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
                    <div class="d-flex align-items-center justify-content-center h-100">
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
import { ref, computed, onMounted } from "vue";
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

// Fetch cameras from API
const fetchCameras = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    // const response = await ApiService.get(`/sites/${selectedSiteId.value}/cameras`);
    // cameras.value = response.data.data || response.data;
    
    // Using mock data for now
    cameras.value = mockCameras.filter(camera => 
      !selectedSiteId.value || camera.site_uid === selectedSiteId.value
    );
  } catch (error) {
    console.error("Error fetching cameras:", error);
    cameras.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch sites from API
const fetchSites = async () => {
  loadingSites.value = true;
  try {
    // TODO: Replace with actual API call
    // const response = await ApiService.get("/sites");
    // sites.value = response.data.data || response.data;
    
    // Using mock data for now
    sites.value = mockSites;
    
    if (sites.value.length > 0) {
      selectedSiteId.value = sites.value[0].uid;
      fetchCameras();
    }
  } catch (error) {
    console.error("Error fetching sites:", error);
    sites.value = [];
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
