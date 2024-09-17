import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    let {
        format,
        value,
        selector
    } = action

    if (format === 'lastInArray') {
        value = await page.$eval(selector, (el) => {
            const selectEl = el as HTMLSelectElement
    
            if (selectEl) {
                const options = [...selectEl.options].map(option => (option.text))
                return options[options.length - 1]
            }
        });
    }

    await page.select(selector, value as string)
}