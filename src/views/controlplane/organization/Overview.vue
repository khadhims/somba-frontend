<template>
  <!--begin::Organization Overview-->
  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <CardWidget1
        :description="t('controlplane.organization.summary.totalOrganizations')"
        :value="0"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <CardWidget1
        :description="t('controlplane.organization.summary.totalTeams')"
        :value="0"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <CardWidget1
        :description="t('controlplane.organization.summary.totalUsers')"
        :value="0"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <CardWidget1
        :description="t('controlplane.organization.summary.totalCameras')"
        :value="0"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Error Alert-->
  <div v-if="error" class="alert alert-danger d-flex align-items-center mb-5">
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="d-flex flex-column">
      <h5 class="mb-1">{{ t('controlplane.organization.error.title') }}</h5>
      <span>{{ error }}</span>
    </div>
    <button 
      type="button" 
      class="btn-close ms-auto" 
      @click="error = null"
      aria-label="Close"
    ></button>
  </div>
  <!--end::Error Alert-->

  <!-- Debug Info (hapus setelah debugging selesai) -->
  <div class="alert alert-info" v-if="false">
    <strong>Debug Info:</strong><br>
    Loading: {{ loading }}<br>
    Organizations count: {{ organizations.length }}<br>
    Error: {{ error }}<br>
    Pagination: {{ JSON.stringify(pagination, null, 2) }}
  </div>

  <!--begin::Organizations List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t('controlplane.organization.toolbar.title') }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">{{ t('controlplane.organization.toolbar.itemsLabel') }}</label>
          <select 
            class="form-select form-select-sm w-auto" 
            v-model.number="pagination.per_page"
            @change="changeItemsPerPage"
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
            :placeholder="t('controlplane.organization.toolbar.searchPlaceholder')"
          />
        </div>
        <!--end::Search-->

        <button
          v-if="error"
          @click="fetchOrganizations(pagination.page)"
          class="btn btn-sm btn-light-warning me-2"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="ki-duotone ki-arrows-circle fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ loading ? t('controlplane.organization.toolbar.retrying') : t('controlplane.organization.toolbar.retry') }}
        </button>

        <button
          @click="showAddOrganizationModal"
          class="btn btn-sm btn-light-primary"
          :disabled="loading"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t('controlplane.organization.toolbar.addButton') }}
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
        :items-per-page-dropdown-enabled="false"
        :items-per-page="pagination.per_page"
        :current-page="pagination.page"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        @page-change="goToPage"
        @on-items-per-page-change="(val) => { pagination.per_page = val; changeItemsPerPage(); }"
        :empty-table-text="emptyTableMessage"
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
                row.legalName || row.description || t('controlplane.organization.common.unknown')
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:email="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.email || t('controlplane.organization.common.unknown') }}</span>
        </template>

        <template v-slot:phone="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.phone || t('controlplane.organization.common.unknown') }}</span>
        </template>

        <template v-slot:country="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{
            row.country || t('controlplane.organization.common.unknown')
          }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span :class="statusBadgeClass(row.status)">
            {{ resolveStatusLabel(row.status) }}
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
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click="showOrganizationMembers(row)"
              :title="t('controlplane.organization.actions.viewMembers')"
            >
              <i class="ki-duotone ki-people fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </button>
            <router-link
              :to="{ name: 'account-overview', query: { orgId: row.uid } }"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              :title="t('controlplane.organization.actions.manageAccounts')"
            >
              <i class="ki-duotone ki-switch fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="openEditModal(row)"
              :title="t('controlplane.organization.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteOrganization(row)"
              :title="t('controlplane.organization.actions.delete')"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </template>
      </KTDataTable>
      
      <!--begin::Pagination-->
      <Pagination
        v-if="!loading"
        :page="pagination.page"
        :per-page="pagination.per_page"
        :total-items="pagination.total_items || organizations.length"
        :total-pages="Math.max(1, pagination.total_pages)"
        @page-change="goToPage"
      />
      <!--end::Pagination-->
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
          <h5 class="modal-title">{{ t('controlplane.organization.modals.add.title') }}</h5>
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
                <label class="form-label">{{ t('controlplane.organization.form.name') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newOrganization.name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.legalName') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newOrganization.legalName"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.email') }}</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="newOrganization.email"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.phone') }}</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="newOrganization.phone"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.website') }}</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="newOrganization.website"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.country') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newOrganization.country"
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">{{ t('controlplane.organization.form.address') }}</label>
              <textarea
                class="form-control"
                v-model="newOrganization.address"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">{{ t('controlplane.organization.form.status') }}</label>
              <select class="form-select" v-model="newOrganization.status">
                <option value="active">{{ t('controlplane.organization.form.statusOptions.active') }}</option>
                <option value="inactive">{{ t('controlplane.organization.form.statusOptions.inactive') }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ t('controlplane.organization.common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span
                v-if="creating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ t('controlplane.organization.modals.add.submit') }}
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
          <h5 class="modal-title">{{ t('controlplane.organization.modals.edit.title') }}</h5>
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
                <label class="form-label">{{ t('controlplane.organization.form.name') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editOrganization.name"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.legalName') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editOrganization.legalName"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.email') }}</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="editOrganization.email"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.phone') }}</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="editOrganization.phone"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.website') }}</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="editOrganization.website"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">{{ t('controlplane.organization.form.country') }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editOrganization.country"
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">{{ t('controlplane.organization.form.address') }}</label>
              <textarea
                class="form-control"
                v-model="editOrganization.address"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">{{ t('controlplane.organization.form.status') }}</label>
              <select class="form-select" v-model="editOrganization.status">
                <option value="active">{{ t('controlplane.organization.form.statusOptions.active') }}</option>
                <option value="inactive">{{ t('controlplane.organization.form.statusOptions.inactive') }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ t('controlplane.organization.common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="updating">
              <span
                v-if="updating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ t('controlplane.organization.modals.edit.submit') }}
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
          <h5 class="modal-title">{{ t('controlplane.organization.modals.delete.title') }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            {{ t('controlplane.organization.modals.delete.confirmPrefix') }}
            <strong>{{ organizationToDelete?.name }}</strong>
            {{ t('controlplane.organization.modals.delete.confirmSuffix') }}
          </p>
          <p class="text-muted">{{ t('controlplane.organization.modals.delete.warning') }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            {{ t('controlplane.organization.common.cancel') }}
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
            {{ t('controlplane.organization.modals.delete.submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Organization Membership Modal -->
  <MembershipListModal
    ref="organizationMembershipModalRef"
    entity-type="organization"
    :entity-uid="selectedOrganizationUid"
    modal-id="organizationMembershipModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import Pagination from '@/components/common/Pagination.vue'
import { Modal } from "bootstrap";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import MembershipListModal from "@/components/modals/membership/MembershipListModal.vue";
import CardWidget1 from "@/components/dashboard-default-widgets/CardWidget1.vue";
import { useI18n } from "vue-i18n";

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
  status?: "active" | "inactive" | "pending";
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

// Modal references
const organizationMembershipModalRef = ref();
const selectedOrganizationUid = ref('');

const { t } = useI18n();

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t('controlplane.organization.table.organizationName'),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.email'),
    columnLabel: "email",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.phone'),
    columnLabel: "phone",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.country'),
    columnLabel: "country",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.status'),
    columnLabel: "status",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.created'),
    columnLabel: "created_at",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('controlplane.organization.table.actions'),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

const emptyTableMessage = computed(() => {
  if (loading.value) {
    return t('controlplane.organization.empty.loading');
  }
  if (searchQuery.value.trim()) {
    return t('controlplane.organization.empty.searchNoResults', { query: searchQuery.value });
  }
  return t('controlplane.organization.empty.noResults');
});

const resolveStatusLabel = (
  status: Organization["status"] | string | undefined
): string => {
  if (status === "active" || status === "inactive" || status === "pending") {
    return t(`controlplane.organization.table.statusLabel.${status}`);
  }
  return t('controlplane.organization.common.unknown');
};

const statusBadgeClass = (
  status: Organization["status"] | string | undefined
): string => {
  if (status === "active") {
    return "badge badge-light-success fs-7 fw-bold";
  }
  if (status === "inactive") {
    return "badge badge-light-danger fs-7 fw-bold";
  }
  if (status === "pending") {
    return "badge badge-light-warning fs-7 fw-bold";
  }
  return "badge badge-light-secondary fs-7 fw-bold";
};

// Pagination state
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null as number | null,
  prev_page: null as number | null,
});

// Fetch organizations from API
const fetchOrganizations = async (page: number = 1) => {
  loading.value = true;
  error.value = null;
  try {
    console.log("🚀 Fetching organizations...", { page, per_page: pagination.value.per_page });
    // Some backends expect `page_size` instead of `per_page` (see API docs).
    // Send both for compatibility: `page_size` (server) and `per_page` (client-side/legacy)
    const resp = await ApiService.query("/organizations", {
      params: { page, page_size: pagination.value.per_page, per_page: pagination.value.per_page },
    });
    console.log("📡 Full API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found organizations in data array:", resp.data.data);
        organizations.value = resp.data.data;
        
        // Update pagination info but preserve user-selected per_page
        if (resp.data.pagination) {
          const currentPerPage = pagination.value.per_page; // Preserve user's choice
          const totalItems = resp.data.pagination.total_items ?? organizations.value.length;
          // Recalculate total_pages based on the user's per_page selection (not server's per_page field)
          const recalculatedTotalPages = Math.max(1, Math.ceil(totalItems / (currentPerPage || 1)));

          pagination.value = {
            ...resp.data.pagination,
            page: page, // ensure pagination.page matches the requested page
            per_page: currentPerPage, // Keep user's selected per_page
            total_pages: recalculatedTotalPages, // Recalculate based on user's per_page
            total_items: totalItems,
            next_page: page < recalculatedTotalPages ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
          };
        }
        
        // Format created_at for each organization
        organizations.value.forEach((org) => {
          if (org.created_at && typeof org.created_at === "string") {
            org.created_at = new Date(org.created_at).toLocaleDateString();
          }
        });
        
        // Ensure pagination.total_pages consistent with per_page and total_items
        if (pagination.value.total_items == null) {
          pagination.value.total_items = organizations.value.length;
        }
        pagination.value.total_pages = Math.max(1, Math.ceil((pagination.value.total_items || 0) / (pagination.value.per_page || 1)));
        pagination.value.next_page = pagination.value.page < pagination.value.total_pages ? pagination.value.page + 1 : null;
        pagination.value.prev_page = pagination.value.page > 1 ? pagination.value.page - 1 : null;

        console.log("🎯 Final organizations:", organizations.value);
        console.log("📄 Pagination:", pagination.value);
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found organizations in direct data array:", resp.data);
        organizations.value = resp.data;
        
        // Calculate pagination manually if server doesn't provide it
        const totalItems = organizations.value.length;
        const totalPages = Math.ceil(totalItems / pagination.value.per_page);
        pagination.value = {
          page: page,
          per_page: pagination.value.per_page,
          total_pages: totalPages,
          total_items: totalItems,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
        };
        
        // Format created_at for each organization
        organizations.value.forEach((org) => {
          if (org.created_at && typeof org.created_at === "string") {
            org.created_at = new Date(org.created_at).toLocaleDateString();
          }
        });
        
        console.log("🎯 Final organizations:", organizations.value);
        console.log("📄 Pagination:", pagination.value);
      } else {
        console.log("⚠️ Unexpected data format:", resp.data);
        organizations.value = [];
        // Reset pagination when no data
        pagination.value = {
          page: 1,
          per_page: pagination.value.per_page,
          total_pages: 1,
          total_items: 0,
          next_page: null,
          prev_page: null,
        };
      }
    }
  } catch (e: any) {
    console.error("💥 Error fetching organizations:", e);
    error.value =
      e?.response?.data?.message || e.message || t('controlplane.organization.error.loadFailed');
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

  // Apply client-side pagination if needed (when server doesn't provide paginated data)
  if (filtered.length > pagination.value.per_page) {
    const startIndex = (pagination.value.page - 1) * pagination.value.per_page;
    const endIndex = startIndex + pagination.value.per_page;
    return filtered.slice(startIndex, endIndex);
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
      // Refresh the organizations list
      await fetchOrganizations(pagination.value.page);
      
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
      t('controlplane.organization.error.createFailed');
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
    const resp = await ApiService.patch(
      `organizations/${editOrganization.value.uid}`,
      editOrganization.value
    );
    if (resp && resp.data) {
      // Refresh the organizations list
      await fetchOrganizations(pagination.value.page);
      
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
      t('controlplane.organization.error.updateFailed');
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
    
    // Refresh the organizations list
    await fetchOrganizations(pagination.value.page);
    
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
      t('controlplane.organization.error.deleteFailed');
  } finally {
    deleting.value = false;
  }
};

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

const showOrganizationMembers = (organization: Organization) => {
  console.log('showOrganizationMembers called for organization:', organization);
  selectedOrganizationUid.value = organization.uid;
  console.log('selectedOrganizationUid set to:', selectedOrganizationUid.value);
  
  // Wait a tick for Vue reactivity to update
  nextTick(() => {
    organizationMembershipModalRef.value?.showModal();
  });
};

// Pagination methods and computed properties
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchOrganizations(page);
  }
};

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchOrganizations(1);
};

const visiblePages = computed((): number[] => {
  const current = pagination.value.page;
  const total = Math.max(1, pagination.value.total_pages); // Pastikan minimal 1 halaman
  const pages: number[] = [];
  
  // Show max 5 page numbers
  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Initialize
onMounted(() => {
  fetchOrganizations();
});
</script>
