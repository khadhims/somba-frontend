<template>
  <dialog
    id="kt_modal_edit_site"
    ref="editSiteModalRef"
    class="w-full max-w-[650px] rounded-lg bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @cancel.prevent
  >
    <!--begin::Modal header-->
    <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
      <!--begin::Modal title-->
      <h2 class="text-lg font-bold">{{ t('controlplane.site.modals.edit.title') }}</h2>
      <!--end::Modal title-->

      <!--begin::Close-->
      <button
        type="button"
        @click="closeModal"
        class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      >
        <i class="ki-duotone ki-cross fs-1">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
      <!--end::Close-->
    </div>
    <!--end::Modal header-->

    <!--begin::Form-->
    <form @submit.prevent="submitForm">
      <!--begin::Modal body-->
      <div class="max-h-[70vh] overflow-y-auto p-6 lg:p-10">
        <!--begin::Input group-->
        <div class="fv-row mb-7">
          <!--begin::Label-->
          <label class="mb-2 block text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-danger">{{ t('controlplane.site.modals.form.name.label') }}</label>
          <!--end::Label-->
          <!--begin::Input-->
          <input
            type="text"
            :class="formInputClass"
            :placeholder="t('controlplane.site.modals.form.name.placeholder')"
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
          <label class="mb-2 block text-sm font-semibold">{{ t('controlplane.site.modals.form.description.label') }}</label>
          <!--end::Label-->
          <!--begin::Input-->
          <textarea
            :class="formInputClass"
            rows="3"
            :placeholder="t('controlplane.site.modals.form.description.placeholder')"
            v-model="formData.description"
            name="description"
          ></textarea>
          <!--end::Input-->
        </div>
        <!--end::Input group-->
      </div>
      <!--end::Modal body-->

      <!--begin::Modal footer-->
      <div class="flex items-center justify-center gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
        <!--begin::Button-->
        <button
          type="button"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="closeModal"
        >
          {{ t('controlplane.site.modals.actions.cancel') }}
        </button>
        <!--end::Button-->

        <!--begin::Button-->
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="loading"
        >
          <span v-if="!loading">{{ t('controlplane.site.modals.edit.submit') }}</span>
          <span v-else class="inline-flex items-center gap-2">
            {{ t('controlplane.site.modals.actions.loading') }}
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          </span>
        </button>
        <!--end::Button-->
      </div>
      <!--end::Modal footer-->
    </form>
    <!--end::Form-->
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import ApiService from "@/core/services/ApiService";
import { useI18n } from "vue-i18n";
import { formInputClass } from "@/core/helpers/badge";

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
const editSiteModalRef = ref<HTMLDialogElement>();
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

const { t } = useI18n();

const closeModal = () => {
  editSiteModalRef.value?.close();
};

// Validation
const validateForm = () => {
  errors.name = "";
  errors.description = "";

  if (!formData.name.trim()) {
    errors.name = t("controlplane.site.modals.form.name.required");
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
    // Build payload for backend (only fields present in this modal)
    const payload: any = {
      name: formData.name,
      description: formData.description,
    };

    // Call PATCH /sites/{site_uid}
    const resp = await ApiService.patch(`sites/${formData.uid}`, payload);

    // Backend may return wrapped response { status, code, message, data }
    const returned = resp && resp.data && resp.data.data ? resp.data.data : resp.data;

    // Emit updated site to parent
    emit("site-updated", returned || { ...formData });

    // Close modal
    closeModal();
  } catch (error: any) {
    console.error("Error updating site:", error);

    // If backend returns validation errors, map them to UI
    const serverErrors = error?.response?.data?.errors;
    if (serverErrors) {
      if (serverErrors.name) errors.name = Array.isArray(serverErrors.name) ? serverErrors.name.join(" ") : serverErrors.name;
      if (serverErrors.description) errors.description = Array.isArray(serverErrors.description) ? serverErrors.description.join(" ") : serverErrors.description;
    }
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

  // Show modal (native <dialog> already blocks backdrop-click-to-close;
  // @cancel.prevent on the element blocks Escape too - together they
  // replicate the old `backdrop: "static", keyboard: false` Bootstrap
  // Modal options)
  editSiteModalRef.value?.showModal();
};

// Expose methods to parent
defineExpose({
  showModal,
});
</script>
