# Quick Start Guide - Pi Touch Calendar

## For NixOS Users

### First Time Setup

1. **Enter the development environment:**
   ```bash
   devenv shell
   ```

   You'll see a welcome message with project information.

2. **Install dependencies:**
   ```bash
   install-deps
   ```

3. **Run the application:**
   ```bash
   run-app
   ```

That's it! The app should launch with the login screen.

### Daily Development Workflow

```bash
# Start your dev session
devenv shell

# Run the app
run-app

# In another terminal (also in devenv shell):
# Run tests in watch mode
npm run test:unit:watch
```

### Quick Commands Reference

Inside the devenv shell:

| Command | What it does |
|---------|-------------|
| `hints` | Show all available commands |
| `run-app` | Start the Electron app |
| `run-tests` | Run all tests |
| `npm run test:unit:watch` | Run unit tests in watch mode |
| `clean` | Remove build artifacts |
| `rebuild` | Clean and reinstall everything |

## Common Issues

### "Could not start dynamically linked executable"

**Problem:** You're not in the devenv shell.

**Solution:**
```bash
devenv shell
run-app
```

### "node_modules not found"

**Problem:** Dependencies not installed.

**Solution:**
```bash
install-deps
```

### "Module not found" errors

**Problem:** Stale build artifacts.

**Solution:**
```bash
clean
npm start
```

## Testing the Application

### Default Login Credentials

The app starts with a demo authentication system:

- **Username:** `admin`
- **Password:** `password`

Or any username with a password longer than 3 characters.

### Running Tests

```bash
# All tests
run-tests

# Just unit tests
npm run test:unit

# Unit tests in watch mode (great for TDD)
npm run test:unit:watch

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

## Project Structure

```
pi-touch-calendar/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # UI (React will go here)
│   ├── preload/        # Preload scripts
│   └── shared/         # Shared code
├── test/               # Tests
├── devenv.nix          # NixOS dev environment
└── TODO.md             # Development roadmap
```

## Next Steps

1. **Read the documentation:**
   - `TESTING.md` - Testing guidelines
   - `TODO.md` - Development roadmap
   - `NIXOS_SETUP.md` - Detailed NixOS setup

2. **Start implementing Phase 1:**
   - Set up SQLite database
   - Implement user authentication
   - Add state management

3. **Run tests as you develop:**
   ```bash
   # Terminal 1: Run app
   run-app

   # Terminal 2: Watch tests
   npm run test:unit:watch
   ```

## Getting Help

Type `hints` in the devenv shell to see all available commands with descriptions.

For more details, see:
- `NIXOS_SETUP.md` - NixOS-specific information
- `TESTING.md` - Testing patterns and examples
- `TODO.md` - Complete development roadmap

## Building for Production

```bash
# Package the app
npm run package

# Create distributable (.deb for Raspberry Pi)
npm run make
```

The .deb file will be in the `out/make/deb/` directory.

---

**Happy coding! 🚀**
