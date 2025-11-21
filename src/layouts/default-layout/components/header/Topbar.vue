<template>
  <!--begin::VMS Control Panel-->
  <div class="d-flex align-items-center justify-content-between overflow-auto pt-3 pt-lg-0">
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
    <div class="d-flex align-items-center">
      <!--begin::Notifications-->
      <div class="d-flex align-items-center me-4">
        <div 
          class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px position-relative"
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          id="kt_menu_notifications"
        >
          <KTIcon icon-name="notification-bing" icon-class="fs-2" />
 
        </div>
        <NotificationsMenu />
      </div>
      <!--end::Notifications-->

      <!--begin::Theme mode-->
      <div class="d-flex align-items-center me-4">
        <div
          class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px"
          data-kt-menu-trigger="{default:'click', lg: 'hover'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          id="kt_menu_theme"
        >
          <KTIcon icon-name="night-day" icon-class="theme-light-show fs-2" />
          <KTIcon icon-name="moon" icon-class="theme-dark-show fs-2" />
        </div>
        <KTThemeModeSwitcher />
      </div>
      <!--end::Theme mode-->

  <!--begin::Language-->
  <LanguageSwitcher />
  <!--end::Language-->

      <!--begin::User Profile-->
      <div class="d-flex align-items-center">
        <div 
          class="cursor-pointer symbol symbol-35px symbol-md-40px"
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          id="kt_menu_user"
        >
          <img src="/media/avatars/300-1.jpg" alt="user" />
        </div>
        
        <!--begin::User account menu-->
        <div 
          class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px" 
          data-kt-menu="true"
        >
          <!--begin::Menu item-->
          <div class="menu-item px-3">
            <div class="menu-content d-flex align-items-center px-3">
              <!--begin::Avatar-->
              <div class="symbol symbol-50px me-5">
                <img alt="Avatar" src="/media/avatars/300-1.jpg" />
              </div>
              <!--end::Avatar-->
              
              <!--begin::Username-->
              <div class="d-flex flex-column">
                <div class="fw-bold d-flex align-items-center fs-5">
                  {{ userName }}
                </div>
                <span class="fw-semibold text-muted fs-7">{{ userRole }}</span>
              </div>
              <!--end::Username-->
            </div>
          </div>
          <!--end::Menu item-->
          
          <!--begin::Menu separator-->
          <div class="separator my-2"></div>
          <!--end::Menu separator-->
          
          <!--begin::Menu item-->
          <div class="menu-item px-5">
            <router-link to="/controlplane/account/overview" class="menu-link px-5">
              {{ t('profile') }}
            </router-link>
          </div>
          <!--end::Menu item-->
          
          <!--begin::Menu item-->
          <div class="menu-item px-5">
            <router-link to="/controlplane/account/settings" class="menu-link px-5">
              {{ t('account') }} {{ t('settings') }}
            </router-link>
          </div>
          <!--end::Menu item-->
          
          <!--begin::Menu separator-->
          <div class="separator my-2"></div>
          <!--end::Menu separator-->
          
          <!--begin::Menu item-->
          <div class="menu-item px-5">
            <a href="#" class="menu-link px-5" @click.prevent="logout">
              {{ t('signOut') }}
            </a>
          </div>
          <!--end::Menu item-->
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
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import KTThemeModeSwitcher from "@/layouts/default-layout/components/theme-mode/ThemeModeSwitcher.vue";
import NotificationsMenu from "@/layouts/default-layout/components/menus/NotificationsMenu.vue";
import LanguageSwitcher from "@/layouts/default-layout/components/header/LanguageSwitcher.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

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

    // Reactive data for VMS
    const currentTime = ref(new Date().toLocaleString());
    const alertCount = ref(3);
    const connectedCameras = ref(24);
    const totalCameras = ref(28);
    const recordingCount = ref(18);
    const storageUsed = ref(68);
    const systemUptime = ref('72h 15m');
    const userName = ref('User');
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
