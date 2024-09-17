import type { Action, Step } from '@/types/flow'
import { StepNames } from '@/types/flow'
import { doAction } from '@/server/scraping/doAction';
import { Page } from 'puppeteer';

export const runFlowSteps = async ({
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
            await runActions({ page, actions, payload, step })
        } catch (e) {
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
        action.value = payload[action.key]?.value
        
        try {
            await doAction(page, { ...action })
        } catch (e) {
            const { error } = await reDoAction({ page, action: { ...action }, payload, step })

            if (error) {
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
        } catch(e) {
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
