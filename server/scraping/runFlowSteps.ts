import type { Action, Step } from '@/types/flow'
import { StepNames } from '@/types/flow'
import { doAction } from '@/server/scraping/doAction';
import { Page } from 'puppeteer';
import { doDelay } from '../utils/puppeteer';

export const runFlowSteps = async ({
    steps,
    page,
    payload,
    url
} : {
    steps: Step[],
    page: Page,
    payload: Record<string, Action>,
    url: string
}) => {
    let paymentAttempts = 0
    const maxPaymentAttempts = 3

    try {
        await doSteps({ steps, page, payload })

        return 'Flow completed'
    } catch (e : any) {
        console.log(`--- ${e}`)

        if (e.message?.includes('PaymentRequiredError') ) {
            return handlePaymentError(page, steps, payload, url, e, paymentAttempts, maxPaymentAttempts)
        }

        await page.setViewport({ width: 1366, height: 768 })
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await page.screenshot({ path: 'server/screenshots/error.png' })
        return e
    }
}

const doSteps = async ({
    steps,
    page,
    payload
} : {
    steps: Step[],
    page: Page,
    payload: Record<string, Action>
}) => {
    for (const step of steps) {
        if (step.skip) return

        console.log(`Step: ${step.name}`)
        const { actions } = step

        try {
            await runActions({ page, actions, payload, step })
        } catch (e : any) {
            throw e
        }
    }
}

const runActions = async ({
    page,
    actions,
    payload,
    step
} : {
    page : Page,
    actions : Action[],
    payload : Record<string, Action>,
    step : Step
}) => {
    for (const action of actions) {
        // merge action with payload
        action.value = payload[action.key]?.value
        action.hasPossiblePaymentAccount = payload[action.key]?.hasPossiblePaymentAccount
        action.paymentTries = payload[action.key]?.paymentTries
        
        try {
            await doAction(page, { ...action })
        } catch (e : any) {
            if (e.message?.includes('PaymentRequiredError') ) {
                throw e
            }

            const { error } = await reDoAction({ page, action: { ...action }, payload, step })

            if (error) {
                await doDelay(1000)
                throw `Error in step '${step.name}' with action '${JSON.stringify(action)}'. Full error is ${e}`
            }
        }
    }
}

const reDoAction = async ({
    page,
    action,
    payload,
    step,
    index = 0
} : {
    page : Page,
    action : Action,
    payload : Record<string, Action>,
    step : Step,
    index?: number
}) : Promise<{ error : boolean }> => {
    if (step.name === StepNames.selectCourtAndTime) {
        const [time, court] = action.value as (string | number)[]

        const newAction = {
            ...action,
            value: [
                time,
                court as number - (index + 1)
            ]
        }

        const [_, newCourtValue] = newAction.value

        if (!newCourtValue) return { error: true }

        try {
            await doAction(page, { ...newAction })

            return { error: false }
        } catch (e) {
            return reDoAction({
                page,
                action,
                payload,
                step,
                index: index + 1
            })
        }
    }   

    return { error: true };
}

const handlePaymentError = async (page: Page, steps : Step[], payload: Record<string, Action>, url : string, e : any, paymentAttempts : number, maxPaymentAttempts : number) => {
    paymentAttempts++

    if (paymentAttempts >= maxPaymentAttempts) {
        return
    }

    const {
        account
    } = JSON.parse(e.message)

    try {
        const selectCourtAndTimeIndex = steps.findIndex(step => step.name === StepNames.selectCourtAndTime)
        const stepsFromSelectCourt = steps.slice(selectCourtAndTimeIndex, steps.length)
    
        const closeStep = steps.find(step => step.name === StepNames.closePeopleModal)
        if (closeStep) {
            console.log(`Step: ${closeStep.name}`)
            for (const action of closeStep.actions) {
                await doAction(page, action)
            }
        }
    
        const newPayload = updatePayloadWithPayment(payload, account, paymentAttempts)
    
        await runFlowSteps({ steps: stepsFromSelectCourt, page, payload: newPayload, url })
    
        return 'Flow completed'
    } catch(e) {
        throw e
    }
}

const updatePayloadWithPayment = (
    payload: Record<string, Action>,
    account: string,
    paymentAttempts: number
) : Record<string, Action> => {
    const selectedAccountKey = Object.keys(payload).find(key => 
        payload[key].value === account
    );

    if (selectedAccountKey) {
        payload[selectedAccountKey] = {
            ...payload[selectedAccountKey],
            hasPossiblePaymentAccount: true,
            paymentTries: paymentAttempts
        };
    }

    return payload
}