<template>
  <!--begin::Menu-->
  <div
    class="w-[350px] rounded-lg bg-white text-gray-800 shadow-lg lg:w-[375px] dark:bg-gray-900 dark:text-gray-100"
  >
    <!--begin::Heading-->
    <div
      class="flex flex-col rounded-t-md bg-cover bg-no-repeat"
      :style="`background-image: url('${getAssetPath(
        '/media/misc/menu-header-bg.jpg'
      )}')`"
    >
      <!--begin::Title-->
      <h3 class="mb-6 mt-10 px-9 font-semibold text-white">
        Notifications <span class="ps-3 text-xs opacity-75">24 reports</span>
      </h3>
      <!--end::Title-->

      <!--begin::Tabs-->
      <ul class="flex gap-6 px-9 text-sm font-semibold">
        <li>
          <button
            type="button"
            class="border-b-2 pb-4 text-white opacity-75 transition-opacity hover:opacity-100"
            :class="
              activeTab === 1
                ? 'border-white opacity-100'
                : 'border-transparent'
            "
            @click="activeTab = 1"
          >
            Alerts
          </button>
        </li>

        <li>
          <button
            type="button"
            class="border-b-2 pb-4 text-white opacity-75 transition-opacity hover:opacity-100"
            :class="
              activeTab === 2
                ? 'border-white opacity-100'
                : 'border-transparent'
            "
            @click="activeTab = 2"
          >
            Updates
          </button>
        </li>

        <li>
          <button
            type="button"
            class="border-b-2 pb-4 text-white opacity-75 transition-opacity hover:opacity-100"
            :class="
              activeTab === 3
                ? 'border-white opacity-100'
                : 'border-transparent'
            "
            @click="activeTab = 3"
          >
            Logs
          </button>
        </li>
      </ul>
      <!--end::Tabs-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div>
      <!--begin::Tab panel-->
      <div v-show="activeTab === 1">
        <!--begin::Items-->
        <div class="my-5 max-h-[325px] overflow-y-auto px-8">
          <div
            v-for="(item, index) in data1"
            :key="index"
            class="flex items-center justify-between py-4"
          >
            <!--begin::Section-->
            <div class="flex items-center">
              <!--begin::Symbol-->
              <div
                class="mr-4 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full"
                :class="badgeVariantClass(item.state)"
              >
                <KTIcon
                  :icon-name="item.icon"
                  :icon-class="stateIconClass(item.state)"
                />
              </div>
              <!--end::Symbol-->

              <!--begin::Title-->
              <div class="mr-2">
                <a
                  href="#"
                  class="block text-sm font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
                  >{{ item.title }}</a
                >
                <div class="text-xs text-gray-500">
                  {{ item.description }}
                </div>
              </div>
              <!--end::Title-->
            </div>
            <!--end::Section-->

            <!--begin::Label-->
            <span
              class="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >{{ item.time }}</span
            >
            <!--end::Label-->
          </div>
        </div>
        <!--end::Items-->

        <!--begin::View more-->
        <div
          class="border-t border-gray-200 py-3 text-center dark:border-gray-700"
        >
          <a
            href="#"
            class="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 transition-colors hover:text-primary"
          >
            View All
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </a>
        </div>
        <!--end::View more-->
      </div>
      <!--end::Tab panel-->

      <!--begin::Tab panel-->
      <div v-show="activeTab === 2">
        <!--begin::Wrapper-->
        <div class="flex flex-col px-9">
          <!--begin::Section-->
          <div class="pb-0 pt-10">
            <!--begin::Title-->
            <h3 class="text-center font-bold text-gray-900 dark:text-gray-100">
              Get Pro Access
            </h3>
            <!--end::Title-->

            <!--begin::Text-->
            <div class="pt-1 text-center text-sm font-semibold text-gray-600">
              Outlines keep you honest. They stoping you from amazing poorly
              about drive
            </div>
            <!--end::Text-->

            <!--begin::Action-->
            <!-- ponytail: original targeted a modal id (#kt_modal_upgrade_plan)
            with no matching modal mounted anywhere in the app - already a
            dead link before this migration, left inert. -->
            <div class="mb-9 mt-5 text-center">
              <a
                href="#"
                class="inline-block rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
                >Upgrade</a
              >
            </div>
            <!--end::Action-->
          </div>
          <!--end::Section-->

          <!--begin::Illustration-->
          <img
            class="mx-auto max-h-[200px] max-w-full"
            alt="somba"
            :src="getIllustrationsPath('1.png')"
          />
          <!--end::Illustration-->
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Tab panel-->

      <!--begin::Tab panel-->
      <div v-show="activeTab === 3">
        <!--begin::Items-->
        <div class="my-5 max-h-[325px] overflow-y-auto px-8">
          <div
            v-for="(item, index) in data2"
            :key="index"
            class="flex items-center justify-between py-4"
          >
            <!--begin::Section-->
            <div class="mr-2 flex items-center">
              <!--begin::Code-->
              <span
                class="mr-4 w-[70px] rounded px-2 py-1 text-center text-xs font-semibold"
                :class="badgeVariantClass(item.state)"
                >{{ item.code }}</span
              >
              <!--end::Code-->

              <!--begin::Title-->
              <a
                href="#"
                class="text-sm font-semibold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
                >{{ item.message }}</a
              >
              <!--end::Title-->
            </div>
            <!--end::Section-->

            <!--begin::Label-->
            <span
              class="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >{{ item.time }}</span
            >
            <!--end::Label-->
          </div>
        </div>
        <!--end::Items-->

        <!--begin::View more-->
        <div
          class="border-t border-gray-200 py-3 text-center dark:border-gray-700"
        >
          <a
            href="#"
            class="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 transition-colors hover:text-primary"
          >
            View All
            <KTIcon icon-name="arrow-right" icon-class="fs-5" />
          </a>
        </div>
        <!--end::View more-->
      </div>
      <!--end::Tab panel-->
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath, getIllustrationsPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { badgeVariantClass, type BadgeVariant } from "@/core/helpers/badge";

// Tailwind's build-time scanner can't see `text-${state}` template-literal
// interpolation - same trap documented in core/helpers/badge.ts. The icon
// needs a plain text-color (not the bg+text pill badgeVariantClass gives),
// hence this small extra map alongside it.
const STATE_ICON_CLASSES: Record<BadgeVariant, string> = {
  primary: "text-primary",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  secondary: "text-gray-500",
};

export default defineComponent({
  name: "notifications-menu",
  components: {
    /* empty */
  },
  setup() {
    const activeTab = ref(2);

    const stateIconClass = (state: BadgeVariant) => STATE_ICON_CLASSES[state];

    const data1: Array<{
      title: string;
      description: string;
      time: string;
      icon: string;
      state: BadgeVariant;
    }> = [
      {
        title: "Project Alice",
        description: "Phase 1 development",
        time: "1 hr",
        icon: "technology-2",
        state: "primary",
      },
      {
        title: "HR Confidential",
        description: "Confidential staff documents",
        time: "2 hrs",
        icon: "information-5",
        state: "danger",
      },
      {
        title: "Company HR",
        description: "Corporeate staff profiles",
        time: "5 hrs",
        icon: "briefcase",
        state: "warning",
      },
      {
        title: "Project Redux",
        description: "New frontend admin theme",
        time: "2 days",
        icon: "cloud-change",
        state: "success",
      },
      {
        title: "Project Breafing",
        description: "Product launch status update",
        time: "21 Jan",
        icon: "map",
        state: "primary",
      },
      {
        title: "Banner Assets",
        description: "Collection of banner images",
        time: "21 Jan",
        icon: "graph-3",
        state: "info",
      },
      {
        title: "Icon Assets",
        description: "Collection of SVG icons",
        time: "20 March",
        icon: "color-swatch",
        state: "warning",
      },
    ];

    const data2: Array<{
      code: string;
      state: BadgeVariant;
      message: string;
      time: string;
    }> = [
      {
        code: "200 OK",
        state: "success",
        message: "New order",
        time: "Just now",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "New customer",
        time: "2 hrs",
      },
      {
        code: "200 OK",
        state: "success",
        message: "Payment process",
        time: "5 hrs",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "Search query",
        time: "2 days",
      },
      {
        code: "200 OK",
        state: "success",
        message: "API connection",
        time: "1 week",
      },
      {
        code: "200 OK",
        state: "success",
        message: "Database restore",
        time: "Mar 5",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "System update",
        time: "May 15",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "Server OS update",
        time: "Apr 3",
      },
      {
        code: "300 WRN",
        state: "warning",
        message: "API rollback",
        time: "Jun 30",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "Refund process",
        time: "Jul 10",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "Withdrawal process",
        time: "Sep 10",
      },
      {
        code: "500 ERR",
        state: "danger",
        message: "Mail tasks",
        time: "Dec 10",
      },
    ];

    return {
      activeTab,
      data1,
      data2,
      badgeVariantClass,
      stateIconClass,
      getIllustrationsPath,
      getAssetPath,
    };
  },
});
</script>
