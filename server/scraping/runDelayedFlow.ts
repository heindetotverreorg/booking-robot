import moment from 'moment-timezone';
import type { Moment } from 'moment-timezone';
import type { Flow, Action } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let iteration = 0;

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
                iteration++
                const interval = 7 * iteration
                payload.dateSelect.value = moment(date).add(interval, 'days').format('YYYY-MM-DD')
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
    const weeklyRepeatingExpression = `${date.minute()} ${date.hour()} * * ${date.weekday()}`

    if (config.isWeeklyRepeatedFlow) {
        console.log('set weekly job with expression: ', weeklyRepeatingExpression)
        setJob({ set: { callBack: runFlow, expression: weeklyRepeatingExpression } });
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