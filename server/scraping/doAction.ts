import { Page } from 'puppeteer';
import { Action } from '@/types/flow'
import { doInput, doClick, doSelect, doWait } from '@/server/scraping/utils';
import { isDynamicSelector, createSelector } from '@/utils';

export const doAction = async (page: Page, action: Action, payload: Record<string, Action> ) => {
    console.log(action.key)
    if (action && payload[action.key]) {
        action.value = payload[action.key].value
    }

    if (isDynamicSelector(action)) {
        action.selector = createSelector(action)

        return
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