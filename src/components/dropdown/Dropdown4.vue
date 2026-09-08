<template>
  <!--begin::Menu-->
  <div
    class="w-[200px] rounded-lg bg-white py-3 text-sm font-semibold text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-100"
  >
    <!--begin::Heading-->
    <div class="px-3 pb-2 text-xs uppercase text-gray-400">Contacts</div>
    <!--end::Heading-->

    <!--begin::Menu item-->
    <!-- ponytail: original "Add Contact" targeted a modal id
    (#kt_modal_users_search) with no matching modal anywhere in the app -
    already a dead link before this migration, left inert. -->
    <a
      href="#"
      class="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('close')"
    >
      Add Contact
    </a>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click.prevent="$emit('invite-contacts')"
    >
      Invite Contacts

      <i
        class="fas fa-exclamation-circle ms-2 text-xs"
        title="Specify a contact email to send an invitation"
      ></i>
    </a>
    <!--end::Menu item-->

    <!--begin::Menu item with submenu-->
    <div class="group relative">
      <a
        href="#"
        class="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        @click.prevent
      >
        <span>Groups</span>
        <KTIcon icon-name="right" icon-class="fs-4 text-gray-400" />
      </a>

      <!--begin::Menu sub-->
      <div
        class="invisible absolute left-full top-0 z-10 w-[175px] rounded-lg bg-white py-4 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-gray-900"
      >
        <a
          href="#"
          class="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Coming soon"
          @click.prevent
          >Create Group</a
        >
        <a
          href="#"
          class="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Coming soon"
          @click.prevent
          >Invite Members</a
        >
        <a
          href="#"
          class="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Coming soon"
          @click.prevent
          >Settings</a
        >
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item with submenu-->

    <!--begin::Menu item-->
    <a
      href="#"
      class="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      title="Coming soon"
      @click.prevent
    >
      Settings
    </a>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "dropdown-4",
  emits: ["close", "invite-contacts"],
});
</script>
