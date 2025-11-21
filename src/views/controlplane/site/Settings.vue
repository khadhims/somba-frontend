<template>
  <!--begin::Site Settings-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-5">
      <!--begin::Card title-->
      <div class="card-title">
        <h3 class="fw-bold m-0">{{ t("controlplane.site.settings.title") }}</h3>
      </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Card body-->
    <div class="card-body py-3">
      <!--begin::Form-->
      <form @submit.prevent="saveSite" class="form">
        <!--begin::Row-->
        <div class="row mb-7">
          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="required fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.name.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <input
              type="text"
              v-model="siteForm.name"
              class="form-control form-control-solid"
              :placeholder="t('controlplane.site.settings.form.fields.name.placeholder')"
              required
            />
            <!--end::Input-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.code.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <input
              type="text"
              v-model="siteForm.code"
              class="form-control form-control-solid"
              :placeholder="t('controlplane.site.settings.form.fields.code.placeholder')"
              readonly
            />
            <!--end::Input-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Row-->
        <div class="row mb-7">
          <!--begin::Col-->
          <div class="col-md-12">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.description.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <textarea
              v-model="siteForm.description"
              class="form-control form-control-solid"
              rows="3"
              :placeholder="t('controlplane.site.settings.form.fields.description.placeholder')"
            ></textarea>
            <!--end::Input-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Row-->
        <div class="row mb-7">
          <!--begin::Col-->
          <div class="col-md-12">
            <!--begin::Label-->
            <label class="required fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.address.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <textarea
              v-model="siteForm.address"
              class="form-control form-control-solid"
              rows="3"
              :placeholder="t('controlplane.site.settings.form.fields.address.placeholder')"
              required
            ></textarea>
            <!--end::Input-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Row-->
        <div class="row mb-7">
          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.latitude.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <input
              type="number"
              v-model="siteForm.latitude"
              class="form-control form-control-solid"
              :placeholder="t('controlplane.site.settings.form.fields.latitude.placeholder')"
              step="any"
            />
            <!--end::Input-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.longitude.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <input
              type="number"
              v-model="siteForm.longitude"
              class="form-control form-control-solid"
              :placeholder="t('controlplane.site.settings.form.fields.longitude.placeholder')"
              step="any"
            />
            <!--end::Input-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Row-->
        <div class="row mb-7">
          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.contactPerson.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <input
              type="text"
              v-model="siteForm.contact_person"
              class="form-control form-control-solid"
              :placeholder="t('controlplane.site.settings.form.fields.contactPerson.placeholder')"
            />
            <!--end::Input-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.contactPhone.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Input-->
            <input
              type="tel"
              v-model="siteForm.contact_phone"
              class="form-control form-control-solid"
              :placeholder="t('controlplane.site.settings.form.fields.contactPhone.placeholder')"
            />
            <!--end::Input-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Row-->
        <div class="row mb-7">
          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.status.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Select-->
            <select
              v-model="siteForm.is_active"
              class="form-select form-select-solid"
            >
              <option :value="true">
                {{ t("controlplane.site.settings.form.fields.status.options.active") }}
              </option>
              <option :value="false">
                {{ t("controlplane.site.settings.form.fields.status.options.inactive") }}
              </option>
            </select>
            <!--end::Select-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="col-md-6">
            <!--begin::Label-->
            <label class="fw-semibold fs-6 mb-2">
              {{ t("controlplane.site.settings.form.fields.timezone.label") }}
            </label>
            <!--end::Label-->
            <!--begin::Select-->
            <select
              v-model="siteForm.timezone"
              class="form-select form-select-solid"
            >
              <option value="WIB">
                {{ t("controlplane.site.settings.form.fields.timezone.options.wib") }}
              </option>
              <option value="WITA">
                {{ t("controlplane.site.settings.form.fields.timezone.options.wita") }}
              </option>
              <option value="WIT">
                {{ t("controlplane.site.settings.form.fields.timezone.options.wit") }}
              </option>
            </select>
            <!--end::Select-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Row-->

        <!--begin::Actions-->
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
        <!--end::Actions-->
      </form>
      <!--end::Form-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Site Settings-->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ApiService from '@/core/services/ApiService'

// Interface
interface SiteForm {
  id?: string;
  name: string;
  code: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  contact_person: string;
  contact_phone: string;
  is_active: boolean;
  timezone: string; // enum: WIB | WITA | WIT
}

// Router
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

// Reactive data
const isLoading = ref(false);
const siteForm = ref<SiteForm>({
  name: "",
  code: "",
  description: "",
  address: "",
  latitude: undefined,
  longitude: undefined,
  contact_person: "",
  contact_phone: "",
  is_active: true,
  timezone: "WIB",
});

// Computed
const isEdit = computed(() => !!route.query.id);

// Methods
const generateSiteCode = (name: string) => {
  return (
    name.toUpperCase().replace(/\s+/g, "").substring(0, 6) +
    "_" +
    Date.now().toString().slice(-4)
  );
};

const saveSite = async () => {
  isLoading.value = true;

  try {
    // Generate code if new site
    if (!isEdit.value && !siteForm.value.code) {
      siteForm.value.code = generateSiteCode(siteForm.value.name);
    }

    // Build payload matching backend field names
    const payload: any = {
      name: siteForm.value.name,
      code: siteForm.value.code,
      description: siteForm.value.description,
      address: siteForm.value.address,
      latitude: siteForm.value.latitude,
      longitude: siteForm.value.longitude,
      contact_person: siteForm.value.contact_person,
      contact_phone: siteForm.value.contact_phone,
      is_active: siteForm.value.is_active,
      timezone: siteForm.value.timezone,
    };

    if (isEdit.value && route.query.id) {
      // Update existing site via PATCH /sites/{site_uid}
      const siteUid = route.query.id as string;
      const resp = await ApiService.patch(`sites/${siteUid}`, payload);
      console.log("Site updated:", resp);
    } else {
      // Create new site via POST /sites
      const resp = await ApiService.post("sites", payload);
      console.log("Site created:", resp);
    }

    // Redirect back to overview after save (defensive: log and fallback on failure)
    try {
      await router.push('/controlplane/site/overview');
    } catch (navErr) {
      console.error('[Settings] router.push failed:', navErr);    
    }
  } catch (error) {
    console.error("Error saving site:", error);
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  siteForm.value = {
    name: "",
    code: "",
    description: "",
    address: "",
    latitude: undefined,
    longitude: undefined,
    contact_person: "",
    contact_phone: "",
    is_active: true,
    timezone: "WIB",
  };
};

const loadSite = async (id: string) => {
  isLoading.value = true;

  try {
    const resp = await ApiService.query(`sites/${id}`, {});
    // backend may return wrapped response { is_active, code, message, data }
    const data = resp && resp.data && resp.data.data ? resp.data.data : resp.data;

    if (data) {
      siteForm.value = {
        id: data.uid || data.id || id,
        name: data.name || "",
        code: data.code || "",
        description: data.description || "",
        address: data.address || "",
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
        contact_person: data.contact_person || "",
        contact_phone: data.contact_phone || "",
        is_active: !!data.is_active,
        timezone: data.timezone || data.timeZone || "WIB",
      };
    }
  } catch (error) {
    console.error("Error loading site:", error);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  if (isEdit.value && route.query.id) {
    loadSite(route.query.id as string);
  }
});

// Watch for name changes to auto-generate code
watch(
  () => siteForm.value.name,
  (newName) => {
    if (!isEdit.value && newName) {
      siteForm.value.code = generateSiteCode(newName);
    }
  }
);
</script>
