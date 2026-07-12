```markdown
# AssetSync Enterprise Dashboard - Maintenance Management Page Design Specification

This document details the design specifications for the 'Maintenance Management' page within the AssetSync Enterprise Dashboard. The goal is to provide a pixel-perfect recreation of the provided screenshot.

## 1. Page Layout Structure

The page follows a standard enterprise dashboard layout:
-   **Fixed Left Sidebar:** Occupies approximately 15% of the screen width, dark background.
-   **Top Header Bar:** Spans the full width above the main content and sidebar, light background.
-   **Main Content Area:** Occupies the remaining width to the right of the sidebar, light background.
-   **Right-aligned Drawer/Modal:** Overlays the main content area from the right, covering approximately 40% of the screen width.

## 2. Sidebar

The sidebar is dark slate gray (`#2A303C`) with white text and icons.
-   **Top Section:**
    -   **Logo:** `AssetSync` text in white, with a blue (`#3B82F6`) square icon featuring a white gear symbol. Below it, `ENTERPRISE ERP` in smaller white text.
    -   **Spacing:** A significant vertical gap separates the logo from the navigation links.
-   **Navigation Links:**
    -   Each link has an icon and text. On hover, the background might lighten slightly.
    -   **Active Link:** `Maintenance` has a solid blue (`#3B82F6`) background with white text and icon.
    -   **Inactive Links:** Dark slate gray background with white text and icons.
    -   **Icons (Lucide/Heroicons equivalents):**
        -   `Dashboard`: LayoutDashboard (Lucide) / Squares2X2 (Heroicons)
        -   `Assets`: Archive (Lucide) / ArchiveBox (Heroicons)
        -   `Resource Booking`: CalendarCheck (Lucide) / CalendarDays (Heroicons)
        -   `Maintenance`: Wrench (Lucide) / WrenchScrewdriver (Heroicons)
        -   `Audits`: FileText (Lucide) / DocumentText (Heroicons)
        -   `Reports & Analytics`: BarChart (Lucide) / ChartBar (Heroicons)
        -   `AI Assistant`: Robot (Lucide) / Sparkles (Heroicons)
-   **Bottom Section:**
    -   **Settings Link:**
        -   Icon: Settings (Lucide) / Cog6Tooth (Heroicons)
        -   Text: `Settings`
    -   **User Profile:**
        -   Circular avatar of "Alex Rivera".
        -   Name: `Alex Rivera` (white text)
        -   Title: `Maintenance Head` (lighter gray text)
-   **Spacing:** Consistent vertical padding between nav items.

## 3. Page Header

The header bar is white (`#FFFFFF`) with light gray (`#E5E7EB`) borders.
-   **Left Section:**
    -   **Search Bar:**
        -   Icon: Search (Lucide) / MagnifyingGlass (Heroicons)
        -   Placeholder Text: `Search maintenance logs, assets, or technicians...`
        -   Styling: Rounded corners, light gray border, white background.
-   **Right Section:**
    -   **Icons:**
        -   Bell (Lucide) / Bell (Heroicons)
        -   Zap (Lucide) / Bolt (Heroicons)
    -   **User Profile:**
        -   Icon: User (Lucide) / UserCircle (Heroicons)
        -   Text: `AssetSync`
    -   **Styling:** Icons are dark gray (`#6B7280`), with a slight spacing between them.

## 4. Main Content Sections

The main content area is white (`#FFFFFF`) with a light gray background (`#F9FAFB`) for the overall page.

### 4.1. Page Title and Action Button

-   **Title:** `Maintenance Overview` (Large, bold, dark gray text)
-   **Subtitle:** `Systematic health tracking for industrial assets.` (Smaller, regular weight, dark gray text)
-   **Action Button:** `+ Schedule Maintenance`
    -   Styling: Blue background (`#3B82F6`), white text, rounded corners, `plus` icon (Lucide/Heroicons) to the left of the text.

### 4.2. Overview Cards (Key Performance Indicators)

A set of four cards, arranged horizontally, each displaying a key metric. Each card has a white background, rounded corners, and a subtle shadow.

-   **Card 1: Pending**
    -   Icon: ClipboardList (Lucide) / ClipboardDocumentList (Heroicons)
    -   Small text: `+12% vs LW` (Green text, indicating positive change)
    -   Label: `PENDING` (Uppercase, dark gray)
    -   Value: `24` (Large, bold, dark gray)
    -   Progress Bar: Short blue bar below the value.
-   **Card 2: In Progress**
    -   Icon: RefreshCcw (Lucide) / ArrowPath (Heroicons)
    -   Small text: `Active Now` (Blue text)
    -   Label: `IN PROGRESS` (Uppercase, dark gray)
    -   Value: `08` (Large, bold, dark gray)
    -   Progress Bar: Short blue bar below the value.
-   **Card 3: Completed**
    -   Icon: CheckCircle (Lucide) / CheckCircle (Heroicons)
    -   Small text: `94% Efficiency` (Dark gray text)
    -   Label: `COMPLETED` (Uppercase, dark gray)
    -   Value: `142` (Large, bold, dark gray)
    -   Progress Bar: Short dark gray bar below the value.
-   **Card 4: Overdue**
    -   Icon: AlertTriangle (Lucide) / ExclamationTriangle (Heroicons)
    -   Small text: `Urgent` (Red text)
    -   Label: `OVERDUE` (Uppercase, dark gray)
    -   Value: `03` (Large, bold, dark gray)
    -   Progress Bar: Short red bar below the value.

### 4.3. Maintenance Schedule Table

-   **Section Title:** `Maintenance Schedule` (Bold, dark gray text)
-   **Action Buttons:**
    -   `Filter`: Icon Filter (Lucide) / Funnel (Heroicons), text `Filter`
    -   `Export`: Icon Download (Lucide) / ArrowDownTray (Heroicons), text `Export`
    -   Styling: Dark gray text, on hover, they might show a light background.

-   **Table Structure:**
    -   **Columns:**
        -   `Asset`
        -   `Technician`
        -   `Priority`
        -   `Scheduled Date`
        -   `Status`
        -   `Actions`
    -   **Column Header Styling:** Dark gray text, regular weight.
    -   **Row Styling:**
        -   Each row has a light background, subtle border between rows.
        -   Hover state likely changes background color.
    -   **Sample Row Values:**

| Asset                               | Technician      | Priority | Scheduled Date | Status       | Actions |
| :---------------------------------- | :-------------- | :------- | :------------- | :----------- | :------ |
| **CNC Mill - Unit 04** <br> ID: AS-2044-X | Marcus Thorne (Avatar) | HIGH     | Oct 24, 2023   | • In Progress | ⋮       |
| **Packaging Line B** <br> ID: AS-1122-Z | Elena Vance (Avatar)   | MEDIUM   | Oct 26, 2023   | • Pending    | ⋮       |
| **HVAC Chiller Unit** <br> ID: AS-9833-Q | Julian Grey (Avatar)   | LOW      | Oct 22, 2023   | ! Overdue    | ⋮       |
| **Backup Generator 01** <br> ID: AS-5541-P | Marcus Thorne (Avatar) | HIGH     | Oct 20, 2023   | Ⓒ Completed  | ⋮       |

    -   **Specific Text Content & Styling:**
        -   **Asset Column:**
            -   Asset Name: Bold, dark gray text.
            -   ID: Regular weight, lighter gray text.
            -   Icon: Each asset has a unique icon (e.g., `gear` for CNC Mill, `package` for Packaging Line, `snowflake` for HVAC, `bulb` for Backup Generator). Icons are light gray.
        -   **Technician Column:**
            -   Circular avatar image.
            -   Name: Regular weight, dark gray text.
        -   **Priority Column:**
            -   Badges with rounded corners and uppercase text.
            -   `HIGH`: Red background (`#EF4444`), white text.
            -   `MEDIUM`: Orange/Amber background (`#F59E0B`), white text.
            -   `LOW`: Blue background (`#3B82F6`), white text.
        -   **Scheduled Date Column:**
            -   Date format: `Mon DD, YYYY` (e.g., `Oct 24, 2023`).
            -   Text: Regular weight, dark gray.
        -   **Status Column:**
            -   `• In Progress`: Blue dot, blue text.
            -   `• Pending`: Gray dot, gray text.
            -   `! Overdue`: Red exclamation mark, red text.
            -   `Ⓒ Completed`: Green circle with checkmark, green text.
        -   **Actions Column:**
            -   Vertical ellipsis icon (`...`) for a dropdown menu.
            -   Styling: Dark gray icon.
    -   **Pagination:**
        -   Text: `Showing 4 of 32 schedules` (bottom left).
        -   Navigation Arrows: Left (`<`) and Right (`>`) arrow icons, light gray, with a subtle border. These are likely interactive buttons.

## 5. Modals/Drawers: Schedule Maintenance Task Drawer

A right-aligned drawer overlays the main content. It has a white background, rounded top-right and bottom-right corners, and a subtle shadow.

-   **Header:**
    -   Title: `Schedule Maintenance` (Bold, dark gray text)
    -   Subtitle: `Create a new preventive task` (Smaller, regular weight, dark gray text)
    -   Close Button: `X` icon (Lucide/Heroicons) in the top right corner.
-   **Form Fields:**
    -   **Target Asset:**
        -   Label: `TARGET ASSET` (Uppercase, dark gray)
        -   Input Field: Dropdown with placeholder `Select an asset...`, light gray border, down arrow icon.
    -   **Scheduled Date:**
        -   Label: `SCHEDULED DATE` (Uppercase, dark gray)
        -   Input Field: Text input with placeholder `mm/dd/yyyy`, light gray border, calendar icon (Lucide/Heroicons) at the right.
    -   **Priority:**
        -   Label: `PRIORITY` (Uppercase, dark gray)
        -   Input Field: Dropdown with selected value `Medium`, light gray border, down arrow icon.
    -   **Assign Technician:**
        -   Label: `ASSIGN TECHNICIAN` (Uppercase, dark gray)
        -   Selected Technicians:
            -   `Marcus Thorne`: Chip/pill-shaped button with circular avatar, blue background, white text, `X` icon to remove.
            -   `Elena Vance`: Chip/pill-shaped button with circular avatar, light gray background, dark gray text.
        -   `+ Browse all`: Button with `plus` icon (Lucide/Heroicons) and text, light gray background, dark gray text.
    -   **Task Description:**
        -   Label: `TASK DESCRIPTION` (Uppercase, dark gray)
        -   Textarea: Placeholder `Describe the maintenance steps or issues to check...`, light gray border, multiple lines.
-   **AI Suggestion Card:**
    -   Styling: Light gray background (`#F3F4F6`), rounded corners, subtle border.
    -   Icon: Robot (Lucide) / Sparkles (Heroicons) in blue (`#3B82F6`).
    -   Title: `AI Suggestion` (Bold, dark gray text)
    -   Description: `Based on historical data for this asset, we recommend checking the hydraulic pressure valves which typically fail every 400 operation hours.` (Regular weight, dark gray text)
-   **Footer Buttons:**
    -   `Cancel`: Button, white background, dark gray text, no border.
    -   `Schedule Task`: Button, blue background (`#3B82F6`), white text, rounded corners.

## 6. Design Tokens (Summary)

-   **Colors:**
    -   Primary Blue: `#3B82F6` (Active nav, buttons, progress bars, AI icon)
    -   Dark Gray (Text/Icons): `#2A303C`, `#374151`, `#4B5563`
    -   Light Gray (Text/Borders/Backgrounds): `#6B7280`, `#D1D5DB`, `#E5E7EB`, `#F3F4F6`, `#F9FAFB`
    -   White: `#FFFFFF` (Backgrounds, text on blue buttons)
    -   Red: `#EF4444` (Overdue, High priority)
    -   Orange/Amber: `#F59E0B` (Medium priority)
    -   Green: `#22C55E` (Positive change, Completed status)
-   **Borders:** Light gray (`#E5E7EB` or similar) for inputs, cards, table rows.
-   **Rounded Corners:** Consistent `sm` to `md` radius (e.g., 4px to 8px) for cards, buttons, input fields.
-   **Spacing:** Consistent use of `rem` or `px` based spacing for padding, margins, and gaps between elements (e.g., `p-4`, `my-2`, `gap-x-4`).
-   **Active/Inactive States:**
    -   Sidebar: Blue background for active, dark gray for inactive.
    -   Buttons: Blue background for primary actions, light gray for secondary.
    -   Table Rows: Subtle hover effect (lighter background).
-   **Interactive States:** Buttons and interactive elements likely have hover/focus states (e.g., slight background change, shadow).

This comprehensive specification should enable a pixel-perfect recreation of the 'Maintenance Management' page.
```