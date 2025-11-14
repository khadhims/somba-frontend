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
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading" class="indicator-label">Add Site</span>
              <span v-if="loading" class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
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

import { ref, reactive } from "vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import ApiService from '@/core/services/ApiService'

interface SiteFormData {
  name: string;
  description?: string;
  team_uid: string;
}

// Props and Emits
const emit = defineEmits<{
  "site-added": [site: any];
}>();

const props = defineProps<{
  teamUid?: string;
}>();

// Get route instance to read query parameters
const route = useRoute();

// Reactive data
const addSiteModalRef = ref<HTMLElement>();
const loading = ref(false);

const formData = reactive<SiteFormData>({
  name: "",
  description: "",
  team_uid: "",
});

const errors = reactive({
  name: "",
  description: "",
});

// Validation
const validateForm = (): boolean => {
  // Reset errors
  errors.name = "";
  errors.description = "";

  let isValid = true;

  if (!formData.name.trim()) {
    errors.name = "Site name is required";
    isValid = false;
  }

  return isValid;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // Ensure we have a team UID: prefer form value, then prop, then route query
    const teamUid = formData.team_uid || props.teamUid || (route.query.teamId as string) || '';
    if (!teamUid) {
      // user-friendly message and graceful return (don't throw)
      loading.value = false;
      alert('Select a team to add the site to.');
      return;
    }

    // Call API to create site under team
    const payload = {
      name: formData.name,
      // description: formData.description,
    }

    // Use explicit API path as requested
    const resp = await ApiService.post(`/teams/${teamUid}/sites`, payload)

    // Backend may return created resource under resp.data.data or resp.data
    const created = resp?.data?.data ?? resp?.data ?? null
    // Emit created site (fallback to local object if backend didn't return it)
    const newSite = created ?? { name: formData.name, team_uid: teamUid }
    emit('site-added', newSite)

    // Reset form and close modal
    resetForm()
    const modal = Modal.getInstance(addSiteModalRef.value!)
    modal?.hide()
  } catch (error: any) {
    console.error("Error adding site:", error);
    // map validation errors if provided by backend
    const respErrors = error?.response?.data?.errors || error?.response?.data || null
    if (respErrors && typeof respErrors === 'object') {
      // If backend returns field-specific errors, set them
      if (respErrors.name) {
        errors.name = Array.isArray(respErrors.name) ? respErrors.name.join(', ') : String(respErrors.name)
      } else if (respErrors.message) {
        errors.name = String(respErrors.message)
      }
    }
  } finally {
    loading.value = false;
  }
};

// Reset form
const resetForm = () => {
  formData.name = "";
  formData.description = "";
  formData.team_uid = "";

  errors.name = "";
  errors.description = "";
};

// Show modal method (exposed for parent component)
// Accept optional teamId parameter so parent can specify which team to attach the site to
const showModal = (teamId?: string) => {
  resetForm();
  // Prefer explicit teamId argument, then prop, then route query
  const tid = teamId ?? props.teamUid ?? (route.query.teamId as string) ?? '';
  if (tid) {
    formData.team_uid = tid;
  }
  // initialize modal with backdrop static and keyboard disabled so click outside / ESC won't close
  const el = addSiteModalRef.value!;
  if (!el) {
    console.warn('[AddSiteModal] addSiteModalRef is not set!');
  }

  const modalInstance = (Modal.getInstance(el) as Modal) || new Modal(el, {
    backdrop: "static",
    keyboard: false,
  });
  modalInstance.show();
};

// Expose methods to parent
defineExpose({
  showModal,
});
</script>
