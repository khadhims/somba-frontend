<template>
  <!--begin::Account Overview-->
  <!--begin::Organization Switcher-->
  <div class="mb-5 p-4" :class="cardClass">
    <div
      class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h4 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ t("controlplane.account.header.title") }}
        </h4>
        <p class="m-0 text-gray-500">
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
      <div class="flex items-center justify-end">
        <label
          class="mr-3 mb-0 shrink-0 font-semibold text-gray-700 dark:text-gray-300"
        >
          {{ t("controlplane.account.filters.organizationLabel") }}:
        </label>
        <select
          v-model="selectedOrganizationId"
          @change="switchOrganization"
          :disabled="loadingOrganizations"
          class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="" disabled>
            {{
              loadingOrganizations
                ? t("controlplane.account.filters.organizationLoading")
                : t("controlplane.account.filters.organizationPlaceholder")
            }}
          </option>
          <option v-for="org in organizations" :key="org.uid" :value="org.uid">
            {{ org.name }}
          </option>
        </select>
        <span
          v-if="loadingOrganizations"
          role="status"
          class="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
        >
          <span class="sr-only">{{
            t("controlplane.account.filters.organizationLoading")
          }}</span>
        </span>
      </div>
    </div>
  </div>
  <!--end::Organization Switcher-->

  <!--begin::Error Alert-->
  <div
    v-if="error"
    class="mb-5 flex items-start gap-4 rounded-lg border border-danger-light bg-danger-light p-4"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="flex flex-1 flex-col text-danger">
      <h5 class="m-0 mb-1 font-semibold">
        {{ t("controlplane.account.error.title") }}
      </h5>
      <span>{{ error }}</span>
    </div>
    <button
      type="button"
      @click="error = null"
      aria-label="Close"
      class="rounded-md p-1 text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger"
    >
      <i class="ki-duotone ki-cross fs-2">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
    </button>
  </div>
  <!--end::Error Alert-->

  <!--begin::Accounts List-->
  <div :class="cardClass">
    <!--begin::Card header-->
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
      <h3 class="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.account.toolbar.title") }}
      </h3>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Items per page -->
        <div class="flex items-center">
          <label
            class="mr-2 mb-0 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {{ t("controlplane.account.toolbar.itemsLabel") }}
          </label>
          <select
            v-model.number="pagination.per_page"
            @change="changeItemsPerPage"
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
          <i
            class="ki-duotone ki-magnifier fs-3 pointer-events-none absolute left-4"
          >
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('controlplane.account.toolbar.searchPlaceholder')"
            class="w-[250px] rounded-md border border-gray-300 bg-gray-100 py-2 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          v-if="error"
          @click="fetchAccounts(pagination.page)"
          :disabled="loading"
          class="inline-flex items-center gap-2 rounded-md bg-warning-light px-3 py-2 text-sm font-semibold text-warning transition-colors hover:bg-warning hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="loading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
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
          :disabled="loading || loadingOrganizations || !selectedOrganizationId"
          class="inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.account.toolbar.addButton") }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <!-- Show message when no organization is selected -->
      <div
        v-if="!selectedOrganizationId && !loadingOrganizations"
        class="flex flex-col items-center justify-center py-10 text-center"
      >
        <i class="ki-duotone ki-questionnaire-tablet fs-4x mb-4 text-gray-400">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <h3 class="mb-2 font-semibold text-gray-500">
          {{ t("controlplane.account.emptyState.title") }}
        </h3>
        <p class="text-gray-500">
          {{ t("controlplane.account.emptyState.description") }}
        </p>
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
          <div class="flex items-center">
            <InitialAvatar :name="row.name" class="mr-5" />
            <span
              class="font-bold text-gray-900 hover:text-primary dark:text-gray-100"
              >{{ row.name }}</span
            >
          </div>
        </template>

        <template v-slot:created_by="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">
            {{
              row.created_by?.username ||
              t("controlplane.account.common.unknown")
            }}
          </span>
          <span class="block text-sm text-gray-500">
            {{ row.created_by?.email || "" }}
          </span>
        </template>

        <template v-slot:created_at="{ row }">
          <span
            class="block font-bold tabular-nums text-gray-900 dark:text-gray-100"
            >{{ formatDate(row.created_at) }}</span
          >
        </template>

        <template v-slot:actions="{ row }">
          <div class="flex justify-end gap-1">
            <RowActionButton
              @click="showAccountMembers(row)"
              :title="t('controlplane.account.actions.viewMembers')"
              variant="success"
            >
              <i class="ki-duotone ki-people fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              :to="{
                name: 'team-overview',
                query: { orgId: selectedOrganizationId, accountId: row.uid },
              }"
              :title="t('controlplane.account.actions.addTeam')"
            >
              <i class="ki-duotone ki-profile-user fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              @click="editAccount(row)"
              :title="t('controlplane.account.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              @click="deleteAccount(row)"
              :title="t('controlplane.account.actions.delete')"
              variant="danger"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
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

  <!-- Add Account Dialog -->
  <dialog
    ref="addAccountDialog"
    class="m-auto w-full max-w-lg rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="addAccountDialog?.close()"
  >
    <div
      class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700"
    >
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.account.modals.add.title") }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="addAccountDialog?.close()"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="createAccount">
      <div class="p-5">
        <label
          class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >{{ t("controlplane.account.modals.add.nameLabel") }}</label
        >
        <input
          type="text"
          v-model="newAccount.name"
          required
          :class="formInputClass"
        />
      </div>
      <div
        class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700"
      >
        <button
          type="button"
          @click="addAccountDialog?.close()"
          :class="secondaryButtonClass"
        >
          {{ t("controlplane.account.modals.add.cancel") }}
        </button>
        <button
          type="submit"
          :disabled="creating"
          class="inline-flex items-center gap-2"
          :class="primaryButtonClass"
        >
          <span
            v-if="creating"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ t("controlplane.account.modals.add.submit") }}
        </button>
      </div>
    </form>
  </dialog>

  <!-- Delete Confirmation Dialog -->
  <ConfirmDialog
    ref="deleteAccountDialog"
    :title="t('controlplane.account.modals.delete.title')"
    :cancel-label="t('controlplane.account.modals.delete.cancel')"
    :confirm-label="t('controlplane.account.modals.delete.submit')"
    :loading="deleting"
    @confirm="confirmDelete"
  >
    <p>
      {{ t("controlplane.account.modals.delete.confirmPrefix") }}
      <strong>{{ accountToDelete?.name }}</strong
      >{{ t("controlplane.account.modals.delete.confirmSuffix") }}
    </p>
    <p class="text-gray-500">
      {{ t("controlplane.account.modals.delete.warning") }}
    </p>
  </ConfirmDialog>

  <!-- Edit Account Dialog -->
  <dialog
    ref="editAccountDialog"
    class="m-auto w-full max-w-lg rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="closeEditAccountDialog"
  >
    <div
      class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700"
    >
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.account.modals.edit.title") }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="closeEditAccountDialog"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="updateAccount" v-if="accountToEdit">
      <div class="p-5">
        <label
          class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >{{ t("controlplane.account.modals.edit.nameLabel") }}</label
        >
        <input
          type="text"
          v-model="accountToEdit.name"
          required
          :class="formInputClass"
        />
      </div>
      <div
        class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700"
      >
        <button
          type="button"
          @click="closeEditAccountDialog"
          :class="secondaryButtonClass"
        >
          {{ t("controlplane.account.modals.edit.cancel") }}
        </button>
        <button
          type="submit"
          :disabled="editing"
          class="inline-flex items-center gap-2"
          :class="primaryButtonClass"
        >
          <span
            v-if="editing"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ t("controlplane.account.modals.edit.submit") }}
        </button>
      </div>
    </form>
  </dialog>

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
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import Pagination from "@/components/common/Pagination.vue";
import MembershipListModal from "@/components/modals/membership/MembershipListModal.vue";
import InitialAvatar from "@/components/common/InitialAvatar.vue";
import RowActionButton from "@/components/common/RowActionButton.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import {
  cardClass,
  secondaryButtonClass,
  primaryButtonClass,
  formInputClass,
} from "@/core/helpers/badge";

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
const addAccountDialog = ref<HTMLDialogElement | null>(null);
const deleteAccountDialog = ref<InstanceType<typeof ConfirmDialog> | null>(
  null
);
const editAccountDialog = ref<HTMLDialogElement | null>(null);

const closeEditAccountDialog = () => {
  editAccountDialog.value?.close();
  accountToEdit.value = null;
};

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

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
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
      } else if (Array.isArray(resp.data)) {
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

const totalProjects = computed(() =>
  accounts.value.reduce((sum) => sum + Math.floor(Math.random() * 20) + 5, 0)
);

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

const showAddAccountModal = () => {
  // Reset form
  newAccount.value = {
    name: "",
  };
  addAccountDialog.value?.showModal();
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
      addAccountDialog.value?.close();
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
  deleteAccountDialog.value?.showModal();
};

const confirmDelete = async () => {
  if (!accountToDelete.value) return;

  deleting.value = true;
  try {
    await ApiService.delete(`accounts/${accountToDelete.value.uid}`);

    // Refresh the accounts list
    await fetchAccounts(pagination.value.page);
    deleteAccountDialog.value?.close();
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
  editAccountDialog.value?.showModal();
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
      editAccountDialog.value?.close();
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
    const resp = await ApiService.query("organizations", {
      /* empty */
    });

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        organizations.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        organizations.value = resp.data;
      } else {
        organizations.value = [];
      }

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
