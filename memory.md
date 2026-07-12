# Project Memory

This file serves as the durable memory checkpoint for the AssetSync project. It contains a historical log of all features built, architecture changes, and conventions.

## Commands Reference

* `/remember save`: Triggered by the user to save all new progress, changes, and decisions made in the workspace since the last checkpoint to this file.
* `/remember restore`: Triggered by the user to read and align on all changes made up to the current point, restoring visual and structural context.

---

## Completed Milestones

### Phase 1 — Foundation

#### 01. Project Setup
* Initialized Next.js 16/React 19 skeleton with Tailwind CSS v4 in the workspace.
* Configured Tailwind `@theme` properties in `app/globals.css` with semantic tokens (`--color-primary`, `--color-success`, etc.) mapped to the project spec.
* Fixed CSS build warning by moving the Inter google font `@import url(...)` declaration above `@import "tailwindcss"`.

#### 02. Homepage & Design
* Generated a professional enterprise dashboard preview mockup using AI, saved in `public/dashboard_mockup.jpg`.
* Developed the complete landing page in `app/page.tsx` matching `public/screen.png` with premium styling and animations.
* Created interactive accordion toggle state for the Frequently Asked Questions (FAQ) section.
* Removed authenticated navigation items (`Dashboard`, `Assets`, `Maintenance`, `Reporting`, `Resources`) from the public header, ensuring they only render after a user authenticates.
* Verified that the full production build compiles with **zero errors and warnings** (`next build`).
* Updated progress tracking status in `context/progress-tracker.md`.

#### 03. Authentication
* Set up a portable local Node.js v24.18.0 environment in the workspace.
* Logged in and linked the repository to the InsForge project `AssetSync` (`40fc81d0-0a59-4ed0-b86f-5d08bff77da6`).
* Installed the `@insforge/sdk` package for the Next.js app.
* Configured local environment variables in `.env.local` using the project's anon key retrieved from InsForge secrets.
* Created SDK integration clients ([client.ts](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/lib/insforge/client.ts) and [server.ts](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/lib/insforge/server.ts)), session refresh route ([route.ts](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/api/auth/refresh/route.ts)), and Next.js 16+ session refresh [proxy.ts](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/proxy.ts).
* Developed Server Actions in [actions.ts](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/actions.ts) for sign-in, sign-up, sign-out, OTP verification (required by project metadata), and social OAuth logins.
* Designed a premium, responsive sign-in/sign-up/verification dashboard page in [page.tsx](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/login/page.tsx) with interactive modes, OTP code entry, and Google/GitHub login buttons.
* Created the OAuth redirect callback route in [route.ts](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/api/auth/callback/route.ts) to securely exchange codes for sessions.
* Fixed an "Invalid URL" error during Google/GitHub OAuth logins by correcting `NEXT_PUBLIC_INSFORGE_URL` in `.env.local` to point to the backend URL instead of the CLI integration API key.
* Verified that the full Next.js production build (`npm run build`) compiles with zero errors and warnings.

#### 04. Role-Based Access Control, 05. Database Schema & 06. Organization Setup
* Created and applied InsForge SQL migration file `20260712052803_schema-foundation.sql` establishing the core PostgreSQL tables: `departments` (hierarchical department tree), `employees` (durable user-to-employee records), and `categories` (asset groups).
* Implemented Row-Level Security (RLS) policies on all tables, providing read-access to all authenticated users and strict write-access to administrators.
* Wrote `public.get_current_user_role()` function using `SECURITY DEFINER` to securely inspect user roles without recursion.
* Guarded employee roles and status fields from escalation via a `BEFORE UPDATE` trigger on `public.employees` that prevents non-admins from modifying role/status columns.
* Connected user registrations to the database using an `AFTER INSERT` trigger on `auth.users` to automatically create an employee record with the `admin` role for the first signup and `employee` for subsequent ones.
* Developed the main navigation component [Navbar.tsx](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/components/Navbar.tsx) mapping authenticated pages to user roles.
* Created the `/organization` dashboard page in [page.tsx](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/organization/page.tsx) with interactive subviews and modals for managing departments, categories, and employees.
* Created a clean operational portal landing page in [page.tsx](file:///C:/Users/sakth/OneDrive/Desktop/assetsync/app/dashboard/page.tsx).
* Verified the Next.js 16 build compiles successfully with zero warnings or errors.

### Phase 2 — Asset Management & UI Recreation

#### 07. Asset Registration Page, 08. Asset Registration Logic, 09. Asset Directory & 10. Asset Details & History
* Linked local environment to the InsForge project `AssetSync` via CLI to unlock DB operations and schemas.
* Created and applied database migration `20260712055913_schema-assets.sql` defining the `assets` table, indexes, grants, RLS policies, and trigger for auto-generating sequential asset tags (`AST-XXXX`).
* Created a public storage bucket named `assets` in InsForge for uploading and hosting asset images and documentation.
* Built the Asset Directory dashboard at [page.tsx](file:///D:/projects/designs/Asset_Sync/app/assets/page.tsx) with search, category filtering, status filtering, and dual views (Kanban Grid / List Table).
* Developed an interactive asset registration wizard with metadata validation, dynamic image uploading, and document attachments synced with the InsForge storage bucket.
* Built the Asset Details page at [page.tsx](file:///D:/projects/designs/Asset_Sync/app/assets/[id]/page.tsx) displaying complete physical specs, uploaded file previews, and logs for allocation, maintenance, and audits.
* Restored all missing npm dependencies (`@insforge/sdk`) and verified that the entire Next.js production build compiles with zero errors or warnings.

#### 11. Full Re-creation of Unified Layouts & Sub-Pages UI
* Created the unified dark-vertical vertical navigation sidebar layout component `SidebarLayout.tsx` which integrates the Top Navigation search and quick actions bar.
* Recreated the **Dashboard** page (`/dashboard`), **Asset Management** directory (`/assets`), **Resource Booking** calendar scheduler (`/bookings`), **Maintenance Management** list and technician schedules (`/maintenance`), **Audit Management** compliance registry and AI anomalies panel (`/audits`), **Reports & Analytics** financial charts and utilization comparison tables (`/reports`), **AI Assistant** neural engine chat interface and system health diagnostic widgets (`/ai-assistant`), and **Enterprise Settings** workspace configurations grids (`/settings`).
* Restructured the `/assets/:id` details view page to utilize the standard `SidebarLayout`.
* Implemented auth redirection and route protection: unauthenticated visits to app pages are automatically intercepted and redirected to `/login`, and authenticated visits to `/login` are automatically routed to `/dashboard`.
* Verified that the full Next.js production build compiles with zero errors or warnings.

### Phase 3 — Settings, Sign Out & Quick Actions Refactoring

#### 12. Settings Availability & Layout Unification
* Unified the sidebar navigation by integrating the **Organization** tab conditionally for administrators based on their dynamic employee role loaded from the `employees` table.
* Replaced the horizontal `Navbar` on `/organization` with the standard `SidebarLayout` component, unifying styling, search, and global actions.
* Added Sign Out action items to both the top header user dropdown and the bottom sidebar user widget.

#### 13. Credentials/Session Invalidation
* Programmed the Sign Out handlers to invoke the server action (`handleSignOut`) to delete backend session cookies, followed by a client-side hard-refresh redirect (`window.location.href = '/login'`). This completely invalidates browser-level in-memory variables and local session storage caches, forcing credential re-entry.

#### 14. Dashboard Quick Actions Interception
* Wired the Executive Overview quick actions to redirect to target views with search parameters:
  * Register Asset -> `/assets?register=true`
  * Book Resource -> `/bookings`
  * Schedule Maintenance -> `/maintenance?schedule=true`
  * Start Audit -> `/audits?start=true`
* Implemented query-parameter-aware `useEffect` handlers in `app/assets/page.tsx`, `app/maintenance/page.tsx`, and `app/audits/page.tsx` to automatically trigger corresponding drawers, wizards, and modals on page load.
* Executed a full production build (`npm run build`) and verified error-free compilation and clean static page generation.

### Phase 4 — Pre-release Audit & Remediation

#### 15. Server-side Route Protection & Token Refresh
* Configured Next.js 16+ `proxy.ts` edge middleware to handle server-side route redirection. Protects all workspace paths (e.g. `/dashboard`, `/assets`, `/bookings`) and redirects unauthenticated visits directly to `/login`, eliminating client-side UI flicker.

#### 16. Asset Details Edit Triggers
* Hooked up the static "Edit" and "Actions" triggers inside the Assets directory drawer to dynamically route to the dynamic details view `/assets/[id]`.

#### 17. Interactive Audit Compliance Verification
* Developed a dynamic detail view modal inside `app/audits/page.tsx`. Clicking an active audit ID queries its scoped `audit_items` list and allows verifying compliance status (Verified / Missing / Damaged) in real-time, auto-calculating the parent audit compliance score in PostgreSQL.

#### 18. Smart Booking Suggestions Checkout
* Attached click event handlers to the "Smart Suggestions" recommendation cards in `app/bookings/page.tsx`, auto-populating reservation fields to check out "Boardroom B" next Friday at 10 AM.

---

## Active Conventions & Architecture

* **Frontend Framework**: Next.js 16.2.10 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4.
* **Backend Platform**: InsForge BaaS (PostgreSQL, Auth, Storage, Edge Functions, Realtime, AI gateway).
* **SDK client**: `@insforge/sdk@latest` with SSR integration helpers (`@insforge/sdk/ssr` and `@insforge/sdk/ssr/middleware`).
* **Component Model**: Pure React/TSX inside the `app/` folder, styling with semantic CSS variables defined in `@theme` in `app/globals.css`.
* **APIs**: Using asynchronous request-time APIs (`params`, `searchParams`, `cookies`, `headers`) strictly, complying with Next.js 16.
