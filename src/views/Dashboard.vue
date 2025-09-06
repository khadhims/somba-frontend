<template>
  <!--begin::VMS Security Dashboard-->
  
  <!--begin::System Status Cards-->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
    <div class="col-xl-3">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        icon-name="video"
        color="success"
        icon-color="white"
        :title="connectedCameras.toString()"
        description="Active Cameras Online"
      />
    </div>

    <div class="col-xl-3">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        icon-name="record-circle"
        color="danger"
        icon-color="white"
        :title="recordingCameras.toString()"
        description="Currently Recording"
      />
    </div>

    <div class="col-xl-3">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        icon-name="notification-bing"
        color="warning"
        icon-color="white"
        :title="activeAlerts.toString()"
        description="Active Security Alerts"
      />
    </div>

    <div class="col-xl-3">
      <StatisticsWidget5
        widget-classes="card-xl-stretch mb-xl-8"
        icon-name="folder"
        color="info"
        icon-color="white"
        :title="storageUsage + '%'"
        description="Storage Utilization"
      />
    </div>
  </div>
  <!--end::System Status Cards-->

  <!--begin::Main Monitoring Section-->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
    <div class="col-xl-8">
      <SecurityEventsWidget widget-classes="card-xl-stretch mb-5 mb-xl-8" />
    </div>

    <div class="col-xl-4">
      <CameraStatusWidget widget-classes="card-xl-stretch mb-xl-8" />
    </div>
  </div>
  <!--end::Main Monitoring Section-->

  <!--begin::Analytics Section-->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8">
    <div class="col-xl-8">
      <ChartsWidget1
        widget-classes="card-xl-stretch mb-5 mb-xl-8"
        :height="400"
      />
    </div>

    <div class="col-xl-4">
      <SystemHealthWidget widget-classes="card-xl-stretch mb-xl-8" />
    </div>
  </div>
  <!--end::Analytics Section-->

  <!--begin::Activity & Recording Section-->
  <div class="row g-5 g-xl-8">
    <div class="col-xl-6">
      <RecentActivityWidget widget-classes="card-xl-stretch mb-xl-8" />
    </div>

    <div class="col-xl-6">
      <RecordingStatusWidget widget-classes="card-xl-stretch mb-5 mb-xl-8" />
    </div>
  </div>
  <!--end::Activity & Recording Section-->
  
  <!--end::VMS Security Dashboard-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import StatisticsWidget5 from "@/components/widgets/statsistics/Widget5.vue";
import ChartsWidget1 from "@/components/widgets/charts/Widget1.vue";
import SecurityEventsWidget from "@/components/widgets/security/SecurityEventsWidget.vue";
import CameraStatusWidget from "@/components/widgets/security/CameraStatusWidget.vue";
import SystemHealthWidget from "@/components/widgets/security/SystemHealthWidget.vue";
import RecentActivityWidget from "@/components/widgets/security/RecentActivityWidget.vue";
import RecordingStatusWidget from "@/components/widgets/security/RecordingStatusWidget.vue";

export default defineComponent({
  name: "dashboard-main",
  components: {
    StatisticsWidget5,
    ChartsWidget1,
    SecurityEventsWidget,
    CameraStatusWidget,
    SystemHealthWidget,
    RecentActivityWidget,
    RecordingStatusWidget,
  },
  setup() {
    // VMS Dashboard Statistics
    const connectedCameras = ref(42);
    const recordingCameras = ref(18);
    const activeAlerts = ref(3);
    const storageUsage = ref(67);

    // Real-time data simulation
    let updateInterval: number | null = null;

    const updateVMSData = () => {
      // Simulate real-time fluctuations for VMS data
      connectedCameras.value = 42 + Math.floor(Math.random() * 3) - 1; // 41-44 range
      recordingCameras.value = 18 + Math.floor(Math.random() * 4) - 2; // 16-21 range
      activeAlerts.value = Math.max(0, 3 + Math.floor(Math.random() * 3) - 1); // 2-5 range
      storageUsage.value = Math.min(100, 67 + Math.floor(Math.random() * 6) - 3); // 64-72 range
    };

    onMounted(() => {
      // Update VMS data every 30 seconds for realistic simulation
      updateInterval = window.setInterval(updateVMSData, 30000);
    });

    onUnmounted(() => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    });

    return {
      connectedCameras,
      recordingCameras,
      activeAlerts,
      storageUsage,
    };
  },
});
</script>
