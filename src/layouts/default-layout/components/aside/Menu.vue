<template>
  <!--begin::Menu wrapper-->
  <div id="kt_aside_menu_wrapper" class="my-5 px-2">
    <!--begin::Menu-->
    <div id="kt_aside_menu" class="flex flex-col gap-1">
      <template v-for="(item, i) in MainMenuConfig" :key="i">
        <div v-if="item.heading">
          <div class="pb-2 pt-8">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">
              <!-- {{ translate(item.heading) }} -->
              {{ item.heading.toUpperCase().replace(/_/g, " ") }}
            </span>
          </div>
        </div>
        <template v-for="(menuItem, j) in item.pages" :key="j">
          <template v-if="menuItem.heading">
            <router-link
              v-if="menuItem.route"
              class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-primary-light hover:text-primary dark:text-gray-200"
              active-class="!bg-primary-light !text-primary"
              :to="menuItem.route"
            >
              <span v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon" class="text-gray-500">
                <i
                  v-if="asideMenuIcons === 'bootstrap'"
                  :class="menuItem.bootstrapIcon"
                  class="bi fs-3"
                ></i>
                <KTIcon
                  v-else-if="asideMenuIcons === 'keenthemes'"
                  :icon-name="menuItem.keenthemesIcon"
                  icon-class="fs-2"
                />
              </span>
              <span>{{ translate(menuItem.heading) }}</span>
            </router-link>
          </template>
          <div v-if="menuItem.sectionTitle && menuItem.route">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-800 transition-colors hover:bg-primary-light hover:text-primary dark:text-gray-200"
              @click="toggle(menuItem.route)"
            >
              <span v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon" class="text-gray-500">
                <i
                  v-if="asideMenuIcons === 'bootstrap'"
                  :class="menuItem.bootstrapIcon"
                  class="bi fs-3"
                ></i>
                <KTIcon
                  v-else-if="asideMenuIcons === 'keenthemes'"
                  :icon-name="menuItem.keenthemesIcon"
                  icon-class="fs-2"
                />
              </span>
              <span class="flex-1">{{ translate(menuItem.sectionTitle) }}</span>
              <KTIcon
                icon-name="right"
                icon-class="fs-5 text-gray-400 transition-transform"
                :class="{ 'rotate-90': isExpanded(menuItem.route) }"
              />
            </button>
            <div v-if="menuItem.route" v-show="isExpanded(menuItem.route)" class="ml-4 flex flex-col gap-1 border-l border-gray-200 pl-3 dark:border-gray-700">
              <template v-for="(item2, k) in menuItem.sub" :key="k">
                <router-link
                  v-if="item2.heading && item2.route"
                  class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-primary-light hover:text-primary dark:text-gray-400"
                  active-class="!bg-primary-light !text-primary"
                  :to="item2.route"
                >
                  <span class="h-1 w-1 rounded-full bg-current"></span>
                  <span>{{ translate(item2.heading) }}</span>
                </router-link>
                <div v-if="item2.sectionTitle && item2.route">
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-primary-light hover:text-primary dark:text-gray-400"
                    @click="toggle(item2.route)"
                  >
                    <span class="h-1 w-1 rounded-full bg-current"></span>
                    <span class="flex-1">{{ translate(item2.sectionTitle) }}</span>
                    <KTIcon
                      icon-name="right"
                      icon-class="fs-6 text-gray-400 transition-transform"
                      :class="{ 'rotate-90': isExpanded(item2.route) }"
                    />
                  </button>
                  <div v-show="isExpanded(item2.route)" class="ml-4 flex flex-col gap-1 border-l border-gray-200 pl-3 dark:border-gray-700">
                    <template v-for="(item3, k) in item2.sub" :key="k">
                      <router-link
                        v-if="item3.heading && item3.route"
                        class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-primary-light hover:text-primary dark:text-gray-400"
                        active-class="!bg-primary-light !text-primary"
                        :to="item3.route"
                      >
                        <span class="h-1 w-1 rounded-full bg-current"></span>
                        <span>{{ translate(item3.heading) }}</span>
                      </router-link>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>
    <!--end::Menu-->
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { version } from "@/core/helpers/system";
import { asideMenuIcons } from "@/layouts/default-layout/config/helper";
import MainMenuConfig from "@/layouts/default-layout/config/MainMenuConfig";

// Replaces Metronic's MenuComponent "accordion" submenu type
// (data-kt-menu-sub="accordion") for this nav tree. Sections default open
// when a descendant route is active (same as before); a manual click
// override is tracked per section route so toggling one section doesn't
// affect siblings still following the route-based default.
export default defineComponent({
  name: "kt-menu",
  components: {},
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const manualToggle = reactive<Record<string, boolean>>({});

    const translate = (text: string) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match: string) => {
      return route.path.indexOf(match) !== -1;
    };

    const isExpanded = (key: string) =>
      key in manualToggle ? manualToggle[key] : hasActiveChildren(key);

    const toggle = (key: string) => {
      manualToggle[key] = !isExpanded(key);
    };

    return {
      hasActiveChildren,
      isExpanded,
      toggle,
      MainMenuConfig,
      asideMenuIcons,
      version,
      translate,
      getAssetPath,
    };
  },
});
</script>
