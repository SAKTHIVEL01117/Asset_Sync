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

---

## Active Conventions & Architecture

* **Framework**: Next.js 16.2.10 (App Router), React 19.2.4, TypeScript 5, Tailwind CSS v4.
* **Component Model**: Pure React/TSX inside the `app/` folder, styling with semantic CSS variables defined in `@theme` in `app/globals.css`.
* **APIs**: Using asynchronous request-time APIs (`params`, `searchParams`, `cookies`, `headers`) strictly, complying with Next.js 16.
