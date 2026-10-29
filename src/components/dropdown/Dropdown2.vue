<template>
  <!--begin::Menu 2-->
  <div
    class="w-[200px] rounded-lg bg-white text-sm font-semibold text-gray-600 shadow-lg dark:bg-gray-900 dark:text-gray-300"
  >
    <!--begin::Menu item-->
    <div class="px-6 py-4 text-base font-bold text-gray-900 dark:text-gray-100">
      Quick Actions
    </div>
    <!--end::Menu item-->

    <div class="mb-3 border-t border-gray-200 dark:border-gray-700"></div>

    <!--begin::Menu item-->
    <a
      href="#"
      class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
    >
      New Ticket
    </a>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
    >
      New Customer
    </a>
    <!--end::Menu item-->

    <!--begin::Menu item with submenu-->
    <div class="group relative">
      <a
        href="#"
        class="flex items-center justify-between px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        @click.prevent
      >
        <span>New Group</span>
        <KTIcon icon-name="right" icon-class="fs-4 text-gray-400" />
      </a>

      <!--begin::Menu sub-->
      <div
        class="invisible absolute left-full top-0 z-10 w-[175px] rounded-lg bg-white py-4 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-gray-900"
      >
        <a
          href="#"
          class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click.prevent="$emit('close')"
        >
          Admin Group
        </a>
        <a
          href="#"
          class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click.prevent="$emit('close')"
        >
          Staff Group
        </a>
        <a
          href="#"
          class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click.prevent="$emit('close')"
        >
          Member Group
        </a>
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item with submenu-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
    >
      New Contact
    </a>
    <!--end::Menu item-->

    <div class="mt-3 border-t border-gray-200 dark:border-gray-700"></div>

    <!--begin::Menu item-->
    <div class="px-6 py-3">
      <a
        href="#"
        class="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active"
        @click.prevent="$emit('close')"
      >
        Generate Reports
      </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu 2-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "dropdown-2",
  components: {},
  emits: ["close"],
});
</script>
