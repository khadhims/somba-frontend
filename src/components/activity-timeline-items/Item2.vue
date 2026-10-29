<template>
  <!--begin::Timeline item-->
  <div class="relative flex gap-4 pb-10 last:pb-0">
    <!--begin::Timeline icon-->
    <div
      class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-gray-200 dark:after:bg-gray-700"
    >
      <div class="flex h-full w-full items-center justify-center rounded-full">
        <KTIcon icon-name="pointers" icon-class="fs-2 text-gray-500" />
      </div>
    </div>
    <!--end::Timeline icon-->

    <!--begin::Timeline content-->
    <div class="flex-1 pb-2">
      <!--begin::Timeline heading-->
      <div class="overflow-auto pr-3">
        <!--begin::Title-->
        <div
          class="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100"
        >
          Invitation for crafting engaging designs that speak human workshop
        </div>
        <!--end::Title-->

        <!--begin::Description-->
        <div class="flex items-center gap-2 mt-1 text-sm">
          <!--begin::Info-->
          <div class="text-xs text-gray-500">Sent at 4:23 PM by</div>
          <!--end::Info-->

          <!--begin::User-->
          <div class="h-6 w-6 rounded-full overflow-hidden" title="Alan Nilson">
            <img :src="getAssetPath('media/avatars/300-1.jpg')" alt="img" />
          </div>
          <!--end::User-->
        </div>
        <!--end::Description-->
      </div>
      <!--end::Timeline heading-->
    </div>
    <!--end::Timeline content-->
  </div>
  <!--end::Timeline item-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "item-2",
  components: {
    /* empty */
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
