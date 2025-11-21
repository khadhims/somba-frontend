<template>
  <!--begin::Room Management-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.site.room.title") }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!-- search and add moved below the form and above the table -->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!--begin::Form Modal-->
      <div v-if="showRoomForm" class="mb-10">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              {{
                isEdit
                  ? t("controlplane.site.room.form.titleEdit")
                  : t("controlplane.site.room.form.titleCreate")
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
            <form @submit.prevent="saveRoom" class="form">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.room.form.fields.site.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="roomForm.siteId"
                    class="form-select form-select-solid"
                    required
                  >
                    <option value="">
                      {{ t("controlplane.site.room.form.fields.site.placeholder") }}
                    </option>
                    <option
                      v-for="site in sites"
                      :key="site.id"
                      :value="site.id"
                    >
                      {{ site.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.room.form.fields.name.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="roomForm.name"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.room.form.fields.name.placeholder')"
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
                    {{ t("controlplane.site.room.form.fields.type.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="roomForm.type"
                    class="form-select form-select-solid"
                  >
                    <option
                      v-for="option in roomTypeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ t(`controlplane.site.room.form.fields.type.options.${option.key}`) }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">
                    {{ t("controlplane.site.room.form.fields.floor.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="roomForm.floor"
                    class="form-control form-control-solid"
                    :placeholder="t('controlplane.site.room.form.fields.floor.placeholder')"
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
                    {{ t("controlplane.site.room.form.fields.description.label") }}
                  </label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <textarea
                    v-model="roomForm.description"
                    class="form-control form-control-solid"
                    rows="3"
                    :placeholder="t('controlplane.site.room.form.fields.description.placeholder')"
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
                  {{ t("controlplane.site.room.form.actions.cancel") }}
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="indicator-progress">
                    {{ t("controlplane.site.room.form.actions.loading") }}
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                  <span v-else class="indicator-label">
                    {{
                      isEdit
                        ? t("controlplane.site.room.form.actions.update")
                        : t("controlplane.site.room.form.actions.create")
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

      <!--begin::Controls (below form, above table) -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <span class="me-2">
            {{ t("controlplane.site.room.toolbar.itemsLabel") }}
          </span>
          <select v-model="perPage" @change="onPerPageChange" class="form-select form-select-solid w-75px">
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>

        <div class="d-flex align-items-center">
          <div class="me-3 d-flex align-items-center position-relative">
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control form-control-solid w-250px ps-12"
              :placeholder="t('controlplane.site.room.toolbar.searchPlaceholder')"
            />
          </div>

          <button
            class="btn btn-sm btn-light-primary"
            @click="showRoomForm = true"
          >
            <i class="ki-duotone ki-plus fs-2 me-1"></i>
            {{ t("controlplane.site.room.toolbar.addButton") }}
          </button>
        </div>
      </div>

      <!--begin::Table-->
      <KTDataTable
        :data="filteredAndSortedRooms"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="perPage"
        :loading="isLoading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        :empty-table-text="t('controlplane.site.room.table.empty')"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-info text-info fw-bold">
                {{ row.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{
                row.name
              }}</span>
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                row.description
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:site="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            getSiteName(row.siteId)
          }}</span>
        </template>

        <template v-slot:type="{ row }">
          <span class="badge badge-light-primary fs-7 fw-bold">
            {{ resolveRoomTypeLabel(row.type) }}
          </span>
        </template>

        <template v-slot:floor="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            row.floor || "-"
          }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <router-link
              :to="`/controlplane/site/nvr?roomId=${row.id}`"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              :title="t('controlplane.site.room.actions.manageNvrs')"
            >
              <i class="ki-duotone ki-router fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editRoom(row)"
              :title="t('controlplane.site.room.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteRoom(row.id)"
              :title="t('controlplane.site.room.actions.delete')"
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
          :total-items="rooms.length"
          :total-pages="Math.max(1, Math.ceil(rooms.length / perPage))"
          @page-change="onPageChange"
          @per-page-change="onPerPageChange"
        />
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Room Management-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';

// Interfaces
interface Site {
  id: number;
  name: string;
}

interface Room {
  id: number;
  siteId: number;
  name: string;
  type: string;
  floor?: string;
  description?: string;
  createdAt: string;
}

interface RoomForm {
  id?: number;
  siteId: number | string;
  name: string;
  type: string;
  floor?: string;
  description?: string;
}

// Router
const route = useRoute();

const { t } = useI18n();

// Reactive data
const isLoading = ref(false);
const showRoomForm = ref(false);
const isEdit = ref(false);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

// Pagination state
const currentPage = ref<number>(1);
const perPage = ref<number>(10);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);

const sites = ref<Site[]>([]);
const rooms = ref<Room[]>([]);

const roomForm = ref<RoomForm>({
  siteId: "",
  name: "",
  type: "Office",
  floor: "",
  description: "",
});

const roomTypeOptions = [
  { value: "Office", key: "office" },
  { value: "Meeting Room", key: "meeting" },
  { value: "Lobby", key: "lobby" },
  { value: "Warehouse", key: "warehouse" },
  { value: "Security Room", key: "security" },
  { value: "Other", key: "other" },
];

const resolveRoomTypeLabel = (type: string) => {
  const option = roomTypeOptions.find((item) => item.value === type);
  return option
    ? t(`controlplane.site.room.form.fields.type.options.${option.key}`)
    : type;
};

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("controlplane.site.room.table.name"),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.room.table.site"),
    columnLabel: "site",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.room.table.type"),
    columnLabel: "type",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.room.table.floor"),
    columnLabel: "floor",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("controlplane.site.room.table.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Computed
const filteredAndSortedRooms = computed(() => {
  let filtered = rooms.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((room) => {
      const typeLabel = resolveRoomTypeLabel(room.type).toLowerCase();
      return (
        room.name.toLowerCase().includes(q) ||
        room.type.toLowerCase().includes(q) ||
        typeLabel.includes(q) ||
        getSiteName(room.siteId).toLowerCase().includes(q)
      );
    });
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const getValue = (item: Room, label: string) => {
        if (label === "site") return getSiteName(item.siteId);
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

// Methods
const getSiteName = (siteId: number): string => {
  const site = sites.value.find((s) => s.id === siteId);
  return site ? site.name : t("controlplane.site.room.fallback.unknownSite");
};

const loadSites = async () => {
  // Mock data
  sites.value = [
    { id: 1, name: "Main Office" },
    { id: 2, name: "Branch Office" },
    { id: 3, name: "Warehouse A" },
  ];
};

const loadRooms = async () => {
  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data
    rooms.value = [
      {
        id: 1,
        siteId: 1,
        name: "Reception",
        type: "Lobby",
        floor: "Ground Floor",
        description: "Main reception area",
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        siteId: 1,
        name: "Conference Room A",
        type: "Meeting Room",
        floor: "2nd Floor",
        description: "Large conference room",
        createdAt: "2024-01-16",
      },
      {
        id: 3,
        siteId: 2,
        name: "Storage Area",
        type: "Warehouse",
        floor: "Ground Floor",
        description: "Main storage facility",
        createdAt: "2024-01-17",
      },
    ];
  } catch (error) {
    console.error("Error loading rooms:", error);
  } finally {
    isLoading.value = false;
  }
};

const saveRoom = async () => {
  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (isEdit.value) {
      // Update existing room
      const index = rooms.value.findIndex((r) => r.id === roomForm.value.id);
      if (index !== -1) {
        rooms.value[index] = {
          ...rooms.value[index],
          ...roomForm.value,
          siteId: Number(roomForm.value.siteId),
        };
      }
    } else {
      // Add new room
      const newRoom: Room = {
        id: Date.now(),
        siteId: Number(roomForm.value.siteId),
        name: roomForm.value.name,
        type: roomForm.value.type,
        floor: roomForm.value.floor,
        description: roomForm.value.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      rooms.value.unshift(newRoom);
    }

    closeForm();
  } catch (error) {
    console.error("Error saving room:", error);
  } finally {
    isLoading.value = false;
  }
};

const editRoom = (room: Room) => {
  roomForm.value = {
    id: room.id,
    siteId: room.siteId,
    name: room.name,
    type: room.type,
    floor: room.floor,
    description: room.description,
  };
  isEdit.value = true;
  showRoomForm.value = true;
};

const deleteRoom = async (roomId: number) => {
  if (!confirm(t("controlplane.site.room.notifications.deleteConfirm"))) return;

  isLoading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    rooms.value = rooms.value.filter((r) => r.id !== roomId);
  } catch (error) {
    console.error("Error deleting room:", error);
  } finally {
    isLoading.value = false;
  }
};

const closeForm = () => {
  showRoomForm.value = false;
  isEdit.value = false;
  roomForm.value = {
    siteId: "",
    name: "",
    type: "Office",
    floor: "",
    description: "",
  };
};

const onPerPageChange = () => {
  currentPage.value = 1;
};

const onPageChange = (p: number) => {
  currentPage.value = p;
};

// Lifecycle
onMounted(() => {
  loadSites();
  loadRooms();

  // Pre-select site if coming from site overview
  if (route.query.siteId) {
    roomForm.value.siteId = Number(route.query.siteId);
  }
});
</script>
