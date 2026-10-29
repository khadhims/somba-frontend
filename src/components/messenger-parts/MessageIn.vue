<template>
  <div class="flex justify-start mb-10">
    <!--begin::Wrapper-->
    <div class="flex flex-col items-start">
      <!--begin::User-->
      <div class="flex items-center mb-2">
        <div class="h-[35px] w-[35px] overflow-hidden rounded-full">
          <img alt="Pic" :src="image" />
        </div>

        <!--begin::Details-->
        <div class="ml-3">
          <a
            href="#"
            class="mr-1 text-sm font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
            >{{ name }}</a
          >
          <span class="mb-1 text-xs text-gray-500">{{ time }}</span>
        </div>
        <!--end::Details-->
      </div>
      <!--end::User-->

      <!--begin::Text-->
      <div
        class="rounded bg-info-light p-5 text-left font-semibold text-gray-900 lg:max-w-[400px]"
        data-kt-element="message-text"
      >
        {{ text }}
      </div>
      <!--end::Text-->
    </div>
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "message-out",
  props: {
    name: String,
    image: String,
    time: String,
    text: String,
  },
});
</script>
