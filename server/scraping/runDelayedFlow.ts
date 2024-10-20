import moment from 'moment-timezone';
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
    const [time, court] = timeCourtSelect as string[];

    const jobStartDate : moment.Moment = createBookingMoment(bookingDate as string, bookingThreshold);
    const jobStartTestDate = createTestBookingMoment(bookingDate as string);

    if (job) {
        stopJob()
    }

    scheduleJob(!config.cronTestTime ? jobStartDate : jobStartTestDate, async () => {
        await runFlow(flow, payload);
        stopJob()
    });

    const message = `job will run at ${!config.cronTestTime ? jobStartDate : jobStartTestDate} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = (date: moment.Moment, runFlow: () => void) => {
    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`
    setJob({ set: { callBack: runFlow, expression: cronExpression } });
};
