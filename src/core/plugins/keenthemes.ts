import { ThemeModeComponent } from "@/assets/ts/layout";
import type { App } from "vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

/**
 * @description Initialize dark/light mode bridging (data-bs-theme <-> the
 * Tailwind `dark:` variant). The rest of Metronic's KT JS component system
 * (ToggleComponent, StickyComponent, MenuComponent, ScrollComponent/
 * ScrollTopComponent, DrawerComponent, SwapperComponent) has been fully
 * replaced by Vue-native equivalents (see TAILWIND_MIGRATION.md) and no
 * longer has any live consumers - removed rather than left as dead code.
 */
const initializeComponents = () => {
  ThemeModeComponent.init();
};

/**
 * Initialize KTIcon global component instance
 * @param app vue instance
 */
function initKtIcon(app: App<Element>) {
  app.component("KTIcon", KTIcon);
}

export { initializeComponents, initKtIcon };
