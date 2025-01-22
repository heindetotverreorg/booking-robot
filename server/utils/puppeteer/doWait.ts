import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'
import { doDelay } from '@/server/utils/puppeteer';

export default async (page: Page, action: Action) => {
    if (action.waitSelectorHidden) {
        await page.waitForSelector(action.waitSelectorHidden, { hidden: true })
    }

    if (action.waitSelector) {
        await page.waitForSelector(action.waitSelector)
    }
    if (action.delay) {
        await doDelay(action.delay)
    }   
}