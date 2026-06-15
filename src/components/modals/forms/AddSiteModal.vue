<template>
  <div
    class="modal fade"
    id="kt_modal_add_site"
    ref="addSiteModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ t("controlplane.site.modals.add.title") }}</h2>
          <div
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <form @submit.prevent="submitForm">
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7">
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  t("controlplane.site.modals.form.name.label")
                }}</label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  :placeholder="
                    t('controlplane.site.modals.form.name.placeholder')
                  "
                  v-model="formData.name"
                  name="name"
                />
                <div v-if="errors.name" class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <span role="alert">{{ errors.name }}</span>
                  </div>
                </div>
              </div>

              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">{{
                  t("controlplane.site.modals.form.description.label")
                }}</label>
                <textarea
                  class="form-control form-control-solid"
                  rows="3"
                  :placeholder="
                    t('controlplane.site.modals.form.description.placeholder')
                  "
                  v-model="formData.description"
                  name="description"
                ></textarea>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  t("controlplane.site.settings.form.fields.address.label")
                }}</label>
                <textarea
                  class="form-control form-control-solid"
                  rows="3"
                  :placeholder="
                    t('controlplane.site.settings.form.fields.address.placeholder')
                  "
                  v-model="formData.address"
                  name="address"
                ></textarea>
                <div v-if="errors.address" class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <span role="alert">{{ errors.address }}</span>
                  </div>
                </div>
              </div>

              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">{{
                  t("controlplane.site.settings.form.fields.status.label")
                }}</label>
                <select
                  v-model="formData.status"
                  class="form-select form-select-solid"
                >
                  <option value="active">
                    {{
                      t(
                        "controlplane.site.settings.form.fields.status.options.active"
                      )
                    }}
                  </option>
                  <option value="inactive">
                    {{
                      t(
                        "controlplane.site.settings.form.fields.status.options.inactive"
                      )
                    }}
                  </option>
                </select>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ t("controlplane.site.modals.form.apiKey.label") }}
                </label>
                <div class="d-flex gap-2">
                  <div class="position-relative flex-grow-1">
                    <input
                      :type="showApiKey ? 'text' : 'password'"
                      v-model="formData.api_key"
                      class="form-control form-control-solid pe-12"
                      :placeholder="t('controlplane.site.modals.form.apiKey.placeholder')"
                      autocomplete="off"
                      readonly
                    />
                    <button
                      type="button"
                      class="btn btn-sm btn-icon btn-active-color-primary position-absolute top-50 end-0 translate-middle-y me-1"
                      :title="showApiKey ? t('controlplane.site.modals.form.apiKey.hide') : t('controlplane.site.modals.form.apiKey.show')"
                      :disabled="!formData.api_key"
                      @click="showApiKey = !showApiKey"
                    >
                      <i v-if="showApiKey" class="ki-duotone ki-eye-slash fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                      </i>
                      <i v-else class="ki-duotone ki-eye fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                    </button>
                  </div>
                  <button
                    type="button"
                    class="btn btn-light-primary text-nowrap"
                    @click="generateApiKey"
                  >
                    {{ t("controlplane.site.modals.form.apiKey.generate") }}
                  </button>
                </div>
                <div v-if="errors.api_key" class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <span role="alert">{{ errors.api_key }}</span>
                  </div>
                </div>
                <div class="form-text">
                  {{ t("controlplane.site.modals.form.apiKey.hint") }}
                </div>
              </div>

              <div class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">Timezone</label>
                <input
                  type="text"
                  class="form-control form-control-solid"
                  :value="formData.timezone"
                  readonly
                />
                <div class="form-text">
                  Diambil otomatis dari timezone sistem browser Anda.
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
              type="button"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              {{ t("controlplane.site.modals.actions.cancel") }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span v-if="!loading" class="indicator-label">{{
                t("controlplane.site.modals.add.submit")
              }}</span>
              <span v-if="loading" class="indicator-progress">
                {{ t("controlplane.site.modals.actions.loading") }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AddSiteModalComponent",
});

import { ref, reactive } from "vue";
import { Modal } from "bootstrap";
import { useRoute } from "vue-router";
import ApiService from "@/core/services/ApiService";
import { useI18n } from "vue-i18n";
import { getUserTimezone } from "@/core/helpers/timezone";

interface SiteFormData {
  name: string;
  description?: string;
  address: string;
  status: string;
  timezone: string;
  team_uid: string;
  api_key: string;
}

const emit = defineEmits<{
  "site-added": [site: any];
}>();

const props = defineProps<{
  teamUid?: string;
}>();

const route = useRoute();
const addSiteModalRef = ref<HTMLElement>();
const loading = ref(false);
const showApiKey = ref(false);

const formData = reactive<SiteFormData>({
  name: "",
  description: "",
  address: "",
  status: "active",
  timezone: getUserTimezone(),
  team_uid: "",
  api_key: "",
});

const errors = reactive({
  name: "",
  address: "",
  api_key: "",
});

const { t } = useI18n();

const validateForm = (): boolean => {
  errors.name = "";
  errors.address = "";
  errors.api_key = "";

  let isValid = true;

  if (!formData.name.trim()) {
    errors.name = t("controlplane.site.modals.form.name.required");
    isValid = false;
  }

  if (!formData.address.trim()) {
    errors.address = "Alamat wajib diisi";
    isValid = false;
  }

  if (!formData.api_key.trim()) {
    errors.api_key = t("controlplane.site.modals.form.apiKey.required");
    isValid = false;
  }

  return isValid;
};

const generateApiKey = () => {
  formData.api_key = crypto.randomUUID();
  showApiKey.value = false;
  errors.api_key = "";
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const teamUid =
      formData.team_uid ||
      props.teamUid ||
      (route.query.teamId as string) ||
      "";
    if (!teamUid) {
      loading.value = false;
      alert(t("controlplane.site.modals.alerts.selectTeam"));
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      address: formData.address,
      status: formData.status,
      timezone: getUserTimezone(),
      api_key: formData.api_key.trim(),
    };

    const resp = await ApiService.post(`/teams/${teamUid}/sites`, payload);
    const created = resp?.data?.data ?? resp?.data ?? null;
    const newSite = created ?? {
      name: formData.name,
      team_uid: teamUid,
      address: formData.address,
      api_key: formData.api_key,
    };

    emit("site-added", newSite);
    resetForm();
    const modal = Modal.getInstance(addSiteModalRef.value!);
    modal?.hide();
  } catch (error: any) {
    console.error("Error adding site:", error);
    const respErrors =
      error?.response?.data?.errors || error?.response?.data || null;
    if (respErrors && typeof respErrors === "object") {
      if (respErrors.name) {
        errors.name = Array.isArray(respErrors.name)
          ? respErrors.name.join(", ")
          : String(respErrors.name);
      } else if (respErrors.message) {
        errors.name = String(respErrors.message);
      }
    }
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.name = "";
  formData.description = "";
  formData.address = "";
  formData.status = "active";
  formData.timezone = getUserTimezone();
  formData.team_uid = "";
  formData.api_key = "";
  showApiKey.value = false;
  errors.name = "";
  errors.address = "";
  errors.api_key = "";
};

const showModal = (teamId?: string) => {
  resetForm();
  const tid = teamId ?? props.teamUid ?? (route.query.teamId as string) ?? "";
  if (tid) {
    formData.team_uid = tid;
  }

  const el = addSiteModalRef.value!;
  const modalInstance =
    (Modal.getInstance(el) as Modal) ||
    new Modal(el, {
      backdrop: "static",
      keyboard: false,
    });
  modalInstance.show();
};

defineExpose({
  showModal,
});
</script>
