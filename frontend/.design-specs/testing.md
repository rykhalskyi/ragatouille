# Testing Tech Stack and Structure

This project uses modern automated testing practices to ensure UI stability and functional correctness.

## Framework: Playwright

[Playwright](https://playwright.dev/) is the primary framework for end-to-end (E2E) testing. It is configured to run tests against the application in a real browser environment (primarily Chromium).

### Key Configuration
- **Location**: `playwright.config.ts` in the project root.
- **Test Directory**: All E2E tests are located in the `e2e/` folder.
- **Base URL**: Tests are configured to run against `http://localhost:4200`.
- **Parallelism**: Tests are set to run in parallel to optimize execution time.
- **Reporters**: HTML reports are generated after test execution.

## Test Structure

### E2E Tests (`e2e/*.spec.ts`)
Actual test implementations are written in TypeScript using Playwright's test runner.
- **Organization**: Tests use `test.step` to group logical actions, making the test execution flow readable in reports.
- **Setup/Cleanup**: Tests often include logic to ensure a clean state (e.g., deleting collections if they already exist).
- **Targeting Elements**: Elements are targeted using `page.getByTestId()` for robustness.

### Test Scenarios (`e2e/scenarios/*.md`)
Common language scenarios are stored in the `e2e/scenarios/` directory. These files describe the steps and expected outcomes in a human-readable format, serving as the blueprint for the actual `.spec.ts` implementations.

### Test Data (`e2e/text/`)
Static files used for testing (e.g., text files for import functionality) are stored here.

## UI Element Identification: Test IDs

To avoid fragile selectors (like CSS classes or DOM structure), the project uses a centralized Test ID system.

- **Definition**: `src/app/testing/test-ids.ts`
- **Usage**:
  - **In Code**: Elements in components are marked with `data-testid` attributes.
  - **In Tests**: `TestIds` constant is imported and used with `page.getByTestId(TestIds.someElement)`.

Example:
```typescript
import { TestIds } from '@testing/test-ids';
// ...
await page.getByTestId(TestIds.addCollectionButton).click();
```

## Running Tests

Tests are integrated with the local development workflow:
- The Playwright configuration is set to automatically run `npm run start` to serve the application before starting tests if it's not already running.
