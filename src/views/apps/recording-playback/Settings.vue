<template>
  <!--begin::Recording & Playback Settings-->
  <div class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
    <h4 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
      {{ t("appsRecordingPlayback.settings.header.title") }}
    </h4>
    <p class="m-0 text-gray-500">
      {{ t("appsRecordingPlayback.settings.header.description") }}
    </p>
  </div>

  <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
    <!--begin::Recording Settings-->
    <div>
      <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsRecordingPlayback.settings.recording.title") }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveRecordingSettings">
            <!--begin::Recording Mode-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.recording.mode.label") }}
              </label>
              <select v-model="recordingSettings.mode" :class="formInputClass">
                <option
                  v-for="option in recordingModeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.recording.mode.help") }}</div>
            </div>
            <!--end::Recording Mode-->

            <!--begin::Video Quality-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.recording.quality.label") }}
              </label>
              <select v-model="recordingSettings.quality" :class="formInputClass">
                <option
                  v-for="option in recordingQualityOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.recording.quality.help") }}</div>
            </div>
            <!--end::Video Quality-->

            <!--begin::Frame Rate-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.recording.frameRate.label") }}
              </label>
              <select v-model.number="recordingSettings.frameRate" :class="formInputClass">
                <option
                  v-for="option in frameRateOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.recording.frameRate.help") }}</div>
            </div>
            <!--end::Frame Rate-->

            <!--begin::Compression-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.recording.compression.label") }}
              </label>
              <select v-model="recordingSettings.compression" :class="formInputClass">
                <option
                  v-for="option in compressionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.recording.compression.help") }}</div>
            </div>
            <!--end::Compression-->

            <!--begin::Pre/Post Recording-->
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="mb-7">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsRecordingPlayback.settings.recording.preRecording.label") }}
                </label>
                <input
                  type="number"
                  v-model.number="recordingSettings.preRecordingSeconds"
                  min="0"
                  max="60"
                  :class="formInputClass"
                />
                <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.recording.preRecording.help") }}</div>
              </div>
              <div class="mb-7">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("appsRecordingPlayback.settings.recording.postRecording.label") }}
                </label>
                <input
                  type="number"
                  v-model.number="recordingSettings.postRecordingSeconds"
                  min="0"
                  max="300"
                  :class="formInputClass"
                />
                <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.recording.postRecording.help") }}</div>
              </div>
            </div>
            <!--end::Pre/Post Recording-->

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingRecordingSettings"
                class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="savingRecordingSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{
                  savingRecordingSettings
                    ? t("appsRecordingPlayback.settings.actions.saving")
                    : t("appsRecordingPlayback.settings.actions.saveRecording")
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Recording Settings-->

    <!--begin::Storage Settings-->
    <div class="col-xl-6">
      <div class="card">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ t("appsRecordingPlayback.settings.storage.title") }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveStorageSettings">
            <!--begin::Storage Location-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.storage.location.label") }}
              </label>
              <div class="flex">
                <input
                  type="text"
                  v-model="storageSettings.location"
                  readonly
                  class="w-full rounded-l-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
                <button
                  type="button"
                  @click="selectStorageLocation"
                  class="shrink-0 rounded-r-md border border-l-0 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  {{ t("appsRecordingPlayback.settings.storage.location.browse") }}
                </button>
              </div>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.storage.location.help") }}</div>
            </div>
            <!--end::Storage Location-->

            <!--begin::Retention Policy-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.storage.retention.label") }}
              </label>
              <select v-model="storageSettings.retentionPolicy" :class="formInputClass">
                <option
                  v-for="option in retentionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ t(option.labelKey) }}
                </option>
              </select>
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.storage.retention.help") }}</div>
            </div>
            <!--end::Retention Policy-->

            <!--begin::Storage Limit-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.storage.limit.label") }}
              </label>
              <input
                type="number"
                v-model.number="storageSettings.maxStorageGB"
                min="100"
                max="10000"
                :class="formInputClass"
              />
              <div class="mt-1 text-sm text-gray-500">{{ t("appsRecordingPlayback.settings.storage.limit.help") }}</div>
            </div>
            <!--end::Storage Limit-->

            <!--begin::Current Storage Usage-->
            <div class="mb-7">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("appsRecordingPlayback.settings.storage.usage.label") }}
              </label>
              <div class="h-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  class="flex h-full items-center justify-center text-xs font-semibold text-white"
                  :style="{ width: storageUsagePercentage + '%' }"
                  :class="getStorageUsageClass()"
                >
                  {{ storageUsagePercentage }}%
                </div>
              </div>
              <div class="mt-2 flex justify-between">
                <span class="text-sm text-gray-500">
                  {{ t("appsRecordingPlayback.settings.storage.usage.used", { value: formatNumber(usedStorageGB) }) }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ t("appsRecordingPlayback.settings.storage.usage.total", { value: formatNumber(storageSettings.maxStorageGB) }) }}
                </span>
              </div>
            </div>
            <!--end::Current Storage Usage-->

            <!--begin::Backup Settings-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="storageSettings.backup.enabled"
                />
                <span class="form-check-label font-semibold text-gray-800">
                  {{ t("appsRecordingPlayback.settings.storage.backup.label") }}
                </span>
              </label>
              <div class="text-sm text-gray-500">
                {{ t("appsRecordingPlayback.settings.storage.backup.help") }}
              </div>

              <div v-if="storageSettings.backup.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsRecordingPlayback.settings.storage.backup.provider.label") }}
                  </label>
                  <select v-model="storageSettings.backup.provider" :class="formInputClass">
                    <option
                      v-for="option in backupProviderOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ t(option.labelKey) }}
                    </option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsRecordingPlayback.settings.storage.backup.schedule.label") }}
                  </label>
                  <select v-model="storageSettings.backup.schedule" :class="formInputClass">
                    <option
                      v-for="option in backupScheduleOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ t(option.labelKey) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <!--end::Backup Settings-->

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingStorageSettings"
                class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span v-if="savingStorageSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{
                  savingStorageSettings
                    ? t("appsRecordingPlayback.settings.actions.saving")
                    : t("appsRecordingPlayback.settings.actions.saveStorage")
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Storage Settings-->
  </div>

  <!--begin::Recording Schedule-->
  <div class="mt-5" v-if="recordingSettings.mode === 'scheduled' || recordingSettings.mode === 'hybrid'">
    <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div class="flex flex-wrap items-center justify-between gap-3 p-6 pb-0">
        <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ t("appsRecordingPlayback.settings.schedule.title") }}
        </h3>
        <button
          @click="addSchedule"
          class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98]"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("appsRecordingPlayback.settings.schedule.actions.add") }}
        </button>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 font-bold text-gray-500 dark:border-gray-800">
                <th class="min-w-[150px] py-3 text-left">{{ t("appsRecordingPlayback.settings.schedule.table.camera") }}</th>
                <th class="min-w-[120px] py-3 text-left">{{ t("appsRecordingPlayback.settings.schedule.table.days") }}</th>
                <th class="min-w-[120px] py-3 text-left">{{ t("appsRecordingPlayback.settings.schedule.table.start") }}</th>
                <th class="min-w-[120px] py-3 text-left">{{ t("appsRecordingPlayback.settings.schedule.table.end") }}</th>
                <th class="min-w-[100px] py-3 text-left">{{ t("appsRecordingPlayback.settings.schedule.table.status") }}</th>
                <th class="min-w-[100px] py-3 text-right">{{ t("appsRecordingPlayback.settings.schedule.table.actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="schedule in recordingSchedules"
                :key="schedule.id"
                class="border-b border-gray-100 last:border-b-0 dark:border-gray-800"
              >
                <td class="py-3">
                  <span class="block font-bold text-gray-900 dark:text-gray-100">
                    {{ getCameraName(schedule.camera_uid) }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="day in schedule.days"
                      :key="day"
                      class="inline-flex rounded px-2 py-1 text-xs font-semibold"
                      :class="badgeVariantClass('primary')"
                    >
                      {{ getScheduleDayLabel(day) }}
                    </span>
                  </div>
                </td>
                <td class="py-3">
                  <span class="font-bold text-gray-900 dark:text-gray-100">{{ schedule.start_time }}</span>
                </td>
                <td class="py-3">
                  <span class="font-bold text-gray-900 dark:text-gray-100">{{ schedule.end_time }}</span>
                </td>
                <td class="py-3">
                  <span
                    class="inline-flex rounded px-2 py-1 text-xs font-semibold"
                    :class="badgeVariantClass(schedule.enabled ? 'success' : 'secondary')"
                  >
                    {{ schedule.enabled ? t("appsRecordingPlayback.settings.schedule.status.active") : t("appsRecordingPlayback.settings.schedule.status.inactive") }}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <div class="flex justify-end gap-1">
                    <RowActionButton
                      @click="editSchedule(schedule)"
                      :title="t('appsRecordingPlayback.settings.schedule.actions.edit')"
                    >
                      <i class="ki-duotone ki-pencil fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </RowActionButton>
                    <RowActionButton
                      @click="deleteSchedule(schedule)"
                      :title="t('appsRecordingPlayback.settings.schedule.actions.delete')"
                      variant="danger"
                    >
                      <i class="ki-duotone ki-trash fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                    </RowActionButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="recordingSchedules.length === 0" class="py-5 text-center">
          <i class="ki-duotone ki-calendar-8 mb-3 text-3xl text-gray-400">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
            <span class="path6"></span>
          </i>
          <p class="text-gray-500">{{ t("appsRecordingPlayback.settings.schedule.table.empty") }}</p>
        </div>
      </div>
    </div>
  </div>
  <!--end::Recording Schedule-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import RowActionButton from "@/components/common/RowActionButton.vue";
import { formInputClass, badgeVariantClass } from "@/core/helpers/badge";

// Interface definitions
interface RecordingSettings {
  mode: 'continuous' | 'scheduled' | 'motion' | 'hybrid';
  quality: '720p' | '1080p' | '4k';
  frameRate: number;
  compression: 'h264' | 'h265' | 'mjpeg';
  preRecordingSeconds: number;
  postRecordingSeconds: number;
}

interface StorageSettings {
  location: string;
  retentionPolicy: 'never' | '7days' | '30days' | '90days' | '1year' | 'storage_full';
  maxStorageGB: number;
  backup: {
    enabled: boolean;
    provider: 'aws_s3' | 'google_cloud' | 'azure_blob' | 'ftp';
    schedule: 'immediately' | 'hourly' | 'daily' | 'weekly';
  };
}

interface RecordingSchedule {
  id: string;
  camera_uid: string;
  days: string[];
  start_time: string;
  end_time: string;
  enabled: boolean;
}

interface Camera {
  uid: string;
  name: string;
}

const { t } = useI18n();

const formatNumber = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

const recordingModeOptions = [
  { value: 'continuous', labelKey: 'appsRecordingPlayback.settings.recording.mode.options.continuous' },
  { value: 'scheduled', labelKey: 'appsRecordingPlayback.settings.recording.mode.options.scheduled' },
  { value: 'motion', labelKey: 'appsRecordingPlayback.settings.recording.mode.options.motion' },
  { value: 'hybrid', labelKey: 'appsRecordingPlayback.settings.recording.mode.options.hybrid' },
];

const recordingQualityOptions = [
  { value: '720p', labelKey: 'appsRecordingPlayback.settings.recording.quality.options.720p' },
  { value: '1080p', labelKey: 'appsRecordingPlayback.settings.recording.quality.options.1080p' },
  { value: '4k', labelKey: 'appsRecordingPlayback.settings.recording.quality.options.4k' },
];

const frameRateOptions = [
  { value: 15, labelKey: 'appsRecordingPlayback.settings.recording.frameRate.options.fps15' },
  { value: 25, labelKey: 'appsRecordingPlayback.settings.recording.frameRate.options.fps25' },
  { value: 30, labelKey: 'appsRecordingPlayback.settings.recording.frameRate.options.fps30' },
  { value: 60, labelKey: 'appsRecordingPlayback.settings.recording.frameRate.options.fps60' },
];

const compressionOptions = [
  { value: 'h264', labelKey: 'appsRecordingPlayback.settings.recording.compression.options.h264' },
  { value: 'h265', labelKey: 'appsRecordingPlayback.settings.recording.compression.options.h265' },
  { value: 'mjpeg', labelKey: 'appsRecordingPlayback.settings.recording.compression.options.mjpeg' },
];

const retentionOptions = [
  { value: 'never', labelKey: 'appsRecordingPlayback.settings.storage.retention.options.never' },
  { value: '7days', labelKey: 'appsRecordingPlayback.settings.storage.retention.options.7days' },
  { value: '30days', labelKey: 'appsRecordingPlayback.settings.storage.retention.options.30days' },
  { value: '90days', labelKey: 'appsRecordingPlayback.settings.storage.retention.options.90days' },
  { value: '1year', labelKey: 'appsRecordingPlayback.settings.storage.retention.options.1year' },
  { value: 'storage_full', labelKey: 'appsRecordingPlayback.settings.storage.retention.options.storageFull' },
];

const backupProviderOptions = [
  { value: 'aws_s3', labelKey: 'appsRecordingPlayback.settings.storage.backup.provider.options.awsS3' },
  { value: 'google_cloud', labelKey: 'appsRecordingPlayback.settings.storage.backup.provider.options.googleCloud' },
  { value: 'azure_blob', labelKey: 'appsRecordingPlayback.settings.storage.backup.provider.options.azureBlob' },
  { value: 'ftp', labelKey: 'appsRecordingPlayback.settings.storage.backup.provider.options.ftp' },
];

const backupScheduleOptions = [
  { value: 'immediately', labelKey: 'appsRecordingPlayback.settings.storage.backup.schedule.options.immediately' },
  { value: 'hourly', labelKey: 'appsRecordingPlayback.settings.storage.backup.schedule.options.hourly' },
  { value: 'daily', labelKey: 'appsRecordingPlayback.settings.storage.backup.schedule.options.daily' },
  { value: 'weekly', labelKey: 'appsRecordingPlayback.settings.storage.backup.schedule.options.weekly' },
];

const dayKeyMap: Record<string, string> = {
  mon: 'mon',
  tue: 'tue',
  wed: 'wed',
  thu: 'thu',
  fri: 'fri',
  sat: 'sat',
  sun: 'sun',
};

const getScheduleDayLabel = (day: string) => {
  const normalized = (day ?? '').toLowerCase().slice(0, 3);
  const key = dayKeyMap[normalized];
  return key ? t(`appsRecordingPlayback.settings.schedule.days.${key}`) : day;
};
// Reactive data
const recordingSettings = ref<RecordingSettings>({
  mode: 'hybrid',
  quality: '1080p',
  frameRate: 25,
  compression: 'h264',
  preRecordingSeconds: 5,
  postRecordingSeconds: 10
});

const storageSettings = ref<StorageSettings>({
  location: '/var/recordings',
  retentionPolicy: '30days',
  maxStorageGB: 1000,
  backup: {
    enabled: false,
    provider: 'aws_s3',
    schedule: 'daily'
  }
});

const recordingSchedules = ref<RecordingSchedule[]>([]);
const cameras = ref<Camera[]>([]);

const savingRecordingSettings = ref(false);
const savingStorageSettings = ref(false);

// Mock data
const mockCameras: Camera[] = [
  { uid: "cam1", name: "Front Entrance" },
  { uid: "cam2", name: "Parking Area" },
  { uid: "cam3", name: "Reception Desk" },
];

const mockSchedules: RecordingSchedule[] = [
  {
    id: "1",
    camera_uid: "cam1",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    start_time: "08:00",
    end_time: "18:00",
    enabled: true
  },
  {
    id: "2",
    camera_uid: "cam2",
    days: ["Sat", "Sun"],
    start_time: "00:00",
    end_time: "23:59",
    enabled: true
  }
];

// Computed properties
const usedStorageGB = computed(() => 450); // Mock data
const storageUsagePercentage = computed(() =>
  Math.round((usedStorageGB.value / storageSettings.value.maxStorageGB) * 100)
);

// Methods
const loadSettings = async () => {
  try {
    // TODO: Load settings from API
    // const response = await ApiService.get('/settings/recording-playback');
    // recordingSettings.value = response.data.recordingSettings;
    // storageSettings.value = response.data.storageSettings;
    
    // Load cameras
    cameras.value = mockCameras;
    recordingSchedules.value = mockSchedules;
    
    console.log("Settings loaded");
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveRecordingSettings = async () => {
  savingRecordingSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/recording-playback/recording', recordingSettings.value);
    
    console.log("Recording settings saved:", recordingSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving recording settings:", error);
  } finally {
    savingRecordingSettings.value = false;
  }
};

const saveStorageSettings = async () => {
  savingStorageSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/recording-playback/storage', storageSettings.value);
    
    console.log("Storage settings saved:", storageSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving storage settings:", error);
  } finally {
    savingStorageSettings.value = false;
  }
};

const selectStorageLocation = () => {
  console.log("Select storage location");
  // TODO: Open file browser dialog
};

const getStorageUsageClass = () => {
  const percentage = storageUsagePercentage.value;
  if (percentage >= 90) return 'bg-danger';
  if (percentage >= 75) return 'bg-warning';
  return 'bg-success';
};

const getCameraName = (cameraUid: string): string => {
  const camera = cameras.value.find(c => c.uid === cameraUid);
  return camera ? camera.name : t('appsRecordingPlayback.settings.schedule.unknownCamera');
};

const addSchedule = () => {
  console.log("Add new schedule");
  // TODO: Open schedule creation modal
};

const editSchedule = (schedule: RecordingSchedule) => {
  console.log("Edit schedule:", schedule);
  // TODO: Open schedule edit modal
};

const deleteSchedule = async (schedule: RecordingSchedule) => {
  if (confirm(t('appsRecordingPlayback.settings.messages.deleteScheduleConfirm'))) {
    try {
      // TODO: API call to delete schedule
      // await ApiService.delete(`/recording-schedules/${schedule.id}`);
      
      // Remove from local state
      const index = recordingSchedules.value.findIndex(s => s.id === schedule.id);
      if (index !== -1) {
        recordingSchedules.value.splice(index, 1);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  }
};

// Initialize data on component mount
onMounted(() => {
  loadSettings();
});
</script>
