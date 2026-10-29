<template>
  <!--begin::Stepper-->
  <div class="flex flex-col" id="kt_create_account_stepper">
    <!--begin::Nav-->
    <div
      class="flex gap-8 border-b border-gray-200 py-5 mt-5 dark:border-gray-700"
    >
      <!--begin::Step-->
      <div v-for="(title, index) in stepTitles" :key="title" class="pb-3">
        <h3
          class="border-b-2 pb-3 text-sm font-semibold transition-colors"
          :class="
            stepper.stepState(index) === 'current'
              ? 'border-primary text-gray-900 dark:text-gray-100'
              : stepper.stepState(index) === 'completed'
              ? 'border-transparent text-primary'
              : 'border-transparent text-gray-400'
          "
        >
          {{ title }}
        </h3>
      </div>
      <!--end::Step-->
    </div>
    <!--end::Nav-->

    <CreateAccountWizardForm
      :stepper="stepper"
      :close-hadler="props.closeHadler"
    />
  </div>
  <!--end::Stepper-->
</template>

<script setup lang="ts">
import { useStepper } from "@/composables/useStepper";
import CreateAccountWizardForm from "@/components/wizards/create-account-wizard/CreateAccountWizardForm.vue";

interface Props {
  closeHadler?: () => void;
}

const props = defineProps<Props>();

const stepTitles = [
  "Account Type",
  "Account Info",
  "Business Info",
  "Billing Details",
  "Completed",
];

const stepper = useStepper(stepTitles.length);
</script>
