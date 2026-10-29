<template>
  <!--begin::Modal - Invite Friends-->
  <dialog
    ref="dialogRef"
    class="w-full max-w-[650px] rounded-xl bg-white p-0 text-gray-800 backdrop:bg-black/50 dark:bg-gray-900 dark:text-gray-100"
    @click.self="close"
    @cancel="close"
  >
    <!--begin::Modal header-->
    <div class="flex justify-end p-5 pb-0">
      <!--begin::Close-->
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
        @click="close"
      >
        <KTIcon icon-name="cross" icon-class="fs-1" />
      </button>
      <!--end::Close-->
    </div>
    <!--begin::Modal header-->

    <!--begin::Modal body-->
    <div class="mx-5 max-h-[70vh] overflow-y-auto px-2 pb-10 sm:mx-9">
      <!--begin::Heading-->
      <div class="mb-10 text-center">
        <!--begin::Title-->
        <h1 class="mb-3 text-2xl font-bold">Invite a Friend</h1>
        <!--end::Title-->

        <!--begin::Description-->
        <div class="text-lg font-semibold text-gray-500">
          If you need more info, please check out
          <a href="#" class="font-bold text-primary">FAQ Page</a>.
        </div>
        <!--end::Description-->
      </div>
      <!--end::Heading-->

      <!--begin::Google Contacts Invite-->
      <!-- ponytail: inert in the original (no click handler) - kept inert. -->
      <div
        class="mb-8 flex w-full items-center justify-center rounded-md bg-primary-light px-4 py-3 text-sm font-bold text-primary"
      >
        <img
          alt="Logo"
          :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
          class="mr-3 h-5"
        />
        Invite Gmail Contacts
      </div>
      <!--end::Google Contacts Invite-->

      <!--begin::Separator-->
      <div class="mb-8 flex items-center gap-4">
        <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
        <span class="text-xs font-semibold uppercase text-gray-400"
          >or</span
        >
        <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <!--end::Separator-->

      <!--begin::Textarea-->
      <textarea
        :class="formInputClass"
        class="mb-8"
        rows="3"
        placeholder="Type or paste emails here"
      ></textarea>
      <!--end::Textarea-->

      <!--begin::Users-->
      <div class="mb-10">
        <!--begin::Heading-->
        <div class="mb-2 text-sm font-semibold">Your Invitations</div>
        <!--end::Heading-->

        <!--begin::List-->
        <div class="max-h-[300px] overflow-y-auto pe-2">
          <div
            v-for="(user, index) in users"
            :key="index"
            class="flex items-center justify-between border-b border-dashed border-gray-300 py-4 dark:border-gray-700"
          >
            <!--begin::Details-->
            <div class="flex items-center">
              <!--begin::Avatar-->
              <img
                v-if="user.avatar"
                alt="Pic"
                :src="user.avatar"
                class="h-[45px] w-[45px] rounded-full"
              />
              <InitialAvatar
                v-else
                :name="user.name"
                :variant="user.state || 'primary'"
              />
              <!--end::Avatar-->

              <!--begin::Details-->
              <div class="ml-4">
                <a
                  href="#"
                  class="mb-1 block text-base font-bold text-gray-900 transition-colors hover:text-primary dark:text-gray-100"
                  >{{ user.name }}</a
                >

                <div class="font-semibold text-gray-500">
                  {{ user.email }}
                </div>
              </div>
              <!--end::Details-->
            </div>
            <!--end::Details-->

            <!--begin::Access menu-->
            <div class="ml-2 w-[100px]">
              <select v-model="user.access" :class="formInputClass" class="py-1 text-xs">
                <option value="1">Guest</option>
                <option value="2">Owner</option>
                <option value="3">Can Edit</option>
              </select>
            </div>
            <!--end::Access menu-->
          </div>
        </div>
        <!--end::List-->
      </div>
      <!--end::Users-->

      <!--begin::Notice-->
      <div class="flex items-center justify-between">
        <!--begin::Label-->
        <div class="mr-5 font-semibold">
          <label class="text-sm">Adding Users by Team Members</label>
          <div class="text-xs text-gray-500">
            If you need more info, please check budget planning
          </div>
        </div>
        <!--end::Label-->

        <!--begin::Switch-->
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked class="peer sr-only" />
          <span
            class="h-5 w-9 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-primary dark:bg-gray-700"
          ></span>
          <span class="text-sm font-semibold text-gray-500">Allowed</span>
        </label>
        <!--end::Switch-->
      </div>
      <!--end::Notice-->
    </div>
    <!--end::Modal body-->
  </dialog>
  <!--end::Modal - Invite Friend-->
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import { formInputClass, type BadgeVariant } from "@/core/helpers/badge";
import { useDrawersStore } from "@/stores/drawers";
import InitialAvatar from "@/components/common/InitialAvatar.vue";

interface InviteUser {
  avatar?: string;
  state?: BadgeVariant;
  name: string;
  email: string;
  access: string;
}

const drawers = useDrawersStore();
const dialogRef = ref<HTMLDialogElement | null>(null);

const close = () => {
  drawers.inviteFriendsOpen = false;
};

// Native <dialog> already blocks backdrop-click-to-close by default (no
// separate handling needed) - watch the shared store instead of exposing
// showModal(), since the only trigger lives in a different component
// (MessengerDrawer's Dropdown4) than this modal (mounted by DefaultLayout).
watch(
  () => drawers.inviteFriendsOpen,
  (open) => {
    if (open) {
      dialogRef.value?.showModal();
    } else {
      dialogRef.value?.close();
    }
  }
);

// ponytail: 2 of the original entries had `state: getAssetPath(...)`
// instead of `avatar: getAssetPath(...)` (copy-paste typo - the value is
// unmistakably an avatar path, matching every sibling `avatar:` entry).
// Fixed here rather than preserved, since typing `state` as BadgeVariant
// makes the typo a type error, and the fix is the obvious original intent.
const users: InviteUser[] = [
  {
    avatar: getAssetPath("media/avatars/300-6.jpg"),
    name: "Emma Smith",
    email: "e.smith@kpmg.com.au",
    access: "1",
  },
  {
    state: "danger",
    name: "Melody Macy",
    email: "melody@altbox.com",
    access: "1",
  },
  {
    avatar: getAssetPath("media/avatars/300-1.jpg"),
    name: "Max Smith",
    email: "max@kt.com",
    access: "3",
  },
  {
    avatar: getAssetPath("media/avatars/300-1.jpg"),
    name: "Sean Bean",
    email: "sean@dellito.com",
    access: "2",
  },
  {
    avatar: getAssetPath("media/avatars/300-25.jpg"),
    name: "Brian Cox",
    email: "brian@exchange.com",
    access: "3",
  },
  {
    state: "warning",
    name: "Mikaela Collins",
    email: "mikaela@pexcom.com",
    access: "2",
  },
  {
    avatar: getAssetPath("media/avatars/300-9.jpg"),
    name: "Francis Mitcham",
    email: "f.mitcham@kpmg.com.au",
    access: "3",
  },
  {
    state: "danger",
    name: "Olivia Wild",
    email: "olivia@corpmail.com",
    access: "2",
  },
  {
    state: "info",
    name: "Neil Owen",
    email: "owen.neil@gmail.com",
    access: "1",
  },
  {
    avatar: getAssetPath("media/avatars/300-23.jpg"),
    name: "Dan Wilson",
    email: "dam@consilting.com",
    access: "3",
  },
  {
    state: "danger",
    name: "Emma Bold",
    email: "emma@intenso.com",
    access: "2",
  },
  {
    avatar: getAssetPath("media/avatars/300-12.jpg"),
    name: "Ana Crown",
    email: "ana.cf@limtel.com",
    access: "1",
  },
  {
    state: "primary",
    name: "Robert Doe",
    email: "robert@benko.com",
    access: "3",
  },
  {
    avatar: getAssetPath("media/avatars/300-13.jpg"),
    name: "John Miller",
    email: "miller@mapple.com",
    access: "3",
  },
  {
    state: "success",
    name: "Lucy Kunic",
    email: "lucy.m@fentech.com",
    access: "2",
  },
  {
    avatar: getAssetPath("media/avatars/300-21.jpg"),
    name: "Ethan Wilder",
    email: "ethan@loop.com.au",
    access: "1",
  },
  {
    avatar: getAssetPath("media/avatars/300-12.jpg"),
    name: "Ana Crown",
    email: "ana.cf@limtel.com",
    access: "3",
  },
];
</script>
