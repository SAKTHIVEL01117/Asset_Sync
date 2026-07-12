```markdown
# AssetSync Enterprise Dashboard: Resource Booking Page

## 1. Page Layout Structure

The page uses a three-column layout:
- **Left Sidebar:** Occupies approximately 15-20% of the screen width, dark background.
- **Main Content Area (Left Section):** Occupies approximately 30-35% of the screen width, light background, displays resource listings.
- **Main Content Area (Middle Section):** Occupies approximately 25-30% of the screen width, light background, displays a calendar.
- **Main Content Area (Right Section):** Occupies approximately 30% of the screen width, light background, displays reservation and schedule details.

**Header:** A persistent header bar spans across the top of the entire page, containing global search, notifications, quick actions, and user profile.

**Breadcrumbs:** Not present on this page.

## 2. Sidebar

The left sidebar has a dark slate background (`#2D3748` or similar dark gray). It features the application logo and navigation links.

### Logo:
- **Text:** "AssetSync" in a larger, bolder font.
- **Subtitle:** "Enterprise Resource Planning" in a smaller font below the logo.
- **Color:** White text.

### Navigation Links:
All icons are standard outline icons (Lucide or Heroicons equivalent). Text color for inactive links is a lighter gray (`#A0AEC0` or similar). Active link text is white (`#FFFFFF`). The active link has a blue background (`#2B6CB0` or similar blue) with rounded corners on the left side, extending to the right edge of the sidebar.

- **Dashboard**
    - Icon: `LayoutDashboard` (squares grid)
    - Status: Inactive
- **Assets**
    - Icon: `Folder` (document folder)
    - Status: Inactive
- **Resource Booking**
    - Icon: `CalendarCheck` (calendar with checkmark)
    - Status: Active (blue background, white text)
- **Maintenance**
    - Icon: `Wrench` (wrench)
    - Status: Inactive
- **Audits**
    - Icon: `ClipboardCheck` (clipboard with checkmark)
    - Status: Inactive
- **Reports & Analytics**
    - Icon: `BarChart` (bar chart)
    - Status: Inactive
- **AI Assistant**
    - Icon: `Bot` (robot head)
    - Status: Inactive
- **Settings**
    - Icon: `Settings` (gear icon)
    - Status: Inactive

### User Profile Section (Bottom of Sidebar):
- **Avatar:** Circular image of "Alex Rivera".
- **Name:** "Alex Rivera" (white text).
- **Role:** "Admin Access" (lighter gray text).
- **Color:** White text on dark background.

## 3. Page Header

The header bar has a light background (`#FFFFFF` or similar).

- **Global Search:**
    - Icon: `Search` (magnifying glass)
    - Placeholder Text: "Search resources, bookings, or assets..."
    - Style: Rounded search bar, light gray background (`#EDF2F7` or similar).
- **Icons (Right side):**
    - `Bell` (notification icon) with a red badge (small circle, likely indicating unread notifications).
    - `Zap` (lightning bolt icon) for quick actions.
    - `User` (profile icon)
    - **Text:** "Profile" next to the user icon.
    - **Color:** Dark gray icons.

## 4. Main Content Sections

The main content area is divided into three logical sections: Resources List, Calendar, and Reservation/Schedule.

### 4.1. Resources List (Left Main Section)

**Title:** "Resources" (large, bold, dark gray text).

**Filter Tabs:**
- **All:** Blue background (`#2B6CB0`), white text (`#FFFFFF`). Active state. Rounded corners.
- **Rooms:** Light gray background (`#EDF2F7`), dark gray text. Inactive state. Rounded corners.
- **IT:** Light gray background (`#EDF2F7`), dark gray text. Inactive state. Rounded corners.

**Resource Cards (Vertical List):** Each card represents a resource.
- **Card Background:** White (`#FFFFFF`).
- **Border:** Subtle light gray border (e.g., `border: 1px solid #E2E8F0;`).
- **Spacing:** Vertical spacing between cards.

#### Card 1: Boardroom A
- **Title:** "Boardroom A" (bold, dark gray text).
- **Description:** "12 Person Capacity • AV System" (smaller, lighter gray text).
- **Icons:** `Users` (people icon), `Monitor` (monitor icon), `Camera` (camera icon), `Wifi` (wifi icon). (All light gray icons).
- **Status Indicator:** Small green circle (e.g., `#48BB78`) indicating availability.

#### Card 2: Projector X200
- **Title:** "Projector X200" (bold, dark gray text).
- **Description:** "4K UHD • Wireless Dongle" (smaller, lighter gray text).
- **Icons:** `Projector` (projector icon). (Light gray icon).
- **Status Indicator:** Small orange circle (e.g., `#F6AD55`) indicating a different status (e.g., in use, soon to be available).

#### Card 3: Dell XPS 15 #04
- **Title:** "Dell XPS 15 #04" (bold, dark gray text).
- **Description:** "i9 • 32GB RAM • Creative" (smaller, lighter gray text).
- **Icons:** `Laptop` (laptop icon). (Light gray icon).
- **Status Indicator:** Small green circle (e.g., `#48BB78`) indicating availability.

#### Card 4: Company Van B
- **Title:** "Company Van B" (bold, dark gray text).
- **Description:** "In Transit • Returns 4PM" (smaller, lighter gray text).
- **Icons:** `Truck` (truck icon). (Light gray icon).
- **Status Indicator:** Small red circle (e.g., `#F56565`) indicating unavailability.

#### Card 5: Focus Pod 02
- **Title:** "Focus Pod 02" (bold, dark gray text).
- **Description:** "Soundproof • Standing Desk" (smaller, lighter gray text).
- **Icons:** `Mic` (microphone icon), `Desk` (desk icon). (Light gray icons).
- **Status Indicator:** Small green circle (e.g., `#48BB78`) indicating availability.

### 4.2. Calendar (Middle Main Section)

**Header:**
- **Month and Year:** "October 2023" (large, bold, dark gray text).
- **Navigation Arrows:** `<` (left arrow) and `>` (right arrow) for navigating months. (Dark gray icons).

**Calendar Grid:**
- **Day Headers:** "Mon", "Tue", "Wed", "Thu" (smaller, dark gray text, centered).
- **Dates:** Each cell contains a date number.
    - Past/Future Month Dates (e.g., 25, 26, 27, 30, 31): Lighter gray text.
    - Current Month Dates (e.g., 2, 3, 4, 9, 10, 11, 16, 17, 18, 23, 24, 25): Darker gray text.
- **Bookings:**
    - **October 3:** "Boardroom A - 9AM" (small, blue text, enclosed in a light blue pill-shaped background with a blue border).
    - **October 4:** "Lap..." (small, blue text, similar styling as above, truncated).

### 4.3. Reservation & Schedule (Right Main Section)

#### New Reservation Card
- **Background:** White (`#FFFFFF`).
- **Border:** Light gray border.
- **Title:** "New Reservation" (bold, dark gray text).
- **Add Icon:** `PlusCircle` (plus sign in a circle) icon on the top right of the card, dark gray color.

- **Form Fields:**
    - **Select Resource:**
        - Label: "Select Resource" (dark gray text).
        - Dropdown: "Boardroom A" (placeholder/selected value).
        - Icon: `ChevronDown` (dropdown arrow).
        - Style: Rounded input field, light gray border.
    - **Date:**
        - Label: "Date" (dark gray text).
        - Input: "10/05/2023" (value).
        - Icon: `Calendar` (calendar icon) inside the input field.
        - Style: Rounded input field, light gray border.
    - **Time:**
        - Label: "Time" (dark gray text).
        - Input: "02:00 PM" (value).
        - Icon: `Clock` (clock icon) inside the input field.
        - Style: Rounded input field, light gray border.
    - **Duration:**
        - Label: "Duration" (dark gray text).
        - Slider: Blue track for filled portion, light gray track for unfilled portion.
        - Value: "2h 30m" (dark gray text) displayed next to the slider.
        - Style: Horizontal slider.

- **Confirm Booking Button:**
    - Text: "Confirm Booking" (white text).
    - Background: Solid blue (`#2B6CB0`).
    - Style: Rounded corners, full width.

#### Today's Schedule Card
- **Background:** White (`#FFFFFF`).
- **Border:** Light gray border.
- **Title:** "Today's Schedule" (bold, dark gray text).

- **Schedule Items (Vertical List):** Each item represents a scheduled event.
    - **Item 1: Marketing Team Sync**
        - Date Badge: `OCT 05` (White text on blue background `#4299E1`, rounded corners).
        - Title: "Marketing Team Sync" (bold, dark gray text).
        - Details: "09:00 - 10:30 • Boardroom B" (lighter gray text).
        - Action Icon: `Trash` (delete icon), dark gray.
        - Style: Card-like item with light gray border and rounded corners.
    - **Item 2: Hardware Testing**
        - Date Badge: `OCT 05` (White text on blue background `#4299E1`, rounded corners).
        - Title: "Hardware Testing" (bold, dark gray text).
        - Details: "13:00 - 17:00 • Lab Room 4" (lighter gray text).
        - Action Icon: `Trash` (delete icon), dark gray.
        - Style: Card-like item with light gray border and rounded corners.
    - **Item 3: Client Presentation**
        - Date Badge: `OCT 05` (White text on blue background `#4299E1`, rounded corners).
        - Title: "Client Presentation" (bold, dark gray text).
        - Details: "15:00 - 16:00 • Boardroom A" (lighter gray text).
        - Attendees: Two small circular avatar images, followed by "+2" (small gray text).
        - Style: Card-like item with light gray border and rounded corners. This item appears to be actively selected or highlighted with a slightly darker blue background behind the date badge and a blue border on the left.

#### Smart Suggestions Card
- **Background:** Solid blue (`#2B6CB0`).
- **Icon:** `CalendarCheck` (calendar with checkmark icon) in the bottom right corner, lighter blue or white.
- **Title:** "Smart Suggestions" (white text, bold).
- **Description:** "Based on your history, you usually need Boardroom B on Fridays at 10 AM." (white text, normal font weight).
- **Button:**
    - Text: "Book Now" (blue text).
    - Background: White (`#FFFFFF`).
    - Style: Rounded corners.

## 5. Specific text content

- **AssetSync**
- **Enterprise Resource Planning**
- **Search resources, bookings, or assets...**
- **Profile**
- **Resources**
- **All**
- **Rooms**
- **IT**
- **Boardroom A**
- **12 Person Capacity • AV System**
- **Projector X200**
- **4K UHD • Wireless Dongle**
- **Dell XPS 15 #04**
- **i9 • 32GB RAM • Creative**
- **Company Van B**
- **In Transit • Returns 4PM**
- **Focus Pod 02**
- **Soundproof • Standing Desk**
- **October 2023**
- **Mon**
- **Tue**
- **Wed**
- **Thu**
- **25, 26, 27** (Dates from previous/next month)
- **2, 3, 4, 9, 10, 11, 16, 17, 18, 23, 24, 25, 30, 31** (Dates of current month)
- **Boardroom A - 9AM**
- **Lap...**
- **New Reservation**
- **Select Resource**
- **Boardroom A** (Dropdown selected value)
- **Date**
- **10/05/2023** (Date input value)
- **Time**
- **02:00 PM** (Time input value)
- **Duration**
- **2h 30m** (Duration value)
- **Confirm Booking**
- **Today's Schedule**
- **OCT 05** (Date badge)
- **Marketing Team Sync**
- **09:00 - 10:30 • Boardroom B**
- **OCT 05** (Date badge)
- **Hardware Testing**
- **13:00 - 17:00 • Lab Room 4**
- **OCT 05** (Date badge)
- **Client Presentation**
- **15:00 - 16:00 • Boardroom A**
- **+2**
- **Smart Suggestions**
- **Based on your history, you usually need Boardroom B on Fridays at 10 AM.**
- **Book Now**
- **Alex Rivera**
- **Admin Access**

## 6. Design Tokens

- **Colors:**
    - Primary Blue: `#2B6CB0` (active sidebar link, "All" filter, "Confirm Booking" button, Smart Suggestions card background)
    - Lighter Blue: `#4299E1` (date badges in schedule, calendar booking pills, slider filled track)
    - Dark Gray (Text): `#2D3748` (main titles, labels, bold text, icons, general body text)
    - Lighter Gray (Text): `#718096` (descriptions, inactive text, secondary info)
    - Lightest Gray (Background/Borders): `#EDF2F7` (search bar, inactive filter tabs, input borders, general light backgrounds)
    - Sidebar Background: `#1A202C` or similar dark slate.
    - White: `#FFFFFF` (page background, button text, active sidebar link text, Smart Suggestions text)
    - Green (Status): `#48BB78` (available status indicator)
    - Orange (Status): `#F6AD55` (in-use/pending status indicator)
    - Red (Status): `#F56565` (unavailable status indicator)
    - Red (Notification Badge): `#E53E3E`

- **Borders:**
    - Subtle `1px solid #E2E8F0` for cards and input fields.
    - Blue border for active calendar bookings (e.g., `1px solid #4299E1`).

- **Rounded Corners:**
    - Small to medium `border-radius: 0.375rem` (6px) or `0.5rem` (8px) for buttons, input fields, cards, calendar booking pills, filter tabs, date badges, and the active sidebar link.

- **Spacing:**
    - Consistent `padding` and `margin` values, likely multiples of 4px or 8px (e.g., `p-2`, `py-4`, `mb-4`).
    - Adequate vertical spacing between list items and cards.

- **Active/Inactive States:**
    - Active sidebar link: Blue background, white text.
    - Inactive sidebar links: Dark background, light gray text.
    - Active filter tab ("All"): Blue background, white text.
    - Inactive filter tabs ("Rooms", "IT"): Light gray background, dark gray text.
    - Highlighted schedule item (Client Presentation): A slight blue tint or border on the left.

- **Interactive States:**
    - Hover/Focus on buttons and interactive elements would likely show a slight background change or border. (Not explicitly visible in static screenshot).

## 7. Charts

No charts are visible on this page.

## 8. Tables

No traditional tables are visible. Information is presented in cards and lists.

## 9. Modals/Drawers

No modals or drawers are visible. The "New Reservation" section acts as an inline form.
```