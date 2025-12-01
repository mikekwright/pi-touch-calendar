# Pi Touch Calendar - TODO List

## Current Status
The application has a basic Electron + Vite + TypeScript foundation with window management and placeholder directory structure. This TODO tracks all features needed to meet the requirements in REQUIREMENTS.md.

**Current Progress: ~15% Complete**

## 🎯 Key Requirements from REQUIREMENTS.md

### Core Features Required:
1. **Pincode Authentication** (4-8 digits, no username, config file in ~/.config/pi-touch-calendar/)
2. **Google OAuth Integration** (QR code authentication for calendar, tasks, drive, email)
3. **Calendar Page** (landing page showing selected calendars, tomorrow's schedule, carousel navigation)
4. **Chore Page** (Google Sheets-based, per-child sheets, daily auto-pull at 2am, SQLite storage)
5. **Chore Tracking** (Daily stats pushed to Google Sheets, completion tracking)
6. **Touch-First UI** (Pink/rose gold theme, large buttons, no text input, navigation via buttons)
7. **Kiosk Mode** (Raspberry Pi deployment, fullscreen, auto-start)

### Technical Requirements:
- Config directory: `~/.config/pi-touch-calendar/`
- Google Sheets: `pi-touch-calendar-chores` (configurable via PI_CHORE_SHEET_NAME)
- Stats Sheet: `pi-touch-calendar-chores-stats` (configurable via PI_CHORE_RESULTS_SHEET_NAME)
- Authentication logs rotated daily, kept for 90 days
- SQLite database for chore tracking and completion status

---

## 🎯 Testing Standards

**Every feature MUST include:**
- ✅ Unit tests for all business logic and utilities
- ✅ Unit tests for all repositories and services
- ✅ Component tests for all React components
- ✅ At least one Playwright integration test per major feature
- ✅ Minimum 70% code coverage target

**Test File Structure:**
```
src/main/services/auth/
  ├── AuthService.ts
  └── __tests__/
      └── AuthService.test.ts

src/renderer/components/calendar/
  ├── CalendarPage.tsx
  └── __tests__/
      └── CalendarPage.test.tsx

test/integration/
  └── auth.spec.ts
```

---

## 🚨 CRITICAL BLOCKERS (Must Fix First)

### 1. Install Missing Dependencies
- [ ] Install React and React DOM
  ```bash
  npm install react react-dom
  npm install --save-dev @types/react @types/react-dom
  ```
- [ ] Install Google APIs client library
  ```bash
  npm install googleapis
  npm install google-auth-library
  ```
- [ ] Install SQLite database library
  ```bash
  npm install better-sqlite3
  npm install --save-dev @types/better-sqlite3
  ```
- [ ] Install QR code generation library
  ```bash
  npm install qrcode
  npm install --save-dev @types/qrcode
  ```
- [ ] Install testing dependencies
  ```bash
  npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom
  npm install --save-dev @playwright/test
  ```

### 2. Remove Incorrect Authentication System
- [ ] Remove username/password demo authentication from `src/main/login.ts:27-47`
- [ ] Remove demo credentials validation
- [ ] Remove username field from login UI

### 3. Update Vite Configuration
- [ ] Update `vite.renderer.config.ts` to support React JSX
- [ ] Add React plugin to Vite config
- [ ] Configure path aliases for cleaner imports

### 4. Set Up Testing Infrastructure
- [ ] Create `vitest.config.ts` with coverage settings
- [ ] Create `playwright.config.ts` for Electron testing
- [ ] Create test utilities directory `test/utils/`
- [ ] Create test fixtures directory `test/fixtures/`
- [ ] Add test scripts to package.json (test:unit, test:integration, test:coverage)

---

## Phase 1: Authentication & Configuration (Week 1-2)

### Pincode Authentication System
- [ ] Create configuration directory handler
  - [ ] Create `src/main/config/ConfigManager.ts`
  - [ ] Implement config directory creation at `~/.config/pi-touch-calendar/`
  - [ ] Create credential file handler for pincode storage
  - [ ] Add file permissions check (ensure user-only access)
  - [ ] Add validation for 4-8 digit pincode

- [ ] Replace login system with pincode
  - [ ] Update `src/main/login.ts` to use pincode authentication
  - [ ] Remove username field from LoginWindow
  - [ ] Add pincode input (numeric only, masked)
  - [ ] Create pincode verification logic
  - [ ] Update IPC handlers in `src/main/index.ts:93-106`

- [ ] Create initial setup flow
  - [ ] Detect if pincode exists (first-time setup)
  - [ ] Create setup wizard for initial pincode creation
  - [ ] Add pincode confirmation field
  - [ ] Store hashed pincode in config file

### Authentication Logging
- [ ] Create logging service
  - [ ] Create `src/main/services/logging/AuthLogger.ts`
  - [ ] Log all authentication attempts with timestamp
  - [ ] Store logs in `~/.config/pi-touch-calendar/logs/`
  - [ ] Implement daily log rotation
  - [ ] Implement 90-day log cleanup (scheduled task)
  - [ ] Add log format: timestamp, success/failure, IP (if applicable)

### ✅ Phase 1 Testing Requirements
- [ ] **Unit Tests** - Create `src/main/config/__tests__/ConfigManager.test.ts`
  - [ ] Test config directory creation
  - [ ] Test credential file creation and reading
  - [ ] Test file permissions validation (user-only access)
  - [ ] Test pincode validation (4-8 digits)
  - [ ] Test invalid pincode rejection (too short, too long, non-numeric)
  - [ ] Test config file not found handling

- [ ] **Unit Tests** - Create `src/main/services/auth/__tests__/PincodeAuth.test.ts`
  - [ ] Test pincode hashing
  - [ ] Test pincode verification (correct pincode)
  - [ ] Test pincode verification (incorrect pincode)
  - [ ] Test first-time setup detection
  - [ ] Test pincode storage
  - [ ] Test pincode retrieval

- [ ] **Unit Tests** - Create `src/main/services/logging/__tests__/AuthLogger.test.ts`
  - [ ] Test log entry creation
  - [ ] Test log file writing
  - [ ] Test log rotation (daily)
  - [ ] Test old log cleanup (90 days)
  - [ ] Test log format validation
  - [ ] Test concurrent log writes

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/PincodeInput.test.tsx`
  - [ ] Test pincode input renders
  - [ ] Test numeric-only input validation
  - [ ] Test masking of pincode input
  - [ ] Test pincode submission
  - [ ] Test error message display

- [ ] **Integration Tests** - Create `test/integration/auth.spec.ts`
  - [ ] Test first-time setup flow (create pincode, confirm, save)
  - [ ] Test successful login with correct pincode
  - [ ] Test failed login with incorrect pincode
  - [ ] Test pincode authentication end-to-end
  - [ ] Test authentication logging end-to-end

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify ConfigManager has >70% coverage
  - [ ] Verify PincodeAuth has >70% coverage
  - [ ] Verify AuthLogger has >70% coverage

---

## Phase 2: Google OAuth Integration (Week 3-4)

### OAuth Setup & Configuration
- [ ] Create Google OAuth service
  - [ ] Create `src/main/services/google/GoogleOAuthService.ts`
  - [ ] Implement OAuth 2.0 flow for Google APIs
  - [ ] Request scopes: email, calendar, tasks, drive (sheets)
  - [ ] Store OAuth credentials in config directory (encrypted)
  - [ ] Implement token refresh logic
  - [ ] Handle token expiration gracefully

### QR Code Authentication Flow
- [ ] Implement QR code authentication
  - [ ] Create local HTTP server for OAuth callback (localhost only)
  - [ ] Generate OAuth authorization URL
  - [ ] Generate QR code from authorization URL
  - [ ] Display QR code in UI (renderer process)
  - [ ] Handle OAuth callback from mobile device
  - [ ] Exchange authorization code for access token
  - [ ] Store tokens securely in config directory
  - [ ] Close HTTP server after successful authentication

### OAuth Token Management
- [ ] Create token storage service
  - [ ] Create `src/main/services/google/TokenManager.ts`
  - [ ] Encrypt tokens before storage
  - [ ] Decrypt tokens on retrieval
  - [ ] Check token validity on app start
  - [ ] Auto-refresh expired tokens
  - [ ] Handle refresh token expiration (re-authenticate)

### App Startup Flow
- [ ] Update startup logic
  - [ ] Check if Google OAuth token exists in `src/main/index.ts`
  - [ ] If token exists and valid, skip pincode → go to calendar page
  - [ ] If no token or invalid, show pincode screen
  - [ ] After pincode, check OAuth status
  - [ ] If not authenticated with Google, show QR code screen

### ✅ Phase 2 Testing Requirements
- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/GoogleOAuthService.test.ts`
  - [ ] Test OAuth URL generation
  - [ ] Test authorization code exchange
  - [ ] Test token storage (encrypted)
  - [ ] Test token retrieval (decrypted)
  - [ ] Test token refresh logic
  - [ ] Test token expiration detection
  - [ ] Test scope validation (calendar, tasks, drive, email)
  - [ ] Test error handling for invalid tokens

- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/TokenManager.test.ts`
  - [ ] Test token encryption
  - [ ] Test token decryption
  - [ ] Test token validation
  - [ ] Test token refresh scheduling
  - [ ] Test expired token handling
  - [ ] Test missing token handling

- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/QRCodeService.test.ts`
  - [ ] Test QR code generation from URL
  - [ ] Test QR code data encoding
  - [ ] Test QR code image format
  - [ ] Test error handling for invalid URLs

- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/OAuthCallbackServer.test.ts`
  - [ ] Test HTTP server creation
  - [ ] Test callback endpoint handling
  - [ ] Test authorization code extraction
  - [ ] Test server shutdown after callback
  - [ ] Test localhost binding
  - [ ] Test timeout handling

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/QRCodeDisplay.test.tsx`
  - [ ] Test QR code component renders
  - [ ] Test QR code image display
  - [ ] Test loading state
  - [ ] Test error state
  - [ ] Test instructions display

- [ ] **Integration Tests** - Create `test/integration/oauth.spec.ts`
  - [ ] Test OAuth flow with mocked Google endpoints
  - [ ] Test QR code display in UI
  - [ ] Test callback handling
  - [ ] Test token storage end-to-end
  - [ ] Test token refresh on expiration
  - [ ] Test app startup with valid token (skip pincode)
  - [ ] Test app startup with invalid token (show pincode)

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify GoogleOAuthService has >70% coverage
  - [ ] Verify TokenManager has >70% coverage
  - [ ] Verify QRCodeService has >70% coverage

---

## Phase 3: Calendar Integration (Week 5-6)

### Google Calendar API Integration
- [ ] Create calendar service
  - [ ] Create `src/main/services/google/CalendarService.ts`
  - [ ] Implement Google Calendar API client
  - [ ] Fetch user's calendar list
  - [ ] Fetch events from selected calendars
  - [ ] Parse and normalize calendar events
  - [ ] Handle recurring events
  - [ ] Handle all-day events
  - [ ] Handle multi-day events

### Calendar Data Storage
- [ ] Create SQLite database schema
  - [ ] Create `src/main/database/schema.sql`
  - [ ] Create calendars table (id, name, color, enabled)
  - [ ] Create events table (id, calendar_id, title, start, end, description, location)
  - [ ] Create database initialization in `src/main/database/db.ts`
  - [ ] Implement migrations system

- [ ] Create calendar repository
  - [ ] Create `src/main/repositories/CalendarRepository.ts`
  - [ ] Implement CRUD operations for calendars
  - [ ] Implement CRUD operations for events
  - [ ] Implement query for today's events
  - [ ] Implement query for tomorrow's events
  - [ ] Implement query for date range

### Calendar Sync Service
- [ ] Implement calendar synchronization
  - [ ] Create `src/main/services/google/CalendarSyncService.ts`
  - [ ] Implement initial sync (fetch all enabled calendars)
  - [ ] Implement periodic sync (every 15-30 minutes)
  - [ ] Implement manual refresh trigger
  - [ ] Handle sync errors gracefully
  - [ ] Update local database with fetched events
  - [ ] Remove deleted events from local database
  - [ ] Implement delta sync (incremental updates)

### ✅ Phase 3 Testing Requirements
- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/CalendarService.test.ts`
  - [ ] Test Google Calendar API client initialization
  - [ ] Test fetch calendar list
  - [ ] Test fetch events from single calendar
  - [ ] Test fetch events from multiple calendars
  - [ ] Test recurring event parsing
  - [ ] Test all-day event handling
  - [ ] Test multi-day event handling
  - [ ] Test event normalization
  - [ ] Test API error handling (rate limits, network errors)

- [ ] **Unit Tests** - Create `src/main/database/__tests__/db.test.ts`
  - [ ] Test database initialization
  - [ ] Test schema creation
  - [ ] Test migrations run successfully
  - [ ] Test database connection handling
  - [ ] Test concurrent access
  - [ ] Test database cleanup

- [ ] **Unit Tests** - Create `src/main/repositories/__tests__/CalendarRepository.test.ts`
  - [ ] Test create calendar
  - [ ] Test read calendar by ID
  - [ ] Test read all calendars
  - [ ] Test update calendar
  - [ ] Test delete calendar
  - [ ] Test enable/disable calendar
  - [ ] Test get enabled calendars only

- [ ] **Unit Tests** - Create `src/main/repositories/__tests__/EventRepository.test.ts`
  - [ ] Test create event
  - [ ] Test read event by ID
  - [ ] Test read events by calendar
  - [ ] Test read events by date range
  - [ ] Test read today's events
  - [ ] Test read tomorrow's events
  - [ ] Test update event
  - [ ] Test delete event
  - [ ] Test bulk insert events
  - [ ] Test remove deleted events

- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/CalendarSyncService.test.ts`
  - [ ] Test initial sync
  - [ ] Test periodic sync scheduling
  - [ ] Test manual sync trigger
  - [ ] Test sync error handling
  - [ ] Test database update on sync
  - [ ] Test event deletion detection
  - [ ] Test delta sync (incremental)
  - [ ] Test sync state persistence

- [ ] **Integration Tests** - Create `test/integration/calendar-sync.spec.ts`
  - [ ] Test complete calendar sync flow (mocked Google API)
  - [ ] Test events stored in database
  - [ ] Test periodic sync updates events
  - [ ] Test manual refresh updates events
  - [ ] Test sync with network errors
  - [ ] Test sync recovers after errors

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify CalendarService has >70% coverage
  - [ ] Verify CalendarRepository has >70% coverage
  - [ ] Verify EventRepository has >70% coverage
  - [ ] Verify CalendarSyncService has >70% coverage

---

## Phase 4: Calendar UI (Week 7-8)

### React Setup
- [ ] Create React application structure
  - [ ] Create `src/renderer/App.tsx` (main React component)
  - [ ] Create `src/renderer/index.tsx` (React entry point)
  - [ ] Set up React Router for navigation
  - [ ] Create base layout component
  - [ ] Set up theme provider (pink/rose gold theme)

### Calendar Landing Page
- [ ] Create calendar page component
  - [ ] Create `src/renderer/pages/CalendarPage.tsx`
  - [ ] Display today's date prominently
  - [ ] Create main calendar view (today's events)
  - [ ] Sort events by time (chronological order)
  - [ ] Color-code events by calendar source
  - [ ] Display event time, title, location

- [ ] Create tomorrow's schedule sidebar
  - [ ] Create smaller calendar view component
  - [ ] Display tomorrow's events
  - [ ] Show event count for tomorrow
  - [ ] Minimal event details (time + title)

### Calendar Navigation
- [ ] Implement carousel navigation
  - [ ] Add "Previous Day" button (large, touch-friendly)
  - [ ] Add "Next Day" button (large, touch-friendly)
  - [ ] Add "Today" button to jump back
  - [ ] Implement swipe gestures (optional enhancement)
  - [ ] Update events display when navigating
  - [ ] Show date being viewed

### Calendar Settings
- [ ] Create calendar settings modal
  - [ ] Add gear icon button to calendar page
  - [ ] Create modal/dialog component
  - [ ] List all available calendars
  - [ ] Add toggle switches for each calendar (enable/disable)
  - [ ] Add "Select All" / "Deselect All" buttons
  - [ ] Save calendar preferences to database
  - [ ] Refresh calendar view on save

### Refresh Functionality
- [ ] Add manual refresh button
  - [ ] Add refresh icon button to calendar page
  - [ ] Trigger manual calendar sync
  - [ ] Show loading indicator during sync
  - [ ] Display last sync time
  - [ ] Show success/error toast notification

### ✅ Phase 4 Testing Requirements
- [ ] **Component Tests** - Create `src/renderer/__tests__/App.test.tsx`
  - [ ] Test App component renders
  - [ ] Test React Router setup
  - [ ] Test theme provider initialized
  - [ ] Test base layout renders
  - [ ] Test navigation between pages

- [ ] **Component Tests** - Create `src/renderer/pages/__tests__/CalendarPage.test.tsx`
  - [ ] Test calendar page renders
  - [ ] Test today's date displays correctly
  - [ ] Test events list renders
  - [ ] Test empty state (no events)
  - [ ] Test event sorting (chronological)
  - [ ] Test event color coding
  - [ ] Test event details display (time, title, location)

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/TomorrowSchedule.test.tsx`
  - [ ] Test tomorrow's schedule sidebar renders
  - [ ] Test tomorrow's events display
  - [ ] Test event count display
  - [ ] Test minimal event details shown

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/CalendarNavigation.test.tsx`
  - [ ] Test navigation buttons render
  - [ ] Test "Previous Day" button click
  - [ ] Test "Next Day" button click
  - [ ] Test "Today" button click
  - [ ] Test date display updates on navigation
  - [ ] Test touch target size (>44px)

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/CalendarSettings.test.tsx`
  - [ ] Test settings modal renders
  - [ ] Test gear icon button renders
  - [ ] Test calendar list displays
  - [ ] Test toggle switches work
  - [ ] Test "Select All" button
  - [ ] Test "Deselect All" button
  - [ ] Test save button
  - [ ] Test modal close

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/RefreshButton.test.tsx`
  - [ ] Test refresh button renders
  - [ ] Test refresh icon displays
  - [ ] Test click triggers sync
  - [ ] Test loading indicator shows during sync
  - [ ] Test last sync time displays
  - [ ] Test success notification shows
  - [ ] Test error notification shows

- [ ] **Integration Tests** - Create `test/integration/calendar-ui.spec.ts`
  - [ ] Test calendar page loads with events
  - [ ] Test tomorrow's schedule displays
  - [ ] Test navigation between days
  - [ ] Test calendar settings modal open/close
  - [ ] Test enabling/disabling calendars
  - [ ] Test manual refresh updates UI
  - [ ] Test loading states during sync
  - [ ] Test error states display correctly

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify CalendarPage has >70% coverage
  - [ ] Verify all calendar components have >70% coverage
  - [ ] Verify React components render without errors

---

## Phase 5: Chore Management System (Week 9-11)

### Google Sheets Integration
- [ ] Create Google Sheets service
  - [ ] Create `src/main/services/google/SheetsService.ts`
  - [ ] Implement Google Sheets API client
  - [ ] Add method to list sheets in spreadsheet
  - [ ] Add method to read sheet data
  - [ ] Add method to write sheet data
  - [ ] Add method to create new spreadsheet
  - [ ] Add method to create new sheet in spreadsheet

### Chore Sheet Management
- [ ] Implement chore sheet initialization
  - [ ] Check for spreadsheet named `pi-touch-calendar-chores` (or env variable)
  - [ ] Create spreadsheet if it doesn't exist
  - [ ] Create example sheet with sample chores (brush teeth, make bed, etc.)
  - [ ] Set up sheet format: Column A = Chore Name, Columns B-H = Days (Sun-Sat)
  - [ ] Add header row to example sheet

- [ ] Implement chore sheet reading
  - [ ] Parse chore sheet format
  - [ ] Read all sheets (each sheet = one child)
  - [ ] Extract child name from sheet name
  - [ ] Parse chores for each day of week
  - [ ] Handle empty cells (chore not scheduled for that day)
  - [ ] Validate sheet format

### Chore Database Schema
- [ ] Create chore database tables
  - [ ] Add children table (id, name, sheet_name)
  - [ ] Add chores table (id, child_id, title, day_of_week, date_pulled)
  - [ ] Add chore_completions table (id, chore_id, completed_at, completed_by)
  - [ ] Create indexes for performance
  - [ ] Add migration for chore schema

### Daily Chore Sync (2:00 AM)
- [ ] Implement scheduled chore pull
  - [ ] Create `src/main/services/chores/ChoreScheduler.ts`
  - [ ] Schedule daily task at 2:00 AM
  - [ ] Fetch today's chores for all children from Google Sheet
  - [ ] Store chores in SQLite database
  - [ ] Key chores by title (as specified in requirements)
  - [ ] Handle errors gracefully (log and retry)
  - [ ] Send previous day's completion stats to Google Sheets

### Chore Stats Tracking
- [ ] Create stats sheet service
  - [ ] Create `src/main/services/chores/ChoreStatsService.ts`
  - [ ] Check for `pi-touch-calendar-chores-stats` spreadsheet
  - [ ] Create stats spreadsheet if it doesn't exist
  - [ ] Define stats format: date, child_name, chore_title, completed (yes/no), completed_at
  - [ ] Implement batch insert of previous day's stats
  - [ ] Add error handling for failed uploads

### Chore Repository
- [ ] Create chore data access layer
  - [ ] Create `src/main/repositories/ChoreRepository.ts`
  - [ ] Implement method to insert daily chores
  - [ ] Implement method to get chores by child and date
  - [ ] Implement method to mark chore as complete
  - [ ] Implement method to get completion stats
  - [ ] Implement method to get previous day's completions

### ✅ Phase 5 Testing Requirements
- [ ] **Unit Tests** - Create `src/main/services/google/__tests__/SheetsService.test.ts`
  - [ ] Test Google Sheets API client initialization
  - [ ] Test list sheets in spreadsheet
  - [ ] Test read sheet data
  - [ ] Test write sheet data
  - [ ] Test create new spreadsheet
  - [ ] Test create new sheet
  - [ ] Test API error handling
  - [ ] Test rate limit handling

- [ ] **Unit Tests** - Create `src/main/services/chores/__tests__/ChoreSheetService.test.ts`
  - [ ] Test spreadsheet existence check
  - [ ] Test spreadsheet creation
  - [ ] Test example sheet creation
  - [ ] Test sheet format validation
  - [ ] Test chore sheet parsing (Column A = title, B-H = days)
  - [ ] Test reading all sheets
  - [ ] Test extracting child name from sheet name
  - [ ] Test handling empty cells
  - [ ] Test invalid sheet format handling

- [ ] **Unit Tests** - Create `src/main/services/chores/__tests__/ChoreScheduler.test.ts`
  - [ ] Test scheduling task at 2:00 AM
  - [ ] Test daily chore fetch trigger
  - [ ] Test chore storage in database
  - [ ] Test keying chores by title
  - [ ] Test error handling and retry logic
  - [ ] Test stats upload trigger
  - [ ] Test scheduler state persistence

- [ ] **Unit Tests** - Create `src/main/services/chores/__tests__/ChoreStatsService.test.ts`
  - [ ] Test stats spreadsheet existence check
  - [ ] Test stats spreadsheet creation
  - [ ] Test stats format validation
  - [ ] Test batch insert of completion data
  - [ ] Test stats row format (date, child, chore, completed, time)
  - [ ] Test error handling for failed uploads
  - [ ] Test duplicate prevention

- [ ] **Unit Tests** - Create `src/main/repositories/__tests__/ChoreRepository.test.ts`
  - [ ] Test insert daily chores
  - [ ] Test get chores by child and date
  - [ ] Test get chores for today
  - [ ] Test mark chore as complete
  - [ ] Test mark chore as incomplete
  - [ ] Test get completion stats
  - [ ] Test get previous day's completions
  - [ ] Test chore keying by title

- [ ] **Unit Tests** - Create `src/main/repositories/__tests__/ChildRepository.test.ts`
  - [ ] Test create child
  - [ ] Test read all children
  - [ ] Test read child by ID
  - [ ] Test update child
  - [ ] Test delete child

- [ ] **Integration Tests** - Create `test/integration/chore-sync.spec.ts`
  - [ ] Test chore sheet creation (mocked Google Sheets API)
  - [ ] Test daily chore pull at 2:00 AM (mocked time)
  - [ ] Test chores stored in database
  - [ ] Test stats upload to Google Sheets
  - [ ] Test end-to-end chore lifecycle (pull → complete → upload stats)
  - [ ] Test error recovery in sync process

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify SheetsService has >70% coverage
  - [ ] Verify ChoreSheetService has >70% coverage
  - [ ] Verify ChoreScheduler has >70% coverage
  - [ ] Verify ChoreStatsService has >70% coverage
  - [ ] Verify ChoreRepository has >70% coverage

---

## Phase 6: Chore UI (Week 12-13)

### Chore Page Component
- [ ] Create chore page
  - [ ] Create `src/renderer/pages/ChorePage.tsx`
  - [ ] Add navigation button from calendar to chore page
  - [ ] Add navigation button from chore page back to calendar
  - [ ] Implement child selector (large buttons with names)
  - [ ] Display selected child's name prominently

### Chore List Display
- [ ] Create chore list component
  - [ ] Create `src/renderer/components/ChoreList.tsx`
  - [ ] Display all chores for selected child
  - [ ] Show chore title
  - [ ] Show completion status (checkbox or toggle)
  - [ ] Use large touch-friendly checkboxes
  - [ ] Group completed and incomplete chores
  - [ ] Show completion timestamp for completed chores

### Chore Completion
- [ ] Implement chore completion UI
  - [ ] Add tap handler for chore completion toggle
  - [ ] Call IPC to mark chore complete/incomplete
  - [ ] Update UI immediately (optimistic update)
  - [ ] Show success animation or feedback
  - [ ] Store completion timestamp
  - [ ] Handle errors gracefully

### Multi-Child View
- [ ] Create child switcher
  - [ ] Create child selection component (large avatars or buttons)
  - [ ] Allow switching between children
  - [ ] Persist selected child (session storage)
  - [ ] Show chore counts per child (optional)

### ✅ Phase 6 Testing Requirements
- [ ] **Component Tests** - Create `src/renderer/pages/__tests__/ChorePage.test.tsx`
  - [ ] Test chore page renders
  - [ ] Test navigation from calendar page works
  - [ ] Test navigation back to calendar works
  - [ ] Test child selector displays
  - [ ] Test selected child name displays
  - [ ] Test child switcher works

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/ChoreList.test.tsx`
  - [ ] Test chore list renders
  - [ ] Test chores display for selected child
  - [ ] Test chore title displays
  - [ ] Test completion status displays
  - [ ] Test completed vs incomplete grouping
  - [ ] Test completion timestamp displays
  - [ ] Test empty state (no chores)
  - [ ] Test touch-friendly checkboxes (>44px)

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/ChoreItem.test.tsx`
  - [ ] Test chore item renders
  - [ ] Test checkbox click handler
  - [ ] Test completion toggle
  - [ ] Test optimistic UI update
  - [ ] Test success animation/feedback
  - [ ] Test error handling

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/ChildSwitcher.test.tsx`
  - [ ] Test child switcher renders
  - [ ] Test all children display
  - [ ] Test child selection works
  - [ ] Test selected child highlighting
  - [ ] Test session persistence
  - [ ] Test chore counts display (if implemented)
  - [ ] Test large touch targets (>44px)

- [ ] **Integration Tests** - Create `test/integration/chore-ui.spec.ts`
  - [ ] Test navigation to chore page
  - [ ] Test child selection
  - [ ] Test chore list loads for child
  - [ ] Test marking chore as complete
  - [ ] Test marking chore as incomplete
  - [ ] Test switching between children
  - [ ] Test chore completion persists
  - [ ] Test error states display correctly

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify ChorePage has >70% coverage
  - [ ] Verify ChoreList has >70% coverage
  - [ ] Verify ChoreItem has >70% coverage
  - [ ] Verify ChildSwitcher has >70% coverage

---

## Phase 7: UI/UX Polish (Week 14-15)

### Theme & Styling
- [ ] Implement pink/rose gold theme
  - [ ] Create CSS variables for theme colors
  - [ ] Create `src/renderer/styles/theme.css`
  - [ ] Apply primary color: pink/rose gold
  - [ ] Choose complementary accent colors
  - [ ] Ensure high contrast for readability
  - [ ] Test color palette on actual display

### Touch Optimization
- [ ] Optimize all touch targets
  - [ ] Ensure all buttons minimum 44x44px
  - [ ] Increase padding around interactive elements
  - [ ] Add visual press states (hover/active)
  - [ ] Test all interactions on touch screen
  - [ ] Add touch ripple effects (optional)

### Button-Based Navigation
- [ ] Implement large navigation buttons
  - [ ] Create navigation bar component
  - [ ] Add large "Calendar" button
  - [ ] Add large "Chores" button
  - [ ] Add Settings/Gear button (smaller, in corner)
  - [ ] Ensure buttons are always visible
  - [ ] Use icons + text for clarity

### Remove Text Input
- [ ] Ensure no open text fields
  - [ ] Remove any text input boxes from UI
  - [ ] Replace with button-based selections
  - [ ] Use pickers/dropdowns where needed
  - [ ] Configuration via Google Sheets only (as per requirements)

### Visual Feedback
- [ ] Add loading indicators
  - [ ] Create loading spinner component
  - [ ] Show during calendar sync
  - [ ] Show during chore loading
  - [ ] Show during Google Sheets operations

- [ ] Add success/error notifications
  - [ ] Create toast notification component
  - [ ] Show success messages for actions
  - [ ] Show error messages gracefully
  - [ ] Auto-dismiss after timeout

### ✅ Phase 7 Testing Requirements
- [ ] **Unit Tests** - Create `src/renderer/styles/__tests__/theme.test.ts`
  - [ ] Test theme variables are defined
  - [ ] Test primary color is pink/rose gold
  - [ ] Test accent colors are complementary
  - [ ] Test contrast ratios meet accessibility standards
  - [ ] Test color values are valid CSS

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/Button.test.tsx`
  - [ ] Test button renders
  - [ ] Test button text displays
  - [ ] Test button click handler
  - [ ] Test button size meets minimum (44x44px)
  - [ ] Test button press/active states
  - [ ] Test button disabled state
  - [ ] Test button variants (primary, secondary, etc.)

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/NavigationBar.test.tsx`
  - [ ] Test navigation bar renders
  - [ ] Test all navigation buttons display
  - [ ] Test navigation button sizes (large, touch-friendly)
  - [ ] Test navigation button clicks
  - [ ] Test active page highlighting
  - [ ] Test icons + text display

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/LoadingSpinner.test.tsx`
  - [ ] Test spinner renders
  - [ ] Test spinner animation
  - [ ] Test spinner size variations
  - [ ] Test spinner with message

- [ ] **Component Tests** - Create `src/renderer/components/__tests__/Toast.test.tsx`
  - [ ] Test toast renders
  - [ ] Test success toast variant
  - [ ] Test error toast variant
  - [ ] Test info toast variant
  - [ ] Test toast auto-dismiss
  - [ ] Test toast manual dismiss
  - [ ] Test multiple toasts queue

- [ ] **Visual Regression Tests** (Optional)
  - [ ] Create Playwright visual tests for theme consistency
  - [ ] Test touch target sizes across all components
  - [ ] Test color contrast on actual display
  - [ ] Test button press states are visible

- [ ] **Integration Tests** - Create `test/integration/ui-polish.spec.ts`
  - [ ] Test theme applied across all pages
  - [ ] Test navigation between pages works
  - [ ] Test loading states appear during operations
  - [ ] Test success notifications appear after actions
  - [ ] Test error notifications appear on failures
  - [ ] Test all interactive elements are touchable (>44px)

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify all UI components have >70% coverage
  - [ ] Verify theme utilities have test coverage

---

## Phase 8: Kiosk Mode & Deployment (Week 16-17)

### Kiosk Mode Configuration
- [ ] Configure fullscreen mode
  - [ ] Update `src/main/window-manager.ts` to create fullscreen window
  - [ ] Remove window decorations (frameless)
  - [ ] Disable menu bar
  - [ ] Prevent window resizing
  - [ ] Test on Raspberry Pi

### System Integration
- [ ] Create systemd service
  - [ ] Create `pi-touch-calendar.service` file
  - [ ] Configure auto-start on boot
  - [ ] Set restart policy (always restart)
  - [ ] Configure environment variables
  - [ ] Test service installation

### Environment Variables
- [ ] Document environment variables
  - [ ] Add `PI_CHORE_SHEET_NAME` (default: pi-touch-calendar-chores)
  - [ ] Add `PI_CHORE_RESULTS_SHEET_NAME` (default: pi-touch-calendar-chores-stats)
  - [ ] Create `.env.example` file
  - [ ] Update README with environment setup

### Raspberry Pi Packaging
- [ ] Create ARM build configuration
  - [ ] Update build scripts for ARM64
  - [ ] Test build on Raspberry Pi
  - [ ] Create installer script
  - [ ] Package application with dependencies
  - [ ] Create installation instructions

### ✅ Phase 8 Testing Requirements
- [ ] **Unit Tests** - Create `src/main/config/__tests__/KioskConfig.test.ts`
  - [ ] Test kiosk mode settings
  - [ ] Test fullscreen configuration
  - [ ] Test window decoration settings
  - [ ] Test menu bar visibility
  - [ ] Test shortcut prevention settings

- [ ] **Unit Tests** - Create `src/main/utils/__tests__/environment.test.ts`
  - [ ] Test environment variable reading
  - [ ] Test PI_CHORE_SHEET_NAME default value
  - [ ] Test PI_CHORE_RESULTS_SHEET_NAME default value
  - [ ] Test environment variable overrides

- [ ] **Integration Tests** - Create `test/integration/kiosk-mode.spec.ts`
  - [ ] Test app launches in fullscreen mode
  - [ ] Test window is borderless
  - [ ] Test menu bar is hidden
  - [ ] Test system shortcuts are disabled
  - [ ] Test app cannot be closed accidentally
  - [ ] Test right-click context menu is disabled

- [ ] **System Integration Tests** (Manual on Raspberry Pi)
  - [ ] Test systemd service starts on boot
  - [ ] Test app auto-starts after reboot
  - [ ] Test app restarts after crash
  - [ ] Test environment variables load correctly
  - [ ] Test app runs without user login

- [ ] **Build Tests**
  - [ ] Test ARM64 build completes successfully
  - [ ] Test build output size is reasonable
  - [ ] Test all dependencies are included
  - [ ] Test installer script works
  - [ ] Test app runs on Raspberry Pi OS

- [ ] **Coverage Verification**
  - [ ] Run coverage report: `npm run test:coverage`
  - [ ] Verify KioskConfig has >70% coverage
  - [ ] Verify environment utilities have test coverage

---

## Phase 9: Documentation & Testing (Week 18)

### User Documentation
- [ ] Create setup guide
  - [ ] Document Google Cloud project setup
  - [ ] Document OAuth credential creation
  - [ ] Document enabling Google APIs (Calendar, Sheets, Drive)
  - [ ] Add screenshots for each step
  - [ ] Include troubleshooting section

### README Updates
- [ ] Update README.md
  - [ ] Add project overview
  - [ ] Add feature list
  - [ ] Add installation instructions
  - [ ] Add Raspberry Pi setup instructions
  - [ ] Add Google OAuth setup instructions
  - [ ] Add configuration documentation
  - [ ] Add screenshots of UI

### Testing
- [ ] Create integration tests
  - [ ] Test pincode authentication flow
  - [ ] Test Google OAuth flow (mocked)
  - [ ] Test calendar sync
  - [ ] Test chore loading and completion
  - [ ] Test navigation between pages
  - [ ] Test on actual Raspberry Pi hardware

### Manual Testing
- [ ] Test complete user flow
  - [ ] First-time setup (pincode creation)
  - [ ] Google OAuth authentication (QR code)
  - [ ] Calendar display and refresh
  - [ ] Calendar settings (enable/disable calendars)
  - [ ] Chore page navigation
  - [ ] Chore completion
  - [ ] Daily chore sync (scheduled task)
  - [ ] Stats upload to Google Sheets

### ✅ Phase 9 Testing Requirements
- [ ] **End-to-End Tests** - Create `test/e2e/complete-workflow.spec.ts`
  - [ ] Test complete first-time setup workflow
  - [ ] Test pincode creation and login
  - [ ] Test Google OAuth flow (QR code scan)
  - [ ] Test calendar page loads after authentication
  - [ ] Test navigate to chore page
  - [ ] Test complete a chore
  - [ ] Test navigate back to calendar
  - [ ] Test logout and re-login

- [ ] **End-to-End Tests** - Create `test/e2e/daily-workflow.spec.ts`
  - [ ] Test app startup (skip pincode with valid token)
  - [ ] Test calendar displays today's events
  - [ ] Test tomorrow's schedule displays
  - [ ] Test navigate to next day
  - [ ] Test navigate back to today
  - [ ] Test open calendar settings
  - [ ] Test disable a calendar
  - [ ] Test save and see updated events
  - [ ] Test manual refresh

- [ ] **End-to-End Tests** - Create `test/e2e/chore-workflow.spec.ts`
  - [ ] Test navigate to chore page
  - [ ] Test select a child
  - [ ] Test view child's chores
  - [ ] Test mark chore as complete
  - [ ] Test mark chore as incomplete
  - [ ] Test switch to another child
  - [ ] Test stats are uploaded (mocked time)

- [ ] **Accessibility Tests**
  - [ ] Test keyboard navigation works
  - [ ] Test tab order is logical
  - [ ] Test focus indicators are visible
  - [ ] Test screen reader labels (ARIA)
  - [ ] Test color contrast meets WCAG AA standards

- [ ] **Performance Tests**
  - [ ] Test app startup time (<3 seconds)
  - [ ] Test calendar sync performance
  - [ ] Test UI responsiveness (60fps)
  - [ ] Test memory usage (< 200MB)
  - [ ] Test database query performance

- [ ] **Cross-Device Tests** (Manual)
  - [ ] Test on Raspberry Pi 4
  - [ ] Test on Raspberry Pi 5
  - [ ] Test with official touchscreen
  - [ ] Test with third-party touchscreen
  - [ ] Test at different screen resolutions

- [ ] **Final Coverage Report**
  - [ ] Run full test suite: `npm run test`
  - [ ] Generate coverage report: `npm run test:coverage`
  - [ ] Verify overall coverage >70%
  - [ ] Document any uncovered edge cases
  - [ ] Create coverage badge for README

---

## Future Enhancements (Post-MVP)

### Advanced Calendar Features
- [ ] Week view
- [ ] Month view
- [ ] Event details modal
- [ ] Multi-account support (multiple Google accounts)

### Advanced Chore Features
- [ ] Chore rewards system
- [ ] Chore streaks tracking
- [ ] Custom chore creation via UI (requires text input - conflicts with requirements)
- [ ] Chore templates

### Additional Features
- [ ] Dark mode / theme options
- [ ] Weather widget
- [ ] Birthday reminders
- [ ] Family photos slideshow mode
- [ ] Voice announcements

### Performance Optimizations
- [ ] Optimize calendar sync (delta sync)
- [ ] Reduce memory footprint
- [ ] Optimize database queries
- [ ] Lazy load UI components

---

## Notes & Considerations

### Technical Decisions Needed
1. **SQLite ORM**: Choose between better-sqlite3 (raw SQL) or Prisma (type-safe ORM)
2. **React State Management**: Choose between Context API, Redux Toolkit, or Zustand
3. **Date Library**: Use date-fns or Day.js for date manipulation
4. **Encryption**: Choose encryption library for OAuth token storage (node-forge, crypto-js)

### Alignment with REQUIREMENTS.md
- ✅ Pincode authentication (no username)
- ✅ Config stored in ~/.config/pi-touch-calendar/
- ✅ Google OAuth with QR code
- ✅ Authentication logging with 90-day retention
- ✅ Calendar page as landing (if authenticated)
- ✅ Tomorrow's schedule sidebar
- ✅ Carousel navigation for calendar
- ✅ Gear icon for calendar settings
- ✅ Chore page with Google Sheets integration
- ✅ Daily chore pull at 2:00 AM
- ✅ SQLite for chore tracking
- ✅ Stats pushed to separate Google Sheet
- ✅ Touch-first UI with large buttons
- ✅ Pink/rose gold theme
- ✅ No text input (configuration via Google Sheets)
- ✅ Environment variables for sheet names

### Key Risks & Mitigations
1. **Risk**: Google OAuth on localhost may not work on mobile
   - **Mitigation**: Use local network IP, ensure both devices on same network
2. **Risk**: Scheduled task at 2:00 AM may fail silently
   - **Mitigation**: Add logging, error notifications, manual trigger option
3. **Risk**: Google Sheets API rate limits
   - **Mitigation**: Implement exponential backoff, batch operations
4. **Risk**: SQLite database corruption
   - **Mitigation**: Regular backups, write-ahead logging (WAL mode)

### Current State vs Requirements
**Implemented (15%)**:
- Electron + TypeScript + Vite build system
- Window management
- IPC communication infrastructure
- Placeholder authentication (wrong type - username/password)

**Missing (85%)**:
- Pincode authentication system
- Google OAuth integration
- Calendar UI and service
- Chore management system
- Google Sheets integration
- Touch-optimized UI
- Pink/rose gold theme
- Kiosk mode configuration
- Raspberry Pi packaging

---

**Estimated Timeline**: 18 weeks (4-5 months) to complete MVP
**Next Immediate Steps**:
1. Install React and dependencies (Phase 1, Critical Blockers)
2. Set up testing infrastructure (Vitest + Playwright)
3. Implement pincode authentication (Phase 1)
4. Create config directory handler (Phase 1)

---

## 📊 Testing Summary

### Total Testing Requirements

**Unit Tests**: ~150+ test files across all phases
- Configuration and utilities: ~15 test files
- Services (Auth, Google APIs, Chores): ~25 test files
- Repositories and database: ~10 test files
- React components: ~30 test files
- UI components and utilities: ~15 test files

**Integration Tests**: ~15+ test specs
- Authentication flow: 2 specs
- OAuth flow: 2 specs
- Calendar sync: 2 specs
- Calendar UI: 1 spec
- Chore sync: 2 specs
- Chore UI: 1 spec
- UI polish: 1 spec
- Kiosk mode: 1 spec

**End-to-End Tests**: ~3 comprehensive workflows
- Complete first-time setup
- Daily usage workflow
- Chore management workflow

**Manual Tests**: Hardware and cross-device testing
- Raspberry Pi 4 and 5
- Various touchscreens
- Performance and accessibility

### Test Coverage Goals

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Services | >70% | Critical |
| Repositories | >70% | Critical |
| Utilities | >70% | High |
| React Components | >70% | High |
| Integration Tests | 100% of major features | Critical |

### Testing Tools

- **Unit Testing**: Vitest + @testing-library/react
- **Integration Testing**: Playwright (Electron)
- **Coverage Reporting**: Vitest coverage (c8/istanbul)
- **E2E Testing**: Playwright
- **Visual Testing**: Playwright screenshots (optional)

### Testing Best Practices

1. **Write tests BEFORE or ALONGSIDE implementation** (TDD/BDD approach)
2. **Every PR must include tests** for new features
3. **Run tests before committing**: `npm run test`
4. **Check coverage**: `npm run test:coverage`
5. **Integration tests must use mocked Google APIs** (no real API calls in tests)
6. **Use test fixtures** for consistent test data
7. **Test error cases** not just happy paths
8. **Keep tests isolated** (no dependencies between tests)

---

**Last Updated**: 2025-11-30
