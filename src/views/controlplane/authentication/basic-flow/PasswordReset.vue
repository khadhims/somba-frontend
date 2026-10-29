<template>
  <!--begin::Wrapper-->
  <div class="lg:w-[500px] p-10">
    <!--begin::Form-->
    <VForm
      class="password-reset-form w-full"
      @submit="onSubmitForgotPassword"
      id="kt_login_password_reset_form"
      :validation-schema="forgotPassword"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10 form-entrance">
        <!--begin::Title-->
        <h1 class="text-white mb-3">Forgot Password ?</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-lg font-semibold" style="color: rgba(255,255,255,0.75)">
          Enter your email to reset your password.
        </div>
        <!--end::Link-->
      </div>
      <!--begin::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="mb-2 block text-sm font-bold text-white">Email</label>
        <Field
          class="custom-input w-full"
          type="email"
          placeholder=""
          name="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="flex flex-wrap justify-center lg:pb-0">
        <button
          type="submit"
          id="kt_password_reset_submit"
          class="btn-neon mr-4 inline-flex items-center gap-2 rounded-[12px] px-5 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Submit</span>
          <span v-else class="inline-flex items-center gap-2">
            Please wait...
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          </span>
        </button>

        <router-link
          to="/sign-up"
          class="rounded-xl bg-primary-light px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >Cancel</router-link
        >
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { swalConfirmButtonClass, swalDangerButtonClass } from "@/core/helpers/badge";

export default defineComponent({
  name: "password-reset",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();

    const isSubmitting = ref(false);

    //Create form validation object
    const forgotPassword = Yup.object().shape({
      email: Yup.string().email().required().label("Email"),
    });

    //Form submit function
    const onSubmitForgotPassword = async (values: any) => {
      values = values as string;

      isSubmitting.value = true;

      // dummy delay
      // Send login request
      await store.forgotPassword(values);

      const error = Object.values(store.errors);

      if (!error) {
        Swal.fire({
          text: "You have successfully logged in!",
          icon: "success",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          heightAuto: false,
          customClass: {
            confirmButton: swalConfirmButtonClass,
          },
        });
      } else {
        Swal.fire({
          text: error[0] as string,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try again!",
          heightAuto: false,
          customClass: {
            confirmButton: swalDangerButtonClass,
          },
        });
      }

      isSubmitting.value = false;
    };

    return {
      onSubmitForgotPassword,
      forgotPassword,
      isSubmitting,
    };
  },
});
</script>

<style scoped>
/* Reuse SignIn/SignUp styles for consistency */
.custom-input {
  background: rgba(30, 33, 41, 0.6) !important;
  border: 1px solid var(--color-gray-700) !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 14px !important;
  font-size: 1rem !important;
  transition: all 0.25s ease !important;
}
.custom-input:focus {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 6px rgba(27, 132, 255, 0.08) !important;
  background: rgba(30, 33, 41, 0.9) !important;
}

.btn-neon {
  background: linear-gradient(90deg, var(--color-primary), var(--color-info));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 6px 22px rgba(27, 132, 255, 0.35);
}
.btn-neon:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(27, 132, 255, 0.5); }
.btn-neon::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
  transition: 0.6s;
}
.btn-neon:hover::after { left: 100%; }

.form-entrance { opacity: 0; transform: translateY(8px); animation: fadeSlideIn 0.9s ease-out forwards; }
@keyframes fadeSlideIn { to { opacity: 1; transform: translateY(0); } }
</style>
