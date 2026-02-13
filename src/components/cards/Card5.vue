<template>
  <!--begin::Col-->
  <div
    class="flex-shrink-0"
    :class="
      monitorValue !== undefined && monitorValue !== null ? 'flex-fill' : ''
    "
    :style="
      monitorValue !== undefined && monitorValue !== null
        ? 'min-width: 140px;'
        : 'min-width: 160px; width: 160px;'
    "
  >
    <!--begin::Card-->
    <div
      class="card h-100 position-relative"
      :title="title"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
    >
      <!-- Status dot indicator di pojok kanan atas (hanya tampil jika hideStatus = false) -->
      <div v-if="!hideStatus" class="position-absolute top-0 end-0 m-2">
        <div
          class="status-dot"
          :class="currentlyActive ? 'status-active' : 'status-inactive'"
          :title="
            currentlyActive
              ? 'Status: Aktif - Proses sedang berjalan'
              : 'Status: Tidak Aktif - Proses telah selesai atau belum dimulai'
          "
          data-bs-toggle="tooltip"
          data-bs-placement="top"
        ></div>
      </div>

      <!--begin::Card body-->
      <div
        class="card-body d-flex flex-center flex-column p-4"
        style="min-width: 140px"
      >
        <!--begin::Icon-->
        <div class="mb-3">
          <div
            class="symbol symbol-50px symbol-circle"
            :style="{ backgroundColor: bgColor || '#2196f3', border: 'none' }"
          >
            <span class="symbol-label">
              <i
                :class="[icon || 'fas fa-clipboard-list']"
                class="card-icon"
                style="font-size: 20px"
              ></i>
            </span>
          </div>
        </div>
        <!--end::Icon-->

        <!--begin::Title-->
        <div class="text-center mb-2">
          <h4 class="fs-6 fw-bold text-gray-800 mb-0">{{ displayLabel }}</h4>
        </div>
        <!--end::Title-->

        <!--begin::Status-->
        <div v-if="!hideDescription" class="text-center">
          <!-- Jika monitoring mode, tampilkan nilai besar -->
          <div
            v-if="monitorValue !== undefined && monitorValue !== null"
            class="fs-3 fw-bold text-primary mb-0"
          >
            {{ displayBody }}
          </div>
          <!-- Jika aktivitas mode, tampilkan format biasa -->
          <div v-else class="fs-8 text-muted mb-0">{{ displayBody }}</div>

          <div class="fs-9 text-muted">{{ displayDescription }}</div>
        </div>
        <!--end::Status-->
      </div>
      <!--end::Card body-->
    </div>
    <!--end::Card-->
  </div>
  <!--end::Col-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "card-5",
  components: {},
  props: {
    key: String,
    activityName: String,
    lastActivityTimestamp: String,
    currentlyActive: Boolean,
    icon: String,
    bgColor: String,
    title: String, // For hover tooltip
    // Props tambahan untuk monitoring
    monitorValue: [Number, String],
    monitorDescription: String,
    hideStatus: Boolean, // Hide status dot for monitoring cards
    hideDescription: Boolean, // Hide description section completely
  },
  computed: {
    displayLabel() {
      return this.activityName || "Process";
    },
    displayBody() {
      // Jika ada monitorValue, tampilkan dalam format monitoring
      if (this.monitorValue !== undefined && this.monitorValue !== null) {
        return this.monitorValue;
      }

      // Fallback ke format aktivitas biasa
      if (!this.lastActivityTimestamp) return "Aktivitas terakhir: ";

      const timestamp = new Date(this.lastActivityTimestamp);
      const formattedTime = timestamp.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `Aktivitas terakhir: ${formattedTime}`;
    },
    displayDescription() {
      // Jika ada monitorDescription, gunakan itu
      if (this.monitorDescription) {
        return this.monitorDescription;
      }

      // Fallback ke timeAgo untuk aktivitas biasa
      return this.timeAgo;
    },
    timeAgo() {
      if (!this.lastActivityTimestamp) return "Tidak ada data";

      const now = new Date();
      const activityDate = new Date(this.lastActivityTimestamp);
      const diffTime = now.getTime() - activityDate.getTime();

      // Jika waktu aktivitas di masa depan (edge case)
      if (diffTime < 0) return "Baru saja";

      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return `${diffDays} hari yang lalu`;
      }
      if (diffHours > 0) {
        return `${diffHours} jam yang lalu`;
      }
      if (diffMinutes > 0) {
        return `${diffMinutes} menit yang lalu`;
      }
      return "Baru saja";
    },
    statusColor() {
      return this.currentlyActive ? "#4caf50" : "#9e9e9e";
    },
    iconColor() {
      return "text-dark"; // Use dark color for better visibility in light mode
    },
  },
});
</script>

<style scoped>
.card {
  border: 1px solid #e4e6ef;
  position: relative;
  z-index: 1;
}

.symbol {
  transition: all 0.2s ease-in-out;
}

/* Status dot indicator styles */
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  cursor: help;
  animation: pulse 2s infinite ease-in-out;
}

.status-active {
  background-color: #4caf50; /* Green for active */
}

.status-inactive {
  background-color: #9e9e9e; /* Gray for inactive */
  animation: none; /* No pulse for inactive */
}

/* Pulse animation for active status */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

/* Dynamic icon colors based on theme */
.card-icon {
  color: #1a1a1a !important; /* Dark color for light theme */
  opacity: 1 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Dark theme icon colors */
[data-bs-theme="dark"] .card-icon,
.dark .card-icon,
.app-dark .card-icon {
  color: #ffffff !important; /* White color for dark theme */
}

.symbol.symbol-circle {
  border: none !important;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
