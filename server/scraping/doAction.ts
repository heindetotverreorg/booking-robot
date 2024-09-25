import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'
import { config } from '@/server/config'

export const doAction = async (page: Page, action: Action ) => {
    if (action.value) {
        console.log(`- ${action.value}`)
    }

    if (action.key === 'confirmBooking' && config.isTest) {
        console.log('no booking, is test mode')
        await doDelay(1000)
        return
    }

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
}