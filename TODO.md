# Pi Touch Calendar - TODO List

## Current Status
The application has the basic Electron + Vite + TypeScript foundation with a login system and window management infrastructure. This TODO list tracks all remaining features and improvements needed to reach the full vision outlined in AI_DEVELOPMENT_PROMPT.md.

## 🎯 Key Principles

**Testing Requirements:**
- ✅ Every feature MUST include unit tests
- ✅ Every feature MUST include at least one Playwright integration test
- ✅ Minimum 70% code coverage target
- ✅ Test runner: Vitest (unit) + Playwright (integration/E2E)

**Architecture Standards:**
- 📁 Follow the standardized file structure (Phase 0)
- 🔧 Separation of concerns: Main process / Renderer / Database layers
- 🗃️ Repository pattern for all database operations
- 🎨 Component-based UI architecture
- 🔌 Clear IPC communication boundaries

**File Organization:**
```
src/
├── main/          # Main process (Electron)
│   ├── services/  # Business logic
│   ├── database/  # Data layer
│   └── ipc/       # IPC handlers
├── renderer/      # UI (React)
│   ├── components/
│   ├── pages/
│   └── store/
└── shared/        # Shared types/utils
```

---

## Phase 0: Application Restructure & Testing Setup

### File Structure Reorganization
- [ ] Restructure application to follow standard Electron architecture patterns
  - [ ] Create new directory structure:
    ```
    src/
    ├── main/                    # Main process code
    │   ├── index.ts            # Main entry point
    │   ├── windows/            # Window management
    │   │   ├── MainWindow.ts
    │   │   └── LoginWindow.ts
    │   ├── services/           # Business logic services
    │   │   ├── auth/
    │   │   │   ├── AuthService.ts
    │   │   │   └── __tests__/
    │   │   ├── calendar/
    │   │   │   ├── CalendarService.ts
    │   │   │   ├── GoogleCalendarSync.ts
    │   │   │   └── __tests__/
    │   │   ├── tasks/
    │   │   │   ├── TaskService.ts
    │   │   │   └── __tests__/
    │   │   └── rewards/
    │   │       ├── RewardService.ts
    │   │       └── __tests__/
    │   ├── database/           # Database layer
    │   │   ├── connection.ts
    │   │   ├── migrations/
    │   │   ├── models/
    │   │   │   ├── User.ts
    │   │   │   ├── Profile.ts
    │   │   │   ├── Task.ts
    │   │   │   ├── Event.ts
    │   │   │   └── Reward.ts
    │   │   ├── repositories/
    │   │   │   ├── UserRepository.ts
    │   │   │   ├── TaskRepository.ts
    │   │   │   ├── EventRepository.ts
    │   │   │   └── __tests__/
    │   │   └── seeds/
    │   ├── ipc/                # IPC handlers
    │   │   ├── handlers/
    │   │   │   ├── auth.ts
    │   │   │   ├── calendar.ts
    │   │   │   ├── tasks.ts
    │   │   │   ├── profiles.ts
    │   │   │   └── __tests__/
    │   │   └── channels.ts     # IPC channel constants
    │   ├── utils/              # Utility functions
    │   │   ├── logger.ts
    │   │   ├── encryption.ts
    │   │   ├── validators.ts
    │   │   └── __tests__/
    │   └── config/             # Configuration
    │       ├── constants.ts
    │       ├── database.ts
    │       └── app.ts
    ├── renderer/               # Renderer process code
    │   ├── index.tsx           # React entry point
    │   ├── App.tsx             # Root component
    │   ├── components/         # Reusable UI components
    │   │   ├── common/
    │   │   │   ├── Button/
    │   │   │   │   ├── Button.tsx
    │   │   │   │   ├── Button.module.css
    │   │   │   │   └── __tests__/
    │   │   │   ├── Modal/
    │   │   │   └── Input/
    │   │   ├── calendar/
    │   │   │   ├── MonthView/
    │   │   │   ├── WeekView/
    │   │   │   ├── EventCard/
    │   │   │   └── __tests__/
    │   │   ├── tasks/
    │   │   │   ├── TaskList/
    │   │   │   ├── TaskCard/
    │   │   │   ├── TaskForm/
    │   │   │   └── __tests__/
    │   │   └── rewards/
    │   │       ├── RewardAnimation/
    │   │       ├── AchievementBadge/
    │   │       └── __tests__/
    │   ├── pages/              # Page components
    │   │   ├── Login/
    │   │   │   ├── Login.tsx
    │   │   │   ├── Login.module.css
    │   │   │   └── __tests__/
    │   │   ├── Calendar/
    │   │   ├── Tasks/
    │   │   ├── Profiles/
    │   │   └── Settings/
    │   ├── hooks/              # Custom React hooks
    │   │   ├── useCalendar.ts
    │   │   ├── useTasks.ts
    │   │   ├── useAuth.ts
    │   │   └── __tests__/
    │   ├── store/              # State management
    │   │   ├── index.ts
    │   │   ├── slices/
    │   │   │   ├── authSlice.ts
    │   │   │   ├── calendarSlice.ts
    │   │   │   ├── taskSlice.ts
    │   │   │   └── __tests__/
    │   │   └── middleware/
    │   ├── services/           # Renderer-side API calls
    │   │   ├── api.ts
    │   │   └── ipc.ts
    │   ├── styles/             # Global styles
    │   │   ├── globals.css
    │   │   ├── variables.css
    │   │   └── themes/
    │   ├── utils/              # Renderer utilities
    │   │   ├── dateHelpers.ts
    │   │   ├── formatters.ts
    │   │   └── __tests__/
    │   └── types/              # TypeScript types
    │       ├── calendar.ts
    │       ├── task.ts
    │       └── user.ts
    ├── preload/                # Preload scripts
    │   ├── index.ts
    │   └── api.ts
    ├── shared/                 # Shared between main and renderer
    │   ├── types/
    │   ├── constants/
    │   └── utils/
    └── assets/                 # Static assets
        ├── icons/
        ├── sounds/
        └── images/
    ```
  - [ ] Migrate existing code to new structure
    - [ ] Move main.ts logic to src/main/index.ts
    - [ ] Move window-manager.ts to src/main/windows/
    - [ ] Refactor login.ts to src/main/windows/LoginWindow.ts
    - [ ] Move preload.ts to src/preload/index.ts
    - [ ] Move renderer.ts to src/renderer/index.tsx
    - [ ] Move common.ts to src/shared/constants/
  - [ ] Update all import paths throughout the codebase
  - [ ] Update Vite config files for new structure
  - [ ] Update tsconfig.json with path aliases
  - [ ] Test that application still builds and runs

### Testing Infrastructure Setup
- [ ] Install and configure testing frameworks
  - [ ] Install Vitest for unit testing
  - [ ] Install @testing-library/react for component testing
  - [ ] Install Playwright for E2E/integration testing
  - [ ] Install @playwright/test for Electron testing
  - [ ] Configure test scripts in package.json

- [ ] Set up Vitest configuration
  - [ ] Create vitest.config.ts
  - [ ] Configure coverage reporting (c8/istanbul)
  - [ ] Set up test globals and environment
  - [ ] Configure DOM environment for React tests
  - [ ] Add test:unit script

- [ ] Set up Playwright configuration
  - [ ] Create playwright.config.ts for Electron
  - [ ] Configure Playwright for Electron app testing
  - [ ] Set up test fixtures for app launch
  - [ ] Configure screenshot/video capture on failure
  - [ ] Add test:integration script
  - [ ] Create example E2E test for login flow

- [ ] Create testing utilities
  - [ ] Create test/utils/setup.ts for global test setup
  - [ ] Create database test helpers (in-memory DB)
  - [ ] Create mock IPC helpers
  - [ ] Create component render helpers
  - [ ] Create test data factories/fixtures

- [ ] Set up CI/CD test integration (optional)
  - [ ] Add GitHub Actions workflow for tests
  - [ ] Configure test coverage reporting
  - [ ] Add test status badges to README

### Testing Standards Documentation
- [ ] Create TESTING.md guide
  - [ ] Document unit test patterns
  - [ ] Document integration test patterns
  - [ ] Document test file naming conventions
  - [ ] Provide examples of good tests
  - [ ] Define coverage targets (70% minimum)

---

## Phase 1: Core Infrastructure & Data Layer

### Database & Storage
- [ ] Set up SQLite database infrastructure
  - [ ] Install and configure better-sqlite3 or similar SQLite library
  - [ ] Create database schema for users, profiles, tasks, settings
  - [ ] Implement database migration system in src/main/database/migrations/
  - [ ] Add encrypted storage for sensitive data (OAuth tokens)
  - [ ] Create database service layer in src/main/database/
  - [ ] Create repository pattern in src/main/database/repositories/
  - [ ] Add IPC handlers for database operations in src/main/ipc/handlers/
  - [ ] **Unit Tests:**
    - [ ] Test database connection (connection.test.ts)
    - [ ] Test each repository CRUD operation
    - [ ] Test migration system (up/down)
    - [ ] Test encryption/decryption utilities
  - [ ] **Integration Test (Playwright):**
    - [ ] Test full database lifecycle (create, read, update, delete) via app

### User Profile System
- [ ] Enhance user authentication beyond demo system
  - [ ] Create User model in src/main/database/models/User.ts
  - [ ] Create UserRepository in src/main/database/repositories/
  - [ ] Implement AuthService in src/main/services/auth/
  - [ ] Implement secure password storage (bcrypt/argon2)
  - [ ] Add user profile data model (name, avatar, role, preferences)
  - [ ] Create admin vs regular user role system
  - [ ] **Unit Tests:**
    - [ ] Test UserRepository CRUD operations
    - [ ] Test AuthService.login()
    - [ ] Test AuthService.logout()
    - [ ] Test password hashing and verification
    - [ ] Test role-based access control
  - [ ] **Integration Test (Playwright):**
    - [ ] Test complete login flow with valid credentials
    - [ ] Test login failure with invalid credentials
    - [ ] Test logout flow

- [ ] Build profile management UI
  - [ ] Create Profile page in src/renderer/pages/Profiles/
  - [ ] Create ProfileCard component
  - [ ] Create ProfileForm component
  - [ ] Implement profile picture/avatar upload and storage
  - [ ] Create profile switcher interface (large touch-friendly avatars)
  - [ ] Add child-friendly profile switching (no password for non-admin)
  - [ ] Implement guest access mode
  - [ ] Add profile settings page (per-user preferences)
  - [ ] **Unit Tests:**
    - [ ] Test ProfileCard component rendering
    - [ ] Test ProfileForm validation
    - [ ] Test avatar upload functionality
    - [ ] Test profile switcher component
  - [ ] **Integration Test (Playwright):**
    - [ ] Test creating a new profile
    - [ ] Test editing an existing profile
    - [ ] Test switching between profiles
    - [ ] Test avatar upload end-to-end

### State Management
- [ ] Choose and implement state management solution
  - [ ] Evaluate options (Zustand, Redux Toolkit, Context API)
  - [ ] Set up store in src/renderer/store/
  - [ ] Create authSlice in src/renderer/store/slices/
  - [ ] Create calendarSlice for calendar data
  - [ ] Create taskSlice for tasks and rewards
  - [ ] Implement state persistence to localStorage
  - [ ] Add middleware for IPC sync
  - [ ] **Unit Tests:**
    - [ ] Test each slice reducer
    - [ ] Test action creators
    - [ ] Test selectors
    - [ ] Test state persistence
    - [ ] Test middleware logic
  - [ ] **Integration Test (Playwright):**
    - [ ] Test state updates propagate to UI
    - [ ] Test state persists across app restarts

### Logging & Error Handling
- [ ] Implement comprehensive logging system
  - [ ] Add winston logging library
  - [ ] Create Logger utility in src/main/utils/logger.ts
  - [ ] Create log levels (debug, info, warn, error)
  - [ ] Set up log file rotation
  - [ ] Add error boundary components in src/renderer/components/common/ErrorBoundary/
  - [ ] Implement global error handler in main process
  - [ ] Create user-friendly error display component
  - [ ] **Unit Tests:**
    - [ ] Test logger writes to file
    - [ ] Test log rotation
    - [ ] Test different log levels
    - [ ] Test ErrorBoundary component catches errors
  - [ ] **Integration Test (Playwright):**
    - [ ] Test error logging end-to-end
    - [ ] Test UI displays error messages correctly

---

## Phase 2: Google Calendar Integration

### OAuth & Authentication
- [ ] Set up Google Calendar API integration
  - [ ] Create Google Cloud project and enable Calendar API
  - [ ] Configure OAuth 2.0 credentials
  - [ ] Implement OAuth flow in src/main/services/calendar/GoogleOAuthService.ts
  - [ ] Handle OAuth redirects in Electron
  - [ ] Store OAuth tokens securely (encrypted) in database
  - [ ] Add token refresh logic
  - [ ] Implement token expiration handling
  - [ ] **Unit Tests:**
    - [ ] Test OAuth URL generation
    - [ ] Test token exchange flow
    - [ ] Test token refresh logic
    - [ ] Test token expiration detection
    - [ ] Test encrypted token storage/retrieval
  - [ ] **Integration Test (Playwright):**
    - [ ] Test complete OAuth flow (with mocked Google endpoints)
    - [ ] Test token refresh when expired

### Calendar Data Management
- [ ] Build calendar synchronization system
  - [ ] Create Event model in src/main/database/models/Event.ts
  - [ ] Create EventRepository in src/main/database/repositories/
  - [ ] Implement CalendarService in src/main/services/calendar/
  - [ ] Implement GoogleCalendarSync in src/main/services/calendar/
  - [ ] Implement initial calendar fetch (last 30 days, next 90 days)
  - [ ] Add support for multiple Google accounts per user
  - [ ] Build calendar caching system (SQLite storage)
  - [ ] Implement periodic sync (configurable interval, default 15 min)
  - [ ] Add manual refresh option
  - [ ] Handle API rate limits and errors gracefully
  - [ ] Support for recurring events
  - [ ] Support for all-day events
  - [ ] Support for multi-day events
  - [ ] Parse and store event metadata (color, description, location)
  - [ ] **Unit Tests:**
    - [ ] Test EventRepository CRUD operations
    - [ ] Test GoogleCalendarSync.fetchEvents()
    - [ ] Test recurring event parsing
    - [ ] Test all-day event handling
    - [ ] Test multi-day event handling
    - [ ] Test event caching logic
    - [ ] Test sync interval scheduling
    - [ ] Test API rate limit handling
  - [ ] **Integration Test (Playwright):**
    - [ ] Test calendar sync from Google (mocked API)
    - [ ] Test periodic sync updates UI
    - [ ] Test manual refresh button

### Calendar UI Components
- [ ] Create calendar account management UI
  - [ ] Create CalendarSettings page in src/renderer/pages/Settings/
  - [ ] Create AddAccountButton component
  - [ ] Create AccountList component
  - [ ] Implement "Add Google Account" button and flow
  - [ ] List connected accounts
  - [ ] Remove/disconnect account functionality
  - [ ] Account-specific color coding
  - [ ] Calendar source visibility toggles
  - [ ] **Unit Tests:**
    - [ ] Test AddAccountButton component
    - [ ] Test AccountList rendering
    - [ ] Test account removal confirmation
    - [ ] Test visibility toggle state
  - [ ] **Integration Test (Playwright):**
    - [ ] Test adding a Google account
    - [ ] Test removing an account
    - [ ] Test toggling calendar visibility

### Offline Support
- [ ] Implement offline-first architecture
  - [ ] Cache calendar data locally (EventRepository)
  - [ ] Display cached data when offline
  - [ ] Add offline indicator component in UI
  - [ ] Queue changes for sync when connection restored
  - [ ] **Unit Tests:**
    - [ ] Test offline detection
    - [ ] Test loading cached data
    - [ ] Test sync queue mechanism
  - [ ] **Integration Test (Playwright):**
    - [ ] Test app works offline with cached data
    - [ ] Test offline indicator displays
    - [ ] Test sync resumes when online

---

## Phase 3: Calendar Display & Views

### Month View (Priority)
- [ ] Design and implement month calendar view
  - [ ] Create MonthView component in src/renderer/components/calendar/MonthView/
  - [ ] Create DayCell component for grid cells
  - [ ] Create month grid layout (responsive)
  - [ ] Display events in day cells
  - [ ] Handle overflow events (show count, expand on tap)
  - [ ] Color-code events by calendar source
  - [ ] Add current day highlighting
  - [ ] Implement month navigation (prev/next buttons)
  - [ ] Add swipe gestures for month navigation
  - [ ] Display event details on tap
  - [ ] Optimize for touch (large tap targets, min 44x44px)
  - [ ] **Unit Tests:**
    - [ ] Test MonthView renders correct number of days
    - [ ] Test DayCell component displays events
    - [ ] Test overflow event handling
    - [ ] Test current day highlighting
    - [ ] Test month navigation logic
    - [ ] Test event color coding
  - [ ] **Integration Test (Playwright):**
    - [ ] Test month view displays events correctly
    - [ ] Test swipe gesture navigation
    - [ ] Test tapping event opens details
    - [ ] Test month navigation buttons work

### Week View
- [ ] Design and implement week calendar view
  - [ ] Create WeekView component in src/renderer/components/calendar/WeekView/
  - [ ] Create timeline-based week view
  - [ ] Show all family members in columns
  - [ ] Display events with time blocks
  - [ ] Add horizontal scroll/swipe between weeks
  - [ ] Show all-day events in dedicated section
  - [ ] Add time markers (hourly grid)
  - [ ] Implement event details modal on tap
  - [ ] **Unit Tests:**
    - [ ] Test WeekView renders 7 days
    - [ ] Test time block calculations
    - [ ] Test multi-user column layout
    - [ ] Test all-day event section
    - [ ] Test week navigation logic
  - [ ] **Integration Test (Playwright):**
    - [ ] Test week view displays correctly
    - [ ] Test swipe between weeks
    - [ ] Test event time blocks render accurately

### Agenda/List View
- [ ] Create agenda/list view
  - [ ] Create AgendaView component in src/renderer/components/calendar/AgendaView/
  - [ ] Display events chronologically
  - [ ] Group by day with date headers
  - [ ] Show upcoming events (next 7-30 days)
  - [ ] Add search/filter functionality
  - [ ] Implement infinite scroll or pagination
  - [ ] **Unit Tests:**
    - [ ] Test AgendaView event grouping
    - [ ] Test date header rendering
    - [ ] Test search/filter logic
    - [ ] Test pagination logic
  - [ ] **Integration Test (Playwright):**
    - [ ] Test agenda view displays events
    - [ ] Test search functionality
    - [ ] Test scrolling loads more events

### View Switching
- [ ] Add view mode switcher
  - [ ] Create ViewSwitcher component
  - [ ] Create toggle between month/week/agenda views
  - [ ] Save user's preferred view to preferences
  - [ ] Smooth transitions between views
  - [ ] Touch-friendly view selector (large buttons)
  - [ ] **Unit Tests:**
    - [ ] Test ViewSwitcher component
    - [ ] Test view preference persistence
    - [ ] Test view transitions
  - [ ] **Integration Test (Playwright):**
    - [ ] Test switching between all three views
    - [ ] Test preferred view loads on app start

### Event Details & Interaction
- [ ] Build event detail modal/panel
  - [ ] Create EventDetail component in src/renderer/components/calendar/EventDetail/
  - [ ] Display full event information
  - [ ] Show event time, date, location, description
  - [ ] Display calendar source and color
  - [ ] Add "Open in Google Calendar" link (optional)
  - [ ] Support for recurring event information
  - [ ] **Unit Tests:**
    - [ ] Test EventDetail renders all fields
    - [ ] Test recurring event display
    - [ ] Test external link generation
  - [ ] **Integration Test (Playwright):**
    - [ ] Test opening event details from calendar
    - [ ] Test closing event details modal

---

## Phase 4: Task Management System

### Task Data Model & Storage
- [ ] Design task database schema
  - [ ] Create Task model in src/main/database/models/Task.ts
  - [ ] Create TaskRepository in src/main/database/repositories/
  - [ ] Task table (id, title, description, assigned_to, etc.)
  - [ ] Recurrence rules (daily, weekly, custom cron-like)
  - [ ] Task categories and tags
  - [ ] Completion history tracking
  - [ ] Create database migrations
  - [ ] **Unit Tests:**
    - [ ] Test TaskRepository CRUD operations
    - [ ] Test recurrence rule parsing
    - [ ] Test completion history queries
  - [ ] **Integration Test (Playwright):**
    - [ ] Test task persistence end-to-end

### Task CRUD Operations
- [ ] Implement task creation
  - [ ] Create TaskService in src/main/services/tasks/
  - [ ] Create TaskForm component in src/renderer/components/tasks/TaskForm/
  - [ ] Create task form/modal (touch-optimized)
  - [ ] Task title, description fields
  - [ ] Assign to family member(s)
  - [ ] Set recurrence pattern (UI picker)
  - [ ] Set category/color
  - [ ] Add optional due time
  - [ ] Set age-appropriateness indicator
  - [ ] **Unit Tests:**
    - [ ] Test TaskService.createTask()
    - [ ] Test TaskForm validation
    - [ ] Test recurrence picker component
  - [ ] **Integration Test (Playwright):**
    - [ ] Test creating a new task through UI

- [ ] Implement task editing
  - [ ] Create edit functionality in TaskService
  - [ ] Edit existing task details
  - [ ] Update recurrence patterns
  - [ ] Reassign tasks
  - [ ] **Unit Tests:**
    - [ ] Test TaskService.updateTask()
    - [ ] Test edit form pre-population
  - [ ] **Integration Test (Playwright):**
    - [ ] Test editing an existing task

- [ ] Implement task deletion
  - [ ] Delete single task
  - [ ] Delete recurring series
  - [ ] Soft delete with recovery option
  - [ ] **Unit Tests:**
    - [ ] Test TaskService.deleteTask()
    - [ ] Test soft delete logic
  - [ ] **Integration Test (Playwright):**
    - [ ] Test deleting a task with confirmation

### Task Display & Organization
- [ ] Create task list/board view
  - [ ] Create TaskList component in src/renderer/components/tasks/TaskList/
  - [ ] Create TaskCard component
  - [ ] Display tasks for current user/profile
  - [ ] Group by category or due date
  - [ ] Show completion status
  - [ ] Filter by assigned person
  - [ ] Sort options (due date, priority, category)
  - [ ] Today's tasks highlight
  - [ ] **Unit Tests:**
    - [ ] Test TaskList rendering
    - [ ] Test filtering logic
    - [ ] Test sorting logic
    - [ ] Test grouping logic
  - [ ] **Integration Test (Playwright):**
    - [ ] Test task list displays all tasks
    - [ ] Test filtering and sorting work

### Task Completion Tracking
- [ ] Implement task completion system
  - [ ] Add completion methods to TaskService
  - [ ] Touch-friendly checkboxes/toggles
  - [ ] Log completion time and user
  - [ ] Handle recurring task instances
  - [ ] Create next instance on completion
  - [ ] Show progress bars for multi-step tasks
  - [ ] Weekly/monthly completion statistics
  - [ ] **Unit Tests:**
    - [ ] Test TaskService.completeTask()
    - [ ] Test recurring instance creation
    - [ ] Test completion statistics calculation
  - [ ] **Integration Test (Playwright):**
    - [ ] Test completing a task through UI
    - [ ] Test recurring task creates next instance

### Task Notifications & Reminders
- [ ] Build notification system
  - [ ] Create NotificationService in src/main/services/notifications/
  - [ ] Task due reminders (system notifications)
  - [ ] Overdue task indicators
  - [ ] Daily task summary notification
  - [ ] In-app notification center component
  - [ ] Notification preferences per user
  - [ ] **Unit Tests:**
    - [ ] Test NotificationService.scheduleReminder()
    - [ ] Test notification trigger logic
    - [ ] Test notification preferences
  - [ ] **Integration Test (Playwright):**
    - [ ] Test task reminder appears
    - [ ] Test notification preferences save

---

## Phase 5: Visual Reward System

### Reward Infrastructure
- [ ] Design reward data model
  - [ ] Create Reward model in src/main/database/models/Reward.ts
  - [ ] Create RewardRepository in src/main/database/repositories/
  - [ ] Points/stars system schema
  - [ ] Badges/achievements database
  - [ ] User reward history
  - [ ] Weekly/monthly goals tracking
  - [ ] **Unit Tests:**
    - [ ] Test RewardRepository operations
    - [ ] Test point calculation logic
    - [ ] Test achievement criteria checking
  - [ ] **Integration Test (Playwright):**
    - [ ] Test reward data persists correctly

### Completion Animations
- [ ] Create celebration animations
  - [ ] Create RewardAnimation component in src/renderer/components/rewards/RewardAnimation/
  - [ ] Create RewardService in src/main/services/rewards/
  - [ ] Confetti/star burst animation on task completion
  - [ ] Sound effects library (child-appropriate) in src/assets/sounds/
  - [ ] Particle effects (CSS/Canvas/SVG)
  - [ ] Randomized celebration variations
  - [ ] +Points animation flying to user avatar
  - [ ] Smooth, 60fps performance
  - [ ] **Unit Tests:**
    - [ ] Test animation component renders
    - [ ] Test sound playback logic
    - [ ] Test particle generation
  - [ ] **Integration Test (Playwright):**
    - [ ] Test animation plays on task completion
    - [ ] Test animation performance (60fps)

### Points & Achievement System
- [ ] Implement points accumulation
  - [ ] Award points for task completion in RewardService
  - [ ] Different point values by task difficulty
  - [ ] Bonus points for streaks
  - [ ] Weekly/monthly point goals
  - [ ] Points leaderboard (family-friendly competition)
  - [ ] **Unit Tests:**
    - [ ] Test RewardService.awardPoints()
    - [ ] Test streak calculation
    - [ ] Test point multipliers
    - [ ] Test leaderboard sorting
  - [ ] **Integration Test (Playwright):**
    - [ ] Test points awarded on task complete
    - [ ] Test leaderboard updates

- [ ] Create badge/achievement system
  - [ ] Create AchievementBadge component
  - [ ] Design achievement criteria (streaks, totals, special tasks)
  - [ ] Create badge artwork/icons in src/assets/icons/
  - [ ] Achievement unlock animations
  - [ ] Achievement gallery/collection view
  - [ ] Share achievements (optional)
  - [ ] **Unit Tests:**
    - [ ] Test achievement unlock logic
    - [ ] Test badge rendering
    - [ ] Test achievement criteria
  - [ ] **Integration Test (Playwright):**
    - [ ] Test achievement unlocks
    - [ ] Test achievement gallery displays

### Reward Dashboard
- [ ] Build rewards visualization UI
  - [ ] Create RewardDashboard page in src/renderer/pages/Rewards/
  - [ ] Current points display
  - [ ] Progress toward goals (visual progress bars)
  - [ ] Recent achievements showcase
  - [ ] Weekly summary view
  - [ ] Monthly summary view
  - [ ] Motivational messages and encouragement
  - [ ] **Unit Tests:**
    - [ ] Test RewardDashboard component
    - [ ] Test progress bar calculations
    - [ ] Test summary data aggregation
  - [ ] **Integration Test (Playwright):**
    - [ ] Test dashboard displays correct data
    - [ ] Test weekly/monthly views switch

---

## Phase 6: Touchscreen UI/UX Optimization

### Touch Interaction Standards
- [ ] Ensure all touch targets meet minimum size (44x44px)
- [ ] Implement visual feedback for all interactions
  - [ ] Press/active states for buttons
  - [ ] Ripple effects or highlights
  - [ ] Haptic feedback (if supported)

### Gesture Support
- [ ] Add swipe gestures
  - [ ] Swipe left/right for navigation (days, weeks, months)
  - [ ] Pull-to-refresh for calendar sync
  - [ ] Swipe to dismiss modals
  - [ ] Pinch to zoom (optional, for calendar views)

### Typography & Readability
- [ ] Optimize fonts for readability
  - [ ] Large, easy-to-read font sizes
  - [ ] High contrast text
  - [ ] Font size adjustment setting
  - [ ] Support for different reading distances

### Responsive Layout
- [ ] Support various screen sizes
  - [ ] Landscape orientation (primary)
  - [ ] Portrait orientation support
  - [ ] Responsive grid system
  - [ ] Adapt to 1920x1200 and other common resolutions
  - [ ] Test on actual Raspberry Pi touchscreen

### Visual Design System
- [ ] Create consistent design system
  - [ ] Color palette (family-friendly, high contrast)
  - [ ] Button styles and variants
  - [ ] Card/panel components
  - [ ] Modal/dialog styles
  - [ ] Icon library
  - [ ] Loading states and skeletons
  - [ ] Empty states
  - [ ] Color-blind friendly palettes option

---

## Phase 7: Kiosk Mode & Raspberry Pi Deployment

### Kiosk Configuration
- [ ] Configure Electron for kiosk mode
  - [ ] Fullscreen borderless window
  - [ ] Disable system shortcuts (Alt+Tab, etc.)
  - [ ] Prevent accidental app exit
  - [ ] Hide cursor after inactivity (optional)
  - [ ] Disable right-click context menu
  - [ ] Disable text selection (optional)

### Admin Access
- [ ] Implement hidden admin access
  - [ ] Secret gesture/tap sequence to unlock settings
  - [ ] Admin password prompt
  - [ ] Settings/configuration panel
  - [ ] App exit option (admin only)
  - [ ] Debug mode toggle

### Auto-start & System Integration
- [ ] Set up auto-start on boot
  - [ ] Create systemd service file
  - [ ] Configure autostart for Raspberry Pi OS
  - [ ] Handle graceful restarts
  - [ ] Auto-recovery from crashes

### Screen Management
- [ ] Implement screen wake/sleep
  - [ ] Scheduled screen sleep times
  - [ ] Wake on touch
  - [ ] Screensaver mode (show clock and next event)
  - [ ] Energy saving settings
  - [ ] Brightness control

### Build & Packaging
- [ ] Configure ARM builds
  - [ ] Cross-compilation setup in Nix flake
  - [ ] ARM64 Electron build
  - [ ] Test on actual Raspberry Pi hardware

- [ ] Create .deb package
  - [ ] Configure electron-forge for .deb output
  - [ ] Include systemd service in package
  - [ ] Post-install scripts for setup
  - [ ] Desktop entry file
  - [ ] Icon assets

### Update Mechanism
- [ ] Implement app update system
  - [ ] Check for updates on startup (optional)
  - [ ] Download and install updates
  - [ ] Update notification in admin panel
  - [ ] Rollback on failed update
  - [ ] Version display in settings

---

## Phase 8: Settings & Preferences

### Application Settings UI
- [ ] Create settings panel (admin-protected)
  - [ ] General settings tab
  - [ ] Calendar sync settings
  - [ ] Display preferences
  - [ ] User/profile management
  - [ ] Task settings
  - [ ] Reward settings
  - [ ] About/version info

### Configurable Options
- [ ] Calendar sync interval setting
- [ ] Default calendar view preference
- [ ] Theme/color scheme options
- [ ] Notification preferences
- [ ] Time format (12h/24h)
- [ ] Week start day (Sunday/Monday)
- [ ] Language/locale settings (future)
- [ ] Screen timeout settings
- [ ] Task completion sound on/off

### Data Management
- [ ] Backup/restore functionality
  - [ ] Export database to file
  - [ ] Import database from backup
  - [ ] Automatic backups (daily/weekly)
  - [ ] Backup to external location

- [ ] Data export options
  - [ ] Export tasks to CSV/JSON
  - [ ] Export completed tasks history
  - [ ] Export reward history

---

## Phase 9: Accessibility & Localization

### Accessibility Features
- [ ] Keyboard navigation support
  - [ ] Tab order for all interactive elements
  - [ ] Keyboard shortcuts (documented)
  - [ ] Focus indicators

- [ ] Screen reader support
  - [ ] ARIA labels on all interactive elements
  - [ ] Semantic HTML
  - [ ] Announce dynamic content changes

- [ ] High contrast mode
  - [ ] Toggle for high contrast theme
  - [ ] Increased border visibility
  - [ ] Enhanced focus indicators

- [ ] Additional accessibility options
  - [ ] Reduce motion option (disable animations)
  - [ ] Font size controls
  - [ ] Color blind friendly mode

### Internationalization (Future)
- [ ] i18n framework setup
- [ ] English locale (default)
- [ ] Date/time formatting localization
- [ ] Number formatting localization
- [ ] Extract hardcoded strings to translation files
- [ ] RTL support preparation

---

## Phase 10: Testing & Quality Assurance

**Note:** Unit tests and integration tests are now embedded in each phase above. This phase focuses on overall test coverage, performance testing, and manual testing.

### Test Coverage & Quality
- [ ] Review overall test coverage across all modules
- [ ] Ensure minimum 70% code coverage
- [ ] Review and improve test quality
- [ ] Add missing unit tests for edge cases
- [ ] Add missing integration tests for user flows
- [ ] Set up coverage reporting in CI/CD
- [ ] Create coverage badges for README

### Performance Testing
- [ ] Create performance test suite
  - [ ] Measure startup time on Raspberry Pi
  - [ ] Profile memory usage during normal operation
  - [ ] Test animation performance (60fps target)
  - [ ] Test with large datasets (100+ events, 50+ tasks)
  - [ ] Measure IPC communication overhead
  - [ ] Test database query performance
- [ ] Optimize based on findings
  - [ ] Optimize bundle size
  - [ ] Lazy load non-critical components
  - [ ] Optimize database indices
  - [ ] Reduce unnecessary re-renders
- [ ] Create performance benchmarks
  - [ ] Document baseline performance metrics
  - [ ] Set up performance regression testing

### Manual Testing
- [ ] Hardware testing
  - [ ] Test on actual Raspberry Pi hardware
  - [ ] Test with official Raspberry Pi touchscreen
  - [ ] Test with alternative touchscreens
  - [ ] Test different screen resolutions
- [ ] Interaction testing
  - [ ] Test all touch gestures (swipe, tap, long-press)
  - [ ] Test touch target sizes (minimum 44x44px)
  - [ ] Test multi-touch if applicable
  - [ ] Test on-screen keyboard interaction
- [ ] Kiosk mode testing
  - [ ] Test fullscreen mode stability
  - [ ] Test prevention of system shortcuts
  - [ ] Test auto-start on boot
  - [ ] Test recovery from crashes
- [ ] Endurance testing
  - [ ] Extended runtime testing (24+ hours)
  - [ ] Multi-day usage testing
  - [ ] Memory leak detection
  - [ ] Database integrity over time
- [ ] User acceptance testing
  - [ ] Family usability testing
  - [ ] Child interaction testing (ages 5-12)
  - [ ] Accessibility testing
  - [ ] Collect feedback and iterate

---

## Phase 11: Documentation

### Code Documentation
- [ ] Add JSDoc comments to all public functions
- [ ] Document IPC API contracts
- [ ] Document database schema
- [ ] Document component props and interfaces
- [ ] Add inline comments for complex logic

### User Documentation
- [ ] Create user guide
- [ ] Setup/installation instructions
- [ ] How to add Google Calendar accounts
- [ ] How to create and manage tasks
- [ ] How the reward system works
- [ ] Admin settings guide
- [ ] Troubleshooting guide

### Developer Documentation
- [ ] Update README with development setup
- [ ] Document build process
- [ ] Document deployment to Raspberry Pi
- [ ] Architecture overview document
- [ ] Contributing guidelines
- [ ] API documentation

---

## Phase 12: Polish & Enhancements

### Performance Optimizations
- [ ] Code splitting and lazy loading
- [ ] Image optimization (WebP format)
- [ ] Database query optimization
- [ ] Caching strategies
- [ ] Reduce initial bundle size
- [ ] Optimize re-renders in React components

### Visual Polish
- [ ] Smooth page transitions
- [ ] Loading states for all async operations
- [ ] Empty states with helpful messages
- [ ] Micro-interactions and animations
- [ ] Consistent spacing and alignment
- [ ] Professional iconography

### Additional Features (Nice to Have)
- [ ] Weather widget integration
- [ ] School calendar import (iCal format)
- [ ] Family message board/notes
- [ ] Photo slideshow mode
- [ ] Birthday/anniversary reminders
- [ ] Shopping list integration
- [ ] Meal planning integration
- [ ] Allowance tracking tied to tasks

### Security Hardening
- [ ] Security audit of IPC handlers
- [ ] Content Security Policy headers
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Secure token storage audit
- [ ] Rate limiting for login attempts
- [ ] Session management and expiration

---

## Phase 13: Deployment & Maintenance

### Initial Deployment
- [ ] Build final .deb package
- [ ] Create installation script
- [ ] Set up Raspberry Pi OS
- [ ] Install and configure app
- [ ] Mount display/hardware setup
- [ ] Initial family onboarding

### Monitoring & Logging
- [ ] Set up error reporting (Sentry or similar)
- [ ] Usage analytics (privacy-respecting)
- [ ] Performance monitoring
- [ ] Log aggregation for debugging

### Maintenance Plan
- [ ] Monthly update schedule
- [ ] Bug tracking system
- [ ] Feature request process
- [ ] Backup verification
- [ ] Database maintenance tasks

---

## Current Priorities (Next Steps)

**IMMEDIATE PRIORITY - Phase 0 (Application Restructure):**

Before implementing new features, restructure the application to follow proper architecture patterns:

1. **Set up testing infrastructure** (Vitest + Playwright)
   - Install testing frameworks
   - Configure test runners
   - Create test utilities and helpers
   - Write example tests

2. **Reorganize file structure**
   - Create new directory structure (see Phase 0)
   - Migrate existing code to new locations
   - Update import paths and configurations
   - Verify app still builds and runs

3. **Create TESTING.md documentation**
   - Document testing standards
   - Provide unit test examples
   - Provide integration test examples
   - Define coverage targets

**AFTER Phase 0 completion, proceed with feature development:**

Based on the AI_DEVELOPMENT_PROMPT.md "Next Priority Features":

1. **Core Infrastructure** (Phase 1)
   - Database setup with SQLite
   - User authentication and profile system
   - State management setup
   - Logging infrastructure

2. **Google Calendar Integration** (Phase 2)
   - OAuth flow implementation
   - Calendar sync service
   - Event caching

3. **Calendar Display** (Phase 3)
   - Month view component
   - Event display and interaction

4. **Task System** (Phase 4)
   - Basic task CRUD operations
   - Task completion tracking

5. **Reward System** (Phase 5)
   - Initial animation framework
   - Points accumulation

**Important:** Each feature must include:
- ✅ Unit tests for all business logic
- ✅ Integration test (Playwright) for user flow
- ✅ Proper file organization in new structure
- ✅ Documentation in code

---

## Notes

- This TODO list is a living document and should be updated as priorities shift
- Each major feature should have its own git branch during development
- Mark items complete as they are finished
- Add new items as requirements emerge
- **All code must include tests** - no exceptions
- **Follow the new file structure** - no shortcuts
- Estimated timeline:
  - Phase 0 (Restructure): 1-2 weeks
  - Phases 1-7 (MVP): 3-6 months
  - Full feature set: 6-12 months including testing and polish

---

**Last Updated:** 2025-11-28
