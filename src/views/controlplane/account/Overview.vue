<template>
  <!--begin::Account Overview-->
  <!--begin::Organization Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h4 class="card-title mb-0">Payment Account Management</h4>
          <p class="text-muted mb-0">
            Manage payment accounts {{ currentOrganization ? `for ${currentOrganization.name}` : 'for your organization' }}
          </p>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-end">
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
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization Switcher-->

  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'Total Payment Accounts'"
        :value="totalAccounts"
        :progress-text="`${activeAccounts} Active`"
        :progress-value="activeAccountsPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Revenue'"
        :value="totalRevenue"
        :progress-text="'This Month'"
        :progress-value="revenueGrowth"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Active Subscriptions'"
        :value="totalProjects"
        :progress-text="`${activeProjects} Renewing`"
        :progress-value="activeProjectsPercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Payment Methods'"
        :value="totalUsers"
        :progress-text="`${activeUsers} Verified`"
        :progress-value="activeUsersPercentage"
        bg-color="#FFA800"
        text-color="white"
      />
    </div>
  </div>
  <!--end::Summary Cards-->

  <!--begin::Accounts List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Payment Accounts Overview</h3>
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
            placeholder="Search payment accounts..."
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddAccountModal"
          class="btn btn-sm btn-light-primary"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Payment Account
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedAccounts"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="10"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No payment accounts found"
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
            <router-link
              :to="{ name: 'team-overview', query: { orgId: selectedOrganizationId, accountId: row.uid } }"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              title="Add Team"
            >
              <i class="ki-duotone ki-people fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editAccount(row)"
              title="Edit Account"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteAccount(row)"
              title="Delete Account"
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
  <!--end::Accounts List-->

  <!-- Add Account Modal -->
  <div class="modal fade" id="addAccountModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Payment Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="createAccount">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Account Name *</label>
                <input type="text" class="form-control" v-model="newAccount.name" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="creating">
              <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Payment Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete payment account <strong>{{ accountToDelete?.name }}</strong>?</p>
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

  <!-- Edit Account Modal -->
  <div class="modal fade" id="editAccountModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Payment Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="accountToEdit = null"></button>
        </div>
        <form @submit.prevent="updateAccount" v-if="accountToEdit">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Account Name *</label>
                <input type="text" class="form-control" v-model="accountToEdit.name" required>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal" @click="accountToEdit = null">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="editing">
              <span v-if="editing" class="spinner-border spinner-border-sm me-2"></span>
              Update Account
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Modal } from 'bootstrap'
import Widget1 from '@/components/dashboard-default-widgets/Widget1.vue'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'
import ApiService from '@/core/services/ApiService'

// Interface definitions
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
const accounts = ref<Account[]>([])
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

// Modal states
const creating = ref(false)
const deleting = ref(false)
const editing = ref(false)
const newAccount = ref<Partial<Account>>({
  name: '',
})
const accountToEdit = ref<Account | null>(null)
const accountToDelete = ref<Account | null>(null)

// Table header configuration
const tableHeader = ref([
  { columnName: 'Account Name', columnLabel: 'name', sortEnabled: true, searchable: true },
  { columnName: 'Created By', columnLabel: 'created_by', sortEnabled: false, searchable: false },
  { columnName: 'Created', columnLabel: 'created_at', sortEnabled: true, searchable: false },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false, searchable: false }
])

// Fetch accounts from API
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return

  loading.value = true
  error.value = null
  try {
    const resp = await ApiService.query(`organizations/${selectedOrganizationId.value}/accounts`, {})
    if (resp && resp.data) {
      accounts.value = resp.data
      // Format created_at for each account
      accounts.value.forEach(account => {
        if (account.created_at && typeof account.created_at === 'string') {
          account.created_at = new Date(account.created_at).toLocaleDateString()
        }
      })
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to load accounts"
  } finally {
    loading.value = false
  }
}

// Computed properties for summary statistics
const totalAccounts = computed(() => accounts.value.length)
const activeAccounts = computed(() => accounts.value.length) // All accounts are considered active for now
const activeAccountsPercentage = computed(() => 100) // All accounts are active

// Mock data for other stats (replace with actual API calls)
const totalUsers = computed(() => accounts.value.reduce((sum, account) => sum + Math.floor(Math.random() * 50) + 10, 0))
const activeUsers = computed(() => Math.floor(totalUsers.value * 0.8))
const activeUsersPercentage = computed(() => totalUsers.value > 0 ? Math.round((activeUsers.value / totalUsers.value) * 100) : 0)

const totalProjects = computed(() => accounts.value.reduce((sum, account) => sum + Math.floor(Math.random() * 20) + 5, 0))
const activeProjects = computed(() => Math.floor(totalProjects.value * 0.7))
const activeProjectsPercentage = computed(() => totalProjects.value > 0 ? Math.round((activeProjects.value / totalProjects.value) * 100) : 0)

const totalRevenue = computed(() => `$${(accounts.value.length * 15000).toLocaleString()}`)
const revenueGrowth = computed(() => 75) // Mock percentage

// Search and Sort functionality
const filteredAndSortedAccounts = computed(() => {
  let filtered = accounts.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(account =>
      account.name.toLowerCase().includes(query)
    )
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Account]
      const bValue = b[sortLabel.value as keyof Account]

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

// Methods
const handleSort = (sort: { label: string; order: 'asc' | 'desc' }) => {
  sortLabel.value = sort.label
  sortOrder.value = sort.order
}

const showAddAccountModal = () => {
  // Reset form
  newAccount.value = {
    name: '',
  }
  // Show modal using Bootstrap
  const modal = document.getElementById('addAccountModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const createAccount = async () => {
  if (!newAccount.value.name) return

  // Include organization context if selected
  const accountData = {
    ...newAccount.value,
  }

  creating.value = true
  try {
    const resp = await ApiService.post(`organizations/${selectedOrganizationId.value}/accounts`, accountData)
    if (resp && resp.data) {
      accounts.value.unshift(resp.data)
      // Hide modal
      const modal = document.getElementById('addAccountModal')
      if (modal) {
        const bsModal = Modal.getInstance(modal)
        bsModal?.hide()
      }
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to create account"
  } finally {
    creating.value = false
  }
}

const deleteAccount = (account: Account) => {
  accountToDelete.value = account
  // Show delete confirmation modal
  const modal = document.getElementById('deleteAccountModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const confirmDelete = async () => {
  if (!accountToDelete.value) return

  deleting.value = true
  try {
    await ApiService.delete(`accounts/${accountToDelete.value.uid}`)
    accounts.value = accounts.value.filter(account => account.uid !== accountToDelete.value!.uid)
    // Hide modal
    const modal = document.getElementById('deleteAccountModal')
    if (modal) {
      const bsModal = Modal.getInstance(modal)
      bsModal?.hide()
    }
    accountToDelete.value = null
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to delete account"
  } finally {
    deleting.value = false
  }
}

const editAccount = (account: Account) => {
  accountToEdit.value = { ...account } // Create a copy to avoid direct mutation
  // Show edit modal using Bootstrap
  const modal = document.getElementById('editAccountModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const updateAccount = async () => {
  if (!accountToEdit.value || !accountToEdit.value.name?.trim()) return

  editing.value = true
  try {
    const resp = await ApiService.patch(`accounts/${accountToEdit.value.uid}`, {
      name: accountToEdit.value.name
    })
    if (resp && resp.data) {
      // Update the account in the list
      const index = accounts.value.findIndex(account => account.uid === accountToEdit.value!.uid)
      if (index !== -1) {
        accounts.value[index] = resp.data
      }
      // Hide modal
      const modal = document.getElementById('editAccountModal')
      if (modal) {
        const bsModal = Modal.getInstance(modal)
        bsModal?.hide()
      }
      accountToEdit.value = null
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to update account"
  } finally {
    editing.value = false
  }
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : '-'
}

// Get route instance to read query parameters
const route = useRoute()

// Organization-related functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem('lastSelectedOrganization', orgId)
}

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem('lastSelectedOrganization')
}

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

const switchOrganization = () => {
  const org = organizations.value.find(o => o.uid === selectedOrganizationId.value)
  currentOrganization.value = org || null
  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value)
  }
  // Refresh accounts for the selected organization
  fetchAccounts()
  console.log('Switched to organization:', org?.name)
}

// Initialize
onMounted(() => {
  fetchOrganizations()
})
</script>
