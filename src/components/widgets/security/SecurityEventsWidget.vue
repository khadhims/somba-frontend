<template>
  <!--begin::Security Events Widget-->
  <div class="card" :class="widgetClasses">
    <!--begin::Header-->
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Recent Security Events</span>
        <span class="text-muted mt-1 fw-semibold fs-7">Latest alerts and incidents</span>
      </h3>
      <div class="card-toolbar">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1 active">Today</a>
          </li>
          <li class="nav-item">
            <a class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1">Week</a>
          </li>
          <li class="nav-item">
            <a class="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4">Month</a>
          </li>
        </ul>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body py-3">
      <div class="table-responsive">
        <table class="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
          <thead>
            <tr class="border-0">
              <th class="p-0 w-50px"></th>
              <th class="p-0 min-w-150px">Event</th>
              <th class="p-0 min-w-140px">Location</th>
              <th class="p-0 min-w-120px">Time</th>
              <th class="p-0 min-w-110px">Status</th>
              <th class="p-0 min-w-50px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in securityEvents" :key="event.id">
              <td>
                <div class="symbol symbol-45px me-2">
                  <span class="symbol-label" :class="`bg-light-${event.severity}`">
                    <KTIcon :icon-name="event.icon" :icon-class="`text-${event.severity} fs-2`" />
                  </span>
                </div>
              </td>
              <td>
                <a href="#" class="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">{{ event.type }}</a>
                <span class="text-muted fw-semibold d-block">{{ event.description }}</span>
              </td>
              <td class="text-end text-muted fw-semibold">{{ event.location }}</td>
              <td class="text-end text-muted fw-semibold">{{ event.time }}</td>
              <td class="text-end">
                <span class="badge" :class="`badge-light-${event.severity}`">{{ event.status }}</span>
              </td>
              <td class="text-end">
                <a href="#" class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
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

export default defineComponent({
  name: "SecurityEventsWidget",
  props: {
    widgetClasses: String,
  },
  setup() {
    const securityEvents = ref([
      {
        id: 1,
        type: "Motion Detection",
        description: "Unauthorized movement detected",
        location: "Main Entrance - Camera 01",
        time: "2 min ago",
        status: "Active",
        severity: "danger",
        icon: "security-user"
      },
      {
        id: 2,
        type: "Door Access",
        description: "Access card used after hours",
        location: "Server Room - Door 05",
        time: "5 min ago",
        status: "Investigating",
        severity: "warning",
        icon: "lock"
      },
      {
        id: 3,
        type: "Camera Offline",
        description: "Camera connection lost",
        location: "Parking Lot - Camera 12",
        time: "15 min ago",
        status: "Resolved",
        severity: "info",
        icon: "disconnect"
      },
      {
        id: 4,
        type: "Face Recognition",
        description: "Unknown person detected",
        location: "Reception - Camera 03",
        time: "23 min ago",
        status: "Reviewing",
        severity: "warning",
        icon: "profile-user"
      },
      {
        id: 5,
        type: "Perimeter Breach",
        description: "Fence line crossing detected",
        location: "North Perimeter - Camera 08",
        time: "1 hour ago",
        status: "False Alarm",
        severity: "success",
        icon: "security-check"
      }
    ]);

    return {
      securityEvents,
    };
  },
});
</script>
