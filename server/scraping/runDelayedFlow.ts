import { type Flow, type Action, RepeatValues } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';
import { createJobStartMoment, createTestJobStartMoment } from '@/server/utils/time';

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const runDelayedFlow = async (
    flow: Flow, 
    payload: Record<string, Action>,
    bookingThreshold: number
) => {
    const { value: bookingDate } = payload.dateSelect;
    const { value: timeCourtSelect } = payload.timeCourtSelect;
    const [time, court] = timeCourtSelect as string[];

    const jobStartDate: Dayjs = !config.isTest 
        ? createJobStartMoment(bookingDate as string, bookingThreshold).tz('Europe/Amsterdam')
        : createTestJobStartMoment().tz('Europe/Amsterdam');

    if (job) {
        stopJob();
    }

    scheduleJob({
        bookingDate: jobStartDate,
        callBack: async () => {
            if (config.isWeeklyRepeatedFlow) {
                const date = payload.dateSelect.value as string;
                payload.dateSelect.value = createWeeklyRepeatingPayload(date);
            }

            await runFlow(flow, payload);

            if (!config.isWeeklyRepeatedFlow) {
                stopJob();
            }
        }
    });

    const message = `Job will run at: ${getJobStartInfo(jobStartDate)}. Job will execute with booking information: ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${getJobStatusInfo(payload.dateSelect.value as string)} : ${time} op baan ${court}`;

    setJobStatus(status);

    return message;
};

const scheduleJob = ({
    bookingDate,
    callBack
} : {
    bookingDate: Dayjs,
    callBack : () => void
}) => {
    const timeZoneOffset = dayjs().tz('Europe/Amsterdam').utcOffset() / 60;
    console.log('timeZoneOffset', timeZoneOffset)
    
    const tzBookingDate = bookingDate.subtract(timeZoneOffset, 'hours');

    const cronExpression = !config.customCronString
        ? `${tzBookingDate.minute()} ${tzBookingDate.hour()} ${tzBookingDate.date()} ${tzBookingDate.month() + 1} *`
        : config.customCronString;
    const recurringCronExpression = createWeeklyRepeatingExpression(tzBookingDate);

    if (config.isWeeklyRepeatedFlow) {
        console.log('-- set recurring job with expression: ', recurringCronExpression)
        setJob({ set: { callBack, expression: recurringCronExpression } });
        return;
    }

    console.log('-- set single job with expression: ', cronExpression)
    setJob({ set: { callBack, expression: cronExpression } });
};

const getJobStartInfo = (jobStartDate : Dayjs) => {
    const { isWeeklyRepeatedFlow } = config;

    if (isWeeklyRepeatedFlow) {
        return `every ${weekdays[jobStartDate.day()]}: ${jobStartDate.hour()}:${jobStartDate.minute()}`
    }

    return jobStartDate 
}

const getJobStatusInfo = (selectedDateString : string) => {
    const { isWeeklyRepeatedFlow } = config;

    const selectedDate = dayjs(selectedDateString);

    if (isWeeklyRepeatedFlow) {
        return `Elke ${weekdays[selectedDate.day()]}`
    }

    return selectedDate
}

const createWeeklyRepeatingExpression = (date : Dayjs) => {
    const { repeatValue } = config
    switch (repeatValue) {
        case RepeatValues.DAILY:
            return `${date.minute()} ${date.hour()} * * *`
        case RepeatValues.EVERY_OTHER_DAY:
            return `${date.minute()} ${date.hour()} */2 * *`
        case RepeatValues.WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.day()}`
        case RepeatValues.BI_WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.day()}/2`
        case RepeatValues.MONTHLY:
            return `${date.minute()} ${date.hour()} ${date.date()} * *`;
        default:
            return `${date.minute()} ${date.hour()} * * ${date.day()}`
    }
}

const createWeeklyRepeatingPayload = (date : string) => {
    const { repeatValue } = config
    switch (repeatValue) {
        case RepeatValues.DAILY:
            return dayjs(date).add(1, 'days').format('YYYY-MM-DD')
        case RepeatValues.EVERY_OTHER_DAY:
            return dayjs(date).add(2, 'days').format('YYYY-MM-DD')
        case RepeatValues.WEEKLY:
            return dayjs(date).add(1, 'week').format('YYYY-MM-DD')
        case RepeatValues.BI_WEEKLY:
            return dayjs(date).add(2, 'week').format('YYYY-MM-DD')
        case RepeatValues.MONTHLY:
            return dayjs(date).add(1, 'month').format('YYYY-MM-DD')
        default:
            return dayjs(date).add(1, 'week').format('YYYY-MM-DD')
    }
}