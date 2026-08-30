<template>
  <!--begin::Forms Widget 6-->
  <div class="rounded-lg bg-white dark:bg-gray-900" :class="widgetClasses">
    <!--begin::Body-->
    <div class="p-6 pb-0">
      <!--begin::Header-->
      <div class="mb-5 flex items-center">
        <!--begin::User-->
        <div class="flex flex-1 items-center">
          <!--begin::Avatar-->
          <div class="mr-5 h-[45px] w-[45px] shrink-0">
            <img :src="getAssetPath('media/avatars/300-13.jpg')" alt="" class="h-full w-full rounded-full object-cover" />
          </div>
          <!--end::Avatar-->

          <!--begin::Info-->
          <div class="flex flex-col">
            <a href="#" class="text-sm font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
              >Mat Dillon</a
            >
            <span class="text-sm font-semibold text-gray-500">Last month</span>
          </div>
          <!--end::Info-->
        </div>
        <!--end::User-->

        <!--begin::Menu-->
        <div class="relative" :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-light"
            @click="menuDropdown.toggle"
          >
            <KTIcon icon-name="category" icon-class="fs-2" />
          </button>
          <div v-show="menuDropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
            <Dropdown3 @close="menuDropdown.close"></Dropdown3>
          </div>
        </div>
        <!--end::Menu-->
      </div>
      <!--end::Header-->

      <!--begin::Post-->
      <div class="mb-6">
        <!--begin::Text-->
        <div class="mb-5 text-sm font-normal text-gray-800 dark:text-gray-200">
          Outlines keep you honest. They stop you from indulging in poorly
          thought-out metaphors
        </div>
        <!--end::Text-->

        <!--begin::Video-->
        <div class="mb-5">
          <iframe
            class="h-[300px] w-full rounded"
            src="https://www.youtube.com/embed/qIHXpnASPAA"
            :allowfullscreen="true"
          ></iframe>
        </div>
        <!--end::Video-->

        <!--begin::Toolbar-->
        <div class="mb-5 flex items-center gap-4">
          <a
            href="#"
            class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-success-light hover:text-success dark:bg-gray-800"
          >
            <KTIcon icon-name="message-text-2" icon-class="fs-3" />
            189
          </a>

          <a
            href="#"
            class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-danger-light hover:text-danger dark:bg-gray-800"
          >
            <KTIcon icon-name="heart" icon-class="fs-3" />
            229
          </a>
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Bottom-->

      <!--begin::Separator-->
      <div class="mb-4 border-t border-gray-200 dark:border-gray-700"></div>
      <!--end::Separator-->

      <!--begin::Reply input-->
      <form class="relative mb-6">
        <textarea
          class="min-h-[25px] w-full resize-none border-0 bg-transparent p-0 pr-16 text-sm focus:outline-none focus:ring-0 dark:text-gray-100"
          rows="1"
          placeholder="Reply.."
        ></textarea>

        <div class="absolute right-0 top-0 flex items-center gap-1">
          <span class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary">
            <KTIcon icon-name="paper-clip" icon-class="fs-3" />
          </span>

          <span class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary">
            <KTIcon icon-name="geolocation" icon-class="fs-3" />
          </span>
        </div>
      </form>
      <!--edit::Reply input-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Forms Widget 6-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown3 from "@/components/dropdown/Dropdown3.vue";
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "widget-6",
  props: {
    widgetClasses: String,
  },
  components: {
    Dropdown3,
  },
  setup() {
    const menuDropdown = useDropdown();
    return {
      menuDropdown,
      getAssetPath,
    };
  },
});
</script>
