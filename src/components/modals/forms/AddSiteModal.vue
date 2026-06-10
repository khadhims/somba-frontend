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
                  :disabled="!!createdApiKey"
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
                  :disabled="!!createdApiKey"
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
                  :disabled="!!createdApiKey"
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
                  v-model="formData.is_active"
                  class="form-select form-select-solid"
                  :disabled="!!createdApiKey"
                >
                  <option :value="true">
                    {{
                      t(
                        "controlplane.site.settings.form.fields.status.options.active"
                      )
                    }}
                  </option>
                  <option :value="false">
                    {{
                      t(
                        "controlplane.site.settings.form.fields.status.options.inactive"
                      )
                    }}
                  </option>
                </select>
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

              <div v-if="createdApiKey" class="fv-row mb-7">
                <label class="fs-6 fw-semibold mb-2">API Key Mini-PC</label>
                <div class="d-flex align-items-center gap-3">
                  <input
                    :type="showApiKey ? 'text' : 'password'"
                    class="form-control form-control-solid"
                    :value="createdApiKey"
                    readonly
                  />
                  <button
                    type="button"
                    class="btn btn-light"
                    @click="showApiKey = !showApiKey"
                  >
                    {{ showApiKey ? "Sembunyikan" : "Tampilkan" }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-light-primary"
                    @click="copyApiKey"
                  >
                    Salin
                  </button>
                </div>
                <div class="form-text text-warning">
                  Simpan API key ini ke file `.env` pada mini-PC (`EDGE_API_KEY`).
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
              {{ createdApiKey ? "Tutup" : t("controlplane.site.modals.actions.cancel") }}
            </button>
            <button
              v-if="!createdApiKey"
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
  is_active: boolean;
  timezone: string;
  team_uid: string;
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
const createdApiKey = ref("");
const showApiKey = ref(false);

const formData = reactive<SiteFormData>({
  name: "",
  description: "",
  address: "",
  is_active: true,
  timezone: getUserTimezone(),
  team_uid: "",
});

const errors = reactive({
  name: "",
  address: "",
});

const { t } = useI18n();

const validateForm = (): boolean => {
  errors.name = "";
  errors.address = "";

  let isValid = true;

  if (!formData.name.trim()) {
    errors.name = t("controlplane.site.modals.form.name.required");
    isValid = false;
  }

  if (!formData.address.trim()) {
    errors.address = "Alamat wajib diisi";
    isValid = false;
  }

  return isValid;
};

const copyApiKey = async () => {
  if (!createdApiKey.value) return;
  await navigator.clipboard.writeText(createdApiKey.value);
};

const submitForm = async () => {
  if (createdApiKey.value) {
    return;
  }

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
      is_active: formData.is_active,
      timezone: getUserTimezone(),
    };

    const resp = await ApiService.post(`/teams/${teamUid}/sites`, payload);
    const created = resp?.data?.data ?? resp?.data ?? null;
    const newSite = created ?? {
      name: formData.name,
      team_uid: teamUid,
      address: formData.address,
    };

    createdApiKey.value = newSite.api_key || "";
    emit("site-added", newSite);

    if (!createdApiKey.value) {
      resetForm();
      const modal = Modal.getInstance(addSiteModalRef.value!);
      modal?.hide();
    }
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
  formData.is_active = true;
  formData.timezone = getUserTimezone();
  formData.team_uid = "";
  createdApiKey.value = "";
  showApiKey.value = false;
  errors.name = "";
  errors.address = "";
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
