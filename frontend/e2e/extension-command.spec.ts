import { test, expect } from '@playwright/test';

test.describe('Extension Command Execution', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the connected tools API
    await page.route('**/extensions/connected_tools', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            client_id: 'test-tool-id',
            application_name: 'Test Tool',
            user_entity_name: 'Test User',
            supported_commands: [
              {
                name: 'test_command',
                description: 'A test command description',
                inputSchema: JSON.stringify({
                  type: 'object',
                  properties: {
                    arg1: { type: 'string', description: 'Test argument' }
                  },
                  required: ['arg1']
                })
              }
            ]
          }
        ])
      });
    });

    // Mock the call_tool API
    await page.route('**/extensions/call_tool', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          result: { output: 'Hello from test command!' }
        })
      });
    });

    await page.goto('http://localhost:4200');
  });

  test('should run an extension command and display output', async ({ page }) => {
    // 1. Find and click on the extension tool in the list
    await expect(page.getByText('Test Tool')).toBeVisible();
    await page.getByText('Test Tool').click();

    // 2. Verify tool details are shown
    await expect(page.getByText('ID: test-tool-id')).toBeVisible();
    await expect(page.getByText('test_command')).toBeVisible();

    // 3. Click 'Run Command' button (play_arrow icon)
    await page.getByRole('button', { name: 'Run Command' }).click();

    // 4. Verify popup is open
    await expect(page.getByRole('heading', { name: 'Run: test_command' })).toBeVisible();
    await expect(page.getByText('A test command description')).toBeVisible();

    // 5. Fill the dynamic form
    await page.getByLabel('arg1').fill('test value');

    // 6. Click 'Run'
    await page.getByRole('button', { name: 'Run', exact: true }).click();

    // 7. Verify output
    await expect(page.locator('.output-area pre')).toContainText('Hello from test command!');

    // 8. Close popup
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Run: test_command' })).not.toBeVisible();
  });
});
