<template>
  <!--begin::Menu wrapper-->
  <div
    id="kt_aside_menu_wrapper"
    ref="scrollElRef"
    class="hover-scroll-overlay-y px-2 my-5 my-lg-5"
    data-kt-scroll="true"
    data-kt-scroll-height="auto"
    data-kt-scroll-dependencies="{default: '#kt_aside_toolbar, #kt_aside_footer', lg: '#kt_header, #kt_aside_toolbar, #kt_aside_footer'}"
    data-kt-scroll-wrappers="#kt_aside_menu"
    data-kt-scroll-offset="5px"
  >
    <!-- Panah scroll atas -->
    <span
      v-if="isScrollActive && !isAtTop"
      class="scroll-arrow scroll-arrow-up"
    ></span>
    <!--begin::Menu-->
    <div
      id="#kt_aside_menu"
      class="menu menu-column menu-title-gray-800 menu-state-title-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
      data-kt-menu="true"
    >
      <template v-for="(item, i) in menu" :key="i">
        <div v-if="item.heading" class="menu-item">
          <div class="menu-content pt-8 pb-2">
            <span class="menu-section text-muted text-uppercase fs-8 ls-1">
              <!-- {{ translate(item.heading) }} -->
              {{ item.heading.toUpperCase().replace(/_/g, " ") }}
            </span>
          </div>
        </div>
        <template v-for="(menuItem, j) in item.pages" :key="j">
          <template v-if="menuItem.heading">
            <div class="menu-item">
              <router-link
                v-if="menuItem.route"
                class="menu-link"
                active-class="active"
                :to="menuItem.route"
              >
                <span
                  v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon"
                  class="menu-icon"
                >
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
                <span class="menu-title">{{
                  translate(menuItem.heading)
                }}</span>
              </router-link>
            </div>
          </template>
          <div
            v-if="menuItem.sectionTitle && menuItem.route"
            :class="{ show: hasActiveChildren(menuItem.route) }"
            class="menu-item menu-accordion"
            data-kt-menu-sub="accordion"
            data-kt-menu-trigger="click"
          >
            <span class="menu-link">
              <span
                v-if="menuItem.keenthemesIcon || menuItem.bootstrapIcon"
                class="menu-icon"
              >
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
              <span class="menu-title">{{
                translate(menuItem.sectionTitle)
              }}</span>
              <span class="menu-arrow"></span>
            </span>
            <div
              v-if="menuItem.route"
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-sub menu-sub-accordion"
            >
              <template v-for="(item2, k) in menuItem.sub" :key="k">
                <div v-if="item2.heading" class="menu-item">
                  <router-link
                    v-if="item2.route"
                    class="menu-link"
                    active-class="active"
                    :to="item2.route"
                  >
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(item2.heading)
                    }}</span>
                  </router-link>
                </div>
                <div
                  v-if="item2.sectionTitle && item2.route"
                  :class="{ show: hasActiveChildren(item2.route) }"
                  class="menu-item menu-accordion"
                  data-kt-menu-sub="accordion"
                  data-kt-menu-trigger="click"
                >
                  <span class="menu-link">
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(item2.sectionTitle)
                    }}</span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-sub menu-sub-accordion"
                  >
                    <template v-for="(item3, k) in item2.sub" :key="k">
                      <div v-if="item3.heading" class="menu-item">
                        <router-link
                          v-if="item3.route"
                          class="menu-link"
                          active-class="active"
                          :to="item3.route"
                        >
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title">{{
                            translate(item3.heading)
                          }}</span>
                        </router-link>
                      </div>
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
import { computed, defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router";
import { version } from "@/core/helpers/system";
import { asideMenuIcons } from "@/layouts/default-layout/config/helper";
import MainMenuConfig from "@/layouts/default-layout/config/MainMenuConfig";
import type { MenuItem } from "@/layouts/default-layout/config/types";

// Hides menu entries whose matching router route is flagged `meta.disabled`,
// and drops group/section entries left with no children after filtering.
function pruneDisabled(items: MenuItem[]): MenuItem[] {
  return items
    .map((item) => {
      const children = item.pages ?? item.sub;
      if (!children) return item;
      const pruned = pruneDisabled(children);
      return item.pages ? { ...item, pages: pruned } : { ...item, sub: pruned };
    })
    .filter((item) => {
      if (item.pages) return item.pages.length > 0;
      if (item.sub) return item.sub.length > 0;
      if (item.route) return !router.resolve(item.route).meta?.disabled;
      return true;
    });
}

export default defineComponent({
  name: "kt-menu",
  components: {
    /* empty */
  },
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = ref<null | HTMLElement>(null);
    const isScrollActive = ref(false);
    const isAtTop = ref(true);
    const isAtBottom = ref(false);

    const checkScroll = () => {
      const el = scrollElRef.value;
      if (el) {
        isScrollActive.value = el.scrollHeight > el.clientHeight;
        isAtTop.value = el.scrollTop === 0;
        isAtBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight;
      }
    };

    onMounted(() => {
      const el = scrollElRef.value;
      if (el) {
        el.scrollTop = 0;
        checkScroll();
        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
      }
    });

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

    const menu = computed(() => pruneDisabled(MainMenuConfig));

    return {
      hasActiveChildren,
      menu,
      asideMenuIcons,
      version,
      translate,
      scrollElRef,
      isScrollActive,
      isAtTop,
      isAtBottom,
      getAssetPath,
    };
  },
});
</script>
