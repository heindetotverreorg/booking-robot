import type { Flow, Action } from '@/types/flow'
import { runFlowSteps, init, close } from './';
import { runApiMethod } from '@/server/api/book-via-api';
import { config } from '@/server/config';
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

    if (config.isApiMethod) {
        console.log('-- using API method');
        const message = await runApiMethod({ page, payload, url: flow.url })

        await close(browser)
        
        return message
    }

    const message = await runFlowSteps({
        steps: flow.steps,
        page,
        payload,
        url: flow.url
    })

    await close(browser)

    return message
}
