<template>
  <!--begin::Stepper-->
  <div
    class="flex flex-col flex-1 xl:flex-row"
    id="kt_modal_create_app_stepper"
  >
    <!--begin::Aside-->
    <div class="flex w-full flex-none justify-center xl:w-[300px] xl:justify-start">
      <!--begin::Nav-->
      <div class="lg:pl-10">
        <!--begin::Step-->
        <div v-for="(step, index) in steps" :key="step.title" class="relative pb-10 last:pb-0">
          <div class="flex items-center">
            <!--begin::Icon-->
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold transition-colors"
              :class="stepper.stepState(index) === 'current'
                ? 'bg-primary text-white'
                : stepper.stepState(index) === 'completed'
                  ? 'bg-success text-white'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800'"
            >
              <KTIcon v-if="stepper.stepState(index) === 'completed'" icon-name="check" icon-class="fs-4" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <!--end::Icon-->

            <!--begin::Label-->
            <div class="ml-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ step.title }}</h3>
              <div class="text-xs text-gray-500">{{ step.desc }}</div>
            </div>
            <!--end::Label-->
          </div>

          <!--begin::Line-->
          <div
            v-if="index < steps.length - 1"
            class="absolute left-5 top-10 h-10 w-px -translate-x-1/2 transition-colors"
            :class="stepper.stepState(index) === 'completed' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'"
          ></div>
          <!--end::Line-->
        </div>
        <!--end::Step-->
      </div>
      <!--end::Nav-->
    </div>
    <!--begin::Aside-->

    <!--begin::Content-->
    <div class="flex-1 py-5 lg:px-15">
      <!--begin::Form-->
      <CreateAppModalForm
        :stepper="stepper"
        :close-hadler="props.closeHadler"
      />
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Stepper-->
</template>

<script setup lang="ts">
import { useStepper } from "@/composables/useStepper";
import CreateAppModalForm from "@/components/wizards/create-app-wizard/CreateAppWizardForm.vue";

interface Props {
  closeHadler?: () => void;
}

const props = defineProps<Props>();

const steps = [
  { title: "Details", desc: "Name your App" },
  { title: "Frameworks", desc: "Define your app framework" },
  { title: "Database", desc: "Select the app database type" },
  { title: "Billing", desc: "Provide payment details" },
  { title: "Release", desc: "Review and Submit" },
];

const stepper = useStepper(steps.length);
</script>
