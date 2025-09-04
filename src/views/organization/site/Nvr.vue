<template>
  <!--begin::NVR Management-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">NVR Management</h3>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <div class="d-flex align-items-center position-relative my-1 me-5">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control form-control-solid w-250px ps-12"
            placeholder="Search NVRs..."
          />
        </div>

        <button class="btn btn-sm btn-light-primary" @click="showNvrForm = true">
          <i class="ki-duotone ki-plus fs-2"></i>
          Add NVR
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!--begin::Form Modal-->
      <div v-if="showNvrForm" class="mb-10">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ isEdit ? 'Edit NVR' : 'Add NVR' }}</h3>
            <div class="card-toolbar">
              <button
                type="button"
                class="btn btn-sm btn-icon btn-active-light-primary"
                @click="closeForm"
              >
                <i class="ki-duotone ki-cross fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveNvr" class="form">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Site</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="nvrForm.siteId" @change="onSiteChange" class="form-select form-select-solid" required>
                    <option value="">Select Site</option>
                    <option v-for="site in sites" :key="site.id" :value="site.id">
                      {{ site.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Room</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="nvrForm.roomId" class="form-select form-select-solid" required>
                    <option value="">Select Room</option>
                    <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                      {{ room.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">NVR Name</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.name"
                    class="form-control form-control-solid"
                    placeholder="Enter NVR name"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">IP Address</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.ipAddress"
                    class="form-control form-control-solid"
                    placeholder="192.168.1.100"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Brand</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="nvrForm.brand" class="form-select form-select-solid" required>
                    <option value="">Select Brand</option>
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Uniview">Uniview</option>
                    <option value="Tiandy">Tiandy</option>
                    <option value="Other">Other</option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Model</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.model"
                    class="form-control form-control-solid"
                    placeholder="Model number"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Username</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="nvrForm.username"
                    class="form-control form-control-solid"
                    placeholder="Admin username"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Password</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="password"
                    v-model="nvrForm.password"
                    class="form-control form-control-solid"
                    placeholder="Admin password"
                    required
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Port</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="number"
                    v-model="nvrForm.port"
                    class="form-control form-control-solid"
                    placeholder="8000"
                    min="1"
                    max="65535"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Channels</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="number"
                    v-model="nvrForm.channels"
                    class="form-control form-control-solid"
                    placeholder="16"
                    min="1"
                    max="64"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Actions-->
              <div class="text-center">
                <button
                  type="button"
                  class="btn btn-light me-3"
                  @click="closeForm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="indicator-progress">
                    Please wait...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                  <span v-else class="indicator-label">
                    {{ isEdit ? 'Update NVR' : 'Save NVR' }}
                  </span>
                </button>
              </div>
              <!--end::Actions-->
            </form>
          </div>
        </div>
      </div>
      <!--end::Form Modal-->

      <!--begin::Table-->
      <KTDataTable
        :data="filteredAndSortedNvrs"
        :header="tableHeader"
        :checkbox-enabled="false"
        :enable-items-per-page-dropdown="true"
        :items-per-page="10"
        :loading="isLoading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        empty-table-text="No NVRs found"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-warning text-warning fw-bold">
                <i class="ki-duotone ki-router fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="d-flex justify-content-start flex-column">
              <span class="text-dark fw-bold text-hover-primary fs-6">{{ row.name }}</span>
              <span class="text-muted fw-semibold text-muted d-block fs-7">{{ row.ipAddress }}</span>
            </div>
          </div>
        </template>

        <template v-slot:location="{ row }">
          <div>
            <span class="text-dark fw-bold d-block fs-6">{{ getSiteName(row.siteId) }}</span>
            <span class="text-muted fw-semibold d-block fs-7">{{ getRoomName(row.roomId) }}</span>
          </div>
        </template>

        <template v-slot:brand="{ row }">
          <span class="badge badge-light-info fs-7 fw-bold">{{ row.brand }}</span>
        </template>

        <template v-slot:channels="{ row }">
          <span class="text-dark fw-bold d-block fs-6">{{ row.channels }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span :class="`badge badge-light-${row.status === 'Online' ? 'success' : 'danger'} fs-7 fw-bold`">
            {{ row.status }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <router-link
              :to="`/organization/site/camera?nvrId=${row.id}`"
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              title="Manage Cameras"
            >
              <i class="ki-duotone ki-picture fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </router-link>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editNvr(row)"
              title="Edit NVR"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteNvr(row.id)"
              title="Delete NVR"
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
      <!--end::Table-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::NVR Management-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'

// Interfaces
interface Site {
  id: number
  name: string
}

interface Room {
  id: number
  siteId: number
  name: string
}

interface Nvr {
  id: number
  siteId: number
  roomId: number
  name: string
  ipAddress: string
  brand: string
  model?: string
  username: string
  password: string
  port: number
  channels: number
  status: 'Online' | 'Offline'
  createdAt: string
}

interface NvrForm {
  id?: number
  siteId: number | string
  roomId: number | string
  name: string
  ipAddress: string
  brand: string
  model?: string
  username: string
  password: string
  port: number
  channels: number
}

// Router
const route = useRoute()

// Reactive data
const isLoading = ref(false)
const showNvrForm = ref(false)
const isEdit = ref(false)
const searchQuery = ref('')
const sortLabel = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sites = ref<Site[]>([])
const rooms = ref<Room[]>([])
const nvrs = ref<Nvr[]>([])

const nvrForm = ref<NvrForm>({
  siteId: '',
  roomId: '',
  name: '',
  ipAddress: '',
  brand: '',
  model: '',
  username: 'admin',
  password: '',
  port: 8000,
  channels: 16
})

// Table header configuration
const tableHeader = ref([
  { columnName: 'NVR Name', columnLabel: 'name', sortEnabled: true, searchable: true },
  { columnName: 'Location', columnLabel: 'location', sortEnabled: true, searchable: true },
  { columnName: 'Brand', columnLabel: 'brand', sortEnabled: true, searchable: true },
  { columnName: 'Channels', columnLabel: 'channels', sortEnabled: true, searchable: false },
  { columnName: 'Status', columnLabel: 'status', sortEnabled: true, searchable: true },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false, searchable: false }
])

// Computed
const availableRooms = computed(() => {
  if (!nvrForm.value.siteId) return []
  return rooms.value.filter(room => room.siteId === Number(nvrForm.value.siteId))
})

const filteredAndSortedNvrs = computed(() => {
  let filtered = nvrs.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(nvr =>
      nvr.name.toLowerCase().includes(q) ||
      nvr.ipAddress.includes(q) ||
      nvr.brand.toLowerCase().includes(q) ||
      getSiteName(nvr.siteId).toLowerCase().includes(q) ||
      getRoomName(nvr.roomId).toLowerCase().includes(q)
    )
  }

  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const getValue = (item: Nvr, label: string) => {
        if (label === 'location') return getSiteName(item.siteId)
        return (item as any)[label]
      }

      const aVal = getValue(a, sortLabel.value)
      const bVal = getValue(b, sortLabel.value)

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal)
        return sortOrder.value === 'asc' ? cmp : -cmp
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        const cmp = aVal - bVal
        return sortOrder.value === 'asc' ? cmp : -cmp
      }
      return 0
    })
  }

  return filtered
})

const handleSort = (sort: { label: string; order: 'asc' | 'desc' }) => {
  sortLabel.value = sort.label
  sortOrder.value = sort.order
}

// Methods
const getSiteName = (siteId: number): string => {
  const site = sites.value.find(s => s.id === siteId)
  return site ? site.name : 'Unknown Site'
}

const getRoomName = (roomId: number): string => {
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Room'
}

const onSiteChange = () => {
  nvrForm.value.roomId = ''
}

const loadSites = async () => {
  // Mock data
  sites.value = [
    { id: 1, name: 'Main Office' },
    { id: 2, name: 'Branch Office' },
    { id: 3, name: 'Warehouse A' }
  ]
}

const loadRooms = async () => {
  // Mock data
  rooms.value = [
    { id: 1, siteId: 1, name: 'Reception' },
    { id: 2, siteId: 1, name: 'Conference Room A' },
    { id: 3, siteId: 2, name: 'Storage Area' }
  ]
}

const loadNvrs = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    nvrs.value = [
      {
        id: 1,
        siteId: 1,
        roomId: 1,
        name: 'NVR-Reception-01',
        ipAddress: '192.168.1.100',
        brand: 'Hikvision',
        model: 'DS-7616NI-K2',
        username: 'admin',
        password: 'admin123',
        port: 8000,
        channels: 16,
        status: 'Online',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        siteId: 1,
        roomId: 2,
        name: 'NVR-Conference-01',
        ipAddress: '192.168.1.101',
        brand: 'Dahua',
        model: 'NVR4216-16P-4KS2',
        username: 'admin',
        password: 'admin456',
        port: 37777,
        channels: 16,
        status: 'Online',
        createdAt: '2024-01-16'
      }
    ]
  } catch (error) {
    console.error('Error loading NVRs:', error)
  } finally {
    isLoading.value = false
  }
}

const saveNvr = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (isEdit.value) {
      // Update existing NVR
      const index = nvrs.value.findIndex(n => n.id === nvrForm.value.id)
      if (index !== -1) {
        nvrs.value[index] = {
          ...nvrs.value[index],
          ...nvrForm.value,
          siteId: Number(nvrForm.value.siteId),
          roomId: Number(nvrForm.value.roomId)
        }
      }
    } else {
      // Add new NVR
      const newNvr: Nvr = {
        id: Date.now(),
        siteId: Number(nvrForm.value.siteId),
        roomId: Number(nvrForm.value.roomId),
        name: nvrForm.value.name,
        ipAddress: nvrForm.value.ipAddress,
        brand: nvrForm.value.brand,
        model: nvrForm.value.model,
        username: nvrForm.value.username,
        password: nvrForm.value.password,
        port: nvrForm.value.port,
        channels: nvrForm.value.channels,
        status: 'Online',
        createdAt: new Date().toISOString().split('T')[0]
      }
      nvrs.value.unshift(newNvr)
    }
    
    closeForm()
  } catch (error) {
    console.error('Error saving NVR:', error)
  } finally {
    isLoading.value = false
  }
}

const editNvr = (nvr: Nvr) => {
  nvrForm.value = {
    id: nvr.id,
    siteId: nvr.siteId,
    roomId: nvr.roomId,
    name: nvr.name,
    ipAddress: nvr.ipAddress,
    brand: nvr.brand,
    model: nvr.model,
    username: nvr.username,
    password: nvr.password,
    port: nvr.port,
    channels: nvr.channels
  }
  isEdit.value = true
  showNvrForm.value = true
}

const deleteNvr = async (nvrId: number) => {
  if (!confirm('Are you sure you want to delete this NVR?')) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    nvrs.value = nvrs.value.filter(n => n.id !== nvrId)
  } catch (error) {
    console.error('Error deleting NVR:', error)
  } finally {
    isLoading.value = false
  }
}

const closeForm = () => {
  showNvrForm.value = false
  isEdit.value = false
  nvrForm.value = {
    siteId: '',
    roomId: '',
    name: '',
    ipAddress: '',
    brand: '',
    model: '',
    username: 'admin',
    password: '',
    port: 8000,
    channels: 16
  }
}

// Lifecycle
onMounted(() => {
  loadSites()
  loadRooms()
  loadNvrs()
  
  // Pre-select room if coming from room overview
  if (route.query.roomId) {
    const roomId = Number(route.query.roomId)
    const room = rooms.value.find(r => r.id === roomId)
    if (room) {
      nvrForm.value.siteId = room.siteId
      nvrForm.value.roomId = roomId
    }
  }
})
</script>
