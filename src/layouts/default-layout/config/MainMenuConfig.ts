import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
  {
    heading: "control plane",
    route: "/controlplane",
    pages: [
      {
        heading: "organization",
        route: "/controlplane/organization/overview",
        keenthemesIcon: "building",
        bootstrapIcon: "bi-building",
      },
      {
        heading: "account",
        route: "/controlplane/account/overview",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-person",
      },
      {
        heading: "team",
        route: "/controlplane/team/overview",
        keenthemesIcon: "users",
        bootstrapIcon: "bi-people",
      },
      {
        sectionTitle: "siteManagement",
        route: "/site",
        keenthemesIcon: "home-2",
        bootstrapIcon: "bi-map",
        sub: [
          {
            heading: "overview",
            route: "/controlplane/site/overview",
            keenthemesIcon: "chart-simple",
            bootstrapIcon: "bi-graph-up",
          },
          {
            heading: "siteConfiguration",
            route: "/controlplane/site/settings",
            keenthemesIcon: "setting-2",
            bootstrapIcon: "bi-gear",
          },
          {
            heading: "roomManagement",
            route: "/controlplane/site/room",
            keenthemesIcon: "home-3",
            bootstrapIcon: "bi-door-open",
          },
          {
            heading: "nvrSystems",
            route: "/controlplane/site/nvr",
            keenthemesIcon: "router",
            bootstrapIcon: "bi-hdd-network",
          },
          {
            heading: "cameraManagement",
            route: "/controlplane/site/camera",
            keenthemesIcon: "security-user",
            bootstrapIcon: "bi-camera-video",
          },
        ],
      },
      {
        sectionTitle: "pages",
        keenthemesIcon: "plus",
        bootstrapIcon: "bi-archive",
        sub: [
          {
            sectionTitle: "profile",
            route: "/profile",
            sub: [
              {
                heading: "profileOverview",
                route: "/controlplane/pages/profile/overview",
              },
              {
                heading: "projects",
                route: "/controlplane/pages/profile/projects",
              },
              {
                heading: "campaigns",
                route: "/controlplane/pages/profile/campaigns",
              },
              {
                heading: "documents",
                route: "/controlplane/pages/profile/documents",
              },
              {
                heading: "connections",
                route: "/controlplane/pages/profile/connections",
              },
              {
                heading: "activity",
                route: "/controlplane/pages/profile/activity",
              },
            ],
          },
          {
            sectionTitle: "wizards",
            route: "/wizard",
            sub: [
              {
                heading: "horizontal",
                route: "/controlplane/pages/wizards/horizontal",
              },
              {
                heading: "vertical",
                route: "/controlplane/pages/wizards/vertical",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "authentication",
        keenthemesIcon: "fingerprint-scanning",
        bootstrapIcon: "bi-sticky",
        sub: [
          {
            sectionTitle: "basicFlow",
            sub: [
              {
                heading: "signIn",
                route: "/sign-in",
              },
              {
                heading: "signUp",
                route: "/sign-up",
              },
              {
                heading: "passwordReset",
                route: "/password-reset",
              },
            ],
          },
          {
            heading: "multiStepSignUp",
            route: "/multi-step-sign-up",
          },
          {
            heading: "error404",
            route: "/404",
          },
          {
            heading: "error500",
            route: "/500",
          },
        ],
      },
    ],
  },
  {
    heading: "apps",
    route: "/apps",
    pages: [
      {
        heading: "liveView",
        route: "/apps/live-view",
        keenthemesIcon: "screen",
        bootstrapIcon: "bi-camera-video",
      },
      {
        sectionTitle: "eventsAlerts",
        route: "/events-alerts",
        keenthemesIcon: "notification-bing",
        bootstrapIcon: "bi-bell",
        sub: [
          {
            heading: "overview",
            route: "/apps/events-alerts/overview",
          },
          {
            heading: "settings",
            route: "/apps/events-alerts/settings",
          },
        ],
      },
      {
        sectionTitle: "recordingPlayback",
        route: "/recording-playback",
        keenthemesIcon: "video",
        bootstrapIcon: "bi-play-circle",
        sub: [
          {
            heading: "overview",
            route: "/apps/recording-playback/overview",
          },
          {
            heading: "settings",
            route: "/apps/recording-playback/settings",
          },
        ],
      },
      {
        sectionTitle: "monitoringCenter",
        route: "/monitoring-center",
        keenthemesIcon: "monitor-mobbile",
        bootstrapIcon: "bi-display",
        sub: [
          {
            heading: "overview",
            route: "/apps/monitoring-center/overview",
          },
          {
            heading: "settings",
            route: "/apps/monitoring-center/settings",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
