# UI Tokens

Design tokens for AssetFlow. These tokens define the visual language of the application and should be used consistently throughout the project. Never hardcode colors, spacing, or typography values inside components.

---

# Design Philosophy

AssetFlow is an enterprise ERP application.

The UI should be:

- Clean
- Professional
- Minimal
- Data-focused
- Consistent
- Accessible

Visual design should prioritize usability over decoration.

---

# Color Palette

## Primary

```
Primary: #2563EB
Primary Hover: #1D4ED8
Primary Light: #DBEAFE
Primary Foreground: #FFFFFF
```

Usage

- Primary Buttons
- Active Navigation
- Links
- Selected Items

---

## Success

```
Success: #16A34A
Success Light: #DCFCE7
Success Foreground: #166534
```

Usage

- Available Assets
- Completed Actions
- Success Notifications

---

## Warning

```
Warning: #F59E0B
Warning Light: #FEF3C7
Warning Foreground: #92400E
```

Usage

- Pending Approvals
- Upcoming Returns
- Maintenance Due

---

## Danger

```
Danger: #DC2626
Danger Light: #FEE2E2
Danger Foreground: #991B1B
```

Usage

- Delete
- Rejected
- Failed Operations
- Lost Assets

---

## Info

```
Info: #0EA5E9
Info Light: #E0F2FE
Info Foreground: #075985
```

Usage

- Notifications
- Bookings
- Information Messages

---

# Neutral Colors

## Background

```
Page Background: #F8FAFC
Card Background: #FFFFFF
Secondary Surface: #F1F5F9
```

---

## Borders

```
Border: #E2E8F0
Border Light: #F1F5F9
```

---

## Typography Colors

```
Primary Text: #0F172A

Secondary Text: #475569

Muted Text: #94A3B8

Disabled Text: #CBD5E1
```

---

# Typography

## Font

```
Inter
```

Used throughout the application.

---

## Sizes

### Page Title

```
32px

Bold
```

---

### Section Title

```
24px

Semi Bold
```

---

### Card Title

```
18px

Semi Bold
```

---

### Body

```
14px

Regular
```

---

### Caption

```
12px

Regular
```

---

### KPI Number

```
36px

Bold
```

---

# Border Radius

```
Small: 4px

Medium: 8px

Large: 12px

Extra Large: 16px

Rounded: 9999px
```

---

# Shadows

## Card

```
0 2px 8px rgba(0,0,0,0.08)
```

---

## Hover

```
0 6px 18px rgba(0,0,0,0.12)
```

---

# Spacing

```
4px

8px

12px

16px

20px

24px

32px

40px

48px
```

Usage

- Forms
- Cards
- Tables
- Dashboard
- Dialogs

---

# Buttons

## Primary

```
Background: Primary

Text: White

Radius: Medium

Padding: 12px 20px
```

---

## Secondary

```
Background: White

Border: Default Border

Text: Primary Text
```

---

## Danger

```
Background: Danger

Text: White
```

---

# Cards

```
Background: White

Radius: Large

Border: Default Border

Padding: 24px

Shadow: Card Shadow
```

---

# Forms

## Input

```
Background: White

Border: Default Border

Radius: Medium

Padding: 12px

Text: Primary Text
```

---

## Focus

```
Border: Primary

Outline: Primary Light
```

---

# Tables

## Header

```
Background: Secondary Surface

Text: Secondary Text

Bold
```

---

## Row

```
Background: White

Border Bottom: Default Border
```

---

## Hover

```
Background: #F8FAFC
```

---

# Status Colors

## Asset Status

| Status | Color |
|---------|-------|
| Available | Success |
| Allocated | Primary |
| Reserved | Info |
| Under Maintenance | Warning |
| Lost | Danger |
| Retired | Secondary |
| Disposed | Muted |

---

## Booking Status

| Status | Color |
|---------|-------|
| Pending | Warning |
| Approved | Success |
| Cancelled | Danger |
| Completed | Primary |

---

## Maintenance Status

| Status | Color |
|---------|-------|
| Pending | Warning |
| Approved | Primary |
| Assigned | Info |
| In Progress | Primary |
| Resolved | Success |

---

## Audit Status

| Status | Color |
|---------|-------|
| Draft | Secondary |
| Ongoing | Primary |
| Completed | Success |
| Closed | Muted |

---

# Icons

Use Odoo's built-in icon library.

Icons should represent

- Assets
- Departments
- Employees
- Resources
- Maintenance
- Reports
- Audits
- Settings

Avoid decorative icons.

---

# Dashboard Components

## KPI Cards

```
White Background

Large KPI Number

Small Label

Status Indicator

Optional Trend Badge
```

---

## Charts

Supported

- Bar
- Line
- Pie

Use consistent colors.

---

## Activity Timeline

Display

- Icon
- Title
- Timestamp

Newest activity first.

---

# Notifications

## Success

```
Green
```

## Warning

```
Orange
```

## Error

```
Red
```

## Information

```
Blue
```

---

# Empty State

Contains

- Icon
- Title
- Description
- Primary Action Button

---

# Loading State

Use

- Skeleton Cards
- Skeleton Tables
- Loading Spinner

---

# Responsive Breakpoints

```
Desktop

≥1200px

Tablet

768–1199px

Mobile

<768px
```

---

# Component Tokens

## Asset Card

```
White Card

Large Radius

Asset Name

Asset Tag

Status Badge

Assigned User

Category
```

---

## Booking Card

```
Resource

Time

Booked By

Status
```

---

## Dashboard Card

```
KPI Number

Subtitle

Icon

Trend Badge
```

---

# Accessibility

Always maintain

- High color contrast
- Keyboard accessibility
- Visible focus states
- Readable typography
- Consistent spacing

---

# Invariants

- Never hardcode colors inside components.
- Always use the project token palette.
- Use Inter as the application font.
- Keep spacing consistent.
- Use the same status color for the same status everywhere.
- Never use gradients for business components.
- Do not introduce new colors without updating this file.
- Dashboard KPI cards must always follow the same layout.
- Buttons, forms, tables, and dialogs must remain visually consistent across every module.