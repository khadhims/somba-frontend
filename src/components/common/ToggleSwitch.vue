<template>
  <label class="inline-flex cursor-pointer items-center gap-3">
    <input
      type="checkbox"
      class="peer sr-only"
      :checked="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <span
      class="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-5 dark:bg-gray-600"
    ></span>
    <span
      v-if="$slots.default"
      class="text-sm font-semibold text-gray-800 dark:text-gray-200"
    >
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
// Replaces Bootstrap's `form-check form-switch form-check-custom
// form-check-solid` pill toggle. Native <input type="checkbox"> kept
// (visually hidden via sr-only) so it's still a real form control for
// a11y/label-click/focus-ring; the pill+knob is pure CSS via
// peer-checked, no JS needed.
defineProps<{ modelValue: boolean }>();
defineEmits<{ (e: "update:modelValue", value: boolean): void }>();
</script>
