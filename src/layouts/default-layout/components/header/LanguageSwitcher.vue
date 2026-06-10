<template>
  <div class="d-flex align-items-center me-4">
    <div
      class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px"
      data-kt-menu-trigger="{default: 'click'}"
      data-kt-menu-attach="parent"
      data-kt-menu-placement="bottom-end"
    >
      <span class="symbol symbol-20px">
        <img class="rounded-1" :src="currentLanguageFlag" alt="flag" />
      </span>
    </div>

    <div
      class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-175px"
      data-kt-menu="true"
    >
      <div class="menu-item px-3">
        <a
          class="menu-link d-flex px-5"
          :class="{ active: currentLanguage === 'en' }"
          @click="setLocale('en')"
        >
          <span class="symbol symbol-20px me-4">
            <img
              class="rounded-1"
              :src="getAssetPath('media/flags/united-kingdom.svg')"
              alt="English"
            />
          </span>
          English
        </a>
      </div>
      <div class="menu-item px-3">
        <a
          class="menu-link d-flex px-5"
          :class="{ active: currentLanguage === 'id' }"
          @click="setLocale('id')"
        >
          <span class="symbol symbol-20px me-4">
            <img
              class="rounded-1"
              :src="getAssetPath('media/flags/indonesia.svg')"
              alt="Bahasa Indonesia"
            />
          </span>
          Bahasa Indonesia
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetPath } from "@/core/helpers/assets";
import { type AppLocale, setAppLocale } from "@/core/plugins/i18n";

export default defineComponent({
  name: "LanguageSwitcher",
  setup() {
    const { locale } = useI18n();

    const currentLanguage = computed(() => {
      return locale.value as AppLocale;
    });

    const currentLanguageFlag = computed(() => {
      return currentLanguage.value === "id"
        ? getAssetPath("media/flags/indonesia.svg")
        : getAssetPath("media/flags/united-kingdom.svg");
    });

    const setLocale = (target: AppLocale) => {
      if (target !== locale.value) {
        setAppLocale(target);
      }
    };

    return {
      currentLanguage,
      currentLanguageFlag,
      setLocale,
      getAssetPath,
    };
  },
});
</script>
