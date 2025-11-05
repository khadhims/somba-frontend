<template>
  <!--begin::Site Overview-->
  <!--begin::Organization, Account & Team Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Site Management</h4>
          <p class="text-muted mb-0">
            Manage sites {{ currentTeam ? `for team ${currentTeam.name}` : 'for your team' }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <!-- Organization Dropdown -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">Organization:</label>
              <select
                v-model="selectedOrganizationId"
                @change="switchOrganization"
                class="form-select form-select-solid w-200px"
                :disabled="loadingOrganizations"
              >
                <option value="" disabled>
                  {{ loadingOrganizations ? 'Loading organizations...' : 'Select Organization' }}
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
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            
            <!-- Account Dropdown -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">Account:</label>
              <select
                v-model="selectedAccountId"
                @change="switchAccount"
                class="form-select form-select-solid w-200px"
                :disabled="loadingAccounts || !selectedOrganizationId || accounts.length === 0"
              >
                <option value="" disabled>
                  <span v-if="!selectedOrganizationId">Select organization first</span>
                  <span v-else-if="loadingAccounts">Loading accounts...</span>
                  <span v-else-if="accounts.length === 0">No accounts available</span>
                  <span v-else>Select Account</span>
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
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            
            <!-- Team Dropdown -->
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">Team:</label>
              <select
                v-model="selectedTeamId"
                @change="switchTeam"
                class="form-select form-select-solid w-200px"
                :disabled="loadingTeams || !selectedAccountId || teams.length === 0"
              >
                <option value="" disabled>
                  <span v-if="!selectedAccountId">Select account first</span>
                  <span v-else-if="loadingTeams">Loading teams...</span>
                  <span v-else-if="teams.length === 0">No teams available</span>
                  <span v-else>Select Team</span>
                </option>
                <option
                  v-for="team in teams"
                  :key="team.uid"
                  :value="team.uid"
                >
                  {{ team.name }}
                </option>
              </select>
              
              <!-- Loading spinner for teams -->
              <div v-if="loadingTeams" class="ms-2">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization, Account & Team Switcher-->

  <!--begin::Error Alert-->
  <div v-if="error" class="alert alert-danger d-flex align-items-center mb-5" role="alert">
    <i class="ki-duotone ki-cross-circle fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="d-flex flex-column">
      <h5 class="mb-1">Error Loading Data</h5>
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

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <div class="card bg-body hoverable card-xl-stretch mb-xl-8">
        <div class="card-body">
          <i class="ki-duotone ki-abstract-39 fs-2x text-gray-600 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="text-gray-900 fw-bold fs-2 mb-2 me-5">
            {{ totalSites }}
          </div>
          <div class="fw-semibold text-gray-400">
            Total Sites
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card bg-body hoverable card-xl-stretch mb-xl-8">
        <div class="card-body">
          <i class="ki-duotone ki-abstract-35 fs-2x text-gray-600 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="text-gray-900 fw-bold fs-2 mb-2 me-5">
            {{ activeSites }}
          </div>
          <div class="fw-semibold text-gray-400">
            Active Sites
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card bg-body hoverable card-xl-stretch mb-xl-8">
        <div class="card-body">
          <i class="ki-duotone ki-abstract-34 fs-2x text-gray-600 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="text-gray-900 fw-bold fs-2 mb-2 me-5">
            {{ totalVisitors }}
          </div>
          <div class="fw-semibold text-gray-400">
            Total Visitors
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card bg-body hoverable card-xl-stretch mb-xl-8">
        <div class="card-body">
          <i class="ki-duotone ki-abstract-41 fs-2x text-gray-600 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="text-gray-900 fw-bold fs-2 mb-2 me-5">
            {{ avgPerformance }}%
          </div>
          <div class="fw-semibold text-gray-400">
            Avg Performance
          </div>
        </div>
      </div>
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
        <!--begin::Items per page-->
        <div class="d-flex align-items-center me-5">
          <label class="form-label fs-6 fw-semibold text-gray-700 me-2 mb-0">Items:</label>
          <select 
            class="form-select form-select-sm w-auto" 
            v-model="pagination.per_page"
            @change="changeItemsPerPage"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
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
            placeholder="Search sites..."
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddSiteModal"
          class="btn btn-sm btn-light-primary"
          :disabled="!selectedTeamId"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Site
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
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
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-primary text-primary fw-bold">
                {{ row.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{ row.name }}</span>
            </div>
          </div>
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
            formatDate(row.created_at)
          }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editSite(row)"
              title="Edit Site"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteSite(row)"
              title="Delete Site"
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
      <div class="d-flex flex-stack flex-wrap pt-10" v-if="!loading && sites.length >= 0">
        <div class="d-flex align-items-center">
          <div class="fs-6 fw-semibold text-gray-700 me-5">
            Showing {{ ((pagination.page - 1) * pagination.per_page) + 1 }} to 
            {{ Math.min(pagination.page * pagination.per_page, pagination.total_items) }} of 
            {{ pagination.total_items }} entries
          </div>
          
          <div class="d-flex align-items-center">
            <span class="text-gray-700 me-2">Items per page:</span>
            <span class="badge badge-light fs-6">{{ pagination.per_page }}</span>
          </div>
        </div>
        
        <ul class="pagination">
          <!-- Previous button -->
          <li class="page-item" :class="{ disabled: pagination.page <= 1 }">
            <button 
              class="page-link" 
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
            >
              Previous
            </button>
          </li>
          
          <!-- Page numbers -->
          <li 
            v-for="page in visiblePages" 
            :key="page" 
            class="page-item" 
            :class="{ active: page === pagination.page }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          
          <!-- Next button -->
          <li class="page-item" :class="{ disabled: pagination.page >= Math.max(1, pagination.total_pages) }">
            <button 
              class="page-link" 
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page >= Math.max(1, pagination.total_pages)"
            >
              Next
            </button>
          </li>
        </ul>
      </div>
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Sites List-->

  <!-- Add Site Modal -->
  <div class="modal fade" id="addSiteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Site</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="createSite">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Site Name *</label>
                <input type="text" class="form-control" v-model="newSite.name" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
              Create Site
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Edit Site Modal -->
  <div class="modal fade" id="editSiteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Site</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="updateSite" v-if="siteToEdit">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Site Name *</label>
                <input type="text" class="form-control" v-model="siteToEdit.name" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="editing">
              <span v-if="editing" class="spinner-border spinner-border-sm me-2"></span>
              Update Site
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="deleteSiteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Site</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete site <strong>{{ siteToDelete?.name }}</strong>?</p>
          <p class="text-muted">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="deleting">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Modal } from 'bootstrap'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'
import ApiService from '@/core/services/ApiService'

// Interface definitions
interface Site {
  uid: string
  name: string
  team_uid?: string
  created_by?: {
    username: string
    email: string
  }
  created_at: string
  updated_at: string
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

// Reactive data
const sites = ref<Site[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortLabel = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Pagination state
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null,
  prev_page: null,
})

// Organization-related reactive data
const organizations = ref<Organization[]>([])
const loadingOrganizations = ref(false)
const selectedOrganizationId = ref('')
const currentOrganization = ref<Organization | null>(null)

// Account-related reactive data
const accounts = ref<Account[]>([])
const loadingAccounts = ref(false)
const selectedAccountId = ref('')
const currentAccount = ref<Account | null>(null)

// Team-related reactive data
const teams = ref<Team[]>([])
const loadingTeams = ref(false)
const selectedTeamId = ref('')
const currentTeam = ref<Team | null>(null)

// Modal states
const creating = ref(false)
const deleting = ref(false)
const editing = ref(false)
const newSite = ref<Partial<Site>>({
  name: '',
})
const siteToEdit = ref<Site | null>(null)
const siteToDelete = ref<Site | null>(null)

// Table header configuration
const tableHeader = ref([
  { columnName: 'Site Name', columnLabel: 'name', sortEnabled: true, searchable: true },
  { columnName: 'Created By', columnLabel: 'created_by', sortEnabled: false, searchable: false },
  { columnName: 'Created', columnLabel: 'created_at', sortEnabled: true, searchable: false },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false, searchable: false }
])

// Get route instance to read query parameters
const route = useRoute()

// LocalStorage functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem('lastSelectedOrganization', orgId)
}

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem('lastSelectedOrganization')
}

const saveLastSelectedAccount = (accountId: string) => {
  localStorage.setItem('lastSelectedAccount', accountId)
}

const loadLastSelectedAccount = (): string | null => {
  return localStorage.getItem('lastSelectedAccount')
}

const saveLastSelectedTeam = (teamId: string) => {
  localStorage.setItem('lastSelectedTeam', teamId)
}

const loadLastSelectedTeam = (): string | null => {
  return localStorage.getItem('lastSelectedTeam')
}

// Fetch organizations from API
const fetchOrganizations = async () => {
  loadingOrganizations.value = true
  try {
    console.log("🚀 Fetching organizations...");
    const resp = await ApiService.query("organizations", {})
    console.log("📡 Organizations API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
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
      const orgIdFromUrl = route.query.orgId as string
      const accountIdFromUrl = route.query.accountId as string
      const teamIdFromUrl = route.query.teamId as string
      
      if (orgIdFromUrl) {
        const orgFromUrl = organizations.value.find(o => o.uid === orgIdFromUrl)
        if (orgFromUrl) {
          selectedOrganizationId.value = orgFromUrl.uid
          currentOrganization.value = orgFromUrl
          saveLastSelectedOrganization(orgFromUrl.uid)
          await fetchAccounts()
          
          if (accountIdFromUrl && accounts.value.find(a => a.uid === accountIdFromUrl)) {
            selectedAccountId.value = accountIdFromUrl
            currentAccount.value = accounts.value.find(a => a.uid === accountIdFromUrl) || null
            saveLastSelectedAccount(accountIdFromUrl)
            await fetchTeams()
            
            if (teamIdFromUrl && teams.value.find(t => t.uid === teamIdFromUrl)) {
              selectedTeamId.value = teamIdFromUrl
              currentTeam.value = teams.value.find(t => t.uid === teamIdFromUrl) || null
              saveLastSelectedTeam(teamIdFromUrl)
              fetchSites(pagination.value.page)
            }
          }
        }
      } else if (organizations.value.length > 0) {
        // Use last selected or first organization
        const lastSelectedOrgId = loadLastSelectedOrganization()
        if (lastSelectedOrgId) {
          const lastOrg = organizations.value.find(o => o.uid === lastSelectedOrgId)
          if (lastOrg) {
            selectedOrganizationId.value = lastOrg.uid
            currentOrganization.value = lastOrg
          }
        } else {
          selectedOrganizationId.value = organizations.value[0].uid
          currentOrganization.value = organizations.value[0]
          saveLastSelectedOrganization(organizations.value[0].uid)
        }
        await fetchAccounts()
      }
    }
  } catch (e: any) {
    console.error('Failed to load organizations:', e)
    error.value = "Failed to load organizations. Please refresh the page."
  } finally {
    loadingOrganizations.value = false
  }
}

// Fetch accounts from API
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return

  loadingAccounts.value = true
  try {
    console.log("🚀 Fetching accounts for organization:", selectedOrganizationId.value);
    const resp = await ApiService.query(`organizations/${selectedOrganizationId.value}/accounts`, {})
    console.log("📡 Accounts API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
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
        const lastSelectedAccountId = loadLastSelectedAccount()
        if (lastSelectedAccountId) {
          const lastAccount = accounts.value.find(a => a.uid === lastSelectedAccountId)
          if (lastAccount) {
            selectedAccountId.value = lastAccount.uid
            currentAccount.value = lastAccount
          }
        } else {
          selectedAccountId.value = accounts.value[0].uid
          currentAccount.value = accounts.value[0]
          saveLastSelectedAccount(accounts.value[0].uid)
        }
        fetchTeams()
      }
    }
  } catch (e: any) {
    console.error('Failed to load accounts:', e)
    error.value = "Failed to load accounts for selected organization."
  } finally {
    loadingAccounts.value = false
  }
}

// Fetch teams from API
const fetchTeams = async () => {
  if (!selectedAccountId.value) return

  loadingTeams.value = true
  try {
    console.log("🚀 Fetching teams for account:", selectedAccountId.value);
    const resp = await ApiService.query(`accounts/${selectedAccountId.value}/teams`, {})
    console.log("📡 Teams API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
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
        const lastSelectedTeamId = loadLastSelectedTeam()
        if (lastSelectedTeamId) {
          const lastTeam = teams.value.find(t => t.uid === lastSelectedTeamId)
          if (lastTeam) {
            selectedTeamId.value = lastTeam.uid
            currentTeam.value = lastTeam
          }
        } else {
          selectedTeamId.value = teams.value[0].uid
          currentTeam.value = teams.value[0]
          saveLastSelectedTeam(teams.value[0].uid)
        }
        fetchSites(pagination.value.page)
      }
    }
  } catch (e: any) {
    console.error('Failed to load teams:', e)
    error.value = "Failed to load teams for selected account."
  } finally {
    loadingTeams.value = false
  }
}

// Fetch sites from API
const fetchSites = async (page: number = 1) => {
  if (!selectedTeamId.value) return

  loading.value = true
  error.value = null
  try {
    console.log("🚀 Fetching sites for team:", selectedTeamId.value);
    const resp = await ApiService.query(`teams/${selectedTeamId.value}/sites`, {
      params: { page, per_page: pagination.value.per_page }
    })
    console.log("📡 Sites API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found sites in data array:", resp.data.data);
        sites.value = resp.data.data;
        
        // Update pagination info
        if (resp.data.pagination) {
          pagination.value = resp.data.pagination;
        }
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found sites in direct data array:", resp.data);
        sites.value = resp.data;
      } else {
        console.log("⚠️ Unexpected sites data format:", resp.data);
        sites.value = [];
      }
      
      // Format created_at for each site
      sites.value.forEach(site => {
        if (site.created_at && typeof site.created_at === 'string') {
          site.created_at = new Date(site.created_at).toLocaleDateString()
        }
      })
      
      console.log("🎯 Final sites:", sites.value);
      console.log("📄 Pagination:", pagination.value);
    } else {
      console.log("⚠️ No valid sites response data");
      sites.value = []
    }
  } catch (e: any) {
    console.error('❌ Error fetching sites:', e)
    error.value = e?.response?.data?.message || e.message || "Failed to load sites"
  } finally {
    loading.value = false
    console.log("📋 Sites fetch complete. Total sites:", sites.value.length);
  }
}

// Methods
const handleSort = (sort: { label: string; order: 'asc' | 'desc' }) => {
  sortLabel.value = sort.label
  sortOrder.value = sort.order
}

const switchOrganization = async () => {
  const org = organizations.value.find(o => o.uid === selectedOrganizationId.value)
  currentOrganization.value = org || null
  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value)
  }
  // Clear accounts, teams and sites when organization changes
  accounts.value = []
  teams.value = []
  sites.value = []
  selectedAccountId.value = ''
  selectedTeamId.value = ''
  currentAccount.value = null
  currentTeam.value = null
  // Fetch accounts for the new organization
  await fetchAccounts()
}

const switchAccount = async () => {
  const account = accounts.value.find(a => a.uid === selectedAccountId.value)
  currentAccount.value = account || null
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value)
  }
  // Clear teams and sites when account changes
  teams.value = []
  sites.value = []
  selectedTeamId.value = ''
  currentTeam.value = null
  // Fetch teams for the selected account
  await fetchTeams()
}

const switchTeam = () => {
  const team = teams.value.find(t => t.uid === selectedTeamId.value)
  currentTeam.value = team || null
  // Save the selected team to localStorage
  if (selectedTeamId.value) {
    saveLastSelectedTeam(selectedTeamId.value)
  }
  // Fetch sites for the selected team
  fetchSites(pagination.value.page)
}

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchSites(page)
  }
}

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchSites(1)
}

const visiblePages = computed((): number[] => {
  const current = pagination.value.page
  const total = Math.max(1, pagination.value.total_pages)
  const pages: number[] = []
  
  // Show max 5 page numbers
  const maxVisible = 5
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Empty table message based on current state
const emptyTableMessage = computed(() => {
  if (!selectedOrganizationId.value) {
    return "Please select an organization to view sites"
  }
  if (!selectedAccountId.value) {
    return "Please select an account to view sites"
  }
  if (!selectedTeamId.value) {
    return "Please select a team to view sites"
  }
  if (loading.value) {
    return "Loading sites..."
  }
  if (searchQuery.value.trim()) {
    return `No sites found matching "${searchQuery.value}"`
  }
  return "No sites found for this team"
})

// CRUD Operations
const showAddSiteModal = () => {
  // Reset form
  newSite.value = {
    name: '',
  }
  // Show modal using Bootstrap
  const modal = document.getElementById('addSiteModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const createSite = async () => {
  if (!newSite.value.name || !selectedTeamId.value) return

  const siteData = {
    ...newSite.value,
  }

  creating.value = true
  try {
    const resp = await ApiService.post(`teams/${selectedTeamId.value}/sites`, siteData)
    if (resp && resp.data) {
      // Refresh the sites list
      await fetchSites(pagination.value.page)
      
      // Hide modal
      const modal = document.getElementById('addSiteModal')
      if (modal) {
        const bsModal = Modal.getInstance(modal)
        bsModal?.hide()
      }
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to create site"
  } finally {
    creating.value = false
  }
}

const deleteSite = (site: Site) => {
  siteToDelete.value = site
  // Show delete confirmation modal
  const modal = document.getElementById('deleteSiteModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const confirmDelete = async () => {
  if (!siteToDelete.value) return

  deleting.value = true
  try {
    await ApiService.delete(`sites/${siteToDelete.value.uid}`)
    // Refresh the sites list
    await fetchSites(pagination.value.page)
    // Hide modal
    const modal = document.getElementById('deleteSiteModal')
    if (modal) {
      const bsModal = Modal.getInstance(modal)
      bsModal?.hide()
    }
    siteToDelete.value = null
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to delete site"
  } finally {
    deleting.value = false
  }
}

const editSite = (site: Site) => {
  siteToEdit.value = { ...site } // Create a copy to avoid direct mutation
  // Show edit modal using Bootstrap
  const modal = document.getElementById('editSiteModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const updateSite = async () => {
  if (!siteToEdit.value || !siteToEdit.value.name?.trim()) return

  editing.value = true
  try {
    const resp = await ApiService.patch(`sites/${siteToEdit.value.uid}`, {
      name: siteToEdit.value.name
    })
    if (resp && resp.data) {
      // Refresh the sites list
      await fetchSites(pagination.value.page)
      
      // Hide modal
      const modal = document.getElementById('editSiteModal')
      if (modal) {
        const bsModal = Modal.getInstance(modal)
        bsModal?.hide()
      }
      siteToEdit.value = null
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to update site"
  } finally {
    editing.value = false
  }
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : '-'
}

// Computed properties for summary statistics
const totalSites = computed(() => sites.value.length)
const activeSites = computed(() => sites.value.length) // All sites are considered active for now
const totalVisitors = computed(() => sites.value.reduce((sum, site) => sum + Math.floor(Math.random() * 1000) + 100, 0))
const avgPerformance = computed(() => Math.floor(Math.random() * 30) + 70)

// Search and Sort functionality
const filteredAndSortedSites = computed(() => {
  let filtered = sites.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(site =>
      site.name.toLowerCase().includes(query)
    )
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Site]
      const bValue = b[sortLabel.value as keyof Site]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder.value === 'asc' ? comparison : -comparison
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue
        return sortOrder.value === 'asc' ? comparison : -comparison
      }
      return 0
    })
  }

  return filtered
})

// Initialize
onMounted(() => {
  fetchOrganizations()
})
</script>
