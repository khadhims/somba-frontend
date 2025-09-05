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
              <span v-if="!loading" class="indicator-label">Update Site</span>
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

interface SiteFormData {
  uid: string;
  name: string;
  description?: string;
  team_uid?: string;
  created_by?: {
    username: string;
    email: string;
  };
  created_at: string;
  updated_at?: string;
}

// Props and Emits
const emit = defineEmits<{
  "site-updated": [site: SiteFormData];
}>();

// Reactive data
const editSiteModalRef = ref<HTMLElement>();
const loading = ref(false);

const formData = reactive<SiteFormData>({
  uid: "",
  name: "",
  description: "",
  team_uid: "",
  created_by: undefined,
  created_at: "",
  updated_at: "",
});

const errors = reactive({
  name: "",
  description: "",
});

// Validation
const validateForm = () => {
  errors.name = "";
  errors.description = "";

  if (!formData.name.trim()) {
    errors.name = "Site name is required";
    return false;
  }

  return true;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Emit event to parent component
    emit("site-updated", { ...formData });

    // Close modal
    const modal = Modal.getInstance(editSiteModalRef.value!);
    modal?.hide();
  } catch (error) {
    console.error("Error updating site:", error);
  } finally {
    loading.value = false;
  }
};

// Show modal method with site data
const showModal = (siteData: any) => {
  // Populate form with site data
  formData.uid = siteData.uid ?? "";
  formData.name = siteData.name ?? "";
  formData.description = siteData.description ?? "";
  formData.team_uid = siteData.team_uid ?? "";
  formData.created_by = siteData.created_by;
  formData.created_at = siteData.created_at ?? "";
  formData.updated_at = siteData.updated_at;

  // Reset errors
  errors.name = "";
  errors.description = "";

  // Show modal (static backdrop, disable keyboard/ESC)
  const modal = new Modal(editSiteModalRef.value!, {
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
