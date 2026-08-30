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

// Shared card/button chrome, added for the 2025 UI/UX modernization pass
// (see the plan's "Design direction" section). Before this, every page
// hand-copied the same card/button strings (~15+ call sites each, with
// drifting padding) instead of sharing one constant - same class-string-
// duplication problem `formInputClass`/`badgeVariantClass` already solved
// for inputs/badges above, just extended to cards and buttons.

/** Card shell used for every page section/panel: `rounded-lg` -> `rounded-xl`
 *  and a real `shadow-sm` replace the old flat `border`-only look. */
export const cardClass =
  "rounded-xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900";

/** Solid primary action (Submit, Save, ...). */
export const primaryButtonClass =
  "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

/** Neutral action (Cancel, Close, ...). */
export const secondaryButtonClass =
  "rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700";

/** Light-tinted action (the "Add" button convention on every list-page
 *  toolbar): starts as a soft tinted pill, fills solid on hover. */
export const lightButtonClass =
  "rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white active:scale-[0.98]";

/** Destructive action (Delete, Remove, ...). */
export const dangerButtonClass =
  "rounded-md bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

// SweetAlert2 is used throughout with `buttonsStyling: false`, which means
// its confirm/cancel buttons render unstyled unless a `customClass` is
// supplied - originally always `"btn fw-semibold btn-light-{variant}"`
// (14+ call sites). Swal renders these into its own DOM tree outside Vue,
// so they can't use `:class`/badgeVariantClass() - plain strings only.
export const swalConfirmButtonClass = "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-active";
export const swalDangerButtonClass = "rounded-md bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90";
export const swalCancelButtonClass = "rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700";
