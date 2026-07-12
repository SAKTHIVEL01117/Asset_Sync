```markdown
# AssetSync Enterprise Dashboard - Dashboard Page Design Specification

## 1. Page Layout Structure

The page has a three-column layout:
*   **Left Sidebar:** Dark gray background, fixed width. Contains application branding and primary navigation links.
*   **Main Content Area:** White background, occupies the majority of the screen width. Divided into a header section and a grid-based content area.
*   **Right Drawer/Sidebar:** White background, appears as an overlay on top of the main content. Contains "Asset Details" information.

**Header (Top Bar):**
*   **Left:** Application branding "AssetSync" and "Enterprise Resource Planning" subtitle.
*   **Center:** Global search bar.
*   **Right:** Notification icons, user profile section.

## 2. Sidebar

**Background:** Dark slate gray (`#212121` or similar dark gray).
**Text Color (Inactive):** Light gray (`#A0A0A0` or similar).
**Text Color (Active):** White (`#FFFFFF`).
**Active Item Background:** Dark blue (`#0D6EFD` or similar primary blue).
**Active Item Border Radius:** Rounded corners on the right side.

**Navigation Links:**

*   **AssetSync** (Branding)
    *   *Subtitle:* Enterprise Resource Planning (Smaller font size, light gray)

*   **Dashboard**
    *   **Icon:** Lucide/Heroicons "LayoutDashboard" (or similar grid icon)
    *   **Text:** Dashboard
    *   **State:** Active (Dark blue background, white text, rounded right corners)

*   **Assets**
    *   **Icon:** Lucide/Heroicons "HardDrive" (or similar asset icon)
    *   **Text:** Assets
    *   **State:** Inactive

*   **Resource Booking**
    *   **Icon:** Lucide/Heroicons "Calendar" (or similar calendar icon)
    *   **Text:** Resource Booking
    *   **State:** Inactive

*   **Maintenance**
    *   **Icon:** Lucide/Heroicons "Wrench" (or similar wrench icon)
    *   **Text:** Maintenance
    *   **State:** Inactive

*   **Audits**
    *   **Icon:** Lucide/Heroicons "ClipboardCheck" (or similar clipboard with checkmark icon)
    *   **Text:** Audits
    *   **State:** Inactive

*   **Reports & Analytics**
    *   **Icon:** Lucide/Heroicons "BarChart2" (or similar bar chart icon)
    *   **Text:** Reports & Analytics
    *   **State:** Inactive

*   **AI Assistant**
    *   **Icon:** Lucide/Heroicons "Bot" (or similar bot/AI icon)
    *   **Text:** AI Assistant
    *   **State:** Inactive

*   **Settings** (Bottom of sidebar)
    *   **Icon:** Lucide/Heroicons "Settings" (or similar gear icon)
    *   **Text:** Settings
    *   **State:** Inactive

## 3. Page Header

**Top Bar:** White background.
**Global Search Bar:**
*   **Icon:** Lucide/Heroicons "Search"
*   **Placeholder:** "Search assets, maintenance records..."
*   **Style:** Rounded corners, light gray border, white background.

**Right-aligned Icons and User Profile:**
*   **Notifications Icon:** Lucide/Heroicons "Bell"
*   **Lightning/Activity Icon:** Lucide/Heroicons "Zap" (or similar lightning bolt icon)
*   **User Profile:**
    *   **Name:** Alex Rivera
    *   **Role:** Fleet Manager
    *   **Icon:** Lucide/Heroicons "UserCircle" (or similar circular user icon)

**Main Page Header (Below Top Bar):**
*   **Title:** Executive Overview (Large, bold, dark gray text)
*   **Subtitle:** Real-time operational status for Q3 FY24 (Smaller, light gray text)
*   **Action Buttons:**
    *   **Register Asset:**
        *   **Icon:** Lucide/Heroicons "Plus"
        *   **Text:** Register Asset
        *   **Style:** Primary blue button (e.g., `#0D6EFD`), white text, rounded corners.
    *   **Book Resource:**
        *   **Icon:** Lucide/Heroicons "Book"
        *   **Text:** Book Resource
        *   **Style:** White background, light gray border, dark gray text, rounded corners.
    *   **Schedule Maintenance:**
        *   **Icon:** Lucide/Heroicons "CalendarClock" (or similar calendar with clock icon)
        *   **Text:** Schedule Maintenance
        *   **Style:** White background, light gray border, dark gray text, rounded corners.
    *   **Start Audit:**
        *   **Icon:** Lucide/Heroicons "FileText" (or similar document icon)
        *   **Text:** Start Audit
        *   **Style:** White background, light gray border, dark gray text, rounded corners.

## 4. Main Content Sections

The main content area is structured into various cards, primarily laid out in a grid.
**Card Style:** White background, subtle gray border, rounded corners, consistent padding.

### Row 1: KPI Cards

Four equal-width cards displaying key metrics.

1.  **TOTAL ASSETS**
    *   **Value:** 12,842 (Large, bold, dark gray text)
    *   **Change Indicator:** +4.2% from last month (Green text, small upward trend icon)

2.  **AVAILABLE ASSETS**
    *   **Value:** 8,110 (Large, bold, dark gray text)
    *   **Progress Bar:** Blue filled progress bar.
    *   **Metric:** 63.1% Utilization capacity (Dark gray text)

3.  **ALLOCATED ASSETS**
    *   **Value:** 4,215 (Large, bold, dark gray text)
    *   **Link:** Assigned to 14 departments (Blue text, small people/group icon)

4.  **UNDER MAINTENANCE**
    *   **Value:** 517 (Large, bold, red text)
    *   **Alert:** ▲ 12 Critical alerts (Red text, small triangle/alert icon)

### Row 2: Charts

Two cards, one larger line chart, one smaller donut chart.

1.  **Asset Utilization Trend** (Left, larger card)
    *   **Title:** Asset Utilization Trend
    *   **Timeframe Selector:** "Last 30 Days" (Dropdown with down arrow icon)
    *   **Chart Type:** Area chart (Light gray shaded area).
    *   **X-axis Labels:** 01 JUL, 07 JUL, 14 JUL, 21 JUL, 28 JUL, 31 JUL
    *   **Y-axis:** Implicit, no visible labels.
    *   **Colors:** Light gray for the area fill.

2.  **Department Distribution** (Right, smaller card)
    *   **Title:** Department Distribution
    *   **Chart Type:** Donut chart
    *   **Center Value:** 14 UNITS (Large, bold "14", smaller "UNITS")
    *   **Colors:** Different shades of blue for segments.
    *   **Legend:**
        *   Logistics (45%) - Dark Blue
        *   Operations (30%) - Medium Blue
        *   Field (15%) - Dark Gray/Slate Blue
        *   Other (10%) - Light Gray/Blue

### Row 3: Activity & Maintenance Cards

Three cards in a row.

1.  **Monthly Maintenance** (Left card)
    *   **Title:** Monthly Maintenance
    *   **Chart Type:** Bar chart (Vertical bars)
    *   **X-axis Labels:** MAR, APR, MAY, JUN, JUL
    *   **Colors:** Light gray for inactive bars, primary blue for "JUL" (active/current month).

2.  **Upcoming** (Middle card)
    *   **Title:** Upcoming
    *   **Badge:** "3 Today" (Blue background, white text, rounded corners)
    *   **List Item 1:**
        *   **Icon:** Lucide/Heroicons "Wrench" (or similar wrench icon)
        *   **Title:** HVAC System Gen-4
        *   **Details:** Schedule: 14:00 • Tech: J. Doe
    *   **List Item 2:**
        *   **Icon:** Lucide/Heroicons "Car" (or similar car/van icon)
        *   **Title:** Fleet Van #202 Booking
        *   **Details:** Pickup: 16:30 • User: R. Chen

3.  **Recent Activity** (Right card)
    *   **Title:** Recent Activity
    *   **Timeline/List:**
        *   **Item 1 (Asset Registered):**
            *   **Icon:** Blue circle
            *   **Title:** Asset Registered
            *   **Description:** New MacBook Pro 16" added to Inventory
            *   **Timestamp:** 12 MINUTES AGO
        *   **Item 2 (Audit Completed):**
            *   **Icon:** Gray circle
            *   **Title:** Audit Completed
            *   **Description:** Safety equipment audit for Warehouse B passed
            *   **Timestamp:** 2 HOURS AGO
        *   **Item 3 (Maintenance Flagged):**
            *   **Icon:** Gray circle
            *   **Title:** Maintenance Flagged
            *   **Description:** Critical alert: Forklift #14 battery health low
            *   **Timestamp:** 4 HOURS AGO

## 5. Right Drawer: Asset Details

**Overlay/Drawer:** White background, fixed width, slides in from the right.
**Close Button:** "X" icon in the top right corner.
**Title:** Asset Details (Bold, dark gray text)

### Section 1: Asset Header

*   **Icon:** Lucide/Heroicons "Clipboard" (or similar document icon) inside a light gray circle.
*   **Asset Name:** Industrial Chiller unit-09 (Bold, dark gray text)
*   **SKU:** SKU: IND-CH-9920 (Smaller, light gray text)
*   **Status Badge:** ACTIVE (Green background, white text, uppercase)

### Section 2: Properties

**Header:** PROPERTIES (Uppercase, light gray text)
**Grid of Key-Value Pairs:**

*   **LOCATION**
    *   Chicago North, Zone A
*   **PURCHASE DATE**
    *   Jan 12, 2023
*   **INITIAL VALUE**
    *   $142,500.00
*   **WARRANTY EXP.**
    *   Jan 12, 2026

### Section 3: Maintenance Logs

**Header:** MAINTENANCE LOGS (Uppercase, light gray text)
**List of Maintenance Entries:**
*   **Entry 1:**
    *   **Title:** Routine Filter Replacement (Bold, dark gray text)
    *   **Details:** Completed on July 10, 2024 (Smaller, light gray text)
*   **Entry 2:**
    *   **Title:** Compressor Inspection (Bold, dark gray text)
    *   **Details:** Completed on May 14, 2024 (Smaller, light gray text)

### Section 4: Action Buttons

*   **Save Changes:**
    *   **Style:** Primary blue button (e.g., `#0D6EFD`), white text, rounded corners.
    *   **Text:** Save Changes
*   **Archive:**
    *   **Style:** White background, light gray border, dark gray text, rounded corners.
    *   **Text:** Archive

## 6. Design Tokens (Summary)

*   **Primary Brand Color:** Blue (e.g., `#0D6EFD` for active states, buttons, progress bars).
*   **Accent Color (Success/Positive):** Green (for "+4.2%" and "ACTIVE" badge).
*   **Accent Color (Warning/Alert):** Red (for "517" and "12 Critical alerts").
*   **Text Colors:**
    *   Dark Gray (`#333333` or similar) for main titles, values, and bold text.
    *   Medium Gray (`#666666` or similar) for subtitles, descriptions, and regular text.
    *   Light Gray (`#A0A0A0` or similar) for placeholders, inactive text, timestamps, and section headers.
    *   White (`#FFFFFF`) for text on dark backgrounds (sidebar active, primary buttons).
*   **Background Colors:**
    *   White (`#FFFFFF`) for main content and drawer.
    *   Dark Slate Gray (`#212121` or similar) for sidebar.
*   **Borders:** Light gray (`#E0E0E0` or similar) for cards, input fields, and inactive buttons.
*   **Rounded Corners:** Consistent `8px` or `10px` border-radius on cards, buttons, search bar, and sidebar active item.
*   **Spacing:** Consistent use of `16px`, `24px`, `32px` for padding and margins.
*   **Interactive States:**
    *   Hover on buttons: Slightly darker blue/gray background or border.
    *   Hover on links: Underline or color change.
    *   Active navigation item: Distinct background color and text color.

## 7. Charts

*   **Asset Utilization Trend:**
    *   Type: Area Chart.
    *   Dataset: Implicit utilization over time.
    *   X-axis: Dates (01 JUL - 31 JUL).
    *   Y-axis: Utilization percentage (not labeled explicitly, but implied by the trend).
    *   Color: Light gray fill.
*   **Department Distribution:**
    *   Type: Donut Chart.
    *   Dataset: Distribution of units across departments.
    *   Segments and Colors:
        *   Logistics (45%) - Dark Blue
        *   Operations (30%) - Medium Blue
        *   Field (15%) - Dark Gray/Slate Blue
        *   Other (10%) - Light Gray/Blue
    *   Center Label: "14 UNITS".
*   **Monthly Maintenance:**
    *   Type: Bar Chart (Vertical).
    *   Dataset: Maintenance count per month.
    *   X-axis: Months (MAR, APR, MAY, JUN, JUL).
    *   Y-axis: Count (implicit, not labeled).
    *   Colors: Light gray for past months, primary blue for current month (JUL).

## 8. Tables

No explicit tables are visible on the dashboard, but the "Recent Activity" and "Maintenance Logs" sections function as structured lists.

## 9. Modals/Drawers

**Asset Details Drawer:**
*   **Visibility:** Visible, slides from the right.
*   **Elements:**
    *   Close button (`X`).
    *   Header: "Asset Details".
    *   Asset Identifier section (Icon, Name, SKU, Status badge).
    *   "PROPERTIES" section (Key-value pairs for Location, Purchase Date, Initial Value, Warranty Exp.).
    *   "MAINTENANCE LOGS" section (List of maintenance entries with title and completion date).
    *   Action buttons: "Save Changes" (primary blue) and "Archive" (secondary/outline).