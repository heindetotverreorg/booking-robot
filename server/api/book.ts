import { createFlow } from '@/flowModel'
import { runFlow, runDelayedFlow } from '@/server/scraping';
import dayjs from 'dayjs';
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

const isDateOutsideOfBookingThreshold = (dateSelect : { value : string }, bookingThreshold: number = 0) => {
    const now = dayjs()
    const bookingDate = dayjs(dateSelect.value);
    const thresholdDate = now.add(bookingThreshold, 'day');

    return bookingDate.isAfter(thresholdDate)
}

const isBookingInPast = (dateSelect : { value : string }, timeCourtSelect : { value : string }) => {
    const now = dayjs()
    const [time] = timeCourtSelect.value
    const [hours, minutes] = time.split(':')
    const bookingDate = dayjs(dateSelect.value)
        .set('hour', parseInt(hours))
        .set('minute', parseInt(minutes));

    return bookingDate.isBefore(now) || bookingDate.isSame(now)
}