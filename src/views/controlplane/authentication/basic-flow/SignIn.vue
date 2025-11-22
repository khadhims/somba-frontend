<template>
  <div class="login-container" @mousemove="handleMouseMove">
    <!-- Background Elements for "Wow" factor -->
    <div class="ambient-light"></div>
    <div class="particles">
      <div class="particle" v-for="n in 10" :key="n"></div>
    </div>

    <!-- Main Card -->
    <div class="login-card" ref="cardRef">
      
      <!-- Floating Logo -->
      <div class="brand-logo">
        <img src="/logo-somba-2.png" alt="Somba Logo" />
      </div>

      <!-- Left Side: Image & Character -->
      <div class="card-image-section">
        <div class="character-wrapper" ref="charRef">
          <!-- Using a reliable Cyberpunk/Sci-Fi image -->
          <img 
            src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" 
            alt="Visual" 
            class="character-img"
            @error="handleImageError"
          />
          <div class="image-glitch-effect"></div>
          <div class="image-text">
            <h2 class="welcome-text">WELCOME<br>BACK</h2>
            <p class="sub-text">Enter the gateway to Somba</p>
          </div>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="card-form-section">
        <div class="form-header">
          <h3 class="form-title">ACCESS CONTROL</h3>
        </div>

        <VForm
          class="login-form"
          id="kt_login_signin_form"
          @submit="onSubmitLogin"
          :validation-schema="login"
          :initial-values="{ email: 'admin@demo.com', password: 'demo' }"
        >
          <!-- Email Input -->
          <div class="input-group-custom mb-6">
            <label class="custom-label">Email Address</label>
            <div class="input-wrapper">
              <i class="bi bi-envelope input-icon"></i>
              <Field
                tabindex="1"
                class="form-control custom-input"
                type="text"
                name="username"
                autocomplete="off"
                placeholder="name@example.com"
              />
            </div>
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="username" />
              </div>
            </div>
          </div>

          <!-- Password Input -->
          <div class="input-group-custom mb-6">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="custom-label">Password</label>
              <router-link to="/password-reset" class="forgot-link">Forgot?</router-link>
            </div>
            <div class="input-wrapper">
              <i class="bi bi-lock input-icon"></i>
              <Field
                tabindex="2"
                class="form-control custom-input"
                type="password"
                name="password"
                autocomplete="off"
                placeholder="••••••••"
              />
            </div>
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            tabindex="3"
            type="submit"
            ref="submitButton"
            id="kt_sign_in_submit"
            class="btn btn-neon w-100 mb-6"
          >
            <span class="indicator-label">INITIATE LOGIN</span>
            <span class="indicator-progress">
              AUTHENTICATING...
              <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>

          <!-- Social Login -->
          <div class="social-login text-center">
            <div class="divider"><span>OR CONNECT WITH</span></div>
            <div class="social-icons">
              <a href="#" class="social-icon google"><i class="bi bi-google"></i></a>
              <a href="#" class="social-icon apple"><i class="bi bi-apple"></i></a>
              <a href="#" class="social-icon facebook"><i class="bi bi-facebook"></i></a>
            </div>
          </div>

          <div class="text-center mt-8">
            <span class="text-muted">New to Somba? </span>
            <router-link to="/sign-up" class="link-accent">Create Account</router-link>
          </div>
        </VForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);
    const cardRef = ref<HTMLElement | null>(null);
    const charRef = ref<HTMLElement | null>(null);

    const login = Yup.object().shape({
      email: Yup.string().required().label("Username"),
      password: Yup.string().min(4).required().label("Password"),
    });

    // Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.value || !charRef.value) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 40;
      const y = (e.clientY - innerHeight / 2) / 40;

      // Rotate card slightly
      cardRef.value.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
      
      // Move character more for depth
      charRef.value.style.transform = `translate(${x * 1.5}px, ${y * 1.5}px)`;
    };

    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      // Fallback to a solid color or pattern if image fails
      img.style.display = 'none';
      if (img.parentElement) {
        img.parentElement.style.background = 'linear-gradient(45deg, #2563eb, #9333ea)';
      }
    };

    const onSubmitLogin = async (values: any) => {
      values = values as User;
      store.logout();

      if (submitButton.value) {
        submitButton.value!.disabled = true;
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        await store.login(values);
      } catch (e) {
        // Error handled by store
      } finally {
        const error = Object.values(store.errors);

        if (error.length === 0) {
          Swal.fire({
            text: "Access Granted. Welcome back!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Proceed",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            router.push({ name: "dashboard" });
          });
        } else {
          Swal.fire({
            text: error[0] as string,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Retry",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-danger",
            },
          }).then(() => {
            store.errors = {};
          });
        }

        submitButton.value?.removeAttribute("data-kt-indicator");
        submitButton.value!.disabled = false;
      }
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
      handleMouseMove,
      cardRef,
      charRef,
      handleImageError
    };
  },
});
</script>

<style scoped>
/* Main Container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  perspective: 1200px;
  overflow: hidden;
  position: relative;
}

/* Ambient Background Effects */
.ambient-light {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15), transparent 60%);
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
}

.particles .particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: floatUp linear infinite;
}
/* Generate random particles */
.particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-duration: 15s; opacity: 0.3; }
.particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-duration: 25s; opacity: 0.2; }
.particle:nth-child(3) { width: 3px; height: 3px; left: 80%; animation-duration: 20s; opacity: 0.4; }
/* ... more particles could be added via SCSS loop but keeping it simple */

@keyframes floatUp {
  0% { transform: translateY(100vh); }
  100% { transform: translateY(-100vh); }
}

/* Card Layout */
.login-card {
  display: flex;
  width: 950px;
  height: 600px;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  position: relative;
  z-index: 10;
  transition: transform 0.1s ease-out;
  transform-style: preserve-3d;
  animation: cardEntrance 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(50px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Brand Logo */
.brand-logo {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 20;
  animation: logoFloat 4s ease-in-out infinite;
}

.brand-logo img {
  height: 50px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Left Side - Image Section */
.card-image-section {
  width: 50%;
  position: relative;
  z-index: 2;
}

.character-wrapper {
  position: absolute;
  top: -40px;
  left: -40px;
  width: 115%;
  height: 115%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease-out;
  z-index: 5;
}

.character-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.character-wrapper:hover .character-img {
  transform: scale(1.05);
}

.image-text {
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white;
  z-index: 6;
  text-shadow: 0 4px 8px rgba(0,0,0,0.8);
}

.welcome-text {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 10px;
  background: linear-gradient(to right, #fff, #94a3b8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textSlideIn 1s ease-out 0.5s forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.sub-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  animation: textSlideIn 1s ease-out 0.7s forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes textSlideIn {
  to { opacity: 1; transform: translateX(0); }
}

/* Right Side - Form Section */
.card-form-section {
  width: 50%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%);
  border-radius: 0 20px 20px 0;
}

.form-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  letter-spacing: 2px;
  text-align: center;
}

/* Custom Inputs */
.input-group-custom {
  margin-bottom: 25px;
}

.custom-label {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 8px;
  display: block;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.custom-input {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid #334155 !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 14px 14px 14px 45px !important;
  font-size: 1rem !important;
  transition: all 0.3s ease !important;
}

.custom-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
  background: rgba(15, 23, 42, 0.9) !important;
}

.custom-input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #3b82f6;
}

.forgot-link {
  color: #3b82f6;
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Neon Button */
.btn-neon {
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
}

.btn-neon:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.6);
  background: linear-gradient(90deg, #1d4ed8, #4338ca);
}

.btn-neon::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: 0.5s;
}

.btn-neon:hover::after {
  left: 100%;
}

/* Social Login */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  color: #64748b;
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #334155;
}

.divider span {
  padding: 0 10px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid #334155;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s;
  text-decoration: none;
}

.social-icon:hover {
  background: #334155;
  color: white;
  transform: translateY(-3px);
}

.social-icon.google:hover { color: #ea4335; border-color: #ea4335; }
.social-icon.apple:hover { color: #fff; border-color: #fff; }
.social-icon.facebook:hover { color: #1877f2; border-color: #1877f2; }

.text-muted {
  color: #64748b;
}

.link-accent {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
}

.link-accent:hover {
  color: #60a5fa;
}
</style>


