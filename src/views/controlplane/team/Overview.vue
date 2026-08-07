<template>
  <!--begin::Team Overview-->
  <!--begin::Organization & Account Switcher-->
  <div
    class="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h4 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ t("controlplane.team.header.title") }}
        </h4>
        <p class="m-0 text-gray-500">
          <span v-if="currentAccount">{{
            t("controlplane.team.header.subtitleWithAccount", { name: currentAccount.name })
          }}</span>
          <span v-else>{{ t("controlplane.team.header.subtitleDefault") }}</span>
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-4">
        <div class="flex items-center">
          <label class="mr-3 mb-0 shrink-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.team.filters.organizationLabel") }}:
          </label>
          <select
            v-model="selectedOrganizationId"
            @change="switchOrganization"
            :disabled="loadingOrganizations"
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="" disabled>
              {{
                loadingOrganizations
                  ? t("controlplane.team.filters.organizationLoading")
                  : t("controlplane.team.filters.organizationPlaceholder")
              }}
            </option>
            <option v-for="org in organizations" :key="org.uid" :value="org.uid">
              {{ org.name }}
            </option>
          </select>
          <span
            v-if="loadingOrganizations"
            role="status"
            class="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
          >
            <span class="sr-only">{{ t("controlplane.team.filters.organizationLoading") }}</span>
          </span>
        </div>

        <div class="flex items-center">
          <label class="mr-3 mb-0 shrink-0 font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.team.filters.accountLabel") }}:
          </label>
          <select
            v-model="selectedAccountId"
            @change="switchAccount"
            :disabled="loadingAccounts || !selectedOrganizationId || accounts.length === 0"
            class="w-[200px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="" disabled>
              <span v-if="!selectedOrganizationId">{{ t("controlplane.team.filters.accountRequiresOrganization") }}</span>
              <span v-else-if="loadingAccounts">{{ t("controlplane.team.filters.accountLoading") }}</span>
              <span v-else-if="accounts.length === 0">{{ t("controlplane.team.filters.accountEmpty") }}</span>
              <span v-else>{{ t("controlplane.team.filters.accountPlaceholder") }}</span>
            </option>
            <option v-for="account in accounts" :key="account.uid" :value="account.uid">
              {{ account.name }}
            </option>
          </select>
          <span
            v-if="loadingAccounts"
            role="status"
            class="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
          >
            <span class="sr-only">{{ t("controlplane.team.filters.accountLoading") }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
  <!--end::Organization & Account Switcher-->

  <!--begin::Error Alert-->
  <div
    v-if="error"
    role="alert"
    class="mb-5 flex items-start gap-4 rounded-lg border border-danger-light bg-danger-light p-4"
  >
    <i class="ki-duotone ki-cross-circle fs-2hx text-danger">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    <div class="flex flex-1 flex-col text-danger">
      <h5 class="m-0 mb-1 font-semibold">{{ t("controlplane.team.error.title") }}</h5>
      <span>{{ error }}</span>
    </div>
    <button
      @click="error = null"
      type="button"
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

  <!--begin::Teams List-->
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
    <!--begin::Card header-->
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 pb-0">
      <h3 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.team.toolbar.title") }}
      </h3>

      <div class="flex flex-wrap items-center gap-4">
        <!-- Items per page -->
        <div class="flex items-center">
          <label class="mr-2 mb-0 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ t("controlplane.team.toolbar.itemsLabel") }}
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
            :placeholder="t('controlplane.team.toolbar.searchPlaceholder')"
            class="w-[250px] rounded-md border border-gray-300 bg-gray-100 py-2 pr-3 pl-12 text-sm text-gray-900 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <button
          @click="showAddTeamModal"
          :disabled="!selectedAccountId"
          class="inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t("controlplane.team.toolbar.addButton") }}
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="p-6">
      <KTDataTable
          :data="filteredAndSortedTeams"
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
            <span class="font-bold text-gray-900 hover:text-primary dark:text-gray-100">{{ row.name }}</span>
          </div>
        </template>

        <template v-slot:created_by="{ row }">
          <span class="block font-bold text-gray-900 dark:text-gray-100">
            {{ row.created_by?.username || t("controlplane.team.common.unknown") }}
          </span>
          <span class="block text-sm text-gray-500">
            {{ row.created_by?.email || "" }}
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
              @click="showTeamMembers(row)"
              :title="t('controlplane.team.actions.viewMembers')"
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
              :to="{ name: 'site-overview', query: { account_id: selectedAccountId } }"
              :title="t('controlplane.team.actions.addSite')"
              variant="success"
            >
              <i class="ki-duotone ki-home fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton @click="editTeam(row)" :title="t('controlplane.team.actions.edit')">
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </RowActionButton>
            <RowActionButton
              @click="deleteTeam(row)"
              :title="t('controlplane.team.actions.delete')"
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
        :total-items="pagination.total_items || teams.length"
        :total-pages="Math.max(1, pagination.total_pages)"
        @page-change="goToPage"
      />
      <!--end::Pagination-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Teams List-->

  <!-- Add Team Dialog -->
  <dialog
    ref="addTeamDialog"
    class="m-auto w-full max-w-lg rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="addTeamDialog?.close()"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.team.modals.add.title") }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="addTeamDialog?.close()"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="createTeam">
      <div class="p-5">
        <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
          t("controlplane.team.modals.add.nameLabel")
        }}</label>
        <input type="text" v-model="newTeam.name" required :class="formInputClass" />
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="addTeamDialog?.close()"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
        >
          {{ t("controlplane.team.modals.add.cancel") }}
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
          {{ t("controlplane.team.modals.add.submit") }}
        </button>
      </div>
    </form>
  </dialog>

  <!-- Edit Team Dialog -->
  <dialog
    ref="editTeamDialog"
    class="m-auto w-full max-w-lg rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="closeEditTeamDialog"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t("controlplane.team.modals.edit.title") }}
      </h5>
      <button
        type="button"
        aria-label="Close"
        @click="closeEditTeamDialog"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <form @submit.prevent="updateTeam" v-if="teamToEdit">
      <div class="p-5">
        <label class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">{{
          t("controlplane.team.modals.edit.nameLabel")
        }}</label>
        <input type="text" v-model="teamToEdit.name" required :class="formInputClass" />
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          @click="closeEditTeamDialog"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
        >
          {{ t("controlplane.team.modals.edit.cancel") }}
        </button>
        <button
          type="submit"
          :disabled="editing"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="editing"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          ></span>
          {{ t("controlplane.team.modals.edit.submit") }}
        </button>
      </div>
    </form>
  </dialog>

  <!-- Delete Confirmation Dialog -->
  <ConfirmDialog
    ref="deleteTeamDialog"
    :title="t('controlplane.team.modals.delete.title')"
    :cancel-label="t('controlplane.team.modals.delete.cancel')"
    :confirm-label="t('controlplane.team.modals.delete.submit')"
    :loading="deleting"
    @confirm="confirmDelete"
  >
    <p>
      {{ t("controlplane.team.modals.delete.confirmPrefix") }}
      <strong>{{ teamToDelete?.name }}</strong>{{ t("controlplane.team.modals.delete.confirmSuffix") }}
    </p>
    <p class="text-gray-500">{{ t("controlplane.team.modals.delete.warning") }}</p>
  </ConfirmDialog>

  <!-- Team Membership Modal -->
  <MembershipListModal
    ref="teamMembershipModalRef"
    entity-type="team"
    :entity-uid="selectedTeamUid"
    modal-id="teamMembershipModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import KTDataTable from '@/components/kt-datatable/KTDataTable.vue'
import ApiService from '@/core/services/ApiService'
import Pagination from '@/components/common/Pagination.vue'
import MembershipListModal from '@/components/modals/membership/MembershipListModal.vue'
import InitialAvatar from '@/components/common/InitialAvatar.vue'
import RowActionButton from '@/components/common/RowActionButton.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formInputClass } from '@/core/helpers/badge'

// Interface definitions
interface Team {
  uid: string
  name: string
  account_uid?: string
  created_by?: {
    username: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface Account {
  uid: string
  name: string
  organization_uid?: string
  created_by?: {
    username: string
    email: string
  }
  created_at: string
  updated_at: string
}

interface Organization {
  uid: string
  name: string
  legalName?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  country?: string
  status?: 'active' | 'inactive'
  created_at: string
  updated_at?: string
  created_by?: {
    username: string
    email: string
  }
  description?: string
}

const teams = ref<Team[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortLabel = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Pagination state
const pagination = ref({
  page: 1,
  per_page: 10,
  total_pages: 1,
  total_items: 0,
  next_page: null as number | null,
  prev_page: null as number | null,
})

// Organization-related reactive data
const organizations = ref<Organization[]>([])
const loadingOrganizations = ref(false)
const selectedOrganizationId = ref('')
const currentOrganization = ref<Organization | null>(null)

// Account-related reactive data
const accounts = ref<Account[]>([])
const loadingAccounts = ref(false)
const selectedAccountId = ref('')
const currentAccount = ref<Account | null>(null)

// Modal states
const creating = ref(false)
const deleting = ref(false)
const editing = ref(false)
const newTeam = ref<Partial<Team>>({
  name: '',
})
const teamToEdit = ref<Team | null>(null)
const teamToDelete = ref<Team | null>(null)

// Modal references
const teamMembershipModalRef = ref()
const selectedTeamUid = ref('')
const addTeamDialog = ref<HTMLDialogElement | null>(null)
const deleteTeamDialog = ref<InstanceType<typeof ConfirmDialog> | null>(null)
const editTeamDialog = ref<HTMLDialogElement | null>(null)

const closeEditTeamDialog = () => {
  editTeamDialog.value?.close()
  teamToEdit.value = null
}

// Table header configuration
const tableHeader = computed(() => [
  {
    columnName: t('controlplane.team.table.teamName'),
    columnLabel: 'name',
    sortEnabled: true,
    searchable: true,
  },
  {
    columnName: t('controlplane.team.table.createdBy'),
    columnLabel: 'created_by',
    sortEnabled: false,
    searchable: false,
  },
  {
    columnName: t('controlplane.team.table.createdAt'),
    columnLabel: 'created_at',
    sortEnabled: true,
    searchable: false,
  },
  {
    columnName: t('controlplane.team.table.actions'),
    columnLabel: 'actions',
    sortEnabled: false,
    searchable: false,
  },
])

// Get route instance to read query parameters
const route = useRoute()

const { t } = useI18n()

// Organization-related functions
const saveLastSelectedOrganization = (orgId: string) => {
  localStorage.setItem('lastSelectedOrganization', orgId)
}

const loadLastSelectedOrganization = (): string | null => {
  return localStorage.getItem('lastSelectedOrganization')
}

// Account-related functions
const saveLastSelectedAccount = (accountId: string) => {
  localStorage.setItem('lastSelectedAccount', accountId)
}

const loadLastSelectedAccount = (): string | null => {
  return localStorage.getItem('lastSelectedAccount')
}

// Fetch organizations from API
const fetchOrganizations = async () => {
  loadingOrganizations.value = true
  try {
    console.log("🚀 Fetching organizations...");
    const resp = await ApiService.query("organizations", {})
    console.log("📡 Organizations API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found organizations in data array:", resp.data.data);
        organizations.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found organizations in direct data array:", resp.data);
        organizations.value = resp.data;
      } else {
        console.log("⚠️ Unexpected organizations data format:", resp.data);
        organizations.value = [];
      }
      
      console.log("🎯 Final organizations:", organizations.value);
      
      // Check if orgId is provided in URL query parameters
      const orgIdFromUrl = route.query.orgId as string
      
      if (orgIdFromUrl) {
        // Find the organization by the provided orgId
        const orgFromUrl = organizations.value.find(o => o.uid === orgIdFromUrl)
        if (orgFromUrl) {
          selectedOrganizationId.value = orgFromUrl.uid
          currentOrganization.value = orgFromUrl
          // Save this as the last selected organization
          saveLastSelectedOrganization(orgFromUrl.uid)
          // Fetch accounts for the selected organization
          fetchAccounts()
        } else {
          // If orgId not found, try to use last selected organization
          const lastSelectedOrgId = loadLastSelectedOrganization()
          if (lastSelectedOrgId) {
            const lastOrg = organizations.value.find(o => o.uid === lastSelectedOrgId)
            if (lastOrg) {
              selectedOrganizationId.value = lastOrg.uid
              currentOrganization.value = lastOrg
              fetchAccounts()
            } else {
              // If last selected not found, use first organization
              selectedOrganizationId.value = organizations.value[0]?.uid || ''
              currentOrganization.value = organizations.value[0] || null
              if (organizations.value[0]) {
                saveLastSelectedOrganization(organizations.value[0].uid)
                fetchAccounts()
              }
            }
          } else {
            // No last selected, use first organization
            selectedOrganizationId.value = organizations.value[0]?.uid || ''
            currentOrganization.value = organizations.value[0] || null
            if (organizations.value[0]) {
              saveLastSelectedOrganization(organizations.value[0].uid)
              fetchAccounts()
            }
          }
        }
      } else if (!selectedOrganizationId.value && organizations.value.length > 0) {
        // Try to use last selected organization first
        const lastSelectedOrgId = loadLastSelectedOrganization()
        if (lastSelectedOrgId) {
          const lastOrg = organizations.value.find(o => o.uid === lastSelectedOrgId)
          if (lastOrg) {
            selectedOrganizationId.value = lastOrg.uid
            currentOrganization.value = lastOrg
          } else {
            // Last selected not found, use first organization
            selectedOrganizationId.value = organizations.value[0].uid
            currentOrganization.value = organizations.value[0]
            saveLastSelectedOrganization(organizations.value[0].uid)
          }
        } else {
          // No last selected, use first organization
          selectedOrganizationId.value = organizations.value[0].uid
          currentOrganization.value = organizations.value[0]
          saveLastSelectedOrganization(organizations.value[0].uid)
        }
        fetchAccounts()
      }
    }
  } catch (e: any) {
    console.error('Failed to load organizations:', e)
  } finally {
    loadingOrganizations.value = false
  }
}

// Fetch accounts from API
const fetchAccounts = async () => {
  if (!selectedOrganizationId.value) return

  loadingAccounts.value = true
  try {
    console.log("🚀 Fetching accounts for organization:", selectedOrganizationId.value);
    const resp = await ApiService.query(`organizations/${selectedOrganizationId.value}/accounts`, {})
    console.log("📡 Accounts API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found accounts in data array:", resp.data.data);
        accounts.value = resp.data.data;
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found accounts in direct data array:", resp.data);
        accounts.value = resp.data;
      } else {
        console.log("⚠️ Unexpected accounts data format:", resp.data);
        accounts.value = [];
      }
      
      console.log("🎯 Final accounts:", accounts.value);
      
      // Check if accountId is provided in URL query parameters
      const accountIdFromUrl = route.query.accountId as string
      
      if (accountIdFromUrl) {
        // Find the account by the provided accountId
        const accountFromUrl = accounts.value.find(a => a.uid === accountIdFromUrl)
        if (accountFromUrl) {
          selectedAccountId.value = accountFromUrl.uid
          currentAccount.value = accountFromUrl
          // Save this as the last selected account
          saveLastSelectedAccount(accountFromUrl.uid)
          // Fetch teams for the selected account
          fetchTeams(pagination.value.page)
          return
        }
      }
      
      // If no accountId from URL or not found, try to use last selected account
      const lastSelectedAccountId = loadLastSelectedAccount()
      if (lastSelectedAccountId) {
        const lastAccount = accounts.value.find(a => a.uid === lastSelectedAccountId)
        if (lastAccount) {
          selectedAccountId.value = lastAccount.uid
          currentAccount.value = lastAccount
        } else {
          // Last selected not found, use first account
          selectedAccountId.value = accounts.value[0]?.uid || ''
          currentAccount.value = accounts.value[0] || null
          if (accounts.value[0]) {
            saveLastSelectedAccount(accounts.value[0].uid)
          }
        }
      } else {
        // No last selected, use first account
        selectedAccountId.value = accounts.value[0]?.uid || ''
        currentAccount.value = accounts.value[0] || null
        if (accounts.value[0]) {
          saveLastSelectedAccount(accounts.value[0].uid)
        }
      }
      
      // Fetch teams for the selected account
      fetchTeams(pagination.value.page)
    }
  } catch (e: any) {
    console.error('Failed to load accounts:', e)
  } finally {
    loadingAccounts.value = false
  }
}

// Fetch teams from API
const fetchTeams = async (page: number = 1) => {
  if (!selectedAccountId.value) return

  loading.value = true
  error.value = null
  try {
    console.log("🚀 Fetching teams for account:", selectedAccountId.value, { page, per_page: pagination.value.per_page });
    // Send both page_size (server) and per_page (client) for compatibility
    const resp = await ApiService.query(`accounts/${selectedAccountId.value}/teams`, {
      params: { page, page_size: pagination.value.per_page, per_page: pagination.value.per_page }
    })
    console.log("📡 Teams API Response:", resp);
    
    if (resp && resp.data) {
      // Backend mengembalikan struktur: { status, code, message, data: [...], pagination: {...} }
      if (resp.data.status === "success" && resp.data.data && Array.isArray(resp.data.data)) {
        console.log("✅ Found teams in data array:", resp.data.data);
        teams.value = resp.data.data;
        
        // Update pagination info but preserve user-selected per_page
        if (resp.data.pagination) {
          const currentPerPage = pagination.value.per_page; // Preserve user's choice
          const totalItems = resp.data.pagination.total_items ?? teams.value.length;
          const recalculatedTotalPages = Math.max(1, Math.ceil(totalItems / (currentPerPage || 1)));

          pagination.value = {
            ...resp.data.pagination,
            page: page,
            per_page: currentPerPage,
            total_pages: recalculatedTotalPages,
            total_items: totalItems,
            next_page: page < recalculatedTotalPages ? page + 1 : null,
            prev_page: page > 1 ? page - 1 : null,
          };
        }
      } else if (Array.isArray(resp.data)) {
        console.log("✅ Found teams in direct data array:", resp.data);
        teams.value = resp.data;
        
        // Calculate pagination manually if server doesn't provide it
        const totalItems = teams.value.length;
        const totalPages = Math.ceil(totalItems / pagination.value.per_page);
        pagination.value = {
          page: page,
          per_page: pagination.value.per_page,
          total_pages: totalPages,
          total_items: totalItems,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
        };
      } else {
        console.log("⚠️ Unexpected teams data format:", resp.data);
        teams.value = [];
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
      
      // Format created_at for each team
      teams.value.forEach(team => {
        if (team.created_at && typeof team.created_at === 'string') {
          team.created_at = new Date(team.created_at).toLocaleDateString()
        }
      })
      
      // Ensure pagination.total_pages consistent with per_page and total_items
      if (pagination.value.total_items == null) {
        pagination.value.total_items = teams.value.length;
      }
      pagination.value.total_pages = Math.max(1, Math.ceil((pagination.value.total_items || 0) / (pagination.value.per_page || 1)));
      pagination.value.next_page = pagination.value.page < pagination.value.total_pages ? pagination.value.page + 1 : null;
      pagination.value.prev_page = pagination.value.page > 1 ? pagination.value.page - 1 : null;

      console.log("🎯 Final teams:", teams.value);
      console.log("📄 Pagination:", pagination.value);
    } else {
      console.log("⚠️ No valid teams response data");
      teams.value = []
    }
  } catch (e: any) {
    console.error('❌ Error fetching teams:', e)
    error.value = e?.response?.data?.message || e.message || t('controlplane.team.notifications.loadFailed')
  } finally {
    loading.value = false
    console.log("📋 Teams fetch complete. Total teams:", teams.value.length);
  }
}

// Methods
const handleSort = (sort: { label: string; order: 'asc' | 'desc' }) => {
  sortLabel.value = sort.label
  sortOrder.value = sort.order
}

const switchOrganization = () => {
  const org = organizations.value.find(o => o.uid === selectedOrganizationId.value)
  currentOrganization.value = org || null
  // Save the selected organization to localStorage
  if (selectedOrganizationId.value) {
    saveLastSelectedOrganization(selectedOrganizationId.value)
  }
  // Clear accounts and teams when organization changes
  accounts.value = []
  teams.value = []
  selectedAccountId.value = ''
  currentAccount.value = null
  // Fetch accounts for the new organization
  fetchAccounts()
}

const switchAccount = () => {
  const account = accounts.value.find(a => a.uid === selectedAccountId.value)
  currentAccount.value = account || null
  // Save the selected account to localStorage
  if (selectedAccountId.value) {
    saveLastSelectedAccount(selectedAccountId.value)
  }
  // Fetch teams for the selected account
  fetchTeams(pagination.value.page)
}

const showAddTeamModal = () => {
  // Reset form
  newTeam.value = {
    name: '',
  }
  addTeamDialog.value?.showModal()
}

const createTeam = async () => {
  if (!newTeam.value.name || !selectedAccountId.value) return

  // Include account context
  const teamData = {
    ...newTeam.value,
  }

  creating.value = true
  try {
    const resp = await ApiService.post(`accounts/${selectedAccountId.value}/teams`, teamData)
    if (resp && resp.data) {
      // Refresh the teams list
      await fetchTeams(pagination.value.page)
      addTeamDialog.value?.close()
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || t('controlplane.team.notifications.createFailed')
  } finally {
    creating.value = false
  }
}

const deleteTeam = (team: Team) => {
  teamToDelete.value = team
  deleteTeamDialog.value?.showModal()
}

const confirmDelete = async () => {
  if (!teamToDelete.value) return

  deleting.value = true
  try {
    await ApiService.delete(`teams/${teamToDelete.value.uid}`)
    // Refresh the teams list
    await fetchTeams(pagination.value.page)
    deleteTeamDialog.value?.close()
    teamToDelete.value = null
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || t('controlplane.team.notifications.deleteFailed')
  } finally {
    deleting.value = false
  }
}

const showTeamMembers = (team: Team) => {
  selectedTeamUid.value = team.uid
  teamMembershipModalRef.value?.showModal()
}

const editTeam = (team: Team) => {
  teamToEdit.value = { ...team } // Create a copy to avoid direct mutation
  editTeamDialog.value?.showModal()
}

const updateTeam = async () => {
  if (!teamToEdit.value || !teamToEdit.value.name?.trim()) return

  editing.value = true
  try {
    const resp = await ApiService.patch(`teams/${teamToEdit.value.uid}`, {
      name: teamToEdit.value.name
    })
    if (resp && resp.data) {
      // Refresh the teams list
      await fetchTeams(pagination.value.page)
      editTeamDialog.value?.close()
      teamToEdit.value = null
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || e.message || t('controlplane.team.notifications.updateFailed')
  } finally {
    editing.value = false
  }
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString() : '-'
}

// Computed properties for summary statistics
const totalTeams = computed(() => teams.value.length)
const activeTeams = computed(() => teams.value.length) // All teams are considered active for now
const activeTeamsPercentage = computed(() => 100) // All teams are active

// Mock data for other stats (replace with actual API calls)
const totalMembers = computed(() => teams.value.reduce((sum, team) => sum + Math.floor(Math.random() * 20) + 5, 0))
const activeMembers = computed(() => Math.floor(totalMembers.value * 0.9))
const activeMembersPercentage = computed(() => totalMembers.value > 0 ? Math.round((activeMembers.value / totalMembers.value) * 100) : 0)

const totalProjects = computed(() => teams.value.reduce((sum, team) => sum + Math.floor(Math.random() * 10) + 2, 0))
const activeProjects = computed(() => Math.floor(totalProjects.value * 0.8))
const activeProjectsPercentage = computed(() => totalProjects.value > 0 ? Math.round((activeProjects.value / totalProjects.value) * 100) : 0)

const teamPerformance = computed(() => `${Math.floor(Math.random() * 30) + 70}%`)
const performanceGrowth = computed(() => Math.floor(Math.random() * 20) + 5)

// Search and Sort functionality
const filteredAndSortedTeams = computed(() => {
  let filtered = teams.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(team =>
      team.name.toLowerCase().includes(query)
    )
  }

  // Sort data
  if (sortLabel.value) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortLabel.value as keyof Team]
      const bValue = b[sortLabel.value as keyof Team]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder.value === 'asc' ? comparison : -comparison
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue
        return sortOrder.value === 'asc' ? comparison : -comparison
      }
      return 0
    })
  }

  // Apply client-side pagination if needed (when server doesn't provide paginated data)
  if (filtered.length > pagination.value.per_page) {
    const startIndex = (pagination.value.page - 1) * pagination.value.per_page;
    const endIndex = startIndex + pagination.value.per_page;
    return filtered.slice(startIndex, endIndex);
  }

  return filtered
})

// Pagination methods and computed properties
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.total_pages) {
    fetchTeams(page)
  }
}

const changeItemsPerPage = () => {
  // Reset to first page when changing items per page
  fetchTeams(1)
}

const visiblePages = computed((): number[] => {
  const current = pagination.value.page
  const total = Math.max(1, pagination.value.total_pages) // Pastikan minimal 1 halaman
  const pages: number[] = []
  
  // Show max 5 page numbers
  const maxVisible = 5
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Empty table message based on current state
const emptyTableMessage = computed(() => {
  if (!selectedOrganizationId.value) {
    return t('controlplane.team.empty.selectOrganization')
  }
  if (!selectedAccountId.value) {
    return t('controlplane.team.empty.selectAccount')
  }
  if (loading.value) {
    return t('controlplane.team.empty.loading')
  }
  if (searchQuery.value.trim()) {
    return t('controlplane.team.empty.searchNoResults', { query: searchQuery.value })
  }
  return t('controlplane.team.empty.noResults')
})

// Initialize
onMounted(() => {
  fetchOrganizations()
})
</script>
