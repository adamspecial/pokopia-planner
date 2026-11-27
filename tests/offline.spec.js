const { test, expect, boot } = require('./helpers');

test.use({ serviceWorkers: 'allow' });

test('works offline once opened', async ({ page, context }) => {
  await boot(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(async () => {
    const keys = await caches.keys();
    for (const k of keys) { const c = await caches.open(k); if (await c.match('data.json', { ignoreSearch: true }) && await c.match('app.js', { ignoreSearch: true })) return true; }
    return false;
  }), { timeout: 30000 }).toBe(true);
  await page.reload();
  await expect(page.locator('#hdrPlan')).not.toHaveText('Loading…');
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#hdrPlan')).toHaveText(/Example/);
  await expect(page.locator('#map')).toBeVisible();
  await context.setOffline(false);
});
