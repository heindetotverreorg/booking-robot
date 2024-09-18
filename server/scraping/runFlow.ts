import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init } from './';

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {


    const { page, browser } = await init(flow)

    const message = await runFlowSteps({ steps: flow.steps, page, payload })

    await browser.close();

    return message
}
