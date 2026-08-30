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
converted. `src/components/CameraPlaybackModal.vue` is the same story —
also `Teleport`+`Transition`-based, not `Modal`-driven — and is now fully
converted (was previously miscategorized below as still-Bootstrap-Modal).

## Toggle switches: `form-check form-switch` → `ToggleSwitch.vue`

`src/components/common/ToggleSwitch.vue` — replaces Bootstrap's
`form-check form-switch form-check-custom form-check-solid` pill toggle.
Native `<input type="checkbox">` kept (visually hidden via `sr-only`) so
it's still a real form control for a11y/label-click/focus-ring; the
pill+knob is pure CSS via `peer-checked`, no JS. Takes a plain
`v-model="someBoolean"` and a slot for the label text. Extracted while
fixing the three Settings.vue toggle-switch gaps below (15+ call sites
across those three files alone). Plain (non-switch) checkboxes — Bootstrap's
`form-check-custom form-check-solid` without `form-switch` — didn't get a
component: just a native `<input type="checkbox">` with
`accent-primary` (Tailwind's native `accent-color` utility, a real platform
feature, no forms plugin needed) plus sizing/rounding classes.

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

**Converted** (42 files as of Phase 0, +18 more in Phase 1 — see below):
Dashboard, LiveView, Events/Alerts + their table/detail-modal components,
apps/events-alerts/Settings, apps/monitoring-center (Overview + Settings),
apps/recording-playback (Overview + Settings),
apps/report/daily-report/DailyReport, site
Overview/Room/Nvr/Camera/Settings + Site wrapper, organization/account/team
Overview + their wrapper components, the two auth error pages,
profile/Overview (thin wrapper), HorizontalWizardPage (thin wrapper),
`CameraPlaybackModal.vue`, plus the 5 shared components above (now
including `ToggleSwitch.vue`).

**Phase 1 (Bucket A: mechanical class-swap, live no-JS files)** — done:
`DatePicker.vue`, `ItemPerPage.vue`, `common/Pagination.vue`, all 7
`activity-timeline-items/Item{1-7}.vue` (Item8 is an empty stub, no-op),
`cards/ActivitySummaryCard.vue`, `cards/Card5.vue`,
`dashboard-default-widgets/{CardWidget1,Widget1}.vue`,
`dashboard/DashboardReportModal.vue` (mostly bespoke scoped CSS already —
only 3 real Bootstrap utility classes touched, same minimal-touch
precedent as `SignIn.vue`), `dashboard/RealTimeReport.vue` (4162 lines,
but script-first file order means only ~600 template lines needed
conversion — also had a dead Bootstrap-class-keyed `@media` block and a
custom SCSS badge/button-variant system removed, since Tailwind's
responsive prefixes + `badgeVariantClass()` now cover the same ground),
`messenger-parts/{MessageIn,MessageOut}.vue`,
`skeleton/{SkeletonCard,SkeletonTableRow}.vue`, `layouts/{AuthLayout,
SystemLayout}.vue`, `authentication/basic-flow/PasswordReset.vue` (found
mid-Phase-1, not in the original deferred list — its `data-kt-indicator`
button-loading was ported to a `ref`-driven boolean, same pattern as the
Phase 0 Settings pages).

New shared helper: `swalConfirmButtonClass`/`swalDangerButtonClass`/
`swalCancelButtonClass` in `badge.ts` — SweetAlert2 is used with
`buttonsStyling: false` throughout (14+ call sites found), which means its
confirm/cancel buttons need a `customClass` or render unstyled. Only
applied to `PasswordReset.vue` so far; apply to the other ~13 call sites
as they're encountered in later phases rather than as a separate sweep.

One extra dead file found during Phase 1 (not in the original recon):
`src/views/controlplane/widgets/Mixed.vue` — zero importers anywhere,
add to the Phase 7 deletion list.

## Phase 2 corrections (KTDataTable + Dropdown1-4)

`KTDataTable.vue` — converted. Its scoped CSS depended on Bootstrap's own
`--bs-*` CSS variables (`--bs-gray-100`, `--bs-primary`, ...), which
disappear once `bootstrap` is removed in the final cleanup phase — rewrote
using direct Tailwind utility classes instead of custom CSS wherever
possible. Also fixed a real pre-existing bug while there: the loading
spinner `<div>` was a direct child of `<table>`, which is invalid HTML
(browsers silently hoist it out); moved it to be a sibling of the
`overflow-x-auto` wrapper with `position: relative`/`absolute` instead.

**Recon correction**: the 7 files under `kt-datatable/table-partials/**`
(`Loading.vue`, `TableFooter.vue`, `TableContent.vue`, `TableBodyRow.vue`,
`TableItemsPerPageSelect.vue`, `TablePagination.vue`, `TableHeadRow.vue`)
were listed as "live, child of KTDataTable" in the original recon — this
was wrong. `KTDataTable.vue` reimplements everything inline and never
imports any of them; nothing outside their own folder does either. This
was a second, fully orphaned data-table implementation. **Deleted** all 7
(kept `table-partials/models.ts`, a shared type file `KTDataTable.vue`
itself still imports).

## Phase 3 progress (previously-deferred widgets)

**Recon correction, found while converting the profile pages**: the
recon's dead-file list treated `pages/profile/{Activity,Campaigns,
Connections,Documents,Projects}.vue` as effectively dead ("nav-unlinked
demo"), but they're routed (`router/index.ts` imports them), which counts
as a real importer under our own "zero importers = dead" rule. That
means every component THEY import is live too, not dead:
`cards/{Card1,Card2,Card3}.vue`, `files/{File,Folder}.vue` were all
wrongly bucketed as dead — converted all 5. Converted the 5 profile pages
themselves too (Activity's Bootstrap tab-switcher → `ref` + `v-show`,
Connections/Projects's inert `data-control="select2"` → deleted).

Found and fixed 3 template-literal class-interpolation bugs while
converting these cards (`` `text-${color}` ``, `` `bg-${state}
text-inverse-${state}` `` etc.) — same trap `badge.ts`'s own comment
warns about: Tailwind's build-time scanner can't see runtime-computed
class names, so these would've silently rendered unstyled in production.
Fixed with explicit literal maps (`badgeVariantClass()` reused where the
light-pill look fit; a new local `SOLID_BG_CLASSES` map in `Card1.vue`
where a solid-bg-plus-white-text look was needed instead). Card1.vue's
`statusDataBadgeColor`/`statusDataColor` string props (raw Bootstrap class
names passed in from the caller) were collapsed into one `statusVariant`
prop for the same reason — no caller varied them independently anyway.

**`team/Settings.vue` done** (2482 lines, largest file in the app). Real
JS-widget work beyond the original plan's scope:
- `data-bs-toggle="collapse"` on all 6 section headers (works via
  Bootstrap's global Collapse data-api side effect, same mechanism as Tab)
  → 6 `ref(true)` booleans + `v-show`, click handler on the header.
- `data-kt-image-input` avatar upload — confirmed still unwired (no
  `onMounted`) → rebuilt the chrome in plain Tailwind, left the file input
  itself inert exactly as before (selecting a file still does nothing
  visible - not adding new functionality).
- `data-kt-check`/`data-kt-check-target` notification-preferences table —
  confirmed `CheckComponent` doesn't exist anywhere in the codebase →
  converted to plain independent checkboxes, dropped the inert
  master-toggle attributes.
- 4 `form-check form-switch` toggles (allowmarketing/google/github/slack) -
  uncontrolled (no `v-model`) → kept uncontrolled, using the same
  `peer`/`peer-checked` CSS pattern as `ToggleSwitch.vue` but inlined
  directly (native `:checked` state needs no Vue binding to drive
  `peer-checked:` classes).
- 7 `data-kt-indicator` button-loading toggles (`submitButton1-5`,
  `updateEmailButton`, `updatePasswordButton`) → same `ref(false)` +
  `v-if`/`v-else` pattern as `PasswordReset.vue`/`SignUp.vue`.

Caught one real bug mid-edit: a regex replacement that consumed a
`<div ` opening tag's text without its `<div` prefix, producing
`<div <label ...>` (malformed) in 3 places - caught by the div-tag-balance
check before it ever reached the dev server, fixed directly.

`SignUp.vue` done - ported `_PasswordMeterComponent.ts`'s scoring algorithm
(5 checks × 20 points, capped at 4 highlight bars) to a plain `computed`,
same `isSubmitting` ref pattern as `PasswordReset.vue` for the submit
button. Found the general-case per-bar threshold math never actually
varies (all 5 checks are always enabled in this app) - reproduced the
observed behavior (`bars = criteria met - 1`) directly rather than porting
unused generality.

**Not converted yet, found during this pass**: `page-layouts/Profile.vue`
(322 lines, the parent wrapper these 5 pages render inside) has real JS
coupling not yet handled anywhere in this migration - a
`data-bs-toggle="modal"` trigger, a `data-kt-menu-trigger` dropdown, and
Metronic's `data-kt-countup` number-animation widget. Needs its own
careful pass (verify what `_CountUpComponent.ts` or equivalent actually
does before touching), not a quick win - left alone for now.

## Phase 5 progress (wizard steppers)

New `src/composables/useStepper.ts` replaces Metronic's `StepperComponent`
(`src/assets/ts/components/_StepperComponent.ts`) for both wizard trees.
Turned out simpler than expected: `StepperComponent` was only ever driving
DOM class toggling (`current`/`completed`/`pending`) - the real
step-advance validation gating was already 100% Vue-side (vee-validate's
`handleSubmit` per step) in both `CreateAccountWizardForm.vue` and
`CreateAppWizardForm.vue` before this migration. The composable just
replaces the class-toggling half with a reactive `currentStepIndex` +
`stepState(index)`. Converted all 15 files: both stepper-nav wrappers
(`CreateAccountHorizontalWizardStepper.vue`, `CreateAccountVerticalWizardStepper.vue`,
`CreateAppWizardStepper.vue`), both forms, and all 10 step components
(`v-show="active"` prop replaces the `data-kt-stepper-element="content"` +
hardcoded `.current` class).

Also replaced the `v-tooltip` directive (`main.ts`, wraps Bootstrap's real
`Tooltip` widget) on all 7 usages - all inside these same wizard steps -
with the plain `title` attribute already present on every element (native
tooltip, zero JS). Once Phase 8 confirms nothing else uses `v-tooltip`,
the directive registration and `import { Tooltip } from "bootstrap"` in
`main.ts` can go.

Caught one real behavior bug while converting: initially added
`v-show="!stepper.isFirstStep.value"` to hide the "Back" button on step 1
of `CreateAccountWizardForm.vue` - the original never hid it (clicking it
on step 1 was just a clamped no-op). Fixed to match original behavior
exactly (button always visible). Also caught a genuine "invented a loading
state" mistake: the original submit buttons' `indicator-progress` span was
never actually toggled by anything (no matching `setAttribute` call in
either form's script) - initially added a new `submitting` ref that would
have changed real behavior; reverted to match the original's always-shows-
"Submit" behavior instead of newly wiring a spinner state that was never
there.

**Scope correction**: `CreateAppModal.vue`'s modal wrapper wasn't
converted - its only live trigger (`data-bs-toggle="modal"
data-bs-target="#kt_modal_create_app"`) is inside `Toolbar.vue`, a Phase 6
shell file, same situation as `InviteFriendsModal.vue`/`MessengerDrawer.vue`
in Phase 4. The wizard tree itself doesn't depend on how its wrapper is
shown, so no rework needed later - just the outer `modal`/`data-bs-*`
shell + Toolbar's trigger deferred to Phase 6.

## Phase 4 progress (shared Bootstrap-Modal components → `<dialog>`)

Done: `AddSiteModal.vue`, `EditSiteModal.vue` (both use
`backdrop:"static",keyboard:false` - replicated via `@cancel.prevent` +
no backdrop-click handler, since native `<dialog>` already doesn't close
on backdrop click by default), `MembershipListModal.vue`
(3 importers: org/team/account `Overview.vue`) + nested
`AddEditMemberModal.vue` (default Bootstrap behavior - closes on
backdrop-click/Escape - replicated via `@click.self="close()"` +
`@cancel="hideModal"`, the established pattern already used in
`organization/Overview.vue`'s own dialogs). Both membership modals' dead
scoped CSS (`.table th`, `.pagination .page-item`, etc, keyed to Bootstrap
class names no longer in the template) replaced by direct Tailwind
classes - dropped the `<style>` blocks entirely.

**Scope correction**: `InviteFriendsModal.vue` was planned as a quick
"swap the trigger's `data-bs-target` for a ref + `.showModal()`" job, on
the assumption its trigger was easy to reach. Its only *live* trigger
(`data-bs-target="#kt_modal_invite_friends"`) is actually inside
`MessengerDrawer.vue` (default-layout shell, not Toolbar.vue as first
assumed) - a Phase 6 file. Converting the modal now would leave that
trigger broken until Phase 6 lands (wiring a click signal from
`MessengerDrawer.vue` up to the modal ref that only exists in
`DefaultLayout.vue` isn't a one-line fix, it's new prop/emit plumbing
across component boundaries - real Phase 6 work). **Deferred to Phase 6**,
alongside `MessengerDrawer.vue` and `Dropdown4.vue`.

`CreateAppModal.vue` remains paired with Phase 5 per the original plan
(wraps the create-app wizard steps - converting the shell without the
stepper inside working isn't really "done"). With that, Phase 4 is
complete except for the two items explicitly deferred elsewhere.

**Recon correction**: `Dropdown1.vue`/`Dropdown2.vue` were correctly
flagged as `data-kt-menu`-driven, but `Dropdown3.vue`/`Dropdown4.vue` were
wrongly classified as "Bootstrap `data-bs-*`-driven" — direct inspection
shows all 4 use `data-kt-menu="true"` + `data-kt-menu-trigger`/
`-placement`/`-flip` for their own show/hide (the odd `data-bs-toggle`
attributes inside Dropdown3/4 are on individual *links* for opening
unrelated modals/tooltips, not the dropdown's own visibility). All 4
dropdowns' show/hide currently depends on Metronic's `MenuComponent.ts`
toggling a `.show`-style class that only means something because
`.menu`/`.menu-sub-dropdown` are still Metronic SCSS classes — converting
their classes now, before `MenuComponent` itself is replaced, would break
open/close. **Deferred all 4 to Phase 6**, bundled with the
`MenuComponent`/app-shell rework rather than done standalone here.

Note: `monitoring-center/Settings.vue` and `recording-playback/Settings.vue`
were previously listed here but had un-converted `form-check`/`form-switch`
toggle-switch markup left behind (the page shell was done, every toggle was
missed) — now fixed, see `ToggleSwitch.vue` above. `events-alerts/Settings.vue`
was previously not actually converted at all despite living next to
already-converted siblings — now done too.

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
  (`AddSiteModal.vue`, `EditSiteModal.vue`, and similar) — still Bootstrap
  `Modal`-driven. Converting one ripples into every page that imports it;
  that's a distinct task from converting a single page's own template.
  (`CameraPlaybackModal.vue` doesn't belong on this list — see the
  `Teleport`/`Transition` note above; it's fully converted.)

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

**Superseded**: the "deferred" list above and the old "Remaining work"
list that used to follow it are both stale — every item in them (SignUp's
password meter, `team/Settings.vue`, the profile pages/`Profile.vue`, all
shared modals, the full app shell) was converted in Phases 3–6 below.
Kept for the historical error-cases they document (real bugs caught, false
positives ruled out); don't treat them as an open TODO list.

## Phase 6 (app shell, `DefaultLayout.vue` + `default-layout/components/**`)

Replaced Metronic's `MenuComponent` (1130 lines, generic click/hover +
accordion/dropdown submenu engine) with a 60-line `composables/useDropdown.ts`
(open/close/toggle + click-outside via a single `containerRef` wrapper,
positioned with plain Tailwind `absolute`/`relative` instead of
`@popperjs/core` — every live call site is a simple "click button, small
menu appears near it" case, not a viewport-collision-aware one, so the
extra dependency wasn't earning its keep). Nested submenus (Dropdown3/4's
"Subscription"/"Groups" flyouts, UserAccountMenu's same) use
`group`/`group-hover:` instead of JS.

**Recon correction, found by tracing actual `<Dropdown*>` template usage
(not just import lines)**: `Dropdown1.vue` and `Dropdown2.vue` turned out
to have zero live importers — their only consumers were dead `widgets/**`
files and `toolbar/Toolbar.vue`, which itself turned out to be dead (zero
importers anywhere, despite `Toolbar.vue`/`Card2.vue`'s own dropdown code
looking identical). **Deleted both**, along with `Toolbar.vue`,
`menus/QuickLinksMenu.vue`, `header/Menu.vue`, the old
`default-layout/components/search/**` (superseded by `GlobalSearch.vue`),
and 5 of 6 files under `aside/search/**` (only `InlineForm.vue` is
imported by the live `AsideSearch.vue`) — same "zero importers = dead"
rule as Phase 7, just found early. Also found: `Team.vue`/`Account.vue`/
`Organization.vue` each imported `Dropdown3` but never placed it in their
template (dead import, template is just `<router-view>`) — removed the
imports, no visual change since nothing was ever rendered.

One real consequence of `Toolbar.vue` being dead: `CreateAppModal.vue`
(mounted globally by `DefaultLayout`) has had **zero live open triggers**
since before this migration started — its only opener was Toolbar's
"Create" button. Converted its shell to `<dialog>` anyway (it's still
rendered, per the project's own rule), but it stays permanently closed,
exactly as it already was.

`InviteFriendsModal.vue`'s only live trigger ("Invite Contacts" in
`Dropdown4`, itself only reachable from `MessengerDrawer.vue`) is a
different component than the modal (mounted by `DefaultLayout`) — added
`inviteFriendsOpen` to the existing `stores/drawers.ts` (same
cross-component-trigger shape as the 4 drawers already there) instead of
threading a prop/emit chain through 2 component boundaries.

`ScrollTop.vue` replaced Metronic's `ScrollTopComponent` (custom scroll
animation utility) with a plain `window.addEventListener("scroll", ...)`
+ native `scrollTo({behavior: "smooth"})` — same 200px show threshold.

`aside/Menu.vue`'s 3-level nested accordion nav replaced
`data-kt-menu-sub="accordion"` with a `reactive<Record<string, boolean>>`
keyed by each section's route: expanded-by-default follows the existing
"is a descendant route active" check, with a manual per-key override on
click so toggling one section doesn't affect sibling sections still on
the route-based default.

Confirmed via grep that **zero live files** still reference
`data-kt-menu`, `data-kt-drawer`, `data-kt-scroll`, `data-kt-toggle`, or
`data-kt-swapper` anywhere in the app (all remaining hits are inside
Phase-7-slated dead files or my own code comments) — so
`reinitializeComponents()` and its `onMounted`/route-`watch` calls were
removed from `DefaultLayout.vue` outright, and the whole
`assets/ts/components/*` KT controller system (`ToggleComponent`,
`StickyComponent`, `MenuComponent`, `ScrollComponent`/`ScrollTopComponent`,
`DrawerComponent`, `SwapperComponent`) is now fully dead code, safe to
delete in Phase 8 alongside `assets/sass/`.

Two dead-modal-target links found and left inert (same as the
`InviteFriendsModal.vue` situation before it was fixed, but these two
never got a live modal at all): `Dropdown4`'s "Add Contact"
(`#kt_modal_users_search`, no matching modal anywhere) and
`NotificationsMenu.vue`'s "Upgrade" button / `Profile.vue`'s "Hire Me"
button (`#kt_modal_upgrade_plan` / `#kt_modal_offer_a_deal`, both modals
exist as components but neither is mounted anywhere live). Dropped the
dead `data-bs-toggle`/`data-bs-target` attributes, kept the links inert.

Found and fixed one real data bug while converting `InviteFriendsModal.vue`:
2 of 17 seed users had `state: getAssetPath(...)` instead of
`avatar: getAssetPath(...)` (copy-paste typo — the value is unmistakably
an avatar path). Typing the array as `InviteUser[]` makes the typo a type
error; fixed to the obvious intended field instead of preserving it.

## Verifying a converted page

```bash
npm run type-check              # vue-tsc --noEmit
npx eslint <file> --ext .vue,.ts
npx vite --port <free-port> --strictPort &   # then curl -sI the file's URL
                                              # for a 200, check the log for errors
npm run dev                     # visually check light + dark mode
```
