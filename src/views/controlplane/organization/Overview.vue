<template>
  <!--begin::Organization Overview-->
  <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <!--begin::Summary Cards-->
    <CardWidget1
      :description="t('controlplane.organization.summary.totalOrganizations')"
      :value="0"
      bg-color="#1B84FF"
      text-color="white"
    />
    <CardWidget1
      :description="t('controlplane.organization.summary.totalTeams')"
      :value="0"
      bg-color="#17C653"
      text-color="white"
    />
    <CardWidget1
      :description="t('controlplane.organization.summary.totalUsers')"
      :value="0"
      bg-color="#3699FF"
      text-color="white"
    />
    <CardWidget1
      :description="t('controlplane.organization.summary.totalCameras')"
      :value="0"
      bg-color="#FFA800"
      text-color="white"
    />
  </div>
  <!--end::Summary Cards-->

  <!--begin::Error Alert-->
  <div
    v-if="error"
    class="mb-5 flex items-start gap-4 rounded-lg border border-danger-light bg-danger-light p-4"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="flex flex-1 flex-col text-danger">
      <h5 class="m-0 mb-1 font-semibold">{{ t("controlplane.organization.error.title") }}</h5>
      <span>{{ error }}</span>
    </div>
    <button
      type="button"
      @click="error = null"
      aria-label="Close"
      class="rounded-md p-1 text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger"
    >
      <i class="ki-duotone ki-cross fs-2">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
    </button>
  </div>
  <!--end::Error Alert-->

  <!--begin::Organizations List-->
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <!--begin::Card header-->
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.organization.toolbar.title") }}
      </h3>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Items per page -->
        <div class="flex items-center">
          <label class="mr-2 mb-0 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.organization.toolbar.itemsLabel") }}
          </label>
          <select
            v-model.number="pagination.per_page"
            @change="changeItemsPerPage"
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm tabular-nums transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option :value="1">1</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>

        <!-- Search -->
        <div class="relative flex items-center">
          <i class="ki-duotone ki-magnifier fs-3 pointer-events-none absolute left-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('controlplane.organization.toolbar.searchPlaceholder')"
            class="w-[250px] rounded-md border border-gray-300 bg-gray-100 py-2 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          v-if="error"
          @click="fetchOrganizations(pagination.page)"
          :disabled="loading"
          class="inline-flex items-center gap-2 rounded-md bg-warning-light px-3 py-2 text-sm font-semibold text-warning transition-colors hover:bg-warning hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="loading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          ></span>
          <i v-else class="ki-duotone ki-arrows-circle fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{
            loading
              ? t("controlplane.organization.toolbar.retrying")
              : t("controlplane.organization.toolbar.retry")
          }}
        </button>

        <button
          @click="showAddOrganizationModal"
          :disabled="loading"
          class="inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.organization.toolbar.addButton") }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <KTDataTable
        :data="filteredAndSortedOrganizations"
        :header="tableHeader"
        :checkbox-enabled="false"
        :items-per-page-dropdown-enabled="false"
        :items-per-page="pagination.per_page"
        :current-page="pagination.page"
        :loading="loading"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        @on-sort="handleSort"
        @page-change="goToPage"
        @on-items-per-page-change="(val) => { pagination.per_page = val; changeItemsPerPage(); }"
        :empty-table-text="emptyTableMessage"
      >
        <template v-slot:name="{ row }">
          <div class="flex items-center">
            <InitialAvatar :name="row.name" class="mr-5" />
            <div class="flex flex-col">
              <span class="font-bold text-gray-900 hover:text-primary dark:text-gray-100">{{
                row.name
              }}</span>
              <span class="text-sm text-gray-500">{{
                row.legalName || row.description || t("controlplane.organization.common.unknown")
              }}</span>
            </div>
          </div>
        </template>

        <template v-slot:email="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">{{
            row.email || t("controlplane.organization.common.unknown")
          }}</span>
        </template>

        <template v-slot:phone="{ row }">
          <span class="block font-bold tabular-nums text-gray-900 dark:text-gray-100">{{
            row.phone || t("controlplane.organization.common.unknown")
          }}</span>
        </template>

        <template v-slot:country="{ row }">
          <span class="inline-flex rounded bg-info-light px-2 py-1 text-xs font-semibold text-info">{{
            row.country || t("controlplane.organization.common.unknown")
          }}</span>
        </template>

        <template v-slot:status="{ row }">
          <span :class="statusBadgeClass(row.status)">
            {{ resolveStatusLabel(row.status) }}
          </span>
        </template>

        <template v-slot:created_at="{ row }">
          <span class="block font-bold tabular-nums text-gray-900 dark:text-gray-100">{{
            formatDate(row.created_at)
          }}</span>
        </template>

        <template v-slot:actions="{ row }">
          <div class="flex justify-end gap-1">
            <RowActionButton
              @click="showOrganizationMembers(row)"
              :title="t('controlplane.organization.actions.viewMembers')"
              variant="success"
            >
              <i class="ki-duotone ki-people fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              :to="{ name: 'account-overview', query: { orgId: row.uid } }"
              :title="t('controlplane.organization.actions.manageAccounts')"
            >
              <i class="ki-duotone ki-switch fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton @click="openEditModal(row)" :title="t('controlplane.organization.actions.edit')">
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              @click="deleteOrganization(row)"
              :title="t('controlplane.organization.actions.delete')"
              variant="danger"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
          </div>
        </template>
      </KTDataTable>

      <!--begin::Pagination-->
      <Pagination
        v-if="!loading"
        :page="pagination.page"
        :per-page="pagination.per_page"
        :total-items="pagination.total_items || organizations.length"
        :total-pages="Math.max(1, pagination.total_pages)"
        @page-change="goToPage"
      />
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Organizations List-->

  <!-- Add Organization Dialog -->
  <dialog
    ref="addOrganizationDialog"
    class="m-auto w-full max-w-2xl rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="addOrganizationDialog?.close()"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.organization.modals.add.title") }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="addOrganizationDialog?.close()"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="createOrganization">
      <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.name")
          }}</label>
          <input
            type="text"
            v-model="newOrganization.name"
            required
            :class="formInputClass"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.legalName")
          }}</label>
          <input type="text" v-model="newOrganization.legalName" :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.email")
          }}</label>
          <input type="email" v-model="newOrganization.email" required :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.phone")
          }}</label>
          <input type="tel" v-model="newOrganization.phone" :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.website")
          }}</label>
          <input type="url" v-model="newOrganization.website" :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.country")
          }}</label>
          <input type="text" v-model="newOrganization.country" :class="formInputClass" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.address")
          }}</label>
          <textarea v-model="newOrganization.address" rows="3" :class="formInputClass" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.status")
          }}</label>
          <select v-model="newOrganization.status" :class="formInputClass">
            <option value="active">{{ t("controlplane.organization.form.statusOptions.active") }}</option>
            <option value="inactive">{{ t("controlplane.organization.form.statusOptions.inactive") }}</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="addOrganizationDialog?.close()"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
        >
          {{ t("controlplane.organization.common.cancel") }}
        </button>
        <button
          type="submit"
          :disabled="creating"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="creating"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ t("controlplane.organization.modals.add.submit") }}
        </button>
      </div>
    </form>
  </dialog>

  <!-- Edit Organization Dialog -->
  <dialog
    ref="editOrganizationDialog"
    class="m-auto w-full max-w-2xl rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="editOrganizationDialog?.close()"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.organization.modals.edit.title") }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="editOrganizationDialog?.close()"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="updateOrganization">
      <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.name")
          }}</label>
          <input type="text" v-model="editOrganization.name" required :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.legalName")
          }}</label>
          <input type="text" v-model="editOrganization.legalName" :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.email")
          }}</label>
          <input type="email" v-model="editOrganization.email" required :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.phone")
          }}</label>
          <input type="tel" v-model="editOrganization.phone" :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.website")
          }}</label>
          <input type="url" v-model="editOrganization.website" :class="formInputClass" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.country")
          }}</label>
          <input type="text" v-model="editOrganization.country" :class="formInputClass" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.address")
          }}</label>
          <textarea v-model="editOrganization.address" rows="3" :class="formInputClass" />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
            t("controlplane.organization.form.status")
          }}</label>
          <select v-model="editOrganization.status" :class="formInputClass">
            <option value="active">{{ t("controlplane.organization.form.statusOptions.active") }}</option>
            <option value="inactive">{{ t("controlplane.organization.form.statusOptions.inactive") }}</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="editOrganizationDialog?.close()"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
        >
          {{ t("controlplane.organization.common.cancel") }}
        </button>
        <button
          type="submit"
          :disabled="updating"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="updating"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ t("controlplane.organization.modals.edit.submit") }}
        </button>
      </div>
    </form>
  </dialog>

  <!-- Delete Confirmation Dialog -->
  <ConfirmDialog
    ref="deleteOrganizationDialog"
    :title="t('controlplane.organization.modals.delete.title')"
    :cancel-label="t('controlplane.organization.common.cancel')"
    :confirm-label="t('controlplane.organization.modals.delete.submit')"
    :loading="deleting"
    @confirm="confirmDelete"
  >
    <p>
      {{ t("controlplane.organization.modals.delete.confirmPrefix") }}
      <strong>{{ organizationToDelete?.name }}</strong>
      {{ t("controlplane.organization.modals.delete.confirmSuffix") }}
    </p>
    <p class="text-gray-500">{{ t("controlplane.organization.modals.delete.warning") }}</p>
  </ConfirmDialog>

  <!-- Organization Membership Modal -->
  <MembershipListModal
    ref="organizationMembershipModalRef"
    entity-type="organization"
    :entity-uid="selectedOrganizationUid"
    modal-id="organizationMembershipModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import Pagination from '@/components/common/Pagination.vue'
import KTDataTable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import MembershipListModal from "@/components/modals/membership/MembershipListModal.vue";
import CardWidget1 from "@/components/dashboard-default-widgets/CardWidget1.vue";
import InitialAvatar from "@/components/common/InitialAvatar.vue";
import RowActionButton from "@/components/common/RowActionButton.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import { formInputClass, badgeVariantClass } from "@/core/helpers/badge";
import { useI18n } from "vue-i18n";

// Interface definitions
interface Organization {
  uid: string;
  name: string;
  legalName?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  country?: string;
  status?: "active" | "inactive" | "pending";
  created_at: string;
  updated_at?: string;
  created_by?: {
    username: string;
    email: string;
  };
  description?: string;
}

// Reactive data
const organizations = ref<Organization[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");
const sortLabel = ref("");
const sortOrder = ref<"asc" | "desc">("asc");

// Modal states
const creating = ref(false);
const updating = ref(false);
const deleting = ref(false);
const newOrganization = ref<Partial<Organization>>({
  name: "",
  legalName: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  country: "",
  status: "active",
});
const editOrganization = ref<Partial<Organization>>({});
const organizationToDelete = ref<Organization | null>(null);

// Modal references
const organizationMembershipModalRef = ref();
const selectedOrganizationUid = ref('');
const addOrganizationDialog = ref<HTMLDialogElement | null>(null);
const editOrganizationDialog = ref<HTMLDialogElement | null>(null);
const deleteOrganizationDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const { t } = useI18n();

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t('controlplane.organization.table.organizationName'),
    columnLabel: "name",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.email'),
    columnLabel: "email",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.phone'),
    columnLabel: "phone",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.country'),
    columnLabel: "country",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.status'),
    columnLabel: "status",
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.organization.table.created'),
    columnLabel: "created_at",
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('controlplane.organization.table.actions'),
    columnLabel: "actions",
    sortEnabled: false,
    searchable: false,
  },
]);

const emptyTableMessage = computed(() => {
  if (loading.value) {
    return t('controlplane.organization.empty.loading');
  }
  if (searchQuery.value.trim()) {
    return t('controlplane.organization.empty.searchNoResults', { query: searchQuery.value });
  }
  return t('controlplane.organization.empty.noResults');
});

const resolveStatusLabel = (
  status: Organization["status"] | string | undefined
): string => {
  if (status === "active" || status === "inactive" || status === "pending") {
    return t(`controlplane.organization.table.statusLabel.${status}`);
  }
  return t('controlplane.organization.common.unknown');
};

const statusBadgeClass = (
  status: Organization["status"] | string | undefined
): string => {
  const base = "inline-flex rounded px-2 py-1 text-xs font-semibold";
  if (status === "active") return `${base} ${badgeVariantClass("success")}`;
  if (status === "inactive") return `${base} ${badgeVariantClass("danger")}`;
  if (status === "pending") return `${base} ${badgeVariantClass("warning")}`;
  return `${base} ${badgeVariantClass("secondary")}`;
};

// Pagination state
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null as number | null,
  prev_page: null as number | null,
});

// Fetch organizations from API
const fetchOrganizations = async (page: number = 1) => {
  loading.value = true;
  error.value = null;
  try {
    console.log("🚀 Fetching organizations...", { page, per_page: pagination.value.per_page });
    // Some backends expect `page_size` instead of `per_page` (see API docs).
    // Send both for compatibility: `page_size` (server) and `per_page` (client-side/legacy)
    const resp = await ApiService.query("/organizations", {
      params: { page, page_size: pagination.value.per_page, per_page: pagination.value.per_page },
    });
    console.log("📡 Full API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found organizations in data array:", resp.data.data);
        organizations.value = resp.data.data;
        
        // Update pagination info but preserve user-selected per_page
        if (resp.data.pagination) {
          const currentPerPage = pagination.value.per_page; // Preserve user's choice
          const totalItems = resp.data.pagination.total_items ?? organizations.value.length;
          // Recalculate total_pages based on the user's per_page selection (not server's per_page field)
          const recalculatedTotalPages = Math.max(1, Math.ceil(totalItems / (currentPerPage || 1)));

          pagination.value = {
            ...resp.data.pagination,
            page: page, // ensure pagination.page matches the requested page
            per_page: currentPerPage, // Keep user's selected per_page
            total_pages: recalculatedTotalPages, // Recalculate based on user's per_page
            total_items: totalItems,
            next_page: page < recalculatedTotalPages ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
          };
        }
        
        // Format created_at for each organization
        organizations.value.forEach((org) => {
          if (org.created_at && typeof org.created_at === "string") {
            org.created_at = new Date(org.created_at).toLocaleDateString();
          }
        });
        
        // Ensure pagination.total_pages consistent with per_page and total_items
        if (pagination.value.total_items == null) {
          pagination.value.total_items = organizations.value.length;
        }
        pagination.value.total_pages = Math.max(1, Math.ceil((pagination.value.total_items || 0) / (pagination.value.per_page || 1)));
        pagination.value.next_page = pagination.value.page < pagination.value.total_pages ? pagination.value.page + 1 : null;
        pagination.value.prev_page = pagination.value.page > 1 ? pagination.value.page - 1 : null;

        console.log("🎯 Final organizations:", organizations.value);
        console.log("📄 Pagination:", pagination.value);
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found organizations in direct data array:", resp.data);
        organizations.value = resp.data;
        
        // Calculate pagination manually if server doesn't provide it
        const totalItems = organizations.value.length;
        const totalPages = Math.ceil(totalItems / pagination.value.per_page);
        pagination.value = {
          page: page,
          per_page: pagination.value.per_page,
          total_pages: totalPages,
          total_items: totalItems,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
        };
        
        // Format created_at for each organization
        organizations.value.forEach((org) => {
          if (org.created_at && typeof org.created_at === "string") {
            org.created_at = new Date(org.created_at).toLocaleDateString();
          }
        });
        
        console.log("🎯 Final organizations:", organizations.value);
        console.log("📄 Pagination:", pagination.value);
      } else {
        console.log("⚠️ Unexpected data format:", resp.data);
        organizations.value = [];
        // Reset pagination when no data
        pagination.value = {
          page: 1,
          per_page: pagination.value.per_page,
          total_pages: 1,
          total_items: 0,
          next_page: null,
          prev_page: null,
        };
      }
    }
  } catch (e: any) {
    console.error("💥 Error fetching organizations:", e);
    error.value =
      e?.response?.data?.message || e.message || t('controlplane.organization.error.loadFailed');
  } finally {
    loading.value = false;
  }
};

// Computed properties for summary statistics
const totalOrganizations = computed(() => organizations.value.length);
const activeOrganizations = computed(
  () => organizations.value.filter((org) => org.status === "active").length
);
const activeOrganizationsPercentage = computed(() =>
  totalOrganizations.value > 0
    ? Math.round((activeOrganizations.value / totalOrganizations.value) * 100)
    : 0
);

// Mock data for other stats (replace with actual API calls)
const totalUsers = computed(() =>
  organizations.value.reduce(
    (sum) => sum + Math.floor(Math.random() * 50) + 10,
    0
  )
);
const activeUsers = computed(() => Math.floor(totalUsers.value * 0.8));
const activeUsersPercentage = computed(() =>
  totalUsers.value > 0
    ? Math.round((activeUsers.value / totalUsers.value) * 100)
    : 0
);

const totalProjects = computed(() =>
  organizations.value.reduce(
    (sum) => sum + Math.floor(Math.random() * 20) + 5,
    0
  )
);
const activeProjects = computed(() => Math.floor(totalProjects.value * 0.7));
const activeProjectsPercentage = computed(() =>
  totalProjects.value > 0
    ? Math.round((activeProjects.value / totalProjects.value) * 100)
    : 0
);

const totalRevenue = computed(
  () => `$${(organizations.value.length * 15000).toLocaleString()}`
);
const revenueGrowth = computed(() => 75); // Mock percentage

// Search and Sort functionality
const filteredAndSortedOrganizations = computed(() => {
  let filtered = organizations.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        (org.email && org.email.toLowerCase().includes(query)) ||
        (org.country && org.country.toLowerCase().includes(query)) ||
        (org.status && org.status.toLowerCase().includes(query))
    );
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Organization];
      const bValue = b[sortLabel.value as keyof Organization];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder.value === "asc" ? comparison : -comparison;
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortOrder.value === "asc" ? comparison : -comparison;
      }
      return 0;
    });
  }

  // Apply client-side pagination if needed (when server doesn't provide paginated data)
  if (filtered.length > pagination.value.per_page) {
    const startIndex = (pagination.value.page - 1) * pagination.value.per_page;
    const endIndex = startIndex + pagination.value.per_page;
    return filtered.slice(startIndex, endIndex);
  }

  return filtered;
});

// Methods
const handleSort = (sort: { label: string; order: "asc" | "desc" }) => {
  sortLabel.value = sort.label;
  sortOrder.value = sort.order;
};

const showAddOrganizationModal = () => {
  // Reset form
  newOrganization.value = {
    name: "",
    legalName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    country: "",
    status: "active",
  };
  addOrganizationDialog.value?.showModal();
};

const createOrganization = async () => {
  if (!newOrganization.value.name || !newOrganization.value.email) return;

  creating.value = true;
  try {
    const resp = await ApiService.post("organizations", newOrganization.value);
    if (resp && resp.data) {
      // Refresh the organizations list
      await fetchOrganizations(pagination.value.page);
      addOrganizationDialog.value?.close();
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t('controlplane.organization.error.createFailed');
  } finally {
    creating.value = false;
  }
};

const openEditModal = (org: Organization) => {
  editOrganization.value = { ...org };
  editOrganizationDialog.value?.showModal();
};

const updateOrganization = async () => {
  if (
    !editOrganization.value.uid ||
    !editOrganization.value.name ||
    !editOrganization.value.email
  )
    return;

  updating.value = true;
  try {
    const resp = await ApiService.patch(
      `organizations/${editOrganization.value.uid}`,
      editOrganization.value
    );
    if (resp && resp.data) {
      // Refresh the organizations list
      await fetchOrganizations(pagination.value.page);
      editOrganizationDialog.value?.close();
    }
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t('controlplane.organization.error.updateFailed');
  } finally {
    updating.value = false;
  }
};

const deleteOrganization = (org: Organization) => {
  organizationToDelete.value = org;
  deleteOrganizationDialog.value?.showModal();
};

const confirmDelete = async () => {
  if (!organizationToDelete.value) return;

  deleting.value = true;
  try {
    await ApiService.delete(`organizations/${organizationToDelete.value.uid}`);

    // Refresh the organizations list
    await fetchOrganizations(pagination.value.page);
    deleteOrganizationDialog.value?.close();
    organizationToDelete.value = null;
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ||
      e.message ||
      t('controlplane.organization.error.deleteFailed');
  } finally {
    deleting.value = false;
  }
};

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

const showOrganizationMembers = (organization: Organization) => {
  console.log('showOrganizationMembers called for organization:', organization);
  selectedOrganizationUid.value = organization.uid;
  console.log('selectedOrganizationUid set to:', selectedOrganizationUid.value);
  
  // Wait a tick for Vue reactivity to update
  nextTick(() => {
    organizationMembershipModalRef.value?.showModal();
  });
};

// Pagination methods and computed properties
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchOrganizations(page);
  }
};

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchOrganizations(1);
};

const visiblePages = computed((): number[] => {
  const current = pagination.value.page;
  const total = Math.max(1, pagination.value.total_pages); // Pastikan minimal 1 halaman
  const pages: number[] = [];
  
  // Show max 5 page numbers
  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Initialize
onMounted(() => {
  fetchOrganizations();
});
</script>
