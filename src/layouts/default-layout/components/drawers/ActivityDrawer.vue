<template>
  <!--begin::Activities drawer backdrop-->
  <div
    v-if="drawers.activityOpen"
    class="fixed inset-0 z-40 bg-black/50"
    @click="drawers.activityOpen = false"
  ></div>
  <!--end::Activities drawer backdrop-->

  <!--begin::Activities drawer-->
  <div
    id="kt_activities"
    class="fixed inset-y-0 right-0 z-50 flex w-[300px] translate-x-full flex-col bg-white transition-transform duration-300 lg:w-[900px] dark:bg-gray-900"
    :class="{ 'translate-x-0': drawers.activityOpen }"
  >
    <div class="flex h-full flex-col">
      <!--begin::Header-->
      <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700" id="kt_activities_header">
        <h3 class="font-bold text-gray-900 dark:text-gray-100">Activity Logs</h3>

        <div>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
            id="kt_activities_close"
            @click="drawers.activityOpen = false"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>
      </div>
      <!--end::Header-->

      <!--begin::Body-->
      <div class="relative flex-1 overflow-y-auto p-6" id="kt_activities_body">
        <!--begin::Content-->
        <div id="kt_activities_scroll" class="relative">
          <!--begin::Timeline items-->
          <div>
            <Item1></Item1>
            <Item2></Item2>
            <Item3></Item3>
            <Item4></Item4>
            <Item5></Item5>
            <Item6></Item6>
            <Item7></Item7>
            <Item8></Item8>
          </div>
          <!--end::Timeline items-->
        </div>
        <!--end::Content-->
      </div>
      <!--end::Body-->

      <!--begin::Footer-->
      <div class="border-t border-gray-200 py-5 text-center dark:border-gray-700" id="kt_activities_footer">
        <a href="#" class="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:underline">
          View All Activities
          <KTIcon icon-name="arrow-right" icon-class="fs-3 text-primary" />
        </a>
      </div>
      <!--end::Footer-->
    </div>
  </div>
  <!--end::Activities drawer-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Item1 from "@/components/activity-timeline-items/Item1.vue";
import Item2 from "@/components/activity-timeline-items/Item2.vue";
import Item3 from "@/components/activity-timeline-items/Item3.vue";
import Item4 from "@/components/activity-timeline-items/Item4.vue";
import Item5 from "@/components/activity-timeline-items/Item5.vue";
import Item6 from "@/components/activity-timeline-items/Item6.vue";
import Item7 from "@/components/activity-timeline-items/Item7.vue";
import Item8 from "@/components/activity-timeline-items/Item8.vue";
import { useDrawersStore } from "@/stores/drawers";

export default defineComponent({
  name: "kt-activity-drawer",
  components: {
    Item1,
    Item2,
    Item3,
    Item4,
    Item5,
    Item6,
    Item7,
    Item8,
  },
  setup() {
    const drawers = useDrawersStore();
    return {
      getAssetPath,
      drawers,
    };
  },
});
</script>
