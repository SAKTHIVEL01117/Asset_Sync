```markdown
# AssetSync Enterprise Dashboard - Enterprise Settings Page

## 1. Page Layout Structure

The page uses a three-column layout: a fixed-width left sidebar, a main content area for the settings, and a right-aligned drawer for "Configuration Details". The top header spans across the sidebar and main content area. A footer is present at the bottom of the sidebar and main content area.

*   **Header:** Fixed at the top, spanning the full width of the sidebar and main content area.
*   **Left Sidebar:** Fixed width, dark background, contains navigation links and a user profile section.
*   **Main Content Area:** The primary view for "Enterprise Settings," organized into cards.
*   **Right Drawer:** A slide-out panel that appears on top of the main content area, providing detailed configuration options.
*   **Footer:** Fixed at the bottom of the sidebar and main content area, displaying system status and version.

## 2. Sidebar

The sidebar has a dark background (`#1A1D21` or similar dark slate). Navigation links are white text on hover or active. Icons are light gray.

*   **Logo:** Top left, "AssetSync" in bold white text, with "Enterprise Resource Planning" below it in smaller, lighter gray text.
*   **Search Bar (Global):**
    *   Placeholder: "Search system settings..."
    *   Icon: Magnifying Glass (Lucide: `search` / Heroicons: `magnifying-glass`)
    *   Styling: Rounded corners, light gray background, dark gray text.
*   **Navigation Links:**
    *   **Dashboard**
        *   Icon: Grid (Lucide: `layout-dashboard` / Heroicons: `squares-2x2`)
        *   State: Inactive
    *   **Assets**
        *   Icon: Folder (Lucide: `folder` / Heroicons: `folder`)
        *   State: Inactive
    *   **Resource Booking**
        *   Icon: Calendar Check (Lucide: `calendar-check` / Heroicons: `calendar-days`)
        *   State: Inactive
    *   **Maintenance**
        *   Icon: Wrench (Lucide: `wrench` / Heroicons: `wrench-screwdriver`)
        *   State: Inactive
    *   **Audits**
        *   Icon: Clipboard (Lucide: `clipboard-list` / Heroicons: `clipboard-document-list`)
        *   State: Inactive
    *   **Reports & Analytics**
        *   Icon: Bar Chart (Lucide: `bar-chart-2` / Heroicons: `chart-bar`)
        *   State: Inactive
    *   **AI Assistant**
        *   Icon: Robot (Lucide: `robot` / Heroicons: `sparkles`)
        *   State: Inactive
    *   **Settings**
        *   Icon: Gear (Lucide: `cog` / Heroicons: `cog-6-tooth`)
        *   State: **Active** (dark blue background, white text)
*   **User Profile Section:** At the bottom of the sidebar.
    *   Image: Circular avatar of "Marcus Sterling".
    *   Name: "Marcus Sterling" in white text.
    *   Role: "ADMIN ACCESS" in smaller, light gray text.
    *   Background: Slightly lighter dark gray rounded rectangle.
*   **Sidebar Footer:**
    *   "System Status: Optimal" (Icon: Cloud Check - Lucide: `cloud-check` / Heroicons: `cloud-arrow-up` - with green dot, text is light gray)
    *   "Last backup: 14 mins ago" (light gray text)
    *   "Version 4.12.0-Enterprise" (light gray text, right-aligned)

## 3. Page Header

The header contains global elements and actions.

*   **Application Title:** "AssetSync" (bold, dark gray text)
*   **Icons (Right-aligned):**
    *   Bell (Lucide: `bell` / Heroicons: `bell`)
    *   Bolt (Lucide: `zap` / Heroicons: `bolt`)
    *   User Circle (Lucide: `user-circle` / Heroicons: `user-circle`)
*   **Global Search Bar:** (already described in Sidebar section, but visually it's in the header area)
    *   Placeholder: "Search system settings..."
    *   Icon: Magnifying Glass (Lucide: `search` / Heroicons: `magnifying-glass`)

## 4. Main Content Sections

The main content area displays "Enterprise Settings" with a title, subtitle, and action buttons, followed by a grid of setting cards.

*   **Title:** "Enterprise Settings" (Large, bold, dark gray text)
*   **Subtitle:** "Manage global configurations, compliance rules, and workspace security." (Smaller, lighter gray text)
*   **Action Buttons:**
    *   **Export Config**
        *   Icon: Download (Lucide: `download` / Heroicons: `arrow-down-tray`)
        *   Text: "Export Config"
        *   Styling: White background, light gray border, blue text.
    *   **Save All Changes**
        *   Icon: Save (Lucide: `save` / Heroicons: `check-badge`)
        *   Text: "Save All Changes"
        *   Styling: Solid blue background, white text.
*   **Settings Cards Grid:** A grid of cards, each representing a category of settings. All cards have rounded corners, a white background, and a light gray border. Each card has a title, description, and usually a metric or status, and an arrow indicating navigation.

    *   **Card 1: Organization Profile**
        *   Icon: Building (Lucide: `building` / Heroicons: `building-office`) - Blue icon, light blue background circle.
        *   Title: "Organization Profile" (Bold, dark gray text)
        *   Description: "Update legal entity details, fiscal years, headquarters location, and brand identity assets for the entire enterprise workspace." (Dark gray text)
        *   Status/Info: "Modified 2h ago by System" (Light gray text)
        *   Toggle Switch: (Gray, inactive state shown)
        *   Small "Global" badge on the top right of the icon section.
        *   Navigation Arrow: (Lucide: `arrow-right` / Heroicons: `arrow-right`) - Gray, indicating clickability.
    *   **Card 2: Departments**
        *   Icon: Cube (Lucide: `boxes` / Heroicons: `cube`) - Blue icon, light blue background circle.
        *   Title: "Departments" (Bold, dark gray text)
        *   Description: "Structure your organizational hierarchy, cost centers, and reporting lines." (Dark gray text)
        *   Metric: "14 Active Units" (Dark gray text)
        *   Navigation Arrow: (Lucide: `arrow-right` / Heroicons: `arrow-right`) - Gray.
    *   **Card 3: Users & Roles**
        *   Icon: Users (Lucide: `users` / Heroicons: `users`) - Blue icon, light blue background circle.
        *   Title: "Users & Roles" (Bold, dark gray text)
        *   Description: "Manage identity, RBAC permissions, and team memberships across the platform." (Dark gray text)
        *   Metric: "824 Users" (Dark gray text)
        *   Navigation Arrow: (Lucide: `arrow-right` / Heroicons: `arrow-right`) - Gray.
    *   **Card 4: Asset Categories**
        *   Icon: Cube Stack (Lucide: `cubes` / Heroicons: `squares-plus`) - Blue icon, light blue background circle.
        *   Title: "Asset Categories" (Bold, dark gray text)
        *   Description: "Define custom taxonomies, deprecation schedules, and attribute schemas." (Dark gray text)
        *   Metric: "32 Schemas" (Dark gray text)
        *   Navigation Arrow: (Lucide: `arrow-right` / Heroicons: `arrow-right`) - Gray.
    *   **Card 5: Maintenance Rules**
        *   Icon: List Checks (Lucide: `list-checks` / Heroicons: `clipboard-document-check`) - Red icon, light red background circle.
        *   Title: "Maintenance Rules" (Bold, dark gray text)
        *   Description: "Set SLAs, preventative triggers, and automated ticketing workflows." (Dark gray text)
        *   Metric: "4 Active Automations" (Dark gray text)
        *   Navigation Arrow: (Lucide: `arrow-right` / Heroicons: `arrow-right`) - Gray.
    *   **Card 6: Security & Privacy**
        *   Icon: Lock (Lucide: `lock` / Heroicons: `lock-closed`) - Dark blue icon, dark blue background circle.
        *   Title: "Security & Privacy" (Bold, dark gray text)
        *   Description: "Manage SSO/SAML integration, API keys, session timeouts, and GDPR compliance logging." (Dark gray text)
        *   Status: "All protocols active" (Green dot, dark gray text)
        *   Background graphic: Faded checkmark icon on the right side of the card.
    *   **Card 7: Appearance**
        *   Icon: Palette (Lucide: `palette` / Heroicons: `paint-brush`) - Blue icon, light blue background circle.
        *   Color Swatches: Blue, Dark Blue, Teal (small circles indicating themes).
        *   Title: "Appearance" (Bold, dark gray text)
        *   Description: "Configure custom themes, dark mode behavior, and white-label branding options." (Dark gray text)
        *   Status: "Light Theme Active" (Dark gray text)
        *   Navigation Arrow: (Lucide: `arrow-right` / Heroicons: `arrow-right`) - Gray.

## 5. Specific Text Content

*   **Application Name:** AssetSync
*   **Tagline:** Enterprise Resource Planning
*   **Sidebar Search:** Search system settings...
*   **Sidebar Nav:** Dashboard, Assets, Resource Booking, Maintenance, Audits, Reports & Analytics, AI Assistant, Settings
*   **User Name:** Marcus Sterling
*   **User Role:** ADMIN ACCESS
*   **Main Title:** Enterprise Settings
*   **Main Subtitle:** Manage global configurations, compliance rules, and workspace security.
*   **Buttons:** Export Config, Save All Changes
*   **Card 1:**
    *   Title: Organization Profile
    *   Description: Update legal entity details, fiscal years, headquarters location, and brand identity assets for the entire enterprise workspace.
    *   Status: Modified 2h ago by System
    *   Badge: Global
*   **Card 2:**
    *   Title: Departments
    *   Description: Structure your organizational hierarchy, cost centers, and reporting lines.
    *   Metric: 14 Active Units
*   **Card 3:**
    *   Title: Users & Roles
    *   Description: Manage identity, RBAC permissions, and team memberships across the platform.
    *   Metric: 824 Users
*   **Card 4:**
    *   Title: Asset Categories
    *   Description: Define custom taxonomies, deprecation schedules, and attribute schemas.
    *   Metric: 32 Schemas
*   **Card 5:**
    *   Title: Maintenance Rules
    *   Description: Set SLAs, preventative triggers, and automated ticketing workflows.
    *   Metric: 4 Active Automations
*   **Card 6:**
    *   Title: Security & Privacy
    *   Description: Manage SSO/SAML integration, API keys, session timeouts, and GDPR compliance logging.
    *   Status: All protocols active
*   **Card 7:**
    *   Title: Appearance
    *   Description: Configure custom themes, dark mode behavior, and white-label branding options.
    *   Status: Light Theme Active
*   **Sidebar Footer:** System Status: Optimal, Last backup: 14 mins ago, Version 4.12.0-Enterprise

## 6. Design Tokens

*   **Colors:**
    *   **Primary Blue:** `#2D60E0` (Save All Changes button, active sidebar link background, blue icons)
    *   **Light Blue:** `#E0ECFB` (Background for blue icons in cards)
    *   **Dark Gray (Text/Icons):** `#333333` (Main titles, card titles, most text)
    *   **Light Gray (Text/Icons):** `#6B7280` (Subtitles, descriptions, inactive text, navigation arrows)
    *   **Background (Main Content):** White (`#FFFFFF`)
    *   **Background (Sidebar):** Dark Slate (`#1A1D21` or similar dark gray/blue)
    *   **Border Color:** Light Gray (`#E0E0E0` or similar)
    *   **Green (Status):** `#28A745` (Active status dot)
    *   **Red (Icon):** `#DC3545` (Maintenance Rules icon)
    *   **Light Red (Background):** `#F8D7DA` (Background for red icon)
    *   **Dark Blue (Icon/Background):** `#007BFF` (Security & Privacy icon background)
*   **Borders:** Subtle light gray borders around cards, buttons, and search bars.
*   **Rounded Corners:** Prominent rounded corners on cards, buttons, search bars, and input fields.
*   **Spacing:** Consistent padding and margins, creating a clean, airy layout.
*   **Active/Inactive States:**
    *   **Sidebar:** Active link has a solid blue background with white text. Inactive links are white text on dark background.
    *   **Toggle Switch:** Gray for inactive.
*   **Interactive States:** Hover effects on navigation links and buttons are implied but not shown in a static screenshot.

## 7. Charts

No charts are present on this page.

## 8. Tables

No tables are present on this page.

## 9. Modals/Drawers

A right-aligned drawer titled "Configuration Details" is open.

*   **Drawer Title:** "Configuration Details" (Dark gray, bold text)
*   **Close Button:** "X" icon at the top right.
*   **Section: Quick Action**
    *   Title: "Quick Action" (Bold, dark gray text)
    *   Description: "Configure active setting" (Light gray text)
*   **Section: Data Residency**
    *   Dropdown Label: (Implicitly "Data Residency" based on the context)
    *   Dropdown Value: "North America (East)"
    *   Styling: Rounded corners, light gray border, dark gray text.
*   **Section: Branding Assets**
    *   Title: "Branding Assets" (Bold, dark gray text)
    *   **Upload Card 1: Primary Logo**
        *   Icon: Upload (Lucide: `upload` / Heroicons: `arrow-up-tray`)
        *   Text: "Primary Logo"
        *   Styling: Dashed light gray border, white background, rounded corners.
    *   **Upload Card 2: Favicon**
        *   Icon: Upload (Lucide: `upload` / Heroicons: `arrow-up-tray`)
        *   Text: "Favicon"
        *   Styling: Dashed light gray border, white background, rounded corners.
*   **Information Message:**
    *   Icon: Info Circle (Lucide: `info` / Heroicons: `information-circle`) - Blue icon.
    *   Text: "Changing these settings will notify all system administrators via the unified audit trail." (Dark gray text)
    *   Styling: Light blue background, light blue border, rounded corners.
*   **Drawer Action Buttons (Bottom):**
    *   **Cancel**
        *   Text: "Cancel"
        *   Styling: White background, light gray border, dark gray text.
    *   **Save Changes**
        *   Text: "Save Changes"
        *   Styling: Solid blue background, white text.
```