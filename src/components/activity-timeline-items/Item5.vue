<template>
  <!--begin::Timeline item-->
  <div class="relative flex gap-4 pb-10 last:pb-0">

    <!--begin::Timeline icon-->
    <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-gray-200 dark:after:bg-gray-700">
      <div class="flex h-full w-full items-center justify-center rounded-full">
        <KTIcon icon-name="pencil" icon-class="fs-2 text-gray-500" />
      </div>
    </div>
    <!--end::Timeline icon-->

    <!--begin::Timeline content-->
    <div class="flex-1 pb-2">
      <!--begin::Timeline heading-->
      <div class="pr-3 mb-5">
        <!--begin::Title-->
        <div class="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
          3 new application design concepts added:
        </div>
        <!--end::Title-->

        <!--begin::Description-->
        <div class="flex items-center gap-2 mt-1 text-sm">
          <!--begin::Info-->
          <div class="text-xs text-gray-500">Created at 4:23 PM by</div>
          <!--end::Info-->

          <!--begin::User-->
          <div
            class="h-6 w-6 rounded-full overflow-hidden"
                        title="Marcus Dotson"
          >
            <img :src="getAssetPath('media/avatars/300-2.jpg')" alt="img" />
          </div>
          <!--end::User-->
        </div>
        <!--end::Description-->
      </div>
      <!--end::Timeline heading-->

      <!--begin::Timeline details-->
      <div class="overflow-auto pb-5">
        <div
          class="flex items-center rounded border border-dashed border-gray-300 min-w-[700px] p-7"
        >
          <!--begin::Item-->
          <div class="group relative mr-10">
            <!--begin::Image-->
            <div class="relative">
              <img
                alt="img"
                class="rounded w-[150px]"
                :src="getAssetPath('media/stock/600x400/img-29.jpg')"
              />
            </div>
            <!--end::Image-->
            <!--begin::Link-->
            <div class="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <a href="#" class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-primary-active">Explore</a>
            </div>
            <!--end::Link-->
          </div>
          <!--end::Item-->
          <!--begin::Item-->
          <div class="group relative mr-10">
            <!--begin::Image-->
            <div class="relative">
              <img
                alt="img"
                class="rounded w-[150px]"
                :src="getAssetPath('media/stock/600x400/img-31.jpg')"
              />
            </div>
            <!--end::Image-->
            <!--begin::Link-->
            <div class="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <a href="#" class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-primary-active">Explore</a>
            </div>
            <!--end::Link-->
          </div>
          <!--end::Item-->
          <!--begin::Item-->
          <div class="group relative">
            <!--begin::Image-->
            <div class="relative">
              <img
                alt="img"
                class="rounded w-[150px]"
                :src="getAssetPath('media/stock/600x400/img-40.jpg')"
              />
            </div>
            <!--end::Image-->
            <!--begin::Link-->
            <div class="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <a href="#" class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-primary-active">Explore</a>
            </div>
            <!--end::Link-->
          </div>
          <!--end::Item-->
        </div>
      </div>
      <!--end::Timeline details-->
    </div>
    <!--end::Timeline content-->
  </div>
  <!--end::Timeline item-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "item-5",
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
