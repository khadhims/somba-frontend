<template>
  <!--begin::Form-->
  <form id="kt_create_app_form" @submit="handleStep">
    <CreateAppStep1
      :active="stepper.currentStepIndex.value === 0"
    ></CreateAppStep1>
    <CreateAppStep2
      :active="stepper.currentStepIndex.value === 1"
    ></CreateAppStep2>
    <CreateAppStep3
      :active="stepper.currentStepIndex.value === 2"
    ></CreateAppStep3>
    <CreateAppStep4
      :active="stepper.currentStepIndex.value === 3"
    ></CreateAppStep4>
    <CreateAppStep5
      :active="stepper.currentStepIndex.value === 4"
    ></CreateAppStep5>

    <!--begin::Actions-->
    <div class="flex items-center justify-between pt-10">
      <!--begin::Wrapper-->
      <div class="mr-2">
        <button
          type="button"
          class="mr-3 inline-flex items-center gap-1"
          :class="lightButtonClass"
          @click="previousStep()"
        >
          <KTIcon icon-name="arrow-left" icon-class="fs-3 me-1" />
          Back
        </button>
      </div>
      <!--end::Wrapper-->

      <!--begin::Wrapper-->
      <div>
        <button
          type="submit"
          class="inline-flex items-center gap-1"
          :class="primaryButtonClass"
          v-if="stepper.isLastStep.value"
          @click="formSubmit()"
        >
          Submit
          <KTIcon icon-name="arrow-right" icon-class="fs-3 ms-2 me-0" />
        </button>

        <button
          v-else
          type="submit"
          class="inline-flex items-center gap-1"
          :class="primaryButtonClass"
        >
          Continue
          <KTIcon icon-name="arrow-right" icon-class="fs-3 ms-1 me-0" />
        </button>
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Actions-->
  </form>
  <!--end::Form-->
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import Swal from "sweetalert2/dist/sweetalert2.js";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import type {
  ICreateApp,
  IStep1,
  IStep2,
  IStep3,
  IStep4,
} from "@/components/wizards/create-app-wizard/types";
import type { Stepper } from "@/composables/useStepper";
import {
  swalConfirmButtonClass,
  primaryButtonClass,
  lightButtonClass,
} from "@/core/helpers/badge";
import CreateAppStep1 from "@/components/wizards/create-app-wizard/steps/CreateAppStep1.vue";
import CreateAppStep2 from "@/components/wizards/create-app-wizard/steps/CreateAppStep2.vue";
import CreateAppStep3 from "@/components/wizards/create-app-wizard/steps/CreateAppStep3.vue";
import CreateAppStep4 from "@/components/wizards/create-app-wizard/steps/CreateAppStep4.vue";
import CreateAppStep5 from "@/components/wizards/create-app-wizard/steps/CreateAppStep5.vue";

interface Props {
  stepper: Stepper;
  closeHadler?: () => void;
}

const props = defineProps<Props>();

const formData = ref<ICreateApp>({
  appName: "",
  category: "1",
  framework: "1",
  dbName: "",
  dbType: "1",
  nameOnCard: "Max Doe",
  cardNumber: "4111 1111 1111 1111",
  cardExpiryMonth: "1",
  cardExpiryYear: "2",
  cardCvv: "123",
  saveCard: "1",
});

const formInitData = ref<ICreateApp>(formData.value);

const createAppSchema = [
  Yup.object({
    appName: Yup.string().required().label("App name"),
    category: Yup.string().required().label("Category"),
  }),
  Yup.object({
    framework: Yup.string().required().label("Framework"),
  }),
  Yup.object({
    dbName: Yup.string().required().label("Database name"),
    dbType: Yup.string().required().label("Database engine"),
  }),
  Yup.object({
    nameOnCard: Yup.string().required().label("Name"),
    cardNumber: Yup.string().required().label("Card Number"),
    cardExpiryMonth: Yup.string().required().label("Expiration Month"),
    cardExpiryYear: Yup.string().required().label("Expiration Year"),
    cardCvv: Yup.string().required().label("CVV"),
  }),
];

// extracts the individual step schema
const currentSchema = computed(() => {
  return createAppSchema[props.stepper.currentStepIndex.value];
});

const { resetForm, handleSubmit } = useForm<IStep1 | IStep2 | IStep3 | IStep4>({
  validationSchema: currentSchema,
  initialValues: formData.value,
});

const previousStep = () => {
  props.stepper.goPrev();
};

const handleStep = handleSubmit((values) => {
  console.log(values);

  formData.value = {
    ...formData.value,
    ...values,
  };

  resetForm({
    values: {
      ...formData.value,
    },
  });

  props.stepper.goNext();
});

const formSubmit = () => {
  Swal.fire({
    text: "All is cool! Now you submit this form",
    icon: "success",
    buttonsStyling: false,
    confirmButtonText: "Ok, got it!",
    heightAuto: false,
    customClass: {
      confirmButton: swalConfirmButtonClass,
    },
  }).then(() => {
    props.stepper.goFirst();

    resetForm({
      values: {
        ...formInitData.value,
      },
    });

    if (props.closeHadler) {
      props.closeHadler();
    }
  });
};
</script>
