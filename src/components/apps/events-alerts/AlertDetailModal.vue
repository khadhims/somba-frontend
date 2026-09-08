<template>
  <dialog
    ref="dialogEl"
    class="m-auto w-full max-w-4xl rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/60 dark:bg-gray-900"
    @click.self="close"
    @close="emitClose"
  >
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
      <h5 class="m-0 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
        <i class="ki-duotone ki-eye fs-2 text-primary">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        {{ t("appsEventsAlerts.alertDetail.title") || "Detail Pelanggaran" }}
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

      <div v-else-if="alert" class="min-h-[400px]">
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
                    alt="Alert Image"
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
              <!-- Edit Form -->
              <div
                v-if="localEditMode"
                class="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <h6 class="mb-3 flex items-center gap-2 font-bold text-primary">
                  <i class="ki-duotone ki-pencil fs-3 text-primary">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  {{ t("appsEventsAlerts.alertDetail.editTitle") || "Ubah Status & Komentar" }}
                </h6>
                <div class="mb-3">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.alertDetail.status") || "Status" }}
                  </label>
                  <select
                    v-model="localEditForm.status"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value="">{{ t("appsEventsAlerts.alertsFilters.selectStatus") || "Pilih Status" }}</option>
                    <option value="not_resolved">{{ t("appsEventsAlerts.alertsTable.status.unresolved") || "Belum Selesai" }}</option>
                    <option value="resolved">{{ t("appsEventsAlerts.alertsTable.status.resolved") || "Selesai" }}</option>
                    <option value="false_alarm">{{ t("appsEventsAlerts.alertsTable.status.falseAlarm") || "Alarm Palsu" }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.alertDetail.comment") || "Komentar" }}
                  </label>
                  <textarea
                    v-model="localEditForm.comment"
                    rows="4"
                    :placeholder="t('appsEventsAlerts.alertDetail.commentPlaceholder') || 'Masukkan komentar...'"
                    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <!-- Status & Camera (view mode) -->
              <div v-else class="flex flex-wrap items-center gap-3">
                <span
                  class="inline-flex rounded px-2 py-1 text-xs font-semibold"
                  :class="statusBadgeClass(alert.status)"
                  >{{ statusLabel(alert.status) }}</span
                >
                <div class="text-sm text-gray-500">{{ alert.camera_name }}</div>
                <div class="text-sm tabular-nums text-gray-500">
                  {{ formatDuration(alert.duration_minutes) }}
                </div>
              </div>

              <!-- Detected Objects -->
              <div v-if="!localEditMode && alert.detected_objects && alert.detected_objects.length">
                <h6 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  {{ t("appsEventsAlerts.alertDetail.detectedObjects") || "Objek Terdeteksi" }}
                </h6>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div
                    v-for="(obj, i) in alert.detected_objects"
                    :key="i"
                    class="flex h-full flex-col justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div class="mb-1 text-xs font-semibold text-gray-900 uppercase dark:text-gray-100">
                      {{ obj.display_name ?? "-" }}
                    </div>
                    <div class="flex flex-col gap-1 text-xs text-gray-500">
                      <div>
                        {{ t("appsEventsAlerts.alertDetail.detectionCount") || "Jumlah Deteksi" }}:
                        <span class="font-semibold tabular-nums">{{ obj.detection_count || 0 }}</span>
                      </div>
                      <div>
                        {{ t("appsEventsAlerts.alertDetail.duration") || "Durasi (detik)" }}:
                        <span class="font-semibold tabular-nums">{{ formatSecondsShort(obj.duration_seconds) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Event Timing -->
              <div v-if="!localEditMode" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <div class="mb-1 text-xs text-gray-500">
                    {{ t("appsEventsAlerts.alertDetail.eventStart") || "Mulai" }}
                  </div>
                  <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(alert.event_start) }}
                  </div>
                </div>
                <div class="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                  <div class="mb-1 text-xs text-gray-500">
                    {{ t("appsEventsAlerts.alertDetail.eventEnd") || "Selesai" }}
                  </div>
                  <div class="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                    {{ formatDateTime(alert.event_end) }}
                  </div>
                </div>
              </div>

              <!-- Comment (view mode) -->
              <div v-if="!localEditMode">
                <h6 class="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                  {{ t("appsEventsAlerts.alertDetail.comment") || "Komentar" }}
                </h6>
                <div
                  v-if="alert.comment"
                  class="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  {{ alert.comment }}
                </div>
                <div v-else class="text-sm text-gray-500 italic">
                  {{ t("appsEventsAlerts.alertDetail.noComment") || "Tidak ada komentar" }}
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
        {{ t("appsEventsAlerts.alertDetail.noData") || "Data tidak tersedia" }}
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-700">
      <button
        type="button"
        @click="close"
        class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
      >
        {{ t("common.close") || "Tutup" }}
      </button>
      <div class="flex gap-2" v-if="alert">
        <button
          v-if="!localEditMode"
          type="button"
          @click="enableEdit"
          class="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98]"
        >
          <i class="ki-duotone ki-pencil fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ t("common.edit") || "Ubah" }}
        </button>
        <template v-else>
          <button
            type="button"
            :disabled="updating"
            @click="cancelEdit"
            class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ t("common.cancel") || "Batal" }}
          </button>
          <button
            type="button"
            :disabled="updating"
            @click="submitUpdate"
            class="inline-flex items-center gap-1 rounded-md bg-success px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-success-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
          >
            <span
              v-if="updating"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            <i v-else class="ki-duotone ki-check fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ updating ? (t("common.saving") || "Menyimpan...") : (t("common.update") || "Simpan") }}
          </button>
        </template>
      </div>
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
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { formatDateTimeGMT8 } from '@/core/helpers/timezone';
import { badgeVariantClass } from '@/core/helpers/badge';

const props = defineProps<{
  show: boolean;
  alert: any | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e:'close'): void;
  (e:'update', payload:{ status:string; comment:string }): void;
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

const images = computed(() => {
  if (!props.alert) return [] as string[];
  const arr: string[] = [];
  if (props.alert.image_url) arr.push(props.alert.image_url);
  if (Array.isArray(props.alert.image_urls)) {
    props.alert.image_urls.forEach((u:string) => { if (u && !arr.includes(u)) arr.push(u); });
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

// Edit handling
const localEditMode = ref(false);
const localEditForm = ref({ status: '', comment: '' });

watch(() => props.alert, (val) => {
  if (val) {
    localEditMode.value = false;
    localEditForm.value.status = val.status || '';
    localEditForm.value.comment = val.comment || '';
  }
});

const enableEdit = () => { localEditMode.value = true; };
const cancelEdit = () => { localEditMode.value = false; localEditForm.value.comment = props.alert?.comment || ''; localEditForm.value.status = props.alert?.status || ''; };

const updating = ref(false);
const submitUpdate = async () => {
  if (!props.alert?.event_id) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Event ID tidak ditemukan',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  }

  updating.value = true;
  try {
    const payload = {
      status: localEditForm.value.status,
      comment: localEditForm.value.comment,
    };

    await ApiService.post(
      `sites/alerts/${props.alert.event_id}/update`,
      payload
    );

    // Emit update event untuk mengupdate parent
    emit('update', { status: localEditForm.value.status, comment: localEditForm.value.comment });
    localEditMode.value = false;

    // Tampilkan notifikasi sukses
    await Swal.fire({
      icon: 'success',
      title: t('common.success') || 'Berhasil',
      text: t('appsEventsAlerts.alertDetail.updateSuccess') || 'Status dan komentar berhasil diperbarui',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error: any) {
    console.error('Error updating alert:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Gagal memperbarui data',
      toast: true,
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    updating.value = false;
  }
};
const emitClose = () => emit('close');

// Formatting & helpers
const formatDateTime = (value?: string) => {
  if (!value) return '-';
  // Use GMT+8 formatter with Indonesian locale format
  const formatted = formatDateTimeGMT8(value, 'DD/MM/YYYY HH:mm:ss');
  return formatted || value;
};
const formatNumber = (value:number, maximumFractionDigits=1) => new Intl.NumberFormat(undefined, { maximumFractionDigits, minimumFractionDigits:0 }).format(value);
const formatSecondsShort = (seconds?: number | null) => {
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
  if (k==='notresolved') return badgeVariantClass('danger');
  if (k==='resolved') return badgeVariantClass('success');
  if (k==='falsealarm') return badgeVariantClass('info');
  return badgeVariantClass('secondary');
};
const statusLabel = (status:string) => {
  const k = normalizeKey(status);
  if (k==='notresolved') return t('appsEventsAlerts.alertsTable.status.unresolved') || 'Belum Selesai';
  if (k==='resolved') return t('appsEventsAlerts.alertsTable.status.resolved') || 'Selesai';
  if (k==='falsealarm') return t('appsEventsAlerts.alertsTable.status.falseAlarm') || 'Alarm Palsu';
  return status || '-';
};
</script>

<style scoped>
.fade-enter-active,.fade-leave-active { transition: opacity .3s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
</style>
