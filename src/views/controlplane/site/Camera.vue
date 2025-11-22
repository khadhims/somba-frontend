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
          @click.prevent="showCameraForm = true" 
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
      <!--begin::Form Modal-->
      <div v-if="showCameraForm" class="mb-10">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              {{
                isEdit
                  ? t("controlplane.site.camera.form.titleEdit")
                  : t("controlplane.site.camera.form.titleCreate")
              }}
            </h3>
            <div class="card-toolbar">
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
          </div>
          <div class="card-body">
            <form @submit.prevent="saveCamera" class="form">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.site.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.siteId"
                    @change="onSiteChange"
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

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.room.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.roomId"
                    @change="onRoomChange"
                    class="form-select form-select-solid"
                  >
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.room.placeholder") }}
                    </option>
                    <option
                      v-for="room in availableRooms"
                      :key="room.id"
                      :value="room.id"
                    >
                      {{ room.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.nvr.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="cameraForm.nvrId"
                    class="form-select form-select-solid"
                    required
                  >
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.nvr.placeholder") }}
                    </option>
                    <option
                      v-for="nvr in availableNvrs"
                      :key="nvr.uid"
                      :value="nvr.uid"
                    >
                      {{ nvr.name }}
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
                    {{ t("controlplane.site.camera.form.fields.ipAddress.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.ipAddress"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.camera.form.fields.ipAddress.placeholder')"
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
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.camera.form.fields.channel.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="number"
                    v-model="cameraForm.channel"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.camera.form.fields.channel.placeholder')"
                    min="1"
                    max="64"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
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
              <div class="text-center">
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
      <!--end::Form Modal-->

      <!-- Controls moved to header toolbar to match Site overview layout -->

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
              <span class="symbol-label bg-light-success text-success fw-bold">
                <i class="ki-duotone ki-picture fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{
                row.name
              }}</span>
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                row.ipAddress
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
              getRoomName(row.roomId)
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

        <template v-slot:nvr="{ row }">
          <div>
            <span class="text-dark fw-bold d-block fs-6">{{
              getNvrName(row.nvrId)
            }}</span>
            <span class="text-muted fw-semibold d-block fs-7">
              {{ t("controlplane.site.camera.table.channelPrefix") }}
              {{ row.channel }}
            </span>
          </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ApiService from '@/core/services/ApiService';

// Interfaces
interface Site {
  uid: string;
  name: string;
}

interface Room {
  id: number;
  siteId: string;
  name: string;
}

interface Nvr {
  uid: string;
  site_uid: string;
  roomId: number;
  name: string;
}

interface Camera {
  id: number;
  uid?: string; // Add uid field for API compatibility
  siteId: string;
  roomId: number;
  nvrId: string;
  name: string;
  ipAddress: string;
  brand: string;
  model?: string;
  type: string;
  resolution: string;
  channel: number;
  location?: string;
  description?: string;
  status: "online" | "offline";
  createdAt: string;
}

interface CameraForm {
  id?: number;
  uid?: string;
  siteId: string;
  roomId: number | string;
  nvrId: string;
  name: string;
  ipAddress: string;
  brand: string;
  model?: string;
  type: string;
  resolution: string;
  channel: number;
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
const rooms = ref<Room[]>([]);
const nvrs = ref<Nvr[]>([]);
const cameras = ref<Camera[]>([]);

// Header filter state
const selectedSiteFilter = ref<string>("");
const selectedNvrFilter = ref<string>("");

// Pagination state
const currentPage = ref<number>(1);
const perPage = ref<number>(10);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);

const cameraForm = ref<CameraForm>({
  uid: undefined,
  siteId: "",
  roomId: "",
  nvrId: "",
  name: "",
  ipAddress: "",
  brand: "",
  model: "",
  type: "Dome",
  resolution: "1080P (2MP)",
  channel: 1,
  location: "",
  description: "",
});

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
    columnName: t("controlplane.site.camera.table.nvr"),
    columnLabel: "nvr",
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

// Computed
const availableRooms = computed(() => {
  if (!cameraForm.value.siteId) return [];
  return rooms.value.filter(
    (room) => room.siteId === cameraForm.value.siteId
  );
});

const availableNvrs = computed(() => {
  if (!cameraForm.value.siteId) return [];
  return nvrs.value.filter(
    (nvr) => nvr.site_uid === cameraForm.value.siteId
  );
});

const availableHeaderNvrs = computed(() => {
  if (!selectedSiteFilter.value) return [];
  return nvrs.value.filter(
    (nvr) => nvr.site_uid === selectedSiteFilter.value
  );
});

const filteredAndSortedCameras = computed(() => {
  let filtered = cameras.value;

  // Filter by selected NVR in header only
  // Site filter is handled by backend API call
  if (selectedNvrFilter.value) {
    filtered = filtered.filter((camera) => camera.nvrId === selectedNvrFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (camera) =>
        camera.name.toLowerCase().includes(q) ||
        camera.ipAddress.includes(q) ||
        camera.brand.toLowerCase().includes(q) ||
        camera.type.toLowerCase().includes(q) ||
        getSiteName(camera.siteId).toLowerCase().includes(q) ||
        getRoomName(camera.roomId).toLowerCase().includes(q)
    );
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const getValue = (item: Camera, label: string) => {
        if (label === "location") return getSiteName(item.siteId);
        if (label === "nvr") return getNvrName(item.nvrId);
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

const getRoomName = (roomId: number): string => {
  const room = rooms.value.find((r) => r.id === roomId);
  return room ? room.name : t("controlplane.site.camera.fallback.unknownRoom");
};

const getNvrName = (nvrId: string): string => {
  const nvr = nvrs.value.find((n) => n.uid === nvrId);
  return nvr ? nvr.name : t("controlplane.site.camera.fallback.unknownNvr");
};

const onSiteChange = () => {
  cameraForm.value.roomId = "";
  cameraForm.value.nvrId = "";
  // Load NVRs for the selected site
  if (cameraForm.value.siteId) {
    loadNvrsBySite(cameraForm.value.siteId as string);
  }
};

const onRoomChange = () => {
  cameraForm.value.nvrId = "";
};

const onHeaderSiteFilterChange = () => {
  selectedNvrFilter.value = "";
  currentPage.value = 1;
  localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || "");
  // Load cameras for the new selected site
  if (selectedSiteFilter.value) {
    loadCameras();
  } else {
    cameras.value = [];
  }
};

const onHeaderNvrFilterChange = () => {
  currentPage.value = 1;
};

const loadSites = async () => {
  try {
    // Get selected team from localStorage or query params
    const selectedTeamId = localStorage.getItem('lastSelectedTeam') || route.query.teamId as string;
    if (!selectedTeamId) {
      console.warn('No team selected, cannot load sites');
      sites.value = [];
      return;
    }

    const resp = await ApiService.query(`teams/${selectedTeamId}/sites`, {});
    
    // Parse response (wrapped or direct)
    if (resp && resp.data) {
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        sites.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        sites.value = resp.data;
      } else {
        console.warn('Unexpected sites response format:', resp.data);
        sites.value = [];
      }
    } else {
      console.warn('No data received from sites API');
      sites.value = [];
    }
  } catch (error) {
    console.error('Error loading sites:', error);
    // Fallback to mock data for development
    sites.value = [
      { uid: "site-1", name: "Main Office" },
      { uid: "site-2", name: "Branch Office" },
      { uid: "site-3", name: "Warehouse A" },
    ];
  }
};

const loadRooms = async () => {
  try {
    // Get all rooms for all sites
    const allRooms: Room[] = [];
    
    for (const site of sites.value) {
      try {
        // Assuming API endpoint exists for rooms by site
        // const resp = await ApiService.query(`sites/${site.uid}/rooms`, {});
        // For now use mock data mapped to actual site UIDs
        const mockRoomsForSite = [
          { id: Date.now() + Math.random(), siteId: site.uid, name: "Reception" },
          { id: Date.now() + Math.random() + 1, siteId: site.uid, name: "Conference Room A" },
        ];
        allRooms.push(...mockRoomsForSite);
      } catch (error) {
        console.warn(`Error loading rooms for site ${site.uid}:`, error);
      }
    }
    
    rooms.value = allRooms;
  } catch (error) {
    console.error('Error loading rooms:', error);
    // Fallback to mock data with updated site IDs
    rooms.value = [
      { id: 1, siteId: "site-1", name: "Reception" },
      { id: 2, siteId: "site-1", name: "Conference Room A" },
      { id: 3, siteId: "site-2", name: "Storage Area" },
    ];
  }
};

const loadNvrs = async () => {
  try {
    // Get all NVRs for all sites initially
    const allNvrs: Nvr[] = [];
    
    for (const site of sites.value) {
      try {
        const resp = await ApiService.query(`sites/${site.uid}/video-recorders`, {});
        if (resp && resp.data) {
          const siteNvrs = resp.data.data && Array.isArray(resp.data.data) ? resp.data.data : Array.isArray(resp.data) ? resp.data : [];
          
          const mappedNvrs = siteNvrs.map((nvr: any) => ({
            uid: nvr.uid,
            site_uid: nvr.site_uid || site.uid,
            roomId: nvr.room_id ?? nvr.roomId ?? 0,
            name: nvr.name
          }));
          
          allNvrs.push(...mappedNvrs);
        }
      } catch (error) {
        console.warn(`Error loading NVRs for site ${site.uid}:`, error);
      }
    }
    
    nvrs.value = allNvrs;
  } catch (error) {
    console.error('Error loading NVRs:', error);
    // Fallback to mock data
    nvrs.value = [
      { uid: "nvr-1", site_uid: "site-1", roomId: 1, name: "NVR-Reception-01" },
      { uid: "nvr-2", site_uid: "site-1", roomId: 2, name: "NVR-Conference-01" },
      { uid: "nvr-3", site_uid: "site-2", roomId: 3, name: "NVR-Storage-01" },
    ];
  }
};

const loadNvrsBySite = async (siteId: string) => {
  try {
    const resp = await ApiService.query(`sites/${siteId}/video-recorders`, {});
    if (resp && resp.data) {
      const siteNvrs = resp.data.data && Array.isArray(resp.data.data) ? resp.data.data : Array.isArray(resp.data) ? resp.data : [];
      
      // Update nvrs for this specific site
      nvrs.value = nvrs.value.filter(nvr => nvr.site_uid !== siteId);
      const mappedNvrs = siteNvrs.map((nvr: any) => ({
        uid: nvr.uid,
        site_uid: nvr.site_uid || siteId,
        roomId: nvr.room_id ?? nvr.roomId ?? 0,
        name: nvr.name
      }));
      nvrs.value.push(...mappedNvrs);
    }
  } catch (error) {
    console.error(`Error loading NVRs for site ${siteId}:`, error);
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
      
      cameras.value = siteCameras.map((camera: any) => ({
        id: camera.id || Date.now() + Math.random(),
        uid: camera.uid, // Store uid from API
        siteId: camera.site_uid || selectedSiteFilter.value,
        roomId: camera.room_id ?? camera.roomId ?? 0,
        nvrId: camera.video_recorder_uid || camera.nvrId || "",
        name: camera.name || "",
        ipAddress: camera.public_endpoint_url || camera.ipAddress || "",
        brand: camera.brand || "",
        model: camera.model || "",
        type: camera.cam_type || "Dome",
        resolution: camera.cam_resolution || "1080P (2MP)",
        channel: camera.channels || camera.channel || 1,
        location: camera.location || "",
        description: camera.description || "",
        status: normalizeStatusKey(
          typeof camera.status !== "undefined" ? camera.status : camera.is_active
        ),
        createdAt: camera.created_at || new Date().toISOString().split("T")[0],
      }));
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
  isLoading.value = true;

  try {
    // Hard-coded camera_config as requested
    const defaultCameraConfig: any = {
      zones: [],
      // Do not send a hard-coded UID for camera_config — the backend should
      // generate or preserve it. Including a fixed UID causes DB uniqueness
      // / integrity errors when multiple cameras share the same config UID.
      name: "default",
      allow_labels: [],
      deny_labels: [],
      min_score: 0.3,
      zone_test: "center",
      iou_threshold: 0.1
    };

    // Build payload according to API specification
    const payload = {
      name: cameraForm.value.name,
      model: cameraForm.value.model || "",
      public_endpoint_url: cameraForm.value.ipAddress, // mapping IP address to public_endpoint_url
      brand: cameraForm.value.brand,
      cam_type: cameraForm.value.type, // mapping type to cam_type
      cam_resolution: cameraForm.value.resolution, // mapping resolution to cam_resolution
      channels: cameraForm.value.channel,
      location: cameraForm.value.location || "",
      description: cameraForm.value.description || "",
      camera_config: defaultCameraConfig,
      video_recorder_uid: cameraForm.value.nvrId
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
          roomId: Number(cameraForm.value.roomId),
          nvrId: cameraForm.value.nvrId,
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
        roomId: Number(cameraForm.value.roomId),
        nvrId: cameraForm.value.nvrId,
        name: cameraForm.value.name,
        ipAddress: cameraForm.value.ipAddress,
        brand: cameraForm.value.brand,
        model: cameraForm.value.model,
        type: cameraForm.value.type,
        resolution: cameraForm.value.resolution,
        channel: cameraForm.value.channel,
        location: cameraForm.value.location,
        description: cameraForm.value.description,
        status: "online",
        createdAt: new Date().toISOString().split("T")[0],
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
          roomId: cameraData.room_id ?? cameraData.roomId ?? camera.roomId,
          nvrId: cameraData.video_recorder_uid || cameraData.nvrId || camera.nvrId,
          name: cameraData.name || camera.name,
          ipAddress: cameraData.public_endpoint_url || cameraData.ipAddress || camera.ipAddress,
          brand: cameraData.brand || camera.brand,
          model: cameraData.model || camera.model || "",
          type: cameraData.cam_type || cameraData.type || camera.type,
          resolution: cameraData.cam_resolution || cameraData.resolution || camera.resolution,
          channel: cameraData.channels || cameraData.channel || camera.channel,
          location: cameraData.location || camera.location || "",
          description: cameraData.description || camera.description || "",
        };
      } else {
        console.warn('API returned unexpected data structure, using local camera data');
        // Use local camera data if API returns unexpected structure
        cameraForm.value = {
          uid: camera.uid,
          id: camera.id,
          siteId: camera.siteId,
          roomId: camera.roomId,
          nvrId: camera.nvrId,
          name: camera.name,
          ipAddress: camera.ipAddress,
          brand: camera.brand,
          model: camera.model || "",
          type: camera.type,
          resolution: camera.resolution,
          channel: camera.channel,
          location: camera.location || "",
          description: camera.description || "",
        };
      }
    } else {
      console.warn('No data received from API, using local camera data');
      // Fallback to local camera data if API fails
      cameraForm.value = {
        uid: camera.uid,
        id: camera.id,
        siteId: camera.siteId,
        roomId: camera.roomId,
        nvrId: camera.nvrId,
        name: camera.name,
        ipAddress: camera.ipAddress,
        brand: camera.brand,
        model: camera.model || "",
        type: camera.type,
        resolution: camera.resolution,
        channel: camera.channel,
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
      roomId: camera.roomId,
      nvrId: camera.nvrId,
      name: camera.name,
      ipAddress: camera.ipAddress,
      brand: camera.brand,
      model: camera.model || "",
      type: camera.type,
      resolution: camera.resolution,
      channel: camera.channel,
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
  // TODO: Implement live stream viewer
  alert(t("controlplane.site.camera.actions.viewAlert", { name: camera.name }));
};

const closeForm = () => {
  showCameraForm.value = false;
  isEdit.value = false;
  cameraForm.value = {
    siteId: "",
    roomId: "",
    nvrId: "",
    name: "",
    ipAddress: "",
    brand: "",
    model: "",
    type: "Dome",
    resolution: "1080P (2MP)",
    channel: 1,
    location: "",
    description: "",
  };
};

// Lifecycle
onMounted(async () => {
  try {
    // Load data in sequence since NVRs depend on sites
    await loadSites();
    await loadRooms();
    
  // Initialize selected site filter (prefer route param siteId or legacy id, then localStorage)
  const siteFromRoute = (route.query.siteId as string) || (route.query.id as string);
  selectedSiteFilter.value = siteFromRoute || localStorage.getItem('lastSelectedSite') as string || (sites.value[0] && sites.value[0].uid) || "";
    localStorage.setItem('lastSelectedSite', selectedSiteFilter.value || "");
    
    await loadNvrs();
    
    // Pre-select NVR if coming from NVR overview
    if (route.query.nvrId) {
      const nvrId = route.query.nvrId as string;
      const nvr = nvrs.value.find((n) => n.uid === nvrId);
      if (nvr) {
        selectedSiteFilter.value = nvr.site_uid;
        selectedNvrFilter.value = nvrId;
        cameraForm.value.siteId = nvr.site_uid;
        cameraForm.value.roomId = nvr.roomId;
        cameraForm.value.nvrId = nvrId;
      }
    }

    // Load cameras for the selected site (after all initialization)
    if (selectedSiteFilter.value) {
      await loadCameras();
    }
  } catch (error) {
    console.error('Error initializing camera management:', error);
  }
});
</script>
