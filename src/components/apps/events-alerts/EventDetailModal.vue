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
              t("appsEventsAlerts.eventsModals.details.title") || "Detail Event"
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
          <div v-else-if="event" class="detail-wrapper">
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
                        alt="Event Image"
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
                  <!-- Status & Camera -->
                  <div class="d-flex flex-wrap gap-3 align-items-center">
                    <div>
                      <span class="badge" :class="statusBadge(event.status)">{{
                        statusLabel(event.status)
                      }}</span>
                    </div>
                    <div class="text-muted small">{{ event.camera_name }}</div>
                    <div class="text-muted small">
                      {{ formatDuration(event.duration_minutes) }}
                    </div>
                  </div>

                  <!-- Activities -->
                  <div
                    v-if="event.activities && event.activities.length"
                    class="activities"
                  >
                    <h6 class="section-title">
                      {{
                        t("appsEventsAlerts.eventsModals.details.activities") ||
                        "Aktivitas"
                      }}
                    </h6>
                    <div class="row g-3">
                      <div
                        v-for="(activity, i) in event.activities"
                        :key="i"
                        class="col-md-6"
                      >
                        <div
                          class="activity-card rounded border p-3 h-100 d-flex flex-column justify-content-between"
                        >
                          <div
                            class="fw-semibold text-dark mb-1 text-uppercase small"
                          >
                            {{ activity.activity_name || "-" }}
                          </div>
                          <div class="text-muted small">
                            ID:
                            <span class="fw-semibold">{{
                              activity.activity_uid || "-"
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Event Timing -->
                  <div class="timing row g-3">
                    <div class="col-md-6">
                      <div
                        class="timing-item p-3 rounded border bg-white h-100"
                      >
                        <div class="label small text-muted mb-1">
                          {{
                            t(
                              "appsEventsAlerts.eventsModals.details.startTime"
                            ) || "Mulai"
                          }}
                        </div>
                        <div class="value fw-semibold">
                          {{ formatDateTime(event.event_start) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div
                        class="timing-item p-3 rounded border bg-white h-100"
                      >
                        <div class="label small text-muted mb-1">
                          {{
                            t(
                              "appsEventsAlerts.eventsModals.details.endTime"
                            ) || "Selesai"
                          }}
                        </div>
                        <div class="value fw-semibold">
                          {{ formatDateTime(event.event_end) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div
                        class="timing-item p-3 rounded border bg-white h-100"
                      >
                        <div class="label small text-muted mb-1">
                          {{
                            t(
                              "appsEventsAlerts.eventsModals.details.duration"
                            ) || "Durasi"
                          }}
                        </div>
                        <div class="value fw-semibold">
                          {{ formatDuration(event.duration_minutes) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div
                        class="timing-item p-3 rounded border bg-white h-100"
                      >
                        <div class="label small text-muted mb-1">
                          {{
                            t(
                              "appsEventsAlerts.eventsModals.details.avgDetection"
                            ) || "Rata-rata Deteksi"
                          }}
                        </div>
                        <div class="value fw-semibold">
                          {{ formatSeconds(event.avg_seconds_with_detection) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Event Name -->
                  <div class="event-name-block">
                    <h6 class="section-title">
                      {{
                        t("appsEventsAlerts.eventsModals.details.eventName") ||
                        "Nama Event"
                      }}
                    </h6>
                    <div class="p-3 bg-light rounded border">
                      {{ event.event_name || "-" }}
                    </div>
                  </div>

                  <!-- Images Extra Strip -->
                  <div v-if="images.length > 1" class="small text-muted">
                    Klik gambar utama untuk perbesaran.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-10 text-muted">
            {{
              t("appsEventsAlerts.eventsModals.details.noData") ||
              "Data tidak tersedia"
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
  name: "EventDetailModalComponent",
});

import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { formatDateTimeGMT8 } from "@/core/helpers/timezone";

const props = defineProps<{
  show: boolean;
  event: any | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n();

const images = computed(() => {
  if (!props.event) return [] as string[];
  const arr: string[] = [];
  if (props.event.image_url) arr.push(props.event.image_url);
  if (Array.isArray(props.event.image_urls)) {
    props.event.image_urls.forEach((u: string) => {
      if (u && !arr.includes(u)) arr.push(u);
    });
  }
  return arr;
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
const formatSeconds = (seconds?: number | null) => {
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
  if (k === "active" || k === "unresolved") return "badge-light-danger";
  if (k === "acknowledged") return "badge-light-warning";
  if (k === "resolved" || k === "notresolved") return "badge-light-success";
  if (k === "falsedetection") return "badge-light-info";
  return "badge-light-secondary";
};
const statusLabel = (status: string) => {
  const k = normalizeKey(status);
  if (k === "active")
    return t("appsEventsAlerts.eventsTable.status.active") || "Active";
  if (k === "acknowledged")
    return (
      t("appsEventsAlerts.eventsTable.status.acknowledged") || "Acknowledged"
    );
  if (k === "resolved")
    return t("appsEventsAlerts.eventsTable.status.resolved") || "Resolved";
  if (k === "unresolved" || k === "notresolved")
    return t("appsEventsAlerts.eventsTable.status.unresolved") || "Unresolved";
  if (k === "falsedetection")
    return (
      t("appsEventsAlerts.eventsTable.status.falseDetection") ||
      "False Detection"
    );
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
.activity-card {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  transition: 0.2s;
}
.activity-card:hover {
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
</style>
