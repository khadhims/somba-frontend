<template>
  <dialog
    id="kt_modal_add_site"
    ref="addSiteModalRef"
    class="w-full max-w-[650px] rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @cancel.prevent
  >
    <!--begin::Modal header-->
    <div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
      <!--begin::Modal title-->
      <h2 class="text-lg font-bold">{{ t('controlplane.site.modals.add.title') }}</h2>
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
          <span v-if="!loading">{{ t('controlplane.site.modals.add.submit') }}</span>
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
import { useRoute } from "vue-router";
import ApiService from "@/core/services/ApiService";
import { useI18n } from "vue-i18n";
import { formInputClass } from "@/core/helpers/badge";

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
const addSiteModalRef = ref<HTMLDialogElement>();
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

const { t } = useI18n();

const closeModal = () => {
  addSiteModalRef.value?.close();
};

// Validation
const validateForm = (): boolean => {
  // Reset errors
  errors.name = "";
  errors.description = "";

  let isValid = true;

  if (!formData.name.trim()) {
    errors.name = t("controlplane.site.modals.form.name.required");
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
      alert(t("controlplane.site.modals.alerts.selectTeam"));
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
    closeModal()
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
  const el = addSiteModalRef.value;
  if (!el) {
    console.warn('[AddSiteModal] addSiteModalRef is not set!');
    return;
  }
  // Native <dialog> already blocks backdrop-click-to-close by default (no
  // listener wired for it); @cancel.prevent on the element blocks the
  // Escape key too - together they replicate the old
  // `backdrop: "static", keyboard: false` Bootstrap Modal options.
  el.showModal();
};

// Expose methods to parent
defineExpose({
  showModal,
});
</script>
