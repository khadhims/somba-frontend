<template>
  <!--begin::Form-->
  <form
    class="mx-auto w-full max-w-[600px] pt-15 pb-10"
    novalidate
    id="kt_create_account_form"
    @submit="handleStep"
  >
    <CreateAccountStep1 :active="stepper.currentStepIndex.value === 0"></CreateAccountStep1>
    <CreateAccountStep2 :active="stepper.currentStepIndex.value === 1"></CreateAccountStep2>
    <CreateAccountStep3 :active="stepper.currentStepIndex.value === 2"></CreateAccountStep3>
    <CreateAccountStep4 :active="stepper.currentStepIndex.value === 3"></CreateAccountStep4>
    <CreateAccountStep5 :active="stepper.currentStepIndex.value === 4"></CreateAccountStep5>

    <!--begin::Actions-->
    <div class="flex items-center justify-between pt-15">
      <!--begin::Wrapper-->
      <div class="mr-2">
        <button
          type="button"
          class="mr-3 inline-flex items-center gap-1"
          :class="lightButtonClass"
          @click="previousStep"
        >
          <KTIcon icon-name="arrow-left" icon-class="fs-4 me-1" />
          Back
        </button>
      </div>
      <!--end::Wrapper-->

      <!--begin::Wrapper-->
      <div>
        <button
          type="button"
          class="mr-3 inline-flex items-center gap-1"
          :class="primaryButtonClass"
          v-if="stepper.isLastStep.value"
          @click="formSubmit()"
        >
          Submit
          <KTIcon icon-name="arrow-right" icon-class="fs-3 ms-2 me-0" />
        </button>

        <button v-else type="submit" class="inline-flex items-center gap-1" :class="primaryButtonClass">
          Continue
          <KTIcon icon-name="arrow-right" icon-class="fs-4 ms-2 me-0" />
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
// Note: the original "Please wait..." indicator-progress span was never
// actually toggled by anything (no matching setAttribute in the original
// script) - the submit button always showed "Submit". Preserved as-is
// rather than newly wiring a loading state.
import { useForm } from "vee-validate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import type {
  IStep1,
  IStep2,
  IStep3,
  IStep4,
  ICreateAccount,
} from "@/components/wizards/create-account-wizard/types";
import type { Stepper } from "@/composables/useStepper";
import { swalConfirmButtonClass, primaryButtonClass, lightButtonClass } from "@/core/helpers/badge";
import CreateAccountStep1 from "@/components/wizards/create-account-wizard/steps/CreateAccountStep1.vue";
import CreateAccountStep2 from "@/components/wizards/create-account-wizard/steps/CreateAccountStep2.vue";
import CreateAccountStep3 from "@/components/wizards/create-account-wizard/steps/CreateAccountStep3.vue";
import CreateAccountStep4 from "@/components/wizards/create-account-wizard/steps/CreateAccountStep4.vue";
import CreateAccountStep5 from "@/components/wizards/create-account-wizard/steps/CreateAccountStep5.vue";

interface Props {
  stepper: Stepper;
  closeHadler?: () => void | null;
}

const props = defineProps<Props>();

const formData = ref<ICreateAccount>({
  accountType: "personal",
  accountTeamSize: "50+",
  accountName: "",
  accountPlan: "1",
  businessName: "Keenthemes Inc.",
  businessDescriptor: "KEENTHEMES",
  businessType: "1",
  businessDescription: "",
  businessEmail: "corp@support.com",
  nameOnCard: "Max Doe",
  cardNumber: "4111 1111 1111 1111",
  cardExpiryMonth: "1",
  cardExpiryYear: "2",
  cardCvv: "123",
  saveCard: "1",
});

const formInitData = ref<ICreateAccount>(formData.value);

const createAccountSchema = [
  Yup.object({
    accountType: Yup.string().required().label("Account Type"),
  }),
  Yup.object({
    accountName: Yup.string().required().label("Account Name"),
  }),
  Yup.object({
    businessName: Yup.string().required().label("Business Name"),
    businessDescriptor: Yup.string().required().label("Shortened Descriptor"),
    businessType: Yup.string().required().label("Corporation Type"),
    businessEmail: Yup.string().required().label("Contact Email"),
  }),
  Yup.object({
    nameOnCard: Yup.string().required().label("Name On Card"),
    cardNumber: Yup.string().required().label("Card Number"),
    cardExpiryMonth: Yup.string().required().label("Expiration Month"),
    cardExpiryYear: Yup.string().required().label("Expiration Year"),
    cardCvv: Yup.string().required().label("CVV"),
  }),
];

// extracts the individual step schema
const currentSchema = computed(() => {
  return createAccountSchema[props.stepper.currentStepIndex.value];
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
