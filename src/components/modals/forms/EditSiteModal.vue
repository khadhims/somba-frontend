<template>
  <div
    class="modal fade"
    id="kt_modal_edit_site"
    ref="editSiteModalRef"
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
          <h2 class="fw-bold">Edit Site</h2>
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
                <label class="required fw-semibold fs-6 mb-2">Address</label>
                <textarea
                  class="form-control form-control-solid"
                  rows="3"
                  placeholder="Complete address"
                  v-model="formData.address"
                  name="address"
                ></textarea>
                <div v-if="errors.address" class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <span role="alert">{{ errors.address }}</span>
                  </div>
                </div>
              </div>

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

              <div class="row g-9 mb-7">
                <div class="col-md-6 fv-row">
                  <label class="required fs-6 fw-semibold mb-2">Site Code</label>
                  <input
                    type="text"
                    class="form-control form-control-solid"
                    placeholder="Site code"
                    v-model="formData.code"
                    name="code"
                    :readonly="true"
                  />
                </div>
                <div class="col-md-6 fv-row">
                  <label class="fw-semibold fs-6 mb-2">Status</label>
                  <select class="form-select form-select-solid" v-model="formData.status" name="status">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div class="row mb-7">
                <div class="col-md-6">
                  <label class="fw-semibold fs-6 mb-2">Contact Person</label>
                  <input type="text" class="form-control form-control-solid" v-model="formData.contactPerson" name="contactPerson" placeholder="Enter contact person name" />
                </div>
                <div class="col-md-6">
                  <label class="fw-semibold fs-6 mb-2">Contact Phone</label>
                  <input type="tel" class="form-control form-control-solid" v-model="formData.contactPhone" name="contactPhone" placeholder="Contact phone number" />
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
              <span v-if="!loading" class="indicator-label">Update Site</span>
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
import { ref, reactive } from 'vue'
import { Modal } from 'bootstrap'

interface SiteFormData {
  id: number
  name: string
  description: string
  address: string
  location: string
  latitude?: number
  longitude?: number
  code: string
  status: 'Active' | 'Inactive'
  contactPerson: string
  contactPhone: string
  email: string
  createdAt: string
  roomCount: number
  nvrCount: number
  cameraCount: number
  timeZone?: string
}

// Props and Emits
const emit = defineEmits<{
  'site-updated': [site: SiteFormData]
}>()

// Reactive data
const editSiteModalRef = ref<HTMLElement>()
const loading = ref(false)

const formData = reactive<SiteFormData>({
  id: 0,
  name: '',
  description: '',
  address: '',
  location: '',
  latitude: undefined,
  longitude: undefined,
  code: '',
  status: 'Active',
  contactPerson: '',
  contactPhone: '',
  email: '',
  createdAt: '',
  roomCount: 0,
  nvrCount: 0,
  cameraCount: 0,
  timeZone: 'Asia/Jakarta'
})

const errors = reactive({
  name: '',
  address: '',
  status: ''
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

    // Emit event to parent component (map address -> location for backward compatibility)
  // keep location in sync for compatibility
  formData.location = formData.address
  emit('site-updated', { ...formData })

    // Close modal
    const modal = Modal.getInstance(editSiteModalRef.value!)
    modal?.hide()

  } catch (error) {
    console.error('Error updating site:', error)
  } finally {
    loading.value = false
  }
}

// Show modal method with site data
const showModal = (siteData: any) => {
  // Populate form with site data, map incoming 'location' to 'address' if present
  formData.id = siteData.id ?? 0
  formData.name = siteData.name ?? ''
  formData.description = siteData.description ?? ''
  formData.address = siteData.address ?? siteData.location ?? ''
  formData.location = siteData.location ?? formData.address
  formData.latitude = siteData.latitude
  formData.longitude = siteData.longitude
  formData.code = siteData.code ?? ''
  formData.status = siteData.status ?? 'Active'
  formData.contactPerson = siteData.contactPerson ?? ''
  formData.contactPhone = siteData.contactPhone ?? siteData.phone ?? ''
  formData.email = siteData.email ?? ''
  formData.createdAt = siteData.createdAt ?? ''
  formData.roomCount = siteData.roomCount ?? 0
  formData.nvrCount = siteData.nvrCount ?? 0
  formData.cameraCount = siteData.cameraCount ?? 0
  formData.timeZone = siteData.timeZone ?? 'Asia/Jakarta'

  // Reset errors
  errors.name = ''
  errors.address = ''
  errors.status = ''

  // Show modal (static backdrop, disable keyboard/ESC)
  const modal = new Modal(editSiteModalRef.value!, { backdrop: 'static', keyboard: false })
  modal.show()
}

// Expose methods to parent
defineExpose({
  showModal
})
</script>
