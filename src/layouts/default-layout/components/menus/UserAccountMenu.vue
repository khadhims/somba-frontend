<template>
  <!--begin::Menu-->
  <div
    class="w-[275px] rounded-lg bg-white py-4 text-sm font-semibold text-gray-600 shadow-lg dark:bg-gray-900 dark:text-gray-300"
  >
    <!--begin::Menu item-->
    <div class="flex items-center px-6 py-2">
      <!--begin::Avatar-->
      <div class="mr-5 h-[50px] w-[50px] shrink-0">
        <img alt="Logo" :src="getAssetPath('media/avatars/300-1.jpg')" class="h-full w-full rounded-full" />
      </div>
      <!--end::Avatar-->

      <!--begin::Username-->
      <div class="flex flex-col">
        <div class="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100">
          Max Smith
          <span class="rounded px-2 py-1 text-xs font-bold" :class="badgeVariantClass('success')">Pro</span>
        </div>
        <a href="#" class="text-xs font-semibold text-gray-500 transition-colors hover:text-primary">max@kt.com</a>
      </div>
      <!--end::Username-->
    </div>
    <!--end::Menu item-->

    <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

    <!--begin::Menu item-->
    <router-link to="/pages/profile/overview" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
      My Profile
    </router-link>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <router-link to="/pages/profile/overview" class="flex items-center justify-between px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
      <span>My Projects</span>
      <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold" :class="badgeVariantClass('danger')">3</span>
    </router-link>
    <!--end::Menu item-->

    <!--begin::Menu item with submenu-->
    <div class="group relative">
      <router-link to="/pages/profile/overview" class="flex items-center justify-between px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click.prevent>
        <span>My Subscription</span>
        <KTIcon icon-name="right" icon-class="fs-4 text-gray-400" />
      </router-link>

      <!--begin::Menu sub-->
      <div class="invisible absolute right-full top-0 z-10 w-[175px] rounded-lg bg-white py-4 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-gray-900">
        <router-link to="/pages/profile/overview" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
          Referrals
        </router-link>
        <router-link to="/pages/profile/overview" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
          Billing
        </router-link>
        <router-link to="/pages/profile/overview" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
          Payments
        </router-link>
        <router-link to="/pages/profile/overview" class="flex items-center px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
          Statements
          <i class="fas fa-exclamation-circle ms-2 text-xs" title="View your statements"></i>
        </router-link>

        <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

        <div class="px-6">
          <label class="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked class="peer sr-only" name="notifications" />
            <span class="h-5 w-9 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary dark:bg-gray-700"></span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Notifications</span>
          </label>
        </div>
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item with submenu-->

    <!--begin::Menu item-->
    <router-link to="/pages/profile/overview" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
      My Statements
    </router-link>
    <!--end::Menu item-->

    <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

    <!--begin::Menu item with submenu-->
    <div class="group relative">
      <router-link to="/pages/profile/overview" class="relative flex items-center px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click.prevent>
        <span>Language</span>
        <span class="absolute right-6 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
          {{ currentLanguageOption.name }}
          <img class="h-[15px] w-[15px] rounded-sm" :src="currentLanguageOption.flag" :alt="currentLanguageOption.name" />
        </span>
      </router-link>

      <!--begin::Menu sub-->
      <div class="invisible absolute right-full top-0 z-10 w-[175px] rounded-lg bg-white py-4 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-gray-900">
        <a
          v-for="option in languageOptions"
          :key="option.code"
          href="#"
          class="flex items-center gap-2 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'text-primary': currentLanguage === option.code }"
          @click.prevent="setLang(option.code)"
        >
          <img class="h-5 w-5 rounded-sm" :src="option.flag" :alt="option.name" />
          {{ option.name }}
        </a>
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item with submenu-->

    <!--begin::Menu item-->
    <router-link to="/pages/profile/overview" class="mb-1 block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="$emit('close')">
      Account Settings
    </router-link>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <a href="#" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click.prevent="signOut()">
      Sign Out
    </a>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { setAppLocale, type AppLocale } from "@/core/plugins/i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { badgeVariantClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  emits: ["close"],
  setup() {
    const router = useRouter();
    const { locale } = useI18n();
    const store = useAuthStore();

    const languageOptions: ReadonlyArray<{
      code: AppLocale;
      name: string;
      flag: string;
    }> = [
      {
        code: "en",
        name: "English",
        flag: getAssetPath("media/flags/united-states.svg"),
      },
      {
        code: "id",
        name: "Bahasa Indonesia",
        flag: getAssetPath("media/flags/indonesia.svg"),
      },
    ];

    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: AppLocale) => {
      setAppLocale(lang);
    };

    const currentLanguage = computed(() => {
      return locale.value as AppLocale;
    });

    const currentLanguageOption = computed(() => {
      return (
        languageOptions.find((option) => option.code === currentLanguage.value) ||
        languageOptions[0]
      );
    });

    return {
      signOut,
      setLang,
      currentLanguage,
      currentLanguageOption,
      languageOptions,
      badgeVariantClass,
      getAssetPath,
    };
  },
});
</script>
