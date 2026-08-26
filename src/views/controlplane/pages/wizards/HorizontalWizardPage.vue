<template>
  <!--begin::Card-->
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <!--begin::Card body-->
    <div class="p-6">
      <CreateAccountHorizontalWizardStepper></CreateAccountHorizontalWizardStepper>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script setup lang="ts">
import CreateAccountHorizontalWizardStepper from "@/components/wizards/create-account-wizard/CreateAccountHorizontalWizardStepper.vue";
</script>
