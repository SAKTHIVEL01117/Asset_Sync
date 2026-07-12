```markdown
# AssetSync Enterprise Dashboard - Asset Management Page

## 1. Page Layout Structure

The page uses a two-column layout with a fixed-width left sidebar and a main content area.
- **Header:** A global header spanning the full width of the page, containing the application logo, name, and a global search bar.
- **Sidebar:** A dark vertical navigation bar on the left.
- **Main Content Area:** The primary workspace for the "Asset Management" section, occupying the rest of the horizontal space.
- **Drawer:** A right-aligned drawer (Asset Details) is open, overlaying a portion of the main content area.

## 2. Sidebar

The sidebar is dark gray (`#2A2E33`) with white text and icons. Active links have a light blue background (`#3661ED`) and a blue left border (`#3661ED`).

- **Application Logo & Name:**
    - Logo: A stylized "S" or "G" icon in blue (`#3661ED`).
    - Text: "AssetSync" (bold, white)
    - Subtitle: "ENTERPRISE RESOURCE PLANNING" (smaller, light gray)
- **Navigation Links:**
    - **Dashboard:**
        - Icon: Grid/Squares (`Heroicons: Squares2X2Icon` or `Lucide: LayoutDashboard`)
        - Text: "Dashboard"
        - State: Inactive
    - **Assets:**
        - Icon: Folder/Briefcase (`Heroicons: BriefcaseIcon` or `Lucide: Briefcase`)
        - Text: "Assets"
        - State: **Active** (blue background, blue left border)
    - **Resource Booking:**
        - Icon: Calendar (`Heroicons: CalendarDaysIcon` or `Lucide: CalendarDays`)
        - Text: "Resource Booking"
        - State: Inactive
    - **Maintenance:**
        - Icon: Wrench/Settings (`Heroicons: WrenchScrewdriverIcon` or `Lucide: Wrench`)
        - Text: "Maintenance"
        - State: Inactive
    - **Audits:**
        - Icon: Document with Checkmark (`Heroicons: DocumentCheckIcon` or `Lucide: FileCheck`)
        - Text: "Audits"
        - State: Inactive
    - **Reports & Analytics:**
        - Icon: Bar Chart (`Heroicons: ChartBarIcon` or `Lucide: BarChart`)
        - Text: "Reports & Analytics"
        - State: Inactive
    - **AI Assistant:**
        - Icon: Robot/AI (`Heroicons: SparklesIcon` or `Lucide: Bot`)
        - Text: "AI Assistant"
        - State: Inactive
- **Bottom Link:**
    - **Settings:**
        - Icon: Gear (`Heroicons: Cog6ToothIcon` or `Lucide: Settings`)
        - Text: "Settings"
        - State: Inactive

## 3. Page Header

The global header is light gray (`#F8F9FA`).

- **Global Search Bar:**
    - Icon: Magnifying Glass (`Heroicons: MagnifyingGlassIcon` or `Lucide: Search`)
    - Placeholder Text: "Search assets, IDs, or locations..."
    - Styling: Rounded corners, light gray background, dark gray border on hover/focus.

## 4. Main Content Sections

The main content area is white.

### A. Page Title & Subtitle

- **Title:** "Asset Management" (Large, bold, dark gray text)
- **Subtitle:** "Monitor and manage company resources across 12 departments." (Smaller, regular, medium gray text)

### B. KPI Cards (Key Performance Indicator)

Two cards displaying key metrics. Each card has a white background, rounded corners, and a light border.

- **Card 1: Total Assets**
    - Icon: Briefcase/Folder (`Lucide: Briefcase` or `Heroicons: BriefcaseIcon`) in light blue (`#3661ED`)
    - Metric Label: "Total Assets" (medium gray)
    - Value: "1,248" (large, bold, dark gray)
    - Trend Indicator: "+2.4% ↑" (small, green text, green up arrow `Lucide: ArrowUp` or `Heroicons: ArrowUpIcon`)
- **Card 2: Assigned Assets**
    - Icon: Person (`Lucide: User` or `Heroicons: UserIcon`) in light blue (`#3661ED`)
    - Metric Label: "Assigned" (medium gray)
    - Value: "1,048" (large, bold, dark gray)
    - Trend Indicator: "84% Occupied" (small, medium gray text)

### C. Filtering Section

A row of dropdown filters for the asset list.

- **Department Filter:**
    - Label: "Department:" (medium gray)
    - Dropdown: "All Departments" (white background, light gray border, down arrow `Lucide: ChevronDown` or `Heroicons: ChevronDownIcon`)
- **Category Filter:**
    - Label: "Category:" (medium gray)
    - Dropdown: "Hardware" (white background, light gray border, down arrow `Lucide: ChevronDown` or `Heroicons: ChevronDownIcon`)
- **Status Filter:**
    - Label: "Status:" (medium gray)
    - Dropdown: (Placeholder not fully visible, likely "All Statuses" or similar) (white background, light gray border, down arrow `Lucide: ChevronDown` or `Heroicons: ChevronDownIcon`)

### D. Asset List Table

A table displaying a list of assets. The table header is light gray, and rows alternate between white and a slightly lighter gray on hover. The active row (for AST-2024-001) has a light blue background and a blue left border.

- **Table Columns:**
    - Checkbox (for row selection)
    - QR Code (Icon)
    - Asset ID
    - Asset Name
    - Category
    - Department
- **Sample Row 1 (Active):**
    - Checkbox: Checked (blue)
    - QR Code: QR code icon (`Lucide: QrCode` or `Heroicons: QrCodeIcon`)
    - Asset ID: "AST-2024-001" (bold, dark gray)
    - Asset Name: "MacBook Pro M3 Max - 16\"" (dark gray)
    - Category: "Workstations" (medium gray)
    - Department: "Engineering" (medium gray)
- **Sample Row 2:**
    - Checkbox: Unchecked
    - QR Code: QR code icon
    - Asset ID: "AST-2024-042"
    - Asset Name: "Dell UltraSharp 32\" 4K"
    - Category: "Peripherals"
    - Department: "Design"
- **Sample Row 3:**
    - Checkbox: Unchecked
    - QR Code: QR code icon
    - Asset ID: "AST-2023-912"
    - Asset Name: "Cisco Catalyst 9300"
    - Category: "Networking"
    - Department: "IT Infra"
- **Sample Row 4:**
    - Checkbox: Unchecked
    - QR Code: QR code icon
    - Asset ID: "AST-2019-105"
    - Asset Name: "iPad Pro 11\" (2018)"
    - Category: "Mobile Devices"
    - Department: "Operations"
- **Pagination:**
    - Text: "Showing 1-10 of 1,248 assets" (medium gray)

## 5. Asset Details Drawer (Right Overlay)

A drawer slides in from the right, obscuring part of the main content. It has a white background and a light gray border on the left.

- **Header:**
    - Close Icon: "X" (`Lucide: X` or `Heroicons: XMarkIcon`) (dark gray)
    - Title: "Asset Details" (bold, dark gray)
    - Button 1: "Edit" (text button, blue text, no background)
    - Button 2: "Actions" (primary button, blue background `##3661ED`, white text, rounded corners)
- **Asset Summary:**
    - Image: Thumbnail of a laptop (rounded corners)
    - Badge: "ASSIGNED" (light blue background, dark blue text, rounded corners)
    - Asset ID: "AST-2024-001" (medium gray)
    - Asset Name: "MacBook Pro M3 Max - 16\"" (large, bold, dark gray)
    - Location: Pin icon (`Lucide: MapPin` or `Heroicons: MapPinIcon`) followed by "San Francisco HQ, Floor 4, Desk 204" (medium gray)
- **Navigation Tabs:**
    - "Overview" (Active, blue underline, blue text)
    - "Warranty" (Inactive, gray text)
    - "History" (Inactive, gray text)
    - "Attachments" (Inactive, gray text)
- **Overview Content:**
    - **Asset Information Section:**
        - Info Icon: `Lucide: Info` or `Heroicons: InformationCircleIcon` (medium gray)
        - Title: "Asset Information" (medium gray)
        - **Serial Number:**
            - Label: "SERIAL NUMBER" (small, light gray)
            - Value: "C02Z88A9MD6T" (dark gray)
        - **Purchase Date:**
            - Label: "PURCHASE DATE" (small, light gray)
            - Value: "Jan 12, 2024" (dark gray)
        - **Purchase Cost:**
            - Label: "PURCHASE COST" (small, light gray)
            - Value: "$3,499.00 USD" (dark gray)
        - **Supplier:**
            - Label: "SUPPLIER" (small, light gray)
            - Value: "Apple Business" (blue text, clickable/link styling)
    - **Asset QR ID Card:**
        - White card with light border, rounded corners.
        - QR Code: Large QR code image.
        - Title: "Asset QR ID" (bold, dark gray)
        - Description: "Scan to quickly access maintenance records or initiate a transfer." (medium gray)
        - Button 1: "Print Label" (secondary button, blue border, blue text, white background, rounded corners)
        - Button 2: "Download" (secondary button, blue border, blue text, white background, rounded corners)
    - **Recent Activity Section:**
        - Icon: Clock (`Lucide: Clock` or `Heroicons: ClockIcon`) (medium gray)
        - Title: "Recent Activity" (medium gray)
        - **Activity 1: Physical Audit Completed**
            - Icon: Checkmark in circle (`Lucide: CheckCircle` or `Heroicons: CheckCircleIcon`) (green)
            - Text: "Physical Audit Completed" (dark gray)
            - Details: "Verified by Marcus Finch • 2 days ago" (medium gray)
        - **Activity 2: Assigned to Alex Rivera**
            - Icon: Document with person (`Lucide: FileUser` or `Heroicons: UserGroupIcon`) (light blue)
            - Text: "Assigned to Alex Rivera" (dark gray)
            - Details: "Location set to SF HQ Floor 4 • Jan 15, 2024" (medium gray)
        - **Activity 3: Purchased & Onboarded**
            - Icon: Document (`Lucide: File` or `Heroicons: DocumentTextIcon`) (light blue)
            - Text: "Purchased & Onboarded" (dark gray)
            - Details: "By Admin User • Jan 12, 2024" (medium gray)
        - Button: "View Full Audit Log" (text button, blue text, no background)
    - **Warranty Status Section:**
        - Icon: Shield with checkmark (`Lucide: ShieldCheck` or `Heroicons: ShieldCheckIcon`) (medium gray)
        - Title: "Warranty Status" (medium gray)
- **Drawer Footer (Sticky):**
    - Button 1: "Label"
        - Icon: Printer (`Lucide: Printer` or `Heroicons: PrinterIcon`) (dark gray)
        - Text: "Label" (dark gray)
    - Button 2: "Transfer"
        - Icon: Arrows horizontal (`Lucide: GitCompareArrows` or `Heroicons: ArrowsRightLeftIcon`) (dark gray)
        - Text: "Transfer" (dark gray)
    - Button 3: "Retire"
        - Icon: Red X in circle (`Lucide: XCircle` or `Heroicons: XCircleIcon`) (red)
        - Text: "Retire" (red)

## Design Tokens

- **Colors:**
    - Primary Blue: `#3661ED` (sidebar active, button backgrounds, links, underlines)
    - Dark Gray (Text/Icons): `#1A202C` (approximated, main titles, bold text)
    - Medium Gray (Text/Icons): `#4A5568` (approximated, subtitles, labels, inactive text)
    - Light Gray (Text/Icons): `#A0AEC0` (approximated, small labels)
    - Sidebar Background: `#2A2E33`
    - Main Content Background: `#FFFFFF`
    - Global Header Background: `#F8F9FA`
    - Green (Success/Trend): `#48BB78` (approximated, for +2.4% and checkmarks)
    - Red (Danger/Retire): `#E53E3E` (approximated, for Retire button)
    - Badge Blue Background: `#E0F2F7` (approximated, for "ASSIGNED" badge)
    - Badge Dark Blue Text: `#2C5282` (approximated, for "ASSIGNED" badge)
    - Active Row Background: `#EDF2F7` (approximated, for active table row)
- **Borders:**
    - Light Gray Border: `1px solid #E2E8F0` (approximated, for cards, dropdowns, table dividers)
    - Blue Border (active sidebar item, secondary buttons): `1px solid #3661ED`
- **Rounded Corners:**
    - Small (buttons, badges, input fields): `4px`
    - Medium (cards, image thumbnails): `8px`
- **Spacing:**
    - Consistent `8px` or `16px` increments for padding and margins.
    - Sidebar width: Approximately `240px`.
    - Drawer width: Approximately `400px`.
- **Active/Inactive States:**
    - Sidebar: Active link has blue background and left border.
    - Tabs: Active tab has blue underline and blue text.
    - Table Row: Active row has light blue background and blue left border.
- **Interactive States:**
    - Buttons: Likely subtle hover/active states (e.g., slight background change, border change).
    - Links: Blue text, possibly underline on hover.
    - Dropdowns: Border change on hover/focus.
```