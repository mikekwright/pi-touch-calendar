# 📅 Pi Touch Calendar

A touch-first, kiosk-mode calendar and chore management application designed for Raspberry Pi with a 1920x1080 touchscreen display. Features Google Calendar integration, Google Sheets-based chore tracking, and a beautiful pink/rose gold themed interface.

## 🎯 Features

### ✅ Phase 1 - Complete
- **🔐 Pincode Authentication** - Secure 4-8 digit pincode authentication (no username required)
- **⚙️ Configuration Management** - Automatic config directory setup in `~/.config/pi-touch-calendar/`
- **📝 Authentication Logging** - Daily rotating logs with 90-day retention
- **🎨 Kiosk UI** - Touch-optimized interface designed for 1920x1080 displays
- **🖥️ Single Window Architecture** - React-based routing for seamless transitions

### 🚧 Planned Features (Phase 2+)
- **📆 Google Calendar Integration** - QR code OAuth authentication
- **✅ Chore Management** - Google Sheets-based per-child chore tracking
- **📊 Progress Tracking** - Daily stats and completion tracking
- **🎁 Reward System** - Gamification and achievement badges
- **👤 Multi-Profile Support** - Per-child profiles and preferences

## 🏗️ Technical Stack

- **Framework:** Electron 39
- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 5
- **Database:** SQLite (better-sqlite3)
- **Testing:** Vitest + Playwright
- **Authentication:** SHA-256 hashed pincodes
- **APIs:** Google Calendar, Google Sheets, Google Drive

## 📊 Test Coverage

**Overall Coverage: 89.24%** (126 passing tests)

- ConfigManager: 97.82% (38 tests)
- PincodeAuthService: 94.73% (26 tests)
- AuthLogger: 89.18% (27 tests)
- React Components: 95-100% (29 tests)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- Linux, macOS, or Windows

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pi-touch-calendar

# Install dependencies
npm install
```

### Setting Up Development Pincode

Before running the app for the first time, you should set up a pincode for local development:

#### Option 1: Create Pincode via Script (Recommended)

```bash
# Create a pincode (4-8 digits)
npm run create-pincode 1234

# Output:
# 🔐 Pi Touch Calendar - Create Pincode
# ✅ Pincode saved to: ~/.config/pi-touch-calendar/credentials.json
# 🔒 Your pincode is: 1234
# ✨ Done! You can now login with your pincode.
```

#### Option 2: Use First-Time Setup UI

```bash
# Delete any existing credentials
npm run reset-pincode

# Start the app
npm start

# The app will show first-time setup screen
# Enter and confirm your desired 4-8 digit pincode
```

### Running the Application

```bash
# Development mode with hot reload
npm start

# Debug mode with Chrome DevTools
npm run debug
```

**Default Login:**
- Pincode: `1234` (if you used the script above)
- Or use the pincode you created during first-time setup

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

## 📁 Project Structure

```
pi-touch-calendar/
├── src/
│   ├── main/                      # Electron main process
│   │   ├── config/                # Configuration management
│   │   │   └── ConfigManager.ts   # Config directory & credentials
│   │   ├── services/              # Business logic services
│   │   │   ├── auth/              # Authentication service
│   │   │   └── logging/           # Logging service
│   │   ├── ipc/                   # IPC handlers
│   │   │   └── handlers/          # IPC request handlers
│   │   ├── windows/               # Window management
│   │   └── index.ts               # Main entry point
│   │
│   ├── renderer/                  # React frontend
│   │   ├── components/            # React components
│   │   │   ├── auth/              # Authentication components
│   │   │   └── common/            # Shared components
│   │   ├── pages/                 # Page components
│   │   ├── styles/                # Global styles
│   │   ├── App.tsx                # Root React component
│   │   └── index.tsx              # Renderer entry point
│   │
│   ├── preload/                   # Preload scripts
│   │   └── index.ts               # IPC API bridge
│   │
│   └── shared/                    # Shared code
│       ├── constants/             # App constants
│       └── types/                 # TypeScript types
│
├── scripts/                       # Development utilities
│   ├── create-pincode.ts          # Pincode creation script
│   └── README.md                  # Scripts documentation
│
├── test/                          # Test files
│   ├── integration/               # Playwright tests
│   └── utils/                     # Test utilities
│
└── index.html                     # Electron renderer HTML
```

## 🔒 Security

### Pincode Authentication

- **Storage:** Pincodes are hashed with SHA-256 before storage
- **Location:** `~/.config/pi-touch-calendar/credentials.json`
- **Permissions:** Config directory (700), credentials file (600)
- **Validation:** 4-8 digits, numeric only
- **Logging:** All authentication attempts logged with daily rotation

### Configuration Files

```
~/.config/pi-touch-calendar/
├── credentials.json         # Hashed pincode (600)
└── logs/                    # Authentication logs (700)
    └── auth-YYYY-MM-DD.log  # Daily log files
```

### Example credentials.json

```json
{
  "pincode": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
  "createdAt": "2025-12-01T02:37:33.550Z"
}
```

## 🎨 UI Design

### Theme
- **Colors:** Pink/Rose Gold gradient (#ffd1dc, #ffb6c1, #ffc0cb)
- **Accent:** Palevioletred (#db7093, #c76b98)
- **Typography:** System fonts with antialiasing

### Display Specifications
- **Resolution:** 1920x1080 (Full HD)
- **Orientation:** Landscape
- **Mode:** Fullscreen kiosk
- **Touch:** Optimized for finger interaction (large buttons, 80-100px minimum)

### Font Sizes
- **Headings:** 3.2-4.5rem
- **Body Text:** 1.6-2.4rem
- **Buttons:** 1.8-2.2rem
- **Inputs:** 3rem

## 🚀 Deployment

### Raspberry Pi Setup

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and build
git clone <repository-url>
cd pi-touch-calendar
npm install
npm run package

# Set up kiosk mode (autostart)
# Add to ~/.config/lxsession/LXDE-pi/autostart:
@/path/to/pi-touch-calendar
```

### Production Pincode

**Option 1: First-Time Setup (Recommended)**
- Launch the app without credentials.json
- Complete first-time setup flow in the UI
- User creates their own secure pincode

**Option 2: Pre-configured**
```bash
# On the target device
npm run create-pincode <secure-pin>
```

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Unit tests with coverage
npm run test:coverage

# Integration tests with UI
npm run test:integration:ui
```

### Test Structure

```
src/
├── main/
│   └── services/
│       └── auth/
│           ├── PincodeAuthService.ts
│           └── __tests__/
│               └── PincodeAuthService.test.ts
└── renderer/
    └── components/
        └── auth/
            ├── PincodeAuth.tsx
            └── __tests__/
                └── PincodeAuth.test.tsx
```

## 📝 Configuration

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

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make changes with tests
3. Ensure tests pass: `npm test`
4. Check coverage: `npm run test:coverage`
5. Lint code: `npm run lint`
6. Submit pull request

### Code Standards

- **TypeScript:** Strict mode enabled
- **Testing:** Minimum 70% coverage required
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Consistent indentation and style

## 📄 License

MIT License - See LICENSE file for details

## 👥 Authors

- **Michael Wright** - *Initial work* - [Michael Wright](mailto:)

## 🙏 Acknowledgments

- Electron community
- React team
- Vite build tool
- All open source contributors

## 📞 Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact: michael@level.co

## 🗺️ Roadmap

### Phase 1: Authentication ✅ (Complete)
- [x] Pincode authentication system
- [x] Configuration management
- [x] Authentication logging
- [x] React UI with touch optimization
- [x] Comprehensive test suite (89% coverage)

### Phase 2: Google Integration (In Progress)
- [ ] Google OAuth with QR codes
- [ ] Google Calendar API integration
- [ ] Calendar view and navigation
- [ ] Event display and filtering

### Phase 3: Chore Management
- [ ] Google Sheets integration
- [ ] Per-child chore sheets
- [ ] Daily auto-pull at 2am
- [ ] SQLite local storage
- [ ] Completion tracking

### Phase 4: Rewards & Gamification
- [ ] Achievement system
- [ ] Reward animations
- [ ] Progress tracking
- [ ] Stats visualization

### Phase 5: Polish & Deployment
- [ ] Raspberry Pi installer
- [ ] Kiosk mode configuration
- [ ] Auto-update system
- [ ] Production deployment guide

---

**Built with ❤️ for family organization**
