<template>
  <!-- Add/Edit Member Modal -->
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEdit ? 'Edit Member Role' : `Add Member to ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}` }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="saveMember">
          <div class="modal-body">
            <!-- Email Field (Only for Add) -->
            <div v-if="!isEdit" class="mb-4">
              <label class="required fw-semibold fs-6 mb-2">Email Address</label>
              <input
                type="email"
                v-model="form.email"
                class="form-control form-control-solid"
                placeholder="Enter member's email address"
                required
              />
              <div class="form-text">
                The user will be invited to join this {{ entityType.toLowerCase() }}.
              </div>
            </div>

            <!-- Current Member Info (Only for Edit) -->
            <div v-if="isEdit && memberToEdit" class="mb-4 p-3 bg-light-primary rounded">
              <div class="d-flex align-items-center">
                <div class="symbol symbol-35px me-3">
                  <span class="symbol-label bg-primary text-white fw-bold">
                    {{ memberToEdit.email?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </div>
                <div>
                  <span class="text-dark fw-bold d-block fs-6">
                    {{ memberToEdit.email || 'Unknown User' }}
                  </span>
                  <span class="text-muted fw-semibold d-block fs-7">
                    Current Role: {{ memberToEdit.role }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Role Field -->
            <div class="mb-4">
              <label class="required fw-semibold fs-6 mb-2">Role</label>
              <select
                v-model="form.role"
                class="form-select form-select-solid"
                required
              >
                <option value="">Select Role</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || !form.role || (!isEdit && !form.email)"
            >
              <span v-if="loading" class="indicator-progress">
                <span class="spinner-border spinner-border-sm align-middle me-2"></span>
                Please wait...
              </span>
              <span v-else class="indicator-label">
                {{ isEdit ? 'Update Role' : 'Add Member' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Modal } from 'bootstrap';
import ApiService from '@/core/services/ApiService';

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
const loading = ref(false);
const isEdit = ref(false);
const memberToEdit = ref<Member | null>(null);
const modalId = computed(() => `addEditMember${props.entityType}Modal${props.entityUid}`);

const form = reactive({
  email: '',
  role: ''
});

// Modal instance
let modalInstance: Modal | null = null;

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
    let errorMessage = 'Failed to save member. Please try again.';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    alert(errorMessage);
  } finally {
    loading.value = false;
  }
};

// Public methods
const showModal = (member?: Member) => {
  if (!modalInstance) {
    modalInstance = new Modal(document.getElementById(modalId.value)!);
  }
  
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
  
  modalInstance.show();
};

const hideModal = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
};

// Expose methods to parent
defineExpose({
  showModal,
  hideModal
});
</script>

<style scoped>
.bg-light-primary {
  background-color: #f1f8ff !important;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.form-text strong {
  font-weight: 600;
}

.indicator-progress {
  display: flex;
  align-items: center;
}

.symbol-label {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>