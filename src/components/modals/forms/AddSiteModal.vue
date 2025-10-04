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
import ApiService from "../../../core/services/ApiService"

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
    // Determine team UID from prop, form, or route
    const teamUid = formData.team_uid || props.teamUid || (route.query.teamId as string) || "";
    if (!teamUid) {
      console.error("No team_uid available for creating site");
      loading.value = false;
      return;
    }

    // Build payload — send core fields; backend derives team from path
    const payload: Record<string, any> = {
      name: formData.name,
      description: formData.description,
    };

    const resp = await ApiService.post(`teams/${teamUid}/sites`, payload);
    const created = (resp as any)?.data?.data ?? (resp as any)?.data ?? payload;

    // Ensure the returned object contains team_uid for UI consistency
    const newSite = { team_uid: teamUid, ...created };

    // Emit event to parent component
    emit("site-added", newSite);

    // Reset form
    resetForm();

    // Close modal
    const modal = Modal.getInstance(addSiteModalRef.value!);
    modal?.hide();
  } catch (error) {
    console.error("Error adding site:", error);
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
const showModal = () => {
  resetForm();
  // Set team_uid from route query parameter
  const teamIdFromRoute = route.query.teamId as string;
  formData.team_uid = props.teamUid || teamIdFromRoute || "";
  // initialize modal with backdrop static and keyboard disabled so click outside / ESC won't close
  const modal = new Modal(addSiteModalRef.value!, {
    backdrop: "static",
    keyboard: false,
  });
  modal.show();
};

// Expose methods to parent
defineExpose({
  showModal,
});
</script>
