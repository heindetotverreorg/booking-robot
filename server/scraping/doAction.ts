import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'
import { ActionNames, StepNames } from '@/types/flow';
import { config } from '@/server/config'
import { doClick, doDelay, doSelect, doInput, doWait } from '@/server/utils/puppeteer';
import { createSelector, isDynamicSelector, trimNamePart } from '@/server/utils/selectors';

let hasRun = false

export const doAction = async (page: Page, action: Action ) => {
    if (action.value) {
        console.log(`- ${action.value}`)

        action.value = trimNamePart(action.value as string)
    }

    if (action.key === StepNames.confirmBooking && config.isTest) {
        console.log('no booking, is test mode')
        await doDelay(1000)
        return
    }

    if (isDynamicSelector(action)) {
        if (action.waitSelector) {
            action.waitSelector = createSelector({...action, selector: action.waitSelector as string})
        }

        action.selector = createSelector(action)
    }

    if (action.type === ActionNames.click) {
        await doClick(page, action)
    }

    if (action.type === ActionNames.select) {
        await doSelect(page, action)
    }

    if (action.type === ActionNames.input) {
        await doInput(page, action)
    }

    if (action.waitSelector || action.waitSelectorHidden || action.delay) {
        await doWait(page, action)
    }

    // handling any possible dialogs by accepting them
    page.on('dialog', async dialog => {
        try {
            await dialog.accept();
        } catch (e) {}
    });
}