<template>
  <div>
    <div
      class="h-full rounded-lg border border-[#e4e6ef] bg-white dark:bg-gray-900"
    >
      <div class="p-4">
        <!-- Icon and Title -->
        <div class="flex items-center mb-3">
          <div
            class="mr-3 flex h-[45px] w-[45px] items-center justify-center rounded-full"
            :style="{ backgroundColor: bgColor || '#2196f3' }"
          >
            <i
              :class="icon || 'fas fa-tasks'"
              class="fs-2 text-[#1a1a1a] opacity-100 dark:text-white"
            ></i>
          </div>
          <div class="flex-1">
            <h5 class="mb-0 text-sm font-bold text-gray-900 dark:text-gray-100">{{ activityName }}</h5>
          </div>
        </div>

        <!-- Time Information -->
        <div class="border-t border-dashed border-[#e4e6ef] pt-3">
          <!-- Earliest Active -->
          <div class="mb-2 py-1">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ t('dashboard.activities.summary.earliestActive') || 'Pertama Aktif' }}</span>
              <span class="text-xs font-semibold text-gray-900 dark:text-gray-100">
                {{ earliestActiveFormatted }}
              </span>
            </div>
          </div>

          <!-- Latest Active -->
          <div class="py-1">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ t('dashboard.activities.summary.latestActive') || 'Terakhir Aktif' }}</span>
              <span class="text-xs font-semibold text-gray-900 dark:text-gray-100">
                {{ latestActiveFormatted }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDateTimeGMT8 } from '@/core/helpers/timezone';

const { t } = useI18n();

interface Props {
  activityName: string;
  earliestActive: string | null;
  latestActive: string | null;
  icon?: string;
  bgColor?: string;
}

const props = defineProps<Props>();

const earliestActiveFormatted = computed(() => {
  if (!props.earliestActive) {
    return t('dashboard.activities.summary.noActivity') || 'Belum ada aktivitas';
  }
  return formatDateTimeGMT8(props.earliestActive, 'HH:mm:ss');
});

const latestActiveFormatted = computed(() => {
  if (!props.latestActive) {
    return t('dashboard.activities.summary.noActivity') || 'Belum ada aktivitas';
  }
  return formatDateTimeGMT8(props.latestActive, 'HH:mm:ss');
});
</script>
