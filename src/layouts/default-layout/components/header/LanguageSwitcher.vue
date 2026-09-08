<template>
  <div class="relative mr-4 flex items-center" :ref="(el) => (dropdown.containerRef.value = el as HTMLElement | null)">
    <button
      type="button"
      class="flex h-[35px] w-[35px] items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
      @click="dropdown.toggle"
    >
      <span class="h-5 w-5 overflow-hidden rounded-sm">
        <img class="h-full w-full object-cover" :src="currentLanguageFlag" alt="flag" />
      </span>
    </button>

    <div v-show="dropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
      <div class="w-[175px] rounded-lg bg-white py-4 text-sm font-semibold text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100">
        <a
          href="#"
          class="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'text-primary': currentLanguage === 'en' }"
          @click.prevent="setLocale('en')"
        >
          <span class="h-5 w-5 overflow-hidden rounded-sm">
            <img class="h-full w-full object-cover" :src="getAssetPath('media/flags/united-kingdom.svg')" alt="English" />
          </span>
          English
        </a>
        <a
          href="#"
          class="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'text-primary': currentLanguage === 'id' }"
          @click.prevent="setLocale('id')"
        >
          <span class="h-5 w-5 overflow-hidden rounded-sm">
            <img class="h-full w-full object-cover" :src="getAssetPath('media/flags/indonesia.svg')" alt="Bahasa Indonesia" />
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
import {
  type AppLocale,
  setAppLocale,
} from "@/core/plugins/i18n";
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "LanguageSwitcher",
  setup() {
    const { locale } = useI18n();
    const dropdown = useDropdown();

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
      dropdown.close();
    };

    return {
      dropdown,
      currentLanguage,
      currentLanguageFlag,
      setLocale,
      getAssetPath,
    };
  },
});
</script>
