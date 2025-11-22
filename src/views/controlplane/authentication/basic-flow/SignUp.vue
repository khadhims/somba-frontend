<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10" ref="signupWrapper">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      novalidate
      @submit="onSubmitRegister"
      id="kt_login_signup_form"
      :validation-schema="registration"
    >
      <!--begin::Heading-->
      <div class="mb-10 text-center form-entrance">
        <!--begin::Title-->
        <h1 class="text-white mb-3">Create an Account</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="fw-semibold fs-4" style="color: rgba(255,255,255,0.75)">
          Already have an account?

          <router-link to="/sign-in" class="link-primary fw-bold">
            Sign in here
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--end::Heading-->

      <!--begin::Action-->
      <button type="button" class="btn btn-light-primary fw-bold w-100 mb-10">
        <img
          alt="Logo"
          :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
          class="h-20px me-3"
        />
        Sign in with Google
      </button>
      <!--end::Action-->

      <!--begin::Separator-->
      <div class="d-flex align-items-center mb-10">
        <div class="border-bottom border-gray-300 mw-50 w-100"></div>
        <span class="fw-semobold text-gray-500 fs-7 mx-2">OR</span>
        <div class="border-bottom border-gray-300 mw-50 w-100"></div>
      </div>
      <!--end::Separator-->

      <!--begin::Input group-->
      <div class="row fv-row mb-7">
        <!--begin::Col-->
        <div class="col-xl-6">
          <label class="form-label fw-bold text-white fs-6">First Name</label>
          <Field
            class="form-control form-control-lg custom-input"
            type="text"
            placeholder=""
            name="first_name"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="first_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-xl-6">
          <label class="form-label fw-bold text-white fs-6">Last Name</label>
          <Field
            class="form-control form-control-lg custom-input"
            type="text"
            placeholder=""
            name="last_name"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="last_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-7">
        <label class="form-label fw-bold text-white fs-6">Email</label>
        <Field
          class="form-control form-control-lg custom-input"
          type="email"
          placeholder=""
          name="email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
            <div v-if="serverError" class="text-danger mt-1">
              {{ serverError }}
            </div>
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10 fv-row" data-kt-password-meter="true">
        <!--begin::Wrapper-->
        <div class="mb-1">
          <!--begin::Label-->
          <label class="form-label fw-bold text-white fs-6">Password</label>
          <!--end::Label-->

          <!--begin::Input wrapper-->
          <div class="position-relative mb-3">
            <Field
              class="form-control form-control-lg custom-input"
              type="password"
              placeholder=""
              name="password"
              autocomplete="off"
            />
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>
          <!--end::Input wrapper-->
          <!--begin::Meter-->
          <div
            class="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
            ></div>
            <div
              class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"
            ></div>
          </div>
          <!--end::Meter-->
        </div>
        <!--end::Wrapper-->
        <!--begin::Hint-->
        <div class="text-muted">
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
        <!--end::Hint-->
      </div>
      <!--end::Input group--->

      <!--begin::Input group-->
      <div class="fv-row mb-5">
        <label class="form-label fw-bold text-white fs-6">Confirm Password</label>
        <Field
          class="form-control form-control-lg custom-input"
          type="password"
          placeholder=""
          name="password_confirmation"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <label class="form-check form-check-custom form-check-solid">
          <Field
            class="form-check-input"
            type="checkbox"
            name="toc"
            value="1"
          />
          <span class="form-check-label fw-semibold text-white fs-6">
            I Agree &
            <a href="#" class="ms-1 link-primary">Terms and conditions</a>.
          </span>
        </label>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <button
          id="kt_sign_up_submit"
          ref="submitButton"
          type="submit"
          class="btn btn-neon btn-lg w-100"
        >
          <span class="indicator-label"> Submit </span>
          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, nextTick, onMounted, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import { PasswordMeterComponent } from "@/assets/ts/components";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "sign-up",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();

    const serverError = ref("");

    const submitButton = ref<HTMLButtonElement | null>(null);

    const registration = Yup.object().shape({
      first_name: Yup.string().required().label("Name"),
      last_name: Yup.string().required().label("Surname"),
      email: Yup.string().min(4).required().email().label("Email"),
      password: Yup.string().required().label("Password"),
      password_confirmation: Yup.string()
        .required()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .label("Password Confirmation"),
    });

    onMounted(() => {
      nextTick(() => {
        PasswordMeterComponent.bootstrap();
      });
    });

    const signupWrapper = ref<HTMLElement | null>(null);

    const onSubmitRegister = async (values: any) => {
      values = values as User;

      // Clear existing errors
      serverError.value = "";
      // keep auth cleared
      store.logout();

      // eslint-disable-next-line
      submitButton.value!.disabled = true;

      // Activate indicator
      submitButton.value?.setAttribute("data-kt-indicator", "on");

      try {
        // Send signup request
        await store.register(values);

        // Apply a swipe-out transition to the signup card, fade/blur background,
        // then navigate to the Sign In page.
        try { document.body.classList.add('transitioning-to-dashboard'); } catch {}
        if (signupWrapper.value) signupWrapper.value.classList.add('swipe-out');

        await new Promise((resolve) => {
          const el = signupWrapper.value as HTMLElement | null;
          if (!el) return setTimeout(resolve, 700);
          const onEnd = () => { el.removeEventListener('animationend', onEnd); resolve(null); };
          el.addEventListener('animationend', onEnd, { once: true });
          // safety timeout
          setTimeout(resolve, 900);
        });

        router.push({ name: 'sign-in' });
      } catch (error) {
        // Normalize and show server error inline if present
        const errObj = store.errors as any;
        let errorText = "Registration failed. Please try again.";
        if (errObj) {
          if (typeof errObj === "string") {
            errorText = errObj;
          } else if (errObj.error) {
            errorText = errObj.error;
          } else {
            // try first property
            const vals = Object.values(errObj);
            if (vals.length > 0) errorText = String(vals[0]);
          }
        }

        serverError.value = errorText;

        Swal.fire({
          text: errorText,
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
      registration,
      onSubmitRegister,
      submitButton,
      getAssetPath,
      serverError,
      signupWrapper,
    };
  },
});
</script>

<style scoped>
@keyframes foldAwaySignup {
  0% { transform: translateY(0) rotateZ(0) scale(1); opacity: 1; }
  30% { transform: translateY(-8vh) rotateZ(-6deg) scale(0.96); opacity: 0.9; }
  60% { transform: translateY(-45vh) rotateZ(12deg) scale(0.5); opacity: 0.7; filter: blur(2px); }
  100% { transform: translateY(-140vh) rotateZ(40deg) scale(0.08); opacity: 0; filter: blur(8px); }
}

.crumple {
  animation: foldAwaySignup 1000ms cubic-bezier(0.2,0.9,0.3,1) forwards;
  transform-origin: 50% 50%;
}

/* Swipe-out animation for signup -> sign-in transition */
@keyframes swipeOutLeft {
  0% { transform: translateX(0) scale(1); opacity: 1; }
  40% { transform: translateX(-8%) scale(0.99); opacity: 0.95; }
  100% { transform: translateX(-120%) scale(0.92); opacity: 0; filter: blur(6px); }
}
.swipe-out {
  animation: swipeOutLeft 700ms cubic-bezier(0.2,0.9,0.25,1) forwards;
  transform-origin: 50% 50%;
}

/* ensure the global background fade (body class) shows a smooth blur */
.transitioning-to-dashboard .auth-layout-bg { transition: filter 1s ease, opacity 1s ease; filter: blur(10px); opacity: 0.45; }

</style>

<style scoped>
/* Reuse SignIn visual styles for inputs and button */
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

/* Neon button matching SignIn */
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

/* Entrance animation for the heading/form groups */
.form-entrance { opacity: 0; transform: translateY(8px); animation: fadeSlideIn 0.9s ease-out forwards; }
@keyframes fadeSlideIn { to { opacity: 1; transform: translateY(0); } }

/* Improve checkbox label contrast */
.form-check-label { color: #cbd5e1 !important; }

/* Ensure separators and helpers are visible */
.d-flex .border-bottom { border-color: rgba(255,255,255,0.06) !important; }
.fw-semobold, .text-muted { color: rgba(255,255,255,0.68) !important; }

</style>
