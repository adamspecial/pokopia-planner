const base = require('@playwright/test');

const OUTSIDE = /^https?:\/\/(?!127\.0\.0\.1:8123\/)/;
const NOISE = /Failed to load resource|favicon/;

const test = base.test.extend({
  errors: [async ({ page }, use) => {
    const errs = [];
    page.on('pageerror', e => errs.push('page error: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errs.push('console: ' + m.text()); });
    await page.route(OUTSIDE, r => {
      const u = r.request().url();
      r.fulfill({ status: 200, contentType: /\.css|fonts\.googleapis/.test(u) ? 'text/css' : 'text/plain', body: '' });
    });
    await use(errs);
    if (!page.isClosed()) await settle(page).catch(() => { });
    base.expect(errs, 'no errors in the page').toEqual([]);
  }, { auto: true }],
});

async function settle(page) {
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 150)))));
}

async function boot(page) {
  await page.goto('/');
  await base.expect(page.locator('#hdrPlan')).not.toHaveText('Loading…');
  await base.expect(page.locator('#saveChip')).not.toHaveText(/Starting/);
}

const isTouch = page => !!page.context()._options.hasTouch;

async function mapAt(page, fx, fy) {
  const b = await page.locator('#map').boundingBox();
  return { x: b.x + b.width * fx, y: b.y + b.height * fy };
}

const m = page => ({ at: (fx, fy) => mapAt(page, fx, fy) });

async function drag(page, a, b, steps = 8) {
  const from = await a, to = await b;
  if (isTouch(page)) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
    for (let i = 1; i <= steps; i++) {
      const x = from.x + (to.x - from.x) * i / steps, y = from.y + (to.y - from.y) * i / steps;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
  } else {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps });
    await page.mouse.up();
  }
}

async function tap(page, q) {
  const p = await q;
  if (isTouch(page)) await page.touchscreen.tap(p.x, p.y); else await page.mouse.click(p.x, p.y);
}

async function openTab(page, name) {
  await page.locator('.tab[data-tab="' + name + '"]').click();
  await base.expect(page.locator('#tab-' + name)).toBeVisible();
  await settle(page);
}

async function newPlan(page, name, size = 24) {
  await openTab(page, 'plans');
  await page.locator('#tab-plans').getByRole('button', { name: 'New plan', exact: true }).click();
  await page.locator('#npName').fill(name);
  await page.locator('#npW').fill(String(size));
  await page.locator('#npH').fill(String(size));
  await page.locator('#modalBox').getByRole('button', { name: 'Create' }).click();
  await base.expect(page.locator('#hdrPlan')).toHaveText(name);
  await base.expect(page.locator('#modal')).not.toHaveClass(/open|show/);
}

async function mapShot(page) {
  return page.locator('#mapwrap').screenshot({ animations: 'disabled' });
}

module.exports = { test, expect: base.expect, boot, settle, mapAt, m, drag, tap, openTab, newPlan, mapShot, isTouch };
