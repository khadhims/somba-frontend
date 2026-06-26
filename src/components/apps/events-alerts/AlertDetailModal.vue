<template>
  <div
    v-if="show"
    class="modal fade show"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
    @click.self="emitClose"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content shadow-lg">
        <div class="modal-header py-3 px-4 border-0">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <i class="ki-duotone ki-eye fs-2 text-primary"
              ><span class="path1"></span><span class="path2"></span
            ></i>
            {{
              t("appsEventsAlerts.alertDetail.title") || "Detail Pelanggaran"
            }}
          </h5>
          <button
            type="button"
            class="btn btn-sm btn-icon btn-light"
            @click="emitClose"
            aria-label="Close"
          >
            <i class="ki-duotone ki-cross fs-2"
              ><span class="path1"></span><span class="path2"></span
            ></i>
          </button>
        </div>
        <div class="modal-body pt-0 pb-4 px-4">
          <div v-if="loading" class="text-center py-10">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="alert" class="detail-wrapper">
            <div class="row g-5">
              <!-- Left Column: Gallery -->
              <div class="col-lg-5">
                <div class="gallery card border-0 bg-light p-3 h-100">
                  <div class="position-relative main-image-wrapper mb-3">
                    <transition name="fade">
                      <img
                        v-if="currentImage"
                        :key="currentImage"
                        :src="currentImage"
                        class="img-fluid rounded w-100 shadow-sm main-image"
                        alt="Alert Image"
                        @error="onImageError"
                        @click="openLightbox = true"
                        style="
                          cursor: zoom-in;
                          max-height: 340px;
                          object-fit: cover;
                        "
                      />
                      <div
                        v-else
                        class="d-flex align-items-center justify-content-center bg-light rounded"
                        style="height: 340px"
                      >
                        <i class="ki-duotone ki-picture fs-2x text-muted"
                          ><span class="path1"></span><span class="path2"></span
                        ></i>
                      </div>
                    </transition>
                    <!-- Navigation Arrows -->
                    <button
                      v-if="images.length > 1"
                      class="btn btn-sm btn-icon btn-light gallery-nav left"
                      @click="prevImage"
                    >
                      <i class="ki-duotone ki-left fs-2"
                        ><span class="path1"></span><span class="path2"></span
                      ></i>
                    </button>
                    <button
                      v-if="images.length > 1"
                      class="btn btn-sm btn-icon btn-light gallery-nav right"
                      @click="nextImage"
                    >
                      <i class="ki-duotone ki-right fs-2"
                        ><span class="path1"></span><span class="path2"></span
                      ></i>
                    </button>
                    <div
                      v-if="images.length > 1"
                      class="image-index badge badge-light fw-semibold position-absolute bottom-0 end-0 m-2"
                    >
                      {{ currentIndex + 1 }}/{{ images.length }}
                    </div>
                  </div>
                  <!-- Thumbnails -->
                  <div
                    v-if="images.length > 1"
                    class="thumb-strip d-flex gap-2 overflow-auto pb-1"
                  >
                    <div
                      v-for="(img, idx) in images"
                      :key="img + idx"
                      class="thumb position-relative"
                      :class="{ active: idx === currentIndex }"
                      @click="goToImage(idx)"
                    >
                      <img :src="img" alt="thumb" @error="onThumbError" />
                      <span
                        v-if="idx === currentIndex"
                        class="active-indicator"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Info -->
              <div class="col-lg-7">
                <div class="d-flex flex-column gap-4">
                  <!-- Edit Form (when in edit mode) -->
                  <div
                    v-if="localEditMode"
                    class="edit-form-block p-4 border rounded bg-light"
                  >
                    <h6 class="fw-bold mb-3 d-flex align-items-center gap-2">
                      <i class="ki-duotone ki-pencil fs-3 text-primary"
                        ><span class="path1"></span><span class="path2"></span
                      ></i>
                      {{
                        t("appsEventsAlerts.alertDetail.editTitle") ||
                        "Ubah Status & Komentar"
                      }}
                    </h6>
                    <div class="mb-3">
                      <label class="form-label fw-semibold small mb-2">{{
                        t("appsEventsAlerts.alertDetail.status") || "Status"
                      }}</label>
                      <select
                        v-model="localEditForm.status"
                        class="form-select"
                      >
                        <option value="">
                          {{
                            t("appsEventsAlerts.alertsFilters.selectStatus") ||
                            "Pilih Status"
                          }}
                        </option>
                        <option value="not_resolved">
                          {{
                            t(
                              "appsEventsAlerts.alertsTable.status.unresolved"
                            ) || "Belum Selesai"
                          }}
                        </option>
                        <option value="resolved">
                          {{
                            t("appsEventsAlerts.alertsTable.status.resolved") ||
                            "Selesai"
                          }}
                        </option>
                        <option value="false_alarm">
                          {{
                            t(
                              "appsEventsAlerts.alertsTable.status.falseAlarm"
                            ) || "Alarm Palsu"
                          }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="form-label fw-semibold small mb-2">{{
                        t("appsEventsAlerts.alertDetail.comment") || "Komentar"
                      }}</label>
                      <textarea
                        v-model="localEditForm.comment"
                        class="form-control"
                        rows="4"
                        :placeholder="
                          t(
                            'appsEventsAlerts.alertDetail.commentPlaceholder'
                          ) || 'Masukkan komentar...'
                        "
                      />
                    </div>
                  </div>

                  <!-- Status & Camera (view mode) -->
                  <div v-else class="d-flex flex-wrap gap-3 align-items-center">
                    <div>
                      <span class="badge" :class="statusBadge(alert.status)">{{
                        statusLabel(alert.status)
                      }}</span>
                    </div>
                    <div class="text-muted small">{{ alert.camera_name }}</div>
                    <div class="text-muted small">
                      {{ formatDuration(alert.duration_minutes) }}
                    </div>
                  </div>

                  <!-- Detected Objects -->
                  <div
                    v-if="
                      !localEditMode &&
                      alert.detected_objects &&
                      alert.detected_objects.length
                    "
                    class="detected-objects"
                  >
                    <h6 class="section-title">
                      {{
                        t("appsEventsAlerts.alertDetail.detectedObjects") ||
                        "Objek Terdeteksi"
                      }}
                    </h6>
                    <div class="row g-3">
                      <div
                        v-for="(obj, i) in alert.detected_objects"
                        :key="i"
                        class="col-md-6"
                      >
                        <div
                          class="obj-card rounded border p-3 h-100 d-flex flex-column justify-content-between"
                        >
                          <div
                            class="fw-semibold text-dark mb-1 text-uppercase small"
                          >
                            {{ obj.display_name ?? "-" }}
                          </div>
                          <div class="d-flex flex-column gap-1 small">
                            <div class="text-muted">
                              {{
                                t(
                                  "appsEventsAlerts.alertDetail.detectionCount"
                                ) || "Jumlah Deteksi"
                              }}:
                              <span class="fw-semibold">{{
                                obj.detection_count || 0
                              }}</span>
                            </div>
                            <div class="text-muted">
                              {{
                                t("appsEventsAlerts.alertDetail.duration") ||
                                "Durasi (detik)"
                              }}:
                              <span class="fw-semibold">{{
                                formatSecondsShort(obj.duration_seconds)
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Recording -->
                  <div v-if="recordingUrl" class="recording-block">
                    <h6 class="section-title">
                      {{
                        t("appsEventsAlerts.eventsModals.details.recording") ||
                        "Rekaman"
                      }}
                    </h6>
                    <div class="recording-player rounded border bg-white p-2">
                      <video
                        v-if="!videoError"
                        ref="videoPlayer"
                        class="w-100 rounded"
                        controls
                        preload="metadata"
                        playsinline
                        :src="recordingUrl"
                        @error="onVideoError"
                      >
                        Browser tidak mendukung pemutaran video.
                      </video>
                      <div
                        v-else
                        class="d-flex align-items-center justify-content-center text-muted py-6"
                      >
                        {{
                          t(
                            "appsEventsAlerts.eventsModals.details.recordingUnavailable"
                          ) || "Rekaman tidak dapat diputar"
                        }}
                      </div>
                    </div>
                  </div>

                  <!-- Event Timing -->
                  <div v-if="!localEditMode" class="timing row g-3">
                    <div class="col-md-6">
                      <div
                        class="timing-item p-3 rounded border bg-white h-100"
                      >
                        <div class="label small text-muted mb-1">
                          {{
                            t("appsEventsAlerts.alertDetail.eventStart") ||
                            "Mulai"
                          }}
                        </div>
                        <div class="value fw-semibold">
                          {{ formatDateTime(alert.event_start) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div
                        class="timing-item p-3 rounded border bg-white h-100"
                      >
                        <div class="label small text-muted mb-1">
                          {{
                            t("appsEventsAlerts.alertDetail.eventEnd") ||
                            "Selesai"
                          }}
                        </div>
                        <div class="value fw-semibold">
                          {{ formatDateTime(alert.event_end) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Comment (view mode) -->
                  <div v-if="!localEditMode" class="comment-block">
                    <h6 class="section-title">
                      {{
                        t("appsEventsAlerts.alertDetail.comment") || "Komentar"
                      }}
                    </h6>
                    <div
                      v-if="alert.comment"
                      class="p-3 bg-light rounded border"
                    >
                      {{ alert.comment }}
                    </div>
                    <div v-else class="text-muted fst-italic small">
                      {{
                        t("appsEventsAlerts.alertDetail.noComment") ||
                        "Tidak ada komentar"
                      }}
                    </div>
                  </div>

                  <!-- Images Extra Strip when editing -->
                  <div v-if="images.length > 1" class="small text-muted">
                    Klik gambar utama untuk perbesaran.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-muted">
            {{
              t("appsEventsAlerts.alertDetail.noData") || "Data tidak tersedia"
            }}
          </div>
        </div>
        <div
          class="modal-footer border-0 pt-0 px-4 pb-4 d-flex justify-content-between"
        >
          <div>
            <button type="button" class="btn btn-light" @click="emitClose">
              {{ t("common.close") || "Tutup" }}
            </button>
          </div>
          <div class="d-flex gap-2">
            <template v-if="alert">
              <button
                v-if="!localEditMode"
                type="button"
                class="btn btn-primary"
                @click="enableEdit"
              >
                <i class="ki-duotone ki-pencil fs-2 me-1"
                  ><span class="path1"></span><span class="path2"></span
                ></i>
                {{ t("common.edit") || "Ubah" }}
              </button>
              <template v-else>
                <button
                  type="button"
                  class="btn btn-light"
                  :disabled="updating"
                  @click="cancelEdit"
                >
                  {{ t("common.cancel") || "Batal" }}
                </button>
                <button
                  type="button"
                  class="btn btn-success"
                  :disabled="updating"
                  @click="submitUpdate"
                >
                  <span
                    v-if="updating"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i v-else class="ki-duotone ki-check fs-2 me-1"
                    ><span class="path1"></span><span class="path2"></span
                  ></i>
                  {{
                    updating
                      ? t("common.saving") || "Menyimpan..."
                      : t("common.update") || "Simpan"
                  }}
                </button>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="openLightbox"
      class="lightbox"
      @click.self="openLightbox = false"
    >
      <div class="lightbox-inner">
        <img
          :src="currentImage"
          alt="Lightbox"
          class="lightbox-image"
          @error="onImageError"
        />
        <button
          class="btn btn-sm btn-icon btn-light position-absolute top-0 end-0 m-3"
          @click="openLightbox = false"
        >
          <i class="ki-duotone ki-cross fs-2"
            ><span class="path1"></span><span class="path2"></span
          ></i>
        </button>
        <button
          v-if="images.length > 1"
          class="btn btn-icon btn-light position-absolute top-50 start-0 translate-middle-y ms-3"
          @click="prevImage"
        >
          <i class="ki-duotone ki-left fs-2"
            ><span class="path1"></span><span class="path2"></span
          ></i>
        </button>
        <button
          v-if="images.length > 1"
          class="btn btn-icon btn-light position-absolute top-50 end-0 translate-middle-y me-3"
          @click="nextImage"
        >
          <i class="ki-duotone ki-right fs-2"
            ><span class="path1"></span><span class="path2"></span
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AlertDetailModalComponent",
});

import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { formatDateTimeGMT8 } from "@/core/helpers/timezone";

const props = defineProps<{
  show: boolean;
  alert: any | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "update", payload: { status: string; comment: string }): void;
}>();

const { t } = useI18n();

const images = computed(() => {
  if (!props.alert) return [] as string[];
  const arr: string[] = [];
  if (props.alert.image_url) arr.push(props.alert.image_url);
  if (Array.isArray(props.alert.image_urls)) {
    props.alert.image_urls.forEach((u: string) => {
      if (u && !arr.includes(u)) arr.push(u);
    });
  }
  return arr;
});

const recordingUrl = computed(() => props.alert?.recording_url?.trim() || "");
const videoPlayer = ref<HTMLVideoElement | null>(null);
const videoError = ref(false);

watch(
  () => props.show,
  (visible) => {
    if (!visible) {
      videoError.value = false;
      if (videoPlayer.value) {
        videoPlayer.value.pause();
        videoPlayer.value.removeAttribute("src");
        videoPlayer.value.load();
      }
    }
  },
);

watch(recordingUrl, () => {
  videoError.value = false;
});

const currentIndex = ref(0);
const currentImage = computed(() => images.value[currentIndex.value] || "");
const openLightbox = ref(false);

watch(images, (val) => {
  if (currentIndex.value >= val.length) currentIndex.value = 0;
});

const prevImage = () => {
  currentIndex.value =
    (currentIndex.value - 1 + images.value.length) % images.value.length;
};
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};
const goToImage = (idx: number) => {
  currentIndex.value = idx;
};

const onImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = "none";
};
const onThumbError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.classList.add("thumb-error");
};
const onVideoError = () => {
  videoError.value = true;
};

// Edit handling
const localEditMode = ref(false);
const localEditForm = ref({ status: "", comment: "" });

watch(
  () => props.alert,
  (val) => {
    if (val) {
      localEditMode.value = false;
      localEditForm.value.status = val.status || "";
      localEditForm.value.comment = val.comment || "";
    }
  }
);

const enableEdit = () => {
  localEditMode.value = true;
};
const cancelEdit = () => {
  localEditMode.value = false;
  localEditForm.value.comment = props.alert?.comment || "";
  localEditForm.value.status = props.alert?.status || "";
};

const updating = ref(false);
const submitUpdate = async () => {
  if (!props.alert?.event_id) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Event ID tidak ditemukan",
      toast: true,
      position: "top-end",
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
    emit("update", {
      status: localEditForm.value.status,
      comment: localEditForm.value.comment,
    });
    localEditMode.value = false;

    // Tampilkan notifikasi sukses
    await Swal.fire({
      icon: "success",
      title: t("common.success") || "Berhasil",
      text:
        t("appsEventsAlerts.alertDetail.updateSuccess") ||
        "Status dan komentar berhasil diperbarui",
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } catch (error: any) {
    console.error("Error updating alert:", error);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        error.message ||
        "Gagal memperbarui data",
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  } finally {
    updating.value = false;
  }
};
const emitClose = () => emit("close");

// Formatting & helpers
const formatDateTime = (value?: string) => {
  if (!value) return "-";
  // Use GMT+8 formatter with Indonesian locale format
  const formatted = formatDateTimeGMT8(value, "DD/MM/YYYY HH:mm:ss");
  return formatted || value;
};
const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
const formatSecondsShort = (seconds?: number | null) => {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds))
    return t("appsEventsAlerts.format.notAvailable");
  return t("appsEventsAlerts.format.secondsShort", {
    value: formatNumber(Math.max(0, seconds), 1),
  });
};
const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes))
    return t("appsEventsAlerts.format.notAvailable");
  if ((minutes || 0) < 1)
    return t("appsEventsAlerts.format.secondsLong", {
      value: formatNumber(Math.max(0, (minutes || 0) * 60), 2),
    });
  return t("appsEventsAlerts.format.minutesLong", {
    value: formatNumber(Math.max(0, minutes || 0), 2),
  });
};

const normalizeKey = (v?: string) =>
  (v || "").toLowerCase().replace(/[\s_-]/g, "");
const statusBadge = (status: string) => {
  const k = normalizeKey(status);
  if (k === "notresolved") return "badge-light-danger";
  if (k === "resolved") return "badge-light-success";
  if (k === "falsealarm") return "badge-light-info";
  return "badge-light-secondary";
};
const statusLabel = (status: string) => {
  const k = normalizeKey(status);
  if (k === "notresolved")
    return (
      t("appsEventsAlerts.alertsTable.status.unresolved") || "Belum Selesai"
    );
  if (k === "resolved")
    return t("appsEventsAlerts.alertsTable.status.resolved") || "Selesai";
  if (k === "falsealarm")
    return t("appsEventsAlerts.alertsTable.status.falseAlarm") || "Alarm Palsu";
  return status || "-";
};
</script>

<style scoped>
.detail-wrapper {
  min-height: 400px;
}
.section-title {
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-title::before {
  content: "";
  width: 6px;
  height: 18px;
  background: var(--bs-primary);
  border-radius: 4px;
}
.edit-form-block {
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.edit-form-block h6 {
  color: var(--bs-primary);
}
.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.gallery-nav.left {
  left: 10px;
}
.gallery-nav.right {
  right: 10px;
}
.thumb-strip {
  max-height: 80px;
}
.thumb {
  width: 72px;
  height: 60px;
  flex: 0 0 auto;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  border: 2px solid transparent;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumb.active {
  border-color: var(--bs-primary);
}
.active-indicator {
  position: absolute;
  inset: 0;
  box-shadow: 0 0 0 2px var(--bs-primary) inset;
  border-radius: 4px;
}
.thumb-error {
  background: var(--bs-light);
  color: var(--bs-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-inner {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}
.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.obj-card {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  transition: 0.2s;
}
.obj-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.recording-player video {
  max-height: 360px;
  background: #000;
}
</style>
