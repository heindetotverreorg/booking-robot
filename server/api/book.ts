import { createFlow } from '@/flowModel'
import { runFlow, runDelayedFlow } from '@/server/scraping';
import moment from 'moment-timezone';
import { setConfig } from '@/server/config';

export default defineEventHandler(async (event) => {
    const { targetFlow, flowParams, config } = await readBody(event)

    setConfig(config)

    const selectedFlow = createFlow(targetFlow)
    const isDelayedFlow = isDateOutsideOfBookingThreshold(flowParams.dateSelect, selectedFlow?.bookingThreshold) ||
        config.isTest && config.cronTestTime
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
    
    return await runFlow(selectedFlow, flowParams)
});