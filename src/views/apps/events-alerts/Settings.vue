<template>
  <!--begin::Events & Alerts Settings-->
  <div class="mb-5 p-4" :class="cardClass">
    <h4 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
      {{ t("appsEventsAlerts.settings.header.title") }}
    </h4>
    <p class="m-0 text-gray-500">
      {{ t("appsEventsAlerts.settings.header.description") }}
    </p>
  </div>

  <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
    <!--begin::Event Detection Settings-->
    <div>
      <div :class="cardClass">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ t("appsEventsAlerts.settings.eventDetection.title") }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveEventSettings">
            <!--begin::Motion Detection-->
            <div class="mb-7">
              <ToggleSwitch v-model="eventSettings.motionDetection.enabled">
                {{ t("appsEventsAlerts.settings.eventDetection.motion.label") }}
              </ToggleSwitch>
              <div class="text-sm text-gray-500">
                {{ t("appsEventsAlerts.settings.eventDetection.motion.description") }}
              </div>

              <div v-if="eventSettings.motionDetection.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.eventDetection.motion.sensitivity") }}
                  </label>
                  <select v-model="eventSettings.motionDetection.sensitivity" :class="formInputClass">
                    <option value="low">{{ t("appsEventsAlerts.table.severity.low") }}</option>
                    <option value="medium">{{ t("appsEventsAlerts.table.severity.medium") }}</option>
                    <option value="high">{{ t("appsEventsAlerts.table.severity.high") }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.eventDetection.motion.minArea") }}
                  </label>
                  <input
                    type="range"
                    class="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary dark:bg-gray-700"
                    min="1"
                    max="50"
                    v-model="eventSettings.motionDetection.minArea"
                  />
                  <div class="text-sm text-gray-500">{{ eventSettings.motionDetection.minArea }}%</div>
                </div>
              </div>
            </div>
            <!--end::Motion Detection-->

            <!--begin::Intrusion Detection-->
            <div class="mb-7">
              <ToggleSwitch v-model="eventSettings.intrusionDetection.enabled">
                {{ t("appsEventsAlerts.settings.eventDetection.intrusion.label") }}
              </ToggleSwitch>
              <div class="text-sm text-gray-500">
                {{ t("appsEventsAlerts.settings.eventDetection.intrusion.description") }}
              </div>

              <div v-if="eventSettings.intrusionDetection.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.eventDetection.intrusion.zones") }}
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="zone in eventSettings.intrusionDetection.zones"
                      :key="zone"
                      class="inline-flex rounded px-2 py-1 text-xs font-semibold"
                      :class="badgeVariantClass('primary')"
                    >
                      {{ zone }}
                    </span>
                  </div>
                  <button
                    type="button"
                    @click="configureZones"
                    class="mt-2 inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    {{ t("appsEventsAlerts.settings.eventDetection.intrusion.configure") }}
                  </button>
                </div>
              </div>
            </div>
            <!--end::Intrusion Detection-->

            <!--begin::System Monitoring-->
            <div class="mb-7">
              <ToggleSwitch v-model="eventSettings.systemMonitoring.enabled">
                {{ t("appsEventsAlerts.settings.eventDetection.system.label") }}
              </ToggleSwitch>
              <div class="text-sm text-gray-500">
                {{ t("appsEventsAlerts.settings.eventDetection.system.description") }}
              </div>

              <div v-if="eventSettings.systemMonitoring.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                      v-model="eventSettings.systemMonitoring.cameraOffline"
                    />
                    <span class="text-sm text-gray-800 dark:text-gray-300">{{ t("appsEventsAlerts.settings.eventDetection.system.cameraOffline") }}</span>
                  </label>
                </div>

                <div class="mb-4">
                  <label class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                      v-model="eventSettings.systemMonitoring.lowDiskSpace"
                    />
                    <span class="text-sm text-gray-800 dark:text-gray-300">{{ t("appsEventsAlerts.settings.eventDetection.system.lowDiskSpace") }}</span>
                  </label>
                </div>

                <div class="mb-4">
                  <label class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                      v-model="eventSettings.systemMonitoring.networkIssues"
                    />
                    <span class="text-sm text-gray-800 dark:text-gray-300">{{ t("appsEventsAlerts.settings.eventDetection.system.networkIssues") }}</span>
                  </label>
                </div>
              </div>
            </div>
            <!--end::System Monitoring-->

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingEventSettings"
                class="inline-flex items-center gap-2" :class="primaryButtonClass"
              >
                <span v-if="savingEventSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ savingEventSettings ? t("appsEventsAlerts.actions.saving") : t("appsEventsAlerts.settings.eventDetection.saveButton") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Event Detection Settings-->

    <!--begin::Alert Notifications-->
    <div>
      <div :class="cardClass">
        <div class="p-6 pb-0">
          <h3 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ t("appsEventsAlerts.settings.notifications.title") }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveNotificationSettings">
            <!--begin::Email Notifications-->
            <div class="mb-7">
              <ToggleSwitch v-model="notificationSettings.email.enabled">
                {{ t("appsEventsAlerts.settings.notifications.email.label") }}
              </ToggleSwitch>
              <div class="text-sm text-gray-500">
                {{ t("appsEventsAlerts.settings.notifications.email.description") }}
              </div>

              <div v-if="notificationSettings.email.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.notifications.email.recipients") }}
                  </label>
                  <textarea
                    v-model="emailRecipientsText"
                    rows="3"
                    :placeholder="t('appsEventsAlerts.settings.notifications.email.placeholder')"
                    :class="formInputClass"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.notifications.email.threshold") }}
                  </label>
                  <select v-model="notificationSettings.email.severityThreshold" :class="formInputClass">
                    <option value="low">{{ t("appsEventsAlerts.settings.notifications.email.options.low") }}</option>
                    <option value="medium">{{ t("appsEventsAlerts.settings.notifications.email.options.medium") }}</option>
                    <option value="high">{{ t("appsEventsAlerts.settings.notifications.email.options.high") }}</option>
                    <option value="critical">{{ t("appsEventsAlerts.settings.notifications.email.options.critical") }}</option>
                  </select>
                </div>
              </div>
            </div>
            <!--end::Email Notifications-->

            <!--begin::SMS Notifications-->
            <div class="mb-7">
              <ToggleSwitch v-model="notificationSettings.sms.enabled">
                {{ t("appsEventsAlerts.settings.notifications.sms.label") }}
              </ToggleSwitch>
              <div class="text-sm text-gray-500">
                {{ t("appsEventsAlerts.settings.notifications.sms.description") }}
              </div>

              <div v-if="notificationSettings.sms.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.notifications.sms.numbers") }}
                  </label>
                  <textarea
                    v-model="phoneNumbersText"
                    rows="3"
                    :placeholder="t('appsEventsAlerts.settings.notifications.sms.placeholder')"
                    :class="formInputClass"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.notifications.sms.threshold") }}
                  </label>
                  <select v-model="notificationSettings.sms.severityThreshold" :class="formInputClass">
                    <option value="high">{{ t("appsEventsAlerts.settings.notifications.sms.options.high") }}</option>
                    <option value="critical">{{ t("appsEventsAlerts.settings.notifications.sms.options.critical") }}</option>
                  </select>
                </div>
              </div>
            </div>
            <!--end::SMS Notifications-->

            <!--begin::Push Notifications-->
            <div class="mb-7">
              <ToggleSwitch v-model="notificationSettings.push.enabled">
                {{ t("appsEventsAlerts.settings.notifications.push.label") }}
              </ToggleSwitch>
              <div class="text-sm text-gray-500">
                {{ t("appsEventsAlerts.settings.notifications.push.description") }}
              </div>

              <div v-if="notificationSettings.push.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("appsEventsAlerts.settings.notifications.push.threshold") }}
                  </label>
                  <select v-model="notificationSettings.push.severityThreshold" :class="formInputClass">
                    <option value="low">{{ t("appsEventsAlerts.settings.notifications.email.options.low") }}</option>
                    <option value="medium">{{ t("appsEventsAlerts.settings.notifications.email.options.medium") }}</option>
                    <option value="high">{{ t("appsEventsAlerts.settings.notifications.email.options.high") }}</option>
                    <option value="critical">{{ t("appsEventsAlerts.settings.notifications.email.options.critical") }}</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary dark:border-gray-600"
                      v-model="notificationSettings.push.sound"
                    />
                    <span class="text-sm text-gray-800 dark:text-gray-300">{{ t("appsEventsAlerts.settings.notifications.push.sound") }}</span>
                  </label>
                </div>
              </div>
            </div>
            <!--end::Push Notifications-->

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="savingNotificationSettings"
                class="inline-flex items-center gap-2" :class="primaryButtonClass"
              >
                <span v-if="savingNotificationSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ savingNotificationSettings ? t("appsEventsAlerts.actions.saving") : t("appsEventsAlerts.settings.notifications.saveButton") }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Alert Notifications-->
  </div>

  <!--begin::Advanced Settings-->
  <div class="mt-5">
    <div :class="cardClass">
      <div class="p-6 pb-0">
        <h3 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ t("appsEventsAlerts.settings.advanced.title") }}
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="mb-7">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("appsEventsAlerts.settings.advanced.eventRetention.label") }}
            </label>
            <input
              type="number"
              v-model="advancedSettings.eventRetentionDays"
              min="1"
              max="365"
              :class="formInputClass"
            />
            <div class="mt-1 text-sm text-gray-500">{{ t("appsEventsAlerts.settings.advanced.eventRetention.help") }}</div>
          </div>

          <div class="mb-7">
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("appsEventsAlerts.settings.advanced.autoResolution.label") }}
            </label>
            <input
              type="number"
              v-model="advancedSettings.autoResolutionHours"
              min="1"
              max="168"
              :class="formInputClass"
            />
            <div class="mt-1 text-sm text-gray-500">{{ t("appsEventsAlerts.settings.advanced.autoResolution.help") }}</div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            @click="saveAdvancedSettings"
            :disabled="savingAdvancedSettings"
            class="inline-flex items-center gap-2" :class="primaryButtonClass"
          >
            <span v-if="savingAdvancedSettings" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ savingAdvancedSettings ? t("appsEventsAlerts.actions.saving") : t("appsEventsAlerts.settings.advanced.saveButton") }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Advanced Settings-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import { formInputClass, badgeVariantClass, cardClass, primaryButtonClass } from "@/core/helpers/badge";
import ToggleSwitch from "@/components/common/ToggleSwitch.vue";

// Interface definitions
interface EventSettings {
  motionDetection: {
    enabled: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    minArea: number;
  };
  intrusionDetection: {
    enabled: boolean;
    zones: string[];
  };
  systemMonitoring: {
    enabled: boolean;
    cameraOffline: boolean;
    lowDiskSpace: boolean;
    networkIssues: boolean;
  };
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    recipients: string[];
    severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  };
  sms: {
    enabled: boolean;
    phoneNumbers: string[];
    severityThreshold: 'high' | 'critical';
  };
  push: {
    enabled: boolean;
    severityThreshold: 'low' | 'medium' | 'high' | 'critical';
    sound: boolean;
  };
}

interface AdvancedSettings {
  eventRetentionDays: number;
  autoResolutionHours: number;
}

const { t } = useI18n();

// Reactive data
const eventSettings = ref<EventSettings>({
  motionDetection: {
    enabled: true,
    sensitivity: 'medium',
    minArea: 5
  },
  intrusionDetection: {
    enabled: true,
    zones: ['Entrance', 'Parking Area', 'Restricted Zone A']
  },
  systemMonitoring: {
    enabled: true,
    cameraOffline: true,
    lowDiskSpace: true,
    networkIssues: true
  }
});

const notificationSettings = ref<NotificationSettings>({
  email: {
    enabled: true,
    recipients: [],
    severityThreshold: 'medium'
  },
  sms: {
    enabled: false,
    phoneNumbers: [],
    severityThreshold: 'critical'
  },
  push: {
    enabled: true,
    severityThreshold: 'medium',
    sound: true
  }
});

const advancedSettings = ref<AdvancedSettings>({
  eventRetentionDays: 30,
  autoResolutionHours: 24
});

const savingEventSettings = ref(false);
const savingNotificationSettings = ref(false);
const savingAdvancedSettings = ref(false);

// Computed properties for text areas
const emailRecipientsText = computed({
  get: () => notificationSettings.value.email.recipients.join('\n'),
  set: (value: string) => {
    notificationSettings.value.email.recipients = value
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);
  }
});

const phoneNumbersText = computed({
  get: () => notificationSettings.value.sms.phoneNumbers.join('\n'),
  set: (value: string) => {
    notificationSettings.value.sms.phoneNumbers = value
      .split('\n')
      .map(phone => phone.trim())
      .filter(phone => phone.length > 0);
  }
});

// Methods
const loadSettings = async () => {
  try {
    // TODO: Load settings from API
    // const response = await ApiService.get('/settings/events-alerts');
    // eventSettings.value = response.data.eventSettings;
    // notificationSettings.value = response.data.notificationSettings;
    // advancedSettings.value = response.data.advancedSettings;
    
    console.log("Settings loaded");
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveEventSettings = async () => {
  savingEventSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/events-alerts/event-detection', eventSettings.value);
    
    console.log("Event settings saved:", eventSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving event settings:", error);
  } finally {
    savingEventSettings.value = false;
  }
};

const saveNotificationSettings = async () => {
  savingNotificationSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/events-alerts/notifications', notificationSettings.value);
    
    console.log("Notification settings saved:", notificationSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving notification settings:", error);
  } finally {
    savingNotificationSettings.value = false;
  }
};

const saveAdvancedSettings = async () => {
  savingAdvancedSettings.value = true;
  try {
    // TODO: Save to API
    // await ApiService.post('/settings/events-alerts/advanced', advancedSettings.value);
    
    console.log("Advanced settings saved:", advancedSettings.value);
    // Show success message
  } catch (error) {
    console.error("Error saving advanced settings:", error);
  } finally {
    savingAdvancedSettings.value = false;
  }
};

const configureZones = () => {
  console.log("Configure detection zones");
  // TODO: Open zone configuration modal/page
};

// Initialize data on component mount
onMounted(() => {
  loadSettings();
});
</script>
