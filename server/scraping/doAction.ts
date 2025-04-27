import { Page } from 'puppeteer';
import type { Action } from '@/types/flow'
import { ActionNames, StepNames } from '@/types/flow';
import { config } from '@/server/config'
import { doClick, doDelay, doSelect, doInput, doWait } from '@/server/utils/puppeteer';
import { createSelector, isDynamicSelector, trimNamePart } from '@/server/utils/selectors';
import { ReplaceValues} from '@/constants'

export const doAction = async (page: Page, action: Action ) => {
    if (action.value) {
        console.log(`- ${action.value}`)
        action.value = trimNamePart(action.value as string)
    }

    if (action.hasPossiblePaymentAccount) {
        action.replaceValue = ReplaceValues[action.paymentTries as number]
        console.log('- new replace value', action.replaceValue)
        console.log('--- payment tries: ', action.paymentTries)
        action.hasPossiblePaymentAccount = false
    }

    if (action.key === StepNames.confirmBooking) {
        const paymentAccount = await checkForPayment(page, config.people as string[])

        if (paymentAccount) {
            const newError = {
                message: `Error in step '${action.key}' because payment is required for account: ${paymentAccount}`,
                account: paymentAccount,
                name: 'PaymentRequiredError'
            }
            throw new Error(JSON.stringify(newError))
        }
    }

    if (action.key === StepNames.confirmBooking && config.isTest) {
        console.log('no booking, is test mode')
        await doDelay(10000)
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
            console.log(`Dialog: ${dialog.message()}`)
            await dialog.accept();
        } catch (e) {}
    });
}

const checkForPayment = async (page : Page, people : string[]) => {
    let nonMemberShipAccount
    for (const person of people.values()) {
        const matches = await page.evaluate(async () => {
            const matches = document.querySelectorAll('td [name][value]')

            if (matches) {
                return [...matches].map(match => {
                    const parent = match.parentElement

                    return { match: parent?.innerText.split('\n') }
                })
            }
        }, person)
        if (!Array.isArray(matches)) return 

        nonMemberShipAccount = matches?.find(({ match }) => {
            if (match?.length !== 2) return

            const [person, status] = match

            if (status?.includes('NO MEMBERSHIP')) {
                return person
            }
        })
    }

    return nonMemberShipAccount?.['match']?.[0] || null
}