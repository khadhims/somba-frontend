<template>
  <div class="login-container" @mousemove="handleMouseMove" ref="containerRef">
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

      <!-- Left Side: Camera Watcher -->
      <div class="card-image-section">
        <div class="camera-wrapper">
          <div class="surveillance-camera">
            <div class="camera-mount"></div>
            <div class="camera-head" ref="cameraHeadRef">
              <div class="camera-lens-housing">
                <div class="camera-lens-glass">
                  <div class="lens-reflection"></div>
                  <div class="lens-aperture"></div>
                </div>
              </div>
              <div class="status-led"></div>
              <div class="ir-sensors">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
          <!-- Holographic Cone -->
          <div class="hologram-cone"></div>
        </div>
        
        <div class="image-text">
          <h2 class="welcome-text">WELCOME<br>BACK</h2>
          <p class="sub-text">Enter the gateway to SOMBA.</p>
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
            <span class="indicator-label">SIGN IN</span>
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
import { defineComponent, ref, onMounted } from "vue";
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
    const cameraHeadRef = ref<HTMLElement | null>(null);
    const containerRef = ref<HTMLElement | null>(null);

    const login = Yup.object().shape({
      email: Yup.string().required().label("Username"),
      password: Yup.string().min(4).required().label("Password"),
    });

    // Clean up any leftover transition classes from signup page
    onMounted(() => {
      try {
        document.body.classList.remove('transitioning-to-dashboard');
      } catch (e) {
        console.warn('Failed to remove transition class:', e);
      }
    });

    // Parallax & Camera Tracking Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.value) return;
      
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 40;
      const y = (e.clientY - innerHeight / 2) / 40;

      // Rotate card slightly
      cardRef.value.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
      
      // Camera Head Tracking
      if (cameraHeadRef.value) {
        const rect = cameraHeadRef.value.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate angle to mouse
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Limit rotation angles (max 50 degrees)
        const rotateY = Math.max(-50, Math.min(50, deltaX / 10));
        const rotateX = Math.max(-50, Math.min(50, -deltaY / 10)); // Invert Y for CSS rotateX
        
        cameraHeadRef.value.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
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
          // Fade/blur the background for a smoother transition
          try { document.body.classList.add('transitioning-to-dashboard'); } catch {}
          if (containerRef.value) containerRef.value.classList.add('fade-bg');

          // Play a dramatic "crumple/fold away" animation on the login card
          // then navigate to the dashboard. This replaces the success popup.
          if (cardRef.value) {
            // trigger animation
            cardRef.value.classList.add("crumple");

            // wait for animation to finish (or fallback after 1.4s)
            await new Promise((resolve) => {
              const el = cardRef.value as HTMLElement;
              const onEnd = () => {
                el.removeEventListener("animationend", onEnd);
                resolve(null);
              };
              el.addEventListener("animationend", onEnd, { once: true });
              // safety timeout
              setTimeout(resolve, 1600);
            });
          }

          router.push({ name: "dashboard" });
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
      cameraHeadRef
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

/* Crumple / Fold-away animation for successful login */
@keyframes foldAway {
  0% {
    transform: translateY(0) rotateX(0) rotateY(0) scale(1);
    opacity: 1;
    filter: blur(0px) saturate(1);
  }
  25% {
    transform: translateY(-10px) rotateZ(-6deg) scale(0.98) skew(-2deg, -1deg);
    filter: blur(0.5px) saturate(1.05);
  }
  55% {
    transform: translateY(-40vh) rotateZ(10deg) scale(0.45) skew(8deg, 4deg);
    opacity: 0.75;
    filter: blur(2px) saturate(0.9) contrast(0.95);
  }
  100% {
    transform: translateY(-140vh) rotateZ(40deg) scale(0.08) skew(18deg, 10deg);
    opacity: 0;
    filter: blur(8px) saturate(0.6) contrast(0.9);
  }
}

.login-card.crumple {
  animation: foldAway 1000ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
  transform-origin: 50% 50%;
}

/* Brand Logo */
.brand-logo {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 60;
  animation: logoFloat 4s ease-in-out infinite;
  /* make a soft rounded backdrop so the logo contrasts on any background */
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 8px 30px rgba(14,165,233,0.06), 0 2px 6px rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
}

.brand-logo img {
  height: 56px;
  display: block;
  filter: drop-shadow(0 10px 30px rgba(14,165,233,0.22)) saturate(1.15) contrast(1.15);
  -webkit-filter: drop-shadow(0 10px 30px rgba(14,165,233,0.22)) saturate(1.15) contrast(1.15);
}

.brand-logo::after {
  /* subtle halo to further improve visibility */
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.08), transparent 40%);
  z-index: 10;
  pointer-events: none;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 800px;
  transform: translateY(-30px);
}

.surveillance-camera {
  position: relative;
  transform-style: preserve-3d;
  z-index: 10;
}

.camera-mount {
  width: 140px;
  height: 140px;
  background: #0f172a;
  border-radius: 50%;
  box-shadow: 
    inset 0 0 30px rgba(0,0,0,0.9),
    0 0 0 2px #334155,
    0 0 0 10px #1e293b;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(-50px);
}

.camera-head {
  width: 160px;
  height: 160px;
  background: radial-gradient(circle at 30% 30%, #475569, #0f172a);
  border-radius: 50%;
  position: relative;
  box-shadow: 
    -15px 15px 40px rgba(0,0,0,0.6),
    inset 2px 2px 5px rgba(255,255,255,0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.05s ease-out; /* Fast response */
  transform-style: preserve-3d;
}

.camera-lens-housing {
  width: 100px;
  height: 100px;
  background: #000;
  border-radius: 50%;
  border: 5px solid #334155;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateZ(25px);
  box-shadow: 0 0 20px rgba(0,0,0,0.9);
}

.camera-lens-glass {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 50% 50%, #0ea5e9, #1e3a8a 60%, #000 100%);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 25px #0ea5e9;
  overflow: hidden;
}

.lens-reflection {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 18px;
  height: 18px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  filter: blur(3px);
}

.lens-aperture {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
}

.status-led {
  position: absolute;
  top: 20px;
  right: 30px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 10px #ef4444;
  animation: blink 2s infinite;
  transform: translateZ(20px);
}

.ir-sensors span {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #334155;
  border-radius: 50%;
  box-shadow: 0 0 2px #ef4444;
}
.ir-sensors span:nth-child(1) { bottom: 25px; left: 50%; }
.ir-sensors span:nth-child(2) { bottom: 35px; left: 35%; }
.ir-sensors span:nth-child(3) { bottom: 35px; right: 35%; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Holographic Cone */
.hologram-cone {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: conic-gradient(from 180deg at 50% 50%, 
    rgba(14, 165, 233, 0) 0deg, 
    rgba(14, 165, 233, 0.05) 20deg, 
    rgba(14, 165, 233, 0) 40deg);
  transform-origin: center;
  transform: translate(-50%, -50%) rotate(180deg);
  pointer-events: none;
  z-index: 1;
  animation: scanRotate 4s linear infinite;
  opacity: 0.5;
}

@keyframes scanRotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
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
  font-size: 3rem;
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
  font-size: 1rem;
  color: #0ea5e9;
  font-family: monospace;
  letter-spacing: 2px;
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

/* Responsive rules */
@media (max-width: 991px) {
  .login-card {
    width: 92%;
    height: auto;
  }

  .card-image-section {
    width: 40%;
  }

  .card-form-section {
    width: 60%;
    padding: 40px;
  }

  .camera-wrapper {
    width: 240px;
    height: 240px;
  }

  .hologram-cone {
    opacity: 0.35;
  }
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    width: 92%;
    height: auto;
    padding: 12px;
  }

  .card-image-section {
    width: 100%;
    order: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
    margin-bottom: 6px;
  }

  /* On mobile we hide the left visual card completely to prioritize the form */
  .card-image-section {
    display: none !important;
  }

  .brand-logo {
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
  }

  .camera-wrapper {
    width: 180px;
    height: 180px;
    transform: translateY(-10px);
  }

  .camera-head {
    width: 120px;
    height: 120px;
  }

  .camera-lens-housing {
    width: 80px;
    height: 80px;
    transform: translateZ(20px);
  }

  .camera-lens-glass {
    width: 48px;
    height: 48px;
  }

  .welcome-text {
    font-size: 2rem;
    text-align: center;
    left: 0;
    bottom: 8px;
  }

  .sub-text {
    font-size: 0.95rem;
    text-align: center;
    left: 0;
  }

  .card-form-section {
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    /* restore normal top padding when logo hidden */
    padding-top: 20px;
  }

  /* hide brand logo on mobile to avoid overlap */
  .brand-logo {
    display: none !important;
  }

  .btn-neon {
    padding: 12px;
  }

  .social-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .hologram-cone {
    display: none;
  }
}

@media (max-width: 420px) {
  .camera-wrapper {
    width: 140px;
    height: 140px;
  }

  .brand-logo img {
    height: 42px;
  }

  .welcome-text {
    font-size: 1.6rem;
  }

  .custom-input {
    padding: 10px 12px 10px 40px !important;
    font-size: 0.95rem !important;
  }

  .form-title {
    font-size: 1.25rem;
  }

  .login-card {
    width: 96%;
  }

  .particles { display: none; }
}
</style>

/* Global background fade/blur used during transition to dashboard */
<style>
.transitioning-to-dashboard .auth-layout-bg {
  transition: filter 1s ease, background-color 1s ease, opacity 1s ease;
  filter: blur(10px) saturate(0.9) brightness(0.9);
  opacity: 0.45;
}

.transitioning-to-dashboard .login-container .ambient-light {
  transition: opacity 1s ease, filter 1s ease;
  opacity: 0 !important;
  filter: blur(8px) !important;
}

.transitioning-to-dashboard .login-card {
  /* subtle dim to focus on the crumple */
  transition: opacity 1s ease;
}
</style>


