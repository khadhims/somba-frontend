<template>
  <div class="d-flex align-items-center me-4">
    <div
      class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px"
      data-kt-menu-trigger="{default: 'click'}"
      data-kt-menu-attach="parent"
      data-kt-menu-placement="bottom-end"
    >
      <span class="fw-bold">{{ localeLabel }}</span>
    </div>

    <div
      class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-150px"
      data-kt-menu="true"
    >
            <div class="menu-item px-3" @click="setLocale('en')">
              <a class="menu-link px-5">English</a>
            </div>
            <div class="menu-item px-3" @click="setLocale('id')">
              <a class="menu-link px-5">Bahasa Indonesia</a>
            </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  type AppLocale,
  setAppLocale,
} from "@/core/plugins/i18n";

export default defineComponent({
  name: "LanguageSwitcher",
  setup() {
    const { locale } = useI18n();

    const localeLabel = computed(() => {
      const current = locale.value as AppLocale;
      switch (current) {
        case "id":
          return "ID";
        case "en":
        default:
          return current.toUpperCase();
      }
    });

    const setLocale = (target: AppLocale) => {
      if (target !== locale.value) {
        setAppLocale(target);
      }
    };

    return {
      localeLabel,
      setLocale,
    };
  },
});
</script>

<style scoped>
.menu { min-width: 160px; }
</style>
