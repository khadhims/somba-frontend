<template>
  <!--begin::Wrapper-->
  <div class="lg:w-[500px] p-10" ref="signupWrapper">
    <!--begin::Form-->
    <VForm
      class="w-full"
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
        <div class="text-lg font-semibold text-white/75">
          Already have an account?

          <router-link to="/sign-in" class="text-primary font-bold hover:underline">
            Sign in here
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--end::Heading-->

      <!--begin::Action-->
      <button type="button" class="mb-10 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-primary-light px-5 py-3.5 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white">
        <img
          alt="Logo"
          :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
          class="h-5 mr-3"
        />
        Sign in with Google
      </button>
      <!--end::Action-->

      <!--begin::Separator-->
      <div class="flex items-center mb-10">
        <div class="h-px flex-1 bg-white/10"></div>
        <span class="mx-2 text-xs font-semibold text-white/70">OR</span>
        <div class="h-px flex-1 bg-white/10"></div>
      </div>
      <!--end::Separator-->

      <!--begin::Input group-->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-7">
        <!--begin::Col-->
        <div>
          <label class="mb-2 block text-sm font-bold text-white">First Name</label>
          <Field
            class="custom-input w-full"
            type="text"
            placeholder=""
            name="first_name"
            autocomplete="off"
          />
          <div>
            <div class="mt-1 text-sm text-danger">
              <ErrorMessage name="first_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div>
          <label class="mb-2 block text-sm font-bold text-white">Last Name</label>
          <Field
            class="custom-input w-full"
            type="text"
            placeholder=""
            name="last_name"
            autocomplete="off"
          />
          <div>
            <div class="mt-1 text-sm text-danger">
              <ErrorMessage name="last_name" />
            </div>
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-7">
        <label class="mb-2 block text-sm font-bold text-white">Email</label>
        <Field
          class="custom-input w-full"
          type="email"
          placeholder=""
          name="email"
          autocomplete="off"
        />
        <div>
          <div class="mt-1 text-sm text-danger">
            <ErrorMessage name="email" />
            <div v-if="serverError" class="text-danger mt-1">
              {{ serverError }}
            </div>
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10">
        <!--begin::Wrapper-->
        <div class="mb-1">
          <!--begin::Label-->
          <label class="mb-2 block text-sm font-bold text-white">Password</label>
          <!--end::Label-->

          <!--begin::Input wrapper-->
          <div class="relative mb-3">
            <Field
              class="custom-input w-full"
              type="password"
              placeholder=""
              name="password"
              autocomplete="off"
              @input="handlePasswordInput"
            />
            <div>
              <div class="mt-1 text-sm text-danger">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>
          <!--end::Input wrapper-->
          <!--begin::Meter-->
          <div class="flex items-center gap-2 mb-3">
            <div
              v-for="bar in 4"
              :key="bar"
              class="h-[5px] flex-1 rounded transition-colors"
              :class="bar <= activePasswordBars ? 'bg-success' : 'bg-white/15'"
            ></div>
          </div>
          <!--end::Meter-->
        </div>
        <!--end::Wrapper-->
        <!--begin::Hint-->
        <div class="text-white/70">
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div>
        <!--end::Hint-->
      </div>
      <!--end::Input group--->

      <!--begin::Input group-->
      <div class="mb-5">
        <label class="mb-2 block text-sm font-bold text-white">Confirm Password</label>
        <Field
          class="custom-input w-full"
          type="password"
          placeholder=""
          name="password_confirmation"
          autocomplete="off"
        />
        <div>
          <div class="mt-1 text-sm text-danger">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="mb-10">
        <label class="flex cursor-pointer items-start gap-2">
          <Field
            class="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
            type="checkbox"
            name="toc"
            value="1"
          />
          <span class="text-sm font-semibold text-white">
            I Agree &
            <a href="#" class="ml-1 text-primary hover:underline">Terms and conditions</a>.
          </span>
        </label>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <button
          id="kt_sign_up_submit"
          type="submit"
          class="btn-neon inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-5 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Submit</span>
          <span v-else class="inline-flex items-center gap-2">
            Please wait...
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
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
import { computed, defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { swalDangerButtonClass } from "@/core/helpers/badge";

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
    const isSubmitting = ref(false);

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

    // Replaces PasswordMeterComponent (src/assets/ts/components/_PasswordMeterComponent.ts):
    // same 5 criteria (length>=8, lowercase, uppercase, digit, special char),
    // 20 points each, 4 highlight bars. The original computed a per-bar
    // threshold (`checkScore * index * (checkSteps/total) <= score`) which,
    // with all 5 checks always enabled, reduces to a flat
    // "bars active = criteria met - 1" - reproduced directly rather than
    // porting the general-case threshold math for a case that never varies.
    const passwordScore = ref(0);
    const handlePasswordInput = (event: Event) => {
      const val = (event.target as HTMLInputElement).value;
      let count = 0;
      if (val.length >= 8) count++;
      if (/[a-z]/.test(val)) count++;
      if (/[A-Z]/.test(val)) count++;
      if (/[0-9]/.test(val)) count++;
      if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(val)) count++;
      passwordScore.value = count;
    };
    const activePasswordBars = computed(() => Math.max(0, Math.min(4, passwordScore.value - 1)));

    const signupWrapper = ref<HTMLElement | null>(null);

    const onSubmitRegister = async (values: any) => {
      values = values as User;

      // Clear existing errors
      serverError.value = "";
      // keep auth cleared
      store.logout();

      isSubmitting.value = true;

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
            confirmButton: swalDangerButtonClass,
          },
        });
      }

      isSubmitting.value = false;
    };

    return {
      registration,
      onSubmitRegister,
      isSubmitting,
      getAssetPath,
      serverError,
      signupWrapper,
      activePasswordBars,
      handlePasswordInput,
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

/* Neon button matching SignIn */
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

/* Entrance animation for the heading/form groups */
.form-entrance { opacity: 0; transform: translateY(8px); animation: fadeSlideIn 0.9s ease-out forwards; }
@keyframes fadeSlideIn { to { opacity: 1; transform: translateY(0); } }

</style>
