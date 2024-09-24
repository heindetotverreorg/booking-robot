import type { Flow } from '@/types/flow'
import flowJson from '@/flowModel/flows.json'

const flows = flowJson as Flow[]

const createFlow = (targetFlow : string) => {
    return flows.find(flow => flow.id === targetFlow)
}

export { createFlow }