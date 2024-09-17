import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export const doAction = async (page: Page, action: Action ) => {
    console.log(action.value)

    if (isDynamicSelector(action)) {
        action.selector = createSelector(action)
    }

    if (action.type === 'click') {
        await doClick(page, action)
    }

    if (action.type === 'select') {
        await doSelect(page, action)
    }

    if (action.type === 'input') {
        await doInput(page, action)
    }

    if (action.waitSelector || action.delay) {
        await doWait(page, action)
    }

    console.log(action.selector)
}