import flowsJson from '@/flows/index.json'
import type { Flow } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';

export default defineEventHandler(async (event) => {
    const { targetFlow, flowParams } = await readBody(event)

    const flowArray : Flow[] = flowsJson

    const selectedFlow = flowArray.find(flow => flow.id === targetFlow) as Flow

    if (!selectedFlow) {
        return 'no flow to run'
    }

    return await runFlow(selectedFlow, flowParams)
});