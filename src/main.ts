import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";

import "bootstrap-icons/font/bootstrap-icons.css";
import "apexcharts/dist/apexcharts.css";
import "quill/dist/quill.snow.css";
import "animate.css";
import "sweetalert2/dist/sweetalert2.css";
import "nouislider/dist/nouislider.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "socicon/css/socicon.css";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import "dropzone/dist/dropzone.css";
import "@vueform/multiselect/themes/default.css";
import "prism-themes/themes/prism-shades-of-purple.css";
import "element-plus/dist/index.css";
import "primeicons/primeicons.css";
import "@/assets/keenicons/duotone/style.css";
import "@/assets/keenicons/outline/style.css";
import "@/assets/keenicons/solid/style.css";

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
import { useAuthStore } from "@/stores/auth";

const app = createApp(App);
// create pinia instance so we can call stores before mount
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(ElementPlus);
// Global handler: when refresh token flow fails in ApiService,
// purge auth and redirect user to sign-in. Listener is installed
// early (before ApiService.init) so we don't miss events fired during
// startup or immediate requests.
window.addEventListener("auth:refresh_failed", () => {
  const auth = useAuthStore();
  auth.logout(); // calls purgeAuth()
  router.replace("/sign-in");
});

// Listen to storage events (other tabs) - if token removed in another tab, force logout/redirect here too
window.addEventListener('storage', (evt) => {
  try {
    if (evt.key === 'id_token' && evt.newValue === null) {
      try {
        const store = useAuthStore();
        store.logout();
      } catch (e) {}
      try { router.push({ name: 'sign-in' }).catch(() => {}); } catch (e) {}
    }
  } catch (e) {}
});

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

// Do not mount app until we have attempted initial auth verification.
// Mounting earlier could render protected pages before we know auth state.
// We'll mount after the startup verifyAuth call below.
// Verify auth on startup and redirect to sign-in on failure
(async () => {
  try {
    const store = useAuthStore();
    await store.verifyAuth();
    // verified or refreshed successfully
  } catch (e) {
    // couldn't verify or refresh, redirect to sign-in
    // allow router to be ready
    router.push({ name: "sign-in" }).catch(() => {});
  }
  // Now mount the app after auth verification attempt completes.
  try {
    app.mount("#app");
  } catch (mountErr) {
    // fallback: still try to mount
    try { (document.getElementById('app') as HTMLElement | null) && app.mount('#app'); } catch (e) {}
  }
})();
