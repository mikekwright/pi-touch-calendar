# NixOS Development Environment Setup

This project uses [devenv](https://devenv.sh/) to provide a reproducible development environment on NixOS.

## Quick Start

### 1. Enter the Development Environment

```bash
# If you have direnv installed
direnv allow

# Or manually enter the environment
devenv shell
```

You'll see a welcome message with version information.

### 2. Install Dependencies

```bash
install-deps
```

### 3. Run the Application

```bash
# Use the NixOS-compatible launcher
run-app

# Or use npm directly (the environment is already configured)
npm start
```

## Available Commands

Type `hints` in the devenv shell to see all available commands:

### Development Commands

- **run-app** - Start the Electron app (NixOS-compatible)
- **npm run debug** - Start with Electron DevTools
- **hints** - Show all available commands

### Testing Commands

- **run-tests** - Run all tests (unit + integration)
- **npm run test:unit** - Run unit tests only
- **npm run test:unit:watch** - Run unit tests in watch mode
- **npm run test:integration** - Run integration tests only
- **npm run test:coverage** - Generate coverage report

### Build Commands

- **npm run package** - Package the app
- **npm run make** - Create distributable (.deb for Raspberry Pi)

### Utility Commands

- **install-deps** - Install npm dependencies
- **clean** - Remove build artifacts
- **rebuild** - Clean and reinstall everything
- **setup-playwright** - Install Playwright browsers for integration tests

## How It Works

### Electron on NixOS

Electron apps don't run out of the box on NixOS because they're dynamically linked executables. Our `devenv.nix` configuration solves this by:

1. **Using NixOS Electron**: Sets `ELECTRON_OVERRIDE_DIST_PATH` to use the NixOS-packaged Electron binary
2. **Library Paths**: Sets `LD_LIBRARY_PATH` with all required system libraries
3. **Wayland Support**: Enables `NIXOS_OZONE_WL` for Wayland compatibility

### What's Included

The development environment includes:

**Core Dependencies:**
- Node.js and npm
- TypeScript
- Electron (NixOS package)
- Git
- SQLite

**System Libraries (for Electron):**
- X11 libraries
- Graphics libraries (Mesa, OpenGL)
- GTK3 and UI frameworks
- Audio libraries (ALSA, PulseAudio)
- Font rendering libraries

**Testing Tools:**
- Playwright browsers (for integration tests)

## Troubleshooting

### Electron Won't Start

If you see the "Could not start dynamically linked executable" error:

1. Make sure you're in the devenv shell
2. Check that `ELECTRON_OVERRIDE_DIST_PATH` is set:
   ```bash
   echo $ELECTRON_OVERRIDE_DIST_PATH
   ```
3. Use `run-app` instead of `npm start`

### Missing Dependencies

If you encounter missing library errors:

1. Exit and re-enter the devenv shell:
   ```bash
   exit
   devenv shell
   ```
2. Check that `LD_LIBRARY_PATH` is set:
   ```bash
   echo $LD_LIBRARY_PATH
   ```

### Integration Tests Fail

If Playwright tests fail:

1. Install Playwright browsers:
   ```bash
   setup-playwright
   ```

2. Make sure the app builds successfully first:
   ```bash
   npm run package
   ```

### Clean Build

If things aren't working, try a clean rebuild:

```bash
clean
install-deps
npm run package
```

## Environment Variables

The following environment variables are automatically set in devenv:

| Variable | Purpose |
|----------|---------|
| `PROJECT_NAME` | Project identifier |
| `ELECTRON_OVERRIDE_DIST_PATH` | Path to NixOS Electron binary |
| `NIXOS_OZONE_WL` | Enable Wayland support |
| `LD_LIBRARY_PATH` | Runtime library paths for Electron |

## Customizing the Environment

To add more packages or modify the environment, edit `devenv.nix`:

```nix
packages = with pkgs; [
  # Add your packages here
  myPackage
];
```

Then reload the environment:

```bash
exit
devenv shell
```

## CI/CD Considerations

For building on NixOS CI systems, you can use:

```bash
# Build the package
nix-shell --run "npm run make"

# Run tests
nix-shell --run "run-tests"
```

Or use the provided Nix flake for more advanced builds.

## Resources

- [devenv Documentation](https://devenv.sh/)
- [NixOS Wiki - Electron](https://nixos.wiki/wiki/Electron)
- [Electron Documentation](https://www.electronjs.org/docs/latest/)

## Project Structure

See the main [README.md](./README.md) for general project information and the [TODO.md](./TODO.md) for the development roadmap.
