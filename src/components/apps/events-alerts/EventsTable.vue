<template>
  <KTDataTable
    :data="events"
    :header="header"
    :checkbox-enabled="false"
    :items-per-page-dropdown-enabled="false"
    :items-per-page="pagination.per_page"
    :current-page="pagination.page"
    :total="pagination.total_items"
    :loading="loading"
    :sort-label="sortLabel"
    :sort-order="sortOrder"
    @on-sort="onSort"
    :empty-table-text="t('appsEventsAlerts.eventsTable.empty')"
  >
    <template #event_name="{ row }">
      <div class="d-flex align-items-center" style="max-width: 300px; min-width: 250px;">
        <div class="me-3">
          <img
            v-if="row.image_url"
            :src="row.image_url"
            class="rounded"
            alt="Event Thumbnail"
            style="width: 60px; height: 60px; object-fit: cover;"
            @error="handleImageError"
          />
          <div v-else class="bg-light rounded d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
            <i class="ki-duotone ki-picture fs-2x text-muted"><span class="path1"></span><span class="path2"></span></i>
          </div>
        </div>
        <div class="d-flex flex-column">
          <span class="text-dark fw-bold text-hover-primary fs-6">
            {{ row.event_name || 'Unknown Event' }}
          </span>
          <span class="text-muted fs-7">{{ row.camera_name }}</span>
        </div>
      </div>
    </template>

    <template #duration="{ row }">
      <span class="text-dark fw-bold fs-6">{{ formatDuration(row.duration_minutes) }}</span>
    </template>

    

    <template #timestamp="{ row }">
      <span class="text-dark fw-bold d-block fs-6">{{ formatDate(row.event_start) }}</span>
      <span class="text-muted fw-semibold d-block fs-7">{{ formatTime(row.event_start) }}</span>
    </template>

    <template #status="{ row }">
      <span class="badge" :class="statusBadge(row.status)">{{ statusLabel(row.status) }}</span>
    </template>

    <template #actions="{ row }">
      <button
        @click="viewDetail(row)"
        class="btn btn-sm btn-light-primary btn-icon"
        title="View Detail"
      >
        <i class="ki-duotone ki-eye fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
      </button>
    </template>
  </KTDataTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue';

const props = defineProps<{ 
  events: any[];
  header: any[];
  pagination: { page:number; per_page:number; total_items:number; total_pages:number };
  loading: boolean;
  sortLabel: string;
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e:'sort', payload:{ label:string; order:'asc'|'desc' }): void;
  (e:'viewDetail', event:any): void;
}>();

const { t } = useI18n();

const onSort = (payload: { label:string; order:'asc'|'desc' }) => emit('sort', payload);
const viewDetail = (event: any) => emit('viewDetail', event);

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.style.display = 'none';
  const parent = img.parentElement;
  if (parent) {
    parent.innerHTML = '<div class="bg-light rounded d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;"><i class="ki-duotone ki-picture fs-2x text-muted"><span class="path1"></span><span class="path2"></span></i></div>';
  }
};

const formatNumber = (value:number, maximumFractionDigits=1) => new Intl.NumberFormat(undefined, { maximumFractionDigits, minimumFractionDigits:0 }).format(value);

const formatDuration = (minutes?: number | null) => {
  if (minutes === undefined || minutes === null || Number.isNaN(minutes)) return t('appsEventsAlerts.format.notAvailable');
  if ((minutes||0) < 1) return t('appsEventsAlerts.format.secondsLong', { value: formatNumber(Math.max(0, (minutes||0)*60), 2) });
  return t('appsEventsAlerts.format.minutesLong', { value: formatNumber(Math.max(0, minutes||0), 2) });
};

// avg_seconds_with_detection hidden per request

const formatDate = (value?: string) => {
  if (!value) return '-';
  try { return new Date(value).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' }); } catch { return value; }
};

const formatTime = (value?: string) => {
  if (!value) return '-';
  try { 
    const timeStr = new Date(value).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false });
    return timeStr.substring(0, 5);
  } catch { return value; }
};

const normalizeKey = (v?:string) => (v||'').toLowerCase().replace(/[\s_-]/g,'');
const statusBadge = (status:string) => {
  const k = normalizeKey(status);
  if (k==='active' || k==='unresolved') return 'badge-light-danger';
  if (k==='acknowledged') return 'badge-light-warning';
  if (k==='resolved' || k==='notresolved') return 'badge-light-success';
  if (k==='falsedetection') return 'badge-light-info';
  return 'badge-light-secondary';
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
