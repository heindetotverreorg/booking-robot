import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    await page.waitForSelector(action.wait as string)
}