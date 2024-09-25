import { createFlow } from '@/flowModel'
import { runFlow, runDelayedFlow } from '@/server/scraping';
import dayjs from 'dayjs';
import { setConfig } from '@/server/config';

export default defineEventHandler(async (event) => {
    const { targetFlow, flowParams, config } = await readBody(event)
    console.log('incoming config', config)
    setConfig(config)
    const selectedFlow = createFlow(targetFlow)

    if (!selectedFlow) {
        return 'no flow to run'
    }

    if (isDateOutsideOfBookingThreshold(flowParams.dateSelect, selectedFlow.bookingThreshold)) {
        return await runDelayedFlow(selectedFlow, flowParams, selectedFlow.bookingThreshold)
    }
    
    return await runFlow(selectedFlow, flowParams)
});

const isDateOutsideOfBookingThreshold = (dateSelect : { value : string }, bookingThreshold: number = 0) => {
    const now = dayjs()
    const bookingDate = dayjs(dateSelect.value);
    const thresholdDate = now.add(bookingThreshold, 'day');

    return bookingDate.isAfter(thresholdDate)
}