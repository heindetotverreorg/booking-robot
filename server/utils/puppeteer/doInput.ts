import { Page, ElementHandle } from 'puppeteer';
import type { Action } from '@/types/flow'
import doDelay from './doDelay';

export default async (page: Page, action: Action) => {
    const {
        parentSelector,
        value,
        selector
    } = action

    if (parentSelector) {
        const current_element = await page.$(parentSelector);
        const parent_node = await current_element?.getProperty('parentNode') as ElementHandle;
        const target_element = await parent_node?.$(selector);
        await target_element?.type(value as string, {  delay: 50 });
        await doDelay(10000)
        await target_element?.click()

        return
    }


    await page.$eval(selector, (el, value) => {
        const inputEl = el as HTMLInputElement

        inputEl.value = value as string

        inputEl.dispatchEvent(new Event('input', { bubbles: true }))

        return inputEl.value
    }, value);
}