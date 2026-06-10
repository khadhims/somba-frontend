<template>
  <!--begin::Recording & Playback Overview-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">
            {{ t("appsRecordingPlayback.overview.title") }}
          </h4>
          <p class="text-muted mb-0">
            {{
              currentSite
                ? t("appsRecordingPlayback.overview.subtitleSite", {
                    site: currentSite.name,
                  })
                : t("appsRecordingPlayback.overview.subtitleAll")
            }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <div class="d-flex align-items-center" v-if="sites.length > 0">
              <label class="form-label me-3 mb-0 fw-semibold">{{
                t("appsRecordingPlayback.filters.siteLabel")
              }}</label>
              <select
                v-model="selectedSiteId"
                @change="switchSite"
                class="form-select form-select-solid w-200px"
                :disabled="loadingSites"
              >
                <option value="">
                  {{ t("appsRecordingPlayback.filters.siteAll") }}
                </option>
                <option v-for="site in sites" :key="site.uid" :value="site.uid">
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
        :description="t('appsRecordingPlayback.cards.totalStorage.title')"
        :value="totalStorageValue"
        :progress-text="totalStorageProgress"
        :progress-value="storageUsedPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="t('appsRecordingPlayback.cards.recordingCameras.title')"
        :value="recordingCamerasValue"
        :progress-text="recordingCamerasProgress"
        :progress-value="recordingPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="t('appsRecordingPlayback.cards.recordingsToday.title')"
        :value="recordingsTodayValue"
        :progress-text="recordingsTodayProgress"
        :progress-value="recordingsTodayPercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="t('appsRecordingPlayback.cards.averageDuration.title')"
        :value="avgDurationValue"
        :progress-text="
          t('appsRecordingPlayback.cards.averageDuration.progress')
        "
        :progress-value="100"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Recording Controls-->
  <div class="card mb-5">
    <div class="card-header">
      <div class="card-title">
        <h3 class="fw-bold">{{ t("appsRecordingPlayback.controls.title") }}</h3>
      </div>
      <div class="card-toolbar">
        <button @click="startAllRecording" class="btn btn-sm btn-success me-2">
          <i class="ki-duotone ki-play fs-2"></i>
          {{ t("appsRecordingPlayback.controls.startAll") }}
        </button>
        <button @click="stopAllRecording" class="btn btn-sm btn-danger">
          <i class="ki-duotone ki-stop fs-2"></i>
          {{ t("appsRecordingPlayback.controls.stopAll") }}
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div
          v-for="camera in cameras"
          :key="camera.uid"
          class="col-md-6 col-lg-4"
        >
          <div class="card border">
            <div class="card-body p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h6 class="card-title mb-0">{{ camera.name }}</h6>
                <span
                  class="badge"
                  :class="
                    camera.recording ? 'badge-success' : 'badge-secondary'
                  "
                >
                  {{
                    camera.recording
                      ? t("appsRecordingPlayback.controls.status.recording")
                      : t("appsRecordingPlayback.controls.status.stopped")
                  }}
                </span>
              </div>
              <div class="text-muted mb-3">{{ camera.room }}</div>
              <div class="d-flex gap-2">
                <button
                  v-if="!camera.recording"
                  @click="startRecording(camera)"
                  class="btn btn-sm btn-success flex-fill"
                >
                  <i class="ki-duotone ki-play fs-6"></i>
                  {{ t("appsRecordingPlayback.controls.buttons.start") }}
                </button>
                <button
                  v-else
                  @click="stopRecording(camera)"
                  class="btn btn-sm btn-danger flex-fill"
                >
                  <i class="ki-duotone ki-stop fs-6"></i>
                  {{ t("appsRecordingPlayback.controls.buttons.stop") }}
                </button>
                <button
                  @click="viewLive(camera)"
                  class="btn btn-sm btn-primary flex-fill"
                >
                  <i class="ki-duotone ki-eye fs-6"></i>
                  {{ t("appsRecordingPlayback.controls.buttons.live") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Recording Controls-->

  <!--begin::Recordings List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("appsRecordingPlayback.list.title") }}</h3>
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
            :placeholder="t('appsRecordingPlayback.list.searchPlaceholder')"
          />
        </div>
        <!--end::Search-->

        <!--begin::Date Filter-->
        <div class="me-3">
          <input
            type="date"
            v-model="selectedDate"
            @change="filterByDate"
            class="form-control form-control-solid w-150px"
          />
        </div>

        <!--begin::Camera Filter-->
        <div class="me-3">
          <select
            v-model="selectedCameraFilter"
            @change="filterByCamera"
            class="form-select form-select-solid w-150px"
          >
            <option value="">
              {{ t("appsRecordingPlayback.list.cameraFilterAll") }}
            </option>
            <option
              v-for="camera in cameras"
              :key="camera.uid"
              :value="camera.uid"
            >
              {{ camera.name }}
            </option>
          </select>
        </div>

        <button @click="refreshRecordings" class="btn btn-sm btn-light-primary">
          <i class="ki-duotone ki-arrows-circle fs-2"></i>
          {{ t("appsRecordingPlayback.list.refresh") }}
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedRecordings"
        :header="tableHeader"
        :checkbox-enabled="true"
        :enable-items-per-page-dropdown="true"
        :items-per-page="15"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        @on-items-select="handleItemsSelect"
        :empty-table-text="t('appsRecordingPlayback.list.table.empty')"
      >
        <template v-slot:camera="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-35px me-3">
              <span class="symbol-label bg-light-primary text-primary fw-bold">
                <i class="ki-duotone ki-security-user fs-6"></i>
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{
                row.camera_name
              }}</span>
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                row.room
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:start_time="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            new Date(row.start_time).toLocaleDateString()
          }}</span>
          <span class="text-muted fw-semibold text-muted d-block fs-7">{{
            new Date(row.start_time).toLocaleTimeString()
          }}</span>
        </template>

        <template v-slot:duration="{ row }">
          <span class="text-dark fw-bold d-block fs-6">
            {{ formatDuration(row.duration_seconds) }}
          </span>
        </template>

        <template v-slot:file_size="{ row }">
          <span class="text-dark fw-bold d-block fs-6">
            {{ formatFileSize(row.file_size_bytes) }}
          </span>
        </template>

        <template v-slot:type="{ row }">
          <span class="badge" :class="getRecordingTypeBadgeClass(row.type)">
            {{ getRecordingTypeLabel(row.type) }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="playRecording(row)"
              :title="t('appsRecordingPlayback.list.table.actions.play')"
            >
              <i class="ki-duotone ki-play fs-2"></i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click="downloadRecording(row)"
              :title="t('appsRecordingPlayback.list.table.actions.download')"
            >
              <i class="ki-duotone ki-download fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteRecording(row)"
              :title="t('appsRecordingPlayback.list.table.actions.delete')"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>

      <!--begin::Bulk Actions-->
      <div v-if="selectedRecordings.length > 0" class="mt-5">
        <div class="card bg-light">
          <div class="card-body py-3">
            <div class="d-flex align-items-center justify-content-between">
              <span class="fw-bold">
                {{
                  t("appsRecordingPlayback.list.bulk.selected", {
                    count: selectedRecordings.length,
                  })
                }}
              </span>
              <div class="d-flex gap-2">
                <button @click="bulkDownload" class="btn btn-sm btn-success">
                  <i class="ki-duotone ki-download fs-6"></i>
                  {{ t("appsRecordingPlayback.list.bulk.download") }}
                </button>
                <button @click="bulkDelete" class="btn btn-sm btn-danger">
                  <i class="ki-duotone ki-trash fs-6"></i>
                  {{ t("appsRecordingPlayback.list.bulk.delete") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Bulk Actions-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Recordings List-->
</template>

<script setup lang="ts">
defineOptions({
  name: "OverviewComponent",
});

import { ref, computed, onMounted } from "vue";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
// import ApiService from "@/core/services/ApiService";
import { useI18n } from "vue-i18n";

// Interface definitions
interface Recording {
  uid: string;
  camera_uid: string;
  camera_name: string;
  room: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  file_size_bytes: number;
  file_path: string;
  type: "scheduled" | "motion" | "manual";
  site_uid?: string;
}

interface Camera {
  uid: string;
  name: string;
  room: string;
  recording: boolean;
  site_uid: string;
}

interface Site {
  uid: string;
  name: string;
}

const { t } = useI18n();

const formatNumber = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

// Reactive data
const recordings = ref<Recording[]>([]);
const cameras = ref<Camera[]>([]);
const sites = ref<Site[]>([]);
const loading = ref(false);
const loadingSites = ref(false);
const searchQuery = ref("");
const selectedSiteId = ref("");
const selectedDate = ref("");
const selectedCameraFilter = ref("");
const sortLabel = ref("start_time");
const sortOrder = ref<"asc" | "desc">("desc");
const currentSite = ref<Site | null>(null);
const selectedRecordings = ref<Recording[]>([]);

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("appsRecordingPlayback.list.table.columns.camera"),
    columnLabel: "camera",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("appsRecordingPlayback.list.table.columns.startTime"),
    columnLabel: "start_time",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsRecordingPlayback.list.table.columns.duration"),
    columnLabel: "duration",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsRecordingPlayback.list.table.columns.fileSize"),
    columnLabel: "file_size",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsRecordingPlayback.list.table.columns.type"),
    columnLabel: "type",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("appsRecordingPlayback.list.table.columns.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Mock data for demonstration
const mockRecordings: Recording[] = [
  {
    uid: "1",
    camera_uid: "cam1",
    camera_name: "Front Entrance",
    room: "Lobby",
    start_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    end_time: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    duration_seconds: 1800, // 30 minutes
    file_size_bytes: 1024 * 1024 * 500, // 500MB
    file_path: "/recordings/front_entrance_20241201_140000.mp4",
    type: "scheduled",
    site_uid: "site1",
  },
  {
    uid: "2",
    camera_uid: "cam2",
    camera_name: "Parking Area",
    room: "Parking",
    start_time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    end_time: new Date(Date.now() - 1000 * 60 * 60 * 3.75).toISOString(),
    duration_seconds: 900, // 15 minutes
    file_size_bytes: 1024 * 1024 * 250, // 250MB
    file_path: "/recordings/parking_area_20241201_120000.mp4",
    type: "motion",
    site_uid: "site1",
  },
];

const mockCameras: Camera[] = [
  {
    uid: "cam1",
    name: "Front Entrance",
    room: "Lobby",
    recording: true,
    site_uid: "site1",
  },
  {
    uid: "cam2",
    name: "Parking Area",
    room: "Parking",
    recording: false,
    site_uid: "site1",
  },
  {
    uid: "cam3",
    name: "Reception Desk",
    room: "Reception",
    recording: true,
    site_uid: "site1",
  },
];

const mockSites: Site[] = [
  { uid: "site1", name: "Main Office" },
  { uid: "site2", name: "Warehouse Branch" },
];

// Fetch recordings from API
const fetchRecordings = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    // let apiUrl = "/recordings";
    // if (selectedSiteId.value) {
    //   apiUrl += `?site_uid=${selectedSiteId.value}`;
    // }
    // const response = await ApiService.get(apiUrl);
    // recordings.value = response.data.data || response.data;

    // Using mock data for now
    recordings.value = mockRecordings.filter(
      (recording) =>
        !selectedSiteId.value || recording.site_uid === selectedSiteId.value
    );
  } catch (error) {
    console.error("Error fetching recordings:", error);
    recordings.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch cameras from API
const fetchCameras = async () => {
  try {
    // TODO: Replace with actual API call
    // let apiUrl = "/cameras";
    // if (selectedSiteId.value) {
    //   apiUrl += `?site_uid=${selectedSiteId.value}`;
    // }
    // const response = await ApiService.get(apiUrl);
    // cameras.value = response.data.data || response.data;

    // Using mock data for now
    cameras.value = mockCameras.filter(
      (camera) =>
        !selectedSiteId.value || camera.site_uid === selectedSiteId.value
    );
  } catch (error) {
    console.error("Error fetching cameras:", error);
    cameras.value = [];
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
  } catch (error) {
    console.error("Error fetching sites:", error);
    sites.value = [];
  } finally {
    loadingSites.value = false;
  }
};

// Switch site
const switchSite = () => {
  const site = sites.value.find((s) => s.uid === selectedSiteId.value);
  currentSite.value = site || null;
  fetchRecordings();
  fetchCameras();
};

// Filter methods
const filterByDate = () => {
  // Filtering is handled in computed property
};

const filterByCamera = () => {
  // Filtering is handled in computed property
};

const refreshRecordings = () => {
  fetchRecordings();
};

// Recording control methods
const startRecording = async (camera: Camera) => {
  try {
    // TODO: API call to start recording
    // await ApiService.post(`/cameras/${camera.uid}/start-recording`);

    // Update local state
    const index = cameras.value.findIndex((c) => c.uid === camera.uid);
    if (index !== -1) {
      cameras.value[index].recording = true;
    }
  } catch (error) {
    console.error("Error starting recording:", error);
  }
};

const stopRecording = async (camera: Camera) => {
  try {
    // TODO: API call to stop recording
    // await ApiService.post(`/cameras/${camera.uid}/stop-recording`);

    // Update local state
    const index = cameras.value.findIndex((c) => c.uid === camera.uid);
    if (index !== -1) {
      cameras.value[index].recording = false;
    }
  } catch (error) {
    console.error("Error stopping recording:", error);
  }
};

const startAllRecording = async () => {
  for (const camera of cameras.value) {
    if (!camera.recording) {
      await startRecording(camera);
    }
  }
};

const stopAllRecording = async () => {
  for (const camera of cameras.value) {
    if (camera.recording) {
      await stopRecording(camera);
    }
  }
};

const viewLive = (camera: Camera) => {
  console.log("View live feed for camera:", camera.name);
  // TODO: Navigate to live view or open modal
};

// Recording action methods
const playRecording = (recording: Recording) => {
  console.log("Play recording:", recording.uid);
  // TODO: Open video player
};

const downloadRecording = (recording: Recording) => {
  console.log("Download recording:", recording.uid);
  // TODO: Implement download
};

const deleteRecording = async (recording: Recording) => {
  if (confirm(t("appsRecordingPlayback.list.bulk.confirmSingle"))) {
    try {
      // TODO: API call to delete recording
      // await ApiService.delete(`/recordings/${recording.uid}`);

      // Remove from local state
      const index = recordings.value.findIndex((r) => r.uid === recording.uid);
      if (index !== -1) {
        recordings.value.splice(index, 1);
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  }
};

// Bulk action methods
const handleItemsSelect = (items: Recording[]) => {
  selectedRecordings.value = items;
};

const bulkDownload = () => {
  console.log("Bulk download recordings:", selectedRecordings.value);
  // TODO: Implement bulk download
};

const bulkDelete = async () => {
  if (
    confirm(
      t("appsRecordingPlayback.list.bulk.confirmMultiple", {
        count: selectedRecordings.value.length,
      })
    )
  ) {
    try {
      for (const recording of selectedRecordings.value) {
        // TODO: API call to delete recording
        // await ApiService.delete(`/recordings/${recording.uid}`);

        // Remove from local state
        const index = recordings.value.findIndex(
          (r) => r.uid === recording.uid
        );
        if (index !== -1) {
          recordings.value.splice(index, 1);
        }
      }
      selectedRecordings.value = [];
    } catch (error) {
      console.error("Error deleting recordings:", error);
    }
  }
};

// Utility methods
const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return t("appsRecordingPlayback.format.notAvailable");
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return t("appsRecordingPlayback.format.duration.hoursMinutesSeconds", {
      hours,
      minutes,
      seconds: secs,
    });
  }

  if (minutes > 0) {
    return t("appsRecordingPlayback.format.duration.minutesSeconds", {
      minutes,
      seconds: secs,
    });
  }

  return t("appsRecordingPlayback.format.duration.seconds", { seconds: secs });
};

const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return t("appsRecordingPlayback.format.fileSize", {
      value: "0",
      unit: "B",
    });
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, index);
  const formatted = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: value >= 10 ? 1 : 2,
    minimumFractionDigits: 0,
  }).format(value);

  return t("appsRecordingPlayback.format.fileSize", {
    value: formatted,
    unit: units[index],
  });
};

const normalizeKey = (value?: string) =>
  (value ?? "").toLowerCase().replace(/[\s_-]/g, "");

const typeKeyMap: Record<string, string> = {
  scheduled: "scheduled",
  motion: "motion",
  manual: "manual",
  unknown: "unknown",
};

const getRecordingTypeBadgeClass = (type: string) => {
  switch (normalizeKey(type)) {
    case "scheduled":
      return "badge-light-primary";
    case "motion":
      return "badge-light-warning";
    case "manual":
      return "badge-light-success";
    default:
      return "badge-light-secondary";
  }
};

const getRecordingTypeLabel = (type: string) => {
  const key = typeKeyMap[normalizeKey(type)];
  return key ? t(`appsRecordingPlayback.list.table.types.${key}`) : type;
};

// Computed properties
const filteredAndSortedRecordings = computed(() => {
  let filtered = recordings.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (recording) =>
        recording.camera_name.toLowerCase().includes(query) ||
        recording.room.toLowerCase().includes(query) ||
        recording.type.toLowerCase().includes(query) ||
        getRecordingTypeLabel(recording.type).toLowerCase().includes(query)
    );
  }

  // Filter by date
  if (selectedDate.value) {
    const selectedDateStr = new Date(selectedDate.value).toDateString();
    filtered = filtered.filter(
      (recording) =>
        new Date(recording.start_time).toDateString() === selectedDateStr
    );
  }

  // Filter by camera
  if (selectedCameraFilter.value) {
    filtered = filtered.filter(
      (recording) => recording.camera_uid === selectedCameraFilter.value
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue: any = a[sortLabel.value as keyof Recording];
      let bValue: any = b[sortLabel.value as keyof Recording];

      if (sortLabel.value === "start_time") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === "asc" ? comparison : -comparison;
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortOrder.value === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  return filtered;
});

// Statistics computed properties
const totalStorageGB = computed(() => 1000); // Mock data
const usedStorageGB = computed(() =>
  Math.round(
    recordings.value.reduce(
      (total, recording) =>
        total + recording.file_size_bytes / (1024 * 1024 * 1024),
      0
    )
  )
);
const recordingCameras = computed(
  () => cameras.value.filter((c) => c.recording).length
);
const totalCameras = computed(() => cameras.value.length);
const recordingsToday = computed(() => {
  const today = new Date().toDateString();
  return recordings.value.filter(
    (r) => new Date(r.start_time).toDateString() === today
  ).length;
});
const totalRecordings = computed(() => recordings.value.length);
const avgDurationMinutes = computed(() => {
  if (recordings.value.length === 0) return 0;
  const totalSeconds = recordings.value.reduce(
    (total, r) => total + r.duration_seconds,
    0
  );
  return Math.round(totalSeconds / recordings.value.length / 60);
});

const storageUsedPercentage = computed(() =>
  totalStorageGB.value > 0
    ? Math.round((usedStorageGB.value / totalStorageGB.value) * 100)
    : 0
);

const recordingPercentage = computed(() =>
  totalCameras.value > 0
    ? Math.round((recordingCameras.value / totalCameras.value) * 100)
    : 0
);

const recordingsTodayPercentage = computed(() =>
  totalRecordings.value > 0
    ? Math.round((recordingsToday.value / totalRecordings.value) * 100)
    : 0
);

const totalStorageValue = computed(() =>
  t("appsRecordingPlayback.cards.totalStorage.value", {
    total: formatNumber(totalStorageGB.value, 0),
  })
);

const totalStorageProgress = computed(() =>
  t("appsRecordingPlayback.cards.totalStorage.progress", {
    used: formatNumber(usedStorageGB.value, 0),
    total: formatNumber(totalStorageGB.value, 0),
  })
);

const recordingCamerasValue = computed(() =>
  t("appsRecordingPlayback.cards.recordingCameras.value", {
    count: formatNumber(recordingCameras.value, 0),
  })
);

const recordingCamerasProgress = computed(() =>
  t("appsRecordingPlayback.cards.recordingCameras.progress", {
    total: formatNumber(totalCameras.value, 0),
  })
);

const recordingsTodayValue = computed(() =>
  t("appsRecordingPlayback.cards.recordingsToday.value", {
    count: formatNumber(recordingsToday.value, 0),
  })
);

const recordingsTodayProgress = computed(() =>
  t("appsRecordingPlayback.cards.recordingsToday.progress", {
    total: formatNumber(totalRecordings.value, 0),
  })
);

const avgDurationValue = computed(() =>
  t("appsRecordingPlayback.cards.averageDuration.value", {
    value: formatNumber(avgDurationMinutes.value, 0),
  })
);

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

// Initialize data on component mount
onMounted(() => {
  fetchSites();
  fetchRecordings();
  fetchCameras();
});
</script>
