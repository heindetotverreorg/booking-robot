import { Page } from 'puppeteer';
import { trimNamePart } from '@/server/utils/selectors';
import type { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    let {
        replaceValue,
        value,
        selector
    } = action

    // hardcodednfixes
    // if (value === 'Patrick Gieling') {
    //     replaceValue = 'lastInArray'
    // }
    // if (value === 'Ricky de Haan') {
    //     replaceValue = 'selectFromTextInOption'
    // }

    if (replaceValue === 'lastInArray') {
        const options = await page.$eval(selector, (el) => {
            const selectEl = el as HTMLSelectElement
    
            if (selectEl) {
                const options = [...selectEl.options].map(option => ({
                    name: option.text,
                    code: option.value,
                }))
                return options
            }
        });
        const lastOption = options?.slice(-1)[0]
        value = lastOption?.code
    }

    if (replaceValue === 'firstInArray') {
        const options = await page.$eval(selector, (el) => {
            const selectEl = el as HTMLSelectElement
    
            if (selectEl) {
                const options = [...selectEl.options].map(option => ({
                    name: option.text,
                    code: option.value,
                }))
                return options
            }
        });
        const firstOption = options?.[2]
        value = firstOption?.code
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

        const pickedOption = options?.find(option => {
            if (option) {
                const trimmedText = trimNamePart(option.text as string)
                return trimmedText?.includes(trimNamePart(value as string) as string)
            }
        })

        value = pickedOption?.value
    }
    
    await page.select(selector, value as string)
}