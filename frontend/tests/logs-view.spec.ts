import { test, expect } from '@playwright/test';

test.describe('LogsViewComponent', () => {
  test.beforeEach(async ({ page }) => {
    // Mock LogStreamService and LogsService for isolated component testing
    await page.route('**/logs/stream', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: '' // Empty stream for initial setup
      });
    });

    await page.route('**/logs/?n=100', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { timestamp: '2025-11-17T10:00:00Z', collectionId: 'col1', collectionName: 'Collection 1', topic: 'INFO', message: 'Initial log 1' },
          { timestamp: '2025-11-17T09:00:00Z', collectionId: 'col2', collectionName: 'Collection 2', topic: 'WARN', message: 'Initial log 2' },
        ])
      });
    });
  });

  test('should display initial logs', async ({ page }) => {
    await page.goto('/selected-collection/col1'); // Navigate to a page where logs-view is present

    // Assuming app-logs-view is directly rendered or within a known parent
    const logsView = page.locator('app-logs-view');
    await expect(logsView).toBeVisible();

    await expect(logsView.getByText('Initial log 1')).toBeVisible();
    await expect(logsView.getByText('Initial log 2')).toBeVisible();
  });

  test('should display new logs from SSE', async ({ page }) => {
    await page.goto('/selected-collection/col1');

    const logsView = page.locator('app-logs-view');
    await expect(logsView).toBeVisible();

    // Simulate a new SSE event
    await page.evaluate(() => {
      const event = new MessageEvent('message', {
        data: JSON.stringify({ timestamp: '2025-11-17T11:00:00Z', collectionId: 'col1', collectionName: 'Collection 1', topic: 'DEBUG', message: 'New log from SSE' })
      });
      // Dispatch the event to the EventSource instance
      // This assumes there's a global EventSource instance or a way to access it
      // A more robust solution would involve mocking EventSource directly
      window.dispatchEvent(event);
    });

    await expect(logsView.getByText('New log from SSE')).toBeVisible();
    // Verify ordering (newest on top) - this might require more specific selectors
    const firstLog = logsView.locator('.log-item').first();
    await expect(firstLog.getByText('New log from SSE')).toBeVisible();
  });

  test('should filter logs by collectionId', async ({ page }) => {
    await page.goto('/selected-collection/col1');

    const logsView = page.locator('app-logs-view');
    await expect(logsView).toBeVisible();

    // Only logs for 'col1' should be visible
    await expect(logsView.getByText('Initial log 1')).toBeVisible();
    await expect(logsView.getByText('Initial log 2')).not.toBeVisible();

    // Simulate navigating to another collection (or changing input property)
    // For a real component test, you'd change the @Input() directly.
    // For an e2e test, you'd navigate or interact with UI to change the collection.
    // Here, we'll simulate a new route with a different collectionId
    await page.goto('/selected-collection/col2');
    await expect(logsView.getByText('Initial log 1')).not.toBeVisible();
    await expect(logsView.getByText('Initial log 2')).toBeVisible();
  });

  test('should display "No logs to display" when no logs are present', async ({ page }) => {
    // Mock initial logs to be empty
    await page.route('**/logs/?n=100', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/selected-collection/col1');

    const logsView = page.locator('app-logs-view');
    await expect(logsView).toBeVisible();
    await expect(logsView.getByText('No logs to display.')).toBeVisible();
  });
});
