<template>
  <!--begin::Camera Filters-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <!-- Left: Title + subtitle (matches Overview layout) -->
        <div class="col-md-4">
          <h4 class="card-title mb-0">{{ t('controlplane.site.camera.header.title') }}</h4>
          <p class="text-muted mb-0">
            <span>{{ t('controlplane.site.camera.header.subtitleDefault') }}</span>
          </p>
        </div>

        <!-- Right: Filters -->
        <div class="col-md-8">
          <div class="d-flex justify-content-end align-items-center flex-wrap">
            <!-- Site Filter -->
            <div class="me-4 d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">
                {{ t("controlplane.site.camera.filters.siteLabel") }}
              </label>
              <select
                v-model="selectedSiteFilter"
                @change="onHeaderSiteFilterChange"
                class="form-select form-select-solid w-200px"
              >
                <option value="">{{ t("controlplane.site.camera.filters.siteAll") }}</option>
                <option v-for="site in sites" :key="site.uid" :value="site.uid">{{ site.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--begin::Camera List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.site.camera.title") }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">{{ t('controlplane.site.camera.toolbar.itemsLabel') }}</label>
          <select 
            class="form-select form-select-sm w-auto" 
            v-model.number="perPage"
            @change="onPerPageChange"
            >
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
        <!--end::Items per page-->

        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1 me-5">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-solid w-250px ps-12"
            :placeholder="t('controlplane.site.camera.toolbar.searchPlaceholder')"
          />
        </div>
        <!--end::Search-->

        <button 
          @click.prevent="openCreateForm" 
          class="btn btn-sm btn-light-primary"
        >
          <i class="ki-duotone ki-plus fs-2 me-1"></i>
          {{ t('controlplane.site.camera.toolbar.addButton') }}
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!-- Form is now in modal below, not inline -->

      <!--begin::Table-->
      <KTDataTable
        :data="filteredAndSortedCameras"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="perPage"
        :loading="isLoading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        :empty-table-text="t('controlplane.site.camera.table.empty')"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-success text-success fw-bold fs-3">
                {{ getInitial(row.name) }}
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{
                row.name
              }}</span>
              <span class="text-muted fw-semibold text-muted d-block fs-7 text-truncate" style="max-width: 280px">{{
                row.cameraUrl
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:location="{ row }">
          <div>
            <span class="text-dark fw-bold d-block fs-6">{{
              getSiteName(row.siteId)
            }}</span>
            <span class="text-muted fw-semibold d-block fs-7">{{
              row.room || "-"
            }}</span>
            <span class="text-muted fw-semibold d-block fs-8">{{
              row.location
            }}</span>
          </div>
        </template>

        <template v-slot:specs="{ row }">
          <div>
            <span class="badge badge-light-info fs-7 fw-bold mb-1">{{
              row.brand
            }}</span
            ><br />
            <span class="badge badge-light-warning fs-7 fw-bold">{{
              row.resolution
            }}</span>
          </div>
        </template>

        <template v-slot:cameraUrl="{ row }">
          <span class="text-dark fw-semibold d-block fs-7 text-truncate" style="max-width: 220px" :title="row.cameraUrl">
            {{ row.cameraUrl || "-" }}
          </span>
        </template>

        <template v-slot:status="{ row }">
          <span
            :class="`badge badge-light-${statusBadgeVariant(row.status)} fs-7 fw-bold`"
          >
            {{ resolveStatusLabel(row.status) }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click="viewCamera(row)"
              :title="t('controlplane.site.camera.actions.view')"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editCamera(row)"
              :title="t('controlplane.site.camera.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteCamera(row)"
              :title="t('controlplane.site.camera.actions.delete')"
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
      <!--end::Table-->

      <!--begin::Pagination-->
      <div class="d-flex justify-content-end align-items-center mt-4">
        <Pagination
          :page="currentPage"
          :per-page="perPage"
          :total-items="cameras.length"
          :total-pages="Math.max(1, Math.ceil(cameras.length / perPage))"
          @page-change="onPageChange"
          @per-page-change="onPerPageChange"
        />
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Camera Management-->

  <!-- Camera Playback Modal -->
  <CameraPlaybackModal ref="playbackModal" />

  <!-- Camera Form Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="showCameraForm" 
        class="camera-form-modal-overlay"
        @click="closeForm"
      >
        <div 
          class="camera-form-modal-container"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="camera-form-modal-header">
            <h3 class="camera-form-modal-title">
              {{
                isEdit
                  ? t("controlplane.site.camera.form.titleEdit")
                  : t("controlplane.site.camera.form.titleCreate")
              }}
            </h3>
            <button
              type="button"
              class="btn btn-sm btn-icon btn-active-light-primary"
              @click="closeForm"
            >
              <i class="ki-duotone ki-cross fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="camera-form-modal-body">
            <form @submit.prevent="saveCamera" class="form">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.site.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.siteId"
                    class="form-select form-select-solid"
                    required
                  >
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.site.placeholder") }}
                    </option>
                    <option
                      v-for="site in sites"
                      :key="site.uid"
                      :value="site.uid"
                    >
                      {{ site.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

              </div>

              <div class="row mb-7">
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.room.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.room"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.camera.form.fields.room.placeholder')"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

               
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.name.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.name"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.camera.form.fields.name.placeholder')"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.cameraUrl.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="url"
                    v-model="cameraForm.cameraUrl"
                    class="form-control form-control-solid"
                    :class="{ 'is-invalid': cameraUrlError }"
                    :placeholder="t('controlplane.site.camera.form.fields.cameraUrl.placeholder')"
                    autocomplete="off"
                    required
                    @input="cameraUrlError = ''"
                  />
                  <div v-if="cameraUrlError" class="invalid-feedback d-block">
                    {{ cameraUrlError }}
                  </div>
                  <div class="form-text">
                    RTSP URL stream utama (subtype=0). Sub-stream AI akan di-generate otomatis untuk Dahua/Hikvision.
                  </div>
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.brand.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.brand"
                    class="form-select form-select-solid"
                  >
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.brand.placeholder") }}
                    </option>
                    <option value="Hikvision">
                      {{ t("controlplane.site.camera.form.fields.brand.options.hikvision") }}
                    </option>
                    <option value="Dahua">
                      {{ t("controlplane.site.camera.form.fields.brand.options.dahua") }}
                    </option>
                    <option value="Uniview">
                      {{ t("controlplane.site.camera.form.fields.brand.options.uniview") }}
                    </option>
                    <option value="Tiandy">
                      {{ t("controlplane.site.camera.form.fields.brand.options.tiandy") }}
                    </option>
                    <option value="Axis">
                      {{ t("controlplane.site.camera.form.fields.brand.options.axis") }}
                    </option>
                    <option value="Other">
                      {{ t("controlplane.site.camera.form.fields.brand.options.other") }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.model.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.model"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.camera.form.fields.model.placeholder')"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.type.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.type"
                    class="form-select form-select-solid"
                  >
                    <option value="Dome">
                      {{ t("controlplane.site.camera.form.fields.type.options.dome") }}
                    </option>
                    <option value="Bullet">
                      {{ t("controlplane.site.camera.form.fields.type.options.bullet") }}
                    </option>
                    <option value="PTZ">
                      {{ t("controlplane.site.camera.form.fields.type.options.ptz") }}
                    </option>
                    <option value="Fisheye">
                      {{ t("controlplane.site.camera.form.fields.type.options.fisheye") }}
                    </option>
                    <option value="Turret">
                      {{ t("controlplane.site.camera.form.fields.type.options.turret") }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.resolution.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.resolution"
                    class="form-select form-select-solid"
                  >
                    <option value="1080P (2MP)">
                      {{ t("controlplane.site.camera.form.fields.resolution.options.1080p") }}
                    </option>
                    <option value="4MP">
                      {{ t("controlplane.site.camera.form.fields.resolution.options.4mp") }}
                    </option>
                    <option value="5MP">
                      {{ t("controlplane.site.camera.form.fields.resolution.options.5mp") }}
                    </option>
                    <option value="4K (8MP)">
                      {{ t("controlplane.site.camera.form.fields.resolution.options.4k") }}
                    </option>
                    <option value="12MP">
                      {{ t("controlplane.site.camera.form.fields.resolution.options.12mp") }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-12">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.location.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.location"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.camera.form.fields.location.placeholder')"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-12">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.description.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <textarea
                    v-model="cameraForm.description"
                    class="form-control form-control-solid"
                    rows="3"
                    :placeholder="t('controlplane.site.camera.form.fields.description.placeholder')"
                  ></textarea>
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Actions-->
              <div class="text-center pt-3">
                <button
                  type="button"
                  class="btn btn-light me-3"
                  @click="closeForm"
                >
                  {{ t("controlplane.site.camera.form.actions.cancel") }}
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="indicator-progress">
                    {{ t("controlplane.site.camera.form.actions.loading") }}
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                  <span v-else class="indicator-label">
                    {{
                      isEdit
                        ? t("controlplane.site.camera.form.actions.update")
                        : t("controlplane.site.camera.form.actions.create")
                    }}
                  </span>
                </button>
              </div>
              <!--end::Actions-->
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ApiService from '@/core/services/ApiService';
import CameraPlaybackModal from "@/components/CameraPlaybackModal.vue";

// Interfaces
interface Site {
  uid: string;
  name: string;
}

interface Camera {
  id: number;
  uid?: string;
  siteId: string;
  room: string;
  name: string;
  cameraUrl: string;
  brand: string;
  model?: string;
  type: string;
  resolution: string;
  location?: string;
  description?: string;
  status: "online" | "offline";
  createdAt: string;
  public_endpoint_url?: string;
}

interface CameraForm {
  id?: number;
  uid?: string;
  siteId: string;
  room: string;
  name: string;
  cameraUrl: string;
  brand: string;
  model?: string;
  type: string;
  resolution: string;
  location?: string;
  description?: string;
}

// i18n & Router
const { t } = useI18n();
const route = useRoute();

// Reactive data
const isLoading = ref(false);
const showCameraForm = ref(false);
const isEdit = ref(false);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

const sites = ref<Site[]>([]);
const cameras = ref<Camera[]>([]);

// Header filter state
const selectedSiteFilter = ref<string>("");

// Pagination state
const currentPage = ref<number>(1);
const perPage = ref<number>(10);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);
const playbackModal = ref<InstanceType<typeof CameraPlaybackModal> | null>(null);
const cameraUrlError = ref("");

const cameraForm = ref<CameraForm>({
  uid: undefined,
  siteId: "",
  room: "",
  name: "",
  cameraUrl: "",
  brand: "",
  model: "",
  type: "Dome",
  resolution: "1080P (2MP)",
  location: "",
  description: "",
});

const resolveCameraUrl = (camera: {
  public_endpoint_url?: string;
  master_rtsp_url?: string;
  ipAddress?: string;
  ip_address?: string;
  cameraUrl?: string;
}): string =>
  camera.public_endpoint_url ||
  camera.master_rtsp_url ||
  camera.cameraUrl ||
  camera.ipAddress ||
  camera.ip_address ||
  "";

const isValidCameraUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return ["http:", "https:", "rtsp:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const onPerPageChange = () => {
  currentPage.value = 1;
};

const onPageChange = (page: number) => {
  currentPage.value = page;
};

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("controlplane.site.camera.table.name"),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.camera.table.location"),
    columnLabel: "location",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.camera.table.specs"),
    columnLabel: "specs",
    sortEnabled: false,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.camera.table.cameraUrl"),
    columnLabel: "cameraUrl",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.camera.table.status"),
    columnLabel: "status",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.camera.table.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

const filteredAndSortedCameras = computed(() => {
  let filtered = cameras.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (camera) =>
        camera.name.toLowerCase().includes(q) ||
        camera.cameraUrl.toLowerCase().includes(q) ||
        camera.brand.toLowerCase().includes(q) ||
        camera.type.toLowerCase().includes(q) ||
        getSiteName(camera.siteId).toLowerCase().includes(q) ||
        camera.room.toLowerCase().includes(q)
    );
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const getValue = (item: Camera, label: string) => {
        if (label === "location") return getSiteName(item.siteId);
        return (item as any)[label];
      };

      const aVal = getValue(a, sortLabel.value);
      const bVal = getValue(b, sortLabel.value);

      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return sortOrder.value === "asc" ? cmp : -cmp;
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        const cmp = aVal - bVal;
        return sortOrder.value === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }

  return filtered;
});

const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const normalizeStatusKey = (status?: unknown): "online" | "offline" => {
  if (typeof status === "string") {
    const normalized = status.toLowerCase();
    if (["online", "active", "running", "enabled"].includes(normalized)) {
      return "online";
    }
    if (["offline", "inactive", "down", "disabled"].includes(normalized)) {
      return "offline";
    }
  }

  if (typeof status === "boolean") {
    return status ? "online" : "offline";
  }

  if (typeof status === "number") {
    return status > 0 ? "online" : "offline";
  }

  return "offline";
};

const statusBadgeVariant = (status?: unknown): string =>
  normalizeStatusKey(status) === "online" ? "success" : "danger";

const resolveStatusLabel = (status?: unknown): string =>
  t(`controlplane.site.camera.status.${normalizeStatusKey(status)}`);

// Methods
const getSiteName = (siteId: string): string => {
  const site = sites.value.find((s) => s.uid === siteId);
  return site ? site.name : t("controlplane.site.camera.fallback.unknownSite");
};

const resolveRoomName = (camera: {
  room?: string;
  camera_config?: { room?: string };
}): string => {
  if (camera.room?.trim()) return camera.room.trim();
  if (typeof camera.camera_config?.room === "string" && camera.camera_config.room.trim()) {
    return camera.camera_config.room.trim();
  }
  return "";
};

const getInitial = (name: string): string => {
  if (!name) return "?";
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const onHeaderSiteFilterChange = () => {
  currentPage.value = 1;
  localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || "");
  // Load cameras for the new selected site
  if (selectedSiteFilter.value) {
    loadCameras();
  } else {
    cameras.value = [];
  }
};

const parseApiList = (resp: { data?: unknown } | null | undefined): any[] => {
  const payload = resp?.data;
  if (!payload || typeof payload !== "object") return [];

  const wrapped = payload as { data?: unknown };
  if (Array.isArray(wrapped.data)) return wrapped.data;
  if (Array.isArray(payload)) return payload;

  return [];
};

const loadSites = async () => {
  try {
    const selectedTeamId =
      localStorage.getItem("lastSelectedTeam") ||
      (route.query.teamId as string);

    const resp = selectedTeamId
      ? await ApiService.query(`teams/${selectedTeamId}/sites`, {})
      : await ApiService.query("sites", {});

    sites.value = parseApiList(resp).map((site: any) => ({
      uid: site.uid,
      name: site.name,
    }));
  } catch (error) {
    console.error("Error loading sites:", error);
    sites.value = [];
  }
};

const loadCameras = async () => {
  isLoading.value = true;

  try {
    // Get cameras for the selected site
    if (!selectedSiteFilter.value) {
      cameras.value = [];
      return;
    }

    const resp = await ApiService.query(`sites/${selectedSiteFilter.value}/cameras`, {});
    
    if (resp && resp.data) {
      const siteCameras = resp.data.data && Array.isArray(resp.data.data) ? resp.data.data : Array.isArray(resp.data) ? resp.data : [];
      
      cameras.value = siteCameras.map((camera: any) => {
        const cameraUrl = resolveCameraUrl(camera);

        return {
          id: camera.id || Date.now() + Math.random(),
          uid: camera.uid,
          siteId: camera.site_uid || selectedSiteFilter.value,
          name: camera.name || "",
          cameraUrl,
          brand: camera.brand || "",
          model: camera.model || "",
          type: camera.cam_type || camera.type || "Dome",
          resolution: camera.cam_resolution || "1080P (2MP)",
          location: camera.location || "",
          description: camera.description || "",
          status: normalizeStatusKey(
            typeof camera.status !== "undefined" ? camera.status : camera.is_active
          ),
          createdAt: camera.created_at || new Date().toISOString().split("T")[0],
          public_endpoint_url: cameraUrl,
          room: resolveRoomName(camera),
        };
      });
    } else {
      cameras.value = [];
    }
  } catch (error) {
    console.error("Error loading cameras:", error);
    // Fallback to empty array or mock data if needed
    cameras.value = [];
  } finally {
    isLoading.value = false;
  }
};

const saveCamera = async () => {
  cameraUrlError.value = "";
  const trimmedCameraUrl = cameraForm.value.cameraUrl.trim();

  if (!isValidCameraUrl(trimmedCameraUrl)) {
    cameraUrlError.value = t(
      "controlplane.site.camera.form.fields.cameraUrl.invalid"
    );
    return;
  }

  isLoading.value = true;

  try {
    // Hard-coded camera_config as requested
    const defaultCameraConfig: any = {
      zones: [],
      name: "default",
      allow_labels: [],
      deny_labels: [],
      min_score: 0.3,
      zone_test: "center",
      iou_threshold: 0.1,
      recording: {
        enabled: true,
        post_buffer_sec: 10,
        max_segment_sec: 300,
        activity_class: "person",
      },
    };

    // Build payload according to API specification
    const payload = {
      name: cameraForm.value.name,
      model: cameraForm.value.model || "",
      public_endpoint_url: trimmedCameraUrl,
      brand: cameraForm.value.brand,
      cam_type: cameraForm.value.type,
      cam_resolution: cameraForm.value.resolution,
      location: cameraForm.value.location || "",
      description: cameraForm.value.description || "",
      room: cameraForm.value.room.trim() || undefined,
      camera_config: defaultCameraConfig,
    };

    if (isEdit.value) {
      // PATCH for update using sites/{site_uid}/cameras/{camera_uid}
      // Prefer an explicit UID if available, fallback to numeric id
      const cameraUid = cameraForm.value.uid || cameraForm.value.id;
      console.log('Updating camera with UID:', cameraUid, 'on site:', cameraForm.value.siteId);
      await ApiService.patch(`sites/${cameraForm.value.siteId}/cameras/${cameraUid}`, payload);
      
      // Update existing camera in local state
      const index = cameras.value.findIndex(
        (c) => (c.uid || c.id) === (cameraForm.value.uid || cameraForm.value.id)
      );
      if (index !== -1) {
        cameras.value[index] = {
          ...cameras.value[index],
          ...cameraForm.value,
          siteId: cameraForm.value.siteId,
          room: cameraForm.value.room.trim(),
          cameraUrl: trimmedCameraUrl,
          public_endpoint_url: trimmedCameraUrl,
        };
      }
    } else {
      // POST for create new camera using sites/{site_uid}/cameras
      const resp = await ApiService.post(`sites/${cameraForm.value.siteId}/cameras`, payload);
      
      // Get the created camera data from response
      const createdCamera = resp?.data?.data || resp?.data;
      
      // Add new camera to local state
      const newCamera: Camera = {
        id: createdCamera?.uid || createdCamera?.id || Date.now(),
        siteId: cameraForm.value.siteId,
        room: cameraForm.value.room.trim(),
        name: cameraForm.value.name,
        cameraUrl: trimmedCameraUrl,
        brand: cameraForm.value.brand,
        model: cameraForm.value.model,
        type: cameraForm.value.type,
        resolution: cameraForm.value.resolution,
        location: cameraForm.value.location,
        description: cameraForm.value.description,
        status: "online",
        createdAt: new Date().toISOString().split("T")[0],
        public_endpoint_url: trimmedCameraUrl,
      };
      cameras.value.unshift(newCamera);
    }

    closeForm();
  } catch (error) {
    console.error("Error saving camera:", error);
  } finally {
    isLoading.value = false;
  }
};

const editCamera = async (camera: Camera) => {
  isLoading.value = true;
  
  try {
    // Use camera.uid if available, otherwise camera.id
    const cameraUid = camera.uid || camera.id;
    console.log('Fetching camera details for UID:', cameraUid, 'from site:', camera.siteId);
    
    // GET camera details using sites/{site_uid}/cameras/{camera_uid}
    const resp = await ApiService.query(`sites/${camera.siteId}/cameras/${cameraUid}`, {});
    console.log('API Response:', resp);
    
    if (resp && resp.data) {
      // Handle different response structures
      let cameraData;
      if (resp.data.status === "success" && resp.data.data) {
        cameraData = resp.data.data;
      } else if (resp.data.data) {
        cameraData = resp.data.data;
      } else {
        cameraData = resp.data;
      }
      
      console.log('Parsed camera data:', cameraData);
      
      // Only use API data if it's actually camera data (not a list)
      if (cameraData && typeof cameraData === 'object' && !Array.isArray(cameraData)) {
        // Map the API response to form values
        cameraForm.value = {
          uid: cameraData.uid || cameraData.id || camera.id,
          id: cameraData.id || camera.id,
          siteId: cameraData.site_uid || camera.siteId,
          room: resolveRoomName({ ...camera, ...cameraData }),
          name: cameraData.name || camera.name,
          cameraUrl: resolveCameraUrl({ ...camera, ...cameraData }),
          brand: cameraData.brand || camera.brand,
          model: cameraData.model || camera.model || "",
          type: cameraData.cam_type || cameraData.type || camera.type,
          resolution: cameraData.cam_resolution || cameraData.resolution || camera.resolution,
          location: cameraData.location || camera.location || "",
          description: cameraData.description || camera.description || "",
        };
      } else {
        console.warn('API returned unexpected data structure, using local camera data');
        cameraForm.value = {
          uid: camera.uid,
          id: camera.id,
          siteId: camera.siteId,
          room: camera.room,
          name: camera.name,
          cameraUrl: camera.cameraUrl,
          brand: camera.brand,
          model: camera.model || "",
          type: camera.type,
          resolution: camera.resolution,
          location: camera.location || "",
          description: camera.description || "",
        };
      }
    } else {
      console.warn('No data received from API, using local camera data');
      cameraForm.value = {
        uid: camera.uid,
        id: camera.id,
        siteId: camera.siteId,
        room: camera.room,
        name: camera.name,
        cameraUrl: camera.cameraUrl,
        brand: camera.brand,
        model: camera.model || "",
        type: camera.type,
        resolution: camera.resolution,
        location: camera.location || "",
        description: camera.description || "",
      };
    }
    
    isEdit.value = true;
    showCameraForm.value = true;
  } catch (error) {
    console.error('Error fetching camera details:', error);
    
    // Fallback to local camera data if API call fails
    cameraForm.value = {
      id: camera.id,
      siteId: camera.siteId,
      room: camera.room,
      name: camera.name,
      cameraUrl: camera.cameraUrl,
      brand: camera.brand,
      model: camera.model || "",
      type: camera.type,
      resolution: camera.resolution,
      location: camera.location || "",
      description: camera.description || "",
    };

    isEdit.value = true;
    showCameraForm.value = true;
  } finally {
    isLoading.value = false;
  }
};

const deleteCamera = async (camera: Camera) => {
  if (!confirm(t("controlplane.site.camera.notifications.deleteConfirm"))) return;

  isLoading.value = true;

  try {
    // Use camera UID for DELETE API call
    const cameraUid = camera.uid || camera.id;
    console.log('Deleting camera UID:', cameraUid, 'from site:', camera.siteId);
    
    // DELETE using sites/{site_uid}/cameras/{camera_uid}
    await ApiService.delete(`sites/${camera.siteId}/cameras/${cameraUid}`);

    // Remove camera from local state
    cameras.value = cameras.value.filter((c) => (c.uid || c.id) !== cameraUid);
  } catch (error) {
    console.error("Error deleting camera:", error);
  } finally {
    isLoading.value = false;
  }
};

const viewCamera = (camera: Camera) => {
  console.log("Opening live stream for camera:", camera.name);

  const streamUrl = resolveCameraUrl(camera);

  const cameraData = {
    uid: camera.uid || camera.id.toString(),
    name: camera.name,
    room: camera.room,
    recording: false,
    site_uid: camera.siteId,
    public_endpoint_url: streamUrl,
    model: camera.model
  };
  
  if (playbackModal.value) {
    playbackModal.value.openModal(cameraData);
  }
};

const openCreateForm = () => {
  cameraForm.value.siteId = selectedSiteFilter.value || cameraForm.value.siteId;
  showCameraForm.value = true;
  isEdit.value = false;
};

const closeForm = () => {
  showCameraForm.value = false;
  isEdit.value = false;
  cameraUrlError.value = "";
  cameraForm.value = {
    siteId: "",
    room: "",
    name: "",
    cameraUrl: "",
    brand: "",
    model: "",
    type: "Dome",
    resolution: "1080P (2MP)",
    location: "",
    description: "",
  };
};

// Lifecycle
onMounted(async () => {
  try {
    await loadSites();

    const siteFromRoute = (route.query.siteId as string) || (route.query.id as string);
    selectedSiteFilter.value = siteFromRoute || localStorage.getItem('lastSelectedSite') as string || (sites.value[0] && sites.value[0].uid) || "";
    localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || "");

    if (route.query.siteId && typeof route.query.siteId === "string") {
      cameraForm.value.siteId = route.query.siteId;
      selectedSiteFilter.value = route.query.siteId;
      localStorage.setItem("lastSelectedSite", route.query.siteId);
    }

    if (route.query.roomName && typeof route.query.roomName === "string") {
      cameraForm.value.room = route.query.roomName;
    }

    // Load cameras for the selected site (after all initialization)
    if (selectedSiteFilter.value) {
      await loadCameras();
    }

    // Open add camera modal if query param present
    if (route.query.addCamera === '1') {
      await openCreateForm();
    }
  } catch (error) {
    console.error('Error initializing camera management:', error);
  }
});

// Watch for changes to addCamera query param to open modal dynamically
watch(() => route.query.addCamera, async (val) => {
  if (val === '1') {
    await openCreateForm();
  }
});
</script>

<style scoped>
/* Camera Form Modal Styles */
.camera-form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.camera-form-modal-container {
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  margin: auto;
}

.camera-form-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.camera-form-modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.camera-form-modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: white;
}

/* Modal Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .camera-form-modal-container,
.modal-fade-leave-active .camera-form-modal-container {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .camera-form-modal-container {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

.modal-fade-leave-to .camera-form-modal-container {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

/* Scrollbar styling */
.camera-form-modal-body::-webkit-scrollbar {
  width: 6px;
}

.camera-form-modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.camera-form-modal-body::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.camera-form-modal-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
