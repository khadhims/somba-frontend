<template>
  <!--begin::Layout Builder Notice-->
  <div class="mb-10 rounded-lg bg-white dark:bg-gray-900">
    <div class="flex items-center p-6 py-8">
      <!--begin::Icon-->
      <div class="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center self-start lg:h-[80px] lg:w-[80px] lg:self-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="absolute h-[75px] w-[75px] text-primary opacity-5 lg:h-[100px] lg:w-[100px]"
        >
          <path
            fill="currentColor"
            d="M10.2,21.23,4.91,18.17a3.58,3.58,0,0,1-1.8-3.11V8.94a3.58,3.58,0,0,1,1.8-3.11L10.2,2.77a3.62,3.62,0,0,1,3.6,0l5.29,3.06a3.58,3.58,0,0,1,1.8,3.11v6.12a3.58,3.58,0,0,1-1.8,3.11L13.8,21.23A3.62,3.62,0,0,1,10.2,21.23Z"
          ></path>
        </svg>
        <KTIcon
          icon-name="wrench"
          icon-class="fs-2x fs-lg-3x text-primary position-absolute"
        />
      </div>
      <!--end::Icon-->

      <!--begin::Description-->
      <div class="ml-6">
        <p class="m-0 p-0 text-sm font-semibold text-gray-600">
          The layout builder will assist you in setting up your preferred layout
          for your project, generating a layout configuration, and previewing it
          in real-time. To preview the default layout configuration, simply
          empty your localStorage or press the 'Reset' button.
        </p>
      </div>
      <!--end::Description-->
    </div>
  </div>
  <!--end::Layout Builder Notice-->

  <div class="mb-10 rounded-lg bg-white dark:bg-gray-900">
    <!--begin::Header-->
    <div class="border-b border-gray-200 px-6 dark:border-gray-700">
      <ul class="flex gap-6 text-sm font-semibold">
        <li>
          <a
            class="inline-block cursor-pointer border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
            :class="{ '!border-primary !text-primary': tabIndex === 0 }"
            @click="setActiveTab($event)"
            data-tab-index="0"
            role="tab"
          >
            Main
          </a>
        </li>
        <li>
          <a
            class="inline-block cursor-pointer border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
            :class="{ '!border-primary !text-primary': tabIndex === 1 }"
            @click="setActiveTab($event)"
            data-tab-index="1"
            role="tab"
          >
            Header
          </a>
        </li>
        <li>
          <a
            class="inline-block cursor-pointer border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
            :class="{ '!border-primary !text-primary': tabIndex === 3 }"
            @click="setActiveTab($event)"
            data-tab-index="3"
            role="tab"
          >
            Aside
          </a>
        </li>
        <li>
          <a
            class="inline-block cursor-pointer border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
            :class="{ '!border-primary !text-primary': tabIndex === 4 }"
            @click="setActiveTab($event)"
            data-tab-index="4"
            role="tab"
          >
            Content
          </a>
        </li>
        <li>
          <a
            class="inline-block cursor-pointer border-b-2 border-transparent py-4 text-gray-500 transition-colors hover:text-primary"
            :class="{ '!border-primary !text-primary': tabIndex === 5 }"
            @click="setActiveTab($event)"
            data-tab-index="5"
            role="tab"
          >
            Footer
          </a>
        </li>
      </ul>
    </div>
    <!--end::Header-->

    <!--begin::Form-->
    <form id="kt_layout_builder_form" @submit="submit($event)">
      <!--begin::Body-->
      <div class="p-6">
        <div class="pt-3" id="kt_tabs">
          <div v-show="tabIndex === 0" id="kt_builder_main">
            <!--begin::Form group-->
            <div class="flex items-center justify-between">
              <!--begin::Heading-->
              <div class="flex flex-col">
                <h4 class="font-bold text-gray-900 dark:text-gray-100">Keenicons Style</h4>
                <div>
                  <span class="text-xs font-semibold text-gray-500"
                    >Select global UI icons style.</span
                  >{{ " " }}
                  <a
                    class="text-xs font-semibold text-primary"
                    href="https://preview.keenthemes.com/html/metronic/docs/icons/keenicons"
                    target="_blank"
                    >Learn more</a
                  >
                </div>
              </div>
              <!--end::Heading-->
              <!--begin::Options-->
              <div class="flex max-w-full gap-3 lg:max-w-[600px]">
                <!--begin::Option-->
                <label
                  class="flex-1 cursor-pointer rounded-md border-2 px-4 py-3 transition-colors"
                  :class="config.general.iconsType === 'duotone' ? 'border-success bg-success-light' : 'border-gray-200 dark:border-gray-700'"
                >
                  <!--begin::Image-->
                  <div class="flex items-center justify-center">
                    <KTIcon
                      icon-type="duotone"
                      icon-name="picture"
                      icon-class="fs-1 text-gray-500"
                    />
                    <span class="ml-2 text-xs font-semibold text-gray-500"
                      >Duotone</span
                    >
                  </div>
                  <!--end::Image-->
                  <input
                    v-model="config.general.iconsType"
                    class="sr-only"
                    type="radio"
                    value="duotone"
                  />
                </label>
                <!--end::Option-->
                <!--begin::Option-->
                <label
                  class="flex-1 cursor-pointer rounded-md border-2 px-4 py-3 transition-colors"
                  :class="config.general.iconsType === 'outline' ? 'border-success bg-success-light' : 'border-gray-200 dark:border-gray-700'"
                >
                  <!--begin::Image-->
                  <div class="flex items-center justify-center">
                    <i class="ki-outline ki-picture fs-1 text-gray-500"></i>
                    <span class="ml-2 text-xs font-semibold text-gray-500"
                      >Outline</span
                    >
                  </div>
                  <!--end::Image-->
                  <input
                    v-model="config.general.iconsType"
                    class="sr-only"
                    type="radio"
                    value="outline"
                    name="outline"
                  />
                </label>
                <!--end::Option-->
                <!--begin::Option-->
                <label
                  class="flex-1 cursor-pointer rounded-md border-2 px-4 py-3 transition-colors"
                  :class="config.general.iconsType === 'solid' ? 'border-success bg-success-light' : 'border-gray-200 dark:border-gray-700'"
                >
                  <!--begin::Image-->
                  <div class="flex items-center justify-center">
                    <i class="ki-solid ki-picture fs-1 text-gray-500"></i>
                    <span class="ml-2 text-xs font-semibold text-gray-500"
                      >Solid</span
                    >
                  </div>
                  <!--end::Image-->
                  <input
                    v-model="config.general.iconsType"
                    class="sr-only"
                    type="radio"
                    value="solid"
                    name="solid"
                  />
                </label>
                <!--end::Option-->
              </div>
              <!--end::Options-->
            </div>
            <!--end::Form group-->
            <!--begin::Separator-->
            <div class="my-6 border-t border-dashed border-gray-200 dark:border-gray-700"></div>
            <!--end::Separator-->
            <div class="mb-10 grid grid-cols-1 gap-2 lg:grid-cols-12">
              <label class="text-sm text-gray-700 dark:text-gray-300 lg:col-span-3 lg:text-right"
                >Illustration Set:</label
              >
              <div class="lg:col-span-8">
                <div class="mb-3 grid grid-cols-2 gap-4">
                  <div v-for="set in illustrationSets" :key="set.value">
                    <label
                      class="flex cursor-pointer flex-col rounded-md border border-dashed border-gray-300 p-6 text-left transition-colors hover:border-primary dark:border-gray-700"
                      :for="set.value"
                    >
                      <span class="mb-2 flex items-center">
                        <input
                          class="mr-5 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          type="radio"
                          v-model="config.illustrations.set"
                          :value="set.value"
                          name="illustrations-set"
                          :id="set.value"
                        />
                        <span class="text-base font-bold">{{ set.label }}</span>
                      </span>
                      <span
                        :style="{
                          backgroundImage: `url(${getAssetPath(
                            `/media/illustrations/${set.value}/1.png`
                          )})`,
                        }"
                        class="block h-[200px] w-full bg-contain bg-center bg-no-repeat"
                      ></span>
                    </label>
                  </div>
                </div>
                <div class="text-sm text-gray-500">
                  Select one of our in-house designed illustration set and apply
                  globally for all apps and pages
                </div>
              </div>
            </div>
          </div>

          <div v-show="tabIndex === 1" id="kt_builder_header">
            <div class="mb-10 grid grid-cols-1 gap-2 lg:grid-cols-12">
              <label class="text-sm text-gray-700 dark:text-gray-300 lg:col-span-3 lg:text-right">Width:</label>
              <div class="lg:col-span-4">
                <select :class="formInputClass" v-model="config.header.width">
                  <option value="fluid">Fluid</option>
                  <option value="fixed">Fixed</option>
                </select>
                <div class="mt-1 text-sm text-gray-500">
                  Select header width type.
                </div>
              </div>
            </div>
          </div>

          <div v-show="tabIndex === 3" id="kt_builder_aside">
            <div class="mb-10 grid grid-cols-1 gap-2 lg:grid-cols-12">
              <label class="text-sm text-gray-700 dark:text-gray-300 lg:col-span-3 lg:text-right"
                >Menu Icon:</label
              >
              <div class="lg:col-span-4">
                <select :class="formInputClass" v-model="config.aside.menuIcon">
                  <option value="keenthemes">Keenthemes Font Icons</option>
                  <option value="bootstrap">Bootstrap Font Icons</option>
                </select>
                <div class="mt-1 text-sm text-gray-500">Select menu icon type.</div>
              </div>
            </div>
            <div class="mb-10 grid grid-cols-1 gap-2 lg:grid-cols-12">
              <label class="text-sm text-gray-700 dark:text-gray-300 lg:col-span-3 lg:text-right"
                >Minimized:</label
              >
              <div class="lg:col-span-4">
                <label class="mb-2 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" v-model="config.aside.minimized" class="peer sr-only" />
                  <span class="h-5 w-9 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary dark:bg-gray-700"></span>
                </label>
                <div class="text-sm text-gray-500">
                  Minimize secondary panel by default
                </div>
              </div>
            </div>
          </div>

          <div v-show="tabIndex === 4" id="kt_builder_content">
            <div class="mb-10 grid grid-cols-1 gap-2 lg:grid-cols-12">
              <label class="text-sm text-gray-700 dark:text-gray-300 lg:col-span-3 lg:text-right">Width:</label>
              <div class="lg:col-span-4">
                <select :class="formInputClass" v-model="config.content.width">
                  <option value="fluid">Fluid</option>
                  <option value="fixed">Fixed</option>
                </select>
                <div class="mt-1 text-sm text-gray-500">
                  Select layout width type.
                </div>
              </div>
            </div>
          </div>

          <div v-show="tabIndex === 5" id="kt_builder_footer">
            <div class="mb-10 grid grid-cols-1 gap-2 lg:grid-cols-12">
              <label class="text-sm text-gray-700 dark:text-gray-300 lg:col-span-3 lg:text-right">Width:</label>
              <div class="lg:col-span-4">
                <select :class="formInputClass" v-model="config.footer.width">
                  <option value="fluid">Fluid</option>
                  <option value="fixed">Fixed</option>
                </select>
                <div class="mt-1 text-sm text-gray-500">
                  Select layout width type.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end::Body-->

      <!--begin::Footer-->
      <div class="border-t border-gray-200 p-6 dark:border-gray-700">
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <div class="lg:col-span-3"></div>
          <div class="lg:col-span-9">
            <input
              type="hidden"
              id="kt_layout_builder_tab"
              name="layout-builder[tab]"
            />
            <input
              type="hidden"
              id="kt_layout_builder_action"
              name="layout-builder[action]"
            />

            <button
              type="submit"
              id="kt_layout_builder_preview"
              class="mr-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
            >
              Preview
            </button>

            <button
              @click="reset($event)"
              type="button"
              id="kt_layout_builder_reset"
              class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <!--end::Footer-->
    </form>
    <!--end::Form-->
  </div>

  <!--begin::Card-->
  <div class="rounded-lg bg-white dark:bg-gray-900">
    <!--begin::Card Body-->
    <div class="p-10 lg:p-[3.75rem]">
      <!--begin::Heading-->
      <h1 class="mb-5 text-2xl font-bold text-gray-900 dark:text-gray-100" id="overview">Generated config</h1>
      <!--end::Heading-->
      <div class="py-5">
        This config is used as a <b>{{ themeName }}</b> layout config, you can
        update default values inside file
        <code>metronic/vue/theme/src/core/config/DefaultLayoutConfig.ts</code>
      </div>
      <CodeHighlighter lang="json">{{ config }}</CodeHighlighter>
    </div>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, ref } from "vue";
import { config } from "@/layouts/default-layout/config/helper";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { themeName } from "@/core/helpers/system";
import { LS_CONFIG_NAME_KEY } from "@/stores/config";
import { formInputClass } from "@/core/helpers/badge";

const LS_BUILDER_TAB_NAME =
  "layoutBuilderTabIndex_" + import.meta.env.VITE_APP_DEMO;

const illustrationSets = [
  { value: "sketchy-1", label: "Sketchy" },
  { value: "sigma-1", label: "Sigma" },
  { value: "dozzy-1", label: "Dozzy" },
  { value: "unitedpalms-1", label: "United Palms" },
];

export default defineComponent({
  name: "layout-builder",
  components: {
    CodeHighlighter,
  },
  setup() {
    const tabIndex = ref(0);

    onMounted(() => {
      // set the tab from previous
      tabIndex.value = parseInt(
        localStorage.getItem(LS_BUILDER_TAB_NAME) || "0"
      );
    });

    /**
     * Reset config
     * @param event
     */
    const reset = (event: any) => {
      event.preventDefault();
      // remove existing saved config
      localStorage.removeItem(LS_CONFIG_NAME_KEY);
      window.location.reload();
    };

    /**
     * Set active tab when the tab get clicked
     * @param event
     */
    const setActiveTab = (event: any) => {
      tabIndex.value = parseInt(event.target.getAttribute("data-tab-index"));
      // keep active tab
      localStorage.setItem(LS_BUILDER_TAB_NAME, tabIndex.value.toString());
    };

    /**
     * Submit form
     * @param event
     */
    const submit = (event: any) => {
      event.preventDefault();
      // save new config to localStorage
      localStorage.setItem(LS_CONFIG_NAME_KEY, JSON.stringify(config.value));
      window.location.reload();
    };

    return {
      tabIndex,
      config,
      illustrationSets,
      reset,
      setActiveTab,
      submit,
      themeName,
      getAssetPath,
      formInputClass,
    };
  },
});
</script>
