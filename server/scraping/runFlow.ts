import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init, close } from './';
import moment from 'moment-timezone';

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const {
        page,
        browser
    } = await init(flow)

    console.log('job executed at', moment());

    const message = await runFlowSteps({
        steps: flow.steps,
        page,
        payload
    })

    await close(browser)

    return message
}
