<template>
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
import { ref, watch } from "vue";
import { useDrawersStore } from "@/stores/drawers";

const modalRef = ref<HTMLDialogElement | null>(null);
const drawers = useDrawersStore();

const closeModal = () => {
  drawers.createAppOpen = false;
};

// Its only live trigger ("Get Started" in widgets/engage/Widget1.vue) is a
// different component than this modal (mounted by DefaultLayout) - same
// cross-component-open shape as InviteFriendsModal.vue.
watch(
  () => drawers.createAppOpen,
  (open) => {
    if (open) {
      modalRef.value?.showModal();
    } else {
      modalRef.value?.close();
    }
  }
);
</script>
