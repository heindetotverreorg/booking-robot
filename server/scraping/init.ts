import puppeteer from 'puppeteer';
import type { Flow } from '@/types/flow'

export const init = async (
    flow: Flow,
) => {
    console.log('ERRORLOG: Do init for url: ', flow.url)

    const browserConfig = {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-zygote',
        ],
        env: {
            DISPLAY: ":10.0"
        }
    }

    try {
        console.log('ERRORLOG: try to launch browser . . . .')
        const browser = await puppeteer.launch(browserConfig);

        console.log('ERRORLOG: new browser launched')

        const page = await browser.newPage();

        console.log('ERRORLOG: new page created')

        await page.goto(flow.url);

        console.log('ERRORLOG: new url created')

        return { page, browser }
    } catch (error) {
        console.log('ERRORLOG: error in init', error)
    }
}