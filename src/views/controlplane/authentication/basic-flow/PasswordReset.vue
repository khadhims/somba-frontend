<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
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
        <div class="fw-semibold fs-4" style="color: rgba(255,255,255,0.75)">
          Enter your email to reset your password.
        </div>
        <!--end::Link-->
      </div>
      <!--begin::Heading-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-label fw-bold text-white fs-6">Email</label>
        <Field
          class="form-control custom-input"
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
      <div class="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          ref="submitButton"
          id="kt_password_reset_submit"
          class="btn btn-neon btn-lg me-4"
        >
          <span class="indicator-label"> Submit </span>
          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <router-link to="/sign-up" class="btn btn-lg btn-light-primary fw-bold"
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

export default defineComponent({
  name: "password-reset",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();

    const submitButton = ref<HTMLButtonElement | null>(null);

    //Create form validation object
    const forgotPassword = Yup.object().shape({
      email: Yup.string().email().required().label("Email"),
    });

    //Form submit function
    const onSubmitForgotPassword = async (values: any) => {
      values = values as string;

      // eslint-disable-next-line
      submitButton.value!.disabled = true;
      // Activate loading indicator
      submitButton.value?.setAttribute("data-kt-indicator", "on");

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
            confirmButton: "btn fw-semibold btn-light-primary",
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
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
      }

      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
        submitButton.value!.disabled = false;
    };

    return {
      onSubmitForgotPassword,
      forgotPassword,
      submitButton,
    };
  },
});
</script>

<style scoped>
/* Reuse SignIn/SignUp styles for consistency */
.custom-input {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid #334155 !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 14px !important;
  font-size: 1rem !important;
  transition: all 0.25s ease !important;
}
.custom-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 6px rgba(59,130,246,0.08) !important;
  background: rgba(15, 23, 42, 0.9) !important;
}

.btn-neon {
  background: linear-gradient(90deg, #2563eb, #4f46e5);
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
  box-shadow: 0 6px 22px rgba(37, 99, 235, 0.35);
}
.btn-neon:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(37,99,235,0.5); }
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

/* Ensure links and helper text are readable */
.text-gray-500, .fw-semibold { color: rgba(255,255,255,0.75) !important; }

</style>
