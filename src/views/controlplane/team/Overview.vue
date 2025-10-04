<template>
  <!--begin::Team Overview-->
  <!--begin::Organization & Account Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-4">
          <h4 class="card-title mb-0">Team Management</h4>
          <p class="text-muted mb-0">
            Manage teams {{ currentAccount ? `for ${currentAccount.name}` : 'for your account' }}
          </p>
        </div>
        <div class="col-md-8">
          <div class="d-flex justify-content-end gap-3">
            <div class="d-flex align-items-center">
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
                >
                  {{ account.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization & Account Switcher-->

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
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
  </div>
  <!--end::Summary Cards-->

  <!--begin::Teams List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Teams Overview</h3>
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
            placeholder="Search teams..."
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddTeamModal"
          class="btn btn-sm btn-light-primary"
          :disabled="!selectedAccountId"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Team
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedTeams"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="10"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No teams found"
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
              @click="openMembersModal(row)"
              title="View Members"
            >
              <i class="ki-duotone ki-profile-user fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </button>
            <router-link
              :to="{ name: 'site-overview', query: { account_id: selectedAccountId } }"
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              title="Add Site"
            >
              <i class="ki-duotone ki-home fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editTeam(row)"
              title="Edit Team Name"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteTeam(row)"
              title="Delete Team"
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
  <!--end::Teams List-->

  <!-- Add Team Modal -->
  <div class="modal fade" id="addTeamModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Team</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="createTeam">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Team Name *</label>
                <input type="text" class="form-control" v-model="newTeam.name" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
              Create Team
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
          <h5 class="modal-title">Edit Team</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="teamToEdit = null"></button>
        </div>
        <form @submit.prevent="updateTeam" v-if="teamToEdit">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Team Name *</label>
                <input type="text" class="form-control" v-model="teamToEdit.name" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" @click="teamToEdit = null">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="editing">
              <span v-if="editing" class="spinner-border spinner-border-sm me-2"></span>
              Update Team
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
          <h5 class="modal-title">Delete Team</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete team <strong>{{ teamToDelete?.name }}</strong>?</p>
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

  <!-- Team Members Modal Component -->
  <TeamMembersModal ref="membersModalRef" @add-member="handleAddMember" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Modal } from 'bootstrap'
import Widget1 from '@/components/dashboard-default-widgets/Widget1.vue'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'
import ApiService from '@/core/services/ApiService'
import TeamMembersModal from '@/components/modals/general/TeamMembersModal.vue'

// Interface definitions
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

const teams = ref<Team[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortLabel = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

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

// Modal states
const creating = ref(false)
const deleting = ref(false)
const editing = ref(false)
const newTeam = ref<Partial<Team>>({
  name: '',
})
const teamToEdit = ref<Team | null>(null)
const teamToDelete = ref<Team | null>(null)

// Team members modal component ref
const membersModalRef = ref<InstanceType<typeof TeamMembersModal> | null>(null)

// Table header configuration
const tableHeader = ref([
  { columnName: 'Team Name', columnLabel: 'name', sortEnabled: true, searchable: true },
  { columnName: 'Created By', columnLabel: 'created_by', sortEnabled: false, searchable: false },
  { columnName: 'Created', columnLabel: 'created_at', sortEnabled: true, searchable: false },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false, searchable: false }
])

// Get route instance to read query parameters
const route = useRoute()

// Organization-related functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem('lastSelectedOrganization', orgId)
}

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem('lastSelectedOrganization')
}

// Account-related functions
const saveLastSelectedAccount = (accountId: string) => {
  localStorage.setItem('lastSelectedAccount', accountId)
}

const loadLastSelectedAccount = (): string | null => {
  return localStorage.getItem('lastSelectedAccount')
}

// Fetch organizations from API
const fetchOrganizations = async () => {
  loadingOrganizations.value = true
  try {
    const resp = await ApiService.query("organizations", {})
    if (resp && resp.data) {
      organizations.value = resp.data
      
      // Check if orgId is provided in URL query parameters
      const orgIdFromUrl = route.query.orgId as string
      
      if (orgIdFromUrl) {
        // Find the organization by the provided orgId
        const orgFromUrl = organizations.value.find(o => o.uid === orgIdFromUrl)
        if (orgFromUrl) {
          selectedOrganizationId.value = orgFromUrl.uid
          currentOrganization.value = orgFromUrl
          // Save this as the last selected organization
          saveLastSelectedOrganization(orgFromUrl.uid)
          // Fetch accounts for the selected organization
          fetchAccounts()
        } else {
          // If orgId not found, try to use last selected organization
          const lastSelectedOrgId = loadLastSelectedOrganization()
          if (lastSelectedOrgId) {
            const lastOrg = organizations.value.find(o => o.uid === lastSelectedOrgId)
            if (lastOrg) {
              selectedOrganizationId.value = lastOrg.uid
              currentOrganization.value = lastOrg
              fetchAccounts()
            } else {
              // If last selected not found, use first organization
              selectedOrganizationId.value = organizations.value[0]?.uid || ''
              currentOrganization.value = organizations.value[0] || null
              if (organizations.value[0]) {
                saveLastSelectedOrganization(organizations.value[0].uid)
                fetchAccounts()
              }
            }
          } else {
            // No last selected, use first organization
            selectedOrganizationId.value = organizations.value[0]?.uid || ''
            currentOrganization.value = organizations.value[0] || null
            if (organizations.value[0]) {
              saveLastSelectedOrganization(organizations.value[0].uid)
              fetchAccounts()
            }
          }
        }
      } else if (!selectedOrganizationId.value && organizations.value.length > 0) {
        // Try to use last selected organization first
        const lastSelectedOrgId = loadLastSelectedOrganization()
        if (lastSelectedOrgId) {
          const lastOrg = organizations.value.find(o => o.uid === lastSelectedOrgId)
          if (lastOrg) {
            selectedOrganizationId.value = lastOrg.uid
            currentOrganization.value = lastOrg
          } else {
            // Last selected not found, use first organization
            selectedOrganizationId.value = organizations.value[0].uid
            currentOrganization.value = organizations.value[0]
            saveLastSelectedOrganization(organizations.value[0].uid)
          }
        } else {
          // No last selected, use first organization
          selectedOrganizationId.value = organizations.value[0].uid
          currentOrganization.value = organizations.value[0]
          saveLastSelectedOrganization(organizations.value[0].uid)
        }
        fetchAccounts()
      }
    }
  } catch (e: any) {
    console.error('Failed to load organizations:', e)
  } finally {
    loadingOrganizations.value = false
  }
}

// Fetch accounts from API
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return

  loadingAccounts.value = true
  try {
    const resp = await ApiService.query(`organizations/${selectedOrganizationId.value}/accounts`, {})
    if (resp && resp.data) {
      accounts.value = resp.data
      
      // Check if accountId is provided in URL query parameters
      const accountIdFromUrl = route.query.accountId as string
      
      if (accountIdFromUrl) {
        // Find the account by the provided accountId
        const accountFromUrl = accounts.value.find(a => a.uid === accountIdFromUrl)
        if (accountFromUrl) {
          selectedAccountId.value = accountFromUrl.uid
          currentAccount.value = accountFromUrl
          // Save this as the last selected account
          saveLastSelectedAccount(accountFromUrl.uid)
          // Fetch teams for the selected account
          fetchTeams()
          return
        }
      }
      
      // If no accountId from URL or not found, try to use last selected account
      const lastSelectedAccountId = loadLastSelectedAccount()
      if (lastSelectedAccountId) {
        const lastAccount = accounts.value.find(a => a.uid === lastSelectedAccountId)
        if (lastAccount) {
          selectedAccountId.value = lastAccount.uid
          currentAccount.value = lastAccount
        } else {
          // Last selected not found, use first account
          selectedAccountId.value = accounts.value[0]?.uid || ''
          currentAccount.value = accounts.value[0] || null
          if (accounts.value[0]) {
            saveLastSelectedAccount(accounts.value[0].uid)
          }
        }
      } else {
        // No last selected, use first account
        selectedAccountId.value = accounts.value[0]?.uid || ''
        currentAccount.value = accounts.value[0] || null
        if (accounts.value[0]) {
          saveLastSelectedAccount(accounts.value[0].uid)
        }
      }
      
      // Fetch teams for the selected account
      fetchTeams()
    }
  } catch (e: any) {
    console.error('Failed to load accounts:', e)
  } finally {
    loadingAccounts.value = false
  }
}

// Fetch teams from API
const fetchTeams = async () => {
  if (!selectedAccountId.value) return

  loading.value = true
  error.value = null
  try {
    const resp = await ApiService.query(`accounts/${selectedAccountId.value}/teams`, {})
    if (resp && resp.data) {
      teams.value = resp.data
      // Format created_at for each team
      teams.value.forEach(team => {
        if (team.created_at && typeof team.created_at === 'string') {
          team.created_at = new Date(team.created_at).toLocaleDateString()
        }
      })
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to load teams"
  } finally {
    loading.value = false
  }
}

// Methods
const handleSort = (sort: { label: string; order: 'asc' | 'desc' }) => {
  sortLabel.value = sort.label
  sortOrder.value = sort.order
}

const switchOrganization = () => {
  const org = organizations.value.find(o => o.uid === selectedOrganizationId.value)
  currentOrganization.value = org || null
  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value)
  }
  // Clear accounts and teams when organization changes
  accounts.value = []
  teams.value = []
  selectedAccountId.value = ''
  currentAccount.value = null
  // Fetch accounts for the new organization
  fetchAccounts()
}

const switchAccount = () => {
  const account = accounts.value.find(a => a.uid === selectedAccountId.value)
  currentAccount.value = account || null
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value)
  }
  // Fetch teams for the selected account
  fetchTeams()
}

const showAddTeamModal = () => {
  // Reset form
  newTeam.value = {
    name: '',
  }
  // Show modal using Bootstrap
  const modal = document.getElementById('addTeamModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const createTeam = async () => {
  if (!newTeam.value.name || !selectedAccountId.value) return

  // Include account context
  const teamData = {
    ...newTeam.value,
  }

  creating.value = true
  try {
    const resp = await ApiService.post(`accounts/${selectedAccountId.value}/teams`, teamData)
    if (resp && resp.data) {
      teams.value.unshift(resp.data)
      // Hide modal
      const modal = document.getElementById('addTeamModal')
      if (modal) {
        const bsModal = Modal.getInstance(modal)
        bsModal?.hide()
      }
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to create team"
  } finally {
    creating.value = false
  }
}

const deleteTeam = (team: Team) => {
  teamToDelete.value = team
  // Show delete confirmation modal
  const modal = document.getElementById('deleteTeamModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const confirmDelete = async () => {
  if (!teamToDelete.value) return

  deleting.value = true
  try {
    await ApiService.delete(`teams/${teamToDelete.value.uid}`)
    teams.value = teams.value.filter(team => team.uid !== teamToDelete.value!.uid)
    // Hide modal
    const modal = document.getElementById('deleteTeamModal')
    if (modal) {
      const bsModal = Modal.getInstance(modal)
      bsModal?.hide()
    }
    teamToDelete.value = null
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to delete team"
  } finally {
    deleting.value = false
  }
}

const openMembersModal = (team: Team) => {
  membersModalRef.value?.open({ uid: team.uid, name: team.name })
}

const handleAddMember = (payload: { teamUid: string; teamName: string | null }) => {
  // Placeholder for future: open add member modal / navigate
  console.log('Add Member clicked for team:', payload.teamName || payload.teamUid)
}

const editTeam = (team: Team) => {
  teamToEdit.value = { ...team } // Create a copy to avoid direct mutation
  // Show edit modal using Bootstrap
  const modal = document.getElementById('editTeamModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const updateTeam = async () => {
  if (!teamToEdit.value || !teamToEdit.value.name?.trim()) return

  editing.value = true
  try {
    const resp = await ApiService.patch(`teams/${teamToEdit.value.uid}`, {
      name: teamToEdit.value.name
    })
    if (resp && resp.data) {
      // Update the team in the list
      const index = teams.value.findIndex(team => team.uid === teamToEdit.value!.uid)
      if (index !== -1) {
        teams.value[index] = resp.data
      }
      // Hide modal
      const modal = document.getElementById('editTeamModal')
      if (modal) {
        const bsModal = Modal.getInstance(modal)
        bsModal?.hide()
      }
      teamToEdit.value = null
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to update team"
  } finally {
    editing.value = false
  }
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : '-'
}

// Computed properties for summary statistics
const totalTeams = computed(() => teams.value.length)
const activeTeams = computed(() => teams.value.length) // All teams are considered active for now
const activeTeamsPercentage = computed(() => 100) // All teams are active

// Mock data for other stats (replace with actual API calls)
const totalMembers = computed(() => teams.value.reduce((sum, team) => sum + Math.floor(Math.random() * 20) + 5, 0))
const activeMembers = computed(() => Math.floor(totalMembers.value * 0.9))
const activeMembersPercentage = computed(() => totalMembers.value > 0 ? Math.round((activeMembers.value / totalMembers.value) * 100) : 0)

const totalProjects = computed(() => teams.value.reduce((sum, team) => sum + Math.floor(Math.random() * 10) + 2, 0))
const activeProjects = computed(() => Math.floor(totalProjects.value * 0.8))
const activeProjectsPercentage = computed(() => totalProjects.value > 0 ? Math.round((activeProjects.value / totalProjects.value) * 100) : 0)

const teamPerformance = computed(() => `${Math.floor(Math.random() * 30) + 70}%`)
const performanceGrowth = computed(() => Math.floor(Math.random() * 20) + 5)

// Search and Sort functionality
const filteredAndSortedTeams = computed(() => {
  let filtered = teams.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(team =>
      team.name.toLowerCase().includes(query)
    )
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Team]
      const bValue = b[sortLabel.value as keyof Team]

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

// members filtered logic now lives inside TeamMembersModal component

// Initialize
onMounted(() => {
  fetchOrganizations()
})
</script>
