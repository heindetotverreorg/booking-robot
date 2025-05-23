import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init, close } from './';
import { StepNames } from '@/types/flow';

import dayjs from 'dayjs';

export const runLogin = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const {
        page,
        browser
    } = await init(flow)

    page.setDefaultTimeout(1000)

    const loginStepsOnly = flow.steps.filter(step => step.name === StepNames.login)

    const message = await runFlowSteps({
        steps: loginStepsOnly,
        page,
        payload,
        url: flow.url
    })

    await close(browser)

    console.log('-- login successful at ', dayjs().format('YYYY-MM-DD HH:mm:ss'));

    return message
}
