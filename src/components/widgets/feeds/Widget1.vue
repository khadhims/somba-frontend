<template>
  <!--begin::Feeds Widget 1-->
  <div class="rounded-lg bg-white dark:bg-gray-900" :class="widgetClasses">
    <!--begin::Body-->
    <div class="p-6 pb-0">
      <!--begin::Header-->
      <div class="flex items-center">
        <!--begin::User-->
        <div class="flex flex-1 items-center">
          <!--begin::Avatar-->
          <div class="mr-5 h-[45px] w-[45px] shrink-0">
            <img :src="getAssetPath('media/avatars/300-6.jpg')" alt="" class="h-full w-full rounded-full object-cover" />
          </div>
          <!--end::Avatar-->

          <!--begin::Info-->
          <div class="flex flex-col">
            <a href="#" class="text-sm font-bold text-gray-800 transition-colors hover:text-primary dark:text-gray-100"
              >Grace Green</a
            >

            <span class="text-sm font-semibold text-gray-500"
              >PHP, SQLite, Artisan CLI</span
            >
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
            <Dropdown2 @close="menuDropdown.close"></Dropdown2>
          </div>
        </div>
        <!--end::Menu-->
      </div>
      <!--end::Header-->

      <!--begin::Form-->
      <form id="kt_forms_widget_1_form" class="pb-3">
        <!--begin::Editor-->
        <div id="kt_forms_widget_1_editor" class="py-6"></div>
        <!--end::Editor-->

        <div class="border-t border-gray-200 dark:border-gray-700"></div>

        <!--begin::Toolbar-->
        <div id="kt_forms_widget_1_editor_toolbar" class="ql-toolbar flex items-center justify-between py-2">
          <div class="mr-2">
            <span class="ql-formats ql-size ms-0">
              <select class="ql-size w-[75px]"></select>
            </span>

            <span class="ql-formats">
              <button class="ql-bold"></button>
              <button class="ql-italic"></button>
              <button class="ql-underline"></button>
              <button class="ql-strike"></button>
              <button class="ql-image"></button>
              <button class="ql-link"></button>
              <button class="ql-clean"></button>
            </span>
          </div>

          <div class="-mr-3 flex items-center gap-1">
            <span class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary">
              <i class="flaticon2-clip-symbol"></i>
            </span>

            <span class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary">
              <i class="flaticon2-pin"></i>
            </span>
          </div>
        </div>
        <!--end::Toolbar-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Feeds Widget 1-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import Quill from "quill";
import Dropdown2 from "@/components/dropdown/Dropdown2.vue";
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "widget-1",
  props: {
    widgetClasses: String,
  },
  components: {
    Dropdown2,
  },
  setup() {
    const menuDropdown = useDropdown();

    onMounted(() => {
      const editorId = "kt_forms_widget_1_editor";

      // init editor
      const options = {
        modules: {
          toolbar: {
            container: "#kt_forms_widget_1_editor_toolbar",
          },
        },
        theme: "snow",
      };

      // Init editor
      new Quill("#" + editorId, options);
    });

    return {
      menuDropdown,
      getAssetPath,
    };
  },
});
</script>
