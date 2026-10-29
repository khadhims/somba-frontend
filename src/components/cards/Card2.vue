<template>
  <!--begin::Card-->
  <div class="h-full rounded-lg bg-white dark:bg-gray-900" :class="cardClasses">
    <!--begin::Card header-->
    <div class="flex flex-nowrap items-center justify-between px-9 pt-9">
      <!--begin::Card title-->
      <div class="m-0 flex items-center">
        <!--begin::Icon-->
        <div
          class="mr-5 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <img :src="icon" alt="image" class="p-3" />
        </div>
        <!--end::Icon-->

        <!--begin::Title-->
        <a
          href="#"
          class="m-0 text-lg font-semibold text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
        >
          {{ title }}
        </a>
        <!--end::Title-->
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div
        class="relative m-0"
        :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)"
      >
        <!--begin::Menu-->
        <button
          type="button"
          class="-mr-3 flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-light"
          @click="menuDropdown.toggle"
        >
          <KTIcon icon-name="category" icon-class="fs-3 text-primary" />
        </button>

        <div
          v-show="menuDropdown.isOpen.value"
          class="absolute right-0 top-full z-20 mt-2"
        >
          <Dropdown3 @close="menuDropdown.close"></Dropdown3>
        </div>
        <!--end::Menu-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="flex flex-col px-9 pb-8 pt-6">
      <!--begin::Heading-->
      <div class="mb-3 text-3xl font-bold">
        {{ content }}
      </div>
      <!--end::Heading-->

      <!--begin::Stats-->
      <div class="mb-5 mt-auto flex flex-wrap items-center text-sm">
        <KTIcon
          :icon-name="arrow"
          :icon-class="`fs-3 me-1 ${colorTextClass}`"
        />

        <!--begin::Number-->
        <div :class="colorTextClass" class="mr-2 font-bold">
          {{ footerData }}
        </div>
        <!--end::Number-->

        <!--begin::Label-->
        <div class="font-semibold text-gray-500">
          {{ footerText }}
        </div>
        <!--end::Label-->
      </div>
      <!--end::Stats-->

      <!--begin::Indicator-->
      <div class="flex items-center font-semibold">
        <span
          class="mr-2 inline-flex rounded bg-gray-100 px-3 py-2 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {{ indicatorValue }}
        </span>

        <span class="text-xs text-gray-500">{{ indicatorLabel }}</span>
      </div>
      <!--end::Indicator-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { useDropdown } from "@/composables/useDropdown";

// Tailwind's build-time scanner needs literal class strings - `text-${color}`
// template-literal interpolation (the original Bootstrap-era pattern) would
// silently produce unstyled text in production, same trap documented in
// core/helpers/badge.ts. Explicit map instead.
const TEXT_COLOR_CLASSES: Record<string, string> = {
  primary: "text-primary",
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  info: "text-info",
  secondary: "text-gray-500",
};

export default defineComponent({
  name: "card-2",
  components: {
    Dropdown3,
  },
  props: {
    cardClasses: String,

    icon: String,

    title: String,

    content: String,

    color: String,

    arrow: String,

    footerData: String,

    footerText: String,

    indicatorValue: String,

    indicatorLabel: String,
  },
  setup(props) {
    const colorTextClass = computed(
      () => TEXT_COLOR_CLASSES[props.color || "primary"] || "text-primary"
    );
    const menuDropdown = useDropdown();
    return {
      getAssetPath,
      colorTextClass,
      menuDropdown,
    };
  },
});
</script>
