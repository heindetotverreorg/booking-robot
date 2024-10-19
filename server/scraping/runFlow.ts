import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init, close } from './';
import { stopJob } from '@/server/cron/job.js'

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const {
        page,
        browser
    } = await init(flow)

    const message = await runFlowSteps({
        steps: flow.steps,
        page,
        payload
    })

    await close(browser)

    stopJob()

    return message
}
