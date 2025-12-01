Pi Touch Calendar
================================================

A touch-first, kiosk-mode calendar and chore management application designed for Raspberry Pi
with an attached touchscreen.  I am hoping for that to be around 1920x1080, but the size could
be adjustable.

This include integrations with:
* Google Calendar
* Google Drive

It also support many features outlined in the [REQUIREMENTS](docs/REQUIREMENTS.md) document.

Technical Stack
--------------------------------------------------------

- **Nix First**
- **Framework:** Electron 39
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 5
- **Database:** SQLite (better-sqlite3)
- **Testing:** Vitest + Playwright
- **Authentication:** SHA-256 hashed pincodes
- **APIs:** Google Calendar, Google Sheets, Google Drive

Getting Started
---------------------------------------------------------

To use this solution the most important thing is to have nix installed with flakes and command
support enabled.

* Install [Nix package manager](https://nix.dev/install-nix.html)

```bash
curl -L https://nixos.org/nix/install | sh -s -- --daemon
```

* Setup flakes and command

```bash
echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pi-touch-calendar

# Install dependencies
nix develop --no-pure-eval
```

### Setting Up Development Pincode

Before running the app for the first time, you should set up a pincode for local development:

#### Create Pincode via Script (Recommended)

```bash
# Create a pincode (4-8 digits)
npm run create-pincode 1234

# Output:
# 🔐 Pi Touch Calendar - Create Pincode
# ✅ Pincode saved to: ~/.config/pi-touch-calendar/credentials.json
# 🔒 Your pincode is: 1234
# ✨ Done! You can now login with your pincode.
```

### Running the Application

```bash
# Development mode with hot reload
npm start

# Debug mode with Chrome DevTools
npm run debug
```

### Development Scripts

```bash
# Testing
npm test                  # Run all tests (unit + integration)
npm run test:unit         # Run unit tests only
npm run test:unit:watch   # Run unit tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:integration  # Run Playwright integration tests

# Pincode Management
npm run create-pincode <pin>  # Create/update pincode (4-8 digits)
npm run reset-pincode          # Delete pincode (triggers first-time setup)

# Code Quality
npm run lint              # Run ESLint

# Building
npm run package           # Package application
npm run make              # Create distributable installers
```

Authentication
-----------------------------------------

### Pincode Authentication

- **Storage:** Pincodes are hashed with SHA-256 before storage
- **Location:** `~/.config/pi-touch-calendar/credentials.json`
- **Validation:** 4-8 digits, numeric only
- **Logging:** All authentication attempts logged with daily rotation

Configuration
---------------------------------------------

### Environment Variables

```bash
# Google Sheets Configuration (Phase 2)
PI_CHORE_SHEET_NAME=pi-touch-calendar-chores
PI_CHORE_RESULTS_SHEET_NAME=pi-touch-calendar-chores-stats

# Development
NODE_ENV=development
```

### Config Files

- **Electron Forge:** `forge.config.ts`
- **Vite:** `vite.*.config.ts`
- **TypeScript:** `tsconfig.json`
- **Vitest:** `vitest.config.ts`
- **Playwright:** `playwright.config.ts`
