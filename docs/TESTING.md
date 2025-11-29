# Testing Guide for Pi Touch Calendar

This document provides guidelines and examples for writing tests in the Pi Touch Calendar project.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Coverage Requirements](#coverage-requirements)
- [Best Practices](#best-practices)

## Testing Philosophy

Every feature in Pi Touch Calendar MUST include:
1. **Unit Tests** - Test individual functions, classes, and components in isolation
2. **Integration Tests** - Test complete user flows using Playwright

Minimum coverage target: **70%** for lines, functions, branches, and statements.

## Testing Stack

- **Vitest** - Unit test runner and assertion library
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **Playwright** - End-to-end and integration testing for Electron app
- **happy-dom** - Lightweight DOM implementation for unit tests

## Running Tests

```bash
# Run all tests (unit + integration)
npm test

# Run only unit tests
npm run test:unit

# Run unit tests in watch mode (development)
npm run test:unit:watch

# Run unit tests with UI (visual test runner)
npm run test:unit:ui

# Run integration tests (Playwright)
npm run test:integration

# Run integration tests with UI
npm run test:integration:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### File Naming Conventions

```
src/main/services/auth/
├── AuthService.ts
└── __tests__/
    └── AuthService.test.ts

src/renderer/components/tasks/TaskCard/
├── TaskCard.tsx
├── TaskCard.module.css
└── __tests__/
    └── TaskCard.test.tsx

test/integration/
├── fixtures.ts
├── login.spec.ts
└── tasks.spec.ts
```

- Unit test files: `*.test.ts` or `*.test.tsx`
- Integration test files: `*.spec.ts`
- Place unit tests in `__tests__/` directory next to the source file
- Place integration tests in `test/integration/`

## Unit Testing

### Testing a Service (Main Process)

```typescript
// src/main/services/auth/__tests__/AuthService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../AuthService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it('should successfully authenticate valid credentials', async () => {
    const result = await authService.login('admin', 'password');

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.username).toBe('admin');
  });

  it('should reject invalid credentials', async () => {
    const result = await authService.login('admin', 'wrong');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should hash passwords before storing', async () => {
    const password = 'mypassword123';
    const hashed = await authService.hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed.length).toBeGreaterThan(20);
  });
});
```

### Testing a Repository (Database)

```typescript
// src/main/database/repositories/__tests__/UserRepository.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UserRepository } from '../UserRepository';
import { setupTestDatabase, teardownTestDatabase } from '@test/utils/database';

describe('UserRepository', () => {
  let userRepo: UserRepository;

  beforeEach(async () => {
    await setupTestDatabase();
    userRepo = new UserRepository();
  });

  afterEach(async () => {
    await teardownTestDatabase();
  });

  it('should create a new user', async () => {
    const user = await userRepo.create({
      username: 'testuser',
      passwordHash: 'hashed123',
      role: 'user',
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe('testuser');
  });

  it('should find user by id', async () => {
    const created = await userRepo.create({
      username: 'findme',
      passwordHash: 'hash',
      role: 'user',
    });

    const found = await userRepo.findById(created.id);

    expect(found).toBeDefined();
    expect(found?.username).toBe('findme');
  });

  it('should return null for non-existent user', async () => {
    const found = await userRepo.findById(99999);
    expect(found).toBeNull();
  });
});
```

### Testing a React Component

```typescript
// src/renderer/components/tasks/TaskCard/__tests__/TaskCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    assignedTo: 'John',
  };

  it('should render task information', () => {
    render(<TaskCard task={mockTask} onComplete={vi.fn()} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call onComplete when checkbox is clicked', () => {
    const onComplete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={onComplete} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('should display completed state correctly', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskCard task={completedTask} onComplete={vi.fn()} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
```

### Testing a Custom Hook

```typescript
// src/renderer/hooks/__tests__/useTasks.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTasks } from '../useTasks';

// Mock the IPC
vi.mock('@renderer/services/ipc', () => ({
  getTasks: vi.fn(() => Promise.resolve([
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
  ])),
}));

describe('useTasks', () => {
  it('should load tasks on mount', async () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].title).toBe('Task 1');
  });
});
```

## Integration Testing

Integration tests use Playwright to test the actual Electron application.

### Basic Integration Test

```typescript
// test/integration/tasks.spec.ts
import { test, expect } from './fixtures';

test.describe('Task Management', () => {
  test('should create a new task', async ({ page }) => {
    // Login first
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for main app
    await page.waitForTimeout(2000);

    // Navigate to tasks
    await page.click('text=Tasks');

    // Click create task button
    await page.click('button:has-text("New Task")');

    // Fill in task form
    await page.fill('input[name="title"]', 'My Integration Test Task');
    await page.fill('textarea[name="description"]', 'This is a test');

    // Submit
    await page.click('button:has-text("Create")');

    // Verify task appears in list
    await expect(page.locator('text=My Integration Test Task')).toBeVisible();
  });

  test('should complete a task and trigger reward animation', async ({ page }) => {
    // ... login and setup ...

    // Find and click task checkbox
    const taskCheckbox = await page.locator('.task-card >> input[type="checkbox"]').first();
    await taskCheckbox.click();

    // Verify reward animation appears
    await expect(page.locator('.reward-animation')).toBeVisible();

    // Verify task is marked as completed
    await expect(taskCheckbox).toBeChecked();
  });
});
```

### Using Custom Fixtures

```typescript
// test/integration/fixtures.ts
import { test as base, _electron as electron, ElectronApplication, Page } from '@playwright/test';
import path from 'path';

type ElectronFixtures = {
  electronApp: ElectronApplication;
  page: Page;
};

export const test = base.extend<ElectronFixtures>({
  electronApp: async ({}, use) => {
    const electronApp = await electron.launch({
      args: [path.join(__dirname, '../../.vite/build/index.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    });

    await electronApp.firstWindow();
    await use(electronApp);
    await electronApp.close();
  },

  page: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow();
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## Coverage Requirements

- **Minimum 70% coverage** for all metrics (lines, functions, branches, statements)
- Coverage is enforced in `vitest.config.ts`
- Run `npm run test:coverage` to generate a coverage report
- Coverage reports are generated in:
  - Terminal (summary)
  - `coverage/index.html` (detailed HTML report)

### Viewing Coverage

```bash
# Generate and view coverage
npm run test:coverage

# Open HTML report in browser
open coverage/index.html
```

## Best Practices

### 1. Test Organization

- **Arrange-Act-Assert (AAA)** pattern
  ```typescript
  it('should do something', () => {
    // Arrange - set up test data
    const input = 'test';

    // Act - perform the action
    const result = doSomething(input);

    // Assert - verify the result
    expect(result).toBe('expected');
  });
  ```

### 2. Test Descriptions

- Use clear, descriptive test names
- Start with "should" for behavior descriptions
- Be specific about what is being tested

```typescript
// Good
it('should return error when password is less than 8 characters', () => {});

// Bad
it('validates password', () => {});
```

### 3. Mocking

- Use `vi.fn()` for function mocks
- Use `vi.mock()` for module mocks
- Clear mocks between tests with `vi.clearAllMocks()`

```typescript
import { vi, beforeEach } from 'vitest';

const mockFn = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});
```

### 4. Async Testing

- Always use `async`/`await` for asynchronous tests
- Use `waitFor` from @testing-library/react for async UI updates

```typescript
it('should load data asynchronously', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### 5. Database Tests

- Use an in-memory database for tests
- Clean up after each test
- Use test-specific helper functions

```typescript
beforeEach(async () => {
  await setupTestDatabase();
});

afterEach(async () => {
  await teardownTestDatabase();
});
```

### 6. Component Testing

- Test user behavior, not implementation details
- Use accessible queries (getByRole, getByLabelText)
- Test interactions via user events

```typescript
// Good - tests user behavior
const button = screen.getByRole('button', { name: /submit/i });
fireEvent.click(button);

// Bad - tests implementation
const button = container.querySelector('.submit-btn');
button.click();
```

### 7. Integration Testing

- Test complete user flows
- Minimize use of `waitForTimeout` - use `waitForSelector` instead
- Test happy paths and error cases

## Common Testing Utilities

Create reusable test utilities in `test/utils/`:

```
test/utils/
├── setup.ts           # Global test setup
├── database.ts        # Database test helpers
├── render.ts          # Custom render functions
└── fixtures.ts        # Test data factories
```

### Example: Database Helper

```typescript
// test/utils/database.ts
import Database from 'better-sqlite3';

let testDb: Database.Database;

export async function setupTestDatabase() {
  testDb = new Database(':memory:');
  // Run migrations
  // Seed test data if needed
}

export async function teardownTestDatabase() {
  testDb.close();
}

export function getTestDatabase() {
  return testDb;
}
```

### Example: Component Render Helper

```typescript
// test/utils/render.tsx
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@renderer/store';

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
}
```

## Debugging Tests

### Vitest UI

```bash
npm run test:unit:ui
```

Opens a visual test runner in your browser.

### Playwright Debug Mode

```bash
npx playwright test --debug
```

Opens Playwright Inspector for step-by-step debugging.

### VS Code Integration

Install the Vitest extension for VS Code for inline test running and debugging.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Electron Testing Guide](https://www.electronjs.org/docs/latest/tutorial/automated-testing)

---

**Remember:** Tests are documentation. Write tests that clearly communicate what the code should do.
