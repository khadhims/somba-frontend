<template>
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">{{ t("controlplane.site.activity.header.title") }}</h4>
          <p class="text-muted mb-0">{{ t("controlplane.site.activity.header.subtitle") }}</p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end align-items-center">
            <label class="form-label me-3 mb-0 fw-semibold">
              {{ t("controlplane.site.activity.filters.siteLabel") }}
            </label>
            <select
              v-model="selectedSiteFilter"
              class="form-select form-select-solid w-200px"
              @change="loadActivities"
            >
              <option value="">{{ t("controlplane.site.activity.filters.siteAll") }}</option>
              <option v-for="site in sites" :key="site.uid" :value="site.uid">
                {{ site.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header border-0 pt-5">
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.site.activity.title") }}</h3>
      </div>
      <div class="card-toolbar">
        <button class="btn btn-sm btn-light-primary" @click="openCreateForm">
          <i class="ki-duotone ki-plus fs-2 me-1"></i>
          {{ t("controlplane.site.activity.toolbar.addButton") }}
        </button>
      </div>
    </div>

    <div class="card-body pt-0">
      <div v-if="isLoading" class="text-center py-10">
        <span class="spinner-border text-primary"></span>
      </div>
      <div v-else-if="!activities.length" class="text-center text-muted py-10">
        {{ t("controlplane.site.activity.table.empty") }}
      </div>
      <div v-else class="table-responsive">
        <table class="table align-middle table-row-dashed fs-6 gy-5">
          <thead>
            <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
              <th>{{ t("controlplane.site.activity.table.name") }}</th>
              <th>{{ t("controlplane.site.activity.table.code") }}</th>
              <th>{{ t("controlplane.site.activity.table.model") }}</th>
              <th>{{ t("controlplane.site.activity.table.classes") }}</th>
              <th>{{ t("controlplane.site.activity.table.cameras") }}</th>
              <th class="text-end">{{ t("controlplane.site.activity.table.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in activities" :key="activity.uid">
              <td class="fw-semibold">{{ activity.name }}</td>
              <td><code>{{ activity.code }}</code></td>
              <td>{{ activity.ai_model }}</td>
              <td>{{ (activity.target_classes || []).join(", ") }}</td>
              <td>{{ assignmentCount(activity.uid) }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-light me-2" @click="editActivity(activity)">
                  {{ t("controlplane.site.activity.actions.edit") }}
                </button>
                <button class="btn btn-sm btn-light-danger" @click="deleteActivity(activity)">
                  {{ t("controlplane.site.activity.actions.delete") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="showForm" class="camera-form-modal-overlay" @click="closeForm">
      <div class="camera-form-modal-container" @click.stop>
        <div class="camera-form-modal-header">
          <h3 class="camera-form-modal-title">
            {{ isEdit ? t("controlplane.site.activity.form.titleEdit") : t("controlplane.site.activity.form.titleCreate") }}
          </h3>
          <button type="button" class="btn btn-sm btn-icon" @click="closeForm">
            <i class="ki-duotone ki-cross fs-2"></i>
          </button>
        </div>
        <div class="camera-form-modal-body">
          <form @submit.prevent="saveActivity">
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.code.label") }}</label>
                <input v-model="activityForm.code" class="form-control form-control-solid" required />
              </div>
              <div class="col-md-6">
                <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.name.label") }}</label>
                <input v-model="activityForm.name" class="form-control form-control-solid" required />
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.aiModel.label") }}</label>
                <input v-model="activityForm.ai_model" class="form-control form-control-solid" placeholder="yolov8n.pt" required />
              </div>
              <div class="col-md-6">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.minConfidence.label") }}</label>
                <input v-model.number="activityForm.min_confidence" type="number" min="0" max="1" step="0.05" class="form-control form-control-solid" />
              </div>
            </div>
            <div class="mb-5">
              <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.targetClasses.label") }}</label>
              <input v-model="activityForm.targetClassesInput" class="form-control form-control-solid" placeholder="person, pot" required />
              <div class="form-text">{{ t("controlplane.site.activity.form.fields.targetClasses.hint") }}</div>
            </div>
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.postBuffer.label") }}</label>
                <input v-model.number="activityForm.post_buffer_sec" type="number" min="1" class="form-control form-control-solid" />
              </div>
              <div class="col-md-6">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.maxSegment.label") }}</label>
                <input v-model.number="activityForm.max_segment_sec" type="number" min="30" class="form-control form-control-solid" />
              </div>
            </div>
            <div class="mb-5">
              <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.cameras.label") }}</label>
              <select v-model="activityForm.cameraUids" class="form-select form-select-solid" multiple size="5">
                <option v-for="camera in siteCameras" :key="camera.uid" :value="camera.uid">
                  {{ camera.name }}
                </option>
              </select>
              <div class="form-text">{{ t("controlplane.site.activity.form.fields.cameras.hint") }}</div>
            </div>
            <div class="d-flex justify-content-end gap-3">
              <button type="button" class="btn btn-light" @click="closeForm">{{ t("controlplane.site.activity.form.actions.cancel") }}</button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                {{ isSaving ? t("controlplane.site.activity.form.actions.loading") : (isEdit ? t("controlplane.site.activity.form.actions.update") : t("controlplane.site.activity.form.actions.create")) }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineOptions({ name: "SiteActivityPage" });

import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import ApiService from "@/core/services/ApiService";

interface Site {
  uid: string;
  name: string;
}

interface ActivityItem {
  uid: string;
  code: string;
  name: string;
  ai_model: string;
  target_classes: string[];
  min_confidence?: number;
  recording_config?: { post_buffer_sec?: number; max_segment_sec?: number };
}

interface CameraItem {
  uid: string;
  name: string;
}

const { t } = useI18n();
const route = useRoute();

const sites = ref<Site[]>([]);
const activities = ref<ActivityItem[]>([]);
const siteCameras = ref<CameraItem[]>([]);
const cameraAssignments = ref<Record<string, string[]>>({});
const selectedSiteFilter = ref("");
const isLoading = ref(false);
const isSaving = ref(false);
const showForm = ref(false);
const isEdit = ref(false);

const activityForm = ref({
  uid: "",
  code: "",
  name: "",
  ai_model: "yolov8n.pt",
  min_confidence: 0.5,
  targetClassesInput: "person",
  post_buffer_sec: 10,
  max_segment_sec: 300,
  cameraUids: [] as string[],
});

const parseList = (value: string): string[] =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

const assignmentCount = (activityUid: string) =>
  Object.values(cameraAssignments.value).filter((uids) => uids.includes(activityUid)).length;

const loadSites = async () => {
  const teamId = localStorage.getItem("lastSelectedTeam") || (route.query.teamId as string);
  const resp = teamId
    ? await ApiService.query(`teams/${teamId}/sites`, {})
    : await ApiService.query("sites", {});
  const data = resp?.data?.data ?? resp?.data ?? [];
  sites.value = (Array.isArray(data) ? data : []).map((site: any) => ({
    uid: site.uid,
    name: site.name,
  }));
  if (!selectedSiteFilter.value) {
    selectedSiteFilter.value =
      (route.query.siteId as string) ||
      localStorage.getItem("lastSelectedSite") ||
      sites.value[0]?.uid ||
      "";
  }
};

const loadSiteCameras = async () => {
  if (!selectedSiteFilter.value) {
    siteCameras.value = [];
    return;
  }
  const resp = await ApiService.query(`sites/${selectedSiteFilter.value}/cameras`, {});
  const data = resp?.data?.data ?? resp?.data ?? [];
  siteCameras.value = (Array.isArray(data) ? data : []).map((camera: any) => ({
    uid: camera.uid,
    name: camera.name,
  }));
};

const loadCameraAssignments = async () => {
  cameraAssignments.value = {};
  for (const camera of siteCameras.value) {
    const resp = await ApiService.query(
      `sites/${selectedSiteFilter.value}/cameras/${camera.uid}/activity-definitions`,
      {}
    );
    const rows = resp?.data?.data ?? resp?.data ?? [];
    const uids = (Array.isArray(rows) ? rows : [])
      .map((row: any) => row.activity?.uid ?? row.activity_uid)
      .filter(Boolean);
    cameraAssignments.value[camera.uid] = uids;
  }
};

const loadActivities = async () => {
  if (!selectedSiteFilter.value) {
    activities.value = [];
    return;
  }
  isLoading.value = true;
  try {
    await loadSiteCameras();
    const resp = await ApiService.query(
      `sites/${selectedSiteFilter.value}/activity-definitions`,
      {}
    );
    const data = resp?.data?.data ?? resp?.data ?? [];
    activities.value = Array.isArray(data) ? data : [];
    await loadCameraAssignments();
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  activityForm.value = {
    uid: "",
    code: "",
    name: "",
    ai_model: "yolov8n.pt",
    min_confidence: 0.5,
    targetClassesInput: "person",
    post_buffer_sec: 10,
    max_segment_sec: 300,
    cameraUids: [],
  };
};

const openCreateForm = () => {
  if (!selectedSiteFilter.value) return;
  resetForm();
  isEdit.value = false;
  showForm.value = true;
};

const editActivity = (activity: ActivityItem) => {
  const assignedCameras = Object.entries(cameraAssignments.value)
    .filter(([, uids]) => uids.includes(activity.uid))
    .map(([cameraUid]) => cameraUid);

  activityForm.value = {
    uid: activity.uid,
    code: activity.code,
    name: activity.name,
    ai_model: activity.ai_model,
    min_confidence: activity.min_confidence ?? 0.5,
    targetClassesInput: (activity.target_classes || []).join(", "),
    post_buffer_sec: activity.recording_config?.post_buffer_sec ?? 10,
    max_segment_sec: activity.recording_config?.max_segment_sec ?? 300,
    cameraUids: assignedCameras,
  };
  isEdit.value = true;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  isEdit.value = false;
};

const syncCameraAssignments = async (activityUid: string, cameraUids: string[]) => {
  for (const camera of siteCameras.value) {
    const current = new Set(cameraAssignments.value[camera.uid] || []);
    if (cameraUids.includes(camera.uid)) {
      current.add(activityUid);
    } else {
      current.delete(activityUid);
    }
    await ApiService.put(
      `sites/${selectedSiteFilter.value}/cameras/${camera.uid}/activity-definitions`,
      { activity_uids: Array.from(current) }
    );
  }
};

const saveActivity = async () => {
  if (!selectedSiteFilter.value) return;
  isSaving.value = true;
  try {
    const payload = {
      code: activityForm.value.code.trim(),
      name: activityForm.value.name.trim(),
      ai_model: activityForm.value.ai_model.trim(),
      min_confidence: activityForm.value.min_confidence,
      target_classes: parseList(activityForm.value.targetClassesInput),
      recording_config: {
        post_buffer_sec: activityForm.value.post_buffer_sec,
        max_segment_sec: activityForm.value.max_segment_sec,
      },
    };

    let activityUid = activityForm.value.uid;
    if (isEdit.value && activityUid) {
      await ApiService.patch(
        `sites/${selectedSiteFilter.value}/activity-definitions/${activityUid}`,
        payload
      );
    } else {
      const resp = await ApiService.post(
        `sites/${selectedSiteFilter.value}/activity-definitions`,
        payload
      );
      activityUid = resp?.data?.data?.uid ?? resp?.data?.uid ?? "";
    }

    if (activityUid) {
      await syncCameraAssignments(activityUid, activityForm.value.cameraUids);
    }

    closeForm();
    await loadActivities();
  } catch (error) {
    console.error("Failed to save activity:", error);
  } finally {
    isSaving.value = false;
  }
};

const deleteActivity = async (activity: ActivityItem) => {
  if (!confirm(t("controlplane.site.activity.notifications.deleteConfirm"))) return;
  await ApiService.delete(
    `sites/${selectedSiteFilter.value}/activity-definitions/${activity.uid}`
  );
  await loadActivities();
};

onMounted(async () => {
  await loadSites();
  await loadActivities();
});
</script>

<style scoped>
.camera-form-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.camera-form-modal-container {
  background: var(--bs-body-bg, #fff);
  border-radius: 0.75rem;
  width: min(760px, 100%);
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
.camera-form-modal-header,
.camera-form-modal-body {
  padding: 1.5rem;
}
.camera-form-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
