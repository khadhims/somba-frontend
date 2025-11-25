<script setup>
/**
 * RealTimeReport Component
 * 
 * A comprehensive dashboard component for displaying real-time process tracking
 * with interactive Gantt charts, auto-play functionality, and detailed modals.
 * 
 * Features:
 * - Interactive Gantt chart with Highcharts
 * - Date picker for historical data
 * - Auto-play timeline with popup indicators  
 * - Image modals and detail views
 * - Status filtering and legend
 * - Responsive design with hover effects
 */

import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

// ========================
// COMPONENT CONFIGURATION
// ========================

// Component state
const vegaReady = ref(false);
const isRendering = ref(false);

// Props definition
const props = defineProps({
    title: {
        type: String,
        default: 'Real Time Report'
    },
    subtitle: {
        type: String,
        default: 'Live Process Timeline & Duration Tracking'
    },
    showFilters: {
        type: Boolean,
        default: true
    }
});

// ========================
// REACTIVE STATE
// ========================

// Filter state for process tracking chart
const selectedStatuses = ref(['active', 'completed', 'scheduled']);

// Date picker state
const selectedDate = ref(new Date());
const showDatePicker = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// API data state
const apiData = ref([]);
const isLoading = ref(false);
const apiError = ref(null);

// Chart and playback state
let chartInstance = null;
const isPlaying = ref(false);
const playSpeed = ref(2000); // 2 seconds per step
let playInterval = null;
let currentPlayheadPosition = null;
let playheadPopups = []; // Auto-play popups (temporary)
let hoverPreview = null; // Hover preview popup (single, small)

// Modal states
const showImageModal = ref(false);
const modalImageSrc = ref('');
const modalImageAlt = ref('');
const showDetailModal = ref(false);
const modalDetailData = ref(null);

// Generate calendar days for date picker
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

// ========================
// API AND DATA FUNCTIONS
// ========================

// Filter mockup dataset so it is shown only on its original dates
const filterMockupDataByDate = (dataset, targetDate) => {
    if (!Array.isArray(dataset)) {
        return [];
    }

    const day = targetDate.getDate();
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();

    return dataset.filter((item) => {
        const itemDate = new Date(item.startTime);
        return (
            itemDate.getDate() === day &&
            itemDate.getMonth() === month &&
            itemDate.getFullYear() === year
        );
    });
};

// Fetch activity data from API with mockup fallback
const fetchActivityData = async () => {
    isLoading.value = true;
    apiError.value = null;
    
    try {
        const date = selectedDate.value;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        // Try API call first
        const response = await window.axios.get(`/activity/day`, {
            params: { date: dateStr },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status !== 200) throw new Error('Gagal mengambil data aktivitas');
        
        const data = response.data;
        if (!Array.isArray(data) || data.length === 0) {
            apiData.value = [];
            apiError.value = 'Tidak ada data aktivitas untuk tanggal ini.';
            console.info(`[RealTimeReport] API returned no activity data for ${dateStr}`);
            return;
        }

        apiData.value = data;
        console.log('Successfully loaded data from API:', data);
    } catch (err) {
        console.warn('API call failed, falling back to mockup data:', err?.message || err);
        
        try {
            const mockupModule = await import('@/assets/mockupData/dashboard/event_activity.json');
            const allFallbackData = mockupModule.default || mockupModule;
            const filteredFallback = filterMockupDataByDate(allFallbackData, selectedDate.value);

            if (!filteredFallback.length) {
                apiData.value = [];
                apiError.value = 'Data demo tidak tersedia untuk tanggal ini.';
                console.info('[RealTimeReport] Demo data not available for selected date');
            } else {
                apiData.value = filteredFallback;
                apiError.value = 'Menggunakan data demo (API tidak tersedia).';
                console.log('Successfully loaded fallback mockup data:', filteredFallback);
            }
        } catch (fallbackErr) {
            console.error('Both API and mockup data failed:', fallbackErr);
            apiError.value = 'Tidak dapat memuat data aktivitas.';
            apiData.value = [];
        }
    } finally {
        isLoading.value = false;
    }
};

// Generate process tracking data (now supports mapping original process names)
const generateProcessTrackingData = () => {
    const rawData = apiData.value;

    const processMap = {
        'Masak': 'Masak',
        'Persiapan': 'Persiapan',
        'Pemorsian': 'Pemorsian',
        'Pemorsiran': 'Pemorsian', // typo mapping (if typo comes from API)
        'Pengiriman': 'Pengiriman',
        'Ambil Nampan': 'Ambil Nampan',
        'Cuci Nampan': 'Cuci Nampan',
        'Selesai': 'Selesai'
    };

    const getCanonicalProcess = (original) => {
        if (!original) return 'Lainnya';
        const base = original.split(' - ')[0].trim();
        return processMap[base] || 'Lainnya';
    };

    // Parse ISO8601 string and add 6 hours for local timezone adjustment
    const parseTimeAdd6Hours = (timeStr) => {
        if (!timeStr) return null;
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) return null;
        
        // Add 6 hours for timezone adjustment
        date.setHours(date.getHours() + 6);
        
        // Store display time in local format
        const localHour = date.getHours();
        const localMinute = date.getMinutes();
        date.displayTime = `${localHour.toString().padStart(2, '0')}:${localMinute.toString().padStart(2, '0')}`;
        date.originalHour = localHour;
        date.originalMinute = localMinute;
        return date;
    };

    const validData = [];
    rawData.forEach((item, idx) => {
        const process = getCanonicalProcess(item.process);
        // Skip unknown processes (mapped to 'Lainnya')
        if (process === 'Lainnya') {
            return;
        }
        let start, end;
        let valid = true;
        try {
            start = parseTimeAdd6Hours(item.startTime);
            end = parseTimeAdd6Hours(item.endTime);
            
            // Validate local time: should be between 00:00 and 23:59
            if (
                isNaN(start.getTime()) || isNaN(end.getTime()) ||
                start.getHours() < 0 || start.getHours() > 23 ||
                end.getHours() < 0 || end.getHours() > 23 ||
                start.getMinutes() < 0 || start.getMinutes() > 59 ||
                end.getMinutes() < 0 || end.getMinutes() > 59
            ) {
                valid = false;
            }
        } catch (e) {
            valid = false;
        }
        if (!valid) {
            return;
        }
        validData.push({
            ...item,
            process,
            start,
            end,
            label: '',
            color: item.status === 'completed' ? '#10B981' :
                   item.status === 'active' ? '#3B82F6' :
                   '#9CA3AF'
        });
    });
    return validData;
};

// ========================
// UTILITY FUNCTIONS
// ========================

// Select date and fetch data
const selectDate = async (date) => {
    if (date) {
        selectedDate.value = date;
        showDatePicker.value = false;
        await fetchActivityData();
        // Chart will be rendered automatically by watcher
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
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Month names
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Day names
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// ========================
// FILTER FUNCTIONS
// ========================

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

// ========================
// DATE AND CALENDAR FUNCTIONS
// ========================
const setupChartEvents = () => {
    if (!chartInstance) return;

    const chart = chartInstance;
    let hoverTimeout = null;

    // Add mouse move event for hover preview
    chart.container.addEventListener('mousemove', (e) => {
        if (isPlaying.value) return; // Don't show preview during auto-play

        clearTimeout(hoverTimeout);

        // Small delay to prevent flickering
        hoverTimeout = setTimeout(() => {
            const point = chart.series[0].searchPoint(e, true);

            if (point && point.visible !== false && point.status !== 'dummy') {
                const rect = chart.container.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                showHoverPreview(point, mouseX, mouseY);
            } else {
                hideHoverPreview();
            }
        }, 50);
    });

    // Add mouse leave event
    chart.container.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hideHoverPreview();
    });

    // Add click event for opening detail modal - use plotOptions for better event handling
    chart.update({
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                            if (isPlaying.value) return; // Don't allow modal during auto-play

                            const point = this;
                            console.log('[RealTimeReport] Point clicked:', point.name, point);

                            // Open detail modal instead of pinned popup
                            openDetailModal(point);
                        }
                    }
                }
            }
        }
    }, true);

    // Remove pinned popup event handling since we're using modal now
};// Update chart with current filter
const updateChartWithFilter = () => {
    if (!chartInstance) {
        return;
    }

    const filteredData = generateProcessTrackingData().filter(item =>
        selectedStatuses.value.includes(item.status)
    );

    try {
        // For Highcharts Gantt, we need to update the series data
        if (chartInstance.series && chartInstance.series[0]) {
            chartInstance.series[0].setData(filteredData.map((item, idx) => ({
                id: 'task-' + idx,
                name: item.process,
                start: item.start.getTime(),
                end: item.end.getTime(),
                y: ["Persiapan", "Masak", "Pemorsian", "Pengiriman", "Ambil Nampan", "Cuci Nampan", "Selesai"].indexOf(item.process),
                color: item.color,
                status: item.status,
                visible: true,
                image_path: item.image_path
            })), true);
        }
    } catch (error) {
        console.error('Error updating chart data:', error);
    }
    
    setupChartEvents();
};

// Reset all filters
const resetFilters = () => {
    selectedStatuses.value = [];
    updateChartWithFilter();
};

// ========================
// AUTO-PLAY FUNCTIONS
// ========================

// Start auto-play functionality
const startAutoPlay = () => {
    if (!chartInstance || isPlaying.value) return;

    isPlaying.value = true;

    // Clear any hover previews and detail modal during auto-play
    hideHoverPreview();
    closeDetailModal();

    // Disable chart tooltip during auto-play to prevent overlap
    if (chartInstance && chartInstance.tooltip) {
        chartInstance.tooltip.enabled = false;
    }
    // Also update chart options to ensure tooltip is disabled
    if (chartInstance && chartInstance.update) {
        chartInstance.update({
            tooltip: {
                enabled: false
            }
        }, true, false);
    }

    const xAxis = chartInstance.xAxis[0];
    const extremes = xAxis.getExtremes();
    const dayStart = extremes.dataMin;
    const dayEnd = extremes.dataMax;
    const stepSize = 10 * 60 * 1000; // 10 minutes in milliseconds
    const viewWindowSize = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    let currentPosition = extremes.min || dayStart; // Start from current position or beginning

    playInterval = setInterval(() => {
        if (!chartInstance || !isPlaying.value) {
            stopAutoPlay();
            return;
        }

        // Check if we've reached the end
        if (currentPosition + viewWindowSize >= dayEnd) {
            // Reset to beginning and continue
            currentPosition = dayStart;
        }

        // Move the view window
        const newMin = currentPosition;
        const newMax = Math.min(currentPosition + viewWindowSize, dayEnd);

        // Update chart view with smooth animation
        xAxis.setExtremes(newMin, newMax, true, true);

        // Calculate playhead position (center of view window)
        const playheadTime = currentPosition + (viewWindowSize / 2);
        currentPlayheadPosition = playheadTime;

        // Check for data at playhead position and show popup
        checkDataAtPlayhead(playheadTime);

        // Move to next position
        currentPosition += stepSize;

    }, playSpeed.value);
};

const stopAutoPlay = () => {
    isPlaying.value = false;
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    currentPlayheadPosition = null;
    hidePlayheadPopups();

    // Re-enable chart tooltip after auto-play stops
    if (chartInstance && chartInstance.tooltip) {
        chartInstance.tooltip.enabled = true;
    }
    // Also update chart options to ensure tooltip is re-enabled
    if (chartInstance && chartInstance.update) {
        chartInstance.update({
            tooltip: {
                enabled: true
            }
        }, true, false);
    }
};const toggleAutoPlay = () => {
    if (isPlaying.value) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
};

// ========================
// POPUP FUNCTIONS
// ========================

// Check for data at playhead position and show popup
const checkDataAtPlayhead = (playheadTime) => {
    if (!chartInstance) return;

    // Get filtered chart data
    const chartData = generateProcessTrackingData().filter(item =>
        selectedStatuses.value.includes(item.status)
    );

    // Find data points that intersect with playhead (within 5 minute tolerance)
    const tolerance = 5 * 60 * 1000; // 5 minutes
    const dataAtPlayhead = chartData.filter(item => {
        return playheadTime >= (item.start.getTime() - tolerance) &&
               playheadTime <= (item.end.getTime() + tolerance);
    });

    if (dataAtPlayhead.length > 0) {
        // Group data by process/row to show only one popup per row
        const groupedByProcess = {};
        dataAtPlayhead.forEach(item => {
            // Only keep the first (or most relevant) data for each process
            if (!groupedByProcess[item.process]) {
                groupedByProcess[item.process] = item;
            }
        });

        // Convert back to array and sort by process order (top to bottom on chart)
        const processList = ["Persiapan", "Masak", "Pemorsian", "Pengiriman", "Ambil Nampan", "Cuci Nampan", "Selesai"];
        const uniqueDataPoints = Object.values(groupedByProcess)
            .sort((a, b) => processList.indexOf(a.process) - processList.indexOf(b.process));

        // Show popups for unique processes only, arranged side by side
        showMultiplePlayheadPopups(uniqueDataPoints, playheadTime);
    } else {
        // Hide popup if no data
        hidePlayheadPopups();
    }
};

// Show multiple popups side by side for multiple data points
const showMultiplePlayheadPopups = (dataPoints, playheadTime) => {
    if (!chartInstance) return;

    const chart = chartInstance;
    const xAxis = chart.xAxis[0];

    // Clear existing popups
    hidePlayheadPopups();

    // Calculate playhead position
    const playheadX = xAxis.toPixels(playheadTime);

    // Popup dimensions
    const popupWidth = 200;
    const popupSpacing = 20; // Changed from 15 to 20px
    const totalWidth = (popupWidth + popupSpacing) * dataPoints.length - popupSpacing;

    // Position all popups behind (to the left of) the playhead
    let startX = playheadX - totalWidth - 30; // All popups positioned behind playhead with 30px gap

    dataPoints.forEach((dataPoint, index) => {
        const yAxis = chart.yAxis[0];
        // Use the y position from the chart data (which corresponds to process order)
        const dataY = yAxis.toPixels(dataPoint.y);

        // Calculate position for this popup
        const popupX = startX + (popupWidth + popupSpacing) * index;
        // Position popup slightly above the data row
        const popupY = dataY - 60;

        // Ensure popup stays within chart bounds
        const finalX = Math.max(chart.plotLeft + 10, Math.min(popupX, chart.plotLeft + chart.plotWidth - popupWidth - 10));
        const finalY = Math.max(chart.plotTop + 10, Math.min(popupY, chart.plotTop + chart.plotHeight - 200));

        // Create popup for this data point
        const popup = createSinglePlayheadPopup(dataPoint, finalX, finalY, chart, index);
        playheadPopups.push(popup);
    });

    // Add event listeners for all popup images after a short delay to ensure DOM is ready
    setTimeout(() => {
        dataPoints.forEach((dataPoint, index) => {
            if (dataPoint.image_path) {
                const uniqueImageId = `popup-image-${dataPoint.process.replace(/\s+/g, '-')}-${index}`;
                const imageElement = document.getElementById(uniqueImageId);
                if (imageElement) {
                    imageElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const imgUrl = `https://somba-sppg.latto.co.id/cdn/notif${dataPoint.image_path}`;
                        modalImageSrc.value = imgUrl;
                        modalImageAlt.value = `Rekaman ${dataPoint.process}`;
                        showImageModal.value = true;
                    });
                }
            }
        });
    }, 200);
};

// Create a single popup element
const createSinglePlayheadPopup = (dataPoint, x, y, chart, index) => {
    // Create accurate time display from actual data timestamps
    const startDate = new Date(dataPoint.start.getTime());
    const endDate = new Date(dataPoint.end.getTime());

    const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    // Calculate accurate duration in hours and minutes
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = durationHours > 0 ?
        `${durationHours} jam ${durationMinutes} menit` :
        `${durationMinutes} menit`;

    // Generate unique ID for this popup
    const popupId = `playhead-popup-${index}`;

    // Create popup content with clickable image
    let popupContent = `
        <div style="
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            border: 1px solid #e2e8f0;
            max-width: 200px;
            font-family: 'Inter', sans-serif;
        ">
            <div style="
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                padding: 8px 10px;
                margin: -12px -12px 8px -12px;
                border-radius: 8px 8px 0 0;
                font-size: 12px;
                font-weight: 600;
            ">
                ${dataPoint.process}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
                <i class="fas fa-clock" style="margin-right: 4px;"></i>
                ${startTime} - ${endTime}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
                Durasi: ${duration}
            </div>`;

    // Add image thumbnail if available
    if (dataPoint.image_path) {
        const imgUrl = `https://somba-sppg.latto.co.id/cdn/notif${dataPoint.image_path}`;
        const uniqueImageId = `popup-image-${dataPoint.process.replace(/\s+/g, '-')}-${index}`;
        popupContent += `
            <div style="margin-bottom: 8px;">
                <div style="
                    font-size: 10px;
                    color: #64748b;
                    margin-bottom: 4px;
                    font-weight: 500;
                ">
                    <i class="fas fa-camera" style="margin-right: 3px;"></i>
                    Rekaman
                </div>
                <div id="${uniqueImageId}" style="
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border: 1px solid #e2e8f0;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"
                   onclick="window.openImageModal('${imgUrl}', 'Rekaman ${dataPoint.process}')"
                   data-image-url="${imgUrl}" data-image-alt="Rekaman ${dataPoint.process}">
                    <img src='${imgUrl}'
                         alt='Rekaman ${dataPoint.process}'
                         style='
                             width: 100%;
                             height: 80px;
                             object-fit: cover;
                             display: block;
                         '
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    />
                    <div style="
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        background: rgba(0,0,0,0.6);
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 8px;
                    ">
                        <i class="fas fa-expand"></i>
                    </div>
                    <div style="
                        display: none;
                        padding: 12px;
                        text-align: center;
                        background: #f8fafc;
                        color: #9ca3af;
                        font-size: 10px;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        height: 80px;
                    ">
                        <i class="fas fa-image" style="font-size: 16px; margin-bottom: 4px;"></i>
                        <span>Tidak tersedia</span>
                    </div>
                </div>
            </div>`;

        // Note: Event listener will be added in showMultiplePlayheadPopups function
    } else {
        popupContent += `
            <div style="
                text-align: center;
                padding: 12px;
                background: #f8fafc;
                border-radius: 6px;
                color: #9ca3af;
                font-size: 10px;
                border: 1px dashed #cbd5e1;
                margin-bottom: 8px;
            ">
                <i class="fas fa-camera-slash" style="font-size: 14px; margin-bottom: 4px; display: block;"></i>
                <span>Tidak ada rekaman</span>
            </div>`;
    }

    popupContent += `
            <div style="
                display: inline-block;
                background: ${dataPoint.status === 'completed' ? '#ecfdf5' : dataPoint.status === 'active' ? '#eff6ff' : '#f3f4f6'};
                color: ${dataPoint.status === 'completed' ? '#10b981' : dataPoint.status === 'active' ? '#3b82f6' : '#6b7280'};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 500;
                text-transform: capitalize;
            ">
                <i class="fas fa-circle" style="font-size: 6px; margin-right: 4px;"></i>
                ${dataPoint.status}
            </div>
        </div>
    `;

    // Create popup element
    const popup = chart.renderer.label(
        popupContent,
        x,
        y,
        'rect',
        null,
        null,
        true // useHTML
    )
    .attr({
        fill: 'rgba(255, 255, 255, 0.98)',
        stroke: '#e2e8f0',
        'stroke-width': 1,
        r: 8,
        zIndex: 20,
        padding: 0,
        id: popupId
    })
    .css({
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px'
    })
    .add();

    return { popup, triangle: null };
};

// Hide all playhead popups
const hidePlayheadPopups = () => {
    playheadPopups.forEach(({ popup, triangle }) => {
        if (popup) {
            popup.destroy();
        }
        if (triangle) {
            triangle.destroy();
        }
    });
    playheadPopups = [];

    // Remove triangle elements and cleanup image event listeners
    if (chartInstance && chartInstance.container) {
        const triangles = chartInstance.container.querySelectorAll('[data-popup-triangle]');
        triangles.forEach(triangle => {
            if (triangle.parentNode) {
                triangle.parentNode.removeChild(triangle);
            }
        });

        // Clean up any popup image elements with event listeners
        const popupImages = chartInstance.container.querySelectorAll('[id^="popup-image-"], [id^="tooltip-image-"]');
        popupImages.forEach(imageElement => {
            if (imageElement.parentNode) {
                imageElement.parentNode.removeChild(imageElement);
            }
        });
    }
};

// ========================
// MODAL FUNCTIONS
// ========================

// Global function to open image modal (accessible from HTML onclick)
window.openImageModal = (imageSrc, imageAlt) => {
    modalImageSrc.value = imageSrc;
    modalImageAlt.value = imageAlt;
    showImageModal.value = true;
};

// Global function to download image directly from URL (accessible from HTML onclick)
window.downloadImageFromUrl = async (imageSrc, imageAlt) => {
    try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${imageAlt.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

// Hover Preview Functions (Small popup)
const showHoverPreview = (point, mouseX, mouseY) => {
    hideHoverPreview(); // Clear any existing preview

    if (!chartInstance) return;

    // Calculate display times
    const startDate = new Date(point.start);
    const endDate = new Date(point.end);
    const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    // Create small hover preview content
    let previewContent = `
        <div style="
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            padding: 8px 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid #e2e8f0;
            max-width: 180px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
        ">
            <div style="
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 3px;
                font-size: 12px;
            ">
                ${point.name}
            </div>
            <div style="color: #6b7280; margin-bottom: 4px;">
                ${startTime} - ${endTime}
            </div>`;

    // Add small thumbnail if image exists
    if (point.image_path) {
        const imgUrl = `https://somba-sppg.latto.co.id/cdn/notif${point.image_path}`;
        previewContent += `
            <div style="
                width: 60px;
                height: 40px;
                border-radius: 4px;
                overflow: hidden;
                border: 1px solid #e5e7eb;
                margin-bottom: 4px;
            ">
                <img src='${imgUrl}'
                     style='width: 100%; height: 100%; object-fit: cover;'
                     onerror="this.style.display='none';"
                />
            </div>`;
    }

    // Add status badge
    const statusColor = point.status === 'completed' ? '#10b981' :
                       point.status === 'active' ? '#3b82f6' : '#6b7280';
    const statusBg = point.status === 'completed' ? '#ecfdf5' :
                    point.status === 'active' ? '#eff6ff' : '#f3f4f6';

    previewContent += `
            <div style="
                display: inline-block;
                background: ${statusBg};
                color: ${statusColor};
                padding: 1px 6px;
                border-radius: 8px;
                font-size: 9px;
                font-weight: 500;
                text-transform: capitalize;
            ">
                ${point.status}
            </div>
            <div style="
                font-size: 9px;
                color: #9ca3af;
                margin-top: 4px;
                text-align: center;
            ">
                Click untuk detail
            </div>
        </div>
    `;

    // Position preview near mouse but within chart bounds
    const chart = chartInstance;
    const previewX = Math.min(mouseX + 15, chart.plotLeft + chart.plotWidth - 180);
    const previewY = Math.max(mouseY - 60, chart.plotTop + 10);

    // Create hover preview popup
    hoverPreview = chart.renderer.label(
        previewContent,
        previewX,
        previewY,
        'rect',
        null,
        null,
        true // useHTML
    )
    .attr({
        fill: 'rgba(255, 255, 255, 0.95)',
        stroke: '#e2e8f0',
        'stroke-width': 1,
        r: 8,
        zIndex: 25,
        padding: 0
    })
    .add();
};

const hideHoverPreview = () => {
    if (hoverPreview) {
        hoverPreview.destroy();
        hoverPreview = null;
    }
};

// Detail Modal Functions
const openDetailModal = (point) => {
    modalDetailData.value = point;
    showDetailModal.value = true;
};

const closeDetailModal = () => {
    showDetailModal.value = false;
    modalDetailData.value = null;
};

// Function to open image modal from detail modal
const openImageFromDetail = (imageSrc, imageAlt) => {
    modalImageSrc.value = imageSrc;
    modalImageAlt.value = imageAlt;
    showImageModal.value = true;
    // Keep detail modal open in background
};

// Helper functions for modal display
const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatDuration = (point) => {
    const startDate = new Date(point.start);
    const endDate = new Date(point.end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return durationHours > 0 ?
        `${durationHours} jam ${durationMinutes} menit` :
        `${durationMinutes} menit`;
};

// Function to download image from URL (used in modal)
const downloadImageFromUrl = async (imageUrl, fileName) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

// Function to download image
const downloadImage = async () => {
    try {
        const response = await fetch(modalImageSrc.value);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${modalImageAlt.value}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

// Close image modal
const closeImageModal = () => {
    showImageModal.value = false;
    modalImageSrc.value = '';
    modalImageAlt.value = '';
};// ========================
// CHART RENDERING FUNCTIONS
// ========================

// Load Highcharts Gantt library and initialize chart
const loadHighchartsGantt = async () => {
    try {
        await loadScript('https://code.highcharts.com/gantt/highcharts-gantt.js');
        await loadScript('https://code.highcharts.com/modules/exporting.js');
        await loadScript('https://code.highcharts.com/modules/accessibility.js');
        vegaReady.value = true;
        await nextTick();
        
        if (apiData.value && apiData.value.length > 0) {
            setTimeout(() => {
                renderHighchartsGantt();
            }, 100);
        }
    } catch (error) {
        console.error('Failed to load Highcharts Gantt:', error);
    }
};

// Helper function to load scripts
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Render Highcharts Gantt chart with timeline bar, zoom, and current time indicator
const renderHighchartsGantt = () => {
    const chartContainer = document.getElementById('process-tracking-chart');
    if (!chartContainer) {
        console.error('Chart container #process-tracking-chart not found');
        return;
    }
    
    // Destroy previous chart if any
    if (chartInstance && chartInstance.destroy) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const chartData = generateProcessTrackingData().filter(item =>
        selectedStatuses.value.includes(item.status)
    );

    // Map to Highcharts Gantt format
    const processList = ["Persiapan", "Masak", "Pemorsian", "Pengiriman", "Ambil Nampan", "Cuci Nampan", "Selesai"];
    const categories = processList;
    
    let sortedChartData = chartData
        .filter(item => processList.includes(item.process))
        .sort((a, b) => processList.indexOf(a.process) - processList.indexOf(b.process) || a.start - b.start);
        
    let seriesData = sortedChartData.map((item, idx) => {
        // Get display times directly from the actual Date objects for consistency
        const startDisplayTime = `${item.start.getHours().toString().padStart(2, '0')}:${item.start.getMinutes().toString().padStart(2, '0')}`;
        const endDisplayTime = `${item.end.getHours().toString().padStart(2, '0')}:${item.end.getMinutes().toString().padStart(2, '0')}`;

        // Calculate duration for consistency
        const durationMs = item.end.getTime() - item.start.getTime();
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const calculatedDuration = durationHours > 0 ?
            `${durationHours}.${Math.round(durationMinutes/60*10)/10}` :
            `0.${Math.round(durationMinutes/60*10)/10}`;

        return {
            id: 'task-' + idx,
            name: item.process,
            start: item.start.getTime(),
            end: item.end.getTime(),
            y: categories.indexOf(item.process),
            color: item.color,
            status: item.status,
            visible: true,
            // Store actual calculated times for tooltip consistency
            displayStartTime: startDisplayTime,
            displayEndTime: endDisplayTime,
            // Store image path and calculated duration for tooltip
            image_path: item.image_path,
            duration: calculatedDuration,
            // Store the original Date objects for accurate calculations
            startDate: item.start,
            endDate: item.end
        };
    });
    // Set range for the selected day in local time (WIB/GMT+7)
    let selectedDay = new Date(selectedDate.value);

    // Create date objects for start and end of the day in local time
    let dayStart = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), 0, 0, 0, 0);
    let dayEnd = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate(), 23, 59, 59, 999);

    // Use timestamps for chart range
    let xMin = dayStart.getTime();
    let xMax = dayEnd.getTime();

    // Add dummy points for processes without data to maintain Y-axis structure
    processList.forEach((proc, i) => {
        if (!seriesData.some(d => d.y === i)) {
            seriesData.push({
                id: 'dummy-' + i,
                name: proc,
                start: xMin,
                end: xMin + 60 * 1000, // 1 minute
                y: i,
                color: 'rgba(0,0,0,0)',
                status: 'dummy',
                visible: false
            });
        }
    });
    
    // Sort to maintain consistent Y order
    seriesData = seriesData.sort((a, b) => a.y - b.y || a.start - b.start);
    
    // Current time indicator for today only
    const now = new Date();
    const isToday = now.toDateString() === selectedDay.toDateString();

    // Ensure that data bounds are strictly within the selected day
    seriesData = seriesData.map(item => {
        // Restrict any out-of-bounds data
        item.start = Math.max(item.start, xMin);
        item.end = Math.min(item.end, xMax);
        return item;
    });
    chartInstance = window.Highcharts.ganttChart(chartContainer, {
        chart: {
            height: 350,
            backgroundColor: '#fff',
            zoomType: null, // Disable zoom to prioritize panning
            panning: {
                enabled: true,
                type: 'x'
            },
            panKey: 'normal', // Allow panning without any key
            events: {
                load: function () {
                    this.setTitle(null);

                    // Add mouse wheel zoom functionality
                    const chart = this;
                    chart.container.addEventListener('wheel', function(e) {
                        e.preventDefault();
                        const delta = e.deltaY > 0 ? 0.1 : -0.1;
                        const extremes = chart.xAxis[0].getExtremes();
                        const range = extremes.max - extremes.min;
                        const center = (extremes.max + extremes.min) / 2;
                        const newRange = range * (1 + delta);
                        const newMin = center - newRange / 2;
                        const newMax = center + newRange / 2;

                        // Prevent zooming out beyond day bounds
                        const dayStart = xMin;
                        const dayEnd = xMax;
                        if (newMin >= dayStart && newMax <= dayEnd) {
                            chart.xAxis[0].setExtremes(newMin, newMax, true, false);
                        }
                    });

                    // Add playhead line for auto-play mode
                    chart.playheadLine = null;

                    // Setup interactive events after chart is loaded
                    setTimeout(() => {
                        setupChartEvents();
                    }, 100);
                },
                redraw: function() {
                    // Update playhead line position during auto-play
                    const chart = this;
                    if (isPlaying.value && currentPlayheadPosition && chart.xAxis && chart.xAxis[0]) {
                        const xAxis = chart.xAxis[0];
                        const extremes = xAxis.getExtremes();

                        // Only show playhead if it's within the current view
                        if (currentPlayheadPosition >= extremes.min && currentPlayheadPosition <= extremes.max) {
                            // Remove existing playhead line
                            if (chart.playheadLine) {
                                chart.playheadLine.destroy();
                            }

                            // Draw new playhead line
                            const playheadX = xAxis.toPixels(currentPlayheadPosition);
                            chart.playheadLine = chart.renderer.path([
                                'M', playheadX, chart.plotTop,
                                'L', playheadX, chart.plotTop + chart.plotHeight
                            ])
                            .attr({
                                stroke: '#EF4444',
                                'stroke-width': 3,
                                zIndex: 15,
                                opacity: 0.8
                            })
                            .add();

                            // Add playhead indicator at top
                            chart.renderer.circle(playheadX, chart.plotTop - 5, 4)
                            .attr({
                                fill: '#EF4444',
                                stroke: '#ffffff',
                                'stroke-width': 2,
                                zIndex: 16
                            })
                            .add();
                        } else if (chart.playheadLine) {
                            chart.playheadLine.destroy();
                            chart.playheadLine = null;
                        }
                    } else if (chart.playheadLine) {
                        chart.playheadLine.destroy();
                        chart.playheadLine = null;
                    }
                },
                mouseMove: function (e) {
                    // Disable crosshair during auto-play
                    if (isPlaying.value) {
                        return;
                    }

                    const chart = this;
                    if (!chart.xAxis || !chart.xAxis[0]) return;
                    const xAxis = chart.xAxis[0];
                    const pointer = chart.pointer.normalize(e.originalEvent);
                    const xValue = xAxis.toValue(pointer.chartX);
                    // Only show crosshair if inside plot area
                    if (pointer.chartX < chart.plotLeft || pointer.chartX > chart.plotLeft + chart.plotWidth) {
                        if (chart.dynamicCrosshair) {
                            chart.dynamicCrosshair.destroy();
                            chart.dynamicCrosshair = null;
                        }
                        if (chart.dynamicCrosshairLabel) {
                            chart.dynamicCrosshairLabel.destroy();
                            chart.dynamicCrosshairLabel = null;
                        }
                        return;
                    }
                    // Remove previous dynamic line
                    if (chart.dynamicCrosshair) {
                        chart.dynamicCrosshair.destroy();
                        chart.dynamicCrosshair = null;
                    }
                    // Draw new dynamic line
                    chart.dynamicCrosshair = chart.renderer.path([
                        'M', xAxis.toPixels(xValue), chart.plotTop,
                        'L', xAxis.toPixels(xValue), chart.plotTop + chart.plotHeight
                    ])
                    .attr({
                        stroke: '#EF4444',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add();
                    // Show label with time in HH:mm
                    if (chart.dynamicCrosshairLabel) {
                        chart.dynamicCrosshairLabel.destroy();
                    }
                    chart.dynamicCrosshairLabel = chart.renderer.label(
                        Highcharts.dateFormat('%H:%M', Math.round(xValue)),
                        xAxis.toPixels(xValue) + 4,
                        chart.plotTop + 5,
                        null,
                        null,
                        null,
                        false
                    )
                    .attr({
                        fill: '#fff',
                        padding: 2,
                        r: 2,
                        zIndex: 11
                    })
                    .css({ color: '#EF4444', fontWeight: 'bold', fontSize: '11px' })
                    .add();
                },
                mouseOut: function () {
                    const chart = this;
                    if (chart.dynamicCrosshair) {
                        chart.dynamicCrosshair.destroy();
                        chart.dynamicCrosshair = null;
                    }
                    if (chart.dynamicCrosshairLabel) {
                        chart.dynamicCrosshairLabel.destroy();
                        chart.dynamicCrosshairLabel = null;
                    }
                }
            }
        },
        title: { text: '' },
        time: {
            // Don't use timezone setting - rely on local browser time instead
            useUTC: false,
            // Force timezone to match local time
            getTimezoneOffset: function (timestamp) {
                // Return 0 to ensure the chart uses the dates as-is
                return 0;
            }
        },
        xAxis: {
            type: 'datetime',
            min: xMin,
            max: xMin + 2 * 60 * 60 * 1000, // 2 jam pertama
            startOfWeek: 0,
            dateTimeLabelFormats: {
                day: '%A, %e %b'
            },
            grid: { borderColor: '#e5e7eb' },
            labels: {
                format: '{value:%H:%M}',
                style: { color: '#374151', fontSize: '12px', fontWeight: 'bold' },
                autoRotation: [-45, -90],
                staggerLines: 2 // jika label tetap terlalu rapat, akan bertingkat
            },
            tickPixelInterval: 90, // Lebarkan jarak antar label
            tickInterval: 1000 * 60 * 10, // 10 minutes
            breaks: [{
                from: xMin - (24 * 3600 * 1000),
                to: xMin,
                breakSize: 0
            }],
        },
        yAxis: {
            categories: categories,
            title: { text: 'Processes', style: { fontSize: '12px' } },
            labels: { style: { color: '#374151', fontSize: '11px' } },
            grid: { borderColor: '#e5e7eb' },
            reversed: true
        },
        navigator: {
            enabled: true,
            liveRedraw: true,
            height: 50,
            margin: 10,
            xAxis: {
                min: xMin,
                max: xMax, // 24 jam penuh
                labels: {
                    format: '{value:%H:%M}'  // Format 24-jam
                },
                dateTimeLabelFormats: {
                    day: '%H:%M'
                }
            },
            adaptToUpdatedData: false,
            series: {
                dataLabels: {
                    allowOverlap: false
                }
            }
        },
        scrollbar: { enabled: true },
        rangeSelector: {
            enabled: false
        },
        // Set explicit date format for chart header
        caption: {
            text: formatDate(selectedDate.value),
            style: {
                color: '#1F2937',
                fontWeight: 'bold',
                display: 'none' // Hide the caption since we already show the date in the dropdown
            }
        },
        series: [{
            name: 'Aktivitas',
            data: seriesData,
            dataLabels: {
                enabled: false
            }
        }],
        tooltip: {
            formatter: function() {
                // Don't show tooltip if auto-play is running
                if (isPlaying.value) {
                    return false;
                }

                const point = this.point;
                
                // Skip tooltip for dummy/invisible points
                if (point.status === 'dummy' || point.visible === false) {
                    return false;
                }

                // Use consistent time calculation from the actual timestamps
                const startDate = new Date(point.start);
                const endDate = new Date(point.end);
                const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
                const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                // Calculate accurate duration
                const durationMs = endDate.getTime() - startDate.getTime();
                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                const duration = durationHours > 0 ?
                    `${durationHours} jam ${durationMinutes} menit` :
                    `${durationMinutes} menit`;

                let html = `
                <div style="
                    min-width: 280px;
                    max-width: 350px;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 12px;
                    padding: 0;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                ">`;

                // Header dengan gradient
                html += `
                <div style="
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    padding: 12px 16px;
                    margin: 0;
                ">
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${point.name}</div>
                    <div style="font-size: 13px; opacity: 0.9;">
                        <i class="fas fa-clock" style="margin-right: 6px;"></i>
                        ${startTime} - ${endTime} (${duration})
                    </div>
                </div>`;

                // Content area
                html += `<div style="padding: 16px;">`;

                // Status badge
                const statusColor = point.status === 'completed' ? '#10b981' :
                                  point.status === 'active' ? '#3b82f6' : '#6b7280';
                const statusBg = point.status === 'completed' ? '#ecfdf5' :
                               point.status === 'active' ? '#eff6ff' : '#f3f4f6';

                html += `
                <div style="
                    display: inline-block;
                    background: ${statusBg};
                    color: ${statusColor};
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                    margin-bottom: 12px;
                ">
                    <i class="fas fa-circle" style="font-size: 8px; margin-right: 6px;"></i>
                    ${point.status}
                </div>`;

                // Image section if available
                if (point.image_path) {
                    const imgUrl = `https://somba-sppg.latto.co.id/cdn/notif${point.image_path}`;
                    html += `
                    <div style="margin-bottom: 8px;">
                        <div style="
                            font-size: 12px;
                            color: #64748b;
                            margin-bottom: 8px;
                            font-weight: 500;
                        ">
                            <i class="fas fa-camera" style="margin-right: 6px;"></i>
                            Rekaman Aktivitas
                        </div>
                        <div style="
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            border: 2px solid #f1f5f9;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            position: relative;
                        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                            <img src='${imgUrl}'
                                 alt='Rekaman ${point.name}'
                                 style='
                                     width: 100%;
                                     max-width: 100%;
                                     height: 140px;
                                     object-fit: cover;
                                     display: block;
                                 '
                                 onclick="window.openImageModal('${imgUrl}', 'Rekaman ${point.name}')"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                            />
                            <div style="
                                display: none;
                                padding: 20px;
                                text-align: center;
                                background: #f8fafc;
                                color: #64748b;
                                font-size: 12px;
                            ">
                                <i class="fas fa-image" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                                Gambar tidak tersedia
                            </div>
                            <div style="
                                position: absolute;
                                top: 8px;
                                right: 8px;
                                display: flex;
                                gap: 6px;
                            ">
                                <div style="
                                    background: rgba(0,0,0,0.7);
                                    color: white;
                                    border-radius: 50%;
                                    width: 24px;
                                    height: 24px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 10px;
                                " onclick="window.openImageModal('${imgUrl}', 'Rekaman ${point.name}')">
                                    <i class="fas fa-expand"></i>
                                </div>
                            </div>
                        </div>
                    </div>`;
                } else {
                    html += `
                    <div style="
                        text-align: center;
                        padding: 20px;
                        background: #f8fafc;
                        border-radius: 8px;
                        color: #64748b;
                        font-size: 12px;
                        border: 1px dashed #cbd5e1;
                    ">
                        <i class="fas fa-camera-slash" style="font-size: 20px; margin-bottom: 8px; display: block;"></i>
                        Tidak ada rekaman visual
                    </div>`;
                }

                html += `</div></div>`;
                return html;
            },
            useHTML: true,
            backgroundColor: 'transparent',
            borderWidth: 0,
            shadow: false,
            style: {
                padding: 0
            }
        },
        credits: { enabled: false },
        exporting: { enabled: true },
        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {}
                }
            }
        }
    });
};

// ========================
// WATCHERS AND LIFECYCLE
// ========================

// Watch API data and update chart when data changes
watch(apiData, () => {
    if (!vegaReady.value) return;
    setTimeout(() => {
        renderHighchartsGantt();
    }, 100);
}, { deep: true });

// Watch vegaReady: render chart when library is ready and data is available
watch(vegaReady, (ready) => {
    if (ready && apiData.value && apiData.value.length > 0) {
        setTimeout(() => {
            renderHighchartsGantt();
        }, 150);
    }
});

// Watch play speed: restart auto-play with new speed if currently playing
watch(playSpeed, (newSpeed) => {
    if (isPlaying.value) {
        stopAutoPlay();
        // Restart with new speed after a small delay
        setTimeout(() => {
            startAutoPlay();
        }, 100);
    }
});

onMounted(async () => {
    await fetchActivityData();
    loadHighchartsGantt();
});

onUnmounted(() => {
    // Clean up any intervals or event listeners
    stopAutoPlay();
    hidePlayheadPopups();
    hideHoverPreview();
    closeDetailModal();
    
    if (chartInstance) {
        chartInstance = null;
    }
    
    // Clean up global functions
    if (window.openImageModal) {
        delete window.openImageModal;
    }
    if (window.downloadImageFromUrl) {
        delete window.downloadImageFromUrl;
    }
});
</script>

<template>
    <!-- Real Time Process Monitoring Dashboard -->
    <div class="card card-flush">
        <!-- Header Section -->
        <div class="card-header pt-5">
                <!-- Title -->
                <div class="d-flex align-items-center mb-4">
                    <div class="symbol symbol-40px me-3">
                        <div class="symbol-label bg-light-primary">
                            <i class="ki-duotone ki-chart-simple text-primary fs-2x">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                            </i>
                        </div>
                    </div>
                    <div>
                        <h2 class="fs-1 fw-bold text-gray-900 mb-1">{{ title }}</h2>
                        <p class="fs-6 text-muted">{{ subtitle }}</p>
                    </div>
                </div>
                
                <!-- Controls Row: Date Picker, Auto-play Controls, Status Legend -->
                <div v-if="showFilters" class="row g-3 align-items-center col-lg-12">
                    <!-- Date Picker -->
                    <div class="col-auto">
                        <div class="dropdown">
                            <button
                                class="btn btn-light-primary btn-sm dropdown-toggle d-flex align-items-center"
                                type="button"
                                @click="showDatePicker = !showDatePicker"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i class="ki-duotone ki-calendar text-primary fs-6 me-2">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                                <span class="fw-semibold">{{ formatDate(selectedDate) }}</span>
                            </button>

                            <!-- Calendar Dropdown -->
                            <div
                                v-if="showDatePicker"
                                class="dropdown-menu show p-0"
                                style="min-width: 320px; z-index: 1050;"
                            >
                                <div class="p-5">
                                <!-- Calendar Header -->
                                <div class="d-flex align-items-center justify-content-between mb-4">
                                    <button
                                        @click="previousMonth"
                                        class="btn btn-icon btn-light btn-sm"
                                    >
                                        <i class="ki-duotone ki-arrow-left fs-4">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </button>
                                    <h4 class="fs-4 fw-bold text-gray-800">
                                        {{ monthNames[currentMonth] }} {{ currentYear }}
                                    </h4>
                                    <button
                                        @click="nextMonth"
                                        class="btn btn-icon btn-light btn-sm"
                                    >
                                        <i class="ki-duotone ki-arrow-right fs-4">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </button>
                                </div>

                                    <!-- Day Headers -->
                                    <div class="row g-1 mb-2">
                                        <div
                                            v-for="day in dayNames"
                                            :key="day"
                                            class="col text-center"
                                        >
                                            <div class="fs-8 fw-bold text-muted p-1">
                                                {{ day }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Calendar Days Grid -->
                                    <div class="row g-1 mb-4">
                                        <div
                                            v-for="(date, index) in calendarDays"
                                            :key="index"
                                            class="col text-center"
                                            style="flex: 0 0 14.285714%;"
                                        >
                                            <button
                                                v-if="date"
                                                @click="selectDate(date)"
                                                :class="[
                                                    'btn btn-sm w-100 p-1',
                                                    isSelected(date) ? 'btn-primary text-white' :
                                                    isToday(date) ? 'btn-light-primary text-primary fw-bold' :
                                                    'btn-light text-gray-700'
                                                ]"
                                                style="min-height: 32px; font-size: 12px;"
                                            >
                                                {{ date.getDate() }}
                                            </button>
                                            <div v-else style="height: 32px;"></div>
                                        </div>
                                    </div>

                                    <!-- Quick Actions -->
                                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                                        <button
                                            @click="selectDate(new Date())"
                                            class="btn btn-light-primary btn-sm"
                                        >
                                            <i class="ki-duotone ki-calendar fs-6 me-1">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                            </i>
                                            Hari Ini
                                        </button>
                                        <button
                                            @click="showDatePicker = false"
                                            class="btn btn-light btn-sm"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Auto-play Controls (Center) -->
                    <div class="col d-flex justify-content-center">
                        <div class="d-flex align-items-center bg-light rounded px-3 py-1">
                            <span class="fs-7 fw-semibold text-gray-700 me-3">Kontrol:</span>
                            <select
                                v-model="playSpeed"
                                class="form-select form-select-sm me-2 py-1"
                                :disabled="isPlaying"
                                style="width: 120px; font-size: 12px;"
                            >
                                <option :value="1000">Cepat (1s)</option>
                                <option :value="2000">Normal (2s)</option>
                                <option :value="3000">Lambat (3s)</option>
                            </select>
                            <button
                                @click="toggleAutoPlay"
                                :class="[
                                    'btn btn-sm d-flex align-items-center py-1',
                                    isPlaying ? 'btn-danger' : 'btn-success'
                                ]"
                                :disabled="!apiData || apiData.length === 0"
                            >
                                <i :class="[
                                    'me-1 fs-6',
                                    isPlaying ? 'ki-duotone ki-stop-circle' : 'ki-duotone ki-play'
                                ]">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                </i>
                                {{ isPlaying ? 'Berhenti' : 'Putar' }}
                            </button>
                        </div>
                    </div>

                    <!-- Status Legend (Right) -->
                    <div class="col-5 d-flex justify-content-end">
                        <div class="d-flex align-items-center rounded px-3 py-1">
                            <span class="fs-7 fw-semibold text-gray-700 me-3">Status:</span>
                            <div class="d-flex align-items-center">
                                <button
                                    @click="toggleStatusFilter('active')"
                                    :class="[
                                        'd-flex align-items-center px-2 py-1 rounded me-2 border',
                                        isStatusSelected('active')
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-muted border'
                                    ]"
                                    style="font-size: 11px;"
                                >
                                    <div 
                                        class="rounded-circle me-2"
                                        :class="isStatusSelected('active') ? 'bg-white' : 'bg-primary'"
                                        style="width: 8px; height: 8px;"
                                    ></div>
                                    <span class="fw-medium">Aktif</span>
                                </button>
                                <button
                                    @click="toggleStatusFilter('completed')"
                                    :class="[
                                        'd-flex align-items-center px-2 py-1 rounded me-2 border',
                                        isStatusSelected('completed')
                                            ? 'bg-success text-white'
                                            : 'bg-white text-muted border-1 border-green-300'
                                    ]"
                                    style="font-size: 11px;"
                                >
                                    <div 
                                        class="rounded-circle me-2"
                                        :class="isStatusSelected('completed') ? 'bg-white' : 'bg-success'"
                                        style="width: 8px; height: 8px;"
                                    ></div>
                                    <span class="fw-medium">Selesai</span>
                                    </button>
                                <button
                                    @click="toggleStatusFilter('scheduled')"
                                    :class="[
                                        'd-flex align-items-center px-2 py-1 rounded me-2 border',
                                        isStatusSelected('scheduled')
                                            ? 'bg-gray-100 text-gray-600 border-gray-400'
                                            : 'bg-white text-muted border-1 border-gray-300'
                                    ]"
                                    style="font-size: 11px;"
                                >
                                    <div 
                                        class="rounded-circle me-2"
                                        :class="isStatusSelected('scheduled') ? 'bg-gray-600' : 'bg-gray-300'"
                                        style="width: 8px; height: 8px;"
                                    ></div>
                                    <span class="fw-medium">Terjadwal</span>
                                </button>
                                </div>
                            </div>
                            <!-- Filter Counter & Reset -->
                            <div class="d-flex align-items-center ms-3 ps-3 border-start border-2 border-gray-400">
                                <span class="fs-8 text-muted me-2">
                                    {{ selectedStatuses.length }}/3 aktif
                                </span>
                                <button
                                    v-if="selectedStatuses.length > 0"
                                    @click="resetFilters"
                                    class="btn btn-link btn-sm text-primary p-0"
                                    style="font-size: 11px; text-decoration: underline;"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

        <!-- Chart Area -->
        <div class="card-body">
            <!-- Auto-play indicator -->
            <div v-if="isPlaying" class="position-absolute top-0 end-0 z-3 badge badge-danger badge-lg d-flex align-items-center" style="margin: 1rem;">
                <div class="badge badge-circle badge-light-danger pulse me-2" style="width: 8px; height: 8px;"></div>
                AUTO PLAY AKTIF
            </div>

            <!-- Error & state messaging -->
            <div v-if="apiError" class="alert alert-warning d-flex align-items-center mb-4" role="alert">
                <i class="ki-duotone ki-information fs-3 me-3 text-warning">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                </i>
                <span class="fw-semibold text-warning">{{ apiError }}</span>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="d-flex flex-column align-items-center justify-content-center text-center" style="height: 400px;">
                <div class="spinner-border text-primary mb-4" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-gray-600 fw-semibold mb-2">Memuat data aktivitas...</p>
                <p class="fs-6 text-muted">Mohon tunggu sebentar</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!isLoading && apiData.length === 0" class="d-flex flex-column align-items-center justify-content-center text-center bg-white rounded border border-dashed border-gray-300" style="height: 400px;">
                <div class="symbol symbol-60px bg-light-gray-400 mb-4">
                    <div class="symbol-label">
                        <i class="ki-duotone ki-calendar-remove text-gray-400 fs-2x">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                        </i>
                    </div>
                </div>
                <h3 class="fs-4 fw-semibold text-gray-700 mb-2">Belum Ada Aktivitas</h3>
                <p class="text-muted mb-1">Tidak ada data aktivitas untuk tanggal ini.</p>
                <p class="fs-6 text-gray-400 mb-4">Silakan pilih tanggal lain atau coba lagi nanti.</p>
                <button
                    @click="fetchActivityData"
                    class="btn btn-primary btn-sm"
                >
                    <i class="ki-duotone ki-arrows-circle fs-6 me-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                    Muat Ulang
                </button>
            </div>

            <!-- Chart Container -->
            <div v-else class="bg-white rounded border p-4">
                <div id="process-tracking-chart" class="w-100" style="height: 400px;"></div>
            </div>
    </div>

    <!-- Full Screen Image Modal -->
    <div
        v-if="showImageModal"
        class="modal fade show d-block"
        style="z-index: 9999; background-color: rgba(0,0,0,0.95);"
            @click="closeImageModal"
        >
            <div class="modal-dialog modal-fullscreen d-flex align-items-center justify-content-center" @click.stop>
                <div class="position-relative">
                    <!-- Modal Header -->
                    <div class="position-absolute top-0 start-0 end-0" style="z-index: 10; padding: 1.5rem;">
                        <div class="d-flex align-items-center justify-content-between bg-dark bg-opacity-75 rounded px-3 py-2">
                            <h3 class="text-white fw-bold fs-4 text-truncate d-flex align-items-center mb-0" style="max-width: 70%;">
                                <div class="symbol symbol-30px bg-white bg-opacity-20 me-3">
                                    <div class="symbol-label">
                                        <i class="ki-duotone ki-picture text-white fs-6">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </div>
                                </div>
                                {{ modalImageAlt }}
                            </h3>
                            <div class="d-flex align-items-center">
                                <!-- Download Button -->
                                <button
                                    @click="downloadImage"
                                    class="btn btn-success btn-sm me-2"
                                    title="Download gambar"
                                >
                                    <i class="ki-duotone ki-cloud-download fs-6">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </button>
                                <!-- Close Button -->
                                <button
                                    @click="closeImageModal"
                                    class="btn btn-danger btn-sm"
                                    title="Tutup"
                                >
                                    <i class="ki-duotone ki-cross fs-2">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Image Container -->
                    <div class="bg-white bg-opacity-5 rounded p-2" @click.stop>
                        <img
                            :src="modalImageSrc"
                            :alt="modalImageAlt"
                            class="img-fluid rounded shadow"
                            style="max-width: 90vw; max-height: 85vh; object-fit: contain;"
                            @click.stop
                            @load="() => {}"
                            @error="() => {}"
                        />
                    </div>

                    <!-- Modal Footer -->
                    <div class="position-absolute bottom-0 start-0 end-0" style="z-index: 10; padding: 1.5rem;">
                        <div class="bg-dark bg-opacity-75 rounded px-3 py-2">
                            <div class="d-flex align-items-center justify-content-center text-white fs-7">
                                <div class="d-flex align-items-center me-4">
                                    <i class="ki-duotone ki-information-5 text-primary fs-6 me-1">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                    </i>
                                    <span>Gambar ukuran penuh</span>
                                </div>
                                <div class="d-flex align-items-center me-4">
                                    <i class="ki-duotone ki-mouse text-success fs-6 me-1">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                    <span>Klik di luar untuk menutup</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="ki-duotone ki-magnifier text-warning fs-6 me-1">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>
                                    <span>Scroll untuk zoom</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Modal -->
        <div
            v-if="showDetailModal && modalDetailData"
            class="modal fade show d-block"
            tabindex="-1"
            style="z-index: 8888; background-color: rgba(0,0,0,0.7);"
            @click="closeDetailModal"
        >
            <div class="modal-dialog modal-lg modal-dialog-centered" @click.stop>
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header bg-primary text-white">
                        <!-- Close Button -->
                        <button
                            @click="closeDetailModal"
                            type="button"
                            class="btn btn-icon btn-sm btn-light btn-active-light-primary ms-auto"
                            title="Tutup detail"
                        >
                            <i class="ki-duotone ki-cross fs-2">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </i>
                        </button>

                        <!-- Header Content -->
                        <div class="w-100">
                            <div class="d-flex align-items-center mb-3">
                                <div class="symbol symbol-40px me-3">
                                    <div class="symbol-label bg-white bg-opacity-20">
                                        <i class="ki-duotone ki-notepad text-white fs-2x">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                        </i>
                                    </div>
                                </div>
                                <div>
                                    <h3 class="fs-2 fw-bold mb-1">{{ modalDetailData.name }}</h3>
                                    <p class="text-white text-opacity-75 fs-6 mb-0">Detail Aktivitas Proses</p>
                                </div>
                            </div>
                            
                            <!-- Status Badge -->
                            <div class="mb-4">
                                <span
                                    v-if="modalDetailData.status"
                                    :class="{
                                        'badge-success': modalDetailData.status === 'completed',
                                        'badge-primary': modalDetailData.status === 'active',
                                        'badge-secondary': modalDetailData.status === 'scheduled'
                                    }"
                                    class="badge badge-lg d-inline-flex align-items-center"
                                >
                                    <div class="badge badge-circle badge-light-white pulse me-2" style="width: 6px; height: 6px;"></div>
                                    {{ modalDetailData.status === 'completed' ? 'Selesai' : 
                                       modalDetailData.status === 'active' ? 'Aktif' : 'Terjadwal' }}
                                </span>
                            </div>

                            <!-- Time Info -->
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="d-flex align-items-center bg-white bg-opacity-10 rounded p-3">
                                        <div class="symbol symbol-30px bg-white bg-opacity-20 me-3">
                                            <div class="symbol-label">
                                                <i class="ki-duotone ki-time text-white fs-4">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                </i>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="text-white text-opacity-75 fs-8 text-uppercase fw-bold mb-1">Waktu Pelaksanaan</p>
                                            <p class="fw-bold fs-4 text-white mb-0">{{ formatTime(modalDetailData.start) }} - {{ formatTime(modalDetailData.end) }}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="d-flex align-items-center bg-white bg-opacity-10 rounded p-3">
                                        <div class="symbol symbol-30px bg-white bg-opacity-20 me-3">
                                            <div class="symbol-label">
                                                <i class="ki-duotone ki-timer text-white fs-4">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                </i>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="text-white text-opacity-75 fs-8 text-uppercase fw-bold mb-1">Total Durasi</p>
                                            <p class="fw-bold fs-4 text-white mb-0">{{ formatDuration(modalDetailData) }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <!-- Image Section -->
                        <div v-if="modalDetailData.image_path" class="mb-6">
                            <div class="d-flex align-items-center mb-4">
                                <div class="symbol symbol-30px bg-light-primary me-3">
                                    <div class="symbol-label">
                                        <i class="ki-duotone ki-camera text-primary fs-4">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                        </i>
                                    </div>
                                </div>
                                <h4 class="fs-3 fw-bold text-gray-800 mb-0">Dokumentasi Visual</h4>
                            </div>
                            
                            <div class="position-relative bg-light rounded border overflow-hidden">
                                <img
                                    :src="`https://somba-sppg.latto.co.id/cdn/notif${modalDetailData.image_path}`"
                                    :alt="`Rekaman ${modalDetailData.name}`"
                                    class="img-fluid cursor-pointer"
                                    style="height: 300px; width: 100%; object-fit: cover;"
                                    @click="openImageFromDetail(`https://somba-sppg.latto.co.id/cdn/notif${modalDetailData.image_path}`, `Rekaman ${modalDetailData.name}`)"
                                    @error="$event.target.style.display = 'none'; $event.target.nextElementSibling.style.display = 'block'"
                                />
                                
                                <!-- Error State -->
                                <div class="d-none p-8 text-center bg-light d-flex flex-column align-items-center justify-content-center" style="height: 300px;">
                                    <div class="symbol symbol-60px bg-light-gray-400 mb-4">
                                        <div class="symbol-label">
                                            <i class="ki-duotone ki-picture text-gray-400 fs-2x">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                            </i>
                                        </div>
                                    </div>
                                    <p class="text-muted fw-semibold mb-1">Gambar tidak dapat dimuat</p>
                                    <p class="text-gray-400 fs-6">Terjadi kesalahan saat memuat gambar</p>
                                </div>

                                <!-- Hover Overlay -->
                                <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 opacity-0 d-flex align-items-end justify-content-center pb-4 hover-overlay">
                                    <div class="d-flex">
                                        <button
                                            @click="openImageFromDetail(`https://somba-sppg.latto.co.id/cdn/notif${modalDetailData.image_path}`, `Rekaman ${modalDetailData.name}`)"
                                            class="btn btn-primary btn-sm me-2"
                                            title="Lihat ukuran penuh"
                                        >
                                            <i class="ki-duotone ki-resize fs-6 me-1">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                            </i>
                                            Perbesar
                                        </button>
                                        <button
                                            @click="downloadImageFromUrl(`https://somba-sppg.latto.co.id/cdn/notif${modalDetailData.image_path}`, `Rekaman ${modalDetailData.name}`)"
                                            class="btn btn-success btn-sm"
                                            title="Download gambar"
                                        >
                                            <i class="ki-duotone ki-cloud-download fs-6 me-1">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                            </i>
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Image Section -->
                        <div v-else class="mb-6">
                            <div class="d-flex align-items-center mb-4">
                                <div class="symbol symbol-30px bg-light-secondary me-3">
                                    <div class="symbol-label">
                                        <i class="ki-duotone ki-picture text-secondary fs-4">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </div>
                                </div>
                                <h4 class="fs-3 fw-bold text-gray-800 mb-0">Dokumentasi Visual</h4>
                            </div>
                            
                            <div class="p-8 text-center bg-light rounded border border-dashed border-gray-300">
                                <div class="symbol symbol-60px bg-light-secondary d-inline-flex mb-4">
                                    <div class="symbol-label">
                                        <i class="ki-duotone ki-picture text-secondary fs-2x">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </div>
                                </div>
                                <h5 class="fs-4 fw-semibold text-gray-700 mb-2">Tidak Ada Dokumentasi</h5>
                                <p class="text-muted">Tidak ada rekaman visual untuk aktivitas ini</p>
                            </div>
                        </div>

                        <!-- Additional Info Card -->
                        <div class="card bg-light-primary border border-primary border-dashed">
                            <div class="card-body">
                                <div class="d-flex align-items-start">
                                    <div class="symbol symbol-30px bg-light-primary me-4">
                                        <div class="symbol-label">
                                            <i class="ki-duotone ki-information-5 text-primary fs-4">
                                                <span class="path1"></span>
                                                <span class="path2"></span>
                                                <span class="path3"></span>
                                            </i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <h5 class="fw-bold text-primary mb-3 fs-4">Informasi Tambahan</h5>
                                        <div class="text-primary fs-6">
                                            <p class="d-flex align-items-center mb-2">
                                                <i class="ki-duotone ki-mouse text-primary fs-6 me-2">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                </i>
                                                Klik gambar untuk melihat dalam ukuran penuh
                                            </p>
                                            <p class="d-flex align-items-center mb-2">
                                                <i class="ki-duotone ki-cloud-download text-success fs-6 me-2">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                </i>
                                                Tombol download tersedia untuk menyimpan gambar
                                            </p>
                                            <p class="d-flex align-items-center mb-0">
                                                <i class="ki-duotone ki-cross-circle text-danger fs-6 me-2">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                </i>
                                                Klik di luar modal atau tombol X untuk menutup
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<style scoped>
/* Hover effects untuk overlay */
.hover-overlay {
    transition: opacity 0.3s ease;
}

.hover-overlay:hover {
    opacity: 1 !important;
}

/* Pulse animation untuk indicator */
.pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
}

/* Custom width utilities */
.w-8px {
    width: 8px;
}

.h-8px {
    height: 8px;
}

.w-10px {
    width: 10px;
}

.h-10px {
    height: 10px;
}

.w-15px {
    width: 15px;
}

.h-15px {
    height: 15px;
}

/* Hover effects untuk buttons */
.btn:hover {
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

/* Rotate transform */
.rotate-180 {
    transform: rotate(180deg);
}

/* Calendar grid responsiveness */
.row.g-1 > .col {
    flex: 0 0 14.2857%;
}

/* Image hover effect */
.img-fluid:hover {
    transform: scale(1.02);
    transition: transform 0.3s ease;
}

/* Custom spacing */
.me-auto {
    margin-right: auto;
}

/* Status filter active states */
.bg-light-primary:hover {
    background-color: var(--bs-primary-bg-subtle) !important;
}

.bg-light-success:hover {
    background-color: var(--bs-success-bg-subtle) !important;
}

.bg-light-secondary:hover {
    background-color: var(--bs-secondary-bg-subtle) !important;
}
</style>