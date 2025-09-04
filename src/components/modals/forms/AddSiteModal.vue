<template>
  <div
    class="modal fade"
    id="kt_modal_add_site"
    ref="addSiteModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Add New Site</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Form-->
        <form @submit.prevent="submitForm">
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div class="scroll-y me-n7 pe-7">
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Site Name</label>
                <!--end::Label-->
                <!--begin::Input-->
                <input
                  type="text"
                  class="form-control form-control-solid"
                  placeholder="Enter site name"
                  v-model="formData.name"
                  name="name"
                />
                <!--end::Input-->
                <div v-if="errors.name" class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <span role="alert">{{ errors.name }}</span>
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="fs-6 fw-semibold mb-2">Description</label>
                <!--end::Label-->
                <!--begin::Input-->
                <textarea
                  class="form-control form-control-solid"
                  rows="3"
                  placeholder="Enter site description"
                  v-model="formData.description"
                  name="description"
                ></textarea>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fw-semibold fs-6 mb-2">Address</label>
                <!--end::Label-->
                <!--begin::Input-->
                <textarea
                  class="form-control form-control-solid"
                  rows="3"
                  placeholder="Complete address"
                  v-model="formData.address"
                  name="address"
                ></textarea>
                <!--end::Input-->
                <div v-if="errors.address" class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <span role="alert">{{ errors.address }}</span>
                  </div>
                </div>
              </div>
              <!--end::Input group-->

              <!--begin::Row-->
              <div class="row mb-7">
                <div class="col-md-6">
                  <label class="fw-semibold fs-6 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    class="form-control form-control-solid"
                    v-model.number="formData.latitude"
                    name="latitude"
                    placeholder="Latitude coordinate"
                  />
                </div>
                <div class="col-md-6">
                  <label class="fw-semibold fs-6 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    class="form-control form-control-solid"
                    v-model.number="formData.longitude"
                    name="longitude"
                    placeholder="Longitude coordinate"
                  />
                </div>
              </div>
              <!--end::Row-->

              <!--begin::Row-->
              <div class="row g-9 mb-7">
                <div class="col-md-6 fv-row">
                  <label class="required fs-6 fw-semibold mb-2">Site Code</label>
                  <input
                    type="text"
                    class="form-control form-control-solid"
                    placeholder="Auto-generated"
                    v-model="formData.code"
                    name="code"
                    :readonly="true"
                  />
                </div>
                <div class="col-md-6 fv-row">
                  <label class="fw-semibold fs-6 mb-2">Status</label>
                  <select
                    class="form-select form-select-solid"
                    v-model="formData.status"
                    name="status"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <!--end::Row-->

              <div class="row mb-7">
                <div class="col-md-6">
                  <label class="fw-semibold fs-6 mb-2">Contact Person</label>
                  <input
                    type="text"
                    class="form-control form-control-solid"
                    placeholder="Enter contact person name"
                    v-model="formData.contactPerson"
                    name="contactPerson"
                  />
                </div>
                <div class="col-md-6">
                  <label class="fw-semibold fs-6 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    class="form-control form-control-solid"
                    placeholder="Contact phone number"
                    v-model="formData.contactPhone"
                    name="contactPhone"
                  />
                </div>
              </div>

              <div class="fv-row mb-7">
                <label class="fw-semibold fs-6 mb-2">Time Zone</label>
                <select v-model="formData.timeZone" class="form-select form-select-solid">
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              type="button"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="!loading" class="indicator-label">Add Site</span>
              <span v-if="loading" class="indicator-progress">
                Please wait...
                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </button>
            <!--end::Button-->
          </div>
          <!--end::Modal footer-->
        </form>
        <!--end::Form-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Modal } from 'bootstrap'

interface SiteFormData {
  name: string
  description: string
  address: string
  latitude?: number
  longitude?: number
  code: string
  status: 'Active' | 'Inactive'
  contactPerson: string
  contactPhone: string
  email: string
  timeZone?: string
}

// Props and Emits
const emit = defineEmits<{
  'site-added': [site: any]
}>()

// Reactive data
const addSiteModalRef = ref<HTMLElement>()
const loading = ref(false)

const formData = reactive<SiteFormData>({
  name: '',
  description: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  code: '',
  status: 'Active',
  contactPerson: '',
  contactPhone: '',
  email: '',
  timeZone: 'Asia/Jakarta'
})

const errors = reactive({
  name: '',
  address: '',
  status: ''
})

// Auto-generate site code based on name
watch(() => formData.name, (newName) => {
  if (newName) {
    formData.code = 'SITE-' + newName.toUpperCase().replace(/\s+/g, '-').replace(/[^A-Z0-9-]/g, '')
  } else {
    formData.code = ''
  }
})

// Validation
const validateForm = (): boolean => {
  // Reset errors
  errors.name = ''
  errors.address = ''
  errors.status = ''

  let isValid = true

  if (!formData.name.trim()) {
    errors.name = 'Site name is required'
    isValid = false
  }

  if (!formData.address.trim()) {
    errors.address = 'Address is required'
    isValid = false
  }

  if (!formData.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  return isValid
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Create new site object
    const newSite = {
      id: Date.now(), // Generate temporary ID
      name: formData.name,
      description: formData.description,
      location: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      code: formData.code,
      roomCount: 0,
      nvrCount: 0,
      cameraCount: 0,
      status: formData.status,
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      email: formData.email,
      timeZone: formData.timeZone,
      createdAt: new Date().toISOString().split('T')[0]
    }

    // Emit event to parent component
    emit('site-added', newSite)

    // Reset form
    resetForm()

    // Close modal
    const modal = Modal.getInstance(addSiteModalRef.value!)
    modal?.hide()

  } catch (error) {
    console.error('Error adding site:', error)
  } finally {
    loading.value = false
  }
}

// Reset form
const resetForm = () => {
  formData.name = ''
  formData.description = ''
  formData.address = ''
  formData.latitude = undefined
  formData.longitude = undefined
  formData.code = ''
  formData.status = 'Active'
  formData.contactPerson = ''
  formData.contactPhone = ''
  formData.email = ''
  formData.timeZone = 'Asia/Jakarta'

  errors.name = ''
  errors.address = ''
  errors.status = ''
}

// Show modal method (exposed for parent component)
const showModal = () => {
  resetForm()
  // initialize modal with backdrop static and keyboard disabled so click outside / ESC won't close
  const modal = new Modal(addSiteModalRef.value!, { backdrop: 'static', keyboard: false })
  modal.show()
}

// Expose methods to parent
defineExpose({
  showModal
})
</script>
