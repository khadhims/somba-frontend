<template>
  <div
    class="rounded-lg bg-right bg-contain bg-no-repeat"
    :class="className"
    :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }"
  >
    <!--begin::Header-->
    <div class="px-6 pt-5">
      <!--begin::Title-->
      <div class="flex flex-col">
        <!--begin::Amount-->
        <span
          class="mr-2 text-3xl font-bold leading-none tracking-tight text-white"
          >{{ value }}</span
        >
        <!--end::Amount-->

        <!--begin::Subtitle-->
        <span class="pt-1 text-sm font-semibold text-white/50">{{
          description
        }}</span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="flex items-end px-6 pb-6 pt-0">
      <!--begin::Progress-->
      <div class="mt-3 flex w-full flex-col items-center"></div>
      <!--end::Progress-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-1",
  components: {},
  props: {
    className: { type: String, required: false },
    bgColor: { type: String, required: false, default: "#080655" },
    bgImage: { type: String, required: false },
    description: { type: String, required: true },
    value: { type: [String, Number], required: false, default: 0 },
  },
});
</script>
