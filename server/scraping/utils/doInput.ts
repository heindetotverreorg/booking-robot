import { Page } from 'puppeteer';
import { Action } from '@/types/flow'

export default async (page: Page, action: Action) => {
    const {
        value,
        selector
    } = action

    await page.$eval(selector, (el, value) => {
        el.value = value

        return el.value
    }, value);
}