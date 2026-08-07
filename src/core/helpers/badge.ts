// Shared Tailwind class strings used across the Tailwind-converted CRUD
// pages/tables. Extracted after the same strings showed up identically in
// 7+ files (formInputClass) and 12+ call sites (badgeVariantClass) - see
// TAILWIND_MIGRATION.md. Each page still owns its own domain mapping
// (which status/string maps to which variant); only the resulting
// Tailwind classes are shared here.

export type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "secondary";

/** Text input / select / textarea styling used throughout the CRUD forms. */
export const formInputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";

// Tailwind's build-time scanner needs each class name to appear as a
// literal string somewhere it scans - `bg-${variant}-light` would silently
// produce unstyled badges in production. Hence the explicit map instead of
// string interpolation.
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-light text-success",
  danger: "bg-danger-light text-danger",
  warning: "bg-warning-light text-warning",
  info: "bg-info-light text-info",
  secondary: "bg-gray-100 text-gray-600",
};

/** `bg-{variant}-light text-{variant}` pill used for status/spec badges. */
export function badgeVariantClass(variant: BadgeVariant): string {
  return VARIANT_CLASSES[variant];
}
