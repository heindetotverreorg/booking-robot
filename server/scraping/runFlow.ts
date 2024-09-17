import puppeteer, { Page } from 'puppeteer';
import type { Flow, Action, Step } from '@/types/flow'
import { doAction } from '@/server/scraping/doAction';

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(flow.url);

    const message = await runFlowSteps({ steps: flow.steps, page, payload })

    console.log('delay 10 seconds before closing')
    await doDelay(10000)

    await browser.close();

    return message
}

const runFlowSteps = async ({
    steps,
    page,
    payload
} : {
    steps: Step[],
    page: Page,
    payload: Record<string, Action>
}) => {
    try {
        await doSteps({ steps, page, payload })

        return 'Flow completed'
    } catch (e) {
        console.log(e)
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
        console.log(step.name)
        const { actions } = step

        try {
            await doActions({ page, actions, payload, step })
        } catch (e) {
            throw e
        }
    }
}

const doActions = async ({
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
        action.value = payload[action.key]?.value
        try {
            await doAction(page, { ...action })
        } catch (e) {
            const { error } = await reRunAction({ page, action: { ...action }, payload, step })

            if (error) {
                throw `Error in step '${step.name}' with action '${JSON.stringify(action)}'. Full error is ${e}`
            }
        }
    }
}

const reRunAction = async ({
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
    if (step.name === 'select court and time') {
        let [time, court] = action.value as (string | number)[]

        if (court === 0) return { error: true }
          
        const newValue = [
            time,
            court as number - (index + 1)
        ]

        const newAction = {
            ...action,
            value: newValue
        }

        try {
            await doAction(page, { ...newAction })

            return { error: false }
        } catch(e) {
            return reRunAction({
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
