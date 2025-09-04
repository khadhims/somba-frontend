<template>
  <!--begin::Camera Management-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">Camera Management</h3>
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchText"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search cameras..."
          />
        </div>
      </div>
      <!--end::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <button
          class="btn btn-sm btn-light-primary"
          @click="showCameraForm = true"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          Add Camera
        </button>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!--begin::Form Modal-->
      <div v-if="showCameraForm" class="mb-10">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ isEdit ? 'Edit Camera' : 'Add Camera' }}</h3>
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
            <form @submit.prevent="saveCamera" class="form">
              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Site</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="cameraForm.siteId" @change="onSiteChange" class="form-select form-select-solid" required>
                    <option value="">Select Site</option>
                    <option v-for="site in sites" :key="site.id" :value="site.id">
                      {{ site.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Room</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="cameraForm.roomId" @change="onRoomChange" class="form-select form-select-solid" required>
                    <option value="">Select Room</option>
                    <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                      {{ room.name }}
                    </option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-4">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">NVR</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="cameraForm.nvrId" class="form-select form-select-solid" required>
                    <option value="">Select NVR</option>
                    <option v-for="nvr in availableNvrs" :key="nvr.id" :value="nvr.id">
                      {{ nvr.name }}
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
                  <label class="required fw-semibold fs-6 mb-2">Camera Name</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.name"
                    class="form-control form-control-solid"
                    placeholder="Enter camera name"
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
                    v-model="cameraForm.ipAddress"
                    class="form-control form-control-solid"
                    placeholder="192.168.1.200"
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
                  <select v-model="cameraForm.brand" class="form-select form-select-solid" required>
                    <option value="">Select Brand</option>
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Uniview">Uniview</option>
                    <option value="Tiandy">Tiandy</option>
                    <option value="Axis">Axis</option>
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
                    v-model="cameraForm.model"
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
                  <label class="required fw-semibold fs-6 mb-2">Camera Type</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="cameraForm.type" class="form-select form-select-solid" required>
                    <option value="Dome">Dome</option>
                    <option value="Bullet">Bullet</option>
                    <option value="PTZ">PTZ</option>
                    <option value="Fisheye">Fisheye</option>
                    <option value="Turret">Turret</option>
                  </select>
                  <!--end::Select-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="required fw-semibold fs-6 mb-2">Resolution</label>
                  <!--end::Label-->
                  <!--begin::Select-->
                  <select v-model="cameraForm.resolution" class="form-select form-select-solid" required>
                    <option value="1080P">1080P (2MP)</option>
                    <option value="4MP">4MP</option>
                    <option value="5MP">5MP</option>
                    <option value="4K">4K (8MP)</option>
                    <option value="12MP">12MP</option>
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
                  <label class="fw-semibold fs-6 mb-2">Channel Number</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="number"
                    v-model="cameraForm.channel"
                    class="form-control form-control-solid"
                    placeholder="1"
                    min="1"
                    max="64"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->

                <!--begin::Col-->
                <div class="col-md-6">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Location</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <input
                    type="text"
                    v-model="cameraForm.location"
                    class="form-control form-control-solid"
                    placeholder="Specific location description"
                  />
                  <!--end::Input-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row mb-7">
                <!--begin::Col-->
                <div class="col-md-12">
                  <!--begin::Label-->
                  <label class="fw-semibold fs-6 mb-2">Description</label>
                  <!--end::Label-->
                  <!--begin::Input-->
                  <textarea
                    v-model="cameraForm.description"
                    class="form-control form-control-solid"
                    rows="3"
                    placeholder="Camera description"
                  ></textarea>
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
                    {{ isEdit ? 'Update Camera' : 'Save Camera' }}
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
        :data="filteredCameras"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page="10"
        :loading="isLoading"
        empty-table-text="No cameras found"
      >
        <template v-slot:name="{ row }">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-45px me-5">
              <span class="symbol-label bg-light-success text-success fw-bold">
                <i class="ki-duotone ki-picture fs-2">
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
            <span class="text-muted fw-semibold d-block fs-8">{{ row.location }}</span>
          </div>
        </template>

        <template v-slot:specs="{ row }">
          <div>
            <span class="badge badge-light-info fs-7 fw-bold mb-1">{{ row.brand }}</span><br>
            <span class="badge badge-light-warning fs-7 fw-bold">{{ row.resolution }}</span>
          </div>
        </template>

        <template v-slot:nvr="{ row }">
          <div>
            <span class="text-dark fw-bold d-block fs-6">{{ getNvrName(row.nvrId) }}</span>
            <span class="text-muted fw-semibold d-block fs-7">Ch. {{ row.channel }}</span>
          </div>
        </template>

        <template v-slot:status="{ row }">
          <span :class="`badge badge-light-${row.status === 'Online' ? 'success' : 'danger'} fs-7 fw-bold`">
            {{ row.status }}
          </span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="d-flex justify-content-end flex-shrink-0">
            <button
              class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1"
              @click="viewCamera(row)"
              title="View Live Stream"
            >
              <i class="ki-duotone ki-eye fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
              @click="editCamera(row)"
              title="Edit Camera"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
            <button
              class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
              @click="deleteCamera(row.id)"
              title="Delete Camera"
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
  <!--end::Camera Management-->
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
}

interface Camera {
  id: number
  siteId: number
  roomId: number
  nvrId: number
  name: string
  ipAddress: string
  brand: string
  model?: string
  type: string
  resolution: string
  channel: number
  location?: string
  description?: string
  status: 'Online' | 'Offline'
  createdAt: string
}

interface CameraForm {
  id?: number
  siteId: number | string
  roomId: number | string
  nvrId: number | string
  name: string
  ipAddress: string
  brand: string
  model?: string
  type: string
  resolution: string
  channel: number
  location?: string
  description?: string
}

// Router
const route = useRoute()

// Reactive data
const isLoading = ref(false)
const showCameraForm = ref(false)
const isEdit = ref(false)
const searchText = ref('')

const sites = ref<Site[]>([])
const rooms = ref<Room[]>([])
const nvrs = ref<Nvr[]>([])
const cameras = ref<Camera[]>([])

const cameraForm = ref<CameraForm>({
  siteId: '',
  roomId: '',
  nvrId: '',
  name: '',
  ipAddress: '',
  brand: '',
  model: '',
  type: 'Dome',
  resolution: '1080P',
  channel: 1,
  location: '',
  description: ''
})

// Table header configuration
const tableHeader = ref([
  { columnName: 'Camera Name', columnLabel: 'name', sortEnabled: true },
  { columnName: 'Location', columnLabel: 'location', sortEnabled: true },
  { columnName: 'Specifications', columnLabel: 'specs', sortEnabled: false },
  { columnName: 'NVR', columnLabel: 'nvr', sortEnabled: true },
  { columnName: 'Status', columnLabel: 'status', sortEnabled: true },
  { columnName: 'Actions', columnLabel: 'actions', sortEnabled: false }
])

// Computed
const availableRooms = computed(() => {
  if (!cameraForm.value.siteId) return []
  return rooms.value.filter(room => room.siteId === Number(cameraForm.value.siteId))
})

const availableNvrs = computed(() => {
  if (!cameraForm.value.roomId) return []
  return nvrs.value.filter(nvr => nvr.roomId === Number(cameraForm.value.roomId))
})

const filteredCameras = computed(() => {
  if (!searchText.value) return cameras.value
  
  return cameras.value.filter(camera =>
    camera.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    camera.ipAddress.includes(searchText.value) ||
    camera.brand.toLowerCase().includes(searchText.value.toLowerCase()) ||
    camera.type.toLowerCase().includes(searchText.value.toLowerCase()) ||
    getSiteName(camera.siteId).toLowerCase().includes(searchText.value.toLowerCase()) ||
    getRoomName(camera.roomId).toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// Methods
const getSiteName = (siteId: number): string => {
  const site = sites.value.find(s => s.id === siteId)
  return site ? site.name : 'Unknown Site'
}

const getRoomName = (roomId: number): string => {
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Room'
}

const getNvrName = (nvrId: number): string => {
  const nvr = nvrs.value.find(n => n.id === nvrId)
  return nvr ? nvr.name : 'Unknown NVR'
}

const onSiteChange = () => {
  cameraForm.value.roomId = ''
  cameraForm.value.nvrId = ''
}

const onRoomChange = () => {
  cameraForm.value.nvrId = ''
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
  // Mock data
  nvrs.value = [
    { id: 1, siteId: 1, roomId: 1, name: 'NVR-Reception-01' },
    { id: 2, siteId: 1, roomId: 2, name: 'NVR-Conference-01' }
  ]
}

const loadCameras = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    cameras.value = [
      {
        id: 1,
        siteId: 1,
        roomId: 1,
        nvrId: 1,
        name: 'CAM-Reception-01',
        ipAddress: '192.168.1.200',
        brand: 'Hikvision',
        model: 'DS-2CD2385FWD-I',
        type: 'Dome',
        resolution: '4K',
        channel: 1,
        location: 'Main entrance',
        description: 'Front desk monitoring',
        status: 'Online',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        siteId: 1,
        roomId: 1,
        nvrId: 1,
        name: 'CAM-Reception-02',
        ipAddress: '192.168.1.201',
        brand: 'Dahua',
        model: 'IPC-HDW2431T-AS-S2',
        type: 'Turret',
        resolution: '4MP',
        channel: 2,
        location: 'Waiting area',
        description: 'Customer area monitoring',
        status: 'Online',
        createdAt: '2024-01-16'
      }
    ]
  } catch (error) {
    console.error('Error loading cameras:', error)
  } finally {
    isLoading.value = false
  }
}

const saveCamera = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (isEdit.value) {
      // Update existing camera
      const index = cameras.value.findIndex(c => c.id === cameraForm.value.id)
      if (index !== -1) {
        cameras.value[index] = {
          ...cameras.value[index],
          ...cameraForm.value,
          siteId: Number(cameraForm.value.siteId),
          roomId: Number(cameraForm.value.roomId),
          nvrId: Number(cameraForm.value.nvrId)
        }
      }
    } else {
      // Add new camera
      const newCamera: Camera = {
        id: Date.now(),
        siteId: Number(cameraForm.value.siteId),
        roomId: Number(cameraForm.value.roomId),
        nvrId: Number(cameraForm.value.nvrId),
        name: cameraForm.value.name,
        ipAddress: cameraForm.value.ipAddress,
        brand: cameraForm.value.brand,
        model: cameraForm.value.model,
        type: cameraForm.value.type,
        resolution: cameraForm.value.resolution,
        channel: cameraForm.value.channel,
        location: cameraForm.value.location,
        description: cameraForm.value.description,
        status: 'Online',
        createdAt: new Date().toISOString().split('T')[0]
      }
      cameras.value.unshift(newCamera)
    }
    
    closeForm()
  } catch (error) {
    console.error('Error saving camera:', error)
  } finally {
    isLoading.value = false
  }
}

const editCamera = (camera: Camera) => {
  cameraForm.value = {
    id: camera.id,
    siteId: camera.siteId,
    roomId: camera.roomId,
    nvrId: camera.nvrId,
    name: camera.name,
    ipAddress: camera.ipAddress,
    brand: camera.brand,
    model: camera.model,
    type: camera.type,
    resolution: camera.resolution,
    channel: camera.channel,
    location: camera.location,
    description: camera.description
  }
  isEdit.value = true
  showCameraForm.value = true
}

const deleteCamera = async (cameraId: number) => {
  if (!confirm('Are you sure you want to delete this camera?')) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    cameras.value = cameras.value.filter(c => c.id !== cameraId)
  } catch (error) {
    console.error('Error deleting camera:', error)
  } finally {
    isLoading.value = false
  }
}

const viewCamera = (camera: Camera) => {
  console.log('Opening live stream for camera:', camera.name)
  // TODO: Implement live stream viewer
  alert(`Live stream for ${camera.name} would open here`)
}

const closeForm = () => {
  showCameraForm.value = false
  isEdit.value = false
  cameraForm.value = {
    siteId: '',
    roomId: '',
    nvrId: '',
    name: '',
    ipAddress: '',
    brand: '',
    model: '',
    type: 'Dome',
    resolution: '1080P',
    channel: 1,
    location: '',
    description: ''
  }
}

// Lifecycle
onMounted(() => {
  loadSites()
  loadRooms()
  loadNvrs()
  loadCameras()
  
  // Pre-select NVR if coming from NVR overview
  if (route.query.nvrId) {
    const nvrId = Number(route.query.nvrId)
    const nvr = nvrs.value.find(n => n.id === nvrId)
    if (nvr) {
      cameraForm.value.siteId = nvr.siteId
      cameraForm.value.roomId = nvr.roomId
      cameraForm.value.nvrId = nvrId
    }
  }
})
</script>
