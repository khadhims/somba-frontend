<template>
  <!--begin::Site Overview-->
  <!--begin::Organization, Account & Team Switcher-->
  <div
    class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h4 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ t("siteManagement") }}
        </h4>
        <p class="m-0 text-gray-500">
          <span v-if="currentTeam">{{
            t("manageSitesForTeam", { name: currentTeam.name })
          }}</span>
          <span v-else>{{ t("manageSites") }} {{ t("forYourTeam") }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-4">
        <!-- Organization Dropdown -->
        <div class="flex items-center">
          <label class="mr-3 mb-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("organization") }}:
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
                  ? t("loadingOrganizations")
                  : t("selectOrganization")
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
          <span
            v-if="loadingOrganizations"
            role="status"
            class="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
          >
            <span class="sr-only">Loading...</span>
          </span>
        </div>

        <!-- Account Dropdown -->
        <div class="flex items-center">
          <label class="mr-3 mb-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("account") }}:
          </label>
          <select
            v-model="selectedAccountId"
            @change="switchAccount"
            :disabled="
              loadingAccounts || !selectedOrganizationId || accounts.length === 0
            "
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="" disabled>
              <span v-if="!selectedOrganizationId">{{
                t("selectOrganizationFirst")
              }}</span>
              <span v-else-if="loadingAccounts">{{ t("loadingAccounts") }}</span>
              <span v-else-if="accounts.length === 0">{{ t("noAccounts") }}</span>
              <span v-else>{{ t("selectAccount") }}</span>
            </option>
            <option
              v-for="account in accounts"
              :key="account.uid"
              :value="account.uid"
            >
              {{ account.name }}
            </option>
          </select>
          <span
            v-if="loadingAccounts"
            role="status"
            class="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
          >
            <span class="sr-only">Loading...</span>
          </span>
        </div>

        <!-- Team Dropdown -->
        <div class="flex items-center">
          <label class="mr-3 mb-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("team") }}:
          </label>
          <select
            v-model="selectedTeamId"
            @change="switchTeam"
            :disabled="loadingTeams || !selectedAccountId || teams.length === 0"
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="" disabled>
              <span v-if="!selectedAccountId">{{ t("selectAccountFirst") }}</span>
              <span v-else-if="loadingTeams">{{ t("loadingTeams") }}</span>
              <span v-else-if="teams.length === 0">{{ t("noTeams") }}</span>
              <span v-else>{{ t("selectTeam") }}</span>
            </option>
            <option v-for="team in teams" :key="team.uid" :value="team.uid">
              {{ team.name }}
            </option>
          </select>
          <span
            v-if="loadingTeams"
            role="status"
            class="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
          >
            <span class="sr-only">Loading...</span>
          </span>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization, Account & Team Switcher-->

  <!--begin::Error Alert-->
  <div
    v-if="error"
    role="alert"
    class="mb-5 flex items-start gap-4 rounded-lg border border-danger-light bg-danger-light p-4"
  >
    <i class="ki-duotone ki-cross-circle fs-2hx text-danger">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="flex flex-1 flex-col text-danger">
      <h5 class="m-0 mb-1 font-semibold">{{ t("errorLoadingData") }}</h5>
      <span>{{ error }}</span>
    </div>
    <button
      @click="error = null"
      type="button"
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

  <!--begin::Summary Cards-->
  <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <div
      class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
        <i class="ki-duotone ki-abstract-39 fs-2x">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </div>
      <div class="mb-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
        {{ totalSites }}
      </div>
      <div class="font-semibold text-gray-400">{{ t("totalSites") }}</div>
    </div>

    <div
      class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-success-light text-success">
        <i class="ki-duotone ki-abstract-35 fs-2x">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </div>
      <div class="mb-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
        {{ activeSites }}
      </div>
      <div class="font-semibold text-gray-400">{{ t("activeSites") }}</div>
    </div>

    <div
      class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-info-light text-info">
        <i class="ki-duotone ki-abstract-34 fs-2x">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </div>
      <div class="mb-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
        {{ totalVisitors }}
      </div>
      <div class="font-semibold text-gray-400">{{ t("totalVisitors") }}</div>
    </div>

    <div
      class="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-warning-light text-warning">
        <i class="ki-duotone ki-abstract-41 fs-2x">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </div>
      <div class="mb-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
        {{ avgPerformance }}%
      </div>
      <div class="font-semibold text-gray-400">{{ t("avgPerformance") }}</div>
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Sites List-->
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <!--begin::Card header-->
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("sitesOverview") }}
      </h3>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Items per page -->
        <div class="flex items-center">
          <label class="mr-2 mb-0 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t("items") }}
          </label>
          <select
            v-model="pagination.per_page"
            @change="changeItemsPerPage"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm tabular-nums transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
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
            :placeholder="t('searchSites')"
            class="w-[250px] rounded-md border border-gray-300 bg-gray-100 py-2 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          @click="showAddSiteModal"
          :disabled="!selectedTeamId"
          class="inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("addSite") }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <KTDataTable
        :data="filteredAndSortedSites"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="pagination.per_page"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        :empty-table-text="emptyTableMessage"
      >
        <template v-slot:name="{ row }">
          <div class="flex items-center">
            <InitialAvatar :name="row.name" class="mr-5" />
            <span class="font-bold text-gray-900 hover:text-primary dark:text-gray-100">
              {{ row.name }}
            </span>
          </div>
        </template>

        <template v-slot:created_by="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">
            {{ row.created_by?.username || "Unknown" }}
          </span>
          <span class="block text-sm text-gray-500">
            {{ row.created_by?.email || "" }}
          </span>
        </template>

        <template v-slot:created_at="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">
            {{ formatDate(row.created_at) }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="flex justify-end gap-1">
            <RowActionButton @click="editSite(row)" title="Edit Site">
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton @click="deleteSite(row)" title="Delete Site" variant="danger">
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
          </div>
        </template>
      </KTDataTable>

      <!--begin::Pagination-->
      <div
        v-if="!loading && sites.length >= 0"
        class="flex flex-wrap items-center justify-between gap-4 pt-10"
      >
        <div class="flex flex-wrap items-center gap-5">
          <div class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{
              t("showingEntries", {
                from: (pagination.page - 1) * pagination.per_page + 1,
                to: Math.min(
                  pagination.page * pagination.per_page,
                  pagination.total_items
                ),
                total: pagination.total_items,
              })
            }}
          </div>

          <div class="flex items-center">
            <span class="mr-2 text-gray-700 dark:text-gray-300">{{
              t("itemsPerPage")
            }}</span>
            <span class="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
              {{ pagination.per_page }}
            </span>
          </div>
        </div>

        <nav aria-label="Pagination">
          <ul class="flex items-center gap-1">
            <li>
              <button
                @click="goToPage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="rounded-md px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Previous
              </button>
            </li>
            <li v-for="page in visiblePages" :key="page">
              <button
                @click="goToPage(page)"
                :aria-current="page === pagination.page ? 'page' : undefined"
                class="rounded-md px-3 py-1.5 text-sm tabular-nums transition-colors"
                :class="
                  page === pagination.page
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                "
              >
                {{ page }}
              </button>
            </li>
            <li>
              <button
                @click="goToPage(pagination.page + 1)"
                :disabled="pagination.page >= Math.max(1, pagination.total_pages)"
                class="rounded-md px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Sites List-->

  <!-- Add Site Dialog -->
  <dialog
    ref="addSiteDialog"
    class="m-auto w-full max-w-lg rounded-lg border-0 p-0 shadow-xl backdrop:bg-black/50"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Add Site</h5>
      <button
        type="button"
        aria-label="Close"
        @click="addSiteDialog?.close()"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="createSite">
      <div class="p-5">
        <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >Site Name *</label
        >
        <input
          type="text"
          v-model="newSite.name"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="addSiteDialog?.close()"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="creating"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          <span
            v-if="creating"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          Create Site
        </button>
      </div>
    </form>
  </dialog>

  <!-- Edit Site Dialog -->
  <dialog
    ref="editSiteDialog"
    class="m-auto w-full max-w-lg rounded-lg border-0 p-0 shadow-xl backdrop:bg-black/50"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">Edit Site</h5>
      <button
        type="button"
        aria-label="Close"
        @click="editSiteDialog?.close()"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="updateSite" v-if="siteToEdit">
      <div class="p-5">
        <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >Site Name *</label
        >
        <input
          type="text"
          v-model="siteToEdit.name"
          required
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="editSiteDialog?.close()"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="editing"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          <span
            v-if="editing"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          Update Site
        </button>
      </div>
    </form>
  </dialog>

  <!-- Delete Confirmation Dialog -->
  <ConfirmDialog
    ref="deleteSiteDialog"
    title="Delete Site"
    :loading="deleting"
    @confirm="confirmDelete"
  >
    <p>
      Are you sure you want to delete site
      <strong>{{ siteToDelete?.name }}</strong>?
    </p>
    <p class="text-gray-500">This action cannot be undone.</p>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import InitialAvatar from "@/components/common/InitialAvatar.vue";
import RowActionButton from "@/components/common/RowActionButton.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";

// Interface definitions
interface Site {
  uid: string;
  name: string;
  team_uid?: string;
  created_by?: {
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface Team {
  uid: string;
  name: string;
  account_uid?: string;
  created_by?: {
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

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
const sites = ref<Site[]>([]);
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
  next_page: null,
  prev_page: null,
});

// Organization-related reactive data
const organizations = ref<Organization[]>([]);
const loadingOrganizations = ref(false);
const selectedOrganizationId = ref("");
const currentOrganization = ref<Organization | null>(null);

// Account-related reactive data
const accounts = ref<Account[]>([]);
const loadingAccounts = ref(false);
const selectedAccountId = ref("");
const currentAccount = ref<Account | null>(null);

// Team-related reactive data
const teams = ref<Team[]>([]);
const loadingTeams = ref(false);
const selectedTeamId = ref("");
const currentTeam = ref<Team | null>(null);

// Modal (native <dialog>) state
const addSiteDialog = ref<HTMLDialogElement | null>(null);
const editSiteDialog = ref<HTMLDialogElement | null>(null);
const deleteSiteDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const creating = ref(false);
const deleting = ref(false);
const editing = ref(false);
const newSite = ref<Partial<Site>>({
  name: "",
});
const siteToEdit = ref<Site | null>(null);
const siteToDelete = ref<Site | null>(null);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "Site Name",
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Created By",
    columnLabel: "created_by",
    sortEnabled: false,
    searchable: false,
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

// Get route instance to read query parameters
const route = useRoute();

// LocalStorage functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem("lastSelectedOrganization", orgId);
};

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem("lastSelectedOrganization");
};

const saveLastSelectedAccount = (accountId: string) => {
  localStorage.setItem("lastSelectedAccount", accountId);
};

const loadLastSelectedAccount = (): string | null => {
  return localStorage.getItem("lastSelectedAccount");
};

const saveLastSelectedTeam = (teamId: string) => {
  localStorage.setItem("lastSelectedTeam", teamId);
};

const loadLastSelectedTeam = (): string | null => {
  return localStorage.getItem("lastSelectedTeam");
};

// Fetch organizations from API
const fetchOrganizations = async () => {
  loadingOrganizations.value = true;
  try {
    const resp = await ApiService.query("organizations", {});

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (
        resp.data.status === "success" &&
        resp.data.data &&
        Array.isArray(resp.data.data)
      ) {
        organizations.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        organizations.value = resp.data;
      } else {
        organizations.value = [];
      }

      // Check URL parameters for initial selection
      const orgIdFromUrl = route.query.orgId as string;
      const accountIdFromUrl = route.query.accountId as string;
      const teamIdFromUrl = route.query.teamId as string;

      if (orgIdFromUrl) {
        const orgFromUrl = organizations.value.find(
          (o) => o.uid === orgIdFromUrl
        );
        if (orgFromUrl) {
          selectedOrganizationId.value = orgFromUrl.uid;
          currentOrganization.value = orgFromUrl;
          saveLastSelectedOrganization(orgFromUrl.uid);
          await fetchAccounts();

          if (
            accountIdFromUrl &&
            accounts.value.find((a) => a.uid === accountIdFromUrl)
          ) {
            selectedAccountId.value = accountIdFromUrl;
            currentAccount.value =
              accounts.value.find((a) => a.uid === accountIdFromUrl) || null;
            saveLastSelectedAccount(accountIdFromUrl);
            await fetchTeams();

            if (
              teamIdFromUrl &&
              teams.value.find((t) => t.uid === teamIdFromUrl)
            ) {
              selectedTeamId.value = teamIdFromUrl;
              currentTeam.value =
                teams.value.find((t) => t.uid === teamIdFromUrl) || null;
              saveLastSelectedTeam(teamIdFromUrl);
              fetchSites(pagination.value.page);
            }
          }
        }
      } else if (organizations.value.length > 0) {
        // Use last selected or first organization
        const lastSelectedOrgId = loadLastSelectedOrganization();
        if (lastSelectedOrgId) {
          const lastOrg = organizations.value.find(
            (o) => o.uid === lastSelectedOrgId
          );
          if (lastOrg) {
            selectedOrganizationId.value = lastOrg.uid;
            currentOrganization.value = lastOrg;
          }
        } else {
          selectedOrganizationId.value = organizations.value[0].uid;
          currentOrganization.value = organizations.value[0];
          saveLastSelectedOrganization(organizations.value[0].uid);
        }
        await fetchAccounts();
      }
    }
  } catch (e: any) {
    console.error("Failed to load organizations:", e);
    error.value = "Failed to load organizations. Please refresh the page.";
  } finally {
    loadingOrganizations.value = false;
  }
};

// Fetch accounts from API
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return;

  loadingAccounts.value = true;
  try {
    const resp = await ApiService.query(
      `organizations/${selectedOrganizationId.value}/accounts`,
      {}
    );

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (
        resp.data.status === "success" &&
        resp.data.data &&
        Array.isArray(resp.data.data)
      ) {
        accounts.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        accounts.value = resp.data;
      } else {
        accounts.value = [];
      }

      // Auto-select account if available
      if (accounts.value.length > 0 && !selectedAccountId.value) {
        const lastSelectedAccountId = loadLastSelectedAccount();
        if (lastSelectedAccountId) {
          const lastAccount = accounts.value.find(
            (a) => a.uid === lastSelectedAccountId
          );
          if (lastAccount) {
            selectedAccountId.value = lastAccount.uid;
            currentAccount.value = lastAccount;
          }
        } else {
          selectedAccountId.value = accounts.value[0].uid;
          currentAccount.value = accounts.value[0];
          saveLastSelectedAccount(accounts.value[0].uid);
        }
        fetchTeams();
      }
    }
  } catch (e: any) {
    console.error("Failed to load accounts:", e);
    error.value = "Failed to load accounts for selected organization.";
  } finally {
    loadingAccounts.value = false;
  }
};

// Fetch teams from API
const fetchTeams = async () => {
  if (!selectedAccountId.value) return;

  loadingTeams.value = true;
  try {
    const resp = await ApiService.query(
      `accounts/${selectedAccountId.value}/teams`,
      {}
    );

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (
        resp.data.status === "success" &&
        resp.data.data &&
        Array.isArray(resp.data.data)
      ) {
        teams.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        teams.value = resp.data;
      } else {
        teams.value = [];
      }

      // Auto-select team if available
      if (teams.value.length > 0 && !selectedTeamId.value) {
        const lastSelectedTeamId = loadLastSelectedTeam();
        if (lastSelectedTeamId) {
          const lastTeam = teams.value.find(
            (t) => t.uid === lastSelectedTeamId
          );
          if (lastTeam) {
            selectedTeamId.value = lastTeam.uid;
            currentTeam.value = lastTeam;
          }
        } else {
          selectedTeamId.value = teams.value[0].uid;
          currentTeam.value = teams.value[0];
          saveLastSelectedTeam(teams.value[0].uid);
        }
        fetchSites(pagination.value.page);
      }
    }
  } catch (e: any) {
    console.error("Failed to load teams:", e);
    error.value = "Failed to load teams for selected account.";
  } finally {
    loadingTeams.value = false;
  }
};

// Fetch sites from API
const fetchSites = async (page: number = 1) => {
  if (!selectedTeamId.value) return;

  loading.value = true;
  error.value = null;
  try {
    const resp = await ApiService.query(`teams/${selectedTeamId.value}/sites`, {
      params: { page, per_page: pagination.value.per_page },
    });

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (
        resp.data.status === "success" &&
        resp.data.data &&
        Array.isArray(resp.data.data)
      ) {
        sites.value = resp.data.data;

        // Update pagination info
        if (resp.data.pagination) {
          pagination.value = resp.data.pagination;
        }
      } else if (Array.isArray(resp.data)) {
        sites.value = resp.data;
      } else {
        sites.value = [];
      }

      // Format created_at for each site
      sites.value.forEach((site) => {
        if (site.created_at && typeof site.created_at === "string") {
          site.created_at = new Date(site.created_at).toLocaleDateString();
        }
      });
    } else {
      sites.value = [];
    }
  } catch (e: any) {
    console.error("Error fetching sites:", e);
    error.value = e?.response?.data?.message || e.message || "Failed to load sites";
  } finally {
    loading.value = false;
  }
};

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const switchOrganization = async () => {
  const org = organizations.value.find(
    (o) => o.uid === selectedOrganizationId.value
  );
  currentOrganization.value = org || null;
  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value);
  }
  // Clear accounts, teams and sites when organization changes
  accounts.value = [];
  teams.value = [];
  sites.value = [];
  selectedAccountId.value = "";
  selectedTeamId.value = "";
  currentAccount.value = null;
  currentTeam.value = null;
  // Fetch accounts for the new organization
  await fetchAccounts();
};

const switchAccount = async () => {
  const account = accounts.value.find((a) => a.uid === selectedAccountId.value);
  currentAccount.value = account || null;
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value);
  }
  // Clear teams and sites when account changes
  teams.value = [];
  sites.value = [];
  selectedTeamId.value = "";
  currentTeam.value = null;
  // Fetch teams for the selected account
  await fetchTeams();
};

const switchTeam = () => {
  const team = teams.value.find((t) => t.uid === selectedTeamId.value);
  currentTeam.value = team || null;
  // Save the selected team to localStorage
  if (selectedTeamId.value) {
    saveLastSelectedTeam(selectedTeamId.value);
  }
  // Fetch sites for the selected team
  fetchSites(pagination.value.page);
};

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchSites(page);
  }
};

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchSites(1);
};

const visiblePages = computed((): number[] => {
  const current = pagination.value.page;
  const total = Math.max(1, pagination.value.total_pages);
  const pages: number[] = [];

  // Show max 5 page numbers
  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);

  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Empty table message based on current state
const emptyTableMessage = computed(() => {
  if (!selectedOrganizationId.value) {
    return "Please select an organization to view sites";
  }
  if (!selectedAccountId.value) {
    return "Please select an account to view sites";
  }
  if (!selectedTeamId.value) {
    return "Please select a team to view sites";
  }
  if (loading.value) {
    return "Loading sites...";
  }
  if (searchQuery.value.trim()) {
    return `No sites found matching "${searchQuery.value}"`;
  }
  return "No sites found for this team";
});

// CRUD Operations
const showAddSiteModal = () => {
  // Reset form
  newSite.value = {
    name: "",
  };
  addSiteDialog.value?.showModal();
};

const createSite = async () => {
  if (!newSite.value.name || !selectedTeamId.value) return;

  const siteData = {
    ...newSite.value,
  };

  creating.value = true;
  try {
    const resp = await ApiService.post(`teams/${selectedTeamId.value}/sites`, siteData);
    if (resp && resp.data) {
      // Refresh the sites list
      await fetchSites(pagination.value.page);
      addSiteDialog.value?.close();
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to create site";
  } finally {
    creating.value = false;
  }
};

const deleteSite = (site: Site) => {
  siteToDelete.value = site;
  deleteSiteDialog.value?.showModal();
};

const confirmDelete = async () => {
  if (!siteToDelete.value) return;

  deleting.value = true;
  try {
    await ApiService.delete(`sites/${siteToDelete.value.uid}`);
    // Refresh the sites list
    await fetchSites(pagination.value.page);
    deleteSiteDialog.value?.close();
    siteToDelete.value = null;
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to delete site";
  } finally {
    deleting.value = false;
  }
};

const editSite = (site: Site) => {
  siteToEdit.value = { ...site }; // Create a copy to avoid direct mutation
  editSiteDialog.value?.showModal();
};

const updateSite = async () => {
  if (!siteToEdit.value || !siteToEdit.value.name?.trim()) return;

  editing.value = true;
  try {
    const resp = await ApiService.patch(`sites/${siteToEdit.value.uid}`, {
      name: siteToEdit.value.name,
    });
    if (resp && resp.data) {
      // Refresh the sites list
      await fetchSites(pagination.value.page);
      editSiteDialog.value?.close();
      siteToEdit.value = null;
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to update site";
  } finally {
    editing.value = false;
  }
};

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

// Computed properties for summary statistics
const totalSites = computed(() => sites.value.length);
const activeSites = computed(() => sites.value.length); // All sites are considered active for now
const totalVisitors = computed(() =>
  sites.value.reduce((sum, site) => sum + Math.floor(Math.random() * 1000) + 100, 0)
);
const avgPerformance = computed(() => Math.floor(Math.random() * 30) + 70);

// Search and Sort functionality
const filteredAndSortedSites = computed(() => {
  let filtered = sites.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((site) => site.name.toLowerCase().includes(query));
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

// Initialize
onMounted(() => {
  fetchOrganizations();
});

// i18n
const { t } = useI18n();
</script>
