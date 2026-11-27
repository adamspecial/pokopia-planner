const fs = require('fs');
const path = require('path');
const { AxeBuilder } = require('@axe-core/playwright');
const { test, expect, boot, openTab, settle } = require('./helpers');

const BASE = path.join(__dirname, 'a11y-baseline.json');
const SCREENS = [
  ['map', async () => { }],
  ...['build', 'layers', 'materials', 'habitats', 'pokemon', 'game', 'plans'].map(t => ['tab ' + t, page => openTab(page, t)]),
  ['settings', async page => { await page.locator('#setBtn').click(); await expect(page.locator('#sets')).toBeVisible(); await settle(page); }],
  ['new plan dialog', async page => { await openTab(page, 'plans'); await page.locator('#tab-plans').getByRole('button', { name: 'New plan', exact: true }).click(); await expect(page.locator('#modalBox')).toBeVisible(); await settle(page); }],
];

test('accessibility scan finds nothing new', async ({ page }, info) => {
  await boot(page);
  const found = {};
  for (const [name, open] of SCREENS) {
    await boot(page);
    await open(page);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    for (const v of r.violations) {
      const k = v.id, f = found[k] || (found[k] = { impact: v.impact, help: v.help, nodes: 0, screens: [] });
      f.nodes += v.nodes.length;
      f.screens.push(name + ' (' + v.nodes.length + ')');
    }
  }
  const project = info.project.name.replace(/-edge$/, ''), all = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : {};
  if (process.env.UPDATE_A11Y) {
    all[project] = Object.fromEntries(Object.entries(found).sort().map(([k, v]) => [k, v.nodes]));
    fs.writeFileSync(BASE, JSON.stringify(all, null, 2) + '\n');
  }
  const was = all[project] || {}, worse = [];
  for (const [k, v] of Object.entries(found)) if (v.nodes > (was[k] || 0)) worse.push(k + ' (' + v.impact + '): ' + v.help + ', ' + v.nodes + ' now, ' + (was[k] || 0) + ' before, on ' + v.screens.join(', '));
  info.annotations.push({ type: 'axe', description: Object.entries(found).map(([k, v]) => k + ' ' + v.nodes).join(', ') || 'none' });
  expect(worse, 'accessibility problems that are new or more common than before').toEqual([]);
});
