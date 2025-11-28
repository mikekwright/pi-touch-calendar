# Pi Touch Calendar - AI Development Prompt Template

## Project Overview

You are helping to develop **Pi Touch Calendar**, a family-oriented touchscreen calendar application similar to
Skylight Calendar. This Electron application is designed to run on a Raspberry Pi with a connected touchscreen
display in kiosk mode.

## Core Application Details

### Technical Stack
- **Framework**: Electron (v39.0.0) with Vite build system
- **Language**: TypeScript
- **Target Platform**: Raspberry Pi with touchscreen (Linux ARM)
- **Build System**: Nix flakes with dream2nix for reproducible builds
- **Display Mode**: Kiosk mode (fullscreen, no chrome)
- **Architecture**: Main process, renderer process, preload script with IPC

### Current Project Structure
```
pi-touch-calendar/
├── src/
│   ├── main.ts              # Electron main process entry point
│   ├── renderer.ts          # Frontend/UI renderer process
│   ├── preload.ts           # Secure IPC bridge between main and renderer
│   ├── window-manager.ts    # Window creation and management
│   ├── common.ts            # Shared utilities and types
│   └── user/
│       └── login.ts         # Login window implementation
├── index.html               # Main HTML entry point
├── forge.config.ts          # Electron Forge configuration
├── vite.*.config.ts         # Vite build configurations
├── flake.nix               # Nix development environment
└── package.json            # Node.js dependencies and scripts
```

## Key Features to Implement

### 1. Google Calendar Integration
- **Goal**: Sync and display events from multiple Google Calendar accounts
- **Requirements**:
  - OAuth 2.0 authentication flow for Google Calendar API
  - Support for multiple calendar sources per family member
  - Real-time sync with configurable refresh intervals
  - Display events with colors, times, descriptions, and locations
  - Handle recurring events, all-day events, and multi-day events
  - Offline caching of calendar data
  - Visual indicators for different calendar sources

### 2. Recurring Task System with Visual Rewards
- **Goal**: Create an engaging task/chore management system for family members (especially children)
- **Requirements**:
  - Define recurring tasks with various schedules (daily, weekly, custom)
  - Assign tasks to specific family members
  - Visual task completion tracking (checkboxes, progress bars)
  - **Reward Flow System**:
    - Animations when tasks are completed
    - Point/star accumulation system
    - Visual badges or achievements
    - Celebratory animations and sounds (appropriate for kids)
    - Weekly/monthly reward summaries
  - Task categories and color coding
  - Task notifications and reminders
  - Age-appropriate task assignment

### 3. Touchscreen-Optimized UI
- **Goal**: Create an intuitive, finger-friendly interface
- **Requirements**:
  - Large touch targets (minimum 44x44px)
  - Minimal text input requirements
  - Gesture support (swipe between days/weeks/months)
  - Visual feedback for all interactions
  - High contrast, easy-to-read fonts
  - Responsive layout for various screen sizes
  - Support for both landscape and portrait orientations

### 4. Kiosk Mode Configuration
- **Goal**: Run as a dedicated appliance on Raspberry Pi
- **Requirements**:
  - Fullscreen borderless window
  - Disabled system shortcuts (Alt+Tab, etc.)
  - Auto-start on boot
  - Screen wake/sleep management
  - Prevent accidental exits
  - Admin access for configuration (via special gesture or button sequence)

### 5. User Authentication & Profiles
- **Current State**: Basic login system exists (see LOGIN_SYSTEM.md)
- **Enhancement Requirements**:
  - Individual profiles for each family member
  - Profile pictures or avatars
  - Child-friendly profile switching (visual, no password needed)
  - Admin profile with password protection for settings
  - Guest access mode

## Technical Requirements

### Security
- Context isolation enabled
- No direct Node.js integration in renderer
- Secure IPC communication only
- Encrypted storage for OAuth tokens and sensitive data
- Content Security Policy (CSP) headers

### Performance
- Fast startup time (< 5 seconds on Raspberry Pi)
- Smooth animations (60fps)
- Efficient memory usage (< 500MB for main app)
- Lazy loading for non-critical features
- Optimized asset loading

### Data Storage
- Local SQLite database for tasks, settings, user profiles
- Encrypted credential storage
- Calendar data caching
- Backup/restore functionality
- Data export options

### Build & Deployment
- Nix flake for reproducible development environment
- Cross-compilation support for ARM architecture
- Automated builds with electron-forge
- .deb package output for Raspberry Pi OS
- Update mechanism for deployed devices

## Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration following project standards
- Consistent code formatting
- Comprehensive error handling
- Logging for debugging (with levels)

### Architecture Patterns
- Separation of concerns (main vs renderer processes)
- Event-driven architecture for calendar updates
- State management for UI (consider lightweight solution)
- Modular component design
- Testable code structure

### Accessibility
- Keyboard navigation support (even though primarily touch)
- High contrast mode option
- Font size adjustment
- Color-blind friendly palettes
- Screen reader compatibility (ARIA labels)

## Common Development Tasks

When working on this project, you might be asked to:

1. **Add calendar features**: Implement new views (week, month, agenda), add filtering, search functionality
2. **Enhance task system**: Add new task types, improve reward animations, create achievement system
3. **Improve UI/UX**: Design new screens, add animations, optimize touch interactions
4. **Integrate APIs**: Connect to Google Calendar, add weather integration, school calendar sync
5. **Optimize performance**: Reduce memory usage, improve startup time, optimize rendering
6. **Debug issues**: Fix synchronization bugs, resolve IPC communication errors, handle edge cases
7. **Add settings**: Create configuration UI, add customization options, implement preferences
8. **Deploy to Pi**: Build ARM packages, set up auto-start, configure kiosk mode

## Example Prompts You Can Use

### For adding features:
```
I need to add a weekly calendar view that shows all family members' events in columns.
Each column should represent one person, with color-coded events. Users should be able
to swipe left/right to navigate between weeks. Include smooth transition animations.
```

### For Google Calendar integration:
```
Implement Google Calendar OAuth authentication flow. Store tokens securely and allow
users to add multiple Google accounts. Fetch events from the last 30 days and next
90 days. Cache them locally and sync every 15 minutes. Handle API errors gracefully
and provide user feedback.
```

### For reward system:
```
Create a visual reward animation system for when kids complete tasks. When a task is
checked off, show a celebration animation with stars/confetti, play a cheerful sound,
and add points to their profile. Display a progress bar toward their weekly goal.
Make it feel fun and engaging for children aged 5-12.
```

### For UI improvements:
```
Design a profile switching screen that shows all family members as large circular
avatars with their names. When someone taps their avatar, smoothly transition to
their personalized calendar view showing their events and tasks. Make touch targets
large and use fun, friendly animations.
```

### For kiosk setup:
```
Configure the Electron app to run in kiosk mode on Raspberry Pi. It should start
fullscreen on boot, disable all system shortcuts, and prevent accidental exits.
Add a hidden admin button sequence (tap corners in specific order) to access
settings or exit the app.
```

## Important Context

- **Target Users**: Families with children (ages 5-18) and parents
- **Primary Use Case**: Centralized family schedule and chore management
- **Installation**: Wall-mounted or countertop Raspberry Pi with touchscreen
- **Expected Lifespan**: Daily use for years, must be reliable and maintainable
- **Update Frequency**: Monthly updates with new features and bug fixes

## Current State

As of the last commit, the application has:
- Basic Electron + Vite + TypeScript setup
- Login system with demo authentication
- Window management infrastructure
- Secure IPC communication framework
- Nix development environment configuration

## Next Priority Features

1. Google Calendar API integration and OAuth flow
2. Main calendar view (month view as starting point)
3. Basic task creation and completion system
4. Profile management system
5. Initial reward animation framework

---

## How to Use This Prompt

Copy sections relevant to your current task and customize with specific requirements.
For example, if working on the calendar view, include sections 1, 3, and the relevant
example prompts. Add specific design requirements, technical constraints, or user
stories as needed.

### Template Structure:
```
[Project Context - always include]
[Specific Feature Requirements - customize for task]
[Technical Constraints - include if relevant]
[Example/Reference - include if helpful]
[Acceptance Criteria - define success metrics]
```
