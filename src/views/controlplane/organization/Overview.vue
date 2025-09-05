<template>
  <!--begin::Organization Overview-->
  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'Total Organizations'"
        :value="totalOrganizations"
        :progress-text="`${activeOrganizations} Active`"
        :progress-value="activeOrganizationsPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Users'"
        :value="totalUsers"
        :progress-text="`${activeUsers} Active`"
        :progress-value="activeUsersPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Projects'"
        :value="totalProjects"
        :progress-text="`${activeProjects} Ongoing`"
        :progress-value="activeProjectsPercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Revenue'"
        :value="totalRevenue"
        :progress-text="'This Month'"
        :progress-value="revenueGrowth"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Organizations List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Organizations Overview</h3>
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
            placeholder="Search organizations..."
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddOrganizationModal"
          class="btn btn-sm btn-light-primary"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Organization
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedOrganizations"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="10"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No organizations found"
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
                row.legalName || row.description
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:email="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.email }}</span>
        </template>

        <template v-slot:phone="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.phone }}</span>
        </template>

        <template v-slot:country="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{
            row.country
          }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span
            :class="`badge badge-light-${
              row.status === 'active' ? 'success' : 'danger'
            } fs-7 fw-bold`"
          >
            {{ row.status }}
          </span>
        </template>

        <template v-slot:created_at="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            formatDate(row.created_at)
          }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="openEditModal(row)"
              title="Edit Organization"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="viewOrganizationDetails(row)"
              title="View Details"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteOrganization(row)"
              title="Delete Organization"
            >
              <i class="ki-duotone ki-trash fs-2">
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
  <!--end::Organizations List-->

  <!-- Add Organization Modal -->
  <div
    class="modal fade"
    id="addOrganizationModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Organization</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="createOrganization">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Name *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newOrganization.name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Legal Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newOrganization.legalName"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email *</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="newOrganization.email"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="newOrganization.phone"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Website</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="newOrganization.website"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Country</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newOrganization.country"
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Address</label>
              <textarea
                class="form-control"
                v-model="newOrganization.address"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="newOrganization.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span
                v-if="creating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Create Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Edit Organization Modal -->
  <div
    class="modal fade"
    id="editOrganizationModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Organization</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="updateOrganization">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Name *</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editOrganization.name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Legal Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editOrganization.legalName"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Email *</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="editOrganization.email"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="editOrganization.phone"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Website</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="editOrganization.website"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Country</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editOrganization.country"
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Address</label>
              <textarea
                class="form-control"
                v-model="editOrganization.address"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editOrganization.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="updating">
              <span
                v-if="updating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Update Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    class="modal fade"
    id="deleteOrganizationModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Organization</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to delete
            <strong>{{ organizationToDelete?.name }}</strong
            >?
          </p>
          <p class="text-muted">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmDelete"
            :disabled="deleting"
          >
            <span
              v-if="deleting"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Modal } from "bootstrap";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// Interface definitions
interface Organization {
  uid: string;
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  country?: string;
  status?: "active" | "inactive";
  created_at: string;
  updated_at?: string;
  created_by?: {
    username: string;
    email: string;
  };
  description?: string;
}

// Reactive data
const organizations = ref<Organization[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

// Modal states
const creating = ref(false);
const updating = ref(false);
const deleting = ref(false);
const newOrganization = ref<Partial<Organization>>({
  name: "",
  legalName: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  country: "",
  status: "active",
});
const editOrganization = ref<Partial<Organization>>({});
const organizationToDelete = ref<Organization | null>(null);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "Organization Name",
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Email",
    columnLabel: "email",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Phone",
    columnLabel: "phone",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Country",
    columnLabel: "country",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Status",
    columnLabel: "status",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Created",
    columnLabel: "created_at",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: "Actions",
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Fetch organizations from API
const fetchOrganizations = async () => {
  loading.value = true;
  error.value = null;
  try {
    const resp = await ApiService.query("organizations", {});
    if (resp && resp.data) {
      organizations.value = resp.data;
      // Format created_at for each organization
      organizations.value.forEach((org) => {
        if (org.created_at && typeof org.created_at === "string") {
          org.created_at = new Date(org.created_at).toLocaleDateString();
        }
      });
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message || e.message || "Failed to load organizations";
  } finally {
    loading.value = false;
  }
};

// Computed properties for summary statistics
const totalOrganizations = computed(() => organizations.value.length);
const activeOrganizations = computed(
  () => organizations.value.filter((org) => org.status === "active").length
);
const activeOrganizationsPercentage = computed(() =>
  totalOrganizations.value > 0
    ? Math.round((activeOrganizations.value / totalOrganizations.value) * 100)
    : 0
);

// Mock data for other stats (replace with actual API calls)
const totalUsers = computed(() =>
  organizations.value.reduce(
    (sum) => sum + Math.floor(Math.random() * 50) + 10,
    0
  )
);
const activeUsers = computed(() => Math.floor(totalUsers.value * 0.8));
const activeUsersPercentage = computed(() =>
  totalUsers.value > 0
    ? Math.round((activeUsers.value / totalUsers.value) * 100)
    : 0
);

const totalProjects = computed(() =>
  organizations.value.reduce(
    (sum) => sum + Math.floor(Math.random() * 20) + 5,
    0
  )
);
const activeProjects = computed(() => Math.floor(totalProjects.value * 0.7));
const activeProjectsPercentage = computed(() =>
  totalProjects.value > 0
    ? Math.round((activeProjects.value / totalProjects.value) * 100)
    : 0
);

const totalRevenue = computed(
  () => `$${(organizations.value.length * 15000).toLocaleString()}`
);
const revenueGrowth = computed(() => 75); // Mock percentage

// Search and Sort functionality
const filteredAndSortedOrganizations = computed(() => {
  let filtered = organizations.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        (org.email && org.email.toLowerCase().includes(query)) ||
        (org.country && org.country.toLowerCase().includes(query)) ||
        (org.status && org.status.toLowerCase().includes(query))
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Organization];
      const bValue = b[sortLabel.value as keyof Organization];

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

const showAddOrganizationModal = () => {
  // Reset form
  newOrganization.value = {
    name: "",
    legalName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    country: "",
    status: "active",
  };
  // Show modal using Bootstrap
  const modal = document.getElementById("addOrganizationModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const createOrganization = async () => {
  if (!newOrganization.value.name || !newOrganization.value.email) return;

  creating.value = true;
  try {
    const resp = await ApiService.post("organizations", newOrganization.value);
    if (resp && resp.data) {
      organizations.value.unshift(resp.data);
      // Hide modal
      const modal = document.getElementById("addOrganizationModal");
      if (modal) {
        const bsModal = Modal.getInstance(modal);
        bsModal?.hide();
      }
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      "Failed to create organization";
  } finally {
    creating.value = false;
  }
};

const openEditModal = (org: Organization) => {
  editOrganization.value = { ...org };
  // Show modal
  const modal = document.getElementById("editOrganizationModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const updateOrganization = async () => {
  if (
    !editOrganization.value.uid ||
    !editOrganization.value.name ||
    !editOrganization.value.email
  )
    return;

  updating.value = true;
  try {
    const resp = await ApiService.put(
      `organizations/${editOrganization.value.uid}`,
      editOrganization.value
    );
    if (resp && resp.data) {
      const index = organizations.value.findIndex(
        (org) => org.uid === editOrganization.value.uid
      );
      if (index !== -1) {
        organizations.value[index] = resp.data;
      }
      // Hide modal
      const modal = document.getElementById("editOrganizationModal");
      if (modal) {
        const bsModal = Modal.getInstance(modal);
        bsModal?.hide();
      }
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      "Failed to update organization";
  } finally {
    updating.value = false;
  }
};

const deleteOrganization = (org: Organization) => {
  organizationToDelete.value = org;
  // Show delete confirmation modal
  const modal = document.getElementById("deleteOrganizationModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const confirmDelete = async () => {
  if (!organizationToDelete.value) return;

  deleting.value = true;
  try {
    await ApiService.delete(`organizations/${organizationToDelete.value.uid}`);
    organizations.value = organizations.value.filter(
      (org) => org.uid !== organizationToDelete.value!.uid
    );
    // Hide modal
    const modal = document.getElementById("deleteOrganizationModal");
    if (modal) {
      const bsModal = Modal.getInstance(modal);
      bsModal?.hide();
    }
    organizationToDelete.value = null;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      "Failed to delete organization";
  } finally {
    deleting.value = false;
  }
};

const viewOrganizationDetails = (org: Organization) => {
  console.log("Viewing organization details for:", org.name);
  // TODO: Navigate to details view or show modal
};

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

// Initialize
onMounted(() => {
  fetchOrganizations();
});
</script>
