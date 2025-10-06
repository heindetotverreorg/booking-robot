import { createFlow } from '@/flowModel'
import { runFlow, runDelayedFlow } from '@/server/scraping';
import { setConfig } from '@/server/config';
import { isDateOutsideOfBookingThreshold, isBookingInPast } from '@/server/utils/time';

export default defineEventHandler(async (event) => {
    const { targetFlow, flowParams, config } = await readBody(event)

    config.people = [flowParams.personOne, flowParams.personTwo, flowParams.personThree].map((person) => person.value)
    setConfig(config)

    const selectedFlow = createFlow(targetFlow)
    const isDelayedFlow = isDateOutsideOfBookingThreshold(flowParams.dateSelect, flowParams.timeCourtSelect, selectedFlow?.bookingThreshold)
        || config.customCronString
        || config.cronTestTime
        
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

    return await runFlow(selectedFlow, flowParams);
});