<template>
  <dialog
    ref="dialogEl"
    class="m-auto w-full max-w-4xl rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/60 dark:bg-gray-900"
    @click.self="close"
    @close="emitClose"
  >
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
      <h5 class="m-0 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
        <i class="ki-duotone ki-eye fs-2 text-primary">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        {{ t("appsEventsAlerts.eventsModals.details.title") || "Detail Event" }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="close"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>

    <div class="px-4 pb-4">
      <div v-if="loading" class="flex items-center justify-center py-10">
        <span
          role="status"
          class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
        >
          <span class="sr-only">Loading...</span>
        </span>
      </div>

      <div v-else-if="event" class="min-h-[400px]">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <!-- Gallery -->
          <div class="lg:col-span-5">
            <div class="h-full rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div class="relative mb-3">
                <transition name="fade">
                  <img
                    v-if="currentImage"
                    :key="currentImage"
                    :src="currentImage"
                    alt="Event Image"
                    class="max-h-[340px] w-full cursor-zoom-in rounded object-cover shadow-sm"
                    @error="onImageError"
                    @click="openLightbox = true"
                  />
                  <div
                    v-else
                    class="flex h-[340px] items-center justify-center rounded bg-gray-100 dark:bg-gray-700"
                  >
                    <i class="ki-duotone ki-picture fs-2x text-gray-400">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </transition>
                <button
                  v-if="images.length > 1"
                  aria-label="Previous image"
                  @click="prevImage"
                  class="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition-colors hover:bg-white dark:bg-gray-900/90 dark:text-gray-200"
                >
                  <i class="ki-duotone ki-left fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
                <button
                  v-if="images.length > 1"
                  aria-label="Next image"
                  @click="nextImage"
                  class="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow transition-colors hover:bg-white dark:bg-gray-900/90 dark:text-gray-200"
                >
                  <i class="ki-duotone ki-right fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
                <div
                  v-if="images.length > 1"
                  class="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs font-semibold tabular-nums text-white"
                >
                  {{ currentIndex + 1 }}/{{ images.length }}
                </div>
              </div>

              <div v-if="images.length > 1" class="flex max-h-20 gap-2 overflow-x-auto pb-1">
                <button
                  v-for="(img, idx) in images"
                  :key="img + idx"
                  type="button"
                  @click="goToImage(idx)"
                  class="relative h-[60px] w-[72px] shrink-0 overflow-hidden rounded-md border-2 transition-colors"
                  :class="idx === currentIndex ? 'border-primary' : 'border-transparent'"
                >
                  <img
                    :src="img"
                    alt="thumb"
                    class="h-full w-full object-cover"
                    @error="onThumbError"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="lg:col-span-7">
            <div class="flex flex-col gap-4">
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="inline-flex rounded px-2 py-1 text-xs font-semibold"
                  :class="statusBadgeClass(event.status)"
                  >{{ statusLabel(event.status) }}</span
                >
                <div class="text-sm text-gray-500">{{ event.camera_name }}</div>
                <div class="text-sm tabular-nums text-gray-500">
                  {{ formatDuration(event.duration_minutes) }}
                </div>
              </div>

              <div v-if="event.activities && event.activities.length">
                <h6 class="section-title mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  {{ t("appsEventsAlerts.eventsModals.details.activities") || "Aktivitas" }}
                </h6>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div
                    v-for="(activity, i) in event.activities"
                    :key="i"
                    class="flex h-full flex-col justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div class="mb-1 text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
                      {{ activity.activity_name || "-" }}
                    </div>
                    <div class="text-xs text-gray-500">
                      ID: <span class="font-semibold">{{ activity.activity_uid || "-" }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <div class="mb-1 text-xs text-gray-500">
                    {{ t("appsEventsAlerts.eventsModals.details.startTime") || "Mulai" }}
                  </div>
                  <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(event.event_start) }}
                  </div>
                </div>
                <div class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <div class="mb-1 text-xs text-gray-500">
                    {{ t("appsEventsAlerts.eventsModals.details.endTime") || "Selesai" }}
                  </div>
                  <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(event.event_end) }}
                  </div>
                </div>
                <div class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <div class="mb-1 text-xs text-gray-500">
                    {{ t("appsEventsAlerts.eventsModals.details.duration") || "Durasi" }}
                  </div>
                  <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                    {{ formatDuration(event.duration_minutes) }}
                  </div>
                </div>
                <div class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <div class="mb-1 text-xs text-gray-500">
                    {{ t("appsEventsAlerts.eventsModals.details.avgDetection") || "Rata-rata Deteksi" }}
                  </div>
                  <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                    {{ formatSeconds(event.avg_seconds_with_detection) }}
                  </div>
                </div>
              </div>

              <div>
                <h6 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  {{ t("appsEventsAlerts.eventsModals.details.eventName") || "Nama Event" }}
                </h6>
                <div class="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                  {{ event.event_name || "-" }}
                </div>
              </div>

              <div v-if="images.length > 1" class="text-sm text-gray-500">
                Klik gambar utama untuk perbesaran.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-10 text-center text-gray-500">
        {{ t("appsEventsAlerts.eventsModals.details.noData") || "Data tidak tersedia" }}
      </div>
    </div>

    <div class="flex justify-end border-t border-gray-200 px-4 py-4 dark:border-gray-700">
      <button
        type="button"
        @click="close"
        class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
      >
        {{ t("common.close") || "Tutup" }}
      </button>
    </div>
  </dialog>

  <!-- Lightbox -->
  <dialog
    ref="lightboxEl"
    class="m-auto max-w-[90vw] rounded-lg border-0 bg-transparent p-0 backdrop:bg-black/85"
    @click.self="openLightbox = false"
  >
    <div class="relative">
      <img
        :src="currentImage"
        alt="Lightbox"
        class="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
        @error="onImageError"
      />
      <button
        aria-label="Close"
        @click="openLightbox = false"
        class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
      <button
        v-if="images.length > 1"
        aria-label="Previous image"
        @click="prevImage"
        class="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white"
      >
        <i class="ki-duotone ki-left fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
      <button
        v-if="images.length > 1"
        aria-label="Next image"
        @click="nextImage"
        class="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white"
      >
        <i class="ki-duotone ki-right fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDateTimeGMT8 } from '@/core/helpers/timezone';
import { badgeVariantClass } from '@/core/helpers/badge';

const props = defineProps<{
  show: boolean;
  event: any | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e:'close'): void;
}>();

const { t } = useI18n();

const dialogEl = ref<HTMLDialogElement | null>(null);
const lightboxEl = ref<HTMLDialogElement | null>(null);

watch(
  () => props.show,
  (show) => {
    if (show) dialogEl.value?.showModal();
    else dialogEl.value?.close();
  }
);

const close = () => dialogEl.value?.close();
const emitClose = () => emit('close');

const images = computed(() => {
  if (!props.event) return [] as string[];
  const arr: string[] = [];
  if (props.event.image_url) arr.push(props.event.image_url);
  if (Array.isArray(props.event.image_urls)) {
    props.event.image_urls.forEach((u:string) => { if (u && !arr.includes(u)) arr.push(u); });
  }
  return arr;
});

const currentIndex = ref(0);
const currentImage = computed(() => images.value[currentIndex.value] || '');
const openLightbox = ref(false);

watch(openLightbox, (open) => {
  if (open) lightboxEl.value?.showModal();
  else lightboxEl.value?.close();
});

watch(images, (val) => {
  if (currentIndex.value >= val.length) currentIndex.value = 0;
});

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
};
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};
const goToImage = (idx:number) => { currentIndex.value = idx; };

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
};
const onThumbError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.classList.add('opacity-30');
};

// Formatting & helpers
const formatDateTime = (value?: string) => {
  if (!value) return '-';
  // Use GMT+8 formatter with Indonesian locale format
  const formatted = formatDateTimeGMT8(value, 'DD/MM/YYYY HH:mm:ss');
  return formatted || value;
};
const formatNumber = (value:number, maximumFractionDigits=1) => new Intl.NumberFormat(undefined, { maximumFractionDigits, minimumFractionDigits:0 }).format(value);
const formatSeconds = (seconds?: number | null) => {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds)) return t('appsEventsAlerts.format.notAvailable');
  return t('appsEventsAlerts.format.secondsShort', { value: formatNumber(Math.max(0, seconds), 1) });
};
const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes)) return t('appsEventsAlerts.format.notAvailable');
  if ((minutes||0) < 1) return t('appsEventsAlerts.format.secondsLong', { value: formatNumber(Math.max(0, (minutes||0)*60), 2) });
  return t('appsEventsAlerts.format.minutesLong', { value: formatNumber(Math.max(0, minutes||0), 2) });
};

const normalizeKey = (v?:string) => (v||'').toLowerCase().replace(/[\s_-]/g,'');
const statusBadgeClass = (status:string) => {
  const k = normalizeKey(status);
  if (k==='active' || k==='unresolved') return badgeVariantClass('danger');
  if (k==='acknowledged') return badgeVariantClass('warning');
  if (k==='resolved' || k==='notresolved') return badgeVariantClass('success');
  if (k==='falsedetection') return badgeVariantClass('info');
  return badgeVariantClass('secondary');
};
const statusLabel = (status:string) => {
  const k = normalizeKey(status);
  if (k==='active') return t('appsEventsAlerts.eventsTable.status.active') || 'Active';
  if (k==='acknowledged') return t('appsEventsAlerts.eventsTable.status.acknowledged') || 'Acknowledged';
  if (k==='resolved') return t('appsEventsAlerts.eventsTable.status.resolved') || 'Resolved';
  if (k==='unresolved' || k==='notresolved') return t('appsEventsAlerts.eventsTable.status.unresolved') || 'Unresolved';
  if (k==='falsedetection') return t('appsEventsAlerts.eventsTable.status.falseDetection') || 'False Detection';
  return status || '-';
};
</script>

<style scoped>
.fade-enter-active,.fade-leave-active { transition: opacity .3s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
</style>
