<template>
  <!--begin::Timeline item-->
  <div class="relative flex gap-4 pb-10 last:pb-0">

    <!--begin::Timeline icon-->
    <div class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 after:absolute after:left-1/2 after:top-full after:h-10 after:w-px after:-translate-x-1/2 after:bg-gray-200 dark:after:bg-gray-700">
      <div class="flex h-full w-full items-center justify-center rounded-full">
        <KTIcon icon-name="disconnect" icon-class="fs-2 text-gray-500" />
      </div>
    </div>
    <!--end::Timeline icon-->

    <!--begin::Timeline content-->
    <div class="flex-1 pb-2">
      <!--begin::Timeline heading-->
      <div class="mb-5 pr-3">
        <!--begin::Title-->
        <a
          href="#"
          class="mb-2 block text-sm font-semibold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
          >3 New Incoming Project Files:</a
        >
        <!--end::Title-->

        <!--begin::Description-->
        <div class="flex items-center gap-2 mt-1 text-sm">
          <!--begin::Info-->
          <div class="text-xs text-gray-500">Sent at 10:30 PM by</div>
          <!--end::Info-->

          <!--begin::User-->
          <div
            class="h-6 w-6 rounded-full overflow-hidden"
                        title="Jan Hummer"
          >
            <img :src="getAssetPath('media/avatars/300-23.jpg')" alt="img" />
          </div>
          <!--end::User-->
        </div>
        <!--end::Description-->
      </div>
      <!--end::Timeline heading-->

      <!--begin::Timeline details-->
      <div class="overflow-auto pb-5">
        <div
          class="flex items-center rounded border border-dashed border-gray-300 min-w-[700px] p-5"
        >
          <!--begin::Item-->
          <div class="flex items-center pr-10 lg:pr-20">
            <!--begin::Icon-->
            <img
              alt=""
              class="w-[30px] mr-3"
              :src="getAssetPath('media/svg/files/pdf.svg')"
            />
            <!--end::Icon-->

            <!--begin::Info-->
            <div class="ml-1 font-semibold">
              <!--begin::Desc-->
              <a href="#" class="text-sm font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                >Finance KPI App Guidelines</a
              >
              <!--end::Desc-->

              <!--begin::Number-->
              <div class="text-gray-500">1.9mb</div>
              <!--end::Number-->
            </div>
            <!--begin::Info-->
          </div>
          <!--end::Item-->

          <!--begin::Item-->
          <div class="flex items-center pr-10 lg:pr-20">
            <!--begin::Icon-->
            <img
              alt=""
              class="w-[30px] mr-3"
              :src="getAssetPath('media/svg/files/doc.svg')"
            />
            <!--end::Icon-->

            <!--begin::Info-->
            <div class="ml-1 font-semibold">
              <!--begin::Desc-->
              <a href="#" class="text-sm font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                >Client UAT Testing Results</a
              >
              <!--end::Desc-->

              <!--begin::Number-->
              <div class="text-gray-500">18kb</div>
              <!--end::Number-->
            </div>
            <!--end::Info-->
          </div>
          <!--end::Item-->

          <!--begin::Item-->
          <div class="flex items-center">
            <!--begin::Icon-->
            <img
              alt=""
              class="w-[30px] mr-3"
              :src="getAssetPath('media/svg/files/css.svg')"
            />
            <!--end::Icon-->

            <!--begin::Info-->
            <div class="ml-1 font-semibold">
              <!--begin::Desc-->
              <a href="#" class="text-sm font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                >Finance Reports</a
              >
              <!--end::Desc-->

              <!--begin::Number-->
              <div class="text-gray-500">20mb</div>
              <!--end::Number-->
            </div>
            <!--end::Icon-->
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
  name: "item-3",
  components: {},
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
