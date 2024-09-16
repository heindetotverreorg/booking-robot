import { createFlow } from '@/flowModel'
import { runFlow } from '@/server/scraping/runFlow';

export default defineEventHandler(async (event) => {
    const { targetFlow, flowParams } = await readBody(event)

    const selectedFlow = createFlow(targetFlow)

    if (!selectedFlow) {
        return 'no flow to run'
    }

    return await runFlow(selectedFlow, flowParams)
});