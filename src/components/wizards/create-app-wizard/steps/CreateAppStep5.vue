<template>
  <!--begin::Step 5-->
  <div v-show="active">
    <div class="w-full text-center">
      <!--begin::Heading-->
      <h1 class="mb-3 font-bold text-gray-900 dark:text-gray-100">Release!</h1>
      <!--end::Heading-->

      <!--begin::Description-->
      <div class="text-lg font-semibold text-gray-500">
        Submit your app to kickstart your project.
      </div>
      <!--end::Description-->

      <!--begin::Illustration-->
      <div class="px-4 py-15 text-center">
        <img
          :src="getIllustrationsPath('9.png')"
          alt=""
          class="mx-auto max-h-[300px] max-w-full"
        />
      </div>
      <!--end::Illustration-->
    </div>
  </div>
  <!--end::Step 5-->
</template>

<script setup lang="ts">
defineOptions({
  name: "CreateAppStep5Component",
});

import { getIllustrationsPath } from "@/core/helpers/assets";

defineProps<{ active: boolean }>();
</script>
