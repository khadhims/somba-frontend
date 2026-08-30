<template>
  <!--begin::Menu-->
  <div
    class="w-[175px] rounded-md bg-white py-4 text-sm font-semibold text-gray-700 shadow-lg dark:bg-gray-900 dark:text-gray-300"
  >
    <!--begin::Menu item-->
    <router-link
      :to="path"
      class="flex items-center gap-2 px-6 py-2 hover:bg-primary-light hover:text-primary"
      :class="{ 'bg-primary-light text-primary': themeMode === 'light' }"
      @click="select('light')"
    >
      <KTIcon icon-name="night-day" icon-class="fs-3" />
      Light
    </router-link>
    <!--end::Menu item-->
    <!--begin::Menu item-->
    <router-link
      :to="path"
      class="flex items-center gap-2 px-6 py-2 hover:bg-primary-light hover:text-primary"
      :class="{ 'bg-primary-light text-primary': themeMode === 'dark' }"
      @click="select('dark')"
    >
      <KTIcon icon-name="moon" icon-class="fs-3" />
      Dark
    </router-link>
    <!--end::Menu item-->
    <!--begin::Menu item-->
    <router-link
      :to="path"
      class="flex items-center gap-2 px-6 py-2 hover:bg-primary-light hover:text-primary"
      :class="{ 'bg-primary-light text-primary': themeMode === 'system' }"
      @click="select('system')"
    >
      <KTIcon icon-name="screen" icon-class="fs-3" />
      System
    </router-link>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useConfigStore } from "@/stores/config";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "kt-theme-switcher",
  component: {},
  emits: ["close"],
  setup(_, { emit }) {
    const storeTheme = useThemeStore();
    const storeConfig = useConfigStore();
    const route = useRoute();

    const themeMode = computed(() => {
      return storeTheme.mode;
    });

    const path = computed(() => route.path);

    const setMode = (mode: "dark" | "light" | "system") => {
      let configMode = mode;

      storeConfig.setLayoutConfigProperty("general.mode", configMode);

      storeTheme.setThemeMode(configMode);
    };

    const select = (mode: "dark" | "light" | "system") => {
      setMode(mode);
      emit("close");
    };

    return {
      themeMode,
      setMode,
      select,
      path,
      getAssetPath,
    };
  },
});
</script>
