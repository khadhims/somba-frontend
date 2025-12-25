<template>
  <FullScreenLoader v-if="!disableGlobalLoader" />
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeMount, onMounted, computed } from "vue";
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
import { useConfigStore } from "@/stores/config";
import { useThemeStore } from "@/stores/theme";
import { useBodyStore } from "@/stores/body";
import FullScreenLoader from '@/components/FullScreenLoader.vue';
import { useLoadingStore } from '@/stores/loading';
import { themeConfigValue } from "@/layouts/default-layout/config/helper";
import { initializeComponents } from "@/core/plugins/keenthemes";

export default defineComponent({
  name: "app",
  components: {
    RouterView,
    FullScreenLoader,
  },
  setup() {
    const configStore = useConfigStore();
    const themeStore = useThemeStore();
    const bodyStore = useBodyStore();
    const loadingStore = useLoadingStore();
    const route = useRoute();

    const disableGlobalLoader = computed(() => !!route.meta?.disableGlobalLoader);

    onBeforeMount(() => {
      /**
       * Overrides the layout config using saved data from localStorage
       * remove this to use static config (@/layouts/default-layout/config/DefaultLayoutConfig.ts)
       */
      configStore.overrideLayoutConfig();

      /**
       *  Sets a mode from configuration
       */
      themeStore.setThemeMode(themeConfigValue.value);
    });

    onMounted(() => {
      nextTick(() => {
        initializeComponents();
        // hide initial splash
        bodyStore.removeBodyClassName("page-loading");
        const splash = document.getElementById("splash-screen");
        if (splash) splash.style.display = "none";

        // Sync global loading events with loading store
        if (!disableGlobalLoader.value) {
          window.addEventListener('loading:start', () => loadingStore.show());
          window.addEventListener('loading:stop', () => loadingStore.hide());
        }
      });
    });

    return { disableGlobalLoader };
  },
});
</script>

<style lang="scss">
@import "assets/sass/element-ui.dark";
@import "assets/sass/plugins";
@import "assets/sass/style";

#app {
  display: contents;
}
</style>
