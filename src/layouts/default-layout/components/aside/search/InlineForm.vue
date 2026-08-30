<template>
  <div
    class="group relative hidden w-full cursor-pointer lg:block"
    @click="openGlobalSearch"
  >
    <!--begin::Icon-->
    <KTIcon
      icon-name="magnifier"
      icon-class="fs-2 absolute top-1/2 ml-4 -translate-y-1/2 text-gray-500"
    />
    <!--end::Icon-->

    <!--begin::Input (Read-only trigger)-->
    <input
      type="text"
      class="h-10 w-full cursor-pointer rounded-md border border-gray-700 bg-transparent py-2 pl-12 pr-20 text-sm text-white transition-colors group-hover:border-primary group-hover:bg-gray-800"
      name="search"
      value=""
      placeholder="Search..."
      readonly
    />
    <!--end::Input-->

    <!--begin::Keyboard Shortcut Hint-->
    <div class="absolute right-0 top-1/2 mr-3 -translate-y-1/2">
      <kbd class="inline-flex items-center gap-0.5 rounded border border-gray-600 bg-gray-800 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gray-400 shadow-sm">
        <span class="px-0.5">Ctrl</span>
        <span class="text-[10px] opacity-70">+</span>
        <span class="px-0.5">K</span>
      </kbd>
    </div>
    <!--end::Keyboard Shortcut Hint-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "inline-form",
  setup() {
    // Get the global search opener from the root
    const openGlobalSearch = () => {
      // Dispatch custom event to open global search
      window.dispatchEvent(new CustomEvent('open-global-search'));
    };

    return {
      openGlobalSearch,
    };
  },
});
</script>
