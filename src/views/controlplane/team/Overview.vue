<template>
  <!--begin::Team Overview-->
  <!--begin::Organization & Account Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">
            {{ t("controlplane.team.header.title") }}
          </h4>
          <p class="text-muted mb-0">
            <span v-if="loadingOrganizations">{{
              t("controlplane.team.header.subtitleLoading")
            }}</span>
            <span v-else-if="currentAccount">{{
              t("controlplane.team.header.subtitleWithAccount", {
                name: currentAccount.name,
              })
            }}</span>
            <span v-else-if="organizations.length === 0">{{
              t("controlplane.team.header.subtitleNoOrganizations")
            }}</span>
            <span v-else-if="!selectedOrganizationId">{{
              t("controlplane.team.header.subtitleSelectOrganization")
            }}</span>
            <span v-else-if="!selectedAccountId">{{
              t("controlplane.team.header.subtitleSelectAccount")
            }}</span>
            <span v-else>{{
              t("controlplane.team.header.subtitleDefault")
            }}</span>
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold"
                >{{ t("controlplane.team.filters.organizationLabel") }}:</label
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
                      ? t("controlplane.team.filters.organizationLoading")
                      : t("controlplane.team.filters.organizationPlaceholder")
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

              <!-- Loading spinner for organizations -->
              <div v-if="loadingOrganizations" class="ms-2">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span class="visually-hidden">{{
                    t("controlplane.team.filters.organizationLoading")
                  }}</span>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold"
                >{{ t("controlplane.team.filters.accountLabel") }}:</label
              >
              <select
                v-model="selectedAccountId"
                @change="switchAccount"
                class="form-select form-select-solid w-200px"
                :disabled="
                  loadingAccounts ||
                  !selectedOrganizationId ||
                  accounts.length === 0
                "
              >
                <option value="" disabled>
                  <span v-if="!selectedOrganizationId">{{
                    t("controlplane.team.filters.accountRequiresOrganization")
                  }}</span>
                  <span v-else-if="loadingAccounts">{{
                    t("controlplane.team.filters.accountLoading")
                  }}</span>
                  <span v-else-if="accounts.length === 0">{{
                    t("controlplane.team.filters.accountEmpty")
                  }}</span>
                  <span v-else>{{
                    t("controlplane.team.filters.accountPlaceholder")
                  }}</span>
                </option>
                <option
                  v-for="account in accounts"
                  :key="account.uid"
                  :value="account.uid"
                >
                  {{ account.name }}
                </option>
              </select>

              <!-- Loading spinner for accounts -->
              <div v-if="loadingAccounts" class="ms-2">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span class="visually-hidden">{{
                    t("controlplane.team.filters.accountLoading")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization & Account Switcher-->

  <!--begin::Error Alert-->
  <div
    v-if="error"
    class="alert alert-danger d-flex align-items-center mb-5"
    role="alert"
  >
    <i class="ki-duotone ki-cross-circle fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="d-flex flex-column">
      <h5 class="mb-1">{{ t("controlplane.team.error.title") }}</h5>
      <span>{{ error }}</span>
    </div>
    <button
      @click="error = null"
      type="button"
      class="btn-close ms-auto"
      aria-label="Close"
    ></button>
  </div>
  <!--end::Error Alert-->

  <!-- <div class="row g-5 g-xl-8 mb-8">
    <div class="col-xl-3">
      <Widget1
        :description="'Total Teams'"
        :value="totalTeams"
        :progress-text="`${activeTeams} Active`"
        :progress-value="activeTeamsPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Members'"
        :value="totalMembers"
        :progress-text="`${activeMembers} Active`"
        :progress-value="activeMembersPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Active Projects'"
        :value="totalProjects"
        :progress-text="`${activeProjects} Ongoing`"
        :progress-value="activeProjectsPercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Team Performance'"
        :value="teamPerformance"
        :progress-text="'This Month'"
        :progress-value="performanceGrowth"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div> -->
  <!--end::Summary Cards-->

  <!--begin::Teams List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.team.toolbar.title") }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">{{
            t("controlplane.team.toolbar.itemsLabel")
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
            :placeholder="t('controlplane.team.toolbar.searchPlaceholder')"
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddTeamModal"
          class="btn btn-sm btn-light-primary"
          :disabled="loading || loadingOrganizations || !selectedAccountId"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.team.toolbar.addButton") }}
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <ControlPlaneEmptyState
        v-if="showSelectionEmptyState"
        :title="selectionEmptyState!.title"
        :description="selectionEmptyState!.description"
      />

      <template v-else>
      <KTDataTable
        :data="filteredAndSortedTeams"
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
              formatUserDisplayName(row.created_by) ||
              t("controlplane.team.common.unknown")
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
              @click="showTeamMembers(row)"
              :title="t('controlplane.team.actions.viewMembers')"
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
                name: 'site-overview',
                query: { account_id: selectedAccountId },
              }"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              :title="t('controlplane.team.actions.addSite')"
            >
              <i class="ki-duotone ki-home fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editTeam(row)"
              :title="t('controlplane.team.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteTeam(row)"
              :title="t('controlplane.team.actions.delete')"
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
        :total-items="pagination.total_items || teams.length"
        :total-pages="Math.max(1, pagination.total_pages)"
        @page-change="goToPage"
      />
      <!--end::Pagination-->
      </template>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Teams List-->

  <!-- Add Team Modal -->
  <div class="modal fade" id="addTeamModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("controlplane.team.modals.add.title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="createTeam">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">{{
                  t("controlplane.team.modals.add.nameLabel")
                }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newTeam.name"
                  required
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              {{ t("controlplane.team.modals.add.cancel") }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span
                v-if="creating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ t("controlplane.team.modals.add.submit") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Edit Team Modal -->
  <div class="modal fade" id="editTeamModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("controlplane.team.modals.edit.title") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="teamToEdit = null"
          ></button>
        </div>
        <form @submit.prevent="updateTeam" v-if="teamToEdit">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">{{
                  t("controlplane.team.modals.edit.nameLabel")
                }}</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="teamToEdit.name"
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
              @click="teamToEdit = null"
            >
              {{ t("controlplane.team.modals.edit.cancel") }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="editing">
              <span
                v-if="editing"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              {{ t("controlplane.team.modals.edit.submit") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="deleteTeamModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("controlplane.team.modals.delete.title") }}
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
            {{ t("controlplane.team.modals.delete.confirmPrefix") }}
            <strong>{{ teamToDelete?.name }}</strong
            >{{ t("controlplane.team.modals.delete.confirmSuffix") }}
          </p>
          <p class="text-muted">
            {{ t("controlplane.team.modals.delete.warning") }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            {{ t("controlplane.team.modals.delete.cancel") }}
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
            {{ t("controlplane.team.modals.delete.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Team Membership Modal -->
  <MembershipListModal
    ref="teamMembershipModalRef"
    entity-type="team"
    :entity-uid="selectedTeamUid"
    modal-id="teamMembershipModal"
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
import ControlPlaneEmptyState from "@/components/controlplane/ControlPlaneEmptyState.vue";
import ApiService from "@/core/services/ApiService";
import Pagination from "@/components/common/Pagination.vue";
import MembershipListModal from "@/components/modals/membership/MembershipListModal.vue";
import {
  formatUserDisplayName,
  getCreatedByUid,
  normalizeCreatedBy,
  resolveUsersByUid,
  type UserInfo,
} from "@/core/helpers/user";

// Interface definitions
interface Team {
  uid: string;
  name: string;
  account_uid?: string;
  created_by?: UserInfo | null;
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

const teams = ref<Team[]>([]);
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

// Account-related reactive data
const accounts = ref<Account[]>([]);
const loadingAccounts = ref(false);
const selectedAccountId = ref("");
const currentAccount = ref<Account | null>(null);

// Modal states
const creating = ref(false);
const deleting = ref(false);
const editing = ref(false);
const newTeam = ref<Partial<Team>>({
  name: "",
});
const teamToEdit = ref<Team | null>(null);
const teamToDelete = ref<Team | null>(null);

// Modal references
const teamMembershipModalRef = ref();
const selectedTeamUid = ref("");

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("controlplane.team.table.teamName"),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.team.table.createdBy"),
    columnLabel: "created_by",
    sortEnabled: false,
    searchable: false,
  },
  {
    columnName: t("controlplane.team.table.createdAt"),
    columnLabel: "created_at",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("controlplane.team.table.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

// Get route instance to read query parameters
const route = useRoute();

const { t } = useI18n();

// Organization-related functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem("lastSelectedOrganization", orgId);
};

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem("lastSelectedOrganization");
};

// Account-related functions
const saveLastSelectedAccount = (accountId: string) => {
  localStorage.setItem("lastSelectedAccount", accountId);
};

const loadLastSelectedAccount = (): string | null => {
  return localStorage.getItem("lastSelectedAccount");
};

// Fetch organizations from API
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
          fetchAccounts();
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
              fetchAccounts();
            } else {
              // If last selected not found, use first organization
              selectedOrganizationId.value = organizations.value[0]?.uid || "";
              currentOrganization.value = organizations.value[0] || null;
              if (organizations.value[0]) {
                saveLastSelectedOrganization(organizations.value[0].uid);
                fetchAccounts();
              }
            }
          } else {
            // No last selected, use first organization
            selectedOrganizationId.value = organizations.value[0]?.uid || "";
            currentOrganization.value = organizations.value[0] || null;
            if (organizations.value[0]) {
              saveLastSelectedOrganization(organizations.value[0].uid);
              fetchAccounts();
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
          selectedOrganizationId.value = organizations.value[0].uid;
          currentOrganization.value = organizations.value[0];
          saveLastSelectedOrganization(organizations.value[0].uid);
        }
        fetchAccounts();
      }
    }
  } catch (e: any) {
    console.error("Failed to load organizations:", e);
  } finally {
    loadingOrganizations.value = false;
  }
};

// Fetch accounts from API
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return;

  loadingAccounts.value = true;
  try {
    console.log(
      "🚀 Fetching accounts for organization:",
      selectedOrganizationId.value
    );
    const resp = await ApiService.query(
      `organizations/${selectedOrganizationId.value}/accounts`,
      {
        /* empty */
      }
    );
    console.log("📡 Accounts API Response:", resp);

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found accounts in data array:", resp.data.data);
        accounts.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found accounts in direct data array:", resp.data);
        accounts.value = resp.data;
      } else {
        console.log("⚠️ Unexpected accounts data format:", resp.data);
        accounts.value = [];
      }

      console.log("🎯 Final accounts:", accounts.value);

      // Check if accountId is provided in URL query parameters
      const accountIdFromUrl = route.query.accountId as string;

      if (accountIdFromUrl) {
        // Find the account by the provided accountId
        const accountFromUrl = accounts.value.find(
          (a) => a.uid === accountIdFromUrl
        );
        if (accountFromUrl) {
          selectedAccountId.value = accountFromUrl.uid;
          currentAccount.value = accountFromUrl;
          // Save this as the last selected account
          saveLastSelectedAccount(accountFromUrl.uid);
          // Fetch teams for the selected account
          fetchTeams(pagination.value.page);
          return;
        }
      }

      // If no accountId from URL or not found, try to use last selected account
      const lastSelectedAccountId = loadLastSelectedAccount();
      if (lastSelectedAccountId) {
        const lastAccount = accounts.value.find(
          (a) => a.uid === lastSelectedAccountId
        );
        if (lastAccount) {
          selectedAccountId.value = lastAccount.uid;
          currentAccount.value = lastAccount;
        } else {
          // Last selected not found, use first account
          selectedAccountId.value = accounts.value[0]?.uid || "";
          currentAccount.value = accounts.value[0] || null;
          if (accounts.value[0]) {
            saveLastSelectedAccount(accounts.value[0].uid);
          }
        }
      } else {
        // No last selected, use first account
        selectedAccountId.value = accounts.value[0]?.uid || "";
        currentAccount.value = accounts.value[0] || null;
        if (accounts.value[0]) {
          saveLastSelectedAccount(accounts.value[0].uid);
        }
      }

      // Fetch teams for the selected account
      fetchTeams(pagination.value.page);
    }
  } catch (e: any) {
    console.error("Failed to load accounts:", e);
  } finally {
    loadingAccounts.value = false;
  }
};

// Fetch teams from API
const fetchTeams = async (page: number = 1) => {
  if (!selectedAccountId.value) return;

  loading.value = true;
  error.value = null;
  try {
    console.log("🚀 Fetching teams for account:", selectedAccountId.value, {
      page,
      per_page: pagination.value.per_page,
    });
    // Send both page_size (server) and per_page (client) for compatibility
    const resp = await ApiService.query(
      `accounts/${selectedAccountId.value}/teams`,
      {
        params: {
          page,
          page_size: pagination.value.per_page,
          per_page: pagination.value.per_page,
        },
      }
    );
    console.log("📡 Teams API Response:", resp);

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found teams in data array:", resp.data.data);
        teams.value = resp.data.data;

        // Update pagination info but preserve user-selected per_page
        if (resp.data.pagination) {
          const currentPerPage = pagination.value.per_page; // Preserve user's choice
          const totalItems =
            resp.data.pagination.total_items ?? teams.value.length;
          const recalculatedTotalPages = Math.max(
            1,
            Math.ceil(totalItems / (currentPerPage || 1))
          );

          pagination.value = {
            ...resp.data.pagination,
            page: page,
            per_page: currentPerPage,
            total_pages: recalculatedTotalPages,
            total_items: totalItems,
            next_page: page < recalculatedTotalPages ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
          };
        }
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found teams in direct data array:", resp.data);
        teams.value = resp.data;

        // Calculate pagination manually if server doesn't provide it
        const totalItems = teams.value.length;
        const totalPages = Math.ceil(totalItems / pagination.value.per_page);
        pagination.value = {
          page: page,
          per_page: pagination.value.per_page,
          total_pages: totalPages,
          total_items: totalItems,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
        };
      } else {
        console.log("⚠️ Unexpected teams data format:", resp.data);
        teams.value = [];
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

      const creatorUids = teams.value
        .map((team) => getCreatedByUid(team.created_by))
        .filter((uid): uid is string => !!uid);
      const userMap = await resolveUsersByUid(creatorUids);

      // Format created_at and resolve created_by for each team
      teams.value.forEach((team) => {
        team.created_by = normalizeCreatedBy(team.created_by, userMap);

        if (team.created_at && typeof team.created_at === "string") {
          team.created_at = new Date(team.created_at).toLocaleDateString();
        }
      });

      // Ensure pagination.total_pages consistent with per_page and total_items
      if (pagination.value.total_items == null) {
        pagination.value.total_items = teams.value.length;
      }
      pagination.value.total_pages = Math.max(
        1,
        Math.ceil(
          (pagination.value.total_items || 0) / (pagination.value.per_page || 1)
        )
      );
      pagination.value.next_page =
        pagination.value.page < pagination.value.total_pages
          ? pagination.value.page + 1
          : null;
      pagination.value.prev_page =
        pagination.value.page > 1 ? pagination.value.page - 1 : null;

      console.log("🎯 Final teams:", teams.value);
      console.log("📄 Pagination:", pagination.value);
    } else {
      console.log("⚠️ No valid teams response data");
      teams.value = [];
    }
  } catch (e: any) {
    console.error("❌ Error fetching teams:", e);
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.team.notifications.loadFailed");
  } finally {
    loading.value = false;
    console.log("📋 Teams fetch complete. Total teams:", teams.value.length);
  }
};

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const switchOrganization = () => {
  const org = organizations.value.find(
    (o) => o.uid === selectedOrganizationId.value
  );
  currentOrganization.value = org || null;
  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value);
  }
  // Clear accounts and teams when organization changes
  accounts.value = [];
  teams.value = [];
  selectedAccountId.value = "";
  currentAccount.value = null;
  // Fetch accounts for the new organization
  fetchAccounts();
};

const switchAccount = () => {
  const account = accounts.value.find((a) => a.uid === selectedAccountId.value);
  currentAccount.value = account || null;
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value);
  }
  // Fetch teams for the selected account
  fetchTeams(pagination.value.page);
};

const showAddTeamModal = () => {
  // Reset form
  newTeam.value = {
    name: "",
  };
  // Show modal using Bootstrap
  const modal = document.getElementById("addTeamModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const createTeam = async () => {
  if (!newTeam.value.name || !selectedAccountId.value) return;

  // Include account context
  const teamData = {
    ...newTeam.value,
  };

  creating.value = true;
  try {
    const resp = await ApiService.post(
      `accounts/${selectedAccountId.value}/teams`,
      teamData
    );
    if (resp && resp.data) {
      // Refresh the teams list
      await fetchTeams(pagination.value.page);

      // Hide modal
      const modal = document.getElementById("addTeamModal");
      if (modal) {
        const bsModal = Modal.getInstance(modal);
        bsModal?.hide();
      }
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.team.notifications.createFailed");
  } finally {
    creating.value = false;
  }
};

const deleteTeam = (team: Team) => {
  teamToDelete.value = team;
  // Show delete confirmation modal
  const modal = document.getElementById("deleteTeamModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const confirmDelete = async () => {
  if (!teamToDelete.value) return;

  deleting.value = true;
  try {
    await ApiService.delete(`teams/${teamToDelete.value.uid}`);
    // Refresh the teams list
    await fetchTeams(pagination.value.page);
    // Hide modal
    const modal = document.getElementById("deleteTeamModal");
    if (modal) {
      const bsModal = Modal.getInstance(modal);
      bsModal?.hide();
    }
    teamToDelete.value = null;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.team.notifications.deleteFailed");
  } finally {
    deleting.value = false;
  }
};

const showTeamMembers = (team: Team) => {
  selectedTeamUid.value = team.uid;
  teamMembershipModalRef.value?.showModal();
};

const editTeam = (team: Team) => {
  teamToEdit.value = { ...team }; // Create a copy to avoid direct mutation
  // Show edit modal using Bootstrap
  const modal = document.getElementById("editTeamModal");
  if (modal) {
    const bsModal = new Modal(modal);
    bsModal.show();
  }
};

const updateTeam = async () => {
  if (!teamToEdit.value || !teamToEdit.value.name?.trim()) return;

  editing.value = true;
  try {
    const resp = await ApiService.patch(`teams/${teamToEdit.value.uid}`, {
      name: teamToEdit.value.name,
    });
    if (resp && resp.data) {
      // Refresh the teams list
      await fetchTeams(pagination.value.page);

      // Hide modal
      const modal = document.getElementById("editTeamModal");
      if (modal) {
        const bsModal = Modal.getInstance(modal);
        bsModal?.hide();
      }
      teamToEdit.value = null;
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t("controlplane.team.notifications.updateFailed");
  } finally {
    editing.value = false;
  }
};

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

// Computed properties for summary statistics
// const totalTeams = computed(() => teams.value.length);
// const activeTeams = computed(() => teams.value.length); // All teams are considered active for now
// const activeTeamsPercentage = computed(() => 100); // All teams are active

// Mock data for other stats (replace with actual API calls)
const totalMembers = computed(() =>
  teams.value.reduce((sum) => sum + Math.floor(Math.random() * 20) + 5, 0)
);
// const activeMembers = computed(() => Math.floor(totalMembers.value * 0.9));
// const activeMembersPercentage = computed(() =>
//   totalMembers.value > 0
//     ? Math.round((activeMembers.value / totalMembers.value) * 100)
//     : 0
// );

const totalProjects = computed(() =>
  teams.value.reduce((sum) => sum + Math.floor(Math.random() * 10) + 2, 0)
);
// const activeProjects = computed(() => Math.floor(totalProjects.value * 0.8));
// const activeProjectsPercentage = computed(() =>
//   totalProjects.value > 0
//     ? Math.round((activeProjects.value / totalProjects.value) * 100)
//     : 0
// );

// const teamPerformance = computed(
//   () => `${Math.floor(Math.random() * 30) + 70}%`
// );
// const performanceGrowth = computed(() => Math.floor(Math.random() * 20) + 5);

// Search and Sort functionality
const filteredAndSortedTeams = computed(() => {
  let filtered = teams.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((team) =>
      team.name.toLowerCase().includes(query)
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Team];
      const bValue = b[sortLabel.value as keyof Team];

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

// Pagination methods and computed properties
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchTeams(page);
  }
};

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchTeams(1);
};

// const visiblePages = computed((): number[] => {
//   const current = pagination.value.page;
//   const total = Math.max(1, pagination.value.total_pages); // Pastikan minimal 1 halaman
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

// Empty table message based on current state
const selectionEmptyState = computed(() => {
  if (loadingOrganizations.value) {
    return null;
  }
  if (organizations.value.length === 0) {
    return {
      title: t("controlplane.team.emptyState.noOrganizations.title"),
      description: t("controlplane.team.emptyState.noOrganizations.description"),
    };
  }
  if (!selectedOrganizationId.value) {
    return {
      title: t("controlplane.team.emptyState.noOrganizationSelected.title"),
      description: t(
        "controlplane.team.emptyState.noOrganizationSelected.description",
      ),
    };
  }
  if (!loadingAccounts.value && !selectedAccountId.value) {
    return {
      title: t("controlplane.team.emptyState.noAccountSelected.title"),
      description: t("controlplane.team.emptyState.noAccountSelected.description"),
    };
  }
  return null;
});

const showSelectionEmptyState = computed(
  () => selectionEmptyState.value !== null,
);

const emptyTableMessage = computed(() => {
  if (!selectedOrganizationId.value) {
    return t("controlplane.team.empty.selectOrganization");
  }
  if (!selectedAccountId.value) {
    return t("controlplane.team.empty.selectAccount");
  }
  if (loading.value) {
    return t("controlplane.team.empty.loading");
  }
  if (searchQuery.value.trim()) {
    return t("controlplane.team.empty.searchNoResults", {
      query: searchQuery.value,
    });
  }
  return t("controlplane.team.empty.noResults");
});

// Initialize
onMounted(() => {
  fetchOrganizations();
});
</script>
