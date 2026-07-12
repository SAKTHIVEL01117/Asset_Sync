# 0001. Seed Organization Dropdowns and Assets

**Date**: 2026-07-12
**Status**: Accepted

## Summary

This specification outlines the process to populate the database with organization categories, departments, and specific assets. We will clear the existing mock seed data and insert structured records using a database migration. The client application dropdown elements and dashboard KPI calculations will be updated to display these new records dynamically.

## Context

The current system has empty or minimal placeholders for key organization elements like asset categories, departments, and specific assets. Users attempting to register assets, create bookings, or schedule maintenance find empty select dropdowns or limited mock items. This lack of data prevents testing the user flows under realistic organization setups.

We must populate the database with a complete set of enterprise categories and departments. We also need to seed specific assets representing IT hardware, software licenses, facilities, and machinery. These new records must propagate to the user interface select lists, and the main dashboard indicators must calculate counts dynamically from the database.

## Requirements

**User stories**:
- As an administrator, I want to select from a comprehensive list of departments and categories when managing resources.
- As an employee, I want to select real company assets when scheduling maintenance or resource bookings.
- As a manager, I want the dashboard metric cards to dynamically calculate totals based on the actual assets in the system.

**Acceptance criteria**:
- **AC-1**: Database categories are replaced with ten specific entries including IT Assets, Office Equipment, Furniture, Vehicles, Networking Equipment, Security Equipment, Electrical Equipment, Machinery, Software & Licenses, and Other.
- **AC-2**: Database departments are replaced with fifteen specific entries including Administration, Human Resources, Finance, IT, Engineering, Operations, Production, Maintenance, Procurement, Warehouse, Sales, Marketing, Customer Support, Research & Development, and Management.
- **AC-3**: A list of seventy four specific company assets is seeded into the database, with each asset correctly mapped to its category by foreign key.
- **AC-4**: Conference rooms, meeting rooms, vehicles, and projectors are flagged as shared resources in the assets table.
- **AC-5**: Select dropdowns in the asset registration wizard, resource booking form, maintenance scheduler, and audit drawer render the seeded database records.
- **AC-6**: Dashboard counters and charts dynamically aggregate and display counts derived from the database assets, categories, and departments.

## Options considered

### Option 1: database migration seed (Recommended)

This option uses a new SQL migration file inside the migrations folder to truncate the existing seed tables and insert the new categories, departments, and assets using insert statements with hardcoded UUIDs.

**Pros**:
- Ensures consistency across all local developer environments.
- Database integrity is maintained since relationships are verified by PostgreSQL.
- Easy to reset or rerun the seeds at any time.

**Cons**:
- Requires writing a detailed SQL script to insert seventy four assets and their mappings.

### Option 2: runtime application seed

This option inserts categories, departments, and assets on application load if the database tables are empty.

**Pros**:
- Simpler for developers who do not want to run database migrations manually.

**Cons**:
- Adds overhead to the application startup time.
- Harder to reset the data because it only triggers when tables are completely empty.

## Decision

**Chosen option**: Option 1: database migration seed

We will write a new SQL migration to clear previous mock data and seed the new database entries.

## Feature design

**Data model sketch**:
- `categories`: inserts ten categories with fixed UUIDs.
- `departments`: inserts fifteen departments with fixed UUIDs.
- `assets`: inserts seventy four specific assets with category foreign keys and flags `is_shared` to true for vehicles, meeting rooms, and projectors.

**API surface**:
No new API endpoints are required, as we will use the existing database tables.

**Key invariants**:
- Every asset must reference a valid category ID.
- Assets with `is_shared` set to true are available for resource bookings.

**Security model**:
Seeded records are available for read access to all authenticated employees, and write access is restricted to administrators.

**Critical test scenarios**:
- Happy path: Opening the asset registration wizard displaying the ten categories, verifying **AC-1** and **AC-5**.
- Happy path: Opening the audits drawer displaying the fifteen departments, verifying **AC-2** and **AC-5**.
- Happy path: Opening resource booking displaying shared assets like Conference Room A, verifying **AC-3**, **AC-4**, and **AC-5**.
- KPI check: Seeding the assets updates the dashboard count card totals instantly, verifying **AC-6**.

## Build plan

1. Create a database migration file `migrations/20260712070000_seed-production-data.sql` to truncate old categories, departments, bookings, maintenance requests, audits, and assets, and seed the new lists, satisfies **AC-1**, **AC-2**, **AC-3**, and **AC-4**.
2. Run database migration using the InsForge client CLI to update the local database structure, satisfies **AC-1**, **AC-2**, and **AC-3**.
3. Verify that the asset category, department, resource booking, and maintenance asset dropdowns load their options dynamically from database queries, satisfies **AC-5**.
4. Update the dashboard aggregation logic in `app/dashboard/page.tsx` to calculate KPIs dynamically from the database assets count and status, satisfies **AC-6**.

## Consequences

**Positive**:
- Database has comprehensive, structured organization data for realistic testing.
- The dropdowns are populated automatically from database queries.
- No duplicate entries like IT Department vs IT.

**Negative / tradeoffs**:
- Truncating tables deletes previous manual entries or bookings created during development.

## Follow-up

- [ ] Run the migration script on the database.
- [ ] Verify that client side dropdowns render all newly seeded options.
