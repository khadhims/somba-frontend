<template>
  <div class="card">
    <div class="card-header border-0 pt-5">
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.site.settings.title") }}</h3>
      </div>
    </div>

    <div class="card-body py-3">
      <form @submit.prevent="saveSite" class="form">
        <div class="row mb-7">
          <div class="col-md-12">
            <label class="required fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.name.label") }}
            </label>
            <input
              type="text"
              v-model="siteForm.name"
              class="form-control form-control-solid"
              :placeholder="
                t('controlplane.site.settings.form.fields.name.placeholder')
              "
              required
            />
          </div>
        </div>

        <div class="row mb-7">
          <div class="col-md-12">
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.description.label") }}
            </label>
            <textarea
              v-model="siteForm.description"
              class="form-control form-control-solid"
              rows="3"
              :placeholder="
                t(
                  'controlplane.site.settings.form.fields.description.placeholder'
                )
              "
            ></textarea>
          </div>
        </div>

        <div class="row mb-7">
          <div class="col-md-12">
            <label class="required fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.address.label") }}
            </label>
            <textarea
              v-model="siteForm.address"
              class="form-control form-control-solid"
              rows="3"
              :placeholder="
                t('controlplane.site.settings.form.fields.address.placeholder')
              "
              required
            ></textarea>
          </div>
        </div>

        <div v-if="isEdit" class="row mb-7">
          <div class="col-md-12">
            <label class="fw-semibold fs-6 mb-2">API Key Mini-PC</label>
            <div class="d-flex align-items-center gap-3">
              <input
                :type="showApiKey && siteForm.api_key ? 'text' : 'password'"
                :value="siteForm.api_key || '••••••••••••••••••••••••••••••••'"
                class="form-control form-control-solid"
                readonly
              />
              <button
                v-if="siteForm.api_key"
                type="button"
                class="btn btn-light"
                @click="showApiKey = !showApiKey"
              >
                {{ showApiKey ? "Sembunyikan" : "Tampilkan" }}
              </button>
              <button
                v-if="siteForm.api_key"
                type="button"
                class="btn btn-light-primary"
                @click="copyApiKey"
              >
                Salin
              </button>
              <button
                type="button"
                class="btn btn-light-warning"
                @click="regenerateApiKey"
                :disabled="isRegenerating"
              >
                Regenerate
              </button>
            </div>
            <div v-if="!siteForm.api_key" class="form-text">
              API key disimpan ter-hash di database. Klik Regenerate untuk
              mendapatkan key baru (hanya ditampilkan sekali).
            </div>
            <div class="form-text">
              Status koneksi:
              <span
                class="badge ms-2"
                :class="
                  siteForm.status === 'online'
                    ? 'badge-light-success'
                    : 'badge-light-danger'
                "
              >
                {{ siteForm.status || "offline" }}
              </span>
            </div>
          </div>
        </div>

        <div class="row mb-7">
          <div class="col-md-6">
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.status.label") }}
            </label>
            <select
              v-model="siteForm.is_active"
              class="form-select form-select-solid"
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

          <div class="col-md-6">
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.timezone.label") }}
            </label>
            <input
              type="text"
              class="form-control form-control-solid"
              :value="displayTimezone"
              readonly
            />
            <div class="form-text">
              {{
                isEdit
                  ? "Timezone disimpan saat site dibuat."
                  : "Akan disimpan otomatis dari timezone browser Anda."
              }}
            </div>
          </div>
        </div>

        <div class="text-center pt-10">
          <button type="button" class="btn btn-light me-3" @click="resetForm">
            {{ t("controlplane.site.settings.form.actions.reset") }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="indicator-progress">
              {{ t("controlplane.site.settings.form.actions.loading") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
            <span v-else class="indicator-label">
              {{
                isEdit
                  ? t("controlplane.site.settings.form.actions.update")
                  : t("controlplane.site.settings.form.actions.create")
              }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SettingsComponent",
});

import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import { getUserTimezone } from "@/core/helpers/timezone";

interface SiteForm {
  id?: string;
  name: string;
  description: string;
  address: string;
  api_key: string;
  status: string;
  is_active: boolean;
  timezone: string;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const isLoading = ref(false);
const isRegenerating = ref(false);
const showApiKey = ref(false);
const siteForm = ref<SiteForm>({
  name: "",
  description: "",
  address: "",
  api_key: "",
  status: "offline",
  is_active: true,
  timezone: getUserTimezone(),
});

const isEdit = computed(() => !!route.query.id);
const displayTimezone = computed(() =>
  isEdit.value ? siteForm.value.timezone : getUserTimezone()
);

const saveSite = async () => {
  isLoading.value = true;

  try {
    const payload = {
      name: siteForm.value.name,
      description: siteForm.value.description,
      address: siteForm.value.address,
      is_active: siteForm.value.is_active,
      ...(!isEdit.value ? { timezone: getUserTimezone() } : {}),
    };

    if (isEdit.value && route.query.id) {
      const siteUid = route.query.id as string;
      await ApiService.patch(`sites/${siteUid}`, payload);
    } else {
      await ApiService.post("sites", payload);
    }

    await router.push("/controlplane/site/overview");
  } catch (error) {
    console.error("Error saving site:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  siteForm.value = {
    name: "",
    description: "",
    address: "",
    api_key: "",
    status: "offline",
    is_active: true,
    timezone: getUserTimezone(),
  };
};

const copyApiKey = async () => {
  if (!siteForm.value.api_key) return;
  await navigator.clipboard.writeText(siteForm.value.api_key);
};

const regenerateApiKey = async () => {
  if (!route.query.id) return;
  if (
    !confirm("Regenerate API key? Mini-PC harus di-update dengan key baru.")
  ) {
    return;
  }

  isRegenerating.value = true;
  try {
    const resp = await ApiService.post(
      `sites/${route.query.id}/regenerate-key`,
      {}
    );
    const data =
      resp && resp.data && resp.data.data ? resp.data.data : resp.data;
    if (data?.api_key) {
      siteForm.value.api_key = data.api_key;
      siteForm.value.status = data.status || "offline";
      showApiKey.value = false;
    }
  } catch (error) {
    console.error("Error regenerating API key:", error);
  } finally {
    isRegenerating.value = false;
  }
};

const loadSite = async (id: string) => {
  isLoading.value = true;

  try {
    const resp = await ApiService.query(`sites/${id}`, {});
    const data =
      resp && resp.data && resp.data.data ? resp.data.data : resp.data;

    if (data) {
      siteForm.value = {
        id: data.uid || data.id || id,
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        api_key: "",
        status: data.status || "offline",
        is_active: !!data.is_active,
        timezone: data.timezone || getUserTimezone(),
      };
    }
  } catch (error) {
    console.error("Error loading site:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (isEdit.value && route.query.id) {
    loadSite(route.query.id as string);
  }
});
</script>
