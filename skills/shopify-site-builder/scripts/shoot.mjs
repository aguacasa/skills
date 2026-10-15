// Screenshots a page at several scroll positions in headless Chrome.
//
//   node shoot.mjs <url> <outPrefix> <width> <height> <stops|auto> [--mobile] [--skip-intro=<sessionStorageKey>]
//
// <stops> is a comma list of scroll offsets in px, or "auto" for one screenshot per viewport.
// Handles themes that scroll an inner wrapper instead of the window (Shopify Helio/Horizon
// scroll `.page-wrapper` from 990px up) and pages using Lenis (window.__lenis or window.__rzLenis).
import puppeteer from 'puppeteer-core';
import { launchOptions } from './chrome.mjs';

const [url, out, w, h, stopsArg, ...flags] = process.argv.slice(2);
if (!url || !out) {
  console.error('usage: node shoot.mjs <url> <outPrefix> <width> <height> <stops|auto> [--mobile] [--skip-intro=key]');
  process.exit(1);
}
const mobile = flags.includes('--mobile');
const introKey = flags.find((f) => f.startsWith('--skip-intro='))?.split('=')[1];

const browser = await puppeteer.launch(launchOptions());
const page = await browser.newPage();
await page.setViewport({ width: +w || 1440, height: +h || 900, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
const logs = [];
page.on('console', (m) => ['error', 'warn'].includes(m.type()) && logs.push(`${m.type()}: ${m.text()}`));
page.on('pageerror', (e) => logs.push(`pageerror: ${e.message}`));
if (introKey) await page.evaluateOnNewDocument((key) => { try { sessionStorage.setItem(key, '1'); } catch {} }, introKey);

await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 3500));

const scrollerHeight = () =>
  page.evaluate(() => {
    const wrapper = document.querySelector('.page-wrapper');
    const inner = wrapper && getComputedStyle(wrapper).overflowY === 'auto' ? wrapper : document.documentElement;
    return inner.scrollHeight;
  });
const total = await scrollerHeight();
const height = +h || 900;
const stops = stopsArg === 'auto'
  ? Array.from({ length: Math.ceil(total / height) }, (_, i) => i * height)
  : String(stopsArg || '0').split(',').map(Number);

let i = 0;
for (const y of stops) {
  await page.evaluate((top) => {
    const lenis = window.__lenis || window.__rzLenis;
    if (lenis) return lenis.scrollTo(top, { immediate: true, force: true });
    const wrapper = document.querySelector('.page-wrapper');
    const inner = wrapper && getComputedStyle(wrapper).overflowY === 'auto' ? wrapper : document.scrollingElement;
    inner.scrollTo(0, top);
  }, y);
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: `${out}-${String(i++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70 });
}

const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
console.log(JSON.stringify({ total, shots: stops.length, canvases, logs: logs.slice(0, 20) }, null, 1));
await browser.close();
