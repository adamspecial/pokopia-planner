const { test, expect, boot } = require('./helpers');

test('text can be shown in another language', async ({ page }) => {
  await boot(page);
  const en = await page.evaluate(() => [say('Theme'), say('Version {v}', { v: '1.2' }), sayN('Remove {n} saved picture', 'Remove {n} saved pictures', 1), sayN('Remove {n} saved picture', 'Remove {n} saved pictures', 1200)]);
  expect(en).toEqual(['Theme', 'Version 1.2', 'Remove 1 saved picture', 'Remove 1,200 saved pictures']);
  await page.evaluate(() => {
    TR.fr = { Theme: 'Thème', Pan: 'Déplacer', 'Zoom in': 'Zoom avant', Settings: 'Paramètres', 'Remove {n} saved pictures': { one: 'Retirer {n} image', other: 'Retirer {n} images' } };
    LANG = 'fr';
    sayPage(document);
  });
  await expect(page.locator('.tbtn[data-tool="pan"]')).toContainText('Déplacer');
  await expect(page.locator('#zin')).toHaveAttribute('aria-label', 'Zoom avant');
  await expect(page.locator('#zin')).toHaveAttribute('data-tip', 'Zoom avant');
  await expect(page.locator('.tbtn[data-tool="place"]')).toContainText('Place');
  const fr = await page.evaluate(() => [sayN('Remove {n} saved picture', 'Remove {n} saved pictures', 1), sayN('Remove {n} saved picture', 'Remove {n} saved pictures', 3), say('Version {v}', { v: '2' })]);
  expect(fr).toEqual(['Retirer 1 image', 'Retirer 3 images', 'Version 2']);
  await page.locator('#setBtn').click();
  await expect(page.locator('#sets h2')).toHaveText('Paramètres');
  await expect(page.locator('#sets')).toContainText('Thème');
});
