<template>
  <!--begin::Security Events Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">{{
          t("dashboard.securityEvents.title")
        }}</span>
        <span class="text-muted mt-1 fw-semibold fs-7">{{
          t("dashboard.securityEvents.subtitle")
        }}</span>
      </h3>
      <div class="card-toolbar">
        <ul class="nav">
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1 active"
              >{{ t("dashboard.securityEvents.tabs.today") }}</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1"
              >{{ t("dashboard.securityEvents.tabs.week") }}</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4"
              >{{ t("dashboard.securityEvents.tabs.month") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <div class="table-responsive">
        <table
          class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4"
        >
          <thead>
            <tr class="border-0">
              <th class="p-0 w-50px"></th>
              <th class="p-0 min-w-150px">
                {{ t("dashboard.securityEvents.table.event") }}
              </th>
              <th class="p-0 min-w-140px">
                {{ t("dashboard.securityEvents.table.location") }}
              </th>
              <th class="p-0 min-w-120px">
                {{ t("dashboard.securityEvents.table.time") }}
              </th>
              <th class="p-0 min-w-110px">
                {{ t("dashboard.securityEvents.table.status") }}
              </th>
              <th class="p-0 min-w-50px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in securityEvents" :key="event.id">
              <td>
                <div class="symbol symbol-45px me-2">
                  <span
                    class="symbol-label"
                    :class="`bg-light-${event.severity}`"
                  >
                    <KTIcon
                      :icon-name="event.icon"
                      :icon-class="`text-${event.severity} fs-2`"
                    />
                  </span>
                </div>
              </td>
              <td>
                <a
                  href="#"
                  class="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
                  >{{
                    t(`dashboard.securityEvents.eventTypes.${event.typeKey}`)
                  }}</a
                >
                <span class="text-muted fw-semibold d-block">{{
                  t(
                    `dashboard.securityEvents.descriptions.${event.descriptionKey}`
                  )
                }}</span>
              </td>
              <td class="text-end text-muted fw-semibold">
                {{
                  t(`dashboard.securityEvents.locations.${event.locationKey}`)
                }}
              </td>
              <td class="text-end text-muted fw-semibold">{{ event.time }}</td>
              <td class="text-end">
                <span class="badge" :class="`badge-light-${event.severity}`">{{
                  t(`dashboard.securityEvents.statuses.${event.statusKey}`)
                }}</span>
              </td>
              <td class="text-end">
                <a
                  href="#"
                  class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                >
                  <KTIcon icon-name="arrow-right" icon-class="fs-2" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--end::Body-->
  </div>
  <!--end::Security Events Widget-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "SecurityEventsWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const { t } = useI18n();

    const securityEvents = ref([
      {
        id: 1,
        typeKey: "motionDetection",
        descriptionKey: "unauthorizedMovement",
        locationKey: "mainEntranceCamera01",
        time: "2 min ago",
        statusKey: "active",
        severity: "danger",
        icon: "security-user",
      },
      {
        id: 2,
        typeKey: "doorAccess",
        descriptionKey: "accessCardAfterHours",
        locationKey: "serverRoomDoor05",
        time: "5 min ago",
        statusKey: "investigating",
        severity: "warning",
        icon: "lock",
      },
      {
        id: 3,
        typeKey: "cameraOffline",
        descriptionKey: "connectionLost",
        locationKey: "parkingLotCamera12",
        time: "15 min ago",
        statusKey: "resolved",
        severity: "info",
        icon: "disconnect",
      },
      {
        id: 4,
        typeKey: "faceRecognition",
        descriptionKey: "unknownPerson",
        locationKey: "receptionCamera03",
        time: "23 min ago",
        statusKey: "reviewing",
        severity: "warning",
        icon: "profile-user",
      },
      {
        id: 5,
        typeKey: "perimeterBreach",
        descriptionKey: "fenceCrossing",
        locationKey: "northPerimeterCamera08",
        time: "1 hour ago",
        statusKey: "falseAlarm",
        severity: "success",
        icon: "security-check",
      },
    ]);

    return {
      t,
      securityEvents,
    };
  },
});
</script>
