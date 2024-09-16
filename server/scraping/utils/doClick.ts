import { Page } from 'puppeteer';
import { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    const {
        selector
    } = action

    await page.click(selector)
}