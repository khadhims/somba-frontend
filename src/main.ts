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
window.addEventListener("storage", (evt) => {
  try {
    if (evt.key === "id_token" && evt.newValue === null) {
      try {
        const store = useAuthStore();
        store.logout();
      } catch (e) {
        /* empty */
      }
      try {
        router.push({ name: "sign-in" }).catch(() => {
          /* empty */
        });
      } catch (e) {
        /* empty */
      }
    }
  } catch (e) {
    /* empty */
  }
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

app.config.errorHandler = (err, instance, info) => {
  console.error("[Global Error Handler]", err, info);
};

// Mount the app immediately. 
// The router guard (src/router/index.ts) handles authentication verification 
// and redirection to sign-in for protected routes.
try {
  app.mount("#app");
} catch (mountErr) {
  console.error("[main] Failed to mount app:", mountErr);
  // fallback: still try to mount if target exists
  try {
    const root = document.getElementById("app");
    if (root) {
      app.mount(root);
    }
  } catch (e) {
    /* empty */
  }
}

// Fallback: Ensure splash screen is hidden after a few seconds even if mount/onMounted fails
setTimeout(() => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    splash.style.display = "none";
    document.body.classList.remove("page-loading");
  }
}, 3000);

// Background verification attempt to initialize store state
(async () => {
  try {
    const store = useAuthStore();
    await store.verifyAuth();
  } catch (e) {
    // Silent catch — router guard will handle redirection for protected routes
  }
})();
