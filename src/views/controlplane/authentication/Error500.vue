<template>
  <div class="flex min-h-screen flex-1 flex-col items-center justify-center">
    <!--begin::Content-->
    <div class="flex flex-col items-center p-10 text-center">
      <!--begin::Wrapper-->
      <div
        class="w-full max-w-2xl rounded-xl bg-white py-5 shadow-sm dark:bg-gray-900 dark:shadow-none"
      >
        <div class="px-4 py-15 lg:py-20">
          <!--begin::Title-->
          <h1
            class="mb-4 text-5xl font-extrabold text-gray-900 dark:text-gray-100"
          >
            System Error
          </h1>
          <!--end::Title-->
          <!--begin::Text-->
          <div class="mb-7 font-semibold text-gray-500">
            Something went wrong! Please try again later.
          </div>
          <!--end::Text-->
          <!--begin::Illustration-->
          <div class="mb-11">
            <img
              :src="getAssetPath('media/auth/500-error.png')"
              class="mx-auto max-h-[300px] max-w-full dark:hidden"
              alt=""
            />
            <img
              :src="getAssetPath('media/auth/500-error-dark.png')"
              class="mx-auto hidden max-h-[300px] max-w-full dark:block"
              alt=""
            />
          </div>
          <!--end::Illustration-->
          <!--begin::Link-->
          <router-link
            to="/"
            class="inline-flex items-center"
            :class="primaryButtonClass"
          >
            Return Home
          </router-link>
          <!--end::Link-->
        </div>
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Content-->
  </div>
</template>

<script lang="ts">
import { getAssetPath, getIllustrationsPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import { useBodyStore } from "@/stores/body";
import LayoutService from "@/core/services/LayoutService";
import { themeMode } from "@/layouts/default-layout/config/helper";
import { primaryButtonClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "error-500",
  components: {
    /* empty */
  },
  setup() {
    const bodyStore = useBodyStore();

    const bgImage =
      themeMode.value !== "dark"
        ? getAssetPath("media/auth/bg1.jpg")
        : getAssetPath("media/auth/bg1-dark.jpg");

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      bodyStore.addBodyClassname("bg-body");
      bodyStore.addBodyAttribute({
        qualifiedName: "style",
        value: `background-image: url("${bgImage}")`,
      });
    });

    return {
      getIllustrationsPath,
      bgImage,
      getAssetPath,
      primaryButtonClass,
    };
  },
});
</script>
