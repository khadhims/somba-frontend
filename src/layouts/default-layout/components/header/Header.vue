<template>
  <div
    id="kt_header"
    class="flex items-stretch border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex items-center px-4">
      <!--begin::Logo-->
      <router-link to="/dashboard">
        <img
          alt="Logo"
          :src="getAssetPath('logo-somba-3.png')"
          class="h-11"
        />
      </router-link>
      <!--end::Logo-->

      <!--begin::Aside minimize-->
      <button
        v-if="asideDisplay"
        type="button"
        id="kt_aside_toggle"
        class="ml-4 hidden h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary lg:flex dark:hover:bg-gray-800"
        @click="toggleAsideMinimized"
      >
        <KTIcon
          v-if="!asideMinimized"
          icon-name="exit-left"
          icon-class="fs-1"
        />
        <KTIcon v-else icon-name="entrance-left" icon-class="fs-1" />
      </button>
      <!--end::Aside minimize-->

      <!--begin::Aside toggle-->
      <div
        class="-ml-1 mr-1 flex items-center lg:hidden"
        title="Show aside menu"
      >
        <button
          type="button"
          class="flex h-[30px] w-[30px] items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
          id="kt_aside_mobile_toggle"
          @click="drawers.asideMobileOpen = true"
        >
          <KTIcon icon-name="abstract-14" icon-class="fs-1" />
        </button>
      </div>
      <!--end::Aside toggle-->
    </div>

    <div
      class="flex flex-1 items-stretch"
      :class="{
        'px-4': headerWidthFluid,
        'mx-auto max-w-[1320px] px-4': !headerWidthFluid,
      }"
    >
      <div
        class="flex w-full flex-col items-stretch justify-between py-6 lg:flex-row lg:items-stretch lg:py-0"
        id="kt_toolbar_container"
      >
        <PageTitle></PageTitle>
        <KTTopbar />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import KTTopbar from "@/layouts/default-layout/components/header/Topbar.vue";
import PageTitle from "@/layouts/default-layout/components/page-title/PageTitle.vue";

import {
  asideDisplay,
  asideMinimized,
  headerLeft,
  headerWidthFluid,
  toggleAsideMinimized,
} from "@/layouts/default-layout/config/helper";
import { useDrawersStore } from "@/stores/drawers";

export default defineComponent({
  name: "KTHeader",
  components: {
    KTTopbar,
    PageTitle,
  },
  setup() {
    const drawers = useDrawersStore();

    return {
      headerWidthFluid,
      headerLeft,
      asideDisplay,
      asideMinimized,
      toggleAsideMinimized,
      drawers,
      getAssetPath,
    };
  },
});
</script>
