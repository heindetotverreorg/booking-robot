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
    let jobStartDate : moment.Moment;

    console.log('flow started at ', moment());

    jobStartDate = moment(bookingDate)
        .set({ hours: 0, minutes: 0 })
        .subtract(bookingThreshold, 'day');

    const [time, court] = timeCourtSelect as string[];

    if (job) {
        console.log('flow stopped at', moment());
        stopJob()
    }

    if (config.cronTestTime) {
        const [hours, minutes] = config.cronTestTime.split(':')
        jobStartDate = moment(bookingDate).set({ hours: parseInt(hours), minutes: parseInt(minutes) })
    }

    scheduleJob(jobStartDate, async () => {
        console.log('flow executed at', moment());
        await runFlow(flow, payload);
        stopJob()
    });

    const message = `flow will run at ${jobStartDate} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = (date: moment.Moment, runFlow: () => void) => {
    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`
    console.log('cron expression', cronExpression);
    setJob({ set: { callBack: runFlow, expression: cronExpression } });
};
