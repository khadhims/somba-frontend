<template>
  <!--begin::Live View-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Live View</h4>
          <p class="text-muted mb-0">
            Real-time camera monitoring and surveillance
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <div class="d-flex align-items-center" v-if="sites.length > 0">
              <label class="form-label me-3 mb-0 fw-semibold">Site:</label>
              <select
                v-model="selectedSiteId"
                @change="switchSite"
                class="form-select form-select-solid w-200px"
                :disabled="loadingSites"
              >
                <option
                  v-for="site in sites"
                  :key="site.uid"
                  :value="site.uid"
                >
                  {{ site.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'Active Cameras'"
        :value="activeCameras"
        :progress-text="`${onlineCameras} Online`"
        :progress-value="onlineCamerasPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Recording Status'"
        :value="recordingCameras"
        :progress-text="`${totalCameras} Total`"
        :progress-value="recordingPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Motion Events'"
        :value="motionEvents"
        :progress-text="`Last 24h`"
        :progress-value="100"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Alerts'"
        :value="activeAlerts"
        :progress-text="`${resolvedAlerts} Resolved`"
        :progress-value="alertsResolvedPercentage"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Camera Grid-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Camera Feeds</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1 me-5">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-solid w-250px ps-12"
            placeholder="Search cameras..."
          />
        </div>
        <!--end::Search-->

        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-sm"
            :class="{ 'btn-primary': gridView === '2x2', 'btn-light': gridView !== '2x2' }"
            @click="setGridView('2x2')"
          >
            2x2
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="{ 'btn-primary': gridView === '3x3', 'btn-light': gridView !== '3x3' }"
            @click="setGridView('3x3')"
          >
            3x3
          </button>
          <button
            type="button"
            class="btn btn-sm"
            :class="{ 'btn-primary': gridView === '4x4', 'btn-light': gridView !== '4x4' }"
            @click="setGridView('4x4')"
          >
            4x4
          </button>
        </div>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <div class="row g-3" :class="gridClasses">
        <div
          v-for="camera in filteredCameras"
          :key="camera.uid"
          :class="cameraColClass"
        >
          <div class="card">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="card-title mb-0">{{ camera.name }}</h6>
                <span
                  class="badge"
                  :class="camera.status === 'online' ? 'badge-light-success' : 'badge-light-danger'"
                >
                  {{ camera.status }}
                </span>
              </div>
              <div class="camera-feed-container bg-gray-300 rounded" style="height: 200px; position: relative;">
                <div class="d-flex align-items-center justify-content-center h-100">
                  <i class="ki-duotone ki-security-user fs-3x text-gray-500">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </div>
                <div class="position-absolute bottom-0 start-0 p-2">
                  <small class="text-white bg-dark bg-opacity-75 px-2 py-1 rounded">
                    {{ camera.room }}
                  </small>
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
        <i class="ki-duotone ki-security-user fs-3x text-gray-400 mb-3">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <p class="text-gray-500">No cameras found</p>
      </div>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Camera Grid-->
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
