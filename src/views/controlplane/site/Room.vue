<template>
  <!--begin::Room Management-->
  <div :class="cardClass">
    <!--begin::Card header-->
    <div class="p-6 pb-0">
      <h3 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.site.room.title") }}
      </h3>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <!--begin::Form-->
      <div
        v-if="showRoomForm"
        class="mb-10 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 class="m-0 text-base font-bold text-gray-900 dark:text-gray-100">
            {{
              isEdit
                ? t("controlplane.site.room.form.titleEdit")
                : t("controlplane.site.room.form.titleCreate")
            }}
          </h3>
          <button
            type="button"
            @click="closeForm"
            class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <i class="ki-duotone ki-cross fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
        </div>
        <div class="p-4">
          <form @submit.prevent="saveRoom">
            <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">
                  {{ t("controlplane.site.room.form.fields.site.label") }}
                </label>
                <select v-model="roomForm.siteId" required :class="formInputClass">
                  <option value="">
                    {{ t("controlplane.site.room.form.fields.site.placeholder") }}
                  </option>
                  <option v-for="site in sites" :key="site.id" :value="site.id">
                    {{ site.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700 after:ml-0.5 after:text-danger after:content-['*'] dark:text-gray-300">
                  {{ t("controlplane.site.room.form.fields.name.label") }}
                </label>
                <input
                  type="text"
                  v-model="roomForm.name"
                  :placeholder="t('controlplane.site.room.form.fields.name.placeholder')"
                  required
                  :class="formInputClass"
                />
              </div>
            </div>

            <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("controlplane.site.room.form.fields.type.label") }}
                </label>
                <select v-model="roomForm.type" :class="formInputClass">
                  <option v-for="option in roomTypeOptions" :key="option.value" :value="option.value">
                    {{ t(`controlplane.site.room.form.fields.type.options.${option.key}`) }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {{ t("controlplane.site.room.form.fields.floor.label") }}
                </label>
                <input
                  type="text"
                  v-model="roomForm.floor"
                  :placeholder="t('controlplane.site.room.form.fields.floor.placeholder')"
                  :class="formInputClass"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ t("controlplane.site.room.form.fields.description.label") }}
              </label>
              <textarea
                v-model="roomForm.description"
                rows="3"
                :placeholder="t('controlplane.site.room.form.fields.description.placeholder')"
                :class="formInputClass"
              ></textarea>
            </div>

            <div class="flex justify-center gap-3">
              <button
                type="button"
                @click="closeForm"
                :class="secondaryButtonClass"
              >
                {{ t("controlplane.site.room.form.actions.cancel") }}
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="inline-flex items-center gap-2"
                :class="primaryButtonClass"
              >
                <span v-if="isLoading" class="inline-flex items-center gap-2">
                  {{ t("controlplane.site.room.form.actions.loading") }}
                  <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </span>
                <span v-else>
                  {{
                    isEdit
                      ? t("controlplane.site.room.form.actions.update")
                      : t("controlplane.site.room.form.actions.create")
                  }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--end::Form-->

      <!--begin::Controls (below form, above table) -->
      <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center">
          <span class="mr-2 text-sm text-gray-700 dark:text-gray-300">
            {{ t("controlplane.site.room.toolbar.itemsLabel") }}
          </span>
          <select
            v-model="perPage"
            @change="onPerPageChange"
            class="w-[75px] rounded-md border border-gray-300 bg-white px-2 py-1 text-sm tabular-nums transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <div class="relative flex items-center">
            <i class="ki-duotone ki-magnifier fs-3 pointer-events-none absolute left-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="t('controlplane.site.room.toolbar.searchPlaceholder')"
              class="w-[250px] rounded-md border border-gray-300 bg-gray-100 py-2 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <button
            @click="showRoomForm = true"
            class="inline-flex items-center gap-1"
            :class="lightButtonClass"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
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
          <div class="flex items-center">
            <InitialAvatar :name="row.name" variant="info" class="mr-5" />
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 hover:text-primary dark:text-gray-100">{{
                row.name
              }}</span>
              <span class="text-sm text-gray-500">{{ row.description }}</span>
            </div>
          </div>
        </template>

        <template v-slot:site="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">{{
            getSiteName(row.siteId)
          }}</span>
        </template>

        <template v-slot:type="{ row }">
          <span class="inline-flex rounded bg-primary-light px-2 py-1 text-xs font-semibold text-primary">
            {{ resolveRoomTypeLabel(row.type) }}
          </span>
        </template>

        <template v-slot:floor="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">{{
            row.floor || "-"
          }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="flex justify-end gap-1">
            <RowActionButton
              :to="`/controlplane/site/nvr?roomId=${row.id}`"
              :title="t('controlplane.site.room.actions.manageNvrs')"
            >
              <i class="ki-duotone ki-router fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton @click="editRoom(row)" :title="t('controlplane.site.room.actions.edit')">
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              @click="deleteRoom(row.id)"
              :title="t('controlplane.site.room.actions.delete')"
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
        </template>
      </KTDataTable>
      <!--end::Table-->

      <!--begin::Pagination-->
      <div class="mt-4 flex items-center justify-end">
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
import InitialAvatar from "@/components/common/InitialAvatar.vue";
import RowActionButton from "@/components/common/RowActionButton.vue";
import { formInputClass, cardClass, primaryButtonClass, secondaryButtonClass, lightButtonClass } from "@/core/helpers/badge";

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
