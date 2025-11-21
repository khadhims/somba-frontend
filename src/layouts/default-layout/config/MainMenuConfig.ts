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
        keenthemesIcon: "abstract-25",
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
        keenthemesIcon: "people",
        bootstrapIcon: "bi-people",
      },
      {
        heading: "site",
        route: "/controlplane/site/overview",
        keenthemesIcon: "home-2",
        bootstrapIcon: "bi-map",
      },
      {
        heading: "camera",
        route: "/controlplane/site/camera",
        keenthemesIcon: "instagram",
        bootstrapIcon: "bi-camera-video",
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
            heading: "events",
            route: "/apps/events-alerts/Events",
          },
          {
            heading: "alerts",
            route: "/apps/events-alerts/Alerts",
          },
          {
            heading: "settings",
            route: "/apps/events-alerts/settings",
          },
        ],
      },
      {
        sectionTitle: "recordingPlayback",
        route: "/recording-playbook",
        keenthemesIcon: "screen",
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
        keenthemesIcon: "monitor-mobile",
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
