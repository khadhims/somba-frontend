<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="isOpen" 
        class="camera-modal-overlay"
        @click="closeModal"
      >
        <div 
          class="camera-modal-container"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="camera-modal-header">
            <div class="camera-info">
              <h3 class="camera-title">{{ camera?.room || 'Camera' }}</h3>
              <p class="camera-subtitle">{{ camera?.name }}</p>
            </div>
            <button class="btn-close-modal" @click="closeModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Video Player -->
          <div class="camera-modal-body">
            <div class="video-container">
              <video
                ref="videoPlayer"
                class="hls-video-player"
                controls
                autoplay
                playsinline
                muted
              ></video>
              
              <!-- Loading Spinner -->
              <div v-if="isLoading" class="video-loading">
                <div class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-white mt-3">Loading stream...</p>
              </div>

              <!-- Error State -->
              <div v-if="hasError" class="video-error">
                <i class="bi bi-exclamation-triangle fs-1 text-warning mb-3"></i>
                <p class="text-white">Failed to load camera stream</p>
                <button class="btn btn-sm btn-light mt-2" @click="retryStream">
                  <i class="bi bi-arrow-clockwise me-2"></i>Retry
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="camera-modal-footer">
            <div class="d-flex align-items-center gap-3">
              <span v-if="camera?.model" class="badge badge-light-info">
                <i class="bi bi-camera-video me-1"></i>{{ camera.model }}
              </span>
              <span class="text-muted fs-7">
                <i class="bi bi-broadcast me-1"></i>Live Stream
              </span>
            </div>
            <button class="btn btn-sm btn-secondary" @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

interface Camera {
  uid: string;
  name: string;
  room: string;
  recording: boolean;
  site_uid: string;
  nvr_uid?: string;
  public_endpoint_url?: string;
  model?: string;
}

const isOpen = ref(false);
const camera = ref<Camera | null>(null);
const videoPlayer = ref<HTMLVideoElement | null>(null);
const isLoading = ref(false);
const hasError = ref(false);
let hlsInstance: any = null;

const openModal = (cam: Camera) => {
  camera.value = cam;
  isOpen.value = true;
  hasError.value = false;
  isLoading.value = true;
  
  nextTick(() => {
    initializePlayer();
  });
};

const closeModal = () => {
  destroyPlayer();
  isOpen.value = false;
  camera.value = null;
  isLoading.value = false;
  hasError.value = false;
};

// Helper function to snap video to live edge
const snapToLiveEdge = (videoEl: HTMLVideoElement, targetBuffer: number, minBuffer: number) => {
  try {
    const buffered = videoEl.buffered;
    if (!buffered.length) return;
    
    const end = buffered.end(buffered.length - 1);
    const current = videoEl.currentTime;
    const bufferLength = end - current;
    
    if (bufferLength > targetBuffer) {
      videoEl.currentTime = end - minBuffer;
      console.log(`[Modal HLS] Snapped to live edge: ${bufferLength.toFixed(2)}s -> ${minBuffer}s`);
    }
  } catch (err) {
    console.warn('[Modal HLS] Error snapping to live edge:', err);
  }
};

const initializePlayer = () => {
  if (!videoPlayer.value || !camera.value?.public_endpoint_url) {
    hasError.value = true;
    isLoading.value = false;
    return;
  }

  const url = camera.value.public_endpoint_url;
  const HlsGlobal = (window as any).Hls;

  if (HlsGlobal && HlsGlobal.isSupported && HlsGlobal.isSupported()) {
    hlsInstance = new HlsGlobal({
      // Optimized configuration for live streaming (from LiveView.vue)
      lowLatencyMode: true,
      backBufferLength: 30,
      maxBufferLength: 60,        // Reduced from 300
      maxMaxBufferLength: 120,    // Reduced from 600
      liveSyncDurationCount: 3,   // Reduced from 16
      liveMaxLatencyDurationCount: 5, // Reduced from 20

      // Fragment loading optimization
      fragLoadingTimeOut: 10000,
      fragLoadingMaxRetry: 3,
      fragLoadingRetryDelay: 1000,

      // Manifest loading optimization
      manifestLoadingTimeOut: 5000,
      manifestLoadingMaxRetry: 3,
      manifestLoadingRetryDelay: 1000,

      // Level loading optimization
      levelLoadingTimeOut: 5000,
      levelLoadingMaxRetry: 2,
      levelLoadingRetryDelay: 2000,

      // Reduce aggressive requesting
      enableWorker: true,
      startFragPrefetch: false,
      testBandwidth: false,
      maxLiveSyncPlaybackRate: 1.5,
    });

    // Level loaded event
    hlsInstance.on(HlsGlobal.Events.LEVEL_LOADED, (_evt: any, data: any) => {
      if ((import.meta as any)?.env?.DEV) {
        console.log('[Modal HLS] level loaded:', {
          live: data?.details?.live,
          targetduration: data?.details?.targetduration,
        });
      }
    });

    // Buffer appended - snap to live edge
    hlsInstance.on(HlsGlobal.Events.BUFFER_APPENDED, () => {
      snapToLiveEdge(videoPlayer.value!, 12, 2);
      
      if ((import.meta as any)?.env?.DEV) {
        try {
          const b = videoPlayer.value!.buffered;
          if (b.length) {
            const len = b.end(b.length - 1) - videoPlayer.value!.currentTime;
            console.log(`[Modal HLS] buffer=${len.toFixed(2)}s`);
          }
        } catch {}
      }
    });

    hlsInstance.on(HlsGlobal.Events.MANIFEST_PARSED, () => {
      isLoading.value = false;
      videoPlayer.value?.play().catch((err) => {
        console.error('Autoplay failed:', err);
      });
    });

    hlsInstance.on(HlsGlobal.Events.ERROR, (_evt: any, data: any) => {
      if (data && data.fatal === false) {
        const details = (data.details || data.error || data.reason || '').toString().toLowerCase();
        
        if (details.includes('buffer_stalled') || details.includes('buffer-stalled')) {
          console.warn('[Modal HLS] Buffer stalled, snapping to live edge');
          snapToLiveEdge(videoPlayer.value!, 6, 1.5);
          videoPlayer.value?.play().catch(() => {});
        }
        return;
      }

      if (!data || !('fatal' in data)) return;
      
      console.error('[Modal HLS] Fatal error:', data);
      
      if (data.fatal) {
        switch (data.type) {
          case HlsGlobal.ErrorTypes.NETWORK_ERROR:
            console.log('[Modal HLS] Network error, trying to recover...');
            hlsInstance.startLoad();
            break;
          case HlsGlobal.ErrorTypes.MEDIA_ERROR:
            console.log('[Modal HLS] Media error, trying to recover...');
            hlsInstance.recoverMediaError();
            break;
          default:
            console.log('[Modal HLS] Fatal error, cannot recover');
            hasError.value = true;
            isLoading.value = false;
            hlsInstance.destroy();
            break;
        }
      }
    });

    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoPlayer.value);
  } else if (videoPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
    // Native HLS support (Safari)
    videoPlayer.value.src = url;
    videoPlayer.value.addEventListener('loadeddata', () => {
      isLoading.value = false;
      videoPlayer.value?.play().catch((err) => {
        console.error('Autoplay failed:', err);
      });
    }, { once: true });
    
    videoPlayer.value.addEventListener('error', () => {
      hasError.value = true;
      isLoading.value = false;
    }, { once: true });
  } else {
    hasError.value = true;
    isLoading.value = false;
    console.error('HLS is not supported in this browser');
  }
};

const destroyPlayer = () => {
  if (hlsInstance) {
    try {
      hlsInstance.destroy();
    } catch (err) {
      console.error('Error destroying HLS instance:', err);
    }
    hlsInstance = null;
  }
  
  if (videoPlayer.value) {
    videoPlayer.value.src = '';
    videoPlayer.value.load();
  }
};

const retryStream = () => {
  hasError.value = false;
  isLoading.value = true;
  destroyPlayer();
  nextTick(() => {
    initializePlayer();
  });
};

// Expose methods for parent component
defineExpose({
  openModal,
  closeModal
});
</script>

<style scoped>
.camera-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.camera-modal-container {
  width: 100%;
  max-width: 1200px;
  background: #1e1e2d;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.camera-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #1a1a27;
}

.camera-info {
  flex: 1;
}

.camera-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.camera-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #a1a5b7;
}

.btn-close-modal {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.2);
}

.camera-modal-body {
  flex: 1;
  padding: 0;
  background: #000;
  position: relative;
  min-height: 400px;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hls-video-player {
  width: 100%;
  height: 100%;
  max-height: calc(90vh - 160px);
  object-fit: contain;
  background: #000;
}

.video-loading,
.video-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.camera-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #1a1a27;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .camera-modal-container,
.modal-fade-leave-active .camera-modal-container {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .camera-modal-container {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.modal-fade-leave-to .camera-modal-container {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}
</style>
