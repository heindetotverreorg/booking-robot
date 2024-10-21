import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    let {
        replaceValue,
        value,
        selector
    } = action

    if (replaceValue === 'lastInArray') {
        value = await page.$eval(selector, (el) => {
            const selectEl = el as HTMLSelectElement
    
            if (selectEl) {
                const options = [...selectEl.options].map(option => (option.text))
                return options[options.length - 1]
            }
        });
    }

    if (replaceValue === 'selectFromTextInOption') {
        value = await page.$eval(selector, (el, value) => {
            const selectEl = el as HTMLSelectElement
    
            if (selectEl) {
                const options = [...selectEl.options].map(option => ({
                    text: option.text,  
                    value: option.value
                }))
                const option = options.find(option => option.text.includes(value as string))
                return option?.value
            }
        }, value);
    }
    
    await page.select(selector, value as string)
}