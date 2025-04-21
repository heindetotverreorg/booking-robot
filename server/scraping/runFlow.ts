import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init, close } from './';
import dayjs from 'dayjs';

export const runFlow = async (
    flow : Flow, 
    payload : Record<string, Action>
) => {
    const {
        page,
        browser
    } = await init(flow)

    console.log('-- job executed at', dayjs().format('YYYY-MM-DD HH:mm:ss'));

    const message = await runFlowSteps({
        steps: flow.steps,
        page,
        payload,
        url: flow.url
    })

    await close(browser)

    return message
}
