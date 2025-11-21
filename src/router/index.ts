import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import i18n from "@/core/plugins/i18n";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/builder",
        name: "builder",
        component: () => import("@/views/LayoutBuilder.vue"),
        meta: {
          pageTitle: "Layout Builder",
          breadcrumbs: ["Layout"],
        },
      },
      {
        path: "/controlplane/pages/profile",
        name: "profile",
        component: () => import("@/components/page-layouts/Profile.vue"),
        meta: {
          breadcrumbs: ["Pages", "Profile"],
        },
        children: [
          {
            path: "overview",
            name: "profile-overview",
            component: () =>
              import("@/views/controlplane/pages/profile/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "projects",
            name: "profile-projects",
            component: () =>
              import("@/views/controlplane/pages/profile/Projects.vue"),
            meta: {
              pageTitle: "Projects",
            },
          },
          {
            path: "campaigns",
            name: "profile-campaigns",
            component: () =>
              import("@/views/controlplane/pages/profile/Campaigns.vue"),
            meta: {
              pageTitle: "Campaigns",
            },
          },
          {
            path: "documents",
            name: "profile-documents",
            component: () =>
              import("@/views/controlplane/pages/profile/Documents.vue"),
            meta: {
              pageTitle: "Documents",
            },
          },
          {
            path: "connections",
            name: "profile-connections",
            component: () =>
              import("@/views/controlplane/pages/profile/Connections.vue"),
            meta: {
              pageTitle: "Connections",
            },
          },
          {
            path: "activity",
            name: "profile-activity",
            component: () =>
              import("@/views/controlplane/pages/profile/Activity.vue"),
            meta: {
              pageTitle: "Activity",
            },
          },
        ],
      },
      {
        path: "/controlplane/pages/wizards/horizontal",
        name: "horizontal-wizard",
        component: () =>
          import("@/views/controlplane/pages/wizards/HorizontalWizardPage.vue"),
        meta: {
          pageTitle: "Horizontal",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/controlplane/pages/wizards/vertical",
        name: "vertical-wizard",
        component: () =>
          import("@/views/controlplane/pages/wizards/VerticalWizardPage.vue"),
        meta: {
          pageTitle: "Vertical",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/controlplane/organization",
        name: "organization",
        component: () =>
          import("@/views/controlplane/organization/Organization.vue"),
        meta: {
          breadcrumbs: ["Organization"],
        },
        children: [
          {
            path: "overview",
            name: "organization-overview",
            component: () =>
              import("@/views/controlplane/organization/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          // {
          //   path: "settings",
          //   name: "organization-settings",
          //   component: () =>
          //     import("@/views/controlplane/organization/Settings.vue"),
          //   meta: {
          //     pageTitle: "Settings",
          //   },
          // },
        ],
      },
      {
        path: "/controlplane/account",
        name: "account",
        component: () => import("@/views/controlplane/account/Account.vue"),
        meta: {
          breadcrumbs: ["Account"],
        },
        children: [
          {
            path: "overview",
            name: "account-overview",
            component: () =>
              import("@/views/controlplane/account/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          // {
          //   path: "settings",
          //   name: "account-settings",
          //   component: () =>
          //     import("@/views/controlplane/account/Settings.vue"),
          //   meta: {
          //     pageTitle: "Settings",
          //   },
          // },
        ],
      },
      {
        path: "/controlplane/team",
        name: "team",
        component: () => import("@/views/controlplane/team/Team.vue"),
        meta: {
          breadcrumbs: ["Team"],
        },
        children: [
          {
            path: "overview",
            name: "team-overview",
            component: () => import("@/views/controlplane/team/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "settings",
            name: "team-settings",
            component: () => import("@/views/controlplane/team/Settings.vue"),
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },
      {
        path: "/controlplane/site",
        name: "site",
        component: () => import("@/views/controlplane/site/Site.vue"),
        meta: {
          breadcrumbs: ["Site"],
        },
        children: [
          {
            path: "overview",
            name: "site-overview",
            component: () => import("@/views/controlplane/site/Overview.vue"),
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "room",
            name: "site-room",
            component: () => import("@/views/controlplane/site/Room.vue"),
            meta: {
              pageTitle: "Room",
            },
          },
          {
            path: "nvr",
            name: "site-nvr",
            component: () => import("@/views/controlplane/site/Nvr.vue"),
            meta: {
              pageTitle: "NVR",
            },
          },
          {
            path: "camera",
            name: "site-camera",
            component: () => import("@/views/controlplane/site/Camera.vue"),
            meta: {
              pageTitle: "Camera",
            },
          },
          {
            path: "settings",
            name: "site-settings",
            component: () => import("@/views/controlplane/site/Settings.vue"),
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },




      {
        path: "/apps/live-view",
        name: "apps-live-view",
        component: () => import("@/views/apps/LiveView.vue"),
        meta: {
          pageTitle: "Live View",
          breadcrumbs: ["Apps"],
        },
      },
      {
        path: "/apps/events-alerts/overview",
        name: "apps-events-alerts-overview",
        component: () => import("@/views/apps/events-alerts/Overview.vue"),
        meta: {
          pageTitle: "Events & Alerts Overview",
          breadcrumbs: ["Apps", "Events & Alerts"],
        },
      },
      {
        path: "/apps/events-alerts/settings",
        name: "apps-events-alerts-settings",
        component: () => import("@/views/apps/events-alerts/Settings.vue"),
        meta: {
          pageTitle: "Events & Alerts Settings",
          breadcrumbs: ["Apps", "Events & Alerts"],
        },
      },
      {
        path: "/apps/recording-playback/overview",
        name: "apps-recording-playback-overview",
        component: () => import("@/views/apps/recording-playback/Overview.vue"),
        meta: {
          pageTitle: "Recording & Playback Overview",
          breadcrumbs: ["Apps", "Recording & Playback"],
        },
      },
      {
        path: "/apps/recording-playback/settings",
        name: "apps-recording-playback-settings",
        component: () => import("@/views/apps/recording-playback/Settings.vue"),
        meta: {
          pageTitle: "Recording & Playback Settings",
          breadcrumbs: ["Apps", "Recording & Playback"],
        },
      },
      {
        path: "/apps/monitoring-center/overview",
        name: "apps-monitoring-center-overview",
        component: () => import("@/views/apps/monitoring-center/Overview.vue"),
        meta: {
          pageTitle: "Monitoring Center Overview",
          breadcrumbs: ["Apps", "Monitoring Center"],
        },
      },
      {
        path: "/apps/monitoring-center/settings",
        name: "apps-monitoring-center-settings",
        component: () => import("@/views/apps/monitoring-center/Settings.vue"),
        meta: {
          pageTitle: "Monitoring Center Settings",
          breadcrumbs: ["Apps", "Monitoring Center"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/controlplane/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/controlplane/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import(
            "@/views/controlplane/authentication/basic-flow/PasswordReset.vue"
          ),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () =>
          import("@/views/controlplane/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () =>
          import("@/views/controlplane/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    // If the route has a hash, scroll to the section with the specified ID; otherwise, scroll to the top of the page.
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: "smooth",
      };
    } else {
      return {
        top: 0,
        left: 0,
        behavior: "smooth",
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  const translatedTitle = to.meta.pageTitle ? i18n.global.t(to.meta.pageTitle as string) : to.meta.pageTitle;
  document.title = `${translatedTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }
});

export default router;
