<template>
  <!--begin::Feeds Widget 2-->
  <div class="rounded-lg bg-white dark:bg-gray-900" :class="widgetClasses">
    <!--begin::Body-->
    <div class="p-6 pb-0">
      <!--begin::Header-->
      <div class="mb-5 flex items-center">
        <!--begin::User-->
        <div class="flex flex-1 items-center">
          <!--begin::Avatar-->
          <div class="mr-5 h-[45px] w-[45px] shrink-0">
            <img
              :src="getAssetPath('media/avatars/300-23.jpg')"
              alt=""
              class="h-full w-full rounded-full object-cover"
            />
          </div>
          <!--end::Avatar-->

          <!--begin::Info-->
          <div class="flex flex-col">
            <a
              href="#"
              class="text-sm font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
              >Nick Logan</a
            >

            <span class="text-sm font-semibold text-gray-500"
              >PHP, SQLite, Artisan CLI</span
            >
          </div>
          <!--end::Info-->
        </div>
        <!--end::User-->

        <!--begin::Menu-->
        <div
          class="relative"
          :ref="(el) => (menuDropdown.containerRef.value = el as HTMLElement | null)"
        >
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary-light"
            @click="menuDropdown.toggle"
          >
            <KTIcon icon-name="category" icon-class="fs-2" />
          </button>
          <div
            v-show="menuDropdown.isOpen.value"
            class="absolute right-0 top-full z-20 mt-2"
          >
            <Dropdown2 @close="menuDropdown.close"></Dropdown2>
          </div>
        </div>
        <!--end::Menu-->
      </div>
      <!--end::Header-->

      <!--begin::Post-->
      <div class="mb-5">
        <!--begin::Text-->
        <p class="mb-5 font-normal text-gray-800 dark:text-gray-200">
          Outlines keep you honest. They stop you from indulging in poorly
          thought-out metaphors about driving and keep you focused on the
          overall structure of your post
        </p>
        <!--end::Text-->

        <!--begin::Toolbar-->
        <div class="mb-5 flex items-center gap-4">
          <a
            href="#"
            class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-success-light hover:text-success dark:bg-gray-800"
          >
            <KTIcon icon-name="message-text-2" icon-class="fs-3" />
            120
          </a>

          <a
            href="#"
            class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-danger-light hover:text-danger dark:bg-gray-800"
          >
            <KTIcon icon-name="heart" icon-class="fs-3" />
            15
          </a>
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Post-->

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
          <span
            class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
          >
            <KTIcon icon-name="paper-clip" icon-class="fs-3" />
          </span>

          <span
            class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
          >
            <KTIcon icon-name="geolocation" icon-class="fs-3" />
          </span>
        </div>
      </form>
      <!--edit::Reply input-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Feeds Widget 2-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "widget-2",
  props: {
    widgetClasses: String,
  },
  components: {
    Dropdown2,
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
