<template>
  <!--begin::Events & Alerts Settings-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Events & Alerts Settings</h4>
          <p class="text-muted mb-0">
            Configure event detection and alert notifications
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-5 g-xl-8">
    <!--begin::Event Detection Settings-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Event Detection</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveEventSettings">
            <!--begin::Motion Detection-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="eventSettings.motionDetection.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  Motion Detection
                </span>
              </label>
              <div class="text-muted fs-7">
                Detect motion in camera feeds and trigger events
              </div>
              
              <div v-if="eventSettings.motionDetection.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-label">Sensitivity Level</label>
                  <select
                    v-model="eventSettings.motionDetection.sensitivity"
                    class="form-select form-select-solid"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div class="mb-4">
                  <label class="form-label">Minimum Detection Area (%)</label>
                  <input
                    type="range"
                    class="form-range"
                    min="1"
                    max="50"
                    v-model="eventSettings.motionDetection.minArea"
                  />
                  <div class="text-muted fs-7">{{ eventSettings.motionDetection.minArea }}%</div>
                </div>
              </div>
            </div>
            <!--end::Motion Detection-->

            <!--begin::Intrusion Detection-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="eventSettings.intrusionDetection.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  Intrusion Detection
                </span>
              </label>
              <div class="text-muted fs-7">
                Detect unauthorized access in restricted areas
              </div>

              <div v-if="eventSettings.intrusionDetection.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-label">Detection Zones</label>
                  <div class="d-flex flex-wrap gap-2">
                    <span
                      v-for="zone in eventSettings.intrusionDetection.zones"
                      :key="zone"
                      class="badge badge-light-primary"
                    >
                      {{ zone }}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-primary mt-2"
                    @click="configureZones"
                  >
                    Configure Zones
                  </button>
                </div>
              </div>
            </div>
            <!--end::Intrusion Detection-->

            <!--begin::System Monitoring-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="eventSettings.systemMonitoring.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  System Monitoring
                </span>
              </label>
              <div class="text-muted fs-7">
                Monitor camera and NVR system health
              </div>

              <div v-if="eventSettings.systemMonitoring.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="eventSettings.systemMonitoring.cameraOffline"
                    />
                    <span class="form-check-label">Camera Offline Detection</span>
                  </label>
                </div>
                
                <div class="mb-4">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="eventSettings.systemMonitoring.lowDiskSpace"
                    />
                    <span class="form-check-label">Low Disk Space Warning</span>
                  </label>
                </div>

                <div class="mb-4">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="eventSettings.systemMonitoring.networkIssues"
                    />
                    <span class="form-check-label">Network Issues Detection</span>
                  </label>
                </div>
              </div>
            </div>
            <!--end::System Monitoring-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingEventSettings">
                <span v-if="savingEventSettings" class="spinner-border spinner-border-sm me-2"></span>
                Save Event Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Event Detection Settings-->

    <!--begin::Alert Notifications-->
    <div class="col-xl-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Alert Notifications</h3>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveNotificationSettings">
            <!--begin::Email Notifications-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="notificationSettings.email.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  Email Notifications
                </span>
              </label>
              <div class="text-muted fs-7">
                Send alert notifications via email
              </div>

              <div v-if="notificationSettings.email.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-label">Email Recipients</label>
                  <textarea
                    v-model="emailRecipientsText"
                    class="form-control form-control-solid"
                    rows="3"
                    placeholder="Enter email addresses, one per line"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label class="form-label">Alert Severity Threshold</label>
                  <select
                    v-model="notificationSettings.email.severityThreshold"
                    class="form-select form-select-solid"
                  >
                    <option value="low">All Alerts (Low and above)</option>
                    <option value="medium">Medium and above</option>
                    <option value="high">High and above</option>
                    <option value="critical">Critical only</option>
                  </select>
                </div>
              </div>
            </div>
            <!--end::Email Notifications-->

            <!--begin::SMS Notifications-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="notificationSettings.sms.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  SMS Notifications
                </span>
              </label>
              <div class="text-muted fs-7">
                Send critical alerts via SMS
              </div>

              <div v-if="notificationSettings.sms.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-label">Phone Numbers</label>
                  <textarea
                    v-model="phoneNumbersText"
                    class="form-control form-control-solid"
                    rows="3"
                    placeholder="Enter phone numbers, one per line"
                  ></textarea>
                </div>

                <div class="mb-4">
                  <label class="form-label">SMS Alert Threshold</label>
                  <select
                    v-model="notificationSettings.sms.severityThreshold"
                    class="form-select form-select-solid"
                  >
                    <option value="high">High and above</option>
                    <option value="critical">Critical only</option>
                  </select>
                </div>
              </div>
            </div>
            <!--end::SMS Notifications-->

            <!--begin::Push Notifications-->
            <div class="mb-7">
              <label class="form-check form-switch form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="notificationSettings.push.enabled"
                />
                <span class="form-check-label fw-semibold text-gray-800">
                  Push Notifications
                </span>
              </label>
              <div class="text-muted fs-7">
                Send browser/mobile push notifications
              </div>

              <div v-if="notificationSettings.push.enabled" class="mt-4">
                <div class="mb-4">
                  <label class="form-label">Push Alert Threshold</label>
                  <select
                    v-model="notificationSettings.push.severityThreshold"
                    class="form-select form-select-solid"
                  >
                    <option value="low">All Alerts (Low and above)</option>
                    <option value="medium">Medium and above</option>
                    <option value="high">High and above</option>
                    <option value="critical">Critical only</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-check form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="notificationSettings.push.sound"
                    />
                    <span class="form-check-label">Play notification sound</span>
                  </label>
                </div>
              </div>
            </div>
            <!--end::Push Notifications-->

            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary" :disabled="savingNotificationSettings">
                <span v-if="savingNotificationSettings" class="spinner-border spinner-border-sm me-2"></span>
                Save Notification Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--end::Alert Notifications-->
  </div>

  <!--begin::Advanced Settings-->
  <div class="row g-5 mt-5">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <h3 class="fw-bold">Advanced Settings</h3>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-7">
                <label class="form-label">Event Retention Period (days)</label>
                <input
                  type="number"
                  class="form-control form-control-solid"
                  v-model="advancedSettings.eventRetentionDays"
                  min="1"
                  max="365"
                />
                <div class="text-muted fs-7">How long to keep event history</div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-7">
                <label class="form-label">Auto-resolution Timeout (hours)</label>
                <input
                  type="number"
                  class="form-control form-control-solid"
                  v-model="advancedSettings.autoResolutionHours"
                  min="1"
                  max="168"
                />
                <div class="text-muted fs-7">Auto-resolve acknowledged events after timeout</div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary"
              @click="saveAdvancedSettings"
              :disabled="savingAdvancedSettings"
            >
              <span v-if="savingAdvancedSettings" class="spinner-border spinner-border-sm me-2"></span>
              Save Advanced Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Advanced Settings-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";

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
