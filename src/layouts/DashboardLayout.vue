<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Soon Popover Modal & Blur Overlay -->
    <div v-if="soonPopover.show">
      <div class="soon-popover-blur"></div>
      <div class="soon-popover">
        <div class="soon-popover-title">{{ soonPopover.title }}</div>
        <div class="soon-popover-desc">{{ soonPopover.desc }}</div>
        <div class="soon-popover-desc text-red-600 font-semibold mb-2">
          Fitur ini sedang dalam proses pengerjaan.
        </div>
        <button
          id="soon-popover-close-btn"
          class="soon-popover-close"
          @click="closeSoonPopover"
        >
          Tutup
        </button>
      </div>
    </div>
    <!-- Main content area -->
    <div
      class="flex-1 flex flex-col transition-all duration-300 ease-in-out"
      :class="{ 'ml-64': sidebarOpen && !isMobile }"
    >
      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "DashboardLayoutComponent",
});

import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";

const soonPopover = ref({ show: false, title: "", desc: "" });
// const soonDescriptions = {
//   "Dashboard Analitik":
//     "Fitur ini akan menampilkan analitik dashboard dari berbagai laporan dan data sistem secara visual dan interaktif.",
//   "Laporan AI":
//     "Laporan AI akan menyediakan insight dan hasil analisa dari modul kecerdasan buatan yang terintegrasi.",
//   "Laporan Kustom":
//     "Laporan Kustom memungkinkan Anda membuat laporan sesuai kebutuhan spesifik organisasi.",
//   "Laporan Terjadwal":
//     "Laporan Terjadwal akan mengotomatisasi pembuatan dan pengiriman laporan pada waktu tertentu.",
//   "Export Laporan":
//     "Export Laporan memudahkan Anda mengunduh data laporan dalam berbagai format untuk kebutuhan eksternal.",
// };
// function showSoonPopover(title) {
//   soonPopover.value.title = title;
//   soonPopover.value.desc =
//     soonDescriptions[title] || "Fitur ini sedang dalam proses pengembangan.";
//   soonPopover.value.show = true;
//   nextTick(() => {
//     const btn = document.getElementById("soon-popover-close-btn");
//     if (btn) btn.focus();
//   });
// }
function closeSoonPopover() {
  soonPopover.value.show = false;
}

const route = useRoute();
// const router = useRouter();

const sidebarOpen = ref(true); // Default terbuka, akan diatur ulang di onMounted
const isMobile = ref(false);
// const cameraMenuOpen = ref(false);
// const zoneMenuOpen = ref(false);
const aiMenuOpen = ref(false);
// const eventsMenuOpen = ref(false);
// const recordingMenuOpen = ref(false);
const reportsMenuOpen = ref(false);
// const usersMenuOpen = ref(false);
// const systemMenuOpen = ref(false);
// const integrationMenuOpen = ref(false);

// const toggleSidebar = () => {
//   sidebarOpen.value = !sidebarOpen.value;
// };

// const toggleRecordingMenu = () => {
//   recordingMenuOpen.value = !recordingMenuOpen.value;
// };

// const toggleReportsMenu = () => {
//   reportsMenuOpen.value = !reportsMenuOpen.value;
// };

// const toggleUsersMenu = () => {
//   usersMenuOpen.value = !usersMenuOpen.value;
// };

// const toggleSystemMenu = () => {
//   systemMenuOpen.value = !systemMenuOpen.value;
// };

// const toggleIntegrationMenu = () => {
//   integrationMenuOpen.value = !integrationMenuOpen.value;
// };

// const toggleAIMenu = () => {
//   aiMenuOpen.value = !aiMenuOpen.value;
// };

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 1410;
};

// Function to check current route and open relevant menu
const checkActiveMenu = () => {
  const currentRoute = route.path;

  // AI Analytics menu
  if (currentRoute.includes("ai-analytics")) {
    aiMenuOpen.value = true;
  }
};

// Watch for changes in sidebarOpen and save to localStorage
watch(sidebarOpen, (newValue) => {
  localStorage.setItem("sidebarOpen", newValue);
});

// Watch for route changes and update active menu
watch(
  () => route.path,
  () => {
    // Close all menus first
    aiMenuOpen.value = false;
    reportsMenuOpen.value = false;

    // Then open the relevant menu
    checkActiveMenu();
  }
);

onMounted(() => {
  checkMobile();
  checkActiveMenu();
  window.addEventListener("resize", checkMobile);

  // Responsive sidebar: auto-hide on mobile (<=1024px), show on desktop
  if (isMobile.value) {
    sidebarOpen.value = false;
  } else {
    sidebarOpen.value = true;
  }

  // Load sidebar state from localStorage (optional, can be removed if always want auto)
  const savedSidebarState = localStorage.getItem("sidebarOpen");
  if (savedSidebarState !== null) {
    sidebarOpen.value = JSON.parse(savedSidebarState);
  }

  // Debug log
  console.log(
    "DashboardLayout mounted. SidebarOpen:",
    sidebarOpen.value,
    "isMobile:",
    isMobile.value
  );
});

// Watch isMobile: auto-hide sidebar saat resize ke mobile
watch(isMobile, (val) => {
  if (val) {
    sidebarOpen.value = false;
  } else {
    sidebarOpen.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 6px rgba(251, 191, 36, 0.2);
  }
}
.badge-pulse {
  animation: pulse 1.2s infinite;
}
.soon-popover {
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  color: #222;
  border-radius: 0.5rem;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  padding: 1.5rem 2rem;
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
}
.soon-popover-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.soon-popover-desc {
  font-size: 0.98rem;
  margin-bottom: 1rem;
}
.soon-popover-close {
  background: #fbbf24;
  color: #222;
  border: none;
  border-radius: 0.25rem;
  padding: 0.4rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.soon-popover-close:hover {
  background: #f59e0b;
}
</style>
