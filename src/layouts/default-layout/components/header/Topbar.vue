<template>
  <!--begin::VMS Control Panel-->
  <div class="flex items-center justify-between overflow-auto pt-3 lg:pt-0">
    <!--begin::System Status-->
    <!-- <div class="d-flex align-items-center">
      <div class="d-flex align-items-center me-5">
        <div class="symbol symbol-30px me-3">
          <KTIcon icon-name="video" icon-class="fs-2 text-success" />
        </div>
        <div class="d-flex flex-column">
          <span class="fs-8 text-gray-500 fw-semibold">Cameras</span>
          <span class="fs-6 fw-bold text-success">{{ connectedCameras }}/{{ totalCameras }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center me-5">
        <div class="symbol symbol-30px me-3">
          <KTIcon icon-name="record-circle" icon-class="fs-2 text-danger" />
        </div>
        <div class="d-flex flex-column">
          <span class="fs-8 text-gray-500 fw-semibold">Recording</span>
          <span class="fs-6 fw-bold text-gray-900">{{ recordingCount }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center me-5">
        <div class="symbol symbol-30px me-3">
          <KTIcon icon-name="folder" icon-class="fs-2" :class="getStorageColor()" />
        </div>
        <div class="d-flex flex-column">
          <span class="fs-8 text-gray-500 fw-semibold">Storage</span>
          <span class="fs-6 fw-bold text-gray-900">{{ storageUsed }}%</span>
        </div>
      </div>

      <div class="separator-vertical h-30px mx-4"></div>
    </div> -->
    <!--end::System Status-->

    <!--begin::Real-time Info-->
    <!-- <div class="d-flex align-items-center flex-fill">
      <div class="d-flex align-items-center me-6">
        <div class="symbol symbol-30px me-3">
          <KTIcon icon-name="time" icon-class="fs-2 text-primary" />
        </div>
        <div class="d-flex flex-column">
          <span class="fs-8 text-gray-500 fw-semibold">Current Time</span>
          <span class="fs-6 fw-bold text-gray-900">{{ currentTime }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center me-6 d-none d-xl-flex">
        <div class="symbol symbol-30px me-3">
          <KTIcon icon-name="chart-line-up" icon-class="fs-2 text-info" />
        </div>
        <div class="d-flex flex-column">
          <span class="fs-8 text-gray-500 fw-semibold">Uptime</span>
          <span class="fs-6 fw-bold text-gray-900">{{ systemUptime }}</span>
        </div>
      </div>
    </div> -->
    <!--end::Real-time Info-->

    <!--begin::Actions-->
    <div class="flex items-center">
      <!--begin::Notifications-->
      <div class="relative mr-4 flex items-center" :ref="(el) => (notificationsDropdown.containerRef.value = el as HTMLElement | null)">
        <button
          type="button"
          class="flex h-[35px] w-[35px] items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
          @click="notificationsDropdown.toggle"
        >
          <KTIcon icon-name="notification-bing" icon-class="fs-2" />
        </button>
        <div v-show="notificationsDropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
          <NotificationsMenu />
        </div>
      </div>
      <!--end::Notifications-->

      <!--begin::Theme mode-->
      <div class="relative mr-4 flex items-center" :ref="(el) => (themeDropdown.containerRef.value = el as HTMLElement | null)">
        <button
          type="button"
          class="flex h-[35px] w-[35px] items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
          @click="themeDropdown.toggle"
        >
          <KTIcon icon-name="night-day" icon-class="theme-light-show fs-2" />
          <KTIcon icon-name="moon" icon-class="theme-dark-show fs-2" />
        </button>
        <div v-show="themeDropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
          <KTThemeModeSwitcher @close="themeDropdown.close" />
        </div>
      </div>
      <!--end::Theme mode-->

      <!--begin::Language-->
      <LanguageSwitcher />
      <!--end::Language-->

      <!--begin::User Profile-->
      <div class="relative flex items-center" :ref="(el) => (userDropdown.containerRef.value = el as HTMLElement | null)">
        <div
          class="h-[35px] w-[35px] cursor-pointer overflow-hidden rounded-full md:h-10 md:w-10"
          @click="userDropdown.toggle"
        >
          <img src="/media/avatars/300-1.jpg" alt="user" class="h-full w-full object-cover" />
        </div>

        <!--begin::User account menu-->
        <div v-show="userDropdown.isOpen.value" class="absolute right-0 top-full z-20 mt-2">
          <div class="w-[275px] rounded-md bg-white py-4 text-sm font-semibold text-gray-600 shadow-lg dark:bg-gray-900 dark:text-gray-300">
            <!--begin::Menu item-->
            <div class="flex items-center px-6 py-2">
              <!--begin::Avatar-->
              <div class="mr-5 h-[50px] w-[50px] shrink-0">
                <img alt="Avatar" src="/media/avatars/300-1.jpg" class="h-full w-full rounded-full object-cover" />
              </div>
              <!--end::Avatar-->

              <!--begin::Username-->
              <div class="flex flex-col">
                <div class="flex items-center text-base font-bold text-gray-900 dark:text-gray-100">
                  {{ userName }}
                </div>
                <span class="text-xs font-semibold text-gray-500">{{ userRole }}</span>
              </div>
              <!--end::Username-->
            </div>
            <!--end::Menu item-->

            <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

            <!--begin::Menu item-->
            <router-link to="/controlplane/account/overview" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="userDropdown.close">
              {{ t('profile') }}
            </router-link>
            <!--end::Menu item-->

            <!--begin::Menu item-->
            <router-link to="/controlplane/account/settings" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="userDropdown.close">
              {{ t('account') }} {{ t('settings') }}
            </router-link>
            <!--end::Menu item-->

            <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

            <!--begin::Menu item-->
            <a href="#" class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click.prevent="logout">
              {{ t('signOut') }}
            </a>
            <!--end::Menu item-->
          </div>
        </div>
        <!--end::User account menu-->
      </div>
      <!--end::User Profile-->
    </div>
    <!--end::Actions-->
  </div>
  <!--end::VMS Control Panel-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted, onUnmounted, ref, computed } from "vue";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";
import NotificationsMenu from "@/layouts/default-layout/components/menus/NotificationsMenu.vue";
import LanguageSwitcher from "@/layouts/default-layout/components/header/LanguageSwitcher.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { useDropdown } from "@/composables/useDropdown";

export default defineComponent({
  name: "layout-topbar",
  components: {
    KTThemeModeSwitcher,
    NotificationsMenu,
    LanguageSwitcher,
  },
  setup() {
    const { t } = useI18n();
    const authStore = useAuthStore();
    const router = useRouter();
    const notificationsDropdown = useDropdown();
    const themeDropdown = useDropdown();
    const userDropdown = useDropdown();

    // Reactive data for VMS
    const currentTime = ref(new Date().toLocaleString());
    const alertCount = ref(3);
    const connectedCameras = ref(24);
    const totalCameras = ref(28);
    const recordingCount = ref(18);
    const storageUsed = ref(68);
    const systemUptime = ref('72h 15m');
    const userName = computed(() => {
      const user = authStore.user;
      if (user?.first_name || user?.last_name) {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim();
      }
      return 'User';
    });
    const userRole = ref('Administrator');

    // Timer for real-time updates
    let timeInterval: number;

    // Methods
    const updateTime = () => {
      currentTime.value = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    };

    const getStorageColor = () => {
      if (storageUsed.value >= 90) return 'text-danger';
      if (storageUsed.value >= 75) return 'text-warning';
      return 'text-success';
    };

    const logout = async () => {
      try {
        if (confirm(t('signOutConfirm') as string)) {
          // Clear authentication state
          await authStore.logout();
          
          // Redirect to sign-in page
          router.push({ name: 'sign-in' });
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: force logout
        localStorage.clear();
        sessionStorage.clear();
        router.push({ name: 'sign-in' });
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      // Update time every second
      timeInterval = setInterval(updateTime, 1000);
      updateTime(); // Initial call
      
      // In real implementation, you would:
      // - Connect to WebSocket for real-time updates
      // - Fetch initial system status from API
      // - Subscribe to camera status updates
      // - Subscribe to alert notifications
    });

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
      // Cleanup WebSocket connections
    });

    return {
      getAssetPath,
      t,
      notificationsDropdown,
      themeDropdown,
      userDropdown,
      currentTime,
      alertCount,
      connectedCameras,
      totalCameras,
      recordingCount,
      storageUsed,
      systemUptime,
      userName,
      userRole,
      getStorageColor,
      logout,
    };
  },
});
</script>
