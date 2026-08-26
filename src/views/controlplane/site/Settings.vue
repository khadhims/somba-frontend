<template>
  <!--begin::Site Settings-->
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <!--begin::Card header-->
    <div class="p-6 pb-0">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.site.settings.title") }}
      </h3>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <!--begin::Form-->
      <form @submit.prevent="saveSite">
        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="required mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.name.label") }}
            </label>
            <input
              type="text"
              v-model="siteForm.name"
              :placeholder="t('controlplane.site.settings.form.fields.name.placeholder')"
              required
              :class="formInputClass"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.code.label") }}
            </label>
            <input
              type="text"
              v-model="siteForm.code"
              :placeholder="t('controlplane.site.settings.form.fields.code.placeholder')"
              readonly
              :class="[formInputClass, 'cursor-not-allowed opacity-70']"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.site.settings.form.fields.description.label") }}
          </label>
          <textarea
            v-model="siteForm.description"
            rows="3"
            :placeholder="t('controlplane.site.settings.form.fields.description.placeholder')"
            :class="formInputClass"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="required mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.site.settings.form.fields.address.label") }}
          </label>
          <textarea
            v-model="siteForm.address"
            rows="3"
            :placeholder="t('controlplane.site.settings.form.fields.address.placeholder')"
            required
            :class="formInputClass"
          ></textarea>
        </div>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.latitude.label") }}
            </label>
            <input
              type="number"
              v-model="siteForm.latitude"
              :placeholder="t('controlplane.site.settings.form.fields.latitude.placeholder')"
              step="any"
              :class="formInputClass"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.longitude.label") }}
            </label>
            <input
              type="number"
              v-model="siteForm.longitude"
              :placeholder="t('controlplane.site.settings.form.fields.longitude.placeholder')"
              step="any"
              :class="formInputClass"
            />
          </div>
        </div>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.contactPerson.label") }}
            </label>
            <input
              type="text"
              v-model="siteForm.contact_person"
              :placeholder="t('controlplane.site.settings.form.fields.contactPerson.placeholder')"
              :class="formInputClass"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.contactPhone.label") }}
            </label>
            <input
              type="tel"
              v-model="siteForm.contact_phone"
              :placeholder="t('controlplane.site.settings.form.fields.contactPhone.placeholder')"
              :class="formInputClass"
            />
          </div>
        </div>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.status.label") }}
            </label>
            <select v-model="siteForm.is_active" :class="formInputClass">
              <option :value="true">
                {{ t("controlplane.site.settings.form.fields.status.options.active") }}
              </option>
              <option :value="false">
                {{ t("controlplane.site.settings.form.fields.status.options.inactive") }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("controlplane.site.settings.form.fields.timezone.label") }}
            </label>
            <select v-model="siteForm.timezone" :class="formInputClass">
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
          </div>
        </div>

        <!--begin::Actions-->
        <div class="flex justify-center gap-3 pt-10">
          <button
            type="button"
            @click="resetForm"
            class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
          >
            {{ t("controlplane.site.settings.form.actions.reset") }}
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="isLoading" class="inline-flex items-center gap-2">
              {{ t("controlplane.site.settings.form.actions.loading") }}
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </span>
            <span v-else>
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
import { formInputClass } from "@/core/helpers/badge";

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
