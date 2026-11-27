const { test, expect, openTab } = require('./helpers');

const at = s => new Date(s).getTime();

async function start(page, when) {
  await page.clock.install({ time: at(when) });
  await page.goto('/');
  await expect(page.locator('#hdrPlan')).not.toHaveText('Loading…');
  await openTab(page, 'game');
  await expect(page.locator('#tab-game h2')).toContainText('Today');
}

test('counts down to 05:00 and clears the daily list then', async ({ page }) => {
  await start(page, '2026-11-27T04:30:00');
  await expect(page.locator('#tdLeft')).toHaveText(/^(30:00|29:[0-5]\d)$/);
  await expect(page.locator('#tdNow')).toContainText('Night');
  const first = page.locator('#tab-game .dl input[type="checkbox"]').first();
  await first.check();
  await expect(page.locator('#tab-game h3').first()).toContainText('1 of 6 done');
  await page.reload();
  await openTab(page, 'game');
  await expect(page.locator('#tab-game .dl input[type="checkbox"]').first()).toBeChecked();
  await page.clock.fastForward(at('2026-11-27T05:00:01') - await page.evaluate(() => Date.now()));
  await expect(page.locator('#toasts')).toContainText('new day');
  await expect(page.locator('#tab-game .dl input[type="checkbox"]').first()).not.toBeChecked();
  await expect(page.locator('#tdNow')).toContainText('Morning');
  await expect(page.locator('#tdLeft')).toHaveText(/^23 h 59 min$/);
});

test('knows the week, the event and what is coming', async ({ page }) => {
  await start(page, '2026-11-27T12:00:00');
  await expect(page.locator('#tab-game')).toContainText('Friday: the daily challenge pays 50% more coins today');
  await expect(page.locator('#tab-game')).toContainText('Lucky Day on Sunday, in 2 days');
  await expect(page.locator('#tab-game')).toContainText('Apples to Applin');
  await expect(page.locator('#tab-game')).toContainText('4 days left');
  await expect(page.locator('#tab-game')).toContainText('Dazzling Decorations');
  await expect(page.locator('#tab-game')).toContainText('In 12 days');
});

test('the morning rule, the event end and Sunday', async ({ page }) => {
  await start(page, '2026-11-29T07:30:00');
  await expect(page.locator('#tdNow')).toContainText('Morning');
  await expect(page.locator('#tab-game')).toContainText('Lucky Day: more ripples and dropped items today');
  await expect(page.locator('#tab-game')).toContainText('2 days left');
  await expect(page.locator('#tab-game')).toContainText('Friday payouts in 5 days');
  await page.locator('#setBtn').click();
  await page.locator('#sets').getByRole('group', { name: 'Morning ends at' }).getByRole('button', { name: '07:00' }).click();
  await page.locator('#sets').getByRole('button', { name: 'Close settings' }).click();
  await openTab(page, 'game');
  await expect(page.locator('#tdNow')).toContainText('Day');
  await page.clock.setSystemTime(at('2026-12-01T05:00:30'));
  await page.reload();
  await openTab(page, 'game');
  await expect(page.locator('#tab-game')).not.toContainText('Apples to Applin');
});

test('own items, hiding, the console clock and timers', async ({ page }) => {
  await start(page, '2026-11-27T20:00:00');
  await page.locator('#tab-game').getByRole('button', { name: 'Add your own' }).click();
  await page.locator('#ownN').fill('Water the berry field');
  await page.locator('#modalBox').getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('#tab-game')).toContainText('Water the berry field');
  await page.locator('#tab-game').getByRole('button', { name: 'Hide Stamp card' }).click();
  await expect(page.locator('#tab-game')).not.toContainText('Stamp card');
  await expect(page.locator('#tab-game h3').first()).toContainText('0 of 6 done');
  await page.locator('#tab-game').getByRole('button', { name: 'Show 1 hidden' }).click();
  await expect(page.locator('#tab-game')).toContainText('Stamp card');
  await page.locator('#tab-game').getByRole('button', { name: 'Console clock', exact: true }).click();
  await page.locator('#clockAt').fill('2026-11-28T04:50');
  await page.locator('#modalBox').getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#tdLeft')).toHaveText(/^(10:00|9:[0-5]\d)$/);
  await expect(page.locator('#tab-game')).toContainText('Console clock: +8 h 50 min');
  await page.locator('#tab-game').getByRole('button', { name: 'Kit, 15 min' }).click();
  await expect(page.locator('#tab-game .dl .chip').first()).toHaveText(/^1[45]:\d\d$/);
  const ics = page.waitForEvent('download');
  await page.locator('#tab-game').getByRole('button', { name: 'Add Kit, 15 minutes to your calendar' }).click();
  const file = await ics;
  expect(file.suggestedFilename()).toBe('kit-15-minutes.ics');
  await page.clock.fastForward(await page.evaluate(() => JSON.parse(localStorage.getItem('pokopia-planner:timers'))[0].end - Date.now() + 1000));
  await expect(page.locator('#toasts')).toContainText('Kit, 15 minutes is done');
  await expect(page.locator('#tab-game .dl .chip.good')).toHaveText('Done');
});
