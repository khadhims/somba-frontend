<template>
  <!--begin::Camera Filters-->
  <div
    class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h4 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ t("controlplane.site.camera.header.title") }}
        </h4>
        <p class="m-0 text-gray-500">
          {{ t("controlplane.site.camera.header.subtitleDefault") }}
        </p>
      </div>

      <div class="flex items-center">
        <label class="mr-3 mb-0 shrink-0 font-semibold text-gray-700 dark:text-gray-300">
          {{ t("controlplane.site.camera.filters.siteLabel") }}
        </label>
        <select
          v-model="selectedSiteFilter"
          @change="onHeaderSiteFilterChange"
          class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">{{ t("controlplane.site.camera.filters.siteAll") }}</option>
          <option v-for="site in sites" :key="site.uid" :value="site.uid">{{ site.name }}</option>
        </select>
      </div>
    </div>
  </div>

  <!--begin::Camera List-->
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <!--begin::Card header-->
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.site.camera.title") }}
      </h3>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Items per page -->
        <div class="flex items-center">
          <label class="mr-2 mb-0 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.site.camera.toolbar.itemsLabel") }}
          </label>
          <select
            v-model.number="perPage"
            @change="onPerPageChange"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm tabular-nums transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>

        <!-- Search -->
        <div class="relative flex items-center">
          <i class="ki-duotone ki-magnifier fs-3 pointer-events-none absolute left-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('controlplane.site.camera.toolbar.searchPlaceholder')"
            class="w-[250px] rounded-md border border-gray-300 bg-gray-100 py-2 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          @click.prevent="showCameraForm = true"
          class="inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98]"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.site.camera.toolbar.addButton") }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
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
          <div class="flex items-center">
            <div
              class="mr-5 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-success-light font-bold text-success"
            >
              {{ getInitial(row.name) }}
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 hover:text-primary dark:text-gray-100">{{
                row.name
              }}</span>
              <span class="text-sm text-gray-500">{{ row.ipAddress }}</span>
            </div>
          </div>
        </template>

        <template v-slot:location="{ row }">
          <div>
            <span class="block font-bold text-gray-900 dark:text-gray-100">{{
              getSiteName(row.siteId)
            }}</span>
            <span class="block text-sm text-gray-500">{{ getRoomName(row.roomId) }}</span>
            <span class="block text-xs text-gray-400">{{ row.location }}</span>
          </div>
        </template>

        <template v-slot:specs="{ row }">
          <div class="flex flex-col items-start gap-1">
            <span class="inline-flex rounded bg-info-light px-2 py-1 text-xs font-semibold text-info">{{
              row.brand
            }}</span>
            <span class="inline-flex rounded bg-warning-light px-2 py-1 text-xs font-semibold text-warning">{{
              row.resolution
            }}</span>
          </div>
        </template>

        <template v-slot:nvr="{ row }">
          <div>
            <span class="block font-bold text-gray-900 dark:text-gray-100">{{
              getNvrName(row.nvrId)
            }}</span>
            <span class="block text-sm text-gray-500">
              {{ t("controlplane.site.camera.table.channelPrefix") }}
              {{ row.channel }}
            </span>
          </div>
        </template>

        <template v-slot:status="{ row }">
          <span
            class="inline-flex rounded px-2 py-1 text-xs font-semibold"
            :class="statusBadgeClass(row.status)"
          >
            {{ resolveStatusLabel(row.status) }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              @click="viewCamera(row)"
              :title="t('controlplane.site.camera.actions.view')"
              class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-colors hover:text-success active:scale-[0.95] dark:bg-gray-800 dark:text-gray-300"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
            <button
              @click="editCamera(row)"
              :title="t('controlplane.site.camera.actions.edit')"
              class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-colors hover:text-primary active:scale-[0.95] dark:bg-gray-800 dark:text-gray-300"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              @click="deleteCamera(row)"
              :title="t('controlplane.site.camera.actions.delete')"
              class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-colors hover:text-danger active:scale-[0.95] dark:bg-gray-800 dark:text-gray-300"
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
      <div class="mt-4 flex items-center justify-end">
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
              @click="closeForm"
              class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <i class="ki-duotone ki-cross fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="camera-form-modal-body">
            <form @submit.prevent="saveCamera">
              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="required mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.site.label") }}
                  </label>
                  <select v-model="cameraForm.siteId" @change="onSiteChange" required :class="formInputClass">
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.site.placeholder") }}
                    </option>
                    <option v-for="site in sites" :key="site.uid" :value="site.uid">
                      {{ site.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.room.label") }}
                  </label>
                  <select v-model="cameraForm.roomId" @change="onRoomChange" :class="formInputClass">
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.room.placeholder") }}
                    </option>
                    <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                      {{ room.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="required mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.name.label") }}
                  </label>
                  <input
                    type="text"
                    v-model="cameraForm.name"
                    :placeholder="t('controlplane.site.camera.form.fields.name.placeholder')"
                    required
                    :class="formInputClass"
                  />
                </div>

                <div>
                  <label class="required mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.ipAddress.label") }}
                  </label>
                  <input
                    type="text"
                    v-model="cameraForm.ipAddress"
                    :placeholder="t('controlplane.site.camera.form.fields.ipAddress.placeholder')"
                    required
                    :class="formInputClass"
                  />
                </div>
              </div>

              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.brand.label") }}
                  </label>
                  <select v-model="cameraForm.brand" :class="formInputClass">
                    <option value="">
                      {{ t("controlplane.site.camera.form.fields.brand.placeholder") }}
                    </option>
                    <option value="Hikvision">{{ t("controlplane.site.camera.form.fields.brand.options.hikvision") }}</option>
                    <option value="Dahua">{{ t("controlplane.site.camera.form.fields.brand.options.dahua") }}</option>
                    <option value="Uniview">{{ t("controlplane.site.camera.form.fields.brand.options.uniview") }}</option>
                    <option value="Tiandy">{{ t("controlplane.site.camera.form.fields.brand.options.tiandy") }}</option>
                    <option value="Axis">{{ t("controlplane.site.camera.form.fields.brand.options.axis") }}</option>
                    <option value="Other">{{ t("controlplane.site.camera.form.fields.brand.options.other") }}</option>
                  </select>
                </div>

                <div>
                  <label class="required mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.model.label") }}
                  </label>
                  <input
                    type="text"
                    v-model="cameraForm.model"
                    :placeholder="t('controlplane.site.camera.form.fields.model.placeholder')"
                    required
                    :class="formInputClass"
                  />
                </div>
              </div>

              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.type.label") }}
                  </label>
                  <select v-model="cameraForm.type" :class="formInputClass">
                    <option value="Dome">{{ t("controlplane.site.camera.form.fields.type.options.dome") }}</option>
                    <option value="Bullet">{{ t("controlplane.site.camera.form.fields.type.options.bullet") }}</option>
                    <option value="PTZ">{{ t("controlplane.site.camera.form.fields.type.options.ptz") }}</option>
                    <option value="Fisheye">{{ t("controlplane.site.camera.form.fields.type.options.fisheye") }}</option>
                    <option value="Turret">{{ t("controlplane.site.camera.form.fields.type.options.turret") }}</option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.resolution.label") }}
                  </label>
                  <select v-model="cameraForm.resolution" :class="formInputClass">
                    <option value="1080P (2MP)">{{ t("controlplane.site.camera.form.fields.resolution.options.1080p") }}</option>
                    <option value="4MP">{{ t("controlplane.site.camera.form.fields.resolution.options.4mp") }}</option>
                    <option value="5MP">{{ t("controlplane.site.camera.form.fields.resolution.options.5mp") }}</option>
                    <option value="4K (8MP)">{{ t("controlplane.site.camera.form.fields.resolution.options.4k") }}</option>
                    <option value="12MP">{{ t("controlplane.site.camera.form.fields.resolution.options.12mp") }}</option>
                  </select>
                </div>
              </div>

              <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.channel.label") }}
                  </label>
                  <input
                    type="number"
                    v-model="cameraForm.channel"
                    :placeholder="t('controlplane.site.camera.form.fields.channel.placeholder')"
                    min="1"
                    max="64"
                    :class="formInputClass"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {{ t("controlplane.site.camera.form.fields.location.label") }}
                  </label>
                  <input
                    type="text"
                    v-model="cameraForm.location"
                    :placeholder="t('controlplane.site.camera.form.fields.location.placeholder')"
                    :class="formInputClass"
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("controlplane.site.camera.form.fields.description.label") }}
                </label>
                <textarea
                  v-model="cameraForm.description"
                  rows="3"
                  :placeholder="t('controlplane.site.camera.form.fields.description.placeholder')"
                  :class="formInputClass"
                ></textarea>
              </div>

              <!--begin::Actions-->
              <div class="flex justify-center gap-3 pt-3">
                <button
                  type="button"
                  @click="closeForm"
                  class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ t("controlplane.site.camera.form.actions.cancel") }}
                </button>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span v-if="isLoading" class="inline-flex items-center gap-2">
                    {{ t("controlplane.site.camera.form.actions.loading") }}
                    <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  </span>
                  <span v-else>
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

// Shared Tailwind class for the form fields above.
const formInputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

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
  public_endpoint_url?: string; // Add for playback modal
  room?: string; // Add for playback modal
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
const playbackModal = ref<InstanceType<typeof CameraPlaybackModal> | null>(null);

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

const statusBadgeClass = (status?: unknown): string =>
  normalizeStatusKey(status) === "online"
    ? "bg-success-light text-success"
    : "bg-danger-light text-danger";

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

const getInitial = (name: string): string => {
  if (!name) return "?";
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
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
        ipAddress: camera.ip_address || camera.ipAddress || "",
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
        public_endpoint_url: camera.public_endpoint_url || "",
        room: camera.room_name || camera.room || "",
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
  
  // Prepare camera data for modal
  const cameraData = {
    uid: camera.uid || camera.id.toString(),
    name: camera.name,
    room: camera.room || getRoomName(camera.roomId),
    recording: false,
    site_uid: camera.siteId,
    nvr_uid: camera.nvrId,
    public_endpoint_url: camera.public_endpoint_url,
    model: camera.model
  };
  
  if (playbackModal.value) {
    playbackModal.value.openModal(cameraData);
  }
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

    // Open add camera modal if query param present
    if (route.query.addCamera === '1') {
      showCameraForm.value = true;
      isEdit.value = false;
    }
  } catch (error) {
    console.error('Error initializing camera management:', error);
  }
});

// Watch for changes to addCamera query param to open modal dynamically
watch(() => route.query.addCamera, (val) => {
  if (val === '1') {
    showCameraForm.value = true;
    isEdit.value = false;
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
