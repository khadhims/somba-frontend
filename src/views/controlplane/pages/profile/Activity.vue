<template>
  <!--begin::Timeline-->
  <div
    class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
  >
    <!--begin::Card head-->
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6 dark:border-gray-700"
    >
      <!--begin::Title-->
      <div class="flex items-center">
        <KTIcon
          icon-name="calendar-8"
          icon-class="fs-1 text-primary me-3 leading-none"
        />

        <h3 class="m-0 font-bold text-gray-800 dark:text-gray-100">
          Jan 23, 2021
        </h3>
      </div>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div>
        <!--begin::Tab nav-->
        <ul class="flex gap-6 text-sm font-bold" role="tablist">
          <li v-for="tab in tabs" :key="tab.key" role="presentation">
            <button
              type="button"
              class="border-b-2 pb-3 transition-colors"
              :class="
                activeTab === tab.key
                  ? 'border-primary text-gray-800 dark:text-gray-100'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-100'
              "
              role="tab"
              :aria-selected="activeTab === tab.key"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </li>
        </ul>
        <!--end::Tab nav-->
      </div>
      <!--end::Toolbar-->
    </div>
    <!--end::Card head-->

    <!--begin::Card body-->
    <div class="p-6">
      <!--begin::Tab Content-->
      <div>
        <!--begin::Tab panel-->
        <div v-show="activeTab === 'today'" role="tabpanel">
          <!--begin::Timeline-->
          <div class="timeline">
            <KTActivityItem1></KTActivityItem1>
            <KTActivityItem2></KTActivityItem2>
            <KTActivityItem3></KTActivityItem3>
            <KTActivityItem4></KTActivityItem4>
            <KTActivityItem5></KTActivityItem5>
            <KTActivityItem6></KTActivityItem6>
            <KTActivityItem7></KTActivityItem7>
            <KTActivityItem8></KTActivityItem8>
          </div>
          <!--end::Timeline-->
        </div>
        <!--end::Tab panel-->

        <!--begin::Tab panel-->
        <div v-show="activeTab === 'week'" role="tabpanel">
          <!--begin::Timeline-->
          <div class="timeline">
            <KTActivityItem2></KTActivityItem2>
            <KTActivityItem3></KTActivityItem3>
            <KTActivityItem4></KTActivityItem4>
            <KTActivityItem5></KTActivityItem5>
            <KTActivityItem6></KTActivityItem6>
          </div>
          <!--end::Timeline-->
        </div>
        <!--end::Tab panel-->

        <!--begin::Tab panel-->
        <div v-show="activeTab === 'month'" role="tabpanel">
          <!--begin::Timeline-->
          <div class="timeline">
            <KTActivityItem5></KTActivityItem5>
            <KTActivityItem6></KTActivityItem6>
            <KTActivityItem8></KTActivityItem8>
            <KTActivityItem2></KTActivityItem2>
            <KTActivityItem3></KTActivityItem3>
            <KTActivityItem4></KTActivityItem4>
          </div>
          <!--end::Timeline-->
        </div>
        <!--end::Tab panel-->

        <!--begin::Tab panel-->
        <div v-show="activeTab === 'year'" role="tabpanel">
          <!--begin::Timeline-->
          <div class="timeline">
            <KTActivityItem3></KTActivityItem3>
            <KTActivityItem4></KTActivityItem4>
            <KTActivityItem5></KTActivityItem5>
            <KTActivityItem6></KTActivityItem6>
          </div>
          <!--end::Timeline-->
        </div>
        <!--end::Tab panel-->
      </div>
      <!--end::Tab Content-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Timeline-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import KTActivityItem1 from "@/components/activity-timeline-items/Item1.vue";
import KTActivityItem2 from "@/components/activity-timeline-items/Item2.vue";
import KTActivityItem3 from "@/components/activity-timeline-items/Item3.vue";
import KTActivityItem4 from "@/components/activity-timeline-items/Item4.vue";
import KTActivityItem5 from "@/components/activity-timeline-items/Item5.vue";
import KTActivityItem6 from "@/components/activity-timeline-items/Item6.vue";
import KTActivityItem7 from "@/components/activity-timeline-items/Item7.vue";
import KTActivityItem8 from "@/components/activity-timeline-items/Item8.vue";

export default defineComponent({
  name: "profile-activity",
  components: {
    KTActivityItem1,
    KTActivityItem2,
    KTActivityItem3,
    KTActivityItem4,
    KTActivityItem5,
    KTActivityItem6,
    KTActivityItem7,
    KTActivityItem8,
  },
  setup() {
    // Was Bootstrap's data-bs-toggle="tab" nav, riding on the global
    // Tab data-api side effect registered by importing `bootstrap`
    // anywhere in the app (see main.ts). Plain Vue ref + v-show instead.
    const activeTab = ref<"today" | "week" | "month" | "year">("today");
    const tabs = [
      { key: "today" as const, label: "Today" },
      { key: "week" as const, label: "Week" },
      { key: "month" as const, label: "Month" },
      { key: "year" as const, label: "2021" },
    ];

    return {
      getAssetPath,
      activeTab,
      tabs,
    };
  },
});
</script>
