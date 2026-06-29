<template>
  <!-- Membership List Modal -->
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("components.membership.list.title", { entity: entityLabel }) }}
          </h5>
          <div class="d-flex align-items-center">
            <!-- Add Member Button -->
            <button
              type="button"
              class="btn btn-sm btn-light-primary me-3"
              @click="showAddMemberModal"
            >
              <i class="ki-duotone ki-plus fs-2 me-1"></i>
              {{ t("components.membership.list.buttons.add") }}
            </button>

            <!-- Close Button -->
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Search and Filter Controls -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center">
              <label class="form-label me-3 mb-0 fw-semibold">
                {{ t("components.membership.list.filters.itemsLabel") }}
              </label>
              <select
                v-model="perPage"
                @change="onPerPageChange"
                class="form-select form-select-solid w-75px"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
              </select>
            </div>

            <div class="d-flex align-items-center position-relative">
              <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <input
                type="text"
                v-model="searchQuery"
                class="form-control form-control-solid w-250px ps-12"
                :placeholder="
                  t('components.membership.list.filters.searchPlaceholder')
                "
              />
            </div>
          </div>

          <!-- Members Table -->
          <div class="table-responsive">
            <table class="table table-rounded table-striped border gy-7 gs-7">
              <thead>
                <tr
                  class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                >
                  <th>
                    {{ t("components.membership.list.table.headers.member") }}
                  </th>
                  <th>
                    {{ t("components.membership.list.table.headers.role") }}
                  </th>
                  <th>
                    {{ t("components.membership.list.table.headers.joined") }}
                  </th>
                  <th class="text-end">
                    {{ t("components.membership.list.table.headers.actions") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="4" class="text-center py-4">
                    <div
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span class="visually-hidden">{{
                        t("components.membership.list.table.loadingLabel")
                      }}</span>
                    </div>
                    <span class="ms-2">{{
                      t("components.membership.list.table.loadingMessage")
                    }}</span>
                  </td>
                </tr>
                <tr v-else-if="filteredMembers.length === 0">
                  <td colspan="4" class="text-center py-4 text-muted">
                    {{
                      searchQuery
                        ? t("components.membership.list.table.emptySearch", {
                            query: searchQuery,
                          })
                        : t("components.membership.list.table.empty")
                    }}
                  </td>
                </tr>
                <tr v-else v-for="member in paginatedMembers" :key="member.uid">
                  <!-- Member Info -->
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="symbol symbol-35px me-4">
                        <span
                          class="symbol-label bg-light-primary text-primary fw-bold"
                        >
                          {{ member.email?.charAt(0).toUpperCase() || "U" }}
                        </span>
                      </div>
                      <div>
                        <span class="text-dark fw-bold d-block fs-6">
                          {{
                            member.email ||
                            t("components.membership.list.table.unknownUser")
                          }}
                        </span>
                        <span class="text-muted fw-semibold d-block fs-7">
                          {{
                            t("components.membership.list.table.rolePrefix", {
                              role: getRoleLabel(member.role),
                            })
                          }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Role -->
                  <td>
                    <span
                      :class="`badge badge-light-${getRoleBadgeColor(
                        member.role
                      )} fs-7 fw-bold`"
                    >
                      {{ getRoleLabel(member.role) }}
                    </span>
                  </td>

                  <!-- Joined Date -->
                  <td>
                    <span class="text-dark fw-bold d-block fs-6">
                      {{ formatDate(member.joined_at) }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="text-end">
                    <div class="d-flex justify-content-end flex-shrink-0">
                      <button
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                        @click="editMember(member)"
                        :title="t('components.membership.list.actions.edit')"
                      >
                        <i class="ki-duotone ki-pencil fs-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </button>
                      <button
                        class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                        @click="deleteMember(member)"
                        :title="t('components.membership.list.actions.remove')"
                        :disabled="member.role === 'OWNER'"
                      >
                        <i class="ki-duotone ki-trash fs-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                          <span class="path4"></span>
                          <span class="path5"></span>
                        </i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
            <nav aria-label="Members pagination">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button
                    class="page-link"
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                  >
                    {{ t("components.membership.list.pagination.previous") }}
                  </button>
                </li>
                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="goToPage(page)">
                    {{ page }}
                  </button>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <button
                    class="page-link"
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                  >
                    {{ t("components.membership.list.pagination.next") }}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            {{ t("components.membership.list.buttons.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Member Modal -->
  <AddEditMemberModal
    ref="addEditMemberModalRef"
    :entity-type="entityType"
    :entity-uid="entityUid"
    @member-saved="onMemberSaved"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: "MembershipListModalComponent",
});

import { ref, computed, watch } from "vue";
import { Modal } from "bootstrap";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import AddEditMemberModal from "@/components/modals/membership/AddEditMemberModal.vue";

// Props
interface Props {
  entityType: "account" | "team" | "organization";
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
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(10);

// Modal references
const addEditMemberModalRef = ref();
let modalInstance: Modal | null = null;

const entityLabel = computed(() =>
  t(`components.membership.common.entity.${props.entityType}`)
);
const entityLabelLower = computed(() =>
  t(`components.membership.common.entityLower.${props.entityType}`)
);
const dateFormatter = computed(
  () =>
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
  return members.value.filter((member) => {
    const email = member.email || "";
    const role = member.role || "";

    return (
      email.toLowerCase().includes(query) || role.toLowerCase().includes(query)
    );
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
    console.log(
      `Fetching ${props.entityType} members for entityUid:`,
      props.entityUid
    );

    // Validate entityUid
    if (!props.entityUid || props.entityUid.trim() === "") {
      console.error("EntityUid is empty or undefined");
      members.value = [];
      loading.value = false;
      return;
    }

    let endpoint = "";
    if (props.entityType === "account") {
      endpoint = `accounts/${props.entityUid}/memberships`;
    } else if (props.entityType === "team") {
      endpoint = `teams/${props.entityUid}/memberships`;
    } else if (props.entityType === "organization") {
      endpoint = `organizations/${props.entityUid}/memberships`;
    }

    console.log("Final endpoint:", endpoint);
    console.log(
      "Full URL will be:",
      import.meta.env.VITE_APP_API_URL + endpoint
    );
    const response = await ApiService.query(endpoint, {
      /* empty */
    });

    console.log("Full API Response:", response);
    console.log("Response data:", response?.data);

    if (response && response.data) {
      // Handle API response structure: { results: [], pagination: { /* empty */ } }
      const data =
        response.data.results && Array.isArray(response.data.results)
          ? response.data.results
          : response.data.data && Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];

      members.value = data.map((item: any) => ({
        ...item,
        email: item.email || item.user?.email || "",
      }));
      console.log("Members loaded:", members.value);
      console.log("First member structure:", members.value[0]);
    } else {
      members.value = [];
    }
  } catch (error) {
    console.error("Error fetching members:", error);
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

  const memberName =
    member.email || t("components.membership.list.table.unknownUser");
  const confirmMessage = t("components.membership.list.alerts.confirmRemove", {
    member: memberName,
    entity: entityLabelLower.value,
  });

  if (!confirm(confirmMessage)) {
    return;
  }

  loading.value = true;
  try {
    let endpoint = "";
    if (props.entityType === "account") {
      endpoint = `accounts/${props.entityUid}/memberships/${member.uid}`;
    } else if (props.entityType === "team") {
      endpoint = `teams/${props.entityUid}/memberships/${member.uid}`;
    } else if (props.entityType === "organization") {
      endpoint = `organizations/${props.entityUid}/memberships/${member.uid}`;
    }

    await ApiService.delete(endpoint);

    // Remove member from local list
    members.value = members.value.filter((m) => m.uid !== member.uid);

    // Adjust current page if needed
    if (paginatedMembers.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
  } catch (error) {
    console.error("Error removing member:", error);
    alert(t("components.membership.list.alerts.removeFailed"));
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

const getRoleBadgeColor = (role: string): string => {
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
    return t("components.membership.list.table.unknownDate");
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return t("components.membership.list.table.invalidDate");
    }
    return dateFormatter.value.format(date);
  } catch (error) {
    return t("components.membership.list.table.invalidDate");
  }
};

// Public methods for parent components
const showModal = () => {
  console.log("showModal called, entityUid:", props.entityUid);

  if (!modalInstance) {
    modalInstance = new Modal(document.getElementById(props.modalId)!);
  }

  // Reset state
  searchQuery.value = "";
  currentPage.value = 1;

  // Show modal first
  modalInstance.show();

  // Fetch members after a small delay to ensure modal is fully shown and props are ready
  setTimeout(() => {
    fetchMembers();
  }, 100);
};

const hideModal = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
};

// Watch for search query changes to reset page
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Watch for entityUid changes to refetch data
watch(
  () => props.entityUid,
  (newUid, oldUid) => {
    console.log("EntityUid watcher triggered - from:", oldUid, "to:", newUid);
    if (newUid && newUid.trim() !== "" && newUid !== oldUid) {
      console.log("EntityUid changed, refetching members...");
      fetchMembers();
    }
  }
);

// Expose methods to parent
defineExpose({
  showModal,
  hideModal,
});
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
}

.pagination .page-link {
  border: 1px solid #e9ecef;
  color: #6c757d;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}
</style>
