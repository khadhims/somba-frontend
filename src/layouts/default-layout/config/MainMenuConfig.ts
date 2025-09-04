import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      }
   
    ],
  },
  {
    heading: "organization",
    route: "/organization",
    pages: [
      {
        sectionTitle: "account",
        route: "/account",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-person",
        sub: [
          {
            heading: "accountOverview",
            route: "/organization/account/overview",
          },
          {
            heading: "settings",
            route: "/organization/account/settings",
          },
        ],
      },
      {
  sectionTitle: "Team",
        route: "/team",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-person",
        sub: [
          {
            heading: "Overview",
            route: "/organization/team/overview",
          },
          {
            heading: "Settings",
            route: "/organization/team/settings",
          },
        ],
      },
      {
        sectionTitle: "Site Management",
        route: "/site",
        keenthemesIcon: "home-2",
        bootstrapIcon: "bi-building",
        sub: [
          {
            heading: "Overview",
            route: "/organization/site/overview",
            keenthemesIcon: "chart-simple",
            bootstrapIcon: "bi-graph-up",
          },
          {
            heading: "Site Configuration",
            route: "/organization/site/settings",
            keenthemesIcon: "setting-2",
            bootstrapIcon: "bi-gear",
          },
          {
            heading: "Room Management",
            route: "/organization/site/room",
            keenthemesIcon: "home-3",
            bootstrapIcon: "bi-door-open",
          },
          {
            heading: "NVR Systems",
            route: "/organization/site/nvr",
            keenthemesIcon: "router",
            bootstrapIcon: "bi-hdd-network",
          },
          {
            heading: "Camera Management",
            route: "/organization/site/camera",
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
                route: "/organization/pages/profile/overview",
              },
              {
                heading: "projects",
                route: "/organization/pages/profile/projects",
              },
              {
                heading: "campaigns",
                route: "/organization/pages/profile/campaigns",
              },
              {
                heading: "documents",
                route: "/organization/pages/profile/documents",
              },
              {
                heading: "connections",
                route: "/organization/pages/profile/connections",
              },
              {
                heading: "activity",
                route: "/organization/pages/profile/activity",
              },
            ],
          },
          {
            sectionTitle: "wizards",
            route: "/wizard",
            sub: [
              {
                heading: "horizontal",
                route: "/organization/pages/wizards/horizontal",
              },
              {
                heading: "vertical",
                route: "/organization/pages/wizards/vertical",
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
                route: "/organization/modals/general/invite-friends",
              },
              {
                heading: "viewUsers",
                route: "/organization/modals/general/view-user",
              },
              {
                heading: "upgradePlan",
                route: "/organization/modals/general/upgrade-plan",
              },
              {
                heading: "shareAndEarn",
                route: "/organization/modals/general/share-and-earn",
              },
            ],
          },
          {
            sectionTitle: "forms",
            route: "/forms",
            sub: [
              {
                heading: "newTarget",
                route: "/organization/modals/forms/new-target",
              },
              {
                heading: "newCard",
                route: "/organization/modals/forms/new-card",
              },
              {
                heading: "newAddress",
                route: "/organization/modals/forms/new-address",
              },
              {
                heading: "createAPIKey",
                route: "/organization/modals/forms/create-api-key",
              },
            ],
          },
          {
            sectionTitle: "wizards",
            route: "/wizards",
            sub: [
              {
                heading: "twoFactorAuth",
                route: "/organization/modals/wizards/two-factor-auth",
              },
              {
                heading: "createApp",
                route: "/organization/modals/wizards/create-app",
              },
              {
                heading: "createAccount",
                route: "/organization/modals/wizards/create-account",
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
            route: "/organization/widgets/lists",
          },
          {
            heading: "widgetsStatistics",
            route: "/organization/widgets/statistics",
          },
          {
            heading: "widgetsCharts",
            route: "/organization/widgets/charts",
          },
          {
            heading: "widgetsMixed",
            route: "/organization/widgets/mixed",
          },
          {
            heading: "widgetsTables",
            route: "/organization/widgets/tables",
          },
          {
            heading: "widgetsFeeds",
            route: "/organization/widgets/feeds",
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
    ],
  },
];

export default MainMenuConfig;
