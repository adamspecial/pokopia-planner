const { test, expect, boot, m: onMap, drag, tap, openTab, newPlan, mapShot } = require('./helpers');

const TABS = ['build', 'layers', 'materials', 'habitats', 'pokemon', 'plans'];
const TOWNS = [['Withered Wasteland', 240], ['Bleak Beach', 272], ['Rocky Ridges', 272], ['Sparkling Skylands', 352], ['Palette Town', 384]];

test('starts with the example plan and no errors', async ({ page }) => {
  await boot(page);
  await expect(page.locator('#hdrPlan')).toHaveText(/Example/);
  await expect(page.locator('#map')).toBeVisible();
  await expect(page.locator('.tbtn[data-tool]')).toHaveCount(7);
});

test('opens every tab', async ({ page }) => {
  await boot(page);
  for (const t of TABS) {
    await openTab(page, t);
    await expect(page.locator('.tab[data-tab="' + t + '"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tab-' + t)).not.toBeEmpty();
  }
});

for (const [town, size] of TOWNS) {
  test('opens ' + town + ' at full size', async ({ page }) => {
    await boot(page);
    await openTab(page, 'plans');
    await page.locator('#tab-plans').getByRole('button', { name: town, exact: true }).first().click();
    await expect(page.locator('#hdrPlan')).toHaveText(new RegExp(town));
    await expect(page.locator('#toasts')).toContainText(size + '×' + size + ' tiles');
    await expect(page.locator('#saveChip')).toHaveText(/Saved/, { timeout: 30000 });
    for (const t of ['habitats', 'pokemon', 'materials', 'layers', 'build']) await openTab(page, t);
  });
}

test('uses each tool once', async ({ page }) => {
  await boot(page);
  await newPlan(page, 'Tool check');
  const m = onMap(page), undo = page.locator('#undoBtn'), redo = page.locator('#redoBtn'), insp = page.locator('#inspector');
  const tool = async t => { await page.locator('.tbtn[data-tool="' + t + '"]').click(); await expect(page.locator('.tbtn[data-tool="' + t + '"]')).toHaveAttribute('aria-pressed', 'true'); };
  const changes = async (what, act) => { const was = await mapShot(page); await act(); await expect.poll(async () => Buffer.compare(was, await mapShot(page)) !== 0, { message: what + ' changes the map' }).toBe(true); return was; };

  await tool('pan');
  await changes('Pan', () => drag(page, m.at(0.5, 0.5), m.at(0.3, 0.4)));
  await page.locator('#zfit').click();
  await page.waitForTimeout(400);

  await tool('place');
  await expect(undo).toBeDisabled();
  await changes('Place', () => drag(page, m.at(0.45, 0.5), m.at(0.55, 0.5)));
  await expect(undo).toBeEnabled();

  await tool('rect');
  const beforeFill = await changes('Fill', () => drag(page, m.at(0.4, 0.4), m.at(0.5, 0.45)));
  await undo.click();
  await expect.poll(async () => Buffer.compare(beforeFill, await mapShot(page)), { message: 'Undo puts the map back' }).toBe(0);
  await expect(redo).toBeEnabled();
  await changes('Redo', () => redo.click());

  await tool('erase');
  await changes('Erase', () => drag(page, m.at(0.45, 0.5), m.at(0.5, 0.5)));

  await tool('pick');
  await tap(page, m.at(0.42, 0.42));
  await expect(page.locator('.tbtn[data-tool="place"]')).toHaveAttribute('aria-pressed', 'true');

  await openTab(page, 'build');
  await page.locator('#itemSearch').fill('Straw stool');
  await page.locator('[data-item="Straw stool"]').click();
  await expect(page.locator('.tbtn[data-tool="place"]')).toHaveAttribute('aria-pressed', 'true');
  await changes('Placing a stool', () => tap(page, m.at(0.62, 0.62)));

  await tool('select');
  await drag(page, m.at(0.58, 0.58), m.at(0.66, 0.66));
  await expect(insp).toHaveClass(/open/);
  await expect(insp).toContainText('Straw stool');
  await page.keyboard.press('Escape');

  await tool('zone');
  await drag(page, m.at(0.3, 0.6), m.at(0.5, 0.72));
  await expect(insp).toHaveClass(/open/);
  await expect(insp).toContainText('Zone 1');
  await page.keyboard.press('Escape');
  await openTab(page, 'habitats');
});

test('switches between the 3D and flat maps', async ({ page }) => {
  await boot(page);
  const has3d = await page.evaluate(() => { const c = document.createElement('canvas'); return !!c.getContext('webgl2'); });
  test.skip(!has3d, 'this browser has no WebGL 2');
  const flat = page.locator('#map3d');
  await expect(flat).toBeVisible();
  await page.locator('#ztilt').click();
  await page.locator('#viewmenu').getByRole('menuitemradio', { name: 'Angled' }).click();
  await expect(page.locator('#ztilt')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#ztilt').click();
  await page.locator('#viewmenu').getByRole('menuitemradio', { name: 'From the top' }).click();
  await page.locator('#setBtn').click();
  const sw = page.locator('#sets').getByRole('switch', { name: '3D view' });
  await expect(sw).toHaveAttribute('aria-checked', 'true');
  await sw.click();
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await page.locator('#sets').getByRole('button', { name: 'Close settings' }).click();
  await expect(flat).toBeHidden();
  await page.locator('#setBtn').click();
  await sw.click();
  await page.locator('#sets').getByRole('button', { name: 'Close settings' }).click();
  await expect(flat).toBeVisible();
});

test('opens settings and every section', async ({ page }) => {
  await boot(page);
  await page.locator('#setBtn').click();
  const sets = page.locator('#sets');
  await expect(sets.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  const n = await sets.locator('.snav button').count();
  expect(n).toBeGreaterThan(3);
  for (let i = 0; i < n; i++) await sets.locator('.snav button').nth(i).click();
  await expect(sets).toContainText('Game data');
  await page.keyboard.press('Escape');
  await expect(sets).toBeHidden();
});

test('keeps a plan after a reload', async ({ page }) => {
  await boot(page);
  await newPlan(page, 'Kept plan');
  await expect(page.locator('#saveChip')).toHaveText(/Saved/);
  await page.reload();
  await expect(page.locator('#hdrPlan')).toHaveText('Kept plan');
});
