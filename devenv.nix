{ pkgs, project-name, lib, ... }:

{
  # https://devenv.sh/basics/
  env.PROJECT_NAME = project-name;

  # Electron needs these environment variables to run on NixOS
  env.ELECTRON_OVERRIDE_DIST_PATH = "${pkgs.electron}/bin/";
  env.NIXOS_OZONE_WL = "1"; # Enable Wayland support for Electron

  languages.typescript = {
    enable = true;
  };

  # Enable Node.js with npm
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs;
    npm.enable = true;
  };

  packages = with pkgs; [
    # Node.js and package managers
    nodejs
    nodePackages.npm

    # Electron dependencies for NixOS
    electron

    # Required system libraries for Electron
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXrandr
    xorg.libXrender
    xorg.libXtst
    xorg.libxcb
    xorg.libxkbfile
    xorg.libxshmfence

    # Graphics and display
    libdrm
    mesa
    libGL
    libGLU

    # Audio
    alsa-lib
    libpulseaudio

    # GTK and system integration
    gtk3
    glib
    cairo
    pango
    gdk-pixbuf
    atk

    # Font rendering
    fontconfig
    freetype

    # Other runtime dependencies
    nss
    nspr
    cups
    dbus
    expat
    libuuid

    # Development tools
    git

    # Database for SQLite (when you implement Phase 1)
    sqlite

    # Testing tools
    playwright-driver.browsers # Playwright browsers for integration tests
  ];

  # Set up library paths for Electron
  env.LD_LIBRARY_PATH = lib.makeLibraryPath (with pkgs; [
    xorg.libX11
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXext
    xorg.libXfixes
    xorg.libXrandr
    xorg.libXrender
    xorg.libXtst
    xorg.libxcb
    xorg.libxkbfile
    xorg.libxshmfence
    libdrm
    mesa
    libGL
    libGLU
    alsa-lib
    libpulseaudio
    gtk3
    glib
    cairo
    pango
    gdk-pixbuf
    atk
    fontconfig
    freetype
    nss
    nspr
    cups
    dbus
    expat
    libuuid
  ]);

  # Scripts for common development tasks
  scripts = {
    # Help/hints script
    hints.exec = ''
      echo "╔════════════════════════════════════════════════════════════════╗"
      echo "║         Pi Touch Calendar - Development Commands              ║"
      echo "╚════════════════════════════════════════════════════════════════╝"
      echo ""
      echo "🚀 Running the Application:"
      echo "   run-app              - Start the Electron app in development mode"
      echo "   npm run debug        - Start with Electron DevTools"
      echo ""
      echo "🧪 Testing:"
      echo "   run-tests            - Run all tests (unit + integration)"
      echo "   npm run test:unit    - Run unit tests only"
      echo "   npm run test:integration - Run integration tests only"
      echo "   npm run test:coverage - Generate coverage report"
      echo "   npm run test:unit:watch - Run unit tests in watch mode"
      echo ""
      echo "📦 Building & Packaging:"
      echo "   npm run package      - Package the app"
      echo "   npm run make         - Create distributable (.deb for Raspberry Pi)"
      echo ""
      echo "🔍 Code Quality:"
      echo "   npm run lint         - Run ESLint"
      echo ""
      echo "📚 Documentation:"
      echo "   View TESTING.md      - Testing guidelines and examples"
      echo "   View TODO.md         - Project roadmap and tasks"
      echo "   View AI_DEVELOPMENT_PROMPT.md - Development context"
      echo ""
      echo "💡 Quick Tips:"
      echo "   - Use 'run-app' instead of 'npm start' for proper NixOS support"
      echo "   - Electron runs with Wayland support enabled"
      echo "   - Press F11 to toggle fullscreen in dev mode"
      echo "   - Press Escape to exit fullscreen in dev mode"
      echo ""
    '';

    # Run the application (handles NixOS Electron issues)
    run-app.exec = ''
      echo "🚀 Starting Pi Touch Calendar..."
      echo "📍 Using Electron from: $ELECTRON_OVERRIDE_DIST_PATH"
      npm start
    '';

    # Run all tests
    run-tests.exec = ''
      echo "🧪 Running all tests..."
      echo ""
      echo "▶ Running unit tests..."
      npm run test:unit
      UNIT_EXIT=$?

      echo ""
      echo "▶ Running integration tests..."
      npm run test:integration
      INTEGRATION_EXIT=$?

      echo ""
      if [ $UNIT_EXIT -eq 0 ] && [ $INTEGRATION_EXIT -eq 0 ]; then
        echo "✅ All tests passed!"
        exit 0
      else
        echo "❌ Some tests failed"
        [ $UNIT_EXIT -ne 0 ] && echo "   - Unit tests failed"
        [ $INTEGRATION_EXIT -ne 0 ] && echo "   - Integration tests failed"
        exit 1
      fi
    '';

    # Install dependencies
    install-deps.exec = ''
      echo "📦 Installing dependencies..."
      npm install
      echo "✅ Dependencies installed"
    '';

    # Clean build artifacts
    clean.exec = ''
      echo "🧹 Cleaning build artifacts..."
      rm -rf .vite dist out coverage node_modules/.vite
      echo "✅ Clean complete"
    '';

    # Rebuild from scratch
    rebuild.exec = ''
      echo "🔨 Rebuilding from scratch..."
      clean
      install-deps
      echo "✅ Rebuild complete"
    '';

    # Setup Playwright browsers (needed for integration tests)
    setup-playwright.exec = ''
      echo "🎭 Installing Playwright browsers..."
      npx playwright install
      echo "✅ Playwright browsers installed"
    '';

    # Database-related commands (for when you implement Phase 1)
    db-migrate.exec = ''
      echo "🗄️  Running database migrations..."
      # This will be implemented in Phase 1
      echo "⚠️  Database migrations not yet implemented"
      echo "   This will be available after Phase 1 implementation"
    '';
  };

  # Enter shell hook - runs when entering the dev environment
  enterShell = ''
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║      Welcome to Pi Touch Calendar Development Environment     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📍 Project: $PROJECT_NAME"
    echo "🔧 Node.js: $(node --version)"
    echo "📦 npm: $(npm --version)"
    echo "⚡ TypeScript: $(tsc --version)"
    echo "🖥️  Electron: Using NixOS package at $ELECTRON_OVERRIDE_DIST_PATH"
    echo ""
    echo "Type 'hints' to see available commands"
    echo ""

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
      echo "⚠️  node_modules not found. Run 'install-deps' to install dependencies"
      echo ""
    fi
  '';

  # Pre-commit hooks for code quality
  pre-commit.hooks = {
    # Format code before committing
    prettier = {
      enable = false; # Enable if you want auto-formatting
    };

    # Lint code before committing
    eslint = {
      enable = false; # Enable if you want auto-linting
    };
  };
}

