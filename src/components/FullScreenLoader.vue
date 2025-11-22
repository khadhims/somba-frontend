<template>
  <div class="fullscreen-loader" v-show="visible" @mousemove="handleMouseMove" ref="containerRef">
    <div class="overlay-bg"></div>

    <div class="loader-card" ref="cardRef">
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
        <div class="loader-text">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'FullScreenLoader',
  setup() {
    const visible = ref(false);
    const cameraHeadRef = ref<HTMLElement | null>(null);
    const containerRef = ref<HTMLElement | null>(null);

    // smoothing state
    const targetY = ref(0); // rotationY target
    const targetX = ref(0); // rotationX target
    const currentY = ref(0);
    const currentX = ref(0);
    let rafId: number | null = null;

    const show = () => { visible.value = true; };
    const hide = () => { visible.value = false; };

    // handlers need to be named so we can remove them later
    const onStart = show as EventListener;
    const onStop = hide as EventListener;

    onMounted(() => {
      window.addEventListener('loading:start', onStart);
      window.addEventListener('loading:stop', onStop);
    });

    onUnmounted(() => {
      window.removeEventListener('loading:start', onStart);
      window.removeEventListener('loading:stop', onStop);
      stopLoop();
    });

    // animation loop (lerp)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      // approach targets
      currentY.value = lerp(currentY.value, targetY.value, 0.14);
      currentX.value = lerp(currentX.value, targetX.value, 0.14);

      if (cameraHeadRef.value) {
        cameraHeadRef.value.style.transform = `rotateY(${currentY.value}deg) rotateX(${currentX.value}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (rafId == null) rafId = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    // reset transform when overlay hidden
    watch(visible, (val) => {
      if (val) {
        startLoop();
      } else {
        // smoothly reset targets to zero then stop
        targetX.value = 0;
        targetY.value = 0;
        // allow a few frames to ease back
        setTimeout(() => {
          if (cameraHeadRef.value) cameraHeadRef.value.style.transform = '';
          stopLoop();
        }, 220);
      }
    });

    // track mouse to set target rotation — behave like SignIn.vue:
    // compute camera head center and rotate toward mouse, clamped
    const handleMouseMove = (e: MouseEvent) => {
      if (!visible.value || !cameraHeadRef.value) return;

      const rect = cameraHeadRef.value.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // follow SignIn.vue mapping: divide by 10 and clamp; invert Y
      const rotateY = Math.max(-50, Math.min(50, deltaX / 10));
      const rotateX = Math.max(-50, Math.min(50, -deltaY / 10));

      // set as targets; smoothing loop will lerp to them
      targetY.value = rotateY;
      targetX.value = rotateX;
    };

    return { visible, cameraHeadRef, containerRef, handleMouseMove };
  }
});
</script>

<style scoped>
.fullscreen-loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
}
.overlay-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6,7,11,0.6), rgba(2,6,23,0.6));
  backdrop-filter: blur(6px) saturate(0.9);
  transition: opacity .4s ease;
}
.loader-card {
  position: relative;
  z-index: 10000;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.camera-wrapper {
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.surveillance-camera { transform-style: preserve-3d; }
.camera-mount {
  width: 90px; height: 90px; border-radius: 50%; background: #0f172a;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.9), 0 0 0 2px #334155;
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) translateZ(-30px);
}
.camera-head {
  width: 140px; height: 140px; border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #475569, #0f172a);
  display: flex; align-items:center; justify-content:center;
  transition: transform 0.12s linear;
  transform-origin: center;
  animation: camera-sway 3s ease-in-out infinite;
}
.camera-lens-housing { width: 80px; height: 80px; border-radius:50%; background:#000; border:4px solid #334155; display:flex; align-items:center; justify-content:center; transform: translateZ(20px); }
.camera-lens-glass { width:48px; height:48px; border-radius:50%; background: radial-gradient(circle at 50% 50%, #0ea5e9, #1e3a8a 60%, #000 100%); box-shadow: 0 0 20px #0ea5e9; position: relative; overflow:hidden; }
.lens-reflection { position:absolute; top:8px; left:8px; width:12px; height:12px; background: rgba(255,255,255,0.45); border-radius:50%; filter: blur(2px); }
.lens-aperture { position:absolute; width:10px; height:10px; border-radius:50%; border:1px solid rgba(255,255,255,0.12); top:50%; left:50%; transform:translate(-50%,-50%); }
.status-led { position:absolute; top:14px; right:18px; width:7px; height:7px; border-radius:50%; background:#ef4444; box-shadow:0 0 8px #ef4444; animation: led-blink 1.8s infinite; transform: translateZ(18px); }
.ir-sensors span { position:absolute; width:3px; height:3px; background:#334155; border-radius:50%; box-shadow:0 0 2px #ef4444; }
.ir-sensors span:nth-child(1) { bottom:22px; left:50%; }
.ir-sensors span:nth-child(2) { bottom:30px; left:36%; }
.ir-sensors span:nth-child(3) { bottom:30px; right:36%; }
.loader-text { margin-top: 18px; color:#c7d2fe; font-weight:700; letter-spacing:1px; text-transform:uppercase; font-size:0.9rem; text-align:center; }

@keyframes camera-sway {
  0% { transform: rotateX(0deg) rotateY(0deg) translateY(0); }
  50% { transform: rotateX(6deg) rotateY(-6deg) translateY(-4px); }
  100% { transform: rotateX(0deg) rotateY(0deg) translateY(0); }
}
@keyframes led-blink { 0%,100% { opacity:1 } 50% { opacity:0.3 } }

</style>
