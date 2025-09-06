<template>
  <!--begin::Recording Status Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Recording Status</span>
        <span class="text-muted mt-1 fw-semibold fs-7">Active recordings overview</span>
      </h3>
      <div class="card-toolbar">
        <router-link to="/apps/recording-playback/overview" class="btn btn-sm btn-light">
          View All
        </router-link>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Recording Summary-->
      <div class="row g-4 mb-6">
        <div class="col-6">
          <div class="text-center p-4 rounded bg-light-success">
            <KTIcon icon-name="record-circle" icon-class="text-success fs-2x" />
            <div class="fw-bold text-gray-800 fs-1 mt-2">{{ recordingSummary.active }}</div>
            <div class="text-success fw-semibold">Active Recordings</div>
          </div>
        </div>
        <div class="col-6">
          <div class="text-center p-4 rounded bg-light-primary">
            <KTIcon icon-name="folder" icon-class="text-primary fs-2x" />
            <div class="fw-bold text-gray-800 fs-1 mt-2">{{ recordingSummary.stored }}</div>
            <div class="text-primary fw-semibold">Stored Files</div>
          </div>
        </div>
      </div>
      <!--end::Recording Summary-->

      <!--begin::Recording List-->
      <div class="separator separator-dashed mb-4"></div>
      <div class="mb-4">
        <h5 class="fw-bold text-gray-800 mb-3">Current Recordings</h5>
        <div v-for="recording in activeRecordings" :key="recording.id" class="d-flex align-items-center mb-3 p-3 rounded border border-gray-300">
          <!--begin::Status-->
          <div class="symbol symbol-35px me-3">
            <span class="symbol-label bg-light-danger">
              <div class="recording-indicator bg-danger rounded-circle" style="width: 10px; height: 10px;"></div>
            </span>
          </div>
          <!--end::Status-->

          <!--begin::Content-->
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <span class="fw-bold text-gray-800 fs-6">{{ recording.camera }}</span>
                <div class="text-muted fs-7">{{ recording.location }}</div>
              </div>
              <div class="text-end">
                <div class="text-gray-800 fw-bold fs-7">{{ recording.duration }}</div>
                <div class="text-muted fs-8">{{ recording.fileSize }}</div>
              </div>
            </div>
            
            <!--begin::Progress-->
            <div class="mt-2">
              <div class="d-flex justify-content-between text-muted fs-8 mb-1">
                <span>{{ recording.type }}</span>
                <span>{{ recording.quality }}</span>
              </div>
            </div>
            <!--end::Progress-->
          </div>
          <!--end::Content-->

          <!--begin::Actions-->
          <div class="ms-3">
            <button class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary" title="Stop Recording">
              <KTIcon icon-name="media-stop" icon-class="fs-3" />
            </button>
          </div>
          <!--end::Actions-->
        </div>
      </div>
      <!--end::Recording List-->

      <!--begin::Storage Info-->
      <div class="separator separator-dashed mb-4"></div>
      <div class="row g-3">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold text-gray-800">Storage Usage</span>
            <span class="fw-bold text-gray-900">{{ storageInfo.used }}GB / {{ storageInfo.total }}GB</span>
          </div>
          <div class="progress h-8px">
            <div 
              class="progress-bar bg-primary" 
              :style="`width: ${(storageInfo.used / storageInfo.total) * 100}%`"
            ></div>
          </div>
          <div class="text-muted fs-8 mt-1">
            Estimated {{ storageInfo.daysRemaining }} days remaining at current usage
          </div>
        </div>
      </div>
      <!--end::Storage Info-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Recording Status Widget-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "RecordingStatusWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const recordingSummary = ref({
      active: 18,
      stored: 1247
    });

    const activeRecordings = ref([
      {
        id: 1,
        camera: "Main Entrance",
        location: "Building A - Front",
        duration: "2:34:12",
        fileSize: "1.2 GB",
        type: "Continuous",
        quality: "1080p"
      },
      {
        id: 2,
        camera: "Parking Area", 
        location: "Outdoor - West",
        duration: "1:45:33",
        fileSize: "2.8 GB",
        type: "Motion Triggered",
        quality: "4K"
      },
      {
        id: 3,
        camera: "Server Room",
        location: "Floor 2 - Room 201",
        duration: "0:23:45",
        fileSize: "456 MB",
        type: "Event Based",
        quality: "1080p"
      },
      {
        id: 4,
        camera: "Reception Area",
        location: "Ground Floor",
        duration: "3:12:08",
        fileSize: "1.8 GB",
        type: "Continuous",
        quality: "720p"
      }
    ]);

    const storageInfo = ref({
      used: 1247,
      total: 2000,
      daysRemaining: 15
    });

    return {
      recordingSummary,
      activeRecordings,
      storageInfo,
    };
  },
});
</script>

<style scoped>
@keyframes recording-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.recording-indicator {
  animation: recording-pulse 1.5s infinite;
}
</style>
