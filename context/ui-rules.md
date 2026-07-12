# UI Rules

Concise rules for building the AssetFlow UI. Follow these guidelines to maintain a clean, professional ERP interface that is consistent across all modules.

---

# Design Philosophy

AssetFlow is an enterprise ERP system.

The interface should be:

- Clean
- Professional
- Minimal
- Data-focused
- Fast to navigate
- Responsive
- Accessible

Avoid decorative elements that distract from business workflows.

---

# Layout

- Full-width application layout
- Responsive design
- Standard Odoo top navigation
- Consistent spacing throughout
- Maximum content width: 1440px
- Page padding: 24px
- Section spacing: 24px
- Card spacing: 16px

---

# Navigation

Main Menu

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

Rules

- Use Odoo's standard navigation.
- Keep menu hierarchy simple.
- Avoid deeply nested menus.

---

# Cards

Every dashboard section should use a standard card.

Properties

```
Background: White

Border Radius: Medium

Padding: 20–24px

Subtle Shadow

Consistent Internal Spacing
```

Do not use colored card backgrounds.

Use colors only for:

- Status
- Charts
- Notifications
- Badges

---

# Typography

Hierarchy

### Page Title

- Large
- Bold

### Section Title

- Medium
- Semi-bold

### Body Text

- Regular

### Secondary Text

- Smaller
- Muted

### KPI Numbers

- Large
- Bold

Maintain consistent typography across the application.

---

# Buttons

Primary

- Create
- Save
- Allocate
- Submit
- Approve

Secondary

- Cancel
- Back
- Reset

Danger

- Delete
- Reject

Rules

- One primary action per screen.
- Keep labels concise.
- Use consistent button placement.

---

# Forms

Standard Layout

```
General Information

↓

Details

↓

Attachments

↓

Notes
```

Rules

- Group related fields.
- Required fields first.
- Read-only fields clearly indicated.
- Use notebooks for large forms.

---

# Tables

Used for:

- Assets
- Employees
- Departments
- Bookings
- Maintenance
- Audits

Features

- Search
- Filters
- Sorting
- Pagination
- Bulk Actions

Rules

- Consistent column spacing.
- Clear headers.
- Highlight selected rows.
- Avoid horizontal scrolling whenever possible.

---

# Status Badges

Use consistent badges throughout the system.

Available Statuses

```
Available

Allocated

Reserved

Under Maintenance

Lost

Retired

Disposed

Pending

Approved

Rejected

Completed
```

Each status should have a consistent color across all screens.

---

# Dashboard

Dashboard should always display

Top KPIs

- Assets Available
- Assets Allocated
- Active Bookings
- Maintenance Today
- Pending Transfers
- Upcoming Returns

Additional Sections

- Recent Activity
- Notifications
- Charts
- Quick Actions

---

# Charts

Supported

- Bar Chart
- Line Chart
- Pie Chart

Rules

- Show meaningful labels.
- Avoid unnecessary animations.
- Keep charts simple and readable.

---

# Search & Filters

Every listing should support

- Keyword Search
- Department Filter
- Category Filter
- Status Filter
- Date Filter

Filters should remain visible without cluttering the interface.

---

# Dialogs

Use confirmation dialogs for

- Delete
- Approve
- Reject
- Transfer
- Bulk Actions

Dialog Actions

```
Confirm

Cancel
```

Avoid unnecessary confirmation steps.

---

# Notifications

Display notifications for

- Success
- Warning
- Error
- Information

Rules

- Keep messages short.
- Never expose technical details.
- Always provide actionable feedback.

---

# Empty States

Every module should provide an empty state.

Examples

- No Assets Found
- No Bookings
- No Maintenance Requests
- No Audit Records

Include

- Simple icon
- Short description
- Primary action button where appropriate

---

# Loading States

During loading

- Skeleton Cards
- Skeleton Tables
- Loading Spinner

Never leave blank screens while data loads.

---

# Error States

Display

- Friendly error message
- Retry button

Never expose stack traces or internal errors.

---

# Responsive Design

Desktop

- Multi-column layouts
- Full dashboard
- Side-by-side forms

Tablet

- Reduced grids
- Scrollable tables

Mobile

- Single-column layout
- Stacked cards
- Collapsible sections

---

# Icons

Use Odoo's standard icon library whenever possible.

Icons should indicate

- Assets
- Departments
- Employees
- Maintenance
- Reports
- Notifications
- Settings

Avoid decorative icons.

---

# Accessibility

Always

- Use meaningful labels.
- Maintain sufficient color contrast.
- Support keyboard navigation.
- Ensure forms are screen-reader friendly.
- Avoid using color alone to convey meaning.

---

# Consistency Rules

Every new UI component should

- Match existing spacing.
- Match typography.
- Match button styles.
- Match status badges.
- Follow existing layouts.
- Be reusable.

Never introduce a different design pattern when an existing one already solves the same problem.

---

# Do Nots

- Do not use gradients.
- Do not use overly bright colors.
- Do not clutter dashboards.
- Do not use inconsistent spacing.
- Do not mix multiple button styles on one screen.
- Do not display technical errors to end users.
- Do not create custom UI components when standard Odoo components are sufficient.
- Do not duplicate UI patterns already used elsewhere.

---

# Final Principle

Every screen should allow users to complete common ERP tasks quickly with minimal clicks while maintaining a consistent, professional, and business-focused experience throughout the application.