<template>
  <!-- ponytail: no live trigger anywhere in the app (its only opener,
  toolbar/Toolbar.vue, turned out to be dead/unimported code) - mounted
  by DefaultLayout but never shown, same as before this migration. -->
  <dialog
    ref="modalRef"
    id="kt_modal_create_app"
    class="w-full max-w-[900px] rounded-md bg-white p-0 text-gray-800 backdrop:bg-black/50 dark:bg-gray-900 dark:text-gray-100"
    @click.self="closeModal"
    @cancel="closeModal"
  >
    <!--begin::Modal header-->
    <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
      <!--begin::Modal title-->
      <h2 class="text-lg font-bold">Create App</h2>
      <!--end::Modal title-->

      <!--begin::Close-->
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-primary-light hover:text-primary"
        @click="closeModal"
      >
        <KTIcon icon-name="cross" icon-class="fs-1" />
      </button>
      <!--end::Close-->
    </div>
    <!--end::Modal header-->

    <!--begin::Modal body-->
    <div class="p-6 lg:p-10">
      <CreateAppWizardStepper
        :close-hadler="closeModal"
      ></CreateAppWizardStepper>
    </div>
    <!--end::Modal body-->
  </dialog>
</template>

<script setup lang="ts">
import CreateAppWizardStepper from "@/components/wizards/create-app-wizard/CreateAppWizardStepper.vue";
import { ref } from "vue";

const modalRef = ref<HTMLDialogElement | null>(null);

const closeModal = () => {
  modalRef.value?.close();
};
</script>
