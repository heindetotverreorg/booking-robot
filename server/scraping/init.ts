import puppeteer from 'puppeteer';
import type { Flow } from '@/types/flow'

export const init = async (
    flow: Flow,
) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(flow.url);

    return { page, browser }
}