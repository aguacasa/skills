// Finds a locally installed Chrome/Chromium for puppeteer-core. Override with CHROME_PATH.
import { existsSync } from 'node:fs';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
];

export function chromePath() {
  const found = CANDIDATES.find((path) => path && existsSync(path));
  if (!found) throw new Error('Chrome not found. Install Google Chrome or set CHROME_PATH.');
  return found;
}

export const launchOptions = () => ({
  executablePath: chromePath(),
  headless: 'new',
  // Metal-backed ANGLE keeps WebGL (three.js scenes) rendering in headless mode on macOS.
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});
