import { Page } from 'puppeteer';
import { trimNamePart } from '@/server/utils/selectors';
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
        const options = await page.$eval(selector, (el) => {
            const selectEl = el as HTMLSelectElement
    
            if (selectEl) {
                const options = [...selectEl.options].map(option => ({
                    text: option.text,  
                    value: option.value
                }))
                return options
            }
        });

        const option = options?.find(option => {
            if (option) {
                const trimmedText = trimNamePart(option.text as string)
                return trimmedText?.includes(trimNamePart(value as string) as string)
            }
        })

        value = option?.value
    }
    
    await page.select(selector, value as string)
}