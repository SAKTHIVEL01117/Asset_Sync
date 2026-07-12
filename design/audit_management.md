Here's a comprehensive, detailed design specification for the 'audit_management.png' page, formatted in Markdown:

# AssetSync - Audit Management Page Design Specification

This document details the design specifications for the 'Audit Management' page within the AssetSync enterprise dashboard.

## 1. Page Layout Structure

The page uses a fixed sidebar and a main content area.

*   **Overall Layout:** Two-column layout with a left-aligned sidebar and a main content area on the right.
*   **Sidebar:** Occupies the left portion of the screen, fixed width, dark background.
*   **Main Content Area:** Occupies the majority of the screen width, light background, containing the header, main content, and a persistent right-aligned drawer.
*   **Header (Global):** A thin strip at the top of the main content area, containing a global search bar, notifications, user profile, and a primary action button.
*   **Breadcrumbs:** Not present on this specific page.

## 2. Sidebar

The sidebar is dark slate gray (`#1E293B`) with light text and icons.

*   **Logo/App Name:**
    *   **Text:** "AssetSync" (bold, large font)
    *   **Subtitle:** "ENTERPRISE RESOURCE PLANNING" (smaller, uppercase)
*   **Navigation Links:**
    *   **Dashboard:**
        *   **Icon:** `LayoutDashboard` (Lucide/Heroicons equivalent)
        *   **Text:** "Dashboard"
        *   **State:** Inactive
    *   **Assets:**
        *   **Icon:** `Boxes` (Lucide equivalent)
        *   **Text:** "Assets"
        *   **State:** Inactive
    *   **Resource Booking:**
        *   **Icon:** `CalendarDays` (Lucide equivalent)
        *   **Text:** "Resource Booking"
        *   **State:** Inactive
    *   **Maintenance:**
        *   **Icon:** `Settings` (Lucide equivalent, representing a wrench/tool)
        *   **Text:** "Maintenance"
        *   **State:** Inactive
    *   **Audits:**
        *   **Icon:** `ClipboardList` (Lucide equivalent)
        *   **Text:** "Audits"
        *   **State:** **Active** (Highlighted with a solid blue background: `#3B82F6`, and white text/icon)
    *   **Reports & Analytics:**
        *   **Icon:** `BarChart2` (Lucide equivalent)
        *   **Text:** "Reports & Analytics"
        *   **State:** Inactive
    *   **AI Assistant:**
        *   **Icon:** `Lightbulb` (Lucide equivalent)
        *   **Text:** "AI Assistant"
        *   **State:** Inactive
    *   **Settings:**
        *   **Icon:** `Settings` (Lucide equivalent)
        *   **Text:** "Settings"
        *   **State:** Inactive
*   **User Profile Section (Bottom of Sidebar):**
    *   **Avatar:** Circular image of "Alex Rivera".
    *   **Name:** "Alex Rivera" (white text, bold)
    *   **Role:** "Lead Auditor" (lighter gray text)
    *   **Background:** Rounded rectangle with light gray background (`#374151`) and slight padding.

## 3. Page Header (Main Content Area)

The header for the main content area is positioned at the top.

*   **Global Search Bar:**
    *   **Icon:** `Search` (Lucide equivalent)
    *   **Placeholder:** "Search audits, departments, or assets..."
    *   **Design:** Rounded input field with light gray background.
*   **Right-aligned Icons:**
    *   **Notifications:** `Bell` (Lucide equivalent)
    *   **Lightning Bolt:** `Zap` (Lucide equivalent)
    *   **User Icon:** `User` (Lucide equivalent)
*   **Primary Action Button:**
    *   **Icon:** `Plus` (Lucide equivalent)
    *   **Text:** "Start Audit"
    *   **Design:** Solid blue background (`#3B82F6`), white text, rounded corners.

## 4. Main Content Sections

The main content area is divided into several logical sections.

### 4.1 Audit Management Title Section

*   **Title:** "Audit Management" (Large, bold, dark gray text)
*   **Subtitle:** "Systematic overview of organizational asset compliance and integrity." (Smaller, regular weight, dark gray text)
*   **Navigation Tabs:**
    *   **Overview:** Active state (Blue background `#EFF6FF`, blue text `#3B82F6`, rounded corners, borderless).
    *   **History:** Inactive state (Light gray text, transparent background).
    *   **Schedule:** Inactive state (Light gray text, transparent background).

### 4.2 Key Performance Indicators (KPIs) Section

Three cards displaying key audit metrics. Each card has a white background, rounded corners, and a subtle shadow.

*   **Card 1: Compliance Score**
    *   **Icon:** Checkmark inside a circle (blue, `3B82F6`)
    *   **Title:** "COMPLIANCE SCORE" (Uppercase, gray text)
    *   **Value:** "94.2%" (Large, bold, blue text `#3B82F6`)
    *   **Change Indicator:** "⬆2.4%" (Smaller, green text, indicating positive change)
    *   **Target:** "Target: 98% for Q4 2024" (Small, gray text)
*   **Card 2: Completed Audits**
    *   **Icon:** Checkmark inside a square (blue, `3B82F6`)
    *   **Title:** "COMPLETED" (Uppercase, gray text)
    *   **Value:** "428" (Large, bold, dark gray text)
    *   **Change Indicator:** "Last 30 days (+12)" (Small, gray text)
*   **Card 3: Pending Audits**
    *   **Icon:** Document with clock (gray)
    *   **Title:** "PENDING" (Uppercase, gray text)
    *   **Value:** "14" (Large, bold, dark gray text)
    *   **Detail:** "5 requiring attention" (Small, gray text)
*   **Card 4: Missing Assets**
    *   **Icon:** Exclamation triangle (red, `EF4444`)
    *   **Title:** "MISSING ASSETS" (Uppercase, gray text)
    *   **Value:** "03" (Large, bold, red text `#EF4444`)
    *   **Detail:** "Immediate action required" (Small, gray text)

### 4.3 Active Audit Registry Section

A section displaying a table of active audits.

*   **Title:** "Active Audit Registry" (Medium, bold, dark gray text)
*   **Action Buttons (Right-aligned):**
    *   **Filter Button:**
        *   **Icon:** `Filter` (Lucide equivalent)
        *   **Text:** "Filter"
        *   **Design:** Light gray border, white background, rounded corners.
    *   **Export CSV Button:**
        *   **Icon:** `Download` (Lucide equivalent)
        *   **Text:** "Export CSV"
        *   **Design:** Light gray border, white background, rounded corners.
*   **Table:**
    *   **Columns:**
        *   Audit ID
        *   Department
        *   Auditor
        *   Assets Checked
        *   Progress
        *   Status
    *   **Sample Row 1:**
        *   **Audit ID:** "AUD-2024-089" (Blue link)
        *   **Department:** "IT & Infrastructure"
        *   **Auditor:** Avatar of "Mark Thompson", "Mark Thompson"
        *   **Assets Checked:** "142/150"
        *   **Progress:** Blue progress bar, mostly full.
        *   **Status:** "Active" (Blue badge, `#EFF6FF` background, `#3B82F6` text, rounded corners)
    *   **Sample Row 2:**
        *   **Audit ID:** "AUD-2024-092" (Blue link)
        *   **Department:** "Logistics Center"
        *   **Auditor:** Avatar of "Sarah Jenkins", "Sarah Jenkins"
        *   **Assets Checked:** "45/320"
        *   **Progress:** Teal progress bar, partially full.
        *   **Status:** "In Progress" (Teal badge, `#ECFDF5` background, `#10B981` text, rounded corners)
    *   **Sample Row 3:**
        *   **Audit ID:** "AUD-2024-085" (Blue link)
        *   **Department:** "Executive Office"
        *   **Auditor:** Avatar of "David Chen", "David Chen"
        *   **Assets Checked:** "88/88"
        *   **Progress:** Blue progress bar, full.
        *   **Status:** "Review Pending" (Gray badge, `#F3F4F6` background, `#6B7280` text, rounded corners, multiline text)
    *   **Sample Row 4:**
        *   **Audit ID:** "AUD-2024-094" (Blue link)
        *   **Department:** "R&D Laboratory"
        *   **Auditor:** Avatar of "Elena Rodriguez", "Elena Rodriguez"
        *   **Assets Checked:** "12/540"
        *   **Progress:** Red progress bar, barely started.
        *   **Status:** "Urgent" (Red badge, `#FEF2F2` background, `#EF4444` text, rounded corners)
    *   **Sample Row 5:**
        *   **Audit ID:** "AUD-2024-080" (Blue link)
        *   **Department:** "Finance Hub"
        *   **Auditor:** Avatar of "James Wilson", "James Wilson"
        *   **Assets Checked:** "210/210"
        *   **Progress:** Blue progress bar, full.
        *   **Status:** "Completed" (Blue badge, `#EFF6FF` background, `#3B82F6` text, rounded corners)
    *   **Pagination:**
        *   **Text:** "Showing 5 of 24 active audits"
        *   **Controls:** Left arrow (`ChevronLeft` Lucide equivalent), Right arrow (`ChevronRight` Lucide equivalent), both with light gray borders and white backgrounds.

### 4.4 Asset Integrity Progress Section

*   **Title:** "Asset Integrity Progress" (Medium, bold, dark gray text)
*   **Description:** "Real-time tracking of asset verification status by category." (Smaller, gray text)
*   **Time Period Selector:**
    *   **Text:** "This Month"
    *   **Icon:** `ChevronDown` (Lucide equivalent)
    *   **Design:** Light gray border, white background, rounded corners.
*   **Chart:** (Implied, but not fully visible in the screenshot. Appears to be a line or bar chart area with category labels below.)
    *   **Category Labels:** "HARDWARE", "VEHICLES", "MACHINES", "FURNITURE", "LICENSES", "MOBILE" (Uppercase, gray text, spaced horizontally).

### 4.5 Audit AI Insights Section

A card displaying AI-generated insights. White background, rounded corners, subtle shadow.

*   **Header:**
    *   **Icon:** `Bot` (Lucide equivalent, representing AI/robot)
    *   **Text:** "Audit AI Insights" (Medium, bold, dark gray text)
*   **Insight 1: Anomaly Detected**
    *   **Title:** "ANOMALY DETECTED" (Uppercase, bold, blue text `#3B82F6`)
    *   **Description:** "The Logistics Center audit is tracking 12% slower than typical cycles. Recommend assign additional auditor." (Regular text)
    *   **Design:** Light blue background (`#EFF6FF`), rounded corners.
*   **Insight 2: Predictive Alert**
    *   **Title:** "PREDICTIVE ALERT" (Uppercase, bold, green text `#10B981`)
    *   **Description:** "IT assets are showing a 98% verification rate, the highest in 6 months." (Regular text)
    *   **Design:** Light green background (`#ECFDF5`), rounded corners.
*   **Insight 3: Upcoming Task**
    *   **Title:** "UPCOMING TASK" (Uppercase, bold, gray text)
    *   **Description:** "Compliance recertification for Warehouse B is due in 12 days." (Regular text)
    *   **Design:** Light gray background (`#F3F4F6`), rounded corners.
*   **Button:**
    *   **Text:** "Generate Full Audit Report"
    *   **Design:** Blue border (`#3B82F6`), white background, blue text (`#3B82F6`), rounded corners.

## 5. Modals/Drawers

A right-aligned drawer is visible, likely triggered by the "Start Audit" button.

### 5.1 New Audit Details Drawer

*   **Position:** Right-aligned, fixed width, slides in from the right.
*   **Header:**
    *   **Title:** "New Audit Details" (Medium, bold, dark gray text)
    *   **Close Icon:** `X` (Lucide equivalent)
*   **Form Fields:**
    *   **Audit Name:**
        *   **Label:** "Audit Name"
        *   **Placeholder:** "e.g. Q4 Infrastructure Review"
        *   **Design:** Text input field with light gray border, rounded corners.
    *   **Department (Dropdown):**
        *   **Label:** "Department"
        *   **Selected Value:** "Operations"
        *   **Icon:** `ChevronDown` (Lucide equivalent)
        *   **Design:** Dropdown field with light gray border, rounded corners.
    *   **Lead Auditor (Dropdown):**
        *   **Label:** "Lead Auditor"
        *   **Selected Value:** "Alex Rivera"
        *   **Icon:** `ChevronDown` (Lucide equivalent)
        *   **Design:** Dropdown field with light gray border, rounded corners.
    *   **Scope & Objectives (Textarea):**
        *   **Label:** "Scope & Objectives"
        *   **Placeholder:** "Detail the specific focus areas..."
        *   **Design:** Textarea with light gray border, rounded corners.
    *   **File Upload Area:** (Appears to be a drag-and-drop area)
        *   **Description:** "Supported: .csv, .xlsx, .pdf"
        *   **Design:** Dashed gray border, light gray background, rounded corners.
*   **Action Buttons (Bottom):**
    *   **Cancel Button:**
        *   **Text:** "Cancel"
        *   **Design:** White background, light gray border (`#D1D5DB`), dark gray text, rounded corners.
    *   **Create Audit Button:**
        *   **Text:** "Create Audit"
        *   **Design:** Solid blue background (`#3B82F6`), white text, rounded corners.

## 6. Design Tokens (General)

*   **Colors:**
    *   **Primary Blue:** `#3B82F6` (Buttons, active states, compliance score)
    *   **Light Blue:** `#EFF6FF` (Active tab background, blue badge background, anomaly detected background)
    *   **Success Green:** `#10B981` (In Progress badge text, predictive alert text)
    *   **Light Green:** `#ECFDF5` (In Progress badge background, predictive alert background)
    *   **Warning Red:** `#EF4444` (Missing assets value, urgent badge text)
    *   **Light Red:** `#FEF2F2` (Urgent badge background)
    *   **Neutral Gray (Dark):** `#1F2937` (Main text, titles)
    *   **Neutral Gray (Medium):** `#6B7280` (Subtitle, less important text, review pending badge text)
    *   **Neutral Gray (Light):** `#D1D5DB` (Borders, placeholders, inactive text)
    *   **Background White:** `#FFFFFF` (Card backgrounds, main content area)
    *   **Sidebar Background:** `#1E293B`
    *   **Sidebar User Profile Background:** `#374151`
*   **Borders:** Subtle `1px` solid light gray (`#D1D5DB`) for cards, input fields, and buttons.
*   **Rounded Corners:** `4px` to `8px` radius consistently applied to cards, buttons, input fields, badges, and the user profile section.
*   **Spacing:** Consistent use of `16px`, `24px`, `32px` for padding and margins between sections and elements.
*   **Interactive States:**
    *   **Hover:** Implied for buttons (e.g., "Start Audit" button might darken slightly), navigation links (background change), table rows.
    *   **Active:** Clearly defined for the "Audits" sidebar link and "Overview" tab.