<template>
  <dialog
    ref="dialogEl"
    class="m-auto w-full max-w-md rounded-lg border-0 bg-white p-0 shadow-xl backdrop:bg-black/50 dark:bg-gray-900"
    @click.self="close"
  >
    <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
      <h5 class="m-0 text-lg font-bold text-gray-900 dark:text-gray-100">{{ title }}</h5>
      <button
        type="button"
        aria-label="Close"
        @click="close"
        class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <i class="ki-duotone ki-cross fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </button>
    </div>
    <div class="p-5 text-gray-700 dark:text-gray-300">
      <slot />
    </div>
    <div class="flex justify-end gap-2 border-t border-gray-200 p-5 dark:border-gray-700">
      <button
        type="button"
        @click="close"
        class="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] dark:bg-gray-800 dark:text-gray-300"
      >
        {{ cancelLabel }}
      </button>
      <button
        type="button"
        @click="$emit('confirm')"
        :disabled="loading"
        class="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
      >
        <span
          v-if="loading"
          class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
        ></span>
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
// Generic yes/no confirmation dialog (used for every "delete this X?"
// prompt). Body content is a slot rather than a message prop - each call
// site interpolates a bold entity name, which a single string prop can't
// express as cleanly. Extracted after the exact same markup showed up
// identically in 4 files (site/organization/account/team Overview.vue).
import { ref } from "vue";

withDefaults(
  defineProps<{
    title: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
  }>(),
  { confirmLabel: "Delete", cancelLabel: "Cancel", loading: false }
);

defineEmits<{
  (e: "confirm"): void;
}>();

const dialogEl = ref<HTMLDialogElement | null>(null);
const close = () => dialogEl.value?.close();

defineExpose({
  showModal: () => dialogEl.value?.showModal(),
  close,
});
</script>
