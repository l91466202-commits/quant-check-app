# Budget Pulse

A multi-tenant spend / budget dashboard template built on Lovable Cloud. Black-and-white UI, per-organization data isolation via row-level security, CSV import/export, and role-based access (Admin / Member).

Live in-app docs for end users live at `/docs`.

---

## Stack

- **Framework:** TanStack Start v1 (React 19, Vite 7, file-based routing, SSR).
- **Styling:** Tailwind CSS v4 with a semantic-token design system defined in `src/styles.css`.
- **Backend:** Lovable Cloud (managed Supabase) — Postgres, Auth, RLS.
- **Client SDK:** `@/integrations/supabase/client` (auto-generated, do not edit).
- **Server:** TanStack `createServerFn` for app-internal server logic; no edge functions used.
- **State/data:** TanStack Query.

Server-only helpers live in `*.server.ts` files. Server functions live in `*.functions.ts` files. `.env` values (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) are managed by Lovable Cloud — do not edit them.

---

## Database schema

All app data lives in the `public` schema. Every table has RLS enabled and explicit `GRANT`s.

### `organizations`
The workspace / tenant boundary. Fields include `id`, `name`, `industry`, `company_size`, `onboarding_completed`. RLS: a row is visible only to members of that org (`is_org_member(id, auth.uid())`). Only admins can update the org (`has_org_role(id, auth.uid(), 'admin')`). Rows are created via `create_organization(name)` (SECURITY DEFINER), which also inserts the creator as `admin` in `org_members`.

### `org_members`
Join table between `auth.users` and `organizations` with a `role` column (`app_role` enum: `admin` | `member` | `viewer`). Unique on `(org_id, user_id)`. RLS: users can read their own memberships and other memberships in orgs they belong to; only admins can insert/update/delete members. A trigger (`protect_last_admin`) prevents removing or demoting the final admin of an org.

Role checks are done via SECURITY DEFINER helpers to avoid recursive RLS:
- `is_org_member(_org, _user)`
- `has_org_role(_org, _user, _role)`
- `get_org_role(_org, _user)`

### `budget_entries`
Per-org budget line items: `category`, `department`, `budgeted_amount`, `actual_amount`, `period` (e.g. `2026-Q1`), `vendor`, `notes`, `created_by`. RLS: any member of the org can read; admins and members can insert entries they create (viewers cannot insert); admins can update anything in the org, members can update only rows they created; only admins can delete.

### `org_invites`
Pending invitations to join an org. Each row carries a unique random `token`, an `expires_at` (7 days), and `accepted_at`. RLS: admins of the org can manage rows; invitees can read invites addressed to their own JWT email. Redemption goes through the `accept_invite(_token)` SECURITY DEFINER RPC, which requires an authenticated caller with a confirmed email whose address matches the invite, then inserts into `org_members` and stamps `accepted_at`. Signup no longer auto-accepts invites by unverified email. **Note:** creating an invite does *not* send an email — the admin copies the `/accept-invite?token=…` link and shares it. See "Known gaps" below.

### `profiles`
Basic user info (`id`, `email`, `full_name`) auto-populated from `auth.users` by `handle_new_user()`. Roles are **not** stored here — they live in `org_members` to prevent privilege escalation.

---

## Auth

### Email / password
Works out of the box. Signup creates the user, calls `create_organization` for the org name entered on the form, and lands the new admin in the 3-step onboarding flow at `/app/onboarding`.

**Email confirmation is currently auto-confirmed** (see "Known gaps"). To require verification, disable `auto_confirm_email` in the auth configuration.

### Google OAuth

The managed Google provider is enabled by default and works in the Lovable preview with no extra configuration. To use your **own** Google Cloud credentials (recommended for production):

1. In Google Cloud Console: **APIs & Services → Credentials → Create Credentials → OAuth client ID**. Choose **Web application**.
2. **Authorized redirect URI:** paste the callback URL shown in your Lovable Cloud project's auth settings (of the form `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Copy the generated **Client ID** and **Client Secret**.
4. In Lovable Cloud → auth settings → Google provider: paste the Client ID and Client Secret, save.
5. Test the "Continue with Google" button on `/auth`.

Google signups go through the same flow as email signups: they land on `/app/onboarding` where they name an organization and become its admin. To join an existing workspace instead, open the invite link — `/accept-invite?token=…` bounces to `/auth?redirect=…` when signed out and redeems the invite right after sign-in.

---

## Row-level security

Every `CREATE TABLE public.*` in `supabase/migrations/` is followed by `GRANT` statements and `ENABLE ROW LEVEL SECURITY`. Policies rely on SECURITY DEFINER helper functions to avoid recursive checks.

To verify RLS is intact after any change (or after a remix), run:

```sql
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Every table listed under "Database schema" above should appear with at least one policy per operation it exposes. Missing rows here = the table is either locked out or wide open — investigate before shipping.

---

## Environment / Lovable Cloud notes

- This is a Lovable Cloud project. The database, auth, and secrets are managed through the Lovable Cloud tab; there is no direct dashboard access.
- Do not edit auto-generated files: `src/integrations/supabase/client.ts`, `client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`, `types.ts`, `.env`, or `supabase/config.toml`.
- Schema changes go through migration files under `supabase/migrations/`. Migrations run automatically on the Lovable Cloud backend.
- Server secrets (e.g. `SUPABASE_SERVICE_ROLE_KEY`) are injected by the platform and are not accessible to end users. Do not attempt to read or log them.

---

## Known gaps — configure before production

- **Email verification is off.** `auto_confirm_email` was enabled to speed up testing. Turn it back off before production.
- **Password reset flow is not implemented.** The `/auth` page only handles signup and login. Add a "Forgot password?" flow using `supabase.auth.resetPasswordForEmail` before launch.
- **Invite emails are not sent.** Creating an invite on the Team page inserts a row into `org_invites` and surfaces a single-use link (`/accept-invite?token=…`) for the admin to copy and send. The invitee redeems it after signing in; the RPC rejects tokens that are expired, already used, or issued to a different email. There is no outbound email — to add delivery, hook a transactional provider (e.g. Lovable Email / Resend) into the invite-create flow.
- **No audit log.** Edits, deletes, role changes, and member removals leave no trail.
- **No legal pages.** Terms of Service and Privacy Policy are not included.
- **No rate limiting** on auth endpoints beyond the platform defaults.

---

## Remixing this template

If you clicked "Remix" on this project, here's what actually happens and what you need to redo:

### What carries over
- All source code (routes, components, hooks, styles).
- Migration files under `supabase/migrations/` — these re-run against the new backend and recreate the schema, RLS policies, functions, and triggers.
- The Lovable-managed Google OAuth provider works in the remixed project's preview URL out of the box.

### What does NOT carry over
- **The backend is fresh.** The remixed project gets its own new Lovable Cloud (Supabase) instance. No users, no organizations, no budget entries, no invites, no secrets from the source project are copied.
- **Custom Google Cloud OAuth credentials** (if you configured your own instead of using the managed provider) do not transfer. Their redirect URI is tied to the old project's auth URL and will not work for the new one. Redo the steps in "Google OAuth" above using the new project's callback URL.
- **Any secrets** you added under Project Settings → Secrets in the source project must be re-added.
- **Custom domains** and published URLs.

### First steps after remixing

1. **Rebrand.** Search for the string `Budget Pulse` and replace with your project name. Key spots: `src/routes/index.tsx` (landing), `src/routes/app.tsx` (sidebar logo), `src/routes/docs.tsx`, and the `head()` metadata in each route file.
2. **Verify migrations ran.** Open the Lovable Cloud tab in the new project and confirm the tables `organizations`, `org_members`, `budget_entries`, `org_invites`, `profiles` exist.
3. **Verify RLS.** Run the `pg_policies` query in the RLS section above. Every table should have policies. If any table is missing policies, do not go live — a missing policy on a table with GRANT means it's readable/writable by any authenticated user.
4. **Test the signup flow end-to-end.** Sign up as a new user; confirm you land on `/app/onboarding`, complete the three steps, and end up on the dashboard.
5. **Test the onboarding gate.** Sign out and back in. If onboarding is incomplete, you should be redirected to `/app/onboarding`; if complete, straight to `/app/dashboard`.
6. **Test isolation.** Sign up a second user in a different browser (or private window) with a different org name. Confirm you cannot see the first org's budget entries.
7. **Reconfigure Google OAuth** if you're using your own Google Cloud credentials (see steps above).
8. **Re-address the "Known gaps"** section before you point real users at it.

---

## Project structure

```
src/
  routes/              file-based routes (TanStack Start)
    __root.tsx         html shell + head metadata
    index.tsx          landing page
    auth.tsx           login / signup
    docs.tsx           public /docs page
    app.tsx            authenticated app shell (sidebar)
    app.*.tsx          authenticated pages (dashboard, analytics, import, etc.)
  components/
    app/               app-shell primitives (PageHeader, PageBody, StatCard...)
    ui/                shadcn/ui primitives
  hooks/               React Query hooks (use-org, use-budget-entries)
  integrations/
    supabase/          auto-generated Supabase clients & types (do not edit)
    lovable/           Lovable Cloud managed-auth helpers
  lib/
    format.ts          number/currency/date formatters
supabase/
  migrations/          schema + RLS migrations (source of truth)
  config.toml          auto-generated, do not edit
```
