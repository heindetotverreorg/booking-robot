import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    const {
        value,
        selector
    } = action

    await page.$eval(selector, (el, value) => {
        const inputEl = el as HTMLInputElement

        inputEl.value = value as string

        return inputEl.value
    }, value);
}