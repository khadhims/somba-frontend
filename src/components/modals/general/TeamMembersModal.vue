<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header align-items-center">
          <h5 class="modal-title">{{ teamName ? `${teamName}'s Members` : "Team's Members" }}</h5>
          <div class="d-flex align-items-center gap-3 ms-auto">
            <input
              v-model="search"
              type="text"
              class="form-control form-control-sm form-control-solid w-200px"
              placeholder="Search members..."
            />
            <button type="button" class="btn btn-sm btn-primary" @click="onAddMember">
              <i class="ki-duotone ki-plus fs-3 me-1"></i>
              Member
            </button>
            <button type="button" class="btn btn-icon btn-sm" data-bs-dismiss="modal" aria-label="Close">
              <i class="ki-duotone ki-cross fs-2"><span class="path1"></span><span class="path2"></span></i>
            </button>
          </div>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-10">
            <span class="spinner-border"></span>
          </div>
          <div v-else>
            <div v-if="filteredMembers.length === 0" class="d-flex flex-column align-items-center py-10 text-muted">
              <i class="ki-duotone ki-cross-circle fs-1 text-gray-400 mb-3">
                <span class="path1"></span><span class="path2"></span>
              </i>
              <div>belum ada member yang didaftarkan</div>
            </div>
            <ul v-else class="list-group">
              <li v-for="m in filteredMembers" :key="m.uid || m.email" class="list-group-item d-flex align-items-center justify-content-between">
                <div>
                  <div class="fw-semibold">{{ m.username || m.name || m.email || 'Unknown' }}</div>
                  <div class="text-muted fs-7">{{ m.email }}</div>
                </div>
                <div class="text-muted fs-8">{{ m.role || '' }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Invite Member Modal -->
  <InviteMemberModal ref="inviteModalRef" @invite="handleInvite" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Modal } from 'bootstrap'
import ApiService from '@/core/services/ApiService'
import InviteMemberModal from '@/components/modals/forms/InviteMemberModal.vue'

interface TeamMember {
  uid?: string
  username?: string
  name?: string
  email?: string
  role?: string
}

const emit = defineEmits<{
  (e: 'add-member', payload: { teamUid: string, teamName: string | null }): void
}>()

const modalEl = ref<HTMLElement | null>(null)
let modalInstance: Modal | null = null

const teamUid = ref<string>('')
const teamName = ref<string | null>(null)
const loading = ref(false)
const members = ref<TeamMember[]>([])
const search = ref('')

const open = async (team: { uid: string; name?: string | null }) => {
  teamUid.value = team.uid
  teamName.value = team.name ?? null
  if (!modalInstance && modalEl.value) {
    modalInstance = new Modal(modalEl.value)
  }
  modalInstance?.show()
  await fetchMembers()
}

const close = () => modalInstance?.hide()

const fetchMembers = async () => {
  if (!teamUid.value) return
  loading.value = true
  try {
    const resp = await ApiService.query(`teams/${teamUid.value}/memberships`, {})
    const data = (resp as any)?.data?.data ?? (resp as any)?.data ?? []
    members.value = Array.isArray(data) ? data : []
  } catch (e) {
    members.value = []
  } finally {
    loading.value = false
  }
}

const filteredMembers = computed(() => {
  if (!search.value.trim()) return members.value
  const q = search.value.toLowerCase()
  return members.value.filter(m =>
    (m.username && m.username.toLowerCase().includes(q)) ||
    (m.name && m.name.toLowerCase().includes(q)) ||
    (m.email && m.email.toLowerCase().includes(q))
  )
})

const onAddMember = () => {
  // Open invite modal instead of emitting directly
  inviteModalRef.value?.open({ teamUid: teamUid.value, teamName: teamName.value || '' })
}

// Invite modal integration
const inviteModalRef = ref<InstanceType<typeof InviteMemberModal> | null>(null)
const handleInvite = (payload: { teamUid: string; identifier: string; role: 'ADMIN' | 'MEMBER' | 'OWNER' }) => {
  // After a successful invite, refresh the members list
  fetchMembers()
}

defineExpose({ open, close })
</script>
