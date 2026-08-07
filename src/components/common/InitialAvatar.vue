<template>
  <div
    class="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full font-bold"
    :class="badgeVariantClass(variant)"
  >
    {{ name.trim().charAt(0).toUpperCase() || "?" }}
  </div>
</template>

<script setup lang="ts">
// Dumb/presentational component: renders the "circle with the entity's
// first letter" avatar used on every CRUD table (sites, organizations,
// accounts, teams, rooms, NVRs, cameras - 7 near-identical copies before
// this was extracted).
import { badgeVariantClass, type BadgeVariant } from "@/core/helpers/badge";

withDefaults(
  defineProps<{
    name: string;
    variant?: BadgeVariant;
  }>(),
  { variant: "primary" }
);
</script>
