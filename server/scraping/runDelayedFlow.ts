import moment from 'moment-timezone';
import type { Moment } from 'moment-timezone';
import type { Flow, Action } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';

export const runDelayedFlow = async (
    flow : Flow, 
    payload : Record<string, Action>,
    bookingThreshold: number
) => {
    const { value : bookingDate } = payload.dateSelect;
    const { value : timeCourtSelect } = payload.timeCourtSelect;
    const { value : isRepeating} = payload.isRepeating;
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
            await runFlow(flow, payload);

            if (!config.isWeeklyRepeatedFlow) {
                stopJob()
            }
        }
    });

    const message = `job will run at ${!config.cronTestTime ? jobStartDate : jobStartTestDate} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

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
