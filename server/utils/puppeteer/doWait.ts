import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    if (action.waitSelector) {
        await page.waitForSelector(action.waitSelector)
    }
    if (action.delay) {
        await doDelay(action.delay)
    }   
}