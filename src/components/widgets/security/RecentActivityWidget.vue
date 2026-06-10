<template>
  <!--begin::Recent Activity Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{
          t("dashboard.recentActivity.title")
        }}</span>
        <span class="text-muted mt-1 fw-semibold fs-7">{{
          t("dashboard.recentActivity.subtitle")
        }}</span>
      </h3>
      <div class="card-toolbar">
        <router-link
          to="/apps/monitoring-center/overview"
          class="btn btn-sm btn-light"
        >
          {{ t("dashboard.recentActivity.viewAll") }}
        </router-link>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Timeline-->
      <div class="timeline">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="timeline-item"
        >
          <!--begin::Timeline line-->
          <div class="timeline-line w-40px"></div>
          <!--end::Timeline line-->

          <!--begin::Timeline icon-->
          <div class="timeline-icon symbol symbol-circle symbol-40px me-4">
            <div class="symbol-label" :class="`bg-light-${activity.color}`">
              <KTIcon
                :icon-name="activity.icon"
                :icon-class="`text-${activity.color} fs-2`"
              />
            </div>
          </div>
          <!--end::Timeline icon-->

          <!--begin::Timeline content-->
          <div class="timeline-content mb-10 mt-n1">
            <!--begin::Timeline heading-->
            <div class="pe-3 mb-5">
              <div class="fs-5 fw-semibold mb-2">
                {{
                  t(`dashboard.recentActivity.activities.${activity.titleKey}`)
                }}
              </div>
              <div class="d-flex align-items-center mt-1 fs-6">
                <div class="text-muted me-2 fs-7">{{ activity.time }}</div>
                <div class="text-gray-900 fw-bold fs-6">
                  {{
                    t(
                      `dashboard.recentActivity.locations.${activity.locationKey}`
                    )
                  }}
                </div>
              </div>
            </div>
            <!--end::Timeline heading-->

            <!--begin::Timeline details-->
            <div class="overflow-auto pb-5">
              <div class="text-muted fw-semibold text-break fs-7">
                {{
                  t(
                    `dashboard.recentActivity.descriptions.${activity.descriptionKey}`
                  )
                }}
              </div>
              <div v-if="activity.detailsKey" class="mt-2">
                <span class="badge" :class="`badge-light-${activity.color}`">{{
                  t(`dashboard.recentActivity.statuses.${activity.detailsKey}`)
                }}</span>
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
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "RecentActivityWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const { t } = useI18n();

    const activities = ref([
      {
        id: 1,
        titleKey: "systemBackupCompleted",
        descriptionKey: "backupCompleted",
        time: "10 min ago",
        locationKey: "system",
        icon: "check-circle",
        color: "success",
        detailsKey: "success",
      },
      {
        id: 2,
        titleKey: "newUserLogin",
        descriptionKey: "operatorLogin",
        time: "25 min ago",
        locationKey: "controlRoom",
        icon: "profile-user",
        color: "info",
        detailsKey: "authenticated",
      },
      {
        id: 3,
        titleKey: "motionAlertTriggered",
        descriptionKey: "motionDetected",
        time: "1 hour ago",
        locationKey: "zone3Camera15",
        icon: "security-user",
        color: "warning",
        detailsKey: "investigating",
      },
      {
        id: 4,
        titleKey: "cameraMaintenance",
        descriptionKey: "maintenanceCompleted",
        time: "2 hours ago",
        locationKey: "perimeterCameras",
        icon: "setting-3",
        color: "primary",
        detailsKey: "completed",
      },
      {
        id: 5,
        titleKey: "storageCleanup",
        descriptionKey: "filesRemoved",
        time: "3 hours ago",
        locationKey: "storageServer",
        icon: "folder",
        color: "info",
        detailsKey: "optimized",
      },
    ]);

    return {
      t,
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
