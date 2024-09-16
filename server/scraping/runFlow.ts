import puppeteer, { Page } from 'puppeteer';
import type { Flow, Action, Step } from '@/types/flow'
import { doAction } from '@/server/scraping/doAction';

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(flow.url);

    await runFlowSteps({ steps: flow.steps, page, payload })

    console.log('10 sec wait before close')
    await doDelay(10000)

    await browser.close();

    return 'done'
}

const runFlowSteps = async ({
    steps,
    page,
    payload
} : {
    steps: Step[],
    page: Page,
    payload: Record<string, Action>
}) => {
    for (const step of steps) {
        console.log(step.name)
        const { actions } = step

        for (const action of actions) {
            await doAction(page, { ...action }, payload)
        }
    }
}