<template>
  <!-- begin:: Body -->
  <div class="flex min-h-screen w-full flex-row">
    <!-- begin:: Aside Left -->
    <KTAside
      v-if="asideEnabled"
      :lightLogo="themeLightLogo"
      :darkLogo="themeDarkLogo"
    />
    <!-- end:: Aside Left -->

    <div id="kt_wrapper" class="flex w-full flex-1 flex-col">
      <KTHeader />

      <!-- begin:: Content -->
      <div id="kt_content" class="flex flex-1 flex-col">
        <!-- begin:: Content Body -->
        <div class="flex flex-1 flex-col">
          <div
            id="kt_content_container"
            class="w-full px-4"
            :class="contentWidthFluid ? '' : 'mx-auto max-w-[1320px]'"
          >
            <router-view />
          </div>
        </div>
        <!-- end:: Content Body -->
      </div>
      <!-- end:: Content -->
      <KTFooter />
    </div>
  </div>
  <!-- end:: Body -->
  <KTScrollTop />
  <KTDrawerMessenger />
  <KTActivivityDrawer />
  <KTCreateApp />
  <KTInviteFriendsModal />

  <KTToolButtons />
  <KTHelpDrawer />
  
  <!-- Global Search (Ctrl+K) -->
  <GlobalSearch />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";
import KTAside from "@/layouts/default-layout/components/aside/Aside.vue";
import KTHeader from "@/layouts/default-layout/components/header/Header.vue";
import KTFooter from "@/layouts/default-layout/components/footer/Footer.vue";
import KTScrollTop from "@/layouts/default-layout/components/extras/ScrollTop.vue";
import KTActivivityDrawer from "@/layouts/default-layout/components/drawers/ActivityDrawer.vue";
import KTCreateApp from "@/components/modals/wizards/CreateAppModal.vue";
import KTInviteFriendsModal from "@/components/modals/general/InviteFriendsModal.vue";
import KTHelpDrawer from "@/layouts/default-layout/components/extras/HelpDrawer.vue";
import KTToolButtons from "@/layouts/default-layout/components/extras/ToolButtons.vue";
import KTDrawerMessenger from "@/layouts/default-layout/components/extras/MessengerDrawer.vue";
import GlobalSearch from "@/components/GlobalSearch.vue";
import {
  asideEnabled,
  contentWidthFluid,
  loaderEnabled,
  loaderLogo,
  subheaderDisplay,
  themeDarkLogo,
  themeLightLogo,
  toolbarDisplay,
} from "@/layouts/default-layout/config/helper";
import LayoutService from "@/core/services/LayoutService";

export default defineComponent({
  name: "default-layout",
  components: {
    KTAside,
    KTHeader,
    KTFooter,
    KTScrollTop,
    KTCreateApp,
    KTInviteFriendsModal,
    KTActivivityDrawer,
    KTHelpDrawer,
    KTToolButtons,
    KTDrawerMessenger,
    GlobalSearch,
  },
  setup() {
    onBeforeMount(() => {
      LayoutService.init();
    });

    return {
      toolbarDisplay,
      loaderEnabled,
      contentWidthFluid,
      loaderLogo,
      asideEnabled,
      subheaderDisplay,
      themeLightLogo,
      themeDarkLogo,
    };
  },
});
</script>
