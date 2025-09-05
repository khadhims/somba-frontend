<template>
  <!--begin::Organization Overview-->
  <div class="row g-5 g-xl-8 mb-8">
    <!--begin::Summary Cards-->
    <div class="col-xl-3">
      <Widget1
        :description="'Total Organizations'"
        :value="totalOrganizations"
        :progress-text="`${activeOrganizations} Active`"
        :progress-value="activeOrganizationsPercentage"
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

  <!--begin::Organizations List-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Organizations Overview</h3>
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
            placeholder="Search organizations..."
          />
        </div>
        <!--end::Search-->
        
        <button
          @click="showAddOrganizationModal"
          class="btn btn-sm btn-light-primary"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Organization
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <KTDataTable
        :data="filteredAndSortedOrganizations"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="10"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No organizations found"
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
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{ row.legalName || row.description }}</span>
            </div>
          </div>
        </template>

        <template v-slot:email="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.email }}</span>
        </template>

        <template v-slot:phone="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.phone }}</span>
        </template>

        <template v-slot:country="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{ row.country }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span :class="`badge badge-light-${row.status === 'active' ? 'success' : 'danger'} fs-7 fw-bold`">
            {{ row.status }}
          </span>
        </template>

        <template v-slot:createdAt="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ formatDate(row.createdAt) }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <router-link
              :to="{ name: 'organization-settings', params: { id: row.id } }"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              title="Edit Organization"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
              @click="viewOrganizationDetails(row)"
              title="View Details"
            >
              <i class="ki-duotone ki-eye fs-2">
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
  <!--end::Organizations List-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Widget1 from '@/components/dashboard-default-widgets/Widget1.vue'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'
import ApiService from '@/core/services/ApiService'

// Interface definitions
interface Organization {
  id: number
  name: string
  legalName?: string
  email: string
  phone?: string
  website?: string
  address?: string
  country?: string
  status: 'active' | 'inactive'
  createdAt: string
  description?: string
}

// Reactive data
const organizations = ref<Organization[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortLabel = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Table header configuration
const tableHeader = ref([
  { columnName: 'Organization Name', columnLabel: 'name', sortEnabled: true, searchable: true },
  { columnName: 'Email', columnLabel: 'email', sortEnabled: true, searchable: true },
  { columnName: 'Phone', columnLabel: 'phone', sortEnabled: true, searchable: true },
  { columnName: 'Country', columnLabel: 'country', sortEnabled: true, searchable: true },
  { columnName: 'Status', columnLabel: 'status', sortEnabled: true, searchable: true },
  { columnName: 'Created', columnLabel: 'createdAt', sortEnabled: true, searchable: false },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false, searchable: false }
])

// Fetch organizations from API
const fetchOrganizations = async () => {
  loading.value = true
  error.value = null
  try {
    const resp = await ApiService.query("organizations", {})
    if (resp && resp.data) {
      organizations.value = resp.data
      // Format createdAt for each organization
      organizations.value.forEach(org => {
        if (org.createdAt && typeof org.createdAt === 'string') {
          org.createdAt = new Date(org.createdAt).toLocaleDateString()
        }
      })
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || "Failed to load organizations"
  } finally {
    loading.value = false
  }
}

// Computed properties for summary statistics
const totalOrganizations = computed(() => organizations.value.length)
const activeOrganizations = computed(() => organizations.value.filter(org => org.status === 'active').length)
const activeOrganizationsPercentage = computed(() => totalOrganizations.value > 0 ? Math.round((activeOrganizations.value / totalOrganizations.value) * 100) : 0)

// Mock data for other stats (replace with actual API calls)
const totalUsers = computed(() => organizations.value.reduce((sum, org) => sum + Math.floor(Math.random() * 50) + 10, 0))
const activeUsers = computed(() => Math.floor(totalUsers.value * 0.8))
const activeUsersPercentage = computed(() => totalUsers.value > 0 ? Math.round((activeUsers.value / totalUsers.value) * 100) : 0)

const totalProjects = computed(() => organizations.value.reduce((sum, org) => sum + Math.floor(Math.random() * 20) + 5, 0))
const activeProjects = computed(() => Math.floor(totalProjects.value * 0.7))
const activeProjectsPercentage = computed(() => totalProjects.value > 0 ? Math.round((activeProjects.value / totalProjects.value) * 100) : 0)

const totalRevenue = computed(() => `$${(organizations.value.length * 15000).toLocaleString()}`)
const revenueGrowth = computed(() => 75) // Mock percentage

// Search and Sort functionality
const filteredAndSortedOrganizations = computed(() => {
  let filtered = organizations.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(org => 
      org.name.toLowerCase().includes(query) ||
      org.email.toLowerCase().includes(query) ||
      org.country?.toLowerCase().includes(query) ||
      org.status.toLowerCase().includes(query)
    )
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Organization]
      const bValue = b[sortLabel.value as keyof Organization]
      
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

const showAddOrganizationModal = () => {
  console.log('Show add organization modal')
  // TODO: Implement modal
}

const viewOrganizationDetails = (org: Organization) => {
  console.log('Viewing organization details for:', org)
  // TODO: Navigate to details or open modal
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : '-'
}

// Initialize
onMounted(() => {
  fetchOrganizations()
})
</script>
