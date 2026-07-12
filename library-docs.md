# Library Docs

Project-specific usage patterns for the technologies used in AssetFlow. This file only covers how we use each library and framework in this project — rules, patterns, and constraints specific to AssetFlow.

Read the relevant section before implementing any feature that uses these technologies.

---

# Before Using Any Library

Before implementing any feature that uses a framework or library:

1. **Check AGENTS.md** at the project root for installed skills and project-specific instructions.
2. **Check for an MCP server** if available to access the latest documentation and debugging tools.
3. **Read this file** for project-specific implementation rules.

Order of authority:

```
MCP Server
↓

Skills (AGENTS.md)

↓

This File

↓

General Training Knowledge
```

Never rely solely on general training knowledge since APIs evolve over time.

---

# Odoo 18

**Check first:** AGENTS.md for Odoo development skills.

AssetFlow is built entirely as a custom Odoo module.

---

## Models

Business logic belongs inside models.

Example:

```python
class Asset(models.Model):
    _name = "asset.asset"
    _description = "Asset"

    name = fields.Char(required=True)
```

Rules

- One model per file.
- Use Odoo ORM only.
- Never execute raw SQL unless absolutely necessary.
- Use computed fields when appropriate.
- Use constraints for business validation.
- Keep methods focused.

---

## ORM

Always use Odoo ORM.

Read

```python
assets = self.env["asset.asset"].search([
    ("state", "=", "available")
])
```

Create

```python
self.env["asset.asset"].create({
    "name": "Laptop",
    "category_id": category.id,
})
```

Update

```python
asset.write({
    "state": "allocated"
})
```

Delete

```python
asset.unlink()
```

Rules

- Always use ORM.
- Never bypass ORM.
- Use `search_count()` when only counts are required.
- Use `mapped()` whenever possible.
- Batch updates when updating multiple records.

---

## Security

Always implement:

- Access Control Lists
- Record Rules
- User Groups

Groups

```
Administrator

Asset Manager

Department Head

Employee
```

Never rely on hidden buttons for security.

Server-side validation is mandatory.

---

## XML Views

Use:

- Form View
- Tree View
- Kanban View
- Calendar View
- Search View
- Dashboard View

Rules

- Keep XML readable.
- Use notebooks for large forms.
- Group related fields.
- Reuse views whenever possible.

---

## Menus

Hierarchy

```
AssetFlow

├── Dashboard
├── Organization
├── Assets
├── Allocations
├── Resources
├── Maintenance
├── Audits
├── Reports
└── Settings
```

Keep navigation simple.

---

# PostgreSQL

Database is managed entirely by Odoo ORM.

Never:

- Create manual tables.
- Write manual migrations.
- Modify schema outside models.

Always define fields inside models.

---

# OWL (Odoo Web Library)

Use OWL only when custom frontend behavior is required.

Suitable for:

- Dashboard widgets
- Interactive components
- Charts
- Dynamic forms

Avoid OWL for features that standard Odoo views already support.

---

# Bootstrap

Bootstrap is used only for UI enhancements.

Use:

- Grid System
- Cards
- Buttons
- Alerts
- Badges
- Responsive Layout

Avoid excessive custom CSS.

---

# Scheduled Actions (Cron)

Use cron jobs only for background automation.

Examples

- Detect overdue returns.
- Send booking reminders.
- Maintenance reminders.
- Audit notifications.
- Dashboard refresh.

Never place user-triggered operations inside scheduled jobs.

---

# Reports

Use the Odoo Reporting Engine.

Reports

- Asset Inventory
- Asset Allocation
- Maintenance Report
- Audit Report
- Booking Report
- Department Utilization Report

Business calculations belong in models, not reports.

---

# Mail & Activities

Use Odoo Mail Activities for notifications.

Notifications include:

- Asset Allocated
- Asset Returned
- Transfer Approved
- Booking Reminder
- Maintenance Approved
- Maintenance Completed
- Audit Assigned
- Audit Completed
- Overdue Return Alert

Never send duplicate notifications.

---

# Sequences

Use Odoo Sequences for unique identifiers.

Examples

```
AST000001

AST000002

AST000003
```

Rules

- Asset Tags are automatically generated.
- Never allow duplicate Asset Tags.
- Never manually edit generated identifiers.

---

# Wizards

Use Wizards for multi-step workflows.

Examples

- Asset Transfer
- Maintenance Approval
- Audit Verification
- Bulk Allocation

Business logic remains inside models.

---

# Dashboards

Dashboard should display live KPIs.

Widgets

- Assets Available
- Assets Allocated
- Active Bookings
- Pending Transfers
- Maintenance Today
- Upcoming Returns

Refresh using ORM queries.

Avoid unnecessary database calls.

---

# Validation

Always validate:

- Duplicate Asset Tags
- Booking Conflicts
- Invalid Transfers
- Invalid Dates
- Missing Required Fields
- Invalid State Transitions

Raise

```python
ValidationError
```

Never fail silently.

---

# Performance

Always

- Use ORM efficiently.
- Batch operations.
- Prefetch related records.
- Search only necessary records.
- Avoid nested loops.
- Minimize database queries.

Never search inside loops if it can be avoided.

---

# Logging

Record important actions.

Examples

- Asset Registered
- Asset Allocated
- Asset Returned
- Transfer Approved
- Booking Created
- Maintenance Approved
- Audit Closed

Avoid unnecessary logging.

---

# Business Rules

Always enforce the following rules:

- Every Asset Tag is unique.
- Assets cannot be allocated twice.
- Booking conflicts are not allowed.
- Assets under maintenance cannot be allocated.
- Transfer requests require approval.
- Closed audits cannot be modified.
- Every asset maintains complete history.
- Every important action generates an activity log.

---

# Dependencies

Approved Technologies

Core

- Odoo 18
- Python
- PostgreSQL

Frontend

- OWL
- Bootstrap
- XML Views

Backend

- Odoo ORM
- Odoo Security
- Odoo Reporting Engine
- Odoo Mail Activities

Avoid introducing additional third-party libraries unless absolutely necessary.

---

# Project Rules

Every AI agent working on AssetFlow must:

- Read all project context files before implementation.
- Build one module completely before starting the next.
- Follow Odoo best practices.
- Keep business logic inside models.
- Keep views clean and maintainable.
- Respect role-based permissions.
- Write production-quality code from the beginning.
- Ensure every completed feature is immediately testable.
- Maintain consistency throughout the project.