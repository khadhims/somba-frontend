<template>
  <!--begin::Timeline item-->
  <div class="relative flex gap-4 pb-10 last:pb-0">
    <!--begin::Timeline icon-->
    <div
      class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-gray-200 dark:after:bg-gray-700"
    >
      <div class="flex h-full w-full items-center justify-center rounded-full">
        <KTIcon icon-name="message-text-2" icon-class="fs-2 text-gray-500" />
      </div>
    </div>
    <!--end::Timeline icon-->

    <!--begin::Timeline content-->
    <div class="flex-1 pb-2">
      <!--begin::Timeline heading-->
      <div class="pr-3 mb-5">
        <!--begin::Title-->
        <div
          class="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100"
        >
          There are 2 new tasks for you in “AirPlus Mobile APp” project:
        </div>
        <!--end::Title-->

        <!--begin::Description-->
        <div class="flex items-center gap-2 mt-1 text-sm">
          <!--begin::Info-->
          <div class="text-xs text-gray-500">Added at 4:23 PM by</div>
          <!--end::Info-->

          <!--begin::User-->
          <div class="h-6 w-6 rounded-full overflow-hidden" title="Nina Nilson">
            <img :src="getAssetPath('media/avatars/300-14.jpg')" alt="img" />
          </div>
          <!--end::User-->
        </div>
        <!--end::Description-->
      </div>
      <!--end::Timeline heading-->

      <!--begin::Timeline details-->
      <div class="overflow-auto pb-5">
        <!--begin::Record-->
        <div
          class="flex items-center gap-2 rounded border border-dashed border-gray-300 min-w-[750px] px-7 py-3 mb-5"
        >
          <!--begin::Title-->
          <a
            href="#"
            class="text-sm font-semibold text-gray-900 transition-colors hover:text-primary w-[375px] min-w-[200px]"
            >Meeting with customer</a
          >
          <!--end::Title-->

          <!--begin::Label-->
          <div class="min-w-[175px] pr-2">
            <span
              class="inline-flex rounded px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-500"
              >Application Design</span
            >
          </div>
          <!--end::Label-->

          <!--begin::Users-->
          <div class="flex -space-x-2 flex-1 min-w-[100px] pr-2">
            <!--begin::User-->
            <div class="h-6 w-6 rounded-full overflow-hidden">
              <img :src="getAssetPath('media/avatars/300-2.jpg')" alt="img" />
            </div>
            <!--end::User-->

            <!--begin::User-->
            <div class="h-6 w-6 rounded-full overflow-hidden">
              <img :src="getAssetPath('media/avatars/300-14.jpg')" alt="img" />
            </div>
            <!--end::User-->

            <!--begin::User-->
            <div class="h-6 w-6 rounded-full overflow-hidden">
              <div
                class="flex h-full w-full items-center justify-center text-[10px] font-semibold bg-primary text-white"
              >
                A
              </div>
            </div>
            <!--end::User-->
          </div>
          <!--end::Users-->

          <!--begin::Progress-->
          <div class="min-w-[125px] pr-2">
            <span
              class="inline-flex rounded px-2 py-1 text-xs font-semibold"
              :class="badgeVariantClass('primary')"
              >In Progress</span
            >
          </div>
          <!--end::Progress-->

          <!--begin::Action-->
          <a
            href="#"
            class="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-primary-light hover:text-primary dark:bg-gray-800 dark:text-gray-300"
            >View</a
          >
          <!--end::Action-->
        </div>
        <!--end::Record-->

        <!--begin::Record-->
        <div
          class="flex items-center gap-2 rounded border border-dashed border-gray-300 min-w-[750px] px-7 py-3 mb-0"
        >
          <!--begin::Title-->
          <a
            href="#"
            class="text-sm font-semibold text-gray-900 transition-colors hover:text-primary w-[375px] min-w-[200px]"
            >Project Delivery Preparation</a
          >
          <!--end::Title-->

          <!--begin::Label-->
          <div class="min-w-[175px]">
            <span
              class="inline-flex rounded px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-500"
              >CRM System Development</span
            >
          </div>
          <!--end::Label-->

          <!--begin::Users-->
          <div class="flex -space-x-2 flex-1 min-w-[100px]">
            <!--begin::User-->
            <div class="h-6 w-6 rounded-full overflow-hidden">
              <img :src="getAssetPath('media/avatars/300-20.jpg')" alt="img" />
            </div>
            <!--end::User-->

            <!--begin::User-->
            <div class="h-6 w-6 rounded-full overflow-hidden">
              <div
                class="flex h-full w-full items-center justify-center text-[10px] font-semibold bg-success text-white"
              >
                B
              </div>
            </div>
            <!--end::User-->
          </div>
          <!--end::Users-->

          <!--begin::Progress-->
          <div class="min-w-[125px]">
            <span
              class="inline-flex rounded px-2 py-1 text-xs font-semibold"
              :class="badgeVariantClass('success')"
              >Completed</span
            >
          </div>
          <!--end::Progress-->

          <!--begin::Action-->
          <a
            href="#"
            class="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-primary-light hover:text-primary dark:bg-gray-800 dark:text-gray-300"
            >View</a
          >
          <!--end::Action-->
        </div>
        <!--end::Record-->
      </div>
      <!--end::Timeline details-->
    </div>
    <!--end::Timeline content-->
  </div>
  <!--end::Timeline item-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { badgeVariantClass } from "@/core/helpers/badge";
import { defineComponent } from "vue";

export default defineComponent({
  name: "item-1",
  components: {
    /* empty */
  },
  setup() {
    return {
      getAssetPath,
      badgeVariantClass,
    };
  },
});
</script>
