const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: /\.spec\.js$/,
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: { baseURL: 'http://127.0.0.1:8123/', serviceWorkers: 'block', trace: 'off' },
  webServer: {
    command: 'node serve.js',
    url: 'http://127.0.0.1:8123/',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'android-phone', testIgnore: /timing\.spec\.js$/, use: { ...devices['Pixel 7'] } },
    { name: 'windows', testIgnore: /timing\.spec\.js$/, use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
    ...(process.env.EDGE ? [{ name: 'windows-edge', testIgnore: /timing\.spec\.js$/, use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1366, height: 768 } } }] : []),
    { name: 'phone-timing', testMatch: /timing\.spec\.js$/, fullyParallel: false, use: { ...devices['Pixel 7'] } },
  ],
});
