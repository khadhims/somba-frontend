<template>
  <!--begin::Col-->
  <div
    class="shrink-0"
    :class="monitorValue !== undefined && monitorValue !== null ? 'flex-1' : ''"
    :style="
      monitorValue !== undefined && monitorValue !== null
        ? 'min-width: 140px;'
        : 'min-width: 160px; width: 160px;'
    "
  >
    <!--begin::Card-->
    <div
      class="relative z-[1] h-full rounded-lg border border-[#e4e6ef] bg-white dark:bg-gray-900"
      :title="title"
    >
      <!-- Status dot indicator di pojok kanan atas (hanya tampil jika hideStatus = false) -->
      <div v-if="!hideStatus" class="absolute right-0 top-0 m-2">
        <div
          class="h-2.5 w-2.5 cursor-help rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          :class="
            currentlyActive
              ? 'animate-[pulse_2s_infinite_ease-in-out] bg-[#4caf50]'
              : 'animate-none bg-[#9e9e9e]'
          "
          :title="
            currentlyActive
              ? 'Status: Aktif - Proses sedang berjalan'
              : 'Status: Tidak Aktif - Proses telah selesai atau belum dimulai'
          "
        ></div>
      </div>

      <!--begin::Card body-->
      <div
        class="flex min-w-[140px] flex-col items-center justify-center p-4"
      >
        <!--begin::Icon-->
        <div class="mb-3">
          <div
            class="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full border-none transition-all duration-200 ease-in-out [backface-visibility:hidden] [transform:translateZ(0)]"
            :style="{ backgroundColor: bgColor || '#2196f3' }"
          >
            <i
              :class="[icon || 'fas fa-clipboard-list']"
              class="text-[20px] text-[#1a1a1a] opacity-100 antialiased dark:text-white"
            ></i>
          </div>
        </div>
        <!--end::Icon-->

        <!--begin::Title-->
        <div class="text-center mb-2">
          <h4 class="mb-0 text-sm font-bold text-gray-800 dark:text-gray-100">
            {{ displayLabel }}
          </h4>
        </div>
        <!--end::Title-->

        <!--begin::Status-->
        <div v-if="!hideDescription" class="text-center">
          <!-- Jika monitoring mode, tampilkan nilai besar -->
          <div
            v-if="monitorValue !== undefined && monitorValue !== null"
            class="mb-0 text-2xl font-bold text-primary"
          >
            {{ displayBody }}
          </div>
          <!-- Jika aktivitas mode, tampilkan format biasa -->
          <div v-else class="mb-0 text-xs text-gray-500">{{ displayBody }}</div>

          <div class="text-[10px] text-gray-500">{{ displayDescription }}</div>
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
  components: {
    /* empty */
  },
  props: {
    itemKey: String,
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
</style>
