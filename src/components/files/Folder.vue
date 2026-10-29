<template>
  <div>
    <!--begin::Card-->
    <div class="h-full rounded-lg bg-white dark:bg-gray-900">
      <!--begin::Card body-->
      <div class="flex flex-col items-center justify-center p-8 text-center">
        <!--begin::Name-->
        <a
          href="#"
          class="flex flex-col text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
        >
          <!--begin::Image-->
          <div
            class="mx-auto mb-6 flex h-[75px] w-[75px] items-center justify-center"
          >
            <img
              :src="getAssetPath('media/svg/files/folder-document.svg')"
              alt=""
            />
          </div>
          <!--end::Image-->

          <!--begin::Title-->
          <div class="mb-2 text-base font-bold">Finance</div>
          <!--end::Title-->
        </a>
        <!--end::Name-->

        <!--begin::Description-->
        <div class="mt-auto text-xs font-semibold text-gray-400">7 files</div>
        <!--end::Description-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Card-->
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "files-component",
  props: {
    folderName: String,

    files: String,
  },
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
