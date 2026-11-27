const { test, expect, openTab, m: onMap, drag } = require('./helpers');

const SLOW = 4;
const LIMIT = { start: 4000, edit: 800, frame: 100 };

async function slow(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: SLOW });
  return cdp;
}

async function watch(page) {
  await page.evaluate(() => {
    window.__ev = [];
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__ev.push([e.name, Math.round(e.duration)]); }).observe({ type: 'event', durationThreshold: 16 });
  });
}

test('starts within the limit on a mid-range phone', async ({ page }) => {
  await slow(page);
  const times = [];
  for (let i = 0; i < 3; i++) {
    await page.goto('/');
    await expect(page.locator('#saveChip')).not.toHaveText(/Starting/);
    await expect(page.locator('#hdrPlan')).not.toHaveText('Loading…');
    times.push(await page.evaluate(() => Math.round(performance.now())));
  }
  const best = Math.min(...times);
  test.info().annotations.push({ type: 'start-up', description: times.join(', ') + ' ms' });
  console.log('start-up', times);
  expect(best, 'start-up in ms').toBeLessThan(LIMIT.start);
});

test('edits and pans Palette Town within the limits', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hdrPlan')).not.toHaveText('Loading…');
  await openTab(page, 'plans');
  await page.locator('#tab-plans').getByRole('button', { name: 'Palette Town', exact: true }).first().click();
  await expect(page.locator('#hdrPlan')).toHaveText(/Palette Town/);
  await expect(page.locator('#saveChip')).toHaveText(/Saved/, { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  await slow(page);
  await watch(page);
  const m = onMap(page);
  await page.locator('.tbtn[data-tool="place"]').click();
  for (let i = 0; i < 3; i++) await drag(page, m.at(0.4, 0.5 + i * 0.03), m.at(0.5, 0.5 + i * 0.03), 4);
  await page.waitForTimeout(1500);
  const edits = await page.evaluate(() => window.__ev.filter(([n]) => /pointer|touch/.test(n)).map(([, d]) => d));
  await page.locator('.tbtn[data-tool="pan"]').click();
  await page.evaluate(() => { window.__fr = []; window.__frOn = true; let last = 0; const tick = t => { if (last) window.__fr.push(Math.round(t - last)); last = t; if (window.__frOn) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  await drag(page, m.at(0.5, 0.6), m.at(0.3, 0.4), 30);
  await drag(page, m.at(0.3, 0.4), m.at(0.6, 0.5), 30);
  const frames = await page.evaluate(() => { window.__frOn = false; return window.__fr; });
  const sorted = frames.slice().sort((a, b) => a - b), p90 = sorted.length ? sorted[Math.floor(sorted.length * 0.9)] : 0;
  const edit = edits.length ? Math.max(...edits) : 0;
  console.log('slowest edit', edit, 'frames while panning', frames.length, 'p90', p90, 'max', sorted[sorted.length - 1]);
  test.info().annotations.push({ type: 'edit', description: edit + ' ms' }, { type: 'frames', description: frames.length + ' frames, 90% within ' + p90 + ' ms' });
  expect(edit, 'slowest edit, from touch to the next frame, in ms').toBeLessThan(LIMIT.edit);
  expect(p90, 'frame time while panning, 90th percentile, in ms').toBeLessThan(LIMIT.frame);
});
