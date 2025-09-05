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
        sectionTitle: "Site Management",
        route: "/site",
        keenthemesIcon: "home-2",
        bootstrapIcon: "bi-building",
        sub: [
          {
            heading: "Overview",
            route: "/controlplane/site/overview",
            keenthemesIcon: "chart-simple",
            bootstrapIcon: "bi-graph-up",
          },
          {
            heading: "Site Configuration",
            route: "/controlplane/site/settings",
            keenthemesIcon: "setting-2",
            bootstrapIcon: "bi-gear",
          },
          {
            heading: "Room Management",
            route: "/controlplane/site/room",
            keenthemesIcon: "home-3",
            bootstrapIcon: "bi-door-open",
          },
          {
            heading: "NVR Systems",
            route: "/controlplane/site/nvr",
            keenthemesIcon: "router",
            bootstrapIcon: "bi-hdd-network",
          },
          {
            heading: "Camera Management",
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
      {
        sectionTitle: "modals",
        route: "/modals",
        keenthemesIcon: "design",
        bootstrapIcon: "bi-shield-check",
        sub: [
          {
            sectionTitle: "general",
            route: "/general",
            sub: [
              {
                heading: "inviteFriends",
                route: "/controlplane/modals/general/invite-friends",
              },
              {
                heading: "viewUsers",
                route: "/controlplane/modals/general/view-user",
              },
              {
                heading: "upgradePlan",
                route: "/controlplane/modals/general/upgrade-plan",
              },
              {
                heading: "shareAndEarn",
                route: "/controlplane/modals/general/share-and-earn",
              },
            ],
          },
          {
            sectionTitle: "forms",
            route: "/forms",
            sub: [
              {
                heading: "newTarget",
                route: "/controlplane/modals/forms/new-target",
              },
              {
                heading: "newCard",
                route: "/controlplane/modals/forms/new-card",
              },
              {
                heading: "newAddress",
                route: "/controlplane/modals/forms/new-address",
              },
              {
                heading: "createAPIKey",
                route: "/controlplane/modals/forms/create-api-key",
              },
            ],
          },
          {
            sectionTitle: "wizards",
            route: "/wizards",
            sub: [
              {
                heading: "twoFactorAuth",
                route: "/controlplane/modals/wizards/two-factor-auth",
              },
              {
                heading: "createApp",
                route: "/controlplane/modals/wizards/create-app",
              },
              {
                heading: "createAccount",
                route: "/controlplane/modals/wizards/create-account",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "widgets",
        route: "/widgets",
        keenthemesIcon: "element-7",
        bootstrapIcon: "bi-layers",
        sub: [
          {
            heading: "widgetsLists",
            route: "/controlplane/widgets/lists",
          },
          {
            heading: "widgetsStatistics",
            route: "/controlplane/widgets/statistics",
          },
          {
            heading: "widgetsCharts",
            route: "/controlplane/widgets/charts",
          },
          {
            heading: "widgetsMixed",
            route: "/controlplane/widgets/mixed",
          },
          {
            heading: "widgetsTables",
            route: "/controlplane/widgets/tables",
          },
          {
            heading: "widgetsFeeds",
            route: "/controlplane/widgets/feeds",
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
        sectionTitle: "customers",
        route: "/customers",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-printer",
        sub: [
          {
            heading: "gettingStarted",
            route: "/apps/customers/getting-started",
          },
          {
            heading: "customersListing",
            route: "/apps/customers/customers-listing",
          },
          {
            heading: "customerDetails",
            route: "/apps/customers/customer-details",
          },
        ],
      },
      {
        sectionTitle: "subscriptions",
        route: "/subscriptions",
        keenthemesIcon: "basket",
        bootstrapIcon: "bi-cart",
        sub: [
          {
            heading: "getStarted",
            route: "/apps/subscriptions/getting-started",
          },
          {
            heading: "subscriptionList",
            route: "/apps/subscriptions/subscription-list",
          },
          {
            heading: "addSubscription",
            route: "/apps/subscriptions/add-subscription",
          },
          {
            heading: "viewSubscription",
            route: "/apps/subscriptions/view-subscription",
          },
        ],
      },
      {
        heading: "calendarApp",
        route: "/apps/calendar",
        keenthemesIcon: "calendar-8",
        bootstrapIcon: "bi-calendar3-event",
      },
      {
        sectionTitle: "chat",
        route: "/chat",
        keenthemesIcon: "message-text-2",
        bootstrapIcon: "bi-chat-left",
        sub: [
          {
            heading: "privateChat",
            route: "/apps/chat/private-chat",
          },
          {
            heading: "groupChat",
            route: "/apps/chat/group-chat",
          },
          {
            heading: "drawerChat",
            route: "/apps/chat/drawer-chat",
          },
        ],
      },
      {
        heading: "liveView",
        route: "/apps/live-view",
        keenthemesIcon: "screen",
        bootstrapIcon: "bi-camera-video",
      },
      {
        sectionTitle: "events & alerts",
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
        sectionTitle: "recording & playback",
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
        sectionTitle: "monitoring center",
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
