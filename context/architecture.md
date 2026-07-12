# Architecture

## Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Odoo 18 | ERP Framework |
| Language | Python | Backend Business Logic |
| Frontend | OWL (Odoo Web Library) | Interactive UI Components |
| Database | PostgreSQL | Persistent Data Storage |
| ORM | Odoo ORM | Database Operations |
| Authentication | Odoo Authentication | User Login & Role Management |
| Access Control | ACLs + Record Rules | Role-Based Permissions |
| Reporting | Odoo Reporting Engine | Reports & Analytics |
| Notifications | Odoo Mail & Activities | Alerts & Reminders |
| UI | XML Views + Bootstrap | Responsive ERP Interface |

---

## Module Structure

```
assetflow/
├── __init__.py
├── __manifest__.py
├── controllers/
│   ├── __init__.py
│   └── controllers.py
├── models/
│   ├── asset.py
│   ├── department.py
│   ├── employee.py
│   ├── category.py
│   ├── allocation.py
│   ├── booking.py
│   ├── maintenance.py
│   ├── audit.py
│   ├── notification.py
│   └── dashboard.py
├── security/
│   ├── ir.model.access.csv
│   └── security.xml
├── views/
│   ├── asset_views.xml
│   ├── department_views.xml
│   ├── employee_views.xml
│   ├── category_views.xml
│   ├── allocation_views.xml
│   ├── booking_views.xml
│   ├── maintenance_views.xml
│   ├── audit_views.xml
│   ├── dashboard_views.xml
│   ├── report_views.xml
│   └── menu.xml
├── wizard/
│   ├── transfer_wizard.py
│   ├── maintenance_wizard.py
│   └── audit_wizard.py
├── reports/
│   ├── asset_report.xml
│   ├── maintenance_report.xml
│   └── audit_report.xml
├── data/
│   ├── sequence.xml
│   ├── cron.xml
│   └── demo.xml
├── static/
│   └── description/
└── README.md
```

---

## System Boundaries

| Module | Responsibility |
|---------|----------------|
| `models/` | Business logic and database models |
| `views/` | Forms, Lists, Kanban, Calendar and Dashboard UI |
| `controllers/` | HTTP endpoints (if required) |
| `security/` | Roles, ACLs and Record Rules |
| `wizard/` | Multi-step workflows and approval dialogs |
| `reports/` | PDF and printable reports |
| `data/` | Sequences, Scheduled Actions and Demo Data |

---

## Data Flow

### Asset Registration

```
Asset Manager
      ↓
Register Asset
      ↓
Generate Asset Tag
      ↓
Store in Database
      ↓
Status = Available
```

---

### Asset Allocation

```
Employee Request
      ↓
Asset Allocation
      ↓
Availability Validation
      ↓
Allocate Asset
      ↓
Update Status
      ↓
Allocation History
```

---

### Asset Transfer

```
Transfer Request
      ↓
Manager Approval
      ↓
Reallocate Asset
      ↓
Update History
      ↓
Notification
```

---

### Resource Booking

```
Select Resource
      ↓
Choose Time Slot
      ↓
Overlap Validation
      ↓
Booking Confirmation
      ↓
Reminder Notification
```

---

### Maintenance Workflow

```
Raise Request
      ↓
Manager Approval
      ↓
Technician Assigned
      ↓
Repair
      ↓
Asset Available
```

---

### Audit Workflow

```
Create Audit Cycle
      ↓
Assign Auditor
      ↓
Verify Assets
      ↓
Discrepancy Report
      ↓
Close Audit
```

---

## Database Models

### asset.department

Stores:

- Department Name
- Department Head
- Parent Department
- Status

---

### asset.category

Stores:

- Category Name
- Description
- Category-specific Fields

---

### asset.employee

Stores:

- Employee Name
- Email
- Department
- Role
- Status

---

### asset.asset

Stores:

- Asset Tag
- Asset Name
- Category
- Serial Number
- Acquisition Date
- Acquisition Cost
- Condition
- Location
- Current Holder
- Lifecycle Status
- Shared Resource Flag

---

### asset.allocation

Stores:

- Asset
- Employee
- Department
- Allocation Date
- Expected Return Date
- Return Date
- Status
- Transfer History

---

### asset.booking

Stores:

- Resource
- Employee
- Start Time
- End Time
- Booking Status

---

### asset.maintenance

Stores:

- Asset
- Issue Description
- Priority
- Approval Status
- Technician
- Resolution Notes
- Completion Date

---

### asset.audit

Stores:

- Audit Cycle
- Auditor
- Scope
- Asset Verification
- Discrepancy Report
- Status

---

### asset.notification

Stores:

- User
- Notification Type
- Message
- Status
- Created Date

---

## User Roles

### Administrator

Permissions:

- Full System Access
- Manage Departments
- Manage Categories
- Manage Employees
- Assign Roles
- Create Audit Cycles
- View Reports

---

### Asset Manager

Permissions:

- Register Assets
- Allocate Assets
- Approve Transfers
- Approve Maintenance
- Approve Returns
- View Reports

---

### Department Head

Permissions:

- View Department Assets
- Approve Department Transfers
- Book Shared Resources

---

### Employee

Permissions:

- View Assigned Assets
- Book Resources
- Raise Maintenance Requests
- Request Transfers
- Request Returns

---

## Scheduled Jobs

Automatic Scheduled Actions:

- Overdue Return Detection
- Maintenance Reminder Notifications
- Upcoming Booking Reminders
- Asset Audit Notifications
- Dashboard KPI Refresh

---

## Business Rules

- Every Asset Tag is automatically generated.
- Asset Tags are unique.
- Assets cannot be allocated twice simultaneously.
- Transfer Requests require approval.
- Booking time slots cannot overlap.
- Maintenance must be approved before work begins.
- Assets under maintenance cannot be allocated.
- Closed Audit Cycles cannot be modified.
- Every asset maintains complete allocation, maintenance, and audit history.
- Every important action generates an activity log.

---

## Security

- Authentication through Odoo Users.
- Role-Based Access Control using ACLs.
- Record Rules restrict users to authorized records.
- Only Administrators assign management roles.
- All critical operations require appropriate permissions.

---

## Reporting

Available Reports:

- Asset Inventory Report
- Asset Allocation Report
- Maintenance Report
- Audit Report
- Department Utilization Report
- Resource Booking Report
- Asset Lifecycle Report

---

## Invariants

The application must always satisfy the following rules:

- Asset Tags are always unique.
- Assets cannot exist without a category.
- Assets cannot be allocated if already allocated.
- Booking conflicts are never allowed.
- Maintenance approval is mandatory before repairs begin.
- Asset status automatically updates throughout its lifecycle.
- Audit history cannot be deleted after completion.
- All user actions are recorded in activity logs.
- Dashboard KPIs always reflect current operational data.
- Role permissions are enforced through Odoo ACLs and Record Rules.