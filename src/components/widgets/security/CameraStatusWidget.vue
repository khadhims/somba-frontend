<template>
  <!--begin::Camera Status Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{
          t("dashboard.cameraStatus.title")
        }}</span>
        <span class="text-muted mt-1 fw-semibold fs-7">{{
          t("dashboard.cameraStatus.subtitle")
        }}</span>
      </h3>
      <div class="card-toolbar">
        <div class="btn-group">
          <button class="btn btn-sm btn-primary">
            {{ t("dashboard.cameraStatus.viewAll") }}
          </button>
        </div>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Camera Grid-->
      <div class="row g-3">
        <div v-for="camera in cameras" :key="camera.id" class="col-12">
          <div
            class="d-flex align-items-center p-3 rounded border border-gray-300"
          >
            <!--begin::Status Indicator-->
            <div class="symbol symbol-40px me-4">
              <span
                class="symbol-label"
                :class="`bg-light-${camera.statusColor}`"
              >
                <KTIcon
                  icon-name="video"
                  :icon-class="`text-${camera.statusColor} fs-2`"
                />
              </span>
            </div>
            <!--end::Status Indicator-->

            <!--begin::Camera Info-->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <span class="fw-bold text-gray-800 fs-6">{{
                    t(`dashboard.cameraStatus.cameras.${camera.nameKey}`)
                  }}</span>
                  <div class="text-muted fs-7">
                    {{
                      t(
                        `dashboard.cameraStatus.cameraLocations.${camera.locationKey}`
                      )
                    }}
                  </div>
                </div>
                <div class="text-end">
                  <span
                    class="badge"
                    :class="`badge-light-${camera.statusColor}`"
                    >{{
                      t(`dashboard.cameraStatus.statuses.${camera.statusKey}`)
                    }}</span
                  >
                  <div class="text-muted fs-8 mt-1">
                    {{ camera.resolution }}
                  </div>
                </div>
              </div>

              <!--begin::Progress-->
              <div class="mt-2">
                <div
                  class="d-flex justify-content-between text-muted fs-8 mb-1"
                >
                  <span>{{ t("dashboard.cameraStatus.signalQuality") }}</span>
                  <span>{{ camera.signalQuality }}%</span>
                </div>
                <div class="progress h-6px">
                  <div
                    class="progress-bar"
                    :class="`bg-${camera.statusColor}`"
                    :style="`width: ${camera.signalQuality}%`"
                  ></div>
                </div>
              </div>
              <!--end::Progress-->
            </div>
            <!--end::Camera Info-->
          </div>
        </div>
      </div>
      <!--end::Camera Grid-->

      <!--begin::View All Link-->
      <div class="text-center mt-4">
        <router-link
          to="/apps/live-view"
          class="btn btn-link btn-color-muted btn-active-color-primary"
        >
          {{ t("dashboard.cameraStatus.viewAllCameras") }}
          <KTIcon icon-name="arrow-right" icon-class="fs-5" />
        </router-link>
      </div>
      <!--end::View All Link-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Camera Status Widget-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "CameraStatusWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const { t } = useI18n();

    const cameras = ref([
      {
        id: 1,
        nameKey: "mainEntrance",
        locationKey: "buildingAFront",
        statusKey: "online",
        statusColor: "success",
        resolution: "1080p",
        signalQuality: 95,
      },
      {
        id: 2,
        nameKey: "parkingArea",
        locationKey: "outdoorWest",
        statusKey: "recording",
        statusColor: "primary",
        resolution: "4K",
        signalQuality: 88,
      },
      {
        id: 3,
        nameKey: "serverRoom",
        locationKey: "floor2Room201",
        statusKey: "online",
        statusColor: "success",
        resolution: "1080p",
        signalQuality: 92,
      },
      {
        id: 4,
        nameKey: "receptionArea",
        locationKey: "groundFloorLobby",
        statusKey: "warning",
        statusColor: "warning",
        resolution: "720p",
        signalQuality: 67,
      },
      {
        id: 5,
        nameKey: "emergencyExit",
        locationKey: "buildingBBack",
        statusKey: "offline",
        statusColor: "danger",
        resolution: "N/A",
        signalQuality: 0,
      },
    ]);

    return {
      t,
      cameras,
    };
  },
});
</script>
