<template>
  <!--begin::Site Overview-->
  <!--begin::Account & Team Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Site Management</h4>
          <p class="text-muted mb-0">
            Manage sites {{ currentTeam ? `for ${currentTeam.name}` : 'for your team' }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <!-- Organization dropdown -->
            <div class="d-flex align-items-center" v-if="organizations.length > 0">
              <label class="form-label me-3 mb-0 fw-semibold">Organization:</label>
              <select
                v-model="selectedOrganizationId"
                @change="switchOrganization"
                class="form-select form-select-solid w-200px"
                :disabled="loadingOrganizations"
              >
                <option
                  v-for="org in organizations"
                  :key="org.uid"
                  :value="org.uid"
                >
                  {{ org.name }}
                </option>
              </select>
            </div>

            <!-- Account dropdown -->
            <div class="d-flex align-items-center" v-if="accounts.length > 0">
              <label class="form-label me-3 mb-0 fw-semibold">Account:</label>
              <select
                v-model="selectedAccountId"
                @change="switchAccount"
                class="form-select form-select-solid w-200px"
                :disabled="loadingAccounts"
              >
                <option
                  v-for="account in accounts"
                  :key="account.uid"
                  :value="account.uid"
                  :disabled="!accountsWithTeams[account.uid]"
                  :title="!accountsWithTeams[account.uid] ? 'No teams in this account' : ''"
                >
                  {{ account.name }}
                </option>
              </select>
            </div>

            <!-- Team dropdown -->
            <div class="d-flex align-items-center" v-if="teams.length > 0">
              <label class="form-label me-3 mb-0 fw-semibold">Team:</label>
              <select
                v-model="selectedTeamIdFilter"
                @change="switchTeam"
                class="form-select form-select-solid w-200px"
                :disabled="loadingTeams"
              >
                <option
                  v-for="team in teams"
                  :key="team.uid"
                  :value="team.uid"
                >
                  {{ team.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Account & Team Switcher-->

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

        <button @click="showAddSiteModal" class="btn btn-sm btn-light-primary" :disabled="!selectedTeamIdFilter">
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

        <template v-slot:description="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{
            row.description || 'No description'
          }}</span>
        </template>

        <template v-slot:created_by="{ row }">
          <span class="text-dark fw-bold d-block fs-6">
            {{ row.created_by?.username || 'Unknown' }}
          </span>
          <span class="text-muted fw-semibold text-muted d-block fs-7">
            {{ row.created_by?.email || '' }}
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
              title="View Site Details"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
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
  <AddSiteModal ref="addSiteModalRef" :team-uid="selectedTeamIdFilter" @site-added="onSiteAdded" />

  <!-- Edit Site Modal -->
  <EditSiteModal ref="editSiteModalRef" @site-updated="onSiteUpdated" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import AddSiteModal from "@/components/modals/forms/AddSiteModal.vue";
import EditSiteModal from "@/components/modals/forms/EditSiteModal.vue";
import ApiService from "@/core/services/ApiService";

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
  uid: string
  name: string
  account_uid?: string
  created_by?: {
    username: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface Account {
  uid: string
  name: string
  organization_uid?: string
  created_by?: {
    username: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface Organization {
  uid: string
  name: string
  legalName?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  country?: string
  status?: 'active' | 'inactive'
  created_at: string
  updated_at?: string
  created_by?: {
    username: string
    email: string
  }
  description?: string
}

// Get route instance to read query parameters
const route = useRoute();

// Reactive data
const sites = ref<Site[]>([]);
const loading = ref(false);
const error = ref<string | null>(null)
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");
const selectedTeamId = ref("");
const addSiteModalRef = ref();
const editSiteModalRef = ref();

// Organization-related reactive data
const organizations = ref<Organization[]>([])
const loadingOrganizations = ref(false)
const selectedOrganizationId = ref('')
const currentOrganization = ref<Organization | null>(null)

// Account-related reactive data
const accounts = ref<Account[]>([]);
const loadingAccounts = ref(false);
const selectedAccountId = ref('');
const currentAccount = ref<Account | null>(null);
const teamsCache = ref<Record<string, Team[]>>({})
const accountsWithTeams = ref<Record<string, boolean>>({})

// Team-related reactive data
const teams = ref<Team[]>([]);
const loadingTeams = ref(false);
const selectedTeamIdFilter = ref('');
const currentTeam = ref<Team | null>(null);

// Table header configuration
const tableHeader = ref([
  {
    columnName: "Site Name",
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Description",
    columnLabel: "description",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Created By",
    columnLabel: "created_by",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: "Created At",
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

// Fetch sites from API
const fetchSites = async () => {
  const teamId = selectedTeamIdFilter.value
  if (!teamId) return

  loading.value = true;
  error.value = null;
  try {
    const resp = await ApiService.query(`teams/${teamId}/sites`, {})
    if (resp && resp.data) {
      sites.value = resp.data
      // Format created_at for each site
      sites.value.forEach(site => {
        if (site.created_at && typeof site.created_at === 'string') {
          site.created_at = new Date(site.created_at).toLocaleDateString()
        }
      })
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to load sites"
  } finally {
    loading.value = false
  }
};

// Fetch organizations from API
const fetchOrganizations = async () => {
  loadingOrganizations.value = true
  try {
    const resp = await ApiService.query('organizations', {})
    const data = resp?.data?.data || resp?.data || []
    organizations.value = data

    // Check URL for orgId
    const orgIdFromUrl = route.query.orgId as string
    if (orgIdFromUrl && organizations.value.find(o => o.uid === orgIdFromUrl)) {
      selectedOrganizationId.value = orgIdFromUrl
      currentOrganization.value = organizations.value.find(o => o.uid === orgIdFromUrl) || null
      saveLastSelectedOrganization(orgIdFromUrl)
    } else {
      const lastOrgId = loadLastSelectedOrganization()
      if (lastOrgId && organizations.value.find(o => o.uid === lastOrgId)) {
        selectedOrganizationId.value = lastOrgId
        currentOrganization.value = organizations.value.find(o => o.uid === lastOrgId) || null
      } else if (organizations.value.length > 0) {
        selectedOrganizationId.value = organizations.value[0].uid
        currentOrganization.value = organizations.value[0]
        saveLastSelectedOrganization(organizations.value[0].uid)
      }
    }

    // With organization selected, fetch accounts
    if (selectedOrganizationId.value) {
      await fetchAccounts()
    }
  } catch (e) {
    console.error('Failed to load organizations:', e)
    organizations.value = []
  } finally {
    loadingOrganizations.value = false
  }
}

// Fetch accounts (or, if accountId provided via route, fetch teams for that account)
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return;
  loadingAccounts.value = true;
  try {
    const accountsResp = await ApiService.query(`organizations/${selectedOrganizationId.value}/accounts`, {});
    const allAccounts: Account[] = accountsResp.data?.data || accountsResp.data || [];

    // Probe teams for each account and record capability
    teamsCache.value = {}
    accountsWithTeams.value = {}
    for (const acc of allAccounts) {
      try {
        const tResp = await ApiService.query(`accounts/${acc.uid}/teams`, {})
        const tData: Team[] = tResp.data?.data || tResp.data || []
        teamsCache.value[acc.uid] = tData
        accountsWithTeams.value[acc.uid] = tData.length > 0
      } catch (e) {
        accountsWithTeams.value[acc.uid] = false
      }
    }
    accounts.value = allAccounts

    // Auto-select account
    if (accounts.value.length > 0) {
      const lastAccountId = loadLastSelectedAccount();
      const accountFromUrl = route.query.accountId as string;

      if (accountFromUrl && accounts.value.find(a => a.uid === accountFromUrl) && accountsWithTeams.value[accountFromUrl]) {
        selectedAccountId.value = accountFromUrl;
        saveLastSelectedAccount(accountFromUrl);
      } else if (lastAccountId && accounts.value.find(a => a.uid === lastAccountId) && accountsWithTeams.value[lastAccountId]) {
        selectedAccountId.value = lastAccountId;
      } else {
        const firstValid = accounts.value.find(a => accountsWithTeams.value[a.uid])
        selectedAccountId.value = firstValid ? firstValid.uid : '';
        if (firstValid) saveLastSelectedAccount(firstValid.uid);
      }

      // Set current account
      const account = accounts.value.find(a => a.uid === selectedAccountId.value);
      currentAccount.value = account || null;

      // Fetch teams for the selected account
      if (selectedAccountId.value) {
        fetchTeams();
      } else {
        // No valid account with teams — clear downstream
        teams.value = []
        sites.value = []
        selectedTeamIdFilter.value = ''
        currentTeam.value = null
      }
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
    accounts.value = [];
  } finally {
    loadingAccounts.value = false;
  }
};

// Fetch teams for selected account
const fetchTeams = async () => {
  if (!selectedAccountId.value) return;

  loadingTeams.value = true;
  try {
    // Use cache when available to avoid refetching and to ensure accounts without teams are excluded
    const cached = teamsCache.value[selectedAccountId.value]
    if (cached) {
      teams.value = cached
    } else {
      const response = await ApiService.query(`accounts/${selectedAccountId.value}/teams`, {});
      teams.value = response.data.data || response.data;
      teamsCache.value[selectedAccountId.value] = teams.value
    }

    // Auto-select team
    if (teams.value.length > 0) {
      const lastTeamId = loadLastSelectedTeam();
      const teamFromUrl = route.query.teamId as string;

      if (teamFromUrl && teams.value.find(t => t.uid === teamFromUrl)) {
        selectedTeamIdFilter.value = teamFromUrl;
        saveLastSelectedTeam(teamFromUrl);
      } else if (lastTeamId && teams.value.find(t => t.uid === lastTeamId)) {
        selectedTeamIdFilter.value = lastTeamId;
      } else {
        selectedTeamIdFilter.value = teams.value[0].uid;
        saveLastSelectedTeam(teams.value[0].uid);
      }

      // Set current team
      const team = teams.value.find(t => t.uid === selectedTeamIdFilter.value);
      currentTeam.value = team || null;

      // Fetch sites for the selected team
      fetchSites();
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    teams.value = [];
  } finally {
    loadingTeams.value = false;
  }
};

// Switch account
const switchAccount = () => {
  const account = accounts.value.find(a => a.uid === selectedAccountId.value);
  // If chosen account has no teams, auto-pick the first account that has teams
  if (selectedAccountId.value && !accountsWithTeams.value[selectedAccountId.value]) {
    const firstValid = accounts.value.find(a => accountsWithTeams.value[a.uid])
    selectedAccountId.value = firstValid ? firstValid.uid : ''
  }
  currentAccount.value = accounts.value.find(a => a.uid === selectedAccountId.value) || null;
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value);
  }
  // Clear teams and sites when account changes
  teams.value = [];
  sites.value = [];
  selectedTeamIdFilter.value = '';
  currentTeam.value = null;
  // Fetch teams for the selected account
  if (selectedAccountId.value) {
    fetchTeams();
  }
};

// Switch organization
const switchOrganization = () => {
  const org = organizations.value.find(o => o.uid === selectedOrganizationId.value)
  currentOrganization.value = org || null
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value)
  }
  // Clear lower-level selections
  accounts.value = []
  teams.value = []
  sites.value = []
  selectedAccountId.value = ''
  selectedTeamIdFilter.value = ''
  currentAccount.value = null
  currentTeam.value = null
  // Fetch accounts for new organization
  fetchAccounts()
}

// Switch team
const switchTeam = () => {
  const team = teams.value.find(t => t.uid === selectedTeamIdFilter.value);
  currentTeam.value = team || null;
  // Save the selected team to localStorage
  if (selectedTeamIdFilter.value) {
    saveLastSelectedTeam(selectedTeamIdFilter.value);
  }
  // Fetch sites for the selected team
  fetchSites();
};

// LocalStorage helper functions
const saveLastSelectedAccount = (accountId: string) => {
  localStorage.setItem('siteLastSelectedAccount', accountId);
};

const loadLastSelectedAccount = (): string | null => {
  return localStorage.getItem('siteLastSelectedAccount');
};

const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem('siteLastSelectedOrganization', orgId)
}

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem('siteLastSelectedOrganization')
}

const saveLastSelectedTeam = (teamId: string) => {
  localStorage.setItem('siteLastSelectedTeam', teamId);
};

const loadLastSelectedTeam = (): string | null => {
  return localStorage.getItem('siteLastSelectedTeam');
};

// Initialize data on component mount
onMounted(() => {
  fetchOrganizations();
});

// Computed properties for summary statistics
const totalSites = computed(() => sites.value.length);
const totalRooms = computed(() => sites.value.length); // Placeholder - API doesn't provide room count
const totalNVRs = computed(() => sites.value.length); // Placeholder - API doesn't provide NVR count
const totalCameras = computed(() => sites.value.length); // Placeholder - API doesn't provide camera count

const activeSites = computed(() => sites.value.length); // All sites are considered active
const activeSitesPercentage = computed(() =>
  totalSites.value > 0 ? 100 : 0
);

const roomsWithCameras = computed(() => sites.value.length); // Placeholder
const roomsWithCamerasPercentage = computed(() =>
  totalSites.value > 0 ? 100 : 0
);

const onlineNVRs = computed(() => sites.value.length); // Placeholder
const onlineNVRsPercentage = computed(() =>
  totalSites.value > 0 ? 100 : 0
);

const activeCameras = computed(() => sites.value.length); // Placeholder
const activeCamerasPercentage = computed(() =>
  totalSites.value > 0 ? 100 : 0
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
      if (sortLabel.value === 'created_by') {
        aValue = a.created_by?.username || '';
        bValue = b.created_by?.username || '';
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
  console.log("Viewing site details for:", site);
  // Navigate to site details or open modal
};
</script>

<style scoped>
/* Show prohibition cursor on disabled options in the account dropdown */
.form-select option:disabled {
  color: var(--bs-gray-500);
  cursor: not-allowed;
}
</style>
