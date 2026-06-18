<template>
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">{{ t("controlplane.site.activity.header.title") }}</h4>
          <p class="text-muted mb-0">
            <span v-if="isLoadingSites">{{
              t("controlplane.site.activity.header.subtitleLoading")
            }}</span>
            <span v-else-if="sites.length === 0">{{
              t("controlplane.site.activity.header.subtitleNoSites")
            }}</span>
            <span v-else-if="currentSite">{{
              t("controlplane.site.activity.header.subtitleWithSite", {
                name: currentSite.name,
              })
            }}</span>
            <span v-else>{{
              t("controlplane.site.activity.header.subtitleSelectSite")
            }}</span>
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end align-items-center flex-wrap">
            <div class="me-4 d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">
                {{ t("controlplane.site.activity.filters.siteLabel") }}
              </label>
              <select
                v-model="selectedSiteFilter"
                class="form-select form-select-solid w-200px"
                :disabled="isLoadingSites || sites.length === 0"
                @change="onHeaderSiteFilterChange"
              >
                <option value="" disabled>
                  {{
                    isLoadingSites
                      ? t("controlplane.site.activity.header.subtitleLoading")
                      : sites.length === 0
                        ? t("controlplane.site.activity.header.subtitleNoSites")
                        : t("controlplane.site.activity.filters.sitePlaceholder")
                  }}
                </option>
                <option v-for="site in sites" :key="site.uid" :value="site.uid">
                  {{ site.name }}
                </option>
              </select>
            </div>
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
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">
            {{ t("controlplane.site.activity.toolbar.itemsLabel") }}
          </label>
          <select
            v-model.number="perPage"
            class="form-select form-select-sm w-auto"
            @change="onPerPageChange"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <div class="d-flex align-items-center position-relative my-1 me-5">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control form-control-solid w-250px ps-12"
            :placeholder="t('controlplane.site.activity.toolbar.searchPlaceholder')"
          />
        </div>
        <button
          class="btn btn-sm btn-light-primary"
          :disabled="isLoadingSites || !selectedSiteFilter"
          @click.prevent="openCreateForm"
        >
          <i class="ki-duotone ki-plus fs-2 me-1"></i>
          {{ t("controlplane.site.activity.toolbar.addButton") }}
        </button>
      </div>
    </div>

    <div class="card-body py-3">
      <ControlPlaneEmptyState
        v-if="showSelectionEmptyState"
        :title="selectionEmptyState!.title"
        :description="selectionEmptyState!.description"
      />

      <template v-else>
      <KTDataTable
        :data="filteredAndSortedActivities"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="perPage"
        :loading="isLoading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        :empty-table-text="t('controlplane.site.activity.table.empty')"
        @on-sort="handleSort"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-primary text-primary fw-bold fs-3">
                {{ getInitial(row.name) }}
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{ row.name }}</span>
            </div>
          </div>
        </template>

        <template v-slot:model="{ row }">
          <code>{{ row.modelFile }}</code>
        </template>

        <template v-slot:classes="{ row }">
          <div v-if="row.target_classes?.length" class="d-flex flex-wrap gap-1 activity-class-badges">
            <span
              v-for="(className, index) in row.target_classes"
              :key="`${row.uid}-${className}`"
              :class="`badge ${classBadgeClass(index)} activity-class-badge`"
              :title="className"
            >
              {{ className }}
            </span>
          </div>
          <span v-else class="text-muted fs-7">-</span>
        </template>

        <template v-slot:cameras="{ row }">
          <div v-if="row.cameraNames?.length" class="d-flex flex-wrap gap-1 activity-class-badges">
            <span
              v-for="(cameraLabel, index) in row.cameraNames"
              :key="`${row.uid}-${cameraLabel}`"
              :class="`badge ${classBadgeClass(index)} activity-class-badge`"
              :title="cameraLabel"
            >
              {{ cameraLabel }}
            </span>
          </div>
          <span v-else class="text-muted fs-7">-</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              :title="t('controlplane.site.activity.actions.edit')"
              @click="editActivity(row)"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              :title="t('controlplane.site.activity.actions.delete')"
              @click="deleteActivity(row)"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>

      <div class="d-flex justify-content-end align-items-center mt-4">
        <Pagination
          :page="currentPage"
          :per-page="perPage"
          :total-items="filteredAndSortedActivities.length"
          :total-pages="Math.max(1, Math.ceil(filteredAndSortedActivities.length / perPage))"
          @page-change="onPageChange"
          @per-page-change="onPerPageChange"
        />
      </div>
      </template>
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
                <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.name.label") }}</label>
                <input v-model="activityForm.name" class="form-control form-control-solid" required />
                <div v-if="isEdit && activityForm.code" class="form-text">
                  {{ t("controlplane.site.activity.form.fields.code.hint") }}:
                  <code>{{ activityForm.code }}</code>
                </div>
              </div>
              <div class="col-md-6">
                <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.aiModel.label") }}</label>
                <div class="input-group">
                  <input
                    v-model="activityForm.ai_model"
                    class="form-control form-control-solid"
                    placeholder="memasak"
                    required
                  />
                  <span class="input-group-text">.pt</span>
                </div>
                <div class="form-text">{{ t("controlplane.site.activity.form.fields.aiModel.hint") }}</div>
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-4">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.postBuffer.label") }}</label>
                <input v-model.number="activityForm.post_buffer_sec" type="number" min="1" class="form-control form-control-solid" />
              </div>
              <div class="col-md-4">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.maxSegment.label") }}</label>
                <input v-model.number="activityForm.max_segment_sec" type="number" min="30" class="form-control form-control-solid" />
              </div>
              <div class="col-md-4">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.minConfidence.label") }}</label>
                <input v-model.number="activityForm.min_confidence" type="number" min="0" max="1" step="0.05" class="form-control form-control-solid" />
              </div>
            </div>
            <div class="row mb-5">
              <div class="col-md-6">
                <label class="required fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.targetClasses.label") }}</label>
                <div class="d-flex gap-2">
                  <input
                    v-model="targetClassToAdd"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.activity.form.fields.targetClasses.placeholder')"
                    @keydown.enter.prevent="addTargetClass"
                  />
                  <button
                    type="button"
                    class="btn btn-light-primary text-nowrap"
                    :disabled="!targetClassToAdd.trim()"
                    @click="addTargetClass"
                  >
                    {{ t("controlplane.site.activity.form.fields.targetClasses.addButton") }}
                  </button>
                </div>
                <div v-if="activityForm.targetClasses.length" class="d-flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="className in activityForm.targetClasses"
                    :key="className"
                    class="activity-form-chip"
                  >
                    <span class="activity-form-chip__label">{{ className }}</span>
                    <button
                      type="button"
                      class="activity-form-chip__remove"
                      :title="t('controlplane.site.activity.form.fields.targetClasses.remove')"
                      @click="removeTargetClass(className)"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <div v-else class="form-text mt-2">{{ t("controlplane.site.activity.form.fields.targetClasses.empty") }}</div>
              </div>
              <div class="col-md-6">
                <label class="fw-semibold fs-6 mb-2">{{ t("controlplane.site.activity.form.fields.cameras.label") }}</label>
                <div class="d-flex gap-2">
                  <select v-model="selectedCameraToAdd" class="form-select form-select-solid">
                    <option value="">{{ t("controlplane.site.activity.form.fields.cameras.placeholder") }}</option>
                    <option
                      v-for="camera in availableCamerasToAdd"
                      :key="camera.uid"
                      :value="camera.uid"
                    >
                      {{ camera.name }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-light-primary text-nowrap"
                    :disabled="!selectedCameraToAdd"
                    @click="addCameraAssignment"
                  >
                    {{ t("controlplane.site.activity.form.fields.cameras.addButton") }}
                  </button>
                </div>
                <div v-if="activityForm.cameraUids.length" class="d-flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="cameraUid in activityForm.cameraUids"
                    :key="cameraUid"
                    class="activity-form-chip"
                  >
                    <span class="activity-form-chip__label">{{ cameraName(cameraUid) }}</span>
                    <button
                      type="button"
                      class="activity-form-chip__remove"
                      :title="t('controlplane.site.activity.form.fields.cameras.remove')"
                      @click="removeCameraAssignment(cameraUid)"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <div v-else class="form-text mt-2">{{ t("controlplane.site.activity.form.fields.cameras.empty") }}</div>
              </div>
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

import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ControlPlaneEmptyState from "@/components/controlplane/ControlPlaneEmptyState.vue";
import Pagination from "@/components/common/Pagination.vue";
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

const selectedSiteFilter = ref("");
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const currentPage = ref(1);
const perPage = ref(10);
const isLoading = ref(false);
const isLoadingSites = ref(false);
const isSaving = ref(false);
const showForm = ref(false);
const isEdit = ref(false);
const selectedCameraToAdd = ref("");
const targetClassToAdd = ref("");

const activityForm = ref({
  uid: "",
  code: "",
  name: "",
  ai_model: "yolov8n",
  min_confidence: 0.5,
  targetClasses: [] as string[],
  post_buffer_sec: 10,
  max_segment_sec: 300,
  cameraUids: [] as string[],
});

const normalizeClassName = (value: string): string => value.trim().toLowerCase();

const addTargetClass = () => {
  const className = normalizeClassName(targetClassToAdd.value);
  if (!className) return;
  if (!activityForm.value.targetClasses.includes(className)) {
    activityForm.value.targetClasses.push(className);
  }
  targetClassToAdd.value = "";
};

const removeTargetClass = (className: string) => {
  activityForm.value.targetClasses = activityForm.value.targetClasses.filter(
    (item) => item !== className
  );
};

const normalizeModelName = (value: string): string =>
  value.trim().replace(/\.pt$/i, "");

const formatModelFile = (value: string): string => {
  const stem = normalizeModelName(value);
  return stem ? `${stem}.pt` : "";
};

const cameraName = (cameraUid: string): string =>
  siteCameras.value.find((camera) => camera.uid === cameraUid)?.name || cameraUid;

const currentSite = computed(() =>
  sites.value.find((site) => site.uid === selectedSiteFilter.value) ?? null,
);

const selectionEmptyState = computed(() => {
  if (isLoadingSites.value) {
    return null;
  }
  if (sites.value.length === 0) {
    return {
      title: t("controlplane.site.activity.emptyState.noSites.title"),
      description: t("controlplane.site.activity.emptyState.noSites.description"),
    };
  }
  if (!selectedSiteFilter.value) {
    return {
      title: t("controlplane.site.activity.emptyState.noSiteSelected.title"),
      description: t(
        "controlplane.site.activity.emptyState.noSiteSelected.description",
      ),
    };
  }
  return null;
});

const showSelectionEmptyState = computed(
  () => selectionEmptyState.value !== null,
);

const availableCamerasToAdd = computed(() =>
  siteCameras.value.filter(
    (camera) => !activityForm.value.cameraUids.includes(camera.uid)
  )
);

const addCameraAssignment = () => {
  if (!selectedCameraToAdd.value) return;
  if (!activityForm.value.cameraUids.includes(selectedCameraToAdd.value)) {
    activityForm.value.cameraUids.push(selectedCameraToAdd.value);
  }
  selectedCameraToAdd.value = "";
};

const removeCameraAssignment = (cameraUid: string) => {
  activityForm.value.cameraUids = activityForm.value.cameraUids.filter(
    (uid) => uid !== cameraUid
  );
};

const getAssignedCameraNames = (activityUid: string): string[] => {
  const activity = activities.value.find(a => a.uid === activityUid);
  if (!activity || !activity.camera_uids) return [];
  return activity.camera_uids
    .map((cameraUid) => cameraName(cameraUid))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
};

const tableHeader = computed(() => [
  {
    columnName: t("controlplane.site.activity.table.name"),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.activity.table.model"),
    columnLabel: "model",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.activity.table.classes"),
    columnLabel: "classes",
    sortEnabled: false,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.activity.table.cameras"),
    columnLabel: "cameras",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.activity.table.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

const filteredAndSortedActivities = computed(() => {
  let rows = activities.value.map((activity) => ({
    ...activity,
    modelFile: formatModelFile(activity.ai_model),
    classesText: (activity.target_classes || []).join(", "),
    cameraNames: getAssignedCameraNames(activity.uid),
    camerasText: getAssignedCameraNames(activity.uid).join(", "),
  }));

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.code.toLowerCase().includes(q) ||
        row.modelFile.toLowerCase().includes(q) ||
        row.classesText.toLowerCase().includes(q) ||
        row.camerasText.toLowerCase().includes(q)
    );
  }

  if (sortLabel.value) {
    const sortKeyMap: Record<string, "name" | "modelFile" | "camerasText"> = {
      name: "name",
      model: "modelFile",
      cameras: "camerasText",
    };
    const key = sortKeyMap[sortLabel.value];
    if (key) {
      rows = [...rows].sort((a, b) => {
        const left = a[key];
        const right = b[key];
        const leftValue = typeof left === "number" ? left : String(left ?? "").toLowerCase();
        const rightValue = typeof right === "number" ? right : String(right ?? "").toLowerCase();

        if (leftValue < rightValue) return sortOrder.value === "asc" ? -1 : 1;
        if (leftValue > rightValue) return sortOrder.value === "asc" ? 1 : -1;
        return 0;
      });
    }
  }

  return rows;
});

const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const getInitial = (name: string): string => {
  if (!name) return "?";
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const classBadgeVariants = [
  "badge-light-primary",
  "badge-light-info",
  "badge-light-success",
  "badge-light-warning",
  "badge-light-danger",
];

const classBadgeClass = (index: number): string =>
  classBadgeVariants[index % classBadgeVariants.length];

const onPerPageChange = () => {
  currentPage.value = 1;
};

const onPageChange = (page: number) => {
  currentPage.value = page;
};

const onHeaderSiteFilterChange = () => {
  currentPage.value = 1;
  localStorage.setItem("lastSelectedSite", selectedSiteFilter.value || "");
  if (selectedSiteFilter.value) {
    loadActivities();
  } else {
    activities.value = [];
    siteCameras.value = [];
  }
};

const loadSites = async () => {
  isLoadingSites.value = true;
  try {
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
        "";
    }
  } catch (error) {
    console.error("Error loading sites:", error);
    sites.value = [];
  } finally {
    isLoadingSites.value = false;
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
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  selectedCameraToAdd.value = "";
  targetClassToAdd.value = "";
  activityForm.value = {
    uid: "",
    code: "",
    name: "",
    ai_model: "yolov8n",
    min_confidence: 0.5,
    targetClasses: [],
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
  activityForm.value = {
    uid: activity.uid,
    code: activity.code,
    name: activity.name,
    ai_model: normalizeModelName(activity.ai_model),
    min_confidence: activity.min_confidence ?? 0.5,
    targetClasses: [...(activity.target_classes || [])],
    post_buffer_sec: activity.recording_config?.post_buffer_sec ?? 10,
    max_segment_sec: activity.recording_config?.max_segment_sec ?? 300,
    cameraUids: [...(activity.camera_uids || [])],
  };
  targetClassToAdd.value = "";
  selectedCameraToAdd.value = "";
  isEdit.value = true;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  isEdit.value = false;
};



const saveActivity = async () => {
  if (!selectedSiteFilter.value) return;
  if (!activityForm.value.targetClasses.length) {
    alert(t("controlplane.site.activity.form.fields.targetClasses.required"));
    return;
  }
  isSaving.value = true;
  try {
    const payload: Record<string, unknown> = {
      name: activityForm.value.name.trim(),
      ai_model: normalizeModelName(activityForm.value.ai_model),
      min_confidence: activityForm.value.min_confidence,
      target_classes: [...activityForm.value.targetClasses],
      recording_config: {
        post_buffer_sec: activityForm.value.post_buffer_sec,
        max_segment_sec: activityForm.value.max_segment_sec,
      },
      camera_uids: [...activityForm.value.cameraUids],
    };

    let activityUid = activityForm.value.uid;
    if (isEdit.value && activityUid) {
      await ApiService.patch(
        `sites/${selectedSiteFilter.value}/activity-definitions/${activityUid}`,
        payload as object
      );
    } else {
      await ApiService.post(
        `sites/${selectedSiteFilter.value}/activity-definitions`,
        payload
      );
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
  if (selectedSiteFilter.value) {
    await loadActivities();
  }
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
  width: min(900px, 100%);
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

.activity-form-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 100%;
  padding: 0.35rem 0.4rem 0.35rem 0.75rem;
  background: #eef6ff;
  border: 1px solid #c9e2ff;
  border-radius: 0.475rem;
  color: #1b4f8a;
  font-size: 0.9rem;
  line-height: 1.2;
}

.activity-form-chip__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-form-chip__remove {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: #5e6278;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.activity-form-chip__remove:hover,
.activity-form-chip__remove:focus {
  background: #ffe2e5;
  color: #d9214e;
  outline: none;
}

.activity-class-badges {
  max-width: 280px;
}

.activity-class-badge {
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}
</style>
