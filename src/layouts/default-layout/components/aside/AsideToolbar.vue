<template>
  <!--begin::User-->
  <div class="flex items-center justify-center py-5 sm:justify-start">
    <!--begin::Symbol-->
    <div class="h-[50px] w-[50px] shrink-0">
      <img :src="getAssetPath('media/avatars/300-1.jpg?>')" alt="" class="h-full w-full rounded-full object-cover" />
    </div>
    <!--end::Symbol-->

    <!--begin::Wrapper-->
    <div class="ml-5 flex-1">
      <!--begin::Section-->
      <div class="flex">
        <!--begin::Info-->
        <div class="mr-2 flex-1">
          <!--begin::Username-->
          <a href="#" class="text-sm font-semibold text-white transition-colors hover:text-primary"
            >{{ fullName }}</a
          >
          <!--end::Username-->

          <!--begin::Description-->
          <div class="mb-2 flex items-center">
            <span class="mr-2 text-xs font-semibold text-gray-400">Free Plan</span>
            <span class="rounded px-2 py-0.5 text-xs font-semibold" :class="badgeVariantClass('warning')">Limited</span>
          </div>
          <!--end::Description-->
        </div>
        <!--end::Info-->

        <!--begin::User menu-->
        <div class="relative -mr-2" :ref="(el) => (userDropdown.containerRef.value = el as HTMLElement | null)">
          <!--begin::Action-->
          <button
            type="button"
            class="-mt-2 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-primary"
            @click="userDropdown.toggle"
          >
            <KTIcon icon-name="setting-2" icon-class="fs-1" />
          </button>

          <div v-show="userDropdown.isOpen.value" class="absolute left-0 top-full z-20 mt-2">
            <UserMenu @close="userDropdown.close" />
          </div>
          <!--end::Action-->
        </div>
        <!--end::User menu-->
      </div>
      <!--end::Section-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::User-->

  <!--begin::Aside search-->
  <div class="py-5">
    <AsideSearch />
  </div>
  <!--end::Aside search-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import UserMenu from "@/layouts/default-layout/components/menus/UserAccountMenu.vue";
import AsideSearch from "@/layouts/default-layout/components/aside/AsideSearch.vue";
import { useDropdown } from "@/composables/useDropdown";
import { badgeVariantClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "kt--aside-toolbar",
  components: {
    UserMenu,
    AsideSearch,
  },
  setup() {
    const authStore = useAuthStore();
    const userDropdown = useDropdown();

    const fullName = computed(() => {
      const user = authStore.user;
      if (user?.first_name || user?.last_name) {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim();
      }
      return 'User';
    });

    return {
      getAssetPath,
      fullName,
      userDropdown,
      badgeVariantClass,
    };
  },
});
</script>
