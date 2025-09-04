import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";

import "@/core/plugins/prismjs";

const app = createApp(App);

// create pinia instance so we can call stores before mount
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ElementPlus);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");

// Verify auth on startup and redirect to sign-in on failure
import { useAuthStore } from "@/stores/auth";
(async () => {
  try {
    const store = useAuthStore();
    await store.verifyAuth();
    // verified or refreshed successfully
  } catch (e) {
    // couldn't verify or refresh, redirect to sign-in
    // allow router to be ready
    const { default: router } = await import("./router");
    router.push({ name: "sign-in" }).catch(() => {});
  }
})();
