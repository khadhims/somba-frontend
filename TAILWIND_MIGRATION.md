# Tailwind migration

Status: **every routed view/component is converted or explicitly deferred
with a documented reason.** Checked against the full component list Vue
Router lazy-loads (`grep -oE 'import\("@/(views|components)/[^"]+"\)'
src/router/index.ts`) — see "Coverage" below for the complete accounting.
The rest of the app's 283 `.vue` files are either shared components (only
touched where a page's own conversion needed them) or unrouted Metronic
demo/template files never reached by the router.

## Correction: the original pilot page was wrong

The very first file converted in this migration,
`src/views/organization/site/Overview.vue`, turned out to be **orphaned
dead code** — not referenced by the router or anything else, just a
same-named file next to the real one. The actual routed site-overview page
is `src/views/controlplane/site/Overview.vue`, a different, since-diverged
file that wasn't touched until this was caught and fixed. If you're
grepping for "the pilot," it's `controlplane/site/Overview.vue`.
`organization/site/Overview.vue` is still on disk and still converted, but
it's dead — don't use it as a reference for "the real pattern," and don't
spend time keeping it in sync with anything.

Also confirmed dead code, found the same way (zero importers via
repo-wide grep) and *not* converted because of it:
`src/layouts/DashboardLayout.vue` and the
`default-layout/components/{search/*, aside/search/{Main,Results,
Preferences,AdvancedOptions,Empty}.vue}` tree (superseded by
`GlobalSearch.vue`).

## Shared components extracted (AHA / rule-of-three)

Only extracted after the same pattern showed up 3+ times, per the
"beyond reusable components" architecture note — not a speculative pass:

- **`src/core/helpers/badge.ts`** — `formInputClass` (was pasted
  identically into 10+ files) and `badgeVariantClass(variant)` (12+ call
  sites). Each page still owns its own domain mapping (which status string
  → which variant); only the resulting Tailwind class strings are shared.
  Uses an explicit variant→class lookup map, not string interpolation
  (`bg-${variant}-light`) — Tailwind's build-time scanner needs literal
  class strings in source or it silently drops the CSS.
- **`src/components/common/InitialAvatar.vue`** — the "circle with the
  entity's first letter" avatar (sites, orgs, accounts, teams, rooms,
  cameras — was hand-copied into 7+ files).
- **`src/components/common/RowActionButton.vue`** — the icon-only
  edit/delete/view/manage row-action button repeated on every CRUD table.
  Icon content stays a slot, not an icon-name prop: Keenicons duotone
  icons each need a different number of `<span class="pathN">` children,
  so composition is simpler than a per-icon lookup table. Variants:
  `primary` (default), `success`, `danger`, `warning`.
- **`src/components/common/ConfirmDialog.vue`** — generic yes/no
  confirmation dialog. Replaces the delete-confirmation modal that was
  duplicated verbatim in 4 files. Body content is a slot (each call site
  interpolates a bold entity name a plain message prop can't express).

## Modal pattern: Bootstrap JS `Modal` → native `<dialog>`

Repeated throughout: any page-local modal driven by
`new Modal(document.getElementById(...))` / `Modal.getInstance(...)` was
converted to a plain `<dialog ref="..."> ` + `showModal()`/`close()` — the
platform already handles show/hide, the backdrop
(`backdrop:bg-black/50`), and Escape-to-close, so no JS modal library is
needed. This was scoped to each file's **own local** modals only — shared
modal components used by multiple pages (`AddSiteModal.vue`,
`EditSiteModal.vue`, `CameraPlaybackModal.vue`, etc.) were left on
Bootstrap's `Modal`, since converting a shared component ripples into
every page that uses it — a separate, bigger task, not attempted here.

One exception: `Camera.vue`'s Add/Edit modal chrome uses `Teleport` +
`Transition` with a hand-tuned scale/fade entrance animation and custom
scrollbar styling — not Bootstrap-JS-driven, already well-built. Left that
chrome as its own scoped `<style>`; only the form fields inside were
converted.

## What's in the Tailwind setup itself

- `tailwindcss` + `@tailwindcss/vite` installed, wired into `vite.config.ts`.
- `src/assets/css/tailwind.css` — the whole config lives in this one CSS
  file (Tailwind v4 is CSS-first, no `tailwind.config.js`):
  - **Preflight is off** (`tailwindcss/theme.css` + `tailwindcss/utilities.css`
    only, not the full reset) — it would zero out heading/button/form
    margins on every still-Bootstrap page. Switch to the full
    `@import "tailwindcss";` once Bootstrap is fully removed.
  - **Dark mode** reuses the existing mechanism: `useThemeStore` sets
    `data-bs-theme="dark"` on `<html>` (`src/stores/theme.ts`); `dark:`
    variants are wired to that attribute via `@custom-variant dark`.
  - **Design tokens** (`--color-primary`, the gray scale, ...) are copied
    from `src/assets/sass/core/components/_variables.scss` so
    `bg-primary` / `text-gray-500` render the same hex values as the
    Bootstrap theme. Not derived automatically — if the SCSS values ever
    change, update this block too.
  - **Element Plus** is retargeted to the same tokens via its documented
    CSS-variable API (`--el-color-primary`, ...).
- `prettier-plugin-tailwindcss` was **not** added — repo is pinned to
  Prettier 2, plugin needs Prettier 3. Revisit if/when Prettier is upgraded.

## Coverage: every router-reachable file, accounted for

**Converted** (37 files): Dashboard, LiveView, Events/Alerts + their
table/detail-modal components, apps/monitoring-center (Overview +
Settings), apps/recording-playback (Overview + Settings),
apps/report/daily-report/DailyReport, site Overview/Room/Nvr/Camera/Settings
+ Site wrapper, organization/account/team Overview + their wrapper
components, the two auth error pages, profile/Overview (thin wrapper),
HorizontalWizardPage (thin wrapper), plus the 4 shared components above.

**Deliberately deferred, with reasons** (don't re-attempt blind — verify
in the running app first if you do):

- `authentication/basic-flow/SignIn.vue` — bespoke custom-designed login
  screen (~670 lines of its own scoped CSS: cursor-tracking camera,
  particles, neon button), not a template page. Only the one genuine
  Bootstrap utility class present was converted.
- `authentication/basic-flow/SignUp.vue` — live password-strength-meter
  widget (`data-kt-password-meter` + JS-toggled classes) and Metronic's
  `fv-plugins-*` form-validation conventions wired to exact class names.
- `team/Settings.vue` (2482 lines, the largest file in the app) —
  Metronic's stock "Account Settings" scaffold: profile-picture upload
  (`data-kt-image-input`, queried directly by
  `src/assets/ts/components/_ImageInputComponent.ts`), notification
  toggles (`data-kt-check`/`data-kt-check-target`), button loading states
  (`data-kt-indicator`) — all real JS widgets keyed to exact attribute
  names.
- `pages/profile/{Activity,Campaigns,Connections,Documents,Projects}.vue`
  + `components/page-layouts/Profile.vue` — Metronic demo content with
  hardcoded fake data ("Max Smith", "Jan 23, 2021", "My Connections
  (29)"), coupled to Bootstrap's JS tab switcher
  (`data-bs-toggle="tab"` + `nav-tabs`/`tab-pane`) and jQuery's Select2
  plugin (`data-control="select2"`). Not linked from real Somba
  navigation in any way that matters; only `profile/Overview.vue` (a
  thin widget wrapper with no JS-widget coupling) was converted.
- `LayoutBuilder.vue` (653 lines, route `/builder`) — confirmed not
  linked from either nav menu (`Aside/Menu.vue`, `header/Menu.vue`); only
  reachable by typing the URL. It's Metronic's own built-in
  theme-customization tool, not a Somba feature.
- Shared modal/widget **components** used by multiple pages
  (`AddSiteModal.vue`, `EditSiteModal.vue`, `CameraPlaybackModal.vue`,
  and similar) — still Bootstrap `Modal`-driven. Converting one ripples
  into every page that imports it; that's a distinct task from converting
  a single page's own template.

**General rule applied throughout:** convert generic Bootstrap/Metronic
template classes; leave anything a JS widget queries by exact class or
`data-kt-*`/`data-bs-*`/`data-control` attribute name alone unless you're
prepared to verify the interactive behavior still works in the running app.

## Lesson: `vue-tsc --noEmit` clean is necessary, not sufficient

`vue-tsc` does **not** validate template tag balance. A large structural
edit to `Dashboard.vue` (collapsing a Bootstrap `row`/`col-12` wrapper
into a single Tailwind div) left one extra closing `</div>` at the bottom
of the file — `vue-tsc` reported zero errors, but Vite's actual SFC
compiler threw "Invalid end tag" and the page 500'd. Caught only by
loading the page through `vite dev` and checking the HTTP status, not by
type-checking alone. **Always do both** on any file with structural
changes: `vue-tsc --noEmit`, then load the file through a running dev
server and confirm a 200 with no compiler errors in the log. For files
with heavy restructuring, also manually diff `<div`/`</div>` (and
`<dialog`/`</dialog>`) counts in the template before even running `vue-tsc`.

## Remaining work if picking this up again

1. Convert the deferred JS-widget-coupled files for real — means
   rebuilding the tab switcher / Select2 / password-meter / image-input
   behavior in Vue first, not just swapping classes. Bigger scope than
   everything done so far.
2. Convert the shared modal components (`AddSiteModal.vue` etc.) to
   native `<dialog>`, verifying every page that imports each one still
   works.
3. Convert the app shell (`DefaultLayout.vue` + Aside/Header/Menu/Footer/
   drawers, ~4500 live lines) — highest blast-radius since it renders on
   every page; do this last, and manually verify in the browser, not just
   via compile checks, since a mistake here breaks the whole app.
4. Once everything above is done: remove `bootstrap`/`bootstrap-icons`
   from `package.json`, delete `src/assets/sass/`, switch `tailwind.css`
   to the full `@import "tailwindcss";` (turns Preflight back on).

## Verifying a converted page

```bash
npm run type-check              # vue-tsc --noEmit
npx eslint <file> --ext .vue,.ts
npx vite --port <free-port> --strictPort &   # then curl -sI the file's URL
                                              # for a 200, check the log for errors
npm run dev                     # visually check light + dark mode
```
