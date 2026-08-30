<template>
  <!-- Membership List Modal -->
  <dialog
    :id="modalId"
    ref="dialogRef"
    class="m-auto w-full max-w-[1140px] rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="hideModal"
    @cancel="hideModal"
  >
    <!-- Modal Header -->
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{ t('components.membership.list.title', { entity: entityLabel }) }}
      </h5>
      <div class="flex items-center">
        <!-- Add Member Button -->
        <button
          type="button"
          class="mr-3 inline-flex items-center gap-1 rounded-md bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          @click="showAddMemberModal"
        >
          <i class="ki-duotone ki-plus fs-2"></i>
          {{ t('components.membership.list.buttons.add') }}
        </button>

        <!-- Close Button -->
        <button
          type="button"
          @click="hideModal"
          aria-label="Close"
          class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <i class="ki-duotone ki-cross fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </button>
      </div>
    </div>

    <!-- Modal Body -->
    <div class="max-h-[70vh] overflow-y-auto p-5">
      <!-- Search and Filter Controls -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center">
          <label class="mr-3 mb-0 text-sm font-semibold">
            {{ t('components.membership.list.filters.itemsLabel') }}
          </label>
          <select
            v-model="perPage"
            @change="onPerPageChange"
            :class="[formInputClass, 'w-[75px] py-1 text-xs']"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>

        <div class="relative flex items-center">
          <i class="ki-duotone ki-magnifier fs-3 absolute ml-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            :class="[formInputClass, 'w-[250px] pl-12']"
            :placeholder="t('components.membership.list.filters.searchPlaceholder')"
          />
        </div>
      </div>

      <!-- Members Table -->
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 dark:border-gray-700">
          <thead>
            <tr class="border-b-2 border-gray-200 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-200">
              <th class="px-3 py-3 text-left">{{ t('components.membership.list.table.headers.member') }}</th>
              <th class="px-3 py-3 text-left">{{ t('components.membership.list.table.headers.role') }}</th>
              <th class="px-3 py-3 text-left">{{ t('components.membership.list.table.headers.joined') }}</th>
              <th class="px-3 py-3 text-right">{{ t('components.membership.list.table.headers.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="py-4 text-center">
                <div
                  class="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
                  role="status"
                  :aria-label="t('components.membership.list.table.loadingLabel')"
                ></div>
                <span class="ml-2">{{ t('components.membership.list.table.loadingMessage') }}</span>
              </td>
            </tr>
            <tr v-else-if="filteredMembers.length === 0">
              <td colspan="4" class="py-4 text-center text-gray-500">
                {{
                  searchQuery
                    ? t('components.membership.list.table.emptySearch', { query: searchQuery })
                    : t('components.membership.list.table.empty')
                }}
              </td>
            </tr>
            <tr
              v-else
              v-for="member in paginatedMembers"
              :key="member.uid"
              class="border-b border-gray-100 odd:bg-gray-50 dark:border-gray-800 dark:odd:bg-gray-800/40"
            >
              <!-- Member Info -->
              <td class="px-3 py-3">
                <div class="flex items-center">
                  <div class="mr-4 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-primary">
                    {{ member.email?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <span class="block text-sm font-bold text-gray-900 dark:text-gray-100">
                      {{ member.email || t('components.membership.list.table.unknownUser') }}
                    </span>
                    <span class="block text-xs font-semibold text-gray-500">
                      {{ t('components.membership.list.table.rolePrefix', { role: getRoleLabel(member.role) }) }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-3 py-3">
                <span
                  class="inline-flex rounded px-2 py-1 text-xs font-bold"
                  :class="badgeVariantClass(getRoleBadgeVariant(member.role))"
                >
                  {{ getRoleLabel(member.role) }}
                </span>
              </td>

              <!-- Joined Date -->
              <td class="px-3 py-3">
                <span class="block text-sm font-bold text-gray-900 dark:text-gray-100">
                  {{ formatDate(member.joined_at) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 text-right">
                <div class="flex shrink-0 justify-end">
                  <RowActionButton
                    :title="t('components.membership.list.actions.edit')"
                    class="mr-1"
                    @click="editMember(member)"
                  >
                    <i class="ki-duotone ki-pencil fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </RowActionButton>
                  <RowActionButton
                    :title="t('components.membership.list.actions.remove')"
                    variant="danger"
                    :disabled="member.role === 'OWNER'"
                    @click="deleteMember(member)"
                  >
                    <i class="ki-duotone ki-trash fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </RowActionButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-4 flex justify-center">
        <nav aria-label="Members pagination">
          <ul class="flex items-center gap-1">
            <li>
              <button
                class="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                {{ t('components.membership.list.pagination.previous') }}
              </button>
            </li>
            <li v-for="page in visiblePages" :key="page">
              <button
                class="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors"
                :class="page === currentPage ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </li>
            <li>
              <button
                class="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >
                {{ t('components.membership.list.pagination.next') }}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="flex justify-end border-t border-gray-200 p-5 dark:border-gray-700">
      <button
        type="button"
        class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="hideModal"
      >
        {{ t('components.membership.list.buttons.close') }}
      </button>
    </div>
  </dialog>

  <!-- Add/Edit Member Modal -->
  <AddEditMemberModal
    ref="addEditMemberModalRef"
    :entity-type="entityType"
    :entity-uid="entityUid"
    @member-saved="onMemberSaved"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import AddEditMemberModal from "@/components/modals/membership/AddEditMemberModal.vue";
import { formInputClass, badgeVariantClass, type BadgeVariant } from "@/core/helpers/badge";
import RowActionButton from "@/components/common/RowActionButton.vue";

// Props
interface Props {
  entityType: 'account' | 'team' | 'organization';
  entityUid: string;
  modalId: string;
}

const props = defineProps<Props>();

// Interfaces
interface InvitedBy {
  username: string;
  email: string;
}

interface UpdatedBy {
  username: string;
  email: string;
}

interface Member {
  uid: string;
  email: string;
  organization_uid?: string;
  organization_name?: string;
  account_uid?: string;
  account_name?: string;
  team_uid?: string;
  team_name?: string;
  role: string;
  joined_at: string;
  invited_by: InvitedBy;
  updated_at: string;
  updated_by: UpdatedBy;
}

// Reactive data
const { t, locale } = useI18n();

const members = ref<Member[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(10);

// Modal references
const addEditMemberModalRef = ref();
const dialogRef = ref<HTMLDialogElement>();

const entityLabel = computed(() => t(`components.membership.common.entity.${props.entityType}`));
const entityLabelLower = computed(() => t(`components.membership.common.entityLower.${props.entityType}`));
const dateFormatter = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
);

const getRoleLabel = (role?: string) => {
  if (!role) {
    return "";
  }
  const key = role.toLowerCase();
  const translationKey = `components.membership.common.roles.${key}`;
  const translated = t(translationKey);
  return translated !== translationKey ? translated : role;
};

// Computed properties
const filteredMembers = computed(() => {
  if (!searchQuery.value.trim()) {
    return members.value;
  }

  const query = searchQuery.value.toLowerCase();
  return members.value.filter(member => {
    const email = member.email || '';
    const role = member.role || '';

    return email.toLowerCase().includes(query) ||
           role.toLowerCase().includes(query);
  });
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredMembers.value.length / perPage.value));
});

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredMembers.value.slice(start, end);
});

const visiblePages = computed(() => {
  const current = currentPage.value;
  const total = totalPages.value;
  const pages: number[] = [];

  const maxVisible = 5;
  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const fetchMembers = async () => {
  loading.value = true;
  try {
    console.log(`Fetching ${props.entityType} members for entityUid:`, props.entityUid);

    // Validate entityUid
    if (!props.entityUid || props.entityUid.trim() === '') {
      console.error('EntityUid is empty or undefined');
      members.value = [];
      loading.value = false;
      return;
    }

    let endpoint = '';
    if (props.entityType === 'account') {
      endpoint = `accounts/${props.entityUid}/memberships`;
    } else if (props.entityType === 'team') {
      endpoint = `teams/${props.entityUid}/memberships`;
    } else if (props.entityType === 'organization') {
      endpoint = `organizations/${props.entityUid}/memberships`;
    }

    console.log('Final endpoint:', endpoint);
    console.log('Full URL will be:', import.meta.env.VITE_APP_API_URL + endpoint);
    const response = await ApiService.query(endpoint, {});

    console.log('Full API Response:', response);
    console.log('Response data:', response?.data);

    if (response && response.data) {
      // Handle API response structure: { results: [], pagination: {} }
      const data = response.data.results && Array.isArray(response.data.results)
        ? response.data.results
        : response.data.data && Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];

      members.value = data;
      console.log('Members loaded:', members.value);
      console.log('First member structure:', members.value[0]);
    } else {
      members.value = [];
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    members.value = [];
  } finally {
    loading.value = false;
  }
};

const showAddMemberModal = () => {
  addEditMemberModalRef.value?.showModal();
};

const editMember = (member: Member) => {
  addEditMemberModalRef.value?.showModal(member);
};

const deleteMember = async (member: Member) => {
  if (member.role === "OWNER") {
    alert(t("components.membership.list.alerts.cannotRemoveOwner"));
    return;
  }

  const memberName = member.email || t("components.membership.list.table.unknownUser");
  const confirmMessage = t("components.membership.list.alerts.confirmRemove", {
    member: memberName,
    entity: entityLabelLower.value,
  });

  if (!confirm(confirmMessage)) {
    return;
  }

  loading.value = true;
  try {
    let endpoint = '';
    if (props.entityType === "account") {
      endpoint = `accounts/${props.entityUid}/memberships/${member.uid}`;
    } else if (props.entityType === "team") {
      endpoint = `teams/${props.entityUid}/memberships/${member.uid}`;
    } else if (props.entityType === "organization") {
      endpoint = `organizations/${props.entityUid}/memberships/${member.uid}`;
    }

    await ApiService.delete(endpoint);

    // Remove member from local list
    members.value = members.value.filter(m => m.uid !== member.uid);

    // Adjust current page if needed
    if (paginatedMembers.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
  } catch (error) {
    console.error('Error removing member:', error);
    alert(t('components.membership.list.alerts.removeFailed'));
  } finally {
    loading.value = false;
  }
};

const onMemberSaved = (savedMember: Member) => {
  // Refresh the members list
  fetchMembers();
};

const onPerPageChange = () => {
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getRoleBadgeVariant = (role: string): BadgeVariant => {
  switch (role) {
    case "OWNER":
      return "danger";
    case "ADMIN":
      return "warning";
    case "MEMBER":
      return "primary";
    default:
      return "secondary";
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) {
    return t('components.membership.list.table.unknownDate');
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return t('components.membership.list.table.invalidDate');
    }
    return dateFormatter.value.format(date);
  } catch (error) {
    return t('components.membership.list.table.invalidDate');
  }
};

// Public methods for parent components
const showModal = () => {
  console.log('showModal called, entityUid:', props.entityUid);

  // Reset state
  searchQuery.value = '';
  currentPage.value = 1;

  // Show modal first
  dialogRef.value?.showModal();

  // Fetch members after a small delay to ensure modal is fully shown and props are ready
  setTimeout(() => {
    fetchMembers();
  }, 100);
};

const hideModal = () => {
  dialogRef.value?.close();
};

// Watch for search query changes to reset page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Watch for entityUid changes to refetch data
watch(() => props.entityUid, (newUid, oldUid) => {
  console.log('EntityUid watcher triggered - from:', oldUid, 'to:', newUid);
  if (newUid && newUid.trim() !== '' && newUid !== oldUid) {
    console.log('EntityUid changed, refetching members...');
    fetchMembers();
  }
});

// Expose methods to parent
defineExpose({
  showModal,
  hideModal
});
</script>
