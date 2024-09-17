import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    const {
        parentSelector,
        value,
        selector
    } = action

    if (parentSelector) {
        await page.$eval(parentSelector, (el, selector, value) => {
            const parentEl = el as HTMLInputElement

            const inputEl = parentEl.parentElement?.querySelector(selector) as HTMLInputElement
    
            inputEl.value = value as string
    
            return inputEl.value
        }, selector, value);

        return
    }

    await page.$eval(selector, (el, value) => {
        const inputEl = el as HTMLInputElement

        inputEl.value = value as string

        return inputEl.value
    }, value);
}