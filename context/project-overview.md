# Project Overview

## About the Project

AssetFlow is a full-stack Enterprise Asset & Resource Management System designed to simplify how organizations track, allocate, maintain, and audit their physical assets and shared resources. The platform provides a centralized ERP solution where administrators, asset managers, department heads, and employees can efficiently manage assets throughout their complete lifecycle.

The system digitizes asset registration, allocation, transfers, resource booking, maintenance workflows, audit cycles, notifications, and operational analytics while enforcing business rules such as preventing double allocation, validating booking conflicts, and role-based approvals.

---

## The Problem It Solves

Many organizations still manage assets using spreadsheets, paper records, or disconnected systems, making it difficult to know where assets are, who is using them, when maintenance is required, and whether resources are being utilized efficiently.

AssetFlow solves these challenges by providing a centralized ERP platform that enables organizations to register assets, allocate them without conflicts, manage maintenance approvals, schedule shared resources, perform structured audits, and monitor operations through dashboards and reports.

---

## Pages

```
/                       → Homepage
/login                  → Login & Authentication
/dashboard              → Dashboard & KPI Overview
/organization           → Departments, Categories & Employee Directory
/assets                 → Asset Directory
/assets/[id]            → Asset Details & History
/allocations            → Asset Allocation & Transfers
/resources              → Resource Booking
/maintenance            → Maintenance Management
/audits                 → Audit Management
/reports                → Reports & Analytics
/notifications          → Notifications & Activity Logs
/profile                → User Profile
```

---

## Navigation

Top navigation with role-based access.

```
Dashboard
Organization
Assets
Allocations
Resources
Maintenance
Audits
Reports
Notifications
Profile
```

Responsive full-width ERP layout.

---

## Core User Flow

### Homepage

- Landing page introducing AssetFlow
- Login button
- Logged-in users redirected to Dashboard

### Authentication

- Employee Signup
- Email & Password Login
- Forgot Password
- Session Validation
- New users are created only as Employees
- Admin promotes Employees to Department Head or Asset Manager

### Dashboard

Displays operational KPIs including:

- Assets Available
- Assets Allocated
- Maintenance Today
- Active Bookings
- Pending Transfers
- Upcoming Returns

Dashboard Sections:

- Quick Actions
- Recent Activities
- Overdue Returns
- Notifications
- Asset Status Overview

### Organization Setup

(Admin Only)

#### Department Management

- Create Department
- Edit Department
- Deactivate Department
- Assign Department Head
- Parent Department Hierarchy

#### Asset Category Management

- Electronics
- Furniture
- Vehicles
- Equipment
- Custom Categories

Supports category-specific fields.

#### Employee Directory

- Employee Information
- Department Assignment
- Role Assignment
- Active / Inactive Status

Only Admin can assign management roles.

### Asset Registration

Asset Managers register assets with:

- Asset Name
- Asset Tag
- Category
- Serial Number
- Acquisition Date
- Acquisition Cost
- Condition
- Location
- Documents
- Photos
- Shared Resource Flag

Asset Lifecycle States:

- Available
- Allocated
- Reserved
- Under Maintenance
- Lost
- Retired
- Disposed

Each asset maintains complete allocation, maintenance, and audit history.

### Asset Allocation

Allocate assets to employees or departments.

Business Rules:

- Prevent double allocation.
- If asset is already allocated:
    - Display current holder.
    - Allow Transfer Request.
- Optional Expected Return Date.
- Returned assets automatically become Available.
- Overdue returns are highlighted.

Transfer Workflow:

```
Requested
→ Approved
→ Reallocated
```

### Resource Booking

Book shared resources such as:

- Meeting Rooms
- Vehicles
- Equipment

Features:

- Calendar View
- Time Slot Booking
- Conflict Validation
- Cancel Booking
- Reschedule Booking
- Booking Reminder

Booking Status:

- Upcoming
- Ongoing
- Completed
- Cancelled

### Maintenance Management

Employees can report damaged assets.

Workflow:

```
Pending
→ Approved / Rejected
→ Technician Assigned
→ In Progress
→ Resolved
```

Assets automatically change to **Under Maintenance** after approval and return to **Available** after resolution.

Maintenance history is retained for every asset.

### Asset Audit

Admins manage periodic audit cycles.

Workflow:

- Create Audit Cycle
- Assign Auditors
- Verify Assets
- Mark Assets:
    - Verified
    - Missing
    - Damaged
- Generate Discrepancy Report
- Close Audit Cycle

Audit history remains permanently stored.

### Reports & Analytics

Managers can monitor:

- Asset Utilization
- Most Used Assets
- Idle Assets
- Maintenance Frequency
- Department Allocation Summary
- Resource Booking Trends
- Assets Due for Maintenance
- Assets Near Retirement

Reports can be exported.

### Notifications & Activity Logs

System notifications include:

- Asset Assigned
- Booking Confirmed
- Booking Reminder
- Transfer Approved
- Maintenance Approved
- Maintenance Rejected
- Audit Completed
- Overdue Return Alert

Every important action is recorded in the activity log.

---

## Data Architecture

### Organization Data

Stores:

- Departments
- Asset Categories
- Employees
- User Roles

### Asset Data

Stores:

- Asset Information
- Asset Status
- Allocation History
- Maintenance History
- Audit History

### Resource Booking Data

Stores:

- Resource Reservations
- Booking Schedule
- Booking Status

### Notifications & Logs

Stores:

- User Notifications
- Activity Logs
- System Alerts

---

## Features In Scope

- Homepage
- Employee Authentication
- Role-Based Access Control
- Dashboard with KPI Cards
- Department Management
- Asset Category Management
- Employee Directory
- Asset Registration
- Asset Lifecycle Management
- Asset Allocation
- Asset Transfer Workflow
- Asset Return Management
- Shared Resource Booking
- Booking Conflict Validation
- Maintenance Approval Workflow
- Audit Cycle Management
- Reports & Analytics
- Notifications
- Activity Logs
- Responsive ERP Interface

---

## Features Out of Scope

- Purchasing Module
- Procurement Management
- Accounting
- Invoicing
- Payroll
- Vendor Management
- Mobile Application
- Multi-Organization Support
- Payment Gateway
- Barcode Hardware Integration
- IoT Integration
- AI-Based Predictive Maintenance
- Third-Party ERP Integrations

---

## User Roles

### Admin

- Manage Departments
- Manage Asset Categories
- Manage Employees
- Assign Roles
- View Organization Analytics
- Create Audit Cycles

### Asset Manager

- Register Assets
- Allocate Assets
- Approve Transfers
- Approve Maintenance Requests
- Approve Asset Returns

### Department Head

- View Department Assets
- Approve Department Transfers
- Book Shared Resources

### Employee

- View Assigned Assets
- Book Shared Resources
- Raise Maintenance Requests
- Request Asset Returns
- Request Asset Transfers

---

## Target Users

Organizations managing physical assets and shared resources, including:

- Corporate Offices
- Educational Institutions
- Hospitals
- Manufacturing Industries
- Government Organizations
- Warehouses
- IT Companies
- Public Sector Enterprises

---

## Success Criteria

- Users can authenticate and access role-based modules.
- Assets are registered and tracked throughout their lifecycle.
- Double allocation is prevented automatically.
- Resource booking conflicts are detected and blocked.
- Maintenance requests follow the complete approval workflow.
- Audit cycles generate accurate discrepancy reports.
- Dashboard KPIs provide meaningful operational insights.
- Notifications and activity logs accurately record all important actions.
- The ERP interface is responsive, user-friendly, and scalable.