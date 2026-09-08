<template>
  <!--begin::Aside mobile backdrop-->
  <div
    v-if="drawers.asideMobileOpen"
    class="fixed inset-0 z-20 bg-black/50 lg:hidden"
    @click="drawers.asideMobileOpen = false"
  ></div>
  <!--end::Aside mobile backdrop-->

  <!--begin::Aside-->
  <div
    id="kt_aside"
    class="fixed inset-y-0 left-0 z-30 flex w-[200px] -translate-x-full flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:relative lg:z-auto lg:translate-x-0"
    :class="{
      'translate-x-0': drawers.asideMobileOpen,
      'lg:w-[70px]': asideMinimized,
    }"
  >
    <!--begin::Aside Toolbarl-->
    <div class="shrink-0" id="kt_aside_toolbar">
      <!--begin::Aside user-->
      <AsideToolbar />
      <!--end::Aside user-->
    </div>
    <!--end::Aside Toolbarl-->

    <!--begin::Aside menu-->
    <div class="flex-1 overflow-y-auto">
      <KTMenu></KTMenu>
    </div>
    <!--end::Aside menu-->
  </div>
  <!--end::Aside-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import KTMenu from "@/layouts/default-layout/components/aside/Menu.vue";
import AsideToolbar from "@/layouts/default-layout/components/aside/AsideToolbar.vue";
import { useDrawersStore } from "@/stores/drawers";
import { asideMinimized } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "KTAside",
  components: {
    KTMenu,
    AsideToolbar,
  },
  props: {
    lightLogo: String,
    darkLogo: String,
  },
  setup() {
    const { t } = useI18n();
    const drawers = useDrawersStore();

    return {
      t,
      getAssetPath,
      drawers,
      asideMinimized,
    };
  },
});
</script>
