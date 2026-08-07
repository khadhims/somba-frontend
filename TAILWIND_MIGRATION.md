# Tailwind migration

Status: **infra done, 24 pages + 5 shared components converted** (site
Overview pilot, LiveView, Events/Alerts + their table/modal components,
Organization/Account/Team Overview, the site device pages, the two error
pages). The rest of the app (283 `.vue` files total) still runs on
Bootstrap 5 + the custom Metronic SCSS theme — converting all of it in one
pass wasn't attempted; see "Rollout" below for why and how to keep going.

**Deliberately left untouched, with reasons** (don't re-attempt these blind):
- `views/controlplane/authentication/basic-flow/SignIn.vue` — bespoke,
  custom-designed login screen (~670 lines of its own scoped CSS: cursor-
  tracking camera, particles, neon button), not a generic template page.
  Only the one genuine Bootstrap utility class present was converted.
- `views/controlplane/authentication/basic-flow/SignUp.vue` — has a live
  password-strength-meter widget (`data-kt-password-meter` + JS-toggled
  classes) and Metronic's `fv-plugins-*` form-validation conventions wired
  to specific class names.
- `views/controlplane/team/Settings.vue` (2482 lines, the biggest file in
  the app) — essentially Metronic's stock "Account Settings" demo scaffold:
  profile-picture upload (`data-kt-image-input`, queried directly by
  `src/assets/ts/components/_ImageInputComponent.ts`), notification
  toggles (`data-kt-check`/`data-kt-check-target`), and button loading
  states (`data-kt-indicator`) are all real JS widgets keyed to exact
  class/attribute names. Rewriting the markup risks breaking them for a
  page nobody could visually re-verify in this pass.
- Camera.vue's Add/Edit modal chrome (`Teleport` + `Transition`, not
  Bootstrap JS) — the fields inside it were converted, but the modal's
  scale/fade entrance animation and custom scrollbar styling were left as
  their own scoped CSS rather than risk reproducing that polish through
  `<dialog>`'s imperative API unverified.

General rule applied throughout: convert the generic Bootstrap/Metronic
template classes; leave anything a JS widget queries by exact class or
`data-kt-*` attribute name alone unless you're prepared to verify it in
the running app.

## What's here

- `tailwindcss` + `@tailwindcss/vite` installed, wired into `vite.config.ts`.
- `src/assets/css/tailwind.css` — the whole Tailwind setup lives in this one
  CSS file (Tailwind v4 is CSS-first, no `tailwind.config.js` needed):
  - **Preflight is off.** We only import `tailwindcss/theme.css` +
    `tailwindcss/utilities.css`, not the full `tailwindcss` reset. Preflight
    zeroes out heading/button/form margins app-wide, which would visibly
    break every Bootstrap page that hasn't been converted yet. Switch to the
    full `@import "tailwindcss";` once Bootstrap is fully removed.
  - **Dark mode** reuses the existing mechanism instead of adding a second
    one: `useThemeStore` already sets `data-bs-theme="dark"` on `<html>`
    (`src/stores/theme.ts`), so `dark:` variants are wired to that attribute
    via `@custom-variant dark`. No new store, no `.dark` class convention.
  - **Design tokens** (`--color-primary`, the gray scale, etc.) are copied
    from `src/assets/sass/core/components/_variables.scss` so
    `bg-primary` / `text-gray-500` / etc. render the exact same hex values
    as the Bootstrap theme, not Tailwind's stock palette. If the SCSS
    variables ever change, update this block too — they're not derived from
    each other automatically.
  - **Element Plus** is retargeted to the same tokens via its documented
    CSS-variable API (`--el-color-primary`, ...), so it doesn't look like a
    different design system where it's used.
- `prettier-plugin-tailwindcss` (class sorting) was **not** added — this repo
  is pinned to Prettier 2, and the plugin requires Prettier 3. Not worth an
  unrelated Prettier major-version bump for this task; revisit if/when
  Prettier gets upgraded.

## Converted: `src/views/organization/site/Overview.vue`

Picked as the pilot because it's a real, currently-routed business page
(site management), not template demo boilerplate, and it doesn't depend on
Element Plus — a clean first case.

Notable pattern used there, worth reusing elsewhere:

- **Modals → native `<dialog>`.** The page's three inline modals used
  Bootstrap's JS `Modal` component. Replaced with plain `<dialog>` +
  `showModal()`/`close()` — the platform already does show/hide, the
  backdrop (`backdrop:bg-black/50`), and Escape-to-close for free. One
  fewer JS dependency, no library modal component needed. This was scoped
  to this file's own local modals only; shared modal components elsewhere
  (e.g. `components/modals/forms/AddSiteModal.vue`) still use Bootstrap's
  `Modal` and were left alone — converting a *shared* component ripples
  into every page that uses it, which is a separate, bigger task.
- Spinners → `animate-spin` + a border, instead of Bootstrap's
  `.spinner-border`.
- No new abstraction for the repeated "card" `rounded-lg border ... p-6`
  pattern — it's inlined 6 times on this one page. Worth extracting into a
  shared `<Card>` component once 2-3 *more* pages adopt the same shape;
  premature to add it for one page.

## Rollout plan for the rest of the app

Converting all 283 files in one sweep isn't realistic to do safely or
verify in one sitting — do it page by page instead:

1. Pick one view at a time (start with other real `organization/*` /
   `apps/*` pages before the Metronic demo/template boilerplate under
   `views/controlplane/**`, most of which isn't even routed — check
   `src/router/index.ts` before spending time on a page).
2. Swap Bootstrap grid/utility classes (`row`/`col-*`, `d-flex`, `me-*`,
   `fw-bold`, ...) for Tailwind equivalents using the tokens above, same as
   `Overview.vue`.
3. Leave Element Plus components (`<el-table>`, `<el-date-picker>`, ...) as
   they are — just themed, not rewritten (per the earlier scope decision).
4. Leave Bootstrap's JS-driven components (shared modals, dropdowns,
   tooltips) alone unless you're also updating every page that shares them.
5. Once every page is converted: remove `bootstrap`/`bootstrap-icons` from
   `package.json`, delete `src/assets/sass/`, drop the `Modal` import,
   switch `tailwind.css` to the full `@import "tailwindcss";` (turns
   Preflight back on).

## Verifying a converted page

```bash
npm run type-check   # vue-tsc
npx eslint <file> --ext .vue,.ts
npm run dev           # visually check light + dark mode
```
