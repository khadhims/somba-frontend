<template>
  <!--begin::Account Overview-->
  <!--begin::Organization Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h4 class="card-title mb-0">
            {{ t("controlplane.account.header.title") }}
          </h4>
          <p class="text-muted mb-0">
            <span v-if="loadingOrganizations">{{
              t("controlplane.account.header.subtitleLoading")
            }}</span>
            <span v-else-if="currentOrganization">{{
              t("controlplane.account.header.subtitleWithOrganization", {
                name: currentOrganization.name,
              })
            }}</span>
            <span v-else-if="organizations.length === 0">{{
              t("controlplane.account.header.subtitleNoOrganizations")
            }}</span>
            <span v-else>{{
              t("controlplane.account.header.subtitleSelect")
            }}</span>
          </p>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end">
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold"
                >{{
                  t("controlplane.account.filters.organizationLabel")
                }}:</label
              >
              <select
                v-model="selectedOrganizationId"
                @change="switchOrganization"
                class="form-select form-select-solid w-200px"
                :disabled="loadingOrganizations"
              >
                <option value="" disabled>
                  {{
                    loadingOrganizations
                      ? t("controlplane.account.filters.organizationLoading")
                      : t(
                          "controlplane.account.filters.organizationPlaceholder"
                        )
                  }}
                </option>
                <option
                  v-for="org in organizations"
                  :key="org.uid"
                  :value="org.uid"
                >
                  {{ org.name }}
                </option>
              </select>

              <!-- Loading spinner -->
              <div v-if="loadingOrganizations" class="ms-2">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span class="visually-hidden">{{
                    t("controlplane.account.filters.organizationLoading")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization Switcher-->

  <!--begin::Error Alert-->
  <div v-if="error" class="alert alert-danger d-flex align-items-center mb-5">
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="d-flex flex-column">
      <h5 class="mb-1">{{ t("controlplane.account.error.title") }}</h5>
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
    <strong>Debug Info:</strong><br />
    Loading Organizations: {{ loadingOrganizations }}<br />
    Organizations count: {{ organizations.length }}<br />
    Selected Organization ID: {{ selectedOrganizationId }}<br />
    Current Organization: {{ currentOrganization?.name }}<br />
    Organizations:
    {{
      JSON.stringify(
        organizations.map((o) => ({ uid: o.uid, name: o.name })),
        null,
        2
      )
    }}
  </div>

  <!--begin::Accounts List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">
          {{ t("controlplane.account.toolbar.title") }}
        </h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">{{
            t("controlplane.account.toolbar.itemsLabel")
          }}</label>
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
            :placeholder="t('controlplane.account.toolbar.searchPlaceholder')"
          />
        </div>
        <!--end::Search-->

        <button
          v-if="error"
          @click="fetchAccounts(pagination.page)"
          class="btn btn-sm btn-light-warning me-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          <i v-else class="ki-duotone ki-arrows-circle fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{
            loading
              ? t("controlplane.account.toolbar.retrying")
              : t("controlplane.account.toolbar.retry")
          }}
        </button>

        <button
          @click="showAddAccountModal"
          class="btn btn-sm btn-light-primary"
          :disabled="loading || loadingOrganizations || !selectedOrganizationId"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.account.toolbar.addButton") }}
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!-- Show message when no organization is selected -->
      <div
        v-if="!selectedOrganizationId && !loadingOrganizations"
        class="d-flex flex-column align-items-center justify-content-center py-10"
      >
        <div class="text-center">
          <i class="ki-duotone ki-questionnaire-tablet fs-4x text-muted mb-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <h3 class="fw-semibold text-gray-500 mb-2">
            {{ t("controlplane.account.emptyState.title") }}
          </h3>
          <p class="text-muted fs-6">
            {{ t("controlplane.account.emptyState.description") }}
          </p>
        </div>
      </div>

      <!-- Show table when organization is selected -->
      <KTDataTable
        v-else
        :data="filteredAndSortedAccounts"
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
        @on-items-per-page-change="
          (val) => {
            pagination.per_page = val;
            changeItemsPerPage();
          }
        "
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
            </div>
          </div>
        </template>

        <template v-slot:created_by="{ row }">
          <span class="text-dark fw-bold d-block fs-6">
            {{
              row.created_by?.username ||
              t("controlplane.account.common.unknown")
            }}
          </span>
          <span class="text-muted fw-semibold text-muted d-block fs-7">
            {{ row.created_by?.email || "" }}
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
              @click="showAccountMembers(row)"
              :title="t('controlplane.account.actions.viewMembers')"
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
              :to="{
                name: 'team-overview',
                query: { orgId: selectedOrganizationId, accountId: row.uid },
              }"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              :title="t('controlplane.account.actions.addTeam')"
            >
              <i class="ki-duotone ki-profile-user fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editAccount(row)"
              :title="t('controlplane.account.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteAccount(row)"
              :title="t('controlplane.account.actions.delete')"
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
        :total-items="pagination.total_items || accounts.length"
        :total-pages="Math.max(1, pagination.total_pages)"
        @page-change="goToPage"
      />
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Accounts List-->

  <!-- Add Account Modal -->
  <div class="modal fade" id="addAccountModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("controlplane.account.modals.add.title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="createAccount">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">{{
                  t("controlplane.account.modals.add.nameLabel")
                }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newAccount.name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ t("controlplane.account.modals.add.cancel") }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span
                v-if="creating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ t("controlplane.account.modals.add.submit") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    class="modal fade"
    id="deleteAccountModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("controlplane.account.modals.delete.title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            {{ t("controlplane.account.modals.delete.confirmPrefix") }}
            <strong>{{ accountToDelete?.name }}</strong
            >{{ t("controlplane.account.modals.delete.confirmSuffix") }}
          </p>
          <p class="text-muted">
            {{ t("controlplane.account.modals.delete.warning") }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            {{ t("controlplane.account.modals.delete.cancel") }}
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
            {{ t("controlplane.account.modals.delete.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Account Modal -->
  <div
    class="modal fade"
    id="editAccountModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("controlplane.account.modals.edit.title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="accountToEdit = null"
          ></button>
        </div>
        <form @submit.prevent="updateAccount" v-if="accountToEdit">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">{{
                  t("controlplane.account.modals.edit.nameLabel")
                }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="accountToEdit.name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
              @click="accountToEdit = null"
            >
              {{ t("controlplane.account.modals.edit.cancel") }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="editing">
              <span
                v-if="editing"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ t("controlplane.account.modals.edit.submit") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Account Membership Modal -->
  <MembershipListModal
    ref="accountMembershipModalRef"
    entity-type="account"
    :entity-uid="selectedAccountUid"
    modal-id="accountMembershipModal"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: "OverviewComponent",
});

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { Modal } from "bootstrap";
// import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import Pagination from "@/components/common/Pagination.vue";
import MembershipListModal from "@/components/modals/membership/MembershipListModal.vue";

// Interface definitions
interface Account {
  uid: string;
  name: string;
  organization_uid?: string;
  created_by?: {
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

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
const accounts = ref<Account[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

// Pagination state
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null as number | null,
  prev_page: null as number | null,
});

// Organization-related reactive data
const organizations = ref<Organization[]>([]);
const loadingOrganizations = ref(false);
const selectedOrganizationId = ref("");
const currentOrganization = ref<Organization | null>(null);

// Modal states
const creating = ref(false);
const deleting = ref(false);
const editing = ref(false);
const newAccount = ref<Partial<Account>>({
  name: "",
});
const accountToEdit = ref<Account | null>(null);
const accountToDelete = ref<Account | null>(null);

// Modal references
const accountMembershipModalRef = ref();
const selectedAccountUid = ref("");

const { t } = useI18n();

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("controlplane.account.table.accountName"),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.account.table.createdBy"),
    columnLabel: "created_by",
    sortEnabled: false,
    searchable: false,
  },
  {
    columnName: t("controlplane.account.table.createdAt"),
    columnLabel: "created_at",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("controlplane.account.table.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

const emptyTableMessage = computed(() => {
  if (loadingOrganizations.value) {
    return t("controlplane.account.filters.organizationLoading");
  }
  if (!selectedOrganizationId.value) {
    return t("controlplane.account.empty.selectOrganization");
  }
  if (loading.value) {
    return t("controlplane.account.empty.loading");
  }
  if (searchQuery.value.trim()) {
    return t("controlplane.account.empty.searchNoResults", {
      query: searchQuery.value,
    });
  }
  return t("controlplane.account.empty.noResults");
});

// Fetch accounts from API
const fetchAccounts = async (page: number = 1) => {
  if (!selectedOrganizationId.value) return;

  loading.value = true;
  error.value = null;
  try {
    console.log(
      "🚀 Fetching accounts for organization:",
      selectedOrganizationId.value,
      { page, per_page: pagination.value.per_page }
    );
    // Send both page_size (server) and per_page (client) for compatibility
    const resp = await ApiService.query(
      `organizations/${selectedOrganizationId.value}/accounts`,
      {
        params: {
          page,
          page_size: pagination.value.per_page,
          per_page: pagination.value.per_page,
        },
      }
    );
    console.log("📡 Full API Response:", resp);

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found accounts in data array:", resp.data.data);
        accounts.value = resp.data.data;

        // Update pagination info but preserve user-selected per_page
        if (resp.data.pagination) {
          const currentPerPage = pagination.value.per_page; // Preserve user's choice
          const totalItems =
            resp.data.pagination.total_items ?? accounts.value.length;
          const recalculatedTotalPages = Math.max(
            1,
            Math.ceil(totalItems / (currentPerPage || 1))
          );

          pagination.value = {
            ...resp.data.pagination,
            page: page,
            per_page: currentPerPage, // Keep user's selected per_page
            total_pages: recalculatedTotalPages, // Recalculate based on user's per_page
            total_items: totalItems,
            next_page: page < recalculatedTotalPages ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
          };
        }

        // Format created_at for each account
        accounts.value.forEach((account) => {
          if (account.created_at && typeof account.created_at === "string") {
            account.created_at = new Date(
              account.created_at
            ).toLocaleDateString();
          }
        });

        // Ensure pagination.total_pages consistent with per_page and total_items
        if (pagination.value.total_items == null) {
          pagination.value.total_items = accounts.value.length;
        }
        pagination.value.total_pages = Math.max(
          1,
          Math.ceil(
            (pagination.value.total_items || 0) /
              (pagination.value.per_page || 1)
          )
        );
        pagination.value.next_page =
          pagination.value.page < pagination.value.total_pages
            ? pagination.value.page + 1
            : null;
        pagination.value.prev_page =
          pagination.value.page > 1 ? pagination.value.page - 1 : null;

        console.log("🎯 Final accounts:", accounts.value);
        console.log("📄 Pagination:", pagination.value);
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found accounts in direct data array:", resp.data);
        accounts.value = resp.data;

        // Calculate pagination manually if server doesn't provide it
        const totalItems = accounts.value.length;
        const totalPages = Math.ceil(totalItems / pagination.value.per_page);
        pagination.value = {
          page: page,
          per_page: pagination.value.per_page,
          total_pages: totalPages,
          total_items: totalItems,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
        };

        // Format created_at for each account
        accounts.value.forEach((account) => {
          if (account.created_at && typeof account.created_at === "string") {
            account.created_at = new Date(
              account.created_at
            ).toLocaleDateString();
          }
        });
      } else {
        console.log("⚠️ Unexpected data format:", resp.data);
        accounts.value = [];
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
    console.error("💥 Error fetching accounts:", e);
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.account.error.loadFailed");
  } finally {
    loading.value = false;
  }
};

// Computed properties for summary statistics
// const totalAccounts = computed(() => accounts.value.length);
// const activeAccounts = computed(() => accounts.value.length); // All accounts are considered active for now
// const activeAccountsPercentage = computed(() => 100); // All accounts are active

// Mock data for other stats (replace with actual API calls)
const totalUsers = computed(() =>
  accounts.value.reduce((sum) => sum + Math.floor(Math.random() * 50) + 10, 0)
);
// const activeUsers = computed(() => Math.floor(totalUsers.value * 0.8));
// const activeUsersPercentage = computed(() =>
//   totalUsers.value > 0
//     ? Math.round((activeUsers.value / totalUsers.value) * 100)
//     : 0
// );

const totalProjects = computed(() =>
  accounts.value.reduce((sum) => sum + Math.floor(Math.random() * 20) + 5, 0)
);
// const activeProjects = computed(() => Math.floor(totalProjects.value * 0.7));
// const activeProjectsPercentage = computed(() =>
//   totalProjects.value > 0
//     ? Math.round((activeProjects.value / totalProjects.value) * 100)
//     : 0
// );

// const totalRevenue = computed(
//   () => `$${(accounts.value.length * 15000).toLocaleString()}`
// );
// const revenueGrowth = computed(() => 75); // Mock percentage

// Search and Sort functionality
const filteredAndSortedAccounts = computed(() => {
  let filtered = accounts.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((account) =>
      account.name.toLowerCase().includes(query)
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Account];
      const bValue = b[sortLabel.value as keyof Account];

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

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchAccounts(page);
  }
};

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchAccounts(1);
};

// const visiblePages = computed((): number[] => {
//   const current = pagination.value.page;
//   const total = Math.max(1, pagination.value.total_pages);
//   const pages: number[] = [];
//
// Show max 5 page numbers
//   const maxVisible = 5;
//   let start = Math.max(1, current - Math.floor(maxVisible / 2));
//   let end = Math.min(total, start + maxVisible - 1);
//
// Adjust start if we're near the end
//   if (end - start + 1 < maxVisible) {
//     start = Math.max(1, end - maxVisible + 1);
//   }
//
//   for (let i = start; i <= end; i++) {
//     pages.push(i);
//   }
//
//   return pages;
// });

const showAddAccountModal = () => {
  // Reset form
  newAccount.value = {
    name: "",
  };
  // Show modal using Bootstrap
  const modal = document.getElementById("addAccountModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const createAccount = async () => {
  if (!newAccount.value.name) return;

  // Include organization context if selected
  const accountData = {
    ...newAccount.value,
  };

  creating.value = true;
  try {
    const resp = await ApiService.post(
      `organizations/${selectedOrganizationId.value}/accounts`,
      accountData
    );
    if (resp && resp.data) {
      // Refresh the accounts list
      await fetchAccounts(pagination.value.page);

      // Hide modal
      const modal = document.getElementById("addAccountModal");
      if (modal) {
        const bsModal = Modal.getInstance(modal);
        bsModal?.hide();
      }
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.account.error.createFailed");
  } finally {
    creating.value = false;
  }
};

const deleteAccount = (account: Account) => {
  accountToDelete.value = account;
  // Show delete confirmation modal
  const modal = document.getElementById("deleteAccountModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const confirmDelete = async () => {
  if (!accountToDelete.value) return;

  deleting.value = true;
  try {
    await ApiService.delete(`accounts/${accountToDelete.value.uid}`);

    // Refresh the accounts list
    await fetchAccounts(pagination.value.page);

    // Hide modal
    const modal = document.getElementById("deleteAccountModal");
    if (modal) {
      const bsModal = Modal.getInstance(modal);
      bsModal?.hide();
    }
    accountToDelete.value = null;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.account.error.deleteFailed");
  } finally {
    deleting.value = false;
  }
};

const editAccount = (account: Account) => {
  accountToEdit.value = { ...account }; // Create a copy to avoid direct mutation
  // Show edit modal using Bootstrap
  const modal = document.getElementById("editAccountModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const updateAccount = async () => {
  if (!accountToEdit.value || !accountToEdit.value.name?.trim()) return;

  editing.value = true;
  try {
    const resp = await ApiService.patch(`accounts/${accountToEdit.value.uid}`, {
      name: accountToEdit.value.name,
    });
    if (resp && resp.data) {
      // Refresh the accounts list
      await fetchAccounts(pagination.value.page);

      // Hide modal
      const modal = document.getElementById("editAccountModal");
      if (modal) {
        const bsModal = Modal.getInstance(modal);
        bsModal?.hide();
      }
      accountToEdit.value = null;
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.account.error.updateFailed");
  } finally {
    editing.value = false;
  }
};

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

const showAccountMembers = (account: Account) => {
  selectedAccountUid.value = account.uid;
  accountMembershipModalRef.value?.showModal();
};

// Get route instance to read query parameters
const route = useRoute();

// Organization-related functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem("lastSelectedOrganization", orgId);
};

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem("lastSelectedOrganization");
};

const fetchOrganizations = async () => {
  loadingOrganizations.value = true;
  try {
    console.log("🚀 Fetching organizations...");
    const resp = await ApiService.query("organizations", {
      /* empty */
    });
    console.log("📡 Organizations API Response:", resp);

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found organizations in data array:", resp.data.data);
        organizations.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found organizations in direct data array:", resp.data);
        organizations.value = resp.data;
      } else {
        console.log("⚠️ Unexpected organizations data format:", resp.data);
        organizations.value = [];
      }

      console.log("🎯 Final organizations:", organizations.value);

      // Check if orgId is provided in URL query parameters
      const orgIdFromUrl = route.query.orgId as string;

      if (orgIdFromUrl) {
        // Find the organization by the provided orgId
        const orgFromUrl = organizations.value.find(
          (o) => o.uid === orgIdFromUrl
        );
        if (orgFromUrl) {
          selectedOrganizationId.value = orgFromUrl.uid;
          currentOrganization.value = orgFromUrl;
          // Save this as the last selected organization
          saveLastSelectedOrganization(orgFromUrl.uid);
          // Fetch accounts for the selected organization
          fetchAccounts(pagination.value.page);
        } else {
          // If orgId not found, try to use last selected organization
          const lastSelectedOrgId = loadLastSelectedOrganization();
          if (lastSelectedOrgId) {
            const lastOrg = organizations.value.find(
              (o) => o.uid === lastSelectedOrgId
            );
            if (lastOrg) {
              selectedOrganizationId.value = lastOrg.uid;
              currentOrganization.value = lastOrg;
              fetchAccounts(pagination.value.page);
            } else {
              // If last selected not found, use first organization
              selectedOrganizationId.value = organizations.value[0]?.uid || "";
              currentOrganization.value = organizations.value[0] || null;
              if (organizations.value[0]) {
                saveLastSelectedOrganization(organizations.value[0].uid);
                fetchAccounts(pagination.value.page);
              }
            }
          } else {
            // No last selected, use first organization
            selectedOrganizationId.value = organizations.value[0]?.uid || "";
            currentOrganization.value = organizations.value[0] || null;
            if (organizations.value[0]) {
              saveLastSelectedOrganization(organizations.value[0].uid);
              fetchAccounts(pagination.value.page);
            }
          }
        }
      } else if (
        !selectedOrganizationId.value &&
        organizations.value.length > 0
      ) {
        // Try to use last selected organization first
        const lastSelectedOrgId = loadLastSelectedOrganization();
        if (lastSelectedOrgId) {
          const lastOrg = organizations.value.find(
            (o) => o.uid === lastSelectedOrgId
          );
          if (lastOrg) {
            selectedOrganizationId.value = lastOrg.uid;
            currentOrganization.value = lastOrg;
          } else {
            // Last selected not found, use first organization
            selectedOrganizationId.value = organizations.value[0].uid;
            currentOrganization.value = organizations.value[0];
            saveLastSelectedOrganization(organizations.value[0].uid);
          }
        } else {
          // No last selected, use first organization
          if (organizations.value[0]) {
            selectedOrganizationId.value = organizations.value[0].uid;
            currentOrganization.value = organizations.value[0];
            saveLastSelectedOrganization(organizations.value[0].uid);
          }
        }

        // Only fetch accounts if we have a selected organization
        if (selectedOrganizationId.value) {
          fetchAccounts(pagination.value.page);
        }
      }
    }
  } catch (e: any) {
    console.error("Failed to load organizations:", e);
    error.value = t("controlplane.account.error.organizationsFailed");
  } finally {
    loadingOrganizations.value = false;
  }
};

const switchOrganization = () => {
  const org = organizations.value.find(
    (o) => o.uid === selectedOrganizationId.value
  );
  currentOrganization.value = org || null;
  console.log(
    "🔄 Switching to organization:",
    org?.name,
    "ID:",
    selectedOrganizationId.value
  );

  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value);
  }

  // Clear previous error
  error.value = null;

  // Refresh accounts for the selected organization
  if (selectedOrganizationId.value) {
    fetchAccounts(pagination.value.page);
  }
};

// Initialize
onMounted(() => {
  fetchOrganizations();
});
</script>
