<template>
  <!--begin::Engage Widget 1-->
  <div class="rounded-lg bg-white dark:bg-gray-900" :class="widgetClasses">
    <!--begin::Body-->
    <div class="p-6 pb-0">
      <!--begin::Wrapper-->
      <div class="flex h-full flex-col justify-between">
        <!--begin::Section-->
        <div class="mb-10 pt-16">
          <!--begin::Title-->
          <h3 class="text-center text-3xl font-bold leading-normal text-gray-900 dark:text-gray-100">
            Upgrade to Pro<br />
            For Limitless Features
          </h3>
          <!--end::Title-->

          <!--begin::Text-->
          <div class="pb-1 pt-4 text-center text-sm font-semibold text-gray-600">
            They stoping you from amazing poorly about drive.<br />
            Outlines keep you honest.
          </div>
          <!--end::Text-->

          <!--begin::Action-->
          <div class="py-7 text-center">
            <button
              type="button"
              class="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
              @click="drawers.createAppOpen = true"
            >
              Get Started
            </button>
          </div>
          <!--end::Action-->
        </div>
        <!--end::Section-->

        <!--begin::Image-->
        <div
          class="h-[200px] flex-1 rounded-b-lg bg-contain bg-bottom bg-no-repeat"
          :style="{
            backgroundImage: 'url(' + getIllustrationsPath('8.png') + ')',
          }"
        ></div>
        <!--end::Image-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Engage Widget 1-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getIllustrationsPath } from "@/core/helpers/assets";
import { useDrawersStore } from "@/stores/drawers";

export default defineComponent({
  name: "widget-1",
  props: {
    widgetClasses: String,
  },
  setup() {
    const drawers = useDrawersStore();
    return {
      drawers,
      getIllustrationsPath,
    };
  },
});
</script>
