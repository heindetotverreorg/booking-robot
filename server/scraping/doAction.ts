import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'

export const doAction = async (page: Page, action: Action, payload: Record<string, Action> ) => {
    console.log(action)
    if (action && payload[action.key]) {
        action.value = payload[action.key].value
    }

    if (action.value && isDynamicSelector(action)) {
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

    if (action.wait) {
        await doWait(page, action)
    }
}