<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    :title="title"
    :disabled="!to && disabled"
    class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-colors active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 dark:bg-gray-800 dark:text-gray-300"
    :class="hoverClass"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Dumb/presentational wrapper for the icon-only row-action buttons
// (edit/delete/view/...) repeated on every CRUD table. The icon itself
// stays a slot rather than an icon-name prop: Keenicons' duotone icons
// each need a different number of <span class="pathN"> children, so a
// slot (composition) is simpler and safer than a per-icon lookup table.
import { computed } from "vue";
import { type BadgeVariant } from "@/core/helpers/badge";

const props = withDefaults(
  defineProps<{
    title?: string;
    to?: string | Record<string, unknown>;
    disabled?: boolean;
    variant?: Extract<
      BadgeVariant,
      "primary" | "success" | "danger" | "warning"
    >;
  }>(),
  { variant: "primary" }
);

// Same Tailwind-scanner constraint as badge.ts: needs literal strings, not
// `hover:text-${variant}`.
const HOVER_CLASSES: Record<string, string> = {
  primary: "hover:text-primary",
  success: "hover:text-success",
  danger: "hover:text-danger",
  warning: "hover:text-warning",
};

const hoverClass = computed(() => HOVER_CLASSES[props.variant]);
</script>
