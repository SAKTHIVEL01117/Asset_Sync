# Code Standards

Implementation rules and conventions for the entire project. Every AI agent working on this project must follow these standards to ensure consistent architecture, maintainability, and clean Odoo development practices.

---

# Engineering Mindset

The AI agent should behave like a senior Odoo ERP developer.

Principles:

- Read all context files before implementing any feature.
- Understand the business workflow before writing code.
- Build only what the current feature requires.
- Complete one feature before moving to the next.
- Every feature must be immediately testable.
- Prefer readability over clever implementations.
- Never duplicate business logic.
- Follow Odoo best practices whenever possible.

---

# Python Standards

- Follow PEP 8.
- Use descriptive variable and method names.
- Keep methods small and focused.
- Use constants instead of magic values.
- Avoid deeply nested logic.
- Always validate input before processing.
- Use exceptions only when appropriate.
- Never suppress exceptions silently.

Example:

```python
def action_allocate_asset(self):
    self.ensure_one()

    if self.state != "available":
        raise ValidationError("Only available assets can be allocated.")

    self.state = "allocated"
```

---

# Odoo Model Standards

Every model should follow this structure.

```python
from odoo import api, fields, models
from odoo.exceptions import ValidationError


class Asset(models.Model):
    _name = "asset.asset"
    _description = "Asset"

    name = fields.Char(required=True)

    @api.constrains("name")
    def _check_name(self):
        ...
```

Rules:

- One model per file.
- Keep business logic inside models.
- Use meaningful model names.
- Use `_inherit` only when extending existing models.
- Never write business logic inside views.

---

# XML View Standards

Views should remain clean and readable.

Rules:

- One major view per XML file.
- Group related fields.
- Use notebooks for large forms.
- Use tree views for listings.
- Use kanban only when beneficial.
- Keep labels meaningful.
- Never duplicate fields.

---

# Folder Naming

Use the following structure.

```
models/
views/
security/
reports/
wizard/
controllers/
data/
static/
```

Rules:

- snake_case filenames
- one model per file
- one major view per xml

---

# Naming Conventions

Models

```
asset.asset
asset.department
asset.category
asset.employee
asset.booking
asset.audit
```

Python Files

```
asset.py
department.py
booking.py
maintenance.py
```

XML Files

```
asset_views.xml
booking_views.xml
dashboard_views.xml
```

Methods

```
action_allocate()
action_return()
action_transfer()
_compute_status()
_check_booking_overlap()
```

---

# Business Logic

Business rules belong only inside models.

Never implement business rules inside:

- XML
- JavaScript
- Controllers

Example

```python
@api.constrains("start_time", "end_time")
def _check_booking_overlap(self):
    ...
```

---

# Security

Always use:

- Access Control Lists
- Record Rules
- Groups

Never rely only on hidden buttons.

Every important operation must also be validated server-side.

---

# Validation

Always validate:

- Duplicate Asset Tags
- Booking Overlaps
- Invalid Status Changes
- Missing Required Fields
- Invalid Dates
- Unauthorized Operations

Raise

```python
ValidationError
```

instead of silently failing.

---

# Workflow Methods

Business workflows should always use action methods.

Examples

```python
action_allocate()

action_return()

action_transfer()

action_approve()

action_reject()

action_start_maintenance()

action_complete_maintenance()

action_close_audit()
```

Never update workflow fields directly from the UI.

---

# Computed Fields

Use computed fields only when values depend on other fields.

Example

```python
status_color = fields.Selection(
    compute="_compute_status_color"
)
```

Store computed fields only if required.

---

# Constraints

Use

```python
@api.constrains
```

for business validation.

Examples

- Asset Tag uniqueness
- Booking overlap
- Return Date validation
- Duplicate allocations

---

# Scheduled Actions

Cron jobs should only handle automation.

Examples

- Detect overdue returns
- Send booking reminders
- Maintenance reminders
- Dashboard refresh
- Audit notifications

Never place user-driven actions inside cron jobs.

---

# Reports

Reports should contain only presentation logic.

Business calculations belong inside models.

Supported Reports

- Asset Inventory
- Allocation Report
- Maintenance Report
- Audit Report
- Booking Report

---

# Logging

Always log important actions.

Examples

- Asset Registered
- Asset Allocated
- Transfer Approved
- Booking Created
- Maintenance Approved
- Audit Closed

Avoid excessive logging.

---

# Error Handling

Always provide meaningful messages.

Good

```python
raise ValidationError(
    "This asset is already allocated."
)
```

Bad

```python
raise Exception("Error")
```

Never expose internal tracebacks to users.

---

# Performance

Always:

- Search only required records.
- Use indexed fields where possible.
- Avoid unnecessary loops.
- Use batch operations.
- Minimize database queries.

Avoid searching inside loops.

---

# Import Order

```
Python Standard Library

↓

Odoo Imports

↓

Third-party Libraries

↓

Local Imports
```

Example

```python
from datetime import datetime

from odoo import api, fields, models
from odoo.exceptions import ValidationError
```

---

# Comments

Only explain **why**, not **what**.

Good

```python
# Prevent duplicate allocation because
# one asset cannot belong to multiple users.
```

Avoid obvious comments.

---

# Dependencies

Use only approved dependencies.

Core

- Odoo 18
- PostgreSQL
- Python

Frontend

- OWL
- Bootstrap

Reporting

- Odoo Reporting Engine

Do not install additional libraries unless absolutely necessary.

---

# Invariants

These rules must never be violated.

- Asset Tags are always unique.
- Assets cannot be allocated twice.
- Booking conflicts are never allowed.
- Maintenance requires approval.
- Audit history is immutable after closing.
- Every asset maintains complete history.
- Every important action is logged.
- Role permissions are enforced through ACLs and Record Rules.
- Business logic always resides inside Odoo models.
- XML views never contain business logic.
```