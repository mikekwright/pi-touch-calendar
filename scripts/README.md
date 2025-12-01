# Development Scripts

This directory contains development utility scripts for the Pi Touch Calendar application.

## Available Scripts

### `create-pincode.ts`

Create or update the pincode for local development.

**Usage:**

```bash
# Interactive mode (prompts for pincode)
npm run create-pincode

# With pincode argument
npm run create-pincode 1234

# Examples
npm run create-pincode 5678
npm run create-pincode 12345678
```

**Features:**
- Validates pincode format (4-8 digits)
- Creates config directory if it doesn't exist
- Hashes pincode with SHA-256
- Warns if overwriting existing pincode
- Shows creation timestamp

**Output:**
```
🔐 Pi Touch Calendar - Create Pincode

⚠️  Warning: Existing pincode will be overwritten
   Previous pincode created at: 2025-12-01T02:37:33.550Z

✅ Pincode saved to: /home/user/.config/pi-touch-calendar/credentials.json
🔒 Your pincode is: 1234
📅 Created at: 2025-12-01T03:42:16.927Z

✨ Done! You can now login with your pincode.
```

### `reset-pincode`

Reset the pincode to trigger first-time setup flow.

**Usage:**

```bash
npm run reset-pincode
```

**What it does:**
- Deletes the credentials.json file
- Next app launch will show first-time setup screen
- User can create a new pincode through the UI

## File Locations

**Config Directory:** `~/.config/pi-touch-calendar/`

**Credentials File:** `~/.config/pi-touch-calendar/credentials.json`

**Format:**
```json
{
  "pincode": "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4",
  "createdAt": "2025-12-01T02:37:33.550Z"
}
```

The pincode is stored as a SHA-256 hash for security.

## Common Development Workflows

### First Time Setup
```bash
# Delete any existing credentials
npm run reset-pincode

# Start the app
npm start

# Complete first-time setup in the UI
```

### Change Pincode
```bash
# Create new pincode
npm run create-pincode 9999

# Restart the app to use new pincode
```

### Quick Testing
```bash
# Set a known test pincode
npm run create-pincode 1234

# Run tests
npm run test:unit
```

## Pincode Requirements

- **Length:** 4-8 digits
- **Format:** Numeric only (0-9)
- **Examples:**
  - ✅ Valid: `1234`, `5678`, `12345678`
  - ❌ Invalid: `123` (too short), `abc123` (contains letters), `123456789` (too long)

## Security Notes

- Pincodes are hashed with SHA-256 before storage
- Config directory permissions: `700` (user only)
- Credentials file permissions: `600` (user read/write only)
- Never commit credentials.json to version control
- These scripts are for **development only**
- Production deployments should use the first-time setup UI
