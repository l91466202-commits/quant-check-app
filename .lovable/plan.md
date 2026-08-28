# Mobile Responsiveness Pass

Tighten mobile behavior across the app. The shell already has a hamburger drawer and most pages use responsive grids — this pass focuses on the specific gaps that show up at 320–428px.

## Scope (files touched)

- `src/routes/index.tsx` — landing page
- `src/routes/auth.tsx` — login/signup
- `src/routes/docs.tsx` — public docs
- `src/routes/app.tsx` — app shell (hamburger already exists; verify touch targets)
- `src/routes/app.dashboard.tsx`, `app.analytics.tsx`, `app.import.tsx`, `app.export.tsx`, `app.team.tsx`, `app.settings.tsx`, `app.profile.tsx`, `app.onboarding.tsx`
- `src/components/app/page.tsx` — shared `PageHeader` / `PageBody` / `StatCard`

No business logic, no route changes, no design-system token changes.

## Concrete changes

### Landing (`index.tsx`)
- Hero heading: drop from `text-4xl` → `text-3xl` at base, `sm:text-5xl`, `lg:text-6xl`; remove the hard `<br />` in the heading so it wraps naturally on 320px.
- Hero paragraph: `text-base sm:text-lg lg:text-xl` (was `text-lg sm:text-xl`).
- Hero CTAs: stack full-width on mobile — wrap in `flex flex-col sm:flex-row`, each button `w-full sm:w-auto`, `min-h-11`.
- Hero vertical padding: `py-14 sm:py-20 lg:py-28` (was `py-20 sm:py-28`).
- Mock dashboard bar chart: reduce to 8 bars on mobile via `hidden sm:block` on the trailing bars, or shrink to `gap-1` — prevents overflow at 320px.
- Section vertical padding: `py-14 sm:py-20` on "How it works", FAQ, CTA.
- CTA card: `p-6 sm:p-10 lg:p-14` (was `p-10 sm:p-14`); heading `text-2xl sm:text-3xl lg:text-4xl`; remove `<br />`.
- Footer: already `flex-wrap`; add `justify-center sm:justify-between` and `text-center sm:text-left`.

### Auth (`auth.tsx`)
- Container padding: `p-4 sm:p-6 lg:p-10` (was `p-6 sm:p-10`).
- Heading: `text-2xl sm:text-3xl`.
- Inputs: add `min-h-11` to `<Input>` instances (email, password, orgName, fullName) via className.
- Button already `w-full min-h-11` — leave as is.

### Docs (`docs.tsx`)
- Verify TOC/side-nav stacks above content on mobile (`flex-col lg:flex-row`), full-width headings scale `text-2xl sm:text-3xl lg:text-4xl`, add `px-4 sm:px-6 lg:px-8`.
- Prose paragraphs: `max-w-prose` to cap line length ~65ch on desktop.

### App shell (`app.tsx`)
- Hamburger button already exists; bump to `min-h-11 min-w-11` for 44px target.
- Sidebar nav links: add `min-h-11` so touch targets meet 44px.
- Sign-out button: `min-h-11`.
- Org switcher button: `min-h-11`.

### Shared `PageHeader` (`components/app/page.tsx`)
- Title: `text-xl sm:text-2xl lg:text-3xl` (was `text-2xl sm:text-3xl`).
- `PageBody` padding: `p-4 sm:p-6 lg:p-8` (was `p-6 sm:p-8`).
- Actions slot: wrap so `<PageHeader actions>` stacks full-width on mobile — actions container gets `w-full sm:w-auto` and inner buttons `w-full sm:w-auto` (each page passes its own buttons; we'll patch the pages that render action buttons).

### App pages
For each of dashboard/analytics/import/export/team/settings/profile/onboarding:
- Any `<PageHeader actions={...}>` with buttons: wrap actions in `flex flex-col sm:flex-row gap-2 w-full sm:w-auto`, each button `w-full sm:w-auto min-h-11`.
- Any inline `flex` toolbar (filters, "Add", "Export CSV" rows) → `flex-col sm:flex-row`, children full-width on mobile.
- Tables: already wrapped in `overflow-x-auto rounded-lg border` on dashboard — audit the others (analytics, team, export) and add the same wrapper where a `<Table>` is used bare. This preserves the table but keeps horizontal scroll scoped inside the card, so the page itself never scrolls horizontally.
- Grids of stat cards: already `sm:grid-cols-2 lg:grid-cols-4` — leave.
- Onboarding step buttons ("Back" / "Continue"): stack `flex-col-reverse sm:flex-row`, full-width on mobile.
- Team page invite form and role selects: full-width inputs on mobile, stack labels above.
- Settings tabs/sections: verify tab list wraps or scrolls horizontally inside its own container (never the page).
- Profile: form inputs `min-h-11`, buttons `w-full sm:w-auto`.

### Global no-horizontal-scroll safety
- Add `overflow-x-hidden` to `<body>`? No — that hides real bugs. Instead we ensure no fixed-width children escape: audit for any hardcoded `w-[NNNpx]` or `min-w-` on non-scroll containers introduced accidentally. Tables stay inside `overflow-x-auto` wrappers.

## Verification

After changes, use Playwright headless at 320, 375, 428, 768, 1024, 1440 for: `/`, `/auth`, `/auth?mode=signup`, `/docs`, `/app/dashboard`, `/app/analytics`, `/app/team`, `/app/settings`, `/app/onboarding`. Screenshot each viewport; confirm:
1. No horizontal page scroll (document width == viewport width).
2. Primary CTAs full-width at ≤640px.
3. Hamburger opens/closes; nav links tappable.
4. Tables scroll within their card, not the page.
5. Inputs render ≥44px tall on mobile.

## Out of scope

- Design/visual overhaul (colors, typography scale beyond responsive sizing, iconography).
- Any backend, auth, RLS, or data-fetching change.
- Route additions/removals.
