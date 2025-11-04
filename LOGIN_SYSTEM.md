# Pi Touch Calendar - Login System

## Overview

The application now includes a login system that appears when the app starts. Users must authenticate before accessing the main calendar interface.

## Login Credentials

For demonstration purposes, the following credentials are accepted:

### Default Admin Account

- **Username:** `admin`
- **Password:** `password`

### Alternative Login

- **Username:** Any non-empty username
- **Password:** Any password with more than 3 characters

## Features

### Login Window

- Clean, modern interface with calendar icon
- Responsive design with hover effects
- Error messaging for invalid credentials
- Keyboard navigation support (Enter to submit)
- Loading state during authentication

### Security Features

- Context isolation enabled for security
- No direct node integration in renderer process
- IPC communication for secure data exchange
- Preload script for controlled API exposure

## File Structure

```
src/
├── user/
│   └── login.ts          # Login window implementation
├── main.ts               # Main process with login integration
└── preload.ts            # Secure IPC bridge
```

## How It Works

1. **Application Start**: The login window opens first instead of the main app
2. **User Authentication**: User enters credentials and clicks "Sign In"
3. **Validation**: Credentials are validated against the demo authentication logic
4. **Success Flow**: On successful login, the main calendar window opens and login window closes
5. **Error Handling**: Invalid credentials show error message without closing the window

## Development Notes

### Customizing Authentication

To implement real authentication, modify the login handler in `src/main.ts`:

```typescript
ipcMain.handle('login', async (event, credentials) => {
  // Replace this with your authentication logic
  // - Database lookup
  // - API call to authentication service
  // - LDAP integration
  // etc.
});
```

### Styling Customization

The login interface styles are embedded in the `login.ts` file within the `getLoginHTML()` method. You can modify:

- Colors and gradients
- Layout and spacing
- Fonts and typography
- Logo and branding

### Adding Features

Common enhancements you might want to add:

- Remember me checkbox
- Password reset functionality
- Multi-factor authentication
- Different user roles/permissions
- Session management
- Automatic logout

## Debug Mode

When running in debug mode, both the login window and main window will have developer tools available for debugging.

## Security Considerations

- Passwords are handled in memory only (not stored)
- IPC communication is properly secured
- Context isolation prevents renderer access to Node.js APIs
- Consider implementing proper session management for production use
