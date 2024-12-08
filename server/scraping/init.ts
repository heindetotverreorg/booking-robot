import puppeteer from 'puppeteer';
import type { Flow } from '@/types/flow'

export const init = async (
    flow: Flow,
) => {
    console.log('ERRORLOG: Do init')

    const browserConfig = {
        headless: true,
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

    console.log('ERRORLOG: new page created')

    console.log('ERRORLOG: start delay')
    await doWait(page, {
        delay: 500,
        type: '',
        selector: '',
        value: '',
        key: ''
    });
    console.log('ERRORLOG: stop delay')

    await page.goto(flow.url);

    console.log('ERRORLOG: new url created')

    return { page, browser }
}