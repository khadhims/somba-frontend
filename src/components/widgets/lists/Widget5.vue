<template>
  <!--begin::List Widget 5-->
  <div class="rounded-lg bg-white dark:bg-gray-900" :class="widgetClasses">
    <!--begin::Header-->
    <div class="mt-4 flex items-center justify-between p-6 pb-0">
      <h3 class="flex flex-col">
        <span class="mb-2 font-bold text-gray-900 dark:text-gray-100"
          >Activities</span
        >
        <span class="text-sm font-semibold text-gray-500">890,344 Sales</span>
      </h3>

      <div
        class="relative"
        :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)"
      >
        <!--begin::Menu-->
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-light"
          @click="menuDropdown.toggle"
        >
          <KTIcon icon-name="category" icon-class="fs-2" />
        </button>
        <div
          v-show="menuDropdown.isOpen.value"
          class="absolute right-0 top-full z-20 mt-2"
        >
          <Dropdown1 @close="menuDropdown.close"></Dropdown1>
        </div>
        <!--end::Menu-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="p-6 pt-5">
      <!--begin::Timeline-->
      <div class="flex flex-col gap-3">
        <!--begin::Item-->
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex items-start gap-3"
        >
          <!--begin::Label-->
          <div
            class="w-12 shrink-0 pt-0.5 text-sm font-bold text-gray-800 dark:text-gray-200"
          >
            {{ item.time }}
          </div>
          <!--end::Label-->

          <!--begin::Badge-->
          <div
            class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            :class="badgeDotClass(item.state)"
          ></div>
          <!--end::Badge-->

          <!--begin::Text-->
          <div
            class="text-sm text-gray-600 dark:text-gray-400"
            v-html="item.text"
          ></div>
          <!--end::Text-->
        </div>
        <!--end::Item-->
      </div>
      <!--end::Timeline-->
    </div>
    <!--end: Card Body-->
  </div>
  <!--end: List Widget 5-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { useDropdown } from "@/composables/useDropdown";
import type { BadgeVariant } from "@/core/helpers/badge";

// Tailwind's build-time scanner can't see a `bg-${state}` template-literal -
// same trap documented in core/helpers/badge.ts. Explicit map instead.
const DOT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
  secondary: "bg-gray-400",
};

interface TimelineItem {
  time: string;
  state: BadgeVariant;
  text: string;
}

export default defineComponent({
  name: "kt-widget-5",
  props: {
    widgetClasses: String,
  },
  components: {
    Dropdown1,
  },
  setup() {
    const menuDropdown = useDropdown();

    const badgeDotClass = (state: BadgeVariant) => DOT_CLASSES[state];

    const items: TimelineItem[] = [
      {
        time: "08:42",
        state: "warning",
        text: "Outlines keep you honest. And keep structure",
      },
      { time: "10:00", state: "success", text: "AEOL meeting" },
      {
        time: "14:37",
        state: "danger",
        text: 'Make deposit <a href="#" class="text-primary">USD 700</a>. to ESL',
      },
      {
        time: "16:50",
        state: "primary",
        text: "Indulging in poorly driving and keep structure keep great",
      },
      {
        time: "21:03",
        state: "danger",
        text: 'New order placed <a href="#" class="text-primary">#XF-2356</a>.',
      },
      {
        time: "16:50",
        state: "primary",
        text: "Indulging in poorly driving and keep structure keep great",
      },
      {
        time: "21:03",
        state: "danger",
        text: 'New order placed <a href="#" class="text-primary">#XF-2356</a>.',
      },
      {
        time: "10:30",
        state: "success",
        text: "Finance KPI Mobile app launch preparion meeting",
      },
    ];

    return {
      items,
      badgeDotClass,
      menuDropdown,
      getAssetPath,
    };
  },
});
</script>
