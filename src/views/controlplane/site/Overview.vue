<template>
  <!--begin::Site Overview-->
  <!--begin::Organization, Account & Team Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">
            {{ t("controlplane.site.header.title") }}
          </h4>
          <p class="text-muted mb-0">
            <span v-if="loadingOrganizations">{{
              t("controlplane.site.header.subtitleLoading")
            }}</span>
            <span v-else-if="currentTeam">{{
              t("controlplane.site.header.subtitleWithTeam", {
                name: currentTeam.name,
              })
            }}</span>
            <span v-else-if="organizations.length === 0">{{
              t("controlplane.site.header.subtitleNoOrganizations")
            }}</span>
            <span v-else-if="!selectedOrganizationId">{{
              t("controlplane.site.header.subtitleSelectOrganization")
            }}</span>
            <span v-else-if="!selectedAccountId">{{
              t("controlplane.site.header.subtitleSelectAccount")
            }}</span>
            <span v-else-if="!selectedTeamIdFilter">{{
              t("controlplane.site.header.subtitleSelectTeam")
            }}</span>
            <span v-else>{{
              t("controlplane.site.header.subtitleDefault")
            }}</span>
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <!-- Organization Dropdown -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold"
                >{{ t("controlplane.site.filters.organizationLabel") }}:</label
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
                      ? t("controlplane.site.filters.organizationLoading")
                      : t("controlplane.site.filters.organizationPlaceholder")
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
                    t("controlplane.site.filters.organizationLoading")
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Account Dropdown -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold"
                >{{ t("controlplane.site.filters.accountLabel") }}:</label
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
                    t("controlplane.site.filters.accountRequiresOrganization")
                  }}</span>
                  <span v-else-if="loadingAccounts">{{
                    t("controlplane.site.filters.accountLoading")
                  }}</span>
                  <span v-else-if="accounts.length === 0">{{
                    t("controlplane.site.filters.accountEmpty")
                  }}</span>
                  <span v-else>{{
                    t("controlplane.site.filters.accountPlaceholder")
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
                    t("controlplane.site.filters.accountLoading")
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Team Dropdown -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold"
                >{{ t("controlplane.site.filters.teamLabel") }}:</label
              >
              <select
                v-model="selectedTeamIdFilter"
                @change="switchTeam"
                class="form-select form-select-solid w-200px"
                :disabled="
                  loadingTeams || !selectedAccountId || teams.length === 0
                "
              >
                <option value="" disabled>
                  <span v-if="!selectedAccountId">{{
                    t("controlplane.site.filters.teamRequiresAccount")
                  }}</span>
                  <span v-else-if="loadingTeams">{{
                    t("controlplane.site.filters.teamLoading")
                  }}</span>
                  <span v-else-if="teams.length === 0">{{
                    t("controlplane.site.filters.teamEmpty")
                  }}</span>
                  <span v-else>{{
                    t("controlplane.site.filters.teamPlaceholder")
                  }}</span>
                </option>
                <option v-for="team in teams" :key="team.uid" :value="team.uid">
                  {{ team.name }}
                </option>
              </select>

              <!-- Loading spinner for teams -->
              <div v-if="loadingTeams" class="ms-2">
                <div
                  class="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span class="visually-hidden">{{
                    t("controlplane.site.filters.teamLoading")
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization, Account & Team Switcher-->
  <!-- 
  <div class="row g-5 g-xl-8 mb-8">
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
  </div> -->
  <!--end::Summary Cards-->

  <!--begin::Sites List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.site.toolbar.title") }}</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">{{
            t("controlplane.site.toolbar.itemsLabel")
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
            :placeholder="t('controlplane.site.toolbar.searchPlaceholder')"
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddSiteModal"
          class="btn btn-sm btn-light-primary"
          :disabled="loading || loadingOrganizations || !selectedTeamIdFilter"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.site.toolbar.addButton") }}
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <ControlPlaneEmptyState
        v-if="showSelectionEmptyState"
        :title="selectionEmptyState!.title"
        :description="selectionEmptyState!.description"
      />

      <template v-else>
      <KTDataTable
        :data="filteredAndSortedSites"
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
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{
                row.description || t("controlplane.site.common.noDescription")
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:description="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            row.description || t("controlplane.site.common.noDescription")
          }}</span>
        </template>

        <template v-slot:created_by="{ row }">
          <span class="text-dark fw-bold d-block fs-6">
            {{
              row.created_by?.username || t("controlplane.site.common.unknown")
            }}
          </span>
          <span class="text-muted fw-semibold text-muted d-block fs-7">
            {{ row.created_by?.email || "" }}
          </span>
        </template>

        <template v-slot:created_at="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            new Date(row.created_at).toLocaleDateString()
          }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="viewSiteDetails(row)"
              :title="t('controlplane.site.actions.viewDetails')"
            >
              <i class="ki-duotone ki-instagram fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editSiteDetails(row)"
              :title="t('controlplane.site.actions.edit')"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteSite(row)"
              :title="t('controlplane.site.actions.delete')"
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

      <!--begin::Pagination-->
      <Pagination
        v-if="!loading"
        :page="pagination.page"
        :per-page="pagination.per_page"
        :total-items="pagination.total_items || sites.length"
        :total-pages="Math.max(1, pagination.total_pages)"
        @page-change="goToPage"
      />
      <!--end::Pagination-->
      </template>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Sites List-->

  <!-- Add Site Modal -->
  <AddSiteModal
    ref="addSiteModalRef"
    :team-uid="selectedTeamIdFilter"
    @site-added="onSiteAdded"
  />

  <!-- Edit Site Modal -->
  <EditSiteModal ref="editSiteModalRef" @site-updated="onSiteUpdated" />
</template>

<script setup lang="ts">
defineOptions({
  name: "OverviewComponent",
});

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
// import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ControlPlaneEmptyState from "@/components/controlplane/ControlPlaneEmptyState.vue";
import AddSiteModal from "@/components/modals/forms/AddSiteModal.vue";
import EditSiteModal from "@/components/modals/forms/EditSiteModal.vue";
import ApiService from "@/core/services/ApiService";
import Pagination from "@/components/common/Pagination.vue";

// Interface definitions
interface Site {
  uid: string;
  name: string;
  description?: string;
  team_uid?: string;
  created_by?: {
    username: string;
    email: string;
  };
  created_at: string;
  updated_at?: string;
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

// Get route instance to read query parameters
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// Reactive data
const sites = ref<Site[]>([]);
const loading = ref(false);
// const error = ref<string | null>(null);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const selectedTeamId = ref("");
const addSiteModalRef = ref();
const editSiteModalRef = ref();

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
// const teamsCache = ref<Record<string, Team[]>>({
//   /* empty */
// });
const accountsWithTeams = ref<Record<string, boolean>>({
  /* empty */
});

// Team-related reactive data
const teams = ref<Team[]>([]);
const loadingTeams = ref(false);
const selectedTeamIdFilter = ref("");
const currentTeam = ref<Team | null>(null);

// Pagination state
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null as number | null,
  prev_page: null as number | null,
});

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t("controlplane.site.table.siteName"),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.table.description"),
    columnLabel: "description",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.table.createdBy"),
    columnLabel: "created_by",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t("controlplane.site.table.createdAt"),
    columnLabel: "created_at",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t("controlplane.site.table.actions"),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

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
              selectedTeamIdFilter.value = teamIdFromUrl;
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
  } finally {
    loadingAccounts.value = false;
  }
};

// Fetch teams from API
const fetchTeams = async () => {
  if (!selectedAccountId.value) return;

  loadingTeams.value = true;
  try {
    console.log("🚀 Fetching teams for account:", selectedAccountId.value);
    const resp = await ApiService.query(
      `accounts/${selectedAccountId.value}/teams`,
      {
        /* empty */
      }
    );
    console.log("📡 Teams API Response:", resp);

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found teams in data array:", resp.data.data);
        teams.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found teams in direct data array:", resp.data);
        teams.value = resp.data;
      } else {
        console.log("⚠️ Unexpected teams data format:", resp.data);
        teams.value = [];
      }

      console.log("🎯 Final teams:", teams.value);

      // Auto-select team if available
      if (teams.value.length > 0 && !selectedTeamId.value) {
        const lastSelectedTeamId = loadLastSelectedTeam();
        if (lastSelectedTeamId) {
          const lastTeam = teams.value.find(
            (t) => t.uid === lastSelectedTeamId
          );
          if (lastTeam) {
            selectedTeamId.value = lastTeam.uid;
            selectedTeamIdFilter.value = lastTeam.uid;
            currentTeam.value = lastTeam;
          }
        } else {
          selectedTeamId.value = teams.value[0].uid;
          selectedTeamIdFilter.value = teams.value[0].uid;
          currentTeam.value = teams.value[0];
          saveLastSelectedTeam(teams.value[0].uid);
        }
        fetchSites(pagination.value.page);
      }
    }
  } catch (e: any) {
    console.error("Failed to load teams:", e);
  } finally {
    loadingTeams.value = false;
  }
};

// Fetch sites from API
const fetchSites = async (page: number = 1) => {
  if (!selectedTeamId.value) return;

  loading.value = true;
  try {
    console.log("🚀 Fetching sites for team:", selectedTeamId.value, {
      page,
      per_page: pagination.value.per_page,
    });
    // Send both page_size (server) and per_page (client) for compatibility
    const resp = await ApiService.query(`teams/${selectedTeamId.value}/sites`, {
      params: {
        page,
        page_size: pagination.value.per_page,
        per_page: pagination.value.per_page,
      },
    });
    console.log("📡 Sites API Response:", resp);

    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data?.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found sites in data array:", resp.data.data);
        sites.value = resp.data.data;

        // Update pagination info but preserve user-selected per_page
        if (resp.data.pagination) {
          const currentPerPage = pagination.value.per_page; // Preserve user's choice
          const totalItems =
            resp.data.pagination.total_items ?? sites.value.length;
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
        console.log("✅ Found sites in direct data array:", resp.data);
        sites.value = resp.data;

        // Calculate pagination manually if server doesn't provide it
        const totalItems = sites.value.length;
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
        console.log("⚠️ Unexpected sites data format:", resp.data);
        sites.value = [];
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

      // Ensure pagination.total_pages consistent with per_page and total_items
      if (pagination.value.total_items == null) {
        pagination.value.total_items = sites.value.length;
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

      console.log("🎯 Final sites:", sites.value);
      console.log("📄 Pagination:", pagination.value);
    } else {
      console.log("⚠️ No valid sites response data");
      sites.value = [];
    }
  } catch (e: any) {
    console.error("❌ Error fetching sites:", e);
    sites.value = [];
  } finally {
    loading.value = false;
    console.log("📋 Sites fetch complete. Total sites:", sites.value.length);
  }
};

// Methods
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
  selectedTeamIdFilter.value = "";
  currentAccount.value = null;
  currentTeam.value = null;
  // Fetch accounts for the new organization
  await fetchAccounts();
};

// Switch account
const switchAccount = async () => {
  //   const account = accounts.value.find((a) => a.uid === selectedAccountId.value);
  // If chosen account has no teams, auto-pick the first account that has teams
  if (
    selectedAccountId.value &&
    !accountsWithTeams.value[selectedAccountId.value]
  ) {
    const firstValid = accounts.value.find(
      (a) => accountsWithTeams.value[a.uid]
    );
    selectedAccountId.value = firstValid ? firstValid.uid : "";
  }
  currentAccount.value =
    accounts.value.find((a) => a.uid === selectedAccountId.value) || null;
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value);
  }
  // Clear teams and sites when account changes
  teams.value = [];
  sites.value = [];
  selectedTeamId.value = "";
  selectedTeamIdFilter.value = "";
  currentTeam.value = null;
  // Fetch teams for the selected account
  await fetchTeams();
};

// Switch team
const switchTeam = () => {
  const team = teams.value.find((t) => t.uid === selectedTeamIdFilter.value);
  currentTeam.value = team || null;
  selectedTeamId.value = selectedTeamIdFilter.value;
  // Save the selected team to localStorage
  if (selectedTeamIdFilter.value) {
    saveLastSelectedTeam(selectedTeamIdFilter.value);
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

// Initialize data on component mount
onMounted(() => {
  fetchOrganizations();
});

// Computed properties for summary statistics
// const totalSites = computed(() => sites.value.length);
// const totalRooms = computed(() => sites.value.length); // Placeholder - API doesn't provide room count
// const totalNVRs = computed(() => sites.value.length); // Placeholder - API doesn't provide NVR count
// const totalCameras = computed(() => sites.value.length); // Placeholder - API doesn't provide camera count

// const activeSites = computed(() => sites.value.length); // All sites are considered active
// const activeSitesPercentage = computed(() => (totalSites.value > 0 ? 100 : 0));

// const roomsWithCameras = computed(() => sites.value.length); // Placeholder
// const roomsWithCamerasPercentage = computed(() =>
//   totalSites.value > 0 ? 100 : 0
// );

// const onlineNVRs = computed(() => sites.value.length); // Placeholder
// const onlineNVRsPercentage = computed(() => (totalSites.value > 0 ? 100 : 0));

// const activeCameras = computed(() => sites.value.length); // Placeholder
// const activeCamerasPercentage = computed(() =>
//   totalSites.value > 0 ? 100 : 0
// );

// Computed properties for pagination
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

// Empty table message based on current state
const selectionEmptyState = computed(() => {
  if (loadingOrganizations.value) {
    return null;
  }
  if (organizations.value.length === 0) {
    return {
      title: t("controlplane.site.emptyState.noOrganizations.title"),
      description: t("controlplane.site.emptyState.noOrganizations.description"),
    };
  }
  if (!selectedOrganizationId.value) {
    return {
      title: t("controlplane.site.emptyState.noOrganizationSelected.title"),
      description: t(
        "controlplane.site.emptyState.noOrganizationSelected.description",
      ),
    };
  }
  if (!loadingAccounts.value && !selectedAccountId.value) {
    return {
      title: t("controlplane.site.emptyState.noAccountSelected.title"),
      description: t("controlplane.site.emptyState.noAccountSelected.description"),
    };
  }
  if (!loadingTeams.value && !selectedTeamIdFilter.value) {
    return {
      title: t("controlplane.site.emptyState.noTeamSelected.title"),
      description: t("controlplane.site.emptyState.noTeamSelected.description"),
    };
  }
  return null;
});

const showSelectionEmptyState = computed(
  () => selectionEmptyState.value !== null,
);

const emptyTableMessage = computed(() => {
  if (!selectedOrganizationId.value) {
    return t("controlplane.site.empty.selectOrganization");
  }
  if (!selectedAccountId.value) {
    return t("controlplane.site.empty.selectAccount");
  }
  if (!selectedTeamIdFilter.value) {
    return t("controlplane.site.empty.selectTeam");
  }
  if (loading.value) {
    return t("controlplane.site.empty.loading");
  }
  if (searchQuery.value.trim()) {
    return t("controlplane.site.empty.searchNoResults", {
      query: searchQuery.value,
    });
  }
  return t("controlplane.site.empty.noResults");
});

// Search and Sort functionality
const filteredAndSortedSites = computed(() => {
  let filtered = sites.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        (site.description && site.description.toLowerCase().includes(query)) ||
        site.uid.toLowerCase().includes(query)
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      let aValue = a[sortLabel.value as keyof Site];
      let bValue = b[sortLabel.value as keyof Site];

      // Handle created_by object
      if (sortLabel.value === "created_by") {
        aValue = a.created_by?.username || "";
        bValue = b.created_by?.username || "";
      }

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
  const index = sites.value.findIndex((site) => site.uid === updatedSite.uid);
  if (index !== -1) {
    sites.value[index] = { ...updatedSite };
    console.log("Site updated:", updatedSite);
  }
};

const viewSiteDetails = (site: Site) => {
  // Navigate to the camera management page and pass siteId so Camera.vue can pre-filter
  router.push({
    path: "/controlplane/site/camera",
    query: { siteId: site.uid },
  });
};

const deleteSite = async (site: Site) => {
  const confirmationMessage = t("controlplane.site.dialogs.confirmDelete", {
    name: site.name,
  });
  if (!confirm(confirmationMessage)) {
    return;
  }

  loading.value = true;

  try {
    console.log("Deleting site UID:", site.uid);

    // DELETE using sites/{site_uid}
    await ApiService.delete(`sites/${site.uid}`);

    // Remove site from local state
    sites.value = sites.value.filter((s) => s.uid !== site.uid);

    // Update pagination if needed
    const newTotal = sites.value.length;
    pagination.value.total_items = newTotal;
    pagination.value.total_pages = Math.max(
      1,
      Math.ceil(newTotal / pagination.value.per_page)
    );

    // If current page becomes empty, go to previous page
    if (sites.value.length === 0 && pagination.value.page > 1) {
      fetchSites(pagination.value.page - 1);
    }
  } catch (error) {
    console.error("Error deleting site:", error);
    alert(t("controlplane.site.notifications.deleteFailed"));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Show prohibition cursor on disabled options in the account dropdown */
.form-select option:disabled {
  color: var(--bs-gray-500);
  cursor: not-allowed;
}
</style>
