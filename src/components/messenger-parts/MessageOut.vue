<template>
  <div class="flex justify-end mb-10">
    <!--begin::Wrapper-->
    <div class="flex flex-col items-end">
      <!--begin::User-->
      <div class="flex items-center mb-2">
        <!--begin::Details-->
        <div class="mr-3">
          <span class="mb-1 text-xs text-gray-500">{{ time }}</span>
          <a
            href="#"
            class="ml-1 text-sm font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
            >You</a
          >
        </div>
        <!--end::Details-->

        <div class="h-[35px] w-[35px] overflow-hidden rounded-full">
          <img alt="Pic" :src="image" />
        </div>
      </div>
      <!--end::User-->

      <!--begin::Text-->
      <div
        class="rounded bg-primary-light p-5 text-right font-semibold text-gray-900 lg:max-w-[400px]"
      >
        {{ text }}
      </div>
      <!--end::Text-->
    </div>
    <!--end::Wrapper-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "message-out",
  props: {
    image: String,
    time: String,
    text: String,
  },
});
</script>
