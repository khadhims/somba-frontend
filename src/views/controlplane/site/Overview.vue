<template>
  <!--begin::Site Overview-->
  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'Total Sites'"
        :value="totalSites"
        :progress-text="`${activeSites} Active`"
        :progress-value="activeSitesPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Rooms'"
        :value="totalRooms"
        :progress-text="`${roomsWithCameras} with Cameras`"
        :progress-value="roomsWithCamerasPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total NVRs'"
        :value="totalNVRs"
        :progress-text="`${onlineNVRs} Online`"
        :progress-value="onlineNVRsPercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Cameras'"
        :value="totalCameras"
        :progress-text="`${activeCameras} Active`"
        :progress-value="activeCamerasPercentage"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Sites List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Sites Overview</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
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
            placeholder="Search sites..."
          />
        </div>
        <!--end::Search-->

        <button @click="showAddSiteModal" class="btn btn-sm btn-light-primary">
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Site
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedSites"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="10"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No sites found"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-primary text-primary fw-bold">
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

        <template v-slot:location="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.location }}</span>
        </template>

        <template v-slot:roomCount="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{
            row.roomCount
          }}</span>
        </template>

        <template v-slot:nvrCount="{ row }">
          <span class="badge badge-light-primary fs-7 fw-bold">{{
            row.nvrCount
          }}</span>
        </template>

        <template v-slot:cameraCount="{ row }">
          <span class="badge badge-light-warning fs-7 fw-bold">{{
            row.cameraCount
          }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span
            :class="`badge badge-light-${
              row.status === 'Active' ? 'success' : 'danger'
            } fs-7 fw-bold`"
          >
            {{ row.status }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <router-link
              :to="`/controlplane/site/room?siteId=${row.id}`"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              title="Manage Rooms"
            >
              <i class="ki-duotone ki-switch fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
              @click="editSiteDetails(row)"
              title="Edit Site"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Sites List-->

  <!-- Add Site Modal -->
  <AddSiteModal ref="addSiteModalRef" @site-added="onSiteAdded" />

  <!-- Edit Site Modal -->
  <EditSiteModal ref="editSiteModalRef" @site-updated="onSiteUpdated" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import AddSiteModal from "@/components/modals/forms/AddSiteModal.vue";
import EditSiteModal from "@/components/modals/forms/EditSiteModal.vue";

// Interface definitions
interface Site {
  id: number;
  name: string;
  description: string;
  location: string;
  roomCount: number;
  nvrCount: number;
  cameraCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

// Reactive data
const sites = ref<Site[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const addSiteModalRef = ref();
const editSiteModalRef = ref();

// Table header configuration
const tableHeader = ref([
  {
    columnName: "Site Name",
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
    columnName: "Rooms",
    columnLabel: "roomCount",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "NVRs",
    columnLabel: "nvrCount",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Cameras",
    columnLabel: "cameraCount",
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

// Mock data - replace with actual API calls
onMounted(() => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    sites.value = [
      {
        id: 1,
        name: "Main Office",
        description: "Primary office building",
        location: "Jakarta, Indonesia",
        roomCount: 25,
        nvrCount: 5,
        cameraCount: 48,
        status: "Active",
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        name: "Branch Office",
        description: "Secondary office location",
        location: "Surabaya, Indonesia",
        roomCount: 15,
        nvrCount: 3,
        cameraCount: 28,
        status: "Active",
        createdAt: "2024-02-20",
      },
      {
        id: 3,
        name: "Warehouse A",
        description: "Storage facility",
        location: "Bandung, Indonesia",
        roomCount: 8,
        nvrCount: 2,
        cameraCount: 16,
        status: "Inactive",
        createdAt: "2024-03-10",
      },
    ];
    loading.value = false;
  }, 1000);
});

// Computed properties for summary statistics
const totalSites = computed(() => sites.value.length);
const totalRooms = computed(() =>
  sites.value.reduce((sum, site) => sum + site.roomCount, 0)
);
const totalNVRs = computed(() =>
  sites.value.reduce((sum, site) => sum + site.nvrCount, 0)
);
const totalCameras = computed(() =>
  sites.value.reduce((sum, site) => sum + site.cameraCount, 0)
);

const activeSites = computed(
  () => sites.value.filter((site) => site.status === "Active").length
);
const activeSitesPercentage = computed(() =>
  totalSites.value > 0
    ? Math.round((activeSites.value / totalSites.value) * 100)
    : 0
);

const roomsWithCameras = computed(
  () => sites.value.filter((site) => site.cameraCount > 0).length
);
const roomsWithCamerasPercentage = computed(() =>
  totalSites.value > 0
    ? Math.round((roomsWithCameras.value / totalSites.value) * 100)
    : 0
);

const onlineNVRs = computed(() =>
  sites.value
    .filter((site) => site.status === "Active")
    .reduce((sum, site) => sum + site.nvrCount, 0)
);
const onlineNVRsPercentage = computed(() =>
  totalNVRs.value > 0
    ? Math.round((onlineNVRs.value / totalNVRs.value) * 100)
    : 0
);

const activeCameras = computed(() =>
  sites.value
    .filter((site) => site.status === "Active")
    .reduce((sum, site) => sum + site.cameraCount, 0)
);
const activeCamerasPercentage = computed(() =>
  totalCameras.value > 0
    ? Math.round((activeCameras.value / totalCameras.value) * 100)
    : 0
);

// Search and Sort functionality
const filteredAndSortedSites = computed(() => {
  let filtered = sites.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query) ||
        site.location.toLowerCase().includes(query) ||
        site.status.toLowerCase().includes(query)
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Site];
      const bValue = b[sortLabel.value as keyof Site];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === "asc" ? comparison : -comparison;
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortOrder.value === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  return filtered;
});

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const showAddSiteModal = () => {
  addSiteModalRef.value?.showModal();
};

const onSiteAdded = (newSite: Site) => {
  sites.value.unshift(newSite); // Add to beginning of array
  console.log("New site added:", newSite);
};

const editSiteDetails = (site: Site) => {
  editSiteModalRef.value?.showModal(site);
};

const onSiteUpdated = (updatedSite: Site) => {
  const index = sites.value.findIndex((site) => site.id === updatedSite.id);
  if (index !== -1) {
    sites.value[index] = { ...updatedSite };
    console.log("Site updated:", updatedSite);
  }
};

const viewSiteDetails = (site: Site) => {
  console.log("Viewing site details for:", site);
  // Navigate to site details or open modal
};
</script>
