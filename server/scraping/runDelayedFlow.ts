import moment from 'moment-timezone';
import type { Moment } from 'moment-timezone';
import { type Flow, type Action, RepeatValues } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';
import { createBookingMoment, createTestBookingMoment } from '@/server/utils/time';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const runDelayedFlow = async (
    flow : Flow, 
    payload : Record<string, Action>,
    bookingThreshold: number
) => {
    const { value : bookingDate } = payload.dateSelect;
    const { value : timeCourtSelect } = payload.timeCourtSelect;
    const [time, court] = timeCourtSelect as string[];

    const jobStartDate : moment.Moment = createBookingMoment(bookingDate as string, bookingThreshold);
    const jobStartTestDate = createTestBookingMoment(bookingDate as string);

    if (job) {
        stopJob()
    }

    scheduleJob({
        bookingDate: jobStartDate,
        testBookingDate: jobStartTestDate, 
        runFlow: async () => {
            if (config.isWeeklyRepeatedFlow) {
                // up the date by a week per time it runs
                const date = payload.dateSelect.value as string
                payload.dateSelect.value = createWeeklyRepeatingPayload(date)
            }

            await runFlow(flow, payload);

            if (!config.isWeeklyRepeatedFlow) {
                stopJob()
            }
        }
    });

    const message = `job will run at ${getJobStartInfo(jobStartDate, jobStartTestDate)} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${getJobStatusInfo(payload.dateSelect.value as string)} : ${time} op baan ${court}`

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = ({
    bookingDate,
    testBookingDate,
    runFlow
} : {
    bookingDate: Moment,
    testBookingDate: Moment,
    runFlow : () => void
}) => {
    const date = config.isTest ? testBookingDate : bookingDate;

    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`

    if (config.isWeeklyRepeatedFlow) {
        console.log('set weekly job with expression: ', createWeeklyRepeatingExpression(date))
        setJob({ set: { callBack: runFlow, expression: createWeeklyRepeatingExpression(date) } });
        return;
    }

    setJob({ set: { callBack: runFlow, expression: cronExpression } });
};

const getJobStartInfo = (jobStartDate : Moment, jobStartTestDate : Moment) => {
    const { isWeeklyRepeatedFlow } = config;

    if (isWeeklyRepeatedFlow) {
        return `every ${weekdays[jobStartDate.weekday()]}: ${jobStartDate.hour()}:${jobStartDate.minute()}`
    }

    return !config.cronTestTime
        ? jobStartDate 
        : jobStartTestDate
}

const getJobStatusInfo = (selectedDateString : string) => {
    const { isWeeklyRepeatedFlow } = config;

    const selectedDate = moment(selectedDateString);

    if (isWeeklyRepeatedFlow) {
        return `Elke ${weekdays[selectedDate.weekday()]}`
    }

    return selectedDate
}

const createWeeklyRepeatingExpression = (date : Moment) => {
    const { repeatValue } = config
    switch (repeatValue) {
        case RepeatValues.DAILY:
            return `${date.minute()} ${date.hour()} * * *`
        case RepeatValues.EVERY_OTHER_DAY:
            return `${date.minute()} ${date.hour()} */2 * *`
        case RepeatValues.WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.weekday()}`
        case RepeatValues.BI_WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.weekday()}/2`
        case RepeatValues.MONTHLY:
            return `${date.minute()} ${date.hour()} ${date.date()} * *`;
        default:
            return `${date.minute()} ${date.hour()} * * ${date.weekday()}`
    }
}

const createWeeklyRepeatingPayload = (date : string) => {
    const { repeatValue } = config
    switch (repeatValue) {
        case RepeatValues.DAILY:
            return moment(date).add(1, 'days').format('YYYY-MM-DD')
        case RepeatValues.EVERY_OTHER_DAY:
            return moment(date).add(2, 'days').format('YYYY-MM-DD')
        case RepeatValues.WEEKLY:
            return moment(date).add(1, 'week').format('YYYY-MM-DD')
        case RepeatValues.BI_WEEKLY:
            return moment(date).add(2, 'week').format('YYYY-MM-DD')
        case RepeatValues.MONTHLY:
            return moment(date).add(1, 'month').format('YYYY-MM-DD')
        default:
            return moment(date).add(1, 'week').format('YYYY-MM-DD')
    }
}