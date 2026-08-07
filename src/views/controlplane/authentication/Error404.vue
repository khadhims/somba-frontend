<template>
  <div class="flex min-h-screen flex-1 flex-col items-center justify-center">
    <!--begin::Content-->
    <div class="flex flex-col items-center p-10 text-center">
      <!--begin::Wrapper-->
      <div class="w-full max-w-2xl rounded-lg bg-white py-5 dark:bg-gray-900">
        <div class="px-4 py-15 lg:py-20">
          <!--begin::Title-->
          <h1 class="mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100">Oops!</h1>
          <!--end::Title-->
          <!--begin::Text-->
          <div class="mb-7 font-semibold text-gray-500">We can't find that page.</div>
          <!--end::Text-->
          <!--begin::Illustration-->
          <div class="mb-3">
            <img
              :src="getAssetPath('media/auth/404-error.png')"
              class="mx-auto max-h-[300px] max-w-full dark:hidden"
              alt=""
            />
            <img
              :src="getAssetPath('media/auth/404-error-dark.png')"
              class="mx-auto hidden max-h-[300px] max-w-full dark:block"
              alt=""
            />
          </div>
          <!--end::Illustration-->
          <!--begin::Link-->
          <router-link
            to="/"
            class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98]"
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
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";
import { themeMode } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "error-404",
  components: {},
  setup() {
    const storeBody = useBodyStore();

    const bgImage =
      themeMode.value !== "dark"
        ? getAssetPath("media/auth/bg1.jpg")
        : getAssetPath("media/auth/bg1-dark.jpg");

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      storeBody.addBodyClassname("bg-body");
      storeBody.addBodyAttribute({
        qualifiedName: "style",
        value: `background-image: url("${bgImage}")`,
      });
    });

    return {
      getIllustrationsPath,
      bgImage,
      getAssetPath,
    };
  },
});
</script>
