// Loads a page and evaluates a JS expression in it; prints the result plus failed requests.
// Use it to inspect computed styles, DOM state, or storefront JSON without screenshots.
//
//   node page-check.mjs <url> <width> <height> "<js expression>"
//   node page-check.mjs http://127.0.0.1:9292/ 1440 900 "document.querySelectorAll('canvas').length"
import puppeteer from 'puppeteer-core';
import { launchOptions } from './chrome.mjs';

const [url, w, h, expr] = process.argv.slice(2);
const browser = await puppeteer.launch(launchOptions());
const page = await browser.newPage();
await page.setViewport({ width: +w || 1440, height: +h || 900 });
const failed = [];
page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url().slice(0, 140)}`));
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));
const result = expr ? await page.evaluate(expr) : null;
console.log(JSON.stringify({ result, errors, failed }, null, 1));
await browser.close();
