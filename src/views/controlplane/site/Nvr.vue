<template>
  <!--begin::NVR Management-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">NVR Management</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!-- per-page select moved to pagination area below the table -->

        <div class="me-3 d-flex align-items-center">
          <label class="form-label me-3 mb-0 fw-semibold">Site:</label>
          <select
            v-model="selectedSiteFilter"
            @change="onFilterSiteChange"
            class="form-select form-select-solid w-200px"
          >
            <option value="">All Sites</option>
            <option v-for="site in sites" :key="site.uid" :value="site.uid">
              {{ site.name }}
            </option>
          </select>
        </div>

        <!-- search and add button moved below the form to align with pagination/per-page select -->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!--begin::Form Modal-->
      <div v-if="showNvrForm" class="mb-10">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ isEdit ? "Edit NVR" : "Add NVR" }}</h3>
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
            <form @submit.prevent="saveNvr" class="form">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Site</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="nvrForm.siteId"
                    @change="onSiteChange"
                    class="form-select form-select-solid"
                    required
                  >
                    <option value="">Select Site</option>
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
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Room</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="nvrForm.roomId"
                    class="form-select form-select-solid"
                  >
                    <option value="">Select Room</option>
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
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">NVR Name</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.name"
                    class="form-control form-control-solid"
                    placeholder="Enter NVR name"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2"
                    >Endpoint URL</label
                  >
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.public_endpoint_url"
                    class="form-control form-control-solid"
                    placeholder="192.168.1.100"
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
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Type</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="nvrForm.recorder_type"
                    class="form-select form-select-solid"
                    required
                  >
                    <option value="NVR">NVR</option>
                    <option value="DVR">DVR</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Brand</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select
                    v-model="nvrForm.brand"
                    class="form-select form-select-solid"
                    required
                  >
                    <option value="">Select Brand</option>
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Uniview">Uniview</option>
                    <option value="Tiandy">Tiandy</option>
                    <option value="Other">Other</option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Model</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.model"
                    class="form-control form-control-solid"
                    placeholder="Model number"
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
                  <label class="required fw-semibold fs-6 mb-2">Username</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.username"
                    class="form-control form-control-solid"
                    placeholder="Username"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Password</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="password"
                    v-model="nvrForm.password"
                    class="form-control form-control-solid"
                    placeholder="Password"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Port</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="number"
                    v-model="nvrForm.port"
                    class="form-control form-control-solid"
                    placeholder="8000"
                    min="1"
                    max="65535"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Channels</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="number"
                    v-model="nvrForm.channels"
                    class="form-control form-control-solid"
                    placeholder="16"
                    min="1"
                    max="64"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Status</label>
                  <!--end::Label-->
                  <select v-model="nvrForm.is_active" class="form-select form-select-solid">
                    <option :value="true">Active</option>
                    <option :value="false">Inactive</option>
                  </select>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="indicator-progress">
                    Please wait...
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                  <span v-else class="indicator-label">
                    {{ isEdit ? "Update NVR" : "Save NVR" }}
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
          <span class="me-2">Items:</span>
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
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control form-control-solid w-250px ps-12"
              placeholder="Search NVRs..."
            />
          </div>

          <div>
            <button
              class="btn btn-sm btn-light-primary"
              @click="showNvrForm = true"
            >
              <i class="ki-duotone ki-plus fs-2 me-1"></i>
              Add NVR
            </button>
          </div>
        </div>
      </div>

      <!--begin::Table-->
      <KTDataTable
        :data="filteredAndSortedNvrs"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="perPage"
        :loading="isLoading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No NVRs found"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-warning text-warning fw-bold">
                <i class="ki-duotone ki-router fs-2">
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
                row.public_endpoint_url
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:location="{ row }">
          <div>
            <span class="text-dark fw-bold d-block fs-6">{{
              getSiteName(row.site_uid)
            }}</span>
            <span class="text-muted fw-semibold d-block fs-7">{{
              getRoomName(row.roomId)
            }}</span>
          </div>
        </template>

        <template v-slot:brand="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{
            row.brand
          }}</span>
        </template>

        <template v-slot:channels="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.channels }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span
            :class="`badge badge-light-${
              row.is_active ? 'success' : 'danger'
            } fs-7 fw-bold`"
          >
            {{ row.is_active ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <router-link
              :to="`/controlplane/site/camera?nvrId=${row.uid}`"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              title="Manage Cameras"
            >
              <i class="ki-duotone ki-picture fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editNvr(row)"
              title="Edit NVR"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteNvr(row.uid)"
              title="Delete NVR"
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
          :total-items="totalItems"
          :total-pages="totalPages"
          @page-change="onPageChange"
          @per-page-change="onPerPageChange"
        />
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::NVR Management-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import Pagination from '@/components/common/Pagination.vue';
import ApiService from '@/core/services/ApiService';

// Interfaces
interface Site {
  uid: string;
  name: string;
  team_uid?: string;
}

interface Room {
  id: number;
  siteId: string;
  name: string;
}

interface Nvr {
  uid: string; // video_recorder uid from backend
  site_uid: string;
  site_name?: string;
  roomId: number;
  name: string;
  public_endpoint_url: string;
  recorder_type: "NVR" | "DVR" | "HYBRID";
  brand: string;
  model?: string;
  port: number;
  channels: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: { username: string; email: string };
}

interface NvrForm {
  uid?: string;
  siteId: string; // site uid
  roomId: number | string;
  name: string;
  public_endpoint_url: string;
  recorder_type: "NVR" | "DVR" | "HYBRID";
  brand: string;
  model?: string;
  username: string;
  password: string;
  port: number;
  channels: number;
  is_active?: boolean;
}

// Router
const route = useRoute();

// Reactive data
const isLoading = ref(false);
const showNvrForm = ref(false);
const isEdit = ref(false);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

const sites = ref<Site[]>([]);
const rooms = ref<Room[]>([]);
const nvrs = ref<Nvr[]>([]);
const selectedSiteFilter = ref<string>("");

// Pagination state
const currentPage = ref<number>(1);
const perPage = ref<number>(10);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);

const nvrForm = ref<NvrForm>({
  siteId: "",
  roomId: "",
  name: "",
  public_endpoint_url: "",
  recorder_type: "NVR",
  brand: "",
  model: "",
  username: "admin",
  password: "",
  port: 8000,
  channels: 16,
  is_active: true,
});

// Table header configuration
const tableHeader = ref([
  {
    columnName: "NVR Name",
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Location",
    columnLabel: "location",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Brand",
    columnLabel: "brand",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Channels",
    columnLabel: "channels",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Actions",
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Computed
const availableRooms = computed(() => {
  if (!nvrForm.value.siteId) return [];
  return rooms.value.filter(
    (room) => room.siteId === nvrForm.value.siteId
  );
});

const filteredAndSortedNvrs = computed(() => {
  let filtered = nvrs.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (nvr) =>
        nvr.name.toLowerCase().includes(q) ||
        nvr.public_endpoint_url.includes(q) ||
        nvr.brand.toLowerCase().includes(q) ||
        getSiteName(nvr.site_uid).toLowerCase().includes(q) ||
        getRoomName(nvr.roomId).toLowerCase().includes(q)
    );
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const getValue = (item: Nvr, label: string) => {
        if (label === "location") return getSiteName((item as any).site_uid);
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
const getSiteName = (siteId: string): string => {
  const site = sites.value.find((s) => s.uid === siteId);
  return site ? site.name : "Unknown Site";
};

const getRoomName = (roomId: number): string => {
  const room = rooms.value.find((r) => r.id === roomId);
  return room ? room.name : "Unknown Room";
};

const onSiteChange = () => {
  nvrForm.value.roomId = "";
  // refresh table for the selected site
  if (nvrForm.value.siteId) loadNvrs(nvrForm.value.siteId);
};

const onFilterSiteChange = () => {
  // update the form site selection as well so Add/Edit form uses same site
  nvrForm.value.siteId = selectedSiteFilter.value;
  // reset to first page
  currentPage.value = 1;
  // fetch NVRs for the selected site filter
  loadNvrs(selectedSiteFilter.value || undefined, currentPage.value, perPage.value);
};

const onPerPageChange = () => {
  currentPage.value = 1;
  loadNvrs(selectedSiteFilter.value || undefined, currentPage.value, perPage.value);
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  loadNvrs(selectedSiteFilter.value || undefined, currentPage.value, perPage.value);
};

const loadSites = async () => {
  try {
    // Prefer team-scoped sites when team is available, otherwise fetch all sites
    const selectedTeamId = (localStorage.getItem('lastSelectedTeam') as string) || (route.query.teamId as string) || '';
    let resp: any = null;
    if (selectedTeamId) {
      resp = await ApiService.query(`teams/${encodeURIComponent(selectedTeamId)}/sites`, {});
    } else {
      // fallback to global sites list
      resp = await ApiService.query('sites', {});
    }

    // Normalize response shapes: resp.data.data | resp.data | items | sites | results
    const raw = resp?.data?.data ?? resp?.data ?? [];
    let data: any[] = [];
    if (Array.isArray(raw)) data = raw;
    else if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.items)) data = raw.items;
      else if (Array.isArray(raw.sites)) data = raw.sites;
      else if (Array.isArray(raw.results)) data = raw.results;
      else data = [raw];
    }

    sites.value = data.map((s: any) => ({ uid: s.uid ?? s.id, name: s.name ?? s.title ?? '' }));

    // Initialize selected site filter: route > lastSelectedSite > first site
    const fromRoute = (route.query.siteId as string) || '';
    const fromStorage = localStorage.getItem('lastSelectedSite') || '';
    selectedSiteFilter.value = fromRoute || fromStorage || (sites.value[0] ? sites.value[0].uid : '');

    if (selectedSiteFilter.value) {
      // persist selection
      localStorage.setItem('lastSelectedSite', selectedSiteFilter.value);
      // load NVRs for selected site
      await loadNvrs(selectedSiteFilter.value, currentPage.value, perPage.value);
    } else {
      // no sites available
      nvrs.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Error loading sites:', error);
    sites.value = [];
  }
};

const loadRooms = async () => {
  // Mock data - these should come from API based on sites
  rooms.value = [
    { id: 1, siteId: "site-1", name: "Reception" },
    { id: 2, siteId: "site-1", name: "Conference Room A" },
    { id: 3, siteId: "site-2", name: "Storage Area" },
  ];
};

const loadNvrs = async (siteUid?: string, pageArg?: number, perPageArg?: number) => {
  isLoading.value = true;

  try {
    // Determine which site to fetch video recorders for
    const selectedSite = siteUid || selectedSiteFilter.value || localStorage.getItem('lastSelectedSite') || (route.query.siteId as string) || (sites.value[0] && sites.value[0].uid);
    if (!selectedSite) {
      // nothing to fetch
      nvrs.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
      return;
    }

    // use provided pagination args or current state
    const pageToUse = pageArg ?? currentPage.value ?? 1;
    const perPageToUse = perPageArg ?? perPage.value ?? 10;

    // Save current
    currentPage.value = pageToUse;
    perPage.value = perPageToUse;

    const resp = await ApiService.query(`sites/${selectedSite}/video-recorders`, { params: { page: pageToUse, page_size: perPageToUse } });
    if (resp && resp.data) {
      const list = resp.data.data && Array.isArray(resp.data.data) ? resp.data.data : Array.isArray(resp.data) ? resp.data : [];

      // pagination from response
      const pagination = resp.data.pagination || resp.data.meta || null;
      if (pagination) {
        totalItems.value = pagination.total_items ?? pagination.totalItems ?? 0;
        totalPages.value = pagination.total_pages ?? pagination.totalPages ?? Math.max(1, Math.ceil(totalItems.value / perPageToUse));
      } else {
        totalItems.value = list.length;
        totalPages.value = Math.max(1, Math.ceil(totalItems.value / perPageToUse));
      }

      nvrs.value = list.map((it: any) => ({
        uid: it.uid,
        site_uid: it.site_uid,
        site_name: it.site_name,
        roomId: it.room_id ?? it.roomId ?? 0,
        name: it.name,
        public_endpoint_url: it.public_endpoint_url,
        recorder_type: it.recorder_type,
        brand: it.brand,
        model: it.model,
        port: it.port,
        channels: it.channels,
        is_active: !!(typeof it.is_active !== 'undefined' ? it.is_active : (typeof it.isActive !== 'undefined' ? it.isActive : true)),
        created_at: it.created_at,
        updated_at: it.updated_at,
        created_by: it.created_by,
      }));
    } else {
      nvrs.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
    }
  } catch (error) {
    console.error("Error loading NVRs:", error);
    nvrs.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const saveNvr = async () => {
  isLoading.value = true;

  try {
    // Build payload for backend API
    const payload = {
      name: nvrForm.value.name,
      public_endpoint_url: nvrForm.value.public_endpoint_url,
      recorder_type: nvrForm.value.recorder_type,
      brand: nvrForm.value.brand,
      model: nvrForm.value.model,
      port: nvrForm.value.port,
      channels: nvrForm.value.channels,
    };

    if (isEdit.value) {
      // Update existing NVR via PATCH using video_recorder_uid
      const resp = await ApiService.patch(`video-recorders/${nvrForm.value.uid}`, { ...payload, is_active: !!nvrForm.value.is_active });
      // Update local list by uid
      const index = nvrs.value.findIndex((n) => n.uid === nvrForm.value.uid);
      if (index !== -1) {
        nvrs.value[index] = {
          ...nvrs.value[index],
          ...payload,
          site_uid: nvrForm.value.siteId,
          roomId: Number(nvrForm.value.roomId),
          is_active: !!nvrForm.value.is_active,
        };
      }
    } else {
      // Create new NVR via POST using site_uid
      const resp = await ApiService.post(`sites/${nvrForm.value.siteId}/video-recorders`, { ...payload, is_active: !!nvrForm.value.is_active });
      const returned = resp && resp.data && resp.data.data ? resp.data.data : resp.data;

      // Add to local list using backend's uid if present
      const newNvr: Nvr = {
        uid: returned?.uid || String(Date.now()),
        site_uid: nvrForm.value.siteId,
        site_name: sites.value.find(s => s.uid === nvrForm.value.siteId)?.name,
        roomId: Number(nvrForm.value.roomId),
        name: nvrForm.value.name,
        public_endpoint_url: nvrForm.value.public_endpoint_url,
        recorder_type: nvrForm.value.recorder_type,
        brand: nvrForm.value.brand,
        model: nvrForm.value.model,
        port: nvrForm.value.port,
        channels: nvrForm.value.channels,
        is_active: !!nvrForm.value.is_active,
        created_at: new Date().toISOString().split("T")[0],
      };
      nvrs.value.unshift(newNvr);
    }

    closeForm();
  } catch (error) {
    console.error("Error saving NVR:", error);
  } finally {
    isLoading.value = false;
  }
};

const editNvr = async (nvr: Nvr) => {
  isLoading.value = true;
  try {
    // Fetch latest data for this video recorder from backend
    const resp = await ApiService.query(`video-recorders/${nvr.uid}`, {});
    const body = resp && resp.data && (resp.data.data || resp.data) ? (resp.data.data || resp.data) : null;

    const source = body || nvr;

    nvrForm.value = {
      uid: source.uid,
      siteId: source.site_uid || source.siteId || "",
      roomId: source.room_id ?? source.roomId ?? "",
      name: source.name || "",
      public_endpoint_url: source.public_endpoint_url || source.publicEndpointUrl || "",
      recorder_type: source.recorder_type || source.recorderType || "NVR",
      brand: source.brand || "",
      model: source.model || "",
      username: source.username || null,
      password: source.password || null,
      port: source.port ?? 8000,
      channels: source.channels ?? 16,
      is_active: typeof source.is_active !== 'undefined' ? !!source.is_active : (typeof source.isActive !== 'undefined' ? !!source.isActive : true),
    };

    isEdit.value = true;
    showNvrForm.value = true;
  } catch (error) {
    console.error('Error fetching NVR details:', error);
    // fallback to provided nvr object
    nvrForm.value = {
      uid: nvr.uid,
      siteId: nvr.site_uid,
      roomId: nvr.roomId,
      name: nvr.name,
      public_endpoint_url: nvr.public_endpoint_url,
      recorder_type: nvr.recorder_type,
      brand: nvr.brand,
      model: nvr.model,
      username: 'admin',
      password: '',
      port: nvr.port,
      channels: nvr.channels,
      is_active: typeof nvr.is_active !== 'undefined' ? nvr.is_active : true,
    };
    isEdit.value = true;
    showNvrForm.value = true;
  } finally {
    isLoading.value = false;
  }
};

const deleteNvr = async (nvrUid: string) => {
  if (!confirm("Are you sure you want to delete this NVR?")) return;

  isLoading.value = true;

  try {
    // DELETE using video-recorders/{video_recorder_uid}
    console.log('Deleting NVR UID:', nvrUid);
    await ApiService.delete(`video-recorders/${nvrUid}`);

    // Remove NVR from local state
    nvrs.value = nvrs.value.filter((n) => n.uid !== nvrUid);
  } catch (error) {
    console.error("Error deleting NVR:", error);
  } finally {
    isLoading.value = false;
  }
};

const closeForm = () => {
  showNvrForm.value = false;
  isEdit.value = false;
  nvrForm.value = {
    siteId: "",
    roomId: "",
    name: "",
    public_endpoint_url: "",
    recorder_type: "NVR",
    brand: "",
    model: "",
    username: "admin",
    password: "",
    port: 8000,
    channels: 16,
    is_active: true,
  };
};

// Lifecycle
onMounted(() => {
  (async () => {
    await loadSites();
  await loadRooms();

  // initialize selected site filter from lastSelectedSite / route query or first site
  selectedSiteFilter.value = (localStorage.getItem('lastSelectedSite') as string) || (route.query.siteId as string) || (sites.value[0] && sites.value[0].uid) || "";
  if (selectedSiteFilter.value) nvrForm.value.siteId = selectedSiteFilter.value;

  // After sites are loaded, fetch NVRs for the selected site filter
  await loadNvrs(selectedSiteFilter.value || undefined);

    // Pre-select room if coming from room overview
    if (route.query.roomId) {
      const roomId = Number(route.query.roomId);
      const room = rooms.value.find((r) => r.id === roomId);
      if (room) {
        nvrForm.value.siteId = room.siteId;
        nvrForm.value.roomId = roomId;
      }
    }
  })();
});
</script>
