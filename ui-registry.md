# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here.
2. If it exists, reuse the same layout, spacing, typography, and interaction patterns.
3. If it does not exist, build it following `ui-rules.md` and `ui-tokens.md`, then document it here.

After completing any UI component, update this file with:

- Component Name
- File Path
- Purpose
- Reusable Pattern
- Notes

---

# Layout Components

## App Layout

**File**

```
views/layout.xml
```

**Purpose**

Main application layout shared across all modules.

**Contains**

- Top Navigation
- Page Header
- Breadcrumb
- Content Container

---

## Dashboard Layout

**File**

```
views/dashboard_views.xml
```

**Purpose**

Displays organization-wide KPIs and recent activities.

**Contains**

- KPI Cards
- Charts
- Activity Feed
- Notifications
- Quick Actions

---

# Navigation Components

## Top Navigation

**File**

```
views/menu.xml
```

**Purpose**

Primary navigation for the ERP.

**Menu Items**

```
Dashboard
Organization
Assets
Allocations
Resources
Maintenance
Audits
Reports
Settings
```

---

## Breadcrumb

**Purpose**

Shows current navigation hierarchy.

Example

```
Dashboard
↓

Assets
↓

Asset Details
```

---

# Dashboard Components

## KPI Card

**Purpose**

Displays a single operational metric.

Examples

- Assets Available
- Assets Allocated
- Active Bookings
- Pending Transfers
- Maintenance Today
- Upcoming Returns

Reusable across dashboard pages.

---

## Activity Feed

Displays recent user activities.

Examples

- Asset Registered
- Asset Allocated
- Booking Created
- Maintenance Approved
- Audit Closed

Newest activity appears first.

---

## Notification Panel

Displays system notifications.

Examples

- Booking Reminder
- Overdue Return
- Maintenance Approval
- Audit Assignment

---

# Form Components

## Standard Form

Used for:

- Asset Registration
- Department
- Category
- Employee
- Maintenance
- Audit

Layout

```
Header

↓

General Information

↓

Additional Information

↓

Notes

↓

Attachments
```

---

## Form Buttons

Primary Actions

- Save
- Create
- Submit
- Approve

Secondary Actions

- Cancel
- Reset
- Back

Danger Actions

- Delete
- Reject

---

# Table Components

## Standard List View

Used for

- Assets
- Departments
- Employees
- Bookings
- Maintenance
- Audits

Features

- Search
- Filters
- Sorting
- Pagination
- Bulk Selection

---

## Search Bar

Supports

- Keyword Search
- Category Filter
- Status Filter
- Department Filter

---

## Status Badge

Available States

```
Available

Allocated

Reserved

Under Maintenance

Lost

Retired

Disposed
```

Each status should have a consistent color throughout the application.

---

# Asset Components

## Asset Card

Displays

- Asset Name
- Asset Tag
- Category
- Current Status
- Assigned User
- Location

Used in Kanban and Dashboard.

---

## Asset Details

Sections

- General Information
- Allocation History
- Maintenance History
- Audit History
- Attachments

---

# Allocation Components

## Allocation Form

Fields

- Asset
- Employee
- Department
- Allocation Date
- Expected Return Date
- Notes

Actions

- Allocate
- Cancel

---

## Transfer Dialog

Workflow

```
Current Holder

↓

New Holder

↓

Reason

↓

Approve
```

---

# Booking Components

## Booking Calendar

Displays

- Meeting Rooms
- Vehicles
- Equipment

Supports

- Day View
- Week View
- Month View

---

## Booking Card

Displays

- Resource
- Booked By
- Time
- Status

---

# Maintenance Components

## Maintenance Request Form

Fields

- Asset
- Issue Description
- Priority
- Attachments

Actions

- Submit Request
- Cancel

---

## Maintenance Timeline

Displays

```
Pending

↓

Approved

↓

Assigned

↓

In Progress

↓

Resolved
```

---

# Audit Components

## Audit Card

Displays

- Audit Name
- Assigned Auditor
- Status
- Progress

---

## Audit Verification Table

Columns

- Asset
- Current Status
- Verification Result
- Remarks

---

# Report Components

## Report Card

Displays

- Report Name
- Last Generated
- Export Button

---

## Analytics Chart

Supported Charts

- Bar Chart
- Line Chart
- Pie Chart

Used only on Dashboard and Reports pages.

---

# Modal Components

Standard Modal

Used for

- Confirm Delete
- Approvals
- Transfers
- Booking Confirmation
- Maintenance Approval

Buttons

- Confirm
- Cancel

---

# Empty State

Used when no records exist.

Contains

- Illustration/Icon
- Short Description
- Primary Action Button

Examples

- No Assets Found
- No Bookings
- No Maintenance Requests
- No Audit Records

---

# Loading State

Used during data loading.

Displays

- Skeleton Cards
- Skeleton Tables
- Loading Spinner

---

# Error State

Displays

- Error Message
- Retry Button

Never expose internal errors to users.

---

# Responsive Behavior

Desktop

- Full Dashboard
- Multi-column Layout
- Side-by-side Forms

Tablet

- Reduced Grid
- Scrollable Tables

Mobile

- Single-column Layout
- Stacked Cards
- Collapsible Sections

---

# Component Naming Convention

Views

```
asset_views.xml

department_views.xml

booking_views.xml

dashboard_views.xml
```

OWL Components

```
AssetCard

KPICard

BookingCalendar

ActivityFeed

NotificationPanel
```

---

# Design Principles

Every UI component should be:

- Consistent
- Reusable
- Responsive
- Accessible
- Minimal
- Business-focused
- Easy to navigate
- Optimized for ERP workflows

---

## Build Status

_No UI components have been implemented yet._

Update this registry after every completed component to maintain consistency across the project.