<template>
  <!--begin::Menu-->
  <div
    class="w-[250px] rounded-md bg-white py-4 text-sm font-semibold text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100"
  >
    <!--begin::Menu item-->
    <div class="px-5 pb-2 text-xs uppercase text-gray-400">Payments</div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="block px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
    >
      Create invoice
    </a>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="flex items-center px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
    >
      Create payments

      <i
        class="fas fa-exclamation-circle ms-2 text-xs"
        title="Specify a target name for future usage and reference"
      ></i>
    </a>
    <!--end::Menu item-->

    <!--begin::Menu item with submenu-->
    <div class="group relative">
      <a
        href="#"
        class="flex items-center justify-between px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        @click.prevent
      >
        <span>Subscription</span>
        <KTIcon icon-name="right" icon-class="fs-4 text-gray-400" />
      </a>

      <!--begin::Menu sub-->
      <div
        class="invisible absolute left-full top-0 z-10 w-[175px] rounded-md bg-white py-4 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-gray-900"
      >
        <a
          href="#"
          class="block px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click.prevent="$emit('close')"
          >Apps</a
        >
        <a
          href="#"
          class="block px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click.prevent="$emit('close')"
          >Billing</a
        >
        <a
          href="#"
          class="block px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click.prevent="$emit('close')"
          >Statements</a
        >

        <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>

        <div class="px-5">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked
              class="peer sr-only"
              id="kt_user_menu_notifications"
            />
            <span
              class="h-5 w-9 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary dark:bg-gray-700"
            ></span>
            <span class="text-sm text-gray-500 dark:text-gray-400"
              >Notifications</span
            >
          </label>
        </div>
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item with submenu-->

    <div class="my-3 border-t border-gray-200 dark:border-gray-700"></div>

    <!--begin::Menu item-->
    <div class="px-5 pb-2 text-xs uppercase text-gray-400">Account</div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="block px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
      >Reports</a
    >
    <a
      href="#"
      class="block px-5 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
      >Account Settings</a
    >
    <a
      href="#"
      class="block px-5 py-2 text-danger hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
      >Delete customer</a
    >
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "dropdown-3",
  emits: ["close"],
});
</script>
