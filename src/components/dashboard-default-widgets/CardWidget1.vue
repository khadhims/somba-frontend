<template>
  <div
    class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
    :class="className"
    :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }"
  >
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">{{ value }}</span>
        <!--end::Amount-->

        <!--begin::Subtitle-->
        <span class="text-white opacity-50 pt-1 fw-semibold fs-6">{{
          description
        }}</span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body d-flex align-items-end pt-0">
      <!--begin::Progress-->
      <div class="d-flex align-items-center flex-column mt-3 w-100"></div>
      <!--end::Progress-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-1",
  components: {
    /* empty */
  },
  props: {
    className: { type: String, required: false },
    bgColor: { type: String, required: false, default: "#080655" },
    bgImage: { type: String, required: false },
    description: { type: String, required: true },
    value: { type: Number, required: false, default: 0 },
  },
});
</script>
