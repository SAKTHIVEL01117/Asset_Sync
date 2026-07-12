```markdown
# AssetSync AI Assistant Page Design Specification

This document details the design specifications for the 'AI Assistant' page within the AssetSync enterprise dashboard web application, based on the provided screenshot.

## 1. Page Layout Structure

The page uses a three-column layout:
*   **Left Sidebar:** Fixed width, dark background, containing the main navigation.
*   **Main Content Area:** Central, primary section for AI assistant interactions.
*   **Right Sidebar:** Fixed width, light background, displaying AI recommendations.

The header spans the top of the main content and right sidebar, containing global search and user actions.

## 2. Left Sidebar

**Overall Styling:** Dark background (`#1A1A1A`), white text for inactive links, primary blue for active links.
**Bottom Section:**
    *   **User Avatar:** Circular avatar with "AS" initials in white on a blue background.
    *   **User Name:** "AssetSync Admin" (white text).
    *   **User Role:** "Enterprise Tier" (light gray text).

**Navigation Links:**

| Icon (Lucide/Heroicons Equivalent) | Text                | State    | Badge | Formatting                                                                                                                                                                                                                                                             |
| :--------------------------------- | :------------------ | :------- | :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LayoutDashboard`                  | Dashboard           | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |
| `Asset` (or similar)               | Assets              | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |
| `CalendarCheck`                    | Resource Booking    | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |
| `Wrench`                           | Maintenance         | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |
| `ClipboardList`                    | Audits              | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |
| `BarChart2`                        | Reports & Analytics | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |
| `Bot`                              | AI Assistant        | Active   |       | White text, primary blue background (`#2563EB`). Full-width highlight. Icon is also white.                                                                                                                                                                             |
| `Settings`                         | Settings            | Inactive |       | White text, dark background.                                                                                                                                                                                                                                           |

## 3. Page Header

**Top Bar (Global):**
*   **Global Search Bar:**
    *   **Icon:** `Search` (Lucide)
    *   **Placeholder:** "Search across assets, tasks, or AI commands..."
    *   **Styling:** Light gray background, rounded corners, full width within its section.
*   **Right Icons:**
    *   `Bell` (Lucide) - Notification icon.
    *   `Zap` (Lucide) - Lightning bolt icon.
    *   `User` (Lucide) - User profile icon.

**Main Content Header:**
*   **Title:** "Asset Intelligence Assistant" (Large, bold, dark text).
*   **Subtitle/Status:**
    *   **Icon:** Small green circle.
    *   **Text:** "Neural Engine v4.2 Online" (Medium gray text).
*   **Action Buttons (Right Aligned):**
    *   **Button 1:** "Clear History"
        *   **Styling:** White background, light blue border, blue text.
    *   **Button 2:** "New Analysis"
        *   **Styling:** Primary blue background (`#2563EB`), white text, rounded corners.

## 4. Main Content Sections (AI Assistant Chat Interface)

The main content area displays a chat-like interface with messages from the AI and the user.

**AI Message 1:**
*   **Container:** White card with rounded corners.
*   **Icon:** Blue `Bot` icon in a blue square.
*   **Content:** "Greetings, Administrator. I have processed the latest telemetry from the Western Region facility. Would you like to see the maintenance priorities for today or analyze the energy consumption spikes?"
*   **Timestamp:** "09:12 AM" (Light gray text, bottom right of the message bubble).

**User Message 1:**
*   **Container:** Blue bubble (`#2563EB`) with white text, rounded corners, right-aligned.
*   **Content:** "Analyze the HVAC system in Sector 7. It's showing abnormal vibration levels."
*   **Timestamp:** "09:14 AM" (Light gray text, bottom left of the message bubble).
*   **Icon:** User icon (`User` Lucide) in a dark gray circle, right of the message bubble.

**AI Message 2:**
*   **Container:** White card with rounded corners.
*   **Icon:** Blue `Bot` icon in a blue square.
*   **Content:** "I've accessed the real-time sensor data for Sector 7 HVAC (ID: AS-7721). Vibrations have increased by 22% over the last 4 hours, primarily in the main compressor bearing."
*   **System Health Card (Nested):**
    *   **Title:** "System Health: Critical" (Dark text).
    *   **Failure Risk:** "Failure Risk 84%" (Red text, right aligned).
    *   **Progress Bar:** A red progress bar indicating 84% completion.
    *   **Data Metrics (Two columns):**
        *   **Left (TEMP):**
            *   Label: "TEMP" (Gray text).
            *   Value: "78.4°C ↑" (Bold, dark text, green upward arrow icon).
        *   **Right (RPM):**
            *   Label: "RPM" (Gray text).
            *   Value: "3200 OK" (Bold, dark text, "OK" in blue).
    *   **Recommendation Text:** "Recommendation: Schedule immediate inspection for **AS-7721** to prevent total bearing seizure." (Bold for asset ID).
    *   **Action Buttons:**
        *   **Button 1:** `Plus` (Lucide) icon + "CREATE WORK ORDER"
            *   **Styling:** Primary blue background (`#2563EB`), white text, rounded corners.
        *   **Button 2:** "DETAILS"
            *   **Styling:** White background, light gray border, dark text, rounded corners.

**Prompt Suggestions (Bottom of Main Content):**
*   **Row of Pill-shaped Buttons:**
    *   `Clipboard` (Lucide) icon + "Show all assets due for maintenance"
    *   `Zap` (Lucide) icon + "Optimize energy usage for Building B"
    *   `History` (Lucide) icon + "Review last audit resul" (truncated)
    *   **Styling:** Light gray background, dark text, rounded corners, light gray border.

**User Input Bar (Bottom of Main Content):**
*   **Left Icon:** `Paperclip` (Lucide) - Attachment icon.
*   **Text Input Field:**
    *   **Placeholder:** "Ask anything about your assets..."
    *   **Styling:** Light gray background, rounded corners.
*   **Microphone Icon:** `Mic` (Lucide) - For voice input.
*   **Send Button:** `Send` (Lucide) icon in a blue circle (`#2563EB`).

**Disclaimer Text (Below Input Bar):**
"AssetSync Intelligence may provide inaccurate data for non-monitored equipment. Always verify critical safety data." (Small, light gray text, centered).

## 5. Right Sidebar (AI Recommendations)

**Overall Styling:** Light background, rounded corners on cards.

**Header:**
*   **Title:** "AI Recommendations" (Dark, bold text).
*   **Badge:** "3 NEW" (Blue background, white text, rounded corners).

**Recommendation Card 1 (Predictive Alert):**
*   **Header:**
    *   **Icon:** `TriangleAlert` (Lucide) in an orange triangle.
    *   **Text:** "PREDICTIVE ALERT" (Orange text).
*   **Title:** "Fleet Vehicle E-102: Brake Wear" (Bold, dark text).
*   **Description:** "Telematics show aggressive..."
*   **Scheduled Status:**
    *   "Scheduled:" (Gray text).
    *   "No" (Dark text).
    *   "VIEW PLAN" (Blue text, `ArrowRight` (Lucide) icon, right aligned).

**Recommendation Card 2 (Energy Efficiency Forecast):**
*   **Title:** "Energy Efficiency Forecast" (Bold, dark text).
*   **Subtitle:** "Facility A - Q3 Estimates" (Gray text).
*   **Bar Chart:**
    *   **Type:** Vertical Bar Chart.
    *   **Data:** Multiple bars, one prominent blue bar reaching "18k". Other bars are light gray.
    *   **Labels:** One bar has "18k" above it.
    *   **Axes:** No explicit axes labels visible.
*   **AI Note:**
    *   "AI Note: Implementing automated lighting in Hall 4 would reduce this peak by 12% ($4,200 monthly)." (Blue text, "AI Note:" is bold).

**Recommendation Card 3 (Placeholder):**
*   Empty card with dashed border.

**Customize Recommendations Button (Bottom of Right Sidebar):**
*   **Icon:** `Plus` (Lucide)
*   **Text:** "Customize Recommendations"
*   **Styling:** Dashed border, light gray background, dark text, rounded corners.

## 6. Design Tokens

*   **Colors:**
    *   Primary Blue: `#2563EB` (Buttons, active nav link background, user message bubble, blue text).
    *   Dark Gray/Black: `#1A1A1A` (Sidebar background, primary text).
    *   Light Gray: `#F0F2F5` (Search bar, prompt suggestions, inactive card backgrounds).
    *   Medium Gray: `#6B7280` (Subtitle text, timestamps, placeholder text).
    *   White: `#FFFFFF` (Page background, text on blue/dark backgrounds).
    *   Green: `Green` (Status dot, upward arrow).
    *   Red: `Red` (Failure Risk text, progress bar).
    *   Orange: `Orange` (Predictive Alert icon and text).
*   **Borders:** Light gray (`#D1D5DB` or similar) for inactive buttons, card separators. Dashed light gray for placeholder card and "Customize Recommendations" button.
*   **Rounded Corners:** Consistently applied to cards, buttons, input fields, and chat bubbles (e.g., 8px-12px radius).
*   **Spacing:** Consistent padding and margin between elements (e.g., 16px-24px for card content, 8px-12px for button spacing).
*   **Active/Inactive States:** Highlighted blue for active navigation links and interactive elements.
*   **Interactive States:** Hover/focus states are implied for buttons and input fields, though not explicitly shown in a static screenshot. (e.g., darker blue on hover for primary buttons).

## 7. Charts

*   **Energy Efficiency Forecast Chart:**
    *   **Type:** Vertical Bar Chart.
    *   **Datasets:** Implied energy consumption values over time (e.g., monthly or quarterly).
    *   **Legends:** Not explicitly visible, but colors suggest different categories or states (e.g., current vs. projected, or different periods).
    *   **Axes Labels:** Not explicitly visible, but the Y-axis would likely represent energy consumption (e.g., kWh or cost), and the X-axis would represent time periods.
    *   **Colors:**
        *   Active/Highlighted Bar: Primary blue (`#2563EB`).
        *   Inactive/Background Bars: Light gray (`#D1D5DB` or similar).

## 8. Tables

No tables are visible in the screenshot.

## 9. Modals/Drawers

No modals, drawers, filter panels, or forms are visible in the screenshot, other than the chat input field.
```