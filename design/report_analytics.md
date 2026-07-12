```markdown
# AssetSync Enterprise Dashboard - Reports & Analytics Page Design Specification

This document details the design specifications for the 'Reports & Analytics' page within the AssetSync enterprise dashboard, based on the provided screenshot.

## 1. Page Layout Structure

The page uses a two-column layout: a fixed-width left sidebar and a main content area.
-   **Header:** A top bar spans the entire width, containing the global search, notifications, and user profile.
-   **Sidebar:** Left-aligned, fixed-width navigation menu.
-   **Main Content Area:** Occupies the remaining width, displaying the core content of the 'Reports & Analytics' page.
-   **Right Drawer/Modal:** A temporary overlay panel appears from the right, covering part of the main content area for "Export Configuration."

## 2. Sidebar

The sidebar has a dark background (`#282C34` or similar dark slate) with light text and icons.
-   **Branding:** "AssetSync" in a large, bold font, followed by "ENTERPRISE RESOURCE PLANNING" in smaller, uppercase text.
-   **Navigation Links:**
    -   `Dashboard` (Icon: Lucide/Heroicons `LayoutDashboard` or `Home`)
    -   `Assets` (Icon: Lucide/Heroicons `Building` or `Asset`)
    -   `Resource Booking` (Icon: Lucide/Heroicons `Calendar` or `BookOpen`)
    -   `Maintenance` (Icon: Lucide/Heroicons `Wrench` or `Settings`)
    -   `Audits` (Icon: Lucide/Heroicons `ClipboardList` or `CheckCircle`)
    -   **`Reports & Analytics` (Active State)** (Icon: Lucide/Heroicons `ChartBar` or `BarChart2`) - Highlighted with a background color (`#343A40` or similar dark slate, slightly lighter than sidebar background) and a left border (`#3B82F6` blue). Text color is white.
    -   `AI Assistant` (Icon: Lucide/Heroicons `Bot` or `Sparkles`)
    -   `Settings` (Icon: Lucide/Heroicons `Settings`)
-   **User Profile Section (Bottom):**
    -   Circular avatar with initials "AS" in white text on a blue background (`#3B82F6`).
    -   Text: "Admin User" (bold, white text)
    -   Text: "ENTERPRISE PLAN" (smaller, lighter gray text)

## 3. Page Header

The top bar is white with a light gray border at the bottom.
-   **Search Bar:**
    -   Placeholder: "Search analytics data..."
    -   Icon: Lucide/Heroicons `Search`
    -   Styling: Rounded corners, light gray background (`#F0F2F5`), dark gray text.
-   **Right-aligned Icons:**
    -   Notification Bell (Icon: Lucide/Heroicons `Bell`)
    -   Lightning Bolt (Icon: Lucide/Heroicons `Zap`)
    -   User Profile Icon (Icon: Lucide/Heroicons `UserCircle` or `User`) with a dropdown arrow (Icon: Lucide/Heroicons `ChevronDown`).

## 4. Main Content Sections

The main content area is white/light gray background.

### Header Section
-   **Title:** "Reports & Analytics" (large, bold, dark gray text)
-   **Subtitle:** "Operational insights and fiscal performance monitoring across all facilities." (medium, dark gray text)
-   **Date Range Selector (Segmented Control):**
    -   Buttons: `Monthly`, `Quarterly` (active, blue border, blue text), `Yearly`
    -   Styling: Rounded corners, light gray background, dark gray text for inactive, blue text for active.
-   **Export PDF Button:**
    -   Icon: Lucide/Heroicons `Download`
    -   Text: "Export PDF"
    -   Styling: White background, gray border, dark gray text.
-   **Share Report Button:**
    -   Icon: Lucide/Heroicons `Share2` or `Share`
    -   Text: "Share Report"
    -   Styling: Blue background (`#3B82F6`), white text, rounded corners.

### KPI Cards (Row of 4 cards)

Each card has a white background, rounded corners, light gray border, and subtle shadow.
1.  **TOTAL ASSET VALUE**
    -   Icon: Lucide/Heroicons `Wallet` or `CreditCard` (in a small blue square)
    -   Value: **$12.4M** (large, bold, dark gray text)
    -   Trend: `+4.2% from last quarter` (small, green text) with a small upward trend line icon (Lucide/Heroicons `TrendingUp`).
2.  **MAINTENANCE ROI**
    -   Icon: Lucide/Heroicons `CheckCircle` (in a small blue circle)
    -   Value: **84.2%** (large, bold, dark gray text)
    -   Trend: `+1.5% optimized` (small, green text) with a small upward trend line icon (Lucide/Heroicons `TrendingUp`).
3.  **PENDING AUDITS**
    -   Icon: Lucide/Heroicons `AlertCircle` or `BellRing` (in a small red circle)
    -   Value: **12** (large, bold, dark gray text)
    -   Alert: `3 critical items overdue` (small, red text) with a small upward triangle icon (Lucide/Heroicons `TriangleAlert`).
4.  **ACTIVE BOOKINGS**
    -   Icon: Lucide/Heroicons `Calendar` or `BookOpen` (in a small gray square)
    -   Value: **1,452** (large, bold, dark gray text)
    -   Trend: `+18% higher demand` (small, blue text) with a small upward trend line icon (Lucide/Heroicons `TrendingUp`).

### Asset Utilization Rate (Card)

-   **Title:** "Asset Utilization Rate" (bold, dark gray text)
-   **Subtitle:** "Efficiency tracking across primary resource categories" (gray text)
-   **Options Icon:** Lucide/Heroicons `MoreVertical` or `EllipsisVertical`
-   **Content:** This section appears to be a placeholder for a chart or detailed breakdown. It contains a row of category labels at the bottom:
    -   `Heavy Mach.`
    -   `Fleet`
    -   `IT Assets`
    -   `Facilities`
    -   `Lab Equip.`
    -   `Modular Units`
-   Styling: White background, rounded corners, light gray border.

### Maintenance Cost (Card)

-   **Title:** "Maintenance Cost" (bold, dark gray text)
-   **Toggle/Badge:** `VS BUDGET` (small, gray background, dark gray text, rounded corners)
-   **Content:** List of cost categories with progress bars and values.
    -   `Preventive`
        -   Progress Bar: Blue (`#3B82F6`)
        -   Value: `$42.3k`
    -   `Corrective (Urgent)`
        -   Progress Bar: Red (`#EF4444`)
        -   Value: `$18.9k`
    -   `Upgrades`
        -   Progress Bar: Gray (`#E5E7EB`)
        -   Value: `$12.1k`
    -   `Replacement`
        -   Progress Bar: Dark Gray (`#374151`)
        -   Value: `$204.5k`
    -   `Cumulative Savings`
        -   Value: `+$14,200` (green text)
-   Styling: White background, rounded corners, light gray border.

### Booking Trends (Card)

-   **Title:** "Booking Trends" (bold, dark gray text)
-   **Subtitle:** "Daily reservation volume over last 30 days" (gray text)
-   **Dropdown:** `All Sites` (white background, gray border, dark gray text, rounded corners, Lucide/Heroicons `ChevronDown` icon)
-   **Chart:** Bar chart.
    -   Type: Vertical Bar Chart.
    -   Data: Represents daily reservation volume over the last 30 days. The height of bars varies, indicating different volumes.
    -   Colors: Light blue bars (`#D1E0FF` or similar), with some bars highlighted in a darker blue (`#A0C4FF` or similar).
    -   Axes: Implicit, no visible labels.
-   Styling: White background, rounded corners, light gray border.

### Department Comparison (Card)

-   **Title:** "Department Comparison" (bold, dark gray text)
-   **Badge:** `Q3 PERFORMANCE` (small, gray background, dark gray text, rounded corners)
-   **Table:**
    -   **Columns:** `Department`, `Usage`, `Incidents`, `Efficiency`
    -   **Sample Rows:**
        -   `Logistics & Supply` | `8,240 hrs` | `12` (red badge) | `78%` (red text, Lucide/Heroicons `TrendingDown` icon)
        -   `Production Wing B` | `14,102 hrs` | `2` (gray badge) | `94%` (green text, Lucide/Heroicons `TrendingUp` icon)
        -   `IT Infrastructure` | `3,120 hrs` | `0` (gray badge) | `99%` (green text, Lucide/Heroicons `TrendingUp` icon)
        -   `R&D Labs` | `6,441 hrs` | `5` (gray badge) | `82%` (green text, Lucide/Heroicons `TrendingUp` icon)
    -   **Badge Styling:** Small oval badges with text. Red badge for `12` (`#EF4444` background, white text). Gray badges for `2`, `0`, `5` (`#E5E7EB` background, dark gray text).
    -   **Efficiency Icons:** `TrendingDown` (red) and `TrendingUp` (green).
    -   Styling: White background, rounded corners, light gray border.

### AI Recommendation Engine (Floating Card/Banner)

-   **Placement:** Fixed at the bottom of the main content area, slightly overlapping content.
-   **Icon:** Large blue square with a robot head icon (Lucide/Heroicons `Robot` or `Sparkles`).
-   **Title:** "AI Recommendation Engine" (bold, white text)
-   **Description:** "Based on current trends, upgrading Fleet Maintenance protocols could save $24k next quarter." (light gray text)
-   **Buttons (Right-aligned):**
    -   `Dismiss` (dark gray background, white text, rounded corners)
    -   `Run Simulation` (blue background (`#3B82F6`), white text, rounded corners)
-   Styling: Dark blue background (`#1F2937` or similar dark slate), rounded corners, subtle shadow.

## 5. Right Drawer / Export Configuration Modal

This drawer slides in from the right, overlaying part of the main content.
-   **Title:** "Export Configuration" (bold, dark gray text)
-   **Close Button:** Lucide/Heroicons `X` (top right corner).
-   **File Format Section:**
    -   **Label:** "File Format"
    -   **Buttons (Segmented Control):**
        -   `Adobe PDF` (Icon: Lucide/Heroicons `FileText` or `FilePdf`) - Active state: Blue border (`#3B82F6`), blue text, white background.
        -   `Excel (XLSX)` (Icon: Lucide/Heroicons `Table` or `FileExcel`) - Inactive state: Gray border, dark gray text, white background.
    -   Styling: White background, rounded corners.
-   **Include Sections Section:**
    -   **Label:** "Include Sections"
    -   **Checkboxes:**
        -   `Asset Utilization Breakdown` (Checked)
        -   `Maintenance Cost & Overruns` (Checked)
        -   `Raw Data Appendices` (Unchecked)
    -   Styling: Standard checkbox styling.
-   **Generate & Download Button:**
    -   Text: "Generate & Download"
    -   Styling: Blue background (`#3B82F6`), white text, full width, rounded corners.
-   Styling: White background for the drawer.

## 6. Design Tokens (Summary)

-   **Colors:**
    -   Primary Blue: `#3B82F6` (buttons, active states, active sidebar link, links)
    -   Dark Slate/Black Text: `#1F2937` (titles, main text)
    -   Light Gray Text: `#6B7280` (subtitles, secondary text)
    -   Green (Success/Positive Trend): `#10B981` (e.g., `+4.2%`)
    -   Red (Warning/Negative Trend): `#EF4444` (e.g., `3 critical items overdue`, `78%`)
    -   White: `#FFFFFF` (backgrounds, button text)
    -   Light Gray Backgrounds: `#F0F2F5`, `#E5E7EB` (search bar, inactive buttons, some badges)
    -   Sidebar Background: `#282C34` (dark slate)
    -   Active Sidebar Background: `#343A40` (slightly lighter dark slate)
    -   Dark Blue (AI Engine Banner): `#1F2937`
-   **Borders:** Subtle light gray borders (`#E5E7EB`) for cards and input fields. Blue border for active elements.
-   **Rounded Corners:** Consistent `8px` or `12px` border-radius used across cards, buttons, input fields, and the AI Engine banner.
-   **Spacing:** Consistent use of `16px` to `24px` padding and margins between elements and sections.
-   **Interactive States:** Hover effects are implied for buttons and navigation links (e.g., slight background change, text color change). Active states are clearly defined (e.g., blue highlight).

This detailed specification should allow for pixel-perfect recreation of the 'Reports & Analytics' page.
```