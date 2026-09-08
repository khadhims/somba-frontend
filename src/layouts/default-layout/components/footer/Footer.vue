<template>
  <!--begin::Footer-->
  <div class="flex border-t border-gray-200 py-4 dark:border-gray-800 lg:flex-col" id="kt_footer">
    <!--begin::Container-->
    <div
      class="flex w-full flex-col items-center justify-between px-4 md:flex-row"
      :class="footerWidthFluid ? '' : 'mx-auto max-w-[1320px]'"
    >
      <!--begin::Copyright-->
      <div class="order-2 text-gray-900 dark:text-gray-100 md:order-1">
        <span class="mr-1 font-semibold text-gray-500">2025&copy;</span>
        <a
          href="https://somba.kresibinar.id/"
          target="_blank"
          class="text-gray-800 transition-colors hover:text-primary dark:text-gray-200"
          >Somba</a
        >
      </div>
      <!--end::Copyright-->

      <!--begin::Menu-->
      <ul class="order-1 flex gap-2 font-semibold">
        <li>
          <a href="#" target="_blank" class="px-2 text-gray-500 transition-colors hover:text-primary">About</a>
        </li>

        <li>
          <a href="#" target="_blank" class="px-2 text-gray-500 transition-colors hover:text-primary">Support</a>
        </li>

        <li>
          <a href="#" target="_blank" class="px-2 text-gray-500 transition-colors hover:text-primary">Pricing</a>
        </li>
      </ul>
      <!--end::Menu-->
    </div>
    <!--end::Container-->
  </div>
  <!--end::Footer-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { footerWidthFluid } from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "KTFooter",
  setup() {
    return {
      footerWidthFluid,
    };
  },
});
</script>
