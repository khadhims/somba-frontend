<template>
  <!--begin::User-->
  <div
    class="aside-user d-flex align-items-sm-center justify-content-center py-5"
  >
    <!--begin::Symbol-->
    <div class="symbol symbol-50px">
      <img :src="getAssetPath('media/avatars/300-1.jpg')" alt="" />
    </div>
    <!--end::Symbol-->

    <!--begin::Wrapper-->
    <div class="aside-user-info flex-row-fluid flex-wrap ms-5">
      <!--begin::Section-->
      <div class="d-flex">
        <!--begin::Info-->
        <div class="flex-grow-1 me-2">
          <!--begin::Username-->
          <a href="#" class="text-white text-hover-primary fs-6 fw-semibold">{{
            fullName
          }}</a>
          <!--end::Username-->

          <!--begin::Description-->
          <div class="d-flex align-items-center mb-2">
            <span class="text-gray-600 fw-semibold fs-8 me-2">Free Plan</span>
            <span class="badge badge-light-warning badge-sm">Limited</span>
          </div>
          <!--end::Description-->
        </div>
        <!--end::Info-->

        <!--begin::User menu-->
        <div class="me-n2">
          <!--begin::Action-->
          <a
            href="#"
            class="btn btn-icon btn-sm btn-active-color-primary mt-n2"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-start"
            data-kt-menu-overflow="true"
          >
            <KTIcon icon-name="setting-2" icon-class="text-muted fs-1" />
          </a>

          <UserMenu />
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
  <div class="aside-search py-5">
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

export default defineComponent({
  name: "kt--aside-toolbar",
  components: {
    UserMenu,
    AsideSearch,
  },
  setup() {
    const authStore = useAuthStore();

    const fullName = computed(() => {
      const user = authStore.user;
      if (user?.first_name || user?.last_name) {
        return `${user.first_name || ""} ${user.last_name || ""}`.trim();
      }
      return "User";
    });

    return {
      getAssetPath,
      fullName,
    };
  },
});
</script>
