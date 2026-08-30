<template>
  <!--begin::Help drawer backdrop-->
  <div
    v-if="drawers.helpOpen"
    class="fixed inset-0 z-40 bg-black/50"
    @click="drawers.helpOpen = false"
  ></div>
  <!--end::Help drawer backdrop-->

  <!--begin::Help drawer-->
  <div
    id="kt_help"
    class="fixed inset-y-0 right-0 z-50 flex w-[350px] translate-x-full flex-col bg-white transition-transform duration-300 md:w-[525px] dark:bg-gray-900"
    :class="{ 'translate-x-0': drawers.helpOpen }"
  >
    <!--begin::Header-->
    <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700" id="kt_help_header">
      <h5 class="text-base font-semibold text-gray-600 dark:text-gray-400">
        Learn & Get Inspired
      </h5>

      <div>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          id="kt_help_close"
          @click="drawers.helpOpen = false"
        >
          <KTIcon icon-name="cross" icon-class="fs-2" />
        </button>
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="flex-1 overflow-y-auto p-6" id="kt_help_body">
      <!--begin::Content-->
      <div id="kt_help_scroll">
        <!--begin::Support-->
        <div
          class="mb-10 rounded border border-dashed border-gray-300 p-6 lg:p-8 dark:border-gray-700"
        >
          <!--begin::Heading-->
          <h2 class="mb-5 font-bold">
            Support at
            <a href="https://devs.keenthemes.com"
              >devs.keenthemes.com</a
            >
          </h2>
          <!--end::Heading-->
          <!--begin::Description-->
          <div class="mb-5 text-lg font-semibold">
            <span class="text-gray-500"
              >Join our developers community to find answer to your question
              and help others.</span
            >
          </div>
          <!--end::Description-->
          <!--begin::Link-->
          <a
            href="https://devs.keenthemes.com"
            class="block w-full rounded-md bg-primary py-3 text-center text-base font-semibold text-white transition-colors hover:bg-primary-active"
            >Get Support</a
          >
          <!--end::Link-->
        </div>
        <!--end::Support-->
        <!--begin::Link-->
        <div class="mb-7 flex items-center">
          <!--begin::Icon-->
          <div
            class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded bg-warning-light lg:h-[75px] lg:w-[75px]"
          >
            <KTIcon
              icon-name="abstract-26"
              icon-class="text-warning fs-2x fs-lg-3x"
            />
          </div>
          <!--end::Icon-->
          <!--begin::Info-->
          <div class="ml-4 flex flex-1 items-center justify-between lg:ml-6">
            <!--begin::Wrapper-->
            <div class="mr-2 flex flex-col lg:mr-5">
              <!--begin::Title-->
              <a
                href="https://preview.keenthemes.com/metronic8/vue/docs/getting-started/build"
                class="mb-1 text-sm font-bold text-gray-900 transition-colors hover:text-primary lg:text-lg dark:text-gray-100"
                >Documentation &amp; Videos</a
              >
              <!--end::Title-->
              <!--begin::Description-->
              <div class="text-xs font-semibold text-gray-500 lg:text-sm">
                From guides and video tutorials, to live demos and code
                examples to get started.
              </div>
              <!--end::Description-->
            </div>
            <!--end::Wrapper-->
            <KTIcon icon-name="arrow-right" icon-class="text-gray-500 fs-2" />
          </div>
          <!--end::Info-->
        </div>
        <!--end::Link-->
        <!--begin::Link-->
        <div class="mb-7 flex items-center">
          <!--begin::Icon-->
          <div
            class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded bg-primary-light lg:h-[75px] lg:w-[75px]"
          >
            <KTIcon
              icon-name="gift"
              icon-class="text-primary fs-2x fs-lg-3x"
            />
          </div>
          <!--end::Icon-->
          <!--begin::Info-->
          <div class="ml-4 flex flex-1 items-center justify-between lg:ml-6">
            <!--begin::Wrapper-->
            <div class="mr-2 flex flex-col lg:mr-5">
              <!--begin::Title-->
              <a
                href="https://preview.keenthemes.com/metronic8/vue/docs/base/utilities"
                class="mb-1 text-sm font-bold text-gray-900 transition-colors hover:text-primary lg:text-lg dark:text-gray-100"
                >Plugins &amp; Components</a
              >
              <!--end::Title-->
              <!--begin::Description-->
              <div class="text-xs font-semibold text-gray-500 lg:text-sm">
                Check out our 300+ in-house components and customized
                3rd-party plugins.
              </div>
              <!--end::Description-->
            </div>
            <!--end::Wrapper-->
            <KTIcon icon-name="arrow-right" icon-class="text-gray-500 fs-2" />
          </div>
          <!--end::Info-->
        </div>
        <!--end::Link-->
        <!--begin::Link-->
        <div class="mb-7 flex items-center">
          <!--begin::Icon-->
          <div
            class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded bg-info-light lg:h-[75px] lg:w-[75px]"
          >
            <KTIcon
              icon-name="design-frame"
              icon-class="text-info fs-2x fs-lg-3x"
            />
          </div>
          <!--end::Icon-->
          <!--begin::Info-->
          <div class="ml-4 flex flex-1 items-center justify-between lg:ml-6">
            <!--begin::Wrapper-->
            <div class="mr-2 flex flex-col lg:mr-5">
              <!--begin::Title-->
              <router-link
                to="/builder"
                class="mb-1 text-sm font-bold text-gray-900 transition-colors hover:text-primary lg:text-lg dark:text-gray-100"
                >Layout Builder</router-link
              >
              <!--end::Title-->
              <!--begin::Description-->
              <div class="text-xs font-semibold text-gray-500 lg:text-sm">
                Dynamically modify and preview layout
              </div>
              <!--end::Description-->
            </div>
            <!--end::Wrapper-->
            <KTIcon icon-name="phone" icon-class="text-gray-500 fs-2" />
          </div>
          <!--end::Info-->
        </div>
        <!--end::Link-->
        <!--begin::Link-->
        <div class="mb-7 flex items-center">
          <!--begin::Icon-->
          <div
            class="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded bg-danger-light lg:h-[75px] lg:w-[75px]"
          >
            <KTIcon
              icon-name="wifi"
              icon-class="text-danger fs-2x fs-lg-3x"
            />
          </div>
          <!--end::Icon-->
          <!--begin::Info-->
          <div class="ml-4 flex flex-1 items-center justify-between lg:ml-6">
            <!--begin::Wrapper-->
            <div class="mr-2 flex flex-col lg:mr-5">
              <!--begin::Title-->
              <a
                href="https://preview.keenthemes.com/metronic8/vue/docs/getting-started/changelog"
                class="mb-1 text-sm font-bold text-gray-900 transition-colors hover:text-primary lg:text-lg dark:text-gray-100"
                >What's New</a
              >
              <!--end::Title-->
              <!--begin::Description-->
              <div class="text-xs font-semibold text-gray-500 lg:text-sm">
                Latest features and improvements added with our users feedback
                in mind.
              </div>
              <!--end::Description-->
            </div>
            <!--end::Wrapper-->
            <KTIcon icon-name="arrow-right" icon-class="text-gray-500 fs-2" />
          </div>
          <!--end::Info-->
        </div>
        <!--end::Link-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Help drawer-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import { useDrawersStore } from "@/stores/drawers";

export default defineComponent({
  name: "kt-help-drawer",
  components: {},
  setup() {
    const drawers = useDrawersStore();
    return {
      getAssetPath,
      drawers,
    };
  },
});
</script>
