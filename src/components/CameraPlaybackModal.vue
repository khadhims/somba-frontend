<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out [&>div]:transition-all [&>div]:duration-300 [&>div]:ease-out"
      leave-active-class="transition-opacity duration-300 ease-out [&>div]:transition-all [&>div]:duration-300 [&>div]:ease-out"
      enter-from-class="opacity-0 [&>div]:-translate-y-5 [&>div]:scale-90 [&>div]:opacity-0"
      leave-to-class="opacity-0 [&>div]:-translate-y-5 [&>div]:scale-90 [&>div]:opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[10001] flex items-center justify-center bg-black/85 p-5 backdrop-blur-[4px]"
        @click="closeModal"
      >
        <div 
          class="flex max-h-[90vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-xl bg-[#1e1e2d] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-white/10 bg-[#1a1a27] px-6 py-5">
            <div class="flex-1">
              <h3 class="m-0 text-xl font-semibold text-white">{{ camera?.room || 'Camera' }}</h3>
              <p class="mt-1 mb-0 text-sm text-[#a1a5b7]">{{ camera?.name }}</p>
            </div>
            <button
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border-none bg-white/10 text-white transition-all duration-200 hover:bg-white/20"
              @click="closeModal"
            >
              <i class="ki-duotone ki-cross fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>

          <!-- Video Player -->
          <div class="relative min-h-[400px] flex-1 bg-black p-0">
            <div class="relative flex h-full w-full items-center justify-center bg-black">
              <video
                ref="videoPlayer"
                class="h-full max-h-[calc(90vh-160px)] w-full bg-black object-contain"
                controls
                autoplay
                playsinline
                muted
              ></video>
              
              <!-- Loading Spinner -->
              <div
                v-if="isLoading"
                class="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
              >
                <div
                  class="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
                  role="status"
                  aria-label="Loading"
                ></div>
                <p class="text-white mt-3">Loading stream...</p>
              </div>

              <!-- Error State -->
              <div
                v-if="hasError"
                class="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
              >
                <i class="ki-duotone ki-information fs-1 text-warning mb-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                <p class="text-white">Failed to load camera stream</p>
                <button
                  class="mt-2 inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  @click="retryStream"
                >
                  <i class="ki-duotone ki-arrows-circle me-1">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Retry
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between border-t border-white/10 bg-[#1a1a27] px-6 py-4">
            <div class="flex items-center gap-3">
              <span v-if="camera?.model" class="inline-flex rounded px-2 py-1 text-xs font-semibold bg-info-light text-info">
                {{ camera.model }}
              </span>
              <span class="flex items-center gap-1.5 text-sm text-gray-400">
                <span class="h-2 w-2 animate-pulse rounded-full bg-danger"></span>
                Live Stream
              </span>
            </div>
            <button
              class="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              @click="closeModal"
            >
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
