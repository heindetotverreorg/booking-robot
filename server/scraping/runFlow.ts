import puppeteer from 'puppeteer';
import type { Flow, Action } from '@/types/flow'
import { runSteps } from './runSteps';

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(flow.url);

    const message = await runSteps({ steps: flow.steps, page, payload })

    console.log('delay 10 seconds before closing')
    await doDelay(10000)

    await browser.close();

    return message
}
