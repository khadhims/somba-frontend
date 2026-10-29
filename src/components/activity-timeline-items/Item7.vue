<template>
  <!--begin::Timeline item-->
  <div class="relative flex gap-4 pb-10 last:pb-0">
    <!--begin::Timeline icon-->
    <div
      class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-gray-200 dark:after:bg-gray-700"
    >
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
        <div
          class="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100"
        >
          You have received a new order:
        </div>
        <!--end::Title-->

        <!--begin::Description-->
        <div class="flex items-center gap-2 mt-1 text-sm">
          <!--begin::Info-->
          <div class="text-xs text-gray-500">Placed at 5:05 AM by</div>
          <!--end::Info-->

          <!--begin::User-->
          <div class="h-6 w-6 rounded-full overflow-hidden" title="Robert Rich">
            <img :src="getAssetPath('media/avatars/300-4.jpg')" alt="img" />
          </div>
          <!--end::User-->
        </div>
        <!--end::Description-->
      </div>
      <!--end::Timeline heading-->

      <!--begin::Timeline details-->
      <div class="overflow-auto pb-5">
        <div
          class="flex rounded border border-dashed border-primary bg-primary-light lg:min-w-[600px] shrink-0 p-6"
        >
          <!--begin::Icon-->
          <KTIcon
            icon-name="disconnect"
            icon-class="fs-2tx text-primary me-4"
          />
          <!--end::Icon-->

          <!--begin::Wrapper-->
          <div
            class="flex flex-1 flex-wrap items-center justify-between md:flex-nowrap"
          >
            <!--begin::Content-->
            <div class="mb-3 md:mb-0 font-semibold">
              <h4 class="text-gray-800 font-bold">
                Database Backup Process Completed!
              </h4>

              <div class="text-sm text-gray-600 pr-7">
                Login into Somba Admin Dashboard to make sure the data integrity
                is OK
              </div>
            </div>
            <!--end::Content-->

            <!--begin::Action-->
            <a
              href="#"
              class="self-center whitespace-nowrap rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
            >
              Proceed
            </a>
            <!--end::Action-->
          </div>
          <!--end::Wrapper-->
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
  name: "item-7",
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
