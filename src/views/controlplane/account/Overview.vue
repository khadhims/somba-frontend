<template>
  <!--begin::Account Overview-->
  <!--begin::Organization Switcher-->
  <div class="card mb-5">
    <div class="card-body py-4">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h4 class="card-title mb-0">Account Management</h4>
          <p class="text-muted mb-0">
            Manage accounts {{ currentOrganization ? `for ${currentOrganization.name}` : 'for your organization' }}
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
                <option value="">Select Organization</option>
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
        :description="'Total Accounts'"
        :value="totalAccounts"
        :progress-text="`${activeAccounts} Active`"
        :progress-value="activeAccountsPercentage"
        bg-color="#1B84FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Users'"
        :value="totalUsers"
        :progress-text="`${activeUsers} Active`"
        :progress-value="activeUsersPercentage"
        bg-color="#17C653"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Total Projects'"
        :value="totalProjects"
        :progress-text="`${activeProjects} Ongoing`"
        :progress-value="activeProjectsPercentage"
        bg-color="#3699FF"
        text-color="white"
      />
    </div>

    <div class="col-xl-3">
      <Widget1
        :description="'Revenue'"
        :value="totalRevenue"
        :progress-text="'This Month'"
        :progress-value="revenueGrowth"
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
        <h3 class="fw-bold m-0">Accounts Overview</h3>
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
            placeholder="Search accounts..."
          />
        </div>
        <!--end::Search-->

        <button
          @click="showAddAccountModal"
          class="btn btn-sm btn-light-primary"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Account
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
        empty-table-text="No accounts found"
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
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <template v-slot:email="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.email }}</span>
        </template>

        <template v-slot:phone="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.phone || '-' }}</span>
        </template>

        <template v-slot:role="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{ row.role || 'User' }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span :class="`badge badge-light-${row.status === 'active' ? 'success' : 'danger'} fs-7 fw-bold`">
            {{ row.status || 'active' }}
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
              :to="{ name: 'account-settings', params: { id: row.uid } }"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              title="Edit Account"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="viewAccountDetails(row)"
              title="View Details"
            >
              <i class="ki-duotone ki-eye fs-2">
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
          <h5 class="modal-title">Add Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="createAccount">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Name *</label>
                <input type="text" class="form-control" v-model="newAccount.name" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" v-model="newAccount.email" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-control" v-model="newAccount.phone">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Role</label>
                <select class="form-select" v-model="newAccount.role">
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="newAccount.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
          <h5 class="modal-title">Delete Account</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>{{ accountToDelete?.name }}</strong>?</p>
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
import { Modal } from 'bootstrap'
import Widget1 from '@/components/dashboard-default-widgets/Widget1.vue'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'
import ApiService from '@/core/services/ApiService'

// Interface definitions
interface Account {
  uid: string
  name: string
  email: string
  phone?: string
  role?: 'admin' | 'user' | 'manager'
  status?: 'active' | 'inactive'
  created_at: string
  updated_at?: string
  created_by?: {
    username: string
    email: string
  }
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
const newAccount = ref<Partial<Account>>({
  name: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active'
})
const accountToDelete = ref<Account | null>(null)

// Table header configuration
const tableHeader = ref([
  { columnName: 'Account Name', columnLabel: 'name', sortEnabled: true, searchable: true },
  { columnName: 'Email', columnLabel: 'email', sortEnabled: true, searchable: true },
  { columnName: 'Phone', columnLabel: 'phone', sortEnabled: true, searchable: true },
  { columnName: 'Role', columnLabel: 'role', sortEnabled: true, searchable: true },
  { columnName: 'Status', columnLabel: 'status', sortEnabled: true, searchable: true },
  { columnName: 'Created', columnLabel: 'created_at', sortEnabled: true, searchable: false },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false, searchable: false }
])

// Fetch accounts from API
const fetchAccounts = async () => {
  loading.value = true
  error.value = null
  try {
    const resp = await ApiService.query("accounts", {})
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
const activeAccounts = computed(() => accounts.value.filter(account => account.status === 'active').length)
const activeAccountsPercentage = computed(() => totalAccounts.value > 0 ? Math.round((activeAccounts.value / totalAccounts.value) * 100) : 0)

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
      account.name.toLowerCase().includes(query) ||
      (account.email && account.email.toLowerCase().includes(query)) ||
      (account.role && account.role.toLowerCase().includes(query)) ||
      (account.status && account.status.toLowerCase().includes(query))
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
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  }
  // Show modal using Bootstrap
  const modal = document.getElementById('addAccountModal')
  if (modal) {
    const bsModal = new Modal(modal)
    bsModal.show()
  }
}

const createAccount = async () => {
  if (!newAccount.value.name || !newAccount.value.email) return

  // Include organization context if selected
  const accountData = {
    ...newAccount.value,
    organization_id: selectedOrganizationId.value || undefined
  }

  creating.value = true
  try {
    const resp = await ApiService.post("accounts", accountData)
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

const viewAccountDetails = (account: Account) => {
  console.log('Viewing account details for:', account.name)
  // TODO: Navigate to details view or show modal
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : '-'
}

// Organization-related functions
const fetchOrganizations = async () => {
  loadingOrganizations.value = true
  try {
    const resp = await ApiService.query("organizations", {})
    if (resp && resp.data) {
      organizations.value = resp.data
      // Set default organization if none selected
      if (!selectedOrganizationId.value && organizations.value.length > 0) {
        selectedOrganizationId.value = organizations.value[0].uid
        currentOrganization.value = organizations.value[0]
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
  // Here you could add logic to refresh accounts based on selected organization
  // For now, we'll just update the current organization context
  console.log('Switched to organization:', org?.name)
}

// Initialize
onMounted(() => {
  fetchAccounts()
  fetchOrganizations()
})
</script>
