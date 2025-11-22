<template>
  <div
    class="w-100 position-relative d-none d-lg-block search-trigger-wrapper"
    @click="openGlobalSearch"
  >
    <!--begin::Icon-->
    <KTIcon
      icon-name="magnifier"
      icon-class="fs-2 search-icon position-absolute top-50 translate-middle-y ms-4"
    />
    <!--end::Icon-->

    <!--begin::Input (Read-only trigger)-->
    <input
      type="text"
      class="search-input form-control ps-13 pe-20 fs-7 h-40px cursor-pointer"
      name="search"
      value=""
      placeholder="Search..."
      readonly
    />
    <!--end::Input-->

    <!--begin::Keyboard Shortcut Hint-->
    <div class="position-absolute top-50 end-0 translate-middle-y me-3">
      <kbd class="search-kbd">
        <span class="kbd-key">Ctrl</span>
        <span class="kbd-separator">+</span>
        <span class="kbd-key">K</span>
      </kbd>
    </div>
    <!--end::Keyboard Shortcut Hint-->
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

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

<style scoped>
.search-trigger-wrapper {
  cursor: pointer;
}

.search-trigger-wrapper:hover .search-input {
  background-color: #f5f8fa;
  border-color: #3699FF;
}

.cursor-pointer {
  cursor: pointer !important;
}

.search-kbd {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  font-family: monospace;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.kbd-key {
  padding: 0 2px;
}

.kbd-separator {
  font-size: 10px;
  opacity: 0.7;
}
</style>
