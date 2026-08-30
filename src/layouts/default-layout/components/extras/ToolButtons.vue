<template>
  <div
    class="fixed right-0 top-1/2 z-20 mt-20 flex -rotate-90 gap-2 px-5 font-bold"
  >
    <!--begin::Help drawer toggle-->
    <button
      id="kt_help_toggle"
      class="flex h-[35px] items-center rounded-t-none bg-white px-5 text-gray-700 shadow-sm transition-colors hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
      title="Learn & Get Inspired"
      @click="drawers.helpOpen = true"
    >
      Help
    </button>
    <!--end::Help drawer toggle-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDrawersStore } from "@/stores/drawers";

export default defineComponent({
  name: "kt-toolbar-buttons",
  components: {},
  setup() {
    const drawers = useDrawersStore();
    return { drawers };
  },
});
</script>
