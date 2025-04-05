import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init, close } from '.';
import { StepNames } from '@/types/flow';

import dayjs from 'dayjs';

export const runValidateInput = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const {
        page,
        browser
    } = await init(flow)

    page.setDefaultTimeout(1000)

    const selectPeopleStepIndex = flow.steps.findIndex(step => step.name === StepNames.selectPeople)
    const steps = flow.steps.slice(0, selectPeopleStepIndex + 1)

    const message = await runFlowSteps({
        steps,
        page,
        payload
    })

    await close(browser)

    console.log('-- people select successful at ', dayjs().format('YYYY-MM-DD HH:mm:ss'));

    return message
}