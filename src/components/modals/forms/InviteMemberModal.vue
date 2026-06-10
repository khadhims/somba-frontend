<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-white">
        <div class="modal-header">
          <h5 class="modal-title">Invite members</h5>
          <button
            type="button"
            class="btn btn-icon btn-sm"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ki-duotone ki-cross fs-2"
              ><span class="path1"></span><span class="path2"></span
            ></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="mb-4">
            Anda mengundang member ke Team <strong>{{ teamName }}</strong>
          </p>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <label class="form-label">Alamat email</label>
          <input
            v-model="identifier"
            type="text"
            class="form-control form-control-solid"
            placeholder="Masukkan email terdaftar"
          />
          <div class="mt-4">
            <label class="form-label">Peran</label>
            <select v-model="role" class="form-select form-select-solid">
              <option disabled value="">Pilih Role</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="OWNER">Owner</option>
            </select>
          </div>
        </div>
        <div class="modal-footer justify-content-end">
          <button type="button" class="btn btn-light" @click="onCancel">
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="submitting || !identifier.trim() || !role"
            @click="onInvite"
          >
            <span
              v-if="submitting"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            Invite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "InviteMemberModalComponent",
});

import { ref } from "vue";
import { Modal } from "bootstrap";
// import ApiService from "@/core/services/ApiService";

const emit = defineEmits<{
  (
    e: "invite",
    payload: {
      teamUid: string;
      identifier: string;
      role: "ADMIN" | "MEMBER" | "OWNER";
    }
  ): void;
}>();

const modalEl = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

const teamUid = ref<string>("");
const teamName = ref<string>("");
const identifier = ref<string>("");
const submitting = ref(false);
const role = ref<"" | "ADMIN" | "MEMBER" | "OWNER">("");
const errorMessage = ref<string | null>(null);

const open = (payload: { teamUid: string; teamName: string }) => {
  teamUid.value = payload.teamUid;
  teamName.value = payload.teamName;
  identifier.value = "";
  role.value = "";
  errorMessage.value = null;
  if (!modalInstance && modalEl.value) {
    modalInstance = new Modal(modalEl.value);
  }
  modalInstance?.show();
};

const close = () => modalInstance?.hide();

const onCancel = () => close();

const onInvite = async () => {
  if (!identifier.value.trim()) return;
  const id = identifier.value.trim();
  if (!id.includes("@")) {
    errorMessage.value = "Harus menggunakan alamat email terdaftar";
    return;
  }
  submitting.value = true;
  errorMessage.value = null;
  try {
    //     const resp = await ApiService.post(`teams/${teamUid.value}/memberships`, {
    //       email: id,
    //       role: role.value,
    //     });
    emit("invite", {
      teamUid: teamUid.value,
      identifier: id,
      role: role.value as "ADMIN" | "MEMBER" | "OWNER",
    });
    close();
  } catch (e: any) {
    const data = e?.response?.data;
    if (data?.errors) {
      // Common validation error shape: { errors: { field: [messages...] } }
      const firstField = Object.keys(data.errors)[0];
      const firstMsg = Array.isArray(data.errors[firstField])
        ? data.errors[firstField][0]
        : String(data.errors[firstField]);
      errorMessage.value =
        firstMsg || data.message || "Gagal mengundang member";
    } else {
      errorMessage.value =
        data?.message || e?.message || "Gagal mengundang member";
    }
    // Optional console aid
    try {
      console.error("Invite member failed", e?.response || e);
    } catch {
      /* empty */
    }
  } finally {
    submitting.value = false;
  }
};

defineExpose({ open, close });
</script>
