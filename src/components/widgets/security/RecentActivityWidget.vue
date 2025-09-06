<template>
  <!--begin::Recent Activity Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Recent Activity</span>
        <span class="text-muted mt-1 fw-semibold fs-7">Latest system activities</span>
      </h3>
      <div class="card-toolbar">
        <router-link to="/apps/monitoring-center/overview" class="btn btn-sm btn-light">
          View All
        </router-link>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Timeline-->
      <div class="timeline">
        <div v-for="activity in activities" :key="activity.id" class="timeline-item">
          <!--begin::Timeline line-->
          <div class="timeline-line w-40px"></div>
          <!--end::Timeline line-->

          <!--begin::Timeline icon-->
          <div class="timeline-icon symbol symbol-circle symbol-40px me-4">
            <div class="symbol-label" :class="`bg-light-${activity.color}`">
              <KTIcon :icon-name="activity.icon" :icon-class="`text-${activity.color} fs-2`" />
            </div>
          </div>
          <!--end::Timeline icon-->

          <!--begin::Timeline content-->
          <div class="timeline-content mb-10 mt-n1">
            <!--begin::Timeline heading-->
            <div class="pe-3 mb-5">
              <div class="fs-5 fw-semibold mb-2">{{ activity.title }}</div>
              <div class="d-flex align-items-center mt-1 fs-6">
                <div class="text-muted me-2 fs-7">{{ activity.time }}</div>
                <div class="text-gray-900 fw-bold fs-6">{{ activity.location }}</div>
              </div>
            </div>
            <!--end::Timeline heading-->

            <!--begin::Timeline details-->
            <div class="overflow-auto pb-5">
              <div class="text-muted fw-semibold text-break fs-7">
                {{ activity.description }}
              </div>
              <div v-if="activity.details" class="mt-2">
                <span class="badge" :class="`badge-light-${activity.color}`">{{ activity.details }}</span>
              </div>
            </div>
            <!--end::Timeline details-->
          </div>
          <!--end::Timeline content-->
        </div>
      </div>
      <!--end::Timeline-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Recent Activity Widget-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "RecentActivityWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const activities = ref([
      {
        id: 1,
        title: "System Backup Completed",
        description: "Automatic system backup completed successfully. All video data and configurations have been backed up to secure storage.",
        time: "10 min ago",
        location: "System",
        icon: "check-circle",
        color: "success",
        details: "Success"
      },
      {
        id: 2,
        title: "New User Login",
        description: "Security operator logged into the system from workstation in control room.",
        time: "25 min ago",
        location: "Control Room",
        icon: "profile-user",
        color: "info",
        details: "Authenticated"
      },
      {
        id: 3,
        title: "Motion Alert Triggered",
        description: "Motion detection activated in restricted area. Event has been automatically recorded for review.",
        time: "1 hour ago",
        location: "Zone 3 - Camera 15",
        icon: "security-user",
        color: "warning",
        details: "Investigating"
      },
      {
        id: 4,
        title: "Camera Maintenance",
        description: "Scheduled maintenance completed on outdoor surveillance cameras. All systems are now operational.",
        time: "2 hours ago",
        location: "Perimeter Cameras",
        icon: "setting-3",
        color: "primary",
        details: "Completed"
      },
      {
        id: 5,
        title: "Storage Cleanup",
        description: "Old recording files removed to free up storage space. Retained important footage as per policy.",
        time: "3 hours ago",
        location: "Storage Server",
        icon: "folder",
        color: "info",
        details: "Optimized"
      }
    ]);

    return {
      activities,
    };
  },
});
</script>

<style scoped>
.timeline {
  position: relative;
}

.timeline-item {
  position: relative;
  padding-bottom: 1rem;
}

.timeline-line {
  position: absolute;
  left: 20px;
  top: 40px;
  height: calc(100% - 40px);
  width: 2px;
  background-color: #e4e6ef;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-icon {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.timeline-content {
  margin-left: 60px;
}
</style>
