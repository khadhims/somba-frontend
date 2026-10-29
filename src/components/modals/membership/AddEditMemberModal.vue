<template>
  <!-- Add/Edit Member Modal -->
  <dialog
    :id="modalId"
    ref="dialogRef"
    class="m-auto w-full max-w-lg rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="hideModal"
    @cancel="hideModal"
  >
    <!-- Modal Header -->
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">
        {{
          isEdit
            ? t('components.membership.addEdit.title.edit')
            : t('components.membership.addEdit.title.add', { entity: entityLabel })
        }}
      </h5>
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

    <!-- Modal Body -->
    <form @submit.prevent="saveMember">
      <div class="p-5">
        <!-- Email Field (Only for Add) -->
        <div v-if="!isEdit" class="mb-4">
          <label class="mb-2 block text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-danger">
            {{ t('components.membership.addEdit.fields.email.label') }}
          </label>
          <input
            type="email"
            v-model="form.email"
            :class="formInputClass"
            :placeholder="t('components.membership.addEdit.fields.email.placeholder')"
            required
          />
          <div class="mt-1 text-sm text-gray-500">
            {{ t('components.membership.addEdit.fields.email.help', { entity: entityLabelLower }) }}
          </div>
        </div>

        <!-- Current Member Info (Only for Edit) -->
        <div v-if="isEdit && memberToEdit" class="mb-4 rounded bg-primary-light p-3">
          <div class="flex items-center">
            <div class="mr-3 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">
              {{ memberToEdit.email?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div>
              <span class="block text-sm font-bold text-gray-900 dark:text-gray-100">
                {{ memberToEdit.email || t('components.membership.addEdit.currentMember.unknown') }}
              </span>
              <span class="block text-xs font-semibold text-gray-500">
                {{ t('components.membership.addEdit.currentMember.currentRole', { role: getRoleLabel(memberToEdit.role) }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Role Field -->
        <div class="mb-4">
          <label class="mb-2 block text-sm font-semibold after:content-['*'] after:ml-0.5 after:text-danger">
            {{ t('components.membership.addEdit.fields.role.label') }}
          </label>
          <select
            v-model="form.role"
            :class="formInputClass"
            required
          >
            <option value="" disabled>
              {{ t('components.membership.addEdit.fields.role.placeholder') }}
            </option>
            <option
              v-for="option in roleOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3 border-t border-gray-200 p-5 dark:border-gray-700">
        <button
          type="button"
          class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          @click="hideModal"
        >
          {{ t('components.membership.addEdit.actions.cancel') }}
        </button>
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="loading || !form.role || (!isEdit && !form.email)"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ t('components.membership.addEdit.actions.loading') }}
          </span>
          <span v-else>
            {{
              isEdit
                ? t('components.membership.addEdit.actions.update')
                : t('components.membership.addEdit.actions.add')
            }}
          </span>
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import ApiService from "@/core/services/ApiService";
import { formInputClass } from "@/core/helpers/badge";

// Props
interface Props {
  entityType: 'account' | 'team' | 'organization';
  entityUid: string;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  memberSaved: [member: any];
}>();

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
const { t } = useI18n();

const loading = ref(false);
const isEdit = ref(false);
const memberToEdit = ref<Member | null>(null);
const modalId = computed(() => `addEditMember${props.entityType}Modal${props.entityUid}`);
const entityLabel = computed(() => t(`components.membership.common.entity.${props.entityType}`));
const entityLabelLower = computed(() => t(`components.membership.common.entityLower.${props.entityType}`));
const roleOptions = computed(() => [
  { value: "OWNER", label: t("components.membership.common.roles.owner") },
  { value: "ADMIN", label: t("components.membership.common.roles.admin") },
  { value: "MEMBER", label: t("components.membership.common.roles.member") },
]);

const form = reactive({
  email: '',
  role: ''
});

const getRoleLabel = (role?: string) => {
  if (!role) {
    return "";
  }
  const key = role.toLowerCase();
  const translationKey = `components.membership.common.roles.${key}`;
  const translated = t(translationKey);
  return translated !== translationKey ? translated : role;
};

// Modal element ref
const dialogRef = ref<HTMLDialogElement>();

// Methods
const resetForm = () => {
  form.email = '';
  form.role = '';
  isEdit.value = false;
  memberToEdit.value = null;
};

const saveMember = async () => {
  loading.value = true;

  try {
    let endpoint = '';
    let payload: any = {};

    if (isEdit.value && memberToEdit.value) {
      // Edit existing member - PATCH
      if (props.entityType === 'account') {
        endpoint = `accounts/${props.entityUid}/memberships/${memberToEdit.value.uid}`;
      } else if (props.entityType === 'team') {
        endpoint = `teams/${props.entityUid}/memberships/${memberToEdit.value.uid}`;
      } else {
        endpoint = `organizations/${props.entityUid}/memberships/${memberToEdit.value.uid}`;
      }

      payload = {
        role: form.role
      };

      console.log('PATCH endpoint:', endpoint);
      console.log('PATCH payload:', payload);
      const response = await ApiService.patch(endpoint, payload);
      console.log('Member role updated:', response);
    } else {
      // Add new member - POST
      if (props.entityType === 'account') {
        endpoint = `accounts/${props.entityUid}/memberships`;
      } else if (props.entityType === 'team') {
        endpoint = `teams/${props.entityUid}/memberships`;
      } else {
        endpoint = `organizations/${props.entityUid}/memberships`;
      }

      payload = {
        email: form.email,
        role: form.role
      };

      console.log('POST endpoint:', endpoint);
      console.log('POST payload:', payload);
      const response = await ApiService.post(endpoint, payload);
      console.log('New member added:', response);
    }

    // Emit success event
    emit('memberSaved', payload);

    // Close modal
    hideModal();

    // Reset form
    resetForm();

  } catch (error: any) {
    console.error('Error saving member:', error);

    // Show error message
    let errorMessage = t('components.membership.addEdit.notifications.error');
    if (error.response?.data?.message) {
      errorMessage = String(error.response.data.message);
    } else if (error.message) {
      errorMessage = String(error.message);
    }

    alert(errorMessage);
  } finally {
    loading.value = false;
  }
};

// Public methods
const showModal = (member?: Member) => {
  // Reset form first
  resetForm();

  if (member) {
    // Edit mode
    isEdit.value = true;
    memberToEdit.value = member;
    form.role = member.role;
  } else {
    // Add mode
    isEdit.value = false;
    memberToEdit.value = null;
  }

  dialogRef.value?.showModal();
};

const hideModal = () => {
  dialogRef.value?.close();
};

// Expose methods to parent
defineExpose({
  showModal,
  hideModal
});
</script>
