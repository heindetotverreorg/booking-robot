import puppeteer from 'puppeteer';
import type { Flow } from '@/types/flow'

export const init = async (
    flow: Flow,
) => {
    const browserConfig = {
        headless: process.env.NODE_ENV === 'production' ? true : false,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage'
        ],
        env: {
            DISPLAY: ":10.0"
        }
    }

    const browser = await puppeteer.launch(browserConfig);

    const page = await browser.newPage();

    await page.goto(flow.url);

    return { page, browser }
}