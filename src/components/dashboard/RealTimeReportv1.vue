<script setup>
defineOptions({
  name: "RealTimeReportv1Component",
});

import { ref, onMounted, onUnmounted, nextTick } from "vue";

defineProps({
  title: {
    type: String,
    default: "Real Time Report",
  },
  subtitle: {
    type: String,
    default: "Live Process Timeline & Duration Tracking",
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
});

// Filter state for process tracking chart
const selectedStatuses = ref(["active", "completed", "scheduled"]);

// Date picker state
const selectedDate = ref(new Date());
const showDatePicker = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// Generate calendar days
const generateCalendarDays = () => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear.value, currentMonth.value, day));
  }

  return calendarDays;
};

const calendarDays = ref(generateCalendarDays());

// Month navigation
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  calendarDays.value = generateCalendarDays();
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  calendarDays.value = generateCalendarDays();
};

// Select date
const selectDate = (date) => {
  if (date) {
    selectedDate.value = date;
    showDatePicker.value = false;
    // Update chart with selected date
    updateChartWithFilter();
  }
};

// Check if date is today
const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if date is selected
const isSelected = (date) => {
  if (!date) return false;
  return date.toDateString() === selectedDate.value.toDateString();
};

// Format date for display
const formatDate = (date) => {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Month names
const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Day names
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Toggle status filter
const toggleStatusFilter = (status) => {
  const index = selectedStatuses.value.indexOf(status);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(status);
  }

  // Re-render chart with filtered data
  updateChartWithFilter();
};

// Check if status is selected
const isStatusSelected = (status) => {
  return selectedStatuses.value.includes(status);
};

// Store chart instance for updates
let chartInstance = null;

// Video preview state
const videoPreview = ref({
  show: false,
  x: 0,
  y: 0,
  camera: null,
  timestamp: null,
});

// Mock cameras data for the component
const mockCameras = ref([
  {
    id: 1,
    name: "Ruang Ompreng",
    status: "online",
    url: "https://somba-sppg.latto.co.id/api-stream/stream/bbm-1/channel/1/hlsll/live/index.m3u8",
  },
  {
    id: 2,
    name: "Ruang Makan Kantin",
    status: "online",
    url: "https://somba-sppg.latto.co.id/api-stream/stream/bbm-2/channel/1/hlsll/live/index.m3u8",
  },
  {
    id: 3,
    name: "Dapur Atas Westafel",
    status: "online",
    url: "https://somba-sppg.latto.co.id/api-stream/stream/bbm-3/channel/1/hlsll/live/index.m3u8",
  },
  {
    id: 4,
    name: "Lapangan Kantin",
    status: "online",
    url: "https://somba-sppg.latto.co.id/api-stream/stream/bbm-4/channel/1/hlsll/live/index.m3u8",
  },
  {
    id: 5,
    name: "Lorong Kantin",
    status: "online",
    url: "https://somba-sppg.latto.co.id/api-stream/stream/bbm-5/channel/1/hlsll/live/index.m3u8",
  },
]);

// Show video preview on chart hover
const showVideoPreview = (event, data) => {
  console.log("showVideoPreview called with:", { event, data });

  if (data && data.datum) {
    // Calculate which camera should be shown based on the time
    const startTime = new Date(data.datum.start);
    const hour = startTime.getHours();

    // Simple logic: assign camera based on hour of the day
    const cameraIndex = Math.floor((hour - 6) / 2) % mockCameras.value.length;
    const camera = mockCameras.value[cameraIndex];

    console.log("Camera selected:", camera, "for hour:", hour);

    // Calculate progress percentage based on current time vs duration
    const currentTime = new Date();
    const processStart = new Date(data.datum.start);
    const processEnd = new Date(data.datum.end);
    let progressPercentage = 0;

    if (data.datum.status === "completed") {
      progressPercentage = 100;
    } else if (data.datum.status === "active") {
      const totalDuration = processEnd.getTime() - processStart.getTime();
      const elapsed = currentTime.getTime() - processStart.getTime();
      progressPercentage = Math.min(
        Math.max((elapsed / totalDuration) * 100, 0),
        100
      );
    } else if (data.datum.status === "scheduled") {
      progressPercentage = 0;
    }

    // Calculate popup position for the larger combined popup
    const popupWidth = 600; // wider popup for side-by-side layout
    const popupHeight = 350; // taller popup for richer content
    let x = event.pageX + 15;
    let y = event.pageY - 180; // Position slightly above cursor

    // Adjust x position if popup would go off right edge
    if (x + popupWidth > window.innerWidth) {
      x = event.pageX - popupWidth - 15;
    }

    // Adjust y position if popup would go off top edge
    if (y < 0) {
      y = event.pageY + 25; // Position below cursor with some spacing
    }

    // Ensure popup doesn't go off bottom edge
    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - 20;
    }

    const previewData = {
      show: true,
      x: x,
      y: y,
      camera: camera,
      timestamp: data.datum.dynamicTimestamp || data.datum.startTime, // Use dynamic timestamp if available
      process: data.datum.process,
      startTime: data.datum.startTime,
      endTime: data.datum.endTime,
      duration: data.datum.duration,
      status: data.datum.status,
      progress: Math.round(progressPercentage),
      team: data.datum.team || "TEAM 1", // Add default team
    };

    console.log("Setting videoPreview to:", previewData);
    videoPreview.value = previewData;
  }
};

// Hide video preview
const hideVideoPreview = () => {
  videoPreview.value.show = false;
};

// Handle chart mouse events
const setupChartEvents = () => {
  if (chartInstance && chartInstance.view) {
    // Setup proper Vega-Lite signal listeners for mouseover events
    chartInstance.view.addEventListener("mouseover", (event, item) => {
      if (item && item.datum) {
        // Create proper event object with page coordinates
        const syntheticEvent = {
          pageX: event.layerX || event.offsetX,
          pageY: event.layerY || event.offsetY,
          clientX: event.clientX,
          clientY: event.clientY,
        };

        // Convert canvas coordinates to page coordinates
        const chartElement = document.getElementById("process-tracking-chart");
        if (chartElement) {
          const rect = chartElement.getBoundingClientRect();
          syntheticEvent.pageX = rect.left + (event.layerX || event.offsetX);
          syntheticEvent.pageY = rect.top + (event.layerY || event.offsetY);
        }

        showVideoPreview(syntheticEvent, item);
      }
    });

    chartInstance.view.addEventListener("mouseout", () => {
      hideVideoPreview();
    });

    // Enhanced DOM-based event listeners with better data detection
    const chartElement = document.getElementById("process-tracking-chart");
    if (chartElement) {
      chartElement.addEventListener("mousemove", (event) => {
        const rect = chartElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if we're hovering over actual chart data
        let foundMatchingData = false;

        if (chartInstance && chartInstance.view) {
          try {
            const data = chartInstance.view.data("source_0");
            if (data && data.length > 0) {
              // Chart dimensions and margins
              const chartWidth = rect.width - 100; // Account for left/right margins
              const chartHeight = rect.height - 80; // Account for top/bottom margins
              const leftMargin = 80;
              const topMargin = 40;

              // Check if mouse is within chart area
              if (
                x >= leftMargin &&
                x <= leftMargin + chartWidth &&
                y >= topMargin &&
                y <= topMargin + chartHeight
              ) {
                // Calculate time range
                const startOfDay = new Date().setHours(0, 0, 0, 0);
                const endOfDay = new Date().setHours(23, 0, 0, 0);
                const dayDuration = endOfDay - startOfDay;

                // Calculate mouse position relative to chart
                const relativeX = (x - leftMargin) / chartWidth;
                const mouseTime = startOfDay + relativeX * dayDuration;

                // Convert mouseTime to hours and minutes for display
                const mouseDate = new Date(mouseTime);
                const mouseHour = mouseDate.getHours();
                const mouseMinute = mouseDate.getMinutes();
                const mouseTimeString = `${mouseHour
                  .toString()
                  .padStart(2, "0")}:${mouseMinute
                  .toString()
                  .padStart(2, "0")}`;

                // Process categories and their positions - Updated to match new data structure
                const processes = [
                  "Persiapan",
                  "Masak",
                  "Pemorsiran",
                  "Pengiriman",
                  "Ambil Nampan",
                  "Cuci Nampan",
                  "Selesai",
                ];
                const barHeight = chartHeight / processes.length;
                const processIndex = Math.floor((y - topMargin) / barHeight);
                const processName = processes[processIndex];

                if (processIndex >= 0 && processIndex < processes.length) {
                  // Find data items that match the hovered area
                  data.forEach((item) => {
                    if (item.process === processName) {
                      const itemStart = new Date(item.start).getTime();
                      const itemEnd = new Date(item.end).getTime();

                      // Check if mouse time falls within this data item's time range
                      if (mouseTime >= itemStart && mouseTime <= itemEnd) {
                        foundMatchingData = true;

                        // Create modified item with dynamic timestamp based on mouse position
                        const modifiedItem = {
                          ...item,
                          dynamicTimestamp: mouseTimeString, // Add dynamic timestamp
                        };

                        const mockItem = { datum: modifiedItem };
                        showVideoPreview(event, mockItem);
                      }
                    }
                  });
                }
              }
            }
          } catch (error) {
            console.log("Could not access chart data:", error);
          }
        }

        // Hide popup if no matching data found
        if (!foundMatchingData) {
          hideVideoPreview();
        }
      });

      chartElement.addEventListener("mouseleave", () => {
        hideVideoPreview();
      });
    }
  }
};

// Update chart with current filter
const updateChartWithFilter = () => {
  if (chartInstance) {
    const filteredData = generateProcessTrackingData().filter((item) =>
      selectedStatuses.value.includes(item.status)
    );
    chartInstance.view.data("source_0", filteredData).runAsync();

    // Re-setup events after chart update
    setTimeout(() => {
      setupChartEvents();
    }, 500);
  }
};

// Reset all filters
const resetFilters = () => {
  selectedStatuses.value = ["active", "completed", "scheduled"];
  updateChartWithFilter();
};

// Generate process tracking data
const generateProcessTrackingData = () => {
  // Use selected date for data generation
  const baseDate = new Date(selectedDate.value);
  baseDate.setHours(0, 0, 0, 0);

  const processSchedule = [
    // 1. Persiapan
    {
      process: "Persiapan",
      startTime: "02:00",
      endTime: "03:00",
      duration: 1,
      status: "completed",
    },
    // 2. Masak
    {
      process: "Masak",
      startTime: "03:00",
      endTime: "06:00",
      duration: 3,
      status: "completed",
    },
    {
      process: "Masak",
      startTime: "06:00",
      endTime: "09:00",
      duration: 3,
      status: "active",
    },
    {
      process: "Masak",
      startTime: "09:00",
      endTime: "12:00",
      duration: 3,
      status: "scheduled",
    },
    // 3. Pemorsiran
    {
      process: "Pemorsiran",
      startTime: "06:00",
      endTime: "07:00",
      duration: 1,
      status: "completed",
    },
    {
      process: "Pemorsiran",
      startTime: "09:00",
      endTime: "10:00",
      duration: 1,
      status: "active",
    },
    {
      process: "Pemorsiran",
      startTime: "12:00",
      endTime: "13:00",
      duration: 1,
      status: "scheduled",
    },
    // 4. Pengiriman
    {
      process: "Pengiriman",
      startTime: "07:00",
      endTime: "08:00",
      duration: 1,
      status: "completed",
    },
    {
      process: "Pengiriman",
      startTime: "10:00",
      endTime: "11:00",
      duration: 1,
      status: "active",
    },
    {
      process: "Pengiriman",
      startTime: "13:00",
      endTime: "14:00",
      duration: 1,
      status: "scheduled",
    },
    // 5. Ambil Nampan
    {
      process: "Ambil Nampan",
      startTime: "08:00",
      endTime: "09:00",
      duration: 1,
      status: "completed",
    },
    {
      process: "Ambil Nampan",
      startTime: "11:00",
      endTime: "12:00",
      duration: 1,
      status: "active",
    },
    {
      process: "Ambil Nampan",
      startTime: "14:00",
      endTime: "15:00",
      duration: 1,
      status: "scheduled",
    },
    // 6. Cuci Nampan
    {
      process: "Cuci Nampan",
      startTime: "09:00",
      endTime: "10:00",
      duration: 1,
      status: "completed",
    },
    {
      process: "Cuci Nampan",
      startTime: "12:00",
      endTime: "13:00",
      duration: 1,
      status: "active",
    },
    {
      process: "Cuci Nampan",
      startTime: "15:00",
      endTime: "16:00",
      duration: 1,
      status: "scheduled",
    },
    // 7. Selesai
    {
      process: "Selesai",
      startTime: "16:00",
      endTime: "17:00",
      duration: 1,
      status: "scheduled",
    },
  ];

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  return processSchedule.map((item) => {
    // Convert HH:MM time strings to Date objects for selected date
    const startParts = item.startTime.split(":").map(Number);
    const endParts = item.endTime.split(":").map(Number);

    const startDate = new Date(baseDate);
    startDate.setHours(startParts[0], startParts[1], 0);

    const endDate = new Date(baseDate);
    endDate.setHours(endParts[0], endParts[1], 0);

    return {
      ...item,
      startTimeValue: parseTime(item.startTime),
      endTimeValue: parseTime(item.endTime),
      start: startDate, // Add explicit Date objects for the chart
      end: endDate,
      // Add formatted label for display in chart
      label: `${item.startTime}-${item.endTime}`,
      // Add color based on status for the chart
      color:
        item.status === "completed"
          ? "#10B981" // green
          : item.status === "active"
          ? "#3B82F6" // blue
          : "#9CA3AF", // lighter gray for scheduled
    };
  });
};

// Load Vega-Lite library and initialize chart
const loadVegaLite = async () => {
  try {
    // Load Vega-Lite scripts
    await loadScript("https://cdn.jsdelivr.net/npm/vega@5");
    await loadScript("https://cdn.jsdelivr.net/npm/vega-lite@5");
    await loadScript("https://cdn.jsdelivr.net/npm/vega-embed@6");

    // Initialize chart after scripts are loaded
    await nextTick();
    initializeProcessChart();
  } catch (error) {
    console.error("Failed to load Vega-Lite:", error);
  }
};

// Helper function to load scripts
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Initialize process tracking chart
const initializeProcessChart = () => {
  if (!window.vegaEmbed) {
    console.error("Vega-Embed not loaded");
    return;
  }

  // Generate and log the data for debugging
  const chartData = generateProcessTrackingData().filter((item) =>
    selectedStatuses.value.includes(item.status)
  );
  console.log("Chart data:", chartData);
  console.log("Selected statuses:", selectedStatuses.value);

  const processTrackingSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "SOMBA Live Process Tracking - Gantt Chart",
    data: {
      name: "source_0",
      values: chartData,
    },
    mark: {
      type: "bar",
      cornerRadius: 3,
      height: { band: 0.6 },
    },
    encoding: {
      x: {
        field: "start",
        type: "temporal",
        title: "Timeline (Hours)",
        axis: {
          format: "%H:%M",
          grid: true,
          gridColor: "#f0f0f0",
          labelAngle: 0,
          titleFontSize: 12,
          labelFontSize: 10,
        },
        scale: {
          domain: [
            new Date().setHours(0, 0, 0, 0),
            new Date().setHours(23, 59, 59, 999), // End of day
          ],
          nice: false,
          range: "width",
        },
      },
      x2: {
        field: "end",
        type: "temporal",
      },
      y: {
        field: "process",
        type: "nominal",
        title: "Processes",
        axis: {
          titleFontSize: 12,
          labelFontSize: 11,
          labelPadding: 10,
        },
        sort: [
          "Persiapan",
          "Masak",
          "Pemorsiran",
          "Pengiriman",
          "Ambil Nampan",
          "Cuci Nampan",
          "Selesai",
        ],
      },
      color: {
        field: "color",
        type: "nominal",
        scale: null,
        legend: null,
      },
      opacity: {
        condition: {
          test: "datum.status === 'active'",
          value: 1.0,
        },
        value: 0.7,
      },
    },
    width: "container",
    height: 300,
    background: "white",
    config: {
      axis: {
        labelColor: "#374151",
        titleColor: "#111827",
        gridColor: "#e5e7eb",
      },
      view: {
        stroke: "transparent",
      },
    },
    layer: [
      {
        mark: {
          type: "bar",
          cornerRadius: 3,
          height: { band: 0.6 },
        },
      },
      {
        mark: {
          type: "text",
          align: "left",
          baseline: "bottom",
          fontSize: 11,
          fontWeight: "bold",
          dx: 5, // Offset text slightly to the right from start of bar
          dy: -5, // Offset text above the bar
        },
        encoding: {
          x: {
            field: "start",
            type: "temporal",
          },
          y: {
            field: "process",
            type: "nominal",
          },
          text: {
            field: "label",
            type: "nominal",
          },
          color: {
            value: "#111827", // Pure black text for maximum readability
          },
          opacity: {
            condition: {
              test: "datum.duration > 0.5", // Show text for bars longer than 30 minutes
              value: 1,
            },
            value: 0,
          },
        },
      },
    ],
  };

  // Render the process tracking chart
  window
    .vegaEmbed("#process-tracking-chart", processTrackingSpec, {
      theme: "default",
      actions: false,
      tooltip: false, // Disable default tooltip
      renderer: "svg",
      defaultStyle: true,
    })
    .then((result) => {
      console.log("Process tracking chart rendered successfully");

      // Store chart instance for filtering
      chartInstance = result;

      // Setup custom event handlers for video preview
      setTimeout(() => {
        setupChartEvents();
      }, 1000); // Delay to ensure chart is fully rendered

      // Auto-refresh chart every 30 seconds
      setInterval(() => {
        updateChartWithFilter();
      }, 30000);
    })
    .catch(console.error);
};

onMounted(() => {
  // Load Vega-Lite for process tracking chart
  loadVegaLite();
});

onUnmounted(() => {
  // Clean up any intervals or event listeners if needed
  if (chartInstance) {
    chartInstance = null;
  }
});
</script>

<template>
  <!-- Live Process Tracking Chart -->
  <div class="bg-white rounded-lg shadow">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-chart-line text-blue-500 mr-2"></i>{{ title }}
          </h3>
          <!-- Date Picker moved to subtitle area -->
          <div class="relative mt-2">
            <button
              @click="showDatePicker = !showDatePicker"
              class="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <i class="fas fa-calendar text-blue-500"></i>
              <span class="font-medium text-blue-700">{{
                formatDate(selectedDate)
              }}</span>
              <i class="fas fa-chevron-down text-blue-400 text-xs"></i>
            </button>

            <!-- Calendar Dropdown -->
            <div
              v-if="showDatePicker"
              class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4"
              style="min-width: 320px"
            >
              <!-- Calendar Header -->
              <div class="flex items-center justify-between mb-4">
                <button
                  @click="previousMonth"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <h4 class="text-lg font-semibold text-gray-900">
                  {{ monthNames[currentMonth] }} {{ currentYear }}
                </h4>
                <button
                  @click="nextMonth"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>

              <!-- Day Headers -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div
                  v-for="day in dayNames"
                  :key="day"
                  class="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {{ day }}
                </div>
              </div>

              <!-- Calendar Days -->
              <div class="grid grid-cols-7 gap-1">
                <button
                  v-for="(date, index) in calendarDays"
                  :key="index"
                  @click="selectDate(date)"
                  :disabled="!date"
                  :class="[
                    'p-2 text-sm rounded-lg transition-all duration-200',
                    !date ? 'invisible' : 'hover:bg-gray-100',
                    isSelected(date)
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : isToday(date)
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-700',
                  ]"
                >
                  {{ date ? date.getDate() : "" }}
                </button>
              </div>

              <!-- Quick Actions -->
              <div
                class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200"
              >
                <button
                  @click="selectDate(new Date())"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Hari Ini
                </button>
                <button
                  @click="showDatePicker = false"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showFilters" class="flex items-center space-x-4">
          <!-- Status Legend - Interactive -->
          <div class="flex items-center space-x-3 text-xs">
            <button
              @click="toggleStatusFilter('active')"
              :class="[
                'flex items-center px-2 py-1 rounded transition-all cursor-pointer',
                isStatusSelected('active')
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200 opacity-50',
              ]"
            >
              <div
                :class="[
                  'w-3 h-3 rounded-full mr-1',
                  isStatusSelected('active')
                    ? 'opacity-100'
                    : 'bg-blue-300 opacity-50',
                ]"
                style="background-color: #3b82f6"
              ></div>
              <span
                :class="
                  isStatusSelected('active')
                    ? 'text-blue-700 font-medium'
                    : 'text-gray-500'
                "
              >
                Active
              </span>
            </button>
            <button
              @click="toggleStatusFilter('completed')"
              :class="[
                'flex items-center px-2 py-1 rounded transition-all cursor-pointer',
                isStatusSelected('completed')
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200 opacity-50',
              ]"
            >
              <div
                :class="[
                  'w-3 h-3 rounded-full mr-1',
                  isStatusSelected('completed')
                    ? 'opacity-100'
                    : 'bg-green-300 opacity-50',
                ]"
                style="background-color: #10b981"
              ></div>
              <span
                :class="
                  isStatusSelected('completed')
                    ? 'text-green-700 font-medium'
                    : 'text-gray-400'
                "
              >
                Completed
              </span>
            </button>
            <button
              @click="toggleStatusFilter('scheduled')"
              :class="[
                'flex items-center px-2 py-1 rounded transition-all cursor-pointer',
                isStatusSelected('scheduled')
                  ? 'bg-gray-50 border border-gray-300'
                  : 'bg-gray-50 border border-gray-200 opacity-50',
              ]"
            >
              <div
                :class="[
                  'w-3 h-3 rounded-full mr-1',
                  isStatusSelected('scheduled') ? 'opacity-100' : 'opacity-30',
                ]"
                style="background-color: #9ca3af"
              ></div>
              <span
                :class="
                  isStatusSelected('scheduled')
                    ? 'text-gray-700 font-medium'
                    : 'text-gray-400'
                "
              >
                Scheduled
              </span>
            </button>
          </div>
          <!-- Filter Info & Reset -->
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500">
              {{ selectedStatuses.length }}/3 filters active
            </span>
            <button
              v-if="selectedStatuses.length < 3"
              @click="resetFilters"
              class="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 relative w-full">
      <div id="process-tracking-chart" class="w-full h-80"></div>

      <!-- Combined Process & Video Preview Popup -->
      <div
        v-if="videoPreview.show"
        :style="{
          position: 'fixed',
          left: videoPreview.x + 'px',
          top: videoPreview.y + 'px',
          zIndex: 99999,
        }"
        class="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden max-w-2xl"
      >
        <!-- Header -->
        <div
          :class="[
            'p-4',
            videoPreview.status === 'completed'
              ? 'bg-gradient-to-r from-green-400 to-green-500'
              : videoPreview.status === 'active'
              ? 'bg-gradient-to-r from-blue-400 to-blue-500'
              : 'bg-gradient-to-r from-gray-400 to-gray-500',
          ]"
        >
          <div class="flex items-center justify-between text-white">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h3 class="font-semibold text-lg">Live Monitoring</h3>
            </div>
            <div class="text-sm opacity-90">{{ videoPreview.timestamp }}</div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-2 gap-0">
          <!-- Left Side - Process Information -->
          <div class="p-6 bg-gray-50 border-r border-gray-200">
            <div class="space-y-4">
              <!-- Process Title -->
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-4 h-4 rounded-full',
                    videoPreview.status === 'completed'
                      ? 'bg-green-400'
                      : videoPreview.status === 'active'
                      ? 'bg-blue-400'
                      : 'bg-gray-400',
                  ]"
                ></div>
                <h4 class="font-bold text-gray-800 text-lg">
                  {{ videoPreview.process }}
                </h4>
              </div>

              <!-- Process Details -->
              <div class="space-y-3">
                <div class="flex items-center space-x-2">
                  <i class="fas fa-users text-gray-500 w-4"></i>
                  <span class="text-sm text-gray-600">Team:</span>
                  <span class="text-sm font-medium text-gray-800">{{
                    videoPreview.team || "System"
                  }}</span>
                </div>

                <div class="flex items-center space-x-2">
                  <i class="fas fa-clock text-gray-500 w-4"></i>
                  <span class="text-sm text-gray-600">Start Time:</span>
                  <span class="text-sm font-medium text-gray-800">{{
                    videoPreview.startTime
                  }}</span>
                </div>

                <div class="flex items-center space-x-2">
                  <i class="fas fa-stopwatch text-gray-500 w-4"></i>
                  <span class="text-sm text-gray-600">End Time:</span>
                  <span class="text-sm font-medium text-gray-800">{{
                    videoPreview.endTime
                  }}</span>
                </div>

                <div class="flex items-center space-x-2">
                  <i class="fas fa-hourglass-half text-gray-500 w-4"></i>
                  <span class="text-sm text-gray-600">Duration:</span>
                  <span class="text-sm font-medium text-gray-800"
                    >{{ videoPreview.duration
                    }}{{
                      videoPreview.duration === 1 ? " hour" : " hours"
                    }}</span
                  >
                </div>

                <div class="flex items-center space-x-2">
                  <i
                    :class="[
                      'w-4',
                      videoPreview.status === 'completed'
                        ? 'fas fa-check-circle text-green-500'
                        : videoPreview.status === 'active'
                        ? 'fas fa-play-circle text-blue-500'
                        : 'fas fa-clock text-gray-500',
                    ]"
                  ></i>
                  <span class="text-sm text-gray-600">Status:</span>
                  <span
                    :class="[
                      'text-sm font-medium px-2 py-1 rounded-full text-xs',
                      videoPreview.status === 'completed'
                        ? 'text-green-700 bg-green-200'
                        : videoPreview.status === 'active'
                        ? 'text-blue-700 bg-blue-200'
                        : 'text-gray-700 bg-gray-200',
                    ]"
                  >
                    {{
                      videoPreview.status.charAt(0).toUpperCase() +
                      videoPreview.status.slice(1)
                    }}
                  </span>
                </div>
              </div>

              <!-- Activity Progress -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="text-xs text-gray-500 mb-2">Activity Progress</div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    :class="[
                      'h-2 rounded-full transition-all duration-300',
                      videoPreview.status === 'completed'
                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                        : videoPreview.status === 'active'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                        : 'bg-gradient-to-r from-gray-400 to-gray-500',
                    ]"
                    :style="{ width: videoPreview.progress + '%' }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ videoPreview.progress }}%
                  {{
                    videoPreview.status === "completed"
                      ? "Complete"
                      : videoPreview.status === "active"
                      ? "In Progress"
                      : "Pending"
                  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Live Video Monitoring -->
          <div class="p-6 bg-white">
            <div class="space-y-4">
              <!-- Video Header -->
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-gray-800">Live Camera Feed</h4>
                <div class="flex items-center space-x-2 text-xs">
                  <div
                    class="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                  ></div>
                  <span class="text-red-600 font-medium">LIVE</span>
                </div>
              </div>

              <!-- Video Container -->
              <div class="relative">
                <div
                  class="w-full h-40 bg-gray-900 rounded-lg overflow-hidden relative shadow-lg"
                >
                  <video
                    v-if="videoPreview.camera"
                    :key="videoPreview.camera.id"
                    :src="videoPreview.camera.url"
                    autoplay
                    muted
                    playsinline
                    class="w-full h-full object-cover"
                  ></video>

                  <!-- Video Overlays -->
                  <div class="absolute inset-0">
                    <!-- Timestamp overlay -->
                    <div
                      class="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded"
                    >
                      {{ videoPreview.timestamp }}
                    </div>

                    <!-- Camera info overlay -->
                    <div
                      class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                    >
                      <div
                        class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"
                      ></div>
                      <span>REC</span>
                    </div>

                    <!-- AI Detection Badge -->
                    <div
                      class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1"
                    >
                      <i class="fas fa-robot"></i>
                      <span>AI Active</span>
                    </div>
                  </div>
                </div>

                <!-- Camera Info -->
                <div class="mt-3 flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-2">
                    <i class="fas fa-video text-blue-500"></i>
                    <span class="font-medium text-gray-800">{{
                      videoPreview.camera?.name
                    }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-green-600 text-xs font-medium"
                      >Online</span
                    >
                  </div>
                </div>

                <!-- Quick Stats -->
                <div class="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div class="bg-gray-50 p-2 rounded text-center">
                    <div class="text-gray-500">Resolution</div>
                    <div class="font-semibold text-gray-800">1080p HD</div>
                  </div>
                  <div class="bg-gray-50 p-2 rounded text-center">
                    <div class="text-gray-500">FPS</div>
                    <div class="font-semibold text-gray-800">30 fps</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Historical timeline data with live camera feed</span>
            <div class="flex items-center space-x-2">
              <div
                class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
              ></div>
              <span>Real-time monitoring active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
