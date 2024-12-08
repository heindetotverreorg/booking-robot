import { createFlow } from '@/flowModel'
import { runFlow, runDelayedFlow } from '@/server/scraping';
import { setConfig } from '@/server/config';
import { isDateOutsideOfBookingThreshold, isBookingInPast } from '@/server/utils/time';

export default defineEventHandler(async (event) => {
    const { targetFlow, flowParams, config } = await readBody(event)

    setConfig(config)

    const selectedFlow = createFlow(targetFlow)
    const isDelayedFlow = isDateOutsideOfBookingThreshold(flowParams.dateSelect, selectedFlow?.bookingThreshold)
        || (config.isTest && config.cronTestTime)
    const isInPast = isBookingInPast(flowParams.dateSelect, flowParams.timeCourtSelect)

    if (isInPast) {
        return 'booking date is in the past'
    }

    if (!selectedFlow) {
        return 'no flow to run'
    }

    if (isDelayedFlow) {
        return await runDelayedFlow(selectedFlow, flowParams, selectedFlow.bookingThreshold)
    }
    
    console.log('ERRORLOG: START OF FLOW')

    return await runFlow(selectedFlow, flowParams)
});