<template>
  <!--begin::Recording & Playback Settings-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Recording & Playback Settings</h4>
          <p class="text-muted mb-0">
            Configure recording schedules and storage settings
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-8">
    <!--begin::Recording Settings-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Recording Configuration</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveRecordingSettings">
            <!--begin::Recording Mode-->
            <div class="mb-7">
              <label class="form-label">Recording Mode</label>
              <select
                v-model="recordingSettings.mode"
                class="form-select form-select-solid"
              >
                <option value="continuous">Continuous Recording</option>
                <option value="scheduled">Scheduled Recording</option>
                <option value="motion">Motion-Based Recording</option>
                <option value="hybrid">Hybrid (Motion + Scheduled)</option>
              </select>
              <div class="text-muted fs-7">Choose how recordings are triggered</div>
            </div>
            <!--end::Recording Mode-->

            <!--begin::Video Quality-->
            <div class="mb-7">
              <label class="form-label">Video Quality</label>
              <select
                v-model="recordingSettings.quality"
                class="form-select form-select-solid"
              >
                <option value="720p">720p (Standard)</option>
                <option value="1080p">1080p (High)</option>
                <option value="4k">4K (Ultra High)</option>
              </select>
              <div class="text-muted fs-7">Higher quality uses more storage space</div>
            </div>
            <!--end::Video Quality-->

            <!--begin::Frame Rate-->
            <div class="mb-7">
              <label class="form-label">Frame Rate (FPS)</label>
              <select
                v-model="recordingSettings.frameRate"
                class="form-select form-select-solid"
              >
                <option value="15">15 FPS</option>
                <option value="25">25 FPS</option>
                <option value="30">30 FPS</option>
                <option value="60">60 FPS</option>
              </select>
              <div class="text-muted fs-7">Higher frame rates provide smoother video</div>
            </div>
            <!--end::Frame Rate-->

            <!--begin::Compression-->
            <div class="mb-7">
              <label class="form-label">Video Compression</label>
              <select
                v-model="recordingSettings.compression"
                class="form-select form-select-solid"
              >
                <option value="h264">H.264 (Standard)</option>
                <option value="h265">H.265 (Efficient)</option>
                <option value="mjpeg">MJPEG (High Quality)</option>
              </select>
              <div class="text-muted fs-7">H.265 provides better compression but requires more processing</div>
            </div>
            <!--end::Compression-->

            <!--begin::Pre/Post Recording-->
            <div class="row">
              <div class="col-md-6">
                <div class="mb-7">
                  <label class="form-label">Pre-Recording (seconds)</label>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="recordingSettings.preRecordingSeconds"
                    min="0"
                    max="60"
                  />
                  <div class="text-muted fs-7">Record before motion trigger</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-7">
                  <label class="form-label">Post-Recording (seconds)</label>
                  <input
                    type="number"
                    class="form-control form-control-solid"
                    v-model="recordingSettings.postRecordingSeconds"
                    min="0"
                    max="300"
                  />
                  <div class="text-muted fs-7">Record after motion ends</div>
                </div>
              </div>
            </div>
            <!--end::Pre/Post Recording-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingRecordingSettings">
                <span v-if="savingRecordingSettings" class="spinner-border spinner-border-sm me-2"></span>
                Save Recording Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Recording Settings-->

    <!--begin::Storage Settings-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Storage Management</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveStorageSettings">
            <!--begin::Storage Location-->
            <div class="mb-7">
              <label class="form-label">Storage Location</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control form-control-solid"
                  v-model="storageSettings.location"
                  readonly
                />
                <button
                  type="button"
                  class="btn btn-outline btn-outline-primary"
                  @click="selectStorageLocation"
                >
                  Browse
                </button>
              </div>
              <div class="text-muted fs-7">Default location for recorded videos</div>
            </div>
            <!--end::Storage Location-->

            <!--begin::Retention Policy-->
            <div class="mb-7">
              <label class="form-label">Auto-Delete Policy</label>
              <select
                v-model="storageSettings.retentionPolicy"
                class="form-select form-select-solid"
              >
                <option value="never">Never delete</option>
                <option value="7days">Delete after 7 days</option>
                <option value="30days">Delete after 30 days</option>
                <option value="90days">Delete after 90 days</option>
                <option value="1year">Delete after 1 year</option>
                <option value="storage_full">Delete when storage full</option>
              </select>
              <div class="text-muted fs-7">Automatically manage storage space</div>
            </div>
            <!--end::Retention Policy-->

            <!--begin::Storage Limit-->
            <div class="mb-7">
              <label class="form-label">Maximum Storage (GB)</label>
              <input
                type="number"
                class="form-control form-control-solid"
                v-model="storageSettings.maxStorageGB"
                min="100"
                max="10000"
              />
              <div class="text-muted fs-7">Maximum space to use for recordings</div>
            </div>
            <!--end::Storage Limit-->

            <!--begin::Current Storage Usage-->
            <div class="mb-7">
              <label class="form-label">Current Storage Usage</label>
              <div class="progress" style="height: 20px;">
                <div
                  class="progress-bar"
                  :style="{ width: storageUsagePercentage + '%' }"
                  :class="getStorageUsageClass()"
                >
                  {{ storageUsagePercentage }}%
                </div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <span class="text-muted fs-7">{{ usedStorageGB }}GB used</span>
                <span class="text-muted fs-7">{{ storageSettings.maxStorageGB }}GB total</span>
              </div>
            </div>
            <!--end::Current Storage Usage-->

            <!--begin::Backup Settings-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="storageSettings.backup.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  Enable Cloud Backup
                </span>
              </label>
              <div class="text-muted fs-7">
                Automatically backup recordings to cloud storage
              </div>

              <div v-if="storageSettings.backup.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-label">Backup Provider</label>
                  <select
                    v-model="storageSettings.backup.provider"
                    class="form-select form-select-solid"
                  >
                    <option value="aws_s3">Amazon S3</option>
                    <option value="google_cloud">Google Cloud Storage</option>
                    <option value="azure_blob">Azure Blob Storage</option>
                    <option value="ftp">FTP Server</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label">Backup Schedule</label>
                  <select
                    v-model="storageSettings.backup.schedule"
                    class="form-select form-select-solid"
                  >
                    <option value="immediately">Immediately after recording</option>
                    <option value="hourly">Every hour</option>
                    <option value="daily">Daily at midnight</option>
                    <option value="weekly">Weekly on Sunday</option>
                  </select>
                </div>
              </div>
            </div>
            <!--end::Backup Settings-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingStorageSettings">
                <span v-if="savingStorageSettings" class="spinner-border spinner-border-sm me-2"></span>
                Save Storage Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Storage Settings-->
  </div>

  <!--begin::Recording Schedule-->
  <div class="row g-5 mt-5" v-if="recordingSettings.mode === 'scheduled' || recordingSettings.mode === 'hybrid'">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Recording Schedule</h3>
          </div>
          <div class="card-toolbar">
            <button @click="addSchedule" class="btn btn-sm btn-primary">
              <i class="ki-duotone ki-plus fs-2"></i>
              Add Schedule
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr class="fw-bold text-muted">
                  <th class="min-w-150px">Camera</th>
                  <th class="min-w-120px">Days</th>
                  <th class="min-w-120px">Start Time</th>
                  <th class="min-w-120px">End Time</th>
                  <th class="min-w-100px">Status</th>
                  <th class="min-w-100px text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedule in recordingSchedules" :key="schedule.id">
                  <td>
                    <span class="text-dark fw-bold d-block fs-6">
                      {{ getCameraName(schedule.camera_uid) }}
                    </span>
                  </td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <span
                        v-for="day in schedule.days"
                        :key="day"
                        class="badge badge-light-primary"
                      >
                        {{ day }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="text-dark fw-bold">{{ schedule.start_time }}</span>
                  </td>
                  <td>
                    <span class="text-dark fw-bold">{{ schedule.end_time }}</span>
                  </td>
                  <td>
                    <span
                      class="badge"
                      :class="schedule.enabled ? 'badge-light-success' : 'badge-light-secondary'"
                    >
                      {{ schedule.enabled ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="text-end">
                    <button
                      class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      @click="editSchedule(schedule)"
                      title="Edit Schedule"
                    >
                      <i class="ki-duotone ki-pencil fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </button>
                    <button
                      class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                      @click="deleteSchedule(schedule)"
                      title="Delete Schedule"
                    >
                      <i class="ki-duotone ki-trash fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="recordingSchedules.length === 0" class="text-center py-5">
            <i class="ki-duotone ki-calendar-8 fs-3x text-gray-400 mb-3">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
              <span class="path5"></span>
              <span class="path6"></span>
            </i>
            <p class="text-gray-500">No recording schedules configured</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Recording Schedule-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";

// Interface definitions
interface RecordingSettings {
  mode: 'continuous' | 'scheduled' | 'motion' | 'hybrid';
  quality: '720p' | '1080p' | '4k';
  frameRate: number;
  compression: 'h264' | 'h265' | 'mjpeg';
  preRecordingSeconds: number;
  postRecordingSeconds: number;
}

interface StorageSettings {
  location: string;
  retentionPolicy: 'never' | '7days' | '30days' | '90days' | '1year' | 'storage_full';
  maxStorageGB: number;
  backup: {
    enabled: boolean;
    provider: 'aws_s3' | 'google_cloud' | 'azure_blob' | 'ftp';
    schedule: 'immediately' | 'hourly' | 'daily' | 'weekly';
  };
}

interface RecordingSchedule {
  id: string;
  camera_uid: string;
  days: string[];
  start_time: string;
  end_time: string;
  enabled: boolean;
}

interface Camera {
  uid: string;
  name: string;
}

// Reactive data
const recordingSettings = ref<RecordingSettings>({
  mode: 'hybrid',
  quality: '1080p',
  frameRate: 25,
  compression: 'h264',
  preRecordingSeconds: 5,
  postRecordingSeconds: 10
});

const storageSettings = ref<StorageSettings>({
  location: '/var/recordings',
  retentionPolicy: '30days',
  maxStorageGB: 1000,
  backup: {
    enabled: false,
    provider: 'aws_s3',
    schedule: 'daily'
  }
});

const recordingSchedules = ref<RecordingSchedule[]>([]);
const cameras = ref<Camera[]>([]);

const savingRecordingSettings = ref(false);
const savingStorageSettings = ref(false);

// Mock data
const mockCameras: Camera[] = [
  { uid: "cam1", name: "Front Entrance" },
  { uid: "cam2", name: "Parking Area" },
  { uid: "cam3", name: "Reception Desk" },
];

const mockSchedules: RecordingSchedule[] = [
  {
    id: "1",
    camera_uid: "cam1",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    start_time: "08:00",
    end_time: "18:00",
    enabled: true
  },
  {
    id: "2",
    camera_uid: "cam2",
    days: ["Sat", "Sun"],
    start_time: "00:00",
    end_time: "23:59",
    enabled: true
  }
];

// Computed properties
const usedStorageGB = computed(() => 450); // Mock data
const storageUsagePercentage = computed(() =>
  Math.round((usedStorageGB.value / storageSettings.value.maxStorageGB) * 100)
);

// Methods
const loadSettings = async () => {
  try {
    // TODO: Load settings from API
    // const response = await ApiService.get('/settings/recording-playback');
    // recordingSettings.value = response.data.recordingSettings;
    // storageSettings.value = response.data.storageSettings;
    
    // Load cameras
    cameras.value = mockCameras;
    recordingSchedules.value = mockSchedules;
    
    console.log("Settings loaded");
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveRecordingSettings = async () => {
  savingRecordingSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/recording-playback/recording', recordingSettings.value);
    
    console.log("Recording settings saved:", recordingSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving recording settings:", error);
  } finally {
    savingRecordingSettings.value = false;
  }
};

const saveStorageSettings = async () => {
  savingStorageSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/recording-playback/storage', storageSettings.value);
    
    console.log("Storage settings saved:", storageSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving storage settings:", error);
  } finally {
    savingStorageSettings.value = false;
  }
};

const selectStorageLocation = () => {
  console.log("Select storage location");
  // TODO: Open file browser dialog
};

const getStorageUsageClass = () => {
  const percentage = storageUsagePercentage.value;
  if (percentage >= 90) return 'bg-danger';
  if (percentage >= 75) return 'bg-warning';
  return 'bg-success';
};

const getCameraName = (cameraUid: string): string => {
  const camera = cameras.value.find(c => c.uid === cameraUid);
  return camera ? camera.name : 'Unknown Camera';
};

const addSchedule = () => {
  console.log("Add new schedule");
  // TODO: Open schedule creation modal
};

const editSchedule = (schedule: RecordingSchedule) => {
  console.log("Edit schedule:", schedule);
  // TODO: Open schedule edit modal
};

const deleteSchedule = async (schedule: RecordingSchedule) => {
  if (confirm('Are you sure you want to delete this schedule?')) {
    try {
      // TODO: API call to delete schedule
      // await ApiService.delete(`/recording-schedules/${schedule.id}`);
      
      // Remove from local state
      const index = recordingSchedules.value.findIndex(s => s.id === schedule.id);
      if (index !== -1) {
        recordingSchedules.value.splice(index, 1);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  }
};

// Initialize data on component mount
onMounted(() => {
  loadSettings();
});
</script>
