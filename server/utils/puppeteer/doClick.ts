import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    const {
        selector,
        value
    } = action

    await page.click(selector)
}