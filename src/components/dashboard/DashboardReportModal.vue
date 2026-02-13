<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <h3 class="modal-title">Preview Laporan</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <!-- Modal Body (Preview Area) -->
      <div class="modal-body">
        <div
          v-for="(pageAlerts, pageIndex) in paginatedAlerts"
          :key="pageIndex"
          class="report-content mb-4 position-relative"
        >
          <!-- Report Header (Only on first page) -->
          <template v-if="pageIndex === 0">
            <header class="report-header">
              <div class="header-left">
                <img
                  src="/logo-somba.png"
                  alt="Logo Somba"
                  class="report-logo"
                />
              </div>
              <div class="header-center">
                <h1 class="report-title">{{ t("dashboard.report.title") }}</h1>
              </div>
            </header>

            <hr class="divider" />

            <!-- Meta Info Section -->
            <section class="meta-section">
              <div class="meta-item">
                <span class="meta-label"
                  >{{ t("dashboard.report.site") }}:</span
                >
                <span class="meta-value">{{ siteName || "-" }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label"
                  >{{ t("dashboard.report.date") }}:</span
                >
                <span class="meta-value">{{ date || "-" }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label"
                  >{{ t("dashboard.report.lastData") }}:</span
                >
                <span class="meta-value">{{ lastUpdated || "-" }}</span>
              </div>
            </section>

            <!-- Summary Cards -->
            <section class="summary-section">
              <div class="summary-card total">
                <div class="card-value">{{ summary.total || 0 }}</div>
                <div class="card-label">
                  {{ t("dashboard.alerts.summary.totalToday.title") }}
                </div>
              </div>
              <div class="summary-card resolved">
                <div class="card-value">{{ summary.resolved || 0 }}</div>
                <div class="card-label">
                  {{ t("dashboard.alerts.summary.resolvedToday.title") }}
                </div>
              </div>
              <div class="summary-card unresolved">
                <div class="card-value">{{ summary.unresolved || 0 }}</div>
                <div class="card-label">
                  {{ t("dashboard.alerts.summary.unresolvedToday.title") }}
                </div>
              </div>
            </section>
          </template>

          <!-- Spacer for subsequent pages to match header height roughly if needed, or just table -->
          <div v-else class="h-50px"></div>

          <!-- Data Table -->
          <section class="table-section">
            <h4 v-if="pageIndex === 0" class="table-title">
              {{ t("dashboard.alerts.summary.title") }}
            </h4>
            <table class="report-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 25%">
                    {{ t("dashboard.alerts.table.violation") }}
                  </th>
                  <th class="text-center" style="width: 15%">
                    {{ t("dashboard.alerts.table.duration") }}
                  </th>
                  <th class="text-center" style="width: 10%">
                    {{ t("dashboard.alerts.table.detection") }}
                  </th>
                  <th class="text-center" style="width: 15%">
                    {{ t("dashboard.alerts.table.time") }}
                  </th>
                  <th class="text-center" style="width: 15%">
                    {{ t("dashboard.alerts.table.status") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pageAlerts" :key="index">
                  <td>
                    <div class="fw-bold">
                      {{
                        item.detected_objects[0].display_name ||
                        item.detected_objects[0].object_type ||
                        "-"
                      }}
                    </div>
                    <small class="text-muted">{{
                      item.camera_name || "-"
                    }}</small>
                  </td>
                  <td class="text-center">
                    {{ formatDuration(item.duration_minutes) }}
                  </td>
                  <td class="text-center">
                    {{ item.detection_count || item.total_detections || 0 }}
                  </td>
                  <td class="text-center">
                    {{ formatTime(item.event_start) }}
                  </td>
                  <td class="text-center">
                    <span
                      :class="[
                        'badge',
                        statusBadge(item.status),
                        'py-2',
                        'px-3',
                        'fw-bold',
                        'fs-7',
                      ]"
                    >
                      {{ statusLabel(item.status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!pageAlerts || pageAlerts.length === 0">
                  <td colspan="5" class="text-center">
                    {{ t("dashboard.alerts.table.empty") }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Footer -->
          <footer class="report-footer">
            <small>{{ t("dashboard.report.generatedBy") }}</small>
            <small class="page-number"
              >{{ t("dashboard.report.page") }} {{ pageIndex + 1 }} of
              {{ paginatedAlerts.length }}</small
            >
          </footer>
        </div>
      </div>

      <!-- Modal Footer (Actions) -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Batal</button>
        <button
          class="btn btn-primary"
          @click="downloadPdf"
          :disabled="isDownloading"
        >
          <span v-if="isDownloading">Mengunduh...</span>
          <span v-else>Unduh PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from "vue";
import { useI18n } from "vue-i18n";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { t } = useI18n();

type DetectedObject = {
  object_type: string;
  display_name: string;
  duration_seconds: number;
  detection_count: number;
};

interface AlertItem {
  detected_objects?: DetectedObject[];
  camera_name?: string;
  duration_minutes?: number;
  total_detections?: number;
  status?: string;
  event_start: string;
  [key: string]: any;
}

const props = defineProps({
  show: Boolean,
  siteName: String,
  date: String,
  lastUpdated: String,
  summary: {
    type: Object,
    default: () => ({ total: 0, resolved: 0, unresolved: 0 }),
  },
  alerts: {
    type: Array as PropType<AlertItem[]>,
    default: () => [],
  },
});

const emit = defineEmits(["close"]);
const isDownloading = ref(false);

const ITEMS_PER_PAGE = 15;
const paginatedAlerts = computed(() => {
  if (!props.alerts || props.alerts.length === 0) return [[]];
  const pages = [];
  for (let i = 0; i < props.alerts.length; i += ITEMS_PER_PAGE) {
    pages.push(props.alerts.slice(i, i + ITEMS_PER_PAGE));
  }
  return pages;
});

const formatTime = (isoString: string | undefined) => {
  if (!isoString) return "-";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return isoString;
  }
};

const statusBadge = (status: string | undefined) => {
  if (!status) return "badge-light-secondary";
  const s = normalizeKey(status);
  if (s === "resolved" || s === "completed") return "badge-light-success";
  if (s === "notresolved") return "badge-light-danger";
  if (s === "falsealarm") return "badge-light-info";
  return "badge-light-secondary";
};

const normalizeKey = (v?: string) =>
  (v || "").toLowerCase().replace(/[\s_-]/g, "");

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes))
    return t("appsEventsAlerts.format.notAvailable") || "-";
  if ((minutes || 0) < 1)
    return (
      t("appsEventsAlerts.format.secondsLong", {
        value: formatNumber(Math.max(0, (minutes || 0) * 60), 0),
      }) || `${formatNumber(Math.max(0, (minutes || 0) * 60), 0)} detik`
    );
  return (
    t("appsEventsAlerts.format.minutesLong", {
      value: formatNumber(Math.max(0, minutes || 0), 1),
    }) || `${formatNumber(Math.max(0, minutes || 0), 1)} menit`
  );
};

const statusLabel = (status: string | undefined) => {
  if (!status) return "-";
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

const downloadPdf = () => {
  isDownloading.value = true;
  try {
    const doc = new jsPDF();

    // 1. Header
    // Logo (if available, requires converting to base64 or pre-loading)
    // For simplicity, we skip image loading in jspdf-autotable logic unless we have base64 or addImage works with url
    // Adjust Logo dimensions to be proportional and tidier
    // Assuming a roughly square-ish or wide logo, let's keep it contained.
    // 15x15 or proportional width.
    doc.addImage("/logo-somba.png", "PNG", 14, 10, 15, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(t("dashboard.report.title"), 105, 20, { align: "center" });

    // Draw Divider Line
    doc.setLineWidth(0.5);
    doc.line(14, 30, 196, 30); // Moved down to 30

    // Meta Info (Below Divider)
    // Meta Info
    const metaY = 36;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Label Style
    doc.setTextColor(100, 116, 139); // Gray
    doc.text(`${t("dashboard.report.site")}:`, 14, metaY);
    doc.text(`${t("dashboard.report.date")}:`, 90, metaY); // Center-ish
    doc.text(`${t("dashboard.report.lastData")}:`, 196, metaY, {
      align: "right",
    });

    // Value Style
    const valY = metaY + 5;
    doc.setTextColor(30, 41, 59); // Dark
    doc.text(props.siteName || "-", 14, valY);
    doc.text(props.date || "-", 90, valY);
    doc.text(props.lastUpdated || "-", 196, valY, { align: "right" });

    // Summary Cards
    const startY = 55;
    const cw = 57; // Card Width
    const ch = 24; // Card Height (Increased for better spacing)
    const gap = 5;

    // Common Border Color
    doc.setDrawColor(229, 231, 235); // #e5e7eb

    // 1. Total Card
    doc.setFillColor(248, 249, 250); // #f8f9fa (Light Gray)
    doc.rect(14, startY, cw, ch, "FD"); // Fill and Draw Border

    doc.setTextColor(30, 41, 59); // Dark Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(String(props.summary.total || 0), 14 + cw / 2, startY + 10, {
      align: "center",
    }); // Value

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // Gray Label
    doc.text(
      t("dashboard.alerts.summary.totalToday.title"),
      14 + cw / 2,
      startY + 18,
      { align: "center" }
    );

    // // 2. Resolved Card
    doc.setFillColor(236, 253, 245); // #ecfdf5 (Light Green)
    doc.rect(14 + cw + gap, startY, cw, ch, "FD");

    doc.setTextColor(6, 95, 70); // #065f46 (Dark Green)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      String(props.summary.resolved || 0),
      14 + cw + gap + cw / 2,
      startY + 10,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    // Label color could be same Dark Green or Gray. Preview snippet suggests green text?
    // "Selesai" text in snippet is green? Actually logic says: .resolved { color: #065f46 } which applies to text.
    doc.text(
      t("dashboard.alerts.summary.resolvedToday.title"),
      14 + cw + gap + cw / 2,
      startY + 18,
      { align: "center" }
    );

    // // 3. Unresolved Card
    doc.setFillColor(254, 242, 242); // #fef2f2 (Light Red)
    doc.rect(14 + cw * 2 + gap * 2, startY, cw, ch, "FD");

    doc.setTextColor(153, 27, 27); // #991b1b (Dark Red)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(
      String(props.summary.unresolved || 0),
      14 + cw * 2 + gap * 2 + cw / 2,
      startY + 10,
      { align: "center" }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      t("dashboard.alerts.summary.unresolvedToday.title"),
      14 + cw * 2 + gap * 2 + cw / 2,
      startY + 18,
      { align: "center" }
    );

    // Table Content
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: 90, // Moved down to 60 because summary cards are hidden for temporary; original is 90 clear Summary Cards
      head: [
        [
          t("dashboard.alerts.table.violation"),
          t("dashboard.alerts.table.duration"),
          t("dashboard.alerts.table.detection"),
          t("dashboard.alerts.table.time"),
          t("dashboard.alerts.table.status"),
        ],
      ],
      body: props.alerts.map((item) => [
        " ", // Placeholder for Col 0 (Custom drawn stacked text)
        formatDuration(item.duration_minutes),
        item.detection_count || item.total_detections || "-",
        formatTime(item.event_start),
        "", // Empty string to prevent double printing (handled by didDrawCell)
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [240, 244, 248], // Light Gray/Blueish
        textColor: [30, 41, 59], // Dark Slate
        font: "helvetica",
        fontStyle: "bold",
        halign: "center", // Global alignment. If Col 0 header needs left, we override in didParseCell
        lineWidth: 0.1,
        lineColor: [226, 232, 240], // Light border
      },
      bodyStyles: {
        font: "helvetica",
        textColor: [51, 65, 85],
        lineWidth: 0, // Striped usually implies no vertical borders in body
        cellPadding: 4,
        minCellHeight: 15, // Increase height for stacked text
      },
      columnStyles: {
        0: { cellWidth: "auto", halign: "left" },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 25, halign: "center" },
        4: { cellWidth: 30, halign: "center" },
      },
      margin: { top: 75 },
      didParseCell: (data) => {
        // Force header centering for all columns
        if (data.section === "head") {
          data.cell.styles.halign = "center";
        }
      },
      didDrawCell: (data) => {
        // Column 0: Stacked Name & Camera
        if (data.section === "body" && data.column.index === 0) {
          const item = props.alerts[data.row.index];
          const name =
            item.detected_objects?.[0]?.display_name ||
            item.detected_objects?.[0]?.object_type ||
            "-";
          const camera = item.camera_name || "-";
          const cell = data.cell;

          // Draw Name (Bold)
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.text(name, cell.x + 4, cell.y + 6);

          // Draw Camera (Normal, Gray, Below)
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(camera, cell.x + 4, cell.y + 11);
        }

        // Draw custom badge for Status column (index 4)
        if (data.section === "body" && data.column.index === 4) {
          const status = props.alerts[data.row.index].status;
          const text = statusLabel(status);
          const cell = data.cell;

          // Determine colors (matched to dashboard badges)
          let fillColor = [245, 248, 250]; // Secondary
          let checkColor = [126, 130, 153];
          const s = normalizeKey(status);

          if (s === "resolved" || s === "completed") {
            fillColor = [232, 255, 243]; // Light Green
            checkColor = [80, 205, 137]; // Dark Green
          } else if (s === "notresolved") {
            fillColor = [255, 245, 248]; // Light Red
            checkColor = [241, 65, 108]; // Dark Red
          } else if (s === "falsealarm") {
            fillColor = [248, 245, 255]; // Light Purple
            checkColor = [114, 57, 234]; // Dark Purple
          }

          // Calculate text dimensions to fit badge
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          const textWidth = doc.getTextWidth(text);
          const badgeWidth = textWidth + 8; // More padding
          const badgeHeight = 6;

          // Center the badge relative to cell
          const x = cell.x + (cell.width - badgeWidth) / 2;
          const y = cell.y + (cell.height - badgeHeight) / 2;

          // Draw Badge Background
          doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
          doc.roundedRect(x, y, badgeWidth, badgeHeight, 3, 3, "F"); // More rounded

          // Draw Text
          doc.setTextColor(checkColor[0], checkColor[1], checkColor[2]);
          // Remove adjustment (+ 1.25) to rely on baseline 'middle' for true centering
          doc.text(text, cell.x + cell.width / 2, cell.y + cell.height / 2, {
            align: "center",
            baseline: "middle",
          });
        }
      },
      didDrawPage: (data) => {
        // Header logic moved to main execution to avoid duplication, or simplified here.
        // If we want header on EVERY page, keep it here.
        // But title "Laporan Harian" usually only on first page? User said title overlapping.
        // My previous code had:
        // if (data.pageNumber === 1) { ... draw title ... }
        // AND I also drew title manually before autoTable. That caused duplication on Page 1.
        // Solution: Draw title MANUALLY only (before autoTable). NOT in didDrawPage.
        // However, the LINE and Logo might be needed on every page?
        // Usually reports have full header on p1, and minimal header on p2+.
        // Let's keep P1 header manual, and maybe just page numbers in footer.
      },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer (Page Number)
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${t("dashboard.report.generatedBy")}`, 14, 285);
      doc.text(`${t("dashboard.report.page")} ${i} of ${pageCount}`, 190, 285, {
        align: "right",
      });
    }

    doc.save(`Laporan_Harian_Somba_${props.date || "Update"}.pdf`);
    emit("close");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Gagal membuat PDF. Silakan coba lagi.");
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-container {
  background: white;
  width: 90%;
  max-width: 800px;
  height: 90vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.modal-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  margin: 0;
  font-size: 1.25rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.modal-footer {
  padding: 16px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}
.btn-primary {
  background: #1e1e2d;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-content {
  background: white;
  width: 210mm;
  min-height: 297mm; /* A4 size approximation */
  padding: 20mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #333; /* Inherit font-family from app */
  position: relative;
  display: flex;
  flex-direction: column;
}
.report-footer {
  margin-top: auto;
  border-top: 1px solid #eee;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #666;
}
/* Badge Styles mimicking Dashboard */
.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.475rem;
}
.badge-light-success {
  color: #50cd89;
  background-color: #e8fff3;
}
.badge-light-danger {
  color: #f1416c;
  background-color: #fff5f8;
}
.badge-light-info {
  color: #7239ea;
  background-color: #f8f5ff;
}
.badge-light-secondary {
  color: #7e8299;
  background-color: #f5f8fa;
}
.btn-primary {
  background: #2563eb;
  color: white;
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Report Styles (Preview) */
.report-content {
  background: white;
  width: 100%;
  max-width: 800px;
  min-height: auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #333;
  box-sizing: border-box;
}
.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.report-logo {
  height: 50px;
}
.header-center {
  flex: 1;
  text-align: center;
}
.report-title {
  font-size: 18px;
  margin: 0;
  font-weight: bold;
}
/* .header-right removed/modified */

.meta-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
}
.meta-item {
  display: flex;
  flex-direction: column;
} /* Stack label and value or keep inline if preferred */
/* Let's keep inline for simplicity or specific layout user might want. 
   User said "Locations and last data move below header line". 
   For A4, maybe 3 columns? Or stacked? 
   Let's do a flex row for neatness.
*/
.meta-item {
  display: flex;
  gap: 5px;
}

.divider {
  border: 0;
  border-top: 2px solid #333;
  margin: 10px 0 20px 0;
}

.summary-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.summary-card {
  flex: 1;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}
.card-label {
  font-size: 12px;
  color: #666;
}
.total {
  background: #f8f9fa;
}
.resolved {
  background: #ecfdf5;
  color: #065f46;
}
.unresolved {
  background: #fef2f2;
  color: #991b1b;
}

.table-section {
  margin-bottom: 30px;
}
.table-title {
  font-size: 14px;
  margin-bottom: 10px;
  border-left: 4px solid #2563eb;
  padding-left: 10px;
}
.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.report-table th,
.report-table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.report-table th {
  background: #f1f5f9;
  font-weight: bold;
}
.report-table tr:nth-child(even) {
  background: #f8fafc;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
}
.status-active {
  background: #eff6ff;
  color: #1e40af;
}
.status-resolved {
  background: #ecfdf5;
  color: #065f46;
}

.report-footer {
  margin-top: 40px;
  border-top: 1px solid #eee;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #999;
}

.text-center {
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-width: none;
    height: 95vh;
  }

  .report-content {
    padding: 15px;
    max-width: 100%;
  }

  .report-logo {
    height: 35px;
  }

  .report-title {
    font-size: 14px;
  }

  .meta-section {
    flex-direction: column;
    gap: 8px;
    font-size: 10px;
  }

  .summary-section {
    flex-direction: column;
    gap: 10px;
  }

  .report-table {
    font-size: 10px;
  }

  .report-table th,
  .report-table td {
    padding: 6px 4px;
  }

  .card-value {
    font-size: 20px;
  }

  .card-label {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .report-content {
    padding: 10px;
  }

  .report-table {
    font-size: 9px;
  }

  .report-table th,
  .report-table td {
    padding: 4px 2px;
  }
}
</style>
